(function () {

  const $ = (selector, root = document) => root.querySelector(selector);

  function initReveal() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("on");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.05 }
    );

    document.querySelectorAll(".rv").forEach((el) => observer.observe(el));
  }

  function initActiveLink() {
    const navLinks = [...document.querySelectorAll("a.l")];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((a) => {
            a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id);
          });
        });
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );

    document.querySelectorAll("main section").forEach((s) => observer.observe(s));
  }


  function initMobileMenu() {
    const burger = $(".burger");
    const menu = $("#menu");

    burger.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("open");
      burger.setAttribute("aria-expanded", isOpen);
    });

    menu.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", false);
      }
    });
  }

  function initBackToTop() {
    const button = $("#top");

    window.addEventListener(
      "scroll",
      () => button.classList.toggle("show", window.scrollY > 600),
      { passive: true }
    );

    button.addEventListener("click", () => window.scrollTo({ top: 0 }));
  }




  function initProgress() {
    const bar = $("#progress");

    function update() {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const ratio = max > 0 ? window.scrollY / max : 0;
      bar.style.transform = `scaleX(${Math.min(1, ratio)})`;
    }

    window.addEventListener("scroll", update, { passive: true });
    update();
  }


  function init() {
    initProgress();
    initReveal();
    initActiveLink();
    initMobileMenu();
    initBackToTop();
  }

  window.navigation = { init };

})();
