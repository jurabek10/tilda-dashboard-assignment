export type MedicalStatisticsRow = {
  treatmentYear: number;
  institutionType: string;
  departmentName: string;
  claimCount: number;
  insurerBurden: number;
  totalBenefitCost: number;
  patientCount: number;
  visitDays: number;
};

export type PaginatedStatistics = {
  page: number;
  perPage: number;
  totalCount: number;
  data: MedicalStatisticsRow[];
};
