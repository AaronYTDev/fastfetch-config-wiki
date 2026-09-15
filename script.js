const pages = {
  home: { title: "Overview", text: "What is fastfetch-config?" },
  installation: { title: "Installation", text: "Install fastfetch-config" },
  "getting-started": { title: "Getting started", text: "Your first configuration" },
  configuration: { title: "Configuration", text: "Configuration" },
  logos: { title: "Logos & images", text: "Logos" },
  colors: { title: "Colors", text: "Color system" },
  troubleshooting: { title: "Troubleshooting", text: "When things explode" }
};

const navItems = [...document.querySelectorAll("[data-page]")];
const pageEls = [...document.querySelectorAll(".page")];

function showPage(id) {
  if (!pages[id]) id = "home";
  pageEls.forEach(p => p.classList.toggle("active", p.id === `page-${id}`));
  document.querySelectorAll(".nav-item[data-page]").forEach(n => n.classList.toggle("active", n.dataset.page === id));
  history.replaceState(null, "", `#${id}`);
  window.scrollTo({ top: 0, behavior: "smooth" });
  document.getElementById("sidebar")?.classList.remove("open");
}

navItems.forEach(el => el.addEventListener("click", e => {
  const id = el.dataset.page;
  if (id) {
    e.preventDefault();
    showPage(id);
  }
}));

const initial = location.hash.replace("#", "");
showPage(pages[initial] ? initial : "home");

document.querySelectorAll(".copy").forEach(btn => {
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.copy);
      const old = btn.textContent;
      btn.textContent = "Copied";
      setTimeout(() => btn.textContent = old, 1200);
    } catch {
      btn.textContent = "Select manually";
    }
  });
});

const overlay = document.getElementById("searchOverlay");
const input = document.getElementById("searchInput");
const results = document.getElementById("searchResults");

function openSearch() {
  overlay.classList.add("open");
  input.value = "";
  renderResults("");
  setTimeout(() => input.focus(), 20);
}
function closeSearch() { overlay.classList.remove("open"); }

document.getElementById("searchTrigger").addEventListener("click", openSearch);
overlay.addEventListener("click", e => { if (e.target === overlay) closeSearch(); });
document.addEventListener("keydown", e => {
  if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); openSearch(); }
  if (e.key === "Escape") closeSearch();
});

function renderResults(query) {
  const q = query.toLowerCase().trim();
  const found = Object.entries(pages).filter(([id, p]) =>
    !q || `${id} ${p.title} ${p.text}`.toLowerCase().includes(q)
  );
  results.innerHTML = found.length
    ? found.map(([id, p]) => `<div class="search-result" data-result="${id}"><strong>${p.title}</strong><span>${p.text}</span></div>`).join("")
    : `<div class="search-result"><strong>No results</strong><span>Humanity survives another documentation search.</span></div>`;
  results.querySelectorAll("[data-result]").forEach(el => el.addEventListener("click", () => {
    showPage(el.dataset.result);
    closeSearch();
  }));
}
input.addEventListener("input", () => renderResults(input.value));

document.getElementById("themeToggle").addEventListener("click", () => {
  const light = document.documentElement.dataset.theme === "light";
  document.documentElement.dataset.theme = light ? "dark" : "light";
  localStorage.setItem("ff-wiki-theme", light ? "dark" : "light");
});
if (localStorage.getItem("ff-wiki-theme") === "light") document.documentElement.dataset.theme = "light";

document.getElementById("mobileMenu").addEventListener("click", () => {
  document.getElementById("sidebar").classList.toggle("open");
});
