import { useState } from 'react';
import { Save, Check, Building2, CreditCard } from 'lucide-react';

export const BusinessProfile = () => {
  const [storeName, setStoreName] = useState('Apex Tech Store Global');
  const [ownerName, setOwnerName] = useState('Jonathan Vance');
  const [email, setEmail] = useState('support@apextech.com');
  const [phone, setPhone] = useState('+1 (555) 234-8901');
  const [taxId, setTaxId] = useState('EIN-992381283');
  const [address, setAddress] = useState('108 Innovation Way, Suite 400, Austin, TX 78701');
  const [bankAccount, setBankAccount] = useState('Chase Bank **** 4892');
  const [payoutSchedule, setPayoutSchedule] = useState('Weekly on Mondays');
  const [saved, setSaved] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-200">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Business Profile & Banking</h2>
          <p className="text-sm text-slate-500 mt-1">Keep your company credentials, legal tax information, and payout destination up-to-date.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-3xl">
        {saved && (
          <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-5 py-3.5 rounded-xl flex items-center gap-2.5 font-semibold text-sm">
            <Check className="w-5 h-5 text-emerald-600" />
            <span>Business Profile & Payout details updated successfully!</span>
          </div>
        )}

        {/* Company Identity */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <Building2 className="w-5 h-5 text-sky-600" />
            <h3 className="text-lg font-bold text-slate-900">Merchant Store Details</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Official Storefront Name</label>
              <input
                type="text"
                className="p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Business Owner / Legal Rep</label>
              <input
                type="text"
                className="p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Customer Support Email</label>
              <input
                type="email"
                className="p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Contact Phone Number</label>
              <input
                type="text"
                className="p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Tax ID / Business EIN</label>
              <input
                type="text"
                className="p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                value={taxId}
                onChange={(e) => setTaxId(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Dispatch Warehouse Address</label>
              <input
                type="text"
                className="p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Payout & Banking */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-xs flex flex-col gap-5">
          <div className="flex items-center gap-2.5">
            <CreditCard className="w-5 h-5 text-emerald-600" />
            <h3 className="text-lg font-bold text-slate-900">Payout & Banking Information</h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Linked Settlement Account</label>
              <input
                type="text"
                className="p-2.5 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-sky-500"
                value={bankAccount}
                onChange={(e) => setBankAccount(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">Payout Frequency</label>
              <select
                className="p-2.5 border border-slate-200 rounded-xl text-sm bg-white focus:outline-none focus:border-sky-500 cursor-pointer"
                value={payoutSchedule}
                onChange={(e) => setPayoutSchedule(e.target.value)}
              >
                <option value="Daily">Daily Disbursal</option>
                <option value="Weekly on Mondays">Weekly on Mondays</option>
                <option value="Bi-Weekly">Bi-Weekly</option>
                <option value="Monthly">Monthly</option>
              </select>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button 
            type="submit" 
            className="inline-flex items-center gap-2 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-sky-600/20 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Profile Information</span>
          </button>
        </div>
      </form>
    </div>
  );
};
