//my-orders/page.tsx
'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Package, ChevronDown, Search, Filter, Copy, Truck, Clock, RefreshCw, X, Check, Loader2 } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { IOrder, OrderStatus, ReturnStatus } from '@/models/Order';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';

interface ReturnItem {
  productId: string;
  quantity: number;
  reason: string;
  reasonDetails?: string;
  name: string;
  image: string[];
  maxQuantity: number;
  canReturn: boolean;
  previousReturnStatus?: ReturnStatus;
}

const MyOrdersPage = () => {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [allOrders, setAllOrders] = useState<IOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  
  // Return modal state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<IOrder | null>(null);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const iconRef = useRef(null);
  const isInView = useInView(iconRef, { once: true });
  const [spin, setSpin] = useState(false);

  useEffect(() => {
      setSpin(true);
      const timer = setTimeout(() => setSpin(false), 1500);
      return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      try {
        setOrdersLoading(true);
        const response = await fetch(`/api/orders?userId=${user.id}`);
        if (!response.ok) throw new Error('Failed to fetch orders');
        
        const data = await response.json();
        setAllOrders(data);
        setFilteredOrders(data);
      } catch (error) {
        console.error('Error fetching orders:', error);
        toast.error('Failed to load orders');
      } finally {
        setOrdersLoading(false);
      }
    };
    fetchOrders();
  }, [user]);

  useEffect(() => {
    let result = [...allOrders];
    
    if (filterStatus !== 'all') {
      result = result.filter(order => order.status === filterStatus);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.orderId.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }
    
    result.sort((a, b) => {
      if (sortBy === 'date') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      } else if (sortBy === 'total') {
        return b.totalAmount - a.totalAmount;
      } else if (sortBy === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });
    
    setFilteredOrders(result);
  }, [allOrders, searchQuery, filterStatus, sortBy]);

  const copyToClipboard = (trackingId: string) => {
    navigator.clipboard.writeText(trackingId);
    toast.success('Tracking ID copied to clipboard!');
  };

  const redirectToPostOfficeTracking = (trackingId: string) => {
    window.open(`https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx`, '_blank');
  };

  const isWithinReturnWindow = (order: IOrder) => {
    if (order.status !== 'Delivered' && order.status !== 'Return Requested') return false;
    const returnWindowEnd = order.returnWindowEnd || 
      new Date(new Date(order.deliveredAt || order.createdAt).getTime() + 48 * 60 * 60 * 1000);
    return new Date() < new Date(returnWindowEnd);
  };

  const canReturnMoreItems = (order: IOrder) => {
    if (!isWithinReturnWindow(order)) return false;
    
    return order.items.some(item => {
      const remainingQuantity = item.quantity - (item.returnQuantity || 0);
      return (
        (!item.returnRequested || 
         item.returnStatus === 'Rejected' || 
         (item.returnStatus === 'Approved' && remainingQuantity > 0)) &&
        remainingQuantity > 0
      );
    });
  };

  const openReturnModal = (order: IOrder) => {
    setSelectedOrder(order);
    setReturnItems(order.items.map(item => {
      const remainingQuantity = item.remainingQuantity !== undefined ?
        item.remainingQuantity : 
        item.quantity - (item.returnedQuantity || 0);
      
      const canReturn = remainingQuantity > 0 && 
        (!item.returnRequested || item.returnStatus === 'Rejected');

      const initialQuantity = canReturn ? (item.returnRequested ? 0 : remainingQuantity) : 0;
      
      return {
        productId: item.productId,
        quantity: canReturn ? remainingQuantity : 0,
        reason: '',
        reasonDetails: '',
        name: item.name,
        image: item.image,
        maxQuantity: remainingQuantity,
        canReturn,
        previousReturnStatus: item.returnStatus
      };
    }));
    setShowReturnModal(true);
  };

  const closeReturnModal = () => {
    setShowReturnModal(false);
    setSelectedOrder(null);
    setReturnItems([]);
  };

  const updateReturnItem = (index: number, field: string, value: any) => {
    const updatedItems = [...returnItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };
    setReturnItems(updatedItems);
  };

  const handleReturnRequest = async () => {
    if (!selectedOrder) return;
    setIsSubmittingReturn(true);
    
    try {
      const itemsToReturn = returnItems.filter(item => 
        item.reason.trim() !== '' && item.quantity > 0 && item.canReturn
      );
      
      if (itemsToReturn.length === 0) {
        toast.error('Please select at least one item to return and specify a reason');
        return;
      }

      const response = await fetch(`/api/orders/${selectedOrder.orderId}/return`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          items: itemsToReturn.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            reason: item.reason,
            reasonDetails: item.reasonDetails
          }))
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to submit return request');
      }

      const updatedOrder = await response.json();
      setAllOrders(allOrders.map(order => 
        order.orderId === selectedOrder.orderId ? updatedOrder : order
      ));
      toast.success('Return request submitted successfully!');
      closeReturnModal();
    } catch (error: any) {
      console.error('Error submitting return request:', error);
      toast.error(error.message || 'Failed to submit return request');
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  const getStatusIcon = (status: string, spin = false) => {
    switch (status) {
      case 'Delivered':
        return <Check className="text-green-500" size={20} />;
      case 'Shipped':
        return <Truck className="text-blue-500" size={20} />;
      case 'Confirmed':
        return <Clock className="text-yellow-500" size={20} />;
      case 'Cancelled':
        return <X className="text-red-500" size={20} />;
      case 'Return Requested':
        return <RefreshCw className={`text-purple-500 ${spin ? 'animate-spin' : ''}`} size={20} />;
      case 'Returned':
        return <RefreshCw className="text-indigo-500" size={20} />;
      default:
        return <Loader2 className={`text-gray-500 ${spin ? 'animate-spin' : ''}`} size={20} />;
    }
  };

  const getReturnStatusText = (item: any) => {
    if (!item.returnRequested) return null;
    
    const returnedQty = item.returnedQuantity || 0;
    const requestedQty = item.returnQuantity || 0;
    const totalQty = item.quantity;
    const remainingQty = totalQty - returnedQty;

    let statusText = '';
    if (item.returnStatus === 'Approved') {
      statusText = `Returned ${returnedQty} of ${totalQty}`;
      // if (remainingQty > 0) {
      //   statusText += ` (${remainingQty} remaining)`;
      // }
    } else if (item.returnStatus === 'Rejected') {
      statusText = `Return rejected for ${requestedQty} items`;
      // if (remainingQty > 0) {
      //   statusText += ` (${remainingQty} can still be returned)`;
      // }
    } else if (item.returnStatus === 'Pending') {
      statusText = `Return pending for ${requestedQty} items`;
    }

    return (
      <div className="mt-1 text-xs">
        {item.returnStatus === 'Approved' ? (
          <span className="text-green-600">{statusText}</span>
        ) : item.returnStatus === 'Rejected' ? (
          <span className="text-red-600">{statusText}</span>
        ) : (
          <span className="text-yellow-600">{statusText}</span>
        )}
        {item.returnReason && (
          <div className="text-gray-600">Reason: {item.returnReason}</div>
        )}
        {item.returnDetails && (
          <div className="text-gray-600">Details: {item.returnDetails}</div>
        )}
      </div>
    );
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen py-4 md:py-8">
        <div className="container mx-auto px-3 md:px-4">
          <h1 className="text-xl md:text-2xl font-bold text-gray-800 mb-4 md:mb-6">Order History</h1>

          {/* Filters and Search */}
          <div className="bg-white rounded-lg shadow-sm p-3 md:p-4 mb-4 md:mb-6">
            <div className="flex flex-col gap-3 md:flex-row md:gap-4">
              <div className="relative flex-1">
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  className="pl-9 pr-3 py-2 text-sm md:text-base border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-brown-500"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <div className="flex gap-2 md:gap-4">
                <select 
                  className="text-sm md:text-base border border-gray-300 rounded-md px-2 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brown-500 flex-1"
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                >
                  <option value="all">All</option>
                  <option value="Confirmed">Confirmed</option>
                  <option value="Processing">Processing</option>
                  <option value="Shipped">Shipped</option>
                  <option value="Delivered">Delivered</option>
                  <option value="Cancelled">Cancelled</option>
                  <option value="Return Requested">Return Requested</option>
                  <option value="Returned">Returned</option>
                </select>
                
                <select 
                  className="text-sm md:text-base border border-gray-300 rounded-md px-2 md:px-4 py-2 focus:outline-none focus:ring-2 focus:ring-brown-500 flex-1"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="date">Date</option>
                  <option value="total">Total</option>
                  <option value="status">Status</option>
                </select>
              </div>
            </div>
          </div>

          {/* Orders List */}
          {loading || ordersLoading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-500"></div>
            </div>
          ) : (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-4 md:space-y-6"
            >
              {filteredOrders.length > 0 ? (
                filteredOrders.map(order => (
                  <motion.div 
                    key={order.orderId}
                    variants={itemVariants}
                    className="bg-white rounded-lg shadow-sm overflow-hidden"
                  >
                    {/* Order Header */}
                    <div className="p-3 md:p-4 border-b border-gray-200">
                      <div className="grid grid-cols-2 gap-2 md:flex md:flex-wrap md:justify-between md:items-center">
                        <div className="col-span-2">
                          <span className="text-xs md:text-sm text-gray-500">Order ID:</span>
                          <span className="ml-1 md:ml-2 font-medium text-sm md:text-base">{order.orderId}</span>
                        </div>
                        <div>
                          <span className="text-xs md:text-sm text-gray-500">Date:</span>
                          <span className="ml-1 md:ml-2 text-sm md:text-base">{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div>
                          <span className="text-xs md:text-sm text-gray-500">Total:</span>
                          <span className="ml-1 md:ml-2 font-medium text-sm md:text-base">₹{order.totalAmount.toFixed(2)}</span>
                        </div>
                        <div className="mt-2 md:mt-0 flex items-center gap-2">
                          <span ref={iconRef}>
                            {getStatusIcon(order.status,spin)}
                          </span>
                          <span className={`px-2 py-1 text-xs md:text-sm rounded-full font-medium ${
                            order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
                            order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'Confirmed' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
                            order.status === 'Return Requested' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'Returned' ? 'bg-indigo-100 text-indigo-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Order Items */}
                    <div className="p-3 md:p-4">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-center py-2 border-b border-gray-100 last:border-0">
                          <img 
                            src={item.image[0]} 
                            alt={item.name} 
                            className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-md"
                          />
                          <div className="ml-3 md:ml-4 flex-1">
                            <h3 className="text-sm md:text-base font-medium">{item.name}</h3>
                            <p className="text-xs md:text-sm text-gray-600">
                              {item.quantity} × ₹{item.price.toFixed(2)}
                            </p>
                            {getReturnStatusText(item)}
                          </div>
                          <div className="text-right">
                            <p className="text-sm md:text-base font-medium">₹{(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    {/* Tracking Section */}
                    {(order.status === 'Shipped' || order.status === 'Delivered') && order.trackingId && (
                      <div className="p-3 md:p-4 border-t border-gray-200 bg-gray-50">
                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                          <div className="flex items-center">
                            <span className="text-xs md:text-sm font-medium text-gray-700 mr-1 md:mr-2">Tracking:</span>
                            <span className="font-mono text-xs md:text-sm bg-gray-200 px-2 py-1 rounded">{order.trackingId}</span>
                            <button 
                              onClick={() => copyToClipboard(order.trackingId!)}
                              className="ml-1 p-1 text-gray-500 hover:text-gray-700"
                              title="Copy Tracking ID"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                          <button
                            onClick={() => redirectToPostOfficeTracking(order.trackingId!)}
                            className="flex items-center text-xs md:text-sm text-white bg-blue-600 hover:bg-blue-700 px-2 py-1 md:px-3 md:py-1 rounded mt-2 sm:mt-0"
                          >
                            <Truck size={14} className="mr-1" />
                            Track
                          </button>
                        </div>
                      </div>
                    )}
                    
                    {/* Order Footer */}
                    <div className="p-3 md:p-4 bg-gray-50 flex flex-col sm:flex-row justify-between items-center gap-3">
                      <Link 
                        href={`/order/${order.orderId}`}
                        className="text-brown-900 hover:text-brown-700 font-medium text-xs md:text-sm"
                      >
                        View Details
                      </Link>
                      <div className="flex gap-2">
                        {canReturnMoreItems(order) && (
                          <button 
                            onClick={() => openReturnModal(order)}
                            className="flex items-center text-xs md:text-sm border border-gray-300 hover:bg-gray-100 px-3 py-1 rounded"
                          >
                            <RefreshCw size={14} className="mr-1" />
                            {order.status === 'Return Requested' ? 'Return More' : 'Return'}
                          </button>
                        )}
                        <button className="text-xs md:text-sm border border-gray-300 hover:bg-gray-100 px-3 py-1 rounded">
                          Download Invoice
                        </button>
                      </div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center">
                  <Package size={40} className="mx-auto text-gray-400 mb-3" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Orders Found</h3>
                  <p className="text-gray-600 mb-4 text-sm">We couldn't find any orders matching your criteria.</p>
                  <Link href="/shop" className="inline-block">
                    <Button variant='primary' size="sm">
                      Start Shopping
                    </Button>  
                  </Link>
                </div>
              )}
            </motion.div>
          )}

          {/* Return Request Modal */}
          {showReturnModal && selectedOrder && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
                  <h3 className="text-lg font-medium">Request Return</h3>
                  <button 
                    onClick={closeReturnModal} 
                    className="text-gray-500 hover:text-gray-700"
                    disabled={isSubmittingReturn}
                  >
                    <X size={20} />
                  </button>
                </div>
                <div className="p-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Select the items you want to return and specify the reason for each.
                  </p>
                  
                  <div className="space-y-4">
                    {selectedOrder.items.map((item, index) => {
                      const returnItem = returnItems[index];
                      if (!returnItem || !returnItem.canReturn) return null;
                      
                      return (
                        <div key={index} className="border-b border-gray-100 pb-4">
                          <div className="flex items-center mb-2">
                            <img 
                              src={item.image[0]} 
                              alt={item.name} 
                              className="w-10 h-10 object-cover rounded-md mr-3"
                            />
                            <div>
                              <h4 className="text-sm font-medium">{item.name}</h4>
                              <p className="text-xs text-gray-500">
                                {returnItem.previousReturnStatus === 'Approved' ? 
                                  `${returnItem.maxQuantity} remaining (${item.quantity - returnItem.maxQuantity} already returned)` : 
                                  `Max quantity: ${returnItem.maxQuantity}`}
                              </p>
                            </div>
                          </div>
                          
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-xs text-gray-600">Quantity to return:</label>
                            <select
                              value={returnItem.quantity}
                              onChange={(e) => updateReturnItem(index, 'quantity', parseInt(e.target.value))}
                              className="text-xs border border-gray-300 rounded px-2 py-1"
                              disabled={isSubmittingReturn}    
                            >
                              {[...Array(returnItem.maxQuantity + 1).keys()].map(num => (
                                <option key={num} value={num}>{num}</option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="text-xs text-gray-600 block mb-1">Reason for return:</label>
                            <select
                              value={returnItem.reason}
                              onChange={(e) => updateReturnItem(index, 'reason', e.target.value)}
                              className="text-xs w-full border border-gray-300 rounded px-2 py-1"
                              required
                              disabled={isSubmittingReturn}
                            >
                              <option value="">Select a reason</option>
                              <option value="Wrong item received">Wrong item received</option>
                              <option value="Damaged product">Damaged product</option>
                              <option value="Product not as described">Product not as described</option>
                              <option value="Other">Other</option>
                            </select>
                            {returnItem.reason === 'Other' && (
                              <textarea
                                placeholder="Please specify reason..."
                                rows={2}
                                className="text-xs w-full mt-2 border border-gray-300 rounded px-2 py-1"
                                value={returnItem.reasonDetails || ''}
                                onChange={(e) => updateReturnItem(index, 'reasonDetails', e.target.value)}
                                required
                                disabled={isSubmittingReturn}
                              />
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="p-4 border-t border-gray-200 flex justify-end gap-2 sticky bottom-0 bg-white">
                  <button
                    onClick={closeReturnModal}
                    className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReturnRequest}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
                    disabled={isSubmittingReturn}
                  >
                    {isSubmittingReturn ? (
                      <>
                        <Loader2 className="animate-spin h-4 w-4" />
                        Processing...
                      </>
                    ) : (
                      'Submit Return Request'
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default MyOrdersPage;


