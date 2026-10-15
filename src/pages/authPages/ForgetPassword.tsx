import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, CheckCircle2, ShieldCheck, Mail } from 'lucide-react';

export const ForgetPassword: React.FC = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  // OTP state for simulation
  const [otpCode, setOtpCode] = useState(['', '', '', '', '', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!email.trim()) {
      setErrorMsg('Please enter your associated e-mail address.');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setErrorMsg('Please enter a valid e-mail address.');
      return;
    }

    setIsLoading(true);

    // Simulate sending OTP and navigate to Reset Password page (Figma node 25762:61899)
    setTimeout(() => {
      setIsLoading(false);
      navigate('/reset-password', { state: { email } });
    }, 600);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) {
      value = value.slice(-1);
    }
    const newOtp = [...otpCode];
    newOtp[index] = value;
    setOtpCode(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpCode[index] && index > 0) {
      const prevInput = document.getElementById(`otp-input-${index - 1}`);
      prevInput?.focus();
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F4F4] text-[#0F172A] flex flex-col items-center justify-center p-4 sm:p-6 font-['Inter',sans-serif]">
      {/* Back to Login link at top left */}
      <div className="w-full max-w-[540px] mb-6 flex justify-start">
        <button
          type="button"
          onClick={() => navigate('/login')}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B5460] hover:text-[#08404A] bg-white/80 hover:bg-white px-3.5 py-2 rounded-full border border-gray-200 shadow-xs cursor-pointer transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Log in</span>
        </button>
      </div>

      {!isSubmitted ? (
        <div className="w-full max-w-[540px] flex flex-col items-center">
          {/* Heading Section matching Figma node 25762:61896 */}
          <div className="w-full max-w-[451px] flex flex-col items-center text-center space-y-4">
            {/* Title matching Figma node 25762:61897 */}
            <h1 className="text-[30px] font-bold leading-[38px] text-[#0B5460] tracking-normal">
              Forgotten password?
            </h1>

            {/* Subtitle matching Figma node 25762:61898 */}
            <p className="text-[16px] font-medium leading-[24px] text-[#364152] max-w-[398px]">
              Enter your associated e-mail, we’ll send an one time password
            </p>
          </div>

          {/* White Card Container matching Figma node 25762:61882 */}
          <div className="w-full mt-7 bg-white border border-[#E7EEEE] rounded-[16px] p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Email Input Field matching Figma node 25762:61886 */}
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

              {/* Divider and Continue Button matching Figma node 25762:61893 */}
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
      ) : (
        /* OTP Sent / One Time Password View */
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
            <form
              onSubmit={(e) => {
                e.preventDefault();
                setIsLoading(true);
                setTimeout(() => {
                  setIsLoading(false);
                  navigate('/login');
                }, 800);
              }}
              className="space-y-6"
            >
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
                      onChange={(e) => handleOtpChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-11 h-12 text-center text-lg font-bold bg-[#F8FAFC] border border-[#EEF2F6] rounded-xl focus:border-[#0B5460] focus:ring-2 focus:ring-[#0B5460]/10 outline-none text-[#0F172A] transition-all"
                    />
                  ))}
                </div>
              </div>

              <div className="border-t border-[#F4F4F4] pt-5 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setOtpCode(['', '', '', '', '', '']);
                  }}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors"
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
      )}

      {/* Footer disclaimer */}
      <div className="mt-12 text-center text-xs text-slate-400 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#0B5460]" />
        <span>Protected by Evaturner Secure Enterprise Authentication</span>
      </div>
    </div>
  );
};

export default ForgetPassword;
