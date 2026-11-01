(function () {

  const $ = (selector, root = document) => root.querySelector(selector);
  const t = (key) => language.t(key);          // teks sesuai bahasa aktif

  const esc = (text) =>
    String(text).replace(/[&<>"']/g, (c) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    }[c]));

  const mailLink = "mailto:" + PROFILE.email;
  let currentFilter = "all";                  

  function renderContactLinks() {
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
  }

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

  function renderSkills() {
    $("#using").innerHTML = SKILLS.using
      .map((s) => techCard(s, t("skills.statusUsing"))).join("");

    $("#learning").innerHTML = SKILLS.learning
      .map((s) => techCard(s, t("skills.statusLearning"))).join("");
  }

  function linkButton(label, url, isPrimary) {
    if (url) {
      const cls = isPrimary ? "btn sm primary" : "btn sm";
      return `<a class="${cls}" href="${esc(url)}" target="_blank" rel="noopener">${label}</a>`;
    }
    return `<span class="btn sm" aria-disabled="true">${label} · ${t("projects.soon")}</span>`;
  }

  const paragraphs = (key) => [].concat(t(key));

  const tagList = (p) =>
    `<div class="tags">${p.tags.map((tag) => `<span>${esc(tag)}</span>`).join("")}</div>`;

  const buttons = (p) => `
    <div class="acts">
      ${linkButton("GitHub", p.github, false)}
      ${linkButton("Live Demo", p.demo, true)}
    </div>`;

  function metaLine(p) {
    const base = "projects.items." + p.id;
    const label = t(base + ".label");
    const category = t(base + ".category");

    return `
      <div class="meta">
        ${label !== base + ".label" ? `<span class="label-chip">${esc(label)}</span>` : ""}
        ${category !== base + ".category" ? `<span class="cat">${esc(category)}</span>` : ""}
      </div>`;
  }

  function featuredCard(p) {
    const base = "projects.items." + p.id;
    const alt = `${t("projects.alt")} ${p.title}`;
    const host = (p.demo || "").replace(/^https?:\/\//, "").replace(/\/index\.html$/, "");

    const shot = `
      <div class="shot-bar" aria-hidden="true">
        <i></i><i></i><i></i>
        ${host ? `<span class="shot-url">${esc(host)}</span>` : ""}
      </div>
      ${p.image
        ? `<img src="${esc(p.image)}" alt="${esc(alt)}" width="1280" height="800" loading="lazy">`
        : `<div class="shot-empty">${esc(p.title)}</div>`}
    `;

    const shotEl = p.demo
      ? `<a class="shot" href="${esc(p.demo)}" target="_blank" rel="noopener" aria-label="Live Demo — ${esc(p.title)}">${shot}</a>`
      : `<div class="shot">${shot}</div>`;

    return `
      <article class="featured">
        ${shotEl}
        <div class="info">
          <p class="featured-tag">${t("projects.featured")}</p>
          ${metaLine(p)}
          <h3>${esc(p.title)}</h3>
          <p class="subtitle">${esc(t(base + ".subtitle"))}</p>
          ${paragraphs(base + ".desc").map((para) => `<p class="desc">${esc(para)}</p>`).join("")}
          ${tagList(p)}
          ${buttons(p)}
        </div>
      </article>
    `;
  }

  function projectCard(p) {
    const initials = p.title.split(" ").slice(0, 2).map((w) => w[0]).join("");
    const thumb = p.image
      ? `<img src="${esc(p.image)}" alt="${esc(t("projects.alt") + " " + p.title)}" loading="lazy">`
      : esc(initials);

    return `
      <article class="card">
        <div class="thumb${p.image ? " has-img" : ""}">${thumb}</div>
        <div class="body">
          ${metaLine(p)}
          <h3>${esc(p.title)}</h3>
          <p>${esc(paragraphs("projects.items." + p.id + ".desc")[0])}</p>
          ${tagList(p)}
          ${buttons(p)}
        </div>
      </article>
    `;
  }

  function renderProjects() {
    const list = PROJECTS.filter(
      (p) => currentFilter === "all" || p.category === currentFilter
    );

    $("#cards").innerHTML = list.length
      ? list.map((p) => (p.featured ? featuredCard(p) : projectCard(p))).join("")
      : `<p class="lead">${t("projects.empty")}</p>`;
  }

  function renderFilters() {
    const bar = $("#filters");
    bar.hidden = PROJECTS.length < 2;

    const keys = FILTERS.filter(
      (key) => key === "all" || PROJECTS.some((p) => p.category === key)
    );

    bar.innerHTML = keys.map(
      (key) => `<button class="chip" data-key="${key}" aria-pressed="${key === currentFilter}">${esc(t("filters." + key))}</button>`
    ).join("");
  }

  function bindFilterClicks() {
    $("#filters").addEventListener("click", (e) => {
      const clicked = e.target.closest(".chip");
      if (!clicked) return;

      currentFilter = clicked.dataset.key;

      document.querySelectorAll(".chip").forEach((chip) => {
        chip.setAttribute("aria-pressed", chip === clicked);
      });

      renderProjects();
    });
  }

  function renderTimeline() {
    $("#timeline").innerHTML = JOURNEY.map((key) => {
      const base = "journey.items." + key;
      return `
        <li>
          <time>${esc(t(base + ".year"))}</time>
          <h3>${esc(t(base + ".title"))}</h3>
          <p>${esc(t(base + ".text"))}</p>
        </li>
      `;
    }).join("");
  }

  function renderDynamic() {
    renderSkills();
    renderFilters();
    renderProjects();
    renderTimeline();
  }

  function init() {
    renderContactLinks();
    bindFilterClicks();
    renderDynamic();
    language.onChange(renderDynamic);   
  }

  window.render = { init };

})();
