import type { TitleValue } from "@/lib/constants/titles";
import type { ExamRoleValue } from "@/lib/constants/exam-roles";

export type EducationLevel = "lisans" | "yuksek-lisans" | "doktora";
export type IncomeTaxRate = "15" | "20" | "27" | "35" | "auto";
export type PeriodKey = string;

export interface RatesData {
  scrapedAt: string;
  source: string;
  periods: Record<PeriodKey, { id: number; label: string }>;
  incomeTaxExemption: Record<PeriodKey, number>;
  stampTaxExemption: Record<PeriodKey, number>;
  stampTaxRate: number;
  rates: Record<
    PeriodKey,
    Record<
      TitleValue,
      Record<EducationLevel, Record<string, number | null>>
    >
  >;
  examFees: Record<PeriodKey, Record<string, number | null>>;
}

export interface HoursInput {
  gunduz: number;
  gece: number;
  nobet: number;
  belleticilik: number;
  sinav: number;
  egzersiz: number;
  hizmetici: number;
  // Özel eğitim (%25 fazla)
  oegGunduz: number;
  oegGece: number;
  oegNobet: number;
  oegBelleticilik: number;
  // Takviye kursu
  tkGunduz: number;
  tkGece: number;
  // İYEP
  iyepGunduz: number;
  iyepGece: number;
}

export const ZERO_HOURS: HoursInput = {
  gunduz: 0, gece: 0, nobet: 0, belleticilik: 0,
  sinav: 0, egzersiz: 0, hizmetici: 0,
  oegGunduz: 0, oegGece: 0, oegNobet: 0, oegBelleticilik: 0,
  tkGunduz: 0, tkGece: 0,
  iyepGunduz: 0, iyepGece: 0,
};

export interface CalculationInput {
  budgetPeriod: PeriodKey;
  title: TitleValue;
  educationLevel: EducationLevel;
  exemptions: { incomeTaxUsed: number; stampTaxUsed: number };
  hours: HoursInput;
  examDuties: ExamRoleValue[];
  incomeTaxRate: IncomeTaxRate;
}

export interface CalculationResult {
  grossAmount: number;
  taxableBase: number;
  incomeTax: number;
  stampTax: number;
  netAmount: number;
  appliedIncomeTaxRate: number;
  remainingIncomeTaxExemption: number;
  remainingStampTaxExemption: number;
  breakdown: {
    label: string;
    hours?: number;
    rate?: number;
    amount: number;
  }[];
  warnings: string[];
}

const HOUR_TO_RATE_KEY: Record<keyof HoursInput, string> = {
  gunduz: "gunduz", gece: "gece", nobet: "nobet",
  belleticilik: "belleticilik", sinav: "sinav",
  egzersiz: "egzersiz", hizmetici: "hizmetici",
  tkGunduz: "tk-gunduz", tkGece: "tk-gece",
  iyepGunduz: "iyep-gunduz", iyepGece: "iyep-gece",
  oegGunduz: "oeg-gunduz", oegGece: "oeg-gece",
  oegNobet: "oeg-nobet", oegBelleticilik: "oeg-belleticilik",
};

const HOUR_LABELS: Record<keyof HoursInput, string> = {
  gunduz: "Gündüz", gece: "Gece", nobet: "Nöbet Görevi",
  belleticilik: "Belleticilik", sinav: "Sınav Görevi",
  egzersiz: "Egzersiz", hizmetici: "Hizmet İçi Eğitim",
  tkGunduz: "Takviye Kursu (Gündüz)", tkGece: "Takviye Kursu (Gece)",
  iyepGunduz: "İYEP (Gündüz)", iyepGece: "İYEP (Gece)",
  oegGunduz: "Özel Eğitim %25 Fazla (Gündüz)",
  oegGece: "Özel Eğitim %25 Fazla (Gece)",
  oegNobet: "Özel Eğitim %25 Fazla (Nöbet)",
  oegBelleticilik: "Özel Eğitim %25 Fazla (Belleticilik)",
};

function autoIncomeTaxRate(taxableBase: number): number {
  // 2026 yıllık dilimleri (basitleştirilmiş — kümülatif matrah takibi MVP'de yok)
  // < 158k → %15, 158k-330k → %20, 330k-1.2M → %27, > 1.2M → %35
  if (taxableBase <= 158000) return 0.15;
  if (taxableBase <= 330000) return 0.2;
  if (taxableBase <= 1200000) return 0.27;
  return 0.35;
}

function rateFor(
  rates: RatesData,
  period: PeriodKey,
  title: TitleValue,
  educationLevel: EducationLevel,
  hourKey: keyof HoursInput,
): number | null {
  const periodRates = rates.rates[period];
  if (!periodRates) return null;
  const titleRates = periodRates[title];
  if (!titleRates) return null;
  // Akademik kadrolarda sadece "lisans" key'i var.
  const eduKey = titleRates[educationLevel] ? educationLevel : ("lisans" as EducationLevel);
  const r = titleRates[eduKey]?.[HOUR_TO_RATE_KEY[hourKey]];
  return r ?? null;
}

export function calculateEduhep(
  input: CalculationInput,
  rates: RatesData,
): CalculationResult {
  const warnings: string[] = [];
  const breakdown: CalculationResult["breakdown"] = [];

  if (!rates.rates[input.budgetPeriod]) {
    warnings.push(`Seçilen dönem için veri yok: ${input.budgetPeriod}`);
  }
  if (rates.rates[input.budgetPeriod] && !rates.rates[input.budgetPeriod][input.title]) {
    warnings.push(`Bu ünvan için bu dönemde veri yok: ${input.title}`);
  }

  let gross = 0;
  for (const key of Object.keys(input.hours) as (keyof HoursInput)[]) {
    const hours = input.hours[key];
    if (hours <= 0) continue;
    const rate = rateFor(rates, input.budgetPeriod, input.title, input.educationLevel, key);
    if (rate == null) {
      warnings.push(`${HOUR_LABELS[key]} için saatlik ücret verisi yok.`);
      continue;
    }
    const amount = hours * rate;
    gross += amount;
    breakdown.push({ label: HOUR_LABELS[key], hours, rate, amount });
  }

  // Sınav görevleri (none olanlar atlanır)
  const periodFees = rates.examFees[input.budgetPeriod] ?? rates.examFees["2026-H1"] ?? {};
  for (const duty of input.examDuties) {
    if (duty === "none") continue;
    const fee = periodFees[duty];
    if (fee == null || fee <= 0) {
      warnings.push(`Sınav görev ücreti verisi yok: ${duty}`);
      continue;
    }
    gross += fee;
    breakdown.push({ label: `Merkezi Sınav: ${duty}`, amount: fee });
  }

  // GV İstisnası: VERGİ TUTARI cinsinden (4.211,33 TL = asgari ücretin aylık GV'si).
  // Hesaplanan GV'den düşülür, matrahtan değil.
  // DV İstisnası: MATRAH cinsinden (33.030 TL). Brüt'ten düşülür, kalan üzerinden DV.
  const incomeExemptionMax = rates.incomeTaxExemption[input.budgetPeriod] ?? 0;
  const stampExemptionMax = rates.stampTaxExemption[input.budgetPeriod] ?? 0;

  const incomeExemptionRemaining = Math.max(0, incomeExemptionMax - input.exemptions.incomeTaxUsed);
  const stampExemptionRemaining = Math.max(0, stampExemptionMax - input.exemptions.stampTaxUsed);

  const appliedRate =
    input.incomeTaxRate === "auto"
      ? autoIncomeTaxRate(gross)
      : Number(input.incomeTaxRate) / 100;

  // Gelir vergisi
  const calculatedIncomeTax = gross * appliedRate;
  const incomeExemptionApplied = Math.min(calculatedIncomeTax, incomeExemptionRemaining);
  const incomeTax = +Math.max(0, calculatedIncomeTax - incomeExemptionApplied).toFixed(2);

  // Damga vergisi: önce matrah istisnası uygulanır, sonra kalan brüte 0,759%
  const stampMatrahApplied = Math.min(gross, stampExemptionRemaining);
  const stampBase = Math.max(0, gross - stampMatrahApplied);
  const stampTax = +(stampBase * rates.stampTaxRate).toFixed(2);

  const net = +(gross - incomeTax - stampTax).toFixed(2);

  return {
    grossAmount: +gross.toFixed(2),
    taxableBase: +gross.toFixed(2),
    incomeTax,
    stampTax,
    netAmount: net,
    appliedIncomeTaxRate: appliedRate,
    remainingIncomeTaxExemption: +(incomeExemptionRemaining - incomeExemptionApplied).toFixed(2),
    remainingStampTaxExemption: +(stampExemptionRemaining - stampMatrahApplied).toFixed(2),
    breakdown,
    warnings,
  };
}
