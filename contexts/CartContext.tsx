'use client'

import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

interface Product {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  // specifications: {
  //   weight: number;
  // };
  weight: number;
}

interface CartContextType {
  items: Product[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  totalItems: number;
  totalWeight: number;
  totalPrice: number;
  shippingCost: number;
  grandTotal: number;
  isLoading: boolean;
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

  useEffect(() => {
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
          setItems(data.items || []);
        }
      } catch (error) {
        console.error('Failed to fetch cart', error);
      } finally {
        setIsLoading(false);
      }
    };

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
            productId: item._id,
            name: item.name,
            price: item.price,
            image: item.image,
            quantity: item.quantity,
            weight: item.weight
          }))
        }),
      });
    } catch (error) {
      console.error('Failed to sync cart to server', error);
      throw error; // Re-throw to handle in calling functions
    }
  };

  const addToCart = async (product: Product) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to add items to cart');
    }

    const updatedItems = [...items];
    const existingItem = updatedItems.find(item => item._id === product._id);
    
    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      updatedItems.push({ 
        ...product, 
        quantity: product.quantity || 1 
      });
    }
    
    setItems(updatedItems);
    await syncCartToServer(updatedItems);
  };

  const removeFromCart = async (productId: string) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to modify your cart');
    }

    const updatedItems = items.filter(item => item._id !== productId);
    setItems(updatedItems);
    await syncCartToServer(updatedItems);
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to modify your cart');
    }

    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    
    const updatedItems = items.map(item =>
      item._id === productId ? { ...item, quantity } : item
    );
    
    setItems(updatedItems);
    await syncCartToServer(updatedItems);
  };

  const clearCart = async () => {
    if (!isAuthenticated) {
      throw new Error('You must be logged in to modify your cart');
    }

    setItems([]);
    try {
      await fetch('/api/cart', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
    } catch (error) {
      console.error('Failed to clear cart', error);
      throw error;
    }
  };

  // Calculate cart totals
  const totalItems = items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const totalWeight = items.reduce((total, item) => total + (item.weight || 0) * item.quantity, 0);

  // Special case: if single product named "test", set grand total to 1
  const isTestProductSpecialCase = 
    items.length === 1 && 
    items[0].name.toLowerCase() === 'test';

  const shippingCost = isTestProductSpecialCase ? 0 : (totalWeight <= 400 ? 50 : 80);
  const grandTotal = isTestProductSpecialCase ? 1 : (totalPrice + shippingCost);

  // const shippingCost = totalWeight <= 400 ? 50 : 80;
  // const grandTotal = totalPrice + shippingCost;

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalItems,
        totalWeight,
        totalPrice,
        shippingCost,
        grandTotal,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};