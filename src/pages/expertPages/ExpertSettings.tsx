import React, { useState, useEffect } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';
import { ExpertProfileSettings } from '../../components/expertComponents/settings/ExpertProfileSettings';
import { ExpertPasswordSettings } from '../../components/expertComponents/settings/ExpertPasswordSettings';
import {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useChangePasswordMutation,
} from '../../redux/feature/profile/profileApi';
import { useAppDispatch } from '../../redux/store/hooks';
import { setUser } from '../../redux/feature/auth/authSlice';

export const ExpertSettings: React.FC = () => {
  const dispatch = useAppDispatch();

  // RTK Query Hooks
  const { data: profileResponse, isLoading: isProfileLoading } = useGetProfileQuery();
  const [updateProfile, { isLoading: isSavingProfile }] = useUpdateProfileMutation();
  const [changePassword, { isLoading: isChangingPassword }] = useChangePasswordMutation();

  // Profile Form State
  const [fullName, setFullName] = useState('');
  const [designation, setDesignation] = useState('Senior Plant Pathologist & Soil Diagnostics Specialist');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('EXPERT');
  const [avatarInitials, setAvatarInitials] = useState('EX');
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

      const img = u.avatar || null;
      if (img) {
        setAvatarImage(img);
      }

      const parts = (u.name || '').trim().split(' ');
      if (parts.length >= 2) {
        setAvatarInitials((parts[0][0] + parts[parts.length - 1][0]).toUpperCase());
      } else if (parts[0]) {
        setAvatarInitials(parts[0].slice(0, 2).toUpperCase());
      }

      // Keep Redux auth user updated
      dispatch(
        setUser({
          id: u.id,
          name: u.name,
          email: u.email,
          role: u.role as any,
          status: u.status as any,
          isEmailVerified: u.isEmailVerified,
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
          dispatch(
            setUser({
              id: res.data.id,
              name: res.data.name,
              email: res.data.email,
              role: res.data.role as any,
              status: res.data.status as any,
              isEmailVerified: res.data.isEmailVerified,
              avatar: res.data.avatar || avatarImage,
            })
          );
        }
      } else {
        const res = await updateProfile({ name: fullName }).unwrap();
        if (res?.data) {
          dispatch(
            setUser({
              id: res.data.id,
              name: res.data.name,
              email: res.data.email,
              role: res.data.role as any,
              status: res.data.status as any,
              isEmailVerified: res.data.isEmailVerified,
              avatar: res.data.avatar || avatarImage,
            })
          );
        }
      }
      setProfileSuccess(true);
      setTimeout(() => setProfileSuccess(false), 3500);
    } catch (err: any) {
      console.error('Failed to update profile:', err);
      setProfileError(err?.data?.message || err?.message || 'Failed to update expert profile');
    }
  };

  // Handle Password Change
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError('');

    if (newPassword !== confirmPassword) {
      setPasswordError('New password and confirmation do not match');
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError('Password must be at least 8 characters long');
      return;
    }

    try {
      await changePassword({
        currentPassword,
        newPassword,
      }).unwrap();

      setPasswordSuccess(true);
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => setPasswordSuccess(false), 4000);
    } catch (err: any) {
      console.error('Failed to change password:', err);
      setPasswordError(err?.data?.message || err?.message || 'Incorrect current password or server error');
    }
  };

  return (
    <div className="flex flex-col gap-8 font-['Inter'] pb-16 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Settings & Preferences
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage your professional agricultural credentials, password security, and account details.
          </p>
        </div>

        <div>
          {isProfileLoading ? (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Loading profile details...</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-teal-50 text-[#0E4F5A] border border-teal-200/80 shadow-2xs">
              <ShieldCheck className="w-3.5 h-3.5 text-[#0E4F5A]" />
              <span>Verified Agricultural Specialist</span>
            </span>
          )}
        </div>
      </div>

      {/* 2. Top Row: Profile & Password Side-by-Side (Equal Height) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
        <ExpertProfileSettings
          fullName={fullName}
          setFullName={setFullName}
          designation={designation}
          setDesignation={setDesignation}
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

        <ExpertPasswordSettings
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
    </div>
  );
};

export default ExpertSettings;
