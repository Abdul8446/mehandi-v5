'use client'
import { useState } from 'react';
import { IOrder } from '@/models/Order';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

type Props = {
  order: IOrder;
  isOpen: boolean;
  onClose: () => void;
  refreshOrders: () => void;
};

export default function HandOverToPostOfficeModal({ order, isOpen, onClose, refreshOrders }: Props) {
  const [trackingId, setTrackingId] = useState('');
  const [hasSentMessage, setHasSentMessage] = useState(false);  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  console.log(order, 'order');

  const generatedMessage = `Hi ${order.customer.name}, your order #${order.orderId} has been shipped. Tracking ID: ${trackingId || '[TRACKING_ID]'}. You can track your package at [TRACKING_URL].`;

  const handleSubmit = async () => {
    if (!trackingId || !hasSentMessage) {
      setError('Please enter tracking ID and confirm you sent the message');
      return;
    }
    
    try {
      setIsSubmitting(true);
      setError('');
      
      // Update order status via API
      await axios.put(`/api/orders/${order.orderId}/ship`, {
        trackingNumber: trackingId,
        status: 'Shipped'
      });
      
      // Refresh data and close modal
      refreshOrders();
      onClose();
    } catch (error) {
      console.error('Failed to update order status:', error);
      setError('Failed to update order status. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-xl font-bold">Hand Over to Post Office</h2>
            <button 
              onClick={onClose} 
              className="text-gray-500 hover:text-gray-700"
              disabled={isSubmitting}
            >
              &times;
            </button>
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Order Details</h3>
            <p>Order ID: #{order.orderId}</p>
            <p>Customer: {order.customer.name}</p>
            <p>Items: {order.items.length}</p>
            <p>Total: {order.totalAmount}</p>
          </div>

          <div className="mb-6">
            <label htmlFor="trackingId" className="block text-sm font-medium text-gray-700 mb-1">
              Tracking ID *
            </label>
            <input
              type="text"
              id="trackingId"
              value={trackingId}
              onChange={(e) => setTrackingId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="mb-6">
            <h3 className="font-medium mb-2">Customer Notification</h3>
            <p className="text-sm text-gray-600 mb-2">
              Copy this message to send via WhatsApp/SMS:
            </p>
            <div className="bg-gray-100 p-4 rounded-md mb-4">
              <pre className="whitespace-pre-wrap text-sm">{generatedMessage}</pre>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={() => {
                  navigator.clipboard.writeText(generatedMessage);
                  toast.success('Message copied to clipboard!');
                  // Optional: Add toast notification here
                }}
                className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
                disabled={isSubmitting}
              >
                Copy Message
              </button>
              <a
                href={`https://wa.me/91${order.customer.phone}?text=${encodeURIComponent(generatedMessage)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 disabled:opacity-50"
                onClick={(e) => {
                  if (!trackingId) {
                    e.preventDefault();
                    setError('Please enter tracking ID first');
                  }
                }}
              >
                Open WhatsApp
              </a>
              <a
                href={`sms:${order.customer.phone}?body=${encodeURIComponent(generatedMessage)}`}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50"
                onClick={(e) => {
                  if (!trackingId) {
                    e.preventDefault();
                    setError('Please enter tracking ID first');
                  }
                }}
              >
                Open SMS
              </a>
            </div>
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={hasSentMessage}
                onChange={(e) => setHasSentMessage(e.target.checked)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                disabled={isSubmitting}
              />
              <span className="ml-2 text-sm text-gray-700">
                I have sent the tracking ID manually to the customer
              </span>
            </label>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md text-sm">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-3">
            <button
              onClick={onClose}
              disabled={isSubmitting}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={!trackingId || !hasSentMessage || isSubmitting}
              className={`px-4 py-2 rounded-md text-white ${
                !trackingId || !hasSentMessage || isSubmitting
                  ? 'bg-indigo-300 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {isSubmitting ? 'Processing...' : 'Mark as Shipped'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}