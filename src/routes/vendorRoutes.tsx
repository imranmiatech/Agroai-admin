import { Route, Navigate, useNavigate } from 'react-router-dom';
import { VendorOverview } from '../pages/vendorPages/VendorOverview';
import { VendorProduct } from '../pages/vendorPages/VendorProduct';
import { VendorOrders } from '../pages/vendorPages/VendorOrders';
import { VendorOffers } from '../pages/vendorPages/VendorOffers';
import { VendorSupport } from '../pages/vendorPages/VendorSupport';
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
    <Route path="orders" element={<VendorOrders />} />
    <Route path="offers" element={<VendorOffers />} />
    <Route path="businessprofile" element={<Navigate to="/vendor/settings" replace />} />
    <Route path="support" element={<VendorSupport />} />
    <Route path="settings" element={<VendorSettings />} />
  </Route>
);
