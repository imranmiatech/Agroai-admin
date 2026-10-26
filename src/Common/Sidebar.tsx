import React from 'react';
import { 
  LayoutGrid, 
  Mail,
  Users, 
  Store, 
  ShoppingCart, 
  FileText, 
  Headphones, 
  Settings, 
  LogOut, 
  ChevronLeft, 
  ChevronRight, 
  ShieldCheck, 
  ShoppingBag, 
  Package, 
  X,
  GraduationCap,
  MessageSquarePlus,
  FlaskConical,
  Layers
} from 'lucide-react';
import type { PanelType, AdminTab, VendorTab, ExpertTab } from '../types';
import { useGetProfileQuery } from '../redux/feature/profile/profileApi';
import { useAppDispatch, useAppSelector } from '../redux/store/hooks';
import { setUser } from '../redux/feature/auth/authSlice';

interface SidebarProps {
  currentPanel: PanelType;
  onPanelChange: (panel: PanelType) => void;
  activeAdminTab: AdminTab;
  onAdminTabChange: (tab: AdminTab) => void;
  activeVendorTab: VendorTab;
  onVendorTabChange: (tab: VendorTab) => void;
  activeExpertTab?: ExpertTab;
  onExpertTabChange?: (tab: ExpertTab) => void;
  onLogoutClick: () => void;
  isMobileOpen?: boolean;
  onCloseMobile?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentPanel,
  onPanelChange,
  activeAdminTab,
  onAdminTabChange,
  activeVendorTab,
  onVendorTabChange,
  activeExpertTab = 'overview',
  onExpertTabChange,
  onLogoutClick,
  isMobileOpen = false,
  onCloseMobile
}) => {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  // Fetch real profile data from API
  const dispatch = useAppDispatch();
  const { data: profileResponse } = useGetProfileQuery();
  const authUser = useAppSelector((state) => state.auth.user);
  const profile = profileResponse?.data;

  // Sync profile into auth state for app-wide consistency
  React.useEffect(() => {
    if (profileResponse?.data) {
      const u = profileResponse.data;
      const img = u.avatar || u.vendorProfile?.logo || null;
      dispatch(
        setUser({
          id: u.id,
          name: u.name,
          email: u.email,
          role: (u.role as any) || 'CUSTOMER',
          status: (u.status as any) || 'ACTIVE',
          isEmailVerified: u.isEmailVerified,
          avatar: img,
          vendorProfile: u.vendorProfile
            ? {
                id: u.vendorProfile.id,
                businessName: u.vendorProfile.businessName,
                slug: u.vendorProfile.slug,
                logo: u.vendorProfile.logo,
                status: (u.vendorProfile.status as any) || 'APPROVED',
                category: u.vendorProfile.category || undefined,
              }
            : undefined,
        })
      );
    }
  }, [profileResponse, dispatch]);

  const displayName = profile?.name || authUser?.name || 'User';
  const displayEmail = profile?.email || authUser?.email || '';
  const displayRole = profile?.role || authUser?.role || (currentPanel === 'admin' ? 'ADMIN' : currentPanel === 'vendor' ? 'VENDOR' : 'EXPERT');
  const avatarUrl = profile?.avatar || profile?.vendorProfile?.logo || authUser?.avatar;

  const [imgError, setImgError] = React.useState(false);
  React.useEffect(() => {
    setImgError(false);
  }, [avatarUrl]);

  const getInitials = (name: string) => {
    const parts = (name || '').trim().split(' ').filter(Boolean);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
    }
    if (parts.length === 1 && parts[0].length > 0) {
      return parts[0].slice(0, 2).toUpperCase();
    }
    return currentPanel === 'expert' ? 'EX' : currentPanel === 'vendor' ? 'VN' : 'AD';
  };

  const avatarInitials = getInitials(displayName);

  // Exact Admin items from Figma design (node 28406:44195)
  const adminMenuItems: { id: AdminTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5 shrink-0" /> },
    { id: 'usermanagement', label: 'User Management', icon: <Users className="w-5 h-5 shrink-0" /> },
    { id: 'experts', label: 'Agri Experts', icon: <GraduationCap className="w-5 h-5 shrink-0" /> },
    { id: 'product', label: 'Product', icon: <Package className="w-5 h-5 shrink-0" /> },
    { id: 'categories', label: 'Categories', icon: <Layers className="w-5 h-5 shrink-0" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingBag className="w-5 h-5 shrink-0" /> },
    { id: 'partners', label: 'Partners', icon: <Store className="w-5 h-5 shrink-0" /> },
    { id: 'content', label: 'Content Management', icon: <FileText className="w-5 h-5 shrink-0" /> },
    { id: 'contact', label: 'Contact Messages', icon: <Mail className="w-5 h-5 shrink-0" /> },
    { id: 'support', label: 'Support', icon: <Headphones className="w-5 h-5 shrink-0" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5 shrink-0" /> }
  ];

  // Vendor items
  const vendorMenuItems: { id: VendorTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Overview', icon: <LayoutGrid className="w-5 h-5 shrink-0" /> },
    { id: 'product', label: 'Products', icon: <Package className="w-5 h-5 shrink-0" /> },
    { id: 'orders', label: 'Orders', icon: <ShoppingCart className="w-5 h-5 shrink-0" /> },
    { id: 'support', label: 'Customer Messages', icon: <Mail className="w-5 h-5 shrink-0" /> },
    { id: 'admin-support', label: 'Admin Support', icon: <Headphones className="w-5 h-5 shrink-0" /> },
    { id: 'settings', label: 'Settings', icon: <Settings className="w-5 h-5 shrink-0" /> }
  ];

  // Expert items - Dashboard, Farmer Support, Soil Test Support, Profile
  const expertMenuItems: { id: ExpertTab; label: string; icon: React.ReactNode }[] = [
    { id: 'overview', label: 'Dashboard', icon: <LayoutGrid className="w-5 h-5 shrink-0" /> },
    { id: 'consultations', label: 'Farmer Support', icon: <MessageSquarePlus className="w-5 h-5 shrink-0" /> },
    { id: 'soil-tests', label: 'Soil Test Support', icon: <FlaskConical className="w-5 h-5 shrink-0" /> },
    { id: 'settings', label: 'Profile', icon: <Settings className="w-5 h-5 shrink-0" /> }
  ];

  const menuItems = 
    currentPanel === 'admin' 
      ? adminMenuItems 
      : currentPanel === 'vendor' 
      ? vendorMenuItems 
      : expertMenuItems;

  const handleTabClick = (id: string) => {
    if (currentPanel === 'admin') {
      onAdminTabChange(id as AdminTab);
    } else if (currentPanel === 'vendor') {
      onVendorTabChange(id as VendorTab);
    } else {
      onExpertTabChange?.(id as ExpertTab);
    }
    onCloseMobile?.();
  };

  const handlePanelSwitch = (panel: PanelType) => {
    onPanelChange(panel);
  };

  return (
    <>
      {/* ========================================================= */}
      {/* 1. Mobile Drawer Navigation (< 1024px / lg:hidden)       */}
      {/* ========================================================= */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          {/* Backdrop overlay */}
          <div 
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={onCloseMobile}
            aria-hidden="true"
          />

          {/* Drawer sidebar */}
          <aside
            className="relative w-[280px] max-w-[85vw] h-full bg-[#062E35] border-r border-[#083E47] flex flex-col z-50 shadow-2xl animate-in slide-in-from-left duration-200 select-none overflow-hidden"
            style={{ backgroundColor: '#062E35' }}
          >
            {/* Brand Header */}
            <div className="pt-5 pb-4 px-5 flex items-center justify-between border-b border-white/10">
              <div className="flex items-center gap-2">
                <span className="text-white text-2xl font-bold tracking-tight font-['Inter'] lowercase">
                  krisikunjo
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2"></span>
              </div>
              <button
                type="button"
                onClick={onCloseMobile}
                className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
                title="Close navigation"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Role Switcher Pill */}
            <div className="px-4 pt-4 pb-2">
              <div className="flex bg-[#042025] p-1 rounded-xl border border-white/10 gap-1">
                <button
                  type="button"
                  onClick={() => handlePanelSwitch('admin')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    currentPanel === 'admin'
                      ? 'bg-[#0E4F5A] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePanelSwitch('vendor')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    currentPanel === 'vendor'
                      ? 'bg-[#0E4F5A] text-white shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Vendor</span>
                </button>
                <button
                  type="button"
                  onClick={() => handlePanelSwitch('expert')}
                  className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                    currentPanel === 'expert'
                      ? 'bg-[#0E4F5A] text-[#CBFF54] shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  <GraduationCap className="w-3.5 h-3.5" />
                  <span>Expert</span>
                </button>
              </div>
            </div>

            {/* Navigation Menu */}
            <nav className="flex-1 px-3 py-3 flex flex-col gap-1 overflow-y-auto">
              {menuItems.map((item) => {
                const isActive = currentPanel === 'admin' 
                  ? activeAdminTab === item.id 
                  : currentPanel === 'vendor'
                  ? activeVendorTab === item.id
                  : activeExpertTab === item.id;

                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleTabClick(item.id)}
                    className={`w-full flex items-center px-3.5 py-2.5 rounded-xl border-none cursor-pointer transition-all duration-150 text-left font-['Inter'] text-[15px] font-medium ${
                      isActive 
                        ? 'bg-[#0E4F5A] text-white font-semibold shadow-sm' 
                        : 'text-[#9CB3B8] hover:text-white hover:bg-[#093A43]'
                    }`}
                  >
                    <span className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#8AA3A8]'}`}>
                      {item.icon}
                    </span>
                    <span className="ml-3 truncate tracking-[-0.01em]">
                      {item.label}
                    </span>
                  </button>
                );
              })}
            </nav>

            {/* Mobile Footer */}
            <div className="p-4 border-t border-white/10 flex flex-col gap-2">
              <div 
                onClick={() => handleTabClick('settings')}
                className="flex items-center gap-3 px-2 py-2 rounded-xl bg-white/5 hover:bg-white/10 transition-colors cursor-pointer group"
                title={`${displayName} - Go to Settings`}
              >
                {avatarUrl && !imgError ? (
                  <img
                    src={avatarUrl}
                    alt={displayName}
                    onError={() => setImgError(true)}
                    className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0 bg-[#0E4F5A]"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-[#0E4F5A] border border-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0 tracking-wide uppercase select-none">
                    {avatarInitials}
                  </div>
                )}
                <div className="flex flex-col min-w-0 flex-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-white text-sm font-semibold truncate leading-tight group-hover:text-emerald-300 transition-colors">
                      {displayName}
                    </span>
                    {displayRole && (
                      <span className="shrink-0 px-1.5 py-0.5 bg-[#0E4F5A] border border-white/15 text-[#CBFF54] text-[9px] font-bold rounded uppercase tracking-wider">
                        {displayRole}
                      </span>
                    )}
                  </div>
                  <span className="text-[#8AA3A8] text-xs font-normal truncate mt-0.5" title={displayEmail}>
                    {displayEmail || (currentPanel === 'admin' ? 'Admin Suite' : currentPanel === 'vendor' ? 'Vendor Hub' : 'Expert Portal')}
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => {
                  onCloseMobile?.();
                  onLogoutClick();
                }}
                className="w-full flex items-center px-3.5 py-2 rounded-xl cursor-pointer text-[#8AA3A8] hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
              >
                <LogOut className="w-4 h-4 shrink-0" />
                <span className="ml-3">Logout</span>
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. Desktop Docked Sidebar (>= 1024px / lg:flex)           */}
      {/* ========================================================= */}
      <aside 
        className={`${
          isCollapsed ? 'w-[84px] min-w-[84px]' : 'w-[260px] min-w-[260px]'
        } hidden lg:flex bg-[#062E35] border-r border-[#083E47] h-screen flex-col sticky top-0 z-40 transition-all duration-300 select-none shadow-xl shrink-0 overflow-hidden`}
        style={{ backgroundColor: '#062E35' }}
      >
        {/* Brand Header */}
        <div className="pt-6 pb-4 px-6 flex items-center justify-between border-b border-white/5 shrink-0">
          {!isCollapsed ? (
            <div className="flex items-center gap-2">
              <span className="text-white text-2xl font-bold tracking-tight font-['Inter'] lowercase">
                krisikunjo
              </span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-2"></span>
            </div>
          ) : (
            <div className="w-full flex justify-center">
              <span className="text-white text-2xl font-bold font-['Inter']">k</span>
            </div>
          )}

          {/* Collapse toggle button on edge */}
          <button
            type="button"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="text-white/60 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
            title={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
          </button>
        </div>

        {/* Role / Switcher Toggle Pill */}
        {!isCollapsed && (
          <div className="px-5 pt-3 pb-2 shrink-0">
            <div className="flex bg-[#042025] p-1 rounded-xl border border-white/10 gap-1">
              <button
                type="button"
                onClick={() => onPanelChange('admin')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  currentPanel === 'admin'
                    ? 'bg-[#0E4F5A] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Admin</span>
              </button>
              <button
                type="button"
                onClick={() => onPanelChange('vendor')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  currentPanel === 'vendor'
                    ? 'bg-[#0E4F5A] text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Vendor</span>
              </button>
              <button
                type="button"
                onClick={() => onPanelChange('expert')}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all cursor-pointer ${
                  currentPanel === 'expert'
                    ? 'bg-[#0E4F5A] text-[#CBFF54] shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Expert</span>
              </button>
            </div>
          </div>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 px-3 py-3 flex flex-col gap-1 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = currentPanel === 'admin' 
              ? activeAdminTab === item.id 
              : currentPanel === 'vendor'
              ? activeVendorTab === item.id
              : activeExpertTab === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleTabClick(item.id)}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-3.5'} py-2.5 rounded-xl border-none cursor-pointer transition-all duration-150 text-left font-['Inter'] text-[15px] font-medium ${
                  isActive 
                    ? 'bg-[#0E4F5A] text-white font-semibold shadow-sm' 
                    : 'text-[#9CB3B8] hover:text-white hover:bg-[#093A43]'
                }`}
                title={item.label}
              >
                <span className={`shrink-0 transition-colors ${isActive ? 'text-white' : 'text-[#8AA3A8] group-hover:text-white'}`}>
                  {item.icon}
                </span>
                {!isCollapsed && (
                  <span className="ml-3 truncate tracking-[-0.01em]">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Footer Profile & Logout (Figma Design Layout) */}
        <div className="p-4 border-t border-white/10 flex flex-col gap-2 shrink-0">
          {/* User Card */}
          <div 
            onClick={() => handleTabClick('settings')}
            className={`flex items-center ${isCollapsed ? 'justify-center p-1.5' : 'gap-3 px-2 py-2 bg-white/5'} rounded-xl hover:bg-white/10 transition-colors cursor-pointer group`}
            title={`${displayName} (${displayRole || displayEmail}) - Settings`}
          >
            {avatarUrl && !imgError ? (
              <img
                src={avatarUrl}
                alt={displayName}
                onError={() => setImgError(true)}
                className="w-9 h-9 rounded-full object-cover border border-white/20 shrink-0 bg-[#0E4F5A]"
              />
            ) : (
              <div className="w-9 h-9 rounded-full bg-[#0E4F5A] border border-white/20 flex items-center justify-center text-white font-bold text-xs shrink-0 tracking-wide uppercase select-none">
                {avatarInitials}
              </div>
            )}
            {!isCollapsed && (
              <div className="flex flex-col min-w-0 flex-1">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-white text-sm font-semibold truncate leading-tight group-hover:text-emerald-300 transition-colors">
                    {displayName}
                  </span>
                  {displayRole && (
                    <span className="shrink-0 px-1.5 py-0.5 bg-[#0E4F5A] border border-white/15 text-[#CBFF54] text-[9px] font-bold rounded uppercase tracking-wider">
                      {displayRole}
                    </span>
                  )}
                </div>
                <span className="text-[#8AA3A8] text-xs font-normal truncate mt-0.5" title={displayEmail}>
                  {displayEmail || (currentPanel === 'admin' ? 'Admin Suite' : currentPanel === 'vendor' ? 'Vendor Hub' : 'Expert Portal')}
                </span>
              </div>
            )}
          </div>

          {/* Logout Button */}
          <button
            type="button"
            onClick={onLogoutClick}
            className={`w-full flex items-center ${isCollapsed ? 'justify-center px-0' : 'px-3.5'} py-2 rounded-xl cursor-pointer text-[#8AA3A8] hover:text-white hover:bg-white/5 transition-all text-sm font-medium`}
            title="Logout"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {!isCollapsed && <span className="ml-3">Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
};
