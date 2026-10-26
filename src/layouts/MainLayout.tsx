import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import type { PanelType, AdminTab, VendorTab, ExpertTab } from '../types';
import { Sidebar } from '../Common/Sidebar';
import { Header } from '../Common/Header';
import { LogOut, X, CheckCircle2 } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { logout } from '../redux/feature/auth/authSlice';
import { useLogoutUserMutation } from '../redux/feature/auth/authApi';

export const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const [logoutUser, { isLoading: isLogoutApiLoading }] = useLogoutUserMutation();

  // Modals & Drawers
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [, setShowNotifications] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Auto-close mobile navigation on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

  // Auth guard: redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Guard role routing
  useEffect(() => {
    if (user?.role === 'EXPERT' && (location.pathname.startsWith('/admin') || location.pathname.startsWith('/vendor'))) {
      navigate('/expert/overview', { replace: true });
    } else if (user?.role === 'VENDOR' && (location.pathname.startsWith('/admin') || location.pathname.startsWith('/expert'))) {
      navigate('/vendor/overview', { replace: true });
    }
  }, [user, location.pathname, navigate]);

  // Derive panel and active tab directly from URL route
  const isVendor = location.pathname.startsWith('/vendor');
  const isExpert = location.pathname.startsWith('/expert');
  const currentPanel: PanelType = isExpert ? 'expert' : isVendor ? 'vendor' : 'admin';

  // Extract tab slug from pathname, e.g. /admin/product -> "product"
  const pathSegments = location.pathname.split('/').filter(Boolean);
  const activeTabSlug = pathSegments[1] || 'overview';

  const activeAdminTab: AdminTab = (
    ['overview', 'usermanagement', 'experts', 'product', 'orders', 'partners', 'content', 'contact', 'support', 'settings', 'categories'].includes(activeTabSlug)
      ? activeTabSlug
      : 'overview'
  ) as AdminTab;

  const activeVendorTab: VendorTab = (
    ['overview', 'product', 'orders', 'support', 'admin-support', 'settings'].includes(activeTabSlug)
      ? activeTabSlug
      : 'overview'
  ) as VendorTab;

  const activeExpertTab: ExpertTab = (
    ['overview', 'consultations', 'soil-tests', 'settings'].includes(activeTabSlug)
      ? activeTabSlug
      : 'overview'
  ) as ExpertTab;

  const handlePanelChange = (panel: PanelType) => {
    if (panel === 'admin') {
      navigate('/admin/overview');
    } else if (panel === 'vendor') {
      navigate('/vendor/overview');
    } else {
      navigate('/expert/overview');
    }
  };

  const handleConfirmLogout = async () => {
    setIsLoggedOut(true);
    try {
      await logoutUser().unwrap();
    } catch (err) {
      console.warn('Admin logout notification:', err);
    } finally {
      setTimeout(() => {
        dispatch(logout());
        setShowLogoutModal(false);
        setIsLoggedOut(false);
        navigate('/login');
      }, 1000);
    }
  };

  return (
    <div className="flex h-screen w-full bg-[#F4F4F4] text-[#0F172A] font-['Inter',sans-serif] overflow-hidden">
      {/* Sidebar for Desktop */}
      <div className="hidden lg:flex shrink-0">
        <Sidebar
          currentPanel={currentPanel}
          onPanelChange={handlePanelChange}
          activeAdminTab={activeAdminTab}
          onAdminTabChange={(tab: AdminTab) => navigate(`/admin/${tab}`)}
          activeVendorTab={activeVendorTab}
          onVendorTabChange={(tab: VendorTab) => navigate(`/vendor/${tab}`)}
          activeExpertTab={activeExpertTab}
          onExpertTabChange={(tab: ExpertTab) => navigate(`/expert/${tab}`)}
          onLogoutClick={() => setShowLogoutModal(true)}
        />
      </div>

      {/* Mobile Drawer Backdrop */}
      {isMobileNavOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/40 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={() => setIsMobileNavOpen(false)}
        />
      )}

      {/* Mobile Sidebar Drawer */}
      <div
        className={`fixed inset-y-0 left-0 z-50 w-72 bg-white shadow-2xl transform transition-transform duration-300 ease-in-out lg:hidden flex flex-col ${
          isMobileNavOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#0B5460] flex items-center justify-center text-white font-bold text-sm">
              KK
            </div>
            <span className="font-bold text-[#0B5460] text-lg">Krisikunjo</span>
          </div>
          <button
            onClick={() => setIsMobileNavOpen(false)}
            className="p-1.5 rounded-lg text-gray-500 hover:bg-gray-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar
            currentPanel={currentPanel}
            onPanelChange={handlePanelChange}
            activeAdminTab={activeAdminTab}
            onAdminTabChange={(tab: AdminTab) => {
              navigate(`/admin/${tab}`);
              setIsMobileNavOpen(false);
            }}
            activeVendorTab={activeVendorTab}
            onVendorTabChange={(tab: VendorTab) => {
              navigate(`/vendor/${tab}`);
              setIsMobileNavOpen(false);
            }}
            activeExpertTab={activeExpertTab}
            onExpertTabChange={(tab: ExpertTab) => {
              navigate(`/expert/${tab}`);
              setIsMobileNavOpen(false);
            }}
            onLogoutClick={() => {
              setIsMobileNavOpen(false);
              setShowLogoutModal(true);
            }}
            isMobileOpen={isMobileNavOpen}
            onCloseMobile={() => setIsMobileNavOpen(false)}
          />
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Global Header */}
        <Header
          currentPanel={currentPanel}
          activeAdminTab={activeAdminTab}
          activeVendorTab={activeVendorTab}
          activeExpertTab={activeExpertTab}
          onOpenNotifications={() => setShowNotifications((prev) => !prev)}
          onOpenMobileMenu={() => setIsMobileNavOpen(!isMobileNavOpen)}
        />

        {/* Scrollable Viewport */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-full">
            <Outlet />
          </div>
        </main>
      </div>

      {/* Logout Confirmation Modal */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-gray-100 relative">
            {!isLoggedOut ? (
              <>
                <div className="w-12 h-12 rounded-full bg-red-50 text-red-600 flex items-center justify-center mb-4">
                  <LogOut className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-1">
                  Sign Out
                </h3>
                <p className="text-sm text-gray-600 mb-6">
                  Are you sure you want to sign out of your account? You will need to login again to access your dashboard.
                </p>
                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => setShowLogoutModal(false)}
                    className="px-4 py-2.5 rounded-xl border border-gray-200 text-gray-700 font-medium hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleConfirmLogout}
                    disabled={isLogoutApiLoading}
                    className="px-4 py-2.5 rounded-xl bg-red-600 text-white font-medium hover:bg-red-700 transition-colors shadow-sm cursor-pointer disabled:opacity-50 flex items-center gap-2"
                  >
                    {isLogoutApiLoading && (
                      <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    )}
                    <span>{isLogoutApiLoading ? 'Signing Out...' : 'Yes, Sign Out'}</span>
                  </button>
                </div>
              </>
            ) : (
              <div className="py-6 flex flex-col items-center text-center">
                <CheckCircle2 className="w-12 h-12 text-emerald-500 mb-3 animate-bounce" />
                <h3 className="text-lg font-bold text-gray-900">
                  Signed Out Successfully
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Redirecting to login page...
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default MainLayout;
