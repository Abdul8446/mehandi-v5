'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './AuthContext';
import { useAdminAuth } from './AdminAuthContext';
import { Booking, BookingStatus } from '@/types/booking';

interface BookingContextType {
  userBookings: Booking[];
  adminBookings: Booking[];
  loading: boolean;
  adminLoading: boolean;
  error: string | null;
  refreshUserBookings: () => Promise<void>;
  refreshAdminBookings: () => Promise<void>;
  cancelBooking: (bookingId: string) => Promise<boolean>;
  updateBookingStatus: (bookingId: string, status: BookingStatus) => Promise<boolean>;
  getBookingById: (id: string) => Booking | undefined;
}

const BookingContext = createContext<BookingContextType>({
  userBookings: [],
  adminBookings: [],
  loading: false,
  adminLoading: false,
  error: null,
  refreshUserBookings: async () => {},
  refreshAdminBookings: async () => {},
  cancelBooking: async () => false,
  updateBookingStatus: async () => false,
  getBookingById: () => undefined,
});

export const BookingProvider = ({ children }: { children: React.ReactNode }) => {
  const [userBookings, setUserBookings] = useState<Booking[]>([]);
  const [adminBookings, setAdminBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(false);
  const [adminLoading, setAdminLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, isAuthenticated } = useAuth();
  const { admin, isAdminAuthenticated } = useAdminAuth();

  const processBookings = (bookings: any[]): Booking[] => {
    return bookings.map(booking => ({
      ...booking,
      date: new Date(booking.date),
      createdAt: new Date(booking.createdAt),
      updatedAt: new Date(booking.updatedAt),
    }));
  };

  const fetchUserBookings = useCallback(async () => {
    if (!isAuthenticated) {
      setUserBookings([]);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/bookings', {
        headers: {
          'Authorization': `Bearer ${user?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch user bookings');
      
      const data = await response.json();
      setUserBookings(processBookings(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unknown error occurred');
      console.error('Error fetching user bookings:', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated, user?.token]);

  const fetchAdminBookings = useCallback(async () => {
    if (!isAdminAuthenticated) {
      setAdminBookings([]);
      return;
    }

    setAdminLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/admin/bookings', {
        headers: {
          'Authorization': `Bearer ${admin?.token}`
        }
      });
      
      if (!response.ok) throw new Error('Failed to fetch admin bookings');
      
      const data = await response.json();
      setAdminBookings(processBookings(data));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An admin error occurred');
      console.error('Error fetching admin bookings:', err);
    } finally {
      setAdminLoading(false);
    }
  }, [isAdminAuthenticated, admin?.token]);

  const cancelBooking = async (bookingId: string) => {
    try {
      const response = await fetch(`/api/bookings/${bookingId}/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user?.token}`
        }
      });

      if (response.ok) {
        await fetchUserBookings();
        if (isAdminAuthenticated) await fetchAdminBookings();
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error cancelling booking:', error);
      return false;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: BookingStatus) => {
    try {
      const response = await fetch(`/api/admin/bookings/${bookingId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${admin?.token}`
        },
        body: JSON.stringify({ status })
      });

      if (response.ok) {
        await Promise.all([
          fetchUserBookings(),
          fetchAdminBookings()
        ]);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error updating booking status:', error);
      return false;
    }
  };

  const getBookingById = useCallback((id: string) => {
    return [...userBookings, ...adminBookings].find(booking => booking._id === id);
  }, [userBookings, adminBookings]);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  useEffect(() => {
    if (isAdminAuthenticated) {
      fetchAdminBookings();
    }
  }, [isAdminAuthenticated, fetchAdminBookings]);

  return (
    <BookingContext.Provider 
      value={{ 
        userBookings,
        adminBookings,
        loading,
        adminLoading,
        error,
        refreshUserBookings: fetchUserBookings,
        refreshAdminBookings: fetchAdminBookings,
        cancelBooking,
        updateBookingStatus,
        getBookingById
      }}
    >
      {children}
    </BookingContext.Provider>
  );
};

export const useBookings = () => useContext(BookingContext);