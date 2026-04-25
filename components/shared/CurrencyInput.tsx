"use client";

import * as React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { parseTLInput } from "@/lib/utils/format-currency";

export interface CurrencyInputProps {
  id: string;
  label: string;
  value: number;
  onChange: (n: number) => void;
  max?: number;
  hint?: string;
}

const TR = new Intl.NumberFormat("tr-TR", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

export function CurrencyInput({ id, label, value, onChange, max, hint }: CurrencyInputProps) {
  const [text, setText] = React.useState(value === 0 ? "" : TR.format(value));

  React.useEffect(() => {
    setText(value === 0 ? "" : TR.format(value));
  }, [value]);

  return (
    <div className="space-y-1.5">
      <Label htmlFor={id} className="text-xs text-muted-foreground">
        {label}
      </Label>
      <div className="relative">
        <Input
          id={id}
          inputMode="decimal"
          value={text}
          placeholder="0,00"
          onChange={(e) => setText(e.target.value)}
          onBlur={() => {
            let n = parseTLInput(text);
            if (max != null) n = Math.min(max, Math.max(0, n));
            onChange(n);
            setText(n === 0 ? "" : TR.format(n));
          }}
          className="text-right tabular-nums pr-9"
        />
        <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          ₺
        </span>
      </div>
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
      {max != null && (
        <p className="text-[10px] text-muted-foreground">
          Maks: {TR.format(max)} ₺
        </p>
      )}
    </div>
  );
}
