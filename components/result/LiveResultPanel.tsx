"use client";

import * as React from "react";
import { ChevronDown, AlertTriangle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { useShallow } from "zustand/react/shallow";
import { useFormStore, selectCalculationInput } from "@/lib/store/form-store";
import { calculateEduhep, type RatesData } from "@/lib/calculations/eduhep-engine";
import { formatTL } from "@/lib/utils/format-currency";
import ratesData from "@/lib/data/rates.json";
import { cn } from "@/lib/utils/cn";

const RATES = ratesData as unknown as RatesData;

function Stat({
  label,
  value,
  variant = "default",
  size = "md",
}: {
  label: string;
  value: number;
  variant?: "default" | "muted" | "negative" | "primary";
  size?: "md" | "xl";
}) {
  const valueClass = cn(
    "tabular-nums font-semibold",
    size === "xl" ? "text-3xl sm:text-4xl" : "text-base",
    variant === "primary" && "text-primary",
    variant === "negative" && "text-destructive",
    variant === "muted" && "text-muted-foreground",
  );
  return (
    <div className="flex items-baseline justify-between gap-3">
      <span className={cn("text-xs", size === "xl" ? "text-sm font-medium" : "text-muted-foreground")}>
        {label}
      </span>
      <span className={valueClass}>
        {variant === "negative" && value > 0 ? "−" : ""}
        {formatTL(Math.abs(value)).replace(/^−/, "")}
      </span>
    </div>
  );
}

export function LiveResultPanel() {
  const [showDetail, setShowDetail] = React.useState(false);
  const input = useFormStore(useShallow(selectCalculationInput));

  const result = React.useMemo(() => calculateEduhep(input, RATES), [input]);

  const periodLabel = RATES.periods[input.budgetPeriod]?.label ?? input.budgetPeriod;

  return (
    <Card className="border-2 shadow-md">
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <CardTitle>Hesaplama Sonucu</CardTitle>
          <Badge variant="outline" className="text-[10px]">{periodLabel}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <Stat label="Brüt Ücret" value={result.grossAmount} variant="muted" />
        <Stat
          label={`Gelir Vergisi (%${(result.appliedIncomeTaxRate * 100).toFixed(0)})`}
          value={result.incomeTax}
          variant="negative"
        />
        <Stat label="Damga Vergisi" value={result.stampTax} variant="negative" />
        <Separator />
        <Stat label="Net Ücret" value={result.netAmount} variant="primary" size="xl" />

        {result.warnings.length > 0 && (
          <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 space-y-1">
            <div className="flex items-center gap-2 text-xs font-medium text-destructive">
              <AlertTriangle className="h-3.5 w-3.5" />
              Dikkat
            </div>
            <ul className="text-[11px] text-destructive/90 space-y-0.5 list-disc pl-4">
              {result.warnings.map((w, i) => <li key={i}>{w}</li>)}
            </ul>
          </div>
        )}

        <Collapsible open={showDetail} onOpenChange={setShowDetail}>
          <CollapsibleTrigger className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors w-full justify-center pt-1">
            Detayları {showDetail ? "Gizle" : "Göster"}
            <ChevronDown className={cn("h-3 w-3 transition-transform", showDetail && "rotate-180")} />
          </CollapsibleTrigger>
          <CollapsibleContent className="pt-3">
            <div className="space-y-2">
              <div className="text-[11px] uppercase tracking-wide text-muted-foreground">
                Kalemler
              </div>
              {result.breakdown.length === 0 ? (
                <p className="text-xs text-muted-foreground italic">
                  Henüz hesaplanacak kalem yok. Sol taraftan saat girişi yapın.
                </p>
              ) : (
                <ul className="space-y-1.5">
                  {result.breakdown.map((b, i) => (
                    <li key={i} className="flex justify-between text-xs gap-2">
                      <span className="text-muted-foreground truncate">
                        {b.label}
                        {b.hours != null && b.rate != null && (
                          <span className="text-[10px] ml-1">
                            ({b.hours} × {formatTL(b.rate)})
                          </span>
                        )}
                      </span>
                      <span className="tabular-nums font-medium">{formatTL(b.amount)}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Separator className="my-2" />
              <div className="text-[11px] space-y-1 text-muted-foreground">
                <div className="flex justify-between">
                  <span>GV İstisnası (kalan vergi tutarı)</span>
                  <span className="tabular-nums">{formatTL(result.remainingIncomeTaxExemption)}</span>
                </div>
                <div className="flex justify-between">
                  <span>DV İstisnası (kalan matrah)</span>
                  <span className="tabular-nums">{formatTL(result.remainingStampTaxExemption)}</span>
                </div>
              </div>
            </div>
          </CollapsibleContent>
        </Collapsible>
      </CardContent>
    </Card>
  );
}
