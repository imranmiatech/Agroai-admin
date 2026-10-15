import { useState } from 'react';
import { Save, Check, Bell, PackageCheck } from 'lucide-react';

export const VendorSettings = () => {
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [smsAlerts, setSmsAlerts] = useState(false);
  const [autoAcceptOrders, setAutoAcceptOrders] = useState(true);
  const [leadTimeDays, setLeadTimeDays] = useState('1 - 2 Business Days');
  const [vacationMode, setVacationMode] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Store Preferences & Fulfillment Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Configure how your merchant storefront operates and receives order notifications.</p>
        </div>
      </div>

      <form onSubmit={handleSave} className="flex flex-col gap-6 max-w-3xl">
        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-xl flex items-center gap-2.5 font-semibold text-sm">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>Store preferences updated successfully!</span>
          </div>
        )}

        {/* Fulfillment Settings */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <PackageCheck className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-bold text-slate-900">Fulfillment & Packaging Rules</h3>
          </div>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5 max-w-xs">
              <label className="text-xs font-semibold text-slate-700">Standard Dispatch Handling Time</label>
              <select
                className="p-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-sky-500 cursor-pointer"
                value={leadTimeDays}
                onChange={(e) => setLeadTimeDays(e.target.value)}
              >
                <option value="Same Day Dispatch">Same Day Dispatch (Before 2 PM)</option>
                <option value="1 - 2 Business Days">1 - 2 Business Days</option>
                <option value="3 - 5 Business Days">3 - 5 Business Days</option>
              </select>
            </div>

            <label className="flex items-center gap-3 cursor-pointer mt-2">
              <input
                type="checkbox"
                checked={autoAcceptOrders}
                onChange={(e) => setAutoAcceptOrders(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <div>
                <div className="text-sm font-semibold text-slate-900">Auto-Confirm Incoming Orders</div>
                <div className="text-xs text-slate-500">Automatically accept orders without requiring manual click approval</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={vacationMode}
                onChange={(e) => setVacationMode(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <div>
                <div className="text-sm font-semibold text-slate-900">Enable Vacation / Pause Mode</div>
                <div className="text-xs text-slate-500">Temporarily hide products from checkout while away or restocking</div>
              </div>
            </label>
          </div>
        </div>

        {/* Notifications */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <Bell className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-bold text-slate-900">Order & Payout Notifications</h3>
          </div>

          <div className="flex flex-col gap-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <div>
                <div className="text-sm font-semibold text-slate-900">Email me whenever an order is placed</div>
                <div className="text-xs text-slate-500">Receive buyer address and ordered items directly in inbox</div>
              </div>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={smsAlerts}
                onChange={(e) => setSmsAlerts(e.target.checked)}
                className="w-4 h-4 rounded text-sky-600 focus:ring-sky-500"
              />
              <div>
                <div className="text-sm font-semibold text-slate-900">SMS Notification for Urgent Dispatches</div>
                <div className="text-xs text-slate-500">Receive SMS text alerts on mobile phone for express shipments</div>
              </div>
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Store Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
