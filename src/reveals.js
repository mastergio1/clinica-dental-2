/* Reveal suave de secciones al entrar en viewport. Sin dependencias.
   Marca [data-reveal] y los hijos directos comunes de cada .container. */
import { prefersReducedMotion } from './main.js';

export function initReveals() {
  const targets = document.querySelectorAll(
    '.feature-card, .tech-card, .spec-group, .trust-points li, .testi-card, .founder, .location-info, .location-map, .contact-form, [data-reveal]'
  );
  if (!targets.length) return;

  if (prefersReducedMotion()) {
    targets.forEach((t) => t.classList.add('is-visible'));
    return;
  }

  targets.forEach((t, i) => {
    t.classList.add('reveal');
    // Pequeño escalonado dentro de cada grilla.
    t.style.transitionDelay = `${(i % 4) * 70}ms`;
  });

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15, rootMargin: '0px 0px -8% 0px' }
  );

  targets.forEach((t) => io.observe(t));
}
