import React, { memo } from 'react';
import { X, CheckCircle2, Trash2, Ban } from 'lucide-react';
import type { UserAccount } from '../../../pages/adminPages/UserManagement';

interface UserDetailsModalProps {
  user: UserAccount | null;
  onClose: () => void;
  onReactivate: (userId: string | number) => void;
  onOpenActionModal: (type: 'suspend' | 'delete', user: UserAccount) => void;
}

export const UserDetailsModal: React.FC<UserDetailsModalProps> = memo(({
  user,
  onClose,
  onReactivate,
  onOpenActionModal
}) => {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div className="flex items-center gap-3">
            {user.avatar ? (
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-11 h-11 rounded-full object-cover border border-slate-200 shrink-0 shadow-xs" 
              />
            ) : (
              <div className={`w-11 h-11 rounded-full ${user.avatarBg || 'bg-[#062E35] text-white'} flex items-center justify-center font-bold text-sm shrink-0 select-none shadow-xs`}>
                {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <h3 className="text-base font-bold text-slate-900 leading-tight">
                {user.name}
              </h3>
              <p className="text-xs text-slate-400">{user.email}</p>
            </div>
          </div>
          <button 
            type="button" 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Profile Info Details */}
        <div className="grid grid-cols-2 gap-3.5 text-xs">
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">User Role</span>
            <span className="font-semibold text-slate-800 text-sm">{user.role}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Last Login</span>
            <span className="font-semibold text-slate-800 text-sm">{user.lastLogin || 'Recent'}</span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Account Status</span>
            <span className={`font-semibold text-sm ${user.status === 'Active' ? 'text-emerald-600' : user.status === 'Inactive' ? 'text-slate-600' : 'text-rose-600'}`}>
              {user.status}
            </span>
          </div>
          <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
            <span className="text-slate-400 block mb-1">Member Since</span>
            <span className="font-semibold text-slate-800 text-sm">{user.joinedDate}</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="flex items-center gap-2">
            {user.status === 'Suspended' ? (
              <>
                <button
                  type="button"
                  onClick={() => onReactivate(user.id)}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Reactivate</span>
                </button>
                <button
                  type="button"
                  onClick={() => onOpenActionModal('delete', user)}
                  className="py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete</span>
                </button>
              </>
            ) : (
              <button
                type="button"
                onClick={() => onOpenActionModal('suspend', user)}
                className="py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
              >
                <Ban className="w-3.5 h-3.5" />
                <span>Suspend User</span>
              </button>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="py-2 px-4 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
});

UserDetailsModal.displayName = 'UserDetailsModal';

export default UserDetailsModal;
