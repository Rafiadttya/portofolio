/* ===== Semua konten yang sering diubah ada di file ini ===== */
const PROFILE = {
  email: "adityarafi412@gmail.com",              // ganti email di sini
  github: "https://github.com/Rafiadttya",
  linkedin: "https://www.linkedin.com/in/rafi-aditya-3295b3446"
};

const SKILLS = {
  using: [
    ["HTML","html5"],["CSS","css3"],["JavaScript","javascript"],["Bootstrap","bootstrap"],
    ["Tailwind CSS","tailwindcss"],["Figma","figma"],["Git","git"],["GitHub","github"]
  ],
  learning: [
    ["PHP","php"],["Laravel","laravel"],["MySQL","mysql"],["Next.js","nextjs"],
    ["Vercel","vercel"],["Node.js","nodejs"]
  ]
};

/* github / demo: isi URL jika sudah ada, biarkan null untuk menampilkan "Coming Soon".
   image: path gambar (mis. "public/images/stephaven.jpg"), null = thumbnail inisial.
   placeholder: true = contoh yang HARUS diganti dengan project asli. */
const PROJECTS = [
  { title: "StepHaven", category: "Frontend",
    desc: "Website e-commerce toko sepatu dengan halaman produk, detail produk, dan keranjang belanja. Data disimpan di sisi client menggunakan IndexedDB.",
    tags: ["HTML","CSS","JavaScript","Bootstrap","IndexedDB"], image: null, github: null, demo: null },
  { title: "Todo List App Design", category: "Other Experiments",
    desc: "Perancangan aplikasi pencatat tugas harian: riset pengguna, user flow, hingga high-fidelity prototype interaktif di Figma.",
    tags: ["Figma","UI/UX"], image: null, github: null, demo: null },
  { title: "Project Placeholder", category: "Web Development", placeholder: true,
    desc: "Contoh kartu project. Ganti dengan project asli: tulis deskripsi singkat, teknologi, dan tautan repositori.",
    tags: ["PHP","Laravel","MySQL"], image: null, github: null, demo: null }
];

const FILTERS = ["All Projects","Frontend","Web Development","Other Experiments"];

const JOURNEY = [
  ["2024","The Beginning","Memulai perjalanan pendidikan S1 Teknik Informatika dan mengenal dasar-dasar pemrograman."],
  ["2025","Building Foundations","Mulai mendalami pengembangan website, HTML, CSS, JavaScript, serta memahami konsep UI/UX dan Git."],
  ["2026","Expanding My Skills","Mengembangkan kemampuan Frontend Development, mulai mempelajari PHP, Laravel, MySQL, dan konsep Backend Development."],
  ["Next","The Next Chapter","Terus mengembangkan kemampuan Software Engineering, membangun project yang lebih kompleks, dan memperdalam full-stack development."]
];
