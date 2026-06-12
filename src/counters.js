/* Count-up de cifras al entrar en viewport. Respeta reduced-motion
   (muestra el valor final directo) y usa números tabulares. */
import { prefersReducedMotion } from './main.js';

function format(value, decimals) {
  const fixed = value.toFixed(decimals);
  // Separador de miles estilo es-CL (punto) para enteros grandes.
  if (decimals === 0) {
    return Number(fixed).toLocaleString('es-CL');
  }
  return fixed.replace('.', ',');
}

function animate(el) {
  const target = parseFloat(el.dataset.count);
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const prefix = el.dataset.prefix ? decodeEntities(el.dataset.prefix) : '';
  const suffix = el.dataset.suffix ? decodeEntities(el.dataset.suffix) : '';
  const numEl = el.querySelector('.stat__num, span');

  if (!numEl || Number.isNaN(target)) return;

  const render = (v) => {
    numEl.textContent = `${prefix}${format(v, decimals)}${suffix}`;
  };

  if (prefersReducedMotion()) {
    render(target);
    return;
  }

  const duration = 1600;
  const start = performance.now();
  const step = (now) => {
    const p = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - p, 3); // easeOutCubic
    render(target * eased);
    if (p < 1) requestAnimationFrame(step);
    else render(target);
  };
  requestAnimationFrame(step);
}

function decodeEntities(str) {
  const txt = document.createElement('textarea');
  txt.innerHTML = str;
  return txt.value;
}

export function initCounters() {
  const els = document.querySelectorAll('[data-count]');
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          animate(entry.target);
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  els.forEach((el) => io.observe(el));
}
