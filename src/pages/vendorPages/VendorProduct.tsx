import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Layers, X, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import {
  useAppSelector,
  useGetProductsQuery,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,
  useProductsPrefetch,
  type ProductItem as BackendProductItem,
} from '../../redux';
import {
  ProductMetricsGrid,
  ProductFilters,
  ProductTable,
  ProductModals,
} from '../../components/adminComponents/product';
import type { ProductItem } from '../adminPages/AdminProduct';

export type { ProductItem };

export interface VendorProductItem {
  id: string;
  name: string;
  category: string;
  price: number;
  offer: string;
  availability: 'In stock' | 'Low stock' | 'Out of Stock';
  status: 'Active' | 'Draft' | 'Inactive';
}

const mapBackendToProductItem = (p: BackendProductItem, defaultVendorName: string): ProductItem => {
  let uiStatus: 'Active' | 'Suspended' | 'Out of Stock' = 'Active';
  if (p.status === 'SUSPENDED') uiStatus = 'Suspended';
  else if (p.status === 'OUT_OF_STOCK' || p.stock === 0) uiStatus = 'Out of Stock';

  return {
    id: p.id,
    sku: p.sku || `AGRO-${p.id.slice(0, 6).toUpperCase()}`,
    title: p.name,
    category: p.category || 'General Agriculture',
    price: Number(p.price) || 0,
    compareAtPrice: p.compareAtPrice ? Number(p.compareAtPrice) : null,
    stock: Number(p.stock) || 0,
    vendor: p.vendor?.businessName || defaultVendorName,
    status: uiStatus,
    summary: p.summary || '',
    description: p.description || p.summary || 'Quality certified merchandise.',
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    badges: Array.isArray(p.badges) ? p.badges : [],
    specifications: p.specifications || null,
    imageColor: '#E0F7FA',
    thumbnail: p.thumbnail || p.images?.[0] || null,
    images: p.images || [],
    rating: 4.9,
  };
};

export const VendorProduct: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const vendorStoreName = user?.vendorProfile?.businessName || user?.name || 'Verified Agro Vendor';
  const vendorProfileId = user?.vendorProfile?.id;

  // Filters State
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Debounce search input (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Background prefetching hook
  const prefetchProducts = useProductsPrefetch('getProducts');

  // Reset page to 1 on filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [debouncedSearch, selectedCategory, selectedStatus]);

  // Map UI status filter to backend ProductStatus
  const backendStatusFilter = useMemo(() => {
    if (selectedStatus === 'Active') return 'ACTIVE';
    if (selectedStatus === 'Suspended') return 'SUSPENDED';
    if (selectedStatus === 'Out of Stock') return 'OUT_OF_STOCK';
    return undefined;
  }, [selectedStatus]);

  // Query Backend API (GET /products) scoped strictly to this vendor
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch.trim() || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    status: backendStatusFilter,
    vendorId: vendorProfileId || undefined,
  }), [currentPage, itemsPerPage, debouncedSearch, selectedCategory, backendStatusFilter, vendorProfileId]);

  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useGetProductsQuery(queryParams);

  // Background metric overview query strictly for this vendor
  const { data: metricsResponse } = useGetProductsQuery({
    limit: 500,
    vendorId: vendorProfileId || undefined,
  });

  // Mutations
  const [updateProductStatus] = useUpdateProductStatusMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Toast State
  const [toastMessage, setToastMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setToastMessage({ text, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Modal States
  const [viewingProduct, setViewingProduct] = useState<ProductItem | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [productToSuspend, setProductToSuspend] = useState<ProductItem | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [showDefaultProductsModal, setShowDefaultProductsModal] = useState(false);

  // Fallback new product form
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    sku: '',
    category: 'Seeds & Seedlings',
    price: '',
    stock: '',
    vendor: vendorStoreName,
    description: ''
  });

  // Map products from backend API
  const currentProducts = useMemo(() => {
    const rawList = apiResponse?.data?.products || [];
    return rawList.map((p) => mapBackendToProductItem(p, vendorStoreName));
  }, [apiResponse, vendorStoreName]);

  const totalFiltered = apiResponse?.data?.meta?.total ?? 0;
  const totalPages = apiResponse?.data?.meta?.totalPages ?? 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Prefetch adjacent pages
  useEffect(() => {
    if (currentPage < totalPages) {
      prefetchProducts({ ...queryParams, page: currentPage + 1 });
    }
    if (currentPage > 1) {
      prefetchProducts({ ...queryParams, page: currentPage - 1 });
    }
  }, [currentPage, totalPages, queryParams, prefetchProducts]);

  // Calculate Metrics strictly for this vendor's products in the database
  const allVendorProducts = metricsResponse?.data?.products || [];
  const totalCount = metricsResponse?.data?.meta?.total ?? allVendorProducts.length;
  const activeCount = allVendorProducts.filter((p) => p.status === 'ACTIVE' && p.stock > 0).length;
  const outOfStockCount = allVendorProducts.filter((p) => p.stock === 0 || p.status === 'OUT_OF_STOCK').length;
  const suspendedCount = allVendorProducts.filter((p) => p.status === 'SUSPENDED').length;

  // Categories list
  const categoryOptions = useMemo(() => {
    const defaultCategories = [
      'All',
      'Seeds & Seedlings',
      'Vegetables',
      'Plants & Seedlings',
      'Fertilizers',
      'Farm Tools',
      'Agro Chemicals',
    ];
    const fromDb = allVendorProducts.map((p) => p.category).filter(Boolean);
    const combined = Array.from(new Set([...defaultCategories, ...fromDb]));
    return combined.slice(0, 8);
  }, [allVendorProducts]);

  // Action Handlers
  const handleToggleSuspend = async (product: ProductItem) => {
    const nextStatus = product.status === 'Suspended' ? 'ACTIVE' : 'SUSPENDED';
    try {
      await updateProductStatus({ id: product.id, status: nextStatus }).unwrap();
      showToast(`Product ${nextStatus === 'ACTIVE' ? 'reactivated' : 'suspended'} successfully.`);
    } catch (err: any) {
      console.error('Failed to update status:', err);
      showToast(err?.data?.message || 'Failed to update product status', 'error');
    } finally {
      setProductToSuspend(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id).unwrap();
      showToast('Product removed from catalogue successfully.');
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      showToast(err?.data?.message || 'Failed to delete product', 'error');
    } finally {
      setProductToDelete(null);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    navigate(`/vendor/product/edit/${editingProduct.id}`);
    setEditingProduct(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddProductModal(false);
    navigate('/vendor/product/add');
  };

  return (
    <div className="w-full max-w-full flex flex-col gap-6 font-['Inter'] pb-16 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200 border ${
          toastMessage.type === 'success'
            ? 'bg-[#062E35] text-white border-teal-500/30'
            : 'bg-rose-900 text-white border-rose-500/30'
        }`}>
          {toastMessage.type === 'success' ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-300 shrink-0" />
          )}
          <span className="text-xs font-semibold">{toastMessage.text}</span>
        </div>
      )}

      {/* 1. Header Section */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
              My Products
            </h1>
            {isFetching && (
              <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Manage your store inventory, pricing, catalog items, and stock availability for {vendorStoreName}.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            type="button"
            onClick={() => setShowDefaultProductsModal(true)}
            className="px-4 py-2.5 rounded-full border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-semibold flex items-center gap-2 shadow-2xs transition-all cursor-pointer active:scale-95"
          >
            <Layers className="w-4 h-4 text-slate-500" />
            <span>Catalogue Templates</span>
          </button>

          <button
            type="button"
            onClick={() => navigate('/vendor/product/add')}
            className="px-5 py-2.5 rounded-full bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
          >
            <Plus className="w-4 h-4 text-white" strokeWidth={2.4} />
            <span>Add Product</span>
          </button>
        </div>
      </div>

      {/* 2. Top Metric Summary Cards (Strictly for this vendor) */}
      <ProductMetricsGrid
        totalCount={totalCount}
        activeCount={activeCount}
        outOfStockCount={outOfStockCount}
        suspendedCount={suspendedCount}
      />

      {/* 3. Filter Bar (Search + Category Capsule Tabs + Status Dropdown) */}
      <ProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        categoryOptions={categoryOptions}
        onFilterChange={() => setCurrentPage(1)}
        placeholder="Search my products by title, SKU..."
      />

      {/* 4. Products Table Container & Pagination */}
      {isLoading ? (
        <div className="w-full min-h-[300px] bg-white rounded-2xl border border-slate-200/80 p-12 flex flex-col items-center justify-center gap-3">
          <div className="w-9 h-9 border-3 border-[#062E35] border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-500">Loading products from database...</span>
        </div>
      ) : (
        <ProductTable
          products={currentProducts}
          startIndex={startIndex}
          itemsPerPage={itemsPerPage}
          totalFiltered={totalFiltered}
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={setCurrentPage}
          onView={(p) => setViewingProduct(p)}
          onEdit={(p) => navigate(`/vendor/product/edit/${p.id}`)}
          onSuspend={(p) => setProductToSuspend(p)}
          onDelete={(p) => setProductToDelete(p)}
          showVendorColumn={false}
        />
      )}

      {/* 5. Modals (View, Edit, Suspend, Delete, Add) */}
      <ProductModals
        viewingProduct={viewingProduct}
        setViewingProduct={setViewingProduct}
        editingProduct={editingProduct}
        setEditingProduct={setEditingProduct}
        handleSaveEdit={handleSaveEdit}
        productToSuspend={productToSuspend}
        setProductToSuspend={setProductToSuspend}
        handleToggleSuspend={handleToggleSuspend}
        productToDelete={productToDelete}
        setProductToDelete={setProductToDelete}
        handleConfirmDelete={handleConfirmDelete}
        showAddProductModal={showAddProductModal}
        setShowAddProductModal={setShowAddProductModal}
        newProductForm={newProductForm}
        setNewProductForm={setNewProductForm}
        handleCreateProduct={handleCreateProduct}
        categoryOptions={categoryOptions}
        fixedVendor={vendorStoreName}
        onEditDirect={(p) => navigate(`/vendor/product/edit/${p.id}`)}
      />

      {/* 6. Catalogue Templates / Default Products Modal */}
      {showDefaultProductsModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0E4F5A]" />
                <h3 className="text-lg font-bold text-slate-900">Catalogue Templates</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowDefaultProductsModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 flex flex-col gap-4">
              <p className="text-sm text-slate-600 leading-relaxed">
                Pre-configured product catalogue templates assigned automatically to your storefront:
              </p>

              <div className="flex flex-col gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-slate-900">Standard Agricultural Seeds Pack</div>
                    <div className="text-xs text-slate-500">Includes pre-approved organic crop seeds</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-slate-900">Fertilizers & Nutrients Bundle</div>
                    <div className="text-xs text-slate-500">Certified compost and macro nutrients</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDefaultProductsModal(false)}
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#062E35] hover:bg-[#0A434D] text-white shadow-xs transition-all cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VendorProduct;
