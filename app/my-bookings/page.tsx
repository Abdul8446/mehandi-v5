'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Calendar, MapPin, CheckCircle, XCircle, Loader2, AlertCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';
import { useBookings } from '@/contexts/BookingContext';
import ProtectedRoute from '@/components/ProtectedRoute';
import { Booking, BookingStatus } from '@/types/booking';

// type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rejected';


// const mockBookings: Booking[] = [
//   {
//     _id: "1",
//     user: "user1",
//     plan: {
//       id: "plan1",
//       name: "Bridal Mehandi",
//       price: 2500,
//       image: "https://images.unsplash.com/photo-1613665667184-81bb9b8605e2?w=600"
//     },
//     date: new Date("2025-07-06"),
//     bookingDetails: {
//       name: "Abdul Basith",
//       phone: "8089082484",
//       email: "farhanfarhan832@gmail.com",
//       address: "uppatt house, nattika beach",
//       city: "thrissur",
//       state: "kerala",
//       postalCode: "680566",
//       occasion: "Engagement",
//       numberOfPeople: 1,
//       specialRequirements: "Need floral patterns"
//     },
//     status: "pending",
//     createdAt: new Date(),
//     updatedAt: new Date()
//   },
//   {
//     _id: "2",
//     user: "user1",
//     plan: {
//       id: "plan2",
//       name: "Party Mehandi",
//       price: 1500,
//       image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600"
//     },
//     date: new Date("2025-06-15"),
//     bookingDetails: {
//       name: "Abdul Basith",
//       phone: "8089082484",
//       email: "farhanfarhan832@gmail.com",
//       address: "uppatt house, nattika beach",
//       city: "thrissur",
//       state: "kerala",
//       postalCode: "680566",
//       occasion: "Eid Celebration",
//       numberOfPeople: 3,
//       specialRequirements: ""
//     },
//     status: "completed",
//     createdAt: new Date("2025-05-20"),
//     updatedAt: new Date("2025-06-16")
//   },
//   {
//     _id: "3",
//     user: "user1",
//     plan: {
//       id: "plan1",
//       name: "Bridal Mehandi",
//       price: 2500,
//       image: "https://images.unsplash.com/photo-1613665667184-81bb9b8605e2?w=600"
//     },
//     date: new Date("2025-08-10"),
//     bookingDetails: {
//       name: "Abdul Basith",
//       phone: "8089082484",
//       email: "farhanfarhan832@gmail.com",
//       address: "uppatt house, nattika beach",
//       city: "thrissur",
//       state: "kerala",
//       postalCode: "680566",
//       occasion: "Wedding",
//       numberOfPeople: 2,
//       specialRequirements: "Traditional Kerala designs"
//     },
//     status: "confirmed",
//     createdAt: new Date(),
//     updatedAt: new Date()
//   },
//   {
//     _id: "4",
//     user: "user1",
//     plan: {
//       id: "plan2",
//       name: "Party Mehandi",
//       price: 1500,
//       image: "https://images.unsplash.com/photo-1600334129128-685c5582fd35?w=600"
//     },
//     date: new Date("2025-05-01"),
//     bookingDetails: {
//       name: "Abdul Basith",
//       phone: "8089082484",
//       email: "farhanfarhan832@gmail.com",
//       address: "uppatt house, nattika beach",
//       city: "thrissur",
//       state: "kerala",
//       postalCode: "680566",
//       occasion: "Birthday",
//       numberOfPeople: 5,
//       specialRequirements: ""
//     },
//     status: "cancelled",
//     createdAt: new Date("2025-04-15"),
//     updatedAt: new Date("2025-04-28")
//   },
//   {
//     _id: "5",
//     user: "user1",
//     plan: {
//       id: "plan1",
//       name: "Bridal Mehandi",
//       price: 2500,
//       image: "https://images.unsplash.com/photo-1613665667184-81bb9b8605e2?w=600"
//     },
//     date: new Date("2025-09-20"),
//     bookingDetails: {
//       name: "Abdul Basith",
//       phone: "8089082484",
//       email: "farhanfarhan832@gmail.com",
//       address: "uppatt house, nattika beach",
//       city: "thrissur",
//       state: "kerala",
//       postalCode: "680566",
//       occasion: "Anniversary",
//       numberOfPeople: 2,
//       specialRequirements: "Modern designs"
//     },
//     status: "rejected",
//     createdAt: new Date(),
//     updatedAt: new Date()
//   }
// ];

const MehandiBookingsPage = () => {
  const { userBookings, loading, error, refreshUserBookings, cancelBooking } = useBookings()  
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  type BookingAction = 'cancel' | 'review' | 'rebook';
  interface StatusConfig {
    color: string;
    icon: React.ReactNode;
    actions: BookingAction[];
    message: string;
  }

  const getStatusConfig = (status: BookingStatus): StatusConfig => {
    switch (status) {
      case 'confirmed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle size={16} className="mr-1" />,
          actions: [],
          message: 'Your booking is confirmed'
        };
      case 'pending':
        return {
          color: 'bg-brown-100 text-brown-800',
          icon: <Loader2 size={16} className="mr-1 animate-spin" />,
          actions: ['cancel'],
          message: 'Waiting for artist confirmation'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle size={16} className="mr-1" />,
          actions: [],
          message: 'Booking was cancelled'
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <CheckCircle size={16} className="mr-1" />,
          actions: ['review'],
          message: 'Service completed'
        };
      case 'rejected':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <XCircle size={16} className="mr-1" />,
          actions: ['rebook'],
          message: 'Booking was rejected'
        };
      default:
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: null,
          actions: [],
          message: ''
        };
    }
  };

  const filteredBookings = userBookings.filter(booking => {
    const bookingDate = new Date(booking.date);
    const currentDate = new Date();
    const isUpcoming = bookingDate >= currentDate;
    
    if (activeTab === 'upcoming') {
      return isUpcoming && !['cancelled', 'completed', 'rejected'].includes(booking.status);
    } else {
      return !isUpcoming || ['cancelled', 'completed', 'rejected'].includes(booking.status);
    }
  });

  const handleCancel = async (bookingId: string) => {
    setLoadingStates(prev => ({ ...prev, [bookingId]: true }));
    const success = await cancelBooking(bookingId);
    setLoadingStates(prev => ({ ...prev, [bookingId]: false }));
    return success;
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  const daysUntilBooking = (bookingDate: Date) => {
    const diffTime = bookingDate.getTime() - new Date().getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleAction = async (bookingId: string, action: string) => {
    setLoadingStates(prev => ({ ...prev, [bookingId]: true }));
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setLoadingStates(prev => ({ ...prev, [bookingId]: false }));
    console.log(`Performed ${action} on booking ${bookingId}`);
  };

  if (loading && userBookings.length === 0) {
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

  if (error) {
    return (
      <ProtectedRoute>
        <div className="flex flex-col justify-center items-center min-h-screen p-4">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading bookings</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button 
            onClick={refreshUserBookings}
            className="bg-brown-800 hover:bg-brown-700 text-white px-4 py-2 rounded-md transition-colors"
            >
            Try Again
            </button>
        </div>
      </ProtectedRoute>
    );
  }

  return (
    <ProtectedRoute>
        <div className="bg-gray-50 min-h-screen py-4 md:py-8">
        <div className="container mx-auto px-3 md:px-4">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-4 md:mb-6 gap-3">
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">My Mehandi Bookings</h1>
            <Link 
                href="/booking" 
                className="bg-brown-800 hover:bg-brown-700 text-white px-3 py-2 md:px-4 md:py-2 rounded-md transition-colors text-sm md:text-base"
            >
                Book New Session
            </Link>
            </div>

            {/* Tabs */}
            <div className="flex rounded-md overflow-hidden border border-gray-200 w-full md:w-fit mb-4 md:mb-6">
            <button 
                className={`flex-1 md:flex-none md:px-6 py-2 text-sm md:text-base ${activeTab === 'upcoming' ? 'bg-brown-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('upcoming')}
            >
                Upcoming
            </button>
            <button 
                className={`flex-1 md:flex-none md:px-6 py-2 text-sm md:text-base ${activeTab === 'past' ? 'bg-brown-800 text-white' : 'bg-white text-gray-700 hover:bg-gray-50'}`}
                onClick={() => setActiveTab('past')}
            >
                Past
            </button>
            </div>

            {/* Bookings List */}
            <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-3 md:space-y-4"
            >
            {filteredBookings.length > 0 ? (
                console.log(filteredBookings, 'filteredBookings'),
                filteredBookings.map(booking => {
                const statusConfig = getStatusConfig(booking.status);
                const isUpcoming = new Date(booking.date) >= new Date();
                
                return (
                    <motion.div 
                    key={booking._id}
                    variants={itemVariants}
                    className="bg-white rounded-lg shadow-sm overflow-hidden border border-gray-200"
                    >
                    <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 md:gap-6">
                        {/* Plan Image */}
                        <div className="w-full md:w-64 flex-shrink-0">
                        {booking.plan.image ? (
                            <img 
                            src={booking.plan.image} 
                            alt={booking.plan.name}
                            className="w-full h-40 md:h-48 object-cover rounded-lg"
                            />
                        ) : (
                            <div className="w-full h-40 md:h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                            <span className="text-gray-400">No Image</span>
                            </div>
                        )}
                        </div>
                        
                        <div className="flex-1">
                        <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-3 md:mb-4 gap-2">
                            <div>
                            <h3 className="text-lg md:text-xl font-semibold text-gray-800">{booking.plan.name}</h3>
                            <p className="text-gray-600 text-sm md:text-base">₹{booking.plan.price.toLocaleString('en-IN')}</p>
                            {booking.plan.description && (
                                <p className="text-gray-500 text-xs md:text-sm mt-1">{booking.plan.description}</p>
                            )}
                            </div>
                            <div className="flex flex-col items-start md:items-end">
                            <span className={`px-2 py-1 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-medium flex items-center ${statusConfig.color}`}>
                                {statusConfig.icon}
                                <span className="ml-1">{booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}</span>
                            </span>
                            <p className="text-xs text-gray-500 mt-1">{statusConfig.message}</p>
                            {booking.status === 'confirmed' && (
                                <p className="text-xs text-brown-700 mt-2">
                                    To cancel or update requirements, please contact us directly through the number or chat where your booking communication was made.
                                </p>
                            )}
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 mb-3 md:mb-4">
                            <div className="flex items-start">
                            <Calendar size={16} className="text-gray-400 mr-2 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-700 text-sm md:text-base">Date</p>
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
                            <MapPin size={16} className="text-gray-400 mr-2 mt-0.5" />
                            <div>
                                <p className="font-medium text-gray-700 text-sm md:text-base">Location</p>
                                <p className="text-gray-600 text-sm md:text-base">
                                {booking.bookingDetails.city}, {booking.bookingDetails.state}
                                </p>
                            </div>
                            </div>
                        </div>
                        
                        <div className="mb-3 md:mb-4">
                            <p className="font-medium text-gray-700 text-sm md:text-base">Booking Details</p>
                            <div className="grid grid-cols-2 gap-2 mt-2 text-xs md:text-sm">
                            <div>
                                <span className="text-gray-500">Name:</span>
                                <span className="ml-2">{booking.bookingDetails.name}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Phone:</span>
                                <span className="ml-2">{booking.bookingDetails.phone}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">Occasion:</span>
                                <span className="ml-2">{booking.bookingDetails.occasion}</span>
                            </div>
                            <div>
                                <span className="text-gray-500">People:</span>
                                <span className="ml-2">{booking.bookingDetails.numberOfPeople}</span>
                            </div>
                            </div>
                        </div>
                        
                        {booking.bookingDetails.specialRequirements && (
                            <div className="mb-3 md:mb-4">
                            <p className="font-medium text-gray-700 text-sm md:text-base">Special Requirements</p>
                            <p className="text-gray-600 mt-1 text-sm md:text-base">{booking.bookingDetails.specialRequirements}</p>
                            </div>
                        )}
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 p-3 md:p-4 flex flex-col md:flex-row md:justify-between md:items-center border-t border-gray-200 gap-2">
                        <div className="text-xs md:text-sm text-gray-500">
                        Booked on {formatDate(booking.createdAt)}
                        {booking.status === 'rejected' && (
                            <span className="ml-2 text-red-500">• Artist unavailable</span>
                        )}
                        </div>
                        
                        <div className="flex flex-wrap gap-2 md:gap-3 justify-end">
                        {statusConfig.actions.includes('cancel') && (
                            <button 
                            onClick={() => handleCancel(booking._id)}
                            disabled={loadingStates[booking._id]}
                            className="text-brown-800 hover:text-brown-700 font-medium disabled:opacity-50 flex items-center text-xs md:text-sm"
                            >
                            <XCircle size={14} className="mr-1" />
                            {booking.status === 'pending' ? 'Cancel' : 'Cancel Booking'}
                            </button>
                        )}
                        
                        {statusConfig.actions.includes('review') && (
                            <button 
                            onClick={() => handleAction(booking._id, 'review')}
                            disabled={loadingStates[booking._id]}
                            className="text-brown-800 hover:text-brown-700 font-medium disabled:opacity-50 flex items-center text-xs md:text-sm"
                            >
                            <AlertCircle size={14} className="mr-1" />
                            Review
                            </button>
                        )}
                        
                        {statusConfig.actions.includes('rebook') && (
                            <button 
                            onClick={() => handleAction(booking._id, 'rebook')}
                            disabled={loadingStates[booking._id]}
                            className="text-brown-800 hover:text-brown-700 font-medium disabled:opacity-50 flex items-center text-xs md:text-sm"
                            >
                            <Clock size={14} className="mr-1" />
                            Rebook  
                            </button>
                        )}
                        
                        {/* <button className="bg-brown-800 hover:bg-brown-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-colors disabled:opacity-50 text-xs md:text-sm">
                            Details
                        </button> */}
                        <Link 
                            href={`/my-bookings/${booking._id}`} 
                            className="bg-brown-800 hover:bg-brown-700 text-white px-3 py-1.5 md:px-4 md:py-2 rounded-md transition-colors disabled:opacity-50 text-xs md:text-sm"
                        >
                            Details
                        </Link>
                        </div>
                    </div>
                    </motion.div>
                );
                })
            ) : (
                <div className="bg-white rounded-lg shadow-sm p-6 text-center border border-gray-200">
                <Calendar size={40} className="mx-auto text-gray-400 mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {activeTab === 'upcoming' 
                    ? "No Upcoming Bookings" 
                    : "No Past Bookings"}
                </h3>
                <p className="text-gray-600 mb-4 text-sm">
                    {activeTab === 'upcoming' 
                    ? "You don't have any upcoming mehandi bookings scheduled." 
                    : "You haven't completed any bookings yet."}
                </p>
                <Link 
                    href="/booking" 
                    className="inline-block bg-brown-800 hover:bg-brown-700 text-white px-4 py-2 rounded-md transition-colors text-sm"
                >
                    Book a Mehandi Artist
                </Link>
                </div>
            )}
            </motion.div>
        </div>
        </div>
    </ProtectedRoute>
  );
};

export default MehandiBookingsPage;