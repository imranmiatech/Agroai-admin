import React from 'react';
import { 
  Video, 
  Phone, 
  ChevronRight 
} from 'lucide-react';
import type { ExpertAppointment } from '../expertData';

interface UpcomingAppointmentsCardProps {
  appointments: ExpertAppointment[];
  onViewAll: () => void;
  onJoinMeeting?: (link: string) => void;
}

export const UpcomingAppointmentsCard: React.FC<UpcomingAppointmentsCardProps> = ({
  appointments,
  onViewAll,
  onJoinMeeting,
}) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col justify-between gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Today's Consultation Schedule
            </h2>
            <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800 border border-sky-200">
              {appointments.filter((a) => a.date === 'Today').length} Sessions
            </span>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            Confirmed 1-on-1 virtual sessions with farmers.
          </p>
        </div>

        <button
          type="button"
          onClick={onViewAll}
          className="text-xs sm:text-sm font-semibold text-[#0E4F5A] hover:text-[#062E35] transition-colors cursor-pointer inline-flex items-center gap-1"
        >
          <span>View All</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Appointment Slots */}
      <div className="flex flex-col gap-3">
        {appointments.slice(0, 3).map((apt) => {
          const isVideo = apt.mode === 'Video Call';

          return (
            <div
              key={apt.id}
              className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div
                  className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                    isVideo ? 'bg-sky-100 text-sky-700' : 'bg-emerald-100 text-emerald-700'
                  }`}
                >
                  {isVideo ? <Video className="w-5 h-5" /> : <Phone className="w-5 h-5" />}
                </div>

                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-slate-800">
                      {apt.farmerName}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500">
                      • {apt.crop}
                    </span>
                    <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-white border border-slate-200 text-slate-700">
                      {apt.timeSlot}
                    </span>
                  </div>

                  <p className="text-xs text-slate-600 truncate mt-0.5 font-medium">
                    {apt.topic}
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="shrink-0 self-end sm:self-center">
                {apt.meetingLink ? (
                  <a
                    href={apt.meetingLink}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => {
                      if (onJoinMeeting) {
                        e.preventDefault();
                        onJoinMeeting(apt.meetingLink!);
                      }
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Session</span>
                  </a>
                ) : (
                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 text-slate-700 font-medium text-xs">
                    <Phone className="w-3 h-3 text-slate-500" />
                    <span>{apt.farmerPhone}</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
