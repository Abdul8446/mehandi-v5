'use client';

import React, { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Save, Calendar, Trash2, Plus, CalendarRange, Clock, Lock, Check, RefreshCw } from 'lucide-react';

interface IBlockedRange {
  startDate: string;
  endDate: string;
  label?: string;
}

export default function BookingSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [durationPreset, setDurationPreset] = useState<'10' | '30' | '60' | 'custom'>('30');
  
  const [settings, setSettings] = useState({
    labelText: 'Available Dates (Next 30 Days)',
    durationDays: 30,
    blockedDates: [] as string[],
    blockedRanges: [] as IBlockedRange[],
    blockedDaysOfWeek: [] as number[]
  });

  const [confirmedDates, setConfirmedDates] = useState<string[]>([]);
  
  // Range Form State
  const [rangeForm, setRangeForm] = useState({
    startDate: '',
    endDate: '',
    label: ''
  });

  // Calendar Navigation
  const [calendarOffset, setCalendarOffset] = useState(0); // 0 = Current month, 1 = Next month

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/admin/booking-settings');
      if (response.ok) {
        const data = await response.json();
        const apiSettings = data.settings || {};
        
        setSettings({
          labelText: apiSettings.labelText || 'Available Dates (Next 30 Days)',
          durationDays: apiSettings.durationDays ?? 30,
          blockedDates: apiSettings.blockedDates || [],
          blockedRanges: apiSettings.blockedRanges || [],
          blockedDaysOfWeek: apiSettings.blockedDaysOfWeek || []
        });
        setConfirmedDates(data.confirmedDates || []);
        
        const days = apiSettings.durationDays ?? 30;
        if ([10, 30, 60].includes(days)) {
          setDurationPreset(String(days) as '10' | '30' | '60' | 'custom');
        } else {
          setDurationPreset('custom');
        }
      }
    } catch (error) {
      toast.error('Failed to load booking settings');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    
    if (name === 'durationPreset') {
      const preset = value as '10' | '30' | '60' | 'custom';
      setDurationPreset(preset);
      if (preset !== 'custom') {
        setSettings(prev => ({ ...prev, durationDays: parseInt(preset) }));
      }
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: name === 'durationDays' ? parseInt(value) || 1 : value
      }));
    }
  };

  const toggleDayOfWeek = (day: number) => {
    setSettings(prev => {
      const isAlreadyBlocked = prev.blockedDaysOfWeek.includes(day);
      const newBlockedDays = isAlreadyBlocked
        ? prev.blockedDaysOfWeek.filter(d => d !== day)
        : [...prev.blockedDaysOfWeek, day];
      return { ...prev, blockedDaysOfWeek: newBlockedDays };
    });
  };

  const handleRangeFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRangeForm(prev => ({ ...prev, [name]: value }));
  };

  const addBlockedRange = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rangeForm.startDate || !rangeForm.endDate) {
      toast.error('Please select both start and end dates');
      return;
    }
    if (rangeForm.startDate > rangeForm.endDate) {
      toast.error('Start date must be before or equal to end date');
      return;
    }

    setSettings(prev => ({
      ...prev,
      blockedRanges: [...prev.blockedRanges, { ...rangeForm }]
    }));

    setRangeForm({
      startDate: '',
      endDate: '',
      label: ''
    });
    toast.success('Temporary closure period added');
  };

  const removeBlockedRange = (index: number) => {
    setSettings(prev => ({
      ...prev,
      blockedRanges: prev.blockedRanges.filter((_, i) => i !== index)
    }));
    toast.success('Closure period removed');
  };

  const formatDateStr = (date: Date) => {
    const y = date.getFullYear();
    const m = String(date.getMonth() + 1).padStart(2, '0');
    const d = String(date.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  const isDateInRange = (dateStr: string, startDate: string, endDate: string) => {
    return dateStr >= startDate && dateStr <= endDate;
  };

  const handleDateClick = (date: Date) => {
    const dateStr = formatDateStr(date);
    
    // Check safety offset (today and tomorrow are automatically blocked)
    const offsetLimitDate = new Date(today);
    offsetLimitDate.setDate(today.getDate() + 2);
    if (date < offsetLimitDate) {
      toast.error("This date is within the 2-day safety offset window and is automatically blocked.");
      return;
    }

    // Check dynamic booking horizon duration limit
    const durationLimitDate = new Date(offsetLimitDate);
    durationLimitDate.setDate(offsetLimitDate.getDate() + settings.durationDays);
    if (date >= durationLimitDate) {
      toast.error(`This date is outside the active booking horizon (${settings.durationDays} days) and is already unavailable.`);
      return;
    }
    
    // Check if it has a confirmed booking
    if (confirmedDates.includes(dateStr)) {
      toast.error("Cannot block a date that already has a confirmed booking.");
      return;
    }
    
    // Check if it is blocked by weekly closures
    if (settings.blockedDaysOfWeek.includes(date.getDay())) {
      toast.error("This day is already blocked by your 'Weekly Days Off' rules.");
      return;
    }
    
    // Check if it is blocked by date ranges
    const isBlockedByRange = settings.blockedRanges.some(r => isDateInRange(dateStr, r.startDate, r.endDate));
    if (isBlockedByRange) {
      toast.error("This date is already blocked by your 'Custom Closed Periods' rules.");
      return;
    }
    
    // Toggle in blockedDates
    setSettings(prev => {
      const isAlreadyBlocked = prev.blockedDates.includes(dateStr);
      const newBlockedDates = isAlreadyBlocked
        ? prev.blockedDates.filter(d => d !== dateStr)
        : [...prev.blockedDates, dateStr];
      return { ...prev, blockedDates: newBlockedDates };
    });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const response = await fetch('/api/admin/booking-settings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (response.ok) {
        toast.success('Booking availability settings updated successfully');
        fetchSettings(); // Refresh
      } else {
        throw new Error('Failed to save settings');
      }
    } catch (error) {
      toast.error('Error saving booking settings');
    } finally {
      setSaving(false);
    }
  };

  // Calendar Helpers
  const getDaysInMonth = (year: number, month: number) => {
    const date = new Date(year, month, 1);
    const days = [];
    
    const startDayOfWeek = date.getDay();
    for (let i = 0; i < startDayOfWeek; i++) {
      days.push(null);
    }
    
    while (date.getMonth() === month) {
      days.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }
    
    return days;
  };

  // Generate current and next month calendars
  const calDate = new Date(today.getFullYear(), today.getMonth() + calendarOffset, 1);
  const calYear = calDate.getFullYear();
  const calMonth = calDate.getMonth();
  const daysInCal = getDaysInMonth(calYear, calMonth);

  const MONTH_NAMES = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-red-800"></div>
        <span className="ml-3 text-gray-600 font-medium">Loading settings...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Booking availability control settings</h1>
          <p className="text-gray-500 text-sm">Manage when customers can book Mehandi sessions</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center px-6 py-2.5 bg-red-800 text-white font-medium rounded-lg hover:bg-red-900 shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-800 transition-all disabled:opacity-70"
        >
          {saving ? (
            <>
              <RefreshCw className="animate-spin mr-2" size={18} />
              Saving...
            </>
          ) : (
            <>
              <Save size={18} className="mr-2" />
              Save Settings
            </>
          )}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Columns - Form Configurations */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Card 1: Display & Duration */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center">
              <CalendarRange className="mr-2.5 text-red-800" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">General Availability Rules</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Available Dates Label (Client Side)
                  </label>
                  <input
                    type="text"
                    name="labelText"
                    value={settings.labelText}
                    onChange={handleGeneralChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-red-800 focus:border-red-800 text-sm"
                    placeholder="e.g. Available Dates (Next 30 Days)"
                    required
                  />
                  <p className="mt-1.5 text-xs text-gray-500">
                    Header text displayed above the date picker during checkout.
                  </p>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    Booking Window Horizon
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      name="durationPreset"
                      value={durationPreset}
                      onChange={handleGeneralChange}
                      className="px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-red-800 focus:border-red-800 text-sm"
                    >
                      <option value="10">Next 10 Days</option>
                      <option value="30">Next 30 Days</option>
                      <option value="60">Next 60 Days</option>
                      <option value="custom">Custom Days...</option>
                    </select>
                    
                    {durationPreset === 'custom' && (
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="number"
                          name="durationDays"
                          value={settings.durationDays}
                          onChange={handleGeneralChange}
                          min="1"
                          max="365"
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-1 focus:ring-red-800 focus:border-red-800 text-sm"
                        />
                        <span className="text-xs text-gray-500">days</span>
                      </div>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs text-gray-500">
                    Calculated starting from 2 days from today (default safety offset).
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Weekly Days Off */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center">
              <Clock className="mr-2.5 text-red-800" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Weekly Days Off (Recurring)</h2>
            </div>
            <div className="p-6">
              <p className="text-sm text-gray-500 mb-4">
                Select recurring days of the week when your business is closed. These days will automatically be blocked on the client calendar.
              </p>
              
              <div className="flex flex-wrap gap-2.5">
                {['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].map((dayName, idx) => {
                  const isBlocked = settings.blockedDaysOfWeek.includes(idx);
                  return (
                    <button
                      key={dayName}
                      type="button"
                      onClick={() => toggleDayOfWeek(idx)}
                      className={`px-4 py-2 text-sm font-medium rounded-lg border transition-all duration-200 cursor-pointer ${
                        isBlocked
                          ? 'bg-red-50 border-red-300 text-red-800 shadow-sm'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center">
                        {isBlocked && <Check size={14} className="mr-1.5" />}
                        {dayName}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Card 3: Custom Closed Periods */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex items-center">
              <Calendar className="mr-2.5 text-red-800" size={20} />
              <h2 className="text-lg font-semibold text-gray-800">Custom Closed Periods (Ranges)</h2>
            </div>
            
            <div className="p-6 space-y-6">
              <p className="text-sm text-gray-500">
                Block booking for holidays, festivals, or vacations by adding custom date ranges.
              </p>
              
              <form onSubmit={addBlockedRange} className="bg-gray-50 p-4 rounded-lg border border-gray-200 grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Start Date</label>
                  <input
                    type="date"
                    name="startDate"
                    value={rangeForm.startDate}
                    onChange={handleRangeFormChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-800 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">End Date</label>
                  <input
                    type="date"
                    name="endDate"
                    value={rangeForm.endDate}
                    onChange={handleRangeFormChange}
                    className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-800 bg-white"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Reason/Label (Optional)</label>
                  <div className="flex space-x-2">
                    <input
                      type="text"
                      name="label"
                      placeholder="e.g. Diwali Vacation"
                      value={rangeForm.label}
                      onChange={handleRangeFormChange}
                      className="w-full px-3 py-1.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-red-800 bg-white"
                    />
                    <button
                      type="submit"
                      className="bg-red-800 text-white px-4 py-1.5 rounded-md hover:bg-red-900 transition-colors text-sm font-semibold flex items-center shrink-0 cursor-pointer"
                    >
                      <Plus size={16} className="mr-1" /> Add
                    </button>
                  </div>
                </div>
              </form>

              {/* Blocked Ranges List */}
              <div className="space-y-2">
                <h3 className="text-sm font-semibold text-gray-700">Configured Closed Periods</h3>
                {settings.blockedRanges.length === 0 ? (
                  <div className="text-center py-6 border-2 border-dashed border-gray-150 rounded-lg text-sm text-gray-400">
                    No custom closed periods defined.
                  </div>
                ) : (
                  <div className="max-h-60 overflow-y-auto divide-y divide-gray-100 border border-gray-200 rounded-lg">
                    {settings.blockedRanges.map((range, idx) => (
                      <div key={idx} className="flex justify-between items-center p-3 hover:bg-gray-50 text-sm">
                        <div>
                          <span className="font-semibold text-gray-800">
                            {new Date(range.startDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          <span className="mx-2 text-gray-400">to</span>
                          <span className="font-semibold text-gray-800">
                            {new Date(range.endDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                          </span>
                          {range.label && (
                            <span className="ml-3 px-2 py-0.5 bg-red-50 text-red-700 text-xs font-medium rounded-full">
                              {range.label}
                            </span>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => removeBlockedRange(idx)}
                          className="text-gray-400 hover:text-red-700 p-1.5 rounded-md hover:bg-gray-100 transition-colors cursor-pointer"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        {/* Right Column - Visual Calendar Date Selector */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden sticky top-24">
            
            <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
              <div className="flex items-center">
                <Lock className="mr-2.5 text-red-800" size={20} />
                <h2 className="text-lg font-semibold text-gray-800">Block Specific Dates</h2>
              </div>
            </div>
            
            <div className="p-6">
              <p className="text-xs text-gray-500 mb-4">
                Click specific days on the calendar to toggle booking availability. Green days are open, red days are blocked, orange days are booked.
              </p>

              {/* Month Switcher */}
              <div className="flex justify-between items-center mb-4">
                <button
                  type="button"
                  onClick={() => setCalendarOffset(prev => Math.max(0, prev - 1))}
                  disabled={calendarOffset === 0}
                  className="px-2.5 py-1 text-xs font-semibold border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Previous
                </button>
                <span className="text-sm font-bold text-gray-800">
                  {MONTH_NAMES[calMonth]} {calYear}
                </span>
                <button
                  type="button"
                  onClick={() => setCalendarOffset(prev => Math.min(11, prev + 1))}
                  disabled={calendarOffset === 3} // allow looking ahead up to 3 months
                  className="px-2.5 py-1 text-xs font-semibold border border-gray-200 rounded-md hover:bg-gray-50 disabled:opacity-40 transition-colors cursor-pointer"
                >
                  Next
                </button>
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1 text-center mb-6">
                {WEEK_DAYS.map(day => (
                  <span key={day} className="text-xxs font-bold text-gray-400 py-1 uppercase">
                    {day}
                  </span>
                ))}
                
                {daysInCal.map((date, index) => {
                  if (!date) {
                    return <div key={`empty-${index}`} className="h-9" />;
                  }

                  const dateStr = formatDateStr(date);
                  const isPast = date < today;
                  
                  // 2-day offset check (today and tomorrow are automatically blocked)
                  const offsetLimitDate = new Date(today);
                  offsetLimitDate.setDate(today.getDate() + 2);
                  const isSafetyOffset = !isPast && date < offsetLimitDate;

                  // Horizon duration check: dates beyond (safety offset + durationDays) are out of the active window
                  const durationLimitDate = new Date(offsetLimitDate);
                  durationLimitDate.setDate(offsetLimitDate.getDate() + settings.durationDays);
                  const isOutOfHorizon = !isPast && !isSafetyOffset && date >= durationLimitDate;
                  
                  // Check booking states
                  const isConfirmedBooked = confirmedDates.includes(dateStr);
                  const isWeeklyOff = settings.blockedDaysOfWeek.includes(date.getDay());
                  const isBlockedRange = settings.blockedRanges.some(r => isDateInRange(dateStr, r.startDate, r.endDate));
                  const isManuallyBlocked = settings.blockedDates.includes(dateStr);
                  
                  const isBlocked = isWeeklyOff || isBlockedRange || isManuallyBlocked;

                  let bgClass = 'bg-green-50 text-green-800 hover:bg-green-100 border-green-200';
                  let statusText = 'Available';

                  if (isPast) {
                    bgClass = 'bg-gray-50 text-gray-300 border-gray-100 cursor-not-allowed';
                    statusText = 'Past';
                  } else if (isSafetyOffset) {
                    bgClass = 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed';
                    statusText = 'Safety Offset (Blocked)';
                  } else if (isOutOfHorizon) {
                    bgClass = 'bg-gray-50 text-gray-300 border-gray-150 cursor-not-allowed';
                    statusText = 'Out of Horizon';
                  } else if (isConfirmedBooked) {
                    bgClass = 'bg-orange-50 text-orange-800 border-orange-200 cursor-not-allowed font-semibold';
                    statusText = 'Booked';
                  } else if (isBlocked) {
                    bgClass = 'bg-red-50 text-red-800 border-red-200 font-medium';
                    statusText = 'Blocked';
                  }

                  return (
                    <button
                      key={dateStr}
                      type="button"
                      disabled={isPast || isSafetyOffset || isOutOfHorizon || isConfirmedBooked}
                      onClick={() => handleDateClick(date)}
                      title={`${date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })} - ${statusText}`}
                      className={`h-10 text-xs rounded-md border flex flex-col justify-center items-center transition-all ${bgClass} ${
                        !isPast && !isSafetyOffset && !isOutOfHorizon && !isConfirmedBooked ? 'cursor-pointer' : ''
                      }`}
                    >
                      <span className="font-semibold">{date.getDate()}</span>
                      {isConfirmedBooked && (
                        <span className="text-[8px] leading-tight text-orange-600 font-bold">Booked</span>
                      )}
                      {!isPast && isSafetyOffset && (
                        <span className="text-[8px] leading-tight text-gray-500">Offset</span>
                      )}
                      {!isPast && !isSafetyOffset && isOutOfHorizon && (
                        <span className="text-[8px] leading-tight text-gray-400">Locked</span>
                      )}
                      {!isPast && !isSafetyOffset && !isOutOfHorizon && !isConfirmedBooked && isBlocked && (
                        <span className="text-[8px] leading-tight text-red-600">Blocked</span>
                      )}
                      {!isPast && !isSafetyOffset && !isOutOfHorizon && !isConfirmedBooked && !isBlocked && (
                        <span className="text-[8px] leading-tight text-green-600">Open</span>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Color Code Legend */}
              <div className="space-y-2 border-t border-gray-100 pt-4 text-xs">
                <div className="font-semibold text-gray-700 mb-1">Calendar Legend:</div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-50 border border-green-200 rounded mr-2" />
                  <span className="text-gray-600">Available (Open for bookings)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-50 border border-red-200 rounded mr-2" />
                  <span className="text-gray-600">Blocked (Disabled for bookings)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-orange-50 border border-orange-200 rounded mr-2" />
                  <span className="text-gray-600">Confirmed Booking (Fully Booked)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-100 border border-gray-200 rounded mr-2" />
                  <span className="text-gray-600">Safety Offset (Always Blocked)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-50 border border-gray-150 rounded mr-2" />
                  <span className="text-gray-600">Out of Horizon (Not bookable yet)</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-50 border border-gray-100 rounded mr-2" />
                  <span className="text-gray-600">Past Date</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
