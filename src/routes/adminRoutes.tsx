import { Route, Navigate } from 'react-router-dom';
import { AdminOverview } from '../pages/adminPages/AdminOverview';
import { UserManagement } from '../pages/adminPages/UserManagement';
import { ExpertsManagement } from '../pages/adminPages/ExpertsManagement';
import { AdminProduct } from '../pages/adminPages/AdminProduct';
import { AddProductPage } from '../pages/adminPages/AddProductPage';
import { AdminOrders } from '../pages/adminPages/AdminOrders';
import { VendorsPage } from '../pages/adminPages/VendorsPage';
import { ContentManagement } from '../pages/adminPages/ContentManagement';
import { ArticleEditorPage } from '../pages/adminPages/ArticleEditorPage';
import { AdminSupport } from '../pages/adminPages/AdminSupport';
import { AdminSettings } from '../pages/adminPages/AdminSettings';
import { ContactInquiriesPage } from '../pages/adminPages/ContactInquiriesPage';
import { CategoryManagementPage } from '../pages/adminPages/CategoryManagementPage';

export const adminRoutes = (
  <Route path="/admin">
    <Route index element={<Navigate to="/admin/overview" replace />} />
    <Route path="overview" element={<AdminOverview />} />
    <Route path="usermanagement" element={<UserManagement />} />
    <Route path="experts" element={<ExpertsManagement />} />
    <Route path="product" element={<AdminProduct />} />
    <Route path="product/add" element={<AddProductPage />} />
    <Route path="product/edit/:id" element={<AddProductPage />} />
    <Route path="product/create" element={<Navigate to="/admin/product/add" replace />} />
    <Route path="orders" element={<AdminOrders />} />
    <Route path="partners" element={<VendorsPage />} />
    <Route path="content" element={<ContentManagement />} />
    <Route path="content/create" element={<ArticleEditorPage />} />
    <Route path="content/add" element={<Navigate to="/admin/content/create" replace />} />
    <Route path="content/edit/:id" element={<ArticleEditorPage />} />
    <Route path="contact" element={<ContactInquiriesPage />} />
    <Route path="support" element={<AdminSupport />} />
    <Route path="settings" element={<AdminSettings />} />
    <Route path="categories" element={<CategoryManagementPage />} />
    <Route path="category" element={<CategoryManagementPage />} />
    <Route path="categories/add" element={<CategoryManagementPage />} />
    <Route path="category/add" element={<CategoryManagementPage />} />
  </Route>
);
