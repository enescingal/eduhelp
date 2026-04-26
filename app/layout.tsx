import type { Metadata, Viewport } from "next";
import { ThemeProvider } from "next-themes";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import "./globals.css";

export const metadata: Metadata = {
  title: "EDUHEP 2026 — Ek Ders Ücreti Hesaplama",
  description:
    "Modern, hızlı ve mobil uyumlu ek ders ücreti, ücretli öğretmen, usta öğretici, takviye kursu ve merkezi sınav görev ücreti hesaplama aracı.",
  applicationName: "EDUHEP 2026",
  appleWebApp: {
    capable: true,
    title: "EDUHEP",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="tr" suppressHydrationWarning>
      <body className="min-h-screen antialiased">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <InstallPrompt />
        </ThemeProvider>
      </body>
    </html>
  );
}
