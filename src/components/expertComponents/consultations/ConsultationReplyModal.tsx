import React, { useState, useEffect } from 'react';
import { 
  X, 
  MapPin, 
  Sprout, 
  AlertTriangle, 
  FileCheck, 
  Send 
} from 'lucide-react';
import type { FarmerInquiry } from '../expertData';

interface ConsultationReplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  inquiry: FarmerInquiry | null;
  onSavePrescription: (inquiryId: string, prescriptionData: any, newStatus: 'IN_PROGRESS' | 'RESOLVED') => void;
}

export const ConsultationReplyModal: React.FC<ConsultationReplyModalProps> = ({
  isOpen,
  onClose,
  inquiry,
  onSavePrescription,
}) => {
  if (!isOpen || !inquiry) return null;

  const [diagnosis, setDiagnosis] = useState('');
  const [treatment, setTreatment] = useState('');
  const [fertilizerOrChemical, setFertilizerOrChemical] = useState('');
  const [dosage, setDosage] = useState('');
  const [advice, setAdvice] = useState('');
  const [markStatus, setMarkStatus] = useState<'RESOLVED' | 'IN_PROGRESS'>('RESOLVED');
  const [error, setError] = useState('');

  useEffect(() => {
    if (inquiry.prescription) {
      setDiagnosis(inquiry.prescription.diagnosis || '');
      setTreatment(inquiry.prescription.treatment || '');
      setFertilizerOrChemical(inquiry.prescription.fertilizerOrChemical || '');
      setDosage(inquiry.prescription.dosage || '');
      setAdvice(inquiry.prescription.advice || '');
    } else {
      setDiagnosis('');
      setTreatment('');
      setFertilizerOrChemical('');
      setDosage('');
      setAdvice('');
    }
    setError('');
  }, [inquiry]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!diagnosis.trim()) {
      setError('Please provide a medical/agronomic diagnosis.');
      return;
    }
    if (!treatment.trim()) {
      setError('Please provide a recommended treatment or action plan.');
      return;
    }

    onSavePrescription(
      inquiry.id,
      {
        diagnosis: diagnosis.trim(),
        treatment: treatment.trim(),
        fertilizerOrChemical: fertilizerOrChemical.trim(),
        dosage: dosage.trim(),
        advice: advice.trim(),
        resolvedAt: 'Today',
      },
      markStatus
    );
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-3xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4.5 bg-[#062E35] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center text-[#CBFF54]">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-bold leading-tight">
                Agri-Consultation Diagnosis & Prescription
              </h2>
              <p className="text-xs text-slate-300">
                Ticket Ref #{inquiry.id} • {inquiry.category}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-6 text-sm text-slate-700">
          {/* Farmer & Issue Summary Card */}
          <div className="rounded-xl bg-slate-50 border border-slate-200 p-4 flex flex-col gap-3">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">
                  Farmer Details
                </span>
                <span className="text-base font-bold text-slate-900 block mt-0.5">
                  {inquiry.farmerName} ({inquiry.farmerPhone})
                </span>
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-1 flex-wrap">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    {inquiry.farmerLocation}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 font-semibold text-emerald-700">
                    <Sprout className="w-3.5 h-3.5" />
                    Crop: {inquiry.cropName}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md ${
                    inquiry.urgency === 'URGENT'
                      ? 'bg-rose-100 text-rose-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {inquiry.urgency}
                </span>
              </div>
            </div>

            {/* Problem Description */}
            <div className="pt-3 border-t border-slate-200/80">
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Farmer's Query & Symptoms
              </h4>
              <p className="text-sm font-semibold text-slate-900 mt-1">
                {inquiry.title}
              </p>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed bg-white p-3 rounded-lg border border-slate-200/60">
                {inquiry.description}
              </p>

              {/* Photos */}
              {inquiry.imageUrls && inquiry.imageUrls.length > 0 && (
                <div className="mt-3">
                  <span className="text-xs font-medium text-slate-500 block mb-1.5">
                    Attached Crop Photos:
                  </span>
                  <div className="flex items-center gap-2">
                    {inquiry.imageUrls.map((url, i) => (
                      <a
                        key={i}
                        href={url}
                        target="_blank"
                        rel="noreferrer"
                        className="block rounded-lg overflow-hidden border border-slate-200 hover:border-[#0E4F5A] transition-colors"
                      >
                        <img
                          src={url}
                          alt="Farmer crop photo"
                          className="w-24 h-24 object-cover"
                        />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Form */}
          <form id="rx-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Diagnosis */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Clinical Diagnosis / Problem Identification <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={diagnosis}
                onChange={(e) => setDiagnosis(e.target.value)}
                placeholder="e.g., Bacterial Leaf Blight (Xanthomonas oryzae pv. oryzae) or Nitrogen Deficiency"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10 font-medium"
              />
            </div>

            {/* Treatment */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Prescribed Action & Treatment Plan <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={2}
                value={treatment}
                onChange={(e) => setTreatment(e.target.value)}
                placeholder="Describe the necessary immediate actions (e.g. drain water, stop top-dressing urea, apply bactericide)"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10 font-normal"
              />
            </div>

            {/* Chemical & Dosage Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Recommended Fertilizer / Chemical / Product
                </label>
                <input
                  type="text"
                  value={fertilizerOrChemical}
                  onChange={(e) => setFertilizerOrChemical(e.target.value)}
                  placeholder="e.g., Copper Oxychloride + Streptomycin or SOP"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Dosage & Application Method
                </label>
                <input
                  type="text"
                  value={dosage}
                  onChange={(e) => setDosage(e.target.value)}
                  placeholder="e.g., 2g/Liter of water, spray in the afternoon"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10"
                />
              </div>
            </div>

            {/* General Advice */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Additional Preventive Advice & Safety Warnings
              </label>
              <textarea
                rows={2}
                value={advice}
                onChange={(e) => setAdvice(e.target.value)}
                placeholder="Wear protective mask during spraying; observe 14-day pre-harvest interval; maintain proper drainage."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A] focus:ring-2 focus:ring-[#0E4F5A]/10"
              />
            </div>

            {/* Resolution Status Switch */}
            <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between flex-wrap gap-2">
              <span className="text-xs font-bold text-slate-800">
                Update Ticket Status:
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setMarkStatus('RESOLVED')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    markStatus === 'RESOLVED'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  ✓ Mark as Resolved & Send Prescription
                </button>
                <button
                  type="button"
                  onClick={() => setMarkStatus('IN_PROGRESS')}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    markStatus === 'IN_PROGRESS'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  Keep In Progress (Waiting for Lab / Observation)
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold text-xs sm:text-sm cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="submit"
            form="rx-form"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E4F5A] hover:bg-[#062E35] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Submit Prescription to Farmer</span>
          </button>
        </div>
      </div>
    </div>
  );
};
