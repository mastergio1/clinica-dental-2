/* ===========================================================================
   Orquestador del scrollytelling "Un día. Una sonrisa."
   - Decide 3D (Three.js, lazy) vs. fallback SVG según capacidades.
   - Sincroniza el scroll con la animación (GSAP ScrollTrigger en el camino 3D;
     cálculo nativo ligero en el fallback).
   - Actualiza HUD (hora + etapa), barra de progreso y resalte de los pasos.
   =========================================================================== */
import { prefersReducedMotion } from './main.js';
import { buildSvgStages, setSvgStage } from './svgStages.js';

// Metadatos de las 4 etapas (umbral de progreso 0..1 en el que se vuelven activas).
const STAGES = [
  { at: 0.0, time: '09:00', name: 'Diagnóstico' },
  { at: 0.3, time: '11:00', name: 'Cirugía' },
  { at: 0.55, time: '17:00', name: 'Dientes fijos' },
  { at: 0.8, time: '+1 sem', name: 'Control' },
];

function stageFromProgress(p) {
  let s = 0;
  for (let i = 0; i < STAGES.length; i++) {
    if (p >= STAGES[i].at) s = i;
  }
  return s;
}

export async function initStory({ enable3D }) {
  const section = document.getElementById('scrolly');
  const canvasEl = document.getElementById('scrolly-canvas');
  const fallbackEl = document.getElementById('scrolly-fallback');
  const heroCanvas = document.getElementById('hero-canvas');
  const heroPoster = document.getElementById('hero-poster');
  if (!section) return;

  const hudTime = document.getElementById('hud-time');
  const hudStage = document.getElementById('hud-stage');
  const progressItems = Array.from(section.querySelectorAll('.scrolly__progress li'));
  const stepEls = Array.from(section.querySelectorAll('.scrolly__steps .step'));

  let lastStage = -1;
  function updateUI(p) {
    const s = stageFromProgress(p);
    if (s === lastStage) return;
    lastStage = s;
    if (hudTime) hudTime.textContent = STAGES[s].time;
    if (hudStage) hudStage.textContent = STAGES[s].name;
    progressItems.forEach((li, i) => li.classList.toggle('is-active', i === s));
    stepEls.forEach((el, i) => el.classList.toggle('is-current', i === s));
  }

  // ----- Camino con FALLBACK SVG -----
  if (!enable3D) {
    canvasEl.hidden = true;
    fallbackEl.hidden = false;
    if (heroPoster) heroPoster.style.opacity = '1';
    const nodes = buildSvgStages(fallbackEl);

    // Progreso por scroll nativo (sin GSAP, ideal para gama baja).
    let ticking = false;
    const compute = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      const s = stageFromProgress(p);
      setSvgStage(nodes, s);
      updateUI(p);
      ticking = false;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(compute);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    compute();
    return;
  }

  // ----- Camino 3D (lazy-load de Three.js + GSAP) -----
  try {
    const [{ createScene }, gsapMod, stMod] = await Promise.all([
      import('./scene3d.js'),
      import('gsap'),
      import('gsap/ScrollTrigger'),
    ]);
    const gsap = gsapMod.gsap || gsapMod.default;
    const ScrollTrigger = stMod.ScrollTrigger || stMod.default;
    gsap.registerPlugin(ScrollTrigger);

    // --- Escena del scrollytelling ---
    const story = createScene({ container: canvasEl, mode: 'story' });
    story.resize();
    story.setProgress(0);

    // Pausa el render cuando la sección no está visible (ahorra batería).
    const visObserver = new IntersectionObserver(
      (entries) => entries.forEach((e) => (e.isIntersecting ? story.start() : story.stop())),
      { threshold: 0 }
    );
    visObserver.observe(section);

    ScrollTrigger.create({
      trigger: section,
      start: 'top top',
      end: 'bottom bottom',
      scrub: true,
      onUpdate: (self) => {
        story.setProgress(self.progress);
        updateUI(self.progress);
      },
    });

    window.addEventListener('resize', () => story.resize());

    // --- Escena del Hero (protagonista con parallax del puntero) ---
    if (heroCanvas) {
      const hero = createScene({ container: heroCanvas, mode: 'hero' });
      hero.resize();
      hero.start();
      // Desvanecemos el poster una vez que el primer frame está pintado.
      requestAnimationFrame(() => {
        if (heroPoster) {
          heroPoster.style.transition = 'opacity 0.6s ease';
          heroPoster.style.opacity = '0';
        }
      });

      const heroSection = document.getElementById('hero');
      if (!prefersReducedMotion()) {
        window.addEventListener(
          'pointermove',
          (e) => {
            const nx = (e.clientX / window.innerWidth) * 2 - 1;
            const ny = (e.clientY / window.innerHeight) * 2 - 1;
            hero.onPointer(nx, -ny);
          },
          { passive: true }
        );
      }
      const heroVis = new IntersectionObserver(
        (entries) => entries.forEach((e) => (e.isIntersecting ? hero.start() : hero.stop())),
        { threshold: 0 }
      );
      heroVis.observe(heroSection);
      window.addEventListener('resize', () => hero.resize());
    }

    updateUI(0);
    // Recalcular medidas tras cargar todo (fuentes, layout).
    ScrollTrigger.refresh();
  } catch (err) {
    // Si Three.js o GSAP fallan (red, WebGL perdido), degradamos a SVG.
    console.warn('[story] 3D no disponible, usando fallback SVG.', err);
    canvasEl.hidden = true;
    fallbackEl.hidden = false;
    if (heroPoster) heroPoster.style.opacity = '1';
    const nodes = buildSvgStages(fallbackEl);
    const compute = () => {
      const rect = section.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      const p = total > 0 ? Math.min(1, Math.max(0, -rect.top / total)) : 0;
      setSvgStage(nodes, stageFromProgress(p));
      updateUI(p);
    };
    window.addEventListener('scroll', compute, { passive: true });
    window.addEventListener('resize', compute, { passive: true });
    compute();
  }
}
