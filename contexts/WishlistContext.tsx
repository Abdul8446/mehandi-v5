// 'use client'

// import React, { createContext, useState, useContext, useEffect } from 'react';

// interface Product {
//   _id: string;
//   name: string;
//   price: number;
//   image: string;
// }

// interface WishlistContextType {
//   items: Product[];
//   addToWishlist: (product: Product) => void;
//   removeFromWishlist: (productId: string) => void;
//   isInWishlist: (productId: string) => boolean;
//   clearWishlist: () => void;
// }

// const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

// export const useWishlist = () => {
//   const context = useContext(WishlistContext);
//   if (!context) {
//     throw new Error('useWishlist must be used within a WishlistProvider');
//   }
//   return context;
// };

// export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
//   const [items, setItems] = useState<Product[]>([]);

//   useEffect(() => {
//     const savedWishlist = localStorage.getItem('wishlist');
//     if (savedWishlist) {
//       try {
//         setItems(JSON.parse(savedWishlist));
//       } catch (error) {
//         console.error('Failed to parse wishlist from localStorage', error);
//       }
//     }
//   }, []);

//   useEffect(() => {
//     localStorage.setItem('wishlist', JSON.stringify(items));
//   }, [items]);

//   const addToWishlist = (product: Product) => {
//     setItems(prevItems => {
//       const existingItem = prevItems.find(item => item._id === product._id);
//       if (existingItem) {
//         return prevItems;
//       }
//       return [...prevItems, product];
//     });
//   };

//   const removeFromWishlist = (productId: string) => {
//     setItems(prevItems => prevItems.filter(item => item._id !== productId));
//   };

//   const isInWishlist = (productId: string) => {
//     return items.some(item => item._id === productId);
//   };

//   const clearWishlist = () => {
//     setItems([]);
//   };

//   return (
//     <WishlistContext.Provider
//       value={{
//         items,
//         addToWishlist,
//         removeFromWishlist,
//         isInWishlist,
//         clearWishlist,
//       }}
//     >
//       {children}
//     </WishlistContext.Provider>
//   );
// };

'use client';

import { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';
import { is } from 'date-fns/locale';

interface WishlistItem {
  productId: string;
  _id: string;
  name: string;
  price: number;
  image: string;
}

interface WishlistContextType {
  items: WishlistItem[];
  isInWishlist: (productId: string) => boolean;
  addToWishlist: (product: WishlistItem) => Promise<void>;
  removeFromWishlist: (productId: string) => Promise<void>;
  isLoading: boolean;
}

const WishlistContext = createContext<WishlistContextType>({
  items: [],
  isInWishlist: () => false,
  addToWishlist: async () => {},
  removeFromWishlist: async () => {},
  isLoading: false,
});

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<WishlistItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { isAuthenticated, user } = useAuth();

  const fetchWishlist = async () => {
    if (!isAuthenticated || !user?.id) return;
    
    try {
      setIsLoading(true);
      const response = await fetch('/api/wishlist', {
        headers: {
          'Authorization': `Bearer ${user.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch wishlist');
      
      const data = await response.json();
      setItems(data.items.map((item: any) => ({
        ...item,
        _id: item.productId // Map productId to _id for consistency
      })));
    } catch (error) {
      console.error('Error fetching wishlist:', error);
      toast.error('Failed to load wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [isAuthenticated, user?.id, user?.token]);

  const isInWishlist = (productId: string) => {
    return items.some(item => item.productId === productId);
  };

  const addToWishlist = async (product: WishlistItem) => {
    if (!isAuthenticated || !user?.id) {
      toast.error('Please login to add to wishlist');
      return;
    }

    try {
      setIsLoading(true);
      const response = await fetch('/api/wishlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ product })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add to wishlist');
      }

      const data = await response.json();
      setItems(data.map((item: any) => ({
        ...item,
        _id: item.productId
      })));
      toast.success('Added to wishlist');
    } catch (error: any) {
      console.error('Error adding to wishlist:', error);
      toast.error(error.message || 'Failed to add to wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  const removeFromWishlist = async (productId: string) => {
    if (!isAuthenticated || !user?.id) return;

    try {
      setIsLoading(true);
      const response = await fetch('/api/wishlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
        body: JSON.stringify({ productId })
      });

      if (!response.ok) {
        throw new Error('Failed to remove from wishlist');
      }

      const data = await response.json();
      setItems(data.map((item: any) => ({
        ...item,
        _id: item.productId
      })));
      toast.success('Removed from wishlist');
    } catch (error) {
      console.error('Error removing from wishlist:', error);
      toast.error('Failed to remove from wishlist');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        items,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        isLoading,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};