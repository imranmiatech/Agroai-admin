import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import {
  ForgotPasswordInputCard,
  ForgotOtpVerificationCard,
} from '../../components/authComponents/reset';

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

    // Simulate sending OTP and navigate to Reset Password page
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
      {/* Back to Login link */}
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
        <ForgotPasswordInputCard
          email={email}
          setEmail={setEmail}
          isLoading={isLoading}
          errorMsg={errorMsg}
          onSubmit={handleSubmit}
        />
      ) : (
        <ForgotOtpVerificationCard
          email={email}
          otpCode={otpCode}
          isLoading={isLoading}
          onOtpChange={handleOtpChange}
          onOtpKeyDown={handleOtpKeyDown}
          onChangeEmail={() => {
            setIsSubmitted(false);
            setOtpCode(['', '', '', '', '', '']);
          }}
          onSubmit={(e) => {
            e.preventDefault();
            setIsLoading(true);
            setTimeout(() => {
              setIsLoading(false);
              navigate('/login');
            }, 800);
          }}
        />
      )}

      {/* Footer disclaimer */}
      <div className="mt-12 text-center text-xs text-slate-400 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#0B5460]" />
        <span>Protected by Krisikunjo Secure Enterprise Authentication</span>
      </div>
    </div>
  );
};

export default ForgetPassword;
