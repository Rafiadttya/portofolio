import { initLanguage, onLanguageChange } from "./modules/language.js";
import { renderContactLinks } from "./components/contact-links.js";
import { initSkills, renderSkills } from "./components/skills.js";
import { initProjects, renderProjects } from "./components/projects.js";
import { renderTimeline } from "./components/timeline.js";
import { initNavigation } from "./features/navigation.js";
import { initScrollEffects } from "./features/scroll.js";
import { initContactForm } from "./features/contact-form.js";

function renderTranslatedContent() {
  renderSkills();
  renderProjects();
  renderTimeline();
}

async function bootstrap() {
  await initLanguage();

  renderContactLinks();
  initSkills();
  initProjects();
  renderTranslatedContent();
  onLanguageChange(renderTranslatedContent);

  initNavigation();
  initScrollEffects();
  initContactForm();

  document.documentElement.classList.add("ready");
}

bootstrap();
