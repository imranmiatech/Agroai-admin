import React, { useState, useEffect } from 'react';
import { X, TestTube2, Send } from 'lucide-react';
import type { SoilTestSubmission } from '../expertData';

interface SoilReportDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: SoilTestSubmission | null;
  onSaveAdvisory: (reportId: string, advisory: any) => void;
}

export const SoilReportDetailModal: React.FC<SoilReportDetailModalProps> = ({
  isOpen,
  onClose,
  report,
  onSaveAdvisory,
}) => {
  if (!isOpen || !report) return null;

  const [fertilizerPlan, setFertilizerPlan] = useState('');
  const [limingOrGypsum, setLimingOrGypsum] = useState('');
  const [irrigationAdvice, setIrrigationAdvice] = useState('');
  const [recommendedCrops, setRecommendedCrops] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (report.expertAdvisory) {
      setFertilizerPlan(report.expertAdvisory.fertilizerPlan || '');
      setLimingOrGypsum(report.expertAdvisory.limingOrGypsumRequired || '');
      setIrrigationAdvice(report.expertAdvisory.irrigationAdvice || '');
      setRecommendedCrops(report.expertAdvisory.recommendedCrops?.join(', ') || '');
    } else {
      setFertilizerPlan('');
      setLimingOrGypsum('');
      setIrrigationAdvice('');
      setRecommendedCrops(report.cropPlanned || '');
    }
    setError('');
  }, [report]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fertilizerPlan.trim()) {
      setError('Please provide a specific fertilizer plan for this soil report.');
      return;
    }

    onSaveAdvisory(report.id, {
      fertilizerPlan: fertilizerPlan.trim(),
      limingOrGypsumRequired: limingOrGypsum.trim() || 'No chemical soil amendments necessary.',
      irrigationAdvice: irrigationAdvice.trim() || 'Standard crop water management.',
      recommendedCrops: recommendedCrops.split(',').map((c) => c.trim()).filter(Boolean),
      reviewedAt: 'Today',
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-2xl max-h-[92vh] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#062E35] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <TestTube2 className="w-5 h-5 text-[#CBFF54]" />
            <div>
              <h2 className="text-base sm:text-lg font-bold">
                Soil Test Lab Evaluation & Advisory
              </h2>
              <p className="text-xs text-slate-300">
                Report {report.labReportNumber} • {report.farmerName}
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 flex flex-col gap-5 text-sm text-slate-700">
          {/* Lab Parameters Table */}
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2.5">
              Laboratory Soil Chemistry
            </h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Soil pH</span>
                <span className="font-bold text-slate-900">{report.parameters.ph}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Organic Carbon</span>
                <span className="font-bold text-slate-900">{report.parameters.organicCarbon}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Nitrogen (N)</span>
                <span className="font-bold text-slate-900">{report.parameters.nitrogen}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Phosphorus (P)</span>
                <span className="font-bold text-slate-900">{report.parameters.phosphorus}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Potassium (K)</span>
                <span className="font-bold text-slate-900">{report.parameters.potassium}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Zinc (Zn)</span>
                <span className="font-bold text-slate-900">{report.parameters.zinc}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-white border border-slate-200">
                <span className="text-slate-400 block text-[11px]">Boron (B)</span>
                <span className="font-bold text-slate-900">{report.parameters.boron}</span>
              </div>
              <div className="p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800">
                <span className="block text-[11px]">Target Crop</span>
                <span className="font-bold">{report.cropPlanned}</span>
              </div>
            </div>
          </div>

          {/* Form */}
          <form id="soil-form" onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && (
              <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Custom Fertilizer Dosing Plan (Basal & Top-Dress) <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={3}
                required
                value={fertilizerPlan}
                onChange={(e) => setFertilizerPlan(e.target.value)}
                placeholder="Prescribe split doses: e.g. Vermicompost 50kg/decimal + Urea 25kg + TSP 10kg + MOP 15kg in 3 stages..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                Soil Conditioning (Lime / Dolomite / Gypsum)
              </label>
              <input
                type="text"
                value={limingOrGypsum}
                onChange={(e) => setLimingOrGypsum(e.target.value)}
                placeholder="e.g. Acidic pH 5.4 requires Agricultural Lime (Dolomite) 1kg per decimal 15 days before sowing"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Suitable Crops For This Soil
                </label>
                <input
                  type="text"
                  value={recommendedCrops}
                  onChange={(e) => setRecommendedCrops(e.target.value)}
                  placeholder="Wheat, Mustard, Cabbage"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-1">
                  Irrigation & Drainage Advice
                </label>
                <input
                  type="text"
                  value={irrigationAdvice}
                  onChange={(e) => setIrrigationAdvice(e.target.value)}
                  placeholder="Furrow irrigation, avoid stagnant water"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 text-sm focus:outline-none focus:border-[#0E4F5A]"
                />
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            form="soil-form"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#0E4F5A] hover:bg-[#062E35] text-white font-semibold shadow-md transition-all cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Issue Official Advisory</span>
          </button>
        </div>
      </div>
    </div>
  );
};
