import { BadgeIndianRupee } from 'lucide-react';

interface SelectPlanStepSkeletonProps {
  count?: number;
}

const SelectPlanStepSkeleton: React.FC<SelectPlanStepSkeletonProps> = ({ count = 3 }) => {
  return (
    // <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
    <>
      {Array.from({ length: count }).map((_, index) => (
        <div
          key={index}
          className="bg-white rounded-lg shadow-md overflow-hidden p-6 flex flex-col justify-between animate-pulse"
        >
          {/* Image placeholder - matches your h-80 dimension */}
          <div className="w-full h-80 rounded-md bg-gray-200 mb-6"></div>
          
          {/* Title and description section */}
          <div className="mb-6 space-y-3">
            <div className="h-6 w-3/4 bg-gray-200 rounded"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-5/6"></div>
              <div className="h-4 bg-gray-200 rounded w-4/6"></div>
            </div>
          </div>

          {/* Price section - matches your flex justify-between layout */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-1">
              <div className="h-6 w-16 bg-gray-200 rounded"></div>
            </div>
            <div className="h-4 w-20 bg-gray-200 rounded"></div>
          </div>

          {/* Button - matches your Button component height */}
          <div className="w-full h-10 bg-gray-200 rounded-md"></div>
        </div>
      ))}
    </>
    // </div>
  );
};

export default SelectPlanStepSkeleton;