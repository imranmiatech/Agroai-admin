import { useState, useRef } from 'react';
import { 
  Camera, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle 
} from 'lucide-react';

export const AdminSettings = () => {
  // Profile Form State
  const [fullName, setFullName] = useState('Aoife Turner');
  const [email] = useState('admin@alurei.com');
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

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Handle Photo Change
  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarImage(url);
    }
  };

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
    <div className="flex flex-col gap-6 font-['Inter'] pb-16 max-w-7xl">
      {/* Hidden File Input for Avatar */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Two Column Layout matching Figma node 29037:55318 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ================= LEFT COLUMN: SETTINGS / PROFILE ================= */}
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              Settings
            </h1>
            <p className="text-sm text-slate-500 mt-1">
              Manage your account information and security.
            </p>
          </div>

          {/* Profile Card */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col gap-6">
            {profileSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Profile details saved successfully!</span>
              </div>
            )}

            {/* Avatar Section */}
            <div className="flex items-center gap-4">
              <div className="relative">
                {avatarImage ? (
                  <img 
                    src={avatarImage} 
                    alt="Aoife Turner" 
                    className="w-20 h-20 rounded-full object-cover border-2 border-slate-100 shadow-xs" 
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-[#E2ECEE] text-[#062E35] flex items-center justify-center font-bold text-2xl tracking-wide select-none">
                    {avatarInitials}
                  </div>
                )}

                {/* Camera icon button */}
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  className="absolute bottom-0 right-0 w-7 h-7 rounded-full bg-[#062E35] text-white flex items-center justify-center hover:bg-[#0A434D] transition-colors shadow-sm cursor-pointer border-2 border-white"
                  title="Upload profile photo"
                >
                  <Camera className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-bold text-slate-900 leading-tight">
                  {fullName}
                </span>
                <button
                  type="button"
                  onClick={handlePhotoClick}
                  className="text-sm font-semibold text-[#0E4F5A] hover:text-[#062E35] text-left mt-1 cursor-pointer transition-colors"
                >
                  Change photo
                </button>
              </div>
            </div>

            {/* Profile Form */}
            <form onSubmit={handleSaveProfile} className="flex flex-col gap-5">
              {/* Full Name */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => {
                    setFullName(e.target.value);
                    const parts = e.target.value.trim().split(' ');
                    if (parts.length >= 2) {
                      setAvatarInitials((parts[0][0] + parts[parts.length - 1][0]).toUpperCase());
                    } else if (parts[0]) {
                      setAvatarInitials(parts[0].slice(0, 2).toUpperCase());
                    }
                  }}
                  className="w-full px-4 py-2.5 rounded-xl border border-[#97CFD0] bg-white text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/15 transition-all font-medium"
                />
              </div>

              {/* Email Address */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 cursor-not-allowed font-medium select-none"
                />
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Email address cannot be changed.
                </span>
              </div>

              {/* Role */}
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-slate-700">
                  Role
                </label>
                <input
                  type="text"
                  value={role}
                  disabled
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-700 cursor-not-allowed font-medium select-none"
                />
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Role cannot be changed.
                </span>
              </div>

              {/* Save Button */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* ================= RIGHT COLUMN: PASSWORD & SECURITY ================= */}
        <div className="flex flex-col gap-4">
          {/* Header */}
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              Password & Security
            </h2>
            <p className="text-sm text-slate-500 mt-1">
              Keep your account secure with a strong password.
            </p>
          </div>

          {/* Password Card */}
          <div className="bg-white rounded-3xl p-7 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col gap-6">
            {passwordSuccess && (
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Password changed successfully!</span>
              </div>
            )}

            {passwordError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{passwordError}</span>
              </div>
            )}

            <form onSubmit={handleChangePassword} className="flex flex-col gap-5">
              {/* Current Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Current Password
                </label>
                <div className="relative">
                  <input
                    type={showCurrentPassword ? 'text' : 'password'}
                    placeholder="Enter current password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showCurrentPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">
                  New Password
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirm New Password */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-medium text-slate-700">
                  Confirm New Password
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Enter new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-4 pr-11 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/15 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                  >
                    {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Change Password Button */}
              <div className="flex justify-end pt-3">
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-2xl bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  Change Password
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
