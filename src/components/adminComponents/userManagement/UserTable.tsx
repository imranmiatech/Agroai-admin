import React, { memo, useMemo } from 'react';
import { Eye, Ban, CheckCircle2, Trash2, ChevronLeft, ChevronRight } from 'lucide-react';
import type { UserAccount } from '../../../pages/adminPages/UserManagement';

interface UserTableProps {
  users: UserAccount[];
  startIndex: number;
  itemsPerPage: number;
  totalFiltered: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: React.Dispatch<React.SetStateAction<number>>;
  onViewUser: (user: UserAccount) => void;
  onOpenActionModal: (type: 'suspend' | 'delete', user: UserAccount) => void;
  onReactivate: (userId: string | number) => void;
  isLoading?: boolean;
  isFetching?: boolean;
}

const getInitials = (name: string): string => {
  if (!name) return 'U';
  const parts = name.trim().split(/\s+/);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
};

const getPageNumbers = (current: number, total: number): (number | string)[] => {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }
  if (current <= 4) {
    return [1, 2, 3, 4, 5, '...', total];
  }
  if (current >= total - 3) {
    return [1, '...', total - 4, total - 3, total - 2, total - 1, total];
  }
  return [1, '...', current - 1, current, current + 1, '...', total];
};

// Memoized single row component to prevent unneeded re-renders
const UserTableRow = memo<{
  user: UserAccount;
  onViewUser: (user: UserAccount) => void;
  onOpenActionModal: (type: 'suspend' | 'delete', user: UserAccount) => void;
  onReactivate: (userId: string | number) => void;
}>(({ user, onViewUser, onOpenActionModal, onReactivate }) => {
  const roleLower = (user.role || '').toLowerCase();
  const statusLower = (user.status || '').toLowerCase();

  return (
    <tr className="hover:bg-slate-50/70 transition-colors">
      {/* User Profile */}
      <td className="py-4 px-6">
        <div className="flex items-center gap-3">
          {user.avatar ? (
            <img 
              src={user.avatar} 
              alt={user.name} 
              loading="lazy"
              className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-xs" 
            />
          ) : (
            <div className={`w-10 h-10 rounded-full ${user.avatarBg || 'bg-[#0E4F5A] text-white'} flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-xs`}>
              {getInitials(user.name)}
            </div>
          )}
          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-slate-900 text-sm leading-tight truncate">
              {user.name}
            </span>
            <span className="text-xs text-slate-400 mt-0.5 truncate">
              {user.email}
            </span>
          </div>
        </div>
      </td>

      {/* Role Pill */}
      <td className="py-4 px-6">
        <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold capitalize ${
          roleLower === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
          roleLower === 'vendor' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
          roleLower === 'expert' ? 'bg-[#E2ECEE] text-[#062E35] border border-emerald-200/80 font-bold' :
          roleLower === 'customer' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
          'bg-[#E0F7FA] text-[#00695C] border border-teal-100'
        }`}>
          {user.role}
        </span>
      </td>

      {/* Last Login */}
      <td className="py-4 px-6 text-xs text-slate-600 font-medium whitespace-nowrap">
        {user.lastLogin || 'Recent'}
      </td>

      {/* Status Pill */}
      <td className="py-4 px-6">
        {statusLower === 'active' && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            Active
          </span>
        )}
        {statusLower === 'inactive' && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
            Inactive
          </span>
        )}
        {statusLower === 'suspended' && (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
            Suspended
          </span>
        )}
      </td>

      {/* Joined Date */}
      <td className="py-4 px-6 text-xs text-slate-600 font-medium whitespace-nowrap">
        {user.joinedDate}
      </td>

      {/* Action Icons */}
      <td className="py-4 px-6 text-right whitespace-nowrap">
        <div className="inline-flex items-center gap-2 justify-end">
          <button
            type="button"
            onClick={() => onViewUser(user)}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
            title="View user details"
          >
            <Eye className="w-4 h-4" />
          </button>

          {statusLower !== 'suspended' ? (
            <button
              type="button"
              onClick={() => onOpenActionModal('suspend', user)}
              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
              title="Suspend user"
            >
              <Ban className="w-4 h-4" />
            </button>
          ) : (
            <>
              <button
                type="button"
                onClick={() => onReactivate(user.id)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                title="Reactivate user"
              >
                <CheckCircle2 className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => onOpenActionModal('delete', user)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                title="Delete user account"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      </td>
    </tr>
  );
});

UserTableRow.displayName = 'UserTableRow';

export const UserTable: React.FC<UserTableProps> = memo(({
  users,
  startIndex,
  itemsPerPage,
  totalFiltered,
  currentPage,
  totalPages,
  setCurrentPage,
  onViewUser,
  onOpenActionModal,
  onReactivate,
  isLoading = false,
  isFetching = false,
}) => {
  const pageNumbers = useMemo(() => getPageNumbers(currentPage, totalPages), [currentPage, totalPages]);

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden relative">
      {/* Top subtle indeterminate progress bar during background fetching */}
      {isFetching && !isLoading && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r from-teal-500 via-[#0E4F5A] to-emerald-400 animate-pulse z-20" />
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[650px]">
          <thead>
            <tr className="border-b border-slate-100 text-xs font-semibold text-slate-600 bg-slate-50/50">
              <th className="py-4 px-6">User</th>
              <th className="py-4 px-6">Role</th>
              <th className="py-4 px-6">Last Login</th>
              <th className="py-4 px-6">Status</th>
              <th className="py-4 px-6">Joined</th>
              <th className="py-4 px-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-sm">
            {isLoading && users.length === 0 ? (
              // Fast skeleton loading rows
              Array.from({ length: 6 }).map((_, idx) => (
                <tr key={idx} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-200" />
                      <div className="flex flex-col gap-1.5 flex-1">
                        <div className="w-28 h-3.5 bg-slate-200 rounded" />
                        <div className="w-40 h-2.5 bg-slate-100 rounded" />
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-16 h-5 rounded-full bg-slate-200" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-20 h-3.5 rounded bg-slate-200" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-14 h-5 rounded-full bg-slate-200" />
                  </td>
                  <td className="py-4 px-6">
                    <div className="w-20 h-3.5 rounded bg-slate-200" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="w-16 h-8 rounded bg-slate-100 ml-auto" />
                  </td>
                </tr>
              ))
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                  No users found matching the selected filters.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <UserTableRow
                  key={user.id}
                  user={user}
                  onViewUser={onViewUser}
                  onOpenActionModal={onOpenActionModal}
                  onReactivate={onReactivate}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Bar */}
      <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div>
          Showing <span className="font-semibold text-slate-700">{totalFiltered === 0 ? 0 : startIndex + 1}</span> to{' '}
          <span className="font-semibold text-slate-700">
            {Math.min(startIndex + itemsPerPage, totalFiltered)}
          </span>{' '}
          of <span className="font-semibold text-slate-700">{totalFiltered}</span> users
        </div>

        <div className="inline-flex items-center gap-1.5">
          <button
            type="button"
            disabled={currentPage === 1}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </button>

          {pageNumbers.map((page, idx) => {
            if (page === '...') {
              return (
                <span key={`dots-${idx}`} className="px-1 text-slate-400 font-semibold select-none">
                  ...
                </span>
              );
            }
            const pageNum = page as number;
            return (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#062E35] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button
            type="button"
            disabled={currentPage === totalPages || totalPages === 0}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
});

UserTable.displayName = 'UserTable';

export default UserTable;
