import React, { useState, useMemo } from 'react';
import {
  Search,
  RefreshCw,
  Download,
  CheckCircle2,
  FlaskConical,
  MapPin,
  Phone,
  User,
  Plus,
  Trash2,
  Eye,
  Check,
  Edit2,
  X,
  Sparkles,
  TrendingUp,
} from 'lucide-react';
import {
  useGetSoilTestsQuery,
  useUpdateSoilTestStatusMutation,
  usePublishSoilReportMutation,
  useDeleteSoilTestMutation,
  type SoilTestRequest,
  type SoilTestStatus,
  type SoilParameter,
  type FertilizerDose,
} from '../../redux';
import { generateSoilReportPdf } from '../../utils/generateSoilReportPdf';

// Default standard soil parameters for new reports
const DEFAULT_PARAMETERS: SoilParameter[] = [
  { name: 'Soil pH', unit: 'pH Scale', measuredValue: 6.5, optimalRange: '6.0 - 7.0', status: 'Optimal' },
  { name: 'Available Nitrogen (N)', unit: 'kg/ha', measuredValue: 180, optimalRange: '200 - 300', status: 'Deficient' },
  { name: 'Available Phosphorus (P)', unit: 'ppm', measuredValue: 26.0, optimalRange: '18 - 30', status: 'Optimal' },
  { name: 'Available Potassium (K)', unit: 'ppm', measuredValue: 195, optimalRange: '150 - 250', status: 'Optimal' },
  { name: 'Organic Carbon', unit: '%', measuredValue: '1.45%', optimalRange: '1.50 - 2.50%', status: 'Moderate' },
  { name: 'Available Zinc (Zn)', unit: 'ppm', measuredValue: 0.85, optimalRange: '1.00 - 2.50', status: 'Deficient' },
  { name: 'Available Sulfur (S)', unit: 'ppm', measuredValue: 18.2, optimalRange: '15.0 - 25.0', status: 'Optimal' },
  { name: 'Boron (B)', unit: 'ppm', measuredValue: 0.65, optimalRange: '0.50 - 1.20', status: 'Optimal' },
  { name: 'Electrical Conductivity (EC)', unit: 'dS/m', measuredValue: 0.45, optimalRange: '< 1.0 (Non-saline)', status: 'Optimal' },
];

// Default fertilizer plan for recommendations
const DEFAULT_FERTILIZER_PLAN: FertilizerDose[] = [
  {
    fertilizer: 'Urea (Nitrogen Booster)',
    dosePerBigha: '26 kg',
    applicationStage: 'Split in 3 doses (Basal, Tillering, Panicle)',
    purpose: 'Replenish nitrogen deficit for healthy foliage & root growth',
  },
  {
    fertilizer: 'Triple Super Phosphate (TSP)',
    dosePerBigha: '12 kg',
    applicationStage: 'Full basal application during final ploughing',
    purpose: 'Promote root development and early plant vigor',
  },
  {
    fertilizer: 'Zinc Sulfate (Heptahydrate 21%)',
    dosePerBigha: '2.0 kg',
    applicationStage: 'Basal dressing with organic manure',
    purpose: 'Correct zinc deficiency and prevent Khaira disease',
  },
  {
    fertilizer: 'Organic Vermicompost',
    dosePerBigha: '100 kg',
    applicationStage: 'Broadcast 7 days before transplantation',
    purpose: 'Improve soil moisture holding capacity and biological count',
  },
];

export const ExpertSoilTestsPage: React.FC = () => {
  // 1. RTK Query
  const {
    data: requests = [],
    isLoading,
    isFetching,
    refetch,
  } = useGetSoilTestsQuery(undefined, {
    pollingInterval: 4000,
  });

  const [updateStatus, { isLoading: isUpdatingStatus }] = useUpdateSoilTestStatusMutation();
  const [publishReport, { isLoading: isPublishing }] = usePublishSoilReportMutation();
  const [deleteSoilTest, { isLoading: isDeleting }] = useDeleteSoilTestMutation();

  // 2. Local State
  const [activeTab, setActiveTab] = useState<'ALL' | SoilTestStatus>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Modals
  const [publishingRequest, setPublishingRequest] = useState<SoilTestRequest | null>(null);
  const [viewingRequest, setViewingRequest] = useState<SoilTestRequest | null>(null);

  // Form State for Report Publishing Modal
  const [healthScore, setHealthScore] = useState<number>(85);
  const [soilTexture, setSoilTexture] = useState<string>('Clay Loam (Rich Alluvial)');
  const [technicianName, setTechnicianName] = useState<string>('Dr. Agricultural Specialist (Chief Agronomist)');
  const [parameters, setParameters] = useState<SoilParameter[]>(DEFAULT_PARAMETERS);
  const [fertilizerPlan, setFertilizerPlan] = useState<FertilizerDose[]>(DEFAULT_FERTILIZER_PLAN);
  const [recommendationsText, setRecommendationsText] = useState<string>(
    '• Soil pH is balanced; maintain moderate irrigation.\n• Supplement zinc and nitrogen during initial planting.\n• Incorporate organic residues to boost organic carbon content.'
  );

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4000);
  };

  // Open Publish Modal
  const handleOpenPublishModal = (req: SoilTestRequest) => {
    setPublishingRequest(req);
    if (req.labReport) {
      setHealthScore(req.labReport.overallHealthScore || 85);
      setSoilTexture(req.labReport.soilTexture || 'Clay Loam (Rich Alluvial)');
      setTechnicianName(req.labReport.labTechnician || 'Dr. Agricultural Specialist (Chief Agronomist)');
      setParameters(req.labReport.parameters?.length ? req.labReport.parameters : DEFAULT_PARAMETERS);
      setFertilizerPlan(req.labReport.fertilizerPlan?.length ? req.labReport.fertilizerPlan : DEFAULT_FERTILIZER_PLAN);
      setRecommendationsText(
        req.labReport.aiRecommendations?.join('\n') ||
          '• Soil pH is balanced; maintain moderate irrigation.\n• Supplement zinc and nitrogen during initial planting.\n• Incorporate organic residues to boost organic carbon content.'
      );
    } else {
      setHealthScore(85);
      setSoilTexture('Clay Loam (Rich Alluvial)');
      setTechnicianName('Dr. Agricultural Specialist (Chief Agronomist)');
      setParameters(DEFAULT_PARAMETERS);
      setFertilizerPlan(DEFAULT_FERTILIZER_PLAN);
      setRecommendationsText(
        `• Target Crop: ${req.targetCrop || 'Field Crops'}\n• Ensure adequate nitrogen top-dressing during vegetative stage.\n• Apply vermicompost at 100kg/bigha to enhance microbial activity.`
      );
    }
  };

  // Handle Submit Publish
  const handleConfirmPublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!publishingRequest || isPublishing) return;

    try {
      const recs = recommendationsText
        .split('\n')
        .map((r) => r.replace(/^[•\-\*]\s*/, '').trim())
        .filter(Boolean);

      await publishReport({
        id: publishingRequest.id,
        overallHealthScore: Number(healthScore),
        soilTexture,
        labTechnician: technicianName,
        accreditation: 'ISO/IEC 17025 Accredited AgriLab Bogura',
        parameters,
        fertilizerPlan,
        aiRecommendations: recs,
      }).unwrap();

      showToast(`Lab report for ${publishingRequest.id} published successfully! User can now download PDF.`);
      setPublishingRequest(null);
    } catch (err: any) {
      console.error('Publish error:', err);
      showToast(err?.data?.message || 'Failed to publish lab report. Please check server.');
    }
  };

  // Handle Delete Request
  const handleDeleteRequest = async (req: SoilTestRequest) => {
    if (window.confirm(`Are you sure you want to permanently delete soil test request #${req.id}? This will remove it from the database.`)) {
      try {
        await deleteSoilTest(req.id).unwrap();
        showToast(`Soil test request #${req.id} deleted successfully.`);
      } catch (err: any) {
        showToast(err?.data?.message || 'Failed to delete request.');
      }
    }
  };

  // Handle Quick Status Change
  const handleStatusChange = async (req: SoilTestRequest, newStatus: SoilTestStatus) => {
    try {
      await updateStatus({
        id: req.id,
        status: newStatus,
      }).unwrap();
      showToast(`Status updated to "${newStatus}" for ${req.id}`);
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Handle PDF Download
  const handleDownloadPdf = (req: SoilTestRequest) => {
    if (!req.labReport) {
      showToast('Please publish a lab test report first before downloading PDF.');
      return;
    }
    generateSoilReportPdf(req);
    showToast(`Generating soil diagnostic PDF report for ${req.id}...`);
  };

  // Parameter Change in Modal
  const handleParamValueChange = (index: number, val: string) => {
    setParameters((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, measuredValue: val } : p))
    );
  };

  const handleParamStatusChange = (index: number, st: 'Optimal' | 'Moderate' | 'Deficient' | 'Excess') => {
    setParameters((prev) =>
      prev.map((p, idx) => (idx === index ? { ...p, status: st } : p))
    );
  };

  // Fertilizer plan row actions
  const handleAddFertilizerRow = () => {
    setFertilizerPlan((prev) => [
      ...prev,
      {
        fertilizer: 'Gypsum (Sulfur Provider)',
        dosePerBigha: '10 kg',
        applicationStage: 'Basal dressing',
        purpose: 'Improves soil flocculation and supplies sulfur',
      },
    ]);
  };

  const handleRemoveFertilizerRow = (index: number) => {
    setFertilizerPlan((prev) => prev.filter((_, idx) => idx !== index));
  };

  // Filtered List
  const filteredRequests = useMemo(() => {
    return requests.filter((req) => {
      // Tab filter
      if (activeTab !== 'ALL' && req.status !== activeTab) {
        return false;
      }
      // Search filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const mId = req.id.toLowerCase().includes(q);
        const mFarmer = req.farmerName.toLowerCase().includes(q);
        const mPhone = req.phone.toLowerCase().includes(q);
        const mDistrict = req.district.toLowerCase().includes(q);
        const mCrop = req.targetCrop ? req.targetCrop.toLowerCase().includes(q) : false;
        return mId || mFarmer || mPhone || mDistrict || mCrop;
      }
      return true;
    });
  }, [requests, activeTab, searchQuery]);

  // Counts
  const totalCount = requests.length;
  const pendingPickupCount = requests.filter((r) => r.status === 'Pending Pickup').length;
  const testingCount = requests.filter((r) => r.status === 'Lab Testing' || r.status === 'Sample Collected').length;
  const completedCount = requests.filter((r) => r.status === 'Completed').length;

  return (
    <div className="w-full font-['Inter'] flex flex-col gap-5 animate-in fade-in duration-200">
      {/* 1. Header Banner */}
      <div className="bg-gradient-to-r from-[#062E35] via-[#0A434D] to-[#0E4F5A] rounded-2xl p-5 sm:p-6 text-white shadow-sm border border-emerald-900/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <FlaskConical className="w-3.5 h-3.5" />
              Soil Lab Diagnostic Desk
            </span>
            <span className="text-xs text-emerald-200/70 hidden sm:inline">
              • Connected with Soil Testing Portal
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white mt-1.5">
            Farmer Soil Test Support & Result Publishing
          </h1>
          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl">
            Inspect incoming farmland soil testing bookings, record physical and bio-chemical laboratory analysis, and publish the official diagnostic certificate with downloadable PDF.
          </p>
        </div>

        {/* Stats Pills */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          <div className="bg-white/10 backdrop-blur-xs rounded-xl px-3 py-2 border border-white/10 text-center">
            <p className="text-[11px] text-emerald-200 uppercase font-medium">Total Bookings</p>
            <p className="text-lg font-bold text-white">{totalCount}</p>
          </div>
          <div className="bg-amber-500/20 backdrop-blur-xs rounded-xl px-3 py-2 border border-amber-400/30 text-center">
            <p className="text-[11px] text-amber-200 uppercase font-medium">In Lab Testing</p>
            <p className="text-lg font-bold text-amber-300">{testingCount + pendingPickupCount}</p>
          </div>
          <div className="bg-emerald-500/20 backdrop-blur-xs rounded-xl px-3 py-2 border border-emerald-400/30 text-center">
            <p className="text-[11px] text-emerald-200 uppercase font-medium">Published</p>
            <p className="text-lg font-bold text-emerald-300">{completedCount}</p>
          </div>
        </div>
      </div>

      {/* Toast */}
      {toastMessage && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-3 rounded-xl text-sm flex items-center justify-between shadow-xs animate-in slide-in-from-top-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-medium">{toastMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setToastMessage(null)}
            className="text-emerald-700 hover:text-emerald-900 text-xs font-semibold cursor-pointer"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* 2. Controls & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-4 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Search Input */}
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by sample ID (e.g. SL-2026-8941), farmer, phone, or crop..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 rounded-xl border border-slate-200 text-xs text-slate-800 focus:outline-hidden focus:ring-2 focus:ring-[#0E4F5A] focus:border-transparent transition-all"
          />
        </div>

        {/* Tab Filters */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl text-xs font-medium overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'ALL'
                ? 'bg-white text-slate-900 font-semibold shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All ({totalCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Pending Pickup')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'Pending Pickup'
                ? 'bg-amber-500 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-amber-700'
            }`}
          >
            Pending Pickup ({pendingPickupCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Lab Testing')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'Lab Testing'
                ? 'bg-blue-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-blue-700'
            }`}
          >
            Lab Testing ({testingCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('Completed')}
            className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer whitespace-nowrap ${
              activeTab === 'Completed'
                ? 'bg-emerald-600 text-white font-semibold shadow-xs'
                : 'text-slate-600 hover:text-emerald-700'
            }`}
          >
            Completed & Published ({completedCount})
          </button>
        </div>

        {/* Refresh */}
        <button
          type="button"
          onClick={() => refetch()}
          className="p-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer shrink-0"
          title="Refresh soil test requests"
        >
          <RefreshCw className={`w-4 h-4 ${isFetching ? 'animate-spin text-emerald-600' : ''}`} />
        </button>
      </div>

      {/* 3. Requests Table / Cards */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {isLoading && requests.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs">
            <RefreshCw className="w-7 h-7 animate-spin mx-auto mb-2 text-[#0E4F5A]" />
            Loading soil diagnostic test requests...
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="py-16 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
            <FlaskConical className="w-10 h-10 text-slate-300" />
            <span className="text-sm font-semibold text-slate-700">No soil test requests found</span>
            <p className="text-xs text-slate-400 max-w-sm">
              No requests match the current search or status filter criteria.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Sample ID</th>
                  <th className="py-3 px-4">Farmer Details</th>
                  <th className="py-3 px-4">Land & Crop</th>
                  <th className="py-3 px-4">Test Package</th>
                  <th className="py-3 px-4">Status & Timeline</th>
                  <th className="py-3 px-4 text-right">Expert Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredRequests.map((req) => {
                  const isCompleted = req.status === 'Completed';

                  return (
                    <tr
                      key={req.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      {/* Sample ID */}
                      <td className="py-3.5 px-4 font-mono font-bold text-[#0E4F5A]">
                        {req.id}
                        <div className="text-[10px] text-slate-400 font-sans font-normal mt-0.5">
                          {req.requestDate}
                        </div>
                      </td>

                      {/* Farmer Details */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-900 flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-slate-400" />
                          {req.farmerName}
                        </div>
                        <div className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {req.phone}
                        </div>
                        <div className="text-slate-400 text-[10px] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {req.upazila}, {req.district}
                        </div>
                      </td>

                      {/* Land & Crop */}
                      <td className="py-3.5 px-4">
                        <span className="font-medium text-emerald-900 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/70 inline-block">
                          🌱 {req.targetCrop}
                        </span>
                        <div className="text-slate-500 text-[11px] mt-1">
                          Area: <strong>{req.landArea}</strong>
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          Plot: {req.villagePlot}
                        </div>
                      </td>

                      {/* Test Package */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-slate-800 line-clamp-1">
                          {req.packageName}
                        </div>
                        <div className="text-slate-500 text-[11px] mt-0.5">
                          ৳{req.amount} • <span className="text-emerald-700 font-medium">{req.paymentStatus}</span>
                        </div>
                        <div className="text-slate-400 text-[10px]">
                          Method: {req.paymentMethod}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <div className="flex flex-col gap-1.5">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold w-fit ${
                              isCompleted
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : req.status === 'Lab Testing'
                                ? 'bg-blue-100 text-blue-800 border border-blue-300'
                                : req.status === 'Sample Collected'
                                ? 'bg-purple-100 text-purple-800 border border-purple-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}
                          >
                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                            {req.status}
                          </span>

                          {/* Quick Status Select */}
                          <select
                            value={req.status}
                            disabled={isUpdatingStatus}
                            onChange={(e) => handleStatusChange(req, e.target.value as SoilTestStatus)}
                            className="text-[11px] text-slate-700 border border-slate-200 rounded-lg px-2 py-1 bg-white focus:outline-hidden focus:ring-1 focus:ring-[#0E4F5A] cursor-pointer"
                          >
                            <option value="Pending Pickup">Pending Pickup</option>
                            <option value="Sample Collected">Sample Collected</option>
                            <option value="Lab Testing">Lab Testing</option>
                            <option value="Completed">Completed</option>
                          </select>
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isCompleted ? (
                            <>
                              <button
                                type="button"
                                onClick={() => handleOpenPublishModal(req)}
                                className="px-2.5 py-1.5 rounded-lg border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                title="Edit Published Lab Report"
                              >
                                <Edit2 className="w-3.5 h-3.5 text-amber-600" />
                                <span>Edit Result</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setViewingRequest(req)}
                                className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
                                title="View Lab Report"
                              >
                                <Eye className="w-3.5 h-3.5 text-slate-500" />
                                <span>Report</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteRequest(req)}
                                disabled={isDeleting}
                                title="Delete Request"
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDownloadPdf(req)}
                                className="px-3 py-1.5 rounded-lg bg-[#0E4F5A] hover:bg-[#09353D] text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                                title="Download PDF Certificate"
                              >
                                <Download className="w-3.5 h-3.5" />
                                <span>PDF</span>
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => handleDeleteRequest(req)}
                                disabled={isDeleting}
                                title="Delete Request"
                                className="p-1.5 rounded-lg border border-slate-200 hover:bg-red-50 hover:border-red-200 text-slate-400 hover:text-red-600 transition-colors cursor-pointer"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleOpenPublishModal(req)}
                                className="px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all cursor-pointer"
                              >
                                <FlaskConical className="w-3.5 h-3.5" />
                                <span>Publish Result</span>
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 4. Publish Lab Report Modal */}
      {publishingRequest && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 bg-gradient-to-r from-[#062E35] to-[#0E4F5A] text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase tracking-wider text-emerald-300 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-400/30">
                  {publishingRequest.id} • {publishingRequest.status === 'Completed' ? 'Edit Published Report' : 'Lab Result Publishing'}
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  {publishingRequest.status === 'Completed' ? 'Edit & Update Soil Report' : 'Publish Soil Diagnostic Report'} for {publishingRequest.farmerName}
                </h3>
                <p className="text-xs text-emerald-100/70">
                  Target Crop: {publishingRequest.targetCrop} • Area: {publishingRequest.landArea} ({publishingRequest.upazila}, {publishingRequest.district})
                </p>
              </div>

              <button
                type="button"
                onClick={() => setPublishingRequest(null)}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleConfirmPublish} className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Basic Diagnostic Meta */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Overall Health Score (1-100)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={healthScore}
                    onChange={(e) => setHealthScore(Number(e.target.value))}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs font-bold text-[#0E4F5A]"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Soil Texture Classification
                  </label>
                  <select
                    value={soilTexture}
                    onChange={(e) => setSoilTexture(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs text-slate-800 bg-white"
                  >
                    <option value="Clay Loam (Rich Alluvial)">Clay Loam (Rich Alluvial)</option>
                    <option value="Sandy Loam">Sandy Loam</option>
                    <option value="Silty Clay Loam">Silty Clay Loam</option>
                    <option value="Silty Loam">Silty Loam</option>
                    <option value="Red Acidic Loam">Red Acidic Loam</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Certifying Agronomist
                  </label>
                  <input
                    type="text"
                    value={technicianName}
                    onChange={(e) => setTechnicianName(e.target.value)}
                    className="w-full p-2 border border-slate-200 rounded-lg text-xs text-slate-800"
                    required
                  />
                </div>
              </div>

              {/* Parameters Table */}
              <div>
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5 mb-2">
                  <FlaskConical className="w-4 h-4 text-emerald-600" />
                  Bio-Chemical Parameters & Nutrient Measurements
                </h4>

                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-slate-600 text-[11px] font-bold">
                        <th className="py-2.5 px-3">Parameter</th>
                        <th className="py-2.5 px-3">Unit</th>
                        <th className="py-2.5 px-3">Optimal Standard</th>
                        <th className="py-2.5 px-3">Measured Lab Value</th>
                        <th className="py-2.5 px-3">Nutrient Rating</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {parameters.map((param, idx) => (
                        <tr key={idx} className="hover:bg-slate-50/50">
                          <td className="py-2 px-3 font-semibold text-slate-800">{param.name}</td>
                          <td className="py-2 px-3 text-slate-500 font-mono text-[11px]">{param.unit}</td>
                          <td className="py-2 px-3 text-slate-500">{param.optimalRange}</td>
                          <td className="py-2 px-3">
                            <input
                              type="text"
                              value={param.measuredValue}
                              onChange={(e) => handleParamValueChange(idx, e.target.value)}
                              className="w-24 p-1 border border-slate-200 rounded-md text-xs font-semibold text-slate-900"
                            />
                          </td>
                          <td className="py-2 px-3">
                            <select
                              value={param.status}
                              onChange={(e) => handleParamStatusChange(idx, e.target.value as any)}
                              className={`p-1 rounded-md text-xs font-bold border ${
                                param.status === 'Optimal'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                                  : param.status === 'Deficient'
                                  ? 'bg-red-50 text-red-700 border-red-300'
                                  : param.status === 'Moderate'
                                  ? 'bg-amber-50 text-amber-800 border-amber-300'
                                  : 'bg-purple-50 text-purple-800 border-purple-300'
                              }`}
                            >
                              <option value="Optimal">Optimal</option>
                              <option value="Moderate">Moderate</option>
                              <option value="Deficient">Deficient</option>
                              <option value="Excess">Excess</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Fertilizer Prescription Plan */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    Targeted Fertilizer Prescription (Per Bigha)
                  </h4>
                  <button
                    type="button"
                    onClick={handleAddFertilizerRow}
                    className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-300 hover:bg-emerald-100 text-xs font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" /> Add Fertilizer
                  </button>
                </div>

                <div className="space-y-2">
                  {fertilizerPlan.map((plan, idx) => (
                    <div
                      key={idx}
                      className="grid grid-cols-1 sm:grid-cols-12 gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200 items-center text-xs"
                    >
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={plan.fertilizer}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFertilizerPlan((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, fertilizer: val } : item))
                            );
                          }}
                          placeholder="Fertilizer Name"
                          className="w-full p-1.5 border border-slate-200 rounded-md text-xs font-semibold"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <input
                          type="text"
                          value={plan.dosePerBigha}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFertilizerPlan((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, dosePerBigha: val } : item))
                            );
                          }}
                          placeholder="Dose (e.g. 25 kg)"
                          className="w-full p-1.5 border border-slate-200 rounded-md text-xs"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={plan.applicationStage}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFertilizerPlan((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, applicationStage: val } : item))
                            );
                          }}
                          placeholder="Application Stage"
                          className="w-full p-1.5 border border-slate-200 rounded-md text-xs"
                        />
                      </div>
                      <div className="sm:col-span-3">
                        <input
                          type="text"
                          value={plan.purpose}
                          onChange={(e) => {
                            const val = e.target.value;
                            setFertilizerPlan((prev) =>
                              prev.map((item, i) => (i === idx ? { ...item, purpose: val } : item))
                            );
                          }}
                          placeholder="Agronomic Purpose"
                          className="w-full p-1.5 border border-slate-200 rounded-md text-xs"
                        />
                      </div>
                      <div className="sm:col-span-1 text-center">
                        <button
                          type="button"
                          onClick={() => handleRemoveFertilizerRow(idx)}
                          className="p-1 rounded-md text-red-500 hover:bg-red-50 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recommendations Box */}
              <div>
                <label className="block text-sm font-bold text-slate-900 mb-1.5 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  Expert Agronomist Advice & Soil Regeneration Plan
                </label>
                <textarea
                  rows={4}
                  value={recommendationsText}
                  onChange={(e) => setRecommendationsText(e.target.value)}
                  placeholder="Enter actionable advice for the farmer (one bullet per line)..."
                  className="w-full p-3 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 leading-relaxed focus:ring-2 focus:ring-[#0E4F5A] focus:outline-hidden"
                />
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setPublishingRequest(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={isPublishing}
                  className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold flex items-center gap-2 shadow-sm transition-all cursor-pointer"
                >
                  {isPublishing ? (
                    <>
                      <RefreshCw className="w-4 h-4 animate-spin" />
                      <span>Publishing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Publish & Transmit PDF to Farmer</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 5. View Published Report Modal */}
      {viewingRequest && viewingRequest.labReport && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-white rounded-2xl shadow-2xl border border-slate-200 my-8 overflow-hidden max-h-[90vh] flex flex-col">
            <div className="p-5 border-b border-slate-200 bg-[#0E4F5A] text-white flex items-center justify-between">
              <div>
                <span className="text-[11px] font-mono uppercase text-emerald-300">
                  {viewingRequest.id} • Official Soil Diagnostic Certificate
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Soil Analysis for {viewingRequest.farmerName}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => handleDownloadPdf(viewingRequest)}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download PDF</span>
                </button>
                <button
                  type="button"
                  onClick={() => setViewingRequest(null)}
                  className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-slate-700">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Health Score</p>
                  <p className="text-lg font-bold text-[#0E4F5A]">
                    {viewingRequest.labReport.overallHealthScore}/100
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Soil Texture</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {viewingRequest.labReport.soilTexture}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Target Crop</p>
                  <p className="text-xs font-bold text-emerald-800 mt-1">
                    {viewingRequest.targetCrop}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] text-slate-400 uppercase font-semibold">Report Date</p>
                  <p className="text-xs font-bold text-slate-800 mt-1">
                    {viewingRequest.labReport.reportDate}
                  </p>
                </div>
              </div>

              {/* Parameters */}
              <div>
                <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                  Chemical & Nutrient Parameters
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {viewingRequest.labReport.parameters?.map((p, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg border border-slate-200 bg-white flex items-center justify-between"
                    >
                      <div>
                        <p className="font-semibold text-slate-800">{p.name}</p>
                        <p className="text-[10px] text-slate-400">Optimal: {p.optimalRange}</p>
                      </div>
                      <div className="text-right">
                        <span className="font-mono font-bold text-slate-900">
                          {p.measuredValue} {p.unit}
                        </span>
                        <span
                          className={`block text-[10px] font-bold ${
                            p.status === 'Optimal'
                              ? 'text-emerald-600'
                              : p.status === 'Deficient'
                              ? 'text-red-600'
                              : 'text-amber-600'
                          }`}
                        >
                          {p.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Fertilizer Plan */}
              {viewingRequest.labReport.fertilizerPlan?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-2">
                    Fertilizer Dosage Plan
                  </h4>
                  <div className="space-y-1.5">
                    {viewingRequest.labReport.fertilizerPlan.map((f, idx) => (
                      <div
                        key={idx}
                        className="p-2.5 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]"
                      >
                        <span className="font-bold text-slate-900">{f.fertilizer}</span>
                        <span className="text-emerald-800 font-semibold">{f.dosePerBigha}</span>
                        <span className="text-slate-500">{f.applicationStage}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* AI & Expert Recommendations */}
              {viewingRequest.labReport.aiRecommendations?.length > 0 && (
                <div>
                  <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-1.5">
                    Agronomist Recommendations
                  </h4>
                  <ul className="list-disc list-inside space-y-1 text-slate-600 leading-relaxed text-xs">
                    {viewingRequest.labReport.aiRecommendations.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpertSoilTestsPage;
