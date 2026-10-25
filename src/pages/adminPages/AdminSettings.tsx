import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Loader2, FolderPlus } from 'lucide-react';
import {
  AdminProfileSettings,
  AdminPasswordSettings,
  AdminBillingCardSettings,
} from '../../components/adminComponents/settings';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from '../../redux/feature/profile/profileApi';
import { useAppDispatch } from '../../redux/store/hooks';
import { setUser } from '../../redux/feature/auth/authSlice';
import { AdminCommissionSettings } from '../../components/adminComponents/settings/AdminCommissionSettings';

export const AdminSettings: React.FC = () => {
  const dispatch = useAppDispatch();

  // RTK Query Hooks
  const { data: profileResponse, isLoading: isProfileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSavingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  // Profile Form State
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('ADMIN');
  const [avatarInitials, setAvatarInitials] = useState('AD');
  const [avatarImage, setAvatarImage] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [profileSuccess, setProfileSuccess] = useState(false);
  const [profileError, setProfileError] = useState('');

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Synchronize live profile data into form state
  useEffect(() => {
    if (profileResponse?.data) {
      const u = profileResponse.data;
      if (u.name) setFullName(u.name);
      if (u.email) setEmail(u.email);
      if (u.role) setRole(u.role);
      
      const img = u.avatar || u.vendorProfile?.logo || null;
      if (img) {
        setAvatarImage(img);
      }

      const parts = (u.name || '').trim().split(' ');
      if (parts.length >= 2) {
        setAvatarInitials((parts[0][0] + parts[parts.length - 1][0]).toUpperCase());
      } else if (parts[0]) {
        setAvatarInitials(parts[0].slice(0, 2).toUpperCase());
      }

      // Keep Redux auth user & localStorage updated with avatar
      dispatch(
        setUser({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as 'ADMIN' | 'VENDOR' | 'CUSTOMER',
          status: u.status as 'ACTIVE' | 'INACTIVE' | 'SUSPENDED',
          isEmailVerified: u.isEmailVerified,
          avatar: img,
          vendorProfile: u.vendorProfile
            ? {
                id: u.vendorProfile.id,
                businessName: u.vendorProfile.businessName,
                slug: u.vendorProfile.slug,
                logo: u.vendorProfile.logo,
                status: (u.vendorProfile.status as any) || 'APPROVED',
                category: u.vendorProfile.category || undefined,
              }
            : undefined,
        })
      );
    }
  }, [profileResponse, dispatch]);

  // Handle Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileError('');
    try {
      if (selectedFile) {
        const formData = new FormData();
        formData.append('name', fullName);
        formData.append('logo', selectedFile);
        const res = await updateProfile(formData).unwrap();
        setSelectedFile(null);
        if (res?.data) {
          const img = res.data.avatar || res.data.vendorProfile?.logo || null;
          if (img) setAvatarImage(img);
        }
      } else {
        await updateProfile({ name: fullName }).unwrap();
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3500);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string | string[] }; error?: string };
      const msg = errorObj?.data?.message || errorObj?.error || 'Failed to update profile. Please try again.';
      setProfileError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');
    setPasswordSuccess(false);

    if (!currentPassword) {
      setPasswordError('Please enter your current password.');
      return;
    }
    if (newPassword.length < 6) {
      setPasswordError('New password must be at least 6 characters.');
      return;
    }
    if (newPassword === currentPassword) {
      setPasswordError('New password cannot be identical to old password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirm password do not match.');
      return;
    }

    try {
      await changePassword({ currentPassword, newPassword }).unwrap();
      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 3500);
    } catch (err: unknown) {
      const errorObj = err as { data?: { message?: string | string[] }; error?: string };
      const msg = errorObj?.data?.message || errorObj?.error || 'Failed to update password. Please check your credentials.';
      setPasswordError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
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

        <div className="flex items-center gap-3">
          <Link
            to="/admin/categories?openModal=true"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#062E35] text-white hover:bg-[#0E4F5A] active:scale-95 transition-all shadow-sm cursor-pointer group no-underline"
            title="Manage and add product categories"
          >
            <FolderPlus className="w-4 h-4 text-emerald-400 group-hover:scale-110 transition-transform" />
            <span>Add Category</span>
          </Link>

          {isProfileLoading ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Loading details...</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>Enterprise Admin Verified</span>
            </span>
          )}
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
          profileError={profileError}
          isSaving={isSavingProfile}
          onSaveProfile={handleSaveProfile}
          onFileSelected={(file) => setSelectedFile(file)}
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
          isChanging={isChangingPassword}
          onChangePassword={handleChangePassword}
        />
      </div>

      {/* 3. Platform Commission & 10-Minute Vendor Payout Configuration */}
      <AdminCommissionSettings />

      {/* 4. Bottom Row: Billing & Corporate Payment Methods */}
      <AdminBillingCardSettings />
    </div>
  );
};

export default AdminSettings;
