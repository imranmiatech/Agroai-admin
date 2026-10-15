import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  Upload, 
  Check, 
  ChevronDown, 
  X
} from 'lucide-react';
import partnerSubmittedBadge from '../../assets/partner-submitted-badge.svg';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // Wizard Steps:
  // 1: Business Details
  // 2: OTP Verification
  // 3: Business Location
  // 4: Contact Information & Summary
  // 5: Submitted Success View
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Step 1: Business Details State
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [businessName, setBusinessName] = useState('');
  const [businessCategory, setBusinessCategory] = useState('');
  const [shortDescription, setShortDescription] = useState('');
  const [website, setWebsite] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [otpOption, setOtpOption] = useState<'email' | 'phone'>('email');

  // Step 2: OTP Verification State
  const [otpValue, setOtpValue] = useState('');
  const [resendTimer, setResendTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);

  // Step 3: Business Location State
  const [country, setCountry] = useState('United Arab Emirates');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [openingHours, setOpeningHours] = useState('Mon–Fri 9:00–18:00');

  // Step 4: Contact Information State
  const [contactPerson, setContactPerson] = useState('');
  const [contactRole, setContactRole] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');

  // UI state
  const [errorMsg, setErrorMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Timer for OTP resend countdown
  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | undefined;
    if (currentStep === 2 && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [currentStep, resendTimer]);

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const removeLogo = (e: React.MouseEvent) => {
    e.stopPropagation();
    setLogoFile(null);
    setLogoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Validation & Navigation
  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!businessName.trim()) {
      setErrorMsg('Please enter your business name.');
      return;
    }
    if (!businessCategory.trim()) {
      setErrorMsg('Please select a business category.');
      return;
    }
    if (!email.trim()) {
      setErrorMsg('Please enter your business email.');
      return;
    }
    if (!password) {
      setErrorMsg('Please enter a password.');
      return;
    }
    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    // Prefill contact email & phone if empty
    if (!contactEmail) setContactEmail(email);
    if (!contactPhone && phoneNumber) setContactPhone(phoneNumber);

    // Proceed to OTP verification step
    setResendTimer(45);
    setCanResend(false);
    setCurrentStep(2);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpValue.trim()) {
      setErrorMsg('Please enter the verification code.');
      return;
    }

    // Proceed to Step 3 (Business Location)
    setCurrentStep(3);
  };

  const handleStep2LocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!country.trim()) {
      setErrorMsg('Please select your country.');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Please enter your city.');
      return;
    }

    // Proceed to Step 4 (Contact Information)
    setCurrentStep(4);
  };

  const handleStep3ContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!contactPerson.trim()) {
      setErrorMsg('Please enter a contact person name.');
      return;
    }
    if (!contactEmail.trim()) {
      setErrorMsg('Please enter a contact email.');
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMsg('Please enter a contact phone number.');
      return;
    }

    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      // Proceed to final confirmation screen
      setCurrentStep(5);
    }, 800);
  };

  const categories = [
    'Grocery & Supermarket',
    'Nursery & Childcare',
    "Children's Apparel",
    'Food & Catering',
    'Education & Tutoring',
    'Toys & Gifts',
    'Event Entertainment',
    'Healthcare & Pharmacy',
    'Beauty & Salon',
    'Home & Lifestyle',
    'Sports & Fitness',
    'Other'
  ];

  const countries = [
    'United Arab Emirates',
    'Saudi Arabia',
    'Qatar',
    'Kuwait',
    'Bahrain',
    'Oman',
    'United Kingdom',
    'United States',
    'Canada',
    'Germany',
    'France',
    'Other'
  ];

  return (
    <div className="min-h-screen w-full bg-[#F4F4F4] text-[#0F172A] flex flex-col items-center justify-center p-4 sm:p-6 lg:p-8 font-['Inter',sans-serif]">
      {/* Main Container */}
      <div className="w-full flex flex-col items-center">
        {/* ========================================================================= */}
        {/* STEP 1: BUSINESS DETAILS (Figma Node 25762:61715)                         */}
        {/* ========================================================================= */}
        {currentStep === 1 && (
          <div className="w-full max-w-[620px] flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#1F2A37]">
                Welcome to Alurei Partners
              </h1>
              <p className="text-[14px] sm:text-[15px] text-[#4B5563] mt-1">
                Let's set up your business before you get started.
              </p>
            </div>

            {/* Stepper (1 - 2 - 3) */}
            <div className="flex items-center justify-center gap-2 mb-7">
              <div className="w-8 h-8 rounded-full bg-[#0B5460] text-white font-medium text-[14px] flex items-center justify-center shadow-xs">
                1
              </div>
              <div className="w-12 sm:w-16 h-[1.5px] bg-[#E2E8F0]" />
              <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-[#64748B] font-medium text-[14px] flex items-center justify-center">
                2
              </div>
              <div className="w-12 sm:w-16 h-[1.5px] bg-[#E2E8F0]" />
              <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-[#64748B] font-medium text-[14px] flex items-center justify-center">
                3
              </div>
            </div>

            {/* Card Form */}
            <div className="w-full bg-white border border-[#E7EEEE] rounded-[16px] p-6 sm:p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
              <h2 className="text-[16px] font-medium text-[#1F2A37] mb-6">
                Step 1 — Business Details
              </h2>

              {errorMsg && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-[12px] text-red-600 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleStep1Submit} className="space-y-5">
                {/* Logo Upload Box */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full border-2 border-dashed border-[#CBD5E1] hover:border-[#0B5460] rounded-[16px] p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-[#F8FAFC]/50 hover:bg-[#F8FAFC] group relative"
                >
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleLogoChange}
                    accept="image/png, image/jpeg, image/jpg"
                    className="hidden"
                  />
                  {logoPreview ? (
                    <div className="flex items-center gap-4 w-full justify-between">
                      <div className="flex items-center gap-3">
                        <img
                          src={logoPreview}
                          alt="Logo Preview"
                          className="w-14 h-14 object-cover rounded-[12px] border border-gray-200 shadow-xs"
                        />
                        <div>
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

                {/* Business Category */}
                <div>
                  <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                    Business Category <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="relative w-full h-[42px] bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center px-3.5 focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
                    <select
                      value={businessCategory}
                      onChange={(e) => setBusinessCategory(e.target.value)}
                      className={`w-full bg-transparent text-[14px] outline-none appearance-none cursor-pointer pr-6 ${
                        businessCategory ? 'text-[#0F172A]' : 'text-[#94A3B8]'
                      }`}
                    >
                      <option value="" disabled>Select a category</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat} className="text-[#0F172A]">
                          {cat}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="w-4 h-4 text-[#64748B] pointer-events-none absolute right-3.5" />
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

                {/* Website */}
                <div>
                  <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                    Website
                  </label>
                  <div className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
                    <input
                      type="url"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="https://yourwebsite.com"
                      className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
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

                {/* OTP Options Radio */}
                <div className="pt-2">
                  <label className="block text-[15px] font-medium text-[#1F2A37] mb-2.5">
                    Select OTP options <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="otpOption"
                        checked={otpOption === 'email'}
                        onChange={() => setOtpOption('email')}
                        className="w-4 h-4 text-[#0B5460] focus:ring-[#0B5460] accent-[#0B5460] cursor-pointer"
                      />
                      <span className="text-[14px] font-medium text-[#20293A]">E-mail</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="radio"
                        name="otpOption"
                        checked={otpOption === 'phone'}
                        onChange={() => setOtpOption('phone')}
                        className="w-4 h-4 text-[#0B5460] focus:ring-[#0B5460] accent-[#0B5460] cursor-pointer"
                      />
                      <span className="text-[14px] font-medium text-[#20293A]">Phone</span>
                    </label>
                  </div>
                </div>

                {/* Divider */}
                <div className="border-t border-[#EEF2F6] pt-4 flex justify-end">
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

            {/* Below Card link */}
            <div className="w-full mt-4 text-center">
              <span className="text-[14px] text-[#64748B]">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => navigate('/login')}
                  className="font-medium text-[#0B5460] hover:underline cursor-pointer"
                >
                  Log in
                </button>
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 2: VERIFY CODE (OTP) (Figma Node 27394:10765)                        */}
        {/* ========================================================================= */}
        {currentStep === 2 && (
          <div className="w-full max-w-[540px] flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-[28px] sm:text-[30px] font-bold text-[#00373E]">
                Enter the code
              </h1>
              <p className="text-[15px] sm:text-[16px] font-medium text-[#4B5563] mt-1">
                Enter the code we’ve sent to your {otpOption === 'phone' ? 'phone' : 'e-mail'}
              </p>
            </div>

            {/* OTP Card */}
            <div className="w-full bg-white border border-[#E7EEEE] rounded-[16px] p-6 sm:p-8 shadow-[0px_4px_24px_rgba(0,0,0,0.06)]">
              {errorMsg && (
                <div className="mb-5 p-3.5 bg-red-50 border border-red-200 rounded-[12px] text-red-600 text-xs font-medium">
                  {errorMsg}
                </div>
              )}

              <form onSubmit={handleOtpSubmit} className="space-y-6">
                <div>
                  <label className="block text-[14px] font-medium text-[#20293A] mb-2">
                    One time password <span className="text-[#EF4444]">*</span>
                  </label>
                  <div className="w-full h-[46px] px-4 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
                    <input
                      type="text"
                      maxLength={6}
                      autoFocus
                      value={otpValue}
                      onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, ''))}
                      placeholder="Enter your otp"
                      className="w-full bg-transparent text-[15px] font-medium tracking-widest text-[#0F172A] placeholder:tracking-normal placeholder:text-[#94A3B8] outline-none"
                    />
                  </div>

                  {/* Resend Timer / Action */}
                  <div className="mt-3 flex items-center justify-between text-xs text-[#64748B]">
                    <span>Target: {otpOption === 'phone' ? (phoneNumber || 'phone') : (email || 'e-mail')}</span>
                    {canResend ? (
                      <button
                        type="button"
                        onClick={() => {
                          setResendTimer(45);
                          setCanResend(false);
                          setErrorMsg('');
                        }}
                        className="text-[#0B5460] font-semibold hover:underline"
                      >
                        Resend code
                      </button>
                    ) : (
                      <span>Resend code in {resendTimer}s</span>
                    )}
                  </div>
                </div>

                {/* Divider and Actions */}
                <div className="border-t border-[#EEF2F6] pt-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setCurrentStep(1);
                    }}
                    className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1F2A37] px-5 py-2.5 rounded-[16px] font-semibold text-[14px] transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="bg-[#0B5460] hover:bg-[#08424C] text-white px-7 py-2.5 rounded-[16px] font-semibold text-[13.5px] transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.99]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 3: BUSINESS LOCATION (Figma Node 25762:61939)                        */}
        {/* ========================================================================= */}
        {currentStep === 3 && (
          <div className="w-full max-w-[620px] flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#1F2A37]">
                Welcome to Alurei Partners
              </h1>
              <p className="text-[14px] sm:text-[16px] text-[#4B5563] mt-1">
                Let's set up your business before you get started.
              </p>
            </div>

            {/* Stepper: Step 1 completed, Step 2 active, Step 3 pending */}
            <div className="flex items-center justify-center gap-2 mb-7">
              <div className="w-8 h-8 rounded-full bg-[#0B5460] text-white font-bold text-[13px] flex items-center justify-center shadow-xs">
                ✓
              </div>
              <div className="w-12 sm:w-16 h-[1.5px] bg-[#0B5460]" />
              <div className="w-8 h-8 rounded-full bg-[#0B5460] text-white font-medium text-[14px] flex items-center justify-center shadow-xs">
                2
              </div>
              <div className="w-12 sm:w-16 h-[1.5px] bg-[#E2E8F0]" />
              <div className="w-8 h-8 rounded-full bg-[#E2E8F0] text-[#64748B] font-medium text-[14px] flex items-center justify-center">
                3
              </div>
            </div>

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

              <form onSubmit={handleStep2LocationSubmit} className="space-y-5">
                {/* Country and City Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                      Country <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="relative w-full h-[42px] bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center px-3.5 focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
                      <select
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full bg-transparent text-[14px] text-[#0F172A] outline-none appearance-none cursor-pointer pr-6"
                      >
                        <option value="" disabled>Select country</option>
                        {countries.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown className="w-4 h-4 text-[#64748B] pointer-events-none absolute right-3.5" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                      City <span className="text-[#EF4444]">*</span>
                    </label>
                    <div className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e:g: Dubai"
                        className="w-full bg-transparent text-[14px] text-[#0F172A] placeholder:text-[#94A3B8] outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-[14px] font-medium text-[#20293A] mb-1.5">
                    Address
                  </label>
                  <div className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
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
                  <div className="w-full h-[42px] px-3.5 bg-[#F8FAFC] border border-[#EEF2F6] rounded-[14px] flex items-center focus-within:border-[#0B5460] focus-within:ring-2 focus-within:ring-[#0B5460]/10 transition-all">
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
                    onClick={() => {
                      setErrorMsg('');
                      setCurrentStep(1);
                    }}
                    className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1F2A37] px-5 py-2.5 rounded-[16px] font-semibold text-[14px] transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    className="bg-[#0B5460] hover:bg-[#08424C] text-white px-7 py-2.5 rounded-[16px] font-semibold text-[13.5px] transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.99]"
                  >
                    <span>Continue</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 4: CONTACT INFORMATION & SUMMARY (Figma Node 25762:61996)            */}
        {/* ========================================================================= */}
        {currentStep === 4 && (
          <div className="w-full max-w-[620px] flex flex-col items-center">
            {/* Header */}
            <div className="text-center mb-6">
              <h1 className="text-[24px] sm:text-[28px] font-semibold text-[#1F2A37]">
                Welcome to Alurei Partners
              </h1>
              <p className="text-[14px] sm:text-[16px] text-[#4B5563] mt-1">
                Let's set up your business before you get started.
              </p>
            </div>

            {/* Stepper: Step 1 completed, Step 2 completed, Step 3 active */}
            <div className="flex items-center justify-center gap-2 mb-7">
              <div className="w-8 h-8 rounded-full bg-[#0B5460] text-white font-bold text-[13px] flex items-center justify-center shadow-xs">
                ✓
              </div>
              <div className="w-12 sm:w-16 h-[1.5px] bg-[#0B5460]" />
              <div className="w-8 h-8 rounded-full bg-[#0B5460] text-white font-bold text-[13px] flex items-center justify-center shadow-xs">
                ✓
              </div>
              <div className="w-12 sm:w-16 h-[1.5px] bg-[#0B5460]" />
              <div className="w-8 h-8 rounded-full bg-[#0B5460] text-white font-medium text-[14px] flex items-center justify-center shadow-xs">
                3
              </div>
            </div>

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

              <form onSubmit={handleStep3ContactSubmit} className="space-y-5">
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
                    <div className="flex items-center justify-between text-[#4B5563]">
                      <span>Category</span>
                      <span className="font-medium text-[#1F2A37]">
                        {businessCategory || 'Grocery & Supermarket'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#4B5563]">
                      <span>Location</span>
                      <span className="font-medium text-[#1F2A37]">
                        {city ? `${city}, ${country}` : 'Dubai, United Arab Emirates'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider and Actions */}
                <div className="border-t border-[#EEF2F6] pt-5 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => {
                      setErrorMsg('');
                      setCurrentStep(3);
                    }}
                    className="bg-[#F1F5F9] hover:bg-[#E2E8F0] text-[#1F2A37] px-5 py-2.5 rounded-[16px] font-semibold text-[14px] transition-all flex items-center gap-1.5"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Back</span>
                  </button>

                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-[#0B5460] hover:bg-[#08424C] disabled:opacity-70 text-white px-7 py-2.5 rounded-[16px] font-semibold text-[13.5px] transition-all flex items-center gap-1.5 shadow-sm active:scale-[0.99]"
                  >
                    <span>{isSubmitting ? 'Sending...' : 'Send request'}</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* STEP 5: SUBMITTED SUCCESS (Figma Node 25762:61854)                        */}
        {/* ========================================================================= */}
        {currentStep === 5 && (
          <div className="w-full max-w-[688px] flex flex-col items-center text-center py-10 px-4 animate-in fade-in zoom-in-95 duration-300">
            {/* SVG Badge with sparkles from Figma Node 25762:61856 */}
            <div className="mb-6 flex items-center justify-center">
              <img
                src={partnerSubmittedBadge}
                alt="Request submitted"
                className="w-[150px] h-[131px] object-contain drop-shadow-sm select-none"
              />
            </div>

            {/* Title */}
            <h1 className="text-[26px] sm:text-[30px] font-semibold text-[#1F2A37] tracking-tight">
              Your partner request has been submitted!
            </h1>

            {/* Description */}
            <p className="text-[15px] sm:text-[16px] text-[#4B5563] mt-3.5 max-w-[560px] leading-relaxed">
              Our team will review your request and get in touch with you shortly. Please allow 3–5 business days for the review process.
            </p>

            {/* Back to Website Button */}
            <div className="mt-8">
              <button
                type="button"
                onClick={() => navigate('/login')}
                className="bg-[#0B5460] hover:bg-[#08424C] text-white px-7 py-2.5 rounded-[16px] font-semibold text-[13.5px] transition-all shadow-sm active:scale-[0.99]"
              >
                Back to website
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
