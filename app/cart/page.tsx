'use client'

import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { useCart } from '@/contexts/CartContext';
import Image from 'next/image';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProtectedRoute from '@/components/ProtectedRoute';

const Cart = () => {
  const { 
    items,
    removeFromCart, 
    updateQuantity, 
    totalItems, 
    totalWeight,
    totalPrice,
    shippingCost,
    grandTotal
  } = useCart();

  console.log(totalWeight, 'totalWeight');
 

  if (items.length === 0) {
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
          <h1 className="text-2xl font-bold text-gray-800 mb-6">Your Cart ({totalItems} items)</h1>
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
                              className="w-8 h-8 rounded-l-md border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              onClick={() => updateQuantity(item._id, item.quantity - 1)}
                            >
                              <Minus size={14} />
                            </button>
                            <input 
                              type="number" 
                              min="1" 
                              value={item.quantity} 
                              onChange={(e) => updateQuantity(item._id, parseInt(e.target.value) || 1)}
                              className="w-12 h-8 border-t border-b border-gray-300 text-center focus:outline-none"
                            />
                            <button 
                              className="w-8 h-8 rounded-r-md border border-gray-300 flex items-center justify-center hover:bg-gray-100"
                              onClick={() => updateQuantity(item._id, item.quantity + 1)}
                            >
                              <Plus size={14} />
                            </button>
                          </div>
                          <div className="text-lg font-semibold">
                            ₹{(item.price * item.quantity).toFixed(2)}
                          </div>
                        </div>
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
                        `Add ₹${(999 - totalPrice).toFixed(2)} more for free shipping`
                      }
                    </p>
                  </div>
                  
                  <Link href="/checkout" className="w-full btn-primary block text-center mt-6">
                    <Button className='w-full' variant='secondary'>
                      Proceed to Checkout
                    </Button>
                  </Link>
                  
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