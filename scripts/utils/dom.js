const HTML_ESCAPES = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
};

export const qs = (selector, root = document) => root.querySelector(selector);

export const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];

export const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (char) => HTML_ESCAPES[char]);
