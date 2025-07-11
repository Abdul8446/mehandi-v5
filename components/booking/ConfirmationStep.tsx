import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import Button from '../ui/Button';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
}

interface ConfirmationStepProps {
  plan: Plan;
  date: Date | null;
  // timeSlot: string;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ plan, date }) => {
  const router = useRouter();

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-sm p-8 text-center">
      <div className="w-20 h-20 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-6">
        {/* <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg> */}
        <svg className="w-10 h-10 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Booking Request in Progress!</h2>
      <p className="text-gray-600 mb-2">
        You've requested the <strong>{plan.name}</strong> plan for:
      </p>
      <p className="text-gray-600 mb-6">
        📅 {date && format(date, 'MMMM d, yyyy')}.
      </p>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 text-left">
        <p className="font-medium text-yellow-800">Important:</p>
        <p>Our team will call you within 24 hours to:</p>
        <ul className="list-disc pl-5 mt-2 space-y-1">
          <li>Confirm your booking</li>
          <li>Discuss payment details</li>
          <li>Finalize any special requirements</li>
        </ul>
      </div>

      <p className="mb-6">
        Your slot will be officially confirmed only after this call.
      </p>
      {/* <p className="text-gray-600 mb-8">
        A confirmation has been sent to your email and phone. You can also view your booking details in your account.
      </p> */}
      <div className="flex flex-col sm:flex-row justify-center gap-4">
        <Button
          variant='outline' 
          className="btn-primary"
          onClick={() => router.push('/my-bookings')}
        >
          View My Bookings
        </Button>
        <Button
          variant='primary' 
          className="btn-outline"
          onClick={() => router.push('/')}
        >
          Return to Home
        </Button>
      </div>
    </div>
  );
};

export default ConfirmationStep;
