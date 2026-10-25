export type ConsultationStatus = 'Waiting for Reply' | 'Open' | 'Resolved';

export interface ConsultationMessage {
  id: string;
  sender: 'user' | 'expert';
  senderName: string;
  senderRole?: string;
  senderAvatar?: string;
  text: string;
  timestamp: string;
  attachments?: string[];
}

export interface ConsultationRating {
  stars: number;
  comment?: string;
  ratedAt: string;
}

export interface ConsultationTicket {
  id: string;
  ticketNumber: string;
  subject: string;
  category: string;
  crop?: string;
  priority: 'Normal' | 'High' | 'Urgent';
  status: ConsultationStatus;
  createdAt: string;
  updatedAt: string;
  assignedExpert?: {
    name: string;
    role: string;
    avatar?: string;
    rating?: number;
    specialization?: string;
  };
  messages: ConsultationMessage[];
  rating?: ConsultationRating;
}

export interface SendMessageDto {
  ticketId: string;
  sender: 'user' | 'expert';
  senderName: string;
  senderRole?: string;
  senderAvatar?: string;
  text: string;
  attachments?: string[];
  status?: ConsultationStatus;
  markResolved?: boolean;
}

export interface ConsultationStats {
  totalTickets: number;
  waitingTickets: number;
  openTickets: number;
  resolvedTickets: number;
}

