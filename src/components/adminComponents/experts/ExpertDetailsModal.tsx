import React from 'react';
import { 
  X, 
  Mail, 
  Phone, 
  Calendar, 
  Star, 
  Headphones 
} from 'lucide-react';
import type { ExpertItem } from './expertTypes';

interface ExpertDetailsModalProps {
  expert: ExpertItem | null;
  onClose: () => void;
  onToggleStatus?: (expert: ExpertItem) => void;
}

export const ExpertDetailsModal: React.FC<ExpertDetailsModalProps> = ({
  expert,
  onClose,
  onToggleStatus,
}) => {
  if (!expert) return null;

  const isActive = expert.status.toUpperCase() === 'ACTIVE';

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-xl w-full shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-150">
        {/* Header with Dark Green Accent */}
        <div className="bg-[#062E35] text-white p-6 relative">
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>

          <div className="flex items-center gap-4">
            {expert.avatar ? (
              <img
                src={expert.avatar}
                alt={expert.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400 shadow-sm shrink-0"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-emerald-700 text-white flex items-center justify-center text-xl font-bold border-2 border-emerald-400/50 shrink-0">
                {expert.name.charAt(0).toUpperCase()}
              </div>
            )}

            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight text-white">
                  {expert.name}
                </h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#BEF264] text-[#022C22] uppercase tracking-wider">
                  EXPERT
                </span>
              </div>
              <p className="text-xs text-emerald-200 mt-0.5">
                {expert.designation || 'Agricultural Support Specialist'}
              </p>
              <div className="flex items-center gap-3 mt-2 text-xs text-white/80">
                <span className="inline-flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                  <strong className="text-white">{expert.rating || 5.0}</strong> Rating
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1">
                  <Headphones className="w-3.5 h-3.5 text-emerald-300" />
                  <strong className="text-white">{expert.assignedTicketsCount || 0}</strong> Support Queries
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Body */}
        <div className="overflow-y-auto p-6 space-y-5 text-xs text-slate-700">
          {/* Status & Availability Strip */}
          <div className="flex items-center justify-between p-3.5 rounded-xl bg-slate-50 border border-slate-200/80">
            <div>
              <span className="text-[11px] font-semibold text-slate-400 block uppercase">
                Account Status
              </span>
              <span className={`inline-flex items-center gap-1.5 font-bold text-xs mt-0.5 ${
                isActive ? 'text-emerald-700' : 'text-slate-500'
              }`}>
                <span className={`w-2 h-2 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {isActive ? 'Active (Can Provide Support)' : 'Inactive'}
              </span>
            </div>

            {onToggleStatus && (
              <button
                type="button"
                onClick={() => onToggleStatus(expert)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors ${
                  isActive
                    ? 'border border-rose-200 text-rose-600 hover:bg-rose-50'
                    : 'border border-emerald-200 text-emerald-700 hover:bg-emerald-50'
                }`}
              >
                {isActive ? 'Suspend Expert' : 'Activate Expert'}
              </button>
            )}
          </div>

          {/* Contact Details */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Contact & Credentials
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <Mail className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block">Login Email</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {expert.email}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2.5 p-3 rounded-xl border border-slate-100 bg-slate-50/50">
                <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="min-w-0">
                  <span className="text-[10px] text-slate-400 block">Phone</span>
                  <span className="font-semibold text-slate-800 truncate block">
                    {expert.phone || 'Not provided'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Specialization & Experience */}
          <div className="space-y-2.5">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Area of Expertise
            </h4>
            <div className="p-3.5 rounded-xl border border-slate-200/80 bg-white space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-[#062E35]">
                  {expert.specialization}
                </span>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {expert.experienceYears || '3+ years experience'}
                </span>
              </div>
              {expert.bio ? (
                <p className="text-slate-600 leading-relaxed pt-1 border-t border-slate-100">
                  {expert.bio}
                </p>
              ) : (
                <p className="text-slate-400 italic">No bio provided.</p>
              )}
            </div>
          </div>

          {/* Meta Info */}
          <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-slate-100">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              Registered: {new Date(expert.createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
            <span>•</span>
            <span>ID: <strong className="font-mono text-slate-600">{expert.id}</strong></span>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-100 transition-colors cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
