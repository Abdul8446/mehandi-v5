'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

import SelectPlanStep from '@/components/booking/SelectPlanStep';
import DateTimeStep from '@/components/booking/DateTimeStep';
import BookingDetailsStep from '@/components/booking/BookingDetailsStep';
import ConfirmationStep from '@/components/booking/ConfirmationStep';
import BookingSteps from '@/components/booking/BookingSteps';

// Generate available dates (30 days from day after tomorrow)
const generateDates = () => {
  const dates = [];
  const dayAfterTomorrow = new Date();
  dayAfterTomorrow.setDate(dayAfterTomorrow.getDate() + 2); // Skip tomorrow
  
  for (let i = 0; i < 30; i++) {
    const nextDate = new Date(dayAfterTomorrow);
    nextDate.setDate(dayAfterTomorrow.getDate() + i);
    dates.push(nextDate);
  }
  
  return dates;
};

// Generate time slots
const timeSlots = [
  { id: '1', time: '09:00 AM - 11:00 AM' },
  { id: '2', time: '11:30 AM - 01:30 PM' },
  { id: '3', time: '02:00 PM - 04:00 PM' },
  { id: '4', time: '04:30 PM - 06:30 PM' },
  { id: '5', time: '07:00 PM - 09:00 PM' }
];

const Booking = () => {
  const [step, setStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [bookingDetails, setBookingDetails] = useState({
    name: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    state: '',
    postalCode: '',
    occasion: '',
    numberOfPeople: 1,
    specialRequirements: ''
  });
  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(plans.length === 0);
  // ... other state declarations

  console.log(selectedPlan, 'selectedPlan');

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const res = await fetch('/api/plans');
        const data = await res.json();
        console.log(data, 'data');
        setPlans(data);
      } catch (err) {
        toast.error("Failed to load plans");
      } finally {
        setLoading(false)
      }
    };
    fetchPlans();
  }, []);
  console.log(plans)

  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const availableDates = generateDates();

  const handlePlanSelect = (plan: any) => {
    setSelectedPlan(plan);
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
  };

  // const handleTimeSlotSelect = (slotId: string) => {
  //   setSelectedTimeSlot(slotId);
  // };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBookingDetails(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleContinue = () => {
    if (!selectedDate ) {
      toast.error('Please select date');
      return;
    }
    setStep(3);
    window.scrollTo(0, 0);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated) {
      toast.error('Please login to book a session');
      router.push('/auth');
      return;
    }

    console.log('Booking details:', {
      plan: selectedPlan,
      date: selectedDate,
      // timeSlot: timeSlots.find(slot => slot.id === selectedTimeSlot)?.time,
      ...bookingDetails
    });

    toast.success('Booking submitted successfully!');
    setStep(4);
    window.scrollTo(0, 0);
  };

  return (
    <div className="bg-gray-50 min-h-screen py-16">
      <div className="container mx-auto px-4">
        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Book a Mehandi Session</h1>
          <p className="text-gray-600">Choose a plan and book your slot with ease</p>
        </div>

        <BookingSteps currentStep={step} />

        {/* Step 1: Select Plan */}
        {step === 1 && (
          <SelectPlanStep
            plans={plans}
            onPlanSelect={handlePlanSelect}
            loading={loading}
          />
        )}

        {/* Step 2: Choose Date & Time */}
        {step === 2 && selectedPlan && (
          <DateTimeStep
            plan={selectedPlan}
            availableDates={availableDates}
            // timeSlots={timeSlots}
            selectedDate={selectedDate}
            // selectedTimeSlot={selectedTimeSlot}
            onDateSelect={handleDateSelect}
            // onTimeSlotSelect={handleTimeSlotSelect}
            onContinue={handleContinue}
            onBack={() => setStep(1)}
          />
        )}

        {/* Step 3: Booking Details */}
        {step === 3 && selectedPlan && selectedDate && (
          <BookingDetailsStep
            plan={selectedPlan}
            date={selectedDate}
            // timeSlot={timeSlots.find(slot => slot.id === selectedTimeSlot)?.time || ''}
            bookingDetails={bookingDetails}
            onInputChange={handleInputChange}
            onSubmit={handleSubmit}
            onBack={() => setStep(2)}
          />
        )}

        {/* Step 4: Confirmation */}
        {step === 4 && (
          <ConfirmationStep
            plan={selectedPlan}   
            date={selectedDate}
            // timeSlot={timeSlots.find(slot => slot.id === selectedTimeSlot)?.time || ''}
          />
        )}
      </div>
    </div>
  );
};

export default Booking;



