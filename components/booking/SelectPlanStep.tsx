import Button from '../ui/Button';
import Image from 'next/image';
import SelectPlanStepSkeleton from '../skeleton/PlansSkeleton';
import { Plan } from '@/types/plan';

// interface Plan {
//   id: string;
//   name: string;
//   description: string;
//   price: number;
//   image: string;
// }

interface SelectPlanStepProps {
  plans: Plan[];
  onPlanSelect: (plan: Plan) => void;
  loading: boolean;
}

const SelectPlanStep: React.FC<SelectPlanStepProps> = ({ plans, onPlanSelect, loading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      {loading?(<SelectPlanStepSkeleton/>):plans.map(plan => (
        <div
          key={plan._id}
          className="bg-white rounded-lg shadow-md overflow-hidden p-6 flex flex-col justify-between"
        >
          <Image    
            src={plan.image}
            alt={plan.name}
            width={500}
            height={500}
            className="w-full h-80 rounded-md object-center object-cover"
          />
          <div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">{plan.name}</h3>
            <p className="text-gray-600 mb-4">{plan.description}</p>
          </div>

          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-1">
              <span className='italic'>Starting from</span> 
              <span className="text-lg font-semibold text-red-900">
                {plan.price===0?'Custom':'₹'+plan.price}
              </span>
            </div>
            <span className="text-sm text-gray-500">Plan Price</span>
          </div>

          <Button
            variant='primary'
            className="w-full btn-primary"
            onClick={() => onPlanSelect(plan)}
          >
            Select & Continue
          </Button>
        </div>
      ))}
    </div>
  );
};

export default SelectPlanStep;
