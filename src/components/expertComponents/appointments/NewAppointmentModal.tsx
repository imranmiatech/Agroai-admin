import React, { useState } from 'react';
import { X, Calendar } from 'lucide-react';
import type { ExpertAppointment } from '../expertData';

interface NewAppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddAppointment: (appointment: Omit<ExpertAppointment, 'id' | 'status'>) => void;
}

export const NewAppointmentModal: React.FC<NewAppointmentModalProps> = ({
  isOpen,
  onClose,
  onAddAppointment,
}) => {
  if (!isOpen) return null;

  const [farmerName, setFarmerName] = useState('');
  const [farmerPhone, setFarmerPhone] = useState('');
  const [farmerLocation, setFarmerLocation] = useState('');
  const [topic, setTopic] = useState('');
  const [crop, setCrop] = useState('');
  const [date, setDate] = useState('Today');
  const [timeSlot, setTimeSlot] = useState('04:00 PM - 04:30 PM');
  const [mode, setMode] = useState<'Video Call' | 'Voice Call' | 'Farm Visit'>('Video Call');
  const [meetingLink, setMeetingLink] = useState('https://meet.google.com/krishi-expert-live');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!farmerName.trim() || !farmerPhone.trim() || !topic.trim()) {
      setError('Please fill out farmer name, contact, and discussion topic.');
      return;
    }

    onAddAppointment({
      farmerName: farmerName.trim(),
      farmerPhone: farmerPhone.trim(),
      farmerLocation: farmerLocation.trim() || 'Bangladesh',
      topic: topic.trim(),
      crop: crop.trim() || 'Paddy / General Crops',
      date,
      timeSlot,
      mode,
      meetingLink: mode === 'Video Call' ? meetingLink : undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="relative w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-slate-200">
        {/* Header */}
        <div className="px-6 py-4 bg-[#062E35] text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#CBFF54]" />
            <h2 className="text-base sm:text-lg font-bold">
              Schedule Farmer Consultation
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white/70 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 flex flex-col gap-4 text-xs sm:text-sm">
          {error && (
            <div className="p-2.5 rounded-lg bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Farmer Full Name <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={farmerName}
              onChange={(e) => setFarmerName(e.target.value)}
              placeholder="e.g. Md. Shamsul Haque"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4F5A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Phone Number <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={farmerPhone}
                onChange={(e) => setFarmerPhone(e.target.value)}
                placeholder="+880 17..."
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4F5A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Location / District
              </label>
              <input
                type="text"
                value={farmerLocation}
                onChange={(e) => setFarmerLocation(e.target.value)}
                placeholder="e.g. Bogra Sadar"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4F5A]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Crop Type
              </label>
              <input
                type="text"
                value={crop}
                onChange={(e) => setCrop(e.target.value)}
                placeholder="e.g. Mustard / Potato"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4F5A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Session Mode
              </label>
              <select
                value={mode}
                onChange={(e) => setMode(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4F5A] bg-white cursor-pointer"
              >
                <option value="Video Call">Video Call</option>
                <option value="Voice Call">Voice Call</option>
                <option value="Farm Visit">Farm Visit</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Discussion Topic / Case Title <span className="text-rose-500">*</span>
            </label>
            <input
              type="text"
              required
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g. Late blight protection and fertilizer schedule"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4F5A]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="text"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                placeholder="Today / Tomorrow / Oct 24, 2026"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4F5A]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Time Slot
              </label>
              <input
                type="text"
                value={timeSlot}
                onChange={(e) => setTimeSlot(e.target.value)}
                placeholder="03:00 PM - 03:30 PM"
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4F5A]"
              />
            </div>
          </div>

          {mode === 'Video Call' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Meeting Link (Google Meet / Zoom)
              </label>
              <input
                type="text"
                value={meetingLink}
                onChange={(e) => setMeetingLink(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4F5A]"
              />
            </div>
          )}

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Preparation Notes (Optional)
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ask farmer to keep leaf samples ready..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:border-[#0E4F5A]"
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-900 font-semibold cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-[#0E4F5A] hover:bg-[#062E35] text-white font-semibold shadow-md transition-all cursor-pointer"
            >
              Confirm Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
