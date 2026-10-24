import React, { useState, useRef, useEffect } from 'react';
import { 
  Paperclip, 
  Send, 
  FileText, 
  Download, 
  X, 
  ArrowLeft 
} from 'lucide-react';
import type { CustomerConversation, ChatAttachment } from './types';

interface VendorChatAreaProps {
  conversation: CustomerConversation | null;
  onSendMessage: (conversationId: string, text: string, attachment?: ChatAttachment) => void;
  onBackToList?: () => void;
}

export const VendorChatArea: React.FC<VendorChatAreaProps> = ({
  conversation,
  onSendMessage,
  onBackToList,
}) => {
  const [inputText, setInputText] = useState('');
  const [attachedFile, setAttachedFile] = useState<ChatAttachment | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, conversation?.id]);

  if (!conversation) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400 bg-white font-['Inter']">
        <p className="text-sm">Select a conversation to start messaging</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isImg = file.type.startsWith('image/');
    const reader = new FileReader();

    reader.onload = () => {
      const result = reader.result as string;
      const sizeFormatted = file.size > 1024 * 1024
        ? `${(file.size / (1024 * 1024)).toFixed(1)} MB`
        : `${Math.round(file.size / 1024)} KB`;

      setAttachedFile({
        name: file.name,
        url: result,
        type: isImg ? 'image' : 'file',
        size: sizeFormatted,
      });
    };

    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputText.trim() && !attachedFile) return;

    onSendMessage(
      conversation.id,
      inputText.trim(),
      attachedFile || undefined
    );

    setInputText('');
    setAttachedFile(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50/50 font-['Inter'] relative min-w-0">
      {/* Clean Header */}
      <div className="p-3.5 bg-white border-b border-slate-200/80 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3 min-w-0">
          {onBackToList && (
            <button
              type="button"
              onClick={onBackToList}
              className="md:hidden p-1.5 rounded-lg text-slate-500 hover:bg-slate-100"
              title="Back"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
          )}

          <div
            className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-xs select-none shrink-0"
            style={{ backgroundColor: conversation.avatarColor }}
          >
            {conversation.customerInitials}
          </div>

          <div className="flex flex-col min-w-0">
            <span className="font-semibold text-slate-900 text-xs truncate">
              {conversation.customerName}
            </span>
            <span className="text-[11px] text-slate-400">
              {conversation.isOnline ? 'Online' : conversation.customerPhone || 'Offline'}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Stream */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 flex flex-col gap-3">
        {conversation.messages.map((msg) => {
          const isMe = msg.sender === 'vendor';

          return (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[80%] sm:max-w-[65%] ${
                isMe ? 'self-end items-end' : 'self-start items-start'
              }`}
            >
              <div
                className={`px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                  isMe
                    ? 'bg-[#062E35] text-white rounded-br-xs'
                    : 'bg-white text-slate-800 border border-slate-200/70 rounded-bl-xs'
                }`}
              >
                {msg.text && (
                  <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                )}

                {/* Attached Image */}
                {msg.attachment?.type === 'image' && (
                  <div className="mt-2 rounded-xl overflow-hidden">
                    <img
                      src={msg.attachment.url}
                      alt={msg.attachment.name}
                      className="max-h-52 w-auto object-cover rounded-lg cursor-pointer"
                      onClick={() => window.open(msg.attachment?.url, '_blank')}
                    />
                  </div>
                )}

                {/* Attached Document */}
                {msg.attachment?.type === 'file' && (
                  <a
                    href={msg.attachment.url}
                    download={msg.attachment.name}
                    className={`mt-2 p-2.5 rounded-xl flex items-center gap-2.5 text-xs ${
                      isMe
                        ? 'bg-white/10 hover:bg-white/20 text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-800'
                    }`}
                  >
                    <FileText className="w-4 h-4 shrink-0" />
                    <span className="truncate flex-1 font-medium">
                      {msg.attachment.name}
                    </span>
                    <Download className="w-3.5 h-3.5 shrink-0 opacity-70" />
                  </a>
                )}
              </div>

              <span className="text-[10px] text-slate-400 mt-1 px-1">
                {msg.timestamp}
              </span>
            </div>
          );
        })}

        <div ref={messagesEndRef} />
      </div>

      {/* Attachment Preview Banner */}
      {attachedFile && (
        <div className="mx-4 p-2.5 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-sm">
          <div className="flex items-center gap-2.5 min-w-0">
            {attachedFile.type === 'image' ? (
              <img
                src={attachedFile.url}
                alt="Preview"
                className="w-10 h-10 object-cover rounded-lg shrink-0"
              />
            ) : (
              <div className="w-9 h-9 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center shrink-0">
                <FileText className="w-4 h-4" />
              </div>
            )}
            <div className="flex flex-col min-w-0">
              <span className="text-xs font-medium text-slate-900 truncate">
                {attachedFile.name}
              </span>
              <span className="text-[10px] text-slate-400">{attachedFile.size}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setAttachedFile(null)}
            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Clean Input Bar */}
      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-slate-200/80 flex items-center gap-2 shrink-0"
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*,.pdf,.doc,.docx,.txt"
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
          title="Attach file or photo"
        >
          <Paperclip className="w-4 h-4" />
        </button>

        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Write a message..."
          className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-[#062E35] transition-all"
        />

        <button
          type="submit"
          disabled={!inputText.trim() && !attachedFile}
          className={`p-2.5 rounded-xl transition-all cursor-pointer ${
            inputText.trim() || attachedFile
              ? 'bg-[#062E35] hover:bg-[#0A3F47] text-white shadow-2xs'
              : 'bg-slate-100 text-slate-400 cursor-not-allowed'
          }`}
          title="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
