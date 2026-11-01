import { qs, qsa } from "../utils/dom.js";

const BACK_TO_TOP_OFFSET = 600;

function initReveal() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        entry.target.classList.add("on");
        observer.unobserve(entry.target);
      });
    },
    { threshold: 0.05 }
  );

  qsa(".rv").forEach((element) => observer.observe(element));
}

function initProgress() {
  const bar = qs("#progress");

  const update = () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const ratio = max > 0 ? window.scrollY / max : 0;
    bar.style.transform = `scaleX(${Math.min(1, ratio)})`;
  };

  window.addEventListener("scroll", update, { passive: true });
  update();
}

function initBackToTop() {
  const button = qs("#top");

  window.addEventListener(
    "scroll",
    () => button.classList.toggle("show", window.scrollY > BACK_TO_TOP_OFFSET),
    { passive: true }
  );

  button.addEventListener("click", () => window.scrollTo({ top: 0 }));
}

export function initScrollEffects() {
  initProgress();
  initReveal();
  initBackToTop();
}
