import React from 'react';
import { X, Paperclip, Send, Store, Mail, Phone, FileText, Download } from 'lucide-react';
import {
  type VendorSupportTicket,
  type TicketStatus,
  type SupportAttachment,
  isImageAttachment,
  getAttachmentUrl,
  getAttachmentDisplayName
} from '../../../services/vendorAdminSupportService';

interface SupportReplyDrawerProps {
  selectedTicket: VendorSupportTicket | null;
  onClose: () => void;
  getInitials: (name?: string) => string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  attachedFile: SupportAttachment | null;
  setAttachedFile: (file: SupportAttachment | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  replyInput: string;
  setReplyInput: (val: string) => void;
  handleSendReply: (e?: React.FormEvent) => void;
  handleToggleResolved: () => void;
  onStatusChange?: (status: TicketStatus) => void;
}

export const SupportReplyDrawer: React.FC<SupportReplyDrawerProps> = ({
  selectedTicket,
  onClose,
  getInitials,
  messagesEndRef,
  fileInputRef,
  attachedFile,
  setAttachedFile,
  handleFileChange,
  replyInput,
  setReplyInput,
  handleSendReply,
  handleToggleResolved,
  onStatusChange
}) => {
  if (!selectedTicket) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop blur overlay */}
      <div 
        className="absolute inset-0 bg-slate-900/40 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={onClose}
      />

      {/* Right Sliding Drawer */}
      <div className="absolute inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl flex flex-col h-full animate-in slide-in-from-right duration-300 ease-out z-10">
        {/* Header: Subject, Submitted Time, Status Dropdown & Close */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-start justify-between gap-4 shrink-0 bg-white">
          <div className="flex flex-col">
            <div className="flex items-center gap-2 flex-wrap mb-1">
              <span className="font-mono text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                {selectedTicket.id}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700">
                {selectedTicket.category}
              </span>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-200/60">
                Priority: {selectedTicket.priority}
              </span>
            </div>
            <h2 className="text-base font-bold text-slate-900 leading-snug tracking-tight">
              {selectedTicket.subject}
            </h2>
            <span className="text-xs text-slate-400 mt-0.5">
              Submitted {selectedTicket.submittedTime}
            </span>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Status Selector */}
            {onStatusChange ? (
              <select
                value={selectedTicket.status}
                onChange={(e) => onStatusChange(e.target.value as TicketStatus)}
                className="py-1 px-2.5 rounded-full text-xs font-semibold border border-slate-200 bg-slate-50 text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#062E35]/20"
              >
                <option value="Open">🟢 Open</option>
                
                <option value="Resolved">⚪ Resolved</option>
              </select>
            ) : (
              <button
                type="button"
                onClick={handleToggleResolved}
                className={`px-3 py-1 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                  selectedTicket.status === 'Resolved'
                    ? 'bg-slate-100 text-slate-700'
                    : 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                }`}
              >
                {selectedTicket.status}
              </button>
            )}

            <button 
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Vendor Profile Banner Card */}
        <div className="px-6 py-3.5 bg-slate-50/80 border-b border-slate-100 shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-[#062E35] text-white font-bold text-sm flex items-center justify-center shrink-0 shadow-xs">
              {getInitials(selectedTicket.vendorName || selectedTicket.storeName || 'Vendor')}
            </div>
            <div className="flex flex-col min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-bold text-slate-900 text-sm leading-tight">
                  {selectedTicket.vendorName}
                </span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                  <Store className="w-3 h-3" />
                  {selectedTicket.storeName}
                </span>
              </div>
              <div className="flex items-center gap-3 mt-1 text-xs text-slate-500 flex-wrap">
                <span className="flex items-center gap-1 truncate">
                  <Mail className="w-3 h-3 text-slate-400" />
                  {selectedTicket.email}
                </span>
                {selectedTicket.phone && (
                  <span className="flex items-center gap-1 truncate">
                    <Phone className="w-3 h-3 text-slate-400" />
                    {selectedTicket.phone}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Conversation Stream */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-slate-50/30">
          {(selectedTicket.messages || []).map((msg) => {
            const isAdminSelf = msg.authorRole === 'Admin';
            return (
              <div 
                key={msg.id} 
                className={`flex flex-col ${isAdminSelf ? 'items-end' : 'items-start'} gap-1`}
              >
                {/* Author row */}
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-semibold text-slate-700">{msg.author}</span>
                  <span>•</span>
                  <span>{msg.time}</span>
                </div>

                {/* Bubble */}
                <div 
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-xs ${
                    isAdminSelf
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
                              isAdminSelf ? 'text-white/75' : 'text-slate-400'
                            }`}
                          >
                            <span className="truncate max-w-[200px]">{displayName}</span>
                            <a
                              href={fileUrl}
                              target="_blank"
                              rel="noreferrer"
                              download={displayName}
                              className={`hover:underline ml-2 font-medium ${
                                isAdminSelf ? 'text-white' : 'text-emerald-700'
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
                          isAdminSelf
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
                This ticket has been marked as Resolved.
              </p>
              <p className="text-[11px] text-slate-500">
                The conversation is closed. To resume chat, change the status above to "Open".
              </p>
            </div>
          ) : (
            <>
              {attachedFile && (
                <div className="mb-2 p-2 bg-slate-50 border border-slate-200/80 rounded-xl flex items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2.5 min-w-0">
                    {attachedFile.type === 'image' ? (
                      <img
                        src={attachedFile.url}
                        alt={attachedFile.name}
                        className="w-10 h-10 rounded-lg object-cover border border-slate-200 shrink-0"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0">
                        <FileText className="w-5 h-5" />
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="font-semibold text-slate-800 truncate">{attachedFile.name}</span>
                      {attachedFile.size && (
                        <span className="text-[11px] text-slate-400">{attachedFile.size}</span>
                      )}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setAttachedFile(null)}
                    className="w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors cursor-pointer shrink-0"
                    title="Remove attachment"
                  >
                    ×
                  </button>
                </div>
              )}

              <form onSubmit={handleSendReply} className="flex items-end gap-2">
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*,.pdf,.doc,.docx,.txt,.zip"
                  onChange={handleFileChange} 
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
                  placeholder={attachedFile ? 'Add a message (optional)...' : 'Reply to vendor as Krisikunjo Admin...'}
                  value={replyInput}
                  onChange={(e) => setReplyInput(e.target.value)}
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
                  disabled={!replyInput.trim() && !attachedFile}
                  className="p-2.5 rounded-xl bg-[#062E35] text-white hover:bg-[#0E4F5A] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer shadow-xs"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2 px-1">
                <span>Press Enter to send, Shift+Enter for new line</span>
                <span>Vendor receives updates in their Admin Support panel</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
