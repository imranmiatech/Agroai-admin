import React from 'react';
import { Eye, EyeOff, CheckCircle2, AlertCircle, KeyRound, Check } from 'lucide-react';

interface VendorPasswordSettingsProps {
  currentPassword: string;
  setCurrentPassword: (val: string) => void;
  newPassword: string;
  setNewPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showCurrentPassword: boolean;
  setShowCurrentPassword: (val: boolean) => void;
  showNewPassword: boolean;
  setShowNewPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
  passwordSuccess: boolean;
  passwordError: string;
  onChangePassword: (e: React.FormEvent) => void;
  isChanging?: boolean;
}

export const VendorPasswordSettings: React.FC<VendorPasswordSettingsProps> = ({
  currentPassword,
  setCurrentPassword,
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  showCurrentPassword,
  setShowCurrentPassword,
  showNewPassword,
  setShowNewPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  passwordSuccess,
  passwordError,
  onChangePassword,
  isChanging = false,
}) => {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full transition-all">
      <div>
        {/* Card Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-indigo-50 text-indigo-700 flex items-center justify-center shrink-0 border border-indigo-100">
            <KeyRound className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Password & Security
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Ensure your merchant account is protected with strong credentials
            </p>
          </div>
        </div>

        {passwordSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Password updated successfully!</span>
          </div>
        )}

        {passwordError && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{passwordError}</span>
          </div>
        )}

        <form onSubmit={onChangePassword} id="vendor-password-form" className="flex flex-col gap-4">
          {/* Current Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Current Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showCurrentPassword ? 'text' : 'password'}
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showNewPassword ? 'text' : 'password'}
                placeholder="Enter new strong password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Confirm New Password */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Confirm New Password <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10 transition-all font-medium"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
              >
                {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Password Security Tips */}
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex flex-col gap-1 text-[11px] text-slate-500 mt-1">
            <div className="flex items-center gap-1.5">
              <Check className={`w-3.5 h-3.5 ${newPassword.length >= 6 ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>At least 6 characters long</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Check className={`w-3.5 h-3.5 ${newPassword && newPassword === confirmPassword ? 'text-emerald-600' : 'text-slate-300'}`} />
              <span>Passwords match</span>
            </div>
          </div>
        </form>
      </div>

      {/* Change Password Button */}
      <div className="flex justify-end pt-6 mt-4 border-t border-slate-100">
        <button
          type="submit"
          form="vendor-password-form"
          disabled={isChanging}
          className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isChanging ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Updating...</span>
            </>
          ) : (
            <span>Change Password</span>
          )}
        </button>
      </div>
    </div>
  );
};
