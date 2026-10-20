import React from 'react';
import { Ban, Trash2 } from 'lucide-react';
import type { UserAccount } from '../../../pages/adminPages/UserManagement';

interface UserActionModalProps {
  modalData: {
    type: 'suspend' | 'delete';
    user: UserAccount;
  } | null;
  onClose: () => void;
  onConfirm: () => void;
  isLoading?: boolean;
}

export const UserActionModal: React.FC<UserActionModalProps> = ({
  modalData,
  onClose,
  onConfirm,
  isLoading = false,
}) => {
  if (!modalData) return null;

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0] || fullName;
  };

  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
      <div 
        className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150"
        style={{ borderRadius: '24px' }}
      >
        {/* Top Red Tint Squircle Icon */}
        <div className="w-14 h-14 rounded-2xl bg-[#FEE4E2] flex items-center justify-center mb-5 shrink-0">
          {modalData.type === 'suspend' ? (
            <Ban className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
          ) : (
            <Trash2 className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
          )}
        </div>

        {/* Title */}
        <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
          {modalData.type === 'suspend' 
            ? `Suspend ${getFirstName(modalData.user.name)}?`
            : `Delete ${getFirstName(modalData.user.name)}?`
          }
        </h3>

        {/* Subtitle / Paragraph */}
        <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
          {modalData.type === 'suspend'
            ? 'Are you sure you want to suspend this user'
            : `This will permanently remove ${getFirstName(modalData.user.name)}'s profile and all associated data.`
          }
        </p>

        {/* Action Buttons Row */}
        <div className="grid grid-cols-2 gap-3 w-full">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ borderRadius: '16px' }}
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            style={{ 
              backgroundColor: '#B42318', 
              borderRadius: '16px' 
            }}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            <span>
              {isLoading
                ? modalData.type === 'suspend'
                  ? 'Suspending...'
                  : 'Deleting...'
                : modalData.type === 'suspend'
                ? 'Suspend'
                : 'Delete'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};
