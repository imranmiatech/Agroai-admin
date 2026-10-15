import { useState, useRef, useEffect } from 'react';
import { 
  Inbox, 
  Clock, 
  CheckCircle2, 
  Search, 
  Eye, 
  Trash2, 
  X, 
  Send, 
  Paperclip,
  CheckSquare,
  FileText
} from 'lucide-react';

export interface TicketMessage {
  id: string;
  author: string;
  authorInitials?: string;
  time: string;
  text: string;
  isSelf?: boolean;
  attachmentName?: string;
}

export interface SupportTicket {
  id: string;
  sender: string;
  email: string;
  role: 'Parent' | 'Nanny';
  plan?: string;
  subject: string;
  fullMessage: string;
  status: 'Open' | 'Waiting for Reply' | 'Resolved';
  submittedTime: string;
  messages: TicketMessage[];
}

export const AdminSupport = () => {
  // Realistic tickets matching the Figma design table & reply drawer
  const [tickets, setTickets] = useState<SupportTicket[]>([
    {
      id: 'TKT-2841',
      sender: "Sarah O'Brien",
      email: 'sarah.ahmed@gmail.com',
      role: 'Parent',
      plan: 'Monthly',
      subject: "Can't invite my nanny",
      fullMessage: "I'm trying to invite my nanny, but the invitation doesn't seem to be going through. Could you please help?",
      status: 'Open',
      submittedTime: '10 min ago',
      messages: [
        {
          id: 'm1',
          author: "Sarah O'Brien",
          authorInitials: 'SO',
          time: '10:32 AM',
          text: "I'm trying to invite my nanny, but the invitation doesn't seem to be going through. Could you please help?",
          isSelf: false
        },
        {
          id: 'm2',
          author: "Sarah O'Brien",
          authorInitials: 'SO',
          time: '10:32 AM',
          text: "I'm trying to invite my nanny, but the invitation doesn't seem to be going through. Could you please help?",
          isSelf: true
        },
        {
          id: 'm3',
          author: "Sarah O'Brien",
          authorInitials: 'SO',
          time: '10:32 AM',
          text: "I'm trying to invite my nanny, but the invitation doesn't seem to be going through. Could you please help?",
          isSelf: false
        },
        {
          id: 'm4',
          author: "Sarah O'Brien",
          authorInitials: 'SO',
          time: '10:32 AM',
          text: "I'm trying to invite my nanny, but the invitation doesn't seem to be going through. Could you please help?",
          isSelf: true
        }
      ]
    },
    {
      id: 'TKT-2840',
      sender: 'Sarah Ahmed',
      email: 'sarah.ahmed@gmail.com',
      role: 'Parent',
      plan: 'Monthly',
      subject: "Can't invite my nanny to family care group",
      fullMessage: "Following up on my previous query: she tried creating an account first, but still gets a permissions error on the onboarding step.",
      status: 'Waiting for Reply',
      submittedTime: '10 min ago',
      messages: [
        {
          id: 'm1',
          author: 'Sarah Ahmed',
          authorInitials: 'SA',
          time: '10:20 AM',
          text: "Following up on my previous query: she tried creating an account first, but still gets a permissions error on the onboarding step.",
          isSelf: false
        },
        {
          id: 'm2',
          author: 'Admin Support',
          authorInitials: 'ET',
          time: '10:24 AM',
          text: "Hello Sarah, we are investigating the invitation token issue for your account. Please confirm her email address so we can check the database.",
          isSelf: true
        }
      ]
    },
    {
      id: 'TKT-2839',
      sender: 'Sarah Ahmed',
      email: 'sarah.ahmed@gmail.com',
      role: 'Parent',
      plan: 'Annual',
      subject: "Can't invite my nanny to family care group",
      fullMessage: "Resolved! The issue was an old email format. Thank you so much for the swift help!",
      status: 'Resolved',
      submittedTime: '10 min ago',
      messages: [
        {
          id: 'm1',
          author: 'Sarah Ahmed',
          authorInitials: 'SA',
          time: '09:15 AM',
          text: "Can you please check why my verification code didn't arrive?",
          isSelf: false
        },
        {
          id: 'm2',
          author: 'Admin Support',
          authorInitials: 'ET',
          time: '09:20 AM',
          text: "We just resent the code to your registered phone number. Let us know if you receive it!",
          isSelf: true
        },
        {
          id: 'm3',
          author: 'Sarah Ahmed',
          authorInitials: 'SA',
          time: '09:25 AM',
          text: "Resolved! The issue was an old email format. Thank you so much for the swift help!",
          isSelf: false
        }
      ]
    },
    {
      id: 'TKT-2835',
      sender: 'Liam O’Connor',
      email: 'liam.oc@outlook.ie',
      role: 'Parent',
      plan: 'Annual',
      subject: 'Inquiry regarding annual subscription billing receipt',
      fullMessage: 'Could you please send me a formal VAT invoice for our annual family subscription? Our accountant requires it for childcare tax documentation.',
      status: 'Open',
      submittedTime: '1 hr ago',
      messages: [
        {
          id: 'm1',
          author: 'Liam O’Connor',
          authorInitials: 'LO',
          time: '01:10 PM',
          text: 'Could you please send me a formal VAT invoice for our annual family subscription? Our accountant requires it for childcare tax documentation.',
          isSelf: false
        }
      ]
    },
    {
      id: 'TKT-2830',
      sender: 'Siobhán Murphy',
      email: 'siobhan.nanny@dublincare.ie',
      role: 'Nanny',
      plan: 'Monthly',
      subject: 'Police clearance and CPR certificate upload assistance',
      fullMessage: 'I uploaded my updated First Aid certification yesterday morning. Could you let me know if it has been verified yet?',
      status: 'Waiting for Reply',
      submittedTime: '3 hrs ago',
      messages: [
        {
          id: 'm1',
          author: 'Siobhán Murphy',
          authorInitials: 'SM',
          time: '11:00 AM',
          text: 'I uploaded my updated First Aid certification yesterday morning. Could you let me know if it has been verified yet?',
          isSelf: false
        },
        {
          id: 'm2',
          author: 'Admin Support',
          authorInitials: 'ET',
          time: '11:45 AM',
          text: 'Hi Siobhán, our compliance team is currently reviewing your document. Verification usually completes within 24 hours.',
          isSelf: true
        }
      ]
    }
  ]);

  // Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All' | 'Open' | 'Waiting for Reply' | 'Resolved'>('All');

  // Interactive drawer / modal states
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyInput, setReplyInput] = useState('');
  const [attachedFile, setAttachedFile] = useState<string | null>(null);
  const [ticketToDelete, setTicketToDelete] = useState<SupportTicket | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auto scroll to bottom when messages update in drawer
  useEffect(() => {
    if (selectedTicket) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [selectedTicket?.messages]);

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
  const openCount = tickets.filter(t => t.status === 'Open').length;
  const waitingCount = tickets.filter(t => t.status === 'Waiting for Reply').length;
  const resolvedCount = tickets.filter(t => t.status === 'Resolved').length;

  // Filtered tickets
  const filteredTickets = tickets.filter((t) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = t.sender.toLowerCase().includes(term) ||
                          t.email.toLowerCase().includes(term) ||
                          t.subject.toLowerCase().includes(term);
    const matchesTab = activeTab === 'All' || t.status === activeTab;
    return matchesSearch && matchesTab;
  });

  // Handle reply submit
  const handleSendReply = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!replyInput.trim() && !attachedFile) return;
    if (!selectedTicket) return;

    const currentTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const newMsg: TicketMessage = {
      id: 'm_' + Date.now(),
      author: selectedTicket.sender, // in Figma mockup the right reply shows author as sender or admin
      authorInitials: getInitials(selectedTicket.sender),
      time: currentTime,
      text: replyInput.trim() || (attachedFile ? `Attached: ${attachedFile}` : ''),
      isSelf: true,
      attachmentName: attachedFile || undefined
    };

    const newMessages = [...selectedTicket.messages, newMsg];
    const newStatus = selectedTicket.status === 'Resolved' ? 'Open' : 'Waiting for Reply';

    const updatedTickets = tickets.map((t) => {
      if (t.id === selectedTicket.id) {
        return {
          ...t,
          status: newStatus as SupportTicket['status'],
          messages: newMessages
        };
      }
      return t;
    });

    setTickets(updatedTickets);
    setSelectedTicket({
      ...selectedTicket,
      status: newStatus as SupportTicket['status'],
      messages: newMessages
    });

    setReplyInput('');
    setAttachedFile(null);
  };

  // Toggle ticket status (Mark Resolved / Reopen)
  const handleToggleResolved = () => {
    if (!selectedTicket) return;
    const nextStatus: SupportTicket['status'] = selectedTicket.status === 'Resolved' ? 'Open' : 'Resolved';

    setTickets(tickets.map(t => t.id === selectedTicket.id ? { ...t, status: nextStatus } : t));
    setSelectedTicket({ ...selectedTicket, status: nextStatus });
  };

  // Confirm delete ticket
  const handleConfirmDelete = () => {
    if (!ticketToDelete) return;
    setTickets(tickets.filter(t => t.id !== ticketToDelete.id));
    if (selectedTicket?.id === ticketToDelete.id) {
      setSelectedTicket(null);
    }
    setTicketToDelete(null);
  };

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0]?.slice(0, 2).toUpperCase() || 'SO';
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setAttachedFile(file.name);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-16">
      {/* 1. Header Section */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            Support
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Review and respond to questions from parents and nannies.
          </p>
        </div>
      </div>

      {/* 2. Top Metric Cards (3 Cards Row matching Figma) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Open Tickets */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-13 h-13 rounded-2xl bg-[#E0F7FA] text-[#00695C] flex items-center justify-center shrink-0">
            <Inbox className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              {openCount}
            </div>
            <div className="text-sm font-medium text-slate-500 mt-0.5">
              Open Tickets
            </div>
          </div>
        </div>

        {/* Waiting for Reply */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-13 h-13 rounded-2xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              {waitingCount}
            </div>
            <div className="text-sm font-medium text-slate-500 mt-0.5">
              Waiting for Reply
            </div>
          </div>
        </div>

        {/* Resolved Today */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex items-center gap-4 hover:shadow-md transition-all">
          <div className="w-13 h-13 rounded-2xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <div className="text-3xl font-bold text-slate-900 tracking-tight leading-tight">
              {resolvedCount}
            </div>
            <div className="text-sm font-medium text-slate-500 mt-0.5">
              Resolved Today
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar (Search + Tab Capsule matching Figma) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-xs flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full md:max-w-md">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search tickets..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none bg-[#F1F5F9] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#0E4F5A]/20 transition-all font-medium"
          />
        </div>

        {/* Filter Capsule Tabs */}
        <div className="flex items-center bg-[#F1F5F9] p-1 rounded-full text-xs font-semibold gap-1 w-full md:w-auto overflow-x-auto">
          {(['All', 'Open', 'Waiting for Reply', 'Resolved'] as const).map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                  isActive 
                    ? 'bg-[#062E35] text-white shadow-xs' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Support Tickets Table Container (Exact Figma Table) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-600">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Subject</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6">Submitted</th>
                <th className="py-4 px-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredTickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400 text-xs">
                    No support tickets found matching your search.
                  </td>
                </tr>
              ) : (
                filteredTickets.map((ticket) => (
                  <tr 
                    key={ticket.id} 
                    onClick={() => setSelectedTicket(ticket)}
                    className="hover:bg-slate-50/70 transition-colors cursor-pointer"
                  >
                    {/* User with Initials Circle */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-[#E0E7FF] text-[#4F46E5] flex items-center justify-center font-bold text-xs shrink-0 select-none">
                          {getInitials(ticket.sender)}
                        </div>
                        <div className="flex flex-col min-w-0">
                          <span className="font-semibold text-slate-900 text-sm leading-tight truncate">
                            {ticket.sender}
                          </span>
                          <span className="text-xs text-slate-400 mt-0.5 truncate">
                            {ticket.email}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Subject */}
                    <td className="py-4 px-6">
                      <span 
                        className="text-slate-700 text-xs font-medium line-clamp-1 hover:text-[#0E4F5A] transition-colors"
                        title={ticket.subject}
                      >
                        {ticket.subject}
                      </span>
                    </td>

                    {/* Role */}
                    <td className="py-4 px-6 text-xs text-slate-600 font-medium">
                      {ticket.role}
                    </td>

                    {/* Status Pill with colored Dot */}
                    <td className="py-4 px-6">
                      {ticket.status === 'Open' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                          <span>Open</span>
                        </span>
                      )}
                      {ticket.status === 'Waiting for Reply' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                          <span>Waiting for Reply</span>
                        </span>
                      )}
                      {ticket.status === 'Resolved' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F4F1] text-[#0E7A6B]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0E7A6B]" />
                          <span>Resolved</span>
                        </span>
                      )}
                    </td>

                    {/* Submitted Time */}
                    <td className="py-4 px-6 text-xs text-slate-500 font-normal">
                      {ticket.submittedTime}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right" onClick={(e) => e.stopPropagation()}>
                      <div className="inline-flex items-center gap-2 justify-end">
                        <button
                          type="button"
                          onClick={() => setSelectedTicket(ticket)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View and reply to ticket"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setTicketToDelete(ticket)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete ticket"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 5. Figma Slide-In Reply Drawer (node-id=28887-15846) */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop blur overlay */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setSelectedTicket(null)}
          />

          {/* Right Sliding Drawer */}
          <div className="absolute inset-y-0 right-0 max-w-[580px] w-full bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300 ease-out z-10">
            {/* Header: Subject, Submitted Time, Status Pill & Close */}
            <div className="px-7 py-5 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
              <div className="flex flex-col">
                <h2 className="text-[17px] font-bold text-slate-900 leading-snug tracking-tight">
                  {selectedTicket.subject}
                </h2>
                <span className="text-xs text-slate-400 mt-1">
                  Submitted {selectedTicket.submittedTime}
                </span>
              </div>

              <div className="flex items-center gap-3 shrink-0">
                {selectedTicket.status === 'Open' && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                    Open
                  </span>
                )}
                {selectedTicket.status === 'Waiting for Reply' && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                    Waiting for Reply
                  </span>
                )}
                {selectedTicket.status === 'Resolved' && (
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F4F1] text-[#0E7A6B]">
                    Resolved
                  </span>
                )}

                <button 
                  type="button"
                  onClick={() => setSelectedTicket(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
                  title="Close panel"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* User Profile Banner Card (Directly below header) */}
            <div className="px-7 pt-5 pb-2 shrink-0">
              <div className="bg-[#F8FAFC] border border-slate-100 rounded-3xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#062E35] text-white font-bold text-base flex items-center justify-center shrink-0 shadow-xs">
                  {getInitials(selectedTicket.sender)}
                </div>
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-bold text-slate-900 text-[15px] leading-tight">
                      {selectedTicket.sender}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E0F7FA] text-[#00695C]">
                      {selectedTicket.role}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 mt-1 flex-wrap">
                    <span className="text-xs text-slate-500 font-normal truncate">
                      {selectedTicket.email}
                    </span>
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#E0F2FE] text-[#0284C7]">
                      {selectedTicket.plan || 'Monthly'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Conversation Stream */}
            <div className="flex-1 overflow-y-auto px-7 py-5 space-y-6">
              {selectedTicket.messages.map((msg) => (
                <div 
                  key={msg.id} 
                  className={`flex flex-col ${msg.isSelf ? 'items-end' : 'items-start'} gap-1.5`}
                >
                  {/* Sender Header row */}
                  {!msg.isSelf ? (
                    // Customer: Avatar on left, name & time
                    <div className="flex items-center gap-2 text-xs mb-0.5">
                      <div className="w-7 h-7 rounded-full bg-[#062E35] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {msg.authorInitials || getInitials(msg.author)}
                      </div>
                      <span className="font-semibold text-slate-900 text-[13px]">
                        {msg.author}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {msg.time}
                      </span>
                    </div>
                  ) : (
                    // Admin / Response: name & time on left of avatar, avatar on right
                    <div className="flex items-center gap-2 text-xs mb-0.5">
                      <span className="font-semibold text-slate-900 text-[13px]">
                        {msg.author}
                      </span>
                      <span className="text-slate-400 text-xs">
                        {msg.time}
                      </span>
                      <div className="w-7 h-7 rounded-full bg-[#062E35] text-white text-[11px] font-bold flex items-center justify-center shrink-0">
                        {msg.authorInitials || getInitials(msg.author)}
                      </div>
                    </div>
                  )}

                  {/* Bubble */}
                  <div 
                    className={`p-4 text-[13.5px] leading-relaxed max-w-[85%] font-normal ${
                      msg.isSelf 
                        ? 'bg-[#062E35] text-white rounded-2xl rounded-tr-xs shadow-xs' 
                        : 'bg-[#F1F5F9] text-slate-800 rounded-2xl rounded-tl-xs'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>
                    {msg.attachmentName && (
                      <div className="mt-2 pt-2 border-t border-white/20 flex items-center gap-1.5 text-xs text-white/90">
                        <FileText className="w-3.5 h-3.5" />
                        <span className="truncate">{msg.attachmentName}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Bottom Reply Area & Actions */}
            <div className="px-7 py-5 border-t border-slate-100/90 bg-white shrink-0 flex flex-col gap-4">
              {/* Attachment tag preview if file selected */}
              {attachedFile && (
                <div className="flex items-center justify-between px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-700">
                  <div className="flex items-center gap-2 truncate">
                    <Paperclip className="w-3.5 h-3.5 text-slate-500" />
                    <span className="truncate font-medium">{attachedFile}</span>
                  </div>
                  <button 
                    type="button" 
                    onClick={() => setAttachedFile(null)}
                    className="text-slate-400 hover:text-rose-600 p-0.5 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              )}

              {/* Textarea container with Paperclip icon */}
              <div className="border border-slate-200/90 rounded-2xl p-3.5 bg-white flex items-start gap-3 shadow-2xs focus-within:border-[#062E35] focus-within:ring-1 focus-within:ring-[#062E35]/20 transition-all">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  className="hidden" 
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="text-slate-400 hover:text-[#062E35] transition-colors p-1 rounded-lg hover:bg-slate-50 cursor-pointer shrink-0 mt-0.5"
                  title="Attach file"
                >
                  <Paperclip className="w-5 h-5 -rotate-45" />
                </button>

                <textarea
                  rows={2}
                  placeholder="Write a reply..."
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleSendReply();
                    }
                  }}
                  className="w-full text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none resize-none bg-transparent pt-0.5 leading-relaxed"
                />
              </div>

              {/* Two Action Buttons Row matching Figma */}
              <div className="grid grid-cols-2 gap-3.5">
                {/* Left Button: Mark Resolved */}
                <button
                  type="button"
                  onClick={handleToggleResolved}
                  className="py-3 px-5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
                >
                  <CheckSquare className="w-4 h-4 text-slate-700" />
                  <span>{selectedTicket.status === 'Resolved' ? 'Mark as Open' : 'Mark Resolved'}</span>
                </button>

                {/* Right Button: Send Reply */}
                <button
                  type="button"
                  onClick={() => handleSendReply()}
                  disabled={!replyInput.trim() && !attachedFile}
                  className="py-3 px-5 rounded-2xl bg-[#062E35] hover:bg-[#0A434D] text-white font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer shadow-xs disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.99]"
                >
                  <Send className="w-4 h-4 text-white" />
                  <span>Send Reply</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 6. Figma Delete Confirmation Modal */}
      {ticketToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div 
            className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150"
            style={{ borderRadius: '24px' }}
          >
            {/* Top Red Tint Squircle Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#FEE4E2] flex items-center justify-center mb-5 shrink-0">
              <Trash2 className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
            </div>

            {/* Title */}
            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              Delete Ticket?
            </h3>

            {/* Subtitle */}
            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              Are you sure you want to delete ticket <span className="font-semibold text-slate-700">#{ticketToDelete.id}</span> from {ticketToDelete.sender}? This action cannot be undone.
            </p>

            {/* Action Buttons Row */}
            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setTicketToDelete(null)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                style={{ borderRadius: '16px' }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95"
                style={{ 
                  backgroundColor: '#B42318', 
                  borderRadius: '16px' 
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
