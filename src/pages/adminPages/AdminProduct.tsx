import { useState } from 'react';
import { Plus } from 'lucide-react';
import { 
  ProductMetricsGrid, 
  ProductFilters, 
  ProductTable, 
  ProductModals 
} from '../../components/adminComponents/product';

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
      title: 'Natural Baby Multivitamin Liquid Drops 50ml',
      category: 'Nutrition',
      price: 18.75,
      stock: 3,
      vendor: 'PureBotanica Organics',
      status: 'Active',
      description: 'Pediatrician-formulated vitamin D3, zinc, and botanical extracts for daily immunity.',
      imageColor: '#FEE2E2',
      rating: 4.6
    },
    {
      id: 'PRD-07',
      sku: 'ALU-BC-007',
      title: 'Calming Chamomile & Oat Baby Wash & Shampoo',
      category: 'Baby Care',
      price: 16.50,
      stock: 35,
      vendor: 'Dunnes Family Lifestyle',
      status: 'Active',
      description: 'Tear-free hypoallergenic wash formulated with colloidal oatmeal and natural chamomile.',
      imageColor: '#E0F7FA',
      rating: 4.9
    },
    {
      id: 'PRD-08',
      sku: 'ALU-SF-008',
      title: 'No-Contact Infrared Forehead Thermometer',
      category: 'Safety',
      price: 42.00,
      stock: 19,
      vendor: 'OmniGadget World',
      status: 'Active',
      description: 'Instant 1-second accurate fever reading with color-coded fever guidance screen.',
      imageColor: '#E0E7FF',
      rating: 4.8
    },
    {
      id: 'PRD-09',
      sku: 'ALU-TY-009',
      title: 'Organic Cotton Soft Activity Crinkle Book',
      category: 'Toys',
      price: 15.99,
      stock: 40,
      vendor: 'The Wooden Toy Box',
      status: 'Active',
      description: 'High-contrast visual stimulation crinkle cloth book for sensory infant discovery.',
      imageColor: '#F3E8FF',
      rating: 4.7
    },
    {
      id: 'PRD-10',
      sku: 'ALU-FD-010',
      title: 'Anti-Colic Glass Baby Bottles Duo (240ml)',
      category: 'Feeding',
      price: 32.50,
      stock: 0,
      vendor: 'Little Sprout Essentials',
      status: 'Out of Stock',
      description: 'Thermal-shock resistant borosilicate glass with slow-flow peristaltic silicone nipples.',
      imageColor: '#FEF3C7',
      rating: 4.9
    },
    {
      id: 'PRD-11',
      sku: 'ALU-NR-011',
      title: 'Breathable Dual-Sided Crib Mattress (Eco-Tex)',
      category: 'Nursery',
      price: 189.00,
      stock: 6,
      vendor: 'Dunnes Family Lifestyle',
      status: 'Active',
      description: '100% washable core with firm infant side and plush toddler comfort side.',
      imageColor: '#DCFCE7',
      rating: 5.0
    },
    {
      id: 'PRD-12',
      sku: 'ALU-BC-012',
      title: 'Electric Gentle Baby Nail Trimmer with LED Light',
      category: 'Baby Care',
      price: 22.00,
      stock: 28,
      vendor: 'OmniGadget World',
      status: 'Active',
      description: 'Whisper-quiet rotary filer with 6 cushioning grinding heads for tiny delicate nails.',
      imageColor: '#E0F7FA',
      rating: 4.6
    },
    {
      id: 'PRD-13',
      sku: 'ALU-NT-013',
      title: 'Organic Prune & Apple Gentle Digest Puree Pouch',
      category: 'Nutrition',
      price: 3.20,
      stock: 120,
      vendor: 'PureBotanica Organics',
      status: 'Active',
      description: 'Stage 1 non-GMO USDA certified pureed organic fruit with no added sugars.',
      imageColor: '#FEE2E2',
      rating: 4.8
    },
    {
      id: 'PRD-14',
      sku: 'ALU-SF-014',
      title: 'Corner & Edge Proofing Foam Guards (Pack of 16)',
      category: 'Safety',
      price: 14.50,
      stock: 55,
      vendor: 'OmniGadget World',
      status: 'Active',
      description: 'High-density impact absorbing rubber foam corners with pre-applied 3M adhesive.',
      imageColor: '#E0E7FF',
      rating: 4.5
    },
    {
      id: 'PRD-15',
      sku: 'ALU-TY-015',
      title: 'Natural Rubber Teething Giraffe with Squeaker',
      category: 'Toys',
      price: 21.00,
      stock: 18,
      vendor: 'The Wooden Toy Box',
      status: 'Active',
      description: '100% natural hevea tree sap rubber teething toy painted with food-grade plant pigments.',
      imageColor: '#F3E8FF',
      rating: 4.9
    },
    {
      id: 'PRD-16',
      sku: 'ALU-FD-016',
      title: 'Portable Baby Food Warm & Cool Insulated Flask',
      category: 'Feeding',
      price: 27.99,
      stock: 11,
      vendor: 'Little Sprout Essentials',
      status: 'Active',
      description: 'Vacuum insulated double-wall stainless steel container that keeps meals warm for 8 hours.',
      imageColor: '#FEF3C7',
      rating: 4.7
    },
    {
      id: 'PRD-17',
      sku: 'ALU-NR-017',
      title: 'Adjustable Beechwood High Chair with Cushion',
      category: 'Nursery',
      price: 210.00,
      stock: 5,
      vendor: 'Dunnes Family Lifestyle',
      status: 'Suspended',
      description: 'Ergonomic highchair adjustable seat depth and footrest, suitable from 6 months to teens.',
      imageColor: '#DCFCE7',
      rating: 4.4
    },
    {
      id: 'PRD-18',
      sku: 'ALU-BC-018',
      title: 'Zinc Oxide Diaper Rash Barrier Cream 100g',
      category: 'Baby Care',
      price: 11.50,
      stock: 65,
      vendor: 'PureBotanica Organics',
      status: 'Active',
      description: 'Rich healing ointment with 25% non-nano zinc oxide and shea butter for instant comfort.',
      imageColor: '#E0F7FA',
      rating: 4.9
    },
    {
      id: 'PRD-19',
      sku: 'ALU-SF-019',
      title: 'Auto-Close Extra Wide Baby Safety Gate',
      category: 'Safety',
      price: 79.99,
      stock: 9,
      vendor: 'OmniGadget World',
      status: 'Active',
      description: 'Pressure-mounted steel security gate with dual-locking handle mechanism for stairs and hallways.',
      imageColor: '#E0E7FF',
      rating: 4.8
    },
    {
      id: 'PRD-20',
      sku: 'ALU-NT-020',
      title: 'Plant-Based DHA & Omega-3 Gummies for Kids',
      category: 'Nutrition',
      price: 24.00,
      stock: 0,
      vendor: 'PureBotanica Organics',
      status: 'Out of Stock',
      description: 'Marine algae derived brain development omega-3 gummies with natural orange flavor.',
      imageColor: '#FEE2E2',
      rating: 4.7
    },
    {
      id: 'PRD-21',
      sku: 'ALU-TY-021',
      title: 'Silicone Stacking Rainbow & Nesting Arcs',
      category: 'Toys',
      price: 26.50,
      stock: 31,
      vendor: 'The Wooden Toy Box',
      status: 'Active',
      description: 'Flexible chewable silicone rainbow arches designed for creative open-ended stem play.',
      imageColor: '#F3E8FF',
      rating: 4.9
    },
    {
      id: 'PRD-22',
      sku: 'ALU-NR-022',
      title: 'Smart Sound Machine & Programmable Night Light',
      category: 'Nursery',
      price: 68.00,
      stock: 12,
      vendor: 'OmniGadget World',
      status: 'Active',
      description: 'White noise, soothing lullabies, and wake-up light controlled via Bluetooth companion app.',
      imageColor: '#DCFCE7',
      rating: 4.9
    },
    {
      id: 'PRD-23',
      sku: 'ALU-FD-023',
      title: 'Compact Foldable Travel Booster Seat with Tray',
      category: 'Feeding',
      price: 49.00,
      stock: 17,
      vendor: 'Dunnes Family Lifestyle',
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

      {/* 2. Top Metric Summary Cards */}
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
      />

      {/* 4. Products Table Container & Pagination */}
      <ProductTable
        products={currentProducts}
        startIndex={startIndex}
        itemsPerPage={itemsPerPage}
        totalFiltered={filteredProducts.length}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        onView={(p) => setViewingProduct(p)}
        onEdit={(p) => setEditingProduct(p)}
        onSuspend={(p) => setProductToSuspend(p)}
        onDelete={(p) => setProductToDelete(p)}
      />

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
      />
    </div>
  );
};
