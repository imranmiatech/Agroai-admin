import React from 'react';
import { ArrowRight, ArrowLeft, CheckCircle2, Lock } from 'lucide-react';

interface ForgotPasswordCardProps {
  forgotEmail: string;
  setForgotEmail: (val: string) => void;
  forgotSent: boolean;
  isLoading: boolean;
  errorMsg: string;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

export const ForgotPasswordCard: React.FC<ForgotPasswordCardProps> = ({
  forgotEmail,
  setForgotEmail,
  forgotSent,
  isLoading,
  errorMsg,
  onSubmit,
  onBackToLogin,
}) => {
  return (
    <div className="w-full max-w-[540px] flex flex-col items-center">
      <div className="w-full bg-white border border-[#E7EEEE] rounded-[16px] p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
        <button
          type="button"
          onClick={onBackToLogin}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-800 mb-5 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          Back to Login
        </button>

        {!forgotSent ? (
          <>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-[#0B5460]/10 text-[#0B5460] flex items-center justify-center">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-bold text-[#0F172A]">Reset Your Password</h2>
                <p className="text-xs text-slate-500">
                  Enter your email address and we will send you a recovery link.
                </p>
              </div>
            </div>

            {errorMsg && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium mb-4">
                {errorMsg}
              </div>
            )}

            <form onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-[14px] font-medium text-[#20293A]">
                  Email <span className="text-[#EF4444]">*</span>
                </label>
                <div className="mt-2 w-full h-[40px] px-3 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[16px] flex items-center transition-all focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10">
                  <input
                    type="email"
                    value={forgotEmail}
                    onChange={(e) => setForgotEmail(e.target.value)}
                    placeholder="hello@business.com"
                    className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#697586] outline-none"
                    required
                  />
                </div>
              </div>

              <div className="border-t border-[#F4F4F4] pt-5 mt-7 flex justify-end">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="px-4 py-2 bg-[#0B5460] hover:bg-[#08424C] disabled:opacity-60 text-white text-[13.5px] font-semibold rounded-[16px] transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Sending...
                    </span>
                  ) : (
                    <>
                      <span>Send Recovery Link</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </>
                  )}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-slate-900 mb-1">Recovery Link Sent</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
              We have sent instructions to reset your password to <strong>{forgotEmail}</strong>.
            </p>
            <button
              type="button"
              onClick={onBackToLogin}
              className="px-4 py-2 bg-[#0B5460] text-white text-[13.5px] font-semibold rounded-[16px] hover:bg-[#08404A] transition-colors cursor-pointer"
            >
              Return to Log in
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
