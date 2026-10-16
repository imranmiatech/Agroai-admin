import React from 'react';
import { Eye, EyeOff, ArrowRight } from 'lucide-react';

interface LoginFormCardProps {
  email: string;
  setEmail: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  isLoading: boolean;
  errorMsg: string;
  onSubmit: (e: React.FormEvent) => void;
  onNavigateSignUp: () => void;
  onNavigateForgotPassword: () => void;
}

export const LoginFormCard: React.FC<LoginFormCardProps> = ({
  email,
  setEmail,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  isLoading,
  errorMsg,
  onSubmit,
  onNavigateSignUp,
  onNavigateForgotPassword,
}) => {
  return (
    <div className="w-full max-w-[540px] flex flex-col items-center">
      {/* Centered Card */}
      <div className="w-full bg-white border border-[#E7EEEE] rounded-[16px] p-6 sm:p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
        <form onSubmit={onSubmit} className="space-y-4">
          {errorMsg && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
              {errorMsg}
            </div>
          )}

          {/* Email field */}
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
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div>
            <label className="block text-[14px] font-medium text-[#20293A]">
              Password <span className="text-[#EF4444]">*</span>
            </label>
            <div className="mt-2 w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[16px] flex items-center justify-between transition-all focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#697586] outline-none"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-slate-400 hover:text-slate-600 focus:outline-none p-1 cursor-pointer"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Bottom divider and Continue Button */}
          <div className="border-t border-[#F4F4F4] pt-5 mt-7 flex justify-end">
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-[#0B5460] hover:bg-[#08404A] disabled:opacity-60 text-white text-[13.5px] font-semibold rounded-[16px] transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing...
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

      {/* Below Card links: Sign up & Forgotten password */}
      <div className="w-full mt-4 flex items-center justify-between px-1">
        <span className="text-[14px] text-[#64748B]">
          Don't have an account?{' '}
          <button
            type="button"
            onClick={onNavigateSignUp}
            className="font-medium text-[#0B5460] hover:underline cursor-pointer"
          >
            Sign up
          </button>
        </span>
        <button
          type="button"
          onClick={onNavigateForgotPassword}
          className="text-[14px] font-medium text-[#0B5460] hover:underline cursor-pointer transition-colors"
        >
          Forgotten password?
        </button>
      </div>
    </div>
  );
};
