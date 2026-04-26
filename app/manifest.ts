import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "EDUHEP 2026 — Ek Ders Ücreti Hesaplama",
    short_name: "EDUHEP",
    description:
      "Ek ders ücreti, ücretli öğretmen, takviye kursu ve merkezi sınav görev ücreti hesaplama aracı.",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#ffffff",
    theme_color: "#25b86b",
    lang: "tr",
    categories: ["education", "productivity", "finance"],
    icons: [
      { src: "/icon", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icon", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/apple-icon", sizes: "180x180", type: "image/png" },
    ],
  };
}
