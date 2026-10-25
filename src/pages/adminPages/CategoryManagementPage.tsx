import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate, useSearchParams, useLocation } from 'react-router-dom';
import {
  ArrowLeft,
  Plus,
  Trash2,
  FolderPlus,
  Package,
  Layers,
  Search,
  UploadCloud,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
  Tag,
} from 'lucide-react';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useDeleteCategoryMutation,
  useGetProductsQuery,
  type CategoryItem,
} from '../../redux';

export const CategoryManagementPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // RTK Queries
  const { data: categoriesResp, isLoading, refetch } = useGetCategoriesQuery({ includeCount: true });
  const { data: productsResp } = useGetProductsQuery({ limit: 100 });
  const [createCategory, { isLoading: isCreating }] = useCreateCategoryMutation();
  const [deleteCategory, { isLoading: isDeleting }] = useDeleteCategoryMutation();

  // Local state
  const [searchTerm, setSearchTerm] = useState('');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<CategoryItem | null>(null);

  // Automatically open Add Category Modal if navigated with ?openModal=true or /add
  useEffect(() => {
    if (searchParams.get('openModal') === 'true' || location.pathname.endsWith('/add')) {
      setIsAddModalOpen(true);
    }
  }, [searchParams, location.pathname]);

  // Form state
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategorySlug, setNewCategorySlug] = useState('');
  const [newCategoryDesc, setNewCategoryDesc] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [formError, setFormError] = useState<string | null>(null);
  const [toastMessage, setToastMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ type, text });
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Auto-generate slug when typing name
  const handleNameChange = (val: string) => {
    setNewCategoryName(val);
    const slugified = val
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
    setNewCategorySlug(slugified);
  };

  // Image file select
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setFormError('Image size should be less than 5MB.');
        return;
      }
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Reset form
  const resetForm = () => {
    setNewCategoryName('');
    setNewCategorySlug('');
    setNewCategoryDesc('');
    setImageFile(null);
    setImagePreview(null);
    setImageUrlInput('');
    setFormError(null);
  };

  // Calculate live product counts from products API
  const products = productsResp?.data?.products || [];
  const productCountByCategory = useMemo(() => {
    const counts: Record<string, number> = {};
    products.forEach((p) => {
      if (p.category) {
        counts[p.category] = (counts[p.category] || 0) + 1;
      }
    });
    return counts;
  }, [products]);

  // Real dynamic categories list from Database API (No dummy data)
  const categoriesList: CategoryItem[] = useMemo(() => {
    const apiCategories: CategoryItem[] = Array.isArray(categoriesResp?.data)
      ? categoriesResp.data
      : (categoriesResp?.data as { categories?: CategoryItem[] })?.categories || [];

    return apiCategories.map((c) => ({
      ...c,
      totalProducts: c.totalProducts ?? c.productCount ?? productCountByCategory[c.name] ?? 0,
    }));
  }, [categoriesResp, productCountByCategory]);

  // Filtered categories
  const filteredCategories = useMemo(() => {
    const q = searchTerm.toLowerCase().trim();
    if (!q) return categoriesList;
    return categoriesList.filter(
      (c) => c.name.toLowerCase().includes(q) || c.slug.toLowerCase().includes(q)
    );
  }, [categoriesList, searchTerm]);

  // Total products count
  const totalCatalogProducts = useMemo(() => {
    return categoriesList.reduce((acc, curr) => acc + (curr.totalProducts || 0), 0);
  }, [categoriesList]);

  // Submit create category
  const handleCreateSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!newCategoryName.trim()) {
      setFormError('Category name is required.');
      return;
    }

    try {
      const formData = new FormData();
      formData.append('name', newCategoryName.trim());
      formData.append('slug', newCategorySlug.trim() || newCategoryName.trim().toLowerCase().replace(/\s+/g, '-'));
      if (newCategoryDesc.trim()) {
        formData.append('description', newCategoryDesc.trim());
      }
      if (imageFile) {
        formData.append('image', imageFile);
      } else if (imageUrlInput.trim()) {
        formData.append('image', imageUrlInput.trim());
      }

      await createCategory(formData).unwrap();
      showToast(`Category "${newCategoryName}" created successfully!`);
      resetForm();
      setIsAddModalOpen(false);
      refetch();
    } catch (err: any) {
      console.error('Failed to create category:', err);
      const msg = err?.data?.message || err?.error || 'Failed to create category on backend.';
      setFormError(Array.isArray(msg) ? msg.join(', ') : msg);
    }
  };

  // Submit delete category
  const handleConfirmDelete = async () => {
    if (!categoryToDelete) return;
    try {
      await deleteCategory(categoryToDelete.id).unwrap();
      showToast(`Category "${categoryToDelete.name}" deleted successfully.`);
      refetch();
    } catch (err: any) {
      console.error('Failed to delete category:', err);
      showToast(err?.data?.message || 'Failed to delete category.', 'error');
    } finally {
      setCategoryToDelete(null);
    }
  };

  return (
    <div className="w-full flex flex-col gap-6 font-['Inter'] pb-16 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200 border ${
            toastMessage.type === 'success'
              ? 'bg-[#062E35] text-white border-teal-500/30'
              : 'bg-rose-900 text-white border-rose-500/30'
          }`}
        >
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
          )}
          <span className="text-sm font-semibold">{toastMessage.text}</span>
          <button
            onClick={() => setToastMessage(null)}
            className="ml-2 text-slate-400 hover:text-white"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Top Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
        <div>
          <button
            type="button"
            onClick={() => navigate('/admin/settings')}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-[#062E35] transition-colors mb-2 cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Settings</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight leading-tight flex items-center gap-3">
            <span>Product Categories</span>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-teal-50 text-[#062E35] border border-teal-200">
              {categoriesList.length} Total
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Create, view, and manage dynamic product categories for the admin product creator, storefront filters, and Home Product Category cards.
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-[#062E35] text-white hover:bg-[#0E4F5A] active:scale-95 transition-all shadow-sm cursor-pointer group"
          >
            <Plus className="w-4 h-4 text-emerald-400 group-hover:rotate-90 transition-transform duration-200" />
            <span>Add New Category</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Categories</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{categoriesList.length}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-teal-50 text-[#062E35] flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Catalog Products</p>
            <p className="text-2xl font-black text-slate-900 mt-1">{totalCatalogProducts}</p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
            <Package className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex items-center justify-between">
          <div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">Storefront Sync</p>
            <p className="text-sm font-bold text-emerald-600 mt-1 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Dynamic & Live
            </p>
          </div>
          <div className="w-12 h-12 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center font-bold">
            <Sparkles className="w-6 h-6 text-amber-500" />
          </div>
        </div>
      </div>

      {/* Search & Actions Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search categories by name or slug..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#F8FAFC] border border-slate-200 text-sm font-medium text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#062E35] focus:bg-white transition-all"
          />
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold text-slate-500">
          <span>Showing {filteredCategories.length} categories</span>
        </div>
      </div>

      {/* Categories Grid */}
      {isLoading ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200/80 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-[#062E35]" />
          <p className="text-sm font-semibold text-slate-600">Loading product categories...</p>
        </div>
      ) : filteredCategories.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 border border-slate-200/80 flex flex-col items-center justify-center text-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400">
            <Tag className="w-8 h-8" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No categories found</h3>
          <p className="text-xs text-slate-500 max-w-sm">
            {searchTerm ? `No categories match "${searchTerm}".` : 'Get started by creating your first product category.'}
          </p>
          <button
            type="button"
            onClick={() => {
              resetForm();
              setIsAddModalOpen(true);
            }}
            className="mt-2 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold bg-[#062E35] text-white hover:bg-[#0E4F5A] transition-all cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Category</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredCategories.map((cat) => {
            const hasCustomImage = Boolean(cat.image);
            return (
              <div
                key={cat.id}
                className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3.5">
                      {hasCustomImage ? (
                        <img
                          src={cat.image!}
                          alt={cat.name}
                          className="w-14 h-14 rounded-2xl object-cover border border-slate-200 shadow-2xs shrink-0"
                          onError={(e) => {
                            (e.target as HTMLElement).style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-[#062E35]/10 to-teal-500/10 border border-teal-500/20 flex items-center justify-center text-[#062E35] shrink-0">
                          <Layers className="w-6 h-6" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-base font-bold text-slate-900 group-hover:text-[#062E35] transition-colors leading-tight">
                          {cat.name}
                        </h3>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">
                          slug: /{cat.slug}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => setCategoryToDelete(cat)}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete category"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  {cat.description && (
                    <p className="text-xs text-slate-500 mt-3 line-clamp-2 leading-relaxed">
                      {cat.description}
                    </p>
                  )}
                </div>

                <div className="mt-5 pt-3.5 border-t border-slate-100 flex items-center justify-between">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-[#F1F5F9] text-slate-700">
                    <Package className="w-3.5 h-3.5 text-[#062E35]" />
                    <span>{cat.totalProducts ?? 0} Products</span>
                  </span>

                  <span className="text-[11px] text-slate-400 font-medium">
                    {hasCustomImage ? 'Custom Banner' : 'System Default'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Category Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl border border-slate-100 overflow-hidden animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="px-6 py-5 bg-[#062E35] text-white flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-teal-300">
                  <FolderPlus className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-bold leading-tight">Add New Category</h2>
                  <p className="text-xs text-teal-200/80">Configure dynamic category for marketplace</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsAddModalOpen(false)}
                className="p-2 rounded-xl text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateSubmit} className="p-6 flex flex-col gap-5">
              {formError && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Category Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Category Name <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Hydroponics & Greenhouses"
                  value={newCategoryName}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-800 focus:outline-none focus:border-[#062E35] focus:ring-2 focus:ring-[#062E35]/10"
                />
              </div>

              {/* URL Slug Preview */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Storefront Slug
                </label>
                <div className="flex items-center px-4 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-xs text-slate-600 font-mono">
                  <span className="text-slate-400">/collection?category=</span>
                  <span className="font-bold text-[#062E35]">{newCategorySlug || 'category-slug'}</span>
                </div>
              </div>

              {/* Category Image Upload */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Category Image / Thumbnail
                </label>
                <div className="flex items-center gap-4">
                  {imagePreview ? (
                    <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-slate-200 shrink-0">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => {
                          setImageFile(null);
                          setImagePreview(null);
                        }}
                        className="absolute top-1 right-1 p-1 bg-black/70 text-white rounded-full hover:bg-rose-600 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ) : (
                    <label className="w-full border-2 border-dashed border-slate-200 hover:border-[#062E35] rounded-2xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer transition-all bg-slate-50 hover:bg-teal-50/30">
                      <UploadCloud className="w-6 h-6 text-[#062E35]" />
                      <span className="text-xs font-bold text-slate-700">Click to upload category image</span>
                      <span className="text-[11px] text-slate-400">PNG, JPG, WEBP up to 5MB</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </label>
                  )}
                </div>

                {/* Optional Image URL Input */}
                {!imageFile && (
                  <div className="mt-2.5">
                    <input
                      type="url"
                      placeholder="Or paste image URL (https://...)"
                      value={imageUrlInput}
                      onChange={(e) => {
                        setImageUrlInput(e.target.value);
                        if (e.target.value.startsWith('http')) {
                          setImagePreview(e.target.value);
                        }
                      }}
                      className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#062E35]"
                    />
                  </div>
                )}
              </div>

              {/* Category Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
                  Short Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Optional description for storefront category cards..."
                  value={newCategoryDesc}
                  onChange={(e) => setNewCategoryDesc(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs text-slate-700 focus:outline-none focus:border-[#062E35] focus:ring-2 focus:ring-[#062E35]/10 resize-none"
                />
              </div>

              {/* Modal Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreating}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#062E35] text-white hover:bg-[#0E4F5A] transition-all shadow-sm cursor-pointer disabled:opacity-50"
                >
                  {isCreating ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Create Category</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {categoryToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl border border-slate-100 flex flex-col gap-4 animate-in zoom-in-95 duration-200">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Delete Category</h3>
              <p className="text-xs text-slate-500 mt-1 leading-relaxed">
                Are you sure you want to remove <span className="font-bold text-slate-800">"{categoryToDelete.name}"</span>?
                Products in this category will not be deleted, but may need to be recategorized.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setCategoryToDelete(null)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isDeleting}
                onClick={handleConfirmDelete}
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl text-xs font-bold bg-rose-600 hover:bg-rose-700 text-white transition-all shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isDeleting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Deleting...</span>
                  </>
                ) : (
                  <>
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Delete Category</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryManagementPage;
