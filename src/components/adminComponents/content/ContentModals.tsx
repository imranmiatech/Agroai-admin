import React from 'react';
import { 
  Trash2, 
  X, 
  Clock, 
  Calendar 
} from 'lucide-react';
import type { ContentItem } from '../../../redux';

// Markdown Viewer Component for previewing and reading formatted blog articles
export const MarkdownViewer: React.FC<{ content: string }> = ({ content }) => {
  if (!content || !content.trim()) {
    return <p className="text-slate-400 italic text-sm">No markdown content written yet.</p>;
  }

  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: string[] = [];

  const flushList = (keyPrefix: string) => {
    if (currentList.length > 0) {
      elements.push(
        <ul key={`${keyPrefix}-list`} className="space-y-1.5 my-3 pl-5 list-disc text-slate-700 text-sm">
          {currentList.map((item, idx) => (
            <li key={idx} dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(item) }} />
          ))}
        </ul>
      );
      currentList = [];
    }
  };

  const formatInlineMarkdown = (text: string) => {
    return text
      .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>')
      .replace(/\*(.*?)\*/g, '<em class="italic text-slate-800">$1</em>')
      .replace(/`([^`]+)`/g, '<code class="bg-slate-100 px-1.5 py-0.5 rounded text-xs text-emerald-800 font-mono font-medium">$1</code>')
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer" class="text-[#0E4F5A] font-semibold underline hover:text-[#062E35]">$1</a>');
  };

  lines.forEach((line, index) => {
    const trimmed = line.trim();

    // Media tag: ![alt](url)
    const mediaMatch = trimmed.match(/^!\[(.*?)\]\((.*?)\)$/);
    if (mediaMatch) {
      flushList(`flush-${index}`);
      const alt = mediaMatch[1];
      const url = mediaMatch[2];

      // 1. Check if YouTube URL
      const ytMatch = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([\w-]{11})/);
      if (ytMatch) {
        elements.push(
          <div key={index} className="my-5">
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden shadow-sm border border-slate-200 bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${ytMatch[1]}`}
                title={alt || 'Video player'}
                className="absolute inset-0 w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
            {alt && (
              <span className="text-xs text-slate-400 block text-center mt-2 font-medium">
                {alt}
              </span>
            )}
          </div>
        );
        return;
      }

      // 2. Check if Video file (.mp4, .webm, .ogg, .mov or data:video)
      const isVideo = url.startsWith('data:video') || /\.(mp4|webm|ogg|mov)(\?.*)?$/i.test(url);
      if (isVideo) {
        elements.push(
          <div key={index} className="my-5">
            <video
              src={url}
              controls
              className="w-full max-h-96 rounded-2xl shadow-sm border border-slate-200 bg-black object-contain"
            />
            {alt && (
              <span className="text-xs text-slate-400 block text-center mt-2 font-medium">
                {alt}
              </span>
            )}
          </div>
        );
        return;
      }

      // 3. Otherwise render as Image
      elements.push(
        <div key={index} className="my-5">
          <img 
            src={url} 
            alt={alt} 
            className="w-full max-h-96 object-cover rounded-2xl shadow-sm border border-slate-200" 
          />
          {alt && (
            <span className="text-xs text-slate-400 block text-center mt-2 font-medium">
              {alt}
            </span>
          )}
        </div>
      );
      return;
    }

    // Headings
    if (trimmed.startsWith('### ')) {
      flushList(`flush-${index}`);
      elements.push(
        <h3 key={index} className="text-base sm:text-lg font-bold text-slate-900 mt-5 mb-2 leading-snug">
          {trimmed.replace('### ', '')}
        </h3>
      );
      return;
    }
    if (trimmed.startsWith('## ')) {
      flushList(`flush-${index}`);
      elements.push(
        <h2 key={index} className="text-lg sm:text-xl font-bold text-slate-900 mt-6 mb-2.5 leading-tight">
          {trimmed.replace('## ', '')}
        </h2>
      );
      return;
    }
    if (trimmed.startsWith('# ')) {
      flushList(`flush-${index}`);
      elements.push(
        <h1 key={index} className="text-xl sm:text-2xl font-bold text-slate-900 mt-7 mb-3 leading-tight">
          {trimmed.replace('# ', '')}
        </h1>
      );
      return;
    }

    // Blockquote
    if (trimmed.startsWith('> ')) {
      flushList(`flush-${index}`);
      elements.push(
        <blockquote key={index} className="border-l-4 border-[#062E35] pl-4 py-2 my-3 text-slate-700 italic bg-slate-50/80 rounded-r-xl text-sm leading-relaxed">
          {trimmed.replace('> ', '')}
        </blockquote>
      );
      return;
    }

    // Unordered List item
    if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
      currentList.push(trimmed.slice(2));
      return;
    }

    // Blank line
    if (!trimmed) {
      flushList(`flush-${index}`);
      return;
    }

    // Regular paragraph
    flushList(`flush-${index}`);
    elements.push(
      <p
        key={index}
        className="text-sm sm:text-base text-slate-700 leading-relaxed my-2.5"
        dangerouslySetInnerHTML={{ __html: formatInlineMarkdown(trimmed) }}
      />
    );
  });

  flushList('final');
  return <div className="space-y-1 font-['Inter']">{elements}</div>;
};

interface ContentModalsProps {
  viewingItem: ContentItem | null;
  setViewingItem: (item: ContentItem | null) => void;
  onEdit: (item: ContentItem) => void;
  itemToDelete: ContentItem | null;
  setItemToDelete: (item: ContentItem | null) => void;
  handleConfirmDelete: () => void;
}

export const ContentModals: React.FC<ContentModalsProps> = ({
  viewingItem,
  setViewingItem,
  onEdit,
  itemToDelete,
  setItemToDelete,
  handleConfirmDelete
}) => {
  return (
    <>
      {/* 1. Article Details / Preview Modal (Styled matching KrishiKunjo Blog Details) */}
      {viewingItem && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 sm:p-6 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 flex flex-col max-h-[92vh] overflow-hidden animate-in zoom-in-95 duration-150">
            {/* Modal Top Bar */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white shrink-0">
              <span className="text-xs font-semibold px-3 py-1 rounded-full bg-[#E2ECEE] text-[#062E35]">
                {viewingItem.category}
              </span>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                  viewingItem.status === 'Published' 
                    ? 'bg-emerald-50 text-emerald-600' 
                    : 'bg-slate-100 text-slate-600'
                }`}>
                  {viewingItem.status}
                </span>
                <button 
                  type="button"
                  onClick={() => setViewingItem(null)}
                  className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer ml-1"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Blog Article Body */}
            <div className="overflow-y-auto px-6 sm:px-10 py-6 space-y-6">
              {/* Blog Title */}
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                {viewingItem.title}
              </h1>

              {/* Author & Meta Row */}
              <div className="flex items-center justify-between flex-wrap gap-4 pb-4 border-b border-slate-100">
                <div className="flex items-center gap-3">
                  {viewingItem.author?.avatar ? (
                    <img
                      src={viewingItem.author.avatar}
                      alt={viewingItem.author.name || 'Author'}
                      className="w-10 h-10 rounded-full object-cover border-2 border-emerald-500/20 shadow-xs shrink-0"
                    />
                  ) : (
                    <div className="w-10 h-10 rounded-full bg-[#062E35] text-white flex items-center justify-center font-bold text-sm shrink-0">
                      {(viewingItem.author?.name || 'A').charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 leading-tight">
                      {viewingItem.author?.name || 'Author'}
                    </h4>
                    {viewingItem.author?.role && (
                      <p className="text-xs text-slate-400 leading-tight mt-0.5">
                        {viewingItem.author.role}
                      </p>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                  {viewingItem.readTime && (
                    <>
                      <div className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>{viewingItem.readTime}</span>
                      </div>
                      <span>•</span>
                    </>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span>
                      {viewingItem.lastUpdated ||
                        (viewingItem.updatedAt
                          ? new Date(viewingItem.updatedAt).toLocaleDateString('en-GB', {
                              day: 'numeric',
                              month: 'short',
                              year: 'numeric',
                            })
                          : '—')}
                    </span>
                  </div>
                </div>
              </div>

              {/* Featured Cover Image */}
              {viewingItem.coverImage && (
                <div className="w-full rounded-2xl overflow-hidden shadow-xs border border-slate-200/80">
                  <img
                    src={viewingItem.coverImage}
                    alt={viewingItem.title}
                    className="w-full max-h-[380px] object-cover"
                  />
                </div>
              )}

              {/* Excerpt / Summary Banner */}
              {viewingItem.description && (
                <p className="text-base text-slate-700 italic border-l-4 border-emerald-500 pl-4 py-1.5 bg-emerald-50/50 rounded-r-xl">
                  {viewingItem.description}
                </p>
              )}

              {/* Markdown Rendered Content */}
              <div className="pt-2">
                <MarkdownViewer content={viewingItem.content} />
              </div>
            </div>

            {/* Modal Bottom Footer Actions */}
            <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100 bg-slate-50/50 shrink-0">
              <span className="text-xs text-slate-400">
                Article ID: <strong className="text-slate-600">{viewingItem.id}</strong>
              </span>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setViewingItem(null)}
                  className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer text-xs font-semibold"
                >
                  Close
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const item = viewingItem;
                    setViewingItem(null);
                    onEdit(item);
                  }}
                  className="px-5 py-2 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-98"
                >
                  Edit Article
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Delete Confirmation Modal */}
      {itemToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-[#FEE4E2] flex items-center justify-center mb-5 shrink-0">
              <Trash2 className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              Delete Article?
            </h3>

            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              Are you sure you want to delete <strong className="text-slate-800">"{itemToDelete.title}"</strong>? This action cannot be undone.
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setItemToDelete(null)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95 bg-[#B42318]"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
