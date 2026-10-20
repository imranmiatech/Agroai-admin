import React from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

export interface ResetPasswordCardProps {
  step?: 'otp' | 'password';
  otp: string;
  setOtp: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showNewPassword: boolean;
  setShowNewPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
  isLoading: boolean;
  errorMsg: string;
  email?: string;
  onSubmit: (e: React.FormEvent) => void;
  onResendOtp?: () => void;
  resendTimer?: number;
}

export const ResetPasswordCard: React.FC<ResetPasswordCardProps> = ({
  step = 'otp',
  otp,
  setOtp,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  isLoading,
  errorMsg,
  email,
  onSubmit,
  onResendOtp,
  resendTimer = 0,
}) => {
  if (step === 'otp') {
    return (
      <div className="w-full max-w-[540px] flex flex-col items-center">
        {/* Heading Section matching Figma node 25762:61899 */}
        <div className="w-full max-w-[451px] flex flex-col items-center text-center space-y-3">
          <h1 className="text-[30px] font-bold leading-[38px] text-[#0B5460] tracking-normal">
            Reset password
          </h1>
          <p className="text-[16px] font-medium leading-[24px] text-[#364152] max-w-[430px]">
            Enter the one time password that we’ve sent to your e-mail{email ? (
              <span className="block font-semibold text-[#0B5460] mt-0.5">{email}</span>
            ) : null}
          </p>
        </div>

        {/* Centered Card */}
        <div className="w-full mt-7 bg-white border border-[#E7EEEE] rounded-[16px] p-6 sm:p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
          <form onSubmit={onSubmit} className="space-y-4">
            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
                {errorMsg}
              </div>
            )}

            {/* Field: One time password */}
            <div>
              <label className="block text-[14px] font-medium text-[#20293A]">
                One time password <span className="text-[#EF4444]">*</span>
              </label>
              <div className="mt-2 w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[16px] flex items-center transition-all focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10">
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#697586] outline-none"
                  autoFocus
                  required
                />
              </div>
            </div>

            {/* Resend code if callback provided */}
            {onResendOtp && (
              <div className="flex justify-end pt-1">
                <button
                  type="button"
                  onClick={onResendOtp}
                  disabled={resendTimer > 0}
                  className="text-xs font-semibold text-[#0B5460] hover:text-[#08404A] disabled:text-slate-400 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  {resendTimer > 0 ? `Resend code in ${resendTimer}s` : 'Resend code'}
                </button>
              </div>
            )}

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
                    Verifying...
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
  }

  // Step 2: Set New Password
  return (
    <div className="w-full max-w-[540px] flex flex-col items-center">
      {/* Heading Section */}
      <div className="w-full max-w-[451px] flex flex-col items-center text-center space-y-3">
        <h1 className="text-[30px] font-bold leading-[38px] text-[#0B5460] tracking-normal">
          Reset password
        </h1>
        <p className="text-[16px] font-medium leading-[24px] text-[#364152] max-w-[430px]">
          Enter your new password to secure your account
        </p>
      </div>

      {/* Centered Card */}
      <div className="w-full mt-7 bg-white border border-[#E7EEEE] rounded-[16px] p-6 sm:p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
        <form onSubmit={onSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Field 1: New Password */}
          <div>
            <label className="block text-[14px] font-medium text-[#20293A]">
              New Password <span className="text-[#EF4444]">*</span>
            </label>
            <div className="mt-2 w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[16px] flex items-center justify-between transition-all focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10">
              <input
                type={showNewPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#697586] outline-none"
                autoFocus
                required
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer"
                tabIndex={-1}
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Field 2: Confirm password */}
          <div>
            <label className="block text-[14px] font-medium text-[#20293A]">
              Confirm password <span className="text-[#EF4444]">*</span>
            </label>
            <div className="mt-2 w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[16px] flex items-center justify-between transition-all focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#697586] outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer"
                tabIndex={-1}
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
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
                  Updating...
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
