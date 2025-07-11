import React from 'react';

const BookingSteps = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center space-y-4 sm:space-y-0 overflow-x-auto">
        {[1, 2, 3, 4].map((step) => (
          <React.Fragment key={step}>
            <div className="flex items-center flex-shrink-0">
              <div 
                className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                  currentStep >= step ? 'bg-red-900 text-white' : 'bg-gray-200 text-gray-600'
                }`}
              >
                {step}
              </div>
              <div 
                className={`ml-2 text-sm md:text-base ${
                  currentStep >= step ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}
              >
                {step === 1 && 'Select Plan'}
                {step === 2 && 'Date & Time'}
                {step === 3 && 'Details'}
                {step === 4 && 'Confirmation'}
              </div>
            </div>
            {step < 4 && (
              <div 
                className={`hidden sm:block flex-1 mx-2 md:mx-4 h-1 ${
                  currentStep > step ? 'bg-red-900' : 'bg-gray-200'
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* Mobile progress indicator (alternative to the connecting lines) */}
      <div className="sm:hidden mt-4 w-full bg-gray-200 rounded-full h-2">
        <div 
          className="bg-red-900 h-2 rounded-full" 
          style={{ width: `${(currentStep - 1) * 33.33}%` }}
        ></div>
      </div>
    </div>
  );
};

export default BookingSteps;