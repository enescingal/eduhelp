export interface MonthOption {
  value: number;
  label: string;
}

export const MONTHS: MonthOption[] = [
  { value: 1, label: "Ocak" },
  { value: 2, label: "Şubat" },
  { value: 3, label: "Mart" },
  { value: 4, label: "Nisan" },
  { value: 5, label: "Mayıs" },
  { value: 6, label: "Haziran" },
  { value: 7, label: "Temmuz" },
  { value: 8, label: "Ağustos" },
  { value: 9, label: "Eylül" },
  { value: 10, label: "Ekim" },
  { value: 11, label: "Kasım" },
  { value: 12, label: "Aralık" },
];

export const H1_MONTHS = MONTHS.slice(0, 6);
export const H2_MONTHS = MONTHS.slice(6, 12);

export const calculationMonthsForPeriod = (period: string) =>
  period.endsWith("H1") ? H1_MONTHS : H2_MONTHS;
