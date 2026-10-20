import React from 'react';
import { Eye, EyeOff, ArrowRight, Upload, Check, X, Loader2 } from 'lucide-react';
import { SignUpProgressBar } from './SignUpProgressBar';

interface StepBusinessDetailsProps {
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  handleLogoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  removeLogo: (e: React.MouseEvent) => void;
  logoFile: File | null;
  logoPreview: string | null;
  businessName: string;
  setBusinessName: (val: string) => void;
  shortDescription: string;
  setShortDescription: (val: string) => void;
  email: string;
  setEmail: (val: string) => void;
  phoneNumber: string;
  setPhoneNumber: (val: string) => void;
  password: string;
  setPassword: (val: string) => void;
  confirmPassword: string;
  setConfirmPassword: (val: string) => void;
  showPassword: boolean;
  setShowPassword: (val: boolean) => void;
  showConfirmPassword: boolean;
  setShowConfirmPassword: (val: boolean) => void;
  errorMsg: string;
  isSubmitting?: boolean;
  onSubmit: (e: React.FormEvent) => void;
  onNavigateLogin: () => void;
}

export const StepBusinessDetails: React.FC<StepBusinessDetailsProps> = ({
  fileInputRef,
  handleLogoChange,
  removeLogo,
  logoFile,
  logoPreview,
  businessName,
  setBusinessName,
  shortDescription,
  setShortDescription,
  email,
  setEmail,
  phoneNumber,
  setPhoneNumber,
  password,
  setPassword,
  confirmPassword,
  setConfirmPassword,
  showPassword,
  setShowPassword,
  showConfirmPassword,
  setShowConfirmPassword,
  errorMsg,
  isSubmitting = false,
  onSubmit,
  onNavigateLogin,
}) => {
  return (
    <div className="w-full max-w-[540px] flex flex-col items-center">
      {/* Step Indicator Header */}
      <div className="text-center mb-6">
        <h1 className="text-[28px] sm:text-[30px] font-bold text-[#00373E]">
          Business Details
        </h1>
        <p className="text-[15px] sm:text-[16px] font-medium text-[#4B5563] mt-1">
          Provide your core business information
        </p>
      </div>

      {/* Progress Bar (Step 1 of 4) */}
      <SignUpProgressBar currentStep={1} />

      {/* Form Container */}
      <div className="w-full bg-white border border-[#E7EEEE] rounded-[16px] p-6 sm:p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-[12px] text-red-600 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Logo Upload Box */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            className="hidden"
            onChange={handleLogoChange}
          />
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full border border-dashed border-[#CCD6D6] hover:border-[#0B5460] bg-[#FAFCFC] hover:bg-[#F2F7F7] rounded-[14px] p-4 flex flex-col items-center justify-center cursor-pointer transition-colors group relative"
          >
            {logoPreview ? (
              <div className="flex items-center justify-between w-full px-2">
                <div className="flex items-center gap-3">
                  <img
                    src={logoPreview}
                    alt="Logo preview"
                    className="w-12 h-12 rounded-full object-cover border border-gray-200"
                  />
                  <div className="text-left">
                    <p className="text-[14px] font-medium text-[#1F2A37]">
                      {logoFile?.name || 'Uploaded logo'}
                    </p>
                    <p className="text-[12px] text-emerald-600 font-medium flex items-center gap-1 mt-0.5">
                      <Check className="w-3.5 h-3.5" /> Logo uploaded
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={removeLogo}
                  className="p-1.5 rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
                  title="Remove logo"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <>
                <div className="w-10 h-10 rounded-full bg-[#E7EEEE] flex items-center justify-center text-[#0B5460] mb-2 group-hover:scale-105 transition-transform">
                  <Upload className="w-5 h-5" />
                </div>
                <p className="text-[14px] font-medium text-[#1F2A37]">
                  Upload logo
                </p>
                <p className="text-[12px] text-[#64748B] mt-0.5">
                  PNG or JPG, recommended
                </p>
              </>
            )}
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
              Business Name <span className="text-[#EF4444]">*</span>
            </label>
            <div className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
              <input
                type="text"
                value={businessName}
                onChange={(e) => setBusinessName(e.target.value)}
                placeholder="e.g. Little Stars Nursery"
                className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
              />
            </div>
          </div>

          {/* Short Description */}
          <div>
            <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
              Short Description
            </label>
            <div className="w-full px-3.5 py-2.5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
              <textarea
                rows={3}
                value={shortDescription}
                onChange={(e) => setShortDescription(e.target.value)}
                placeholder="Briefly describe your business and what you offer..."
                className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none resize-none"
              />
            </div>
          </div>

          {/* Email & Phone Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                Email <span className="text-[#EF4444]">*</span>
              </label>
              <div className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@business.com"
                  className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                Phone Number
              </label>
              <div className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+44 7700 900000"
                  className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Password & Confirm Password Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                Password <span className="text-[#EF4444]">*</span>
              </label>
              <div className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center justify-between focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none pr-2"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                Confirm Password <span className="text-[#EF4444]">*</span>
              </label>
              <div className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center justify-between focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Enter Confirm password"
                  className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none pr-2"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-[#64748B] hover:text-[#0F172A] transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-[#EEF2F6] pt-4 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0B5460] hover:bg-[#08424C] disabled:opacity-50 text-white px-7 py-2.5 rounded-[16px] font-semibold text-[13.5px] transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.99] cursor-pointer"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Sending code...</span>
                </>
              ) : (
                <>
                  <span>Continue</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Below Card link */}
      <div className="w-full mt-4 text-center">
        <span className="text-[14px] text-[#64748B]">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onNavigateLogin}
            className="font-medium text-[#0B5460] hover:underline cursor-pointer"
          >
            Log in
          </button>
        </span>
      </div>
    </div>
  );
};
