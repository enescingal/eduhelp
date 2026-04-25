# EDUHEP 2026

Modern, hızlı ve mobil uyumlu **ek ders ücreti, ücretli öğretmen, usta öğretici, takviye kursu ve merkezi sınav görev ücreti** hesaplama aracı.

[ozkansoft.com/eduhep.php](https://www.ozkansoft.com/eduhep.php) sitesinin Next.js + shadcn/ui ile yeniden yazılmış sürümü.

## Özellikler

- **Canlı hesaplama** — formu doldurdukça sonuç anında güncellenir
- 28 bütçe dönemi (2014-H1 → 2027-H2), 7 ünvan, 3 öğrenim seviyesi
- 13 farklı merkezi sınav görev ücreti
- Türkiye mevzuatına uygun GV/DV istisna mantığı
- Karanlık/aydınlık tema
- Mobil-öncelikli, klavye dostu, erişilebilir

## Teknoloji

Next.js 15 · React 19 · TypeScript · Tailwind CSS v4 · shadcn/ui · Zustand · Radix UI

## Geliştirme

```bash
npm install
npm run dev    # http://localhost:3000
```

Hesaplama oranlarını yeniden çekmek için:

```bash
npm run scrape  # ozkansoft.com'a POST atar, lib/data/rates.json üretir (~1-2 dk)
```

## Yasal Uyarı

Bu uygulamadaki bilgiler sadece bilgilendirme amaçlıdır. Resmi hesaplamalar için kurumunuza danışınız.
