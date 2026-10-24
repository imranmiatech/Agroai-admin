import { Route, Navigate, useNavigate } from 'react-router-dom';
import { VendorOverview } from '../pages/vendorPages/VendorOverview';
import { VendorProduct } from '../pages/vendorPages/VendorProduct';
import { AddProductPage } from '../pages/adminPages/AddProductPage';
import { VendorOrders } from '../pages/vendorPages/VendorOrders';
import { VendorSupport } from '../pages/vendorPages/VendorSupport';
import { VendorAdminSupport } from '../pages/vendorPages/VendorAdminSupport';
import { VendorSettings } from '../pages/vendorPages/VendorSettings';

function VendorOverviewWrapper() {
  const navigate = useNavigate();
  return (
    <VendorOverview
      onNavigateToProduct={() => navigate('/vendor/product')}
      onNavigateToOrders={() => navigate('/vendor/orders')}
    />
  );
}

export const vendorRoutes = (
  <Route path="/vendor">
    <Route index element={<Navigate to="/vendor/overview" replace />} />
    <Route path="overview" element={<VendorOverviewWrapper />} />
    <Route path="product" element={<VendorProduct />} />
    <Route path="product/add" element={<AddProductPage isVendor />} />
    <Route path="product/edit/:id" element={<AddProductPage isVendor />} />
    <Route path="product/create" element={<Navigate to="/vendor/product/add" replace />} />
    <Route path="orders" element={<VendorOrders />} />
    <Route path="offers" element={<Navigate to="/vendor/overview" replace />} />
    <Route path="businessprofile" element={<Navigate to="/vendor/settings" replace />} />
    <Route path="support" element={<VendorSupport />} />
    <Route path="admin-support" element={<VendorAdminSupport />} />
    <Route path="settings" element={<VendorSettings />} />
  </Route>
);
