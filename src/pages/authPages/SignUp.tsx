import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  StepBusinessDetails,
  StepOtpVerification,
  StepBusinessLocation,
  StepContactInformation,
  SignUpSuccessView,
} from '../../components/authComponents/signup';
import {
  useSendOtpMutation,
  useVerifyOtpMutation,
  useRegisterVendorMutation,
} from '../../redux/feature/auth/authApi';

export const SignUp: React.FC = () => {
  const navigate = useNavigate();

  // RTK Query Mutations
  const [sendOtp, { isLoading: isSendingOtp }] = useSendOtpMutation();
  const [verifyOtp, { isLoading: isVerifyingOtp }] = useVerifyOtpMutation();
  const [registerVendor, { isLoading: isRegisteringVendor }] = useRegisterVendorMutation();

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
  const [shortDescription, setShortDescription] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Step 2: OTP Verification State
  const [otpValue, setOtpValue] = useState('');
  const [resendTimer, setResendTimer] = useState(45);
  const [canResend, setCanResend] = useState(false);

  // Step 3: Business Location State
  const [country, setCountry] = useState('Bangladesh');
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
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Step 1: Submit & Send OTP to business email
  const handleStep1Submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!businessName.trim()) {
      setErrorMsg('Please enter your business name.');
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

    try {
      const res = await sendOtp({ email: email.trim().toLowerCase() }).unwrap();
      if (res?.data?.debugOtp) {
        console.info(`[Dev OTP Code]: ${res.data.debugOtp}`);
      }
      setResendTimer(res?.data?.expiresInSeconds || 45);
      setCanResend(false);
      setOtpValue('');
      setCurrentStep(2);
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Failed to send OTP verification code. Please check your email.'));
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!otpValue || otpValue.trim().length < 6) {
      setErrorMsg('Please enter the complete 6-digit verification code.');
      return;
    }

    try {
      await verifyOtp({
        email: email.trim().toLowerCase(),
        otpCode: otpValue.trim(),
      }).unwrap();

      // Automatically prefill contact email if not set
      if (!contactEmail) {
        setContactEmail(email.trim());
      }
      if (!contactPhone && phoneNumber) {
        setContactPhone(phoneNumber.trim());
      }

      // Move to step 3 (Business Location)
      setCurrentStep(3);
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Invalid or expired OTP code. Please try again.'));
    }
  };

  // Step 2: Resend Code
  const handleResendCode = async () => {
    setErrorMsg('');
    try {
      const res = await sendOtp({ email: email.trim().toLowerCase() }).unwrap();
      if (res?.data?.debugOtp) {
        console.info(`[Dev OTP Code]: ${res.data.debugOtp}`);
      }
      setResendTimer(res?.data?.expiresInSeconds || 45);
      setCanResend(false);
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Failed to resend code. Please wait a moment and try again.'));
    }
  };

  // Step 3: Location Details
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

  // Step 4: Submit complete partner application with multipart/form-data
  const handleStep3ContactSubmit = async (e: React.FormEvent) => {
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

    try {
      const formData = new FormData();
      formData.append('businessName', businessName.trim());
      if (shortDescription.trim()) {
        formData.append('shortDescription', shortDescription.trim());
      }
      formData.append('email', email.trim().toLowerCase());
      if (phoneNumber.trim()) {
        formData.append('phoneNumber', phoneNumber.trim());
      }
      formData.append('password', password);
      formData.append('country', country.trim());
      formData.append('city', city.trim());
      if (address.trim()) {
        formData.append('address', address.trim());
      }
      if (openingHours.trim()) {
        formData.append('openingHours', openingHours.trim());
      }
      formData.append('contactPerson', contactPerson.trim());
      if (contactRole.trim()) {
        formData.append('contactRole', contactRole.trim());
      }
      formData.append('contactEmail', contactEmail.trim().toLowerCase());
      formData.append('contactPhone', contactPhone.trim());

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      await registerVendor(formData).unwrap();
      setCurrentStep(5);
    } catch (err: any) {
      setErrorMsg(extractErrorMessage(err, 'Failed to submit partner application. Please verify your details.'));
    }
  };

  const countries = [
    'Bangladesh',
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
            shortDescription={shortDescription}
            setShortDescription={setShortDescription}
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
            errorMsg={errorMsg}
            isSubmitting={isSendingOtp}
            onSubmit={handleStep1Submit}
            onNavigateLogin={() => navigate('/login')}
          />
        )}

        {/* Step 2: Verify Code (Email OTP) */}
        {currentStep === 2 && (
          <StepOtpVerification
            email={email}
            otpValue={otpValue}
            setOtpValue={setOtpValue}
            canResend={canResend}
            resendTimer={resendTimer}
            onResendCode={handleResendCode}
            errorMsg={errorMsg}
            isVerifying={isVerifyingOtp}
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
            city={city}
            country={country}
            isSubmitting={isRegisteringVendor}
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
