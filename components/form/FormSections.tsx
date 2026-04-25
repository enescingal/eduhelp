"use client";

import * as React from "react";
import {
  CalendarDays,
  ClipboardList,
  Clock,
  GraduationCap,
  Percent,
  Receipt,
  ScrollText,
  UserCog,
  Accessibility,
  BookOpen,
  FileText,
} from "lucide-react";
import { useFormStore } from "@/lib/store/form-store";
import { TITLES, isAcademic, type TitleValue } from "@/lib/constants/titles";
import { EXAM_ROLES, type ExamRoleValue } from "@/lib/constants/exam-roles";
import { calculationMonthsForPeriod, MONTHS } from "@/lib/constants/months";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Section } from "@/components/shared/Section";
import { HourInput } from "@/components/shared/HourInput";
import { CurrencyInput } from "@/components/shared/CurrencyInput";
import ratesData from "@/lib/data/rates.json";
import type { RatesData } from "@/lib/calculations/eduhep-engine";
import { cn } from "@/lib/utils/cn";

const RATES = ratesData as unknown as RatesData;

const PERIOD_KEYS = Object.keys(RATES.periods).sort((a, b) => {
  // Newest first: parse YYYY-Hx
  const [ya, ha] = a.split("-");
  const [yb, hb] = b.split("-");
  if (yb !== ya) return Number(yb) - Number(ya);
  return hb.localeCompare(ha);
});

export function FormSections() {
  const s = useFormStore();

  // Reset education level when switching to academic title (academic
  // titles ignore it; we keep it as "lisans" implicitly).
  React.useEffect(() => {
    if (isAcademic(s.title) && s.educationLevel !== "lisans") {
      s.setField("educationLevel", "lisans");
    }
  }, [s.title]);

  // Keep calculationMonth in valid range when period changes.
  React.useEffect(() => {
    const valid = calculationMonthsForPeriod(s.budgetPeriod).map((m) => m.value);
    if (!valid.includes(s.calculationMonth)) {
      s.setField("calculationMonth", valid[0]);
    }
  }, [s.budgetPeriod]);

  const academic = isAcademic(s.title);
  const incomeMax = RATES.incomeTaxExemption[s.budgetPeriod];
  const stampMax = RATES.stampTaxExemption[s.budgetPeriod];

  return (
    <div className="space-y-4">
      {/* Bütçe dönemi & ay */}
      <Section title="Temel Bilgiler" icon={CalendarDays}>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-1.5">
            <Label className="text-xs text-muted-foreground">Bütçe Dönemi</Label>
            <Select
              value={s.budgetPeriod}
              onValueChange={(v) => s.setField("budgetPeriod", v)}
            >
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {PERIOD_KEYS.map((k) => (
                  <SelectItem key={k} value={k}>
                    {RATES.periods[k].label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Hesaplama Ayı</Label>
              <Select
                value={String(s.calculationMonth)}
                onValueChange={(v) => s.setField("calculationMonth", Number(v))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {calculationMonthsForPeriod(s.budgetPeriod).map((m) => (
                    <SelectItem key={m.value} value={String(m.value)}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Muhasebe Ayı</Label>
              <Select
                value={String(s.accountingMonth)}
                onValueChange={(v) => s.setField("accountingMonth", Number(v))}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {MONTHS.map((m) => (
                    <SelectItem key={m.value} value={String(m.value)}>
                      {m.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </Section>

      {/* Ünvan */}
      <Section title="Ünvan" icon={UserCog} description="Hesaplama, seçilen ünvana göre yapılır">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
          {TITLES.map((t) => (
            <button
              key={t.value}
              type="button"
              onClick={() => s.setField("title", t.value as TitleValue)}
              className={cn(
                "text-left rounded-lg border px-3 py-2.5 transition-colors hover:bg-accent",
                s.title === t.value
                  ? "border-primary ring-1 ring-primary bg-accent"
                  : "border-border",
              )}
              aria-pressed={s.title === t.value}
            >
              <div className="text-sm font-medium">{t.label}</div>
              <div className="text-[11px] text-muted-foreground">{t.description}</div>
            </button>
          ))}
        </div>
      </Section>

      {/* Öğrenim durumu - sadece MEB öğretmenleri */}
      {!academic && (
        <Section title="En Son Öğrenim Durumu" icon={GraduationCap}>
          <RadioGroup
            value={s.educationLevel}
            onValueChange={(v) => s.setField("educationLevel", v as typeof s.educationLevel)}
            className="grid grid-cols-3 gap-2"
          >
            {[
              { value: "lisans", label: "Lisans" },
              { value: "yuksek-lisans", label: "Yüksek Lisans" },
              { value: "doktora", label: "Doktora" },
            ].map((l) => (
              <Label
                key={l.value}
                htmlFor={`edu-${l.value}`}
                className={cn(
                  "flex items-center gap-2 rounded-lg border px-3 py-2.5 cursor-pointer hover:bg-accent",
                  s.educationLevel === l.value && "border-primary ring-1 ring-primary bg-accent",
                )}
              >
                <RadioGroupItem value={l.value} id={`edu-${l.value}`} />
                <span className="text-sm">{l.label}</span>
              </Label>
            ))}
          </RadioGroup>
        </Section>
      )}

      {/* Vergi istisnaları */}
      <Section
        title="Vergi İstisnaları (Faydalanılan)"
        icon={Receipt}
        description="Bu ay daha önce başka maaştan faydalanılan tutarlar"
        collapsible
        defaultOpen={false}
      >
        <div className="grid sm:grid-cols-2 gap-4">
          <CurrencyInput
            id="incomeExemption"
            label="Gelir Vergisi İstisnası"
            value={s.exemptions.incomeTaxUsed}
            onChange={(n) =>
              s.setField("exemptions", { ...s.exemptions, incomeTaxUsed: n })
            }
            max={incomeMax}
          />
          <CurrencyInput
            id="stampExemption"
            label="Damga Vergisi İstisnası Matrahı"
            value={s.exemptions.stampTaxUsed}
            onChange={(n) =>
              s.setField("exemptions", { ...s.exemptions, stampTaxUsed: n })
            }
            max={stampMax}
          />
        </div>
      </Section>

      {/* Temel ders saatleri */}
      <Section title="Temel Ders Saatleri" icon={Clock}>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          <HourInput id="h-gunduz" label="Gündüz" value={s.hours.gunduz}
            onChange={(n) => s.setHour("gunduz", n)} />
          <HourInput id="h-nobet" label="Nöbet" value={s.hours.nobet}
            onChange={(n) => s.setHour("nobet", n)} />
          <HourInput id="h-gece" label="Gece" value={s.hours.gece}
            onChange={(n) => s.setHour("gece", n)} />
          <HourInput id="h-belleticilik" label="Belleticilik" value={s.hours.belleticilik}
            onChange={(n) => s.setHour("belleticilik", n)} />
          <HourInput id="h-sinav" label="Sınav" value={s.hours.sinav}
            onChange={(n) => s.setHour("sinav", n)} />
          <HourInput id="h-egzersiz" label="Egzersiz" value={s.hours.egzersiz}
            onChange={(n) => s.setHour("egzersiz", n)} />
          <HourInput id="h-hizmetici" label="Hizmet İçi" value={s.hours.hizmetici}
            onChange={(n) => s.setHour("hizmetici", n)} />
        </div>
      </Section>

      {/* Özel eğitim %25 fazla */}
      <Section title="Özel Eğitim Görevi (%25 Fazla)" icon={Accessibility} collapsible defaultOpen={false}>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <HourInput id="oeg-gunduz" label="Gündüz" value={s.hours.oegGunduz}
            onChange={(n) => s.setHour("oegGunduz", n)} />
          <HourInput id="oeg-gece" label="Gece" value={s.hours.oegGece}
            onChange={(n) => s.setHour("oegGece", n)} />
          <HourInput id="oeg-nobet" label="Nöbet" value={s.hours.oegNobet}
            onChange={(n) => s.setHour("oegNobet", n)} />
          <HourInput id="oeg-belleticilik" label="Belleticilik" value={s.hours.oegBelleticilik}
            onChange={(n) => s.setHour("oegBelleticilik", n)} />
        </div>
      </Section>

      {/* Takviye kursu */}
      <Section title="Takviye Kursu Görevi" icon={BookOpen} collapsible defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <HourInput id="tk-gunduz" label="Gündüz" value={s.hours.tkGunduz}
            onChange={(n) => s.setHour("tkGunduz", n)} />
          <HourInput id="tk-gece" label="Gece" value={s.hours.tkGece}
            onChange={(n) => s.setHour("tkGece", n)} />
        </div>
      </Section>

      {/* İYEP */}
      <Section title="İYEP Görevi (İlkokul Yetiştirme)" icon={ScrollText} collapsible defaultOpen={false}>
        <div className="grid grid-cols-2 gap-3">
          <HourInput id="iyep-gunduz" label="Gündüz" value={s.hours.iyepGunduz}
            onChange={(n) => s.setHour("iyepGunduz", n)} />
          <HourInput id="iyep-gece" label="Gece" value={s.hours.iyepGece}
            onChange={(n) => s.setHour("iyepGece", n)} />
        </div>
      </Section>

      {/* Merkezi sınav görevi */}
      <Section title="Merkezi Sınav Görevi" icon={FileText} description="En fazla 4 görev seçebilirsiniz" collapsible defaultOpen={false}>
        <div className="grid sm:grid-cols-2 gap-3">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="space-y-1.5">
              <Label className="text-xs text-muted-foreground">Görev {i + 1}</Label>
              <Select
                value={s.examDuties[i]}
                onValueChange={(v) => s.setExamDuty(i, v as ExamRoleValue)}
              >
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {EXAM_ROLES.map((r) => (
                    <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>
      </Section>

      {/* Vergi oranı */}
      <Section title="Gelir Vergisi Oranı" icon={Percent}>
        <RadioGroup
          value={s.incomeTaxRate}
          onValueChange={(v) => s.setField("incomeTaxRate", v as typeof s.incomeTaxRate)}
          className="grid grid-cols-3 sm:grid-cols-5 gap-2"
        >
          {[
            { value: "15", label: "%15" },
            { value: "20", label: "%20" },
            { value: "27", label: "%27" },
            { value: "35", label: "%35" },
            { value: "auto", label: "Otomatik" },
          ].map((o) => (
            <Label
              key={o.value}
              htmlFor={`tax-${o.value}`}
              className={cn(
                "flex items-center justify-center gap-2 rounded-lg border px-2 py-2.5 cursor-pointer hover:bg-accent",
                s.incomeTaxRate === o.value && "border-primary ring-1 ring-primary bg-accent",
              )}
            >
              <RadioGroupItem value={o.value} id={`tax-${o.value}`} className="hidden" />
              <span className="text-sm">{o.label}</span>
            </Label>
          ))}
        </RadioGroup>
      </Section>

      {/* Aksiyon butonları */}
      <div className="flex flex-wrap gap-2 pt-2">
        <button
          type="button"
          onClick={() => s.clearInputsOnly()}
          className="text-xs text-muted-foreground underline hover:text-foreground"
        >
          Girdileri Temizle
        </button>
        <button
          type="button"
          onClick={() => s.reset()}
          className="text-xs text-muted-foreground underline hover:text-foreground"
        >
          Tüm Formu Sıfırla
        </button>
      </div>
    </div>
  );
}
