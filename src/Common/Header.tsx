import React from 'react';
import { Search, Bell, Menu } from 'lucide-react';
import type { PanelType, AdminTab, VendorTab } from '../types';
import { useAppSelector } from '../redux/store/hooks';

interface HeaderProps {
  currentPanel: PanelType;
  activeAdminTab: AdminTab;
  activeVendorTab: VendorTab;
  onOpenNotifications: () => void;
  onOpenMobileMenu?: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications,
  onOpenMobileMenu
}) => {
  const user = useAppSelector((state) => state.auth.user);
  return (
    <header className="h-16 sm:h-[72px] bg-white border-b border-slate-200/80 flex items-center justify-between px-3 sm:px-6 lg:px-8 sticky top-0 z-30 shrink-0">
      {/* Left: Mobile Hamburger & Search Bar */}
      <div className="flex items-center gap-2 sm:gap-3 flex-1 max-w-md min-w-0 mr-2 sm:mr-4">
        {/* Mobile Hamburger Button */}
        <button
          type="button"
          onClick={onOpenMobileMenu}
          className="lg:hidden w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/80 shrink-0"
          title="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Search Bar - Figma Style Responsive */}
        <div className="relative w-full min-w-0">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-9 sm:pl-11 pr-3 sm:pr-4 py-2 sm:py-2.5 rounded-full border border-slate-200 bg-[#F8FAFC] text-xs sm:text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0E4F5A] focus:bg-white focus:ring-2 focus:ring-[#0E4F5A]/10 transition-all font-['Inter']"
          />
        </div>
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-2.5 sm:gap-4 shrink-0">
        {/* Notification Bell with Badge */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/60"
          title="Notifications"
        >
          <Bell className="w-4 h-4 sm:w-5 sm:h-5" />
          <span className="absolute 1 top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        {/* User Avatar */}
        <div 
          className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[#062E35] text-white flex items-center justify-center font-bold text-xs sm:text-sm shadow-sm cursor-pointer select-none shrink-0"
          title={user ? `${user.name} (${user.role})` : 'User'}
        >
          {user?.name ? user.name.charAt(0).toUpperCase() : (user?.role === 'VENDOR' ? 'V' : 'A')}
        </div>
      </div>
    </header>
  );
};

