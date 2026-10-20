import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import {
  LoginFormCard,
  ForgotPasswordCard,
  AuthSuccessCard,
} from '../../components/authComponents/login';
import { useLoginMutation } from '../../redux/feature/auth/authApi';
import { useAppDispatch } from '../../redux/store/hooks';
import { setCredentials } from '../../redux/feature/auth/authSlice';

export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [loginMutation, { isLoading }] = useLoginMutation();

  // Sub-view: 'auth' | 'forgot_password' | 'success'
  const [viewState, setViewState] = useState<'auth' | 'forgot_password' | 'success'>('auth');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Forgot password state
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSent, setForgotSent] = useState(false);
  const [isForgotLoading, setIsForgotLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
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

    try {
      const res = await loginMutation({
        email: email.trim().toLowerCase(),
        password,
      }).unwrap();

      const user = res?.data?.user || res?.user;
      const token = res?.data?.accessToken || res?.data?.token || res?.accessToken;
      const refreshToken = res?.data?.refreshToken || res?.refreshToken;

      if (!user || !token) {
        throw new Error('Invalid response structure received from authentication server.');
      }

      dispatch(setCredentials({ user, token, refreshToken }));
      setSuccessMsg(res?.message || 'Signed in successfully!');
      setViewState('success');

      setTimeout(() => {
        if (user.role === 'ADMIN') {
          navigate('/admin/overview');
        } else {
          navigate('/vendor/overview');
        }
      }, 700);
    } catch (err: any) {
      const msg =
        err?.data?.message ||
        err?.error ||
        err?.message ||
        'Unable to log in. Please check your credentials or account status.';
      setErrorMsg(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail.trim()) {
      setErrorMsg('Please enter your email address.');
      return;
    }
    setIsForgotLoading(true);
    setTimeout(() => {
      setIsForgotLoading(false);
      setForgotSent(true);
    }, 600);
  };

  return (
    <div className="min-h-screen w-full bg-[#F4F4F4] text-[#0F172A] flex flex-col items-center justify-center p-4 sm:p-6 font-['Inter',sans-serif]">
      {viewState === 'auth' && (
        <LoginFormCard
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          isLoading={isLoading}
          errorMsg={errorMsg}
          onSubmit={handleSubmit}
          onNavigateSignUp={() => navigate('/signup')}
          onNavigateForgotPassword={() => navigate('/forgot-password')}
        />
      )}

      {/* Forgot Password Flow */}
      {viewState === 'forgot_password' && (
        <ForgotPasswordCard
          forgotEmail={forgotEmail}
          setForgotEmail={setForgotEmail}
          forgotSent={forgotSent}
          isLoading={isForgotLoading}
          errorMsg={errorMsg}
          onSubmit={handleForgotSubmit}
          onBackToLogin={() => {
            setViewState('auth');
            setForgotSent(false);
            setErrorMsg('');
          }}
        />
      )}

      {/* Success Notification / Redirection */}
      {viewState === 'success' && (
        <AuthSuccessCard message={successMsg} email={email} />
      )}

      {/* Footer disclaimer */}
      <div className="mt-12 text-center text-xs text-slate-400 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#0B5460]" />
        <span>Protected by Krisikunjo Secure Enterprise Authentication</span>
      </div>
    </div>
  );
};

export default AuthPage;
