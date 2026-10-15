import { useState } from 'react';
import { 
  Users, 
  Activity, 
  UserPlus, 
  Clock, 
  CreditCard, 
  Ban, 
  Search, 
  Eye, 
  Trash2, 
  ArrowUpRight, 
  ArrowDownRight,
  X,
  CheckCircle2
} from 'lucide-react';

export interface UserAccount {
  id: number;
  name: string;
  email: string;
  phone?: string;
  role: 'Parent' | 'Nanny' | 'Admin' | 'Family Member';
  plan: 'Free Trial' | 'Monthly' | 'Yearly' | 'Global';
  status: 'Active' | 'Trial' | 'Suspended';
  joinedDate: string;
}

export const UserManagement = () => {
  // Realistic user list matching the Figma design table
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: 1,
      name: "Sarah O'Brien",
      email: 'sarah.obrien@example.ie',
      phone: '+353 87 123 4567',
      role: 'Parent',
      plan: 'Free Trial',
      status: 'Active',
      joinedDate: 'Jul 6, 2025'
    },
    {
      id: 2,
      name: "Sarah O'Brien",
      email: 'sarah.obrien@example.ie',
      phone: '+353 87 234 5678',
      role: 'Nanny',
      plan: 'Monthly',
      status: 'Trial',
      joinedDate: 'Jul 6, 2025'
    },
    {
      id: 3,
      name: "Sarah O'Brien",
      email: 'sarah.obrien@example.ie',
      phone: '+353 87 345 6789',
      role: 'Parent',
      plan: 'Yearly',
      status: 'Suspended',
      joinedDate: 'Jul 6, 2025'
    },
    {
      id: 4,
      name: "Sarah O'Brien",
      email: 'sarah.obrien@example.ie',
      phone: '+353 87 456 7890',
      role: 'Parent',
      plan: 'Global',
      status: 'Suspended',
      joinedDate: 'Jul 6, 2025'
    },
    {
      id: 5,
      name: "Sarah O'Brien",
      email: 'sarah.obrien@example.ie',
      phone: '+353 87 567 8901',
      role: 'Parent',
      plan: 'Global',
      status: 'Suspended',
      joinedDate: 'Jul 6, 2025'
    },
    {
      id: 6,
      name: "Sarah O'Brien",
      email: 'sarah.obrien@example.ie',
      phone: '+353 87 678 9012',
      role: 'Parent',
      plan: 'Global',
      status: 'Suspended',
      joinedDate: 'Jul 6, 2025'
    },
    {
      id: 7,
      name: 'Liam Gallagher',
      email: 'liam.g@alurei-family.com',
      phone: '+353 89 901 2345',
      role: 'Parent',
      plan: 'Monthly',
      status: 'Active',
      joinedDate: 'Jul 5, 2025'
    }
  ]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'All' | 'Parent' | 'Nanny' | 'Admin'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Trial' | 'Suspended'>('All');
  const [selectedPlan, setSelectedPlan] = useState<'All' | 'Free Trial' | 'Monthly' | 'Yearly' | 'Global'>('All');

  // Modal states
  const [viewingUser, setViewingUser] = useState<UserAccount | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: 'suspend' | 'delete';
    user: UserAccount;
  } | null>(null);

  // 6 Metric Stat Cards matching Figma node 28406:45103
  const userMetrics = [
    {
      id: 'total-users',
      value: '1,372',
      label: 'Total Users',
      change: '+1.85%',
      isPositive: true,
      icon: <Users className="w-4 h-4 text-slate-700" />,
      iconBg: 'bg-slate-100',
      waveColor: '#14B8A6'
    },
    {
      id: 'active-today',
      value: '394',
      label: 'Active Today',
      change: '+3.4%',
      isPositive: true,
      icon: <Activity className="w-4 h-4 text-teal-600" />,
      iconBg: 'bg-teal-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'new-this-week',
      value: '47',
      label: 'New This Week',
      change: '+7.3%',
      isPositive: true,
      icon: <UserPlus className="w-4 h-4 text-sky-600" />,
      iconBg: 'bg-sky-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'trial-users',
      value: '178',
      label: 'Trial Users',
      change: '+5.9%',
      isPositive: true,
      icon: <Clock className="w-4 h-4 text-indigo-500" />,
      iconBg: 'bg-indigo-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'paid-members',
      value: '249',
      label: 'Paid Members',
      change: '+3.3%',
      isPositive: true,
      icon: <CreditCard className="w-4 h-4 text-purple-600" />,
      iconBg: 'bg-purple-50',
      waveColor: '#14B8A6'
    },
    {
      id: 'suspended',
      value: '12',
      label: 'Suspended',
      change: '+20%',
      isPositive: false,
      icon: <Ban className="w-4 h-4 text-rose-500" />,
      iconBg: 'bg-rose-50',
      waveColor: '#EF4444'
    }
  ];

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(term) || 
                          u.email.toLowerCase().includes(term) ||
                          (u.phone && u.phone.includes(term));
    const matchesRole = selectedRole === 'All' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || u.status === selectedStatus;
    const matchesPlan = selectedPlan === 'All' || u.plan === selectedPlan;

    return matchesSearch && matchesRole && matchesStatus && matchesPlan;
  });

  // Handle modal confirmation
  const handleConfirmAction = () => {
    if (!actionModal) return;

    if (actionModal.type === 'delete') {
      setUsers(users.filter((u) => u.id !== actionModal.user.id));
      if (viewingUser?.id === actionModal.user.id) setViewingUser(null);
    } else if (actionModal.type === 'suspend') {
      setUsers(users.map((u) => {
        if (u.id === actionModal.user.id) {
          const updated = { ...u, status: 'Suspended' as const };
          if (viewingUser?.id === u.id) setViewingUser(updated);
          return updated;
        }
        return u;
      }));
    }

    setActionModal(null);
  };

  const handleReactivate = (userId: number) => {
    setUsers(users.map((u) => {
      if (u.id === userId) {
        const updated = { ...u, status: 'Active' as const };
        if (viewingUser?.id === userId) setViewingUser(updated);
        return updated;
      }
      return u;
    }));
  };

  const getFirstName = (fullName: string) => {
    return fullName.split(' ')[0] || fullName;
  };

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-12">
      {/* 1. Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage parents, nannies, family members, and administrators from one place.
          </p>
        </div>
        <div className="text-xs font-semibold text-slate-500 bg-white px-3.5 py-1.5 rounded-full border border-slate-200 shadow-xs">
          {filteredUsers.length} of {users.length} users shown
        </div>
      </div>

      {/* 2. Top Metric Cards (6 Cards Row matching Figma) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3.5">
        {userMetrics.map((card) => (
          <div 
            key={card.id}
            className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
          >
            {/* Icon & Trend */}
            <div className="flex items-center justify-between mb-2.5">
              <div className={`w-7 h-7 rounded-lg ${card.iconBg} flex items-center justify-center`}>
                {card.icon}
              </div>
              <div className={`flex items-center gap-0.5 text-[11px] font-semibold ${card.isPositive ? 'text-emerald-600' : 'text-rose-500'}`}>
                {card.isPositive ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                <span>{card.change}</span>
              </div>
            </div>

            {/* Metric Value & Label */}
            <div>
              <div className="text-xl font-bold text-slate-900 tracking-tight leading-tight">
                {card.value}
              </div>
              <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                {card.label}
              </div>
            </div>

            {/* Sparkline curve */}
            <div className="w-full h-5 mt-2 relative">
              <svg className="w-full h-full overflow-visible" preserveAspectRatio="none" viewBox="0 0 100 20">
                <defs>
                  <linearGradient id={`spark-${card.id}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={card.waveColor} stopOpacity={0.25} />
                    <stop offset="100%" stopColor={card.waveColor} stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                {card.isPositive ? (
                  <>
                    <path d="M0,16 Q25,14 50,10 T100,4 L100,20 L0,20 Z" fill={`url(#spark-${card.id})`} />
                    <path d="M0,16 Q25,14 50,10 T100,4" fill="none" stroke={card.waveColor} strokeWidth="1.6" strokeLinecap="round" />
                  </>
                ) : (
                  <>
                    <path d="M0,6 Q30,12 60,14 T100,17 L100,20 L0,20 Z" fill={`url(#spark-${card.id})`} />
                    <path d="M0,6 Q30,12 60,14 T100,17" fill="none" stroke={card.waveColor} strokeWidth="1.6" strokeLinecap="round" />
                  </>
                )}
              </svg>
            </div>
          </div>
        ))}
      </div>

      {/* 3. Filter Bar (Figma Container with Input & 3 Dropdowns) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10 transition-all"
          />
        </div>

        {/* 3 Filter Dropdowns with Count Badge on Top Right */}
        <div className="flex items-center gap-3 w-full md:w-auto flex-wrap">
          {/* Roles Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <span className="absolute -top-1.5 -right-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-slate-300 z-10 pointer-events-none">
              12
            </span>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as any)}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#0E4F5A] cursor-pointer transition-colors"
            >
              <option value="All">All Roles</option>
              <option value="Parent">Parent</option>
              <option value="Nanny">Nanny</option>
              <option value="Admin">Admin</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Statuses Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <span className="absolute -top-1.5 -right-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-slate-300 z-10 pointer-events-none">
              12
            </span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value as any)}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#0E4F5A] cursor-pointer transition-colors"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Trial">Trial</option>
              <option value="Suspended">Suspended</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>

          {/* Plans Filter */}
          <div className="relative flex-1 sm:flex-initial">
            <span className="absolute -top-1.5 -right-1.5 bg-slate-100 text-slate-600 text-[10px] font-bold px-1.5 py-0.2 rounded-full border border-slate-300 z-10 pointer-events-none">
              12
            </span>
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value as any)}
              className="w-full sm:w-auto appearance-none pl-3.5 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:border-slate-300 focus:outline-none focus:border-[#0E4F5A] cursor-pointer transition-colors"
            >
              <option value="All">All Plans</option>
              <option value="Free Trial">Free Trial</option>
              <option value="Monthly">Monthly</option>
              <option value="Yearly">Yearly</option>
              <option value="Global">Global</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-400">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>
      </div>

      {/* 4. User Table Container (Figma Layout) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-600">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Plan</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Joined</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No users found matching the selected filters.
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr 
                    key={user.id} 
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* User Profile */}
                    <td className="py-4 px-6">
                      <div className="flex flex-col">
                        <span className="font-semibold text-slate-900 text-sm leading-tight">
                          {user.name}
                        </span>
                        <span className="text-xs text-slate-400 mt-0.5">
                          {user.email}
                        </span>
                      </div>
                    </td>

                    {/* Role Pill */}
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#E0F7FA] text-[#00695C]">
                        {user.role}
                      </span>
                    </td>

                    {/* Plan Pill */}
                    <td className="py-4 px-6">
                      {user.plan === 'Free Trial' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600">
                          Free Trial
                        </span>
                      )}
                      {user.plan === 'Monthly' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-600">
                          Monthly
                        </span>
                      )}
                      {user.plan === 'Yearly' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-600">
                          Yearly
                        </span>
                      )}
                      {user.plan === 'Global' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-600">
                          Global
                        </span>
                      )}
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-6">
                      {user.status === 'Active' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                          Active
                        </span>
                      )}
                      {user.status === 'Trial' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-600">
                          Trial
                        </span>
                      )}
                      {user.status === 'Suspended' && (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-600">
                          Suspended
                        </span>
                      )}
                    </td>

                    {/* Joined Date */}
                    <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                      {user.joinedDate}
                    </td>

                    {/* Action Icons */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-2 justify-end">
                        {/* View Details */}
                        <button
                          type="button"
                          onClick={() => setViewingUser(user)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View user details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Suspend or Reactivate / Delete */}
                        {user.status !== 'Suspended' ? (
                          <button
                            type="button"
                            onClick={() => setActionModal({ type: 'suspend', user })}
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-amber-600 hover:bg-amber-50 transition-colors cursor-pointer"
                            title="Suspend user"
                          >
                            <Ban className="w-4 h-4" />
                          </button>
                        ) : (
                          <>
                            <button
                              type="button"
                              onClick={() => handleReactivate(user.id)}
                              className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 transition-colors cursor-pointer"
                              title="Reactivate user"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setActionModal({ type: 'delete', user })}
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

      {/* 5. User Details Modal */}
      {viewingUser && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#062E35] text-white flex items-center justify-center font-bold text-sm">
                  {viewingUser.name.charAt(0)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-tight">
                    {viewingUser.name}
                  </h3>
                  <p className="text-xs text-slate-400">{viewingUser.email}</p>
                </div>
              </div>
              <button 
                type="button"
                onClick={() => setViewingUser(null)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Profile Info Details */}
            <div className="grid grid-cols-2 gap-3.5 text-xs">
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">User Role</span>
                <span className="font-semibold text-slate-800 text-sm">{viewingUser.role}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Subscription Plan</span>
                <span className="font-semibold text-slate-800 text-sm">{viewingUser.plan}</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Account Status</span>
                <span className={`font-semibold text-sm ${viewingUser.status === 'Active' ? 'text-emerald-600' : viewingUser.status === 'Trial' ? 'text-indigo-600' : 'text-rose-600'}`}>
                  {viewingUser.status}
                </span>
              </div>
              <div className="p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Member Since</span>
                <span className="font-semibold text-slate-800 text-sm">{viewingUser.joinedDate}</span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                {viewingUser.status === 'Suspended' ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleReactivate(viewingUser.id)}
                      className="py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 transition-all cursor-pointer"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>Reactivate</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActionModal({ type: 'delete', user: viewingUser })}
                      className="py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>Delete</span>
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => setActionModal({ type: 'suspend', user: viewingUser })}
                    className="py-2 px-3.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 bg-rose-50 text-rose-600 hover:bg-rose-100 transition-all cursor-pointer"
                  >
                    <Ban className="w-3.5 h-3.5" />
                    <span>Suspend User</span>
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={() => setViewingUser(null)}
                className="py-2 px-4 rounded-xl text-xs font-semibold bg-slate-900 text-white hover:bg-slate-800 transition-all cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Figma Exact DELETE & SUSPEND MODAL (Node 28406:50103) */}
      {actionModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150"
            style={{ borderRadius: '24px' }}
          >
            {/* Top Red Tint Squircle Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#FEE4E2] flex items-center justify-center mb-5 shrink-0">
              {actionModal.type === 'suspend' ? (
                <Ban className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
              ) : (
                <Trash2 className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
              )}
            </div>

            {/* Title - Exact Figma Heading */}
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              {actionModal.type === 'suspend' 
                ? `Suspend ${getFirstName(actionModal.user.name)}?`
                : `Delete ${getFirstName(actionModal.user.name)}?`
              }
            </h3>

            {/* Subtitle / Paragraph */}
            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              {actionModal.type === 'suspend'
                ? 'Are you sure you want to suspend this user'
                : `This will permanently remove ${getFirstName(actionModal.user.name)}'s profile and all associated data.`
              }
            </p>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-2 gap-3 w-full">
              {/* Cancel Button */}
              <button
                type="button"
                onClick={() => setActionModal(null)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                style={{ borderRadius: '16px' }}
              >
                Cancel
              </button>

              {/* Suspend / Delete Button */}
              <button
                type="button"
                onClick={handleConfirmAction}
                className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95"
                style={{ 
                  backgroundColor: '#B42318', 
                  borderRadius: '16px' 
                }}
              >
                {actionModal.type === 'suspend' ? 'Suspend' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
