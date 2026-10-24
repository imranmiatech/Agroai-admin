import { io, type Socket } from 'socket.io-client';
import React, { useState, useEffect, useRef } from 'react';
import {
  VendorChatSidebar,
  VendorChatArea,
  type CustomerConversation,
  type ChatMessage,
  type ChatAttachment,
} from '../../components/vendorComponents/support';

export interface VendorTicket {
  id: string;
  ticketNumber?: string;
  subject: string;
  category?: string;
  priority?: string;
  status: string;
  date: string;
  replies: number;
}

const LOCAL_STORAGE_KEY = 'kk_vendor_support_chats_v1';
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';
const SOCKET_URL =
  import.meta.env.VITE_SOCKET_URL || 'http://localhost:3000';

// Initial real customer conversations (empty by default until real inquiries arrive)
const initialConversations: CustomerConversation[] = [];

export const VendorSupport: React.FC = () => {
  const [conversations, setConversations] = useState<CustomerConversation[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse saved chats from localStorage:', e);
    }
    return initialConversations;
  });

  const [activeConversationId, setActiveConversationId] = useState<string>(
    conversations[0]?.id || 'conv-1'
  );

  const activeIdRef = useRef(activeConversationId);
  activeIdRef.current = activeConversationId;

  const socketRef = useRef<Socket | null>(null);

  // 1. Fetch conversations once & connect to Socket.IO for real-time messaging
  const fetchConversations = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/vendor/support/conversations`);
      if (res.ok) {
        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          setConversations(json.data);

          if (!json.data.some((c: CustomerConversation) => c.id === activeIdRef.current)) {
            setActiveConversationId(json.data[0].id);
          }
          try {
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(json.data));
          } catch {}
        }
      }
    } catch (err) {
      console.warn('Could not fetch remote vendor conversations, using local cache:', err);
    }
  };

  useEffect(() => {
    fetchConversations();

    // Connect to Socket.IO server
    const socket: Socket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 10,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      socket.emit('join_vendor_support');
      if (activeIdRef.current) {
        socket.emit('join_order', { orderId: activeIdRef.current });
      }
    });

    // Real-time message in active chat window
    socket.on('new_message', (data: { orderId: string; message: any }) => {
      setConversations((prev) =>
        prev.map((conv) => {
          if (conv.id !== data.orderId) return conv;
          const exists = conv.messages.some((m) => m.id === data.message.id);
          if (exists) return conv;

          const hasOptimistic = conv.messages.some(
            (m) =>
              m.id.startsWith('msg-') &&
              m.text === data.message.text &&
              m.sender === data.message.sender
          );
          const updatedMessages = hasOptimistic
            ? conv.messages.map((m) =>
                m.id.startsWith('msg-') && m.text === data.message.text ? data.message : m
              )
            : [...conv.messages, data.message];

          return {
            ...conv,
            lastMessage: data.message.text || '[Attachment]',
            lastMessageTime: 'Just now',
            messages: updatedMessages,
          };
        })
      );
    });

    // Real-time vendor notification across ANY order
    socket.on('conversation_deleted', (data: { orderId: string }) => {
      setConversations((prev) => {
        const updated = prev.filter((c) => c.id !== data.orderId);
        try {
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
        } catch {}
        return updated;
      });
      if (activeIdRef.current === data.orderId) {
        setConversations((prev) => {
          const remaining = prev.filter((c) => c.id !== data.orderId);
          setActiveConversationId(remaining.length > 0 ? remaining[0].id : '');
          return remaining;
        });
      }
    });

    socket.on('vendor_new_message', (data: { orderId: string; message: any }) => {
      setConversations((prev) => {
        const found = prev.some((c) => c.id === data.orderId);
        if (!found) {
          fetchConversations();
          return prev;
        }

        return prev.map((conv) => {
          if (conv.id !== data.orderId) return conv;
          const isCurrent = conv.id === activeIdRef.current;
          const exists = conv.messages.some((m) => m.id === data.message.id);
          const hasOptimistic = conv.messages.some(
            (m) =>
              m.id.startsWith('msg-') &&
              m.text === data.message.text &&
              m.sender === data.message.sender
          );
          const updatedMessages = exists
            ? conv.messages
            : hasOptimistic
            ? conv.messages.map((m) =>
                m.id.startsWith('msg-') && m.text === data.message.text ? data.message : m
              )
            : [...conv.messages, data.message];

          return {
            ...conv,
            lastMessage: data.message.text || '[Attachment]',
            lastMessageTime: 'Just now',
            unreadCount: isCurrent
              ? 0
              : (conv.unreadCount || 0) + (data.message.sender === 'customer' ? 1 : 0),
            messages: updatedMessages,
          };
        });
      });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, []);

  // When active conversation changes, join order room
  useEffect(() => {
    if (socketRef.current?.connected && activeConversationId) {
      socketRef.current.emit('join_order', { orderId: activeConversationId });
    }
  }, [activeConversationId]);

  // Select conversation and mark its messages as read
  const handleSelectConversation = async (id: string) => {
    setActiveConversationId(id);
    setConversations((prev) =>
      prev.map((c) =>
        c.id === id ? { ...c, unreadCount: 0 } : c
      )
    );

    // Call API to mark as read
    try {
      await fetch(`${API_BASE_URL}/orders/${id}/messages/read?role=vendor`, {
        method: 'PATCH',
      });
    } catch {}
  };

  // Vendor sending message
  const handleSendMessage = async (
    conversationId: string, 
    text: string, 
    attachment?: ChatAttachment
  ) => {
    const nowTime = new Date().toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: 'vendor',
      text,
      timestamp: nowTime,
      attachment,
      isRead: true,
    };

    // Optimistically update conversation UI
    setConversations((prev) =>
      prev.map((c) => {
        if (c.id !== conversationId) return c;
        return {
          ...c,
          lastMessageTime: 'Just now',
          messages: [...c.messages, newMsg],
        };
      })
    );

    // Send message via Socket.IO for real-time delivery with REST fallback
    if (socketRef.current?.connected) {
      socketRef.current.emit('send_message', {
        orderId: conversationId,
        sender: 'vendor',
        senderName: 'Green Agri Vendor Hub',
        text,
        attachment: attachment
          ? {
              name: attachment.name,
              type: attachment.type,
              dataUrl: attachment.url,
              size: attachment.size,
            }
          : undefined,
      });
    } else {
      try {
        await fetch(`${API_BASE_URL}/orders/${conversationId}/messages`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            sender: 'vendor',
            senderName: 'Green Agri Vendor Hub',
            text,
            attachment: attachment
              ? {
                  name: attachment.name,
                  type: attachment.type,
                  dataUrl: attachment.url,
                  size: attachment.size,
                }
              : undefined,
          }),
        });
      } catch (err) {
        console.warn('Could not post vendor message via REST:', err);
      }
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    try {
      await fetch(`${API_BASE_URL}/vendor/support/conversations/${conversationId}`, {
        method: 'DELETE',
      });
    } catch (err) {
      console.warn('Could not delete remote conversation:', err);
    }

    setConversations((prev) => {
      const updated = prev.filter((c) => c.id !== conversationId);
      try {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      } catch {}
      return updated;
    });

    if (activeConversationId === conversationId) {
      setConversations((prev) => {
        const remaining = prev.filter((c) => c.id !== conversationId);
        setActiveConversationId(remaining.length > 0 ? remaining[0].id : '');
        return remaining;
      });
    }
  };

  const activeConversation =
    conversations.find((c) => c.id === activeConversationId) || conversations[0] || null;

  return (
    <div className="w-full font-['Inter'] animate-in fade-in duration-200">
      {/* Direct Customer Messaging Center - Clean Full Height View */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col md:flex-row h-[calc(100vh-140px)] min-h-[600px]">
        {/* Side List: Users who messaged */}
        <VendorChatSidebar
          conversations={conversations}
          activeConversationId={activeConversationId}
          onSelectConversation={handleSelectConversation}
          onDeleteConversation={handleDeleteConversation}
        />

        {/* Active Chat Area: Message Box with text & file attachments */}
        <VendorChatArea
          conversation={activeConversation}
          onSendMessage={handleSendMessage}
        />
      </div>
    </div>
  );
};

export default VendorSupport;
