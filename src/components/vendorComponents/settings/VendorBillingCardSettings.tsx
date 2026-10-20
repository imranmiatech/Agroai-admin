import React, { useState } from 'react';
import { CreditCard, ShieldCheck, CheckCircle2, Lock, Trash2, Plus, Loader2 } from 'lucide-react';
import {
  useGetSavedCardsQuery,
  useSaveCardMutation,
  useSetDefaultCardMutation,
  useDeleteCardMutation,
} from '../../../redux';

export const VendorBillingCardSettings: React.FC = () => {
  // RTK Query Hooks
  const { data: cardsResponse, isLoading: isLoadingCards } = useGetSavedCardsQuery();
  const [saveCard, { isLoading: isSaving }] = useSaveCardMutation();
  const [setDefaultCard, { isLoading: isSettingDefault }] = useSetDefaultCardMutation();
  const [deleteCard, { isLoading: isDeleting }] = useDeleteCardMutation();

  const savedCards = cardsResponse?.data || [];

  // Form State
  const [cardholderName, setCardholderName] = useState('Jonathan Vance');
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 9214');
  const [expiry, setExpiry] = useState('09/28');
  const [cvv, setCvv] = useState('459');
  const [setAsDefault, setSetAsDefault] = useState(true);
  const [successMsg, setSuccessMsg] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Format Card Number
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.replace(/(\d{4})/g, ' ').trim();
    setCardNumber(formatted);
  };

  // Format Expiry MM/YY
  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length >= 3) {
      value = `${value.slice(0, 2)}/${value.slice(2)}`;
    }
    setExpiry(value);
  };

  // Format CVV
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

  // Save Card Handler
  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!cardholderName.trim()) {
      setErrorMsg('Please enter the cardholder name.');
      return;
    }

    const cleanNum = cardNumber.replace(/\D/g, '');
    if (cleanNum.length < 12 && !cardNumber.includes('••')) {
      setErrorMsg('Please enter a valid 16-digit card number.');
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

    try {
      await saveCard({
        cardholderName: cardholderName.trim(),
        cardNumber: cleanNum.length >= 12 ? cleanNum : '4532453245329214',
        expiry,
        cvv,
        isDefault: setAsDefault,
      }).unwrap();

      setSuccessMsg(true);
      setTimeout(() => setSuccessMsg(false), 3500);
      setCardNumber('');
      setExpiry('');
      setCvv('');
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Failed to save card. Please check details.');
    }
  };

  // Set Default Handler
  const handleSetDefault = async (id: string) => {
    try {
      await setDefaultCard(id).unwrap();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Failed to update default card.');
    }
  };

  // Remove Card Handler
  const handleRemoveCard = async (id: string) => {
    try {
      await deleteCard(id).unwrap();
    } catch (err: any) {
      setErrorMsg(err?.data?.message || 'Failed to remove card.');
    }
  };

  // Active Card for Preview
  const previewCardNumber = cardNumber || (savedCards[0] ? savedCards[0].cardNumber : '•••• •••• •••• ••••');
  const previewName = cardholderName || (savedCards[0] ? savedCards[0].cardholderName : 'Jonathan Vance');
  const previewExpiry = expiry || (savedCards[0] ? savedCards[0].expiry : 'MM/YY');
  const previewType = detectCardType(previewCardNumber);

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Section Header */}
      <div className="flex items-center gap-3.5 pb-4 border-b border-slate-200/80">
        <div className="w-11 h-11 rounded-2xl bg-teal-50 text-teal-700 flex items-center justify-center shrink-0 border border-teal-100">
          <CreditCard className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-900 leading-tight">
            Payout & Billing Cards
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Manage your settlement cards and payment methods for automated marketplace payouts
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
                {previewType}
              </div>
            </div>

            {/* Middle: Card Number */}
            <div className="relative z-10 my-auto">
              <span className="font-mono text-lg sm:text-2xl font-bold tracking-[0.18em] drop-shadow-sm">
                {previewCardNumber}
              </span>
            </div>

            {/* Bottom Row: Cardholder & Expiry */}
            <div className="flex items-end justify-between relative z-10 pt-2 text-xs">
              <div>
                <div className="text-[10px] uppercase font-semibold tracking-wider text-white/70">
                  Cardholder Name
                </div>
                <div className="font-semibold text-sm tracking-wide uppercase mt-0.5 max-w-[190px] truncate">
                  {previewName}
                </div>
              </div>

              <div className="text-right">
                <div className="text-[10px] uppercase font-semibold tracking-wider text-white/70">
                  Expires
                </div>
                <div className="font-mono font-semibold text-sm mt-0.5">
                  {previewExpiry}
                </div>
              </div>
            </div>
          </div>

          {/* Saved Payment Methods List */}
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs flex flex-col gap-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-bold text-sm text-slate-800">Saved Settlement Cards</h3>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600">
                {savedCards.length} {savedCards.length === 1 ? 'Card' : 'Cards'}
              </span>
            </div>

            <div className="flex flex-col gap-2.5">
              {isLoadingCards ? (
                <div className="flex items-center justify-center py-6 text-slate-400 gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-teal-600" />
                  <span className="text-xs">Loading cards...</span>
                </div>
              ) : savedCards.length === 0 ? (
                <div className="text-center py-6 text-xs text-slate-400">
                  No payout cards saved yet. Add your card on the right.
                </div>
              ) : (
                savedCards.map((c) => (
                  <div
                    key={c.id}
                    className={`flex items-center justify-between p-3.5 rounded-2xl border transition-all cursor-pointer ${
                      c.isDefault ? 'border-[#0E4F5A] bg-[#0E4F5A]/5' : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                    onClick={() => {
                      setCardholderName(c.cardholderName);
                      setCardNumber(c.cardNumber);
                      setExpiry(c.expiry);
                    }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-7 rounded-lg bg-slate-50 border border-slate-200/80 flex items-center justify-center text-slate-600 shrink-0">
                        <CreditCard className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-bold text-slate-800">
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

                    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                      {!c.isDefault && (
                        <button
                          type="button"
                          onClick={() => handleSetDefault(c.id)}
                          disabled={isSettingDefault}
                          className="text-xs text-[#0E4F5A] hover:underline font-semibold px-2 py-1 cursor-pointer disabled:opacity-50"
                        >
                          Set Default
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleRemoveCard(c.id)}
                        disabled={isDeleting}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-50"
                        title="Remove card"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Card Entry Form (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col gap-6">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <h3 className="font-bold text-base text-slate-900">Add or Update Payment Card</h3>
              <p className="text-xs text-slate-400 mt-0.5">All transactions and payouts are processed with PCI-compliant bank vault encryption.</p>
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
                placeholder="e.g. Jonathan Vance"
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
                Set as default settlement destination for merchant weekly payouts
              </span>
            </label>

            {/* PCI Compliance Notice */}
            <div className="p-3 rounded-xl bg-slate-50 border border-slate-100 flex items-center gap-2.5 text-xs text-slate-500 mt-1">
              <ShieldCheck className="w-4 h-4 text-teal-600 shrink-0" />
              <span>PCI-DSS Level 1 compliant with end-to-end 256-bit banking grade SSL encryption.</span>
            </div>

            {/* Save Button */}
            <div className="flex justify-end pt-3 mt-2 border-t border-slate-100">
              <button
                type="submit"
                disabled={isSaving}
                className="px-6 py-2.5 rounded-xl bg-[#062E35] hover:bg-[#0A434D] text-white text-sm font-semibold transition-all cursor-pointer shadow-xs active:scale-98 flex items-center gap-2 disabled:opacity-50"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Saving...</span>
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    <span>Save Card Details</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
