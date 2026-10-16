import { Routes, Route, Navigate } from 'react-router-dom';
import { MainLayout } from '../layouts/MainLayout';
import { authRoutes } from './authRoutes';
import { adminRoutes } from './adminRoutes';
import { vendorRoutes } from './vendorRoutes';

export const AppRoutes = () => {
  return (
    <Routes>
      {/* 1. Authentication Routes (Full-screen minimal layout without Sidebar) */}
      {authRoutes}

      {/* 2. Main Application App Layout (Admin & Vendor Panels) */}
      <Route element={<MainLayout />}>
        {/* Admin Section */}
        {adminRoutes}

        {/* Vendor Section */}
        {vendorRoutes}

        {/* Global / Friendly Navigation Shortcuts */}
        <Route path="/overview" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/dashboard" element={<Navigate to="/admin/overview" replace />} />
        <Route path="/users" element={<Navigate to="/admin/usermanagement" replace />} />
        <Route path="/usermanagement" element={<Navigate to="/admin/usermanagement" replace />} />
        <Route path="/product" element={<Navigate to="/admin/product" replace />} />
        <Route path="/orders" element={<Navigate to="/admin/orders" replace />} />
        <Route path="/partners" element={<Navigate to="/admin/partners" replace />} />
        <Route path="/content" element={<Navigate to="/admin/content" replace />} />
        <Route path="/support" element={<Navigate to="/admin/support" replace />} />
        <Route path="/settings" element={<Navigate to="/admin/settings" replace />} />

        {/* Root and Fallback Catch-all Redirects */}
        <Route path="/" element={<Navigate to="/admin/overview" replace />} />
        <Route path="*" element={<Navigate to="/admin/overview" replace />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
