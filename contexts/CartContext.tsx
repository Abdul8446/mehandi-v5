// // contexts/CartContext.tsx
// 'use client'

// import React, { createContext, useState, useContext, useEffect } from 'react';
// import { useAuth } from './AuthContext';

// interface Product {
//   _id: string;
//   name: string;
//   category: string;
//   price: number;
//   image: string;
//   quantity: number;
//   // specifications: {
//   //   weight: number;
//   // };
//   weight: number;
// }

// interface CartContextType {
//   items: Product[];
//   addToCart: (product: Product) => Promise<void>;
//   removeFromCart: (productId: string) => Promise<void>;
//   updateQuantity: (productId: string, quantity: number) => Promise<void>;
//   clearCart: () => Promise<void>;
//   totalItems: number;
//   totalWeight: number;
//   totalPrice: number;
//   shippingCost: number;
//   grandTotal: number;
//   isLoading: boolean;
//   isMinimumOrderMet: boolean;
//   shippingState: string;
//   setShippingState: ( state: string ) => void;
// }

// const CartContext = createContext<CartContextType | undefined>(undefined);

// export const useCart = () => {
//   const context = useContext(CartContext);
//   if (!context) {
//     throw new Error('useCart must be used within a CartProvider');
//   }
//   return context;
// };

// export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [items, setItems] = useState<Product[]>([]);
//   const [isLoading, setIsLoading] = useState(true);
//   const { isAuthenticated, user } = useAuth();
//   const [shippingState, setShippingState] = useState<string>('Kerala');

//   useEffect(() => {
//     const fetchCart = async () => {
//       if (!isAuthenticated || !user?.id) {
//         setItems([]);
//         setIsLoading(false);
//         return;
//       }

//       setIsLoading(true);
//       try {
//         const response = await fetch('/api/cart', {
//           headers: {
//             'Authorization': `Bearer ${user.token}`
//           }
//         });
        
//         if (response.ok) {
//           const data = await response.json();
//           setItems(data.items || []);
//         }
//       } catch (error) {
//         console.error('Failed to fetch cart', error);
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchCart();
//   }, [isAuthenticated, user?.id, user?.token]);

//   const syncCartToServer = async (updatedItems: Product[]) => {
//     if (!isAuthenticated || !user?.id) return;

//     try {
//       await fetch('/api/cart', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${user.token}`
//         },
//         body: JSON.stringify({
//           items: updatedItems.map(item => ({
//             productId: item._id,
//             name: item.name,
//             price: item.price,
//             image: item.image,
//             quantity: item.quantity,
//             weight: item.weight
//           }))
//         }),
//       });
//     } catch (error) {
//       console.error('Failed to sync cart to server', error);
//       throw error; // Re-throw to handle in calling functions
//     }
//   };

//   const addToCart = async (product: Product) => {
//     if (!isAuthenticated) {
//       throw new Error('You must be logged in to add items to cart');
//     }

//     const updatedItems = [...items];
//     const existingItem = updatedItems.find(item => item._id === product._id);
    
//     if (existingItem) {
//       existingItem.quantity += product.quantity || 1;
//     } else {
//       updatedItems.push({ 
//         ...product, 
//         quantity: product.quantity || 1 
//       });
//     }
    
//     setItems(updatedItems);
//     await syncCartToServer(updatedItems);
//   };

//   const removeFromCart = async (productId: string) => {
//     if (!isAuthenticated) {
//       throw new Error('You must be logged in to modify your cart');
//     }

//     const updatedItems = items.filter(item => item._id !== productId);
//     setItems(updatedItems);
//     await syncCartToServer(updatedItems);
//   };

//   const updateQuantity = async (productId: string, quantity: number) => {
//     if (!isAuthenticated) {
//       throw new Error('You must be logged in to modify your cart');
//     }

//     if (quantity <= 0) {
//       await removeFromCart(productId);
//       return;
//     }
    
//     const updatedItems = items.map(item =>
//       item._id === productId ? { ...item, quantity } : item
//     );
    
//     setItems(updatedItems);
//     await syncCartToServer(updatedItems);
//   };

//   const clearCart = async () => {
//     if (!isAuthenticated) {
//       throw new Error('You must be logged in to modify your cart');
//     }

//     setItems([]);
//     try {
//       await fetch('/api/cart', {
//         method: 'DELETE',
//         headers: {
//           'Authorization': `Bearer ${user?.token}`
//         }
//       });
//     } catch (error) {
//       console.error('Failed to clear cart', error);
//       throw error;
//     }
//   };

//   // Calculate cart totals
//   const totalItems = items.reduce((total, item) => total + item.quantity, 0);
//   const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
//   const totalWeight = items.reduce((total, item) => total + (item.weight || 0) * item.quantity, 0);

//   // Check if minimum order amount is met
//   const isMinimumOrderMet = totalPrice >= 0;

//   // Special case: if single product named "test", set grand total to 1
//   const isTestProductSpecialCase = 
//     items.length === 1 && 
//     items[0].name.toLowerCase() === 'test';

//   const shippingCost = isTestProductSpecialCase ? 0 :(shippingState === 'Kerala' ? (totalWeight <= 400 ? 50 : 80): 80);
//   const grandTotal = isTestProductSpecialCase ? 1 : (totalPrice + shippingCost);

//   // const shippingCost = totalWeight <= 400 ? 50 : 80;
//   // const grandTotal = totalPrice + shippingCost;

//   return (
//     <CartContext.Provider
//       value={{
//         items,
//         addToCart,
//         removeFromCart,
//         updateQuantity,
//         clearCart,
//         totalItems,
//         totalWeight,
//         totalPrice,
//         shippingCost,
//         grandTotal,
//         isLoading,
//         isMinimumOrderMet,
//         shippingState,
//         setShippingState
//       }}
//     >
//       {children}
//     </CartContext.Provider>
//   );
// };



// contexts/CartContext.tsx
'use client'

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import { toast } from 'react-hot-toast';

interface Product {
  _id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  quantity: number;
  weight: number;
  stock: number; // Added stock field
  reserved?: number;
}

interface CartContextType {
  items: Product[];
  addToCart: (product: Product) => Promise<void>;
  addToCartLoadingProductId: string | null;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  updateQuantityLoading: boolean;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalWeight: number;
  totalPrice: number;
  shippingCost: number;
  grandTotal: number;
  isLoading: boolean;
  isMinimumOrderMet: boolean;
  shippingState: string;
  setShippingState: (state: string) => void;
  expiresAt: Date | null;
  timeLeft: number; // in minutes
  isCartExpiringSoon: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { isAuthenticated, user } = useAuth();
  const [shippingState, setShippingState] = useState<string>('Kerala');
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isCartExpiringSoon, setIsCartExpiringSoon] = useState(false);
  const [updateQuantityLoading, setUpdateQuantityLoading] = useState(false);
  const [addToCartLoadingProductId, setAddToCartLoadingProductId] = useState<string | null>(null);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkExpiry = () => {
      // Don't show timer if cart is empty or no expiry time is set
      if (items.length === 0 || !expiresAt) {
        const countdownElement = document.getElementById('cart-countdown-display');
        if (countdownElement) {
          countdownElement.remove();
        }
        return;
      }
      
      const now = new Date();
      const diffInMs = expiresAt.getTime() - now.getTime();
      const diffInSeconds = Math.max(0, Math.floor(diffInMs / 1000));
      const diffInMinutes = Math.floor(diffInSeconds / 60);
      const remainingSeconds = diffInSeconds % 60;

      const isCritical = diffInSeconds <= 30;
      
      setTimeLeft(diffInMinutes);
      
      // Update the persistent countdown display
      const countdownElement = document.getElementById('cart-countdown-display');
      if (countdownElement) {
        countdownElement.innerHTML = `
          <div class="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-md p-3 border ${
            isCritical ? 'border-red-500' : 'border-amber-500'
          }">
            <div class="flex items-center gap-2">
              <span class="text-amber-600">⏳ Cart expires in:</span>
              <span class="${
                isCritical ? 'text-red-600 font-bold animate-pulse' : 'text-amber-700 font-bold'
              }">
                ${String(diffInMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        `;
      } else {
        // Create the display if it doesn't exist
        const display = document.createElement('div');
        display.id = 'cart-countdown-display';
        display.innerHTML = `
          <div class="fixed bottom-4 right-4 z-50 bg-white shadow-lg rounded-md p-3 border ${
            isCritical ? 'border-red-500' : 'border-amber-500'
          }">
            <div class="flex items-center gap-2">
              <span class="text-amber-600">⏳ Cart expires in:</span>
              <span class="${
                isCritical ? 'text-red-600 font-bold animate-pulse' : 'text-amber-700 font-bold'
              }">
                ${String(diffInMinutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}
              </span>
            </div>
          </div>
        `;
        document.body.appendChild(display);
      }
      
      if (diffInSeconds <= 0) {
        const countdownElement = document.getElementById('cart-countdown-display');
        if (countdownElement) {
          countdownElement.innerHTML = `
            <div class="fixed top-4 left-4 z-50 bg-white shadow-lg rounded-md p-3 border border-red-500">
              <div class="flex items-center gap-2 text-red-600">
                <span>⚠️ Cart expired</span>
              </div>
            </div>
          `;
          // Remove the display after 5 seconds
          setTimeout(() => {
            countdownElement.remove();
          }, 5000);
        }
        clearCart();
      }
    };
    
    // Only start interval if there are items in cart AND expiry is set
    if (items.length > 0 && expiresAt) {
      interval = setInterval(checkExpiry, 1000);
      checkExpiry();
    } else {
      // Remove timer display if cart is empty or no expiry
      const countdownElement = document.getElementById('cart-countdown-display');
      if (countdownElement) {
        countdownElement.remove();
      }
    }
    
    return () => {
      clearInterval(interval);
      // Don't remove the display when component unmounts to keep it persistent
    };
  }, [expiresAt]);

  const fetchCart = async () => {
    if (!isAuthenticated || !user?.id) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/cart', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        // Fetch stock information for each item
        const itemsWithStock = await Promise.all(
          (data.items || []).map(async (item: Product) => {
            const stockResponse = await fetch(`/api/products/${item._id}/stock`);
            if (stockResponse.ok) {
              const stockData = await stockResponse.json();
              return {
                ...item,
                stock: stockData.stock,
                reserved: stockData.reserved || 0
              };
            }
            return item;
          })
        );

        setItems(itemsWithStock);

        // Only set expiry if it exists on server
        if (data.expiresAt) {
          setExpiresAt(new Date(data.expiresAt));
        } 
      }
    } catch (error) {
      console.error('Failed to fetch cart', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, [isAuthenticated, user?.id, user?.token]);

  const syncCartToServer = async (updatedItems: Product[]) => {
    if (!isAuthenticated || !user?.id) return;

    try {
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({
          items: updatedItems.map(item => ({
            _id: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            weight: item.weight
          })),
          // Only include expiresAt if it's already set
          ...(expiresAt && { expiresAt: expiresAt.toISOString() })
        }),
      });
    } catch (error) {
      console.error('Failed to sync cart to server', error);
      throw error;
    }
  };

  const addToCart = async (product: Product) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to add items to cart');
    }
    setAddToCartLoadingProductId(product._id);

    // Check stock availability
    const stockResponse = await fetch(`/api/products/${product._id}/stock`);
    const stockData = await stockResponse.json();
    const availableStock = stockData.stock - (stockData.reserved || 0);
    
    const requestedQuantity = product.quantity || 1;

    if (availableStock < requestedQuantity) {
      toast.error(`Only ${availableStock} items available in stock`);
      // throw new Error(`Only ${availableStock} items available in stock`);
      return
    }

    const updatedItems = [...items];
    const existingItem = updatedItems.find(item => item._id === product._id);
    const existingQuantity = existingItem?.quantity || 0;
    const quantityToReserve = existingItem ? requestedQuantity : requestedQuantity;

    // Set new expiry time if cart is empty (adding first item)
    const shouldSetNewExpiry = items.length === 0;
    const newExpiry = new Date(new Date().getTime() + 60 * 60000); // 30 minutes from now

    if (existingItem) {
      existingItem.quantity += requestedQuantity;
      existingItem.reserved = (existingItem.reserved || 0) + quantityToReserve;
    } else {
      updatedItems.push({ 
        ...product, 
        quantity: requestedQuantity,
        reserved: quantityToReserve,
        stock: availableStock // Store available stock for reference
      });
    }
    
    setItems(updatedItems);

    if (shouldSetNewExpiry) {
      setExpiresAt(newExpiry);
    }

    try {
      // Only reserve the additional quantity needed
      if (quantityToReserve > 0) {
        await fetch(`/api/products/${product._id}/stock`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          },
          body: JSON.stringify({
            quantity: quantityToReserve,
            action: 'reserve'
          })
        });
      } 

       // Only pass new expiry if we're setting it fresh
      if (shouldSetNewExpiry) {
        await fetch('/api/cart', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          },
          body: JSON.stringify({
            items: updatedItems.map(item => ({
              _id: item._id,
              name: item.name,
              price: item.price,
              image: item.image,
              quantity: item.quantity,
              weight: item.weight
            })),
            expiresAt: newExpiry.toISOString()
          }),
        });
      } else {
        await syncCartToServer(updatedItems);
      }
    } catch (error) {
      // Revert local changes if server update fails
      console.error(`Failed to reserve stock for product ${product._id}`, error);
      setItems(items);
      throw error;
    } finally {
      setAddToCartLoadingProductId(null);
    }

    
    // Show expiry toast only when adding first item
    if (shouldSetNewExpiry) {
      toast.success('Item added to cart. Cart will expire in 60 minutes.', {
        duration: 4000,
      });
    } else {
      toast.success('Item added to cart.');
    }
  };

  const removeFromCart = async (productId: string) => {
    console.log('remove clicked')
    if (!isAuthenticated) {
      throw new Error('You must be logged in to modify your cart');
    }

    const itemToRemove = items.find(item => item._id === productId);
    if (!itemToRemove) return;

    const updatedItems = items.filter(item => item._id !== productId);
    setItems(updatedItems);
    
    // Release reserved stock
    try {
      await fetch(`/api/products/${productId}/stock`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          quantity: itemToRemove.quantity,
          action: 'release'
        })
      });
    } catch (error) {
      console.error('Failed to release stock', error);
    }
    
    await syncCartToServer(updatedItems);

    // Clear expiry if cart is now empty
    if (updatedItems.length === 0) {
      setExpiresAt(null);
      // Also clear from server
      await fetch('/api/cart', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        },
        body: JSON.stringify({
          items: [],
          expiresAt: null
        }),
      });
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    setUpdateQuantityLoading(true);

    if (!isAuthenticated) {
      throw new Error('You must be logged in to modify your cart');
    }

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    
    const itemToUpdate = items.find(item => item._id === productId);
    if (!itemToUpdate) return;

    // Check stock availability for increase
    const quantityDifference = quantity - itemToUpdate.quantity;
    console.log(quantity,'quantity',itemToUpdate.quantity,'itemToUpdate.quantity')
    if (quantityDifference > 0) {
      const stockResponse = await fetch(`/api/products/${productId}/stock`);
      const stockData = await stockResponse.json();
      const availableStock = stockData.stock - (stockData.reserved || 0);
    
      if (availableStock < quantityDifference) {
        toast.error(`Only ${availableStock} items available in stock`);
        // throw new Error(`Only ${availableStock} items available in stock`);
        setUpdateQuantityLoading(false);
        return
      }
    }
    

    const updatedItems = items.map(item =>
      item._id === productId ? { ...item, quantity, reserved: ( item.reserved || 0 ) + quantityDifference} : item
    );
    
    setItems(updatedItems);

    try {
      // Update reserved stock based on quantity difference
      if (quantityDifference !== 0) {
        await fetch(`/api/products/${productId}/stock`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          },
          body: JSON.stringify({
            quantity: Math.abs(quantityDifference),
            action: quantityDifference > 0 ? 'reserve' : 'release'
          })
        });
      }
      
      await syncCartToServer(updatedItems);
    } catch (error) {
      // Revert local changes if server update fails
      setItems(items);
      throw error;
    }

    setUpdateQuantityLoading(false);
  };

  // const clearCart = async () => {
  //   console.log('clear cart called')
  //   if (!isAuthenticated) {
  //     throw new Error('You must be logged in to modify your cart');
  //   }

  //   //create a copy of the items array
  //   const currentItems = [...items];
  //   console.log(currentItems, 'currentItems')

  //   if(currentItems.length === 0) {
  //     console.warn('Cart is already empty')
  //     return
  //   }

  //    // 1. Handle stock changes for successful orders
  //   await Promise.all(items.map(async (item) => {
  //     console.log(item, 'stock item')
  //     try {
  //       await fetch(`/api/products/${item._id}/stock`, {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${user?.token}`
  //         },
  //         body: JSON.stringify({
  //           quantity: item.quantity,
  //           action: 'fulfill-order'
  //         })
  //       });
  //     } catch (error) {
  //       console.error(`Failed to update stock for product ${item._id}`, error);
  //       throw new Error(`Inventory update failed for ${item.name}`);
  //     }
  //   }));

  //   // 2. Always release reservations (for both order completion and cart clearing)
  //   await Promise.all(items.map(async (item) => {
  //     console.log(item, 'item')
  //     try {
  //       await fetch(`/api/products/${item._id}/stock`, {
  //         method: 'PUT',
  //         headers: {
  //           'Content-Type': 'application/json',
  //           'Authorization': `Bearer ${user?.token}`
  //         },
  //         body: JSON.stringify({
  //           quantity: item.quantity,
  //           action: 'release'
  //         })
  //       });
  //     } catch (error) {
  //       console.error(`Failed to release reservation for ${item.name}`, error);
  //       // Don't throw - we still want to clear the cart
  //     }
  //   })).then(() => {
  //     // 3. Clear local state
  //     setItems([]);
  //     setExpiresAt(null);
  //     setIsCartExpiringSoon(false);
  //     // 3. Clear cart from server
  //     return fetch('/api/cart', {
  //       method: 'DELETE',
  //       headers: {
  //         'Authorization': `Bearer ${user?.token}`
  //       }
  //     });
  //   });
  // };

  // Calculate cart totals
 
  const clearCart = async () => {
    console.log('clear cart called');
    if (!isAuthenticated) {
      throw new Error('You must be logged in to modify your cart');
    }

    // Create a local copy of items before any async operations
    const currentItems = [...items];
    console.log('Current items:', currentItems);

    if (currentItems.length === 0) {
      console.warn('Attempted to clear empty cart');
      return;
    }

    try {
      // 1. Process stock updates
      await Promise.all(currentItems.map(async (item) => {
        console.log('Processing stock for:', item._id);
        const response = await fetch(`/api/products/${item._id}/stock`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          },
          body: JSON.stringify({
            quantity: item.quantity,
            action: 'fulfill-order'
          })
        });
        
        if (!response.ok) {
          throw new Error(`Stock update failed for ${item.name}`);
        }
        return response.json();
      }));

      // 2. Release reservations
      await Promise.all(currentItems.map(async (item) => {
        console.log('Releasing reservation for:', item._id);
        const response = await fetch(`/api/products/${item._id}/stock`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user?.token}`
          },
          body: JSON.stringify({
            quantity: item.quantity,
            action: 'release'
          })
        });
        
        if (!response.ok) {
          console.error(`Reservation release failed for ${item.name}`);
        }
      }));

      // 3. Clear server cart
      const deleteResponse = await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (!deleteResponse.ok) {
        throw new Error('Failed to clear server cart');
      }

      // 4. Update state only after all operations complete
      setItems([]);
      setExpiresAt(null);
      setIsCartExpiringSoon(false);

      console.log('Cart cleared successfully');
    } catch (error) {
      console.error('Clear cart error:', error);
      throw error;
    }
  };
 
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalWeight = items.reduce((total, item) => total + (item.weight || 0) * item.quantity, 0);

  // Check if minimum order amount is met
  const isMinimumOrderMet = totalPrice >= 0;

  const isTestProductSpecialCase = 
    items.length === 1 && 
    items[0].name.toLowerCase() === 'test';

  const shippingCost = isTestProductSpecialCase ? 0 : (shippingState === 'Kerala' ? (totalWeight <= 400 ? 50 : 80) : 80);
  const grandTotal = isTestProductSpecialCase ? 1 : (totalPrice + shippingCost);

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        addToCartLoadingProductId,
        removeFromCart,
        updateQuantity,
        updateQuantityLoading,
        clearCart,
        totalItems,
        totalWeight,
        totalPrice,
        shippingCost,
        grandTotal,
        isLoading,
        isMinimumOrderMet,
        shippingState,
        setShippingState,
        expiresAt,
        timeLeft,
        isCartExpiringSoon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};