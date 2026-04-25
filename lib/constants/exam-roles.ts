export const EXAM_ROLES = [
  { value: "none", label: "Görev Yok" },
  { value: "bina-sinav-sorumlusu", label: "Bina Sınav Sorumlusu" },
  { value: "bina-komisyon-baskani", label: "Bina Sınav Komisyon Başkanı" },
  { value: "bina-komisyon-uyesi", label: "Bina Sınav Komisyon Üyesi" },
  { value: "salon-baskani", label: "Salon Başkanı" },
  { value: "cezaevi-salon-baskani", label: "Cezaevi Salon Başkanı" },
  { value: "gozetmen", label: "Gözetmen" },
  { value: "cezaevi-gozetmen", label: "Cezaevi Gözetmen" },
  { value: "yedek-gozetmen", label: "Yedek Gözetmen" },
  { value: "yardimci-engelli-gozetmen", label: "Yardımcı Engelli Gözetmen" },
  { value: "e-sinav-salon-baskani", label: "(E-Sınav) Salon Başkanı" },
  { value: "e-sinav-gozetmen", label: "(E-Sınav) Gözetmen" },
  { value: "e-sinav-salon-baskani-fazla", label: "(E-Sınav) Salon Başkanı (%20 Fazla)" },
  { value: "e-sinav-gozetmen-fazla", label: "(E-Sınav) Gözetmen (%20 Fazla)" },
] as const;

export type ExamRoleValue = (typeof EXAM_ROLES)[number]["value"];
