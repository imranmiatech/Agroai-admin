import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, Trash2, Plus } from 'lucide-react';

export interface SavedCard {
  id: string;
  cardholderName: string;
  cardNumber: string; // masked, e.g. '•••• •••• •••• 4242'
  rawLast4: string;
  expiry: string;
  cardType: 'Visa' | 'Mastercard' | 'Amex';
  isDefault: boolean;
}

export const AdminBillingCardSettings: React.FC = () => {
  // Form State
  const [cardholderName, setCardholderName] = useState('Aoife Turner');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 8892');
  const [expiry, setExpiry] = useState('08/29');
  const [cvv, setCvv] = useState('382');
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Saved Cards List
  const [savedCards, setSavedCards] = useState<SavedCard[]>([
    {
      id: 'card-1',
      cardholderName: 'Aoife Turner',
      cardNumber: '•••• •••• •••• 8892',
      rawLast4: '8892',
      expiry: '08/29',
      cardType: 'Visa',
      isDefault: true
    },
    {
      id: 'card-2',
      cardholderName: 'Krisikunjo Enterprise Corp',
      cardNumber: '•••• •••• •••• 3019',
      rawLast4: '3019',
      expiry: '11/27',
      cardType: 'Mastercard',
      isDefault: false
    }
  ]);

  // Card formatting
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, '$1 ').trim();
    setCardNumber(formatted);
  };

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  const handleCvvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 4);
    setCvv(value);
  };

  const detectCardType = (number: string): 'Visa' | 'Mastercard' | 'Amex' => {
    const clean = number.replace(/\D/g, '');
    if (clean.startsWith('34') || clean.startsWith('37')) return 'Amex';
    if (clean.startsWith('5') || clean.startsWith('2')) return 'Mastercard';
    return 'Visa';
  };

  const handleSaveCard = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!cardholderName.trim()) {
      setErrorMsg('Please enter the name on card.');
      return;
    }
    const cleanNum = cardNumber.replace(/\D/g, '');
    if (cleanNum.length < 12 && !cardNumber.includes('•')) {
      setErrorMsg('Please enter a valid card number.');
      return;
    }
    if (expiry.length < 5) {
      setErrorMsg('Please enter a valid expiry date (MM/YY).');
      return;
    }
    if (cvv.length < 3) {
      setErrorMsg('Please enter a valid CVV code.');
      return;
    }

    const last4 = cleanNum.length >= 4 ? cleanNum.slice(-4) : '8892';
    const cardType = detectCardType(cardNumber);

    const newCard: SavedCard = {
      id: `card-${Date.now()}`,
      cardholderName,
      cardNumber: `•••• •••• •••• ${last4}`,
      rawLast4: last4,
      expiry,
      cardType,
      isDefault: setAsDefault
    };

    if (setAsDefault) {
      setSavedCards(savedCards.map(c => ({ ...c, isDefault: false })).concat(newCard));
    } else {
      setSavedCards([newCard, ...savedCards]);
    }

    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 3500);
  };

  const handleRemoveCard = (id: string) => {
    setSavedCards(savedCards.filter(c => c.id !== id));
  };

  const handleSetDefault = (id: string) => {
    setSavedCards(savedCards.map(c => ({ ...c, isDefault: c.id === id })));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Section Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200/80">
        <div className="w-11 h-11 rounded-2xl bg-sky-50 text-sky-700 flex items-center justify-center shrink-0 border border-sky-100">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">
            Billing & Corporate Cards
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage company payment methods for infrastructure, gateway fees, and payouts
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Interactive Visual Card & Saved Cards (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          {/* Virtual Card Preview */}
          <div className="relative w-full aspect-[1.586/1] rounded-3xl p-6 sm:p-7 text-white shadow-xl overflow-hidden bg-gradient-to-tr from-[#062E35] via-[#0E4F5A] to-[#14B8A6] flex flex-col justify-between border border-teal-300/30">
            {/* Background geometric overlay */}
            <div className="absolute -right-12 -top-12 w-48 h-48 rounded-full bg-white/10 blur-2xl pointer-events-none" />
            <div className="absolute -left-12 -bottom-12 w-48 h-48 rounded-full bg-emerald-400/10 blur-2xl pointer-events-none" />

            {/* Top Row: Chip & Contactless */}
            <div className="flex items-center justify-between relative z-10">
              <div className="flex items-center gap-2.5">
                {/* Chip */}
                <div className="w-11 h-8 rounded-md bg-gradient-to-br from-amber-200 via-amber-300 to-amber-400 border border-amber-500/30 shadow-inner flex items-center justify-center relative overflow-hidden">
                  <div className="w-full h-[1px] bg-amber-600/40 absolute top-2.5" />
                  <div className="w-full h-[1px] bg-amber-600/40 absolute bottom-2.5" />
                  <div className="h-full w-[1px] bg-amber-600/40 absolute left-4" />
                </div>
                {/* Contactless icon */}
                <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.5 16.5a5 5 0 010-9m3.5 11a8.5 8.5 0 000-13m3.5 15a12 12 0 000-17" />
                </svg>
              </div>

              {/* Card Network Tag */}
              <div className="font-extrabold tracking-wider text-xs sm:text-sm uppercase bg-white/15 px-3 py-1 rounded-lg backdrop-blur-xs border border-white/20">
                {detectCardType(cardNumber)}
              </div>
            </div>

            {/* Middle: Card Number */}
            <div className="relative z-10 my-auto">
              <span className="font-mono text-lg sm:text-2xl font-bold tracking-[0.18em] drop-shadow-sm">
                {cardNumber || '•••• •••• •••• ••••'}
              </span>
            </div>

            {/* Bottom Row: Cardholder & Expiry */}
            <div className="flex items-end justify-between relative z-10 pt-2 text-xs">
              <div>
                <div className="text-[10px] uppercase font-semibold tracking-wider text-white/70">
                  Cardholder Name
                </div>
                <div className="font-semibold text-sm tracking-wide uppercase mt-0.5 max-w-[190px] truncate">
                  {cardholderName || 'Aoife Turner'}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-white/70">
                  Expires
                </div>
                <div className="font-mono font-semibold text-sm mt-0.5">
                  {expiry || 'MM/YY'}
                </div>
              </div>
            </div>
          </div>

          {/* Saved Cards List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="font-bold text-sm text-slate-900">Saved Payment Methods</h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {savedCards.length} Cards
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {savedCards.map((c) => (
                <div
                  key={c.id}
                  className={`p-3.5 rounded-2xl border flex items-center justify-between transition-all ${
                    c.isDefault ? 'border-[#0E4F5A] bg-[#0E4F5A]/5' : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-700 shrink-0">
                      <CreditCard className="w-5 h-5 text-[#0E4F5A]" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-slate-900">
                          {c.cardType} •••• {c.rawLast4}
                        </span>
                        {c.isDefault && (
                          <span className="bg-teal-100 text-teal-800 text-[10px] font-bold px-2 py-0.5 rounded-full">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        Expires {c.expiry} • {c.cardholderName}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {!c.isDefault && (
                      <button
                        type="button"
                        onClick={() => handleSetDefault(c.id)}
                        className="text-xs text-[#0E4F5A] hover:underline font-semibold px-2 py-1 cursor-pointer"
                      >
                        Set Default
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={() => handleRemoveCard(c.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Remove card"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Card Entry Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Add or Update Card Details</h3>
              <p className="text-xs text-slate-400 mt-0.5">All transactions are processed through tokenized vault security.</p>
            </div>
          </div>

          {successMsg && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Card details verified and saved successfully!</span>
            </div>
          )}

          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2 animate-in fade-in duration-200">
              <Lock className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          <form onSubmit={handleSaveCard} className="flex flex-col gap-4.5">
            {/* Cardholder Name */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Cardholder Full Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={cardholderName}
                onChange={(e) => setCardholderName(e.target.value)}
                placeholder="e.g. Aoife Turner"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10 transition-all font-medium"
              />
            </div>

            {/* Card Number */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-slate-700">
                Card Number <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  required
                  maxLength={19}
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  placeholder="4242 0000 0000 0000"
                  className="w-full pl-4 pr-16 py-2.5 rounded-xl border border-slate-200 font-mono text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10 transition-all font-medium"
                />
                <div className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded pointer-events-none">
                  {detectCardType(cardNumber)}
                </div>
              </div>
            </div>

            {/* Expiry & CVV Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  Expiry Date <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  maxLength={5}
                  value={expiry}
                  onChange={handleExpiryChange}
                  placeholder="MM/YY"
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-200 font-mono text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10 transition-all font-medium"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-slate-700">
                  CVV / CVC <span className="text-rose-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="password"
                    required
                    maxLength={4}
                    value={cvv}
                    onChange={handleCvvChange}
                    placeholder="123"
                    className="w-full pl-4 pr-10 py-2.5 rounded-xl border border-slate-200 font-mono text-sm text-slate-900 focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10 transition-all font-medium"
                  />
                  <Lock className="w-4 h-4 text-slate-400 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Set as default checkbox */}
            <label className="flex items-center gap-2.5 cursor-pointer select-none pt-1">
              <input
                type="checkbox"
                checked={setAsDefault}
                onChange={(e) => setSetAsDefault(e.target.checked)}
                className="w-4 h-4 rounded text-[#0E4F5A] focus:ring-[#0E4F5A] accent-[#0E4F5A] cursor-pointer"
              />
              <span className="text-xs font-medium text-slate-700">
                Set as default payment card for enterprise fees and settlement
              </span>
            </label>

            {/* PCI Compliance Notice */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs text-slate-500 mt-1">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>PCI-DSS Level 1 compliant with end-to-end 256-bit SSL encryption.</span>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-3 mt-2 border-t border-slate-100">
              <button
                type="submit"
                className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-98 flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Save Card Details</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
