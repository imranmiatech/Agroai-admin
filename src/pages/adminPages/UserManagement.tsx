import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { UserMetricsGrid } from '../../components/adminComponents/userManagement/UserMetricsGrid';
import { UserFilters } from '../../components/adminComponents/userManagement/UserFilters';
import { UserTable } from '../../components/adminComponents/userManagement/UserTable';
import { UserDetailsModal } from '../../components/adminComponents/userManagement/UserDetailsModal';
import { UserActionModal } from '../../components/adminComponents/userManagement/UserActionModal';
import {
  useGetUsersQuery,
  useUpdateUserStatusMutation,
  useDeleteUserMutation,
  usePrefetch,
} from '../../redux/feature/users/usersApi';
import type { UserVendorProfile } from '../../redux/feature/users/usersType';

export interface UserAccount {
  id: string | number;
  name: string;
  email: string;
  avatar?: string;
  avatarBg?: string;
  phone?: string;
  role: 'Customer' | 'Vendor' | 'Admin' | string;
  lastLogin: string;
  status: 'Active' | 'Inactive' | 'Suspended' | string;
  joinedDate: string;
  vendorProfile?: UserVendorProfile | null;
  isEmailVerified?: boolean;
}

const AVATAR_COLORS = [
  'bg-teal-600 text-white',
  'bg-sky-600 text-white',
  'bg-indigo-600 text-white',
  'bg-amber-600 text-white',
  'bg-purple-600 text-white',
  'bg-rose-500 text-white',
  'bg-cyan-700 text-white',
];

const formatJoined = (d?: string): string => {
  if (!d) return 'Recent';
  try {
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return d;
    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return d;
  }
};

const formatLastLogin = (d?: string): string => {
  if (!d) return 'Just now';
  try {
    const parsed = new Date(d);
    if (isNaN(parsed.getTime())) return d;
    const diffMs = Date.now() - parsed.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    if (diffMins < 60) return `${Math.max(diffMins, 1)}m ago`;
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours}h ago`;
    return parsed.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return d;
  }
};

export const UserManagement: React.FC = () => {
  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<'All' | 'Customer' | 'Vendor' | 'Admin'>('All');
  const [selectedStatus, setSelectedStatus] = useState<'All' | 'Active' | 'Inactive' | 'Suspended'>('All');

  // Debounce search input to avoid lag and spamming the backend (snappy 250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Background Prefetching hook for instant page transitions
  const prefetchUsers = usePrefetch('getUsers');

  // Query Backend API (GET /api/v1/users)
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch.trim() || undefined,
    role: selectedRole !== 'All' ? selectedRole : undefined,
    status: selectedStatus !== 'All' ? selectedStatus : undefined,
  }), [currentPage, itemsPerPage, debouncedSearch, selectedRole, selectedStatus]);

  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useGetUsersQuery(queryParams);

  const [updateUserStatus, { isLoading: isUpdatingStatus }] = useUpdateUserStatusMutation();
  const [deleteUser, { isLoading: isDeleting }] = useDeleteUserMutation();

  // Modal states
  const [viewingUser, setViewingUser] = useState<UserAccount | null>(null);
  const [actionModal, setActionModal] = useState<{
    type: 'suspend' | 'delete';
    user: UserAccount;
  } | null>(null);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedRole, selectedStatus]);

  const totalFiltered = apiResponse?.data?.meta?.total ?? 0;
  const totalPages = apiResponse?.data?.meta?.totalPages ?? 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Prefetch adjacent pages in the background for 0ms latency navigation
  useEffect(() => {
    if (currentPage < totalPages) {
      prefetchUsers({
        ...queryParams,
        page: currentPage + 1,
      });
    }
    if (currentPage > 1) {
      prefetchUsers({
        ...queryParams,
        page: currentPage - 1,
      });
    }
  }, [currentPage, totalPages, queryParams, prefetchUsers]);

  // Transform server users from database with memoization
  const paginatedUsers: UserAccount[] = useMemo(() => {
    if (!apiResponse?.data?.users) return [];

    return apiResponse.data.users.map((u, idx) => {
      const roleUpper = (u.role || '').toUpperCase();
      const statusUpper = (u.status || '').toUpperCase();

      const roleFormatted =
        roleUpper === 'ADMIN'
          ? 'Admin'
          : roleUpper === 'VENDOR'
          ? 'Vendor'
          : 'Customer';

      const statusFormatted =
        statusUpper === 'INACTIVE'
          ? 'Inactive'
          : statusUpper === 'SUSPENDED'
          ? 'Suspended'
          : 'Active';

      return {
        id: u.id,
        name: u.name,
        email: u.email,
        phone: u.phone || u.vendorProfile?.businessPhone || undefined,
        role: roleFormatted,
        status: statusFormatted,
        joinedDate: formatJoined(u.joinedDate || u.createdAt),
        lastLogin: formatLastLogin(u.lastLogin || u.updatedAt),
        avatar: u.avatar || undefined,
        avatarBg: AVATAR_COLORS[idx % AVATAR_COLORS.length],
        vendorProfile: u.vendorProfile,
        isEmailVerified: u.isEmailVerified,
      };
    });
  }, [apiResponse]);

  // Memoized handlers to keep child components from re-rendering
  const handleViewUser = useCallback((user: UserAccount) => {
    setViewingUser(user);
  }, []);

  const handleOpenActionModal = useCallback((type: 'suspend' | 'delete', user: UserAccount) => {
    setActionModal({ type, user });
  }, []);

  const handleCloseActionModal = useCallback(() => {
    setActionModal(null);
  }, []);

  const handleCloseUserDetails = useCallback(() => {
    setViewingUser(null);
  }, []);

  // Handle modal confirmation
  const handleConfirmAction = useCallback(async () => {
    if (!actionModal) return;

    if (actionModal.type === 'delete') {
      try {
        await deleteUser(actionModal.user.id).unwrap();
        if (viewingUser?.id === actionModal.user.id) setViewingUser(null);
        setActionModal(null);
      } catch (err) {
        console.error('Failed to delete user on server:', err);
      }
    } else if (actionModal.type === 'suspend') {
      try {
        await updateUserStatus({
          id: String(actionModal.user.id),
          status: 'SUSPENDED',
        }).unwrap();

        if (viewingUser?.id === actionModal.user.id) {
          setViewingUser((prev) => (prev ? { ...prev, status: 'Suspended' } : null));
        }
        setActionModal(null);
      } catch (err) {
        console.error('Failed to suspend user on server:', err);
      }
    }
  }, [actionModal, deleteUser, updateUserStatus, viewingUser]);

  const handleReactivate = useCallback(async (userId: string | number) => {
    try {
      await updateUserStatus({
        id: String(userId),
        status: 'ACTIVE',
      }).unwrap();

      if (viewingUser?.id === userId) {
        setViewingUser((prev) => (prev ? { ...prev, status: 'Active' } : null));
      }
    } catch (err) {
      console.error('Failed to reactivate user on server:', err);
    }
  }, [updateUserStatus, viewingUser]);

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
        onViewUser={handleViewUser}
        onOpenActionModal={handleOpenActionModal}
        onReactivate={handleReactivate}
        isLoading={isLoading}
        isFetching={isFetching}
      />

      {/* 5. User Details Modal */}
      <UserDetailsModal
        user={viewingUser}
        onClose={handleCloseUserDetails}
        onReactivate={handleReactivate}
        onOpenActionModal={(type, user) => {
          setViewingUser(null);
          handleOpenActionModal(type, user);
        }}
      />

      {/* 6. Action Confirmation Modal */}
      <UserActionModal
        modalData={actionModal}
        onClose={handleCloseActionModal}
        onConfirm={handleConfirmAction}
        isLoading={isDeleting || isUpdatingStatus}
      />
    </div>
  );
};

export default UserManagement;
