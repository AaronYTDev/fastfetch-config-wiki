(() => {
  "use strict";

  const body = document.body;
  const pages = [...document.querySelectorAll(".page")];
  const navLinks = [...document.querySelectorAll("[data-page]")];
  const menuButton = document.querySelector("[data-menu]");
  const searchButton = document.querySelector("[data-search]");
  const themeButton = document.querySelector("[data-theme]");
  const overlay = document.querySelector(".search-overlay");
  const searchInput = document.querySelector(".search-input");
  const searchResults = document.querySelector(".search-results");

  function showPage(id, updateHash = true) {
    const target = document.getElementById(id) || document.getElementById("home");
    if (!target) return;

    pages.forEach(page => page.classList.toggle("active", page === target));
    navLinks.forEach(link => {
      link.classList.toggle("active", link.dataset.page === target.id);
    });

    if (updateHash) {
      history.replaceState(null, "", `#${target.id}`);
    }

    body.classList.remove("nav-open");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  navLinks.forEach(link => {
    link.addEventListener("click", event => {
      event.preventDefault();
      showPage(link.dataset.page);
    });
  });

  function openSearch() {
    if (!overlay) return;
    overlay.classList.add("open");
    if (searchInput) {
      searchInput.value = "";
      searchInput.focus();
    }
    renderSearch("");
  }

  function closeSearch() {
    overlay?.classList.remove("open");
  }

  function renderSearch(query) {
    if (!searchResults) return;

    const q = query.trim().toLowerCase();

    const results = pages
      .filter(page => {
        const title = page.querySelector("h1, h2")?.textContent || page.id;
        const text = page.textContent || "";
        return !q || `${title} ${text}`.toLowerCase().includes(q);
      })
      .slice(0, 12);

    searchResults.innerHTML = results.map(page => {
      const title = page.querySelector("h1, h2")?.textContent?.trim() || page.id;
      const description = page.querySelector(".lead, p")?.textContent?.trim() || "";
      return `<a class="search-result" href="#${page.id}" data-result="${page.id}">
        <strong>${escapeHtml(title)}</strong>
        <span>${escapeHtml(description.slice(0, 120))}</span>
      </a>`;
    }).join("") || `<div class="search-result">No results found.</div>`;

    searchResults.querySelectorAll("[data-result]").forEach(link => {
      link.addEventListener("click", event => {
        event.preventDefault();
        closeSearch();
        showPage(link.dataset.result);
      });
    });
  }

  function escapeHtml(value) {
    return value.replace(/[&<>"']/g, char => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;"
    }[char]));
  }

  searchButton?.addEventListener("click", openSearch);
  overlay?.addEventListener("click", event => {
    if (event.target === overlay) closeSearch();
  });
  searchInput?.addEventListener("input", event => renderSearch(event.target.value));

  menuButton?.addEventListener("click", () => {
    body.classList.toggle("nav-open");
  });

  themeButton?.addEventListener("click", () => {
    const light = body.classList.toggle("light");
    localStorage.setItem("wiki-theme", light ? "light" : "dark");
  });

  document.querySelectorAll(".copy-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const code = button.closest(".code-wrap")?.querySelector("pre")?.innerText || "";
      try {
        await navigator.clipboard.writeText(code);
        const old = button.textContent;
        button.textContent = "Copied!";
        setTimeout(() => button.textContent = old, 1200);
      } catch {
        button.textContent = "Copy failed";
        setTimeout(() => button.textContent = "Copy", 1200);
      }
    });
  });

  document.addEventListener("keydown", event => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      openSearch();
    }

    if (event.key === "Escape") {
      closeSearch();
      body.classList.remove("nav-open");
    }
  });

  const initial = location.hash.slice(1);
  showPage(document.getElementById(initial) ? initial : "home", false);
})();
