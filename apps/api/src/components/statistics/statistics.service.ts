import { Injectable, Logger } from "@nestjs/common";
import { HttpService } from "@nestjs/axios";
import { ConfigService } from "@nestjs/config";
import { firstValueFrom } from "rxjs";
import type { AxiosResponse } from "axios";
import type {
  MedicalStatisticsRow,
  PaginatedStatistics,
} from "@tilda/shared";
import { generateMockStatistics } from "./statistics.mock";

type UpstreamItem = Record<string, string | number | null | undefined>;

type OdCloudPayload = {
  currentCount?: number;
  data?: UpstreamItem[];
  matchCount?: number;
  page?: number;
  perPage?: number;
  totalCount?: number;
};

type CacheEntry = {
  expiresAt: number;
  value: PaginatedStatistics;
};

const CACHE_TTL_MS = 60_000;
const DEFAULT_BASE = "https://api.odcloud.kr/api";
const DEFAULT_DATASET =
  "/15139382/v1/uddi:638707af-cc4b-48e5-9ff8-938aae8b637a";

@Injectable()
export class StatisticsService {
  private readonly logger = new Logger(StatisticsService.name);
  private readonly cache = new Map<string, CacheEntry>();

  constructor(
    private readonly http: HttpService,
    private readonly cfg: ConfigService
  ) {}

  async list(page: number, perPage: number): Promise<PaginatedStatistics> {
    const key = `${page}:${perPage}`;
    const now = Date.now();
    const hit = this.cache.get(key);
    if (hit && hit.expiresAt > now) return hit.value;

    const value = await this.fetchUpstreamOrFallback(page, perPage);
    this.cache.set(key, { expiresAt: now + CACHE_TTL_MS, value });
    return value;
  }

  private async fetchUpstreamOrFallback(
    page: number,
    perPage: number
  ): Promise<PaginatedStatistics> {
    const apiKey = this.cfg.get<string>("DATA_GO_KR_API_KEY");
    const baseUrl =
      this.cfg.get<string>("DATA_GO_KR_BASE_URL") ?? DEFAULT_BASE;
    const datasetPath =
      this.cfg.get<string>("DATA_GO_KR_DATASET_PATH") ?? DEFAULT_DATASET;

    if (!apiKey || apiKey === "YOUR_DATA_GO_KR_KEY_HERE") {
      this.logger.warn(
        "DATA_GO_KR_API_KEY not set — serving deterministic mock data."
      );
      return this.mock(page, perPage);
    }

    const url = `${baseUrl}${datasetPath}`;
    try {
      const res: AxiosResponse<OdCloudPayload> = await firstValueFrom(
        this.http.get<OdCloudPayload>(url, {
          params: { page, perPage, serviceKey: apiKey, returnType: "JSON" },
        })
      );
      return this.shapeUpstream(res.data, page, perPage);
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      this.logger.error(`data.go.kr fetch failed (${msg}) — falling back to mock`);
      return this.mock(page, perPage);
    }
  }

  private shapeUpstream(
    payload: OdCloudPayload,
    page: number,
    perPage: number
  ): PaginatedStatistics {
    const items = payload.data ?? [];

    const data: MedicalStatisticsRow[] = items.map((it) => ({
      treatmentYear: toNumber(it["진료년도"]),
      institutionType: toString(it["의료기관종별"]),
      departmentName: toString(it["진료과목(표시과목)"]),
      claimCount: toNumber(it["명세서청구건수"]),
      insurerBurden: toNumber(it["보험자부담금(선별포함)"]),
      totalBenefitCost: toNumber(it["요양급여비용총액(선별포함)"]),
      patientCount: toNumber(it["환자수"]),
      visitDays: toNumber(it["입내원일수"]),
    }));

    return {
      page: payload.page ?? page,
      perPage: payload.perPage ?? perPage,
      totalCount: payload.totalCount ?? data.length,
      data,
    };
  }

  private mock(page: number, perPage: number): PaginatedStatistics {
    return generateMockStatistics(page, perPage);
  }
}

function toNumber(v: unknown, fallback = 0): number {
  if (v === null || v === undefined || v === "") return fallback;
  const n = typeof v === "number" ? v : Number(String(v).replace(/,/g, ""));
  return Number.isFinite(n) ? n : fallback;
}

function toString(v: unknown, fallback = ""): string {
  if (v === null || v === undefined) return fallback;
  return String(v);
}
