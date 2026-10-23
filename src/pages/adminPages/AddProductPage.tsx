import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { 
  Search,
  ArrowLeft, 
  UploadCloud, 
  Package, 
  Tag, 
  DollarSign, 
  Store, 
  CheckCircle2, 
  AlertCircle,
  X,
  Plus,
  Sparkles,
  Trash2,
  ListChecks,
  Sliders,
  Eye,
  ImageIcon,
  ShieldCheck,
  Check,
  ExternalLink,
  Layers
} from 'lucide-react';
import { 
  useAppSelector,
  useCreateProductMutation,
  useSearchVendorsQuery,
  useUpdateProductMutation,
  useGetProductByIdQuery,
  type ProductStatus,
} from '../../redux';

interface AddProductPageProps {
  isVendor?: boolean;
}

const AGRICULTURE_CATEGORIES = [
  'Seeds & Seedlings',
  'Vegetables',
  'Plants & Seedlings',
  'Fertilizers',
  'Farm Tools',
  'Agro Chemicals',
  'Dairy & Poultry',
  'Fish Farming',
  'Produce',
  'Nutrition',
  'Baby Care',
  'Nursery',
  'Safety',
  'Toys',
  'Feeding',
  'Accessories'
];

interface SpecItem {
  key: string;
  value: string;
}

export const AddProductPage: React.FC<AddProductPageProps> = ({ isVendor: propIsVendor }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id: editProductId } = useParams<{ id: string }>();
  const isEditMode = Boolean(editProductId);

  // Determine if vendor or admin from props or route path
  const isVendor = propIsVendor ?? location.pathname.startsWith('/vendor');
  const user = useAppSelector((state) => state.auth.user);
  const vendorName = user?.vendorProfile?.businessName || user?.name || 'Agro Verified Vendor';
  const vendorProfileId = user?.vendorProfile?.id;

  // Form State
  const [name, setName] = useState('');
  const [sku, setSku] = useState(`AGRO-${Math.floor(1000 + Math.random() * 9000)}`);
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState(AGRICULTURE_CATEGORIES[0]);
  const [customCategory, setCustomCategory] = useState('');
  const [price, setPrice] = useState('');
  const [deliveryCharge, setDeliveryCharge] = useState('0');
  const [vendorSearchQuery, setVendorSearchQuery] = useState('');
  const [isVendorDropdownOpen, setIsVendorDropdownOpen] = useState(false);
  const [selectedVendorInfo, setSelectedVendorInfo] = useState<{ id: string; businessName: string; email?: string } | null>(null);
  const [compareAtPrice, setCompareAtPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [vendorId, setVendorId] = useState(vendorProfileId || '');
  const [status, setStatus] = useState<ProductStatus>('ACTIVE');
  const [summary, setSummary] = useState('');
  const [description, setDescription] = useState('');

  // RTK Query hooks
  const [createProduct, { isLoading: isCreating }] = useCreateProductMutation();
  const { data: searchedVendorsResp, isFetching: isSearchingVendors } = useSearchVendorsQuery(vendorSearchQuery, {
    skip: isVendor,
  });
  const vendorSearchResults = searchedVendorsResp?.data || [];
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();
  const { data: existingProductResponse, isLoading: isLoadingExisting } = useGetProductByIdQuery(
    editProductId || '',
    { skip: !editProductId }
  );

  // Highlights (bullet points)
  const [highlights, setHighlights] = useState<string[]>([
    'High germination rate with lab-tested purity',
    'Carefully sorted and moisture-protected packaging',
  ]);
  const [newHighlight, setNewHighlight] = useState('');

  // Badges / feature tags
  const [badges, setBadges] = useState<string[]>(['Lab Tested Genuine', 'Cold-Chain Delivery']);
  const [newBadge, setNewBadge] = useState('');

  // Specifications (Key-Value pairs)
  const [specifications, setSpecifications] = useState<SpecItem[]>([
    { key: 'Maturity', value: '45 - 50 Days' },
    { key: 'Germination', value: '93%+' },
    { key: 'Origin', value: 'Gazipur, Bangladesh' },
  ]);
  const [newSpecKey, setNewSpecKey] = useState('');
  const [newSpecValue, setNewSpecValue] = useState('');

  // Images state (files + existing preview URLs, max 4)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [showUrlField, setShowUrlField] = useState(false);

  // Notification / error state
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // Populate data if in Edit Mode
  useEffect(() => {
    if (isEditMode && existingProductResponse?.data) {
      const p = existingProductResponse.data;
      setName(p.name || '');
      setSku(p.sku || '');
      setSlug(p.slug || '');
      if (AGRICULTURE_CATEGORIES.includes(p.category)) {
        setCategory(p.category);
      } else {
        setCategory('Other');
        setCustomCategory(p.category || '');
      }
      setPrice(String(p.price || ''));
      setCompareAtPrice(p.compareAtPrice ? String(p.compareAtPrice) : '');
      setStock(String(p.stock ?? 0));
      setStatus(p.status || 'ACTIVE');
      setSummary(p.summary || '');
      setDescription(p.description || '');
      if (p.vendorId) {
        setVendorId(p.vendorId);
        if (p.vendor) {
          setSelectedVendorInfo({
            id: p.vendor.id,
            businessName: p.vendor.businessName,
          });
        }
      }
      if (p.deliveryCharge !== undefined && p.deliveryCharge !== null) {
        setDeliveryCharge(String(p.deliveryCharge));
      }
      if (Array.isArray(p.highlights)) setHighlights(p.highlights);
      if (Array.isArray(p.badges)) setBadges(p.badges);
      if (Array.isArray(p.images)) setImagePreviews(p.images);

      if (p.specifications && typeof p.specifications === 'object') {
        const specs: SpecItem[] = Object.entries(p.specifications).map(([key, value]) => ({
          key,
          value: String(value),
        }));
        setSpecifications(specs);
      }
    }
  }, [isEditMode, existingProductResponse]);

  // Image Upload Handlers (Max 4 images)
  const handleFilesSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    const remainingSlots = 4 - imagePreviews.length;
    if (remainingSlots <= 0) {
      setErrorMessage('You can upload a maximum of 4 images per product.');
      return;
    }

    const filesToAdd = files.slice(0, remainingSlots);
    const newFiles = [...imageFiles, ...filesToAdd];
    setImageFiles(newFiles);

    filesToAdd.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews((prev) => [...prev, reader.result as string].slice(0, 4));
      };
      reader.readAsDataURL(file);
    });

    setErrorMessage(null);
  };

  const handleAddImageUrl = () => {
    if (!imageUrlInput.trim()) return;
    if (imagePreviews.length >= 4) {
      setErrorMessage('You can add a maximum of 4 images.');
      return;
    }
    setImagePreviews((prev) => [...prev, imageUrlInput.trim()]);
    setImageUrlInput('');
    setShowUrlField(false);
    setErrorMessage(null);
  };

  const handleRemoveImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, idx) => idx !== index));
    setImageFiles((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Highlights handlers
  const handleAddHighlight = () => {
    if (newHighlight.trim() && !highlights.includes(newHighlight.trim())) {
      setHighlights([...highlights, newHighlight.trim()]);
      setNewHighlight('');
    }
  };

  const handleRemoveHighlight = (idx: number) => {
    setHighlights(highlights.filter((_, i) => i !== idx));
  };

  // Badges handlers
  const handleAddBadge = () => {
    if (newBadge.trim() && !badges.includes(newBadge.trim())) {
      setBadges([...badges, newBadge.trim()]);
      setNewBadge('');
    }
  };

  const handleRemoveBadge = (badgeToRemove: string) => {
    setBadges(badges.filter((b) => b !== badgeToRemove));
  };

  // Specifications handlers
  const handleAddSpec = () => {
    if (newSpecKey.trim() && newSpecValue.trim()) {
      setSpecifications([...specifications, { key: newSpecKey.trim(), value: newSpecValue.trim() }]);
      setNewSpecKey('');
      setNewSpecValue('');
    }
  };

  const handleRemoveSpec = (idx: number) => {
    setSpecifications(specifications.filter((_, i) => i !== idx));
  };

  // Live calculations
  const numericPrice = parseFloat(price) || 0;
  const numericComparePrice = parseFloat(compareAtPrice) || 0;
  const hasDiscount = numericComparePrice > numericPrice && numericPrice > 0;
  const discountPercent = hasDiscount 
    ? Math.round(((numericComparePrice - numericPrice) / numericComparePrice) * 100) 
    : 0;

  // Completion readiness checklist calculation
  const readinessChecklist = [
    { label: 'Title & Category', completed: Boolean(name.trim() && category) },
    { label: 'Price (BDT)', completed: numericPrice > 0 },
    { label: 'Stock Quantity', completed: Boolean(stock && !isNaN(parseInt(stock))) },
    { label: 'Cover Image', completed: imagePreviews.length > 0 },
    { label: 'Description', completed: Boolean(description.trim() || summary.trim()) },
  ];
  const completedCount = readinessChecklist.filter((c) => c.completed).length;
  const completionPercentage = Math.round((completedCount / readinessChecklist.length) * 100);

  // Submit Handler (Create or Patch)
  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);

    if (!name.trim()) {
      setErrorMessage('Product title is required.');
      return;
    }
    if (!numericPrice || numericPrice <= 0) {
      setErrorMessage('Please enter a valid price greater than 0.');
      return;
    }

    const finalCategory = category === 'Other' && customCategory.trim() 
      ? customCategory.trim() 
      : category;

    // Build specifications dictionary
    const specsRecord: Record<string, string> = {};
    specifications.forEach(({ key, value }) => {
      if (key && value) specsRecord[key] = value;
    });

    try {
      // If we have actual file uploads, send as multipart/form-data
      if (imageFiles.length > 0) {
        const formData = new FormData();
        formData.append('name', name.trim());
        formData.append('category', finalCategory);
        formData.append('price', String(numericPrice));
        formData.append('deliveryCharge', String(parseFloat(deliveryCharge) || 0));
        if (numericComparePrice > 0) {
          formData.append('compareAtPrice', String(numericComparePrice));
        }
        formData.append('stock', String(parseInt(stock) || 0));
        formData.append('status', status);
        if (sku.trim()) formData.append('sku', sku.trim());
        if (slug.trim()) formData.append('slug', slug.trim());
        if (summary.trim()) formData.append('summary', summary.trim());
        if (description.trim()) formData.append('description', description.trim());
        formData.append('highlights', JSON.stringify(highlights));
        formData.append('badges', JSON.stringify(badges));
        formData.append('specifications', JSON.stringify(specsRecord));

        if (!isVendor && vendorId) {
          formData.append('vendorId', vendorId);
        }

        // Append remaining URL images if any
        const existingUrls = imagePreviews.filter((url) => !url.startsWith('data:'));
        if (existingUrls.length > 0) {
          formData.append('images', JSON.stringify(existingUrls));
        }

        imageFiles.forEach((file) => {
          formData.append('images', file);
        });

        if (isEditMode && editProductId) {
          await updateProduct({ id: editProductId, data: formData }).unwrap();
        } else {
          await createProduct(formData).unwrap();
        }
      } else {
        // Send as clean JSON payload
        const payload = {
          name: name.trim(),
          category: finalCategory,
          price: numericPrice,
          deliveryCharge: parseFloat(deliveryCharge) || 0,
          compareAtPrice: numericComparePrice > 0 ? numericComparePrice : undefined,
          stock: parseInt(stock) || 0,
          status,
          sku: sku.trim() || undefined,
          slug: slug.trim() || undefined,
          summary: summary.trim() || undefined,
          description: description.trim() || undefined,
          highlights,
          badges,
          specifications: specsRecord,
          images: imagePreviews,
          thumbnail: imagePreviews[0] || undefined,
          vendorId: (!isVendor && vendorId) ? vendorId : undefined,
        };

        if (isEditMode && editProductId) {
          await updateProduct({ id: editProductId, data: payload }).unwrap();
        } else {
          await createProduct(payload).unwrap();
        }
      }

      setShowSuccessToast(true);
      setTimeout(() => {
        navigate(isVendor ? '/vendor/product' : '/admin/product');
      }, 900);
    } catch (err: any) {
      console.error('Failed to save product:', err);
      const backendMsg = err?.data?.message || err?.error || 'Failed to save product. Please verify all fields.';
      setErrorMessage(Array.isArray(backendMsg) ? backendMsg.join(', ') : backendMsg);
    }
  };

  const handleBack = () => {
    navigate(isVendor ? '/vendor/product' : '/admin/product');
  };

  if (isEditMode && isLoadingExisting) {
    return (
      <div className="w-full min-h-[500px] flex flex-col items-center justify-center gap-4 font-['Inter']">
        <div className="w-10 h-10 border-3 border-[#062E35] border-t-transparent rounded-full animate-spin" />
        <span className="text-sm font-semibold text-slate-600">Retrieving product record from catalog...</span>
      </div>
    );
  }

  return (
    <div className="w-full max-w-full flex flex-col gap-8 font-['Inter'] pb-28 animate-in fade-in duration-200">
      {/* Success Notification Banner */}
      {showSuccessToast && (
        <div className="fixed top-6 right-6 z-50 bg-[#062E35] text-white px-6 py-4 rounded-2xl shadow-2xl border border-teal-500/30 flex items-center gap-3.5 animate-in slide-in-from-top-4 duration-200">
          <div className="w-9 h-9 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-sm font-bold text-white">
              {isEditMode ? 'Product Updated Successfully!' : 'Product Published Successfully!'}
            </div>
            <div className="text-xs text-teal-200">Synchronized with marketplace inventory.</div>
          </div>
        </div>
      )}

      {/* 1. Sleek Top Breadcrumb & Action Header */}
      <div className="w-full bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div className="flex items-start sm:items-center gap-4">
          <button
            type="button"
            onClick={handleBack}
            className="w-10 h-10 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 flex items-center justify-center text-slate-600 transition-all cursor-pointer shadow-2xs hover:scale-105 active:scale-95 shrink-0"
            title="Return to inventory"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            {/* Breadcrumb path */}
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-400 mb-1">
              <span 
                onClick={handleBack} 
                className="hover:text-slate-700 cursor-pointer transition-colors"
              >
                Products
              </span>
              <span>/</span>
              <span className="text-[#0E4F5A] font-bold">
                {isEditMode ? 'Edit Product' : 'Add New Product'}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                {isEditMode ? 'Edit Product Details' : 'Create New Product'}
              </h1>

              {/* Status pill */}
              <span className={`inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-xs font-bold ${
                status === 'ACTIVE' 
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : status === 'SUSPENDED'
                  ? 'bg-amber-50 text-amber-700 border border-amber-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  status === 'ACTIVE' ? 'bg-emerald-500' : status === 'SUSPENDED' ? 'bg-amber-500' : 'bg-rose-500'
                }`} />
                {status}
              </span>
            </div>
            
            <p className="text-xs text-slate-500 mt-1">
              {isVendor
                ? `Publish agricultural produce, seeds, tools, or inputs under ${vendorName}.`
                : 'Configure inventory specifications, pricing, media, and marketplace visibility.'}
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3 self-end md:self-center">
          <button
            type="button"
            onClick={handleBack}
            className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => handleSubmit()}
            disabled={isCreating || isUpdating || !name.trim()}
            className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md active:scale-95"
          >
            {isCreating || isUpdating ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{isEditMode ? 'Saving...' : 'Publishing...'}</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{isEditMode ? 'Save Changes' : 'Publish Product'}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Error Alert if any */}
      {errorMessage && (
        <div className="w-full p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-start gap-3 animate-in shake duration-200 shadow-2xs">
          <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
          <div className="flex-1 font-medium">{errorMessage}</div>
          <button
            type="button"
            onClick={() => setErrorMessage(null)}
            className="text-rose-500 hover:text-rose-700 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Main Form Grid (Full Width 12-Column Responsive Layout) */}
      <form onSubmit={handleSubmit} className="w-full grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Columns: Main Content Details (xl: 8 cols, 2xl: 8 cols) */}
        <div className="w-full xl:col-span-8 flex flex-col gap-7">
          
          {/* Section 1: General Product Information */}
          <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#062E35] flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">General Information</h2>
                  <p className="text-xs text-slate-500">Define the core title, category, and identifiers</p>
                </div>
              </div>
              <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Required Fields *</span>
            </div>

            {/* Product Title */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Product Title / Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  if (!slug && !isEditMode) {
                    setSlug(e.target.value.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/[\s_-]+/g, '-'));
                  }
                }}
                placeholder="e.g. Premium BARI Hybrid Tomato Seeds – F1 High Yield (25g)"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50/70 focus:bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-[#062E35] focus:ring-3 focus:ring-[#062E35]/10 font-medium transition-all"
              />
              {slug && (
                <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-2">
                  <span className="font-semibold text-slate-500">Live URL Slug:</span>
                  <code className="text-[#0E4F5A] bg-teal-50/60 px-2 py-0.5 rounded font-mono">
                    /product/{slug}
                  </code>
                </div>
              )}
            </div>

            {/* Category & SKU Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Category <span className="text-rose-500">*</span>
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 bg-white hover:border-slate-300 focus:outline-none focus:border-[#062E35] focus:ring-3 focus:ring-[#062E35]/10 cursor-pointer transition-all"
                >
                  {AGRICULTURE_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                  <option value="Other">Other / Custom Category</option>
                </select>
              </div>

              {category === 'Other' ? (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    Custom Category Name <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={customCategory}
                    onChange={(e) => setCustomCategory(e.target.value)}
                    placeholder="Enter custom category name..."
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] focus:ring-3 focus:ring-[#062E35]/10"
                  />
                </div>
              ) : (
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                    SKU (Stock Keeping Unit)
                  </label>
                  <input
                    type="text"
                    value={sku}
                    onChange={(e) => setSku(e.target.value)}
                    placeholder="e.g. AGRO-TOMATO-F1-01"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-800 font-mono focus:outline-none focus:border-[#062E35] focus:ring-3 focus:ring-[#062E35]/10"
                  />
                </div>
              )}
            </div>

            {/* Short Promotional Summary */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                Short Promotional Summary
              </label>
              <input
                type="text"
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                placeholder="e.g. High disease resistance, 95% germination rate, harvest ready in 75 days."
                className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50/70 focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#062E35] focus:ring-3 focus:ring-[#062E35]/10 transition-all"
              />
            </div>

            {/* Full Detailed Description */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                  Detailed Product Description
                </label>
                <span className="text-[11px] text-slate-400">{description.length} characters</span>
              </div>
              <textarea
                rows={5}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Provide comprehensive agricultural information: soil conditions, irrigation schedule, seasonal suitability, packaging details, and safety guidelines..."
                className="w-full p-4 rounded-xl border border-slate-200 bg-slate-50/40 hover:bg-slate-50/70 focus:bg-white text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#062E35] focus:ring-3 focus:ring-[#062E35]/10 resize-none transition-all leading-relaxed"
              />
            </div>
          </div>

          {/* Section 2: Media & Cloudinary Gallery (Max 4 images) */}
          <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs flex flex-col gap-5">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-sky-50 text-sky-700 flex items-center justify-center">
                  <ImageIcon className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Product Media & Gallery</h2>
                  <p className="text-xs text-slate-500">Upload up to 4 high-resolution images stored securely via Cloudinary</p>
                </div>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700">
                {imagePreviews.length} / 4 Uploaded
              </span>
            </div>

            {/* Image Preview Grid (4 Slots) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, idx) => {
                const preview = imagePreviews[idx];
                const isPrimary = idx === 0;

                return (
                  <div
                    key={idx}
                    className={`h-40 rounded-2xl border-2 flex flex-col items-center justify-center relative overflow-hidden transition-all group ${
                      preview
                        ? 'border-slate-200 shadow-xs bg-slate-50'
                        : 'border-dashed border-slate-200 bg-slate-50/50 hover:bg-slate-100/70 hover:border-slate-300'
                    }`}
                  >
                    {preview ? (
                      <>
                        <img
                          src={preview}
                          alt={`Product media slot ${idx + 1}`}
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                        {isPrimary && (
                          <div className="absolute top-2.5 left-2.5 bg-[#062E35]/90 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs backdrop-blur-xs flex items-center gap-1">
                            <Sparkles className="w-3 h-3 text-emerald-400" />
                            <span>Primary Cover</span>
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center hover:bg-rose-700 transition-colors cursor-pointer shadow-md"
                            title="Remove image"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <label className="w-full h-full flex flex-col items-center justify-center cursor-pointer p-4 text-center">
                        <div className="w-9 h-9 rounded-full bg-white shadow-2xs border border-slate-200/80 flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                          <UploadCloud className="w-5 h-5 text-slate-500" />
                        </div>
                        <span className="text-xs font-bold text-slate-700">
                          {isPrimary ? 'Cover Image' : `Slot #${idx + 1}`}
                        </span>
                        <span className="text-[11px] text-slate-400 mt-0.5">Click or Drag</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFilesSelected}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                );
              })}
            </div>

            {/* URL Fallback Bar */}
            <div className="pt-2 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-500">
                  Prefer embedding direct web image links?
                </span>
                <button
                  type="button"
                  onClick={() => setShowUrlField(!showUrlField)}
                  className="text-xs font-semibold text-[#0E4F5A] hover:underline cursor-pointer"
                >
                  {showUrlField ? 'Hide URL input' : '+ Add via URL'}
                </button>
              </div>

              {showUrlField && (
                <div className="flex items-center gap-2 animate-in fade-in duration-150">
                  <input
                    type="url"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    placeholder="Paste Cloudinary or web image URL (https://res.cloudinary.com/...)..."
                    className="flex-1 px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                  <button
                    type="button"
                    onClick={handleAddImageUrl}
                    className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition-colors"
                  >
                    Add Link
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Pricing & Inventory */}
          <div className="w-full bg-white rounded-2xl p-6 sm:p-8 border border-slate-200/80 shadow-2xs flex flex-col gap-6">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Pricing & Inventory</h2>
                  <p className="text-xs text-slate-500">Set base marketplace selling rates and stock availability</p>
                </div>
              </div>

              {hasDiscount && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-emerald-50 text-emerald-800 border border-emerald-200">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{discountPercent}% Discount Active</span>
                </span>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {/* Selling Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Regular Price (BDT) <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    placeholder="350.00"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 font-extrabold focus:outline-none focus:border-[#062E35] focus:ring-3 focus:ring-[#062E35]/10"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Final price charged to customer</span>
              </div>

              {/* Compare-At Price */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Compare-At Price (Optional)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={compareAtPrice}
                    onChange={(e) => setCompareAtPrice(e.target.value)}
                    placeholder="420.00"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-700 font-semibold focus:outline-none focus:border-[#062E35] focus:ring-3 focus:ring-[#062E35]/10"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">Shows crossed-out original price</span>
              </div>

              {/* Delivery Charge */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Delivery Charge (৳)
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-sm font-bold">
                    ৳
                  </span>
                  <input
                    type="number"
                    step="1"
                    min="0"
                    value={deliveryCharge}
                    onChange={(e) => setDeliveryCharge(e.target.value)}
                    placeholder="60.00"
                    className="w-full pl-9 pr-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 font-extrabold focus:outline-none focus:border-[#062E35] focus:ring-3 focus:ring-[#062E35]/10"
                  />
                </div>
                <span className="text-[11px] text-slate-400 mt-1 block">
                  Delivery / shipping cost in BDT (0 for Free Delivery)
                </span>
              </div>

              {/* Stock Quantity */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2 uppercase tracking-wide">
                  Available Stock <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={stock}
                  onChange={(e) => {
                    const val = e.target.value;
                    setStock(val);
                    if (parseInt(val) === 0) setStatus('OUT_OF_STOCK');
                    else if (status === 'OUT_OF_STOCK') setStatus('ACTIVE');
                  }}
                  placeholder="100"
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 text-sm text-slate-900 font-extrabold focus:outline-none focus:border-[#062E35] focus:ring-3 focus:ring-[#062E35]/10"
                />
                <span className="text-[11px] text-slate-400 mt-1 block">
                  {parseInt(stock) > 10 ? '✅ Healthy Stock' : parseInt(stock) > 0 ? '⚠️ Low Stock warning' : '❌ Out of stock'}
                </span>
              </div>
            </div>
          </div>

          {/* Section 4: Key Highlights & Specifications */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-7">
            {/* Highlights Card */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-700 flex items-center justify-center">
                  <ListChecks className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Key Highlights</h3>
                  <p className="text-[11px] text-slate-500">Short bullet selling points</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 min-h-[90px]">
                {highlights.map((h, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 text-xs font-medium text-slate-800"
                  >
                    <span className="flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#062E35]" />
                      <span>{h}</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveHighlight(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                <input
                  type="text"
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddHighlight();
                    }
                  }}
                  placeholder="e.g. Drought resistant variety..."
                  className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#062E35]"
                />
                <button
                  type="button"
                  onClick={handleAddHighlight}
                  className="px-3.5 py-2 rounded-xl bg-[#062E35] text-white text-xs font-bold flex items-center gap-1 cursor-pointer hover:bg-[#0A434D]"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add</span>
                </button>
              </div>
            </div>

            {/* Technical Specifications */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-4">
              <div className="flex items-center gap-2.5 pb-3 border-b border-slate-100">
                <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 flex items-center justify-center">
                  <Sliders className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Specifications</h3>
                  <p className="text-[11px] text-slate-500">Key-value technical parameters</p>
                </div>
              </div>

              <div className="flex flex-col gap-2 min-h-[90px]">
                {specifications.map((spec, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60 flex items-center justify-between text-xs"
                  >
                    <div>
                      <span className="text-slate-500 font-medium">{spec.key}: </span>
                      <span className="font-bold text-slate-900">{spec.value}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveSpec(idx)}
                      className="text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2 pt-2 border-t border-slate-100">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    placeholder="Key (e.g. Origin)"
                    value={newSpecKey}
                    onChange={(e) => setNewSpecKey(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                  <input
                    type="text"
                    placeholder="Value (e.g. Bangladesh)"
                    value={newSpecValue}
                    onChange={(e) => setNewSpecValue(e.target.value)}
                    className="px-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddSpec}
                  className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Specification Pair</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Right Columns: Sidebar Panels (xl: 4 cols, 2xl: 4 cols) */}
        <div className="w-full xl:col-span-4 flex flex-col gap-6 sticky top-6">

          {/* Widget 1: Product Readiness Progress */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-[#062E35]" />
                <span className="text-sm font-bold text-slate-900">Readiness Score</span>
              </div>
              <span className="text-xs font-extrabold text-[#0E4F5A]">
                {completionPercentage}%
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
              <div 
                className="h-full bg-linear-to-r from-emerald-500 to-[#062E35] transition-all duration-300 rounded-full"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>

            <div className="flex flex-col gap-2 pt-1">
              {readinessChecklist.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between text-xs">
                  <span className={item.completed ? 'text-slate-800 font-medium' : 'text-slate-400'}>
                    {item.label}
                  </span>
                  {item.completed ? (
                    <Check className="w-4 h-4 text-emerald-600" />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-slate-200" />
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Widget 2: Publication Status */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Layers className="w-4 h-4 text-[#062E35]" />
              <span className="text-sm font-bold text-slate-900">Publication Status</span>
            </div>

            <div className="flex flex-col gap-2.5">
              {[
                { 
                  value: 'ACTIVE', 
                  label: 'ACTIVE', 
                  desc: 'Publicly visible and buyable on AgroAi marketplace',
                  badgeColor: 'border-emerald-300 bg-emerald-50 text-emerald-800'
                },
                { 
                  value: 'SUSPENDED', 
                  label: 'SUSPENDED / DRAFT', 
                  desc: 'Hidden from store catalog for review or staging',
                  badgeColor: 'border-amber-300 bg-amber-50 text-amber-800'
                },
                { 
                  value: 'OUT_OF_STOCK', 
                  label: 'OUT OF STOCK', 
                  desc: 'Displayed as sold out in marketplace',
                  badgeColor: 'border-rose-300 bg-rose-50 text-rose-800'
                },
              ].map((opt) => (
                <label
                  key={opt.value}
                  onClick={() => setStatus(opt.value as ProductStatus)}
                  className={`p-3.5 rounded-xl border-2 cursor-pointer transition-all flex items-start gap-3 ${
                    status === opt.value
                      ? 'border-[#062E35] bg-teal-50/30'
                      : 'border-slate-100 bg-white hover:bg-slate-50'
                  }`}
                >
                  <input
                    type="radio"
                    name="status"
                    value={opt.value}
                    checked={status === opt.value}
                    onChange={() => setStatus(opt.value as ProductStatus)}
                    className="mt-0.5 text-[#062E35] focus:ring-[#062E35]"
                  />
                  <div>
                    <div className="text-xs font-bold text-slate-900">{opt.label}</div>
                    <div className="text-[11px] text-slate-500 mt-0.5">{opt.desc}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Widget 3: Vendor Assignment */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Store className="w-4 h-4 text-[#062E35]" />
              <span className="text-sm font-bold text-slate-900">Vendor Profile</span>
            </div>

            {isVendor ? (
              <div className="p-4 rounded-xl bg-emerald-50/60 border border-emerald-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] font-bold text-emerald-800 uppercase tracking-wider">
                    Authorised Vendor
                  </div>
                  <div className="text-sm font-extrabold text-slate-900 mt-0.5">{vendorName}</div>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[10px] font-extrabold bg-emerald-200 text-emerald-900">
                  VERIFIED
                </span>
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Assign Vendor (Search By Name)
                </label>

                {vendorId ? (
                  <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className="w-8 h-8 rounded-lg bg-[#062E35] text-white flex items-center justify-center shrink-0">
                        <Store className="w-4 h-4" />
                      </div>
                      <div className="truncate">
                        <div className="text-xs font-bold text-slate-900 truncate">
                          {selectedVendorInfo?.businessName || 'Assigned Vendor'}
                        </div>
                        <div className="text-[10px] font-mono text-slate-500 truncate">{vendorId}</div>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setVendorId('');
                        setSelectedVendorInfo(null);
                      }}
                      className="text-xs text-rose-600 hover:text-rose-800 font-semibold px-2 py-1 rounded-md hover:bg-rose-50 transition cursor-pointer shrink-0"
                    >
                      Clear
                    </button>
                  </div>
                ) : (
                  <div className="relative">
                    <div className="relative">
                      <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={vendorSearchQuery}
                        onChange={(e) => {
                          setVendorSearchQuery(e.target.value);
                          setIsVendorDropdownOpen(true);
                        }}
                        onFocus={() => setIsVendorDropdownOpen(true)}
                        placeholder="Search vendor by business or owner name..."
                        className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#062E35] focus:ring-2 focus:ring-[#062E35]/10"
                      />
                    </div>

                    {isVendorDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white rounded-xl shadow-xl border border-slate-200 max-h-56 overflow-y-auto z-50 p-1 flex flex-col gap-0.5">
                        {isSearchingVendors ? (
                          <div className="p-3 text-center text-xs text-slate-400">Searching vendors...</div>
                        ) : vendorSearchResults.length === 0 ? (
                          <div className="p-3 text-center text-xs text-slate-500">
                            No verified vendors found matching "{vendorSearchQuery}".
                          </div>
                        ) : (
                          vendorSearchResults.map((v: any) => (
                            <button
                              key={v.id}
                              type="button"
                              onClick={() => {
                                setVendorId(v.id);
                                setSelectedVendorInfo({
                                  id: v.id,
                                  businessName: v.businessName,
                                  email: v.user?.email,
                                });
                                setIsVendorDropdownOpen(false);
                                setVendorSearchQuery('');
                              }}
                              className="w-full text-left p-2.5 rounded-lg hover:bg-emerald-50/70 transition flex items-center justify-between gap-2 cursor-pointer group"
                            >
                              <div className="min-w-0">
                                <div className="text-xs font-bold text-slate-900 group-hover:text-[#062E35] truncate">
                                  {v.businessName}
                                </div>
                                <div className="text-[10px] text-slate-500 truncate">
                                  {v.user?.name ? `Owner: ${v.user.name}` : ''} {v.city ? `• ${v.city}` : ''}
                                </div>
                              </div>
                              <span className="text-[10px] font-mono text-slate-400 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">
                                {v.id.slice(0, 8)}...
                              </span>
                            </button>
                          ))
                        )}
                        <button
                          type="button"
                          onClick={() => setIsVendorDropdownOpen(false)}
                          className="w-full text-center py-1 text-[11px] text-slate-400 hover:text-slate-600 border-t border-slate-100 mt-1 cursor-pointer"
                        >
                          Close Dropdown
                        </button>
                      </div>
                    )}
                  </div>
                )}

                <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>Leave empty if owned directly by Krisikunjo Platform.</span>
                </div>
              </div>
            )}
          </div>

          {/* Widget 4: Product Badges */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
              <Tag className="w-4 h-4 text-[#062E35]" />
              <span className="text-sm font-bold text-slate-900">Product Badges</span>
            </div>

            <div className="flex flex-wrap gap-1.5 min-h-[30px]">
              {badges.map((b) => (
                <span
                  key={b}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-900 border border-emerald-200"
                >
                  {b}
                  <button
                    type="button"
                    onClick={() => handleRemoveBadge(b)}
                    className="hover:text-rose-600 cursor-pointer"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
              <input
                type="text"
                value={newBadge}
                onChange={(e) => setNewBadge(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddBadge();
                  }
                }}
                placeholder="e.g. Certified Organic..."
                className="flex-1 px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-none focus:border-[#062E35]"
              />
              <button
                type="button"
                onClick={handleAddBadge}
                className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold cursor-pointer transition-colors"
              >
                Add
              </button>
            </div>
          </div>

          {/* Widget 5: Customer Storefront Card Preview */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs flex flex-col gap-3.5">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-[#062E35]" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                  Live Card Preview
                </span>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Real Storefront Card Mockup */}
            <div className="rounded-2xl border border-slate-200/90 overflow-hidden bg-white shadow-xs">
              <div className="h-44 bg-slate-100 flex items-center justify-center relative overflow-hidden">
                {imagePreviews[0] ? (
                  <img
                    src={imagePreviews[0]}
                    alt="Preview thumbnail"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center text-slate-400">
                    <Package className="w-10 h-10 opacity-30" />
                    <span className="text-xs mt-1 font-semibold text-slate-400">Product Cover Image</span>
                  </div>
                )}
                {hasDiscount && (
                  <span className="absolute top-2.5 left-2.5 bg-rose-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-md shadow-xs">
                    -{discountPercent}% OFF
                  </span>
                )}
                <span className="absolute bottom-2.5 right-2.5 bg-black/60 text-white text-[10px] font-bold px-2 py-0.5 rounded backdrop-blur-xs">
                  {category === 'Other' && customCategory ? customCategory : category}
                </span>
              </div>

              <div className="p-4 flex flex-col gap-2">
                <h4 className="text-sm font-bold text-slate-900 line-clamp-1">
                  {name || 'Product Title Sample Preview'}
                </h4>
                
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className="text-base font-extrabold text-slate-900">
                    ৳{numericPrice > 0 ? numericPrice.toFixed(2) : '0.00'}
                  </span>
                  {numericComparePrice > 0 && (
                    <span className="text-xs text-slate-400 line-through">
                      ৳{numericComparePrice.toFixed(2)}
                    </span>
                  )}
                </div>

                <div className="text-[11px] text-slate-500 flex items-center justify-between pt-2.5 border-t border-slate-100 mt-1">
                  <span>Stock: {stock || 0} units</span>
                  <span className={`font-bold ${parseInt(stock) > 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {parseInt(stock) > 0 ? 'In Stock' : 'Out of Stock'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Floating Action Bar for easy submission on tall forms */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={handleBack}
              className="flex-1 py-3 rounded-xl border border-slate-200 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 transition-colors cursor-pointer text-center"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={() => handleSubmit()}
              disabled={isCreating || isUpdating || !name.trim()}
              className="flex-2 py-3 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-md"
            >
              {isCreating || isUpdating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>{isEditMode ? 'Update Product' : 'Publish Product'}</span>
                </>
              )}
            </button>
          </div>

        </div>
      </form>
    </div>
  );
};

export default AddProductPage;
