(function () {

  const $ = (selector, root = document) => root.querySelector(selector);
  const t = (key) => language.t(key);          

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

  function projectCard(p) {
    
    const initials = p.title.split(" ").slice(0, 2).map((w) => w[0]).join("");
    const thumb = p.image
      ? `<img src="${esc(p.image)}" alt="${t("projects.alt")} ${esc(p.title)}" loading="lazy">`
      : esc(initials);

    const badge = p.placeholder
      ? `<span class="badge">${t("projects.placeholder")}</span>`
      : "";

    const tags = p.tags.map((tag) => `<span>${esc(tag)}</span>`).join("");

    return `
      <article class="card">
        <div class="thumb${p.image ? " has-img" : ""}">${thumb}</div>
        <div class="body">
          ${badge}
          <h3>${esc(p.title)}</h3>
          <p>${esc(t("projects.items." + p.id + ".desc"))}</p>
          <div class="tags">${tags}</div>
          <div class="acts">
            ${linkButton("GitHub", p.github, false)}
            ${linkButton("Live Demo", p.demo, true)}
          </div>
        </div>
      </article>
    `;
  }

  function renderProjects() {
    const list = PROJECTS.filter(
      (p) => currentFilter === "all" || p.category === currentFilter
    );

    $("#cards").innerHTML = list.length
      ? list.map(projectCard).join("")
      : `<p class="lead">${t("projects.empty")}</p>`;
  }

  function renderFilters() {
    $("#filters").innerHTML = FILTERS.map(
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
