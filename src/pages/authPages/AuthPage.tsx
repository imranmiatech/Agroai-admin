import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import {
  LoginFormCard,
  ForgotPasswordCard,
  AuthSuccessCard,
} from '../../components/authComponents/login';

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
          isLoading={isLoading}
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
