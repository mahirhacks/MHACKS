const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    revealObserver.unobserve(entry.target);
  });
}, { threshold: .12, rootMargin: '0px 0px -4% 0px' });

document.querySelectorAll('.reveal').forEach((element, index) => {
  element.style.transitionDelay = `${Math.min(index % 5 * 70, 280)}ms`;
  revealObserver.observe(element);
});

const control = document.querySelector('.scroll-control');
const rail = control?.querySelector('.scroll-rail');
const thumb = control?.querySelector('.scroll-thumb');

const updateScroll = () => {
  if (!control || !rail || !thumb) return;
  const maximum = Math.max(document.documentElement.scrollHeight - innerHeight, 1);
  const progress = Math.min(Math.max(scrollY / maximum, 0), 1);
  const travel = Math.max(rail.clientHeight - thumb.offsetHeight, 0);
  control.style.setProperty('--offset', `${progress * travel}px`);
  control.setAttribute('aria-valuenow', String(Math.round(progress * 100)));
};

const scrollFromPointer = event => {
  const bounds = rail.getBoundingClientRect();
  const height = thumb.offsetHeight;
  const progress = Math.min(Math.max((event.clientY - bounds.top - height / 2) / Math.max(bounds.height - height, 1), 0), 1);
  scrollTo({ top: (document.documentElement.scrollHeight - innerHeight) * progress, behavior: control.classList.contains('dragging') ? 'auto' : 'smooth' });
};

control?.addEventListener('pointerdown', event => {
  control.classList.add('dragging');
  control.setPointerCapture(event.pointerId);
  scrollFromPointer(event);
});
control?.addEventListener('pointermove', event => { if (control.classList.contains('dragging')) scrollFromPointer(event); });
control?.addEventListener('pointerup', event => {
  control.classList.remove('dragging');
  if (control.hasPointerCapture(event.pointerId)) control.releasePointerCapture(event.pointerId);
});
control?.addEventListener('pointercancel', () => control.classList.remove('dragging'));
control?.addEventListener('keydown', event => {
  const step = { ArrowUp:-80, ArrowDown:80, PageUp:-innerHeight*.8, PageDown:innerHeight*.8 }[event.key];
  if (step) { event.preventDefault(); scrollBy({ top:step, behavior:'smooth' }); }
  if (event.key === 'Home' || event.key === 'End') {
    event.preventDefault();
    scrollTo({ top:event.key === 'Home' ? 0 : document.documentElement.scrollHeight, behavior:'smooth' });
  }
});
addEventListener('scroll', updateScroll, { passive:true });
addEventListener('resize', updateScroll);
updateScroll();
