"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export interface HourInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  hint?: string;
  max?: number;
}

export function HourInput({ id, label, value, onChange, hint, max = 5000 }: HourInputProps) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <Input
        id={id}
        type="number"
        inputMode="numeric"
        min={0}
        max={max}
        value={value === 0 ? "" : value}
        placeholder="0"
        onChange={(e) => {
          const v = e.target.value === "" ? 0 : Math.max(0, Math.min(max, Number(e.target.value)));
          onChange(Number.isFinite(v) ? v : 0);
        }}
        className="text-right tabular-nums"
      />
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
