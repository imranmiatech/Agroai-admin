import React, { useState, useRef, useEffect } from 'react';
import { ArrowRight, ArrowLeft, ChevronDown, Check } from 'lucide-react';
import { SignUpProgressBar } from './SignUpProgressBar';

export const BANGLADESH_DIVISIONS = [
  'Dhaka',
  'Chattogram',
  'Rajshahi',
  'Khulna',
  'Barishal',
  'Sylhet',
  'Rangpur',
  'Mymensingh',
];

interface StepBusinessLocationProps {
  country: string;
  setCountry: (val: string) => void;
  countries: string[];
  city: string;
  setCity: (val: string) => void;
  cities?: string[];
  address: string;
  setAddress: (val: string) => void;
  openingHours: string;
  setOpeningHours: (val: string) => void;
  errorMsg: string;
  onBack: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export const StepBusinessLocation: React.FC<StepBusinessLocationProps> = ({
  country,
  setCountry,
  countries,
  city,
  setCity,
  cities: _cities,
  address,
  setAddress,
  openingHours,
  setOpeningHours,
  errorMsg,
  onBack,
  onSubmit,
}) => {
  const [isCityOpen, setIsCityOpen] = useState(false);
  const cityDropdownRef = useRef<HTMLDivElement>(null);

  // Close custom dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (cityDropdownRef.current && !cityDropdownRef.current.contains(event.target as Node)) {
        setIsCityOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

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
      <SignUpProgressBar currentStep={3} />

      {/* Card Form */}
      <div className="w-full bg-white border border-[#E7EEEE] rounded-[16px] p-6 sm:p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
        <h2 className="text-[18px] font-medium text-[#1F2A37] mb-6">
          Step 2 — Business Location
        </h2>

        {errorMsg && (
          <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-[12px] text-red-600 text-xs font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5">
          {/* Country and City Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                Country <span className="text-[#EF4444]">*</span>
              </label>
              <div className="group relative w-full h-[44px] bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] hover:border-[#94A3B8]/60 rounded-[14px] flex items-center px-3.5 focus-within:border-[#0B5460] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0B5460]/10 shadow-xs hover:shadow-sm transition-all duration-200">
                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={`w-full bg-transparent text-[14px] outline-none appearance-none cursor-pointer pr-7 font-medium transition-colors ${
                    country ? 'text-[#0F172A]' : 'text-[#94A3B8]'
                  }`}
                >
                  <option value="" disabled className="text-[#94A3B8] bg-white">Select country</option>
                  {countries.map((c) => (
                    <option key={c} value={c} className="text-[#0F172A] bg-white py-1">
                      {c}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-[#94A3B8] group-hover:text-[#0B5460] group-focus-within:text-[#0B5460] pointer-events-none absolute right-3.5 transition-colors duration-200" />
              </div>
            </div>

            {/* City Custom Dropdown */}
            <div className="relative" ref={cityDropdownRef}>
              <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                City <span className="text-[#EF4444]">*</span>
              </label>

              {/* Trigger Button */}
              <button
                type="button"
                onClick={() => setIsCityOpen(!isCityOpen)}
                className={`group relative w-full h-[44px] bg-[#F8FAFC] hover:bg-white border rounded-[14px] flex items-center justify-between px-3.5 shadow-xs hover:shadow-sm transition-all duration-200 text-left outline-none ${
                  isCityOpen
                    ? 'border-[#0B5460] bg-white ring-4 ring-[#0B5460]/10'
                    : 'border-[#E2E8F0] hover:border-[#94A3B8]/60'
                }`}
              >
                <span
                  className={`text-[14px] font-medium truncate ${
                    city ? 'text-[#0F172A]' : 'text-[#94A3B8]'
                  }`}
                >
                  {city || 'Select City'}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-[#94A3B8] transition-transform duration-200 ${
                    isCityOpen ? 'rotate-180 text-[#0B5460]' : 'group-hover:text-[#0B5460]'
                  }`}
                />
              </button>

              {/* Hidden input for HTML5 required form validation */}
              <input
                type="text"
                value={city}
                onChange={() => {}}
                required
                tabIndex={-1}
                className="sr-only"
              />

              {/* Dropdown Options */}
              {isCityOpen && (
                <div className="absolute top-[calc(100%+6px)] left-0 right-0 z-50 bg-white border border-[#E2E8F0] rounded-[16px] shadow-xl p-1.5 max-h-[240px] overflow-y-auto animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-[#94A3B8]">
                    Select Bangladesh Division
                  </div>
                  {BANGLADESH_DIVISIONS.map((division) => {
                    const isSelected = city === division;
                    return (
                      <button
                        key={division}
                        type="button"
                        onClick={() => {
                          setCity(division);
                          setIsCityOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-[13.5px] font-medium transition-colors ${
                          isSelected
                            ? 'bg-[#0B5460]/10 text-[#0B5460] font-semibold'
                            : 'text-[#334155] hover:bg-[#F8FAFC] hover:text-[#0F172A]'
                        }`}
                      >
                        <span>{division}</span>
                        {isSelected && <Check className="w-4 h-4 text-[#0B5460]" />}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Address */}
          <div>
            <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
              Address
            </label>
            <div className="w-full h-[44px] px-3.5 bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] hover:border-[#94A3B8]/60 rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0B5460]/10 shadow-xs hover:shadow-sm transition-all duration-200">
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="123 High Street, London, SW1A 1AA"
                className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
              />
            </div>
          </div>

          {/* Opening Hours */}
          <div>
            <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
              Opening Hours
            </label>
            <div className="w-full h-[44px] px-3.5 bg-[#F8FAFC] hover:bg-white border border-[#E2E8F0] hover:border-[#94A3B8]/60 rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#0B5460]/10 shadow-xs hover:shadow-sm transition-all duration-200">
              <input
                type="text"
                value={openingHours}
                onChange={(e) => setOpeningHours(e.target.value)}
                placeholder="Mon–Fri 9:00–18:00"
                className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
              />
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
              className="bg-[#0B5460] hover:bg-[#08424C] text-white px-7 py-2.5 rounded-[16px] font-semibold text-[13.5px] transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.99] cursor-pointer"
            >
              <span>Continue</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
