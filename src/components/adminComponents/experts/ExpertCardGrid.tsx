import React from 'react';
import { 
  Trash2, 
  Mail, 
  Phone, 
  Star, 
  Ban, 
  UserCheck 
} from 'lucide-react';
import type { ExpertItem } from './expertTypes';

interface ExpertCardGridProps {
  experts: ExpertItem[];
  isLoading?: boolean;
  onView: (expert: ExpertItem) => void;
  onToggleStatus: (expert: ExpertItem) => void;
  onDelete: (expert: ExpertItem) => void;
}

export const ExpertCardGrid: React.FC<ExpertCardGridProps> = ({
  experts,
  isLoading = false,
  onView,
  onToggleStatus,
  onDelete,
}) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-slate-200/80 animate-pulse space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-slate-200" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-slate-200 rounded w-3/4" />
                <div className="h-3 bg-slate-100 rounded w-1/2" />
              </div>
            </div>
            <div className="h-10 bg-slate-100 rounded-xl" />
          </div>
        ))}
      </div>
    );
  }

  if (experts.length === 0) {
    return (
      <div className="bg-white rounded-2xl p-12 text-center text-slate-400 text-xs border border-slate-200/80">
        No experts found matching the filters. Click <strong>+ Add New Expert</strong> to create an expert.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {experts.map((expert) => {
        const isActive = expert.status.toUpperCase() === 'ACTIVE';
        const initial = expert.name.charAt(0).toUpperCase();

        return (
          <div
            key={expert.id}
            className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all flex flex-col justify-between gap-4 group"
          >
            {/* Top Row: Avatar & Status Badge */}
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-3">
                {expert.avatar ? (
                  <img
                    src={expert.avatar}
                    alt={expert.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-2xl bg-[#062E35] text-white flex items-center justify-center font-bold text-base shrink-0 border border-emerald-400/40">
                    {initial}
                  </div>
                )}
                <div>
                  <h4
                    onClick={() => onView(expert)}
                    className="font-bold text-slate-900 text-sm hover:text-[#062E35] cursor-pointer transition-colors leading-tight line-clamp-1"
                  >
                    {expert.name}
                  </h4>
                  <p className="text-xs text-slate-400 mt-0.5 line-clamp-1">
                    {expert.designation || 'Agricultural Specialist'}
                  </p>
                </div>
              </div>

              <span
                className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shrink-0 ${
                  isActive
                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                    : 'bg-slate-100 text-slate-600 border border-slate-200'
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500' : 'bg-slate-400'}`} />
                {isActive ? 'Active' : 'Inactive'}
              </span>
            </div>

            {/* Specialization Pill & Rating */}
            <div className="space-y-2">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#E2ECEE] text-[#062E35] line-clamp-1">
                {expert.specialization}
              </span>

              {expert.bio && (
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {expert.bio}
                </p>
              )}
            </div>

            {/* Contact Details */}
            <div className="pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-500">
              <div className="flex items-center gap-2 truncate">
                <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span className="truncate">{expert.email}</span>
              </div>
              {expert.phone && (
                <div className="flex items-center gap-2 truncate">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{expert.phone}</span>
                </div>
              )}
            </div>

            {/* Card Footer Actions */}
            <div className="flex items-center justify-between pt-3 border-t border-slate-100">
              <div className="flex items-center gap-1 text-xs text-slate-700 font-semibold">
                <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                <span>{expert.rating || 5.0}</span>
                <span className="text-[10px] text-slate-400 font-normal">Rating</span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => onView(expert)}
                  className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  View Details
                </button>

                <button
                  type="button"
                  onClick={() => onToggleStatus(expert)}
                  className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                    isActive
                      ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                      : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                  }`}
                  title={isActive ? 'Suspend' : 'Activate'}
                >
                  {isActive ? <Ban className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                </button>

                <button
                  type="button"
                  onClick={() => onDelete(expert)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                  title="Delete"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};
