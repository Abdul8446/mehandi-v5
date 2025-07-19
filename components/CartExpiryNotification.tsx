// components/CartExpiryNotification.tsx
'use client'

import { useCart } from '@/contexts/CartContext';
import { useEffect } from 'react';
import { toast } from 'react-hot-toast';

const CartExpiryNotification = () => {
  const { isCartExpiringSoon, timeLeft, items } = useCart();

  useEffect(() => {
    if (isCartExpiringSoon && items.length > 0) {
      toast(`Your cart will expire in ${timeLeft} minutes!`, {
        icon: '⏳',
        duration: 5000,
        id: 'cart-expiry-warning'
      });
    }
  }, [isCartExpiringSoon, timeLeft, items.length]);

  return null;
};

export default CartExpiryNotification;