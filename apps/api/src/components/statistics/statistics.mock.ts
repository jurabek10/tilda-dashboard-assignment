import type { PaginatedStatistics, MedicalStatisticsRow } from "@tilda/shared";
import { MEDICAL_INSTITUTION_TYPES } from "@tilda/shared";

const DEPARTMENTS = [
  "내과",
  "외과",
  "정형외과",
  "신경외과",
  "산부인과",
  "소아청소년과",
  "안과",
  "이비인후과",
  "피부과",
  "비뇨의학과",
  "정신건강의학과",
  "재활의학과",
  "영상의학과",
  "마취통증의학과",
  "가정의학과",
  "응급의학과",
  "치과",
  "한방내과",
  "한방재활의학과",
  "일반의",
];

const YEARS = [2020, 2021, 2022, 2023];

const TOTAL_ROWS =
  MEDICAL_INSTITUTION_TYPES.length * DEPARTMENTS.length * YEARS.length;

// deterministic pseudo-random using a simple LCG seeded from index
function deterministicValue(seed: number, scale: number, base: number): number {
  const x = Math.sin(seed) * 10_000;
  const frac = x - Math.floor(x);
  return Math.round(base + frac * scale);
}

function buildRow(idx: number): MedicalStatisticsRow {
  const inst =
    MEDICAL_INSTITUTION_TYPES[idx % MEDICAL_INSTITUTION_TYPES.length];
  const dept =
    DEPARTMENTS[
      Math.floor(idx / MEDICAL_INSTITUTION_TYPES.length) % DEPARTMENTS.length
    ];
  const year =
    YEARS[
      Math.floor(idx / (MEDICAL_INSTITUTION_TYPES.length * DEPARTMENTS.length)) %
        YEARS.length
    ];
  const seed = idx + 1;
  const patientCount = deterministicValue(seed, 90_000, 1_000);
  const visitDays = deterministicValue(seed * 2.13, 250_000, 5_000);
  const claimCount = deterministicValue(seed * 3.7, 30_000, 200);
  const insurerBurden = deterministicValue(seed * 5.5, 800_000_000, 1_000_000);
  const totalBenefitCost = insurerBurden + deterministicValue(seed * 7.1, 200_000_000, 200_000);
  return {
    treatmentYear: year,
    institutionType: inst,
    departmentName: dept,
    claimCount,
    insurerBurden,
    totalBenefitCost,
    patientCount,
    visitDays,
  };
}

export function generateMockStatistics(
  page: number,
  perPage: number
): PaginatedStatistics {
  const start = (page - 1) * perPage;
  const end = Math.min(start + perPage, TOTAL_ROWS);
  const data: MedicalStatisticsRow[] = [];
  for (let i = start; i < end; i++) {
    data.push(buildRow(i));
  }
  return {
    page,
    perPage,
    totalCount: TOTAL_ROWS,
    data,
  };
}
