// app/cart/page.tsx
'use client'

import { Trash2, Plus, Minus, ShoppingBag, ArrowRight, Clock } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/ProtectedRoute';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const Cart = () => {
  const { 
    items,
    removeFromCart, 
    updateQuantity, 
    updateQuantityLoading,
    totalItems, 
    totalWeight,
    totalPrice,
    shippingCost,
    grandTotal,
    isMinimumOrderMet,
    isLoading,
    expiresAt,
    timeLeft,
    isCartExpiringSoon
  } = useCart();

  useEffect(() => {
    if (isCartExpiringSoon && items.length > 0) {
      toast(`Your cart will expire in ${timeLeft} minutes!`, {
        icon: '⏳',
        duration: 5000,
      });
    }
  }, [isCartExpiringSoon, timeLeft, items.length]);



  if(isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isLoading && items.length === 0) {
    return (
      <ProtectedRoute>
        <div className="bg-gray-50 min-h-screen relative flex">
          <div className="container mx-auto my-auto px-4">
            <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center py-20">
              <div className="w-20 h-20 bg-brown-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <ShoppingBag size={32} className="text-brown-900" />
              </div>
              <h1 className="text-2xl font-bold mb-4">Your Cart is Empty</h1>
              <p className="text-gray-600 mb-6">Looks like you haven't added any products to your cart yet.</p>
              <Button variant='primary'>
                <Link href="/shop" className="btn-primary inline-flex items-center">
                  Continue Shopping <ArrowRight size={16} className="ml-2" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
      <div className="bg-gray-50 min-h-screen py-20">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-gray-800">Your Cart ({totalItems} items)</h1>
            {expiresAt && (
              <div className={`flex items-center ${isCartExpiringSoon ? 'text-red-600' : 'text-gray-600'}`}>
                <Clock size={18} className="mr-2" />
                <span>Expires in {timeLeft} minutes</span>
              </div>
            )}
          </div>
          
          {isCartExpiringSoon && (
            <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 mb-6 rounded">
              <p className="font-medium">Your cart will expire soon!</p>
              <p>Complete your purchase within {timeLeft} minutes to avoid losing your items.</p>
            </div>
          )}
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Cart Items</h2>
                </div>
                
                <div className="divide-y divide-gray-200">
                  {items.map(item => (
                    <div key={item._id} className="p-6 flex flex-col sm:flex-row">
                      <div className="sm:w-24 sm:h-24 mb-4 sm:mb-0 relative">
                        <Image 
                          src={item.image} 
                          alt={item.name}
                          fill
                          className="object-cover rounded-md"
                        />
                      </div>
                      <div className="sm:ml-6 flex-1">
                        <div className="flex justify-between mb-2">
                          <Link href={`/product/${item._id}`} className="text-lg font-medium text-gray-800 hover:text-red-900">
                            {item.name}
                          </Link>
                          <button 
                            className="text-gray-400 hover:text-red-600"
                            onClick={() => removeFromCart(item._id)}
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                        <p className="text-red-900 font-semibold mb-4">₹{item.price}</p>
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <button 
                              className={`w-8 h-8 rounded-l-md border border-gray-300 flex items-center justify-center hover:bg-gray-100`}
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                              disabled={item.quantity <= 1 || updateQuantityLoading}
                            >
                              <Minus size={14} className={`${item.quantity <= 1 ? 'text-gray-400' : ''}`} />
                            </button>
                            <input 
                              type="text" 
                              // min="1" 
                              value={item.quantity} 
                              disabled
                              className={`w-12 h-8 border-t border-b border-gray-300 text-center ${updateQuantityLoading ? 'bg-gray-100' : ''} focus:outline-none`}
                            />
                            <button 
                              className={`w-8 h-8 rounded-r-md border border-gray-300 flex items-center justify-center ${
                                  (item.stock !== undefined && item.reserved !== undefined && item.stock <= item.reserved) 
                                    ? 'bg-gray-100 cursor-not-allowed' 
                                    : 'hover:bg-gray-100'
                                }`}
                              onClick={() => {
                                if (!(item.stock !== undefined && item.reserved !== undefined && item.stock <= item.reserved)) {
                                  updateQuantity(item._id, item.quantity + 1);
                                }
                              }}
                              disabled={
                                (item.stock !== undefined && item.reserved !== undefined && item.stock <= item.reserved) || 
                                updateQuantityLoading
                              }
                            >
                              <Plus size={14} className={
                                (item.stock !== undefined && item.reserved !== undefined && item.stock <= item.reserved) ? 
                                'text-gray-400' : ''
                              }/>
                            </button>
                          </div>
                          <div className="text-lg font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
                        {/* {item.stock && (
                          <p className="text-sm text-gray-500 mt-2">
                            Available: {item.stock - item.quantity} in stock
                          </p>
                        )} */}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-6 bg-gray-50">
                  <Link href="/shop" className="text-red-900 hover:text-red-700 flex items-center">
                    <Button variant='outline'>
                      <ArrowRight size={16} className="mr-2 transform rotate-180" />
                      Continue Shopping
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
                <div className="p-6 border-b border-gray-200">
                  <h2 className="text-lg font-semibold">Order Summary</h2>
                </div>
                
                <div className="p-6 space-y-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium">
                      {shippingCost === 0 ? 'Free' : `₹${shippingCost.toFixed(2)}`}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Tax</span>
                    <span className="font-medium">Included</span>
                  </div>
                  
                  <div className="border-t border-gray-200 pt-4 mt-4">
                    <div className="flex justify-between text-lg font-semibold">
                      <span>Total</span>
                      <span className="text-red-900">₹{grandTotal.toFixed(2)}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1">
                      {shippingCost === 0 ? 
                        'Free shipping applied' : 
                        `Add ₹${(699 - totalPrice).toFixed(2)} more for free shipping`
                      }
                    </p>
                  </div>
                  
                  <Link href={isMinimumOrderMet ? "/checkout" : "#"} className="w-full btn-primary block text-center mt-6">
                    <Button className='w-full' variant='secondary' disabled={!isMinimumOrderMet}>
                      Proceed to Checkout
                    </Button>
                  </Link>
                  {!isMinimumOrderMet && (
                    <p className="text-sm text-red-600 mt-2 text-center">
                      Minimum order amount of ₹100 required for checkout
                    </p>
                  )}
                  
                  <div className="mt-4 text-xs text-gray-500 text-center">
                    <p>We accept:</p>
                    <div className="flex justify-center space-x-2 mt-2">
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                      <div className="w-10 h-6 bg-gray-200 rounded"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default Cart;