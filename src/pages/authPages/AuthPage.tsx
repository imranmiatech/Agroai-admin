import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();

  // Sub-view: 'auth' | 'forgot_password' | 'success'
  const [viewState, setViewState] = useState<'auth' | 'forgot_password' | 'success'>('auth');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter your password.');
      return;
    }

    setIsLoading(true);

    // Simulate authentication
    setTimeout(() => {
      setIsLoading(false);
      setSuccessMsg('Signed in successfully!');
      setViewState('success');

      setTimeout(() => {
        if (email.toLowerCase().includes('admin')) {
          navigate('/admin/overview');
        } else {
          navigate('/vendor/overview');
        }
      }, 800);
    }, 600);
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      setForgotSent(true);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F4F4] text-[#0F172A] flex flex-col items-center justify-center p-4 sm:p-6 font-['Inter',sans-serif]">
      {viewState === 'auth' && (
        <div className="w-full max-w-[540px] flex flex-col items-center">
          {/* Centered Card matching Figma node 25762:61800 */}
          <div className="w-full bg-white border border-[#E7EEEE] rounded-[16px] p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Email field matching Figma node 25762:61804 */}
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

              {/* Password field matching Figma node 25762:61811 */}
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
                    className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                    tabIndex={-1}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Bottom divider and Continue Button matching Figma node 25762:61817 */}
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

          {/* Below Card links: Alternative Sign up & Forgotten password */}
          <div className="w-full mt-4 flex items-center justify-between px-1">
            <span className="text-[14px] text-[#64748B]">
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => navigate('/signup')}
                className="font-medium text-[#0B5460] hover:underline cursor-pointer"
              >
                Sign up
              </button>
            </span>
            <button
              type="button"
              onClick={() => navigate('/forgot-password')}
              className="text-[14px] font-medium text-[#0B5460] hover:underline cursor-pointer transition-colors"
            >
              Forgotten password?
            </button>
          </div>
        </div>
      )}

      {/* Forgot Password Flow */}
      {viewState === 'forgot_password' && (
        <div className="w-full max-w-[540px] flex flex-col items-center">
          <div className="w-full bg-white border border-[#E7EEEE] rounded-[16px] p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
            <button
              type="button"
              onClick={() => {
                setViewState('auth');
                setForgotSent(false);
                setErrorMsg('');
              }}
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

                <form onSubmit={handleForgotSubmit} className="space-y-4">
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
                      className="px-4 py-2 bg-[#0B5460] hover:bg-[#08404A] disabled:opacity-60 text-white text-[13.5px] font-semibold rounded-[16px] transition-all flex items-center gap-1.5 shadow-sm active:scale-95 cursor-pointer"
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
                  onClick={() => {
                    setViewState('auth');
                    setForgotSent(false);
                  }}
                  className="px-4 py-2 bg-[#0B5460] text-white text-[13.5px] font-semibold rounded-[16px] hover:bg-[#08404A] transition-colors"
                >
                  Return to Log in
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Success Notification / Redirection */}
      {viewState === 'success' && (
        <div className="w-full max-w-[420px] bg-white border border-[#E7EEEE] rounded-[20px] p-8 shadow-xl text-center">
          <div className="w-14 h-14 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-1">{successMsg}</h2>
          <p className="text-xs text-slate-500 mb-4">
            Redirecting to {email.toLowerCase().includes('admin') ? 'Admin Portal' : 'Vendor Portal'}...
          </p>
          <div className="w-8 h-1 bg-emerald-500 rounded-full mx-auto animate-pulse" />
        </div>
      )}

      {/* Footer disclaimer */}
      <div className="mt-12 text-center text-xs text-slate-400 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#0B5460]" />
        <span>Protected by Evaturner Secure Enterprise Authentication</span>
      </div>
    </div>
  );
};
export default AuthPage;
