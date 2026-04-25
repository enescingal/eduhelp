import { GraduationCap } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";
import { Badge } from "@/components/ui/badge";

export function Header() {
  return (
    <header className="border-b sticky top-0 z-30 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div>
            <div className="text-sm font-semibold leading-tight">EDUHEP 2026</div>
            <div className="text-xs text-muted-foreground leading-tight">
              Ek Ders Ücreti Hesaplama
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="hidden sm:inline-flex">
            Canlı hesaplama
          </Badge>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
