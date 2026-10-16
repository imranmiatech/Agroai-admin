import React from 'react';
import { ArrowRight, ArrowLeft } from 'lucide-react';

interface StepOtpVerificationProps {
  otpOption: 'email' | 'phone';
  phoneNumber: string;
  email: string;
  otpValue: string;
  setOtpValue: (val: string) => void;
  canResend: boolean;
  resendTimer: number;
  onResendCode: () => void;
  errorMsg: string;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const StepOtpVerification: React.FC<StepOtpVerificationProps> = ({
  otpOption,
  phoneNumber,
  email,
  otpValue,
  setOtpValue,
  canResend,
  resendTimer,
  onResendCode,
  errorMsg,
  onBack,
  onSubmit,
}) => {
  return (
    <div className="w-full max-w-[540px] flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-[28px] sm:text-[30px] font-bold text-[#00373E]">
          Enter the code
        </h1>
        <p className="text-[15px] sm:text-[16px] font-medium text-[#4B5563] mt-1">
          Enter the code we’ve sent to your {otpOption === 'phone' ? 'phone' : 'e-mail'}
        </p>
      </div>

      {/* OTP Card */}
      <div className="w-full bg-white border border-[#E7EEEE] rounded-[16px] p-6 sm:p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-[12px] text-red-600 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-[14px] font-medium text-[#20293A] mb-2">
              One time password <span className="text-[#EF4444]">*</span>
            </label>
            <div className="w-full h-[46px] px-4 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
              <input
                type="text"
                maxLength={6}
                autoFocus
                value={otpValue}
                onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter your otp"
                className="w-full bg-transparent text-[15px] font-medium tracking-widest text-[#0F172A] placeholder:tracking-normal placeholder:text-[#94A3B8] outline-none"
              />
            </div>

            {/* Resend Timer / Action */}
            <div className="mt-3 flex items-center justify-between text-xs text-[#64748B]">
              <span>Target: {otpOption === 'phone' ? (phoneNumber || 'phone') : (email || 'e-mail')}</span>
              {canResend ? (
                <button
                  type="button"
                  onClick={onResendCode}
                  className="text-[#0B5460] font-semibold hover:underline"
                >
                  Resend code
                </button>
              ) : (
                <span>Resend code in {resendTimer}s</span>
              )}
            </div>
          </div>

          {/* Divider and Actions */}
          <div className="border-t border-[#EEF2F6] pt-4 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1F2A37] px-5 py-2.5 rounded-[16px] font-semibold text-[14px] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              className="bg-[#0B5460] hover:bg-[#08424C] text-white px-7 py-2.5 rounded-[16px] font-semibold text-[13.5px] transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.99] cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
