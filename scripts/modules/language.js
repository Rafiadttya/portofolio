import { qs, qsa } from "../utils/dom.js";

const STORAGE_KEY = "portfolio-lang";
const SUPPORTED = ["id", "en"];
const FADE_MS = 150;

const cache = {};
const listeners = [];
let current = "en";

async function loadLocale(code) {
  if (cache[code]) return cache[code];

  const response = await fetch(`locales/${code}.json`);
  if (!response.ok) throw new Error(`locales/${code}.json not found`);

  cache[code] = await response.json();
  return cache[code];
}

const lookup = (dictionary, key) =>
  key.split(".").reduce((node, part) => node?.[part], dictionary);

export function t(key) {
  const own = lookup(cache[current], key);
  if (own !== undefined) return own;

  const fallback = lookup(cache.en, key);
  return fallback !== undefined ? fallback : key;
}

function detectLanguage() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (SUPPORTED.includes(saved)) return saved;
  } catch (error) {
    console.warn("localStorage unavailable", error);
  }

  return (navigator.language || "").toLowerCase().startsWith("id") ? "id" : "en";
}

export function applyTranslations() {
  document.documentElement.lang = current;

  qsa("[data-i18n]").forEach((element) => {
    element.textContent = t(element.dataset.i18n);
  });

  qsa("[data-i18n-attr]").forEach((element) => {
    element.dataset.i18nAttr.split(";").forEach((pair) => {
      const [attribute, key] = pair.split(":");
      element.setAttribute(attribute.trim(), t(key.trim()));
    });
  });

  qs('meta[name="description"]')?.setAttribute("content", t("meta.description"));

  qsa("[data-lang]").forEach((button) => {
    button.setAttribute("aria-pressed", button.dataset.lang === current);
  });
}

export async function setLanguage(next) {
  if (next === current || !SUPPORTED.includes(next)) return;

  document.body.classList.add("switching");

  try {
    await Promise.all([loadLocale(next), new Promise((resolve) => setTimeout(resolve, FADE_MS))]);
  } catch (error) {
    console.error(error);
    document.body.classList.remove("switching");
    return;
  }

  current = next;

  try {
    localStorage.setItem(STORAGE_KEY, current);
  } catch (error) {
    console.warn("localStorage unavailable", error);
  }

  applyTranslations();
  listeners.forEach((listener) => listener(current));
  document.body.classList.remove("switching");
}

export async function initLanguage() {
  current = detectLanguage();

  try {
    await loadLocale(current);
    if (current !== "en") loadLocale("en").catch(() => {});
  } catch (error) {
    console.error(error, "\nServe the site over HTTP (e.g. Five Server) instead of opening index.html directly.");
  }

  applyTranslations();

  qsa("[data-lang]").forEach((button) => {
    button.addEventListener("click", () => setLanguage(button.dataset.lang));
  });
}

export const onLanguageChange = (listener) => listeners.push(listener);

export const getLanguage = () => current;
