import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StepBusinessDetails,
  StepOtpVerification,
  StepBusinessLocation,
  StepContactInformation,
  SignUpSuccessView,
} from '../../components/authComponents/signup';

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

    // Move to step 2 (OTP)
    setResendTimer(45);
    setCanResend(false);
    setOtpValue('');
    setCurrentStep(2);
  };

  const handleOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpValue || otpValue.length < 4) {
      setErrorMsg('Please enter a valid verification code.');
      return;
    }

    // Move to step 3 (Business Location)
    setCurrentStep(3);
  };

  const handleStep2LocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!country.trim()) {
      setErrorMsg('Please select a country.');
      return;
    }
    if (!city.trim()) {
      setErrorMsg('Please enter your city.');
      return;
    }

    // Move to step 4 (Contact Person)
    setCurrentStep(4);
  };

  const handleStep3ContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!contactPerson.trim()) {
      setErrorMsg('Please enter the contact person name.');
      return;
    }
    if (!contactEmail.trim()) {
      setErrorMsg('Please enter contact email.');
      return;
    }
    if (!contactPhone.trim()) {
      setErrorMsg('Please enter contact phone number.');
      return;
    }

    setIsSubmitting(true);
    // Simulate API registration call
    setTimeout(() => {
      setIsSubmitting(false);
      setCurrentStep(5);
    }, 700);
  };

  const categories = [
    'Grocery & Supermarket',
    'Electronics & Technology',
    'Fashion & Apparel',
    'Health & Beauty',
    'Restaurants & Dining',
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
      <div className="w-full flex flex-col items-center">
        {/* Step 1: Business Details */}
        {currentStep === 1 && (
          <StepBusinessDetails
            fileInputRef={fileInputRef}
            handleLogoChange={handleLogoChange}
            removeLogo={removeLogo}
            logoFile={logoFile}
            logoPreview={logoPreview}
            businessName={businessName}
            setBusinessName={setBusinessName}
            businessCategory={businessCategory}
            setBusinessCategory={setBusinessCategory}
            categories={categories}
            shortDescription={shortDescription}
            setShortDescription={setShortDescription}
            website={website}
            setWebsite={setWebsite}
            email={email}
            setEmail={setEmail}
            phoneNumber={phoneNumber}
            setPhoneNumber={setPhoneNumber}
            password={password}
            setPassword={setPassword}
            confirmPassword={confirmPassword}
            setConfirmPassword={setConfirmPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            showConfirmPassword={showConfirmPassword}
            setShowConfirmPassword={setShowConfirmPassword}
            otpOption={otpOption}
            setOtpOption={setOtpOption}
            errorMsg={errorMsg}
            onSubmit={handleStep1Submit}
            onNavigateLogin={() => navigate('/login')}
          />
        )}

        {/* Step 2: Verify Code (OTP) */}
        {currentStep === 2 && (
          <StepOtpVerification
            otpOption={otpOption}
            phoneNumber={phoneNumber}
            email={email}
            otpValue={otpValue}
            setOtpValue={setOtpValue}
            canResend={canResend}
            resendTimer={resendTimer}
            onResendCode={() => {
              setResendTimer(45);
              setCanResend(false);
              setErrorMsg('');
            }}
            errorMsg={errorMsg}
            onBack={() => {
              setErrorMsg('');
              setCurrentStep(1);
            }}
            onSubmit={handleOtpSubmit}
          />
        )}

        {/* Step 3: Business Location */}
        {currentStep === 3 && (
          <StepBusinessLocation
            country={country}
            setCountry={setCountry}
            countries={countries}
            city={city}
            setCity={setCity}
            address={address}
            setAddress={setAddress}
            openingHours={openingHours}
            setOpeningHours={setOpeningHours}
            errorMsg={errorMsg}
            onBack={() => {
              setErrorMsg('');
              setCurrentStep(1);
            }}
            onSubmit={handleStep2LocationSubmit}
          />
        )}

        {/* Step 4: Contact Information */}
        {currentStep === 4 && (
          <StepContactInformation
            contactPerson={contactPerson}
            setContactPerson={setContactPerson}
            contactRole={contactRole}
            setContactRole={setContactRole}
            contactEmail={contactEmail}
            setContactEmail={setContactEmail}
            contactPhone={contactPhone}
            setContactPhone={setContactPhone}
            businessName={businessName}
            businessCategory={businessCategory}
            city={city}
            country={country}
            isSubmitting={isSubmitting}
            errorMsg={errorMsg}
            onBack={() => {
              setErrorMsg('');
              setCurrentStep(3);
            }}
            onSubmit={handleStep3ContactSubmit}
          />
        )}

        {/* Step 5: Submitted Success */}
        {currentStep === 5 && (
          <SignUpSuccessView onBackToWebsite={() => navigate('/login')} />
        )}
      </div>
    </div>
  );
};

export default SignUp;
