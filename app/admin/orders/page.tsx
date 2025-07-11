// app/admin/orders/page.tsx
'use client';
import { useState, useEffect } from 'react';
import { Search, Filter, ChevronDown, ChevronUp, Loader2, AlertCircle, CheckCircle, XCircle, Truck, Package, RefreshCw, CreditCard, RotateCw } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useMediaQuery } from 'react-responsive';
import axios from 'axios';
import toast from 'react-hot-toast';

type OrderStatus = 'Confirmed' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned' | 'Return Requested';
type PaymentStatus = 'Paid' | 'Refunded' | 'Failed';
type ReturnStatus = 'Pending' | 'Approved' | 'Rejected';

interface OrderItem {
  productId: string;
  name: string;
  quantity: number;
  price: number;
  image: string[];
  returnRequested?: boolean;
  returnQuantity?: number;
  returnedQuantity?: number;
  remainingQuantity?: number;
  returnReason?: string;
  returnStatus?: ReturnStatus;
  originalPrice?: number;
  returnDetails?: string;
}

interface ShippingAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface Customer {
  name: string;
  email: string;
  phone: string;
}

interface IOrder {
  _id: string;
  orderId: string;
  userId: string;
  customer: Customer;
  items: OrderItem[];
  totalAmount: number;
  shippingCost: number;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  shippingAddress: ShippingAddress;
  trackingId?: string;
  shippedAt?: Date;
  deliveredAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  returnWindowEnd?: Date;
}

export default function AdminOrdersPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [orders, setOrders] = useState<IOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [trackingId, setTrackingId] = useState('');
  const [hasSentMessage, setHasSentMessage] = useState(false);
  const [returnApprovals, setReturnApprovals] = useState<Record<string, Record<string, number>>>({});
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  // Fetch orders from your API route
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/orders', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch orders');
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unknown error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  const refreshOrders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/orders', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }

      const data = await response.json();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const isReturnWindowEnded = (order: IOrder) => {
    const returnWindowEnd = order.returnWindowEnd || 
      new Date(new Date(order.deliveredAt || order.createdAt).getTime() + 48 * 60 * 60 * 1000);
    return new Date() > new Date(returnWindowEnd);
  };

  // Filter and sort orders
  const filteredOrders = orders
    .filter(order => {
      const matchesSearch = 
        order.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customer.phone.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      return dateSort === 'asc' 
        ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  const handleHandOverClick = (order: IOrder) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const handleMarkAsShipped = async () => {
    if (!selectedOrder) return;
    if (!trackingId || !hasSentMessage) {
      toast.error('Please enter tracking ID and confirm you sent the message');
      return;
    }
    
    try {
      setIsUpdating(prev => ({ ...prev, [selectedOrder._id]: true }));
      
      await axios.put(`/api/orders/${selectedOrder.orderId}/ship`, {
        trackingNumber: trackingId,
        status: 'Shipped'
      });
      
      toast.success('Order marked as shipped');
      await refreshOrders();
      setIsModalOpen(false);
      setTrackingId('');
      setHasSentMessage(false);
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Failed to update order status:', error);
    } finally {
      setIsUpdating(prev => ({ ...prev, [selectedOrder._id]: false }));
    }
  };

  const handleMarkAsDelivered = async (orderId: string) => {
    try {
      setIsUpdating(prev => ({ ...prev, [orderId]: true }));
      await axios.put(`/api/orders/${orderId}/deliver`, {
        status: 'Delivered'
      });
      toast.success('Order marked as delivered');
      await refreshOrders();
    } catch (error) {
      toast.error('Failed to update order status');
      console.error('Error updating order status:', error);
    } finally {
      setIsUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleProcessReturns = async (orderId: string) => {
    try {
      setIsUpdating(prev => ({ ...prev, [orderId]: true }));
      
      // Get the approval quantities for this order
      const approvals = returnApprovals[orderId] || {};
      
      // Prepare the items to update
      const itemsToUpdate = Object.entries(approvals).map(([productId, approvedQty]) => ({
        productId,
        approvedQty,
        action: approvedQty > 0 ? 'approve' : 'reject'
      }));

      const response = await fetch(`/api/orders/${orderId}/process-returns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: itemsToUpdate }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to process returns');
      }

      const { order: updatedOrder } = await response.json();
      setOrders(orders.map(order => 
        order._id === updatedOrder._id ? updatedOrder : order
      ));
      
      // Clear the approvals for this order
      setReturnApprovals(prev => {
        const newState = {...prev};
        delete newState[orderId];
        return newState;
      });

      toast.success('Return processed successfully');
    } catch (error) {
      toast.error('Failed to process return');
      console.error('Error processing return:', error);
    } finally {
      setIsUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleRejectReturn = async (orderId: string) => {
    try {
      setIsUpdating(prev => ({ ...prev, [orderId]: true }));
      
      // Get all return requested items for this order
      const order = orders.find(o => o._id === orderId);
      if (!order) return;

      const itemsToUpdate = order.items
        .filter(item => item.returnRequested && item.returnStatus === 'Pending')
        .map(item => ({
          productId: item.productId,
          action: 'reject'
        }));

      const response = await fetch(`/api/orders/${orderId}/process-returns`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items: itemsToUpdate }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject return');
      }

      const { order: updatedOrder } = await response.json();
      setOrders(orders.map(order => 
        order._id === updatedOrder._id ? updatedOrder : order
      ));
      
      toast.success('Return rejected successfully');
    } catch (error) {
      toast.error('Failed to reject return');
      console.error('Error rejecting return:', error);
    } finally {
      setIsUpdating(prev => ({ ...prev, [orderId]: false }));
    }
  };

  const handleUpdateApprovalQty = (orderId: string, productId: string, qty: number) => {
    setReturnApprovals(prev => {
      const orderApprovals = prev[orderId] || {};
      return {
        ...prev,
        [orderId]: {
          ...orderApprovals,
          [productId]: qty
        }
      };
    });
  };

  const getStatusConfig = (status: OrderStatus) => {
    switch (status) {
      case 'Confirmed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle size={16} className="mr-1" />,
          message: 'Confirmed'
        };
      case 'Shipped':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <Truck size={16} className="mr-1" />,
          message: 'Shipped'
        };
      case 'Delivered':
        return {
          color: 'bg-purple-100 text-purple-800',
          icon: <Package size={16} className="mr-1" />,
          message: 'Delivered'
        };
      case 'Cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle size={16} className="mr-1" />,
          message: 'Cancelled'
        };
      case 'Return Requested':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <RefreshCw size={16} className="mr-1" />,
          message: 'Return Requested'
        };
      case 'Returned':
        return {
          color: 'bg-indigo-100 text-indigo-800',
          icon: <RefreshCw size={16} className="mr-1" />,
          message: 'Returned'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: null,
          message: status
        };
    }
  };

  const getPaymentStatusConfig = (status: PaymentStatus) => {
    switch (status) {
      case 'Paid':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle size={16} className="mr-1" />,
          message: 'Paid'
        };
      case 'Refunded':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <RefreshCw size={16} className="mr-1" />,
          message: 'Refunded'
        };
      case 'Failed':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle size={16} className="mr-1" />,
          message: 'Failed'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: null,
          message: status
        };
    }
  };

  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2
    }).format(amount);
  };

  const toggleExpand = (orderId: string) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  const generatedMessage = selectedOrder 
    ? `Hi ${selectedOrder.customer.name}, your order #${selectedOrder.orderId} has been shipped. Tracking ID: ${trackingId || '[TRACKING_ID]'}. You can track your package at https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx.`
    : '';

  if (loading && orders.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <Loader2 className="h-12 w-12 text-gray-800" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col justify-center items-center min-h-screen p-4"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 0.5 }}
        >
          <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        </motion.div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading orders</h3>
        <p className="text-gray-600 mb-4 text-center">{error}</p>
        <motion.button 
          onClick={refreshOrders}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.98 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4 }}
          className="mb-8"
        >
          <h1 className="text-2xl font-bold text-gray-900">Orders Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all customer orders and their status
          </p>
        </motion.div>

        {/* Filters and Search */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4"
        >
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search orders..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </motion.div>

          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="relative"
          >
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full appearance-none focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="Confirmed">Confirmed</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Return Requested">Return Requested</option>
              <option value="Returned">Returned</option>
            </select>
          </motion.div>

          <motion.button
            onClick={() => setDateSort(dateSort === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="mr-2">Sort by Date</span>
            {dateSort === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </motion.button>
        </motion.div>

        {/* Orders List */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white shadow overflow-hidden sm:rounded-lg"
        >
          {filteredOrders.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <p className="text-gray-500">No orders found matching your criteria</p>
            </motion.div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredOrders.map((order) => {
                const statusConfig = getStatusConfig(order.status);
                const paymentStatusConfig = getPaymentStatusConfig(order.paymentStatus);
                const isExpanded = expandedOrder === order._id;
                const hasPendingReturns = order.items.some(
                  item => item.returnRequested && item.returnStatus === 'Pending'
                );
                const hasApprovedReturns = order.items.some(
                  item => item.returnRequested && item.returnStatus === 'Approved'
                );
                const returnWindowEnded = isReturnWindowEnded(order);

                return (
                  <motion.li 
                    key={order._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <motion.div 
                      className="px-4 py-4 sm:px-6"
                      whileHover={{ backgroundColor: 'rgba(249, 250, 251, 1)' }}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center flex-wrap gap-2">
                          <p className="text-sm font-medium text-gray-900">
                            #{order.orderId}
                          </p>
                          <p className="text-sm text-gray-600">
                            {order.customer.name}
                          </p>
                          <motion.span 
                            className={`px-2 py-1 text-xs rounded-full flex items-center ${statusConfig.color}`}
                            whileHover={{ scale: 1.05 }}
                          >
                            {statusConfig.icon}
                            <span className="ml-1">{statusConfig.message}</span>
                          </motion.span>
                          <motion.span 
                            className={`px-2 py-1 text-xs rounded-full flex items-center ${paymentStatusConfig.color}`}
                            whileHover={{ scale: 1.05 }}
                          >
                            <CreditCard size={16} className="mr-1" />
                            <span className="ml-1">{paymentStatusConfig.message}</span>
                          </motion.span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <p className="text-sm text-gray-500 hidden sm:block">
                            {formatDate(order.createdAt)}
                          </p>
                          <p className="text-sm font-medium">
                            {formatCurrency(order.totalAmount)}
                          </p>
                          {order.status === 'Confirmed' && (
                            <button
                              onClick={() => handleHandOverClick(order)}
                              className="text-indigo-600 hover:text-indigo-900 mr-4"
                            >
                              Hand Over
                            </button>
                          )}
                          {order.status === 'Shipped' && (
                            <button 
                              onClick={() => handleMarkAsDelivered(order.orderId)}
                              className="text-green-600 hover:text-green-900"
                            >
                              Mark Delivered
                            </button>
                          )}
                          <motion.button
                            onClick={() => toggleExpand(order._id)}
                            className="text-gray-400 hover:text-gray-500"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </motion.button>
                        </div>
                      </div>

                      {isMobile && (
                        <div className="mt-2 flex flex-wrap gap-2 items-center">
                          <p className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                          </p>
                          <p className="text-sm font-medium">
                            {formatCurrency(order.totalAmount)}
                          </p>
                        </div>
                      )}

                      <AnimatePresence>
                        {isExpanded && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.3 }}
                            className="overflow-hidden"
                          >
                            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                              {/* Order Details */}
                              <motion.div
                                whileHover={{ scale: 1.01 }}
                              >
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
                                <div className="space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium">Order ID:</span> {order.orderId}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Date:</span> {formatDate(order.createdAt)}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Items:</span> {order.items.length}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Shipping Cost:</span> {formatCurrency(order.shippingCost)}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Total Amount:</span> {formatCurrency(order.totalAmount)}
                                  </p>
                                  {order.trackingId && (
                                    <p className="text-sm">
                                      <span className="font-medium">Tracking ID:</span> {order.trackingId}
                                    </p>
                                  )}
                                  {order.shippedAt && (
                                    <p className="text-sm">
                                      <span className="font-medium">Shipped At:</span> {formatDate(order.shippedAt)}
                                    </p>
                                  )}
                                  {order.deliveredAt && (
                                    <p className="text-sm">
                                      <span className="font-medium">Delivered At:</span> {formatDate(order.deliveredAt)}
                                    </p>
                                  )}
                                  {order.returnWindowEnd && (
                                    <p className="text-sm">
                                      <span className="font-medium">Return Window {returnWindowEnded ? 'Ended' : 'Ends'}:</span> {formatDate(order.returnWindowEnd)}
                                    </p>
                                  )}
                                </div>
                              </motion.div>

                              {/* Customer Details */}
                              <motion.div
                                whileHover={{ scale: 1.01 }}
                              >
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Details</h3>
                                <div className="space-y-2">
                                  <p className="text-sm">
                                    <span className="font-medium">Name:</span> {order.customer.name}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Email:</span> {order.customer.email}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Phone:</span> {order.customer.phone}
                                  </p>
                                  <p className="text-sm">
                                    <span className="font-medium">Address:</span> {order.shippingAddress.address}, {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                                  </p>
                                </div>
                              </motion.div>

                              {/* Order Items */}
                              <motion.div
                                whileHover={{ scale: 1.01 }}
                              >
                                <h3 className="text-sm font-medium text-gray-500 mb-2">Order Items</h3>
                                <div className="space-y-4">
                                  {order.items.map((item, index) => (
                                    <div key={index} className="flex items-start space-x-3">
                                      {item.image.length > 0 && (
                                        <img 
                                          src={item.image[0]} 
                                          alt={item.name}
                                          className="h-10 w-10 rounded object-cover"
                                        />
                                      )}
                                      <div className="flex-1">
                                        <p className="text-sm font-medium">{item.name}</p>
                                        <p className="text-xs text-gray-500">
                                          {formatCurrency(item.price)} × {item.quantity} = {formatCurrency(item.price * item.quantity)}
                                        </p>
                                        {item.returnRequested && (
                                          <div className="text-xs mt-1 space-y-1">
                                            <p className={`${
                                              item.returnStatus === 'Approved' ? 'text-green-600' :
                                              item.returnStatus === 'Rejected' ? 'text-red-600' : 'text-yellow-600'
                                            }`}>
                                              {item.returnStatus === 'Approved' ? (
                                                `Returned ${item.returnedQuantity || 0} of ${item.quantity} `
                                              ) : item.returnStatus === 'Rejected' ? (
                                                `Return rejected for ${item.returnQuantity || 0} items`
                                              ) : (
                                                `Return requested for ${item.returnQuantity || 0} of ${item.quantity}`
                                              )}
                                            </p>
                                            {item.returnReason && (
                                              <p className="text-gray-600">Reason: {item.returnReason}</p>
                                            )}
                                            {item.returnDetails && (
                                              <p className="text-gray-600">Details: {item.returnDetails}</p>
                                            )}
                                            {item.returnStatus === 'Pending' && (
                                              <div className="mt-1 flex items-center space-x-2">
                                                <input
                                                  type="number"
                                                  min="0"
                                                  max={item.returnQuantity || item.quantity}
                                                  value={returnApprovals[order._id]?.[item.productId] || 0}
                                                  onChange={(e) => handleUpdateApprovalQty(
                                                    order._id, 
                                                    item.productId, 
                                                    Math.min(
                                                      Number(e.target.value), 
                                                      item.returnQuantity || item.quantity
                                                    )
                                                  )}
                                                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm"
                                                  placeholder="Qty"
                                                />
                                                <span className="text-xs text-gray-500">
                                                  / {item.returnQuantity || item.quantity}
                                                </span>
                                              </div>
                                            )}
                                          </div>
                                        )}
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </motion.div>
                            </div>

                            {/* Return Actions */}
                            {order.status === 'Return Requested' && hasPendingReturns && (
                              <div className="mt-4 flex flex-col gap-3">
                                <div className="flex gap-3">
                                  <button
                                    onClick={() => handleProcessReturns(order._id)}
                                    disabled={
                                      isUpdating[order._id] ||
                                      !returnWindowEnded ||
                                      !Object.keys(returnApprovals[order._id] || {}).length ||
                                      Object.values(returnApprovals[order._id] || {}).every(qty => qty <= 0)
                                    }
                                    className={`px-3 py-1 rounded text-sm ${
                                      isUpdating[order._id] ||
                                      !returnWindowEnded ||
                                      !Object.keys(returnApprovals[order._id] || {}).length ||
                                      Object.values(returnApprovals[order._id] || {}).every(qty => qty <= 0)
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        : 'bg-green-500 text-white hover:bg-green-600'
                                    }`}
                                  >
                                    {isUpdating[order._id] ? 'Processing...' : 'Process Returns'}
                                  </button>
                                  <button
                                    onClick={() => handleRejectReturn(order._id)}
                                    className={`px-3 py-1 rounded text-sm ${
                                      isUpdating[order._id] || !returnWindowEnded
                                        ? 'bg-gray-300 text-gray-600 cursor-not-allowed'
                                        : 'bg-red-500 text-white hover:bg-red-600'
                                    }`}
                                    disabled={isUpdating[order._id] || !returnWindowEnded}
                                  >
                                    {isUpdating[order._id] ? 'Processing...' : 'Reject All Returns'}
                                  </button>
                                </div>
                                {!returnWindowEnded && (
                                  <div className="text-xs text-yellow-600">
                                    Returns can only be processed after the return window ends
                                  </div>
                                )}
                              </div>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  </motion.li>
                );
              })}
            </ul>
          )}
        </motion.div>
      </div>

      {/* Hand Over to Post Office Modal */}
      {isModalOpen && selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h2 className="text-xl font-bold">Hand Over to Post Office</h2>
                <button 
                  onClick={() => {
                    setIsModalOpen(false);
                    setTrackingId('');
                    setHasSentMessage(false);
                  }}
                  className="text-gray-500 hover:text-gray-700"
                  disabled={isUpdating[selectedOrder._id]}
                >
                  &times;
                </button>
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Order Details</h3>
                <p>Order ID: #{selectedOrder.orderId}</p>
                <p>Customer: {selectedOrder.customer.name}</p>
                <p>Items: {selectedOrder.items.length}</p>
                <p>Total: {formatCurrency(selectedOrder.totalAmount)}</p>
              </div>

              <div className="mb-6">
                <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking ID *
                </label>
                <input
                  type="text"
                  id="trackingId"
                  value={trackingId}
                  onChange={(e) => setTrackingId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                  disabled={isUpdating[selectedOrder._id]}
                />
              </div>

              <div className="mb-6">
                <h3 className="font-medium mb-2">Customer Notification</h3>
                <p className="text-sm text-gray-600 mb-2">
                  Copy this message to send via WhatsApp/SMS:
                </p>
                <div className="bg-gray-100 p-4 rounded-md mb-4">
                  <pre className="whitespace-pre-wrap text-sm overflow-hidden">{generatedMessage}</pre>
                </div>
                <div className="flex space-x-3">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedMessage);
                      toast.success('Message copied to clipboard!');
                    }}
                    className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
                    disabled={isUpdating[selectedOrder._id]}
                  >
                    Copy Message
                  </button>
                  <a
                    href={`https://wa.me/91${selectedOrder.customer.phone}?text=${encodeURIComponent(generatedMessage)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                    onClick={(e) => {
                      if (!trackingId) {
                        e.preventDefault();
                        toast.error('Please enter tracking ID first');
                      }
                    }}
                  >
                    Open WhatsApp
                  </a>
                  <a
                    href={`sms:${selectedOrder.customer.phone}?body=${encodeURIComponent(generatedMessage)}`}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                    onClick={(e) => {
                      if (!trackingId) {
                        e.preventDefault();
                        toast.error('Please enter tracking ID first');
                      }
                    }}
                  >
                    Open SMS
                  </a>
                </div>
              </div>

              <div className="mb-6">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={hasSentMessage}
                    onChange={(e) => setHasSentMessage(e.target.checked)}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                    disabled={isUpdating[selectedOrder._id]}
                  />
                  <span className="ml-2 text-sm text-gray-700">
                    I have sent the tracking ID manually to the customer
                  </span>
                </label>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => {
                    setIsModalOpen(false);
                    setTrackingId('');
                    setHasSentMessage(false);
                  }}
                  disabled={isUpdating[selectedOrder._id]}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleMarkAsShipped}
                  disabled={!trackingId || !hasSentMessage || isUpdating[selectedOrder._id]}
                  className={`px-4 py-2 rounded-md text-white ${
                    !trackingId || !hasSentMessage || isUpdating[selectedOrder._id]
                      ? 'bg-indigo-300 cursor-not-allowed'
                      : 'bg-indigo-600 hover:bg-indigo-700'
                  }`}
                >
                  {isUpdating[selectedOrder._id] ? 'Processing...' : 'Mark as Shipped'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}