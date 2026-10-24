import { useState, useRef, useEffect } from 'react';
import { 
  SupportMetricsGrid, 
  SupportFilters, 
  SupportTable, 
  SupportReplyDrawer, 
  SupportDeleteModal 
} from '../../components/adminComponents/support';
import {
  vendorAdminSupportService,
  type VendorSupportTicket,
  type TicketStatus,
  type SupportAttachment,
  markTicketAsSeen
} from '../../services/vendorAdminSupportService';

export const AdminSupport = () => {
  const [tickets, setTickets] = useState<VendorSupportTicket[]>([]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [activeTab, setActiveTab] = useState<'All' | 'Open' | 'Resolved'>('All');

  // Interactive drawer / modal states
  const [selectedTicket, setSelectedTicket] = useState<VendorSupportTicket | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<SupportAttachment | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<VendorSupportTicket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load tickets and subscribe to real-time changes
  const loadTickets = () => {
    const list = vendorAdminSupportService.getTickets();
    setTickets(list);
    setSelectedTicket((prev) => {
      if (!prev) return null;
      const refreshed = list.find((t) => t.id === prev.id);
      return refreshed
        ? {
            ...refreshed,
            messages: Array.isArray(refreshed.messages) ? refreshed.messages : [],
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
      markTicketAsSeen(selectedTicket.id, 'Admin');
    }
    return () => {
      if (selectedTicket?.id) {
        vendorAdminSupportService.leaveTicketRoom(selectedTicket.id);
      }
    };
  }, [selectedTicket?.id]);

  // Auto scroll to bottom when messages update
  useEffect(() => {
    if (selectedTicket) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicket?.id, selectedTicket?.messages?.length]);

  // Close drawer on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        if (ticketToDelete) {
          setTicketToDelete(null);
        } else if (selectedTicket) {
          setSelectedTicket(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedTicket, ticketToDelete]);

  // Dynamic counts for top cards
  const totalCount = tickets.length;
  const openCount = tickets.filter((t) => t.status === 'Open').length;
  
  const resolvedCount = tickets.filter((t) => t.status === 'Resolved').length;

  const getInitials = (name?: string) => {
    if (!name || typeof name !== 'string') return 'VN';
    const parts = name.trim().split(' ').filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0]?.slice(0, 2).toUpperCase() || 'VN';
  };

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const term = searchTerm.toLowerCase().trim();
    const matchesSearch =
      !term ||
      (t.id && t.id.toLowerCase().includes(term)) ||
      (t.vendorName && t.vendorName.toLowerCase().includes(term)) ||
      (t.storeName && t.storeName.toLowerCase().includes(term)) ||
      (t.subject && t.subject.toLowerCase().includes(term)) ||
      (t.category && t.category.toLowerCase().includes(term)) ||
      (t.fullMessage && t.fullMessage.toLowerCase().includes(term));

    const matchesCategory =
      selectedCategory === 'All' || t.category === selectedCategory;

    const matchesStatus =
      activeTab === 'All' || t.status === activeTab;

    return Boolean(matchesSearch && matchesCategory && matchesStatus);
  });

  // Handle Send Reply as Admin
  const handleSendReply = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!selectedTicket) return;
    if (!replyInput.trim() && !attachedFile) return;

    const updated = await vendorAdminSupportService.addReply(selectedTicket.id, {
      author: 'Krisikunjo Admin Support',
      authorRole: 'Admin',
      authorInitials: 'AD',
      text: replyInput.trim(),
      attachmentName: attachedFile ? attachedFile.name : undefined,
      attachmentUrl: attachedFile ? attachedFile.url : undefined,
      attachmentType: attachedFile ? attachedFile.type : undefined
    });

    if (updated) {
      setSelectedTicket(updated);
      setReplyInput('');
      setAttachedFile(null);
    }
  };

  // Handle direct status change
  const handleStatusChange = async (newStatus: TicketStatus) => {
    if (!selectedTicket) return;
    const updated = await vendorAdminSupportService.updateTicketStatus(selectedTicket.id, newStatus);
    if (updated) {
      setSelectedTicket(updated);
    }
  };

  // Toggle Resolved status
  const handleToggleResolved = async () => {
    if (!selectedTicket) return;
    const nextStatus: TicketStatus = selectedTicket.status === 'Resolved' ? 'Open' : 'Resolved';
    const updated = await vendorAdminSupportService.updateTicketStatus(selectedTicket.id, nextStatus);
    if (updated) {
      setSelectedTicket(updated);
    }
  };

  // Delete ticket confirmation
  const handleConfirmDelete = async () => {
    if (!ticketToDelete) return;
    await vendorAdminSupportService.deleteTicket(ticketToDelete.id);
    if (selectedTicket?.id === ticketToDelete.id) {
      setSelectedTicket(null);
    }
    setTicketToDelete(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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

      setAttachedFile({
        name: file.name,
        url: dataUrl,
        type: isImg ? 'image' : 'file',
        size: sizeFormatted
      });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  return (
    <div className="p-6 md:p-8 w-full space-y-6 font-['Inter']">
      {/* Page Header */}
      <div>
        <div className="flex items-center gap-2">
          <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
            Vendor Support & Helpdesk
          </h1>
          <span className="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
            Platform Helpdesk
          </span>
        </div>
        <p className="text-sm text-slate-500 mt-1">
          Review, reply to, and resolve support tickets submitted by marketplace vendors.
        </p>
      </div>

      {/* Top 4 Metrics Cards */}
      <SupportMetricsGrid
        totalCount={totalCount}
        openCount={openCount}
        
        resolvedCount={resolvedCount}
      />

      {/* Filter and Search Bar */}
      <SupportFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      {/* Tickets Table */}
      <SupportTable
        tickets={filteredTickets}
        getInitials={getInitials}
        onSelectTicket={(ticket) => setSelectedTicket(ticket)}
        onDeleteTicket={(ticket) => setTicketToDelete(ticket)}
      />

      {/* Sliding Reply Drawer */}
      <SupportReplyDrawer
        selectedTicket={selectedTicket}
        onClose={() => setSelectedTicket(null)}
        getInitials={getInitials}
        messagesEndRef={messagesEndRef}
        fileInputRef={fileInputRef}
        attachedFile={attachedFile}
        setAttachedFile={setAttachedFile}
        handleFileChange={handleFileChange}
        replyInput={replyInput}
        setReplyInput={setReplyInput}
        handleSendReply={handleSendReply}
        handleToggleResolved={handleToggleResolved}
        onStatusChange={handleStatusChange}
      />

      {/* Delete Confirmation Modal */}
      <SupportDeleteModal
        ticketToDelete={ticketToDelete}
        onCancel={() => setTicketToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
