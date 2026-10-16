import React from 'react';
import { ArrowRight } from 'lucide-react';

interface ForgotPasswordInputCardProps {
  email: string;
  setEmail: (val: string) => void;
  isLoading: boolean;
  errorMsg: string;
  onSubmit: (e: React.FormEvent) => void;
}

export const ForgotPasswordInputCard: React.FC<ForgotPasswordInputCardProps> = ({
  email,
  setEmail,
  isLoading,
  errorMsg,
  onSubmit,
}) => {
  return (
    <div className="w-full max-w-[540px] flex flex-col items-center">
      {/* Heading Section */}
      <div className="w-full max-w-[451px] flex flex-col items-center text-center space-y-4">
        <h1 className="text-[30px] font-bold leading-[38px] text-[#0B5460] tracking-normal">
          Forgotten password?
        </h1>
        <p className="text-[16px] font-medium leading-[24px] text-[#364152] max-w-[398px]">
          Enter your associated e-mail, we’ll send an one time password
        </p>
      </div>

      {/* White Card Container */}
      <div className="w-full mt-7 bg-white border border-[#E7EEEE] rounded-[16px] p-6 sm:p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
        <form onSubmit={onSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Email Input Field */}
          <div>
            <label className="block text-[14px] font-medium text-[#20293A]">
              Email <span className="text-[#EF4444]">*</span>
            </label>
            <div className="mt-2 w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[16px] flex items-center transition-all focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hello@business.com"
                className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#697586] outline-none"
                autoFocus
                required
              />
            </div>
          </div>

          {/* Divider and Continue Button */}
          <div className="border-t border-[#F4F4F4] pt-5 mt-7 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#0B5460] hover:bg-[#08404A] disabled:opacity-60 text-white text-[13.5px] font-semibold rounded-[16px] transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending...
                </span>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
