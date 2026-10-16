import React from 'react';

interface SignUpProgressBarProps {
  currentStep: number;
}

export const SignUpProgressBar: React.FC<SignUpProgressBarProps> = ({ currentStep }) => {
  return (
    <div className="flex items-center justify-center gap-2 mb-7">
      {/* Step 1 */}
      <div className={`w-8 h-8 rounded-full font-medium text-[14px] flex items-center justify-center shadow-xs transition-all ${
        currentStep > 1 
          ? 'bg-[#0B5460] text-white font-bold text-[13px]' 
          : currentStep === 1 
          ? 'bg-[#0B5460] text-white' 
          : 'bg-[#E2E8F0] text-[#64748B]'
      }`}>
        {currentStep > 1 ? '✓' : '1'}
      </div>

      <div className={`w-12 sm:w-16 h-[1.5px] transition-all ${
        currentStep > 1 ? 'bg-[#0B5460]' : 'bg-[#E2E8F0]'
      }`} />

      {/* Step 2 */}
      <div className={`w-8 h-8 rounded-full font-medium text-[14px] flex items-center justify-center transition-all ${
        currentStep > 3 
          ? 'bg-[#0B5460] text-white font-bold text-[13px] shadow-xs' 
          : currentStep === 3 
          ? 'bg-[#0B5460] text-white shadow-xs' 
          : 'bg-[#E2E8F0] text-[#64748B]'
      }`}>
        {currentStep > 3 ? '✓' : '2'}
      </div>

      <div className={`w-12 sm:w-16 h-[1.5px] transition-all ${
        currentStep >= 4 ? 'bg-[#0B5460]' : 'bg-[#E2E8F0]'
      }`} />

      {/* Step 3 */}
      <div className={`w-8 h-8 rounded-full font-medium text-[14px] flex items-center justify-center transition-all ${
        currentStep >= 4 
          ? 'bg-[#0B5460] text-white shadow-xs' 
          : 'bg-[#E2E8F0] text-[#64748B]'
      }`}>
        3
      </div>
    </div>
  );
};
