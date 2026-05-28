export const MEDICAL_INSTITUTION_TYPES = [
  "상급종합병원",
  "종합병원",
  "병원",
  "요양병원",
  "정신병원",
  "의원",
  "치과병원",
  "치과의원",
  "조산원",
  "보건소",
  "보건지소",
  "보건진료소",
  "보건의료원",
  "한방병원",
  "한의원",
] as const;

export type MedicalInstitutionType = (typeof MEDICAL_INSTITUTION_TYPES)[number];
