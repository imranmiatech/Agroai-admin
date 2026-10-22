import React, { useRef } from 'react';
import { Camera, CheckCircle2, AlertCircle, Lock, Shield, GraduationCap } from 'lucide-react';

interface ExpertProfileSettingsProps {
  fullName: string;
  setFullName: (name: string) => void;
  designation: string;
  setDesignation: (des: string) => void;
  email: string;
  role: string;
  avatarInitials: string;
  setAvatarInitials: (initials: string) => void;
  avatarImage: string | null;
  setAvatarImage: (img: string | null) => void;
  profileSuccess: boolean;
  onSaveProfile: (e: React.FormEvent) => void;
  isSaving?: boolean;
  profileError?: string;
  onFileSelected?: (file: File) => void;
}

export const ExpertProfileSettings: React.FC<ExpertProfileSettingsProps> = ({
  fullName,
  setFullName,
  designation,
  setDesignation,
  email,
  role,
  avatarInitials,
  setAvatarInitials,
  avatarImage,
  setAvatarImage,
  profileSuccess,
  onSaveProfile,
  isSaving = false,
  profileError,
  onFileSelected,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePhotoClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarImage(url);
      onFileSelected?.(file);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col justify-between h-full transition-all">
      {/* Hidden File Input for Avatar */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      <div>
        {/* Card Header */}
        <div className="flex items-center gap-3.5 pb-5 border-b border-slate-100 mb-6">
          <div className="w-11 h-11 rounded-2xl bg-teal-50 text-[#0E4F5A] flex items-center justify-center shrink-0 border border-teal-100">
            <GraduationCap className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-slate-900 leading-tight">
              Expert Professional Profile
            </h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Agricultural identity and expert credentials
            </p>
          </div>
        </div>

        {profileSuccess && (
          <div className="mb-5 p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Expert profile details saved successfully!</span>
          </div>
        )}

        {profileError && (
          <div className="mb-5 p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>{profileError}</span>
          </div>
        )}

        {/* Avatar Section */}
        <div className="flex items-center gap-4.5 p-4 rounded-2xl bg-slate-50/70 border border-slate-100 mb-6">
          <div className="relative shrink-0">
            {avatarImage ? (
              <img 
                src={avatarImage} 
                alt={fullName} 
                className="w-18 h-18 rounded-full object-cover border-2 border-white shadow-sm" 
              />
            ) : (
              <div className="w-18 h-18 rounded-full bg-[#062E35] text-white flex items-center justify-center font-bold text-xl tracking-wider select-none shadow-sm">
                {avatarInitials}
              </div>
            )}

            {/* Camera icon button */}
            <button
              type="button"
              onClick={handlePhotoClick}
              className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-[#0E4F5A] text-white flex items-center justify-center hover:bg-[#062E35] transition-colors shadow-md cursor-pointer border-2 border-white"
              title="Upload expert photo"
            >
              <Camera className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-col min-w-0">
            <span className="text-base font-bold text-slate-900 leading-tight truncate">
              {fullName || 'Agricultural Specialist'}
            </span>
            <div className="flex items-center gap-2 mt-1">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-teal-800 bg-teal-100 px-2 py-0.5 rounded-md">
                <Shield className="w-3 h-3" />
                {role}
              </span>
            </div>
            <button
              type="button"
              onClick={handlePhotoClick}
              className="text-xs font-semibold text-[#0E4F5A] hover:underline text-left mt-1.5 cursor-pointer"
            >
              Change photo
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <form onSubmit={onSaveProfile} id="expert-profile-form" className="flex flex-col gap-4">
          {/* Expert Full Name */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Official Expert Name
            </label>
            <input
              type="text"
              required
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
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10 transition-all font-medium placeholder:text-slate-400"
              placeholder="e.g. Dr. Farhana Akter"
            />
          </div>

          {/* Specialization / Legal Representative */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-slate-700">
              Specialization & Professional Designation
            </label>
            <input
              type="text"
              required
              value={designation}
              onChange={(e) => setDesignation(e.target.value)}
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10 transition-all font-medium placeholder:text-slate-400"
              placeholder="e.g. Senior Plant Pathologist & Soil Diagnostics Specialist"
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col gap-1.5">
            <div className="flex items-center justify-between">
              <label className="text-xs font-semibold text-slate-700">
                Expert Support Email
              </label>
              <span className="text-[11px] text-slate-400 flex items-center gap-1">
                <Lock className="w-3 h-3" /> Read-only
              </span>
            </div>
            <input
              type="email"
              value={email}
              disabled
              className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-600 cursor-not-allowed font-medium select-none"
            />
          </div>
        </form>
      </div>

      {/* Save Button */}
      <div className="flex justify-end pt-6 mt-4 border-t border-slate-100">
        <button
          type="submit"
          form="expert-profile-form"
          disabled={isSaving}
          className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-98 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
        >
          {isSaving ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Saving...</span>
            </>
          ) : (
            <span>Save Expert Profile</span>
          )}
        </button>
      </div>
    </div>
  );
};
