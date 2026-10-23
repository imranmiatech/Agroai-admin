import React from "react";
import { useNavigate } from "react-router-dom";
import {
  MessageSquarePlus,
  FlaskConical,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
  RefreshCw,
} from "lucide-react";
import {
  useGetExpertOverviewMetricsQuery,
  useGetExpertRecentConsultationsQuery,
  useGetExpertRecentSoilTestsQuery,
  useAppSelector,
} from "../../redux";

export const ExpertOverview: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const expertName = user?.name || "Dr. Agricultural Specialist";

  // 1. Dedicated Metrics Endpoint (/expert/overview/metrics)
  const {
    data: metrics = {
      totalConsultations: 0,
      waitingConsultations: 0,
      resolvedConsultations: 0,
      totalSoilTests: 0,
      pendingSoilTests: 0,
      completedSoilTests: 0,
    },
    refetch: refetchMetrics,
  } = useGetExpertOverviewMetricsQuery();

  // 2. Dedicated Recent Farmer Consultations (Latest 6 from /expert/overview/recent-consultations)
  const {
    data: recentConsultations = [],
    isLoading: isLoadingConsultations,
    refetch: refetchConsultations,
  } = useGetExpertRecentConsultationsQuery();

  // 3. Dedicated Recent Farmland Soil Test Bookings (Latest 6 from /expert/overview/recent-soil-tests)
  const {
    data: recentSoilTests = [],
    isLoading: isLoadingSoilTests,
    refetch: refetchSoilTests,
  } = useGetExpertRecentSoilTestsQuery();

  const handleRefreshAll = () => {
    refetchMetrics();
    refetchConsultations();
    refetchSoilTests();
  };

  return (
    <div className="w-full font-['Inter'] flex flex-col gap-6 animate-in fade-in duration-200">
      {/* 1. Welcome Banner */}
      <div className="bg-gradient-to-r from-[#062E35] via-[#0A434D] to-[#0E4F5A] rounded-2xl p-6 sm:p-8 text-white shadow-sm border border-emerald-900/40 flex flex-col md:flex-row md:items-center justify-between gap-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Verified Agricultural Specialist
            </span>
            <span className="text-xs text-emerald-200/70 hidden sm:inline">
              | KrishiKunjo AgroAi Network
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
            Welcome back, {expertName}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
            Here is your live summary of incoming farmer crop inquiries and farmland soil laboratory diagnostics. Provide expert prescriptions and publish test certificates.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={handleRefreshAll}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer border border-white/20"
            title="Refresh Overview Data"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Refresh</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("/expert/consultations")}
            className="px-5 py-2.5 rounded-xl bg-[#CBFF54] hover:bg-[#b5f03d] text-[#0E3128] font-bold text-xs sm:text-sm transition-all shadow-md active:scale-95 cursor-pointer whitespace-nowrap"
          >
            Open Live Support Desk
          </button>
        </div>
      </div>

      {/* 2. Top Metric KPI Cards (Driven by Dedicated Metrics API) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Urgent Consultation Inquiries */}
        <div
          onClick={() => navigate("/expert/consultations")}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#0E4F5A] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Farmer Inquiries Pending
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{metrics.waitingConsultations}</span>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                Needs Reply
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Active tickets waiting for expert response
            </p>
          </div>
        </div>

        {/* Card 2: Consultations Resolved */}
        <div
          onClick={() => navigate("/expert/consultations")}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Inquiries Resolved
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{metrics.resolvedConsultations}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Completed
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {metrics.totalConsultations} Total all-time consultations
            </p>
          </div>
        </div>

        {/* Card 3: Soil Samples In Lab */}
        <div
          onClick={() => navigate("/expert/soil-tests")}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-blue-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Soil Tests In Progress
            </span>
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FlaskConical className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{metrics.pendingSoilTests}</span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                In Testing
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Farmland samples being analyzed in lab
            </p>
          </div>
        </div>

        {/* Card 4: Soil Reports Published */}
        <div
          onClick={() => navigate("/expert/soil-tests")}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Soil Reports Published
            </span>
            <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{metrics.completedSoilTests}</span>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                Certified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              {metrics.totalSoilTests} Total soil test bookings
            </p>
          </div>
        </div>
      </div>

      {/* 3. Split Recent Activity Queues (Latest 6 each from dedicated APIs) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Farmer Consultations (Latest 6) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0E4F5A]/10 text-[#0E4F5A] flex items-center justify-center">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Farmer Consultations</h3>
                  <p className="text-[11px] text-slate-400">Latest 6 inquiries from farmers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/expert/consultations")}
                className="text-xs font-semibold text-[#0E4F5A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Support Desk <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {isLoadingConsultations && recentConsultations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading consultations...</div>
            ) : recentConsultations.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No consultation inquiries yet.</div>
            ) : (
              <div className="space-y-2.5">
                {recentConsultations.slice(0, 6).map((ticket: any) => (
                  <div
                    key={ticket.id}
                    onClick={() => navigate("/expert/consultations")}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/60 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-[#0E4F5A] text-[11px]">
                          {ticket.ticketNumber}
                        </span>
                        {ticket.crop && (
                          <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded-md">
                            {ticket.crop}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 font-normal">
                          {ticket.farmerName}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 truncate">
                        {ticket.subject}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        ticket.status === "Resolved"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : ticket.status === "Open"
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {ticket.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/expert/consultations")}
            className="w-full mt-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Open Full Support Desk ({metrics.totalConsultations} Total)
          </button>
        </div>

        {/* Right Column: Recent Farmland Soil Test Bookings (Latest 6) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Farmland Soil Test Bookings</h3>
                  <p className="text-[11px] text-slate-400">Latest 6 soil tests from farmers</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate("/expert/soil-tests")}
                className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Soil Desk <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {isLoadingSoilTests && recentSoilTests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">Loading soil tests...</div>
            ) : recentSoilTests.length === 0 ? (
              <div className="py-8 text-center text-xs text-slate-400">No soil test bookings yet.</div>
            ) : (
              <div className="space-y-2.5">
                {recentSoilTests.slice(0, 6).map((test: any) => (
                  <div
                    key={test.id}
                    onClick={() => navigate("/expert/soil-tests")}
                    className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/60 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono font-bold text-[#0E4F5A] text-[11px]">
                          {test.id}
                        </span>
                        <span className="text-[10px] text-slate-500 font-medium">
                          {test.farmerName} | {test.district}
                        </span>
                      </div>
                      <p className="font-semibold text-slate-800 truncate">
                        {test.targetCrop} ({test.landArea}) - {test.packageName}
                      </p>
                    </div>

                    <span
                      className={`shrink-0 text-[10px] font-bold px-2.5 py-0.5 rounded-full ${
                        test.status === "Completed"
                          ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                          : test.status === "Lab Testing"
                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                          : "bg-amber-100 text-amber-800 border border-amber-300"
                      }`}
                    >
                      {test.status}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={() => navigate("/expert/soil-tests")}
            className="w-full mt-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Open Soil Testing Desk ({metrics.totalSoilTests} Total)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertOverview;