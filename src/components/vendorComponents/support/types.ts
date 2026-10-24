export interface ChatAttachment {
  name: string;
  url: string;
  type: 'image' | 'file';
  size?: string;
}

export interface ChatMessage {
  id: string;
  sender: 'customer' | 'vendor';
  text: string;
  timestamp: string;
  attachment?: ChatAttachment;
  isRead?: boolean;
}

export interface CustomerConversation {
  id: string;
  customerName: string;
  customerAvatar?: string;
  customerInitials: string;
  avatarColor: string;
  customerPhone?: string;
  customerEmail?: string;
  customerLocation?: string;
  orderNumber?: string;
  orderStatus?: string;
  unreadCount: number;
  lastMessageTime: string;
  isOnline?: boolean;
  messages: ChatMessage[];
}
