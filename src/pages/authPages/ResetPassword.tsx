import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, ShieldCheck } from 'lucide-react';
import { ResetPasswordCard } from '../../components/authComponents/reset';
import {
  useForgotPasswordMutation,
  useVerifyForgotOtpMutation,
  useResetPasswordMutation,
} from '../../redux/feature/auth/authApi';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const email = (location.state as { email?: string })?.email || '';

  // Step state: 'otp' | 'password'
  const [step, setStep] = useState<'otp' | 'password'>('otp');

  // Form states
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & error states
  const [errorMsg, setErrorMsg] = useState('');

  // Resend code timer state
  const [resendTimer, setResendTimer] = useState(60);

  // RTK Mutations
  const [verifyForgotOtp, { isLoading: isVerifyingOtp }] = useVerifyForgotOtpMutation();
  const [resetPassword, { isLoading: isResettingPassword }] = useResetPasswordMutation();
  const [forgotPassword] = useForgotPasswordMutation();

  const isLoading = isVerifyingOtp || isResettingPassword;

  // Helper to extract clean error message
  const extractErrorMessage = (err: any, defaultMsg: string): string => {
    if (err?.data?.message) {
      if (Array.isArray(err.data.message)) {
        return err.data.message.join(', ');
      }
      return String(err.data.message);
    }
    if (err?.error) {
      return String(err.error);
    }
    if (err?.message) {
      return String(err.message);
    }
    return defaultMsg;
  };

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;
    if (resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (!email || resendTimer > 0) return;
    try {
      setErrorMsg('');
      setResendTimer(60);
      const res = await forgotPassword({ email: email.trim().toLowerCase() }).unwrap();
      if (res?.data?.debugOtp) {
        console.info(`[Dev Password Reset OTP]: ${res.data.debugOtp}`);
      }
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Failed to resend code. Please try again.'));
    }
  };

  // Step 1: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otp.trim()) {
      setErrorMsg('Please enter the one-time verification code sent to your email.');
      return;
    }

    if (!email) {
      setErrorMsg('Email reference missing. Please return to Forgot Password page.');
      return;
    }

    try {
      const res = await verifyForgotOtp({
        email: email.trim().toLowerCase(),
        otpCode: otp.trim(),
      }).unwrap();

      if (res.success || res.data?.verified) {
        setStep('password');
        setErrorMsg('');
      }
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Invalid or expired OTP code. Please request a new one.'));
    }
  };

  // Step 2: Set New Password
  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!newPassword) {
      setErrorMsg('Please enter your new password.');
      return;
    }

    if (newPassword.length < 6) {
      setErrorMsg('Password must be at least 6 characters long.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please verify your confirm password.');
      return;
    }

    try {
      await resetPassword({
        email: email.trim().toLowerCase(),
        otpCode: otp.trim(),
        newPassword,
      }).unwrap();

      navigate('/reset-success');
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Password reset failed. Please request a new code and try again.'));
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F4F4] text-[#0F172A] flex flex-col items-center justify-center p-4 sm:p-6 font-['Inter',sans-serif]">
      {/* Back button */}
      <div className="w-full max-w-[540px] mb-6 flex justify-start">
        <button
          type="button"
          onClick={() => {
            if (step === 'password') {
              setErrorMsg('');
              setStep('otp');
            } else {
              navigate('/login');
            }
          }}
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#0B5460] hover:text-[#08404A] bg-white/80 hover:bg-white px-3.5 py-2 rounded-full border border-gray-200 shadow-xs cursor-pointer transition-all"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>{step === 'password' ? 'Back to OTP' : 'Back to Log in'}</span>
        </button>
      </div>

      <ResetPasswordCard
        step={step}
        email={email}
        otp={otp}
        setOtp={setOtp}
        newPassword={newPassword}
        setNewPassword={setNewPassword}
        confirmPassword={confirmPassword}
        setConfirmPassword={setConfirmPassword}
        showNewPassword={showNewPassword}
        setShowNewPassword={setShowNewPassword}
        showConfirmPassword={showConfirmPassword}
        setShowConfirmPassword={setShowConfirmPassword}
        isLoading={isLoading}
        errorMsg={errorMsg}
        onSubmit={step === 'otp' ? handleOtpSubmit : handlePasswordSubmit}
        onResendOtp={email ? handleResendOtp : undefined}
        resendTimer={resendTimer}
      />

      {/* Footer disclaimer */}
      <div className="mt-12 text-center text-xs text-slate-400 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#0B5460]" />
        <span>Protected by Krisikunjo Secure Enterprise Authentication</span>
      </div>
    </div>
  );
};

export default ResetPassword;
