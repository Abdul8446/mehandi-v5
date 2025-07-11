// lib/api/orders.ts
import { IOrder } from '@/models/Order';

export const fetchOrder = async (orderId: string): Promise<IOrder | null> => {
  console.log('Fetching order with ID:', orderId);
  try {
    const response = await fetch(`/api/orders/${orderId}`);
    if (!response.ok) {
      throw new Error('Order not found');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching order:', error);
    return null;
  }
};

export const updateOrderStatus = async (orderId: string, status: string, trackingId?: string): Promise<IOrder | null> => {
  try {
    const response = await fetch('/api/orders', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ orderId, status, trackingId }),
    });
    if (!response.ok) {
      throw new Error('Failed to update order');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating order:', error);
    return null;
  }
};