import { format, isSameDay } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import Button from '../ui/Button';
import { useState } from 'react';
import { Plan } from '@/types/plan';

interface DateTimeStepProps {
  plan: Plan;
  availableDates: Date[];
  selectedDate: Date | null;
  onDateSelect: (date: Date) => void;
  onContinue: () => void;
  onBack: () => void;
  labelText?: string;
}

const DateTimeStep: React.FC<DateTimeStepProps> = ({
  plan,
  availableDates,
  selectedDate,
  onDateSelect,
  onContinue,
  onBack,
  labelText,
}) => {
  const [monthOffset, setMonthOffset] = useState(0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Parse available dates to local date strings (YYYY-MM-DD) for timezone-safe selection matching
  const formatDateStr = (d: Date) => {
    const y = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    return `${y}-${mm}-${dd}`;
  };

  const availableDateStrings = new Set(availableDates.map(formatDateStr));

  // Determine current active calendar month to display
  const displayMonthDate = new Date(today.getFullYear(), today.getMonth() + monthOffset, 1);
  const displayYear = displayMonthDate.getFullYear();
  const displayMonth = displayMonthDate.getMonth();

  // Helper to generate calendar days for the current display month (Sun - Sat grid)
  const getDaysInMonth = (y: number, m: number) => {
    const firstDay = new Date(y, m, 1);
    const days = [];
    
    // Fill in empty slots for padding before the 1st day of the month
    const startDayOfWeek = firstDay.getDay(); // 0 is Sunday, 6 is Saturday
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    // Fill in month days
    const date = new Date(firstDay);
    while (date.getMonth() === m) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = getDaysInMonth(displayYear, displayMonth);

  // Pagination boundaries: prevent going into past, limit forward search to max date in availableDates
  let maxOffset = 1;
  if (availableDates.length > 0) {
    const lastDate = availableDates[availableDates.length - 1];
    maxOffset = (lastDate.getFullYear() - today.getFullYear()) * 12 + (lastDate.getMonth() - today.getMonth());
  }
  maxOffset = Math.max(1, maxOffset);

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const WEEK_DAYS = [
    { name: 'Sunday', short: 'Sun', tiny: 'S' },
    { name: 'Monday', short: 'Mon', tiny: 'M' },
    { name: 'Tuesday', short: 'Tue', tiny: 'T' },
    { name: 'Wednesday', short: 'Wed', tiny: 'W' },
    { name: 'Thursday', short: 'Thu', tiny: 'T' },
    { name: 'Friday', short: 'Fri', tiny: 'F' },
    { name: 'Saturday', short: 'Sat', tiny: 'S' }
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* Selected Plan Info */}
      <div className="lg:col-span-1">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden sticky p-6 top-24 border border-gray-200">
          <div className="pb-4 border-b border-gray-100 mb-4">
            <h3 className="text-lg font-bold text-gray-800">Selected Plan</h3>
          </div>
          <div>
            <div className="flex mb-5 gap-4">
              <div className="w-1/2">
                <h4 className="text-lg font-bold text-gray-800 mb-1">{plan.name}</h4>
                <p className="text-xs text-gray-500 line-clamp-3 mb-3">{plan.description}</p>
                <p className="font-semibold text-red-900 text-sm">Price: Starting from ₹{plan.price}</p>
              </div>

              <div className="w-1/2 relative h-24 flex items-start rounded-lg overflow-hidden border border-gray-100">
                <Image
                  src={plan.image}
                  alt={plan.name}
                  fill
                  className="object-cover object-center"
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

      {/* Date Selection */}
      <div className="lg:col-span-2">
        <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
          
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h3 className="text-lg font-bold text-gray-800">Select Date</h3>
          </div>

          <div className="p-6">
            <h4 className="font-bold text-sm text-gray-700 mb-4">
              {labelText || 'Available Dates (Next 30 Days)'}
            </h4>

            {/* Calendar Pagination Header */}
            <div className="flex justify-between items-center mb-5 bg-gray-50 p-2.5 rounded-lg border border-gray-150">
              <button
                type="button"
                onClick={() => setMonthOffset(prev => Math.max(0, prev - 1))}
                disabled={monthOffset === 0}
                className="p-1.5 rounded-md hover:bg-white disabled:opacity-40 transition-colors border border-transparent hover:border-gray-200 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Previous month"
              >
                <ChevronLeft size={18} className="text-gray-600" />
              </button>
              
              <span className="text-sm font-bold text-gray-800">
                {MONTH_NAMES[displayMonth]} {displayYear}
              </span>
              
              <button
                type="button"
                onClick={() => setMonthOffset(prev => Math.min(maxOffset, prev + 1))}
                disabled={monthOffset === maxOffset}
                className="p-1.5 rounded-md hover:bg-white disabled:opacity-40 transition-colors border border-transparent hover:border-gray-200 cursor-pointer disabled:cursor-not-allowed"
                aria-label="Next month"
              >
                <ChevronRight size={18} className="text-gray-600" />
              </button>
            </div>

            {/* Standard Sunday-to-Saturday Calendar Layout */}
            <div className="w-full">
              {/* Day Headers (Responsive initials) */}
              <div className="grid grid-cols-7 gap-1 text-center mb-2">
                {WEEK_DAYS.map(day => (
                  <span key={day.name} className="text-xxs sm:text-xs font-bold text-gray-400 py-1 uppercase">
                    <span className="hidden sm:inline">{day.short}</span>
                    <span className="sm:hidden">{day.tiny}</span>
                  </span>
                ))}
              </div>

              {/* Day grid - responsive cells designed to fit exactly 7 per row */}
              <div className="grid grid-cols-7 gap-1.5 text-center">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="w-full aspect-square" />;
                  }

                  const dateStr = formatDateStr(date);
                  const isSelectable = availableDateStrings.has(dateStr);
                  const isSelected = selectedDate && isSameDay(date, selectedDate);

                  let btnClass = '';
                  if (isSelected) {
                    btnClass = 'bg-red-900 text-white border-red-900 shadow-sm font-bold scale-[1.03]';
                  } else if (isSelectable) {
                    btnClass = 'bg-white hover:bg-red-50 border-gray-200 text-gray-800 hover:text-red-900 hover:border-red-900 cursor-pointer';
                  } else {
                    btnClass = 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed';
                  }

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      disabled={!isSelectable}
                      onClick={() => onDateSelect(date)}
                      className={`w-full aspect-square flex items-center justify-center rounded-lg border text-xs sm:text-sm font-semibold transition-all duration-200 focus:outline-none ${btnClass}`}
                    >
                      <span>{date.getDate()}</span>
                    </button>
                  );
                })}
              </div>
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
