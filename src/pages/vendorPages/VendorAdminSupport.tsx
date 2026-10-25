import React, { useState, useEffect, useRef } from 'react';
import {
  LifeBuoy,
  Plus,
  Search,
  CheckCircle2,
  AlertCircle,
  Inbox,
  Send,
  X,
  Paperclip,
  MessageSquare,
  ShieldCheck,
  FileText,
  Download
} from 'lucide-react';
import { useAppSelector } from '../../redux/store/hooks';
import {
  vendorAdminSupportService,
  type VendorSupportTicket,
  type TicketCategory,
  type TicketPriority,
  type TicketStatus,
  type SupportAttachment,
  isImageAttachment,
  getAttachmentUrl,
  getAttachmentDisplayName,
  isTicketUnread,
  markTicketAsSeen
} from '../../services/vendorAdminSupportService';

export const VendorAdminSupport: React.FC = () => {
  const { user } = useAppSelector((state) => state.auth);

  // Tickets state
  const [tickets, setTickets] = useState<VendorSupportTicket[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'All' | 'Open' | 'Resolved'>('All');

  // Modal / Drawer state
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<VendorSupportTicket | null>(null);

  // Create form state
  const [newSubject, setNewSubject] = useState('');
  const [newCategory, setNewCategory] = useState<TicketCategory>('Payout & Finance');
  const [newPriority, setNewPriority] = useState<TicketPriority>('Medium');
  const [newMessage, setNewMessage] = useState('');
  const [newAttachment, setNewAttachment] = useState<SupportAttachment | null>(null);

  // Reply drawer state
  const [replyText, setReplyText] = useState('');
  const [replyAttachment, setReplyAttachment] = useState<SupportAttachment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleReplyFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeFormatted =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setReplyAttachment({
        name: file.name,
        url: dataUrl,
        type: isImg ? 'image' : 'file',
        size: sizeFormatted
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleNewTicketFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result as string;
      const sizeFormatted =
        file.size > 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      setNewAttachment({
        name: file.name,
        url: dataUrl,
        type: isImg ? 'image' : 'file',
        size: sizeFormatted
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  // Load and subscribe to real-time updates
  const loadTickets = () => {
    const list = vendorAdminSupportService.getTickets();
    setTickets(list);
    // Keep currently viewed ticket synced if open
    setSelectedTicket((prev) => {
      if (!prev) return null;
      const refreshed = list.find((t) => t.id === prev.id);
      return refreshed
        ? {
            ...refreshed,
            messages: Array.isArray(refreshed.messages) ? refreshed.messages : []
          }
        : prev;
    });
  };

  useEffect(() => {
    loadTickets();
    vendorAdminSupportService.syncFromBackend().then(() => loadTickets());
    const unsubscribe = vendorAdminSupportService.subscribe(() => {
      loadTickets();
    });
    return () => unsubscribe();
  }, []);

  // Join/leave ticket room via socket & mark seen
  useEffect(() => {
    if (selectedTicket?.id) {
      vendorAdminSupportService.joinTicketRoom(selectedTicket.id);
      markTicketAsSeen(selectedTicket.id, 'Vendor');
    }
    return () => {
      if (selectedTicket?.id) {
        vendorAdminSupportService.leaveTicketRoom(selectedTicket.id);
      }
    };
  }, [selectedTicket?.id]);

  // Auto scroll messages to bottom
  useEffect(() => {
    if (selectedTicket) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicket?.id, selectedTicket?.messages?.length]);

  // Filter tickets
  const filteredTickets = tickets.filter((t) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (t.id && t.id.toLowerCase().includes(term)) ||
      (t.subject && t.subject.toLowerCase().includes(term)) ||
      (t.category && t.category.toLowerCase().includes(term)) ||
      (t.fullMessage && t.fullMessage.toLowerCase().includes(term));

    const matchesCategory =
      selectedCategory === 'All' || t.category === selectedCategory;

    const matchesStatus =
      activeTab === 'All' || t.status === activeTab;

    return Boolean(matchesSearch && matchesCategory && matchesStatus);
  });

  // KPI counts
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'Open').length;
    const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  // Handle Create Ticket
  const handleCreateTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubject.trim() || !newMessage.trim()) return;

    const vendorName = user?.name || 'Green Agro Farm Vendor';
    const storeName = user?.vendorProfile?.businessName || 'Green Agro Farm';
    const email = user?.email || 'vendor@krisikunjo.com';
    const phone = user?.phone || '+880 1712-345678';

    const created = await vendorAdminSupportService.createTicket({
      vendorId: user?.id,
      vendorName,
      storeName,
      email,
      phone,
      category: newCategory,
      priority: newPriority,
      subject: newSubject.trim(),
      message: newMessage.trim(),
      attachmentName: newAttachment ? newAttachment.name : undefined,
      attachmentUrl: newAttachment ? newAttachment.url : undefined,
      attachmentType: newAttachment ? newAttachment.type : undefined
    });

    // Reset form
    setNewSubject('');
    setNewMessage('');
    setNewCategory('Payout & Finance');
    setNewPriority('Medium');
    setNewAttachment(null);
    setIsCreateModalOpen(false);

    // Open created ticket discussion immediately
    setSelectedTicket(created);
  };

  // Handle Send Reply as Vendor
  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedTicket) return;
    if (!replyText.trim() && !replyAttachment) return;

    const vendorName = user?.name || selectedTicket.vendorName || 'Vendor';
    const storeName = user?.vendorProfile?.businessName || selectedTicket.storeName || '';
    const author = storeName ? `${vendorName} (${storeName})` : vendorName;

    const updated = await vendorAdminSupportService.addReply(selectedTicket.id, {
      author,
      authorRole: 'Vendor',
      text: replyText.trim(),
      attachmentName: replyAttachment ? replyAttachment.name : undefined,
      attachmentUrl: replyAttachment ? replyAttachment.url : undefined,
      attachmentType: replyAttachment ? replyAttachment.type : undefined
    });

    if (updated) {
      setSelectedTicket(updated);
      setReplyText('');
      setReplyAttachment(null);
    }
  };

  // Handle Mark as Resolved by Vendor
  // toggle handler removed

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case 'Urgent':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-700">Urgent</span>;
      case 'High':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800">High</span>;
      case 'Medium':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">Medium</span>;
      case 'Low':
        return <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700">Low</span>;
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case 'Open':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            Open
          </span>
        );
      case 'Resolved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-600 border border-slate-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
            Resolved
          </span>
        );
    }
  };

  return (
    <div className="p-6 md:p-8 w-full space-y-6 font-['Inter']">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
              Admin Support
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
              Helpdesk
            </span>
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Facing an issue with payouts, product verification, or orders? Create a ticket to the admin team.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#062E35] text-white text-sm font-semibold hover:bg-[#0E4F5A] shadow-xs hover:shadow transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Create Ticket</span>
        </button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Total */}
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
            <Inbox className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-900">{totalCount}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Total Tickets</div>
          </div>
        </div>

        {/* Open */}
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-emerald-600">{openCount}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Open Issues</div>
          </div>
        </div>

    
   

        {/* Resolved */}
        <div className="bg-white rounded-2xl p-4 md:p-5 border border-slate-200/80 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-teal-50 text-teal-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-2xl font-bold text-teal-600">{resolvedCount}</div>
            <div className="text-xs font-medium text-slate-500 mt-0.5">Resolved</div>
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-3">
        <div className="flex flex-1 items-center gap-3 w-full">
          {/* Search Box */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by ticket ID or subject..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-50 border border-slate-200/80 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#062E35]/20 focus:border-[#062E35] transition-all"
            />
          </div>

          {/* Category Dropdown */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="py-2 px-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-[#062E35]/20 cursor-pointer shrink-0"
          >
            <option value="All">All Categories</option>
            <option value="Payout & Finance">Payout & Finance</option>
            <option value="Product Approval">Product Approval</option>
            <option value="Delivery & Logistics">Delivery & Logistics</option>
            <option value="Account & Verification">Account & Verification</option>
            <option value="Technical Issue">Technical Issue</option>
            <option value="General Inquiry">General Inquiry</option>
          </select>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold gap-1 w-full md:w-auto overflow-x-auto">
          {(['All', 'Open', 'Resolved'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-3.5 py-1.5 rounded-lg whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? 'bg-[#062E35] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tickets Table / List */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-500 bg-slate-50/70">
                <th className="py-3.5 px-6">Ticket & Subject</th>
                <th className="py-3.5 px-6">Category</th>
                <th className="py-3.5 px-6">Status & Priority</th>
                <th className="py-3.5 px-6">Submitted</th>
                <th className="py-3.5 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-slate-400">
                    <div className="flex flex-col items-center justify-center gap-2">
                      <LifeBuoy className="w-8 h-8 text-slate-300" />
                      <p className="text-sm font-medium text-slate-600">No support tickets found</p>
                      <p className="text-xs text-slate-400">
                        {searchTerm || selectedCategory !== 'All' || activeTab !== 'All'
                          ? 'Try clearing your filters to see more tickets.'
                          : 'You have not submitted any support tickets to admin yet.'}
                      </p>
                      {activeTab === 'All' && selectedCategory === 'All' && !searchTerm && (
                        <button
                          type="button"
                          onClick={() => setIsCreateModalOpen(true)}
                          className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#062E35] text-white text-xs font-semibold hover:bg-[#0E4F5A] cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                          Create Your First Ticket
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => {
                      setSelectedTicket(ticket);
                      markTicketAsSeen(ticket.id, 'Vendor');
                    }}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    {/* Ticket & Subject */}
                    <td className="py-3.5 px-6 max-w-sm">
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-[11px] font-bold text-[#062E35] bg-[#062E35]/5 px-2 py-0.5 rounded-md">
                            {ticket.id}
                          </span>
                        </div>
                        <span className="font-semibold text-slate-900 text-sm group-hover:text-[#062E35] transition-colors line-clamp-1">
                          {ticket.subject}
                        </span>
                        <span className="text-xs text-slate-400 line-clamp-1 mt-0.5">
                          {ticket.fullMessage}
                        </span>
                      </div>
                    </td>

                    {/* Category */}
                    <td className="py-3.5 px-6">
                      <span className="inline-block px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium">
                        {ticket.category}
                      </span>
                    </td>

                    {/* Status & Priority */}
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-2 flex-wrap">
                        {getStatusBadge(ticket.status)}
                        {getPriorityBadge(ticket.priority)}
                      </div>
                    </td>

                    {/* Time */}
                    <td className="py-3.5 px-6 text-xs text-slate-500 font-medium">
                      {ticket.submittedTime}
                    </td>

                    {/* Action */}
                    <td className="py-3.5 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedTicket(ticket);
                          markTicketAsSeen(ticket.id, 'Vendor');
                        }}
                        className="relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-[#062E35] bg-[#062E35]/5 hover:bg-[#062E35]/10 transition-colors cursor-pointer"
                      >
                        <MessageSquare className="w-3.5 h-3.5" />
                        <span>Chat</span>
                        {isTicketUnread(ticket, 'Vendor') && (
                          <span
                            className="w-2 h-2 rounded-full bg-rose-500 animate-pulse ring-2 ring-white"
                            title="New unread message from Admin"
                          />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ======================================================== */}
      {/* Create New Ticket Modal                                  */}
      {/* ======================================================== */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl animate-in zoom-in-95 duration-150 border border-slate-100">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#062E35]/10 text-[#062E35] flex items-center justify-center">
                  <LifeBuoy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">Create Support Ticket</h3>
                  <p className="text-xs text-slate-400">Describe the issue and our admin team will reply promptly</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateModalOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateTicket} className="mt-5 space-y-4">
              {/* Subject */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Subject / Summary *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Bkash payout withdrawal delayed for batch #8210"
                  value={newSubject}
                  onChange={(e) => setNewSubject(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#062E35]/20 focus:border-[#062E35]"
                />
              </div>

              {/* Category & Priority Grid */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Category *
                  </label>
                  <select
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value as TicketCategory)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#062E35]/20 focus:border-[#062E35] cursor-pointer"
                  >
                    <option value="Payout & Finance">Payout & Finance</option>
                    <option value="Product Approval">Product Approval</option>
                    <option value="Delivery & Logistics">Delivery & Logistics</option>
                    <option value="Account & Verification">Account & Verification</option>
                    <option value="Technical Issue">Technical Issue</option>
                    <option value="General Inquiry">General Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                    Priority *
                  </label>
                  <select
                    value={newPriority}
                    onChange={(e) => setNewPriority(e.target.value as TicketPriority)}
                    className="w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#062E35]/20 focus:border-[#062E35] cursor-pointer"
                  >
                    <option value="Low">Low - General query</option>
                    <option value="Medium">Medium - Regular issue</option>
                    <option value="High">High - Attention needed</option>
                    <option value="Urgent">Urgent - Business blocking</option>
                  </select>
                </div>
              </div>

              {/* Message Details */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Detailed Description *
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Provide all relevant details (order numbers, bank account numbers, error messages, etc.) so we can solve this quickly..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#062E35]/20 focus:border-[#062E35] resize-none"
                />
              </div>

              {/* Attachment */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Attachment (Optional)
                </label>
                <div className="flex items-center gap-3 flex-wrap">
                  <label className="flex items-center gap-2 px-3.5 py-2 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors">
                    <Paperclip className="w-3.5 h-3.5" />
                    <span>{newAttachment ? 'Change File' : 'Attach Document or Image'}</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                      onChange={handleNewTicketFileChange}
                    />
                  </label>
                  {newAttachment && (
                    <div className="flex items-center gap-2 p-1.5 pr-2.5 bg-emerald-50 text-emerald-800 rounded-xl border border-emerald-200/60 text-xs">
                      {newAttachment.type === 'image' ? (
                        <img
                          src={newAttachment.url}
                          alt={newAttachment.name}
                          className="w-8 h-8 rounded-lg object-cover border border-emerald-200 shrink-0"
                        />
                      ) : (
                        <FileText className="w-4 h-4 text-emerald-600 shrink-0 ml-1" />
                      )}
                      <div className="flex flex-col min-w-0 max-w-[180px]">
                        <span className="font-semibold text-emerald-900 truncate">{newAttachment.name}</span>
                        {newAttachment.size && (
                          <span className="text-[10px] text-emerald-600">{newAttachment.size}</span>
                        )}
                      </div>
                      <button
                        type="button"
                        onClick={() => setNewAttachment(null)}
                        className="ml-1 text-slate-400 hover:text-slate-700 w-5 h-5 flex items-center justify-center rounded-full hover:bg-emerald-100 cursor-pointer"
                        title="Remove file"
                      >
                        ×
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#062E35] text-white text-sm font-semibold hover:bg-[#0E4F5A] transition-colors cursor-pointer shadow-xs active:scale-95"
                >
                  Submit Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* Ticket Chat / Discussion Sliding Drawer                  */}
      {/* ======================================================== */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-150"
            onClick={() => setSelectedTicket(null)}
          />

          {/* Drawer Content */}
          <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-200 z-10">
            {/* Drawer Header */}
            <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
              <div className="flex flex-col">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                    {selectedTicket.id}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {selectedTicket.category}
                  </span>
                  {getPriorityBadge(selectedTicket.priority)}
                </div>
                <h2 className="text-base font-bold text-slate-900 mt-1 leading-snug">
                  {selectedTicket.subject}
                </h2>
                <span className="text-[11px] text-slate-400 mt-0.5">
                  Submitted {selectedTicket.submittedTime}
                </span>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                {getStatusBadge(selectedTicket.status)}
                <button
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Support Resolution Banner */}
            <div className="px-6 py-2.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5 text-slate-600">
                <ShieldCheck className="w-4 h-4 text-[#062E35]" />
                <span>Krisikunjo Admin Verified Support Channel</span>
              </div>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                Status: {selectedTicket.status}
              </span>
            </div>

            {/* Conversation Messages */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-slate-50/40">
              {(selectedTicket.messages || []).map((msg) => {
                const isVendorSelf = msg.authorRole === 'Vendor';
                return (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${isVendorSelf ? 'items-end' : 'items-start'} gap-1`}
                  >
                    <div className="flex items-center gap-2 text-[11px] text-slate-400">
                      <span className="font-semibold text-slate-700">{msg.author}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>

                    <div
                      className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                        isVendorSelf
                          ? 'bg-[#062E35] text-white rounded-tr-xs'
                          : 'bg-white text-slate-800 border border-slate-200/80 rounded-tl-xs'
                      }`}
                    >
                      {msg.text && <p className="whitespace-pre-wrap break-words">{msg.text}</p>}

                      {/* Attachment rendering */}
                      {Boolean(msg.attachmentUrl || msg.attachmentName) && (() => {
                        const fileUrl = getAttachmentUrl(msg.attachmentName, msg.attachmentUrl);
                        const isImg = isImageAttachment(msg.attachmentName, msg.attachmentUrl, msg.attachmentType);
                        const displayName = getAttachmentDisplayName(msg.attachmentName, msg.attachmentUrl);

                        if (isImg && fileUrl) {
                          return (
                            <div className="mt-2.5 space-y-1.5">
                              <div className="rounded-xl overflow-hidden max-w-sm border border-black/10 bg-black/5">
                                <img
                                  src={fileUrl}
                                  alt={displayName}
                                  className="max-h-60 w-auto rounded-lg object-contain cursor-pointer hover:opacity-95 transition-opacity"
                                  onClick={() => window.open(fileUrl, '_blank')}
                                  title="Click to view full image"
                                />
                              </div>
                              <div
                                className={`flex items-center justify-between text-[11px] px-1 ${
                                  isVendorSelf ? 'text-white/75' : 'text-slate-400'
                                }`}
                              >
                                <span className="truncate max-w-[200px]">{displayName}</span>
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  download={displayName}
                                  className={`hover:underline ml-2 font-medium ${
                                    isVendorSelf ? 'text-white' : 'text-emerald-700'
                                  }`}
                                  onClick={(e) => e.stopPropagation()}
                                >
                                  Open
                                </a>
                              </div>
                            </div>
                          );
                        }

                        return (
                          <a
                            href={fileUrl || '#'}
                            target="_blank"
                            rel="noreferrer"
                            download={displayName}
                            className={`mt-2.5 flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-colors ${
                              isVendorSelf
                                ? 'bg-white/15 text-white hover:bg-white/25'
                                : 'bg-slate-100 text-slate-800 hover:bg-slate-200'
                            }`}
                          >
                            <FileText className="w-4 h-4 shrink-0" />
                            <span className="truncate flex-1 font-medium">{displayName}</span>
                            <Download className="w-3.5 h-3.5 shrink-0 opacity-70" />
                          </a>
                        );
                      })()}
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>

            {/* Reply Input Box */}
            <div className="p-4 bg-white border-t border-slate-100 shrink-0">
              {selectedTicket.status === 'Resolved' ? (
                <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-center space-y-1">
                  <p className="text-xs font-bold text-slate-800">
                    This support ticket has been resolved by Admin.
                  </p>
                  <p className="text-[11px] text-slate-500">
                    The conversation is closed and you can no longer send messages. If you need further assistance, please create a new support ticket.
                  </p>
                </div>
              ) : (
                <>
                  {replyAttachment && (
                    <div className="mb-2 p-2 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        {replyAttachment.type === 'image' ? (
                          <img
                            src={replyAttachment.url}
                            alt={replyAttachment.name}
                            className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                        )}
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-800 truncate">{replyAttachment.name}</span>
                          {replyAttachment.size && (
                            <span className="text-[11px] text-slate-400">{replyAttachment.size}</span>
                          )}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => setReplyAttachment(null)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                        title="Remove attachment"
                      >
                        ×
                      </button>
                    </div>
                  )}

                  <form onSubmit={handleSendReply} className="flex items-end gap-2 mt-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                      onChange={handleReplyFileChange}
                    />
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="p-2.5 rounded-xl border border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700 transition-colors cursor-pointer"
                      title="Attach file or photo"
                    >
                      <Paperclip className="w-4 h-4" />
                    </button>

                    <textarea
                      rows={2}
                      placeholder={replyAttachment ? 'Add a message (optional)...' : 'Type your message to Krisikunjo admin...'}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                          e.preventDefault();
                          handleSendReply();
                        }
                      }}
                      className="flex-1 px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-[#062E35]/20 focus:border-[#062E35] resize-none"
                    />

                    <button
                      type="submit"
                      disabled={!replyText.trim() && !replyAttachment}
                      className="p-2.5 rounded-xl bg-[#062E35] text-white hover:bg-[#0E4F5A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
                    >
                      <Send className="w-4 h-4" />
                    </button>
                  </form>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                    <span>Press Enter to send, Shift+Enter for new line</span>
                    <span>Replies are sent directly to Admin</span>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
