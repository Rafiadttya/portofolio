(function () {

  const STORAGE_KEY = "portfolio-lang";
  const SUPPORTED = ["id", "en"];
  const FADE_MS = 150;                 

  const cache = {};                  
  const listeners = [];                
  let lang = "en";

  async function load(code) {
    if (cache[code]) return cache[code];

    const response = await fetch(`locales/${code}.json`);
    if (!response.ok) throw new Error(`locales/${code}.json tidak ditemukan`);

    cache[code] = await response.json();
    return cache[code];
  }


  function lookup(dict, key) {
    return key.split(".").reduce((obj, k) => (obj == null ? undefined : obj[k]), dict);
  }

  function t(key) {
    const own = lookup(cache[lang] || {}, key);
    if (own !== undefined) return own;

    const fallback = lookup(cache.en || {}, key);
    return fallback !== undefined ? fallback : key;
  }

  function detectLang() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (SUPPORTED.includes(saved)) return saved;
    } catch (e) { /* localStorage tidak tersedia, abaikan */ }

    return (navigator.language || "").toLowerCase().startsWith("id") ? "id" : "en";
  }

  function apply() {
    document.documentElement.lang = lang;

    document.querySelectorAll("[data-i18n]").forEach((el) => {
      el.textContent = t(el.dataset.i18n);
    });

    document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
      el.dataset.i18nAttr.split(";").forEach((pair) => {
        const [attr, key] = pair.split(":");
        el.setAttribute(attr.trim(), t(key.trim()));
      });
    });

    const meta = document.querySelector('meta[name="description"]');
    if (meta) meta.setAttribute("content", t("meta.description"));

    document.querySelectorAll("[data-lang]").forEach((btn) => {
      btn.setAttribute("aria-pressed", btn.dataset.lang === lang);
    });
  }

  async function setLang(next) {
    if (next === lang || !SUPPORTED.includes(next)) return;

    document.body.classList.add("switching");               

    try {
      await Promise.all([load(next), new Promise((r) => setTimeout(r, FADE_MS))]);
    } catch (e) {
      console.error(e);
      document.body.classList.remove("switching");
      return;
    }

    lang = next;
    try { localStorage.setItem(STORAGE_KEY, lang); } catch (e) { }

    apply();
    listeners.forEach((fn) => fn(lang));                    

    document.body.classList.remove("switching");            
  }

  async function init() {
    lang = detectLang();

    try {
      await load(lang);
      if (lang !== "en") load("en").catch(() => {});       
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
