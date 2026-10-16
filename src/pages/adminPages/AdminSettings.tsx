import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import {
  AdminProfileSettings,
  AdminPasswordSettings,
  AdminBillingCardSettings,
} from '../../components/adminComponents/settings';

export const AdminSettings: React.FC = () => {
  // Profile Form State
  const [fullName, setFullName] = useState('Aoife Turner');
  const [email] = useState('admin@krisikunjo.com');
  const [role] = useState('Administrator');
  const [avatarInitials, setAvatarInitials] = useState('AH');
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
            Account & Security Settings
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your administrator profile, security credentials, and company billing payment cards.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Enterprise Admin Verified</span>
          </span>
        </div>
      </div>

      {/* 2. Top Row: Profile & Password Side-by-Side */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <AdminProfileSettings
          fullName={fullName}
          setFullName={setFullName}
          email={email}
          role={role}
          avatarInitials={avatarInitials}
          setAvatarInitials={setAvatarInitials}
          avatarImage={avatarImage}
          setAvatarImage={setAvatarImage}
          profileSuccess={profileSuccess}
          onSaveProfile={handleSaveProfile}
        />

        <AdminPasswordSettings
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

      {/* 3. Bottom Row: Billing & Corporate Payment Methods */}
      <AdminBillingCardSettings />
    </div>
  );
};

export default AdminSettings;
