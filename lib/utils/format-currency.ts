const TR = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatTL(value: number, opts: { sign?: boolean } = {}): string {
  if (!Number.isFinite(value)) return "—";
  const formatted = TR.format(Math.abs(value));
  const prefix = opts.sign && value > 0 ? "+" : value < 0 ? "−" : "";
  return `${prefix}${formatted} ₺`;
}

export function parseTLInput(s: string): number {
  if (!s) return 0;
  const cleaned = s.replace(/\s/g, "").replace(/\./g, "").replace(",", ".");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}
