import React from 'react';
import { X, FileText, Paperclip, CheckSquare, Send } from 'lucide-react';
import type { SupportTicket } from '../../../pages/adminPages/AdminSupport';

interface SupportReplyDrawerProps {
  selectedTicket: SupportTicket | null;
  onClose: () => void;
  getInitials: (name: string) => string;
  messagesEndRef: React.RefObject<HTMLDivElement | null>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  attachedFile: string | null;
  setAttachedFile: (file: string | null) => void;
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  replyInput: string;
  setReplyInput: (val: string) => void;
  handleSendReply: (e?: React.FormEvent) => void;
  handleToggleResolved: () => void;
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
  handleToggleResolved
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
              onClick={onClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              title="Close panel"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* User Profile Banner Card */}
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

          {/* Two Action Buttons Row */}
          <div className="grid grid-cols-2 gap-3.5">
            <button
              type="button"
              onClick={handleToggleResolved}
              className="py-3 px-5 rounded-2xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-sm flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-[0.99]"
            >
              <CheckSquare className="w-4 h-4 text-slate-700" />
              <span>{selectedTicket.status === 'Resolved' ? 'Mark as Open' : 'Mark Resolved'}</span>
            </button>

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
  );
};
