import React from 'react';
import { Search, Bell } from 'lucide-react';
import type { PanelType, AdminTab, VendorTab } from '../types';

interface HeaderProps {
  currentPanel: PanelType;
  activeAdminTab: AdminTab;
  activeVendorTab: VendorTab;
  onOpenNotifications: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenNotifications
}) => {
  return (
    <header className="h-[72px] bg-white border-b border-slate-200/80 flex items-center justify-between px-8 sticky top-0 z-40">
      {/* Search Bar - Figma Style */}
      <div className="relative w-full max-w-md">
        <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search families, nannies, content..."
          className="w-full pl-11 pr-4 py-2.5 rounded-full border border-slate-200 bg-[#F8FAFC] text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-[#0E4F5A] focus:bg-white focus:ring-2 focus:ring-[#0E4F5A]/10 transition-all font-['Inter']"
        />
      </div>

      {/* Header Right Actions */}
      <div className="flex items-center gap-4">
        {/* Notification Bell with Badge */}
        <button
          type="button"
          onClick={onOpenNotifications}
          className="relative w-10 h-10 rounded-full flex items-center justify-center text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200/60"
          title="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute 1 top-0.5 -right-0.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center border-2 border-white">
            3
          </span>
        </button>

        {/* User Avatar */}
        <div className="w-9 h-9 rounded-full bg-[#062E35] text-white flex items-center justify-center font-bold text-sm shadow-sm cursor-pointer select-none">
          A
        </div>
      </div>
    </header>
  );
};
