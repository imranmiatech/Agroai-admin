import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight, Eye, EyeOff, ShieldCheck } from 'lucide-react';

export const ResetPassword: React.FC = () => {
  const navigate = useNavigate();

  // Form states matching Figma node 25762:61899
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Password visibility toggles
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Status & loading states
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otp.trim()) {
      setErrorMsg('Please enter the one time password sent to your email.');
      return;
    }

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

    setIsLoading(true);

    // Simulate password reset and navigate to ResetSuccesfull page (Figma node 25762:61826)
    setTimeout(() => {
      setIsLoading(false);
      navigate('/reset-success');
    }, 600);
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

      <div className="w-full max-w-[540px] flex flex-col items-center">
          {/* Heading Section matching Figma node 25762:61899 */}
          <div className="w-full max-w-[451px] flex flex-col items-center text-center space-y-4">
            {/* Title matching Figma */}
            <h1 className="text-[30px] font-bold leading-[38px] text-[#0B5460] tracking-normal">
              Reset password
            </h1>

            {/* Subtitle matching Figma */}
            <p className="text-[16px] font-medium leading-[24px] text-[#364152] max-w-[430px]">
              Enter the one time password that we’ve sent to your e-mail
            </p>
          </div>

          {/* Centered Card matching Figma node 25762:61899 */}
          <div className="w-full mt-7 bg-white border border-[#E7EEEE] rounded-[16px] p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
            <form onSubmit={handleSubmit} className="space-y-4">
              {errorMsg && (
                <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-600 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              {/* Field 1: One time password */}
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

              {/* Field 2: New Password */}
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
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                    tabIndex={-1}
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Field 3: Confirm password */}
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
                    className="text-slate-400 hover:text-slate-600 focus:outline-none p-1"
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Divider and Continue Button matching Figma */}
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

      {/* Footer disclaimer */}
      <div className="mt-12 text-center text-xs text-slate-400 flex items-center gap-1.5">
        <ShieldCheck className="w-4 h-4 text-[#0B5460]" />
        <span>Protected by Evaturner Secure Enterprise Authentication</span>
      </div>
    </div>
  );
};

export default ResetPassword;
