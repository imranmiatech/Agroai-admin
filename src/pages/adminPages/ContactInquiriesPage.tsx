import React, { useState, useMemo } from 'react';
import {
  Mail,
  Clock,
  CheckCircle2,
  Search,
  Trash2,
  Send,
  Phone,
  Calendar,
  RefreshCw,
  X,
  Sparkles
} from 'lucide-react';
import {
  useGetContactInquiriesQuery,
  useGetContactMetricsQuery,
  useUpdateContactStatusMutation,
  useDeleteContactInquiryMutation,
  type ContactInquiryItem,
  type ContactStatus,
} from '../../redux';

export const ContactInquiriesPage: React.FC = () => {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState<'All' | ContactStatus>('All');
  const [selectedInquiry, setSelectedInquiry] = useState<ContactInquiryItem | null>(null);
  const [replyText, setReplyText] = useState('');
  const [modalStatus, setModalStatus] = useState<ContactStatus>('RESOLVED');
  const [inquiryToDelete, setInquiryToDelete] = useState<ContactInquiryItem | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // RTK Query hooks
  const { data: inquiriesResponse, isLoading: isFetching, refetch } = useGetContactInquiriesQuery({
    search: search.trim() || undefined,
    status: statusFilter !== 'All' ? statusFilter : undefined,
  });

  const { data: metricsResponse } = useGetContactMetricsQuery();
  const [updateStatus, { isLoading: isUpdating }] = useUpdateContactStatusMutation();
  const [deleteInquiry, { isLoading: isDeleting }] = useDeleteContactInquiryMutation();

  const inquiries = useMemo(() => {
    return inquiriesResponse?.data?.data || [];
  }, [inquiriesResponse]);

  const metrics = metricsResponse?.data || {
    totalInquiries: 0,
    pendingCount: 0,
    inProgressCount: 0,
    resolvedCount: 0,
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  const handleOpenModal = (inquiry: ContactInquiryItem) => {
    setSelectedInquiry(inquiry);
    setReplyText(inquiry.replyMessage || '');
    setModalStatus(inquiry.status === 'PENDING' ? 'RESOLVED' : inquiry.status);
  };

  const handleSaveResolution = async () => {
    if (!selectedInquiry) return;
    try {
      await updateStatus({
        id: selectedInquiry.id,
        status: modalStatus,
        replyMessage: replyText.trim() || undefined,
      }).unwrap();

      showToast(
        modalStatus === 'RESOLVED' || replyText.trim()
          ? `Status updated to ${modalStatus} and notification email sent to ${selectedInquiry.email}!`
          : `Inquiry status updated to ${modalStatus}`
      );
      setSelectedInquiry(null);
    } catch (err: any) {
      showToast(err?.data?.message || err?.message || 'Failed to update inquiry status');
    }
  };


  const handleConfirmDelete = async () => {
    if (!inquiryToDelete) return;
    try {
      await deleteInquiry(inquiryToDelete.id).unwrap();
      showToast(`Inquiry from ${inquiryToDelete.name} deleted successfully.`);
      setInquiryToDelete(null);
    } catch (err: any) {
      showToast(err?.data?.message || err?.message || 'Failed to delete inquiry');
    }
  };

  const getStatusBadge = (status: ContactStatus) => {
    switch (status) {
      case 'PENDING':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Pending Review</span>
          </span>
        );
      case 'IN_PROGRESS':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-sky-50 text-sky-700 border border-sky-200">
            <RefreshCw className="w-3.5 h-3.5" />
            <span>In Progress</span>
          </span>
        );
      case 'RESOLVED':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Resolved</span>
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-20 max-w-full mx-auto animate-in fade-in duration-150">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#062E35] text-white px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200 border border-white/10">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Page Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-[#E2ECEE] text-[#062E35] flex items-center justify-center shrink-0 shadow-xs">
            <Mail className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              Contact Inquiries & Support Messages
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              Review inquiries from website contact page, respond to farmers, and trigger email resolutions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-slate-100 text-slate-600">
            {inquiries.length} {inquiries.length === 1 ? 'Message' : 'Messages'}
          </span>
          <button
            type="button"
            onClick={() => refetch()}
            className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
            title="Refresh list"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Inquiries */}
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Inquiries</span>
            <div className="w-10 h-10 rounded-xl bg-[#E2ECEE] text-[#062E35] flex items-center justify-center">
              <Mail className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-slate-900 tracking-tight">{metrics.totalInquiries}</h3>
            <p className="text-xs text-slate-400 font-medium mt-1">Submitted from contact page</p>
          </div>
        </div>

        {/* Pending Review */}
        <div className="bg-white rounded-2xl p-5 border border-amber-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider">Awaiting Review</span>
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-amber-900 tracking-tight">{metrics.pendingCount}</h3>
            <p className="text-xs text-amber-600 font-medium mt-1">Needs admin response</p>
          </div>
        </div>

        {/* In Progress */}
        <div className="bg-white rounded-2xl p-5 border border-sky-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">In Progress</span>
            <div className="w-10 h-10 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center">
              <RefreshCw className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-sky-900 tracking-tight">{metrics.inProgressCount}</h3>
            <p className="text-xs text-sky-600 font-medium mt-1">Currently being handled</p>
          </div>
        </div>

        {/* Resolved */}
        <div className="bg-white rounded-2xl p-5 border border-emerald-200/80 shadow-2xs flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider">Resolved & Answered</span>
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-2xl font-bold text-emerald-900 tracking-tight">{metrics.resolvedCount}</h3>
            <p className="text-xs text-emerald-600 font-medium mt-1">User received resolution email</p>
          </div>
        </div>
      </div>

      {/* 3. Filter & Search Controls */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {(['All', 'PENDING', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
            <button
              key={st}
              type="button"
              onClick={() => setStatusFilter(st)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer shrink-0 ${
                statusFilter === st
                  ? 'bg-[#062E35] text-white shadow-xs'
                  : 'text-slate-600 hover:bg-slate-100'
              }`}
            >
              {st === 'All' ? 'All Inquiries' : st === 'PENDING' ? 'Pending' : st === 'IN_PROGRESS' ? 'In Progress' : 'Resolved'}
            </button>
          ))}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px] sm:min-w-[280px]">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search by name, email, topic..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3.5 py-2 rounded-xl border border-slate-200 text-xs font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#062E35] transition-colors"
          />
        </div>
      </div>

      {/* 4. Inquiries List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        {isFetching ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <RefreshCw className="w-8 h-8 text-slate-400 animate-spin mb-3" />
            <p className="text-sm font-medium text-slate-500">Loading contact inquiries from database...</p>
          </div>
        ) : inquiries.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center justify-center">
            <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 mb-3">
              <Mail className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-slate-800">No Inquiries Found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm">
              {search || statusFilter !== 'All'
                ? 'Try adjusting your search query or status filter to see other messages.'
                : 'There are currently no contact submissions from the public website.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/75 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                  <th className="py-3.5 px-5">Sender</th>
                  <th className="py-3.5 px-4">Subject & Message</th>
                  <th className="py-3.5 px-4">Submitted Date</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs">
                {inquiries.map((inquiry) => (
                  <tr key={inquiry.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Sender Info */}
                    <td className="py-4 px-5">
                      <div className="flex flex-col">
                        <span className="font-bold text-slate-900 text-sm">{inquiry.name}</span>
                        <span className="text-slate-500 mt-0.5">{inquiry.email}</span>
                        {inquiry.phone && (
                          <span className="text-slate-400 text-[11px] mt-0.5 flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {inquiry.phone}
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Subject & Message */}
                    <td className="py-4 px-4 max-w-md">
                      <div className="flex flex-col gap-1">
                        <span className="inline-block w-fit px-2.5 py-0.5 rounded-md bg-slate-100 text-[11px] font-semibold text-slate-700">
                          {inquiry.subject || 'General Inquiry'}
                        </span>
                        <p className="text-slate-600 line-clamp-2 leading-relaxed">
                          "{inquiry.message}"
                        </p>
                        {inquiry.replyMessage && (
                          <span className="text-[11px] text-emerald-700 font-medium mt-1 flex items-center gap-1">
                            <CheckCircle2 className="w-3 h-3" />
                            Resolution reply sent
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 whitespace-nowrap text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>
                          {new Date(inquiry.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                      <span className="text-[11px] text-slate-400 block mt-0.5">
                        {new Date(inquiry.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      {getStatusBadge(inquiry.status)}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-5 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => handleOpenModal(inquiry)}
                          className="px-3.5 py-1.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                        >
                          View & Reply
                        </button>

                        <button
                          type="button"
                          onClick={() => setInquiryToDelete(inquiry)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                          title="Delete inquiry"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. View & Resolution Modal */}
      {selectedInquiry && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-xl w-full shadow-2xl flex flex-col gap-5 animate-in zoom-in-95 duration-150 max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E2ECEE] text-[#062E35] flex items-center justify-center shrink-0">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 leading-tight">
                    Inquiry Details & Resolution
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Update status and reply directly to the customer via automated email
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Sender Overview Card */}
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200/80 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Sender Name</span>
                <p className="text-slate-900 font-semibold mt-0.5 text-sm">{selectedInquiry.name}</p>
              </div>
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Email Address</span>
                <p className="text-slate-900 font-semibold mt-0.5 text-sm">{selectedInquiry.email}</p>
              </div>
              {selectedInquiry.phone && (
                <div>
                  <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Phone</span>
                  <p className="text-slate-800 font-medium mt-0.5">{selectedInquiry.phone}</p>
                </div>
              )}
              <div>
                <span className="text-slate-400 uppercase text-[10px] font-bold tracking-wider">Topic</span>
                <p className="text-slate-800 font-medium mt-0.5">{selectedInquiry.subject || 'General Inquiry'}</p>
              </div>
            </div>

            {/* User Message */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Original Message</span>
              <div className="p-4 rounded-2xl bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed font-normal whitespace-pre-wrap">
                "{selectedInquiry.message}"
              </div>
            </div>

            {/* Status Selector */}
            <div className="flex flex-col gap-2">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Update Moderation Status
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(['PENDING', 'IN_PROGRESS', 'RESOLVED'] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setModalStatus(st)}
                    className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
                      modalStatus === st
                        ? 'bg-[#062E35] text-white border-[#062E35] shadow-xs'
                        : 'border-slate-200 text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {st === 'PENDING' ? 'Pending' : st === 'IN_PROGRESS' ? 'In Progress' : 'Resolved'}
                  </button>
                ))}
              </div>
            </div>

            {/* Resolution Note / Email Reply */}
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Resolution Message & Email Reply</span>
                </label>
                <span className="text-[11px] text-slate-400">Sent to customer's email</span>
              </div>
              <textarea
                rows={4}
                placeholder="Enter details of how this inquiry was addressed. If status is set to Resolved, this note will be emailed to the user..."
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                className="w-full p-3.5 rounded-xl border border-slate-200 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#062E35] transition-colors leading-relaxed"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setSelectedInquiry(null)}
                className="px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSaveResolution}
                disabled={isUpdating}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer disabled:opacity-50"
              >
                {isUpdating ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Saving & Sending Email...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-3.5 h-3.5" />
                    <span>Save & Notify User</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 6. Delete Confirmation Modal */}
      {inquiryToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-[#FEE4E2] flex items-center justify-center mb-5 shrink-0">
              <Trash2 className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              Remove Inquiry?
            </h3>

            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              Are you sure you want to permanently delete the inquiry from{' '}
              <strong className="text-slate-800">"{inquiryToDelete.name}"</strong>?
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setInquiryToDelete(null)}
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
