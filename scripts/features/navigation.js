import { qs, qsa } from "../utils/dom.js";

function initActiveLink() {
  const links = qsa("a.l");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        links.forEach((link) => {
          link.classList.toggle("active", link.getAttribute("href") === `#${entry.target.id}`);
        });
      });
    },
    { rootMargin: "-45% 0px -50% 0px" }
  );

  qsa("main section").forEach((section) => observer.observe(section));
}

function initMobileMenu() {
  const burger = qs(".burger");
  const menu = qs("#menu");

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", isOpen);
  });

  menu.addEventListener("click", (event) => {
    if (!event.target.closest("a")) return;

    menu.classList.remove("open");
    burger.setAttribute("aria-expanded", false);
  });
}

export function initNavigation() {
  initActiveLink();
  initMobileMenu();
}
