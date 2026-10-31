(function () {

  const $ = (selector, root = document) => root.querySelector(selector);

  function showError(field, key) {
    const el = $(`.err[data-for="${field}"]`);

    if (key) {
      el.dataset.i18n = key;
    } else {
      delete el.dataset.i18n;
      el.textContent = "";
    }
  }

  function validate(data) {
    return {
      name: data.name.trim().length < 2 ? "form.errName" : "",
      email: !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(data.email.trim()) ? "form.errEmail" : "",
      message: data.message.trim().length < 10 ? "form.errMessage" : "",
    };
  }

  function handleSubmit(e) {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(e.target));
    const errors = validate(data);

    Object.keys(errors).forEach((field) => showError(field, errors[field]));
    language.apply();

    if (Object.values(errors).some(Boolean)) return;

    const subject = encodeURIComponent(language.t("form.subject") + data.name);
    const body = encodeURIComponent(`${data.message}\n\n— ${data.name} (${data.email})`);

    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;

    $("#status").dataset.i18n = "form.sent";
    language.apply();
  }

  function init() {
    $("#form").addEventListener("submit", handleSubmit);
  }

  window.contactForm = { init };

})();
