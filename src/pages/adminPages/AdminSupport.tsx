import { useState, useRef, useEffect } from 'react';
import { 
  SupportMetricsGrid, 
  SupportFilters, 
  SupportTable, 
  SupportReplyDrawer, 
  SupportDeleteModal 
} from '../../components/adminComponents/support';

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
          time: '09:15 AM',
          text: "Following up on my previous query: she tried creating an account first, but still gets a permissions error on the onboarding step.",
          isSelf: false
        },
        {
          id: 'm2',
          author: 'Support Team',
          authorInitials: 'ST',
          time: '09:40 AM',
          text: "We checked your account permissions. Could you please check if she has accepted the invite code via SMS?",
          isSelf: true
        }
      ]
    },
    {
      id: 'TKT-2839',
      sender: 'David Kelly',
      email: 'david.kelly@lifestyle.ie',
      role: 'Parent',
      plan: 'Annual',
      subject: 'Milestone tracking not updating in dashboard',
      fullMessage: 'My child reached their 9-month motor milestone, but the timeline screen is still showing 6-month status even after refreshing.',
      status: 'Open',
      submittedTime: '25 min ago',
      messages: [
        {
          id: 'm1',
          author: 'David Kelly',
          authorInitials: 'DK',
          time: '10:15 AM',
          text: 'My child reached their 9-month motor milestone, but the timeline screen is still showing 6-month status even after refreshing.',
          isSelf: false
        }
      ]
    },
    {
      id: 'TKT-2838',
      sender: 'Chloe Gallagher',
      email: 'chloe.g@gmail.com',
      role: 'Nanny',
      plan: 'Monthly',
      subject: 'Weekly activity log sync delay with parent account',
      fullMessage: 'The order and inventory sync from my vendor dashboard yesterday was delayed on the customer Krisikunjo app.',
      status: 'Resolved',
      submittedTime: '45 min ago',
      messages: [
        {
          id: 'm1',
          author: 'Chloe Gallagher',
          authorInitials: 'CG',
          time: '08:20 AM',
          text: 'The order and inventory sync from my vendor dashboard yesterday was delayed on the customer Krisikunjo app.',
          isSelf: false
        },
        {
          id: 'm2',
          author: 'Krisikunjo Admin',
          authorInitials: 'KA',
          time: '08:50 AM',
          text: 'This was due to a temporary background cache sync. We triggered a manual resync and orders are now synced.',
          isSelf: true
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

  const getInitials = (name: string) => {
    const parts = name.trim().split(' ');
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0]?.slice(0, 2).toUpperCase() || 'SO';
  };

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
      author: selectedTicket.sender,
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

      {/* 2. Top Metric Cards */}
      <SupportMetricsGrid
        openCount={openCount}
        waitingCount={waitingCount}
        resolvedCount={resolvedCount}
      />

      {/* 3. Filter Bar */}
      <SupportFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
      />

      {/* 4. Support Tickets Table Container */}
      <SupportTable
        tickets={filteredTickets}
        getInitials={getInitials}
        onSelectTicket={(ticket) => setSelectedTicket(ticket)}
        onDeleteTicket={(ticket) => setTicketToDelete(ticket)}
      />

      {/* 5. Figma Slide-In Reply Drawer */}
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
      />

      {/* 6. Delete Confirmation Modal */}
      <SupportDeleteModal
        ticketToDelete={ticketToDelete}
        onCancel={() => setTicketToDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
};
