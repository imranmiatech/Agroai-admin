import React, { useState, useEffect } from 'react';
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
  status: 'Active' | 'Inactive' | 'Suspended';
  joinedDate: string;
}

export const UserManagement: React.FC = () => {
  // 24 realistic users for multi-page pagination demo
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
      status: 'Inactive',
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
    },
    {
      id: 8,
      name: "David Miller",
      email: 'david.m@harvestfresh.ae',
      phone: '+971 50 890 1234',
      role: 'Vendor',
      lastLogin: '3 days ago',
      status: 'Active',
      joinedDate: 'Aug 14, 2026',
      avatarBg: 'bg-emerald-600 text-white'
    },
    {
      id: 9,
      name: "Elena Rostova",
      email: 'elena.rostova@ecoorganic.com',
      phone: '+971 55 901 2345',
      role: 'Customer',
      lastLogin: '4 hours ago',
      status: 'Active',
      joinedDate: 'Aug 22, 2026',
      avatarBg: 'bg-cyan-600 text-white'
    },
    {
      id: 10,
      name: "Tariq Mansour",
      email: 'tariq.mansour@agritech.com',
      phone: '+971 52 345 6781',
      role: 'Vendor',
      lastLogin: '5 mins ago',
      status: 'Active',
      joinedDate: 'Sep 01, 2026',
      avatarBg: 'bg-teal-700 text-white'
    },
    {
      id: 11,
      name: "Jessica Taylor",
      email: 'jessica.t@greenfarms.org',
      phone: '+971 54 567 8902',
      role: 'Customer',
      lastLogin: '1 day ago',
      status: 'Inactive',
      joinedDate: 'Sep 10, 2026',
      avatarBg: 'bg-fuchsia-600 text-white'
    },
    {
      id: 12,
      name: "Kamal Hossain",
      email: 'kamal.hossain@banglaagri.com',
      phone: '+971 56 789 0124',
      role: 'Vendor',
      lastLogin: 'Yesterday',
      status: 'Active',
      joinedDate: 'Sep 18, 2026',
      avatarBg: 'bg-blue-600 text-white'
    },
    {
      id: 13,
      name: "Fatima Zahra",
      email: 'fatima.zahra@krisikunjo.com',
      phone: '+971 50 112 2334',
      role: 'Admin',
      lastLogin: '30 mins ago',
      status: 'Active',
      joinedDate: 'Feb 15, 2025',
      avatarBg: 'bg-violet-600 text-white'
    },
    {
      id: 14,
      name: "Oliver Smith",
      email: 'oliver.smith@sunflower.co',
      phone: '+971 52 334 4556',
      role: 'Customer',
      lastLogin: 'Oct 05, 2026',
      status: 'Inactive',
      joinedDate: 'Jun 11, 2026',
      avatarBg: 'bg-slate-500 text-white'
    },
    {
      id: 15,
      name: "Nadia Rahman",
      email: 'nadia.r@biogreens.ae',
      phone: '+971 55 556 6778',
      role: 'Vendor',
      lastLogin: 'Today, 11:20 AM',
      status: 'Active',
      joinedDate: 'Oct 02, 2026',
      avatarBg: 'bg-lime-600 text-white'
    },
    {
      id: 16,
      name: "Lucas Dupont",
      email: 'lucas.dupont@euroagri.fr',
      phone: '+971 54 778 8990',
      role: 'Customer',
      lastLogin: '2 weeks ago',
      status: 'Active',
      joinedDate: 'Jul 29, 2026',
      avatarBg: 'bg-orange-600 text-white'
    },
    {
      id: 17,
      name: "Zainab Begum",
      email: 'zainab.b@freshroots.com',
      phone: '+971 56 990 0112',
      role: 'Vendor',
      lastLogin: 'Oct 12, 2026',
      status: 'Suspended',
      joinedDate: 'Mar 25, 2026',
      avatarBg: 'bg-red-600 text-white'
    },
    {
      id: 18,
      name: "Benjamin Scott",
      email: 'ben.scott@scottfarms.com',
      phone: '+971 50 223 3445',
      role: 'Vendor',
      lastLogin: 'Today, 08:45 AM',
      status: 'Active',
      joinedDate: 'Oct 14, 2026',
      avatarBg: 'bg-emerald-700 text-white'
    },
    {
      id: 19,
      name: "Priya Sharma",
      email: 'priya.sharma@earthfirst.in',
      phone: '+971 52 445 5667',
      role: 'Customer',
      lastLogin: '6 hours ago',
      status: 'Active',
      joinedDate: 'Sep 29, 2026',
      avatarBg: 'bg-pink-600 text-white'
    },
    {
      id: 20,
      name: "Rashid Khalifa",
      email: 'rashid.k@krisikunjo.com',
      phone: '+971 55 667 7889',
      role: 'Admin',
      lastLogin: 'Yesterday',
      status: 'Active',
      joinedDate: 'Nov 01, 2025',
      avatarBg: 'bg-purple-700 text-white'
    },
    {
      id: 21,
      name: "Hannah Watson",
      email: 'hannah.w@pureharvest.co',
      phone: '+971 54 889 9001',
      role: 'Customer',
      lastLogin: 'Oct 15, 2026',
      status: 'Inactive',
      joinedDate: 'Oct 10, 2026',
      avatarBg: 'bg-amber-600 text-white'
    },
    {
      id: 22,
      name: "Bilal Anwar",
      email: 'bilal.anwar@greenseed.pk',
      phone: '+971 56 123 4568',
      role: 'Vendor',
      lastLogin: '2 days ago',
      status: 'Active',
      joinedDate: 'Aug 05, 2026',
      avatarBg: 'bg-teal-600 text-white'
    },
    {
      id: 23,
      name: "Chloe Martin",
      email: 'chloe.martin@seedling.org',
      phone: '+971 50 334 5567',
      role: 'Customer',
      lastLogin: '1 hour ago',
      status: 'Active',
      joinedDate: 'Oct 16, 2026',
      avatarBg: 'bg-indigo-500 text-white'
    },
    {
      id: 24,
      name: "Yousef Al-Hassan",
      email: 'yousef.h@oasisflora.ae',
      phone: '+971 52 556 7789',
      role: 'Vendor',
      lastLogin: 'Today, 10:00 AM',
      status: 'Active',
      joinedDate: 'Oct 18, 2026',
      avatarBg: 'bg-cyan-700 text-white'
    }
  ]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRole, setSelectedRole] = useState<'All' | 'Customer' | 'Vendor' | 'Admin'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Inactive' | 'Suspended'>('All');

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

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

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedRole, selectedStatus]);

  // Pagination calculation
  const totalFiltered = filteredUsers.length;
  const totalPages = Math.ceil(totalFiltered / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

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
    <div className="w-full max-w-full flex flex-col gap-6 font-['Inter'] pb-12 animate-in fade-in duration-200">
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

      {/* 4. Users Table with Pagination */}
      <UserTable
        users={paginatedUsers}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        totalFiltered={totalFiltered}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
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
