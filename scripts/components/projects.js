import { PROJECTS, FILTERS } from "../config/projects.js";
import { t } from "../modules/language.js";
import { qs, qsa, escapeHtml } from "../utils/dom.js";

let currentFilter = "all";

const paragraphs = (key) => [].concat(t(key));

const optionalText = (key) => {
  const value = t(key);
  return value === key ? "" : value;
};

function linkButton(label, url, isPrimary) {
  if (!url) {
    return `<span class="btn sm" aria-disabled="true">${label} · ${t("projects.soon")}</span>`;
  }

  const className = isPrimary ? "btn sm primary" : "btn sm";
  return `<a class="${className}" href="${escapeHtml(url)}" target="_blank" rel="noopener">${label}</a>`;
}

const tagList = (project) => `
  <div class="tags">${project.tags.map((tag) => `<span>${escapeHtml(tag)}</span>`).join("")}</div>
`;

const actionButtons = (project) => `
  <div class="acts">
    ${linkButton("GitHub", project.github, false)}
    ${linkButton("Live Demo", project.demo, true)}
  </div>
`;

function metaLine(project) {
  const base = `projects.items.${project.id}`;
  const label = optionalText(`${base}.label`);
  const category = optionalText(`${base}.category`);

  return `
    <div class="meta">
      ${label ? `<span class="label-chip">${escapeHtml(label)}</span>` : ""}
      ${category ? `<span class="cat">${escapeHtml(category)}</span>` : ""}
    </div>
  `;
}

function browserFrame(project) {
  const alt = `${t("projects.alt")} ${project.title}`;
  const host = (project.demo || "")
    .replace(/^https?:\/\//, "")
    .replace(/\/index\.html$/, "");

  const content = `
    <div class="shot-bar" aria-hidden="true">
      <i></i><i></i><i></i>
      ${host ? `<span class="shot-url">${escapeHtml(host)}</span>` : ""}
    </div>
    ${
      project.image
        ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(alt)}" width="1280" height="800" loading="lazy">`
        : `<div class="shot-empty">${escapeHtml(project.title)}</div>`
    }
  `;

  return project.demo
    ? `<a class="shot" href="${escapeHtml(project.demo)}" target="_blank" rel="noopener" aria-label="Live Demo — ${escapeHtml(project.title)}">${content}</a>`
    : `<div class="shot">${content}</div>`;
}

function featuredCard(project) {
  const base = `projects.items.${project.id}`;

  return `
    <article class="featured">
      ${browserFrame(project)}
      <div class="info">
        <p class="featured-tag">${t("projects.featured")}</p>
        ${metaLine(project)}
        <h3>${escapeHtml(project.title)}</h3>
        <p class="subtitle">${escapeHtml(optionalText(`${base}.subtitle`))}</p>
        ${paragraphs(`${base}.desc`).map((text) => `<p class="desc">${escapeHtml(text)}</p>`).join("")}
        ${tagList(project)}
        ${actionButtons(project)}
      </div>
    </article>
  `;
}

function projectCard(project) {
  const initials = project.title
    .split(" ")
    .slice(0, 2)
    .map((word) => word[0])
    .join("");

  const thumbnail = project.image
    ? `<img src="${escapeHtml(project.image)}" alt="${escapeHtml(`${t("projects.alt")} ${project.title}`)}" loading="lazy">`
    : escapeHtml(initials);

  return `
    <article class="card">
      <div class="thumb${project.image ? " has-img" : ""}">${thumbnail}</div>
      <div class="body">
        ${metaLine(project)}
        <h3>${escapeHtml(project.title)}</h3>
        <p>${escapeHtml(paragraphs(`projects.items.${project.id}.desc`)[0])}</p>
        ${tagList(project)}
        ${actionButtons(project)}
      </div>
    </article>
  `;
}

function renderCards() {
  const visible = PROJECTS.filter(
    (project) => currentFilter === "all" || project.category === currentFilter
  );

  qs("#cards").innerHTML = visible.length
    ? visible.map((project) => (project.featured ? featuredCard(project) : projectCard(project))).join("")
    : `<p class="lead">${t("projects.empty")}</p>`;
}

function renderFilters() {
  const bar = qs("#filters");
  bar.hidden = PROJECTS.length < 2;

  const keys = FILTERS.filter(
    (key) => key === "all" || PROJECTS.some((project) => project.category === key)
  );

  bar.innerHTML = keys
    .map(
      (key) =>
        `<button class="chip" data-key="${key}" aria-pressed="${key === currentFilter}">${escapeHtml(t(`filters.${key}`))}</button>`
    )
    .join("");
}

export function renderProjects() {
  renderFilters();
  renderCards();
}

export function initProjects() {
  qs("#filters").addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;

    currentFilter = chip.dataset.key;
    qsa(".chip").forEach((item) => item.setAttribute("aria-pressed", item === chip));
    renderCards();
  });
}
