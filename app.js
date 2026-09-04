(() => {
  "use strict";
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const escapeHTML = value => String(value).replace(/[&<>'"]/g, char => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" })[char]);
  const firstName = portfolioData.name.split(" ")[0];
  const initials = portfolioData.name.split(" ").map(part => part[0]).slice(0, 2).join("").toUpperCase();
  const fields = { ...portfolioData, firstName };

  $$('[data-field]').forEach(element => { element.textContent = fields[element.dataset.field] ?? ""; });
  $$('[data-initials]').forEach(element => { element.textContent = initials; });
  $$('[data-project-count]').forEach(element => { element.textContent = portfolioData.projects.length; });
  $$('[data-stat]').forEach(element => { element.textContent = portfolioData.stats[element.dataset.stat] ?? 0; });
  $$('[data-link]').forEach(element => { element.href = portfolioData.links[element.dataset.link] || "#"; });
  $$('[data-email-link]').forEach(element => { element.href = `mailto:${portfolioData.email}`; });
  $$('[data-phone-link]').forEach(element => { element.href = `tel:+57${portfolioData.phone.replace(/\D/g, "")}`; });
  $$('[data-whatsapp-link]').forEach(element => { element.href = `https://wa.me/${portfolioData.whatsappNumber}?text=${encodeURIComponent(portfolioData.whatsappMessage)}`; });
  document.title = `${portfolioData.name} | Portafolio`;
  $("#currentYear").textContent = new Date().getFullYear();

  const projectsTable = $("#projectsTable");
  const emptyState = $("#emptyState");
  let currentFilter = "Todos";
  let currentSearch = "";

  function renderProjects() {
    const visibleProjects = portfolioData.projects.filter(project => {
      const matchesFilter = currentFilter === "Todos" || project.category === currentFilter;
      const searchable = `${project.name} ${project.description} ${project.category} ${project.technologies.join(" ")}`.toLowerCase();
      return matchesFilter && searchable.includes(currentSearch);
    });
    projectsTable.innerHTML = visibleProjects.map(project => `
      <tr><td><div class="project-name"><span class="project-icon"><i class="bi ${project.category === "Datos" ? "bi-bar-chart" : project.category === "Seguridad" ? "bi-shield-lock" : "bi-window"}"></i></span><div><strong>${escapeHTML(project.name)}</strong><small>${escapeHTML(project.description)}</small></div></div></td>
      <td>${escapeHTML(project.category)}</td><td>${project.technologies.map(technology => `<span class="tag">${escapeHTML(technology)}</span>`).join("")}</td>
      <td><span class="status-badge ${project.status === "En progreso" ? "progress-status" : ""}">${escapeHTML(project.status)}</span></td>
      <td><a class="project-link" href="${escapeHTML(project.link)}" aria-label="Abrir ${escapeHTML(project.name)}"><i class="bi bi-arrow-up-right"></i></a></td></tr>`).join("");
    emptyState.classList.toggle("d-none", visibleProjects.length > 0);
  }

  $("#skillsList").innerHTML = portfolioData.skills.map(skill => `<article class="skill"><div class="skill-top"><i class="bi ${escapeHTML(skill.icon)}"></i><strong>${escapeHTML(skill.name)}</strong><span>${Number(skill.level)}%</span></div><div class="skill-track" role="progressbar" aria-label="${escapeHTML(skill.name)}" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Number(skill.level)}"><div class="skill-progress" style="width:${Math.min(100, Math.max(0, Number(skill.level)))}%"></div></div></article>`).join("");
  $$('.filter-btn').forEach(button => button.addEventListener("click", () => { currentFilter = button.dataset.filter; $$('.filter-btn').forEach(item => item.classList.toggle("active", item === button)); renderProjects(); }));
  const searchInput = $("#projectSearch");
  searchInput.addEventListener("input", event => { currentSearch = event.target.value.trim().toLowerCase(); renderProjects(); });
  document.addEventListener("keydown", event => { if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") { event.preventDefault(); searchInput.focus(); } });

  const themeToggle = $("#themeToggle");
  const savedTheme = localStorage.getItem("portfolio-theme");
  if (savedTheme === "dark" || savedTheme === "light") document.documentElement.dataset.theme = savedTheme;
  const updateThemeIcon = () => { const isDark = document.documentElement.dataset.theme === "dark"; themeToggle.innerHTML = `<i class="bi ${isDark ? "bi-sun" : "bi-moon-stars"}"></i>`; themeToggle.setAttribute("aria-label", isDark ? "Activar tema claro" : "Activar tema oscuro"); };
  themeToggle.addEventListener("click", () => { const isDark = document.documentElement.dataset.theme === "dark"; document.documentElement.dataset.theme = isDark ? "light" : "dark"; localStorage.setItem("portfolio-theme", isDark ? "light" : "dark"); updateThemeIcon(); });
  const navLinks = $$('.side-nav a, .mobile-nav a');
  navLinks.forEach(link => link.addEventListener("click", () => { const target = link.getAttribute("href"); navLinks.forEach(item => item.classList.toggle("active", item.getAttribute("href") === target)); }));
  updateThemeIcon();
  renderProjects();
})();
