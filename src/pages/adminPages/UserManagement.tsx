import React, { useState } from 'react';
import { UserMetricsGrid } from '../../components/adminComponents/userManagement/UserMetricsGrid';
import { UserFilters } from '../../components/adminComponents/userManagement/UserFilters';
import { UserTable } from '../../components/adminComponents/userManagement/UserTable';
import { UserDetailsModal } from '../../components/adminComponents/userManagement/UserDetailsModal';
import { UserActionModal } from '../../components/adminComponents/userManagement/UserActionModal';

export interface UserAccount {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  avatarBg?: string;
  phone?: string;
  role: 'Customer' | 'Vendor' | 'Admin';
  lastLogin: string;
  status: 'Active' | 'Trial' | 'Suspended' | 'Inactive';
  joinedDate: string;
}

export const UserManagement: React.FC = () => {
  // Realistic user list matching business roles and attributes
  const [users, setUsers] = useState<UserAccount[]>([
    {
      id: 1,
      name: "Liam Gallagher",
      email: 'liam.g@krisikunjo.com',
      phone: '+971 50 123 4567',
      role: 'Customer',
      lastLogin: '10 mins ago',
      status: 'Active',
      joinedDate: 'Jan 12, 2026',
      avatarBg: 'bg-teal-600 text-white'
    },
    {
      id: 2,
      name: "Aoife Turner",
      email: 'aoife.turner@apexstore.com',
      phone: '+971 52 234 5678',
      role: 'Vendor',
      lastLogin: 'Today, 09:30 AM',
      status: 'Active',
      joinedDate: 'Feb 03, 2026',
      avatarBg: 'bg-sky-600 text-white'
    },
    {
      id: 3,
      name: "Marcus Chen",
      email: 'marcus.chen@techpoint.io',
      phone: '+971 55 345 6789',
      role: 'Vendor',
      lastLogin: 'Yesterday, 4:15 PM',
      status: 'Active',
      joinedDate: 'Mar 15, 2026',
      avatarBg: 'bg-indigo-600 text-white'
    },
    {
      id: 4,
      name: "Sophia Martinez",
      email: 'sophia.m@globalbuyer.net',
      phone: '+971 54 456 7890',
      role: 'Customer',
      lastLogin: '2 hours ago',
      status: 'Trial',
      joinedDate: 'Apr 02, 2026',
      avatarBg: 'bg-amber-500 text-white'
    },
    {
      id: 5,
      name: "Ahmed Al-Maktoum",
      email: 'ahmed.admin@krisikunjo.com',
      phone: '+971 50 901 2345',
      role: 'Admin',
      lastLogin: 'Just now',
      status: 'Active',
      joinedDate: 'Jan 01, 2025',
      avatarBg: 'bg-purple-600 text-white'
    },
    {
      id: 6,
      name: "Farhana Karim",
      email: 'farhana.k@nexusretail.com',
      phone: '+971 56 678 9012',
      role: 'Vendor',
      lastLogin: 'Oct 01, 2026',
      status: 'Suspended',
      joinedDate: 'May 20, 2026',
      avatarBg: 'bg-rose-500 text-white'
    },
    {
      id: 7,
      name: "Sarah O'Brien",
      email: 'sarah.obrien@krisikunjo.com',
      phone: '+971 58 789 0123',
      role: 'Customer',
      lastLogin: 'Sep 28, 2026',
      status: 'Suspended',
      joinedDate: 'Jul 06, 2025',
      avatarBg: 'bg-slate-600 text-white'
    }
  ]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'All' | 'Customer' | 'Vendor' | 'Admin'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Trial' | 'Suspended'>('All');

  // Modal states
  const [viewingUser, setViewingUser] = useState<UserAccount | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: 'suspend' | 'delete';
    user: UserAccount;
  } | null>(null);

  // Filter logic
  const filteredUsers = users.filter((u) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = u.name.toLowerCase().includes(term) || 
                          u.email.toLowerCase().includes(term) ||
                          (u.phone && u.phone.includes(term));
    const matchesRole = selectedRole === 'All' || u.role === selectedRole;
    const matchesStatus = selectedStatus === 'All' || u.status === selectedStatus;

    return matchesSearch && matchesRole && matchesStatus;
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

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-12 animate-in fade-in duration-200">
      {/* 1. Page Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            User Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Monitor and manage registered customer, vendor, and administrator accounts.
          </p>
        </div>
      </div>

      {/* 2. Top Metric Cards (5 Cards) */}
      <UserMetricsGrid />

      {/* 3. Filter Bar */}
      <UserFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedRole={selectedRole}
        onRoleChange={setSelectedRole}
        selectedStatus={selectedStatus}
        onStatusChange={setSelectedStatus}
      />

      {/* 4. Users Table */}
      <UserTable
        users={filteredUsers}
        onViewUser={(user) => setViewingUser(user)}
        onOpenActionModal={(type, user) => setActionModal({ type, user })}
        onReactivate={handleReactivate}
      />

      {/* 5. User Details Modal */}
      <UserDetailsModal
        user={viewingUser}
        onClose={() => setViewingUser(null)}
        onReactivate={handleReactivate}
        onOpenActionModal={(type, user) => {
          setViewingUser(null);
          setActionModal({ type, user });
        }}
      />

      {/* 6. Action Confirmation Modal */}
      <UserActionModal
        modalData={actionModal}
        onClose={() => setActionModal(null)}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
};

export default UserManagement;
