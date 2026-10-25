import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  VendorWelcomeBanner,
  VendorMetricCards,
  VendorRevenueChart,
  VendorRecentActivity,
  VendorOverviewModals
} from '../../components/vendorComponents/overview';
import { useGetVendorOverviewQuery } from '../../redux/feature/overview/overviewApi';

interface VendorOverviewProps {
  onNavigateToProduct?: () => void;
  onNavigateToOrders?: () => void;
}

export const VendorOverview: React.FC<VendorOverviewProps> = ({
  onNavigateToProduct,
  onNavigateToOrders: _onNavigateToOrders
}) => {
  const navigate = useNavigate();

  // 100% Dynamic Vendor Overview Data Hook
  const { data: overviewData, isLoading } = useGetVendorOverviewQuery(undefined, {
    pollingInterval: 60000,
  });

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
        onOpenAddProduct={() => {
          if (onNavigateToProduct) {
            onNavigateToProduct();
          } else {
            navigate('/vendor/product');
          }
        }}
      />

      {/* 2. Top 3 Metric KPI Cards (100% Dynamic) */}
      <VendorMetricCards
        metrics={overviewData?.metrics}
        isLoading={isLoading}
      />

      {/* 3. Revenue Area Chart (100% Dynamic) */}
      <VendorRevenueChart
        data={overviewData?.revenueChart?.trend}
        currencySymbol={overviewData?.revenueChart?.currencySymbol || 'BDT'}
        isLoading={isLoading}
      />

      {/* 4. Recent Activity (100% Dynamic) */}
      <VendorRecentActivity
        activities={overviewData?.recentActivity}
        isLoading={isLoading}
      />

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
