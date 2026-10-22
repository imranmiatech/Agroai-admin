export interface FarmerInquiry {
  id: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  cropName: string;
  category: 'Crop Disease' | 'Pest Control' | 'Soil Health' | 'Fertilizer Guide' | 'Irrigation';
  urgency: 'URGENT' | 'HIGH' | 'NORMAL';
  title: string;
  description: string;
  imageUrls?: string[];
  status: 'PENDING' | 'IN_PROGRESS' | 'RESOLVED';
  createdAt: string;
  prescription?: {
    diagnosis: string;
    treatment: string;
    fertilizerOrChemical?: string;
    dosage?: string;
    advice: string;
    resolvedAt: string;
  };
}

export interface ExpertAppointment {
  id: string;
  farmerName: string;
  farmerPhone: string;
  farmerLocation: string;
  topic: string;
  crop: string;
  date: string;
  timeSlot: string;
  mode: 'Video Call' | 'Voice Call' | 'Farm Visit';
  meetingLink?: string;
  status: 'UPCOMING' | 'COMPLETED' | 'CANCELLED';
  notes?: string;
}

export interface SoilTestSubmission {
  id: string;
  farmerName: string;
  farmLocation: string;
  cropPlanned: string;
  sampleCollectedDate: string;
  labReportNumber: string;
  parameters: {
    ph: number;
    organicCarbon: string; // e.g. "0.78%"
    nitrogen: string; // e.g. "185 kg/ha (Low)"
    phosphorus: string; // e.g. "24 kg/ha (Medium)"
    potassium: string; // e.g. "310 kg/ha (High)"
    zinc: string; // e.g. "0.8 ppm"
    boron: string; // e.g. "0.4 ppm"
  };
  expertStatus: 'PENDING_REVIEW' | 'ADVISED';
  expertAdvisory?: {
    recommendedCrops: string[];
    fertilizerPlan: string;
    limingOrGypsumRequired: string;
    irrigationAdvice: string;
    reviewedAt: string;
  };
}

export const INITIAL_INQUIRIES: FarmerInquiry[] = [
  {
    id: 'INQ-301',
    farmerName: 'Md. Rafiqul Islam',
    farmerPhone: '+880 1711-209841',
    farmerLocation: 'Mymensingh Sadar, Mymensingh',
    cropName: 'Aman Paddy (BRRI Dhan 49)',
    category: 'Crop Disease',
    urgency: 'URGENT',
    title: 'Severe bacterial leaf blight spreading in 2-acre paddy field',
    description: 'Yellowing and drying of leaves starting from the tips along the margins. Over 30% of leaves are turning grey-white within 4 days after heavy rainfall. Please prescribe immediate chemical or organic measure.',
    imageUrls: [
      'https://images.unsplash.com/photo-1530836369250-ef72a3f5cda8?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'PENDING',
    createdAt: 'Today at 09:15 AM'
  },
  {
    id: 'INQ-302',
    farmerName: 'Abdur Rahim',
    farmerPhone: '+880 1822-456789',
    farmerLocation: 'Natore Sadar, Natore',
    cropName: 'Tomato (Hybrid BARI-8)',
    category: 'Pest Control',
    urgency: 'HIGH',
    title: 'Fruit borer caterpillars boring into green tomatoes',
    description: 'Small holes visible on developing tomatoes with black frass outside. Tried neem spray twice with no result. Need effective insecticide safe for harvest in 2 weeks.',
    imageUrls: [
      'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80'
    ],
    status: 'IN_PROGRESS',
    createdAt: 'Yesterday at 04:30 PM'
  },
  {
    id: 'INQ-303',
    farmerName: 'Farhana Sultana',
    farmerPhone: '+880 1912-887766',
    farmerLocation: 'Sreemangal, Moulvibazar',
    cropName: 'Pineapple (Honey Queen)',
    category: 'Soil Health',
    urgency: 'NORMAL',
    title: 'Stunted plant growth and purple-red leaves in red hill soil',
    description: 'Plants are 6 months old but growing very slowly. Leaf edges are curling and showing purple reddish tint. Is this phosphorus deficiency or soil acidity?',
    status: 'PENDING',
    createdAt: 'Yesterday at 11:20 AM'
  },
  {
    id: 'INQ-304',
    farmerName: 'Kawsar Ahmed',
    farmerPhone: '+880 1610-334455',
    farmerLocation: 'Cumilla, Chandina',
    cropName: 'Potato (Diamond)',
    category: 'Fertilizer Guide',
    urgency: 'NORMAL',
    title: 'Optimal booster fertilizer dosing for 45-day potato tubers',
    description: 'Applied basal DAP and MoP during sowing. Tubers are now marble-sized. Should I top-dress with Urea and SOP or foliar spray micronutrients?',
    status: 'RESOLVED',
    createdAt: 'Oct 20, 2026',
    prescription: {
      diagnosis: 'Tuber bulking stage nutrient requirement',
      treatment: 'Apply balanced potassium booster with boron spray',
      fertilizerOrChemical: 'SOP (Sulphate of Potash) 25kg/acre + Solubor Boron 2g/L water',
      dosage: 'Top-dress SOP with light earthing up and follow with light irrigation.',
      advice: 'Avoid excess Urea at this stage as it causes vegetative vine elongation and hollow tuber hearts.',
      resolvedAt: 'Oct 21, 2026'
    }
  }
];

export const INITIAL_APPOINTMENTS: ExpertAppointment[] = [
  {
    id: 'APT-101',
    farmerName: 'Shahidul Alam',
    farmerPhone: '+880 1715-442211',
    farmerLocation: 'Bogra, Shibganj',
    topic: 'Chili leaf curl virus management & thrips prevention',
    crop: 'Green Chili',
    date: 'Today',
    timeSlot: '03:30 PM - 04:00 PM',
    mode: 'Video Call',
    meetingLink: 'https://meet.google.com/krishi-expert-live',
    status: 'UPCOMING',
    notes: 'Farmer prepared 3 close-up plant samples for screen inspection.'
  },
  {
    id: 'APT-102',
    farmerName: 'Anowar Hossain',
    farmerPhone: '+880 1819-998877',
    farmerLocation: 'Jessore, Jhikargacha',
    topic: 'Floriculture greenhouse temperature & drip fertigation',
    crop: 'Gerbera & Rose',
    date: 'Today',
    timeSlot: '05:00 PM - 05:30 PM',
    mode: 'Voice Call',
    status: 'UPCOMING'
  },
  {
    id: 'APT-103',
    farmerName: 'Abdul Malek',
    farmerPhone: '+880 1733-112233',
    farmerLocation: 'Rangpur, Mithapukur',
    topic: 'Maize fall armyworm integrated management review',
    crop: 'Hybrid Maize',
    date: 'Tomorrow',
    timeSlot: '11:00 AM - 11:30 AM',
    mode: 'Video Call',
    meetingLink: 'https://meet.google.com/krishi-expert-live',
    status: 'UPCOMING'
  }
];

export const INITIAL_SOIL_REPORTS: SoilTestSubmission[] = [
  {
    id: 'SOIL-801',
    farmerName: 'Monirul Haq',
    farmLocation: 'Dinajpur Sadar, Dinajpur',
    cropPlanned: 'Wheat & Mustard Relay',
    sampleCollectedDate: 'Oct 18, 2026',
    labReportNumber: 'SRDI-DNJ-2026-8812',
    parameters: {
      ph: 5.4,
      organicCarbon: '0.62% (Low)',
      nitrogen: '142 kg/ha (Deficient)',
      phosphorus: '18 kg/ha (Medium)',
      potassium: '240 kg/ha (Adequate)',
      zinc: '0.65 ppm (Low)',
      boron: '0.32 ppm (Deficient)'
    },
    expertStatus: 'PENDING_REVIEW'
  },
  {
    id: 'SOIL-802',
    farmerName: 'Subhas Chandra Das',
    farmLocation: 'Kushtia, Mirpur',
    cropPlanned: 'High-Value Vegetables (Cabbage & Cauliflower)',
    sampleCollectedDate: 'Oct 15, 2026',
    labReportNumber: 'SRDI-KSH-2026-4409',
    parameters: {
      ph: 7.2,
      organicCarbon: '1.45% (Optimum)',
      nitrogen: '260 kg/ha (Good)',
      phosphorus: '38 kg/ha (High)',
      potassium: '290 kg/ha (Good)',
      zinc: '1.2 ppm (Sufficient)',
      boron: '0.7 ppm (Sufficient)'
    },
    expertStatus: 'ADVISED',
    expertAdvisory: {
      recommendedCrops: ['Cauliflower', 'Broccoli', 'Bell Pepper'],
      fertilizerPlan: 'Apply 50 kg Vermicompost + 15 kg Urea in 3 split doses per decimal. Phosphorus is already rich in soil, so avoid basal TSP.',
      limingOrGypsumRequired: 'Soil pH is well-balanced at 7.2. No lime or gypsum required.',
      irrigationAdvice: 'Maintain light soil moisture with furrow or drip method; avoid water stagnation.',
      reviewedAt: 'Oct 17, 2026'
    }
  }
];
