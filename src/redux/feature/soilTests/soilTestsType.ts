export type SoilTestStatus = 'Pending Pickup' | 'Sample Collected' | 'Lab Testing' | 'Completed';

export interface SoilParameter {
  name: string;
  unit: string;
  measuredValue: number | string;
  optimalRange: string;
  status: 'Optimal' | 'Moderate' | 'Deficient' | 'Excess';
}

export interface FertilizerDose {
  fertilizer: string;
  dosePerBigha: string;
  applicationStage: string;
  purpose: string;
}

export interface SoilLabReport {
  sampleId: string;
  reportDate: string;
  soilTexture: string;
  labTechnician: string;
  accreditation?: string;
  overallHealthScore: number;
  parameters: SoilParameter[];
  fertilizerPlan: FertilizerDose[];
  aiRecommendations: string[];
}

export interface SoilTestRequest {
  id: string;
  farmerName: string;
  phone: string;
  email?: string;
  district: string;
  upazila: string;
  villagePlot: string;
  landArea: string;
  targetCrop: string;
  packageId: string;
  packageName: string;
  amount: number;
  pickupMethod: string;
  paymentMethod: string;
  transactionId?: string;
  paymentStatus: 'Paid' | 'Pending Payment';
  status: SoilTestStatus;
  requestDate: string;
  completedDate?: string;
  labReport?: SoilLabReport;
}

export interface PublishReportDto {
  id: string;
  overallHealthScore: number;
  soilTexture: string;
  labTechnician?: string;
  accreditation?: string;
  parameters: SoilParameter[];
  fertilizerPlan: FertilizerDose[];
  aiRecommendations: string[];
}
