import { SKILLS } from "../config/skills.js";
import { t } from "../modules/language.js";
import { qs, escapeHtml } from "../utils/dom.js";

const ICON_BASE = "https://cdn.jsdelivr.net/gh/devicons/devicon/icons";

const skillCard = (skill, status) => `
  <div class="tech">
    <img src="${ICON_BASE}/${skill.icon}/${skill.icon}-original.svg" alt="" loading="lazy">
    <b>${escapeHtml(skill.name)}</b>
    <small>${status}</small>
  </div>
`;

const renderGroup = (selector, skills, status) => {
  qs(selector).innerHTML = skills.map((skill) => skillCard(skill, status)).join("");
};

export function renderSkills() {
  renderGroup("#using", SKILLS.using, t("skills.statusUsing"));
  renderGroup("#learning", SKILLS.learning, t("skills.statusLearning"));
}

export function initSkills() {
  ["#using", "#learning"].forEach((selector) => {
    qs(selector).addEventListener(
      "error",
      (event) => {
        if (event.target instanceof HTMLImageElement) event.target.remove();
      },
      true
    );
  });
}
