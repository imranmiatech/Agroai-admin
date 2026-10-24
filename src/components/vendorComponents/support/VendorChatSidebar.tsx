import React, { useState } from 'react';
import { Search, Paperclip, Trash2 } from 'lucide-react';
import type { CustomerConversation } from './types';

interface VendorChatSidebarProps {
  conversations: CustomerConversation[];
  activeConversationId: string;
  onSelectConversation: (id: string) => void;
  onDeleteConversation?: (id: string) => void;
}

export const VendorChatSidebar: React.FC<VendorChatSidebarProps> = ({
  conversations,
  activeConversationId,
  onSelectConversation,
  onDeleteConversation,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredConversations = conversations.filter((conv) => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      conv.customerName.toLowerCase().includes(term) ||
      (conv.customerPhone || '').toLowerCase().includes(term) ||
      conv.messages.some((m) => m.text.toLowerCase().includes(term))
    );
  });

  return (
    <div className="flex flex-col h-full bg-white border-r border-slate-200/80 w-full md:w-72 lg:w-80 shrink-0 font-['Inter']">
      {/* Simple Search Header */}
      <div className="p-3.5 border-b border-slate-100">
        <div className="relative w-full">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search conversations..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70 text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#062E35] focus:bg-white transition-all"
          />
        </div>
      </div>

      {/* Clean Contact List */}
      <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
        {filteredConversations.length === 0 ? (
          <div className="p-8 text-center text-slate-400">
            <p className="text-xs">No customer messages yet</p>
          </div>
        ) : (
          filteredConversations.map((conv) => {
            const isActive = conv.id === activeConversationId;
            const lastMessage = conv.messages[conv.messages.length - 1];

            return (
              <div
                key={conv.id}
                onClick={() => onSelectConversation(conv.id)}
                className={`group p-3 flex items-center gap-3 cursor-pointer transition-colors relative ${
                  isActive
                    ? 'bg-slate-100/80'
                    : 'hover:bg-slate-50/80'
                }`}
              >
                {/* Circular Avatar with online dot */}
                <div className="relative shrink-0">
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold text-xs select-none"
                    style={{ backgroundColor: conv.avatarColor }}
                  >
                    {conv.customerInitials}
                  </div>
                  {conv.isOnline && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-white" />
                  )}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="font-semibold text-slate-900 text-xs truncate">
                      {conv.customerName}
                    </span>
                    <div className="flex items-center gap-1">
                      <span className="text-[11px] text-slate-400 shrink-0">
                        {conv.lastMessageTime}
                      </span>
                      {onDeleteConversation && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (window.confirm('Delete this customer conversation?')) {
                              onDeleteConversation(conv.id);
                            }
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all cursor-pointer"
                          title="Delete conversation"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <p className="text-xs text-slate-500 truncate flex items-center gap-1">
                      {lastMessage?.attachment && (
                        <Paperclip className="w-3 h-3 text-slate-400 shrink-0" />
                      )}
                      <span className="truncate">
                        {lastMessage?.text || (lastMessage?.attachment ? 'Attachment' : '')}
                      </span>
                    </p>

                    {conv.unreadCount > 0 && (
                      <span className="w-4 h-4 rounded-full bg-[#062E35] text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
