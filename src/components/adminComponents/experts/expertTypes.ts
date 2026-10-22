export interface ExpertItem {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'EXPERT' | string;
  specialization: string;
  designation?: string;
  experienceYears?: number | string;
  bio?: string;
  avatar?: string;
  status: 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
  isAvailableForSupport?: boolean;
  assignedTicketsCount?: number;
  rating?: number;
  createdAt: string;
}

export interface CreateExpertPayload {
  name: string;
  email: string;
  password?: string;
  phone?: string;
  specialization: string;
  designation: string;
  experienceYears?: number | string;
  bio?: string;
  avatar?: string;
  status?: 'ACTIVE' | 'INACTIVE';
}

export const EXPERT_SPECIALIZATIONS = [
  'Crop Disease & Pest Management',
  'Soil Chemistry & Fertilizer',
  'Livestock, Dairy & Poultry',
  'Organic Farming & Composting',
  'Precision Irrigation & Water Tech',
  'Seed Quality & Germination',
  'AgriTech, IoT & Sensors',
  'Fisheries & Aquaculture',
  'Horticulture & Greenhouse',
] as const;
