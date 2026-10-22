import React, { useState, useRef } from 'react';
import { 
  X, 
  User, 
  Mail, 
  Lock, 
  Phone, 
  Briefcase, 
  GraduationCap, 
  Upload, 
  Eye, 
  EyeOff, 
  Sparkles, 
  Copy, 
  Check, 
  CheckCircle2, 
  ShieldCheck,
  Camera
} from 'lucide-react';
import { 
  EXPERT_SPECIALIZATIONS, 
  type CreateExpertPayload 
} from './expertTypes';

// Compress/read image file from device
const compressImage = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    if (file.type === 'image/svg+xml' || file.type === 'image/gif' || file.size < 200 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
      return;
    }
    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const maxSize = 800;
        let width = img.width;
        let height = img.height;
        if (width > height) {
          if (width > maxSize) {
            height = Math.round((height * maxSize) / width);
            width = maxSize;
          }
        } else {
          if (height > maxSize) {
            width = Math.round((width * maxSize) / height);
            height = maxSize;
          }
        }
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => resolve(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  });
};

interface AddExpertModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (payload: CreateExpertPayload) => Promise<void>;
  isLoading?: boolean;
}

export const AddExpertModal: React.FC<AddExpertModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  isLoading = false,
}) => {
  // Device File Input Ref
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [phone, setPhone] = useState('');
  const [specialization, setSpecialization] = useState<string>(EXPERT_SPECIALIZATIONS[0]);
  const [customSpecialization, setCustomSpecialization] = useState('');
  const [designation, setDesignation] = useState('Senior Agricultural Specialist');
  const [experienceYears, setExperienceYears] = useState('5');
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState('');
  const [status, setStatus] = useState<'ACTIVE' | 'INACTIVE'>('ACTIVE');

  // Success summary modal state
  const [createdCredentials, setCreatedCredentials] = useState<{
    name: string;
    email: string;
    password?: string;
  } | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGeneratePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
    let res = '';
    for (let i = 0; i < 10; i++) {
      res += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setPassword(res);
    setShowPassword(true);
  };

  const handleImageFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, WebP).');
      return;
    }
    try {
      setIsUploadingPhoto(true);
      const dataUrl = await compressImage(file);
      setAvatar(dataUrl);
    } catch (err) {
      console.error('Failed to read image file:', err);
    } finally {
      setIsUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return alert('Please enter expert full name');
    if (!email.trim()) return alert('Please enter expert email for login');
    if (!password.trim()) return alert('Please set an initial login password for the expert');

    const finalSpecialization =
      specialization === 'Other' && customSpecialization.trim()
        ? customSpecialization.trim()
        : specialization;

    const payload: CreateExpertPayload = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
      phone: phone.trim() || undefined,
      specialization: finalSpecialization,
      designation: designation.trim() || 'Agricultural Specialist',
      experienceYears: experienceYears.trim() ? `${experienceYears.trim()} years` : undefined,
      bio: bio.trim() || undefined,
      avatar: avatar.trim() || undefined,
      status,
    };

    try {
      await onSubmit(payload);
      setCreatedCredentials({
        name: name.trim(),
        email: email.trim(),
        password: password.trim(),
      });
    } catch (err) {
      console.error('Failed to create expert:', err);
    }
  };

  const handleCopyCredentials = () => {
    if (!createdCredentials) return;
    const text = `KrishiKunjo Expert Login Credentials:\nName: ${createdCredentials.name}\nEmail: ${createdCredentials.email}\nPassword: ${createdCredentials.password}\nLogin Portal: ${window.location.origin}/login\nRole: Agricultural Support Expert`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleCloseAll = () => {
    setCreatedCredentials(null);
    setName('');
    setEmail('');
    setPassword('');
    setPhone('');
    setBio('');
    setAvatar('');
    onClose();
  };

  // 1. Success state: Show credentials to admin to copy & share with the expert
  if (createdCredentials) {
    return (
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
        <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 shadow-2xl border border-slate-200 text-center flex flex-col items-center animate-in zoom-in-95 duration-150">
          <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 shrink-0 border border-emerald-100">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <h3 className="text-xl font-bold text-slate-900">
            Expert Account Created!
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
            The expert profile has been registered in the system. Send these login credentials to the expert so they can log in and start providing support services.
          </p>

          <div className="w-full bg-slate-50 rounded-2xl p-4 my-5 border border-slate-200 text-left space-y-2.5">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Expert Name
              </span>
              <span className="text-sm font-bold text-slate-900">
                {createdCredentials.name}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Login Email
              </span>
              <span className="text-sm font-semibold text-slate-900 font-mono">
                {createdCredentials.email}
              </span>
            </div>
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Login Password
              </span>
              <span className="text-sm font-bold text-emerald-800 font-mono bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200 inline-block mt-0.5">
                {createdCredentials.password}
              </span>
            </div>
            <div className="pt-1">
              <span className="text-[11px] text-slate-400 italic block">
                Role: <strong className="text-slate-600 font-semibold">EXPERT (Support Provider)</strong>
              </span>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 w-full">
            <button
              type="button"
              onClick={handleCopyCredentials}
              className="w-full py-3 px-4 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs active:scale-98"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Credentials Copied!' : 'Copy Login Credentials'}</span>
            </button>

            <button
              type="button"
              onClick={handleCloseAll}
              className="w-full py-2.5 px-4 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Done & Return to List
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 2. Main Add Expert Form
  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 sm:p-6 overflow-y-auto animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh] animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-white shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#E2ECEE] text-[#062E35] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                Add New Agri Expert
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Create expert credentials so they can log in to handle support service
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 sm:p-8 flex flex-col gap-6">
          {/* Section 1: Basic Profile */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              1. Basic Profile & Contact
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Full Name <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    placeholder="e.g., Dr. Tariqul Islam"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#062E35] focus:ring-2 focus:ring-[#062E35]/10"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Contact Phone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="tel"
                    placeholder="e.g., +880 1712-345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#062E35] focus:ring-2 focus:ring-[#062E35]/10"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Login Credentials (CRUCIAL FOR EXPERT LOGIN) */}
          <div className="flex flex-col gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-200/80">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>2. Expert Login Credentials</span>
              </span>
              <button
                type="button"
                onClick={handleGeneratePassword}
                className="text-[11px] font-semibold text-[#0E4F5A] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Sparkles className="w-3 h-3 text-amber-500" />
                <span>Auto-generate password</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Login Email <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="email"
                    required
                    placeholder="expert@krishikunjo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#062E35]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Account Password <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Enter or generate password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-white text-xs font-medium text-slate-900 focus:outline-none focus:border-[#062E35]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            </div>
            <p className="text-[11px] text-slate-500 italic">
              * The expert will use this email and password to log in and attend to live farmer support inquiries.
            </p>
          </div>

          {/* Section 3: Professional Specialization & Role */}
          <div className="flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-wider block">
              3. Specialization & Role
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Primary Specialization <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <Briefcase className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                  <select
                    value={specialization}
                    onChange={(e) => setSpecialization(e.target.value)}
                    className="w-full pl-10 pr-8 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#062E35] bg-white cursor-pointer"
                  >
                    {EXPERT_SPECIALIZATIONS.map((spec) => (
                      <option key={spec} value={spec}>
                        {spec}
                      </option>
                    ))}
                    <option value="Other">Other (Custom Specialization)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Professional Designation
                </label>
                <input
                  type="text"
                  placeholder="e.g., Senior Crop Consultant"
                  value={designation}
                  onChange={(e) => setDesignation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#062E35]"
                />
              </div>
            </div>

            {specialization === 'Other' && (
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Specify Custom Specialization
                </label>
                <input
                  type="text"
                  placeholder="e.g., Hydroponics & Vertical Farming"
                  value={customSpecialization}
                  onChange={(e) => setCustomSpecialization(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#062E35]"
                />
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Experience (Years)
                </label>
                <input
                  type="number"
                  min="0"
                  max="60"
                  placeholder="e.g., 5"
                  value={experienceYears}
                  onChange={(e) => setExperienceYears(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#062E35]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                  Initial Status
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as 'ACTIVE' | 'INACTIVE')}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#062E35] bg-white cursor-pointer"
                >
                  <option value="ACTIVE">Active & Available</option>
                  <option value="INACTIVE">Inactive (Pending Review)</option>
                </select>
              </div>
            </div>

            {/* Device Profile Photo Selection */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-slate-700 block">
                  Expert Profile Photo
                </label>
                <button
                  type="button"
                  onClick={() => setShowUrlInput(!showUrlInput)}
                  className="text-[11px] font-semibold text-[#0E4F5A] hover:underline cursor-pointer"
                >
                  {showUrlInput ? 'Hide photo URL input' : 'Or enter image URL'}
                </button>
              </div>

              {/* Hidden File Input */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handleImageFileSelected}
                className="hidden"
              />

              <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-50 border border-slate-200/80">
                {/* Photo Preview Circle */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="relative group cursor-pointer shrink-0"
                >
                  {avatar ? (
                    <div className="relative">
                      <img
                        src={avatar}
                        alt="Expert avatar preview"
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
                      />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setAvatar('');
                        }}
                        className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-rose-500 text-white flex items-center justify-center text-xs hover:bg-rose-600 shadow cursor-pointer"
                        title="Remove photo"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <div className="w-16 h-16 rounded-2xl bg-white border-2 border-dashed border-slate-300 hover:border-[#062E35] flex flex-col items-center justify-center text-slate-400 group-hover:text-slate-600 transition-colors shadow-2xs">
                      <Camera className="w-6 h-6 text-slate-400 group-hover:scale-110 transition-transform" />
                    </div>
                  )}
                </div>

                {/* Upload action text & button */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={isUploadingPhoto}
                      className="px-3.5 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer flex items-center gap-1.5 shadow-2xs"
                    >
                      <Upload className="w-3.5 h-3.5 text-slate-500" />
                      <span>{avatar ? 'Change Photo from Device' : 'Choose Photo from Device'}</span>
                    </button>
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Click to select JPG, PNG, or WebP photo from your computer.
                  </p>
                </div>
              </div>

              {/* Optional URL Input */}
              {showUrlInput && (
                <div className="relative mt-2.5 animate-in fade-in duration-150">
                  <input
                    type="url"
                    placeholder="Paste image web link (https://...)"
                    value={avatar}
                    onChange={(e) => setAvatar(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#062E35] bg-white"
                  />
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-700 block mb-1.5">
                Professional Bio / Summary
              </label>
              <textarea
                rows={3}
                placeholder="Brief summary of the expert's background, past advisory roles, or academic degrees..."
                value={bio}
                onChange={(e) => setBio(e.target.value)}
                className="w-full p-3 rounded-xl border border-slate-200 text-xs font-medium text-slate-900 focus:outline-none focus:border-[#062E35] resize-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
            >
              Cancel
            </button>

            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-98 disabled:opacity-50 flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Creating Account...</span>
                </>
              ) : (
                <span>Create Expert Account</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
