import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  VendorWelcomeBanner, 
  VendorMetricCards, 
  OfferPerformanceChart, 
  VendorRecentActivity, 
  VendorOverviewModals 
} from '../../components/vendorComponents/overview';

interface VendorOverviewProps {
  onNavigateToProduct?: () => void;
  onNavigateToOrders?: () => void;
}

export const VendorOverview: React.FC<VendorOverviewProps> = ({
  onNavigateToProduct,
  onNavigateToOrders: _onNavigateToOrders
}) => {
  const navigate = useNavigate();

  // Modals
  const [showCreateOfferModal, setShowCreateOfferModal] = useState(false);
  const [showAddProductModal, setShowAddProductModal] = useState(false);

  // Form states
  const [newOfferTitle, setNewOfferTitle] = useState('');
  const [newOfferDiscount, setNewOfferDiscount] = useState('20%');
  const [newOfferCategory, setNewOfferCategory] = useState("Selected Kids' Products");
  const [newOfferDate, setNewOfferDate] = useState('2026-09-30');

  const [newProductName, setNewProductName] = useState('');
  const [newProductCategory, setNewProductCategory] = useState('Nutrition');
  const [newProductPrice, setNewProductPrice] = useState('14.50');

  const handleCreateOfferSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowCreateOfferModal(false);
  };

  const handleAddProductSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowAddProductModal(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full font-['Inter']">
      {/* 1. Welcome Header Banner */}
      <VendorWelcomeBanner
        onOpenCreateOffer={() => setShowCreateOfferModal(true)}
        onOpenAddProduct={() => {
          if (onNavigateToProduct) {
            onNavigateToProduct();
          } else {
            navigate('/vendor/product');
          }
        }}
      />

      {/* 2. Top 3 Metric KPI Cards */}
      <VendorMetricCards />

      {/* 3. Offer Performance Line Chart */}
      <OfferPerformanceChart />

      {/* 4. Bottom Grid: Recent Activity & Top Performing Offer */}
      <VendorRecentActivity />

      {/* Modals */}
      <VendorOverviewModals
        showCreateOfferModal={showCreateOfferModal}
        setShowCreateOfferModal={setShowCreateOfferModal}
        newOfferTitle={newOfferTitle}
        setNewOfferTitle={setNewOfferTitle}
        newOfferDiscount={newOfferDiscount}
        setNewOfferDiscount={setNewOfferDiscount}
        newOfferCategory={newOfferCategory}
        setNewOfferCategory={setNewOfferCategory}
        newOfferDate={newOfferDate}
        setNewOfferDate={setNewOfferDate}
        handleCreateOfferSubmit={handleCreateOfferSubmit}
        showAddProductModal={showAddProductModal}
        setShowAddProductModal={setShowAddProductModal}
        newProductName={newProductName}
        setNewProductName={setNewProductName}
        newProductCategory={newProductCategory}
        setNewProductCategory={setNewProductCategory}
        newProductPrice={newProductPrice}
        setNewProductPrice={setNewProductPrice}
        handleAddProductSubmit={handleAddProductSubmit}
      />
    </div>
  );
};

export default VendorOverview;
