'use client';
import React, { use, useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { CreditCard, Truck, ShieldCheck, ArrowLeft, AlertCircle, Info } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/ProtectedRoute';
import PaymentProcessing from '@/components/payment/PaymentProcessing';

const indianStates = [
  "Andhra Pradesh", "Arunachal Pradesh", "Assam", "Bihar", "Chhattisgarh",
  "Goa", "Gujarat", "Haryana", "Himachal Pradesh", "Jharkhand",
  "Karnataka", "Kerala", "Madhya Pradesh", "Maharashtra", "Manipur",
  "Meghalaya", "Mizoram", "Nagaland", "Odisha", "Punjab",
  "Rajasthan", "Sikkim", "Tamil Nadu", "Telangana", "Tripura",
  "Uttar Pradesh", "Uttarakhand", "West Bengal", "Andaman and Nicobar Islands",
  "Chandigarh", "Dadra and Nagar Haveli and Daman and Diu", "Delhi",
  "Jammu and Kashmir", "Ladakh", "Lakshadweep", "Puducherry"
];

declare global {
  interface Window {
    PhonePeCheckout?: {
      transact: (options: {
        tokenUrl: string;
        callback: (response: string) => void;
        type: string;
      }) => void;
      closePage: () => void;
    };
  }
}

const CheckoutPage = () => {
  const { items, totalPrice, shippingCost, grandTotal, clearCart, isMinimumOrderMet, shippingState, setShippingState } = useCart();
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();
  const statusUrlRef = useRef('');
  const orderIdRef = useRef<string | null>(null);
  const [hasAcceptedShippingConditions, setHasAcceptedShippingConditions] = useState(false);
  const [showShippingConditions, setShowShippingConditions] = useState(false);
  // Inside the CheckoutPage component, add state to track payment status
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);

  // Ensure minimum order amount is met
  useEffect(() => {
    if (!isMinimumOrderMet) {
      toast.error('Minimum order amount of ₹100 required for checkout', {
        style: {
          backgroundColor: '#fef2f2',
          color: '#b91c1c',
          fontWeight: '500'
        }
      });
      router.push('/');
    }
  }, [isMinimumOrderMet, router]);
  
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: '',
    phone: user?.phone || '',
    address: '',
    city: '',
    state: shippingState,
    postalCode: '',
    country: 'India',
    paymentMethod: 'phonepe' // Only PhonePe payment method available
  });
  
  const [currentStep, setCurrentStep] = useState(1); // 1: Shipping, 2: Payment, 3: Review
  const [isProcessing, setIsProcessing] = useState(false);
  const [isPhonePeScriptLoaded, setIsPhonePeScriptLoaded] = useState(false);

  // Load PhonePe script
  useEffect(() => {
    const script = document.createElement('script');
    script.src = process.env.NODE_ENV === 'production' 
      ? 'https://mercury.phonepe.com/web/bundle/checkout.js' 
      : 'https://mercury-stg.phonepe.com/web/bundle/checkout.js';
    script.async = true;
    script.onload = () => setIsPhonePeScriptLoaded(true);
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === 'state') {
      setShippingState(value);
    }
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(2);
    window.scrollTo(0, 0);
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
    window.scrollTo(0, 0);
  };

  const initiatePhonePePayment = async (orderId: string) => {
    try {
      setIsProcessing(true);
      setIsPaymentProcessing(true); // Add this line
      toast.loading('Preparing PhonePe payment...');
      
      const response = await fetch('/api/payment/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: grandTotal,
          orderId: orderId,
          userId: user?.id
        }),
      });

      const data = await response.json();

      console.log(response, 'Response from payment initiation');

      if (!response.ok) {
        throw new Error(
           data.error || // From your backend's error response
            data.message || // Alternative error field
        'Failed to initiate PhonePe payment'
        );
      }
      
      toast.dismiss();
      
      if (data.data.success && data.data.redirectUrl) {
        statusUrlRef.current = data.data.checkStatusUrl;
        router.push(data.data.redirectUrl);
        // Instead of router.push, use window.location to fully navigate away
        // window.location.href = data.data.redirectUrl;
      } else {
        throw new Error(data.message || 'Payment initiation failed');
      }
    } catch (error: any) {
      toast.dismiss();
      toast.error(error.message || 'Failed to initiate payment');
      console.error('Payment error:', error);
      setIsProcessing(false);
      setIsPaymentProcessing(false); // Add this line
    }
  };
  
//   const phonePeCallback = async (response: string) => {
//     if (response === 'USER_CANCEL') {
//       toast.error('Payment was cancelled by user');
//       setIsProcessing(false);
//     } else if (response === 'CONCLUDED') {
//       try {
//         const urlToUse = statusUrlRef.current;
//         const orderId = orderIdRef.current;
//         console.log(urlToUse, 'Status URL for verification');
        
//         if (!urlToUse) {
//           throw new Error('Payment verification URL not available');
//         }

//         toast.loading('Payment completed! Verifying...');
//         const statusResponse = await fetch(urlToUse);
        
//         if (!statusResponse.ok) {
//           throw new Error('Failed to verify payment status');
//         }

//         const statusData = await statusResponse.json();
//         toast.dismiss();

//         if (statusData.success && statusData.data.status === 'SUCCESS') {
//           toast.success('Payment successful! Your order is confirmed.');
//           router.push(`/order-confirmation/${orderId}`);
//         } else {
//           toast.error('Payment verification failed. Please contact support.');
//           setIsProcessing(false);
//         }
//       } catch (error: any) {
//         toast.dismiss();
//         toast.error(error.message || 'Error verifying payment');
//         setIsProcessing(false);
//       }
//     }
//  };

  const handlePlaceOrder = async () => {
    if (!isAuthenticated) {
      toast.error('Please login to place an order');
      router.push('/auth');
      return;
    }
    
    if (!hasAcceptedShippingConditions) {
      toast.error('Please accept the shipping conditions to proceed');
      return;
    }
    
    try {
      // Show loading state
      const loadingToast = toast.loading('Creating your order...');
     
      const orderData = {
        userId: user?.id,
        customer: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone
        },
        items: items.map(item => ({
          productId: item._id,
          name: item.name,
          quantity: item.quantity,
          price: item.price,
          image: item.image
        })),
        shippingCost: shippingCost,
        totalAmount: grandTotal,
        paymentMethod: formData.paymentMethod,
        paymentStatus: 'pending',
        shippingAddress: {
          address: formData.address,
          city: formData.city,
          state: formData.state,
          postalCode: formData.postalCode,
          country: formData.country
        }
      };

      // Create the order first
      const orderResponse = await fetch('/api/orders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }

      const createdOrder = await orderResponse.json();
      
      orderIdRef.current = createdOrder.orderId;

      // Dismiss loading toast
      toast.dismiss(loadingToast);
      
      // Initiate PhonePe payment
      await initiatePhonePePayment(createdOrder.orderId);
      
    } catch (error: any) {
      toast.error(error.message || 'Failed to place order');
      console.error('Order error:', error);
      setIsProcessing(false);
    }
  };

  // Shipping Conditions Dialog
  const ShippingConditionsDialog = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold">Shipping Conditions</h2>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-brown-900 mb-2">Dispatch Schedule</h3>
              <p className="text-gray-700">
                Orders are dispatched on <strong>Monday, Wednesday, and Saturday</strong> (excluding second Saturdays of the month).
              </p>
            </div>
            
            <div>
              <h3 className="font-medium text-brown-900 mb-2">Domestic Shipping</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Kerala:</strong> Orders will be delivered within 1-2 business days</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>Other States:</strong> Orders will be delivered within 5-10 business days</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-medium text-brown-900 mb-2">Return Policy</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span><strong>48-hour return window</strong> (strictly enforced)</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Returns are accepted <strong>only if the package is damaged</strong> or defective</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Only <strong>unused, unopened</strong> products in original packaging</span>
                </li>
                <li className="flex items-start">
                  <span className="mr-2">•</span>
                  <span>Refunds are provided only for damaged or defective products</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <Button
            variant="primary"
            onClick={() => {
              setShowShippingConditions(false);
              setHasAcceptedShippingConditions(true);
            }}
          >
            I Accept These Conditions
          </Button>
        </div>
      </div>
    </div>
  );

  // At the beginning of the return statement, add this condition
  if (isPaymentProcessing) {
    return <PaymentProcessing />;
  } else {
    return (
      <ProtectedRoute>
        <div className="bg-gray-50 min-h-screen py-8">
          <div className="container mx-auto px-4">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>
  
            <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 overflow-x-auto">  
              {[1, 2, 3].map((step) => (
              <React.Fragment key={step}>
                  <div className="flex items-center flex-shrink-0">
                    <div 
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        currentStep >= step ? 'bg-red-900 text-white' : 'bg-gray-200 text-gray-600'
                      }`}
                    >
                      {step}
                    </div>
                    <div 
                      className={`ml-2 text-sm md:text-base ${
                        currentStep >= step ? 'text-gray-900 font-medium' : 'text-gray-500'
                      }`}
                    >
                      {step === 1 && 'Shipping'}
                      {step === 2 && 'Payment'}
                      {step === 3 && 'Review'}
                    </div>
                  </div>
                  {step < 4 && (
                    <div 
                      className={`hidden sm:block flex-1 mx-2 md:mx-4 h-1 ${
                        currentStep > step ? 'bg-red-900' : 'bg-gray-200'
                      }`}
                    ></div>
                  )}
                </React.Fragment>
              ))}
              </div>
  
              {/* Mobile progress indicator (alternative to the connecting lines) */}
              <div className="sm:hidden mt-4 w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-red-900 h-2 rounded-full" 
                  style={{ width: `${(currentStep - 1) * 33.33}%` }}
                ></div>
              </div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                {/* Step 1: Shipping */}
                {currentStep === 1 && (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold">Shipping Information</h2>
                    </div>
                    
                    <div className="p-6">
                      <form onSubmit={handleShippingSubmit}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Full Name
                            </label>
                            <input 
                              type="text" 
                              name="name" 
                              className="input-field w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                              value={formData.name}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Phone Number
                            </label>
                            <input 
                              type="tel" 
                              name="phone" 
                              className="input-field w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                              value={formData.phone}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Email Address
                            </label>
                            <input 
                              type="email" 
                              name="email" 
                              className="input-field w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                              value={formData.email}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Street Address
                            </label>
                            <input 
                              type="text" 
                              name="address" 
                              className="input-field w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                              value={formData.address}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              City
                            </label>
                            <input 
                              type="text" 
                              name="city" 
                              className="input-field w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                              value={formData.city}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              State
                            </label>
                            <select
                              name="state"
                              className="input-field w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                              value={formData.state}
                              onChange={handleInputChange}
                              required
                            >
                              {indianStates.map((stateName) => (
                                <option key={stateName} value={stateName}>
                                  {stateName}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Postal Code
                            </label>
                            <input 
                              type="text" 
                              name="postalCode" 
                              className="input-field w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                              value={formData.postalCode}
                              onChange={handleInputChange}
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Country
                            </label>
                            <select 
                              name="country" 
                              className="input-field w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                              value={formData.country}
                              onChange={handleInputChange}
                              required
                            >
                              <option value="India">India</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="mt-8 flex justify-between">
                          <Button 
                            type="button" 
                            variant='outline'
                            className="flex items-center text-red-900 hover:text-red-700"
                            onClick={() => router.push('/cart')}
                          >
                            <ArrowLeft size={16} className="mr-1" />
                            Back to Cart
                          </Button>
                          <Button 
                            variant='primary'
                            type="submit" 
                            className="btn-primary"
                          >
                            Continue to Payment
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                
                {/* Step 2: Payment - Only PhonePe shown */}
                {currentStep === 2 && (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold">Payment Method</h2>
                    </div>
                    
                    <div className="p-6">
                      <form onSubmit={handlePaymentSubmit}>
                        <div className="space-y-4">
                          <div className="border border-gray-200 rounded-md p-4 bg-gray-50">
                            <div className="flex items-center">
                              <input 
                                type="radio" 
                                name="paymentMethod" 
                                value="phonepe" 
                                checked
                                className="h-4 w-4 text-red-900 focus:ring-red-500"
                                readOnly
                              />
                              <div className="ml-3">
                                <span className="block text-sm font-medium text-gray-700">PhonePe Payment</span>
                                <span className="block text-xs text-gray-500">Pay via UPI, Credit/Debit Cards, Net Banking</span>
                              </div>
                              <div className="ml-auto">
                                <CreditCard size={24} className="text-gray-400" />
                              </div>
                            </div>
                          </div>
                          
                          <div className="bg-blue-50 p-4 rounded-md border border-blue-100">
                            <p className="text-sm text-blue-800">
                              You'll be securely redirected to PhonePe to complete your payment.
                              After successful payment, you'll be returned to our site.
                            </p>
                          </div>
                        </div>
                        
                        <div className="mt-8 flex justify-between">
                          <Button
                            variant='outline' 
                            type="button" 
                            className="flex items-center text-red-900 hover:text-red-700"
                            onClick={() => setCurrentStep(1)}
                          >
                            <ArrowLeft size={16} className="mr-1" />
                            Back to Shipping
                          </Button>
                          <Button
                            variant='primary' 
                            type="submit" 
                            className="btn-primary"
                          >
                            Continue to Review
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                
                {/* Step 3: Review */}
                {currentStep === 3 && (
                  <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="p-6 border-b border-gray-200">
                      <h2 className="text-lg font-semibold">Review Your Order</h2>
                    </div>
                    
                    <div className="p-6">
                      <div className="mb-6">
                        <h3 className="text-md font-medium mb-3">Shipping Information</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p className="mb-1"><span className="font-medium">Name:</span> {formData.name}</p>
                          <p className="mb-1"><span className="font-medium">Email:</span> {formData.email}</p>
                          <p className="mb-1"><span className="font-medium">Phone:</span> {formData.phone}</p>
                          <p className="mb-1">
                            <span className="font-medium">Address:</span> {formData.address}, {formData.city}, {formData.state}, {formData.postalCode}, {formData.country}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-md font-medium mb-3">Payment Method</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <p>PhonePe Payment</p>
                          <p className="text-sm text-gray-500 mt-1">You'll complete payment on PhonePe's secure platform</p>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <h3 className="text-md font-medium mb-3">Order Items</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="divide-y divide-gray-200">
                            {items.map(item => (
                              <div key={item._id} className="py-3 flex items-center">
                                <img 
                                  src={item.image} 
                                  alt={item.name} 
                                  className="w-16 h-16 object-cover rounded-md mr-4"
                                />
                                <div className="flex-1">
                                  <p className="font-medium">{item.name}</p>
                                  <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
                                </div>
                                <div className="font-semibold">
                                  ₹{(item.price * item.quantity).toFixed(2)}
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                      
                      <div className="mb-8">
                        <h3 className="text-md font-medium mb-3">Order Summary</h3>
                        <div className="bg-gray-50 p-4 rounded-md">
                          <div className="space-y-2">
                            <div className="flex justify-between">
                              <span className="text-gray-600">Subtotal</span>
                              <span>₹{totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Shipping</span>
                              <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-600">Tax</span>
                              <span>Included</span>
                            </div>
                            <div className="border-t border-gray-200 pt-2 mt-2">
                              <div className="flex justify-between font-semibold">
                                <span>Total</span>
                                <span className="text-red-900">₹{grandTotal.toFixed(2)}</span>
                              </div>
                            </div>
                          </div>   
                        </div>
                      </div>
  
                      {/* Shipping Conditions Acceptance */}
                      <div className="mb-6">
                        <div className="flex items-start">
                          <input
                            type="checkbox"
                            id="shippingConditions"
                            checked={hasAcceptedShippingConditions}
                            onChange={(e) => setHasAcceptedShippingConditions(e.target.checked)}
                            className="mt-1 mr-2"
                          />
                          <label htmlFor="shippingConditions" className="text-sm text-gray-700">
                            I accept the shipping and return conditions
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowShippingConditions(true)}
                            className="ml-2 text-red-900 flex items-center text-sm"
                            title="See shipping conditions"
                          >
                            <Info size={16} className="mr-1" />
                            See conditions
                          </button>
                        </div>
                        {!hasAcceptedShippingConditions && (
                          <p className="text-sm text-red-600 mt-1 flex items-center">
                            <AlertCircle size={14} className="mr-1" />
                            You must accept the shipping conditions to proceed
                          </p>
                        )}
                      </div>
                      
                      <div className="flex justify-between">
                        <Button 
                          variant='outline'
                          type="button" 
                          className="flex items-center text-red-900 hover:text-red-700"
                          onClick={() => setCurrentStep(2)}
                        >
                          <ArrowLeft size={16} className="mr-1" />
                          Back to Payment
                        </Button>
                        <Button 
                          variant='primary'
                          type="button" 
                          className="btn-primary"
                          onClick={handlePlaceOrder}
                          disabled={isProcessing || !hasAcceptedShippingConditions}
                        >
                          {isProcessing ? 'Processing...' : 'Pay with PhonePe'}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
              
              {/* Order Summary */}
              <div className="lg:col-span-1">
                <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
                  <div className="p-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold">Order Summary</h3>
                  </div>
                  
                  <div className="p-4">
                    <div className="max-h-64 overflow-y-auto mb-4">
                      {items.map(item => (
                        <div key={item._id} className="flex items-center py-2 border-b border-gray-100">
                          <img 
                            src={item.image} 
                            alt={item.name} 
                            className="w-12 h-12 object-cover rounded-md mr-3"
                          />
                          <div className="flex-1">
                            <p className="text-sm font-medium">{item.name}</p>
                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                          </div>
                          <div className="text-sm font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                      ))}
                    </div>
                    
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Subtotal</span>
                        <span>₹{totalPrice.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Shipping</span>
                        <span>{shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Tax</span>
                        <span>Included</span>
                      </div>
                    </div>
                    
                    <div className="border-t border-gray-200 mt-4 pt-4">
                      <div className="flex justify-between font-semibold">
                        <span>Total</span>
                        <span className="text-red-900">₹{grandTotal.toFixed(2)}</span>
                      </div>
                    </div>
                    
                    <div className="mt-6 space-y-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <Truck size={16} className="mr-2 text-green-600" />
                        <span>{shippingCost === 0 ? 'Free shipping on orders above ₹999' : `Standard shipping: ₹${shippingCost}`}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <ShieldCheck size={16} className="mr-2 text-green-600" />
                        <span>Secure payment processing</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Shipping Conditions Dialog */}
          {showShippingConditions && <ShippingConditionsDialog />}
        </div>
      </ProtectedRoute>
    );
  }
};

export default CheckoutPage;