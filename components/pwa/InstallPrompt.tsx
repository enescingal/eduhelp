"use client";

import * as React from "react";
import { Plus, Share, Smartphone, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

type Platform = "ios" | "android" | "other";

const STORAGE_KEY = "eduhep-pwa-prompt-dismissed";
const SHOW_DELAY_MS = 1500;

function detectPlatform(): Platform {
  if (typeof navigator === "undefined") return "other";
  const ua = navigator.userAgent;
  // iPadOS 13+ reports as Mac; check touch points too.
  const isIpadOS =
    /Mac/.test(ua) &&
    typeof (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints === "number" &&
    (navigator as Navigator & { maxTouchPoints?: number }).maxTouchPoints! > 1;
  if (/iPad|iPhone|iPod/.test(ua) || isIpadOS) return "ios";
  if (/Android/.test(ua)) return "android";
  return "other";
}

function isStandalone(): boolean {
  if (typeof window === "undefined") return false;
  if (window.matchMedia("(display-mode: standalone)").matches) return true;
  // iOS Safari
  if ((navigator as Navigator & { standalone?: boolean }).standalone) return true;
  return false;
}

export function InstallPrompt() {
  const [show, setShow] = React.useState(false);
  const [platform, setPlatform] = React.useState<Platform>("other");
  const [installEvent, setInstallEvent] =
    React.useState<BeforeInstallPromptEvent | null>(null);

  React.useEffect(() => {
    if (typeof window === "undefined") return;
    if (isStandalone()) return;

    let dismissed = false;
    try {
      dismissed = localStorage.getItem(STORAGE_KEY) === "1";
    } catch {
      // localStorage may be blocked (e.g. Safari private mode)
    }
    if (dismissed) return;

    const p = detectPlatform();
    if (p === "other") return; // desktop / unknown

    setPlatform(p);

    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);

    const installedHandler = () => {
      try {
        localStorage.setItem(STORAGE_KEY, "1");
      } catch {}
      setShow(false);
    };
    window.addEventListener("appinstalled", installedHandler);

    const t = setTimeout(() => setShow(true), SHOW_DELAY_MS);
    return () => {
      window.removeEventListener("beforeinstallprompt", handler);
      window.removeEventListener("appinstalled", installedHandler);
      clearTimeout(t);
    };
  }, []);

  // Lock body scroll while open
  React.useEffect(() => {
    if (!show) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [show]);

  // Esc to close
  React.useEffect(() => {
    if (!show) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") dismiss();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [show]);

  const dismiss = React.useCallback(() => {
    try {
      localStorage.setItem(STORAGE_KEY, "1");
    } catch {}
    setShow(false);
  }, []);

  const install = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const { outcome } = await installEvent.userChoice;
    if (outcome === "accepted") {
      dismiss();
    }
  };

  if (!show) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="install-prompt-title"
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={dismiss}
    >
      <div
        className="bg-card text-card-foreground border rounded-2xl shadow-2xl w-full sm:max-w-sm p-5 space-y-4 animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0">
            <Smartphone className="h-5 w-5" />
          </div>
          <div className="flex-1 min-w-0">
            <h2 id="install-prompt-title" className="font-semibold text-base leading-tight">
              EDUHEP'i ana ekrana ekle
            </h2>
            <p className="text-sm text-muted-foreground mt-1 leading-snug">
              Telefonundan tek dokunuşla aç, gerçek bir uygulama gibi kullan.
            </p>
          </div>
          <button
            onClick={dismiss}
            aria-label="Kapat"
            className="text-muted-foreground hover:text-foreground p-1 -m-1 shrink-0"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {platform === "android" && installEvent ? (
          <Button onClick={install} size="lg" className="w-full">
            Ana Ekrana Ekle
          </Button>
        ) : platform === "ios" ? (
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">Safari'de şu adımları izleyin:</p>
            <ol className="space-y-2.5">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold shrink-0">
                  1
                </span>
                <span className="flex items-center gap-1.5 leading-snug">
                  Alttaki <Share className="h-4 w-4 inline-block text-primary" /> Paylaş düğmesine dokunun
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold shrink-0">
                  2
                </span>
                <span className="flex items-center gap-1.5 leading-snug">
                  <Plus className="h-3.5 w-3.5 inline-block" /> "Ana Ekrana Ekle" seçin
                </span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold shrink-0">
                  3
                </span>
                <span className="leading-snug">"Ekle" düğmesine dokunun</span>
              </li>
            </ol>
          </div>
        ) : (
          // Android, beforeinstallprompt henüz gelmedi — manuel talimat
          <div className="space-y-3 text-sm">
            <p className="text-muted-foreground">Tarayıcı menünden:</p>
            <ol className="space-y-2.5">
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold shrink-0">1</span>
                <span className="leading-snug">Sağ üstteki menü (⋮) düğmesine dokunun</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-accent text-accent-foreground text-xs font-semibold shrink-0">2</span>
                <span className="leading-snug">"Uygulamayı yükle" veya "Ana ekrana ekle" seçin</span>
              </li>
            </ol>
          </div>
        )}

        <button
          onClick={dismiss}
          className="w-full text-xs text-muted-foreground hover:text-foreground pt-1"
        >
          Şimdi değil
        </button>
      </div>
    </div>
  );
}
