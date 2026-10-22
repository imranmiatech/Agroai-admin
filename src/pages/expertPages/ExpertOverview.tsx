import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  MessageSquarePlus,
  FlaskConical,
  CheckCircle2,
  ArrowRight,
  TrendingUp,
  ShieldCheck,
} from 'lucide-react';
import {
  useGetConsultationsQuery,
  useGetSoilTestsQuery,
  useAppSelector,
} from '../../redux';

export const ExpertOverview: React.FC = () => {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const expertName = user?.name || 'Dr. Agricultural Specialist';

  // 1. Live Consultations
  const { data: consultations = [] } = useGetConsultationsQuery(undefined, {
    pollingInterval: 5000,
  });

  // 2. Live Soil Tests
  const { data: soilTests = [] } = useGetSoilTestsQuery(undefined, {
    pollingInterval: 5000,
  });

  // Consultation stats
  const waitingConsultations = consultations.filter((c) => c.status === 'Waiting for Reply').length;
  const resolvedConsultations = consultations.filter((c) => c.status === 'Resolved').length;

  // Soil test stats
  const pendingSoilTests = soilTests.filter((s) => s.status !== 'Completed').length;
  const completedSoilTests = soilTests.filter((s) => s.status === 'Completed').length;

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
              • KrishiKunjo AgroAi Network
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-2">
            Welcome back, {expertName}
          </h1>

          <p className="text-xs sm:text-sm text-emerald-100/80 mt-1 max-w-2xl leading-relaxed">
            Here is your live summary of incoming farmer crop inquiries and farmland soil laboratory diagnostics. Provide expert prescriptions and publish test certificates.
          </p>
        </div>

        {/* Quick Action Navigation */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            type="button"
            onClick={() => navigate('/expert/consultations')}
            className="px-4 py-2.5 rounded-xl bg-white text-[#0E4F5A] hover:bg-emerald-50 text-xs font-bold flex items-center gap-2 shadow-xs transition-all cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4" />
            <span>Farmer Support Desk</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => navigate('/expert/soil-tests')}
            className="px-4 py-2.5 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-400/40 text-emerald-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
          >
            <FlaskConical className="w-4 h-4 text-emerald-300" />
            <span>Soil Test Support</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* 2. Key Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Farmer Inquiries Awaiting Reply */}
        <div 
          onClick={() => navigate('/expert/consultations')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-[#0E4F5A] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Farmer Inquiries
            </span>
            <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <MessageSquarePlus className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{waitingConsultations}</span>
              <span className="text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-0.5 rounded-md">
                Needs Advice
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Total {consultations.length} inquiries in queue
            </p>
          </div>
        </div>

        {/* Card 2: Consultations Resolved */}
        <div 
          onClick={() => navigate('/expert/consultations')}
          className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs hover:border-emerald-600 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Prescriptions Dispensed
            </span>
            <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{resolvedConsultations}</span>
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md">
                Resolved
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Farmers assisted with crop protection
            </p>
          </div>
        </div>

        {/* Card 3: Soil Tests Pending Lab Work */}
        <div 
          onClick={() => navigate('/expert/soil-tests')}
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
              <span className="text-2xl font-bold text-slate-900">{pendingSoilTests}</span>
              <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-0.5 rounded-md">
                In Testing
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Farmland samples being analyzed
            </p>
          </div>
        </div>

        {/* Card 4: Soil Reports Published */}
        <div 
          onClick={() => navigate('/expert/soil-tests')}
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
              <span className="text-2xl font-bold text-slate-900">{completedSoilTests}</span>
              <span className="text-xs font-semibold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md">
                Certified
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Downloadable PDFs delivered to farmers
            </p>
          </div>
        </div>
      </div>

      {/* 3. Split Recent Activity Queues */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Recent Farmer Support Tickets */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-[#0E4F5A]/10 text-[#0E4F5A] flex items-center justify-center">
                  <MessageSquarePlus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Recent Farmer Consultations</h3>
                  <p className="text-[11px] text-slate-400">Crop diseases & pest emergencies</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/expert/consultations')}
                className="text-xs font-semibold text-[#0E4F5A] hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Support Desk <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {consultations.slice(0, 4).map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => navigate('/expert/consultations')}
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
                    </div>
                    <p className="font-semibold text-slate-800 truncate">
                      {ticket.subject}
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      ticket.status === 'Resolved'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {ticket.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/expert/consultations')}
            className="w-full mt-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Open Full Support Desk ({consultations.length} Total)
          </button>
        </div>

        {/* Right Column: Recent Soil Diagnostic Bookings */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">Farmland Soil Test Bookings</h3>
                  <p className="text-[11px] text-slate-400">Doorstep sample pickup & lab diagnostic</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => navigate('/expert/soil-tests')}
                className="text-xs font-semibold text-blue-700 hover:underline flex items-center gap-1 cursor-pointer"
              >
                View Soil Desk <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {soilTests.slice(0, 4).map((test) => (
                <div
                  key={test.id}
                  onClick={() => navigate('/expert/soil-tests')}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-300 hover:bg-slate-50/60 transition-all cursor-pointer flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-mono font-bold text-[#0E4F5A] text-[11px]">
                        {test.id}
                      </span>
                      <span className="text-[10px] text-slate-500 font-medium">
                        {test.farmerName} • {test.district}
                      </span>
                    </div>
                    <p className="font-semibold text-slate-800 truncate">
                      {test.targetCrop} ({test.landArea})
                    </p>
                  </div>

                  <span
                    className={`shrink-0 text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      test.status === 'Completed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : test.status === 'Lab Testing'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {test.status}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/expert/soil-tests')}
            className="w-full mt-4 py-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer text-center"
          >
            Open Soil Testing Desk ({soilTests.length} Total)
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExpertOverview;
