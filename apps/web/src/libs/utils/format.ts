const KO_NUMBER = new Intl.NumberFormat("ko-KR");

export function formatNumberKR(value: number | null | undefined): string {
  if (value == null || !Number.isFinite(value)) return "-";
  return KO_NUMBER.format(value);
}
