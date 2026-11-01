import { PROFILE } from "../config/profile.js";
import { qs, escapeHtml } from "../utils/dom.js";

export const MAIL_LINK = `mailto:${PROFILE.email}`;

const externalLink = (href, label) =>
  `<a href="${href}" target="_blank" rel="noopener">${label}</a>`;

export function renderContactLinks() {
  const social = `
    ${externalLink(PROFILE.github, "GitHub")}
    ${externalLink(PROFILE.linkedin, "LinkedIn")}
    <a href="${MAIL_LINK}">Email</a>
  `;

  qs("#social").innerHTML = social;
  qs("#fsocial").innerHTML = social;

  qs("#clinks").innerHTML = `
    <a href="${MAIL_LINK}">${escapeHtml(PROFILE.email)}</a>
    ${externalLink(PROFILE.github, "GitHub")}
    ${externalLink(PROFILE.linkedin, "LinkedIn")}
  `;

  qs("#mailbtn").href = MAIL_LINK;
  qs("#year").textContent = new Date().getFullYear();
}
