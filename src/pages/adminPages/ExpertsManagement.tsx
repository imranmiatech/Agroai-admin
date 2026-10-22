import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  GraduationCap, 
  CheckCircle2, 
  Trash2 
} from 'lucide-react';
import {
  EXPERT_SPECIALIZATIONS,
  ExpertMetricsGrid,
  ExpertFilters,
  ExpertTable,
  ExpertCardGrid,
  AddExpertModal,
  ExpertDetailsModal,
  type ExpertItem,
  type CreateExpertPayload,
} from '../../components/adminComponents/experts';
import {
  useGetExpertsQuery,
  useGetExpertMetricsQuery,
  useCreateExpertMutation,
  useUpdateExpertStatusMutation,
  useDeleteExpertMutation,
} from '../../redux';

export const ExpertsManagement: React.FC = () => {
  const [search, setSearch] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [viewMode, setViewMode] = useState<'table' | 'grid'>('table');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // RTK Query API Hooks (100% database driven)
  const { data: expertsResponse, isLoading: isFetching } = useGetExpertsQuery({
    search: search.trim() || undefined,
    specialization: selectedSpecialization !== 'All' ? selectedSpecialization : undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
  });

  const { data: metricsResponse } = useGetExpertMetricsQuery();

  const [createExpert, { isLoading: isCreating }] = useCreateExpertMutation();
  const [updateStatus] = useUpdateExpertStatusMutation();
  const [deleteExpert, { isLoading: isDeleting }] = useDeleteExpertMutation();

  // Modals state
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [viewingExpert, setViewingExpert] = useState<ExpertItem | null>(null);
  const [expertToDelete, setExpertToDelete] = useState<ExpertItem | null>(null);

  // Database-driven experts list
  const experts: ExpertItem[] = useMemo(() => {
    return expertsResponse?.data?.data || [];
  }, [expertsResponse]);

  // Dynamically extract all available specializations from records + standard list
  const availableSpecializations = useMemo(() => {
    const fromRecords = experts.map((e) => e.specialization).filter(Boolean);
    return Array.from(new Set([...(EXPERT_SPECIALIZATIONS as unknown as string[]), ...fromRecords]));
  }, [experts]);

  // Fast client-side fallback filter
  const filteredExperts = useMemo(() => {
    return experts.filter((e) => {
      const matchesSearch =
        !search.trim() ||
        e.name.toLowerCase().includes(search.toLowerCase()) ||
        e.email.toLowerCase().includes(search.toLowerCase()) ||
        (e.phone && e.phone.toLowerCase().includes(search.toLowerCase())) ||
        e.specialization.toLowerCase().includes(search.toLowerCase());

      const matchesSpec =
        selectedSpecialization === 'All' ||
        e.specialization.toLowerCase() === selectedSpecialization.toLowerCase();

      const matchesStatus =
        statusFilter === 'All' ||
        e.status.toUpperCase() === statusFilter.toUpperCase();

      return matchesSearch && matchesSpec && matchesStatus;
    });
  }, [experts, search, selectedSpecialization, statusFilter]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Handlers for UI actions connected to backend API
  const handleCreateExpert = async (payload: CreateExpertPayload) => {
    try {
      await createExpert(payload).unwrap();
      setIsAddModalOpen(false);
      showToast(`Expert account created for ${payload.name}!`);
    } catch (err: any) {
      showToast(err?.data?.message || err?.message || 'Failed to create expert account');
    }
  };

  const handleToggleStatus = async (expert: ExpertItem) => {
    const nextStatus: 'ACTIVE' | 'SUSPENDED' =
      expert.status.toUpperCase() === 'ACTIVE' ? 'SUSPENDED' : 'ACTIVE';

    try {
      await updateStatus({ id: expert.id, status: nextStatus }).unwrap();
      showToast(`Expert status updated to ${nextStatus === 'ACTIVE' ? 'Active' : 'Suspended'}`);

      if (viewingExpert && viewingExpert.id === expert.id) {
        setViewingExpert({ ...viewingExpert, status: nextStatus });
      }
    } catch (err: any) {
      showToast(err?.data?.message || err?.message || 'Failed to update expert status');
    }
  };

  const handleConfirmDelete = async () => {
    if (!expertToDelete) return;
    try {
      await deleteExpert(expertToDelete.id).unwrap();
      showToast(`Expert ${expertToDelete.name} removed successfully.`);
      setExpertToDelete(null);
    } catch (err: any) {
      showToast(err?.data?.message || err?.message || 'Failed to remove expert');
    }
  };

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-20 max-w-full mx-auto animate-in fade-in duration-150">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#062E35] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with Title & Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#E2ECEE] text-[#062E35] flex items-center justify-center shrink-0">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
                Agri Experts & Support Advisors
              </h1>
              <p className="text-xs text-slate-500 mt-0.5">
                Admin creates certified experts who log in with credentials to deliver support services to farmers
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
          <span className="text-xs font-semibold px-3.5 py-1.5 rounded-full bg-slate-100 text-slate-600">
            {filteredExperts.length} {filteredExperts.length === 1 ? 'Expert' : 'Experts'}
          </span>

          <button
            type="button"
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-98"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Expert</span>
          </button>
        </div>
      </div>

      {/* 2. Metrics Cards */}
      <ExpertMetricsGrid experts={experts} metrics={metricsResponse?.data} />

      {/* 3. Filter & Search Bar */}
      <ExpertFilters
        search={search}
        setSearch={setSearch}
        selectedSpecialization={selectedSpecialization}
        setSelectedSpecialization={setSelectedSpecialization}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        viewMode={viewMode}
        setViewMode={setViewMode}
        availableSpecializations={availableSpecializations}
      />

      {/* 4. Expert List (Table or Grid View) */}
      {viewMode === 'table' ? (
        <ExpertTable
          experts={filteredExperts}
          isLoading={isFetching}
          onView={(exp) => setViewingExpert(exp)}
          onToggleStatus={handleToggleStatus}
          onDelete={(exp) => setExpertToDelete(exp)}
        />
      ) : (
        <ExpertCardGrid
          experts={filteredExperts}
          isLoading={isFetching}
          onView={(exp) => setViewingExpert(exp)}
          onToggleStatus={handleToggleStatus}
          onDelete={(exp) => setExpertToDelete(exp)}
        />
      )}

      {/* 5. Add Expert Modal / Form */}
      <AddExpertModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleCreateExpert}
        isLoading={isCreating}
      />

      {/* 6. View Details Modal */}
      <ExpertDetailsModal
        expert={viewingExpert}
        onClose={() => setViewingExpert(null)}
        onToggleStatus={handleToggleStatus}
      />

      {/* 7. Delete Confirmation Modal */}
      {expertToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-[#FEE4E2] flex items-center justify-center mb-5 shrink-0">
              <Trash2 className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              Remove Expert?
            </h3>

            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              Are you sure you want to remove <strong className="text-slate-800">"{expertToDelete.name}"</strong> from the expert support system?
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setExpertToDelete(null)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95 bg-[#B42318] disabled:opacity-50"
              >
                {isDeleting ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
