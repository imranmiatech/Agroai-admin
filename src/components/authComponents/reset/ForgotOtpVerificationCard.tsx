import React from 'react';
import { CheckCircle2, Mail } from 'lucide-react';

interface ForgotOtpVerificationCardProps {
  email: string;
  otpCode: string[];
  isLoading: boolean;
  onOtpChange: (index: number, val: string) => void;
  onOtpKeyDown: (index: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  onChangeEmail: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const ForgotOtpVerificationCard: React.FC<ForgotOtpVerificationCardProps> = ({
  email,
  otpCode,
  isLoading,
  onOtpChange,
  onOtpKeyDown,
  onChangeEmail,
  onSubmit,
}) => {
  return (
    <div className="w-full max-w-[540px] flex flex-col items-center">
      <div className="w-full max-w-[451px] flex flex-col items-center text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-[#0B5460]/10 text-[#0B5460] flex items-center justify-center mb-1">
          <Mail className="w-6 h-6" />
        </div>
        <h1 className="text-[28px] font-bold leading-[36px] text-[#0B5460]">
          Check Your Inbox
        </h1>
        <p className="text-[15px] font-medium leading-[22px] text-[#364152] max-w-[398px]">
          We have sent a 6-digit one time password to{' '}
          <strong className="text-[#0F172A]">{email}</strong>
        </p>
      </div>

      <div className="w-full mt-7 bg-white border border-[#E7EEEE] rounded-[16px] p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
        <form onSubmit={onSubmit} className="space-y-6">
          <div>
            <label className="block text-[14px] font-medium text-[#20293A] text-center mb-3">
              Enter 6-digit verification code
            </label>
            <div className="flex justify-center gap-2.5 sm:gap-3">
              {otpCode.map((digit, idx) => (
                <input
                  key={idx}
                  id={`otp-input-${idx}`}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => onOtpChange(idx, e.target.value)}
                  onKeyDown={(e) => onOtpKeyDown(idx, e)}
                  className="w-11 h-12 text-center text-lg font-bold bg-[#F8FAFC] border border-[#EEF2F6] rounded-xl focus:border-[#0B5460] focus:ring-2 focus:ring-[#0B5460]/10 outline-none text-[#0F172A] transition-all"
                />
              ))}
            </div>
          </div>

          <div className="border-t border-[#F4F4F4] pt-5 flex items-center justify-between">
            <button
              type="button"
              onClick={onChangeEmail}
              className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
            >
              Change email
            </button>

            <button
              type="submit"
              disabled={isLoading || otpCode.some((d) => !d)}
              className="px-5 py-2 bg-[#0B5460] hover:bg-[#08404A] disabled:opacity-50 text-white text-[13.5px] font-semibold rounded-[16px] transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                <>
                  <span>Verify & Continue</span>
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
