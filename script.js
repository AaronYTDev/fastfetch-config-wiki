document.addEventListener('DOMContentLoaded', () => {
  const navLinks = document.querySelectorAll('nav a[data-page]');
  const pages = document.querySelectorAll('.page');
  const homeLink = document.getElementById('home-link');
  const defaultPage = 'home';

  function showPage(pageId) {
    pages.forEach(p => p.classList.remove('active'));
    navLinks.forEach(l => l.classList.remove('active'));

    const target = document.getElementById('page-' + pageId);
    if (target) target.classList.add('active');

    const link = document.querySelector(`nav a[data-page="${pageId}"]`);
    if (link) link.classList.add('active');

    history.replaceState(null, '', '#' + pageId);
  }

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      showPage(link.dataset.page);
    });
  });

  if (homeLink) {
    homeLink.addEventListener('click', (e) => {
      e.preventDefault();
      showPage('home');
    });
  }

  function handleHash() {
    const hash = window.location.hash.slice(1) || defaultPage;
    showPage(hash);
  }

  window.addEventListener('hashchange', handleHash);
  handleHash();
});
