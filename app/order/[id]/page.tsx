// // app/order/[id]/page.tsx
// 'use client';
// import { useState, useEffect } from 'react';
// import { useRouter, useParams } from 'next/navigation';
// import Link from 'next/link';
// import { Package, ChevronDown, Search, Filter, Copy, Truck, ArrowLeft, Check, X, Clock, Loader2, RefreshCw } from 'lucide-react';
// import { motion } from 'framer-motion';
// import { useAuth } from '@/contexts/AuthContext';
// import { IOrder, OrderStatus, ReturnStatus } from '@/models/Order';
// import ProtectedRoute from '@/components/ProtectedRoute';
// import Button from '@/components/ui/Button';
// import { toast } from 'react-hot-toast';
// import { fetchOrder } from '@/lib/api/orders';

// interface ReturnItem {
//   productId: string;
//   quantity: number;
//   reason: string;
//   reasonDetails?: string;
//   name: string;
//   image: string[];
//   maxQuantity: number;
//   canReturn: boolean;
//   previousReturnStatus?: ReturnStatus;
// }

// const OrderDetailsPage = () => {
//   const { id: orderId } = useParams();
//   const { user, loading } = useAuth();
//   const router = useRouter();
//   const [order, setOrder] = useState<IOrder | null>(null);
//   const [orderLoading, setOrderLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
  
//   // Return modal state
//   const [showReturnModal, setShowReturnModal] = useState(false);
//   const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);

//   useEffect(() => {
//     const loadOrder = async () => {
//       if (typeof orderId !== 'string') return;
      
//       try {
//         const fetchedOrder = await fetchOrder(orderId);
//         if (!loading && fetchedOrder?.userId !== user?.id) {
//           toast.error('Invalid user');
//         } else {
//           setOrder(fetchedOrder);
//         }
//       } catch (error) {
//         console.error('Error loading order:', error);
//         setError('Failed to load order details');
//       } finally {
//         if (!loading) setOrderLoading(false);
//       }
//     };

//     loadOrder();
//   }, [orderId, user, loading]);

//   const isWithinReturnWindow = (order: IOrder) => {
//     if (order.status !== 'Delivered' && order.status !== 'Return Requested') return false;
//     const returnWindowEnd = order.returnWindowEnd || 
//       new Date(new Date(order.deliveredAt || order.createdAt).getTime() + 48 * 60 * 60 * 1000);
//     return new Date() < new Date(returnWindowEnd);
//   };

//   const canReturnMoreItems = (order: IOrder) => {
//     if (!isWithinReturnWindow(order)) return false;
    
//     return order.items.some(item => {
//       const remainingQuantity = item.quantity - (item.returnQuantity || 0);
//       return (
//         (!item.returnRequested || 
//          item.returnStatus === 'Rejected' || 
//          (item.returnStatus === 'Approved' && remainingQuantity > 0)) &&
//         remainingQuantity > 0
//       );
//     });
//   };

//   const openReturnModal = () => {
//     if (!order) return;
    
//     setReturnItems(order.items.map(item => {
//       const remainingQuantity = item.remainingQuantity !== undefined ?
//         item.remainingQuantity : 
//         item.quantity - (item.returnedQuantity || 0);
      
//       const canReturn = remainingQuantity > 0 && 
//         (!item.returnRequested || item.returnStatus === 'Rejected');

//       const initialQuantity = canReturn ? (item.returnRequested ? 0 : remainingQuantity) : 0;
      
//       return {
//         productId: item.productId,
//         quantity: canReturn ? remainingQuantity : 0,
//         reason: '',
//         reasonDetails: '',
//         name: item.name,
//         image: item.image,
//         maxQuantity: remainingQuantity,
//         canReturn,
//         previousReturnStatus: item.returnStatus
//       };
//     }));
//     setShowReturnModal(true);
//   };

//   const closeReturnModal = () => {
//     setShowReturnModal(false);
//     setReturnItems([]);
//   };

//   const updateReturnItem = (index: number, field: string, value: any) => {
//     const updatedItems = [...returnItems];
//     updatedItems[index] = {
//       ...updatedItems[index],
//       [field]: value
//     };
//     setReturnItems(updatedItems);
//   };

//   const handleReturnRequest = async () => {
//     if (!order) return;
    
//     try {
//       const itemsToReturn = returnItems.filter(item => 
//         item.reason.trim() !== '' && item.quantity > 0 && item.canReturn
//       );
      
//       if (itemsToReturn.length === 0) {
//         toast.error('Please select at least one item to return and specify a reason');
//         return;
//       }

//       const response = await fetch(`/api/orders/${order.orderId}/return`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ 
//           items: itemsToReturn.map(item => ({
//             productId: item.productId,
//             quantity: item.quantity,
//             reason: item.reason,
//             reasonDetails: item.reasonDetails
//           }))
//         }),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         throw new Error(errorData.error || 'Failed to submit return request');
//       }

//       const updatedOrder = await response.json();
//       setOrder(updatedOrder);
//       toast.success('Return request submitted successfully!');
//       closeReturnModal();
//     } catch (error: any) {
//       console.error('Error submitting return request:', error);
//       toast.error(error.message || 'Failed to submit return request');
//     }
//   };

//   const copyToClipboard = (text: string) => {
//     navigator.clipboard.writeText(text);
//     toast.success('Copied to clipboard!');
//   };

//   const redirectToPostOfficeTracking = (trackingId: string) => {
//     window.open(`https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx?LT=${trackingId}`, '_blank');
//   };

//   const getStatusIcon = (status: string) => {
//     switch (status) {
//       case 'Delivered':
//         return <Check className="text-green-500" size={20} />;
//       case 'Shipped':
//         return <Truck className="text-blue-500" size={20} />;
//       case 'Confirmed':
//         return <Clock className="text-yellow-500" size={20} />;
//       case 'Cancelled':
//         return <X className="text-red-500" size={20} />;
//       default:
//         return <Loader2 className="animate-spin text-gray-500" size={20} />;
//     }
//   };

//   const formatDate = (dateString?: Date) => {
//     if (!dateString) return 'N/A';
//     const date = new Date(dateString);
//     return date.toLocaleDateString('en-IN', {
//       day: 'numeric',
//       month: 'short',
//       year: 'numeric',
//       hour: '2-digit',
//       minute: '2-digit'
//     });
//   };

//   const getReturnStatusText = (item: any) => {
//     if (!item.returnRequested) return null;
    
//     const returnedQty = item.returnedQuantity || 0;
//     const requestedQty = item.returnQuantity || 0;
//     const totalQty = item.quantity;
//     const remainingQty = totalQty - returnedQty;

//     let statusText = '';
//     if (item.returnStatus === 'Approved') {
//       statusText = `Returned ${returnedQty} of ${totalQty}`;
//     } else if (item.returnStatus === 'Rejected') {
//       statusText = `Return rejected for ${requestedQty} items`;
//     } else if (item.returnStatus === 'Pending') {
//       statusText = `Return pending for ${requestedQty} items`;
//     }

//     return (
//       <div className="mt-1 text-xs">
//         {item.returnStatus === 'Approved' ? (
//           <span className="text-green-600">{statusText}</span>
//         ) : item.returnStatus === 'Rejected' ? (
//           <span className="text-red-600">{statusText}</span>
//         ) : (
//           <span className="text-yellow-600">{statusText}</span>
//         )}
//         {item.returnReason && (
//           <div className="text-gray-600">Reason: {item.returnReason}</div>
//         )}
//         {item.returnDetails && (
//           <div className="text-gray-600">Details: {item.returnDetails}</div>
//         )}
//       </div>
//     );
//   };

//   const containerVariants = {
//     hidden: { opacity: 0 },
//     visible: {
//       opacity: 1,
//       transition: {
//         staggerChildren: 0.1
//       }
//     }
//   };

//   const itemVariants = {
//     hidden: { y: 20, opacity: 0 },
//     visible: {
//       y: 0,
//       opacity: 1
//     }
//   };

//   if (loading || orderLoading) {
//     return (
//       <ProtectedRoute>
//         <div className="bg-gray-50 min-h-screen py-20">
//           <div className="container mx-auto px-4">
//             <div className="flex justify-center items-center h-64">
//               <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-500"></div>
//             </div>
//           </div>
//         </div>
//       </ProtectedRoute>
//     );
//   }

//   if (error) {
//     return (
//       <ProtectedRoute>
//         <div className="bg-gray-50 min-h-screen py-20">
//           <div className="container mx-auto px-4">
//             <div className="bg-white rounded-lg shadow-sm p-8 text-center">
//               <Package size={48} className="mx-auto text-gray-400 mb-4" />
//               <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
//               <p className="text-gray-600 mb-4">{error}</p>
//               <Link href="/my-orders" className="btn-primary inline-flex items-center">
//                 <Button variant='primary'>
//                   Back to My Orders
//                 </Button>  
//               </Link>
//             </div>
//           </div>
//         </div>
//       </ProtectedRoute>
//     );
//   }

//   if (!order) {
//     return null;
//   }

//   return (
//     <ProtectedRoute>
//       <div className="bg-gray-50 min-h-screen py-4 md:py-8">
//         <div className="container mx-auto px-3 md:px-4">
//           <div className="mb-4 md:mb-6">
//             <Button 
//               variant="outline" 
//               onClick={() => router.back()}
//               className="flex items-center gap-2 text-sm"
//             >
//               <ArrowLeft size={16} />
//               Back to Orders
//             </Button>
//           </div>

//           {order && (
//             <motion.div 
//               variants={containerVariants}
//               initial="hidden"
//               animate="visible"
//               className="flex flex-col lg:flex-row gap-4 md:gap-6"
//             >
//               {/* Main Order Details */}
//               <motion.div 
//                 variants={itemVariants}
//                 className="lg:w-2/3"
//               >
//                 <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 md:mb-6">
//                   <div className="p-4 md:p-6 border-b border-gray-200">
//                     <div className="flex flex-wrap justify-between items-center gap-4">
//                       <h2 className="text-lg md:text-xl font-bold text-gray-800">Order #{order.orderId}</h2>
//                       <div className="flex items-center gap-2">
//                         {getStatusIcon(order.status)}
//                         <span className={`px-2 py-1 rounded-full text-xs md:text-sm font-medium ${
//                           order.status === 'Delivered' ? 'bg-green-100 text-green-800' :
//                           order.status === 'Shipped' ? 'bg-blue-100 text-blue-800' :
//                           order.status === 'Confirmed' ? 'bg-yellow-100 text-yellow-800' :
//                           order.status === 'Cancelled' ? 'bg-red-100 text-red-800' :
//                           'bg-gray-100 text-gray-800'
//                         }`}>
//                           {order.status}
//                         </span>
//                       </div>
//                     </div>
//                     <p className="text-gray-600 mt-2 text-sm">
//                       Placed on {formatDate(order.createdAt)}
//                     </p>
//                   </div>

//                   {/* Order Items */}
//                   <div className="p-4 md:p-6">
//                     <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Order Items</h3>
//                     <div className="space-y-4 md:space-y-6">
//                       {order.items.map((item, index) => (
//                         <div key={index} className="flex items-start gap-3 md:gap-4 pb-4 md:pb-6 border-b border-gray-100 last:border-0 last:pb-0">
//                           <img 
//                             src={item.image[0]} 
//                             alt={item.name} 
//                             className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md"
//                           />
//                           <div className="flex-1">
//                             <h4 className="font-medium text-sm md:text-base">{item.name}</h4>
//                             <p className="text-xs md:text-sm text-gray-600 mt-1">
//                               Quantity: {item.quantity}
//                             </p>
//                             <p className="text-xs md:text-sm text-gray-600">
//                               Price: ₹{item.price.toFixed(2)}
//                             </p>
//                             {getReturnStatusText(item)}
//                           </div>
//                           <div className="text-right">
//                             <p className="font-medium text-sm md:text-base">₹{(item.quantity * item.price).toFixed(2)}</p>
//                             {canReturnMoreItems(order) && (
//                               <button
//                                 onClick={openReturnModal}
//                                 className="mt-2 text-xs md:text-sm text-red-600 hover:text-red-800 flex items-center gap-1"
//                               >
//                                 <RefreshCw size={14} />
//                                 {order.status === 'Return Requested' ? 'Return More' : 'Request Return'}
//                               </button>
//                             )}
//                           </div>
//                         </div>
//                       ))}
//                     </div>
//                   </div>

//                   {/* Order Summary */}
//                   <div className="p-4 md:p-6 bg-gray-50">
//                     <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Order Summary</h3>
//                     <div className="space-y-2 md:space-y-3">
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Subtotal</span>
//                         <span>₹{(order.totalAmount - order.shippingCost).toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Shipping</span>
//                         <span>₹{order.shippingCost.toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between border-t border-gray-200 pt-2 md:pt-3 mt-2 md:mt-3 text-sm md:text-base">
//                         <span className="font-medium">Total</span>
//                         <span className="font-medium">₹{order.totalAmount.toFixed(2)}</span>
//                       </div>
//                       <div className="flex justify-between text-sm">
//                         <span className="text-gray-600">Payment Status</span>
//                         <span className={`font-medium ${
//                           order.paymentStatus === 'Paid' ? 'text-green-600' :
//                           order.paymentStatus === 'Refunded' ? 'text-blue-600' :
//                           'text-red-600'
//                         }`}>
//                           {order.paymentStatus}
//                         </span>
//                       </div>
//                     </div>
//                   </div>
//                 </div>

//                 {/* Shipping Information */}
//                 <div className="bg-white rounded-lg shadow-sm overflow-hidden">
//                   <div className="p-4 md:p-6">
//                     <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Shipping Information</h3>
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
//                       <div>
//                         <h4 className="text-xs md:text-sm font-medium text-gray-500">Shipping Address</h4>
//                         <p className="mt-1 text-gray-900 text-sm">
//                           {order.shippingAddress.address}<br />
//                           {order.shippingAddress.city}, {order.shippingAddress.state}<br />
//                           {order.shippingAddress.postalCode}, {order.shippingAddress.country}
//                         </p>
//                       </div>
//                       <div>
//                         <h4 className="text-xs md:text-sm font-medium text-gray-500">Customer Details</h4>
//                         <p className="mt-1 text-gray-900 text-sm">
//                           {order.customer.name}<br />
//                           {order.customer.email}<br />
//                           {order.customer.phone}
//                         </p>
//                       </div>
//                     </div>
//                   </div>

//                   {/* Tracking Information */}
//                   {order.trackingId && (
//                     <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50">
//                       <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Tracking Information</h3>
//                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
//                         <div>
//                           <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1">Tracking Number</h4>
//                           <div className="flex items-center">
//                             <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs md:text-sm">
//                               {order.trackingId}
//                             </span>
//                             <button 
//                               onClick={() => copyToClipboard(order.trackingId!)}
//                               className="ml-1 p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-200"
//                               title="Copy Tracking ID"
//                             >
//                               <Copy size={14} />
//                             </button>
//                           </div>
//                         </div>
//                         <div>
//                           <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1">Shipping Status</h4>
//                           <p className="text-gray-900 text-sm">
//                             {order.status === 'Shipped' && 'Shipped on ' + formatDate(order.shippedAt)}
//                             {order.status === 'Delivered' && 'Delivered on ' + formatDate(order.deliveredAt)}
//                             {order.status === 'Confirmed' && 'Preparing for shipment'}
//                           </p>
//                         </div>
//                         <button
//                           onClick={() => redirectToPostOfficeTracking(order.trackingId!)}
//                           className="flex items-center justify-center gap-1 text-xs md:text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 md:px-4 md:py-2 rounded whitespace-nowrap"
//                         >
//                           <Truck size={14} />
//                           Track Package
//                         </button>
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               </motion.div>

//               {/* Order Timeline */}
//               <motion.div 
//                 variants={itemVariants}
//                 className="lg:w-1/3"
//               >
//                 <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4 md:top-6">
//                   <div className="p-4 md:p-6 border-b border-gray-200">
//                     <h3 className="text-base md:text-lg font-medium text-gray-900">Order Status</h3>
//                   </div>
//                   <div className="p-4 md:p-6">
//                     <div className="relative">
//                       {/* Timeline */}
//                       <div className="space-y-4 md:space-y-6">
//                         {/* Timeline item - Order placed */}
//                         <div className="flex gap-3 md:gap-4">
//                           <div className="flex flex-col items-center">
//                             <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${
//                               ['Confirmed', 'Shipped', 'Delivered', 'Cancelled'].includes(order.status) ? 
//                               'bg-green-500 text-white' : 'bg-gray-200'
//                             }`}>
//                               <Check size={12} />
//                             </div>
//                             {order.status !== 'Confirmed' && (
//                               <div className="w-px h-1/3 bg-gray-200 mt-1 md:mt-2"></div>
//                             )}
//                           </div>
//                           <div>
//                             <h4 className="font-medium text-sm md:text-base">Order Confirmed</h4>
//                             <p className="text-gray-600 mt-1 text-xs md:text-sm">
//                               {formatDate(order.createdAt)}
//                             </p>
//                           </div>
//                         </div>

//                         {/* Timeline item - Processing */}
//                         {order.status !== 'Cancelled' && (
//                           <div className="flex gap-3 md:gap-4">
//                             <div className="flex flex-col items-center">
//                               <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${
//                                 ['Shipped', 'Delivered'].includes(order.status) ? 
//                                 'bg-green-500 text-white' : 
//                                 order.status === 'Confirmed' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
//                               }`}>
//                                 {['Shipped', 'Delivered'].includes(order.status) ? (
//                                   <Check size={12} />
//                                 ) : order.status === 'Confirmed' ? (
//                                   <Loader2 className="animate-spin" size={12} />
//                                 ) : (
//                                   <Clock size={12} />
//                                 )}
//                               </div>
//                               {order.status !== 'Shipped' && order.status !== 'Confirmed' && (
//                                 <div className="w-px h-1/3 bg-gray-200 mt-1 md:mt-2"></div>
//                               )}
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-sm md:text-base">
//                                 {order.status === 'Confirmed' ? 'Processing' : 'Processed'}
//                               </h4>
//                               <p className="text-gray-600 mt-1 text-xs md:text-sm">
//                                 {order.status === 'Confirmed' ? 
//                                   'Your order is being prepared' : 
//                                   `Processed on ${formatDate(order.shippedAt || order.updatedAt)}`
//                               }
//                               </p>
//                             </div>
//                           </div>
//                         )}

//                         {/* Timeline item - Shipped */}
//                         {order.status !== 'Cancelled' && (
//                           <div className="flex gap-3 md:gap-4">
//                             <div className="flex flex-col items-center">
//                               <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${
//                                 order.status === 'Delivered' ? 
//                                 'bg-green-500 text-white' : 
//                                 order.status === 'Shipped' ? 'bg-blue-500 text-white' : 'bg-gray-200'
//                               }`}>
//                                 {order.status === 'Delivered' ? (
//                                   <Check size={12} />
//                                 ) : order.status === 'Shipped' ? (
//                                   <Truck size={12} />
//                                 ) : (
//                                   <Clock size={12} />
//                                 )}
//                               </div>
//                               {order.status !== 'Delivered' && order.status !== 'Shipped' && (
//                                 <div className="w-px h-1/3 bg-gray-200 mt-1 md:mt-2"></div>
//                               )}
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-sm md:text-base">
//                                 {order.status === 'Shipped' || order.status === 'Delivered' ? 'Shipped' : 'Shipping'}
//                               </h4>
//                               <p className="text-gray-600 mt-1 text-xs md:text-sm">
//                                 {order.status === 'Shipped' || order.status === 'Delivered' ? 
//                                   `Shipped on ${formatDate(order.shippedAt)}` : 
//                                   'Will be shipped soon'
//                               }
//                               </p>
//                               {order.trackingId && (order.status === 'Shipped' || order.status === 'Delivered') && (
//                                 <button
//                                   onClick={() => redirectToPostOfficeTracking(order.trackingId!)}
//                                   className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-1 md:mt-2 text-xs md:text-sm"
//                                 >
//                                   <Truck size={12} />
//                                   Track Package
//                                 </button>
//                               )}
//                             </div>
//                           </div>
//                         )}

//                         {/* Timeline item - Delivered */}
//                         {order.status === 'Delivered' && (
//                           <div className="flex gap-3 md:gap-4">
//                             <div className="flex flex-col items-center">
//                               <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-green-500 text-white flex items-center justify-center">
//                                 <Check size={12} />
//                               </div>
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-sm md:text-base">Delivered</h4>
//                               <p className="text-gray-600 mt-1 text-xs md:text-sm">
//                                 {formatDate(order.deliveredAt)}
//                               </p>
//                             </div>
//                           </div>
//                         )}

//                         {/* Timeline item - Cancelled */}
//                         {order.status === 'Cancelled' && (
//                           <div className="flex gap-3 md:gap-4">
//                             <div className="flex flex-col items-center">
//                               <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
//                                 <X size={12} />
//                               </div>
//                             </div>
//                             <div>
//                               <h4 className="font-medium text-sm md:text-base">Order Cancelled</h4>
//                               <p className="text-gray-600 mt-1 text-xs md:text-sm">
//                                 {formatDate(order.updatedAt)}
//                               </p>
//                             </div>
//                           </div>
//                         )}
//                       </div>
//                     </div>
//                   </div>

//                   {/* Help Section */}
//                   <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50">
//                     <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2 md:mb-3">Need Help?</h3>
//                     <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm">
//                       If you have any questions about your order, please contact our customer support.
//                     </p>
//                     <Button variant="outline" className="w-full text-sm">
//                       Contact Support
//                     </Button>
//                   </div>
//                 </div>
//               </motion.div>
//             </motion.div>
//           )}

//           {/* Return Request Modal */}
//           {showReturnModal && order && (
//             <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
//               <div className="bg-white rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
//                 <div className="p-4 border-b border-gray-200 flex justify-between items-center sticky top-0 bg-white">
//                   <h3 className="text-lg font-medium">Request Return</h3>
//                   <button onClick={closeReturnModal} className="text-gray-500 hover:text-gray-700">
//                     <X size={20} />
//                   </button>
//                 </div>
//                 <div className="p-4">
//                   <p className="text-sm text-gray-600 mb-4">
//                     Select the items you want to return and specify the reason for each.
//                   </p>
                  
//                   <div className="space-y-4">
//                     {order.items.map((item, index) => {
//                       const returnItem = returnItems[index];
//                       if (!returnItem || !returnItem.canReturn) return null;
                      
//                       return (
//                         <div key={index} className="border-b border-gray-100 pb-4">
//                           <div className="flex items-center mb-2">
//                             <img 
//                               src={item.image[0]} 
//                               alt={item.name} 
//                               className="w-10 h-10 object-cover rounded-md mr-3"
//                             />
//                             <div>
//                               <h4 className="text-sm font-medium">{item.name}</h4>
//                               <p className="text-xs text-gray-500">
//                                 {returnItem.previousReturnStatus === 'Approved' ? 
//                                   `${returnItem.maxQuantity} remaining (${item.quantity - returnItem.maxQuantity} already returned)` : 
//                                   `Max quantity: ${returnItem.maxQuantity}`}
//                               </p>
//                             </div>
//                           </div>
                          
//                           <div className="flex items-center justify-between mb-2">
//                             <label className="text-xs text-gray-600">Quantity to return:</label>
//                             <select
//                               value={returnItem.quantity}
//                               onChange={(e) => updateReturnItem(index, 'quantity', parseInt(e.target.value))}
//                               className="text-xs border border-gray-300 rounded px-2 py-1"
//                             >
//                               {[...Array(returnItem.maxQuantity + 1).keys()].map(num => (
//                                 <option key={num} value={num}>{num}</option>
//                               ))}
//                             </select>
//                           </div>
                          
//                           <div>
//                             <label className="text-xs text-gray-600 block mb-1">Reason for return:</label>
//                             <select
//                               value={returnItem.reason}
//                               onChange={(e) => updateReturnItem(index, 'reason', e.target.value)}
//                               className="text-xs w-full border border-gray-300 rounded px-2 py-1"
//                               required
//                             >
//                               <option value="">Select a reason</option>
//                               <option value="Wrong item received">Wrong item received</option>
//                               <option value="Damaged product">Damaged product</option>
//                               <option value="Product not as described">Product not as described</option>
//                               <option value="Other">Other</option>
//                             </select>
//                             {returnItem.reason === 'Other' && (
//                               <textarea
//                                 placeholder="Please specify reason..."
//                                 rows={2}
//                                 className="text-xs w-full mt-2 border border-gray-300 rounded px-2 py-1"
//                                 value={returnItem.reasonDetails || ''}
//                                 onChange={(e) => updateReturnItem(index, 'reasonDetails', e.target.value)}
//                                 required
//                               />
//                             )}
//                           </div>
//                         </div>
//                       );
//                     })}
//                   </div>
//                 </div>
//                 <div className="p-4 border-t border-gray-200 flex justify-end gap-2 sticky bottom-0 bg-white">
//                   <button
//                     onClick={closeReturnModal}
//                     className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
//                   >
//                     Cancel
//                   </button>
//                   <button
//                     onClick={handleReturnRequest}
//                     className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700"
//                   >
//                     Submit Return Request
//                   </button>
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       </div>
//     </ProtectedRoute>
//   );
// };

// export default OrderDetailsPage;


'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Package, ChevronDown, Search, Filter, Copy, Truck, ArrowLeft, Check, X, Clock, Loader2, RefreshCw } from 'lucide-react';
import { motion, useInView } from 'framer-motion';
import { useAuth } from '@/contexts/AuthContext';
import { IOrder, OrderStatus, ReturnStatus } from '@/models/Order';
import ProtectedRoute from '@/components/ProtectedRoute';
import Button from '@/components/ui/Button';
import { toast } from 'react-hot-toast';
import { fetchOrder } from '@/lib/api/orders';

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

const OrderDetailsPage = () => {
  const { id: orderId } = useParams();
  const { user, loading } = useAuth();
  const router = useRouter();
  const [order, setOrder] = useState<IOrder | null>(null);
  const [orderLoading, setOrderLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Return modal state
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [returnItems, setReturnItems] = useState<ReturnItem[]>([]);
  const [isSubmittingReturn, setIsSubmittingReturn] = useState(false);
  const iconRef = useRef(null);
  const isInView = useInView(iconRef, { once: true });
  const [spin, setSpin] = useState(false);

  useEffect(() => {
      setSpin(true);
      const timer = setTimeout(() => setSpin(false), 1500);
      return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const loadOrder = async () => {
      if (typeof orderId !== 'string') return;
      
      try {
        const fetchedOrder = await fetchOrder(orderId);
        if (!loading && fetchedOrder?.userId !== user?.id) {
          toast.error('Invalid user');
        } else {
          setOrder(fetchedOrder);
        }
      } catch (error) {
        console.error('Error loading order:', error);
        setError('Failed to load order details');
      } finally {
        if (!loading) setOrderLoading(false);
      }
    };

    loadOrder();
  }, [orderId, user, loading]);

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

  const openReturnModal = () => {
    if (!order) return;
    
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
    if (!order) return;
    setIsSubmittingReturn(true);
    
    try {
      const itemsToReturn = returnItems.filter(item => 
        item.reason.trim() !== '' && item.quantity > 0 && item.canReturn
      );
      
      if (itemsToReturn.length === 0) {
        toast.error('Please select at least one item to return and specify a reason');
        return;
      }

      const response = await fetch(`/api/orders/${order.orderId}/return`, {
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
      setOrder(updatedOrder);
      toast.success('Return request submitted successfully!');
      closeReturnModal();
    } catch (error: any) {
      console.error('Error submitting return request:', error);
      toast.error(error.message || 'Failed to submit return request');
    } finally {
      setIsSubmittingReturn(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard!');
  };

  const redirectToPostOfficeTracking = (trackingId: string) => {
    window.open(`https://www.indiapost.gov.in/_layouts/15/DOP.Portal.Tracking/TrackConsignment.aspx?LT=${trackingId}`, '_blank');
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

  const formatDate = (dateString?: Date) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
    } else if (item.returnStatus === 'Rejected') {
      statusText = `Return rejected for ${requestedQty} items`;
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

  if (loading || orderLoading) {
    return (
      <ProtectedRoute>
        <div className="bg-gray-50 min-h-screen py-20">
          <div className="container mx-auto px-4">
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brown-500"></div>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (error) {
    return (
      <ProtectedRoute>
        <div className="bg-gray-50 min-h-screen py-20">
          <div className="container mx-auto px-4">
            <div className="bg-white rounded-lg shadow-sm p-8 text-center">
              <Package size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">Order Not Found</h3>
              <p className="text-gray-600 mb-4">{error}</p>
              <Link href="/my-orders" className="btn-primary inline-flex items-center">
                <Button variant='primary'>
                  Back to My Orders
                </Button>  
              </Link>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  if (!order) {
    return null;
  }

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen py-4 md:py-8">
        <div className="container mx-auto px-3 md:px-4">
          <div className="mb-4 md:mb-6">
            <Button 
              variant="outline" 
              onClick={() => router.back()}
              className="flex items-center gap-2 text-sm"
            >
              <ArrowLeft size={16} />
              Back to Orders
            </Button>
          </div>

          {order && (
            <motion.div 
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="flex flex-col lg:flex-row gap-4 md:gap-6"
            >
              {/* Main Order Details */}
              <motion.div 
                variants={itemVariants}
                className="lg:w-2/3"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-4 md:mb-6">
                  <div className="p-4 md:p-6 border-b border-gray-200">
                    <div className="flex flex-wrap justify-between items-center gap-4">
                      <h2 className="text-lg md:text-xl font-bold text-gray-800">Order #{order.orderId}</h2>
                      <div className="flex items-center gap-2">
                        <span ref={iconRef}>
                          {getStatusIcon(order.status, spin)}
                        </span>
                        <span className={`px-2 py-1 rounded-full text-xs md:text-sm font-medium ${
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
                    <p className="text-gray-600 mt-2 text-sm">
                      Placed on {formatDate(order.createdAt)}
                    </p>
                  </div>

                  {/* Order Items */}
                  <div className="p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Order Items</h3>
                    <div className="space-y-4 md:space-y-6">
                      {order.items.map((item, index) => (
                        <div key={index} className="flex items-start gap-3 md:gap-4 pb-4 md:pb-6 border-b border-gray-100 last:border-0 last:pb-0">
                          <img 
                            src={item.image[0]} 
                            alt={item.name} 
                            className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-md"
                          />
                          <div className="flex-1">
                            <h4 className="font-medium text-sm md:text-base">{item.name}</h4>
                            <p className="text-xs md:text-sm text-gray-600 mt-1">
                              Quantity: {item.quantity}
                            </p>
                            <p className="text-xs md:text-sm text-gray-600">
                              Price: ₹{item.price.toFixed(2)}
                            </p>
                            {getReturnStatusText(item)}
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-sm md:text-base">₹{(item.quantity * item.price).toFixed(2)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div className="p-4 md:p-6 bg-gray-50">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Order Summary</h3>
                    <div className="space-y-2 md:space-y-3">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span>₹{(order.totalAmount - order.shippingCost).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span>₹{order.shippingCost.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between border-t border-gray-200 pt-2 md:pt-3 mt-2 md:mt-3 text-sm md:text-base">
                        <span className="font-medium">Total</span>
                        <span className="font-medium">₹{order.totalAmount.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Payment Status</span>
                        <span className={`font-medium ${
                          order.paymentStatus === 'Paid' ? 'text-green-600' :
                          order.paymentStatus === 'Refunded' ? 'text-blue-600' :
                          'text-red-600'
                        }`}>
                          {order.paymentStatus}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Return Request Section - Matches my-orders exactly */}
                {canReturnMoreItems(order) && (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden p-4">
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                      <div>
                        <h3 className="font-medium text-gray-900">Need to return items?</h3>
                        <p className="text-sm text-gray-600 mt-1">
                          You can request a return for eligible items
                        </p>
                      </div>
                      <button
                        onClick={openReturnModal}
                        className="flex items-center justify-center gap-2 text-sm border border-gray-300 hover:bg-gray-100 px-4 py-2 rounded whitespace-nowrap"
                      >
                        <RefreshCw size={16} />
                        {order.status === 'Return Requested' ? 'Return More Items' : 'Request Return'}
                      </button>
                    </div>
                  </div>
                )}

                {/* Shipping Information */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-4 md:mt-6">
                  <div className="p-4 md:p-6">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Shipping Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                      <div>
                        <h4 className="text-xs md:text-sm font-medium text-gray-500">Shipping Address</h4>
                        <p className="mt-1 text-gray-900 text-sm">
                          {order.shippingAddress.address}<br />
                          {order.shippingAddress.city}, {order.shippingAddress.state}<br />
                          {order.shippingAddress.postalCode}, {order.shippingAddress.country}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-xs md:text-sm font-medium text-gray-500">Customer Details</h4>
                        <p className="mt-1 text-gray-900 text-sm">
                          {order.customer.name}<br />
                          {order.customer.email}<br />
                          {order.customer.phone}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Tracking Information */}
                  {order.trackingId && (
                    <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50">
                      <h3 className="text-base md:text-lg font-medium text-gray-900 mb-3 md:mb-4">Tracking Information</h3>
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
                        <div>
                          <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1">Tracking Number</h4>
                          <div className="flex items-center">
                            <span className="font-mono bg-gray-200 px-2 py-1 rounded text-xs md:text-sm">
                              {order.trackingId}
                            </span>
                            <button 
                              onClick={() => copyToClipboard(order.trackingId!)}
                              className="ml-1 p-1 text-gray-500 hover:text-gray-700 rounded hover:bg-gray-200"
                              title="Copy Tracking ID"
                            >
                              <Copy size={14} />
                            </button>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-xs md:text-sm font-medium text-gray-500 mb-1">Shipping Status</h4>
                          <p className="text-gray-900 text-sm">
                            {order.status === 'Shipped' && 'Shipped on ' + formatDate(order.shippedAt)}
                            {order.status === 'Delivered' && 'Delivered on ' + formatDate(order.deliveredAt)}
                            {order.status === 'Confirmed' && 'Preparing for shipment'}
                          </p>
                        </div>
                        <button
                          onClick={() => redirectToPostOfficeTracking(order.trackingId!)}
                          className="flex items-center justify-center gap-1 text-xs md:text-sm text-white bg-blue-600 hover:bg-blue-700 px-3 py-1.5 md:px-4 md:py-2 rounded whitespace-nowrap"
                        >
                          <Truck size={14} />
                          Track Package
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>

              {/* Order Timeline */}
              <motion.div 
                variants={itemVariants}
                className="lg:w-1/3"
              >
                <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-4 md:top-6">
                  <div className="p-4 md:p-6 border-b border-gray-200">
                    <h3 className="text-base md:text-lg font-medium text-gray-900">Order Status</h3>
                  </div>
                  <div className="p-4 md:p-6">
                    <div className="relative">
                      {/* Timeline */}
                      <div className="space-y-4 md:space-y-6">
                        {/* Timeline item - Order placed */}
                        <div className="flex gap-3 md:gap-4">
                          <div className="flex flex-col items-center">
                            <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${
                              ['Confirmed', 'Shipped', 'Delivered', 'Cancelled', 'Return Requested', 'Returned'].includes(order.status) ? 
                              'bg-green-500 text-white' : 'bg-gray-200'
                            }`}>
                              <Check size={12} />
                            </div>
                            {order.status !== 'Confirmed' && (
                              <div className="w-px h-1/3 bg-gray-200 mt-1 md:mt-2"></div>
                            )}
                          </div>
                          <div>
                            <h4 className="font-medium text-sm md:text-base">Order Confirmed</h4>
                            <p className="text-gray-600 mt-1 text-xs md:text-sm">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                        </div>

                        {/* Timeline item - Processing */}
                        {order.status !== 'Cancelled' && (
                          <div className="flex gap-3 md:gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${
                                ['Shipped', 'Delivered', 'Return Requested', 'Returned'].includes(order.status) ? 
                                'bg-green-500 text-white' : 
                                order.status === 'Confirmed' ? 'bg-yellow-500 text-white' : 'bg-gray-200'
                              }`}>
                                {['Shipped', 'Delivered', 'Return Requested', 'Returned'].includes(order.status) ? (
                                  <Check size={12} />
                                ) : order.status === 'Confirmed' ? (
                                  <Loader2 className="animate-spin" size={12} />
                                ) : (
                                  <Clock size={12} />
                                )}
                              </div>
                              {!['Shipped', 'Confirmed'].includes(order.status) && (
                                <div className="w-px h-1/3 bg-gray-200 mt-1 md:mt-2"></div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm md:text-base">
                                {order.status === 'Confirmed' ? 'Processing' : 'Processed'}
                              </h4>
                              <p className="text-gray-600 mt-1 text-xs md:text-sm">
                                {order.status === 'Confirmed' ? 
                                  'Your order is being prepared' : 
                                  `Processed on ${formatDate(order.shippedAt || order.updatedAt)}`
                              }
                              </p>
                            </div>
                          </div>
                        )}

                        {/* Timeline item - Shipped */}
                        {order.status !== 'Cancelled' && !['Return Requested', 'Returned'].includes(order.status) && (
                          <div className="flex gap-3 md:gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${
                                order.status === 'Delivered' ? 
                                'bg-green-500 text-white' : 
                                order.status === 'Shipped' ? 'bg-blue-500 text-white' : 'bg-gray-200'
                              }`}>
                                {order.status === 'Delivered' ? (
                                  <Check size={12} />
                                ) : order.status === 'Shipped' ? (
                                  <Truck size={12} />
                                ) : (
                                  <Clock size={12} />
                                )}
                              </div>
                              {order.status !== 'Delivered' && order.status !== 'Shipped' && (
                                <div className="w-px h-1/3 bg-gray-200 mt-1 md:mt-2"></div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm md:text-base">
                                {order.status === 'Shipped' || order.status === 'Delivered' ? 'Shipped' : 'Shipping'}
                              </h4>
                              <p className="text-gray-600 mt-1 text-xs md:text-sm">
                                {order.status === 'Shipped' || order.status === 'Delivered' ? 
                                  `Shipped on ${formatDate(order.shippedAt)}` : 
                                  'Will be shipped soon'
                              }
                              </p>
                              {order.trackingId && (order.status === 'Shipped' || order.status === 'Delivered') && (
                                <button
                                  onClick={() => redirectToPostOfficeTracking(order.trackingId!)}
                                  className="flex items-center gap-1 text-blue-600 hover:text-blue-800 mt-1 md:mt-2 text-xs md:text-sm"
                                >
                                  <Truck size={12} />
                                  Track Package
                                </button>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Timeline item - Delivered */}
                        {(order.status === 'Delivered' || order.status === 'Return Requested' || order.status === 'Returned') && (
                          <div className="flex gap-3 md:gap-4">
                            <div className="flex flex-col items-center">
                              <div className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${
                                order.status === 'Delivered' ? 'bg-green-500 text-white' :
                                order.status === 'Return Requested' ? 'bg-purple-500 text-white' :
                                'bg-indigo-500 text-white'
                              }`}>
                                {order.status === 'Delivered' ? (
                                  <Check size={12} />
                                ) : (
                                  <RefreshCw size={12} />
                                )}
                              </div>
                              {order.status !== 'Returned' && (
                                <div className="w-px h-1/3 bg-gray-200 mt-1 md:mt-2"></div>
                              )}
                            </div>
                            <div>
                              <h4 className="font-medium text-sm md:text-base">
                                {order.status === 'Delivered' ? 'Delivered' : 
                                order.status === 'Return Requested' ? 'Return Requested' : 'Returned'}
                              </h4>
                              <p className="text-gray-600 mt-1 text-xs md:text-sm">
                                {order.status === 'Delivered' ? 
                                  `Delivered on ${formatDate(order.deliveredAt)}` :
                                  order.status === 'Return Requested' ?
                                  `Return requested on ${formatDate(order.updatedAt)}` :
                                  `Return completed on ${formatDate(order.updatedAt)}`
                                }
                              </p>
                              {order.status === 'Return Requested' && (
                                <p className="text-xs text-purple-600 mt-1">
                                  Your return request is being processed
                                </p>
                              )}
                              {order.status === 'Returned' && (
                                <p className="text-xs text-indigo-600 mt-1">
                                  Return process completed
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Timeline item - Returned */}
                        {order.status === 'Returned' && (
                          <div className="flex gap-3 md:gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center">
                                <RefreshCw size={12} />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm md:text-base">Return Completed</h4>
                              <p className="text-gray-600 mt-1 text-xs md:text-sm">
                                {formatDate(order.updatedAt)}
                              </p>
                              {order.paymentStatus === 'Refunded' && (
                                <p className="text-xs text-green-600 mt-1">
                                  Refund has been processed
                                </p>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Timeline item - Cancelled */}
                        {order.status === 'Cancelled' && (
                          <div className="flex gap-3 md:gap-4">
                            <div className="flex flex-col items-center">
                              <div className="w-5 h-5 md:w-6 md:h-6 rounded-full bg-red-500 text-white flex items-center justify-center">
                                <X size={12} />
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-sm md:text-base">Order Cancelled</h4>
                              <p className="text-gray-600 mt-1 text-xs md:text-sm">
                                {formatDate(order.updatedAt)}
                              </p>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Help Section */}
                  <div className="p-4 md:p-6 border-t border-gray-200 bg-gray-50">
                    <h3 className="text-base md:text-lg font-medium text-gray-900 mb-2 md:mb-3">Need Help?</h3>
                    <p className="text-gray-600 mb-3 md:mb-4 text-xs md:text-sm">
                      If you have any questions about your order, please contact our customer support.
                    </p>
                    <Button variant="outline" className="w-full text-sm">
                      Contact Support
                    </Button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Return Request Modal - Identical to my-orders */}
          {showReturnModal && order && (
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
                    {order.items.map((item, index) => {
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
                    disabled={isSubmittingReturn}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleReturnRequest}
                    className="px-4 py-2 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center gap-2"
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

export default OrderDetailsPage;