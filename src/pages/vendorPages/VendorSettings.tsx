import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import {
  VendorProfileSettings,
  VendorPasswordSettings,
  VendorBillingCardSettings,
} from '../../components/vendorComponents/settings';

export const VendorSettings: React.FC = () => {
  // Store Profile Form State
  const [storeName, setStoreName] = useState('Krisikunjo Agro Mart');
  const [ownerName, setOwnerName] = useState('Jonathan Vance');
  const [email] = useState('merchant@krisikunjo.com');
  const [role] = useState('Verified Merchant Vendor');
  const [avatarInitials, setAvatarInitials] = useState('KA');
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Handle Profile Save
  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(true);
    setTimeout(() => setProfileSuccess(false), 3500);
  };

  // Handle Password Change
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    setPasswordSuccess(true);
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(false), 3500);
  };

  return (
    <div className="w-full flex flex-col gap-8 font-['Inter'] pb-16 animate-in fade-in duration-200">
      {/* 1. Main Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight">
            Store & Account Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your merchant storefront details, password security, and payout billing cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-[#0E4F5A] border border-teal-200/80 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#0E4F5A]" />
            <span>Verified Merchant Partner</span>
          </span>
        </div>
      </div>

      {/* 2. Top Row: Profile & Password Side-by-Side (Equal Height) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <VendorProfileSettings
          storeName={storeName}
          setStoreName={setStoreName}
          ownerName={ownerName}
          setOwnerName={setOwnerName}
          email={email}
          role={role}
          avatarInitials={avatarInitials}
          setAvatarInitials={setAvatarInitials}
          avatarImage={avatarImage}
          setAvatarImage={setAvatarImage}
          profileSuccess={profileSuccess}
          onSaveProfile={handleSaveProfile}
        />

        <VendorPasswordSettings
          currentPassword={currentPassword}
          setCurrentPassword={setCurrentPassword}
          newPassword={newPassword}
          setNewPassword={setNewPassword}
          confirmPassword={confirmPassword}
          setConfirmPassword={setConfirmPassword}
          showCurrentPassword={showCurrentPassword}
          setShowCurrentPassword={setShowCurrentPassword}
          showNewPassword={showNewPassword}
          setShowNewPassword={setShowNewPassword}
          showConfirmPassword={showConfirmPassword}
          setShowConfirmPassword={setShowConfirmPassword}
          passwordSuccess={passwordSuccess}
          passwordError={passwordError}
          onChangePassword={handleChangePassword}
        />
      </div>

      {/* 3. Middle Row: Payout & Billing Corporate Cards */}
      <VendorBillingCardSettings />
    </div>
  );
};

export default VendorSettings;
