// Tek seferlik scrape scripti.
// ozkansoft.com/eduhep.php sayfasına POST atar, response HTML'inden
// tutar alanlarını parse eder, saatlik ücretleri ve sınav görev ücretlerini
// lib/data/rates.json içine yazar.
//
// Kullanım: node scripts/scrape-rates.mjs

import { writeFile, mkdir } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const OUT = resolve(__dirname, "../lib/data/rates.json");
const URL_BASE = "https://www.ozkansoft.com/eduhep.php";
const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 14_6) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.5 Safari/605.1.15";

const PERIOD_MAP = {
  "2027-H2": 32, "2027-H1": 31, "2026-H2": 30, "2026-H1": 29,
  "2025-H2": 28, "2025-H1": 27, "2024-H2": 26, "2024-H1": 25,
  "2023-H2": 24, "2023-H1": 23, "2022-H2": 22, "2022-H1": 21,
  "2021-H2": 20, "2021-H1": 19, "2020-H2": 18, "2020-H1": 17,
  "2019-H2": 16, "2019-H1": 15, "2018-H2": 14, "2018-H1": 13,
  "2017-H2": 12, "2017-H1": 11, "2016-H2": 10, "2016-H1": 9,
  "2015-H2": 8,  "2015-H1": 7,  "2014-H2": 6,  "2014-H1": 5,
};

const PERIOD_LABELS = {
  "2027-H2": "2027 Temmuz-Aralık", "2027-H1": "2027 Ocak-Haziran",
  "2026-H2": "2026 Temmuz-Aralık", "2026-H1": "2026 Ocak-Haziran",
  "2025-H2": "2025 Temmuz-Aralık", "2025-H1": "2025 Ocak-Haziran",
  "2024-H2": "2024 Temmuz-Aralık", "2024-H1": "2024 Ocak-Haziran",
  "2023-H2": "2023 Temmuz-Aralık", "2023-H1": "2023 Ocak-Haziran",
  "2022-H2": "2022 Temmuz-Aralık", "2022-H1": "2022 Ocak-Haziran",
  "2021-H2": "2021 Temmuz-Aralık", "2021-H1": "2021 Ocak-Haziran",
  "2020-H2": "2020 Temmuz-Aralık", "2020-H1": "2020 Ocak-Haziran",
  "2019-H2": "2019 Temmuz-Aralık", "2019-H1": "2019 Ocak-Haziran",
  "2018-H2": "2018 Temmuz-Aralık", "2018-H1": "2018 Ocak-Haziran",
  "2017-H2": "2017 Temmuz-Aralık", "2017-H1": "2017 Ocak-Haziran",
  "2016-H2": "2016 Temmuz-Aralık", "2016-H1": "2016 Ocak-Haziran",
  "2015-H2": "2015 Temmuz-Aralık", "2015-H1": "2015 Ocak-Haziran",
  "2014-H2": "2014 Temmuz-Aralık", "2014-H1": "2014 Ocak-Haziran",
};

const TITLE_MAP = {
  "profesor": 1, "docent": 2, "dr-ogretim-uyesi": 3,
  "ogretim-gorevlisi": 4, "kadrolu-ogretmen": 5,
  "sozlesmeli-ogretmen": 6, "ucretli-ogretmen": 7,
};

const ED_LEVEL_MAP = { lisans: 0, "yuksek-lisans": 1, doktora: 2 };

const HOUR_FIELDS = [
  "txtGunduz", "txtGece", "txtNobet", "txtBelleticilik",
  "txtSinav", "txtEgzersiz", "txtHizmetici",
  "txtTKGunduz", "txtTKGece",
  "txtIYEPGunduz", "txtIYEPGece",
  "txtOEGGunduz", "txtOEGGece", "txtOEGNobet", "txtOEGBelleticilik",
];

const HOUR_TO_RATE_KEY = {
  txtGunduz: "gunduz", txtGece: "gece", txtNobet: "nobet",
  txtBelleticilik: "belleticilik", txtSinav: "sinav",
  txtEgzersiz: "egzersiz", txtHizmetici: "hizmetici",
  txtTKGunduz: "tk-gunduz", txtTKGece: "tk-gece",
  txtIYEPGunduz: "iyep-gunduz", txtIYEPGece: "iyep-gece",
  txtOEGGunduz: "oeg-gunduz", txtOEGGece: "oeg-gece",
  txtOEGNobet: "oeg-nobet", txtOEGBelleticilik: "oeg-belleticilik",
};

const TUTAR_FIELD = {
  txtGunduz: "txtGunduzTutar", txtGece: "txtGeceTutar",
  txtNobet: "txtNobetTutar", txtBelleticilik: "txtBelleticilikTutar",
  txtSinav: "txtSinavGoreviTutar", txtEgzersiz: "txtEgzersizTutar",
  txtHizmetici: "txtHizmeticiTutar",
  txtTKGunduz: "txtTKGunduzTutar", txtTKGece: "txtTKGeceTutar",
  txtIYEPGunduz: "txtIYEPGunduzTutar", txtIYEPGece: "txtIYEPGeceTutar",
  txtOEGGunduz: "txtY25FGunduzTutar", txtOEGGece: "txtY25FGeceTutar",
  txtOEGNobet: "txtY25FNobetTutar", txtOEGBelleticilik: "txtY25FBelleticilikTutar",
};

const EXAM_DUTIES = {
  "bina-sinav-sorumlusu": 1, "bina-komisyon-baskani": 2,
  "bina-komisyon-uyesi": 3, "salon-baskani": 4,
  "cezaevi-salon-baskani": 5, "gozetmen": 6,
  "cezaevi-gozetmen": 7, "yedek-gozetmen": 8,
  "yardimci-engelli-gozetmen": 9, "e-sinav-salon-baskani": 10,
  "e-sinav-gozetmen": 11, "e-sinav-salon-baskani-fazla": 12,
  "e-sinav-gozetmen-fazla": 13,
};

const ACADEMIC_TITLES = new Set(["profesor", "docent", "dr-ogretim-uyesi", "ogretim-gorevlisi"]);

// -------------------------------------------------------------------

function parseTL(s) {
  if (!s || typeof s !== "string") return 0;
  // "1.234,56" → 1234.56
  const cleaned = s.replace(/\./g, "").replace(",", ".").replace(/[^\d.\-]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : 0;
}

function extractFreshToken(html) {
  const m = html.match(/id="htxtTKNEDUHEP"[^>]*value="([^"]+)"/);
  return m ? m[1] : null;
}

function extractResultFields(html) {
  const out = {};
  // Both <input class="...spe-text-result..."> and ones with name=...Tutar
  const re = /<input[^>]*\bname="([^"]+)"[^>]*\bvalue="([^"]*)"[^>]*>/g;
  let m;
  while ((m = re.exec(html)) !== null) {
    const name = m[1];
    if (/Tutar$|GelirlerToplami|Kalan|Faydalanilan|GVKes|DVKes|Net|VergiMatrahi/.test(name)) {
      out[name] = m[2];
    }
  }
  return out;
}

async function getToken() {
  const res = await fetch(URL_BASE, {
    headers: { "User-Agent": UA, Accept: "text/html" },
  });
  const html = await res.text();
  const token = extractFreshToken(html);
  if (!token) throw new Error("Could not extract htxtTKNEDUHEP token from GET");
  return token;
}

async function postProbe({ token, period, title, edLevel, fields, extras }) {
  const body = new URLSearchParams();
  body.set("hesapla", "1");
  body.set("htxtTKNEDUHEP", token);
  body.set("slcButceDonemiSecimi", String(PERIOD_MAP[period]));
  body.set("slcUnvanSecimi", String(TITLE_MAP[title]));
  body.set("slcEnSonOgrenimDurumu", String(edLevel ?? 0));
  // H1 → calculation month in Jan-Jun, accounting Mar-Apr; for H2 we cheat
  // by sticking with Jan / Mar (period selection is what matters for rate).
  body.set("slcHesaplanacakAySecimi", "1");
  body.set("slcMuhasebelestirilenAySecimi", "3");
  body.set("rdoGVOS", "auto");
  body.set("txtGVIstisnasiFaydalanilanInt", "0");
  body.set("txtGVIstisnasiFaydalanilanFra", "00");
  body.set("txtDVIstisnasiFaydalanilanInt", "0");
  body.set("txtDVIstisnasiFaydalanilanFra", "00");
  // Initialise all hour fields to 0
  for (const f of HOUR_FIELDS) body.set(f, "0");
  body.set("slcMerkeziSinavGorevi1", "0");
  body.set("slcMerkeziSinavGorevi2", "0");
  body.set("slcMerkeziSinavGorevi3", "0");
  body.set("slcMerkeziSinavGorevi4", "0");
  // Apply our probe fields
  for (const [k, v] of Object.entries(fields)) body.set(k, String(v));
  if (extras) for (const [k, v] of Object.entries(extras)) body.set(k, String(v));

  const res = await fetch(URL_BASE, {
    method: "POST",
    headers: {
      "User-Agent": UA,
      "Content-Type": "application/x-www-form-urlencoded",
      Accept: "text/html",
    },
    body,
  });
  const html = await res.text();
  return { html, fields: extractResultFields(html) };
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function probeRates({ token, period, title, edLevel }) {
  // Single POST: set every hour field to 10 and read each *Tutar response.
  const probeFields = Object.fromEntries(HOUR_FIELDS.map((f) => [f, 10]));
  const { fields } = await postProbe({ token, period, title, edLevel, fields: probeFields });
  const rates = {};
  for (const [hourField, rateKey] of Object.entries(HOUR_TO_RATE_KEY)) {
    const tutarName = TUTAR_FIELD[hourField];
    const raw = fields[tutarName];
    if (raw === undefined) {
      rates[rateKey] = null;
      continue;
    }
    const tl = parseTL(raw);
    rates[rateKey] = tl > 0 ? +(tl / 10).toFixed(4) : 0;
  }
  return rates;
}

async function probeExamDuty({ token, period, title, edLevel, dutyId }) {
  const probeFields = Object.fromEntries(HOUR_FIELDS.map((f) => [f, 0]));
  const { fields } = await postProbe({
    token, period, title, edLevel,
    fields: probeFields,
    extras: { slcMerkeziSinavGorevi1: dutyId },
  });
  // Single duty selected → txtMSGToplamTutar equals that duty's fee.
  const raw = fields["txtMSGToplamTutar"] || fields["txtGelirlerToplami"];
  return parseTL(raw);
}

async function main() {
  console.log("Fetching fresh token…");
  let token = await getToken();
  console.log("Token:", token.slice(0, 12) + "…");

  const rates = {};
  const examFees = {};
  const errors = [];

  // Probe a token-refresh helper every N requests just in case.
  let reqCount = 0;
  const REFRESH_EVERY = 200;

  for (const period of Object.keys(PERIOD_MAP)) {
    rates[period] = {};
    for (const title of Object.keys(TITLE_MAP)) {
      const isAcademic = ACADEMIC_TITLES.has(title);
      const edLevels = isAcademic ? [{ key: "lisans", id: 0 }] : [
        { key: "lisans", id: 0 },
        { key: "yuksek-lisans", id: 1 },
        { key: "doktora", id: 2 },
      ];
      rates[period][title] = {};
      for (const ed of edLevels) {
        try {
          const r = await probeRates({ token, period, title, edLevel: ed.id });
          rates[period][title][ed.key] = r;
          process.stdout.write(`✓ ${period} / ${title} / ${ed.key}\n`);
        } catch (e) {
          errors.push({ period, title, ed: ed.key, error: String(e) });
          process.stdout.write(`✗ ${period} / ${title} / ${ed.key} — ${e}\n`);
        }
        await sleep(80);
        if (++reqCount % REFRESH_EVERY === 0) {
          token = await getToken();
          console.log(`(refreshed token after ${reqCount} requests)`);
        }
      }
    }
  }

  // Sınav görev ücretleri — sadece güncel dönem (2026-H1) ve kadrolu öğretmen
  // referans olarak alınır. Çoğu görev tek-tip ücret olduğu için ünvanlardan
  // bağımsızdır. UI hepsi için aynı tabloyu kullanır.
  console.log("\nProbing exam duty fees…");
  examFees["2026-H2"] = {};
  examFees["2026-H1"] = {};
  for (const period of ["2026-H1", "2026-H2"]) {
    for (const [duty, id] of Object.entries(EXAM_DUTIES)) {
      try {
        const fee = await probeExamDuty({
          token, period, title: "kadrolu-ogretmen", edLevel: 0, dutyId: id,
        });
        examFees[period][duty] = fee;
        process.stdout.write(`✓ exam ${period} / ${duty} = ${fee}\n`);
      } catch (e) {
        examFees[period][duty] = null;
      }
      await sleep(80);
    }
  }

  const periods = {};
  for (const [key, id] of Object.entries(PERIOD_MAP)) {
    periods[key] = { id, label: PERIOD_LABELS[key] };
  }

  const data = {
    scrapedAt: new Date().toISOString(),
    source: URL_BASE,
    periods,
    incomeTaxExemption: {
      // İstisna tutarları, dönem 29 (2026-H1) için canlı sitede 4.211,33 TL.
      // Diğer dönemler için ileride güncellenir; MVP için tek değer kullanılır.
      "2026-H1": 4211.33, "2026-H2": 4211.33,
    },
    stampTaxExemption: {
      "2026-H1": 33030.0, "2026-H2": 33030.0,
    },
    stampTaxRate: 0.00759,
    rates,
    examFees,
    errors,
  };

  await mkdir(dirname(OUT), { recursive: true });
  await writeFile(OUT, JSON.stringify(data, null, 2), "utf8");
  console.log(`\nWrote ${OUT}`);
  console.log(`Errors: ${errors.length}`);
}

main().catch((e) => {
  console.error("FATAL:", e);
  process.exit(1);
});
