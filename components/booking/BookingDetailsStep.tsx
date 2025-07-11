import { Calendar, Clock, MapPin } from 'lucide-react';
import { format } from 'date-fns';
import Button from '../ui/Button';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Plan } from '@/types/plan';

interface BookingDetails {
  name: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  occasion: string;
  numberOfPeople: number;
  specialRequirements: string;    
}


interface BookingDetailsStepProps {
  plan: Plan;
  date: Date;
  bookingDetails: BookingDetails;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBack: () => void;
}

const BookingDetailsStep: React.FC<BookingDetailsStepProps> = ({
  plan,
  date,
  bookingDetails,
  onInputChange,
  onSubmit,
  onBack
}) => {
  const { isAuthenticated, user } = useAuth();
  const router = useRouter();

  console.log(plan, 'plan ......');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isAuthenticated || !user?.id) {
      toast.error('Please login to book a session');
      router.push('/auth');
      return;
    }

    try { 
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}` 
        },
        body: JSON.stringify({
          plan,
          date,
          bookingDetails
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit booking');
      }

      const data = await response.json();
      toast.success('Booking request submitted successfully!');
      onSubmit(e); // This will trigger the parent component to move to the next step
    } catch (error) {
      toast.error('Failed to submit booking. Please try again.');
      console.error('Booking error:', error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Booking Details</h3>
          </div>
          
          <div className="p-6">
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                  </label>
                  <input 
                    type="text" 
                    name="name" 
                    className="input-field w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                    value={bookingDetails.name}
                    onChange={onInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Phone Number
                  </label>
                  <input 
                    type="tel" 
                    name="phone" 
                    pattern="[0-9]{10}"
                    className={`input-field w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent`}
                    value={bookingDetails.phone}
                    onChange={onInputChange}
                    title="Please enter exactly 10 digits (numbers only)"
                    maxLength={10}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <input 
                    type="email" 
                    name="email" 
                    className="input-field w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                    value={bookingDetails.email}
                    onChange={onInputChange}
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Occasion
                  </label>
                  <select 
                    name="occasion" 
                    className="input-field w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                    value={bookingDetails.occasion}
                    onChange={onInputChange}
                    required
                  >
                    <option value="">Select Occasion</option>
                    <option value="Wedding">Wedding</option>
                    <option value="Engagement">Engagement</option>
                    <option value="Birthday">Birthday</option>
                    <option value="Festival">Festival</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of People
                  </label>
                  <input 
                    type="number" 
                    name="numberOfPeople" 
                    min="1" 
                    className="input-field border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                    value={bookingDetails.numberOfPeople}
                    onChange={onInputChange}
                    required
                  />
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Address
                  </label>
                  <input 
                    type="text" 
                    name="address" 
                    className="input-field mb-3 w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                    placeholder="Street Address"
                    value={bookingDetails.address}
                    onChange={onInputChange}
                    required
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input 
                      type="text" 
                      name="city" 
                      placeholder="City"
                      className="input-field border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                      value={bookingDetails.city}
                      onChange={onInputChange}
                      required
                    />
                    <input 
                      type="text" 
                      name="state" 
                      placeholder="State"
                      className="input-field border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                      value={bookingDetails.state}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                  <div className="mt-3">
                    <input 
                      type="text" 
                      name="postalCode" 
                      placeholder="Postal Code"
                      className="input-field border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                      value={bookingDetails.postalCode}
                      onChange={onInputChange}
                      required
                    />
                  </div>
                </div>
                
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Special Requirements (Optional)
                  </label>
                  <textarea 
                    name="specialRequirements" 
                    className="input-field min-h-[100px] w-full border border-gray-400 rounded-md p-2 focus:ring-2 focus:ring-brown-600 focus:outline-none focus:border-transparent"
                    placeholder="Any specific design preferences or requirements..."
                    value={bookingDetails.specialRequirements}
                    onChange={onInputChange}
                  ></textarea>
                </div>
              </div>
              
              <div className="mt-8 flex justify-between">
                <Button 
                  variant='outline'
                  type="button" 
                  className="btn-outline"
                  onClick={onBack}
                >
                  Back
                </Button>
                <Button 
                  variant='primary'
                  type="submit" 
                  className="btn-primary"
                >
                  Reserve Slot (Payment Offline)
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
      
      <div className="lg:col-span-1">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden sticky top-24">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold">Booking Summary</h3>
          </div>
          <div className="p-4">
            <div className="mb-4">
              <h4 className="font-medium text-base">{plan.name}</h4>
              <p className="text-sm text-gray-600">
                {plan.price > 0 ? 'Professional Mehandi Service' : 'Initial Discussion'}
              </p>
            </div>
            
            <div className="space-y-3 mb-4">
              <div className="flex items-start">
                <Calendar size={18} className="text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Date</p>
                  <p className="text-gray-600">{format(date, 'EEEE, MMMM d, yyyy')}</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <MapPin size={18} className="text-gray-500 mr-2 mt-0.5" />
                <div>
                  <p className="font-medium">Location</p>
                  <p className="text-gray-600">Your provided address</p>
                </div>
              </div>
            </div>
            
            {plan.price > 0 && (
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Plan Price</span>
                  <span>₹{plan.price}</span>
                </div>
                <div className="flex justify-between font-semibold text-lg mt-4">
                  <span>Total</span>
                  <span className="text-red-900">₹{plan.price}</span>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingDetailsStep;