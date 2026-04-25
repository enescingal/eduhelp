"use client";

import * as React from "react";
import type { LucideIcon } from "lucide-react";
import { ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils/cn";

export interface SectionProps {
  title: string;
  icon?: LucideIcon;
  description?: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function Section({
  title,
  icon: Icon,
  description,
  collapsible = false,
  defaultOpen = true,
  children,
}: SectionProps) {
  const [open, setOpen] = React.useState(defaultOpen);

  const head = (
    <CardHeader className={cn("pb-3", collapsible && "cursor-pointer select-none")}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-accent text-accent-foreground">
              <Icon className="h-4 w-4" />
            </div>
          )}
          <div>
            <CardTitle>{title}</CardTitle>
            {description && (
              <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
            )}
          </div>
        </div>
        {collapsible && (
          <ChevronDown
            className={cn(
              "h-4 w-4 text-muted-foreground transition-transform",
              open && "rotate-180",
            )}
          />
        )}
      </div>
    </CardHeader>
  );

  if (!collapsible) {
    return (
      <Card>
        {head}
        <CardContent>{children}</CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger asChild>{head}</CollapsibleTrigger>
        <CollapsibleContent>
          <CardContent>{children}</CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
}
