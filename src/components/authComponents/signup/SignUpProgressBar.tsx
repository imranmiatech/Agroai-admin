import React from 'react';

interface SignUpProgressBarProps {
  currentStep?: number;
  activeStep?: number;
}

export const SignUpProgressBar: React.FC<SignUpProgressBarProps> = ({ currentStep, activeStep }) => {
  const step = currentStep ?? activeStep ?? 1;

  return (
    <div className="flex items-center justify-center gap-2 mb-7">
      {/* Step 1 */}
      <div
        className={`w-8 h-8 rounded-full font-medium text-[14px] flex items-center justify-center shadow-xs transition-all ${
          step > 1
            ? 'bg-[#0B5460] text-white font-bold text-[13px]'
            : step === 1
            ? 'bg-[#0B5460] text-white'
            : 'bg-[#E2E8F0] text-[#64748B]'
        }`}
      >
        {step > 1 ? '✓' : '1'}
      </div>

      <div
        className={`w-12 sm:w-16 h-[1.5px] transition-all ${
          step > 1 ? 'bg-[#0B5460]' : 'bg-[#E2E8F0]'
        }`}
      />

      {/* Step 2 */}
      <div
        className={`w-8 h-8 rounded-full font-medium text-[14px] flex items-center justify-center transition-all ${
          step > 3
            ? 'bg-[#0B5460] text-white font-bold text-[13px] shadow-xs'
            : step === 3
            ? 'bg-[#0B5460] text-white shadow-xs'
            : 'bg-[#E2E8F0] text-[#64748B]'
        }`}
      >
        {step > 3 ? '✓' : '2'}
      </div>

      <div
        className={`w-12 sm:w-16 h-[1.5px] transition-all ${
          step >= 4 ? 'bg-[#0B5460]' : 'bg-[#E2E8F0]'
        }`}
      />

      {/* Step 3 */}
      <div
        className={`w-8 h-8 rounded-full font-medium text-[14px] flex items-center justify-center transition-all ${
          step >= 4
            ? 'bg-[#0B5460] text-white shadow-xs'
            : 'bg-[#E2E8F0] text-[#64748B]'
        }`}
      >
        3
      </div>
    </div>
  );
};
