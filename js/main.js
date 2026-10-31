/* ==========================================================
   main.js — titik awal website.
   Hanya menjalankan modul lain sesuai urutan:
   language -> render -> navigation -> contactForm
   ========================================================== */
(async function () {

  await language.init();          // 1. muat terjemahan & terapkan ke halaman
  render.init();                  // 2. buat skill, project, timeline
  navigation.init();              // 3. scroll, menu, tombol ke atas
  contactForm.init();             // 4. form kontak

  document.documentElement.classList.add("ready");   // tampilkan halaman

})();
