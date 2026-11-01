import { JOURNEY } from "../config/journey.js";
import { t } from "../modules/language.js";
import { qs, escapeHtml } from "../utils/dom.js";

export function renderTimeline() {
  qs("#timeline").innerHTML = JOURNEY.map((key) => {
    const base = `journey.items.${key}`;

    return `
      <li>
        <time>${escapeHtml(t(`${base}.year`))}</time>
        <h3>${escapeHtml(t(`${base}.title`))}</h3>
        <p>${escapeHtml(t(`${base}.text`))}</p>
      </li>
    `;
  }).join("");
}
