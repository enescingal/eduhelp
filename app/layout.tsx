import type { Metadata } from "next";
import { ThemeProvider } from "next-themes";
import "./globals.css";

export const metadata: Metadata = {
  title: "EDUHEP 2026 — Ek Ders Ücreti Hesaplama",
  description:
    "Modern, hızlı ve mobil uyumlu ek ders ücreti, ücretli öğretmen, usta öğretici, takviye kursu ve merkezi sınav görev ücreti hesaplama aracı.",
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
        </ThemeProvider>
      </body>
    </html>
  );
}
