import { useState } from 'react';
import { BarChart2, UserPlus } from 'lucide-react';
import {
  PartnershipRequestsTable,
  PartnersOverviewView,
  PartnersModals,
} from '../../components/adminComponents/partners';
import {
  useGetPartnerDivisionsQuery,
  useUpdatePartnerStatusMutation,
  type PartnershipRequest,
  type RequestStatus,
  type CategoryItem,
} from '../../redux';

export type { PartnershipRequest, RequestStatus, CategoryItem };

export const VendorsPage = () => {
  // Navigation tabs: Only 'overview' and 'requests'
  const [activeTab, setActiveTab] = useState<'overview' | 'requests'>('requests');

  // Detail Modal state for selected request
  const [selectedRequest, setSelectedRequest] = useState<PartnershipRequest | null>(null);

  // Live dynamic divisions breakdown from database
  const { data: divisionsRes } = useGetPartnerDivisionsQuery();
  const categories: CategoryItem[] = divisionsRes?.data?.divisions || [
    { name: 'Dhaka', count: 0, color: '#059669' },
    { name: 'Chattogram', count: 0, color: '#0EA5E9' },
    { name: 'Rajshahi', count: 0, color: '#F59E0B' },
    { name: 'Khulna', count: 0, color: '#14B8A6' },
    { name: 'Barishal', count: 0, color: '#8B5CF6' },
    { name: 'Sylhet', count: 0, color: '#10B981' },
    { name: 'Rangpur', count: 0, color: '#EC4899' },
    { name: 'Mymensingh', count: 0, color: '#F97316' },
  ];

  // Update status mutation
  const [updatePartnerStatus, { isLoading: isUpdating }] = useUpdatePartnerStatusMutation();

  // Update status handler for detail modal
  const handleUpdateStatus = async (id: string, newStatus: RequestStatus) => {
    try {
      await updatePartnerStatus({ id, status: newStatus }).unwrap();
      if (selectedRequest && selectedRequest.id === id) {
        setSelectedRequest({ ...selectedRequest, status: newStatus });
      }
    } catch (error) {
      console.error('Failed to update status', error);
      throw error;
    }
  };

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-16">
      {/* 1. Page Header (Partners Title & Subtitle) */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            Partners
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage partner businesses and partnership requests across the Krisikunjo platform.
          </p>
        </div>
      </div>

      {/* 2. Top Tab Navigation Capsule (Only Overview & Partnership Requests) */}
      <div className="inline-flex items-center bg-white border border-slate-200/90 rounded-full p-1.5 shadow-2xs self-start gap-1 flex-wrap">
        <button
          type="button"
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'overview'
              ? 'bg-[#062E35] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <BarChart2 className="w-3.5 h-3.5" />
          <span>Overview</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-full text-xs font-semibold flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'requests'
              ? 'bg-[#062E35] text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/60'
          }`}
        >
          <UserPlus className="w-3.5 h-3.5" />
          <span>Partnership Requests</span>
        </button>
      </div>

      {/* VIEW 1: PARTNERSHIP REQUESTS TAB */}
      {activeTab === 'requests' && (
        <PartnershipRequestsTable
          categories={categories}
          onSelectRequest={(req) => setSelectedRequest(req)}
        />
      )}

      {/* VIEW 2: OVERVIEW TAB */}
      {activeTab === 'overview' && (
        <PartnersOverviewView
          onNavigateToRequests={() => setActiveTab('requests')}
        />
      )}

      {/* MODALS */}
      <PartnersModals
        selectedRequest={selectedRequest}
        setSelectedRequest={setSelectedRequest}
        handleUpdateStatus={handleUpdateStatus}
        isUpdating={isUpdating}
      />
    </div>
  );
};
