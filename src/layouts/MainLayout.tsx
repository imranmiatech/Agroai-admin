import { useState, useEffect } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import type { PanelType, AdminTab, VendorTab } from '../types';
import { Sidebar } from '../Common/Sidebar';
import { Header } from '../Common/Header';
import { LogOut, X, ShieldCheck, Store, CheckCircle2 } from 'lucide-react';

export const MainLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Modals & Drawers
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  // Auto-close mobile navigation on route change
  useEffect(() => {
    setIsMobileNavOpen(false);
  }, [location.pathname]);

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
    ['overview', 'product', 'orders', 'offers', 'support', 'settings'].includes(activeTabSlug)
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
      <div className="flex flex-col items-center justify-center w-full min-h-screen bg-slate-900 text-white p-6 text-center font-['Inter']">
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
              <span>Log In to Krisikunjo Admin</span>
            </button>

            <button
              type="button"
              className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-semibold text-sm bg-teal-700 hover:bg-teal-800 text-white shadow-lg shadow-teal-700/30 transition-all cursor-pointer"
              onClick={() => handleReLogin('vendor')}
            >
              <Store className="w-5 h-5" />
              <span>Log In to Krisikunjo Vendor Hub</span>
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
    <div className="flex w-full h-screen overflow-hidden bg-slate-50 font-['Inter']">
      {/* Sidebar with exact user typography & 1-to-1 tab routing */}
      <Sidebar
        currentPanel={currentPanel}
        onPanelChange={handlePanelChange}
        activeAdminTab={activeAdminTab}
        onAdminTabChange={handleAdminTabChange}
        activeVendorTab={activeVendorTab}
        onVendorTabChange={handleVendorTabChange}
        onLogoutClick={() => setShowLogoutModal(true)}
        isMobileOpen={isMobileNavOpen}
        onCloseMobile={() => setIsMobileNavOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 h-screen overflow-hidden">
        <Header
          currentPanel={currentPanel}
          activeAdminTab={activeAdminTab}
          activeVendorTab={activeVendorTab}
          onOpenNotifications={() => setShowNotifications(true)}
          onOpenMobileMenu={() => setIsMobileNavOpen(true)}
        />

        {/* Dynamic Route View */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6">
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
                Are you sure you want to log out from <strong>{currentPanel === 'admin' ? 'Krisikunjo Admin Suite' : 'Krisikunjo Vendor Hub'}</strong>?
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
};

export default MainLayout;
