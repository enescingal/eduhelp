export const TITLES = [
  { value: "profesor", label: "Profesör", group: "akademik", description: "YÖK akademik kadro" },
  { value: "docent", label: "Doçent", group: "akademik", description: "YÖK akademik kadro" },
  { value: "dr-ogretim-uyesi", label: "Doktor Öğretim Üyesi", group: "akademik", description: "YÖK akademik kadro" },
  { value: "ogretim-gorevlisi", label: "Öğretim Görevlisi / Okutman", group: "akademik", description: "YÖK akademik kadro" },
  { value: "kadrolu-ogretmen", label: "Kadrolu Öğretmen", group: "meb", description: "MEB kadro" },
  { value: "sozlesmeli-ogretmen", label: "Sözleşmeli Öğretmen", group: "meb", description: "MEB 4/B" },
  { value: "ucretli-ogretmen", label: "Ücretli Öğretmen", group: "meb", description: "MEB ücretli" },
] as const;

export type TitleValue = (typeof TITLES)[number]["value"];

export const ACADEMIC_TITLES: TitleValue[] = ["profesor", "docent", "dr-ogretim-uyesi", "ogretim-gorevlisi"];

export const isAcademic = (t: TitleValue): boolean => ACADEMIC_TITLES.includes(t);
