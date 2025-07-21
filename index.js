function toggleMenu() {
  document.querySelector('.header_links').classList.toggle('active');
  document.querySelector('.hamburger').classList.toggle('active');
}

// Auto-close dropdown when scrolling past the first section
window.addEventListener('scroll', () => {
  const header = document.querySelector('header');
  const headerHeight = header ? header.offsetHeight : 72;
  const section1 = document.getElementById('sect_1');

  if (!section1) return;

  const rect = section1.getBoundingClientRect();
  const outOfView = rect.bottom <= headerHeight;

  if (outOfView) {
    const menu = document.querySelector('.header_links');
    const hamburger = document.querySelector('.hamburger');

    if (menu && menu.classList.contains('active')) {
      menu.classList.remove('active');
      hamburger.classList.remove('active');
    }
  }
});
