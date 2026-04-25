"use client";

import { create } from "zustand";
import { subscribeWithSelector } from "zustand/middleware";
import type {
  CalculationInput,
  EducationLevel,
  HoursInput,
  IncomeTaxRate,
} from "@/lib/calculations/eduhep-engine";
import { ZERO_HOURS } from "@/lib/calculations/eduhep-engine";
import type { TitleValue } from "@/lib/constants/titles";
import type { ExamRoleValue } from "@/lib/constants/exam-roles";

export interface FormState extends CalculationInput {
  calculationMonth: number;
  accountingMonth: number;
  setField: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  setHour: (key: keyof HoursInput, value: number) => void;
  setExamDuty: (slot: number, value: ExamRoleValue) => void;
  reset: () => void;
  clearInputsOnly: () => void;
}

const initial: Omit<FormState, "setField" | "setHour" | "setExamDuty" | "reset" | "clearInputsOnly"> = {
  budgetPeriod: "2026-H1",
  title: "kadrolu-ogretmen",
  educationLevel: "lisans",
  calculationMonth: 1,
  accountingMonth: 3,
  exemptions: { incomeTaxUsed: 0, stampTaxUsed: 0 },
  hours: { ...ZERO_HOURS },
  examDuties: ["none", "none", "none", "none"],
  incomeTaxRate: "auto",
};

export const useFormStore = create<FormState>()(
  subscribeWithSelector((set) => ({
    ...initial,
    setField: (key, value) => set({ [key]: value } as Partial<FormState>),
    setHour: (key, value) =>
      set((s) => ({ hours: { ...s.hours, [key]: value } })),
    setExamDuty: (slot, value) =>
      set((s) => {
        const next = [...s.examDuties];
        next[slot] = value;
        return { examDuties: next };
      }),
    reset: () => set({ ...initial, hours: { ...ZERO_HOURS }, examDuties: [...initial.examDuties] }),
    clearInputsOnly: () =>
      set((s) => ({
        hours: { ...ZERO_HOURS },
        examDuties: ["none", "none", "none", "none"],
        exemptions: { incomeTaxUsed: 0, stampTaxUsed: 0 },
      })),
  })),
);

// Convenience selector
export const selectCalculationInput = (s: FormState): CalculationInput => ({
  budgetPeriod: s.budgetPeriod,
  title: s.title,
  educationLevel: s.educationLevel,
  exemptions: s.exemptions,
  hours: s.hours,
  examDuties: s.examDuties,
  incomeTaxRate: s.incomeTaxRate,
});

export type { EducationLevel, IncomeTaxRate, HoursInput };
export type { TitleValue };
