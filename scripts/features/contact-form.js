import { PROFILE } from "../config/profile.js";
import { applyTranslations, t } from "../modules/language.js";
import { qs } from "../utils/dom.js";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

function showError(field, key) {
  const element = qs(`.err[data-for="${field}"]`);

  if (key) {
    element.dataset.i18n = key;
    return;
  }

  delete element.dataset.i18n;
  element.textContent = "";
}

const validate = (data) => ({
  name: data.name.trim().length < 2 ? "form.errName" : "",
  email: EMAIL_PATTERN.test(data.email.trim()) ? "" : "form.errEmail",
  message: data.message.trim().length < 10 ? "form.errMessage" : "",
});

function handleSubmit(event) {
  event.preventDefault();

  const data = Object.fromEntries(new FormData(event.target));
  const errors = validate(data);

  Object.entries(errors).forEach(([field, key]) => showError(field, key));
  applyTranslations();

  if (Object.values(errors).some(Boolean)) return;

  const subject = encodeURIComponent(t("form.subject") + data.name);
  const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);

  window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;

  qs("#status").dataset.i18n = "form.sent";
  applyTranslations();
}

export function initContactForm() {
  qs("#form").addEventListener("submit", handleSubmit);
}
