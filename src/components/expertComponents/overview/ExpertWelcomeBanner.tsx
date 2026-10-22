import React from 'react';
import { 
  Sparkles, 
  MessageSquarePlus, 
  Calendar, 
  FileCheck2, 
  Clock 
} from 'lucide-react';
import { useAppSelector } from '../../../redux/store/hooks';

interface ExpertWelcomeBannerProps {
  onlineStatus: 'ONLINE' | 'BUSY' | 'OFFLINE';
  onStatusChange: (status: 'ONLINE' | 'BUSY' | 'OFFLINE') => void;
  onOpenConsultations: () => void;
  onOpenAppointments: () => void;
  onOpenSoilReports: () => void;
}

export const ExpertWelcomeBanner: React.FC<ExpertWelcomeBannerProps> = ({
  onlineStatus,
  onStatusChange,
  onOpenConsultations,
  onOpenAppointments,
  onOpenSoilReports,
}) => {
  const user = useAppSelector((state) => state.auth.user);
  const expertName = user?.name || 'Dr. Tariqul Islam';

  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#062E35] via-[#0A444E] to-[#0E4F5A] p-6 lg:p-8 text-white shadow-xl shadow-[#062E35]/10 border border-white/10">
      {/* Background Decorative Circles */}
      <div className="pointer-events-none absolute -right-16 -top-16 h-72 w-72 rounded-full bg-emerald-500/10 blur-3xl" />
      <div className="pointer-events-none absolute right-40 -bottom-20 h-64 w-64 rounded-full bg-[#CBFF54]/10 blur-2xl" />

      <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left: Expert Greeting & Status */}
        <div className="flex flex-col gap-2 max-w-2xl">
          <div className="flex items-center gap-2.5 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-[#CBFF54] border border-emerald-400/30 backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Certified Agri Expert Portal</span>
            </span>

            {/* Status Switcher */}
            <div className="inline-flex items-center bg-black/25 backdrop-blur-md p-0.5 rounded-full border border-white/10 text-xs">
              <button
                type="button"
                onClick={() => onStatusChange('ONLINE')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium ${
                  onlineStatus === 'ONLINE'
                    ? 'bg-emerald-500 text-white shadow-xs font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
                <span>Available Live</span>
              </button>
              <button
                type="button"
                onClick={() => onStatusChange('BUSY')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium ${
                  onlineStatus === 'BUSY'
                    ? 'bg-amber-500 text-white shadow-xs font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <Clock className="w-3 h-3" />
                <span>In Consultation</span>
              </button>
              <button
                type="button"
                onClick={() => onStatusChange('OFFLINE')}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full transition-all cursor-pointer font-medium ${
                  onlineStatus === 'OFFLINE'
                    ? 'bg-slate-700 text-white shadow-xs font-semibold'
                    : 'text-white/70 hover:text-white'
                }`}
              >
                <span>Offline</span>
              </button>
            </div>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white mt-1">
            Welcome back, {expertName} 👋
          </h1>
          <p className="text-sm sm:text-base text-slate-200/90 leading-relaxed">
            You have <strong className="text-white underline decoration-[#CBFF54]">2 urgent farmer inquiries</strong> awaiting diagnosis and <strong className="text-white underline decoration-[#CBFF54]">3 scheduled video sessions</strong> today.
          </p>
        </div>

        {/* Right: Quick Action Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          <button
            type="button"
            onClick={onOpenConsultations}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#CBFF54] text-[#062E35] font-semibold text-sm shadow-md hover:bg-[#bbf33e] hover:shadow-lg transition-all cursor-pointer active:scale-95"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#062E35]" />
            <span>Answer Inquiries</span>
          </button>

          <button
            type="button"
            onClick={onOpenAppointments}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-md border border-white/15 transition-all cursor-pointer"
          >
            <Calendar className="w-4 h-4 text-emerald-300" />
            <span>Schedule</span>
          </button>

          <button
            type="button"
            onClick={onOpenSoilReports}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium text-sm backdrop-blur-md border border-white/15 transition-all cursor-pointer"
          >
            <FileCheck2 className="w-4 h-4 text-cyan-300" />
            <span>Soil Advisory</span>
          </button>
        </div>
      </div>
    </div>
  );
};
