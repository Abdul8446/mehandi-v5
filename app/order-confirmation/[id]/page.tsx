'use client';
import { Suspense, use, useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle, Package, Truck, MapPin, CreditCard } from 'lucide-react';
import { IOrder } from '@/models/Order';
import { fetchOrder } from '@/lib/api/orders';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/ui/Button';
import { useCart } from '@/contexts/CartContext';
import { is } from 'date-fns/locale';

const OrderConfirmationComponent = () => {
  const { id: orderId } = useParams();
  const { clearCart, items } = useCart();
  const { isAuthenticated } = useAuth();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const { user, loading } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams()

  const isConfirmClearCart = searchParams.get('clearCart') === 'true';
  console.log(items, 'items');


  useEffect(() => {
    if (!loading && isAuthenticated) {
      const loadOrder = async () => {
        if (typeof orderId !== 'string') return;
        
        try {
          const fetchedOrder = await fetchOrder(orderId);
          
          if (fetchedOrder?.userId !== user?.id) {
            toast.error('Invalid user');
            router.push('/my-orders');
            return;
          }

          setOrder(fetchedOrder);
          
          // Only clear cart AFTER successful order confirmation
          if (isConfirmClearCart && items.length > 0) {
            await clearCart();
            // Remove the clearCart param from URL
            router.replace(`/order-confirmation/${orderId}`);
          }
        } catch (error) {
          console.error('Error loading order:', error);
        } finally {
          setOrderLoading(false);
        }
      };

      loadOrder();
    }
  }, [orderId, user, loading, isAuthenticated, items]);

  const formatDate = (date?: Date | string) => {
    if (!date) return 'N/A';
    const d = new Date(date);
    return d.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (orderLoading) {
    return (
        <ProtectedRoute>
          <div className="bg-gray-50 min-h-screen py-20 overflow-auto">
            <div className="container mx-auto px-4 lg:px-8">
              <div className="max-w-6xl mx-auto">
                {/* Header and Order Status Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Order Confirmation Header Skeleton */}
                  <div className="bg-white rounded-lg shadow-sm p-8 animate-pulse">
                    <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                    <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  </div>
                  
                  {/* Order Status Timeline Skeleton */}
                  <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="h-6 bg-gray-200 rounded w-1/4 mb-6"></div>
                    <div className="space-y-6">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex items-start">
                          <div className="w-8 h-8 rounded-full bg-gray-200 mr-4"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                {/* Order Details and Customer Info Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                  {/* Order Items Skeleton */}
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden lg:col-span-2 animate-pulse">
                    <div className="p-6 border-b border-gray-200">
                      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
                    </div>
                    
                    <div className="divide-y divide-gray-200">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="p-6 flex items-center">
                          <div className="w-16 h-16 bg-gray-200 rounded-md mr-4"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                            <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                          </div>
                          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="p-6 bg-gray-50 space-y-3">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="flex justify-between">
                          <div className="h-3 bg-gray-200 rounded w-1/4"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/6"></div>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  {/* Customer Information Skeleton */}
                  <div className="space-y-6">
                    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                      <div className="flex items-start mb-4">
                        <div className="w-5 h-5 bg-gray-200 mr-3 mt-0.5"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          {[...Array(5)].map((_, i) => (
                            <div key={i} className="h-3 bg-gray-200 rounded w-full"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                    
                    <div className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                      <div className="flex items-start">
                        <div className="w-5 h-5 bg-gray-200 mr-3 mt-0.5"></div>
                        <div className="flex-1 space-y-2">
                          <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                          {[...Array(2)].map((_, i) => (
                            <div key={i} className="h-3 bg-gray-200 rounded w-full"></div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons Skeleton */}
                <div className="flex flex-col sm:flex-row justify-center gap-4 animate-pulse">
                  <div className="h-10 bg-gray-200 rounded w-40 mx-auto"></div>
                  <div className="h-10 bg-gray-200 rounded w-40 mx-auto"></div>
                </div>
              </div>
            </div>
          </div>
        </ProtectedRoute>
    );
  }

  if (!order) {
    return (
      <ProtectedRoute>
        <div className="bg-gray-50 min-h-screen py-12">
          <div className="container mx-auto px-4 lg:px-8">
            <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
              <h1 className="text-2xl font-bold text-gray-800 mb-4">Order Not Found</h1>
              <p className="text-gray-600 mb-6">We couldn't find the order you're looking for.</p>
              <Link href="/orders" className="btn-primary inline-block">View Your Orders</Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen py-20 overflow-auto">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="max-w-6xl mx-auto">
            {/* Header and Order Status */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Order Confirmation Header */}
              <div className="bg-white rounded-lg shadow-sm p-8 text-center lg:text-left">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto lg:mx-0 mb-4">
                  <CheckCircle size={32} className="text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 mb-2">Order {order.status}!</h1>
                <p className="text-gray-600 mb-4">
                  {order.status === 'Confirmed' && 'Thank you for your order. Your order has been received and is now being processed.'}
                  {order.status === 'Shipped' && 'Your order has been shipped and is on its way to you.'}
                  {order.status === 'Delivered' && 'Your order has been successfully delivered.'}
                  {order.status === 'Cancelled' && 'Your order has been cancelled as per your request.'}
                  {order.status === 'Returned' && 'Your order has been returned and processed.'}
                </p>
                <div className="text-sm text-gray-500">
                  Order ID: <span className="font-medium">{order.orderId}</span> • 
                  Date: <span className="font-medium">{formatDate(order.createdAt)}</span>
                </div>
              </div>
              
              {/* Order Status Timeline */}
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h2 className="text-lg font-semibold mb-4">Order Status</h2>
                <div className="relative">
                  <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200 z-0"></div>
                  
                  <div className="relative z-10 flex mb-6">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                    <CheckCircle size={16} />
                  </div>
                  <div className="ml-4">
                    <h3 className="font-medium">Order Placed</h3>
                    <p className="text-sm text-gray-500">
                      {new Date(order.createdAt).toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 flex mb-6">
                <div className={`w-8 h-8 rounded-full ${order.paymentStatus === 'Paid' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-600'} flex items-center justify-center`}>
                  {order.paymentStatus === 'Paid' ? <CheckCircle size={16} /> : '2'}
                </div>
                <div className="ml-4">
                  <h3 className="font-medium">Payment {order.paymentStatus === 'Paid' ? 'Completed' : 'Pending'}</h3>
                  {order.paymentStatus === 'Paid' && (
                        <p className="text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Confirmed Step */}
                  <div className="relative z-10 flex mb-6">
                    <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                      <CheckCircle size={16} />
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Order Confirmed</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                  </div>
                  
                  {/* Shipped Step */}
                  <div className="relative z-10 flex mb-6">
                    <div className={`w-8 h-8 rounded-full ${
                      ['Shipped', 'Delivered', 'Cancelled', 'Returned'].includes(order.status) 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    } flex items-center justify-center`}>
                      {['Shipped', 'Delivered', 'Cancelled', 'Returned'].includes(order.status) 
                        ? <CheckCircle size={16} /> 
                        : '4'}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Shipped</h3>
                      {order.status === 'Shipped' && order.shippedAt && (
                        <p className="text-sm text-gray-500">
                          Shipped on {formatDate(order.shippedAt)}
                          {order.trackingId && (
                            <span className="block mt-1">Tracking ID: {order.trackingId}</span>
                          )}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  {/* Delivered Step */}
                  <div className="relative z-10 flex">
                    <div className={`w-8 h-8 rounded-full ${
                      ['Delivered'].includes(order.status) 
                        ? 'bg-green-600 text-white' 
                        : 'bg-gray-200 text-gray-600'
                    } flex items-center justify-center`}>
                      {order.status === 'Delivered' 
                        ? <CheckCircle size={16} /> 
                        : '5'}
                    </div>
                    <div className="ml-4">
                      <h3 className="font-medium">Delivered</h3>
                      {order.status === 'Delivered' && order.deliveredAt && (
                        <p className="text-sm text-gray-500">
                          Delivered on {formatDate(order.deliveredAt)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Order Details and Customer Info */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm overflow-hidden lg:col-span-2 grid grid-rows-[auto_1fr_auto]">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Order Details</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {order.items.map((item, index) => (
                    <div key={`${item.productId}-${index}`} className="p-6 flex items-center">
                      {item.image?(<img 
                        src={item.image[0]} 
                        alt={item.name} 
                        className="w-16 h-16 object-cover rounded-md mr-4"
                      />):(
                      <div className="w-16 h-16 bg-gray-100 rounded-md mr-4 flex items-center justify-center">
                        <Package size={24} className="text-gray-400" />
                      </div>
                      )}
                      <div className="flex-1">
                        <h3 className="font-medium">{item.name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                      </div>
                      <div className="font-semibold">
                        ₹{(item.price * item.quantity).toFixed(2)}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-gray-50 mt-a">
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Subtotal</span>
                      <span>₹{order.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipping</span>
                      <span>₹{order.shippingCost.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tax</span>
                      <span>Included</span>
                    </div>
                    <div className="border-t border-gray-200 pt-2 mt-2">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-red-900">₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Customer Information */}
              <div className="space-y-6">
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start mb-4">
                    <MapPin size={20} className="text-red-900 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Shipping Information</h3>
                      <p className="text-gray-600">
                        {order.customer.name}<br />
                        {order.customer.email}<br />
                        {order.customer.phone}
                      </p>
                      <p className="text-gray-600">
                        {order.shippingAddress.address}<br />
                        {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}<br />
                        {order.shippingAddress.country}
                      </p>
                    </div>
                  </div>
                  
                  {order.trackingId && (
                    <div className="flex items-start">
                      <Truck size={20} className="text-red-900 mr-3 mt-0.5" />
                      <div>
                        <h3 className="font-semibold mb-2">Tracking Information</h3>
                        <p className="text-gray-600">
                          Tracking ID: {order.trackingId}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="bg-white rounded-lg shadow-sm p-6">
                  <div className="flex items-start">
                    <CreditCard size={20} className="text-red-900 mr-3 mt-0.5" />
                    <div>
                      <h3 className="font-semibold mb-2">Payment Information</h3>
                      <p className="text-gray-600">
                        Status: {order.paymentStatus}<br />
                        Method: {order.paymentStatus === 'Paid' ? 'Online Payment' : 'Other'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link href="/my-orders" className="btn-primary">
                <Button variant='outline'>
                  View All Orders
                </Button>
              </Link>
              <Link href="/shop" className="btn-outline">
                <Button variant='primary'>
                  Continue Shopping
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};



export default function OrderConfirmationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <OrderConfirmationComponent />
    </Suspense>
  );
}