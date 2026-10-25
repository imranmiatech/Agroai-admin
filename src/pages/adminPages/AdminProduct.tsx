import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, CheckCircle2, AlertCircle, RefreshCw } from 'lucide-react';
import {
  ProductMetricsGrid,
  ProductFilters,
  ProductTable,
  ProductModals
} from '../../components/adminComponents/product';
import {
  useGetProductsQuery,
  useUpdateProductStatusMutation,
  useDeleteProductMutation,
  useProductsPrefetch,
  useGetCategoriesQuery,
  type ProductItem as BackendProductItem,
} from '../../redux';

export interface ProductItem {
  id: string;
  sku: string;
  title: string;
  category: string;
  price: number;
  compareAtPrice?: number | null;
  stock: number;
  vendor: string;
  status: 'Active' | 'Suspended' | 'Out of Stock' | string;
  summary?: string;
  description: string;
  highlights?: string[];
  badges?: string[];
  specifications?: Record<string, string> | null;
  imageColor?: string;
  thumbnail?: string | null;
  images?: string[];
  rating?: number;
}

const mapBackendToProductItem = (p: BackendProductItem): ProductItem => {
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
    vendor: p.vendor?.businessName || (p.vendorId ? `Vendor #${p.vendorId.slice(0, 6)}` : 'Platform Admin'),
    status: uiStatus,
    summary: p.summary || '',
    description: p.description || p.summary || 'Quality certified agricultural merchandise.',
    highlights: Array.isArray(p.highlights) ? p.highlights : [],
    badges: Array.isArray(p.badges) ? p.badges : [],
    specifications: p.specifications || null,
    imageColor: '#E0F7FA',
    thumbnail: p.thumbnail || p.images?.[0] || null,
    images: p.images || [],
    rating: 4.9,
  };
};

export const AdminProduct: React.FC = () => {
  const navigate = useNavigate();

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Debounce search input (250ms) to avoid spamming the backend
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 250);
    return () => clearTimeout(timer);
  }, [searchTerm]);

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Background prefetching hook for zero-latency pagination
  const prefetchProducts = useProductsPrefetch('getProducts');
  const { data: categoriesResp } = useGetCategoriesQuery();

  // Reset page to 1 when filters change
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

  // Query Backend API (GET /products) with active pagination & filters
  const queryParams = useMemo(() => ({
    page: currentPage,
    limit: itemsPerPage,
    search: debouncedSearch.trim() || undefined,
    category: selectedCategory !== 'All' ? selectedCategory : undefined,
    status: backendStatusFilter,
  }), [currentPage, itemsPerPage, debouncedSearch, selectedCategory, backendStatusFilter]);

  const {
    data: apiResponse,
    isLoading,
    isFetching,
  } = useGetProductsQuery(queryParams);

  // Background metric overview query (unfiltered) to show global store metrics
  const { data: metricsResponse } = useGetProductsQuery({ limit: 500 });

  // Mutations
  const [updateProductStatus] = useUpdateProductStatusMutation();
  const [deleteProduct] = useDeleteProductMutation();

  // Notification / Alert State
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

  // Fallback new product form for quick modal if used
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    sku: '',
    category: 'Seeds & Seedlings',
    price: '',
    stock: '',
    vendor: 'Krisikunjo Verified',
    description: ''
  });

  // Derived Products List from Database Response
  const currentProducts = useMemo(() => {
    const rawList = apiResponse?.data?.products || [];
    return rawList.map(mapBackendToProductItem);
  }, [apiResponse]);

  const totalFiltered = apiResponse?.data?.meta?.total ?? 0;
  const totalPages = apiResponse?.data?.meta?.totalPages ?? 1;
  const startIndex = (currentPage - 1) * itemsPerPage;

  // Prefetch adjacent pages in background
  useEffect(() => {
    if (currentPage < totalPages) {
      prefetchProducts({ ...queryParams, page: currentPage + 1 });
    }
    if (currentPage > 1) {
      prefetchProducts({ ...queryParams, page: currentPage - 1 });
    }
  }, [currentPage, totalPages, queryParams, prefetchProducts]);

  // Global Metric Counts (from Database)
  const allProducts = metricsResponse?.data?.products || [];
  const totalCount = metricsResponse?.data?.meta?.total ?? allProducts.length;
  const activeCount = allProducts.filter((p) => p.status === 'ACTIVE' && p.stock > 0).length;
  const outOfStockCount = allProducts.filter((p) => p.stock === 0 || p.status === 'OUT_OF_STOCK').length;
  const suspendedCount = allProducts.filter((p) => p.status === 'SUSPENDED').length;

  // Distinct category options from Database + dynamic backend categories
  const categoryOptions = useMemo(() => {
    const fromApi = Array.isArray(categoriesResp?.data)
      ? categoriesResp.data
      : (categoriesResp?.data as { categories?: { name: string }[] })?.categories || [];
    const apiNames = fromApi.map((c) => c.name).filter(Boolean);
    const fromDb = allProducts.map((p) => p.category).filter(Boolean);
    const combined = Array.from(new Set(['All', ...apiNames, ...fromDb]));
    return combined;
  }, [categoriesResp, allProducts]);

  // Actions
  const handleToggleSuspend = async (product: ProductItem) => {
    const nextStatus = product.status === 'Suspended' ? 'ACTIVE' : 'SUSPENDED';
    try {
      await updateProductStatus({ id: product.id, status: nextStatus }).unwrap();
      showToast(`Product ${nextStatus === 'ACTIVE' ? 'reactivated' : 'suspended'} successfully.`);
    } catch (err: any) {
      console.error('Failed to update product status:', err);
      showToast(err?.data?.message || 'Failed to update status', 'error');
    } finally {
      setProductToSuspend(null);
    }
  };

  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    try {
      await deleteProduct(productToDelete.id).unwrap();
      showToast('Product removed from database successfully.');
    } catch (err: any) {
      console.error('Failed to delete product:', err);
      showToast(err?.data?.message || 'Failed to delete product from database', 'error');
    } finally {
      setProductToDelete(null);
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    // Navigate directly to the full edit page for full multimedia and spec editing
    navigate(`/admin/product/edit/${editingProduct.id}`);
    setEditingProduct(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddProductModal(false);
    navigate('/admin/product/add');
  };

  return (
    <div className="w-full max-w-full flex flex-col gap-6 font-['Inter'] pb-16 animate-in fade-in duration-200">
      {/* Toast Notification */}
      {toastMessage && (
        <div className={`fixed top-6 right-6 z-50 px-5 py-3.5 rounded-2xl shadow-xl flex items-center gap-3 animate-in slide-in-from-top-4 duration-200 border ${toastMessage.type === 'success'
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
              Products Catalog
            </h1>
            {isFetching && (
              <RefreshCw className="w-4 h-4 text-slate-400 animate-spin" />
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">
            Real-time database inventory, marketplace catalog, and vendor merchandise.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate('/admin/product/add')}
          className="px-5 py-2.5 rounded-full bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 text-white" strokeWidth={2.4} />
          <span>Add Product</span>
        </button>
      </div>

      {/* 2. Top Metric Summary Cards (Real database counts) */}
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
        placeholder="Search database products by title, SKU, or vendor..."
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
          onEdit={(p) => navigate(`/admin/product/edit/${p.id}`)}
          onSuspend={(p) => setProductToSuspend(p)}
          onDelete={(p) => setProductToDelete(p)}
          showVendorColumn={true}
        />
      )}

      {/* 5. Modals (View, Edit, Suspend, Delete) */}
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
        onEditDirect={(p) => navigate(`/admin/product/edit/${p.id}`)}
      />
    </div>
  );
};

export default AdminProduct;
