'use client';
import { Calendar, MapPin, CheckCircle, XCircle, Loader2, AlertCircle, Clock, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter, useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useBookings } from '@/contexts/BookingContext';
import { Booking, BookingStatus } from '@/types/booking';
import ProtectedRoute from '@/components/ProtectedRoute';

const MehandiBookingDetailsPage = () => {
  const router = useRouter();
  const params = useParams();
  const { userBookings, loading, cancelBooking } = useBookings();
  const [isLoading, setIsLoading] = useState(false);
  const [booking, setBooking] = useState<Booking | null>(null);

  // Find the booking from context when params or bookings change
  useEffect(() => {
    if (params.id && userBookings.length > 0) {
      const foundBooking = userBookings.find(b => b._id === params.id);
      setBooking(foundBooking || null);
    }
  }, [params.id, userBookings]);

  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle size={16} className="mr-1" />,
          message: 'Your booking is confirmed'
        };
      case 'pending':
        return {
          color: 'bg-brown-100 text-brown-800',
          icon: <Loader2 size={16} className="mr-1 animate-spin" />,
          message: 'Waiting for artist confirmation'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle size={16} className="mr-1" />,
          message: 'Booking was cancelled'
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <CheckCircle size={16} className="mr-1" />,
          message: 'Service completed'
        };
      case 'rejected':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <XCircle size={16} className="mr-1" />,
          message: 'Booking was rejected'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: null,
          message: ''
        };
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const daysUntilBooking = (bookingDate: Date) => {
    const diffTime = bookingDate.getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleCancel = async () => {
    if (!booking) return;
    
    setIsLoading(true);
    try {
      const success = await cancelBooking(booking._id);
      if (!success) {
        // Handle error (show toast/notification)
        console.error('Failed to cancel booking');
      }
    } catch (error) {
      console.error('Error cancelling booking:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleReview = async () => {
    setIsLoading(true);
    // Implement real review logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    router.push(`/reviews/create?bookingId=${booking?._id}`);
  };

  const handleRebook = async () => {
    setIsLoading(true);
    // Implement real rebook logic
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
    router.push('/booking');
  };


  if (loading || !booking) {
    return (
      <ProtectedRoute>
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-900 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
            </div>
        </div>
      </ProtectedRoute>
    );
  }

  const statusConfig = getStatusConfig(booking.status);
  const isUpcoming = new Date(booking.date) >= new Date();

  return (
    <ProtectedRoute>
        <div className="bg-gray-50 min-h-screen py-4 md:py-8">
        <div className="container mx-auto px-3 md:px-4">
            {/* Back button and header */}
            <div className="flex items-center mb-4 md:mb-6 gap-2">
            <button 
                onClick={() => router.back()}
                className="p-1 rounded-full hover:bg-gray-100 flex-shrink-0"
                aria-label="Go back"
            >
                <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">Booking Details</h1>
            </div>

            <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
            >
            {/* Plan header */}
            <div className="p-4 md:p-6 border-b border-gray-200 flex flex-col md:flex-row gap-4">
                {booking.plan.image && (
                <div className="w-full md:w-64 flex-shrink-0 mx-auto md:mx-0">
                    <img 
                    src={booking.plan.image} 
                    alt={booking.plan.name}
                    className="w-full h-40 md:h-48 object-cover rounded-lg"
                    />
                </div>
                )}
                
                <div className="flex-1">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-2">
                    <div>
                    <h2 className="text-xl md:text-2xl font-bold text-gray-800">{booking.plan.name}</h2>
                    <p className="text-lg text-brown-800 font-medium">₹{booking.plan.price.toLocaleString('en-IN')}</p>
                    </div>
                    <div className="flex flex-col items-start md:items-end">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium flex items-center ${statusConfig.color}`}>
                        {statusConfig.icon}
                        <span className="ml-1">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                    </span>
                    <p className="text-xs text-gray-500 mt-1">{statusConfig.message}</p>
                    </div>
                </div>
                
                {booking.plan.description && (
                    <p className="text-gray-600 mt-2 text-sm">{booking.plan.description}</p>
                )}
                
                <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-start">
                    <Calendar size={18} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-gray-700 text-sm md:text-base">Booking Date</p>
                        <p className="text-gray-600 text-sm md:text-base">
                        {formatDate(booking.date)}
                        {isUpcoming && booking.status === 'confirmed' && (
                            <span className="ml-2 text-xs bg-brown-100 text-brown-800 px-2 py-0.5 rounded-full">
                            {daysUntilBooking(booking.date)} days left
                            </span>
                        )}
                        </p>
                    </div>
                    </div>
                    
                    <div className="flex items-start">
                    <MapPin size={18} className="text-gray-400 mr-2 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="font-medium text-gray-700 text-sm md:text-base">Location</p>
                        <p className="text-gray-600 text-sm md:text-base">{booking.bookingDetails.city}, {booking.bookingDetails.state}</p>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            
            {/* Booking details */}
            <div className="p-4 md:p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Customer Information</h3>
                <div className="space-y-3">
                    <div>
                    <p className="text-sm text-gray-500">Full Name</p>
                    <p className="text-gray-800 text-sm md:text-base">{booking.bookingDetails.name}</p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-500">Phone Number</p>
                    <p className="text-gray-800 text-sm md:text-base">{booking.bookingDetails.phone}</p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-500">Email Address</p>
                    <p className="text-gray-800 text-sm md:text-base">{booking.bookingDetails.email}</p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-500">Occasion</p>
                    <p className="text-gray-800 text-sm md:text-base">{booking.bookingDetails.occasion}</p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-500">Number of People</p>
                    <p className="text-gray-800 text-sm md:text-base">{booking.bookingDetails.numberOfPeople}</p>
                    </div>
                </div>
                </div>
                
                <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">Address Details</h3>
                <div className="space-y-3">
                    <div>
                    <p className="text-sm text-gray-500">Address</p>
                    <p className="text-gray-800 text-sm md:text-base">{booking.bookingDetails.address}</p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-500">City</p>
                    <p className="text-gray-800 text-sm md:text-base">{booking.bookingDetails.city}</p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-500">State</p>
                    <p className="text-gray-800 text-sm md:text-base">{booking.bookingDetails.state}</p>
                    </div>
                    <div>
                    <p className="text-sm text-gray-500">Postal Code</p>
                    <p className="text-gray-800 text-sm md:text-base">{booking.bookingDetails.postalCode}</p>
                    </div>
                </div>
                
                {booking.bookingDetails.specialRequirements && (
                    <div className="mt-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">Special Requirements</h3>
                    <p className="text-gray-800 text-sm md:text-base">{booking.bookingDetails.specialRequirements}</p>
                    </div>
                )}
                </div>
            </div>
            
            {/* Booking meta */}
            <div className="bg-gray-50 p-4 md:p-6 border-t border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Booking ID</h3>
                    <p className="text-gray-800 font-mono text-sm md:text-base break-all">{booking._id}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Booked On</h3>
                    <p className="text-gray-800 text-sm md:text-base">{formatDate(booking.createdAt)}</p>
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-500 mb-1">Last Updated</h3>
                    <p className="text-gray-800 text-sm md:text-base">{formatDate(booking.updatedAt)}</p>
                </div>
                </div>
            </div>
            
            {/* Actions */}
            <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-wrap justify-center md:justify-end gap-3">
                {booking.status === 'pending' && (
                <button 
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-3 py-1.5 md:px-4 md:py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50 flex items-center text-sm md:text-base"
                >
                    {isLoading ? (
                    <Loader2 size={16} className="mr-1 md:mr-2 animate-spin" />
                    ) : (
                    <XCircle size={16} className="mr-1 md:mr-2" />
                    )}
                    Cancel Booking
                </button>
                )}
                
                {booking.status === 'confirmed' && (
                <button 
                    onClick={handleCancel}
                    disabled={isLoading}
                    className="px-3 py-1.5 md:px-4 md:py-2 border border-red-300 text-red-700 rounded-md hover:bg-red-50 disabled:opacity-50 flex items-center text-sm md:text-base"
                >
                    {isLoading ? (
                    <Loader2 size={16} className="mr-1 md:mr-2 animate-spin" />
                    ) : (
                    <XCircle size={16} className="mr-1 md:mr-2" />
                    )}
                    Cancel Booking
                </button>
                )}
                
                {booking.status === 'completed' && (
                <button 
                    onClick={handleReview}
                    disabled={isLoading}
                    className="px-3 py-1.5 md:px-4 md:py-2 border border-brown-300 text-brown-700 rounded-md hover:bg-brown-50 disabled:opacity-50 flex items-center text-sm md:text-base"
                >
                    {isLoading ? (
                    <Loader2 size={16} className="mr-1 md:mr-2 animate-spin" />
                    ) : (
                    <AlertCircle size={16} className="mr-1 md:mr-2" />
                    )}
                    Leave a Review
                </button>
                )}
                
                {booking.status === 'rejected' && (
                <button 
                    onClick={handleRebook}
                    disabled={isLoading}
                    className="px-3 py-1.5 md:px-4 md:py-2 border border-brown-300 text-brown-700 rounded-md hover:bg-brown-50 disabled:opacity-50 flex items-center text-sm md:text-base"
                >
                    {isLoading ? (
                    <Loader2 size={16} className="mr-1 md:mr-2 animate-spin" />
                    ) : (
                    <Clock size={16} className="mr-1 md:mr-2" />
                    )}
                    Rebook
                </button>
                )}
                
                <Link 
                href="/booking" 
                className="px-3 py-1.5 md:px-4 md:py-2 bg-brown-800 text-white rounded-md hover:bg-brown-700 transition-colors flex items-center text-sm md:text-base"
                >
                Book Another Session
                </Link>
            </div>
            </motion.div>
        </div>
        </div>
    </ProtectedRoute>
  );
};

export default MehandiBookingDetailsPage;