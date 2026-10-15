import { useState, useMemo } from 'react';
import { 
  Search, 
  Trash2, 
  Edit2, 
  X, 
  ChevronDown, 
  Check, 
  Layers
} from 'lucide-react';

export interface VendorProductItem {
  id: string;
  name: string;
  category: 'Produce' | 'Nutrition' | 'Baby Care' | 'Toys' | 'Safety' | 'Accessories';
  price: number;
  offer: string;
  availability: 'In stock' | 'Low stock' | 'Out of Stock';
  status: 'Active' | 'Draft' | 'Inactive';
}

export const VendorProduct = () => {
  // Realistic product items matching Figma node 26785:90074
  const [products, setProducts] = useState<VendorProductItem[]>([
    {
      id: 'VPD-01',
      name: 'Baby Organic Yogurt',
      category: 'Produce',
      price: 3.50,
      offer: '20% Off',
      availability: 'In stock',
      status: 'Active'
    },
    {
      id: 'VPD-02',
      name: 'Baby Organic Yogurt',
      category: 'Produce',
      price: 3.50,
      offer: '20% Off',
      availability: 'In stock',
      status: 'Active'
    },
    {
      id: 'VPD-03',
      name: 'Baby Organic Yogurt',
      category: 'Produce',
      price: 3.50,
      offer: '20% Off',
      availability: 'Out of Stock',
      status: 'Draft'
    },
    {
      id: 'VPD-04',
      name: 'Baby Organic Yogurt',
      category: 'Produce',
      price: 3.50,
      offer: '20% Off',
      availability: 'In stock',
      status: 'Active'
    },
    {
      id: 'VPD-05',
      name: 'Baby Organic Yogurt',
      category: 'Produce',
      price: 3.50,
      offer: '20% Off',
      availability: 'In stock',
      status: 'Active'
    },
    {
      id: 'VPD-06',
      name: 'Organic Fruit & Veg Puree Pouch',
      category: 'Nutrition',
      price: 2.20,
      offer: '15% Off',
      availability: 'In stock',
      status: 'Active'
    },
    {
      id: 'VPD-07',
      name: 'Biodegradable Eco Baby Wipes',
      category: 'Baby Care',
      price: 4.80,
      offer: '10% Off',
      availability: 'In stock',
      status: 'Active'
    },
    {
      id: 'VPD-08',
      name: 'Natural Beechwood Rattle & Teether',
      category: 'Toys',
      price: 9.99,
      offer: 'No Offer',
      availability: 'Out of Stock',
      status: 'Draft'
    }
  ]);

  // Search & Filter
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);

  // Modals
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDefaultProductsModal, setShowDefaultProductsModal] = useState(false);

  // Selected for edit/delete
  const [selectedProduct, setSelectedProduct] = useState<VendorProductItem | null>(null);

  // Form states
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState<VendorProductItem['category']>('Produce');
  const [formPrice, setFormPrice] = useState('3.50');
  const [formOffer, setFormOffer] = useState('20% Off');
  const [formAvailability, setFormAvailability] = useState<VendorProductItem['availability']>('In stock');
  const [formStatus, setFormStatus] = useState<VendorProductItem['status']>('Active');

  const categories: Array<VendorProductItem['category']> = [
    'Produce',
    'Nutrition',
    'Baby Care',
    'Toys',
    'Safety',
    'Accessories'
  ];

  // Filtered Products
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = 
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.price.toString().includes(searchTerm);

      const matchesCategory = 
        selectedCategory === 'All' || p.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [products, searchTerm, selectedCategory]);

  // Handlers
  const handleOpenAdd = () => {
    setFormName('');
    setFormCategory('Produce');
    setFormPrice('3.50');
    setFormOffer('20% Off');
    setFormAvailability('In stock');
    setFormStatus('Active');
    setShowAddModal(true);
  };

  const handleOpenEdit = (p: VendorProductItem) => {
    setSelectedProduct(p);
    setFormName(p.name);
    setFormCategory(p.category);
    setFormPrice(p.price.toFixed(2));
    setFormOffer(p.offer);
    setFormAvailability(p.availability);
    setFormStatus(p.status);
    setShowEditModal(true);
  };

  const handleOpenDelete = (p: VendorProductItem) => {
    setSelectedProduct(p);
    setShowDeleteModal(true);
  };

  const handleSaveAdd = (e: React.FormEvent) => {
    e.preventDefault();
    const newProduct: VendorProductItem = {
      id: `VPD-${String(products.length + 1).padStart(2, '0')}`,
      name: formName || 'Baby Organic Yogurt',
      category: formCategory,
      price: parseFloat(formPrice) || 3.50,
      offer: formOffer || '20% Off',
      availability: formAvailability,
      status: formStatus
    };
    setProducts([newProduct, ...products]);
    setShowAddModal(false);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedProduct) return;
    setProducts(products.map(p => 
      p.id === selectedProduct.id 
        ? {
            ...p,
            name: formName,
            category: formCategory,
            price: parseFloat(formPrice) || 0,
            offer: formOffer,
            availability: formAvailability,
            status: formStatus
          }
        : p
    ));
    setShowEditModal(false);
  };

  const handleConfirmDelete = () => {
    if (!selectedProduct) return;
    setProducts(products.filter(p => p.id !== selectedProduct.id));
    setShowDeleteModal(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full font-['Inter']">
      {/* 1. Header Section matching Figma node 26785:90074 */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            My Products
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage the products and services you make available through Alurei.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => setShowDefaultProductsModal(true)}
            className="px-4 py-2.5 rounded-xl border border-[#0E4F5A] text-[#0E4F5A] bg-white hover:bg-slate-50 font-semibold text-sm transition-all cursor-pointer shadow-xs"
          >
            Manage Default Products
          </button>
          <button
            type="button"
            onClick={handleOpenAdd}
            className="px-5 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A3F47] text-white font-semibold text-sm transition-all cursor-pointer shadow-sm active:scale-98"
          >
            + Add Product
          </button>
        </div>
      </div>

      {/* 2. Search & Category Filter Bar (Figma Container) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Search input pill */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, or phone…"
            className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200 bg-[#F8FAFC] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0E4F5A] focus:bg-white transition-all font-['Inter']"
          />
        </div>

        {/* Category Dropdown Filter */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
            className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-sm font-medium transition-all cursor-pointer"
          >
            <span>{selectedCategory === 'All' ? 'Categories' : selectedCategory}</span>
            <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-600 text-xs font-semibold flex items-center justify-center">
              12
            </span>
            <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
          </button>

          {/* Dropdown Menu */}
          {isCategoryDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-20" 
                onClick={() => setIsCategoryDropdownOpen(false)} 
              />
              <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-30 animate-in fade-in-50 zoom-in-95 duration-100">
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('All');
                    setIsCategoryDropdownOpen(false);
                  }}
                  className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                    selectedCategory === 'All' ? 'text-[#0E4F5A] font-semibold bg-slate-50/60' : 'text-slate-700'
                  }`}
                >
                  <span>All Categories</span>
                  {selectedCategory === 'All' && <Check className="w-4 h-4 text-[#0E4F5A]" />}
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => {
                      setSelectedCategory(cat);
                      setIsCategoryDropdownOpen(false);
                    }}
                    className={`w-full px-4 py-2 text-left text-sm flex items-center justify-between hover:bg-slate-50 cursor-pointer ${
                      selectedCategory === cat ? 'text-[#0E4F5A] font-semibold bg-slate-50/60' : 'text-slate-700'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <Check className="w-4 h-4 text-[#0E4F5A]" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* 3. Products Table Card (Matching Figma Table exactly) */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200/70 bg-[#FBFDFE]">
                <th className="py-4 px-6 text-sm font-bold text-slate-900">
                  Product
                </th>
                <th className="py-4 px-6 text-sm font-bold text-slate-900">
                  Category
                </th>
                <th className="py-4 px-6 text-sm font-bold text-slate-900">
                  Price
                </th>
                <th className="py-4 px-6 text-sm font-bold text-slate-900">
                  Offer
                </th>
                <th className="py-4 px-6 text-sm font-bold text-slate-900">
                  Availability
                </th>
                <th className="py-4 px-6 text-sm font-bold text-slate-900">
                  Status
                </th>
                <th className="py-4 px-6 text-sm font-bold text-slate-900 text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {filteredProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    No products found matching your search.
                  </td>
                </tr>
              ) : (
                filteredProducts.map((p) => {
                  const isOutOfStock = p.availability === 'Out of Stock';
                  const isDraft = p.status === 'Draft';

                  return (
                    <tr 
                      key={p.id}
                      className="hover:bg-slate-50/80 transition-colors group"
                    >
                      {/* Product Name */}
                      <td className="py-4.5 px-6 font-semibold text-slate-900">
                        {p.name}
                      </td>

                      {/* Category */}
                      <td className="py-4.5 px-6 font-medium text-[#0E4F5A]">
                        {p.category}
                      </td>

                      {/* Price */}
                      <td className="py-4.5 px-6 font-semibold text-slate-900">
                        £{p.price.toFixed(2)}
                      </td>

                      {/* Offer Capsule */}
                      <td className="py-4.5 px-6">
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-[#EEF2FF] text-[#4F46E5] tracking-tight">
                          {p.offer}
                        </span>
                      </td>

                      {/* Availability Capsule */}
                      <td className="py-4.5 px-6">
                        {isOutOfStock ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#FFF1F2] text-[#F43F5E]">
                            Out of Stock
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#10B981]">
                            {p.availability}
                          </span>
                        )}
                      </td>

                      {/* Status Capsule */}
                      <td className="py-4.5 px-6">
                        {isDraft ? (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#F1F5F9] text-[#64748B]">
                            Draft
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-[#ECFDF5] text-[#10B981]">
                            {p.status}
                          </span>
                        )}
                      </td>

                      {/* Action Icons */}
                      <td className="py-4.5 px-6 text-right">
                        <div className="flex items-center justify-end gap-3 text-slate-400">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(p)}
                            className="p-1 rounded-lg hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                            title="Edit Product"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleOpenDelete(p)}
                            className="p-1 rounded-lg hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Add Product */}
      {showAddModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Add New Product</h3>
              <button
                type="button"
                onClick={() => setShowAddModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAdd} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Baby Organic Yogurt"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as VendorProductItem['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Price (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Offer Tag
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 20% Off"
                    value={formOffer}
                    onChange={(e) => setFormOffer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Availability
                  </label>
                  <select
                    value={formAvailability}
                    onChange={(e) => setFormAvailability(e.target.value as VendorProductItem['availability'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                  >
                    <option value="In stock">In stock</option>
                    <option value="Low stock">Low stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                  Publish Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as VendorProductItem['status'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#062E35] hover:bg-[#0A3F47] text-white shadow-sm cursor-pointer"
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Edit Product */}
      {showEditModal && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Edit Product</h3>
              <button
                type="button"
                onClick={() => setShowEditModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="p-6 flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                  Product Name
                </label>
                <input
                  type="text"
                  required
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Category
                  </label>
                  <select
                    value={formCategory}
                    onChange={(e) => setFormCategory(e.target.value as VendorProductItem['category'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                  >
                    {categories.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Price (£)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={formPrice}
                    onChange={(e) => setFormPrice(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Offer Tag
                  </label>
                  <input
                    type="text"
                    value={formOffer}
                    onChange={(e) => setFormOffer(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                    Availability
                  </label>
                  <select
                    value={formAvailability}
                    onChange={(e) => setFormAvailability(e.target.value as VendorProductItem['availability'])}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                  >
                    <option value="In stock">In stock</option>
                    <option value="Low stock">Low stock</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase mb-1.5">
                  Publish Status
                </label>
                <select
                  value={formStatus}
                  onChange={(e) => setFormStatus(e.target.value as VendorProductItem['status'])}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                >
                  <option value="Active">Active</option>
                  <option value="Draft">Draft</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowEditModal(false)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#0E4F5A] hover:bg-[#093A43] text-white shadow-sm cursor-pointer"
                >
                  Update Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Delete Confirmation */}
      {showDeleteModal && selectedProduct && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Delete Product</h3>
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                Are you sure you want to delete <strong className="text-slate-900">{selectedProduct.name}</strong> from your catalogue? This action cannot be undone.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm transition-all cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal / Drawer: Manage Default Products */}
      {showDefaultProductsModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-[#0E4F5A]" />
                <h3 className="text-lg font-bold text-slate-900">Manage Default Products</h3>
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
                Configure default products and catalogue templates assigned automatically to your partner storefront.
              </p>

              <div className="flex flex-col gap-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-slate-900">Standard Grocery Catalogue</div>
                    <div className="text-xs text-slate-500">Includes 45 pre-approved essential items</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                    Active
                  </span>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-sm text-slate-900">Seasonal Promotions Pack</div>
                    <div className="text-xs text-slate-500">Auto-applies 20% discount on selected kids items</div>
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
                className="px-5 py-2 rounded-xl text-sm font-semibold bg-[#062E35] hover:bg-[#0A3F47] text-white shadow-sm transition-all cursor-pointer"
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
