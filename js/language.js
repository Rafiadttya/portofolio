/* ==========================================================
   language.js — sistem multi-bahasa (ID / EN)

   Tugas file ini:
   - memuat terjemahan dari locales/id.json dan locales/en.json
   - menerjemahkan elemen ber-atribut data-i18n / data-i18n-attr
   - mengganti bahasa (dengan fade) dan menyimpannya di browser

   Pemakaian di file lain:
     language.t("nav.home")        -> teks sesuai bahasa aktif
     language.onChange(fungsi)     -> dijalankan saat bahasa berganti
   ========================================================== */
(function () {

  const STORAGE_KEY = "portfolio-lang";
  const SUPPORTED = ["id", "en"];
  const FADE_MS = 150;                 // harus sama dengan transisi di css/effects.css

  const cache = {};                    // terjemahan yang sudah dimuat
  const listeners = [];                // fungsi yang dipanggil saat bahasa berganti
  let lang = "en";


  /* ---------- Memuat file terjemahan ---------- */

  async function load(code) {
    if (cache[code]) return cache[code];

    const response = await fetch(`locales/${code}.json`);
    if (!response.ok) throw new Error(`locales/${code}.json tidak ditemukan`);

    cache[code] = await response.json();
    return cache[code];
  }


  /* ---------- Mengambil teks berdasarkan kunci ----------
     "nav.home" -> dict.nav.home. Jika belum ada di bahasa aktif,
     dicoba bahasa Inggris; jika tetap tidak ada, kuncinya ditampilkan. */

  function lookup(dict, key) {
    return key.split(".").reduce((obj, k) => (obj == null ? undefined : obj[k]), dict);
  }

  function t(key) {
    const own = lookup(cache[lang] || {}, key);
    if (own !== undefined) return own;

    const fallback = lookup(cache.en || {}, key);
    return fallback !== undefined ? fallback : key;
  }


  /* ---------- Bahasa awal ----------
     Urutan: pilihan tersimpan -> bahasa browser (id/en) -> EN */

  function detectLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.includes(saved)) return saved;
    } catch (e) { /* localStorage tidak tersedia, abaikan */ }

    return (navigator.language || "").toLowerCase().startsWith("id") ? "id" : "en";
  }


  /* ---------- Menerapkan terjemahan ke halaman ---------- */

  function apply() {
    document.documentElement.lang = lang;

    // Teks biasa: <p data-i18n="hero.sub1"></p>
    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });

    // Atribut: data-i18n-attr="alt:hero.photoAlt;aria-label:nav.menu"
    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":");
        el.setAttribute(attr.trim(), t(key.trim()));
      });
    });

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.description"));

    // Tandai tombol bahasa yang aktif
    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.lang === lang);
    });
  }


  /* ---------- Mengganti bahasa ---------- */

  async function setLang(next) {
    if (next === lang || !SUPPORTED.includes(next)) return;

    document.body.classList.add("switching");               // fade out

    try {
      // Muat file bahasa baru sambil menunggu fade selesai
      await Promise.all([load(next), new Promise((r) => setTimeout(r, FADE_MS))]);
    } catch (e) {
      console.error(e);
      document.body.classList.remove("switching");
      return;
    }

    lang = next;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { /* abaikan */ }

    apply();
    listeners.forEach((fn) => fn(lang));                    // render ulang bagian dinamis

    document.body.classList.remove("switching");            // fade in
  }


  /* ---------- Dipanggil sekali oleh main.js ---------- */

  async function init() {
    lang = detectLang();

    try {
      await load(lang);
      if (lang !== "en") load("en").catch(() => {});        // cadangan jika ada kunci yang kosong
    } catch (e) {
      console.error(e, "\nBuka website lewat server (mis. Five Server), bukan klik dua kali index.html.");
    }

    apply();

    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.addEventListener("click", () => setLang(btn.dataset.lang));
    });
  }


  window.language = {
    init,
    t,
    apply,
    setLang,
    getLang: () => lang,
    onChange: (fn) => listeners.push(fn),
  };

})();
