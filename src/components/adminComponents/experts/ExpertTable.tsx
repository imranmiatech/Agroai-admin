import React from 'react';
import { 
  Eye, 
  Trash2, 
  Ban, 
  CheckCircle, 
  Phone, 
  Mail, 
  Star 
} from 'lucide-react';
import type { ExpertItem } from './expertTypes';

interface ExpertTableProps {
  experts: ExpertItem[];
  isLoading?: boolean;
  onView: (expert: ExpertItem) => void;
  onToggleStatus: (expert: ExpertItem) => void;
  onDelete: (expert: ExpertItem) => void;
}

export const ExpertTable: React.FC<ExpertTableProps> = ({
  experts,
  isLoading = false,
  onView,
  onToggleStatus,
  onDelete,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-700 bg-slate-50/50">
              <th className="py-4 px-6">Expert Profile</th>
              <th className="py-4 px-6">Specialization</th>
              <th className="py-4 px-6">Support Status</th>
              <th className="py-4 px-6">Rating</th>
              <th className="py-4 px-6">Registered</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, idx) => (
                <tr key={`skel-${idx}`} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200" />
                      <div className="flex flex-col gap-1.5 w-40">
                        <div className="h-4 bg-slate-200 rounded w-full" />
                        <div className="h-3 bg-slate-100 rounded w-3/4" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 w-32 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-6 w-20 bg-slate-200 rounded-full" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 w-12 bg-slate-100 rounded" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="h-4 w-16 bg-slate-100 rounded" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="h-8 w-20 bg-slate-100 rounded-lg ml-auto" />
                  </td>
                </tr>
              ))
            ) : experts.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-16 text-center text-slate-400 text-xs">
                  No experts found. Click <strong>+ Add New Expert</strong> to create your first expert profile.
                </td>
              </tr>
            ) : (
              experts.map((expert) => {
                const isActive = expert.status.toUpperCase() === 'ACTIVE';
                const initial = expert.name.charAt(0).toUpperCase();

                return (
                  <tr key={expert.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Expert Profile & Contact */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3.5">
                        {expert.avatar ? (
                          <img
                            src={expert.avatar}
                            alt={expert.name}
                            className="w-11 h-11 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                          />
                        ) : (
                          <div className="w-11 h-11 rounded-full bg-[#062E35] text-white flex items-center justify-center font-bold text-sm shrink-0 border border-emerald-400/30">
                            {initial}
                          </div>
                        )}
                        <div className="flex flex-col min-w-0 max-w-xs">
                          <div className="flex items-center gap-2">
                            <span
                              onClick={() => onView(expert)}
                              className="font-bold text-slate-900 text-sm cursor-pointer hover:text-[#062E35] transition-colors truncate"
                            >
                              {expert.name}
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#E2ECEE] text-[#062E35]">
                              EXPERT
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 truncate flex items-center gap-1 mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                            {expert.email}
                          </span>
                          {expert.phone && (
                            <span className="text-[11px] text-slate-400 truncate flex items-center gap-1">
                              <Phone className="w-3 h-3 text-slate-400 shrink-0" />
                              {expert.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Specialization & Title */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60 w-fit">
                          {expert.specialization}
                        </span>
                        {expert.designation && (
                          <span className="text-xs text-slate-400 mt-1">
                            {expert.designation}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Support Status */}
                    <td className="py-4 px-6">
                      {isActive ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                          Active
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                          <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                          Inactive
                        </span>
                      )}
                    </td>

                    {/* Rating */}
                    <td className="py-4 px-6 text-xs text-slate-700 font-medium">
                      <div className="flex items-center gap-1 text-slate-800 font-semibold">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        <span>{expert.rating || 5.0}</span>
                      </div>
                    </td>

                    {/* Registered Date */}
                    <td className="py-4 px-6 text-xs text-slate-500 whitespace-nowrap">
                      {new Date(expert.createdAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>

                    {/* Action Buttons */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 justify-end">
                        <button
                          type="button"
                          onClick={() => onView(expert)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View expert profile"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        <button
                          type="button"
                          onClick={() => onToggleStatus(expert)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                            isActive
                              ? 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                              : 'text-slate-400 hover:text-emerald-600 hover:bg-emerald-50'
                          }`}
                          title={isActive ? 'Suspend expert account' : 'Activate expert account'}
                        >
                          {isActive ? <Ban className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        </button>

                        <button
                          type="button"
                          onClick={() => onDelete(expert)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete expert"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
