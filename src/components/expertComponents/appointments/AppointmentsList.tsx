import React from 'react';
import { 
  Calendar, 
  Video, 
  Phone, 
  MapPin, 
  CheckCircle2, 
  Plus, 
  User 
} from 'lucide-react';
import type { ExpertAppointment } from '../expertData';

interface AppointmentsListProps {
  appointments: ExpertAppointment[];
  onOpenNewAppointment: () => void;
  onJoinMeeting?: (link: string) => void;
  onMarkComplete?: (id: string) => void;
}

export const AppointmentsList: React.FC<AppointmentsListProps> = ({
  appointments,
  onOpenNewAppointment,
  onJoinMeeting,
  onMarkComplete,
}) => {
  return (
    <div className="flex flex-col gap-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
            Farmer Consultation Schedule
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Manage booked 1-on-1 audio/video consultation sessions with farmers across regions.
          </p>
        </div>

        <button
          type="button"
          onClick={onOpenNewAppointment}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0E4F5A] hover:bg-[#062E35] text-white font-semibold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Schedule New Session</span>
        </button>
      </div>

      {/* Grid of Appointments */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {appointments.map((apt) => {
          const isVideo = apt.mode === 'Video Call';
          const isUpcoming = apt.status === 'UPCOMING';

          return (
            <div
              key={apt.id}
              className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs hover:shadow-md transition-all flex flex-col justify-between gap-4"
            >
              {/* Top Row: Date Badge & Mode */}
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-200/60">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span>{apt.date} • {apt.timeSlot}</span>
                </span>

                <span
                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                    isVideo ? 'bg-sky-100 text-sky-800' : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {isVideo ? <Video className="w-3 h-3" /> : <Phone className="w-3 h-3" />}
                  <span>{apt.mode}</span>
                </span>
              </div>

              {/* Topic & Farmer Info */}
              <div>
                <h3 className="text-base font-bold text-slate-900 leading-snug">
                  {apt.topic}
                </h3>
                <span className="inline-block mt-1 text-xs font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                  Crop: {apt.crop}
                </span>

                <div className="mt-3.5 pt-3 border-t border-slate-100 flex flex-col gap-1.5 text-xs text-slate-600">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-slate-400" />
                    <span className="font-semibold text-slate-800">{apt.farmerName}</span>
                    <span className="text-slate-400">({apt.farmerPhone})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{apt.farmerLocation}</span>
                  </div>
                  {apt.notes && (
                    <div className="mt-2 p-2 rounded-lg bg-slate-50 border border-slate-200/60 text-slate-600 italic">
                      "{apt.notes}"
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 border-t border-slate-100 flex items-center justify-between gap-2">
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
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Video className="w-3.5 h-3.5" />
                    <span>Join Video Call</span>
                  </a>
                ) : (
                  <a
                    href={`tel:${apt.farmerPhone}`}
                    className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-[#0E4F5A] hover:bg-[#062E35] text-white font-semibold text-xs shadow-xs transition-colors cursor-pointer"
                  >
                    <Phone className="w-3.5 h-3.5" />
                    <span>Call Farmer</span>
                  </a>
                )}

                {isUpcoming && onMarkComplete && (
                  <button
                    type="button"
                    onClick={() => onMarkComplete(apt.id)}
                    className="px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors cursor-pointer"
                    title="Mark consultation completed"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
