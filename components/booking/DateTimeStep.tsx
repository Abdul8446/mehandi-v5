import { addDays, format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Image from 'next/image';
import Button from '../ui/Button';
import { useState } from 'react';
import { Plan } from '@/types/plan';

interface TimeSlot {
  id: string;
  time: string;
}


interface DateTimeStepProps {
  plan: Plan;
  availableDates: Date[];
  // timeSlots: TimeSlot[];
  selectedDate: Date | null;
  // selectedTimeSlot: string | null;
  onDateSelect: (date: Date) => void;
  // onTimeSlotSelect: (slotId: string) => void;
  onContinue: () => void;
  onBack: () => void;
}

const DateTimeStep: React.FC<DateTimeStepProps> = ({
  plan,
  availableDates,
  // timeSlots,
  selectedDate,
  // selectedTimeSlot,
  onDateSelect,
  // onTimeSlotSelect,
  onContinue,
  onBack,
}) => {

  const today = new Date();
  const maxDate = addDays(today, 30);

  const filteredDates = availableDates.filter(date => date >= today && date <= maxDate);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Plan Info */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky p-6 top-24">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Selected Plan</h3>
          </div>
          <div className="p-4">
            <div className="flex mb-4">
              {/* Left: Text Content */}
              <div className="w-1/2">
                <h4 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h4>
                <p className="text-gray-700 mb-4">{plan.description}</p>
                <p className="font-semibold text-red-900 mb-4">Price: Starting from ₹{plan.price}</p>
              </div>

              {/* Right: Image */}
              <div className="w-1/2 relative flex items-start">
                <Image
                  src={plan.image}
                  alt={plan.name}
                  fill
                  className="object-cover object-center rounded-md"
                />
              </div>
            </div>
            <Button
              variant='outline'
              className="w-full btn-outline"
              onClick={onBack}
            >
              Change Plan
            </Button>
          </div>
        </div>
      </div>

      {/* Date and Time Selection */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Select Date & Time</h3>
          </div>

          <div className="p-6">
            <h4 className="font-medium mb-4">Available Dates (Next 30 Days)</h4>

            <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-7 gap-2">
              {filteredDates.map((date, index) => (
                <button
                  key={index}
                  className={`text-center p-2 rounded-md text-sm transition duration-300 border ${
                    selectedDate && isSameDay(date, selectedDate)
                      ? 'bg-red-900 text-white border-red-900'
                      : 'hover:bg-red-50 border-gray-200 text-gray-700'
                  }`}
                  onClick={() => onDateSelect(date)}
                >
                  <div className="text-xs">{format(date, 'EEE')}</div>
                  <div className="text-base font-semibold">{format(date, 'd')}</div>
                  <span className="text-xs">{format(date, 'MMM')}</span>
                </button>
              ))}
            </div>



            <Button
              variant='primary'
              className="w-full btn-primary mt-8"
              onClick={onContinue}
              disabled={!selectedDate}
            >
              Continue to Booking Details
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DateTimeStep;
