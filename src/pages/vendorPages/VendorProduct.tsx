import { useState, useMemo } from 'react';
import { 
  VendorProductHeader, 
  VendorProductFilters, 
  VendorProductTable, 
  VendorProductModals 
} from '../../components/vendorComponents/product';

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
  // Realistic product items
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
      {/* 1. Header Section */}
      <VendorProductHeader
        onOpenDefaultProducts={() => setShowDefaultProductsModal(true)}
        onOpenAddProduct={handleOpenAdd}
      />

      {/* 2. Search & Category Filter Bar */}
      <VendorProductFilters
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
        isCategoryDropdownOpen={isCategoryDropdownOpen}
        setIsCategoryDropdownOpen={setIsCategoryDropdownOpen}
        categories={categories}
      />

      {/* 3. Products Table Card */}
      <VendorProductTable
        products={filteredProducts}
        onOpenEdit={handleOpenEdit}
        onOpenDelete={handleOpenDelete}
      />

      {/* Modals */}
      <VendorProductModals
        showAddModal={showAddModal}
        setShowAddModal={setShowAddModal}
        showEditModal={showEditModal}
        setShowEditModal={setShowEditModal}
        showDeleteModal={showDeleteModal}
        setShowDeleteModal={setShowDeleteModal}
        showDefaultProductsModal={showDefaultProductsModal}
        setShowDefaultProductsModal={setShowDefaultProductsModal}
        selectedProduct={selectedProduct}
        formName={formName}
        setFormName={setFormName}
        formCategory={formCategory}
        setFormCategory={setFormCategory}
        formPrice={formPrice}
        setFormPrice={setFormPrice}
        formOffer={formOffer}
        setFormOffer={setFormOffer}
        formAvailability={formAvailability}
        setFormAvailability={setFormAvailability}
        formStatus={formStatus}
        setFormStatus={setFormStatus}
        categories={categories}
        handleSaveAdd={handleSaveAdd}
        handleSaveEdit={handleSaveEdit}
        handleConfirmDelete={handleConfirmDelete}
      />
    </div>
  );
};

export default VendorProduct;
