/* ==========================================================
   data.js — DATA website (tanpa teks terjemahan).
   Teks yang tampil ke pengunjung ada di locales/id.json
   dan locales/en.json, dihubungkan lewat "id" / key di bawah.
   ========================================================== */

/* ---------- Kontak & link ---------- */
const PROFILE = {
  email: "adityarafi412@gmail.com",   // ganti email di sini
  github: "https://github.com/Rafiadttya",
  linkedin: "https://www.linkedin.com/in/rafi-aditya-3295b3446",
};


/* ---------- Skills ----------
   Format: ["Nama tampil", "nama-icon-di-Devicon"] */
const SKILLS = {
  using: [
    ["HTML", "html5"],
    ["CSS", "css3"],
    ["JavaScript", "javascript"],
    ["Bootstrap", "bootstrap"],
    ["Tailwind CSS", "tailwindcss"],
    ["Figma", "figma"],
    ["Git", "git"],
    ["GitHub", "github"],
  ],
  learning: [
    ["PHP", "php"],
    ["Laravel", "laravel"],
    ["MySQL", "mysql"],
    ["Next.js", "nextjs"],
    ["Vercel", "vercel"],
    ["Node.js", "nodejs"],
  ],
};


/* ---------- Projects ----------
   id          : kunci unik; deskripsinya ada di locales/*.json
                 pada "projects.items.<id>.desc".
   category    : salah satu key di FILTERS (frontend / web / experiments).
   github/demo : isi URL jika sudah ada. null = tampil "Coming Soon".
   image       : path gambar, mis. "public/images/stephaven.jpg".
                 null = thumbnail berisi inisial.
   placeholder : true = contoh yang harus diganti project asli. */
const PROJECTS = [
  {
    id: "stephaven",
    title: "StepHaven",
    category: "frontend",
    tags: ["HTML", "CSS", "JavaScript", "Bootstrap", "IndexedDB"],
    image: null,
    github: null,
    demo: null,
  },
  {
    id: "todo-design",
    title: "Todo List App Design",
    category: "experiments",
    tags: ["Figma", "UI/UX"],
    image: null,
    github: null,
    demo: null,
  },
  {
    id: "placeholder",
    title: "Project Placeholder",
    category: "web",
    placeholder: true,
    tags: ["PHP", "Laravel", "MySQL"],
    image: null,
    github: null,
    demo: null,
  },
];


/* ---------- Filter project ----------
   Label tiap filter ada di locales/*.json pada "filters.<key>". */
const FILTERS = ["all", "frontend", "web", "experiments"];


/* ---------- Timeline ----------
   Isi tiap tahap (year, title, text) ada di locales/*.json
   pada "journey.items.<key>". */
const JOURNEY = ["beginning", "foundations", "expanding", "next"];
