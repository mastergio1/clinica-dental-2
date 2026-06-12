/* Nav fija: estado "scrolled", menú mobile y smooth-scroll con Lenis. */
import Lenis from 'lenis';
import { prefersReducedMotion } from './main.js';

let lenis = null;

export function getLenis() {
  return lenis;
}

export function initNav() {
  const nav = document.getElementById('site-nav');
  const toggle = document.getElementById('nav-toggle');
  const mobile = document.getElementById('nav-mobile');

  // ---- Smooth scrolling (se desactiva si el usuario pide menos movimiento) ----
  if (!prefersReducedMotion()) {
    lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  }

  // ---- Estado scrolled de la nav ----
  const onScroll = () => {
    const y = window.scrollY || window.pageYOffset;
    nav.classList.toggle('is-scrolled', y > 24);
  };
  onScroll();
  window.addEventListener('scroll', onScroll, { passive: true });

  // ---- Menú mobile ----
  const closeMobile = () => {
    toggle.setAttribute('aria-expanded', 'false');
    toggle.setAttribute('aria-label', 'Abrir menú');
    mobile.hidden = true;
  };
  toggle.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') === 'true';
    if (open) {
      closeMobile();
    } else {
      toggle.setAttribute('aria-expanded', 'true');
      toggle.setAttribute('aria-label', 'Cerrar menú');
      mobile.hidden = false;
    }
  });

  // ---- Anclas con offset de nav (a través de Lenis si está activo) ----
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const id = link.getAttribute('href');
      if (id.length <= 1) return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      closeMobile();
      const offset = -64;
      if (lenis) {
        lenis.scrollTo(target, { offset });
      } else {
        const top = target.getBoundingClientRect().top + window.scrollY + offset;
        window.scrollTo({ top, behavior: prefersReducedMotion() ? 'auto' : 'smooth' });
      }
    });
  });
}
