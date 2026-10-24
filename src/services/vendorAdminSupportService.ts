import { io, type Socket } from 'socket.io-client';

export type TicketCategory =
  | 'Payout & Finance'
  | 'Product Approval'
  | 'Delivery & Logistics'
  | 'Account & Verification'
  | 'Technical Issue'
  | 'General Inquiry';

export type TicketPriority = 'Low' | 'Medium' | 'High' | 'Urgent';

export type TicketStatus = 'Open' | 'Resolved';

export interface SupportAttachment {
  name: string;
  url: string;
  type: 'image' | 'file';
  size?: string;
}

export interface TicketMessage {
  id: string;
  author: string;
  authorRole: 'Vendor' | 'Admin';
  authorInitials?: string;
  time: string;
  text: string;
  attachmentName?: string;
  attachmentUrl?: string;
  attachmentType?: 'image' | 'file';
  createdAt?: string;
}

export const isImageAttachment = (name?: string, url?: string, type?: 'image' | 'file'): boolean => {
  if (type === 'image') return true;
  if (type === 'file') return false;
  const target = (url || name || '').trim().toLowerCase();
  if (target.startsWith('data:image/')) return true;
  if (/\.(jpeg|jpg|png|webp|gif|svg|bmp|ico|avif)(\?.*)?$/i.test(target)) return true;
  if ((target.startsWith('http://') || target.startsWith('https://')) && (target.includes('/image/') || target.includes('cloudinary') || target.includes('imgur') || target.includes('/uploads/'))) return true;
  return false;
};

export const getAttachmentUrl = (name?: string, url?: string): string => {
  if (url && (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:') || url.startsWith('/'))) {
    return url;
  }
  if (name && (name.startsWith('http://') || name.startsWith('https://') || name.startsWith('data:') || name.startsWith('blob:') || name.startsWith('/'))) {
    return name;
  }
  return url || '';
};

export const getAttachmentDisplayName = (name?: string, url?: string): string => {
  if (name && !name.startsWith('data:')) {
    if (name.startsWith('http://') || name.startsWith('https://')) {
      try {
        const urlObj = new URL(name);
        const segments = urlObj.pathname.split('/').filter(Boolean);
        if (segments.length > 0) return decodeURIComponent(segments[segments.length - 1]);
      } catch {}
    }
    return name;
  }
  if (url && !url.startsWith('data:')) {
    try {
      const urlObj = new URL(url);
      const segments = urlObj.pathname.split('/').filter(Boolean);
      if (segments.length > 0) return decodeURIComponent(segments[segments.length - 1]);
    } catch {}
  }
  return 'Attachment';
};

export interface VendorSupportTicket {
  id: string;
  vendorId?: string;
  vendorName: string;
  storeName: string;
  email: string;
  phone?: string;
  category: TicketCategory;
  priority: TicketPriority;
  subject: string;
  fullMessage: string;
  status: TicketStatus;
  submittedTime: string;
  updatedTime: string;
  createdAt?: string;
  updatedAt?: string;
  messages: TicketMessage[];
}

const STORAGE_KEY = 'kk_admin_vendor_support_tickets_v2';
const SEEN_STORAGE_KEY = 'kk_admin_vendor_support_seen_v1';
const EVENT_NAME = 'kk_vendor_admin_tickets_updated';

export const getSeenRecord = (): Record<string, string> => {
  try {
    const s = localStorage.getItem(SEEN_STORAGE_KEY);
    return s ? JSON.parse(s) : {};
  } catch {
    return {};
  }
};

export const markTicketAsSeen = (ticketId: string, role: 'Admin' | 'Vendor', lastMsgId?: string): void => {
  try {
    const record = getSeenRecord();
    const key = `${role}_${ticketId}`;
    record[key] = lastMsgId || 'seen';
    localStorage.setItem(SEEN_STORAGE_KEY, JSON.stringify(record));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_NAME));
    }
  } catch {}
};

export const isTicketUnread = (ticket: VendorSupportTicket, role: 'Admin' | 'Vendor'): boolean => {
  const msgs = Array.isArray(ticket?.messages) ? ticket.messages : [];
  if (msgs.length === 0) return false;
  const lastMsg = msgs[msgs.length - 1];
  if (!lastMsg) return false;

  // For Admin: unread if last message was from Vendor and not seen
  if (role === 'Admin') {
    if (lastMsg.authorRole !== 'Vendor') return false;
    const record = getSeenRecord();
    const key = `Admin_${ticket.id}`;
    return record[key] !== lastMsg.id;
  }

  // For Vendor: unread if last message was from Admin and not seen
  if (role === 'Vendor') {
    if (lastMsg.authorRole !== 'Admin') return false;
    const record = getSeenRecord();
    const key = `Vendor_${ticket.id}`;
    return record[key] !== lastMsg.id;
  }

  return false;
};

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

class VendorAdminSupportService {
  private socket: Socket | null = null;
  private hasInitializedSocket = false;
  private currentJoinedTicketRoom: string | null = null;

  constructor() {
    this.cleanLegacySeedData();
    this.initSocket();
    this.syncFromBackend();
  }

  /**
   * Purge any old seed/mock data from localStorage
   */
  private cleanLegacySeedData() {
    try {
      localStorage.removeItem('kk_admin_vendor_support_tickets_v1');
    } catch {}
  }

  /**
   * Initialize Socket.IO connection
   */
  private initSocket() {
    if (typeof window === 'undefined' || this.hasInitializedSocket) return;
    this.hasInitializedSocket = true;

    try {
      this.socket = io(SOCKET_URL, {
        transports: ['websocket', 'polling'],
        reconnectionAttempts: 5,
        reconnectionDelay: 2000,
      });

      this.socket.on('connect', () => {
        console.log('[VendorSupport] Socket connected:', this.socket?.id);
        this.socket?.emit('join_admin_support');
        this.socket?.emit('join_vendor_support');

        // Rejoin room if currently open
        if (this.currentJoinedTicketRoom) {
          this.socket?.emit('join_ticket', { ticketId: this.currentJoinedTicketRoom });
        }
      });

      // Real-time new ticket created
      this.socket.on('ticket_created', (data: { ticket: VendorSupportTicket }) => {
        if (!data?.ticket) return;
        const normalized = this.normalizeTicket(data.ticket);
        const current = this.getTickets();
        if (!current.some((t) => t.id === normalized.id)) {
          this.saveLocalTickets([normalized, ...current]);
        }
      });

      // Real-time new message in ticket
      this.socket.on('ticket_new_message', (data: { ticketId: string; message: TicketMessage; ticket?: VendorSupportTicket }) => {
        if (!data?.ticketId || !data?.message) return;
        const current = this.getTickets();
        const index = current.findIndex((t) => t.id === data.ticketId);

        if (index !== -1) {
          const ticket = current[index];
          const msgs = Array.isArray(ticket.messages) ? ticket.messages : [];
          // Deduplication: check ID only
          const msgExists = msgs.some((m) => m.id === data.message.id);
          if (!msgExists) {
            let nextStatus: TicketStatus = data.ticket?.status || (ticket.status === 'Resolved' ? 'Resolved' : 'Open');

            const updated: VendorSupportTicket = data.ticket ? this.normalizeTicket(data.ticket) : {
              ...ticket,
              status: nextStatus,
              updatedTime: 'Just now',
              messages: [...msgs, data.message],
            };
            current[index] = updated;
            this.saveLocalTickets([...current]);
          } else if (data.ticket) {
            current[index] = this.normalizeTicket(data.ticket);
            this.saveLocalTickets([...current]);
          }

          // If current user is currently in this ticket room, auto-mark as seen
          if (this.currentJoinedTicketRoom === data.ticketId) {
            const role = data.message.authorRole === 'Admin' ? 'Vendor' : 'Admin';
            markTicketAsSeen(data.ticketId, role, data.message.id);
          }
        } else if (data.ticket) {
          this.saveLocalTickets([this.normalizeTicket(data.ticket), ...current]);
        }
      });

      // Real-time status change
      this.socket.on('ticket_status_changed', (data: { ticketId: string; status: TicketStatus; ticket?: VendorSupportTicket }) => {
        if (!data?.ticketId) return;
        const current = this.getTickets();
        const index = current.findIndex((t) => t.id === data.ticketId);
        if (index !== -1) {
          current[index] = data.ticket ? this.normalizeTicket(data.ticket) : {
            ...current[index],
            status: data.status,
            updatedTime: 'Just now',
            messages: Array.isArray(current[index].messages) ? current[index].messages : [],
          };
          this.saveLocalTickets([...current]);
        }
      });

      // Real-time deletion
      this.socket.on('ticket_deleted', (data: { ticketId: string }) => {
        if (!data?.ticketId) return;
        const current = this.getTickets();
        const filtered = current.filter((t) => t.id !== data.ticketId);
        if (filtered.length !== current.length) {
          this.saveLocalTickets(filtered);
        }
      });

      this.socket.on('connect_error', (err) => {
        console.warn('[VendorSupport] Socket notice:', err.message);
      });
    } catch (e) {
      console.warn('[VendorSupport] Socket skipped:', e);
    }
  }

  private normalizeTicket(t: any): VendorSupportTicket {
    return {
      ...t,
      messages: Array.isArray(t?.messages) ? t.messages : [],
    };
  }

  /**
   * Sync latest tickets from backend REST API
   */
  async syncFromBackend(): Promise<VendorSupportTicket[]> {
    try {
      const res = await fetch(`${API_BASE_URL}/vendor-support/tickets`);
      if (res.ok) {
        const json = await res.json();
        const list = json.data || json;
        if (Array.isArray(list)) {
          const normalized = list.map((t) => this.normalizeTicket(t));
          this.saveLocalTickets(normalized);
          return normalized;
        }
      }
    } catch (e) {
      // Backend may still be spinning up or offline
    }
    return this.getTickets();
  }

  joinTicketRoom(ticketId: string): void {
    this.currentJoinedTicketRoom = ticketId;
    if (this.socket?.connected) {
      this.socket.emit('join_ticket', { ticketId });
    }
  }

  leaveTicketRoom(ticketId: string): void {
    if (this.currentJoinedTicketRoom === ticketId) {
      this.currentJoinedTicketRoom = null;
    }
    if (this.socket?.connected) {
      this.socket.emit('leave_ticket', { ticketId });
    }
  }

  getTickets(): VendorSupportTicket[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        return [];
      }
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed)) {
        return parsed.map((t) => this.normalizeTicket(t));
      }
      return [];
    } catch (e) {
      console.error('Failed to load support tickets:', e);
      return [];
    }
  }

  private saveLocalTickets(tickets: VendorSupportTicket[]): void {
    try {
      const safe = tickets.map((t) => this.normalizeTicket(t));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(safe));
      this.notify();
    } catch (e) {
      console.error('Failed to save support tickets locally:', e);
    }
  }

  saveTickets(tickets: VendorSupportTicket[]): void {
    this.saveLocalTickets(tickets);
  }

  async createTicket(payload: {
    vendorId?: string;
    vendorName: string;
    storeName: string;
    email: string;
    phone?: string;
    category: TicketCategory;
    priority: TicketPriority;
    subject: string;
    message: string;
    attachmentName?: string;
    attachmentUrl?: string;
    attachmentType?: 'image' | 'file';
  }): Promise<VendorSupportTicket> {
    const tickets = this.getTickets();
    const nextNum = 1000 + tickets.length + 1;
    const ticketId = `TKT-${nextNum}`;

    const nowStr = 'Just now';
    const firstMsg: TicketMessage = {
      id: `msg-${Date.now()}`,
      author: `${payload.vendorName} (${payload.storeName || 'Vendor'})`,
      authorRole: 'Vendor',
      authorInitials: payload.vendorName
        ? payload.vendorName
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : 'VN',
      time: nowStr,
      text: payload.message,
      attachmentName: payload.attachmentName,
      attachmentUrl: payload.attachmentUrl,
      attachmentType: payload.attachmentType
    };

    const newTicket: VendorSupportTicket = {
      id: ticketId,
      vendorId: payload.vendorId,
      vendorName: payload.vendorName,
      storeName: payload.storeName || 'Agro Store',
      email: payload.email,
      phone: payload.phone,
      category: payload.category,
      priority: payload.priority,
      subject: payload.subject,
      fullMessage: payload.message,
      status: 'Open', // User requirement: vendor message korle 1st hbe in review
      submittedTime: nowStr,
      updatedTime: nowStr,
      messages: [firstMsg]
    };

    // 1. Optimistic update
    const updated = [newTicket, ...tickets];
    this.saveLocalTickets(updated);

    // 2. Call backend REST
    try {
      const res = await fetch(`${API_BASE_URL}/vendor-support/tickets`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (res.ok) {
        const json = await res.json();
        const serverTicket = json.data || json;
        if (serverTicket?.id) {
          const list = this.getTickets();
          const idx = list.findIndex((t) => t.id === newTicket.id);
          const normalized = this.normalizeTicket(serverTicket);
          if (idx !== -1) {
            list[idx] = normalized;
            this.saveLocalTickets(list);
            return normalized;
          }
        }
      }
    } catch (e) {
      console.warn('Backend create ticket sync notice:', e);
    }

    return newTicket;
  }

  async addReply(
    ticketId: string,
    reply: {
      author: string;
      authorRole: 'Vendor' | 'Admin';
      authorInitials?: string;
      text: string;
      attachmentName?: string;
      attachmentUrl?: string;
      attachmentType?: 'image' | 'file';
    }
  ): Promise<VendorSupportTicket | null> {
    const tickets = this.getTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);
    const localTicket = index !== -1 ? tickets[index] : null;

    // User requirement: when admin change status means resolve then close message
    if (localTicket && localTicket.status === 'Resolved' && reply.authorRole === 'Vendor') {
      return null;
    }

    const initials =
      reply.authorInitials ||
      (reply.author
        ? reply.author
            .split(' ')
            .map((p) => p[0])
            .slice(0, 2)
            .join('')
            .toUpperCase()
        : reply.authorRole === 'Admin'
        ? 'AD'
        : 'VN');

    // 1. Call backend REST API (authoritative save + Socket.io broadcast)
    try {
      const res = await fetch(`${API_BASE_URL}/vendor-support/tickets/${ticketId}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          author: reply.author,
          authorRole: reply.authorRole,
          authorInitials: initials,
          text: reply.text || '',
          attachmentName: reply.attachmentName,
          attachmentUrl: reply.attachmentUrl,
          attachmentType: reply.attachmentType,
        }),
      });

      if (res.ok) {
        const json = await res.json();
        const serverTicket = json.data || json;
        if (serverTicket?.id) {
          const normalized = this.normalizeTicket(serverTicket);
          const list = this.getTickets();
          const i = list.findIndex((t) => t.id === ticketId);
          if (i !== -1) {
            list[i] = normalized;
          } else {
            list.unshift(normalized);
          }
          this.saveLocalTickets(list);
          const lastMsg = normalized.messages[normalized.messages.length - 1];
          markTicketAsSeen(ticketId, reply.authorRole, lastMsg?.id);
          return normalized;
        }
      } else {
        const errJson = await res.json().catch(() => ({}));
        if (res.status === 400 && errJson?.message?.includes('resolved')) {
          console.warn('Ticket is resolved, cannot reply:', errJson);
          return null;
        }
      }
    } catch (e) {
      console.warn('Backend message sync notice:', e);
    }

    // 2. Fallback to optimistic local update if backend is temporarily offline
    if (localTicket) {
      const msgs = Array.isArray(localTicket.messages) ? localTicket.messages : [];
      const newMsg: TicketMessage = {
        id: `msg-${Date.now()}`,
        author: reply.author,
        authorRole: reply.authorRole,
        authorInitials: initials,
        time: 'Just now',
        text: reply.text,
        attachmentName: reply.attachmentName,
        attachmentUrl: reply.attachmentUrl,
        attachmentType: reply.attachmentType,
      };

      let nextStatus: TicketStatus = localTicket.status === 'Resolved' ? 'Resolved' : 'Open';

      const updatedTicket: VendorSupportTicket = {
        ...localTicket,
        status: nextStatus,
        updatedTime: 'Just now',
        messages: [...msgs, newMsg],
      };

      tickets[index] = updatedTicket;
      this.saveLocalTickets(tickets);
      markTicketAsSeen(ticketId, reply.authorRole, newMsg.id);
      return updatedTicket;
    }

    return null;
  }

  async updateTicketStatus(ticketId: string, status: TicketStatus): Promise<VendorSupportTicket | null> {
    const tickets = this.getTickets();
    const index = tickets.findIndex((t) => t.id === ticketId);

    // Call backend REST API
    try {
      const res = await fetch(`${API_BASE_URL}/vendor-support/tickets/${ticketId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const json = await res.json();
        const serverTicket = json.data || json;
        if (serverTicket?.id) {
          const normalized = this.normalizeTicket(serverTicket);
          const list = this.getTickets();
          const i = list.findIndex((t) => t.id === ticketId);
          if (i !== -1) {
            list[i] = normalized;
          } else {
            list.unshift(normalized);
          }
          this.saveLocalTickets(list);
          return normalized;
        }
      }
    } catch (e) {
      console.warn('Backend status update notice:', e);
    }

    if (index !== -1) {
      const updatedTicket: VendorSupportTicket = {
        ...tickets[index],
        status,
        updatedTime: 'Just now',
        messages: Array.isArray(tickets[index].messages) ? tickets[index].messages : [],
      };
      tickets[index] = updatedTicket;
      this.saveLocalTickets(tickets);
      return updatedTicket;
    }

    return null;
  }

  async deleteTicket(ticketId: string): Promise<boolean> {
    const tickets = this.getTickets();
    const filtered = tickets.filter((t) => t.id !== ticketId);
    if (filtered.length === tickets.length) return false;
    this.saveLocalTickets(filtered);

    // Call backend REST
    try {
      fetch(`${API_BASE_URL}/vendor-support/tickets/${ticketId}`, {
        method: 'DELETE',
      }).catch(() => {});
    } catch {}

    return true;
  }

  notify(): void {
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event(EVENT_NAME));
    }
  }

  subscribe(callback: () => void): () => void {
    if (typeof window === 'undefined') return () => {};

    const handleCustom = () => callback();
    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) {
        callback();
      }
    };

    window.addEventListener(EVENT_NAME, handleCustom);
    window.addEventListener('storage', handleStorage);

    // Trigger initial sync from backend
    this.syncFromBackend().then(() => callback());

    return () => {
      window.removeEventListener(EVENT_NAME, handleCustom);
      window.removeEventListener('storage', handleStorage);
    };
  }
}

export const vendorAdminSupportService = new VendorAdminSupportService();
