import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { SignUpProgressBar } from './SignUpProgressBar';

interface StepContactInformationProps {
  contactPerson: string;
  setContactPerson: (val: string) => void;
  contactRole: string;
  setContactRole: (val: string) => void;
  contactEmail: string;
  setContactEmail: (val: string) => void;
  contactPhone: string;
  setContactPhone: (val: string) => void;
  businessName: string;
  businessCategory?: string;
  city: string;
  country: string;
  isSubmitting: boolean;
  errorMsg: string;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const StepContactInformation: React.FC<StepContactInformationProps> = ({
  contactPerson,
  setContactPerson,
  contactRole,
  setContactRole,
  contactEmail,
  setContactEmail,
  contactPhone,
  setContactPhone,
  businessName,
  businessCategory,
  city,
  country,
  isSubmitting,
  errorMsg,
  onBack,
  onSubmit,
}) => {
  return (
    <div className="w-full max-w-[620px] flex flex-col items-center">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#1F2A37]">
          Welcome to Krisikunjo Partners
        </h1>
        <p className="text-[14px] sm:text-[16px] text-[#4B5563] mt-1">
          Let's set up your business before you get started.
        </p>
      </div>

      {/* Stepper */}
      <SignUpProgressBar currentStep={4} />

      {/* Card Form */}
      <div className="w-full bg-white border border-[#E7EEEE] rounded-[16px] p-6 sm:p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
        <h2 className="text-[17px] font-bold text-[#1F2A37] mb-6">
          Step 3 — Contact Information
        </h2>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-[12px] text-red-600 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Contact Person & Role Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                Contact Person <span className="text-[#EF4444]">*</span>
              </label>
              <div className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
                <input
                  type="text"
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  placeholder="Jane Smith"
                  className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                Role
              </label>
              <div className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
                <input
                  type="text"
                  value={contactRole}
                  onChange={(e) => setContactRole(e.target.value)}
                  placeholder="e.g. Manager"
                  className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
                />
              </div>
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
                  value={contactEmail}
                  onChange={(e) => setContactEmail(e.target.value)}
                  placeholder="jane@business.com"
                  className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                Phone <span className="text-[#EF4444]">*</span>
              </label>
              <div className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
                <input
                  type="tel"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="+44 7700 900001"
                  className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
                />
              </div>
            </div>
          </div>

          {/* Setup Summary Card matching Figma node */}
          <div className="bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] p-4.5 space-y-2.5 mt-2">
            <h3 className="text-[12px] font-semibold text-[#64748B] uppercase tracking-wider">
              Setup Summary
            </h3>
            <div className="space-y-2 text-[14px]">
              <div className="flex items-center justify-between text-[#4B5563]">
                <span>Business</span>
                <span className="font-medium text-[#1F2A37]">
                  {businessName || 'Carrefour'}
                </span>
              </div>
              {businessCategory && (
                <div className="flex items-center justify-between text-[#4B5563]">
                  <span>Category</span>
                  <span className="font-medium text-[#1F2A37]">
                    {businessCategory}
                  </span>
                </div>
              )}
              <div className="flex items-center justify-between text-[#4B5563]">
                <span>Location</span>
                <span className="font-medium text-[#1F2A37]">
                  {city ? `${city}, ${country}` : 'Dhaka, Bangladesh'}
                </span>
              </div>
            </div>
          </div>

          {/* Divider and Actions */}
          <div className="border-t border-[#EEF2F6] pt-5 flex items-center justify-between">
            <button
              type="button"
              onClick={onBack}
              className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1F2A37] px-5 py-2.5 rounded-[16px] font-semibold text-[14px] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            <button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#0B5460] hover:bg-[#08424C] disabled:opacity-70 text-white px-7 py-2.5 rounded-[16px] font-semibold text-[13.5px] transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.99] cursor-pointer"
            >
              <span>{isSubmitting ? 'Sending...' : 'Send request'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
