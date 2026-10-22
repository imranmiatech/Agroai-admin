import React, { useState } from 'react';
import { AppointmentsList } from '../../components/expertComponents/appointments/AppointmentsList';
import { NewAppointmentModal } from '../../components/expertComponents/appointments/NewAppointmentModal';
import { 
  INITIAL_APPOINTMENTS, 
  type ExpertAppointment 
} from '../../components/expertComponents/expertData';

export const ExpertAppointments: React.FC = () => {
  const [appointments, setAppointments] = useState<ExpertAppointment[]>(INITIAL_APPOINTMENTS);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  const handleAddAppointment = (data: Omit<ExpertAppointment, 'id' | 'status'>) => {
    const newApt: ExpertAppointment = {
      ...data,
      id: `APT-${Math.floor(100 + Math.random() * 900)}`,
      status: 'UPCOMING',
    };
    setAppointments([newApt, ...appointments]);
  };

  const handleMarkComplete = (id: string) => {
    setAppointments((prev) =>
      prev.map((apt) =>
        apt.id === id ? { ...apt, status: 'COMPLETED' } : apt
      )
    );
  };

  return (
    <div className="flex flex-col gap-6 font-['Inter'] animate-in fade-in duration-200">
      <AppointmentsList
        appointments={appointments}
        onOpenNewAppointment={() => setIsNewModalOpen(true)}
        onJoinMeeting={(link) => window.open(link, '_blank')}
        onMarkComplete={handleMarkComplete}
      />

      <NewAppointmentModal
        isOpen={isNewModalOpen}
        onClose={() => setIsNewModalOpen(false)}
        onAddAppointment={handleAddAppointment}
      />
    </div>
  );
};

export default ExpertAppointments;
