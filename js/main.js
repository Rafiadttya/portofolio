/* ==========================================================
   main.js — membuat isi halaman dari data di js/data.js
   Dibungkus (function () { ... })() agar nama variabel tidak
   bentrok dengan nama bawaan browser (mis. "top", "name").
   ========================================================== */
(function () {

  /* ---------- Fungsi bantu ---------- */

  // Singkatan untuk document.querySelector
  const $ = (selector, root = document) => root.querySelector(selector);

  // Mengamankan teks sebelum dimasukkan ke HTML
  const esc = (text) =>
    String(text).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));

  const mailLink = "mailto:" + PROFILE.email;


  /* ---------- 1. Social & kontak ---------- */

  const socialHTML = `
    <a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a>
    <a href="${PROFILE.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
    <a href="${mailLink}">Email</a>
  `;

  $("#social").innerHTML = socialHTML;
  $("#fsocial").innerHTML = socialHTML;

  $("#clinks").innerHTML = `
    <a href="${mailLink}">${esc(PROFILE.email)}</a>
    <a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a>
    <a href="${PROFILE.linkedin}" target="_blank" rel="noopener">LinkedIn</a>
  `;

  $("#mailbtn").href = mailLink;
  $("#year").textContent = new Date().getFullYear();


  /* ---------- 2. Skills ---------- */

  // skill = ["Nama", "nama-icon-devicon"]
  function techCard(skill, status) {
    const iconUrl =
      "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/" +
      skill[1] + "/" + skill[1] + "-original.svg";

    return `
      <div class="tech">
        <img src="${iconUrl}" alt="" loading="lazy" onerror="this.style.display='none'">
        <b>${skill[0]}</b>
        <small>${status}</small>
      </div>
    `;
  }

  $("#using").innerHTML = SKILLS.using.map((s) => techCard(s, "Using")).join("");
  $("#learning").innerHTML = SKILLS.learning.map((s) => techCard(s, "Learning")).join("");


  /* ---------- 3. Projects + filter ---------- */

  // Tombol link: aktif jika ada URL, "Coming Soon" jika belum ada
  function linkButton(label, url, isPrimary) {
    if (url) {
      const cls = isPrimary ? "btn sm primary" : "btn sm";
      return `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`;
    }
    return `<span class="btn sm" aria-disabled="true">${label} · Coming Soon</span>`;
  }

  function projectCard(p) {
    // Thumbnail: gambar jika ada, jika tidak pakai inisial judul
    const initials = p.title.split(" ").slice(0, 2).map((w) => w[0]).join("");
    const thumb = p.image
      ? `<img src="${esc(p.image)}" alt="Tampilan ${esc(p.title)}" loading="lazy">`
      : esc(initials);

    const badge = p.placeholder
      ? '<span class="badge">Placeholder — ganti dengan project asli</span>'
      : "";

    const tags = p.tags.map((t) => `<span>${esc(t)}</span>`).join("");

    return `
      <article class="card">
        <div class="thumb">${thumb}</div>
        <div class="body">
          ${badge}
          <h3>${esc(p.title)}</h3>
          <p>${esc(p.desc)}</p>
          <div class="tags">${tags}</div>
          <div class="acts">
            ${linkButton("GitHub", p.github, false)}
            ${linkButton("Live Demo", p.demo, true)}
          </div>
        </div>
      </article>
    `;
  }

  function renderProjects(filter) {
    const list = PROJECTS.filter(
      (p) => filter === "All Projects" || p.category === filter
    );

    $("#cards").innerHTML = list.length
      ? list.map(projectCard).join("")
      : '<p class="lead">Belum ada project di kategori ini.</p>';
  }

  // Tombol filter
  $("#filters").innerHTML = FILTERS.map(
    (f, i) => `<button class="chip" aria-pressed="${i === 0}">${f}</button>`
  ).join("");

  $("#filters").addEventListener("click", (e) => {
    const clicked = e.target.closest(".chip");
    if (!clicked) return;

    document.querySelectorAll(".chip").forEach((chip) => {
      chip.setAttribute("aria-pressed", chip === clicked);
    });

    renderProjects(clicked.textContent);
  });

  renderProjects("All Projects");


  /* ---------- 4. Timeline ---------- */

  $("#timeline").innerHTML = JOURNEY.map(
    (j) => `
      <li>
        <time>${j[0]}</time>
        <h3>${j[1]}</h3>
        <p>${j[2]}</p>
      </li>
    `
  ).join("");


  /* ---------- 5. Animasi muncul saat scroll ---------- */

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("on");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.05 }
  );

  document.querySelectorAll(".rv").forEach((el) => revealObserver.observe(el));


  /* ---------- 6. Menu aktif saat scroll ---------- */

  const navLinks = [...document.querySelectorAll("a.l")];

  const sectionObserver = new IntersectionObserver(
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

  document.querySelectorAll("main section").forEach((s) => sectionObserver.observe(s));


  /* ---------- 7. Menu mobile & tombol ke atas ---------- */

  const burger = $(".burger");
  const menu = $("#menu");

  burger.addEventListener("click", () => {
    const isOpen = menu.classList.toggle("open");
    burger.setAttribute("aria-expanded", isOpen);
  });

  // Tutup menu setelah salah satu link diklik
  menu.addEventListener("click", (e) => {
    if (e.target.closest("a")) {
      menu.classList.remove("open");
      burger.setAttribute("aria-expanded", false);
    }
  });

  const backToTop = $("#top");

  window.addEventListener(
    "scroll",
    () => backToTop.classList.toggle("show", window.scrollY > 600),
    { passive: true }
  );

  backToTop.addEventListener("click", () => window.scrollTo({ top: 0 }));


  /* ---------- 8. Form kontak ---------- */
  // Validasi dulu, lalu buka aplikasi email.
  // Tidak ada klaim "terkirim" karena belum ada layanan pengiriman.

  $("#form").addEventListener("submit", (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));

    const errors = {
      name: data.name.trim().length < 2
        ? "Isi nama minimal 2 karakter."
        : "",
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim())
        ? "Masukkan alamat email yang valid."
        : "",
      message: data.message.trim().length < 10
        ? "Pesan minimal 10 karakter."
        : "",
    };

    document.querySelectorAll(".err").forEach((el) => {
      el.textContent = errors[el.dataset.for];
    });

    if (Object.values(errors).some(Boolean)) return;

    const subject = encodeURIComponent("Pesan dari " + data.name);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);

    window.location.href = `${mailLink}?subject=${subject}&body=${body}`;

    $("#status").textContent =
      "Aplikasi email dibuka. Pesan baru terkirim setelah Anda menekan Kirim di sana.";
  });

})();
