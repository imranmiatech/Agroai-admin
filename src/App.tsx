import { useState } from 'react';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  Navigate, 
  useLocation, 
  useNavigate, 
  Outlet 
} from 'react-router-dom';
import type { PanelType, AdminTab, VendorTab } from './types';
import { Sidebar } from './Common/Sidebar';
import { Header } from './Common/Header';

// Admin Pages
import { AdminOverview } from './pages/adminPages/AdminOverview';
import { UserManagement } from './pages/adminPages/UserManagement';
import { AdminProduct } from './pages/adminPages/AdminProduct';
import { AdminOrders } from './pages/adminPages/AdminOrders';
import { VendorsPage } from './pages/adminPages/VendorsPage';
import { ContentManagement } from './pages/adminPages/ContentManagement';
import { AdminSupport } from './pages/adminPages/AdminSupport';
import { AdminSettings } from './pages/adminPages/AdminSettings';

// Vendor Pages
import { VendorOverview } from './pages/vendorPages/VendorOverview';
import { VendorProduct } from './pages/vendorPages/VendorProduct';
import { VendorOrders } from './pages/vendorPages/VendorOrders';
import { VendorOffers } from './pages/vendorPages/VendorOffers';
import { BusinessProfile } from './pages/vendorPages/BusinessProfile';
import { VendorSupport } from './pages/vendorPages/VendorSupport';
import { VendorSettings } from './pages/vendorPages/VendorSettings';

// Auth Pages
import { AuthPage } from './pages/authPages/AuthPage';
import { SignUp } from './pages/authPages/SignUp';
import { ForgetPassword } from './pages/authPages/ForgetPassword';
import { ResetPassword } from './pages/authPages/ResetPassword';
import { ResetSuccesfull } from './pages/authPages/ResetSuccesfull';

import { LogOut, X, ShieldCheck, Store, CheckCircle2 } from 'lucide-react';

function VendorOverviewWrapper() {
  const navigate = useNavigate();
  return (
    <VendorOverview
      onNavigateToProduct={() => navigate('/vendor/product')}
      onNavigateToOrders={() => navigate('/vendor/orders')}
    />
  );
}

function MainLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  // Modals & Drawers
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  // Derive panel and active tab directly from URL route
  const isVendor = location.pathname.startsWith('/vendor');
  const currentPanel: PanelType = isVendor ? 'vendor' : 'admin';

  // Extract tab slug from pathname, e.g. /admin/product -> "product"
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const activeTabSlug = pathSegments[1] || 'overview';

  const activeAdminTab: AdminTab = (
    ['overview', 'usermanagement', 'product', 'orders', 'partners', 'content', 'support', 'settings'].includes(activeTabSlug)
      ? activeTabSlug
      : 'overview'
  ) as AdminTab;

  const activeVendorTab: VendorTab = (
    ['overview', 'product', 'orders', 'offers', 'businessprofile', 'support', 'settings'].includes(activeTabSlug)
      ? activeTabSlug
      : 'overview'
  ) as VendorTab;

  const handlePanelChange = (panel: PanelType) => {
    if (panel === 'admin') {
      navigate('/admin/overview');
    } else {
      navigate('/vendor/overview');
    }
  };

  const handleAdminTabChange = (tab: AdminTab) => {
    if (tab === 'logout') {
      setShowLogoutModal(true);
    } else {
      navigate(`/admin/${tab}`);
    }
  };

  const handleVendorTabChange = (tab: VendorTab) => {
    if (tab === 'logout') {
      setShowLogoutModal(true);
    } else {
      navigate(`/vendor/${tab}`);
    }
  };

  const handleLogoutConfirm = () => {
    setShowLogoutModal(false);
    setIsLoggedOut(true);
  };

  const handleReLogin = (panel: PanelType) => {
    setIsLoggedOut(false);
    if (panel === 'admin') {
      navigate('/admin/overview');
    } else {
      navigate('/vendor/overview');
    }
  };

  if (isLoggedOut) {
    return (
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-slate-900 text-white p-6 text-center">
        <div className="bg-slate-800 border border-slate-700 rounded-3xl p-10 max-w-md w-full flex flex-col items-center gap-5 shadow-2xl">
          <div className="w-16 h-16 rounded-2xl bg-red-500/15 text-red-500 flex items-center justify-center">
            <LogOut className="w-8 h-8" />
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-2 text-white">
              Successfully Logged Out
            </h2>
            <p className="text-sm text-slate-400">
              Your session has ended securely. Select a panel below to sign back in.
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full mt-2">
            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-indigo-600 hover:bg-indigo-700 text-white shadow-lg shadow-indigo-600/30 transition-all cursor-pointer"
              onClick={() => handleReLogin('admin')}
            >
              <ShieldCheck className="w-5 h-5" />
              <span>Log In to Admin Suite</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-sky-600 hover:bg-sky-700 text-white shadow-lg shadow-sky-600/30 transition-all cursor-pointer"
              onClick={() => handleReLogin('vendor')}
            >
              <Store className="w-5 h-5" />
              <span>Log In to Vendor Hub</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-slate-700/80 hover:bg-slate-700 text-slate-200 transition-all cursor-pointer"
              onClick={() => {
                setIsLoggedOut(false);
                navigate('/login');
              }}
            >
              <span>Go to Sign In / Sign Up Page</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full min-h-screen bg-slate-50 font-['Inter']">
      {/* Sidebar with exact user typography & 1-to-1 tab routing */}
      <Sidebar
        currentPanel={currentPanel}
        onPanelChange={handlePanelChange}
        activeAdminTab={activeAdminTab}
        onAdminTabChange={handleAdminTabChange}
        activeVendorTab={activeVendorTab}
        onVendorTabChange={handleVendorTabChange}
        onLogoutClick={() => setShowLogoutModal(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <Header
          currentPanel={currentPanel}
          activeAdminTab={activeAdminTab}
          activeVendorTab={activeVendorTab}
          onOpenNotifications={() => setShowNotifications(true)}
        />

        {/* Dynamic Route View */}
        <main className="p-8 flex flex-col gap-6">
          <Outlet />
        </main>
      </div>

      {/* Notifications Slideout Drawer */}
      {showNotifications && (
        <>
          <div 
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-xs z-50 transition-opacity" 
            onClick={() => setShowNotifications(false)} 
          />
          <div className="fixed top-0 right-0 w-96 max-w-[90vw] h-screen bg-white shadow-2xl z-50 flex flex-col border-l border-slate-200 animate-in slide-in-from-right duration-200">
            <div className="p-5 border-b border-slate-200 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Notifications</h3>
              <button 
                type="button" 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                onClick={() => setShowNotifications(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 p-5 overflow-y-auto flex flex-col gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1 hover:bg-slate-100 transition-all">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  <span>New Store Registered</span>
                </div>
                <div className="text-xs text-slate-500">
                  'PureBotanica Organics' submitted business verification documents.
                </div>
                <div className="text-[11px] text-slate-400 mt-1">10 minutes ago</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1 hover:bg-slate-100 transition-all">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-sky-500" />
                  <span>Order #ORD-99824 Dispatched</span>
                </div>
                <div className="text-xs text-slate-500">
                  Customer tracking uploaded by OmniGadget World.
                </div>
                <div className="text-[11px] text-slate-400 mt-1">1 hour ago</div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex flex-col gap-1 hover:bg-slate-100 transition-all">
                <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm">
                  <CheckCircle2 className="w-4 h-4 text-amber-500" />
                  <span>Support Ticket #TKT-1042</span>
                </div>
                <div className="text-xs text-slate-500">
                  High priority ticket waiting for admin response.
                </div>
                <div className="text-[11px] text-slate-400 mt-1">3 hours ago</div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden animate-in zoom-in-95 duration-150">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-bold text-slate-900">Confirm Sign Out</h3>
              <button 
                type="button" 
                className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all cursor-pointer"
                onClick={() => setShowLogoutModal(false)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-6">
              <p className="text-sm text-slate-600 leading-relaxed">
                Are you sure you want to log out from <strong>{currentPanel === 'admin' ? 'Admin Suite' : 'Vendor Hub'}</strong>?
              </p>
            </div>
            <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
              <button 
                type="button" 
                className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-200 transition-all cursor-pointer"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </button>
              <button 
                type="button" 
                className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-red-600 hover:bg-red-700 text-white shadow-sm shadow-red-600/30 transition-all cursor-pointer"
                onClick={handleLogoutConfirm}
              >
                <LogOut className="w-4 h-4" />
                <span>Yes, Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth Pages (Clean full page layout without Sidebar/Header) */}
        <Route path="/auth" element={<AuthPage />} />
        <Route path="/login" element={<AuthPage />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/auth/login" element={<AuthPage />} />
        <Route path="/auth/signup" element={<SignUp />} />
        <Route path="/auth/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgetPassword />} />
        <Route path="/forget-password" element={<ForgetPassword />} />
        <Route path="/auth/forgot-password" element={<ForgetPassword />} />
        <Route path="/auth/forget-password" element={<ForgetPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/reset-success" element={<ResetSuccesfull />} />
        <Route path="/reset-successful" element={<ResetSuccesfull />} />
        <Route path="/auth/reset-success" element={<ResetSuccesfull />} />

        {/* Main Application Layout for Admin and Vendor */}
        <Route element={<MainLayout />}>
          {/* Admin Routes */}
          <Route path="/admin">
            <Route index element={<Navigate to="/admin/overview" replace />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="usermanagement" element={<UserManagement />} />
            <Route path="product" element={<AdminProduct />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="partners" element={<VendorsPage />} />
            <Route path="content" element={<ContentManagement />} />
            <Route path="support" element={<AdminSupport />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          {/* Vendor Routes */}
          <Route path="/vendor">
            <Route index element={<Navigate to="/vendor/overview" replace />} />
            <Route path="overview" element={<VendorOverviewWrapper />} />
            <Route path="product" element={<VendorProduct />} />
            <Route path="orders" element={<VendorOrders />} />
            <Route path="offers" element={<VendorOffers />} />
            <Route path="businessprofile" element={<BusinessProfile />} />
            <Route path="support" element={<VendorSupport />} />
            <Route path="settings" element={<VendorSettings />} />
          </Route>

          {/* Friendly Shortcuts */}
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

          {/* Root and Fallback redirects */}
          <Route path="/" element={<Navigate to="/admin/overview" replace />} />
          <Route path="*" element={<Navigate to="/admin/overview" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
