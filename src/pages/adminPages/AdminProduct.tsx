import { useState } from 'react';
import { 
  Package, 
  Search, 
  Eye, 
  Edit3, 
  Ban, 
  Trash2, 
  Plus, 
  X, 
  TrendingUp, 
  ChevronLeft, 
  ChevronRight, 
  Store, 
  CheckCircle2, 
  AlertCircle
} from 'lucide-react';

export interface ProductItem {
  id: string;
  sku: string;
  title: string;
  category: 'Baby Care' | 'Nursery' | 'Nutrition' | 'Safety' | 'Toys' | 'Feeding';
  price: number;
  stock: number;
  vendor: string;
  status: 'Active' | 'Suspended' | 'Out of Stock';
  description: string;
  imageColor: string;
  rating: number;
}

export const AdminProduct = () => {
  // 24 realistic products for multi-page pagination demo
  const [products, setProducts] = useState<ProductItem[]>([
    {
      id: 'PRD-01',
      sku: 'ALU-BC-001',
      title: 'Organic Bamboo Baby Swaddle Wraps (Pack of 3)',
      category: 'Baby Care',
      price: 28.50,
      stock: 45,
      vendor: 'PureBotanica Organics',
      status: 'Active',
      description: 'Ultra-soft, breathable bamboo cotton swaddles designed for sensitive newborn skin.',
      imageColor: '#E0F7FA',
      rating: 4.9
    },
    {
      id: 'PRD-02',
      sku: 'ALU-SF-002',
      title: 'Smart HD WiFi Baby Monitor with Night Vision',
      category: 'Safety',
      price: 139.99,
      stock: 14,
      vendor: 'OmniGadget World',
      status: 'Active',
      description: '1080p full HD camera with temperature sensor, two-way audio talk, and encrypted mobile stream.',
      imageColor: '#E0E7FF',
      rating: 4.8
    },
    {
      id: 'PRD-03',
      sku: 'ALU-FD-003',
      title: 'Ergonomic Silicone Baby Feeding Set & Bibs',
      category: 'Feeding',
      price: 24.99,
      stock: 0,
      vendor: 'Little Sprout Essentials',
      status: 'Out of Stock',
      description: 'BPA-free suction plate, bowl, training cup, and adjustable waterproof silicone bibs.',
      imageColor: '#FEF3C7',
      rating: 4.7
    },
    {
      id: 'PRD-04',
      sku: 'ALU-NR-004',
      title: 'Convertible Wooden Crib & Toddler Bed 3-in-1',
      category: 'Nursery',
      price: 320.00,
      stock: 8,
      vendor: 'Dunnes Family Lifestyle',
      status: 'Active',
      description: 'Solid Nordic pine crib with non-toxic finish that transitions seamlessly to a toddler daybed.',
      imageColor: '#DCFCE7',
      rating: 4.9
    },
    {
      id: 'PRD-05',
      sku: 'ALU-TY-005',
      title: 'Montessori Wooden Sensory Stacking Blocks',
      category: 'Toys',
      price: 34.00,
      stock: 22,
      vendor: 'The Wooden Toy Box',
      status: 'Active',
      description: 'Handcrafted beechwood blocks that promote fine motor skills and tactile problem-solving.',
      imageColor: '#F3E8FF',
      rating: 5.0
    },
    {
      id: 'PRD-06',
      sku: 'ALU-NT-006',
      title: 'Organic Stage 1 Infant Oatmeal Porridge (6x200g)',
      category: 'Nutrition',
      price: 18.75,
      stock: 65,
      vendor: 'PureBotanica Organics',
      status: 'Active',
      description: 'Certified biodynamic organic oats fortified with essential iron and vitamins for early weaning.',
      imageColor: '#FEE2E2',
      rating: 4.6
    },
    {
      id: 'PRD-07',
      sku: 'ALU-BC-007',
      title: 'Natural Chamomile & Shea Butter Baby Balm',
      category: 'Baby Care',
      price: 14.50,
      stock: 38,
      vendor: 'PureBotanica Organics',
      status: 'Suspended',
      description: 'Soothing barrier cream for nappy care and dry skin patches with organic chamomile oil.',
      imageColor: '#E0F7FA',
      rating: 4.4
    },
    {
      id: 'PRD-08',
      sku: 'ALU-SF-008',
      title: 'No-Touch Digital Infrared Forehead Thermometer',
      category: 'Safety',
      price: 42.00,
      stock: 19,
      vendor: 'OmniGadget World',
      status: 'Active',
      description: 'Instant 1-second medical grade temperature readout with color-coded fever guidance.',
      imageColor: '#E0E7FF',
      rating: 4.8
    },
    {
      id: 'PRD-09',
      sku: 'ALU-NR-009',
      title: 'Breathing White Noise Sound Machine & Night Light',
      category: 'Nursery',
      price: 36.99,
      stock: 28,
      vendor: 'OmniGadget World',
      status: 'Active',
      description: 'Features 24 calming sounds including womb heartbeat, pink noise, and adjustable warm glow light.',
      imageColor: '#DCFCE7',
      rating: 4.7
    },
    {
      id: 'PRD-10',
      sku: 'ALU-TY-010',
      title: 'Soft Activity Floor Playmat with Overhead Gym',
      category: 'Toys',
      price: 58.00,
      stock: 12,
      vendor: 'The Wooden Toy Box',
      status: 'Active',
      description: 'Extra thick quilted tummy-time mat with hanging crinkle sensory toys and baby-safe mirror.',
      imageColor: '#F3E8FF',
      rating: 4.8
    },
    {
      id: 'PRD-11',
      sku: 'ALU-FD-011',
      title: 'Electric Steam Baby Bottle Steriliser & Dryer',
      category: 'Feeding',
      price: 89.90,
      stock: 0,
      vendor: 'Little Sprout Essentials',
      status: 'Out of Stock',
      description: 'Eliminates 99.9% of bacteria in 6 minutes and keeps bottles sterile for up to 24 hours.',
      imageColor: '#FEF3C7',
      rating: 4.9
    },
    {
      id: 'PRD-12',
      sku: 'ALU-NT-012',
      title: 'Cold-Pressed Flaxseed & DHA Omega-3 Drops 50ml',
      category: 'Nutrition',
      price: 19.99,
      stock: 50,
      vendor: 'PureBotanica Organics',
      status: 'Active',
      description: 'Plant-derived vegan brain development drops tailored for infants and toddlers.',
      imageColor: '#FEE2E2',
      rating: 4.9
    },
    {
      id: 'PRD-13',
      sku: 'ALU-BC-013',
      title: 'Biodegradable Unscented Water Baby Wipes (12x60pk)',
      category: 'Baby Care',
      price: 29.99,
      stock: 110,
      vendor: 'Little Sprout Essentials',
      status: 'Active',
      description: '99.9% purified water with organic fruit extract. 100% compostable and plastic-free.',
      imageColor: '#E0F7FA',
      rating: 4.9
    },
    {
      id: 'PRD-14',
      sku: 'ALU-SF-014',
      title: 'Magnetic Child Safety Cupboard Locks (10 Locks + 2 Keys)',
      category: 'Safety',
      price: 22.50,
      stock: 45,
      vendor: 'OmniGadget World',
      status: 'Active',
      description: 'Invisible inside-cabinet baby proofing locks with heavy-duty 3M adhesive backing.',
      imageColor: '#E0E7FF',
      rating: 4.6
    },
    {
      id: 'PRD-15',
      sku: 'ALU-NR-015',
      title: 'Organic Wool Mattress Topper for Cot 120x60cm',
      category: 'Nursery',
      price: 64.00,
      stock: 6,
      vendor: 'Dunnes Family Lifestyle',
      status: 'Suspended',
      description: 'Naturally temperature-regulating British wool cot mattress pad with organic cotton cover.',
      imageColor: '#DCFCE7',
      rating: 4.5
    },
    {
      id: 'PRD-16',
      sku: 'ALU-TY-016',
      title: 'Hand-Knitted Organic Cotton Bunny Teething Rattle',
      category: 'Toys',
      price: 16.00,
      stock: 35,
      vendor: 'The Wooden Toy Box',
      status: 'Active',
      description: 'Gentle ringing sound with smooth untreated maple wood teething ring for sore gums.',
      imageColor: '#F3E8FF',
      rating: 5.0
    },
    {
      id: 'PRD-17',
      sku: 'ALU-FD-017',
      title: 'Anti-Colic Glass Feeding Bottles Starter Kit (4 Bottles)',
      category: 'Feeding',
      price: 38.00,
      stock: 18,
      vendor: 'Little Sprout Essentials',
      status: 'Active',
      description: 'Thermal shock resistant borosilicate glass with breast-like silicone slow flow teats.',
      imageColor: '#FEF3C7',
      rating: 4.7
    },
    {
      id: 'PRD-18',
      sku: 'ALU-NT-018',
      title: 'Organic Vitamin D3 Sun Drops for Babies 400IU',
      category: 'Nutrition',
      price: 12.50,
      stock: 75,
      vendor: 'PureBotanica Organics',
      status: 'Active',
      description: 'Pure coconut MCT oil base, providing daily recommended pediatric dosage in 1 single drop.',
      imageColor: '#FEE2E2',
      rating: 4.9
    },
    {
      id: 'PRD-19',
      sku: 'ALU-BC-019',
      title: 'Gentle Tear-Free Hair & Body Wash Refill Pouch 1L',
      category: 'Baby Care',
      price: 21.00,
      stock: 40,
      vendor: 'PureBotanica Organics',
      status: 'Active',
      description: 'Eco-refill formula containing organic calendula and oat kernel oil, hypoallergenic certified.',
      imageColor: '#E0F7FA',
      rating: 4.8
    },
    {
      id: 'PRD-20',
      sku: 'ALU-SF-020',
      title: 'Auto-Close Extra Tall Pressure Mounted Stair Gate',
      category: 'Safety',
      price: 74.99,
      stock: 0,
      vendor: 'OmniGadget World',
      status: 'Out of Stock',
      description: 'One-handed double locking safety handle with magnetic auto-shut hinge mechanism.',
      imageColor: '#E0E7FF',
      rating: 4.7
    },
    {
      id: 'PRD-21',
      sku: 'ALU-NR-021',
      title: 'Breathable 3D Mesh Cot Bumper Alternative',
      category: 'Nursery',
      price: 29.50,
      stock: 15,
      vendor: 'Dunnes Family Lifestyle',
      status: 'Suspended',
      description: 'Tested air-permeable mesh cot liner designed to prevent limb entrapment safely.',
      imageColor: '#DCFCE7',
      rating: 4.3
    },
    {
      id: 'PRD-22',
      sku: 'ALU-TY-022',
      title: 'Wooden First Steps Baby Push Walker & Activity Box',
      category: 'Toys',
      price: 68.00,
      stock: 9,
      vendor: 'The Wooden Toy Box',
      status: 'Active',
      description: 'Sturdy rubber-trimmed wheels with built-in bead maze, shape sorter, and xylophone.',
      imageColor: '#F3E8FF',
      rating: 4.9
    },
    {
      id: 'PRD-23',
      sku: 'ALU-FD-023',
      title: 'Compact Foldable Travel High Chair with Harness',
      category: 'Feeding',
      price: 52.00,
      stock: 24,
      vendor: 'Little Sprout Essentials',
      status: 'Active',
      description: 'Lightweight booster chair that clamps securely onto standard dining chairs, includes carry bag.',
      imageColor: '#FEF3C7',
      rating: 4.8
    },
    {
      id: 'PRD-24',
      sku: 'ALU-NT-024',
      title: 'Electrolyte Hydration Sachets for Kids (Pack of 10)',
      category: 'Nutrition',
      price: 15.00,
      stock: 60,
      vendor: 'PureBotanica Organics',
      status: 'Active',
      description: 'Natural apple and berry hydration blend formulated without artificial sugars or colorings.',
      imageColor: '#FEE2E2',
      rating: 4.8
    }
  ]);

  // Search & Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');

  // Pagination State
  const [currentPage, setCurrentPage] = useState<number>(1);
  const itemsPerPage = 8;

  // Modal States
  const [viewingProduct, setViewingProduct] = useState<ProductItem | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductItem | null>(null);
  const [productToDelete, setProductToDelete] = useState<ProductItem | null>(null);
  const [productToSuspend, setProductToSuspend] = useState<ProductItem | null>(null);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // New product form
  const [newProductForm, setNewProductForm] = useState({
    title: '',
    sku: '',
    category: 'Baby Care' as ProductItem['category'],
    price: '',
    stock: '',
    vendor: 'PureBotanica Organics',
    description: ''
  });

  // Calculate Metrics
  const totalCount = products.length;
  const activeCount = products.filter(p => p.status === 'Active').length;
  const outOfStockCount = products.filter(p => p.stock === 0 || p.status === 'Out of Stock').length;
  const suspendedCount = products.filter(p => p.status === 'Suspended').length;

  // Categories list
  const categoryOptions = ['All', 'Baby Care', 'Nursery', 'Nutrition', 'Safety', 'Toys', 'Feeding'];

  // Filtered Products
  const filteredProducts = products.filter((p) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch = p.title.toLowerCase().includes(term) ||
                          p.sku.toLowerCase().includes(term) ||
                          p.vendor.toLowerCase().includes(term);
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || p.status === selectedStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage) || 1;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // Actions
  const handleToggleSuspend = (product: ProductItem) => {
    const nextStatus = product.status === 'Suspended' ? 'Active' : 'Suspended';
    setProducts(products.map(p => p.id === product.id ? { ...p, status: nextStatus } : p));
    setProductToSuspend(null);
  };

  const handleConfirmDelete = () => {
    if (!productToDelete) return;
    setProducts(products.filter(p => p.id !== productToDelete.id));
    setProductToDelete(null);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProduct) return;
    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p));
    setEditingProduct(null);
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.title.trim()) return;

    const newProd: ProductItem = {
      id: 'PRD-' + (products.length + 1).toString().padStart(2, '0'),
      sku: newProductForm.sku || `ALU-${Date.now().toString().slice(-4)}`,
      title: newProductForm.title,
      category: newProductForm.category,
      price: parseFloat(newProductForm.price) || 29.99,
      stock: parseInt(newProductForm.stock) || 10,
      vendor: newProductForm.vendor,
      status: parseInt(newProductForm.stock) === 0 ? 'Out of Stock' : 'Active',
      description: newProductForm.description || 'Quality certified merchandise for family wellness.',
      imageColor: '#E0F7FA',
      rating: 5.0
    };

    setProducts([newProd, ...products]);
    setShowAddProductModal(false);
    setNewProductForm({
      title: '',
      sku: '',
      category: 'Baby Care',
      price: '',
      stock: '',
      vendor: 'PureBotanica Organics',
      description: ''
    });
  };

  return (
    <div className="flex flex-col gap-6 font-['Inter'] pb-16">
      {/* 1. Header Section */}
      <div className="flex items-start justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight leading-tight">
            Products
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Manage family care products, marketplace inventory, and vendor catalog.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setShowAddProductModal(true)}
          className="px-5 py-2.5 rounded-full bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-semibold flex items-center gap-2 shadow-xs transition-all cursor-pointer active:scale-95"
        >
          <Plus className="w-4 h-4 text-white" strokeWidth={2.4} />
          <span>Add Product</span>
        </button>
      </div>

      {/* 2. Top Metric Summary Cards (4 Cards matching Figma styling) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Products */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Total Products</span>
            <div className="w-8 h-8 rounded-xl bg-slate-50 text-slate-700 flex items-center justify-center">
              <Package className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
            {totalCount}
          </div>
          <div className="flex items-center gap-1 text-[#16A34A] text-xs font-semibold mt-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+12% from last month</span>
          </div>
        </div>

        {/* Active & In Stock */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Active & In Stock</span>
            <div className="w-8 h-8 rounded-xl bg-[#DCFCE7] text-[#16A34A] flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
            {activeCount}
          </div>
          <div className="text-xs font-medium text-slate-400 mt-2">
            Available on customer store
          </div>
        </div>

        {/* Out of Stock */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Out of Stock</span>
            <div className="w-8 h-8 rounded-xl bg-[#FEE4E2] text-[#D92D20] flex items-center justify-center">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
            {outOfStockCount}
          </div>
          <div className="text-xs font-semibold text-[#D92D20] mt-2">
            Needs inventory restock
          </div>
        </div>

        {/* Suspended Items */}
        <div className="bg-white rounded-3xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-all">
          <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
            <span>Suspended</span>
            <div className="w-8 h-8 rounded-xl bg-[#FEF3C7] text-[#D97706] flex items-center justify-center">
              <Ban className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-bold text-slate-900 tracking-tight mt-2">
            {suspendedCount}
          </div>
          <div className="text-xs font-medium text-slate-400 mt-2">
            Moderated or compliance hold
          </div>
        </div>
      </div>

      {/* 3. Filter Bar (Search + Category Capsule Tabs + Status Dropdown) */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200/80 shadow-2xs flex flex-col lg:flex-row items-center justify-between gap-4">
        {/* Search Input */}
        <div className="relative w-full lg:w-80">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search product name, SKU, vendor..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border-none bg-[#F1F5F9] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-[#062E35]/15 transition-all font-medium"
          />
        </div>

        {/* Category Pills & Status Filter */}
        <div className="flex items-center gap-3 w-full lg:w-auto overflow-x-auto justify-between lg:justify-end">
          {/* Category Capsule Tabs */}
          <div className="flex items-center bg-[#F1F5F9] p-1 rounded-full text-xs font-semibold gap-1 shrink-0">
            {categoryOptions.map((cat) => {
              const isActive = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  type="button"
                  onClick={() => {
                    setSelectedCategory(cat);
                    setCurrentPage(1);
                  }}
                  className={`px-3.5 py-1.5 rounded-full whitespace-nowrap transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#062E35] text-white shadow-xs' 
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Status Select */}
          <select
            value={selectedStatus}
            onChange={(e) => {
              setSelectedStatus(e.target.value);
              setCurrentPage(1);
            }}
            className="py-2 px-3 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none cursor-pointer shrink-0"
          >
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Suspended">Suspended</option>
            <option value="Out of Stock">Out of Stock</option>
          </select>
        </div>
      </div>

      {/* 4. Products Table Container */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-xs font-semibold text-slate-600">
                <th className="py-4 px-6">Product</th>
                <th className="py-4 px-6">Category</th>
                <th className="py-4 px-6">Price</th>
                <th className="py-4 px-6">Stock</th>
                <th className="py-4 px-6">Vendor</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {currentProducts.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400 text-xs">
                    No products found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                currentProducts.map((product) => (
                  <tr 
                    key={product.id} 
                    className="hover:bg-slate-50/70 transition-colors"
                  >
                    {/* Product Name & SKU */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs text-[#062E35]"
                          style={{ backgroundColor: product.imageColor }}
                        >
                          <Package className="w-5 h-5 opacity-90" />
                        </div>
                        <div className="flex flex-col min-w-0 max-w-xs sm:max-w-sm">
                          <span 
                            onClick={() => setViewingProduct(product)}
                            className="font-semibold text-slate-900 text-sm leading-tight truncate hover:text-[#062E35] cursor-pointer"
                            title={product.title}
                          >
                            {product.title}
                          </span>
                          <span className="text-xs text-slate-400 mt-0.5 font-mono">
                            {product.sku}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Category Capsule */}
                    <td className="py-4 px-6">
                      <span className="inline-flex px-3 py-1 rounded-full text-xs font-semibold bg-[#E0F7FA] text-[#00695C]">
                        {product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="py-4 px-6 font-bold text-slate-900 text-sm">
                      €{product.price.toFixed(2)}
                    </td>

                    {/* Stock status with indicator dot */}
                    <td className="py-4 px-6 text-xs">
                      {product.stock > 10 ? (
                        <div className="flex items-center gap-1.5 font-semibold text-slate-700">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          <span>{product.stock} units</span>
                        </div>
                      ) : product.stock > 0 ? (
                        <div className="flex items-center gap-1.5 font-semibold text-amber-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                          <span>Low ({product.stock} left)</span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 font-semibold text-rose-600">
                          <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                          <span>Out of stock</span>
                        </div>
                      )}
                    </td>

                    {/* Vendor */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium">
                        <Store className="w-3.5 h-3.5 text-slate-400" />
                        <span>{product.vendor}</span>
                      </div>
                    </td>

                    {/* Status Pill */}
                    <td className="py-4 px-6">
                      {product.status === 'Active' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#16A34A]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]" />
                          <span>Active</span>
                        </span>
                      )}
                      {product.status === 'Suspended' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#D97706]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706]" />
                          <span>Suspended</span>
                        </span>
                      )}
                      {product.status === 'Out of Stock' && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FEE4E2] text-[#D92D20]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D92D20]" />
                          <span>Out of Stock</span>
                        </span>
                      )}
                    </td>

                    {/* 4 Action Icons: View, Edit, Suspend, Delete */}
                    <td className="py-4 px-6 text-right">
                      <div className="inline-flex items-center gap-1 justify-end">
                        {/* 1. View Icon */}
                        <button
                          type="button"
                          onClick={() => setViewingProduct(product)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors cursor-pointer"
                          title="View product details"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* 2. Edit Icon */}
                        <button
                          type="button"
                          onClick={() => setEditingProduct({ ...product })}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-[#062E35] hover:bg-slate-100 transition-colors cursor-pointer"
                          title="Edit product"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>

                        {/* 3. Suspend / Activate Icon */}
                        <button
                          type="button"
                          onClick={() => setProductToSuspend(product)}
                          className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors cursor-pointer ${
                            product.status === 'Suspended'
                              ? 'text-amber-600 bg-amber-50 hover:bg-amber-100'
                              : 'text-slate-400 hover:text-amber-600 hover:bg-amber-50'
                          }`}
                          title={product.status === 'Suspended' ? 'Reactivate product' : 'Suspend product'}
                        >
                          <Ban className="w-4 h-4" />
                        </button>

                        {/* 4. Delete Icon */}
                        <button
                          type="button"
                          onClick={() => setProductToDelete(product)}
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                          title="Delete product"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* 5. Pagination Bar matching Figma style */}
        <div className="px-6 py-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            Showing <span className="font-semibold text-slate-700">{filteredProducts.length === 0 ? 0 : startIndex + 1}</span> to{' '}
            <span className="font-semibold text-slate-700">
              {Math.min(startIndex + itemsPerPage, filteredProducts.length)}
            </span>{' '}
            of <span className="font-semibold text-slate-700">{filteredProducts.length}</span> products
          </div>

          <div className="inline-flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
              <span>Previous</span>
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setCurrentPage(pageNum)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === pageNum
                    ? 'bg-[#062E35] text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                {pageNum}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage === totalPages || totalPages === 0}
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              className="px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-semibold flex items-center gap-1 disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              <span>Next</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* MODAL 1: VIEW PRODUCT DETAILS */}
      {viewingProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div 
                  className="w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-2xs text-[#062E35]"
                  style={{ backgroundColor: viewingProduct.imageColor }}
                >
                  <Package className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {viewingProduct.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                    <span className="font-mono">{viewingProduct.sku}</span>
                    <span>·</span>
                    <span className="font-semibold text-[#00695C]">{viewingProduct.category}</span>
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex flex-col gap-3 bg-slate-50 p-4 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">Description</span>
                <p className="text-slate-700 mt-1 leading-relaxed text-sm">
                  {viewingProduct.description}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200/60">
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Retail Price</span>
                  <span className="text-base font-bold text-slate-900">€{viewingProduct.price.toFixed(2)}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Stock Level</span>
                  <span className="text-sm font-semibold text-slate-800">{viewingProduct.stock} units available</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Vendor Partner</span>
                  <span className="text-slate-800 font-medium">{viewingProduct.vendor}</span>
                </div>
                <div>
                  <span className="text-[11px] font-semibold text-slate-400 block">Current Status</span>
                  <span className="font-semibold text-slate-800">{viewingProduct.status}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => {
                  const toEdit = viewingProduct;
                  setViewingProduct(null);
                  setEditingProduct({ ...toEdit });
                }}
                className="px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Edit Product
              </button>
              <button
                type="button"
                onClick={() => setViewingProduct(null)}
                className="px-5 py-2 rounded-xl bg-[#062E35] text-white text-xs font-semibold hover:bg-[#0A434D] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 2: EDIT PRODUCT */}
      {editingProduct && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E0F7FA] text-[#00695C] flex items-center justify-center">
                  <Edit3 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Edit Product</h3>
                  <p className="text-xs text-slate-400 font-mono">{editingProduct.sku}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setEditingProduct(null)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Product Title:
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.title}
                  onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] focus:ring-1 focus:ring-[#062E35]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category:
                  </label>
                  <select
                    value={editingProduct.category}
                    onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value as ProductItem['category'] })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] cursor-pointer"
                  >
                    {categoryOptions.filter(c => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Price (€):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    value={editingProduct.price}
                    onChange={(e) => setEditingProduct({ ...editingProduct, price: parseFloat(e.target.value) || 0 })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Stock Quantity:
                  </label>
                  <input
                    type="number"
                    required
                    value={editingProduct.stock}
                    onChange={(e) => setEditingProduct({ 
                      ...editingProduct, 
                      stock: parseInt(e.target.value) || 0,
                      status: parseInt(e.target.value) === 0 ? 'Out of Stock' : editingProduct.status
                    })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Status:
                  </label>
                  <select
                    value={editingProduct.status}
                    onChange={(e) => setEditingProduct({ ...editingProduct, status: e.target.value as ProductItem['status'] })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] cursor-pointer"
                  >
                    <option value="Active">Active</option>
                    <option value="Suspended">Suspended</option>
                    <option value="Out of Stock">Out of Stock</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Vendor Partner:
                </label>
                <input
                  type="text"
                  required
                  value={editingProduct.vendor}
                  onChange={(e) => setEditingProduct({ ...editingProduct, vendor: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 3: SUSPEND / REACTIVATE CONFIRMATION */}
      {productToSuspend && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
            <div className="w-14 h-14 rounded-2xl bg-[#FEF3C7] flex items-center justify-center mb-5 shrink-0">
              <Ban className="w-6 h-6 text-[#D97706]" strokeWidth={2.2} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              {productToSuspend.status === 'Suspended' ? 'Reactivate Product?' : 'Suspend Product?'}
            </h3>

            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              {productToSuspend.status === 'Suspended'
                ? `Reactivating will make "${productToSuspend.title}" visible again to customers.`
                : `Suspending will temporarily hide "${productToSuspend.title}" from store search and listings.`}
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setProductToSuspend(null)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={() => handleToggleSuspend(productToSuspend)}
                className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95"
                style={{ 
                  backgroundColor: productToSuspend.status === 'Suspended' ? '#062E35' : '#D97706',
                  borderRadius: '16px' 
                }}
              >
                {productToSuspend.status === 'Suspended' ? 'Reactivate' : 'Suspend'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 4: FIGMA DELETE CONFIRMATION MODAL (#B42318 Red Button) */}
      {productToDelete && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-7 max-w-[380px] w-full shadow-2xl flex flex-col items-center text-center animate-in zoom-in-95 duration-150">
            {/* Top Red Squircle Icon */}
            <div className="w-14 h-14 rounded-2xl bg-[#FEE4E2] flex items-center justify-center mb-5 shrink-0">
              <Trash2 className="w-6 h-6 text-[#D92D20]" strokeWidth={2.2} />
            </div>

            <h3 className="text-xl font-bold text-slate-900 tracking-tight mb-2">
              Delete Product?
            </h3>

            <p className="text-sm text-slate-500 font-normal leading-relaxed mb-6 px-2">
              Are you sure you want to delete <span className="font-semibold text-slate-700">{productToDelete.title}</span> ({productToDelete.sku})? This action cannot be undone.
            </p>

            <div className="grid grid-cols-2 gap-3 w-full">
              <button
                type="button"
                onClick={() => setProductToDelete(null)}
                className="w-full py-3 px-4 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors cursor-pointer"
                style={{ borderRadius: '16px' }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-full py-3 px-4 rounded-2xl text-sm font-semibold text-white shadow-xs transition-colors cursor-pointer hover:opacity-90 active:scale-95"
                style={{ 
                  backgroundColor: '#B42318', 
                  borderRadius: '16px' 
                }}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 5: ADD NEW PRODUCT MODAL */}
      {showAddProductModal && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl border border-slate-200 flex flex-col gap-5 animate-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#E0F7FA] text-[#00695C] flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">Add New Product</h3>
                  <p className="text-xs text-slate-400">Add product merchandise to the Alurei store</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setShowAddProductModal(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateProduct} className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Product Title:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Organic Cotton Baby Sleepsuit Set"
                  value={newProductForm.title}
                  onChange={(e) => setNewProductForm({ ...newProductForm, title: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] focus:ring-1 focus:ring-[#062E35]/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Category:
                  </label>
                  <select
                    value={newProductForm.category}
                    onChange={(e) => setNewProductForm({ ...newProductForm, category: e.target.value as ProductItem['category'] })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] cursor-pointer"
                  >
                    {categoryOptions.filter(c => c !== 'All').map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    SKU Code:
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. ALU-BC-099"
                    value={newProductForm.sku}
                    onChange={(e) => setNewProductForm({ ...newProductForm, sku: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Price (€):
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="29.99"
                    value={newProductForm.price}
                    onChange={(e) => setNewProductForm({ ...newProductForm, price: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    Initial Stock:
                  </label>
                  <input
                    type="number"
                    required
                    placeholder="25"
                    value={newProductForm.stock}
                    onChange={(e) => setNewProductForm({ ...newProductForm, stock: e.target.value })}
                    className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Vendor Partner:
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. PureBotanica Organics"
                  value={newProductForm.vendor}
                  onChange={(e) => setNewProductForm({ ...newProductForm, vendor: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
                  Description:
                </label>
                <textarea
                  rows={2}
                  placeholder="Short product overview and specifications..."
                  value={newProductForm.description}
                  onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                  className="w-full p-3 rounded-xl border border-slate-200 text-sm text-slate-800 focus:outline-none focus:border-[#062E35] resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setShowAddProductModal(false)}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-xs font-semibold transition-all cursor-pointer shadow-xs active:scale-95"
                >
                  Create Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
