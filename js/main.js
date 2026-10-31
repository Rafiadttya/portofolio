const $ = (s, r = document) => r.querySelector(s);
const esc = s => String(s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const mail = "mailto:" + PROFILE.email;

/* Social & kontak */
const social = `<a href="${PROFILE.github}" target="_blank" rel="noopener">GitHub</a><a href="${PROFILE.linkedin}" target="_blank" rel="noopener">LinkedIn</a><a href="${mail}">Email</a>`;
$("#social").innerHTML = $("#fsocial").innerHTML = social;
$("#clinks").innerHTML = `<a href="${mail}">${esc(PROFILE.email)}</a><a href="${PROFILE.github}" target="_blank" rel="noopener">github.com/Rafiadttya</a><a href="${PROFILE.linkedin}" target="_blank" rel="noopener">LinkedIn</a>`;
$("#mailbtn").href = mail;
$("#year").textContent = new Date().getFullYear();

/* Skills */
const tech = (s, status) => `<div class="tech"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/${s[1]}/${s[1]}-original.svg" alt="" loading="lazy" onerror="this.style.display='none'"><b>${s[0]}</b><small>${status}</small></div>`;
$("#using").innerHTML = SKILLS.using.map(s => tech(s, "Using")).join("");
$("#learning").innerHTML = SKILLS.learning.map(s => tech(s, "Learning")).join("");

/* Projects + filter */
const btn = (label, url, primary) => url
  ? `<a class="btn sm${primary ? " primary" : ""}" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`
  : `<span class="btn sm" aria-disabled="true">${label} · Coming Soon</span>`;
function renderProjects(f) {
  const list = PROJECTS.filter(p => f === "All Projects" || p.category === f);
  $("#cards").innerHTML = list.length ? list.map(p => `
    <article class="card">
      <div class="thumb">${p.image ? `<img src="${esc(p.image)}" alt="Tampilan ${esc(p.title)}" loading="lazy">` : esc(p.title.split(" ").slice(0,2).map(w => w[0]).join(""))}</div>
      <div class="body">
        ${p.placeholder ? '<span class="badge">Placeholder — ganti dengan project asli</span>' : ""}
        <h3>${esc(p.title)}</h3><p>${esc(p.desc)}</p>
        <div class="tags">${p.tags.map(t => `<span>${esc(t)}</span>`).join("")}</div>
        <div class="acts">${btn("GitHub", p.github)}${btn("Live Demo", p.demo, true)}</div>
      </div></article>`).join("") : '<p class="lead">Belum ada project di kategori ini.</p>';
}
$("#filters").innerHTML = FILTERS.map((f, i) => `<button class="chip" aria-pressed="${i === 0}">${f}</button>`).join("");
$("#filters").addEventListener("click", e => {
  const b = e.target.closest(".chip"); if (!b) return;
  document.querySelectorAll(".chip").forEach(c => c.setAttribute("aria-pressed", c === b));
  renderProjects(b.textContent);
});
renderProjects("All Projects");

/* Timeline */
$("#timeline").innerHTML = JOURNEY.map(j => `<li><time>${j[0]}</time><h3>${j[1]}</h3><p>${j[2]}</p></li>`).join("");

/* Reveal on scroll */
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add("on"); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll(".rv").forEach(el => io.observe(el));

/* Active nav */
const links = [...document.querySelectorAll("a.l")];
const so = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) links.forEach(a => a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
}), { rootMargin: "-45% 0px -50% 0px" });
document.querySelectorAll("main section").forEach(s => so.observe(s));

/* Mobile menu & back to top */
const burger = $(".burger"), menu = $("#menu");
burger.addEventListener("click", () => burger.setAttribute("aria-expanded", menu.classList.toggle("open")));
menu.addEventListener("click", e => { if (e.target.closest("a")) { menu.classList.remove("open"); burger.setAttribute("aria-expanded", false); } });

// REVISI: Mengganti 'top' menjadi 'topBtn' agar tidak bentrok dengan window.top
const topBtn = $("#top");
addEventListener("scroll", () => topBtn.classList.toggle("show", scrollY > 600), { passive: true });
topBtn.addEventListener("click", () => scrollTo({ top: 0 }));

/* Form: validasi, lalu buka aplikasi email (tanpa klaim terkirim) */
$("#form").addEventListener("submit", e => {
  e.preventDefault();
  const d = Object.fromEntries(new FormData(e.target));
  const errs = {
    name: d.name.trim().length < 2 ? "Isi nama minimal 2 karakter." : "",
    email: !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(d.email.trim()) ? "Masukkan alamat email yang valid." : "",
    message: d.message.trim().length < 10 ? "Pesan minimal 10 karakter." : ""
  };
  document.querySelectorAll(".err").forEach(s => s.textContent = errs[s.dataset.for]);
  if (Object.values(errs).some(Boolean)) return;
  const body = `${d.message}\n\n— ${d.name} (${d.email})`;
  location.href = `${mail}?subject=${encodeURIComponent("Pesan dari " + d.name)}&body=${encodeURIComponent(body)}`;
  $("#status").textContent = "Aplikasi email dibuka. Pesan baru terkirim setelah Anda menekan Kirim di sana.";
});