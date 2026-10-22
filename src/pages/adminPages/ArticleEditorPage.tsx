import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  ArrowLeft, 
  Save, 
  Send, 
  Eye, 
  Code2, 
  Heading1, 
  Heading2, 
  Heading3, 
  Bold, 
  Italic, 
  List, 
  Quote, 
  Image as ImageIcon,
  Video,
  Upload,
  Link as LinkIcon,
  CheckCircle2,
  Clock,
  User,
    X,
      Globe
} from 'lucide-react';
import {
  useGetArticleByIdQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useAppSelector,
  CONTENT_CATEGORIES,
  type CreateArticlePayload,
} from '../../redux';
import { MarkdownViewer } from '../../components/adminComponents/content/ContentModals';

// Client-side image compression to optimize storage & rendering
const compressImageFile = (file: File): Promise<string> => {
  return new Promise((resolve) => {
    if (file.type === 'image/svg+xml' || file.type === 'image/gif' || file.size < 250 * 1024) {
      const reader = new FileReader();
      reader.onload = (e) => resolve(e.target?.result as string);
      reader.readAsDataURL(file);
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.src = event.target?.result as string;
      img.onload = () => {
        const maxWidth = 1280;
        const maxHeight = 850;
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx?.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.85));
      };
      img.onerror = () => {
        resolve(event.target?.result as string);
      };
    };
    reader.readAsDataURL(file);
  });
};

// Video file reader
const readVideoFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target?.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export const ArticleEditorPage: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);

  // Redux auth state (current logged-in admin user)
  const currentUser = useAppSelector((state) => state.auth.user);

  // RTK Query Mutations
  const [createArticle, { isLoading: isCreating }] = useCreateArticleMutation();
  const [updateArticle, { isLoading: isUpdating }] = useUpdateArticleMutation();
  const { data: existingData, isLoading: _isLoadingArticle } = useGetArticleByIdQuery(id || '', {
    skip: !isEditMode || !id,
  });

  // Hidden File Input Refs
  const editorImageInputRef = useRef<HTMLInputElement>(null);
  const editorVideoInputRef = useRef<HTMLInputElement>(null);
  const coverImageInputRef = useRef<HTMLInputElement>(null);
  const authorAvatarInputRef = useRef<HTMLInputElement>(null);

  // Form State - Clean real values without dummy data
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState(CONTENT_CATEGORIES[0] || 'Clean Energy');
  const [customCategory, setCustomCategory] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [readTime, setReadTime] = useState('');
  const [authorName, setAuthorName] = useState(currentUser?.name || '');
  const [authorRole, setAuthorRole] = useState(
    currentUser?.role === 'ADMIN' ? 'Administrator' : currentUser?.role || ''
  );
  const [authorAvatar, setAuthorAvatar] = useState(currentUser?.avatar || '');
  const [coverImage, setCoverImage] = useState('');
  const [status, setStatus] = useState<'Published' | 'Draft'>('Published');

  // UI state
  const [viewTab, setViewTab] = useState<'write' | 'preview'>('write');
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Media Inserter Modal State
  const [mediaModalOpen, setMediaModalOpen] = useState(false);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaSourceType, setMediaSourceType] = useState<'file' | 'url'>('file');
  const [mediaCaption, setMediaCaption] = useState('');
  const [mediaUrlInput, setMediaUrlInput] = useState('');
  const [mediaFilePreview, setMediaFilePreview] = useState<string | null>(null);
  const [_isProcessingMedia, setIsProcessingMedia] = useState(false);

  // Set author information from logged-in admin if creating new article
  useEffect(() => {
    if (!isEditMode && currentUser) {
      if (!authorName && currentUser.name) setAuthorName(currentUser.name);
      if (!authorRole) setAuthorRole(currentUser.role === 'ADMIN' ? 'Administrator' : currentUser.role || '');
      if (!authorAvatar && currentUser.avatar) setAuthorAvatar(currentUser.avatar);
    }
  }, [currentUser, isEditMode]);

  // Load existing article from database if editing
  useEffect(() => {
    if (isEditMode && existingData?.data) {
      const existing = existingData.data;
      setTitle(existing.title || '');
      setCategory(CONTENT_CATEGORIES.includes(existing.category) ? existing.category : 'Other');
      if (!CONTENT_CATEGORIES.includes(existing.category)) {
        setCustomCategory(existing.category);
      }
      setDescription(existing.description || '');
      setContent(existing.content || '');
      setReadTime(existing.readTime || '');
      setAuthorName(existing.author?.name || '');
      setAuthorRole(existing.author?.role || '');
      setAuthorAvatar(existing.author?.avatar || '');
      setCoverImage(existing.coverImage || '');
      setStatus(existing.status === 'Draft' ? 'Draft' : 'Published');
    }
  }, [existingData, isEditMode]);

  // Insert text into editor at current cursor position
  const insertTextAtCursor = (textToInsert: string) => {
    const textarea = document.getElementById('article-markdown-editor') as HTMLTextAreaElement | null;
    if (!textarea) {
      setContent((prev) => prev + textToInsert);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const newContent = content.substring(0, start) + textToInsert + content.substring(end);
    setContent(newContent);

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(start + textToInsert.length, start + textToInsert.length);
    }, 50);
  };

  // Insert helper markdown syntax into textarea
  const insertMarkdown = (syntax: string, placeholder: string = '') => {
    const textarea = document.getElementById('article-markdown-editor') as HTMLTextAreaElement | null;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = content.substring(start, end) || placeholder;

    let insertion = '';
    if (syntax === 'H1') insertion = `\n# ${selectedText}\n`;
    else if (syntax === 'H2') insertion = `\n## ${selectedText}\n`;
    else if (syntax === 'H3') insertion = `\n### ${selectedText}\n`;
    else if (syntax === 'BOLD') insertion = `**${selectedText}**`;
    else if (syntax === 'ITALIC') insertion = `*${selectedText}*`;
    else if (syntax === 'LIST') insertion = `\n- ${selectedText}\n`;
    else if (syntax === 'QUOTE') insertion = `\n> ${selectedText}\n`;
    else if (syntax === 'LINK') insertion = `[${selectedText}](https://example.com)`;

    const newContent = content.substring(0, start) + insertion + content.substring(end);
    setContent(newContent);
  };

  // Direct Image File Selection Handler for Editor
  const handleEditorImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsProcessingMedia(true);
    try {
      const dataUrl = await compressImageFile(file);
      const caption = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      insertTextAtCursor(`\n![${caption}](${dataUrl})\n`);
      setToastMessage('Image inserted into markdown!');
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err) {
      console.error('Failed to read image', err);
    } finally {
      setIsProcessingMedia(false);
      if (e.target) e.target.value = '';
    }
  };

  // Direct Video File Selection Handler for Editor
  const handleEditorVideoSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 30 * 1024 * 1024) {
      alert('Video file is larger than 30MB. For large videos, we recommend pasting a YouTube link or streaming URL.');
    }

    setIsProcessingMedia(true);
    try {
      const dataUrl = await readVideoFile(file);
      const caption = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      insertTextAtCursor(`\n![${caption}](${dataUrl})\n`);
      setToastMessage('Video inserted into markdown!');
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err) {
      console.error('Failed to read video', err);
    } finally {
      setIsProcessingMedia(false);
      if (e.target) e.target.value = '';
    }
  };

  // Cover Image File Selection Handler
  const handleCoverImageSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await compressImageFile(file);
      setCoverImage(dataUrl);
      setToastMessage('Cover image updated!');
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err) {
      console.error('Failed to read cover image', err);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Author Avatar File Selection Handler
  const handleAuthorAvatarSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const dataUrl = await compressImageFile(file);
      setAuthorAvatar(dataUrl);
    } catch (err) {
      console.error('Failed to read avatar', err);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  // Drag and Drop media files directly onto the editor textarea
  const handleDropMedia = async (e: React.DragEvent<HTMLTextAreaElement>) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (!files.length) return;

    for (const file of files) {
      if (file.type.startsWith('image/')) {
        const dataUrl = await compressImageFile(file);
        const caption = file.name.replace(/\.[^/.]+$/, '');
        insertTextAtCursor(`\n![${caption}](${dataUrl})\n`);
      } else if (file.type.startsWith('video/')) {
        const dataUrl = await readVideoFile(file);
        const caption = file.name.replace(/\.[^/.]+$/, '');
        insertTextAtCursor(`\n![${caption}](${dataUrl})\n`);
      }
    }
  };

  // Media Modal submit handler
  const handleInsertFromModal = () => {
    const targetUrl = mediaSourceType === 'file' ? mediaFilePreview : mediaUrlInput.trim();
    if (!targetUrl) {
      alert(`Please select a ${mediaType} file or enter a valid URL.`);
      return;
    }

    const caption = mediaCaption.trim() || (mediaType === 'image' ? 'Featured Photo' : 'Video Presentation');
    insertTextAtCursor(`\n![${caption}](${targetUrl})\n`);

    // Reset and close
    setMediaModalOpen(false);
    setMediaCaption('');
    setMediaUrlInput('');
    setMediaFilePreview(null);
    setToastMessage(`${mediaType === 'image' ? 'Image' : 'Video'} inserted into markdown!`);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSave = async (publishStatus?: 'Published' | 'Draft') => {
    if (!title.trim()) {
      alert('Please enter an article title.');
      return;
    }

    setIsSubmitting(true);
    const finalCategory = category === 'Other' && customCategory.trim() ? customCategory.trim() : category;
    const finalStatus = publishStatus || status;

    const calculatedReadTime =
      readTime.trim() ||
      (content.trim()
        ? `${Math.max(1, Math.ceil(content.trim().split(/\s+/).length / 200))} min read`
        : '1 min read');

    const articlePayload: CreateArticlePayload = {
      title: title.trim(),
      category: finalCategory,
      description: description.trim() || undefined,
      content: content.trim() || `# ${title.trim()}`,
      readTime: calculatedReadTime,
      authorName: authorName.trim() || currentUser?.name || 'Administrator',
      authorRole: authorRole.trim() || (currentUser?.role === 'ADMIN' ? 'Administrator' : currentUser?.role || undefined),
      authorAvatar: authorAvatar.trim() || currentUser?.avatar || undefined,
      coverImage: coverImage.trim() || undefined,
      status: finalStatus,
    };

    try {
      if (isEditMode && id) {
        await updateArticle({ id, data: articlePayload }).unwrap();
        setToastMessage('Article updated in database successfully!');
      } else {
        await createArticle(articlePayload).unwrap();
        setToastMessage(`Article ${finalStatus === 'Published' ? 'published' : 'saved as draft'} in database successfully!`);
      }

      setTimeout(() => {
        navigate('/admin/content');
      }, 800);
    } catch (err: any) {
      console.error('Failed to save article in database:', err);
      alert(err?.data?.message || 'Failed to save article in database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-20 max-w-full mx-auto animate-in fade-in duration-200">
      {/* Hidden File Inputs for Device Selection */}
      <input 
        type="file" 
        ref={editorImageInputRef} 
        accept="image/*" 
        onChange={handleEditorImageSelected} 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={editorVideoInputRef} 
        accept="video/*" 
        onChange={handleEditorVideoSelected} 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={coverImageInputRef} 
        accept="image/*" 
        onChange={handleCoverImageSelected} 
        className="hidden" 
      />
      <input 
        type="file" 
        ref={authorAvatarInputRef} 
        accept="image/*" 
        onChange={handleAuthorAvatarSelected} 
        className="hidden" 
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-6 right-6 z-50 bg-[#062E35] text-white px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span className="text-sm font-semibold">{toastMessage}</span>
        </div>
      )}

      {/* 1. Header with Back Button and Quick Actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate('/admin/content')}
            className="w-10 h-10 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 flex items-center justify-center transition-all cursor-pointer shadow-2xs hover:shadow-xs active:scale-95"
            title="Back to Content Management"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              {isEditMode ? 'Edit Article' : 'Create New Article'}
            </h1>
            <p className="text-xs text-slate-400 mt-0.5">
              Write and publish formatted markdown articles with device image & video support
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
          <button
            type="button"
            disabled={isSubmitting || isCreating || isUpdating}
            onClick={() => handleSave('Draft')}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-all shadow-2xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Save className="w-3.5 h-3.5 text-slate-500" />
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            disabled={isSubmitting || isCreating || isUpdating}
            onClick={() => handleSave('Published')}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold transition-all shadow-xs cursor-pointer active:scale-95 disabled:opacity-50"
          >
            <Send className="w-3.5 h-3.5 text-emerald-400" />
            <span>{isEditMode ? 'Update & Publish' : 'Publish Article'}</span>
          </button>
        </div>
      </div>

      {/* 2. Main 2-Column Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Main Form & Markdown Editor (8 cols) */}
        <div className="lg:col-span-8 flex flex-col gap-6">
          {/* Card 1: Article Title & Excerpt */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs flex flex-col gap-5">
            <div>
              <label className="text-xs font-bold text-slate-800 tracking-tight block mb-1.5 uppercase">
                Article Title <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g., Wind Power: A Breath of Fresh Air for Clean Energy Enthusiasts"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-200 text-base font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#062E35] focus:ring-2 focus:ring-[#062E35]/15 transition-all"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-800 tracking-tight block mb-1.5 uppercase">
                Short Excerpt / Summary
              </label>
              <textarea
                rows={3}
                placeholder="A compelling introductory hook shown on feed cards and social previews..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-2xl border border-slate-200 text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#062E35] focus:ring-2 focus:ring-[#062E35]/15 transition-all resize-none leading-relaxed"
              />
            </div>
          </div>

          {/* Card 2: Markdown Editor & Live Preview */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between flex-wrap gap-3 pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-tight">
                  Article Body (Markdown Rules)
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 font-semibold border border-emerald-200/60">
                  Image & Video Enabled
                </span>
              </div>

              {/* View Mode Switcher Pills */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  type="button"
                  onClick={() => setViewTab('write')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewTab === 'write'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Write Markdown</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewTab('preview')}
                  className={`px-3.5 py-1.5 rounded-lg transition-all cursor-pointer flex items-center gap-1.5 ${
                    viewTab === 'preview'
                      ? 'bg-white text-slate-900 shadow-2xs font-bold'
                      : 'text-slate-500 hover:text-slate-900'
                  }`}
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Live Blog Preview</span>
                </button>
              </div>
            </div>

            {viewTab === 'write' ? (
              <div className={`flex flex-col border rounded-2xl overflow-hidden transition-all ${
                isDragging 
                  ? 'border-emerald-500 ring-4 ring-emerald-500/20 bg-emerald-50/20' 
                  : 'border-slate-200 focus-within:border-[#062E35] focus-within:ring-2 focus-within:ring-[#062E35]/15'
              }`}>
                {/* Markdown Formatting Action Toolbar */}
                <div className="flex items-center justify-between gap-1 p-2 bg-slate-50/90 border-b border-slate-200 text-slate-600 flex-wrap">
                  {/* Basic text formatting */}
                  <div className="flex items-center gap-0.5 flex-wrap">
                    <button
                      type="button"
                      onClick={() => insertMarkdown('H1', 'Main Heading')}
                      className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-700 transition-colors cursor-pointer"
                      title="Heading 1 (# Heading)"
                    >
                      <Heading1 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('H2', 'Section Subheading')}
                      className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-700 transition-colors cursor-pointer"
                      title="Heading 2 (## Heading)"
                    >
                      <Heading2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('H3', 'Minor Section')}
                      className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-700 transition-colors cursor-pointer"
                      title="Heading 3 (### Heading)"
                    >
                      <Heading3 className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertMarkdown('BOLD', 'bold text')}
                      className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-700 transition-colors cursor-pointer"
                      title="Bold (**text**)"
                    >
                      <Bold className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('ITALIC', 'italicized text')}
                      className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-700 transition-colors cursor-pointer"
                      title="Italic (*text*)"
                    >
                      <Italic className="w-4 h-4" />
                    </button>
                    <div className="w-[1px] h-4 bg-slate-300 mx-1" />
                    <button
                      type="button"
                      onClick={() => insertMarkdown('LIST', 'Key bullet takeaway')}
                      className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-700 transition-colors cursor-pointer"
                      title="Bullet List (- item)"
                    >
                      <List className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('QUOTE', 'Inspirational farm quote or rule')}
                      className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-700 transition-colors cursor-pointer"
                      title="Blockquote (> quote)"
                    >
                      <Quote className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => insertMarkdown('LINK', 'Link Title')}
                      className="p-1.5 rounded-lg hover:bg-slate-200/70 text-slate-700 transition-colors cursor-pointer"
                      title="Hyperlink ([text](url))"
                    >
                      <LinkIcon className="w-4 h-4" />
                    </button>
                  </div>

                  {/* MEDIA INSERTION BUTTONS (IMAGE & VIDEO FROM COMPUTER & WEB) */}
                  <div className="flex items-center gap-1.5 flex-wrap">
                    {/* Direct Image Pick from Computer */}
                    <button
                      type="button"
                      onClick={() => editorImageInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-semibold transition-all cursor-pointer border border-emerald-200/70 shadow-2xs"
                      title="Select and insert image from your computer"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Select Image</span>
                    </button>

                    {/* Direct Video Pick from Computer */}
                    <button
                      type="button"
                      onClick={() => editorVideoInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-800 text-xs font-semibold transition-all cursor-pointer border border-indigo-200/70 shadow-2xs"
                      title="Select and insert video file from your computer"
                    >
                      <Video className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Select Video</span>
                    </button>

                    {/* More Media Options (URL / YouTube / Captions) */}
                    <button
                      type="button"
                      onClick={() => {
                        setMediaType('image');
                        setMediaSourceType('file');
                        setMediaModalOpen(true);
                      }}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-all cursor-pointer border border-slate-200 shadow-2xs"
                      title="Open Media Inserter (Upload or paste online Image/Video/YouTube link)"
                    >
                      <Globe className="w-3.5 h-3.5 text-slate-500" />
                      <span>Web / YouTube</span>
                    </button>
                  </div>
                </div>

                {/* Textarea with Drag & Drop */}
                <div className="relative">
                  <textarea
                    id="article-markdown-editor"
                    rows={16}
                    required
                    placeholder={`# Write your story here...\n\nIn a world striving for green innovation, clean agricultural practices lead the charge.\n\n### Core Benefits\n- Photovoltaic power pumps water without cost.\n- Waste-to-energy preserves topsoil integrity.\n\n> "Empowering smallholders with renewable agricultural systems."\n\n![Field inspection](https://images.unsplash.com/photo-1592417817098-8f3d69109853?w=800)`}
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    onDragOver={(e) => {
                      e.preventDefault();
                      setIsDragging(true);
                    }}
                    onDragLeave={() => setIsDragging(false)}
                    onDrop={handleDropMedia}
                    className="w-full p-5 text-sm font-mono text-slate-800 bg-white focus:outline-none resize-y leading-relaxed"
                  />

                  {/* Drag-over overlay */}
                  {isDragging && (
                    <div className="absolute inset-0 bg-emerald-500/10 backdrop-blur-xs border-2 border-dashed border-emerald-500 rounded-2xl flex flex-col items-center justify-center text-emerald-800 pointer-events-none gap-2">
                      <Upload className="w-8 h-8 animate-bounce text-emerald-600" />
                      <span className="text-sm font-bold">Drop image or video here to insert</span>
                    </div>
                  )}
                </div>

                <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Tip: You can also drag & drop image/video files directly into the editor.</span>
                  <span>{content.length} characters</span>
                </div>
              </div>
            ) : (
              <div className="border border-slate-200 rounded-2xl p-6 sm:p-8 min-h-[420px] bg-slate-50/40">
                <div className="max-w-2xl mx-auto space-y-6">
                  {coverImage && (
                    <img
                      src={coverImage}
                      alt={title || 'Cover'}
                      className="w-full max-h-80 object-cover rounded-2xl shadow-xs border border-slate-200"
                    />
                  )}
                  <div className="space-y-2">
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-[#E2ECEE] text-[#062E35]">
                      {category === 'Other' ? customCategory || 'General' : category}
                    </span>
                    <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 leading-tight">
                      {title || 'Untitled Article'}
                    </h1>
                    <p className="text-xs text-slate-400">
                      By {authorName} · {readTime} · Last updated today
                    </p>
                  </div>
                  {description && (
                    <p className="text-sm text-slate-600 italic border-l-4 border-emerald-600 pl-4 py-1.5 bg-emerald-50/60 rounded-r-xl">
                      {description}
                    </p>
                  )}
                  <div className="pt-2">
                    <MarkdownViewer content={content} />
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Sidebar Settings (4 cols) */}
        <div className="lg:col-span-4 flex flex-col gap-6">
          {/* Card 1: Publish Status */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
              Publication Settings
            </span>

            <div className="flex flex-col gap-2.5">
              <label 
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  status === 'Published' 
                    ? 'border-emerald-500 bg-emerald-50/50 text-emerald-950 ring-1 ring-emerald-500/30' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pub_status"
                    checked={status === 'Published'}
                    onChange={() => setStatus('Published')}
                    className="accent-emerald-600 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold block">Published Live</span>
                    <span className="text-[11px] text-slate-500">Visible to all KrishiKunjo readers</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </label>

              <label 
                className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  status === 'Draft' 
                    ? 'border-amber-500 bg-amber-50/50 text-amber-950 ring-1 ring-amber-500/30' 
                    : 'border-slate-200 hover:bg-slate-50 text-slate-700'
                }`}
              >
                <div className="flex items-center gap-3">
                  <input
                    type="radio"
                    name="pub_status"
                    checked={status === 'Draft'}
                    onChange={() => setStatus('Draft')}
                    className="accent-amber-600 w-4 h-4"
                  />
                  <div>
                    <span className="text-xs font-bold block">Save as Draft</span>
                    <span className="text-[11px] text-slate-500">Only visible to administrators</span>
                  </div>
                </div>
                <span className="w-2 h-2 rounded-full bg-amber-500" />
              </label>
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>Estimated Read Time:</span>
              </span>
              <input
                type="text"
                value={readTime}
                onChange={(e) => setReadTime(e.target.value)}
                placeholder="5 min read"
                className="w-28 text-right font-semibold text-slate-800 bg-transparent border-b border-dashed border-slate-300 focus:outline-none focus:border-[#062E35]"
              />
            </div>
          </div>

          {/* Card 2: Category Selector */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-3">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
              Article Category
            </span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white focus:outline-none focus:border-[#062E35] cursor-pointer"
            >
              {CONTENT_CATEGORIES.map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
              <option value="Other">Custom Category...</option>
            </select>

            {category === 'Other' && (
              <input
                type="text"
                placeholder="Type custom category name..."
                value={customCategory}
                onChange={(e) => setCustomCategory(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#062E35] mt-1"
              />
            )}
          </div>

          {/* Card 3: Featured Cover Image */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
                Featured Cover Image
              </span>
              <button
                type="button"
                onClick={() => coverImageInputRef.current?.click()}
                className="text-[11px] font-semibold text-[#0E4F5A] hover:underline cursor-pointer flex items-center gap-1"
              >
                <Upload className="w-3 h-3" />
                <span>Upload from device</span>
              </button>
            </div>

            {coverImage ? (
              <div className="relative rounded-2xl overflow-hidden border border-slate-200 group">
                <img
                  src={coverImage}
                  alt="Cover preview"
                  className="w-full h-40 object-cover group-hover:scale-102 transition-transform duration-300"
                />
                <button
                  type="button"
                  onClick={() => setCoverImage('')}
                  className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors text-xs font-semibold cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <div 
                onClick={() => coverImageInputRef.current?.click()}
                className="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 hover:border-[#062E35] hover:bg-slate-50 transition-all flex flex-col items-center justify-center text-slate-400 gap-1.5 p-4 text-center cursor-pointer"
              >
                <ImageIcon className="w-6 h-6 text-slate-400" />
                <span className="text-xs font-semibold text-slate-600">Click to select cover photo</span>
                <span className="text-[10px] text-slate-400">Supports JPG, PNG, WebP</span>
              </div>
            )}

            <input
              type="url"
              placeholder="Or paste image URL (https://...)"
              value={coverImage}
              onChange={(e) => setCoverImage(e.target.value)}
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#062E35]"
            />
          </div>

          {/* Card 4: Author Profile Details */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-4">
            <span className="text-xs font-bold text-slate-800 uppercase tracking-tight block">
              Author Information
            </span>

            <div className="flex items-center gap-3">
              <div className="relative group cursor-pointer" onClick={() => authorAvatarInputRef.current?.click()}>
                {authorAvatar ? (
                  <img
                    src={authorAvatar}
                    alt={authorName}
                    className="w-12 h-12 rounded-full object-cover border border-slate-200 shadow-2xs shrink-0"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-base shrink-0">
                    <User className="w-5 h-5 text-slate-400" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <Upload className="w-3.5 h-3.5 text-white" />
                </div>
              </div>
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-slate-900 truncate">
                  {authorName || 'Unnamed Author'}
                </span>
                <span className="text-xs text-slate-400 truncate">
                  {authorRole || 'Contributor'}
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-2 pt-2 border-t border-slate-100 text-xs">
              <div>
                <label className="text-slate-600 block mb-1 font-medium">Author Name</label>
                <input
                  type="text"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  placeholder="e.g., Jane Doe"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#062E35]"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Role / Title</label>
                <input
                  type="text"
                  value={authorRole}
                  onChange={(e) => setAuthorRole(e.target.value)}
                  placeholder="e.g., Agricultural Specialist"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#062E35]"
                />
              </div>

              <div>
                <label className="text-slate-600 block mb-1 font-medium">Avatar Photo URL</label>
                <input
                  type="url"
                  value={authorAvatar}
                  onChange={(e) => setAuthorAvatar(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#062E35]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. MEDIA INSERTER MODAL (IMAGE & VIDEO SELECTION MODAL) */}
      {mediaModalOpen && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold">
                  {mediaType === 'image' ? <ImageIcon className="w-5 h-5" /> : <Video className="w-5 h-5" />}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    Insert {mediaType === 'image' ? 'Image' : 'Video'}
                  </h3>
                  <p className="text-xs text-slate-400">
                    Select a file from your device or paste an online link
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Media Type Switcher: Image vs Video */}
            <div className="grid grid-cols-2 gap-2 bg-slate-100 p-1 rounded-2xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setMediaType('image');
                  setMediaFilePreview(null);
                }}
                className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  mediaType === 'image'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <ImageIcon className="w-4 h-4 text-emerald-600" />
                <span>Image / Photo</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  setMediaType('video');
                  setMediaFilePreview(null);
                }}
                className={`py-2 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${
                  mediaType === 'video'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-900'
                }`}
              >
                <Video className="w-4 h-4 text-indigo-600" />
                <span>Video / YouTube</span>
              </button>
            </div>

            {/* Source Switcher: Upload from Device vs Paste URL */}
            <div className="flex items-center gap-3 border-b border-slate-100 pb-2 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setMediaSourceType('file')}
                className={`pb-1.5 transition-all cursor-pointer border-b-2 ${
                  mediaSourceType === 'file'
                    ? 'border-[#062E35] text-[#062E35] font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Upload from Computer
              </button>
              <button
                type="button"
                onClick={() => setMediaSourceType('url')}
                className={`pb-1.5 transition-all cursor-pointer border-b-2 ${
                  mediaSourceType === 'url'
                    ? 'border-[#062E35] text-[#062E35] font-bold'
                    : 'border-transparent text-slate-400 hover:text-slate-700'
                }`}
              >
                Paste URL / Link
              </button>
            </div>

            {/* File Upload Zone */}
            {mediaSourceType === 'file' ? (
              <div className="flex flex-col gap-3">
                {mediaFilePreview ? (
                  <div className="relative rounded-2xl overflow-hidden border border-slate-200 max-h-52 bg-slate-950 flex items-center justify-center">
                    {mediaType === 'image' ? (
                      <img src={mediaFilePreview} alt="Preview" className="max-h-52 object-contain" />
                    ) : (
                      <video src={mediaFilePreview} controls className="max-h-52 w-full object-contain" />
                    )}
                    <button
                      type="button"
                      onClick={() => setMediaFilePreview(null)}
                      className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 text-white hover:bg-black/80 transition-colors text-xs font-semibold cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 hover:border-[#062E35] hover:bg-slate-50 transition-all rounded-2xl p-6 flex flex-col items-center justify-center text-center cursor-pointer gap-2">
                    <input
                      type="file"
                      accept={mediaType === 'image' ? 'image/*' : 'video/*'}
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (!file) return;
                        if (!mediaCaption) {
                          setMediaCaption(file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' '));
                        }
                        if (mediaType === 'image') {
                          const dataUrl = await compressImageFile(file);
                          setMediaFilePreview(dataUrl);
                        } else {
                          const dataUrl = await readVideoFile(file);
                          setMediaFilePreview(dataUrl);
                        }
                      }}
                      className="hidden"
                    />
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500">
                      <Upload className="w-5 h-5 text-slate-500" />
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 block">
                        Choose {mediaType === 'image' ? 'Image' : 'Video'} File
                      </span>
                      <span className="text-[11px] text-slate-400 mt-0.5 block">
                        {mediaType === 'image' 
                          ? 'Select PNG, JPG, WebP from your device' 
                          : 'Select MP4, WebM, MOV from your device'}
                      </span>
                    </div>
                  </label>
                )}
              </div>
            ) : (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  {mediaType === 'image' ? 'Image URL' : 'Video or YouTube Link'}
                </label>
                <input
                  type="url"
                  placeholder={
                    mediaType === 'image' 
                      ? 'https://images.unsplash.com/photo-...' 
                      : 'https://www.youtube.com/watch?v=... or https://example.com/video.mp4'
                  }
                  value={mediaUrlInput}
                  onChange={(e) => setMediaUrlInput(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#062E35]"
                />
                <span className="text-[11px] text-slate-400">
                  {mediaType === 'video' 
                    ? 'Supports YouTube, Vimeo, and direct .mp4 streaming links' 
                    : 'Paste direct link to any online image'}
                </span>
              </div>
            )}

            {/* Media Caption */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Caption / Alt Text</label>
              <input
                type="text"
                placeholder="e.g., Solar panels powering drip irrigation system"
                value={mediaCaption}
                onChange={(e) => setMediaCaption(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-900 focus:outline-none focus:border-[#062E35]"
              />
            </div>

            {/* Modal Actions */}
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setMediaModalOpen(false)}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleInsertFromModal}
                className="px-5 py-2 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
              >
                Insert into Article
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
