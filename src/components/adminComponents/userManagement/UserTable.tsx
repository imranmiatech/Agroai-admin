import React from 'react';
import { Eye, Ban, CheckCircle2, Trash2 } from 'lucide-react';
import type { UserAccount } from '../../../pages/adminPages/UserManagement';

interface UserTableProps {
  users: UserAccount[];
  onViewUser: (user: UserAccount) => void;
  onOpenActionModal: (type: 'suspend' | 'delete', user: UserAccount) => void;
  onReactivate: (userId: number) => void;
}

export const UserTable: React.FC<UserTableProps> = ({
  users,
  onViewUser,
  onOpenActionModal,
  onReactivate
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
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
            {users.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                  No users found matching the selected filters.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr 
                  key={user.id} 
                  className="hover:bg-slate-50/70 transition-colors"
                >
                  {/* User Profile with Full Rounded Avatar */}
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-3">
                      {user.avatar ? (
                        <img 
                          src={user.avatar} 
                          alt={user.name} 
                          className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0 shadow-xs" 
                        />
                      ) : (
                        <div className={`w-10 h-10 rounded-full ${user.avatarBg || 'bg-[#0E4F5A] text-white'} flex items-center justify-center font-bold text-xs shrink-0 select-none shadow-xs`}>
                          {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
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
                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                      user.role === 'Admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                      user.role === 'Vendor' ? 'bg-sky-50 text-sky-700 border border-sky-200' :
                      user.role === 'Customer' ? 'bg-teal-50 text-teal-700 border border-teal-200' :
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
                    {user.status === 'Active' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        Active
                      </span>
                    )}
                    {user.status === 'Trial' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        Trial
                      </span>
                    )}
                    {user.status === 'Suspended' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                        Suspended
                      </span>
                    )}
                    {user.status === 'Inactive' && (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200">
                        Inactive
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
                      {/* View Details */}
                      <button
                        type="button"
                        onClick={() => onViewUser(user)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                        title="View user details"
                      >
                        <Eye className="w-4 h-4" />
                      </button>

                      {/* Suspend or Reactivate / Delete */}
                      {user.status !== 'Suspended' ? (
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
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
