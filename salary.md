# 📘 EDUHEP 2026 — Modern Web Uygulaması Proje Dokümantasyonu

> **Hedef:** ozkansoft.com/eduhep.php sitesinin tüm fonksiyonlarını koruyarak, modern, kullanıcı dostu, mobil uyumlu ve "Google CEO'sunun bile beğeneceği" bir web uygulaması olarak yeniden geliştirilmesi.

---

## 📑 İçindekiler

1. [Proje Özeti](#1-proje-özeti)
2. [Önerilen Teknoloji Stack'i](#2-önerilen-teknoloji-stacki)
3. [Tasarım Felsefesi ve UI/UX Prensipleri](#3-tasarım-felsefesi-ve-uiux-prensipleri)
4. [Proje Klasör Yapısı](#4-proje-klasör-yapısı)
5. [Tüm Form Alanları ve Değerleri (Detaylı)](#5-tüm-form-alanları-ve-değerleri-detaylı)
6. [Hesaplama Modülleri](#6-hesaplama-modülleri)
7. [Sayfa ve Bileşen Yapısı](#7-sayfa-ve-bileşen-yapısı)
8. [Mevcut Siteye Göre UX İyileştirmeleri](#8-mevcut-siteye-göre-ux-iyileştirmeleri)
9. [Erişilebilirlik (a11y) Gereksinimleri](#9-erişilebilirlik-a11y-gereksinimleri)
10. [Geliştirme Aşamaları (Roadmap)](#10-geliştirme-aşamaları-roadmap)

---

## 1. Proje Özeti

### 1.1 Uygulama Adı
**EDUHEP 2026** — Ek Ders Ücreti, Ücretli Öğretmen, Usta Öğretici, Takviye Kursu ve Merkezi Sınav Görev Ücreti Hesaplama Programı.

### 1.2 Hedef Kullanıcılar
- Kadrolu / Sözleşmeli / Ücretli Öğretmenler
- Profesör, Doçent, Dr. Öğretim Üyesi, Öğretim Görevlisi, Okutman
- Usta Öğreticiler ve Uzmanlar
- MEB ve YÖK personeli
- Maaş bordrolarını kontrol etmek isteyen tüm eğitimciler

### 1.3 Temel Problem
Mevcut site (`ozkansoft.com/eduhep.php`) işlevsel olarak çok güçlü; ancak:
- Görsel hiyerarşi zayıf (her şey aynı düzeyde gözüküyor).
- Form alanları gruplandırılmamış, kullanıcı kaybolur.
- Çok sayıda alan tek ekrana sıkıştırılmış.
- Modern bir tasarım dili yok (eski PHP form estetiği).
- Mikro etkileşim, animasyon ve görsel geri bildirim yok.
- Klavye navigasyonu ve erişilebilirlik yetersiz.
- Sonuç ekranı bilgi yoğun ve okunması zor.

### 1.4 Çözüm Vizyonu
- **Adım adım (wizard / stepper) form** veya **akıllı tek-sayfa** tasarımı.
- Sadece kullanıcının ünvanına göre **görünmesi gereken alanların gösterilmesi**.
- Anlık (live) hesaplama ve **canlı sonuç paneli**.
- **Mobil-öncelikli** tasarım.
- **Karanlık / Aydınlık tema** desteği.
- **PDF dışa aktarma**, **paylaşılabilir bağlantı**, **yerel kayıt** özellikleri.

---

## 2. Önerilen Teknoloji Stack'i

### 2.1 Ana Tercih (Tavsiye Edilen) — **Next.js + shadcn/ui**

| Katman | Teknoloji | Neden? |
|---|---|---|
| **Framework** | **Next.js 15 (App Router)** | SSR/SSG, performans, SEO, modern React, dünyanın en çok kullanılan React framework'ü |
| **Dil** | **TypeScript** | Tip güvenliği, kod kalitesi, IDE desteği — Google standardı |
| **UI Kütüphanesi** | **shadcn/ui + Radix UI** | Şu an dünyada en trend, accessible, headless, kopyala-özelleştir mantığı |
| **Stil** | **Tailwind CSS v4** | Hız, tutarlılık, küçük bundle |
| **Form Yönetimi** | **React Hook Form + Zod** | Performanslı, tip güvenli validasyon |
| **State** | **Zustand** | Basit, küçük, Redux'a göre 10x daha az boilerplate |
| **Animasyon** | **Framer Motion (motion)** | Mikro etkileşimler, premium his |
| **İkon** | **Lucide React** | shadcn/ui ile tam uyumlu, 1500+ ikon |
| **PDF Export** | **react-pdf / @react-pdf/renderer** | Profesyonel PDF çıktı |
| **Tema** | **next-themes** | Dark/Light mode |
| **Sayı Formatı** | **Intl.NumberFormat (native)** | Türkçe binlik/ondalık |
| **Test** | Vitest + React Testing Library | Modern, hızlı |
| **Lint/Format** | ESLint + Prettier + Biome | Kod kalitesi |

### 2.2 Neden Bu Stack? (Google CEO için Argüman)

1. **Next.js**, Vercel tarafından geliştirilen, React'in resmi production framework'ü. Google da kendi projelerinde React kullanıyor.
2. **shadcn/ui**, 2024–2026 arasında frontend dünyasında "industry standard" haline geldi. Kütüphane değil, kopyalanabilir bileşen sistemi olduğu için **tam özelleştirme** sağlar.
3. **TypeScript**, Google'ın da iç projelerinde tercih ettiği güvenli dil.
4. **Tailwind CSS**, performans odaklı ve mobil-öncelikli yaklaşımı destekler.
5. Tüm stack **statik olarak deploy edilebilir** (Vercel / Cloudflare Pages) — backend gerektirmez, hesaplama tamamen client-side.

### 2.3 Alternatif Stack'ler

| Senaryo | Stack |
|---|---|
| **Sadece statik HTML istiyorsanız** | Astro + shadcn/ui (Astro UI) + TS |
| **Vue.js seviyorsanız** | Nuxt 3 + Nuxt UI / shadcn-vue |
| **Backend de yazacaksanız** | Next.js full-stack + tRPC + Prisma |

> ✅ **Final öneri: Next.js 15 + TypeScript + shadcn/ui + Tailwind CSS + React Hook Form + Zod + Zustand + Framer Motion**

---

## 3. Tasarım Felsefesi ve UI/UX Prensipleri

### 3.1 Tasarım Prensipleri
1. **Clarity over cleverness** — Kullanıcı 3 saniyede ne yapacağını anlamalı.
2. **Progressive Disclosure** — Sadece gerekli alanlar gösterilir, gerisi gizlenir.
3. **Immediate Feedback** — Her input değişince sonuç anında güncellenir.
4. **Mobile First** — Önce mobilde mükemmel çalışmalı.
5. **Accessible by Default** — WCAG 2.2 AA standardı.
6. **Performance Budget** — Lighthouse 95+ skoru hedefi.

### 3.2 Görsel Dil
- **Renk paleti:** Nötr (zinc / slate) + tek aksan rengi (emerald-500 veya indigo-500).
- **Tipografi:** Inter (Google Fonts) — başlıklarda Inter Display.
- **Köşe yarıçapı:** 12px (rounded-xl) — modern hissi.
- **Boşluk:** 8px grid sistemi (Tailwind defaults).
- **Gölge:** Çok hafif, layered shadows (`shadow-sm`, `shadow-md`).
- **Animasyon:** 150–250ms ease-out — abartısız.

### 3.3 Layout Yaklaşımı
**3 ana bölgeden oluşan modern panel düzeni:**

```
┌────────────────────────────────────────────────────────┐
│  [LOGO] EDUHEP 2026          [Tema] [Dil] [Profil]    │  ← Header
├──────────────────────┬─────────────────────────────────┤
│                      │                                 │
│   FORM ALANI         │   CANLI SONUÇ PANELİ            │
│   (sticky değil,     │   (sticky, sağda sabit)         │
│    sectionlara       │   - Brüt Ücret                  │
│    bölünmüş)         │   - Vergi Kesintileri           │
│                      │   - Net Ücret (büyük puntoda)   │
│   [İndirim sek.]     │   - Detaylar (collapsible)      │
│   [Görev sek.]       │   - PDF / Paylaş                │
│                      │                                 │
└──────────────────────┴─────────────────────────────────┘
```

Mobilde sonuç paneli **alt-tabanlı bottom sheet** olarak açılır.

---

## 4. Proje Klasör Yapısı

```
eduhep-2026/
├── app/
│   ├── layout.tsx
│   ├── page.tsx                      # Ana hesaplama sayfası
│   ├── about/page.tsx                # Hakkında
│   ├── changelog/page.tsx            # Güncelleme notları
│   └── api/
│       └── (gerekirse)
├── components/
│   ├── ui/                           # shadcn/ui bileşenleri
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── ThemeToggle.tsx
│   ├── form/
│   │   ├── BudgetPeriodSelect.tsx
│   │   ├── TitleSelect.tsx
│   │   ├── EducationLevelSelect.tsx
│   │   ├── MonthSelect.tsx
│   │   ├── TaxExemptionInputs.tsx
│   │   ├── LessonHoursInput.tsx
│   │   ├── SpecialEducationInput.tsx
│   │   ├── TutoringCourseInput.tsx
│   │   ├── IyepInput.tsx
│   │   ├── CentralExamDuty.tsx
│   │   └── IncomeTaxRateSelect.tsx
│   ├── result/
│   │   ├── LiveResultPanel.tsx
│   │   ├── ResultBreakdown.tsx
│   │   ├── PdfExportButton.tsx
│   │   └── ShareButton.tsx
│   └── shared/
│       ├── CurrencyInput.tsx
│       ├── HourInput.tsx
│       └── HelpTooltip.tsx
├── lib/
│   ├── calculations/
│   │   ├── eduhep-engine.ts          # Ana hesaplama motoru
│   │   ├── tax-calculator.ts         # GV / DV hesaplamaları
│   │   ├── lesson-rates.ts           # Ders ücreti tabanları
│   │   ├── exam-duty-fees.ts         # Sınav görevi ücretleri
│   │   └── budget-periods.ts         # Bütçe dönemi katsayıları
│   ├── schemas/
│   │   └── form-schema.ts            # Zod şemaları
│   ├── store/
│   │   └── form-store.ts             # Zustand store
│   ├── utils/
│   │   ├── format-currency.ts
│   │   └── format-number.ts
│   └── constants/
│       ├── titles.ts
│       ├── budget-periods.ts
│       └── exam-roles.ts
├── public/
│   └── icons/
├── styles/
│   └── globals.css
├── tests/
├── tsconfig.json
├── tailwind.config.ts
├── next.config.mjs
└── package.json
```

---

## 5. Tüm Form Alanları ve Değerleri (Detaylı)

> **Önemli:** Aşağıdaki tüm alanlar mevcut siteden birebir alınmıştır. Her alan için **type, default, validation, görünürlük koşulu ve UI bileşeni önerisi** belirtilmiştir.

---

### 5.1 🗓️ Bütçe Dönemi Seçimi
- **Alan adı:** `budgetPeriod`
- **UI Bileşen:** `<Select>` (shadcn/ui Combobox tercihen — aranabilir)
- **Required:** ✅ Evet
- **Default:** En güncel dönem (örn: `"2026-H2"`)
- **Değerler:**

| Değer | Etiket | Zam Oranı |
|---|---|---|
| `2027-H2` | 2027 Temmuz-Aralık | %4 |
| `2027-H1` | 2027 Ocak-Haziran | %5 |
| `2026-H2` | 2026 Temmuz-Aralık | %7 |
| `2026-H1` | 2026 Ocak-Haziran | %18,6 |
| `2025-H2` | 2025 Temmuz-Aralık | — |
| `2025-H1` | 2025 Ocak-Haziran | — |
| `2024-H2` | 2024 Temmuz-Aralık | — |
| `2024-H1` | 2024 Ocak-Haziran | — |
| `2023-H2` | 2023 Temmuz-Aralık | — |
| `2023-H1` | 2023 Ocak-Haziran | — |
| `2022-H2` | 2022 Temmuz-Aralık | — |
| `2022-H1` | 2022 Ocak-Haziran | — |
| `2021-H2` | 2021 Temmuz-Aralık | — |
| `2021-H1` | 2021 Ocak-Haziran | — |
| `2020-H2` | 2020 Temmuz-Aralık | — |
| `2020-H1` | 2020 Ocak-Haziran | — |
| `2019-H2` | 2019 Temmuz-Aralık | — |
| `2019-H1` | 2019 Ocak-Haziran | — |
| `2018-H2` | 2018 Temmuz-Aralık | — |
| `2018-H1` | 2018 Ocak-Haziran | — |
| `2017-H2` | 2017 Temmuz-Aralık | — |
| `2017-H1` | 2017 Ocak-Haziran | — |
| `2016-H2` | 2016 Temmuz-Aralık | — |
| `2016-H1` | 2016 Ocak-Haziran | — |
| `2015-H2` | 2015 Temmuz-Aralık | — |
| `2015-H1` | 2015 Ocak-Haziran | — |
| `2014-H2` | 2014 Temmuz-Aralık | — |
| `2014-H1` | 2014 Ocak-Haziran | — |

---

### 5.2 👤 Ünvan Seçimi
- **Alan adı:** `title`
- **UI Bileşen:** `<RadioGroup>` (kart şeklinde — her ünvan için ikon ve açıklama)
- **Required:** ✅ Evet
- **Default:** `"kadrolu-ogretmen"`
- **Değerler:**

| Değer | Etiket | Açıklama |
|---|---|---|
| `profesor` | Profesör | YÖK akademik kadro |
| `docent` | Doçent | YÖK akademik kadro |
| `dr-ogretim-uyesi` | Doktor Öğretim Üyesi | YÖK akademik kadro |
| `ogretim-gorevlisi` | Öğretim Görevlisi ve Okutman | YÖK akademik kadro |
| `kadrolu-ogretmen` | Kadrolu Öğretmen | MEB |
| `sozlesmeli-ogretmen` | Sözleşmeli Öğretmen | MEB 4/B |
| `ucretli-ogretmen` | Ücretli Öğretmen | MEB ücretli |

> 💡 **UX İyileştirmesi:** Bu seçim, alttaki tüm form alanlarının görünürlüğünü kontrol eder. Akademik kadro seçildiğinde MEB'e özgü alanlar gizlenir.

---

### 5.3 📅 Hesaplama Ayı / Muhasebe Ayı
- **Alan adı:** `calculationMonth` & `accountingMonth`
- **UI Bileşen:** İki adet `<Select>` yan yana
- **Required:** ✅ Evet
- **Default:** Mevcut ay
- **Hesaplama Ayı Değerleri:** `Ocak, Şubat, Mart, Nisan, Mayıs, Haziran` (seçilen yarıyıla göre dinamik)
- **Muhasebe Ayı Değerleri:** `Ocak, Şubat, Mart, Nisan, Mayıs, Haziran, Temmuz, Ağustos, Eylül, Ekim, Kasım, Aralık`

> 💡 **Not:** Hesaplama ayı, seçilen yarıyıl ile sınırlıdır (H1 → Ocak-Haziran, H2 → Temmuz-Aralık).

---

### 5.4 💰 Gelir Vergisi İstisnası (Faydalanılan)
- **Alan adı:** `incomeTaxExemptionUsed`
- **UI Bileşen:** `<CurrencyInput>` (TL formatlı, binlik ayraç, ondalık virgül)
- **Required:** ❌ Hayır
- **Default:** `0`
- **Min:** `0`
- **Max:** `4211.33` (2026 dönemi için — döneme göre değişir)
- **Yardım metni:** "Bu ay daha önce başka bir maaştan faydalanılan GV istisnası tutarı."
- **Format:** `1.234,56 TL`

---

### 5.5 💰 Damga Vergisi İstisnası Uygulanan Matrah
- **Alan adı:** `stampTaxExemptionBase`
- **UI Bileşen:** `<CurrencyInput>`
- **Required:** ❌ Hayır
- **Default:** `0`
- **Min:** `0`
- **Max:** `33030.00` (2026 dönemi için)
- **Yardım metni:** "Bu ay daha önce başka bir maaştan faydalanılan DV istisnası tutarı."

---

### 5.6 🎓 En Son Öğrenim Durumu
- **Alan adı:** `educationLevel`
- **UI Bileşen:** `<RadioGroup>` (3 seçenek, yatay)
- **Required:** ✅ Evet
- **Default:** `"lisans"`
- **Görünürlük:** Sadece akademik olmayan ünvanlarda (öğretmenler için)
- **Değerler:**

| Değer | Etiket |
|---|---|
| `lisans` | Lisans |
| `yuksek-lisans` | Yüksek Lisans |
| `doktora` | Doktora |

---

### 5.7 ⏰ Temel Ders Saatleri

#### 5.7.1 Gündüz
- **Alan:** `dayHours` — Number input (0–500), saat birimi

#### 5.7.2 Nöbet Görevi
- **Alan:** `watchDutyHours` — Number input (0–100)

#### 5.7.3 Gece
- **Alan:** `nightHours` — Number input

#### 5.7.4 Belleticilik
- **Alan:** `boarderDutyHours` — Number input

#### 5.7.5 Sınav Görevi
- **Alan:** `examDutyHours` — Number input

#### 5.7.6 Egzersiz
- **Alan:** `exerciseHours` — Number input

#### 5.7.7 Hizmet İçi (Eğitim)
- **Alan:** `inServiceHours` — Number input

> 💡 **UX:** Tüm saat girişleri için `<HourInput>` özel bileşeni kullanılmalı. Her birinin yanında bilgi tooltip'i bulunmalı.

---

### 5.8 ♿ Özel Eğitim Görevi (%25 Fazla)

| Alan adı | Etiket | UI |
|---|---|---|
| `specialEdDayHours` | %25 Fazla - Gündüz | Number (saat) |
| `specialEdNightHours` | %25 Fazla - Gece | Number (saat) |
| `specialEdBoarderHours` | %25 Fazla - Belleticilik | Number (saat) |
| `specialEdWatchHours` | %25 Fazla - Nöbet Görevi | Number (saat) |

> 💡 Bu grup `<Collapsible>` veya `<Accordion>` içinde verilebilir.

---

### 5.9 📚 Takviye Kursu Görevi

| Alan adı | Etiket | UI |
|---|---|---|
| `tutoringDayHours` | Takviye Kursu - Gündüz | Number (saat) |
| `tutoringNightHours` | Takviye Kursu - Gece | Number (saat) |

---

### 5.10 📖 İYEP Görevi (İlkokullarda Yetiştirme Programı)

| Alan adı | Etiket | UI |
|---|---|---|
| `iyepDayHours` | İYEP - Gündüz | Number (saat) |
| `iyepNightHours` | İYEP - Gece | Number (saat) |

---

### 5.11 📝 Merkezi Sınav Görevi (4 Adet Görev Slotu)

- **Alan adı:** `examDuties` — Array of 4 objects
- **UI Bileşen:** 4 adet `<Select>` veya tek bir dinamik liste (`Add Duty` butonu ile)
- **Required:** ❌ Hayır (her biri opsiyonel)
- **Her slotun değerleri:**

| Değer | Etiket | Açıklama |
|---|---|---|
| `none` | Görev Yok | Varsayılan |
| `bina-sinav-sorumlusu` | Bina Sınav Sorumlusu | — |
| `bina-komisyon-baskani` | Bina Sınav Komisyon Başkanı | — |
| `bina-komisyon-uyesi` | Bina Sınav Komisyon Üyesi | — |
| `salon-baskani` | Salon Başkanı | — |
| `cezaevi-salon-baskani` | Cezaevi Salon Başkanı | — |
| `gozetmen` | Gözetmen | — |
| `cezaevi-gozetmen` | Cezaevi Gözetmen | — |
| `yedek-gozetmen` | Yedek Gözetmen | — |
| `yardimci-engelli-gozetmen` | Yardımcı Engelli Gözetmen | — |
| `e-sinav-salon-baskani` | (E-Sınav) Salon Başkanı | — |
| `e-sinav-gozetmen` | (E-Sınav) Gözetmen | — |
| `e-sinav-salon-baskani-fazla` | (E-Sınav) Salon Başkanı (%20 Fazla) | — |
| `e-sinav-gozetmen-fazla` | (E-Sınav) Gözetmen (%20 Fazla) | — |

> 💡 **UX:** Sabit 4 dropdown yerine, **"+ Görev Ekle"** butonu ile dinamik liste yapılabilir. Maksimum 4 görev kuralı korunur.

---

### 5.12 📊 Gelir Vergisi Oranı Seçimi
- **Alan adı:** `incomeTaxRate`
- **UI Bileşen:** `<RadioGroup>` (yatay, segmented control görünümü)
- **Required:** ✅ Evet
- **Default:** `"otomatik"`
- **Değerler:**

| Değer | Etiket |
|---|---|
| `15` | %15 |
| `20` | %20 |
| `27` | %27 |
| `35` | %35 |
| `otomatik` | Otomatik |

> 💡 **UX:** "Otomatik" seçildiğinde, sistem kümülatif matraha göre uygun dilimi seçer.

---

### 5.13 🔘 İşlem Butonları

| Buton | Aksiyon | UI |
|---|---|---|
| **Hesapla** | Form submit / hesaplama yap | `<Button variant="default">` (primary) |
| **Temizle** | Sadece input alanlarını sıfırla | `<Button variant="outline">` |
| **Sıfırla** | Tüm formu varsayılana döndür | `<Button variant="ghost">` |
| **Bilgileri Yedekle** | LocalStorage / dosya olarak kaydet | `<Button>` + indirme ikonu |
| **Bilgileri Geri Yükle** | Yedekten yükle | File picker |
| **PDF Olarak Kaydet** | jsPDF / react-pdf ile PDF oluştur | `<Button>` |
| **Paylaş** | URL'ye state encode + clipboard | `<Button>` (ek özellik) |

> 💡 **UX İyileştirmesi:** "Hesapla" butonuna gerek kalmamalı — form değiştikçe **canlı hesaplama** yapılmalı. Buton sadece "PDF olarak indir / paylaş" gibi nihai aksiyonlar için kalmalı.

---

## 6. Hesaplama Modülleri

### 6.1 Modül Listesi
1. **Ek Ders Hesaplama** — Tüm ünvanlar
2. **Ücretli Öğretmen Maaş Hesaplama**
3. **Takviye Kursu Ek Ders Ücreti**
4. **Uzman ve Usta Öğretici Maaş Hesaplama**
5. **Kadrolu Öğretmen Ek Ders Ücreti**
6. **Sözleşmeli Öğretmen Ek Ders Ücreti**
7. **Akademik Kadro (Profesör → Okutman) Ek Ders Ücreti**
8. **Merkezi Sınav Görevi Ücreti**

### 6.2 Hesaplama Mimarisi (TypeScript)

```typescript
// lib/calculations/eduhep-engine.ts
interface CalculationInput {
  budgetPeriod: BudgetPeriod;
  title: Title;
  educationLevel?: EducationLevel;
  calculationMonth: Month;
  accountingMonth: Month;
  exemptions: { incomeTax: number; stampTax: number };
  hours: HoursBreakdown;
  examDuties: ExamDuty[];
  incomeTaxRate: TaxRate | 'auto';
}

interface CalculationResult {
  grossAmount: number;          // Brüt
  incomeTax: number;             // Gelir vergisi
  stampTax: number;              // Damga vergisi
  netAmount: number;             // Net (öne çıkan)
  breakdown: {
    dayLessonAmount: number;
    nightLessonAmount: number;
    specialEducationAmount: number;
    tutoringAmount: number;
    iyepAmount: number;
    examDutyAmount: number;
    // ...
  };
  meta: {
    appliedRate: number;
    period: string;
    calculatedAt: Date;
  };
}

export function calculateEduhep(input: CalculationInput): CalculationResult {
  // Saf fonksiyon, side-effect yok
  // Test edilebilir, deterministik
}
```

### 6.3 Hesaplama Sabitleri Yönetimi
Tüm dönemsel katsayılar `lib/constants/budget-periods.ts` içinde JSON olarak tutulmalı:

```typescript
export const BUDGET_PERIODS = {
  '2026-H2': {
    label: '2026 Temmuz-Aralık',
    incomeTaxExemptionMax: 4211.33,
    stampTaxExemptionMax: 33030.00,
    rates: {
      profesor: { gunduz: X, gece: Y },
      // ...
    }
  },
  // ...
} as const;
```

> 💡 Sabitleri kodlamak yerine **ayrı bir JSON dosyasında** tutmak, ileride güncellenmesini kolaylaştırır.

---

## 7. Sayfa ve Bileşen Yapısı

### 7.1 Ana Sayfa (`app/page.tsx`)

```tsx
<div className="min-h-screen bg-background">
  <Header />
  <main className="container mx-auto grid lg:grid-cols-[1fr_400px] gap-8 p-4 lg:p-8">
    {/* Sol: Form */}
    <FormContainer>
      <Section title="Temel Bilgiler" icon={UserIcon}>
        <BudgetPeriodSelect />
        <TitleSelect />
        <MonthSelect />
        <EducationLevelSelect />
      </Section>

      <Section title="Vergi İstisnaları" icon={ReceiptIcon} collapsible>
        <IncomeTaxExemptionInput />
        <StampTaxExemptionInput />
      </Section>

      <Section title="Ders Saatleri" icon={ClockIcon}>
        <BasicLessonHours />
      </Section>

      <Section title="Özel Eğitim (%25 Fazla)" icon={AccessibilityIcon} collapsible>
        <SpecialEducationHours />
      </Section>

      <Section title="Takviye Kursu" icon={BookIcon} collapsible>
        <TutoringHours />
      </Section>

      <Section title="İYEP Görevi" icon={GraduationCapIcon} collapsible>
        <IyepHours />
      </Section>

      <Section title="Merkezi Sınav Görevi" icon={FileTextIcon} collapsible>
        <CentralExamDuties />
      </Section>

      <Section title="Vergi Oranı" icon={PercentIcon}>
        <IncomeTaxRateSelect />
      </Section>
    </FormContainer>

    {/* Sağ: Canlı Sonuç */}
    <aside className="lg:sticky lg:top-8 lg:self-start">
      <LiveResultPanel />
    </aside>
  </main>
  <Footer />
</div>
```

### 7.2 Canlı Sonuç Paneli

```tsx
<Card className="border-2">
  <CardHeader>
    <CardTitle>Hesaplama Sonucu</CardTitle>
    <Badge variant="outline">{period}</Badge>
  </CardHeader>
  <CardContent className="space-y-4">
    <Stat label="Brüt Ücret" value={gross} variant="muted" />
    <Stat label="Gelir Vergisi" value={-incomeTax} variant="negative" />
    <Stat label="Damga Vergisi" value={-stampTax} variant="negative" />
    <Separator />
    <Stat label="Net Ücret" value={net} variant="primary" size="xl" />

    <Collapsible>
      <CollapsibleTrigger>Detayları Göster</CollapsibleTrigger>
      <CollapsibleContent>
        <ResultBreakdown breakdown={breakdown} />
      </CollapsibleContent>
    </Collapsible>

    <div className="flex gap-2">
      <PdfExportButton />
      <ShareButton />
    </div>
  </CardContent>
</Card>
```

---

## 8. Mevcut Siteye Göre UX İyileştirmeleri

| # | Mevcut Sitede | Yeni Tasarımda |
|---|---|---|
| 1 | "Hesapla" butonuna basmak gerekiyor | Form değiştikçe **canlı hesaplama** |
| 2 | Tüm alanlar her zaman gözüküyor | **Conditional rendering** (ünvana göre) |
| 3 | Görsel hiyerarşi zayıf | Bölümlere ayrılmış kartlar + ikonlar |
| 4 | Mobilde yatay kaydırma | Mobile-first, native his |
| 5 | Yardım metni yok | Her alanda **tooltip / popover** |
| 6 | Hata gösterimi zayıf | Inline validation + hata mesajları |
| 7 | Form sıfırlama tek tip | Temizle / Sıfırla / Yedekle ayrı |
| 8 | Karanlık tema yok | Sistem ile uyumlu **dark mode** |
| 9 | Klavye navigasyonu kötü | Tab order optimize, kısayollar |
| 10 | Sonuç yığılı görünüyor | Hiyerarşik, **net ücret büyük** |
| 11 | PDF eski stil | Modern, brand kimliği taşıyan PDF |
| 12 | Geçmiş hesaplamalar yok | LocalStorage ile **son 5 hesaplama** |
| 13 | Paylaşım yok | URL ile **paylaşılabilir state** |
| 14 | Çoklu dil yok | TR/EN seçeneği (i18n hazır) |
| 15 | Animasyon yok | Mikro etkileşimler (Framer Motion) |
| 16 | Erişilebilirlik düşük | WCAG 2.2 AA |
| 17 | SEO zayıf | Next.js metadata API ile optimize |
| 18 | Ünvan değişince form sıfırlanmıyor | Ünvana özgü alanlar otomatik temizlenir |
| 19 | Sayı girişi zorlu | TR formatında, otomatik binlik ayraç |
| 20 | Sonuç ekranı tek seferde gösterilir | Skeleton / progressive loading |

---

## 9. Erişilebilirlik (a11y) Gereksinimleri

- ✅ Tüm input'lar `<label>` ile bağlı.
- ✅ ARIA: `aria-describedby`, `aria-invalid`, `aria-required`.
- ✅ Klavye navigasyonu: Tab, Shift+Tab, Enter, Esc.
- ✅ Focus indicator görünür (Tailwind `focus-visible:ring-2`).
- ✅ Renk kontrastı ≥ 4.5:1.
- ✅ Skip link (header'dan içeriğe atlama).
- ✅ Ekran okuyucu testleri (NVDA, VoiceOver).
- ✅ Form validation hataları sesli okutulur (`role="alert"`).
- ✅ Animasyonlar `prefers-reduced-motion` saygı gösterir.

---

## 10. Geliştirme Aşamaları (Roadmap)

### 🔹 Aşama 1 — Kurulum (1 gün)
1. `npx create-next-app@latest eduhep-2026 --typescript --tailwind --app`
2. shadcn/ui kurulumu: `npx shadcn@latest init`
3. Temel bileşenleri ekle: `button, input, select, card, label, separator, accordion, tooltip, badge`
4. ESLint + Prettier + Husky kurulumu
5. Klasör yapısının oluşturulması

### 🔹 Aşama 2 — Form Mimarisi (3 gün)
1. Zod şemasının yazılması (`lib/schemas/form-schema.ts`)
2. Zustand store kurulumu
3. React Hook Form entegrasyonu
4. Tüm form bileşenlerinin oluşturulması (Bölüm 5'teki tüm alanlar)
5. Conditional rendering mantığı (ünvana göre)

### 🔹 Aşama 3 — Hesaplama Motoru (4 gün)
1. Bütçe dönemi sabit verilerinin JSON formatında girilmesi
2. `eduhep-engine.ts` saf fonksiyon olarak yazılması
3. Vergi hesaplama modülü
4. Sınav görevi ücret modülü
5. **Birim testler** (Vitest) — her ünvan için en az 5 test senaryosu
6. Mevcut site ile sonuçların karşılaştırılması (regression test)

### 🔹 Aşama 4 — UI / UX (3 gün)
1. Header / Footer / ThemeToggle
2. Canlı sonuç paneli
3. Animasyonlar (Framer Motion)
4. Responsive davranış (mobil + tablet + desktop)
5. Dark mode tam destek

### 🔹 Aşama 5 — Ek Özellikler (2 gün)
1. PDF export (react-pdf)
2. LocalStorage ile yedekleme/geri yükleme
3. URL ile paylaşma
4. Geçmiş hesaplamalar (son 5)

### 🔹 Aşama 6 — Cilalama (2 gün)
1. Lighthouse skoru optimizasyonu (hedef: 95+)
2. SEO metadata
3. OpenGraph / Twitter card
4. Sitemap, robots.txt
5. Hata sayfaları (404, 500)
6. Loading states / skeletons

### 🔹 Aşama 7 — Deploy (Yarım gün)
1. Vercel / Cloudflare Pages deployment
2. Custom domain
3. Analytics (Plausible / Vercel Analytics)
4. Sentry (hata izleme)

> **Toplam tahmini süre:** 15–16 gün (1 geliştirici, tam zamanlı)

---

## 📌 Ek Notlar

### Yasal Uyarı (Footer'da bulunmalı)
> Bu uygulamada yer alan bilgiler sadece bilgilendirme amaçlıdır. Yanlış veya eksik bilgi girişinden kaynaklanan hesaplama hatalarından geliştirici sorumlu değildir. Resmi hesaplamalar için kurumunuza danışınız.

### Test Veri Setleri
- Her ünvan için minimum 3 test verisi hazırlanmalı.
- Mevcut `ozkansoft.com` üzerinde aynı veri girilerek sonuç karşılaştırılmalı.
- Tolerans: ±0,01 TL (yuvarlama farkı).

### Performans Hedefleri
- First Contentful Paint < 1.0s
- Largest Contentful Paint < 2.0s
- Total Blocking Time < 200ms
- Cumulative Layout Shift < 0.05
- Lighthouse Performance > 95

---

## 🎯 Başarı Kriterleri

✅ Mevcut sitenin **tüm hesaplama özelliklerini** birebir karşılar.
✅ Mobilde mükemmel çalışır (responsive, touch-friendly).
✅ Lighthouse skoru 4 kategoride de 95+ alır.
✅ WCAG 2.2 AA uyumludur.
✅ Bir hesaplama yapmak < 30 saniye sürer (yeni kullanıcı için).
✅ PDF çıktısı profesyonel ve markalı görünür.
✅ Karanlık temada da kusursuz çalışır.
✅ İlk yüklemede < 100kb JavaScript transferi.

---

**Doküman Versiyonu:** 1.0
**Son Güncelleme:** 26 Nisan 2026
**Kaynak Site:** https://www.ozkansoft.com/eduhep.php
**Hazırlayan:** Claude (Anthropic)