'use client';
import { useState, useEffect } from 'react';
import { Calendar, MapPin, CheckCircle, XCircle, Loader2, AlertCircle, Clock, Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';
import { useBookings } from '../../../contexts/BookingContext';
import { Booking, BookingStatus } from '@/types/booking';

const AdminBookingsPage = () => {
  const { adminBookings, adminLoading, error, refreshAdminBookings, cancelBooking, updateBookingStatus } = useBookings();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | 'all'>('all');
  const [dateSort, setDateSort] = useState<'asc' | 'desc'>('desc');
  const [expandedBooking, setExpandedBooking] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState<Record<string, boolean>>({});

  // Filter and sort bookings
  const filteredBookings = adminBookings
    .filter(booking => {
      const matchesSearch = 
        booking.bookingDetails.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        booking.bookingDetails.phone.includes(searchTerm) ||
        booking._id.includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || booking.status === statusFilter;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      return dateSort === 'asc' 
        ? new Date(a.date).getTime() - new Date(b.date).getTime()
        : new Date(b.date).getTime() - new Date(a.date).getTime();
    });

  const handleStatusUpdate = async (bookingId: string, newStatus: BookingStatus) => {
    setIsUpdating(prev => ({ ...prev, [bookingId]: true }));
    try {
      await updateBookingStatus(bookingId, newStatus);
      await refreshAdminBookings();
    } catch (error) {
      console.error('Failed to update booking status:', error);
    } finally {
      setIsUpdating(prev => ({ ...prev, [bookingId]: false }));
    }
  };

  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return {
          color: 'bg-green-100 text-green-800',
          icon: <CheckCircle size={16} className="mr-1" />,
          message: 'Confirmed'
        };
      case 'pending':
        return {
          color: 'bg-yellow-100 text-yellow-800',
          icon: <Loader2 size={16} className="mr-1 animate-spin" />,
          message: 'Pending Approval'
        };
      case 'cancelled':
        return {
          color: 'bg-red-100 text-red-800',
          icon: <XCircle size={16} className="mr-1" />,
          message: 'Cancelled'
        };
      case 'completed':
        return {
          color: 'bg-blue-100 text-blue-800',
          icon: <CheckCircle size={16} className="mr-1" />,
          message: 'Completed'
        };
      case 'rejected':
        return {
          color: 'bg-gray-100 text-gray-800',
          icon: <XCircle size={16} className="mr-1" />,
          message: 'Rejected'
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

  const toggleExpand = (bookingId: string) => {
    setExpandedBooking(expandedBooking === bookingId ? null : bookingId);
  };

  if (adminLoading && adminBookings.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <Loader2 className="animate-spin h-12 w-12 text-gray-800" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen p-4">
        <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading bookings</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <button 
          onClick={refreshAdminBookings}
          className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-md transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-6 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Bookings Management</h1>
          <p className="mt-1 text-sm text-gray-500">
            Manage all customer bookings and their status
          </p>
        </div>

        {/* Filters and Search */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search bookings..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Filter className="h-5 w-5 text-gray-400" />
            </div>
            <select
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md w-full appearance-none focus:outline-none focus:ring-2 focus:ring-gray-500"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as BookingStatus | 'all')}
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="cancelled">Cancelled</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          <button
            onClick={() => setDateSort(dateSort === 'asc' ? 'desc' : 'asc')}
            className="flex items-center justify-center px-4 py-2 border border-gray-300 rounded-md bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
          >
            <span className="mr-2">Sort by Date</span>
            {dateSort === 'asc' ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>

        {/* Bookings List */}
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          {filteredBookings.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No bookings found matching your criteria</p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-200">
              {filteredBookings.map((booking) => {
                const statusConfig = getStatusConfig(booking.status);
                const isExpanded = expandedBooking === booking._id;
                const isUpcoming = new Date(booking.date) > new Date();

                return (
                  <li key={booking._id} className="hover:bg-gray-50 transition-colors">
                    <div className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <p className="text-sm font-medium text-gray-900 mr-3">
                            {booking.bookingDetails.name}
                          </p>
                          <span className={`px-2 py-1 text-xs rounded-full flex items-center ${statusConfig.color}`}>
                            {statusConfig.icon}
                            <span className="ml-1">{statusConfig.message}</span>
                          </span>
                        </div>
                        <div className="flex items-center space-x-3">
                          <p className="text-sm text-gray-500">
                            {formatDate(booking.date)}
                          </p>
                          <button
                            onClick={() => toggleExpand(booking._id)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            {isExpanded ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-6">
                          {/* Booking Details */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Booking Information</h3>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="font-medium">Plan:</span> {booking.plan.name}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Price:</span> ₹{booking.plan.price.toLocaleString('en-IN')}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Occasion:</span> {booking.bookingDetails.occasion}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">People:</span> {booking.bookingDetails.numberOfPeople}
                              </p>
                            </div>
                          </div>

                          {/* Customer Details */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Details</h3>
                            <div className="space-y-2">
                              <p className="text-sm">
                                <span className="font-medium">Phone:</span> {booking.bookingDetails.phone}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Email:</span> {booking.bookingDetails.email}
                              </p>
                              <p className="text-sm">
                                <span className="font-medium">Address:</span> {booking.bookingDetails.address}, {booking.bookingDetails.city}, {booking.bookingDetails.state} - {booking.bookingDetails.postalCode}
                              </p>
                            </div>
                          </div>

                          {/* Admin Actions */}
                          <div>
                            <h3 className="text-sm font-medium text-gray-500 mb-2">Admin Actions</h3>
                            <div className="space-y-2">
                              <div className="flex items-center space-x-2">
                                <label htmlFor={`status-${booking._id}`} className="text-sm font-medium text-gray-700">
                                  Status:
                                </label>
                                <select
                                  id={`status-${booking._id}`}
                                  value={booking.status}
                                  onChange={(e) => handleStatusUpdate(booking._id, e.target.value as BookingStatus)}
                                  disabled={isUpdating[booking._id]}
                                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-1 focus:ring-gray-500"
                                >
                                  <option value="pending">Pending</option>
                                  <option value="confirmed">Confirmed</option>
                                  <option value="cancelled">Cancelled</option>
                                  <option value="completed">Completed</option>
                                  <option value="rejected">Rejected</option>
                                </select>
                                {isUpdating[booking._id] && (
                                  <Loader2 className="h-4 w-4 animate-spin text-gray-500" />
                                )}
                              </div>

                              {booking.bookingDetails.specialRequirements && (
                                <div className="mt-2">
                                  <p className="text-sm font-medium text-gray-700">Special Requirements:</p>
                                  <p className="text-sm text-gray-600">{booking.bookingDetails.specialRequirements}</p>
                                </div>
                              )}

                              <div className="mt-2 text-xs text-gray-500">
                                <p>Created: {formatDate(booking.createdAt)}</p>
                                <p>Last Updated: {formatDate(booking.updatedAt)}</p>
                                <p>Booking ID: {booking._id}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminBookingsPage;  
