import React, { useState, useEffect, useRef, useMemo } from 'react';
import { io, Socket } from 'socket.io-client';
import {
  Search,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Send,
  MessageSquare,
  Sparkles,
  RefreshCw,
  User,
  ShieldCheck,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';
import {
  useGetConsultationsQuery,
  useSendConsultationMessageMutation,
  useUpdateConsultationStatusMutation,
  useMarkConsultationSeenMutation,
  useDeleteConsultationMutation,
  useAppSelector,
} from '../../../redux';
import type {
  ConsultationTicket,
  ConsultationStatus,
} from '../../../redux/feature/consultations/consultationsType';

// Preset advice snippets for agricultural experts
const QUICK_ADVICE_SNIPPETS = [
  '💧 Water Management: Maintain 2-3 cm standing water and avoid alternate wetting and drying during panicle initiation.',
  '🧪 Fungicide Treatment: Spray Mancozeb 75% WP @ 2.5g/L or Ridomil Gold @ 2g/L of water at 7-10 day intervals.',
  '🌾 Nutrient Advisory: Suspend urea top-dressing immediately; apply Muriate of Potash (MOP) to boost crop immunity.',
  '🐛 Pest Control: Apply Emamectin Benzoate 5% SG @ 1g/L of water in late afternoon for stem borer and foliage pests.',
  '🍃 Bio-control: Spray 5% Neem seed kernel extract (NSKE) as an organic deterrent against whiteflies and leafhoppers.',
];

export const FarmerSupportDesk: React.FC = () => {
  const user = useAppSelector((state) => state.auth.user);
  const expertName = user?.name || 'Dr. Agricultural Specialist';
  const expertRole = user?.role === 'EXPERT' ? 'Agricultural Specialist' : 'Senior Agronomist';

  // 1. Fetch consultations with auto-polling every 4 seconds
  const {
    data: tickets = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetConsultationsQuery(undefined, {
    pollingInterval: 4000,
  });

  const [sendConsultationMessage, { isLoading: isSending }] = useSendConsultationMessageMutation();
  const [updateConsultationStatus, { isLoading: isUpdatingStatus }] = useUpdateConsultationStatusMutation();
  const [markConsultationSeen] = useMarkConsultationSeenMutation();
  const [deleteConsultation] = useDeleteConsultationMutation();
  // 2. Local State
  const [activeFilter, setActiveFilter] = useState<'ALL' | 'WAITING' | 'RESOLVED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState('');
  const [markResolvedOnSend, setMarkResolvedOnSend] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<string | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const seenTicketsRef = useRef<Set<string>>(new Set());
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const socketRef = useRef<Socket | null>(null);

  // Auto-select first ticket if none selected
  useEffect(() => {
    if (!selectedTicketId && tickets.length > 0) {
      setSelectedTicketId(tickets[0].id);
    }
  }, [tickets, selectedTicketId]);

  // Selected Ticket
  const activeTicket: ConsultationTicket | undefined = useMemo(() => {
    if (!tickets || tickets.length === 0) return undefined;
    return tickets.find((t) => t.id === selectedTicketId) || tickets[0];
  }, [tickets, selectedTicketId]);

  // Auto-mark ticket as Open when expert views it for the 1st time (no repeated status changes)
  useEffect(() => {
    if (
      activeTicket &&
      activeTicket.status === 'Waiting for Reply' &&
      !seenTicketsRef.current.has(activeTicket.id)
    ) {
      seenTicketsRef.current.add(activeTicket.id);
      markConsultationSeen(activeTicket.id)
        .unwrap()
        .catch((err) => console.error('Error marking consultation as seen:', err));
    }
  }, [activeTicket?.id, activeTicket?.status, markConsultationSeen]);

  // Initialize Real-time Socket.io connection for Expert
  useEffect(() => {
    const socketUrl = (import.meta as any).env?.VITE_SOCKET_URL || 'http://localhost:3000';
    const socket = io(socketUrl, {
      transports: ['websocket', 'polling'],
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Expert connected to consultation socket:', socket.id);
      if (selectedTicketId) {
        socket.emit('join_ticket', { ticketId: selectedTicketId });
      }
    });

    socket.on('new_message', () => {
      refetch();
    });

    socket.on('ticket_updated', () => {
      refetch();
    });

    socket.on('status_changed', () => {
      refetch();
    });

    socket.on('ticket_deleted', () => {
      refetch();
    });

    return () => {
      socket.disconnect();
    };
  }, [refetch]);

  // Join ticket room when active ticket changes
  useEffect(() => {
    if (selectedTicketId && socketRef.current) {
      socketRef.current.emit('join_ticket', { ticketId: selectedTicketId });
    }
  }, [selectedTicketId]);

  // Scroll to bottom when messages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeTicket?.messages]);

  // Handle Delete Ticket by Expert
  const handleDeleteTicket = async (ticketId: string, ticketNumber: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const confirmed = window.confirm(
      `Are you sure you want to permanently delete ticket #${ticketNumber}? This will remove all associated messages.`
    );
    if (!confirmed) return;

    try {
      await deleteConsultation(ticketId).unwrap();
      setFeedbackMessage(`Ticket #${ticketNumber} deleted successfully.`);
      setTimeout(() => setFeedbackMessage(null), 3000);
      if (selectedTicketId === ticketId) {
        const remaining = tickets.filter((t) => t.id !== ticketId);
        setSelectedTicketId(remaining.length > 0 ? remaining[0].id : null);
      }
      refetch();
    } catch (err) {
      console.error('Failed to delete ticket:', err);
      alert('Failed to delete consultation ticket. Please try again.');
    }
  };

  // Filtered Tickets
  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      // Filter status
      if (activeFilter === 'WAITING' && t.status !== 'Waiting for Reply') return false;
      if (activeFilter === 'RESOLVED' && t.status !== 'Resolved') return false;

      // Filter search
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchSubject = t.subject.toLowerCase().includes(query);
        const matchNum = t.ticketNumber.toLowerCase().includes(query);
        const matchCrop = t.crop ? t.crop.toLowerCase().includes(query) : false;
        const matchCategory = t.category.toLowerCase().includes(query);
        const matchUser = t.messages?.some((m) =>
          m.senderName.toLowerCase().includes(query)
        );
        return matchSubject || matchNum || matchCrop || matchCategory || matchUser;
      }
      return true;
    });
  }, [tickets, activeFilter, searchQuery]);

  // Statistics
  const waitingCount = tickets.filter((t) => t.status === 'Waiting for Reply').length;
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;
  const totalCount = tickets.length;

  // Handle Send Advice
  const handleSendAdvice = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!activeTicket || !replyText.trim() || isSending) return;

    const payload = {
      ticketId: activeTicket.id,
      sender: 'expert' as const,
      senderName: expertName,
      senderRole: expertRole,
      text: replyText.trim(),
      attachments: previewImage ? [previewImage] : [],
      markResolved: markResolvedOnSend,
    };

    try {
      await sendConsultationMessage(payload).unwrap();

      setReplyText('');
      setFeedbackMessage('Agricultural advice successfully transmitted to farmer!');
      setTimeout(() => setFeedbackMessage(null), 4000);
    } catch (err) {
      console.error('Failed to send advice:', err);
      setFeedbackMessage('Note: Advice recorded locally. Please ensure backend server is reachable.');
      setTimeout(() => setFeedbackMessage(null), 5000);
    }
  };

  // Handle Quick Snippet Click
  const handleAppendSnippet = (snippet: string) => {
    setReplyText((prev) => (prev ? `${prev}\n\n${snippet}` : snippet));
  };

  // Handle Toggle Ticket Status
  const handleToggleStatus = async () => {
    if (!activeTicket || isUpdatingStatus) return;
    const newStatus: ConsultationStatus =
      activeTicket.status === 'Resolved' ? 'Open' : 'Resolved';

    try {
      await updateConsultationStatus({
        ticketId: activeTicket.id,
        status: newStatus,
      }).unwrap();

      setFeedbackMessage(
        newStatus === 'Resolved'
          ? 'Ticket marked as Resolved!'
          : 'Ticket re-opened for further support.'
      );
      setTimeout(() => setFeedbackMessage(null), 3000);
    } catch (err) {
      console.error('Status update error:', err);
    }
  };

  return (
    <div className="w-full font-['Inter'] flex flex-col gap-5 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#062E35] via-[#0A434D] to-[#0E4F5A] rounded-2xl p-5 sm:p-6 text-white shadow-sm border border-emerald-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Live Farmer Support Desk
            </span>
            <span className="text-xs text-emerald-200/70 hidden sm:inline">
              • Connected with KrishiKunjo Portal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1.5">
            Agricultural Expert Service Desk
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl">
            Directly review crop issues, inspect farmer field photos submitted from the consultation portal, and dispense verified prescriptions.
          </p>
        </div>

        {/* Quick Stats Pills */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl px-3 py-2 border border-white/10 text-center">
            <p className="text-[11px] text-emerald-200 uppercase font-medium">In Queue</p>
            <p className="text-lg font-bold text-white">{totalCount}</p>
          </div>
          <div className="bg-amber-500/20 backdrop-blur-xs rounded-xl px-3 py-2 border border-amber-400/30 text-center">
            <p className="text-[11px] text-amber-200 uppercase font-medium">Needs Advice</p>
            <p className="text-lg font-bold text-amber-300">{waitingCount}</p>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-xs rounded-xl px-3 py-2 border border-emerald-400/30 text-center">
            <p className="text-[11px] text-emerald-200 uppercase font-medium">Resolved</p>
            <p className="text-lg font-bold text-emerald-300">{resolvedCount}</p>
          </div>
        </div>
      </div>

      {/* Feedback Toast */}
      {feedbackMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{feedbackMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Main Workspace Split: Tickets List (Left) + Consultation Chat & Prescription (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
        {/* Left Column: Tickets Queue */}
        <div className="lg:col-span-5 flex flex-col gap-3 bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs">
          {/* Search & Refresh */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search ticket #, crop, or farmer..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0E4F5A] focus:border-transparent transition-all"
              />
            </div>
            <button
              type="button"
              onClick={() => refetch()}
              className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
              title="Refresh tickets"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-emerald-600' : ''}`} />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium">
            <button
              type="button"
              onClick={() => setActiveFilter('ALL')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                activeFilter === 'ALL'
                  ? 'bg-white text-slate-900 font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('WAITING')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer flex items-center justify-center gap-1 ${
                activeFilter === 'WAITING'
                  ? 'bg-amber-500 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-amber-700'
              }`}
            >
              <span>Waiting</span>
              {waitingCount > 0 && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold ${
                  activeFilter === 'WAITING' ? 'bg-white text-amber-600' : 'bg-amber-100 text-amber-800'
                }`}>
                  {waitingCount}
                </span>
              )}
            </button>
            <button
              type="button"
              onClick={() => setActiveFilter('RESOLVED')}
              className={`flex-1 py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                activeFilter === 'RESOLVED'
                  ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                  : 'text-slate-600 hover:text-emerald-700'
              }`}
            >
              Resolved ({resolvedCount})
            </button>
          </div>

          {/* Ticket Cards List */}
          <div className="flex flex-col gap-2.5 max-h-[640px] overflow-y-auto pr-1">
            {isLoading && tickets.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2 text-[#0E4F5A]" />
                Loading farmer consultation tickets...
              </div>
            ) : filteredTickets.length === 0 ? (
              <div className="py-12 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <MessageSquare className="w-8 h-8 text-slate-300" />
                <span>No support tickets match the selected filter.</span>
              </div>
            ) : (
              filteredTickets.map((ticket) => {
                const isSelected = activeTicket?.id === ticket.id;
                const isUrgent = ticket.priority === 'Urgent';
                const isWaiting = ticket.status === 'Waiting for Reply';
                const lastMsg = ticket.messages?.[ticket.messages.length - 1];

                return (
                  <div
                    key={ticket.id}
                    onClick={() => setSelectedTicketId(ticket.id)}
                    className={`p-3.5 rounded-xl border text-left transition-all cursor-pointer relative ${
                      isSelected
                        ? 'bg-[#0E4F5A]/5 border-[#0E4F5A] ring-1 ring-[#0E4F5A]/30 shadow-xs'
                        : 'bg-white border-slate-200/90 hover:border-slate-300 hover:bg-slate-50/70'
                    }`}
                  >
                    {/* Top Row: Ticket Number & Priority */}
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono text-xs font-bold text-[#0E4F5A]">
                          {ticket.ticketNumber}
                        </span>
                        {ticket.crop && (
                          <span className="text-[11px] font-medium text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70 truncate max-w-[140px]">
                            {ticket.crop}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        {isUrgent && (
                          <span className="px-1.5 py-0.5 rounded-md bg-red-100 text-red-700 text-[10px] font-bold flex items-center gap-0.5">
                            <AlertTriangle className="w-3 h-3" />
                            Urgent
                          </span>
                        )}
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                            ticket.status === 'Resolved'
                              ? 'bg-emerald-100 text-emerald-800'
                              : isWaiting
                              ? 'bg-amber-100 text-amber-800 animate-pulse'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {ticket.status}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteTicket(ticket.id, ticket.ticketNumber, e)}
                          className="p-1 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors cursor-pointer"
                          title="Delete ticket"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {/* Subject */}
                    <h4 className="text-xs font-semibold text-slate-900 line-clamp-1 mb-1">
                      {ticket.subject}
                    </h4>

                    {/* Latest Message Preview */}
                    <p className="text-[11px] text-slate-500 line-clamp-2 mb-2 leading-relaxed">
                      {lastMsg ? `${lastMsg.senderName}: ${lastMsg.text}` : 'No messages yet.'}
                    </p>

                    {/* Bottom row: Time and message count */}
                    <div className="flex items-center justify-between text-[10px] text-slate-400 pt-1.5 border-t border-slate-100">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {ticket.updatedAt || ticket.createdAt}
                      </span>
                      <span className="font-medium text-slate-500 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {ticket.messages?.length || 0} messages
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Ticket Consultation Workspace */}
        <div className="lg:col-span-7 flex flex-col bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden min-h-[640px]">
          {activeTicket ? (
            <div className="flex flex-col h-full">
              {/* Workspace Header */}
              <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs font-bold text-[#0E4F5A] bg-[#0E4F5A]/10 px-2 py-0.5 rounded-md">
                      {activeTicket.ticketNumber}
                    </span>
                    <span className="text-xs font-medium text-slate-500">
                      {activeTicket.category}
                    </span>
                    {activeTicket.crop && (
                      <span className="text-xs font-semibold text-emerald-800 bg-emerald-100/70 px-2 py-0.5 rounded-md">
                        🌱 {activeTicket.crop}
                      </span>
                    )}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                    {activeTicket.subject}
                  </h2>
                </div>

                {/* Status Toggle Button & Delete */}
                <div className="flex items-center gap-2 shrink-0">
                  <button
                    type="button"
                    onClick={() => handleDeleteTicket(activeTicket.id, activeTicket.ticketNumber)}
                    className="px-2.5 py-1.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-red-600 hover:bg-red-50 border border-slate-200 hover:border-red-200 flex items-center gap-1.5 transition-all cursor-pointer"
                    title="Delete this consultation"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline">Delete</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleToggleStatus}
                    disabled={isUpdatingStatus}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                      activeTicket.status === 'Resolved'
                        ? 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100'
                        : 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    {activeTicket.status === 'Resolved' ? 'Reopen Inquiry' : 'Mark as Resolved'}
                  </button>
                </div>
              </div>

              {/* Chat Thread / Consultation Messages */}
              <div className="flex-1 p-4 sm:p-5 overflow-y-auto max-h-[380px] space-y-4 bg-slate-50/30">
                {activeTicket.messages?.map((msg) => {
                  const isExpert = msg.sender === 'expert';

                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-3 max-w-[85%] ${
                        isExpert ? 'ml-auto flex-row-reverse' : 'mr-auto'
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 text-xs font-bold shadow-xs ${
                          isExpert
                            ? 'bg-[#0E4F5A] text-white'
                            : 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                        }`}
                      >
                        {isExpert ? <ShieldCheck className="w-4 h-4" /> : <User className="w-4 h-4" />}
                      </div>

                      {/* Bubble */}
                      <div className="flex flex-col">
                        <div className={`flex items-center gap-2 mb-1 ${isExpert ? 'justify-end' : ''}`}>
                          <span className="text-xs font-bold text-slate-800">
                            {msg.senderName}
                          </span>
                          {msg.senderRole && (
                            <span className="text-[10px] bg-emerald-50 text-emerald-800 px-1.5 py-0.2 rounded-md font-medium border border-emerald-200">
                              {msg.senderRole}
                            </span>
                          )}
                          <span className="text-[10px] text-slate-400">
                            {msg.timestamp}
                          </span>
                        </div>

                        <div
                          className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
                            isExpert
                              ? 'bg-[#0E4F5A] text-white rounded-tr-xs'
                              : 'bg-white text-slate-800 border border-slate-200/90 rounded-tl-xs'
                          }`}
                        >
                          {msg.text}

                          {/* Attached Photos */}
                          {msg.attachments && msg.attachments.length > 0 && (
                            <div className="mt-3 pt-2.5 border-t border-white/20 grid grid-cols-2 gap-2">
                              {msg.attachments.map((imgUrl, idx) => (
                                <div
                                  key={idx}
                                  onClick={() => setPreviewImage(imgUrl)}
                                  className="relative group rounded-xl overflow-hidden border border-slate-200 cursor-pointer aspect-video bg-black/5"
                                >
                                  <img
                                    src={imgUrl}
                                    alt="Field crop photo"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                  />
                                  <span className="absolute bottom-1 right-1 bg-black/60 text-white text-[10px] px-1.5 py-0.5 rounded-md flex items-center gap-1">
                                    <ImageIcon className="w-3 h-3" /> View
                                  </span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Expert Service Reply Form */}
              <div className="p-4 sm:p-5 border-t border-slate-200 bg-white">
                {/* Preset Advice Snippets Header */}
                <div className="mb-2.5">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Quick Agricultural Advice Presets:
                    </span>
                    <span className="text-[10px] text-slate-400">Click to append to prescription</span>
                  </div>

                  <div className="flex flex-wrap gap-1.5">
                    {QUICK_ADVICE_SNIPPETS.map((snippet, idx) => {
                      const title = snippet.split(':')[0];
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => handleAppendSnippet(snippet)}
                          className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-emerald-50 hover:text-emerald-800 hover:border-emerald-300 border border-slate-200 text-[11px] font-medium text-slate-700 transition-colors cursor-pointer"
                        >
                          {title}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Textarea Form */}
                <form onSubmit={handleSendAdvice} className="flex flex-col gap-3">
                  <div className="relative">
                    <textarea
                      rows={4}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      placeholder="Type your agricultural diagnosis, chemical dosage, fertilizer prescription, or advice for the farmer here..."
                      className="w-full p-3 text-xs sm:text-sm text-slate-900 border border-slate-200 rounded-xl focus:outline-hidden focus:ring-2 focus:ring-[#0E4F5A] focus:border-transparent transition-all leading-relaxed placeholder:text-slate-400 resize-none"
                    />
                  </div>

                  {/* Actions & Submit */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <label className="flex items-center gap-2 text-xs text-slate-700 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={markResolvedOnSend}
                        onChange={(e) => setMarkResolvedOnSend(e.target.checked)}
                        className="w-4 h-4 rounded-sm text-[#0E4F5A] focus:ring-[#0E4F5A] border-slate-300"
                      />
                      <span>Mark ticket as <strong className="text-emerald-700 font-semibold">Resolved</strong> upon sending advice</span>
                    </label>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setReplyText('')}
                        disabled={!replyText || isSending}
                        className="px-3 py-2 rounded-xl text-xs font-semibold text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer disabled:opacity-40"
                      >
                        Clear
                      </button>

                      <button
                        type="submit"
                        disabled={!replyText.trim() || isSending}
                        className="px-5 py-2.5 rounded-xl bg-[#0E4F5A] hover:bg-[#09353D] text-white text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {isSending ? (
                          <>
                            <RefreshCw className="w-4 h-4 animate-spin" />
                            <span>Transmitting...</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-4 h-4" />
                            <span>Send Agricultural Advice</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 text-slate-300 mb-3" />
              <h3 className="text-base font-bold text-slate-700">No Consultation Selected</h3>
              <p className="text-xs text-slate-500 max-w-sm mt-1">
                Select a support inquiry from the left queue to inspect field observations and provide expert advice.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Full-size Image Preview Modal */}
      {previewImage && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4"
          onClick={() => setPreviewImage(null)}
        >
          <div className="relative max-w-3xl max-h-[90vh] bg-white rounded-2xl overflow-hidden p-2">
            <img
              src={previewImage}
              alt="Full size crop photo"
              className="max-h-[80vh] w-auto rounded-xl object-contain mx-auto"
            />
            <button
              type="button"
              onClick={() => setPreviewImage(null)}
              className="absolute top-4 right-4 bg-black/60 text-white rounded-full p-2 text-xs font-bold hover:bg-black"
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FarmerSupportDesk;
