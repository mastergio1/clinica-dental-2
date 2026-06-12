/* Fallback SVG del scrollytelling: 4 ilustraciones estáticas, una por etapa.
   Mismo storytelling que la escena 3D, sin WebGL. Estilo blueprint/HUD:
   wireframe cian sobre fondo noche, médico y abstracto (sin sangre). */

const NS = 'http://www.w3.org/2000/svg';

// Paleta inline para no depender del CSS compilado dentro del SVG.
const C = {
  line: '#4EA1D3',
  faint: 'rgba(78,161,211,0.35)',
  bone: 'rgba(242,247,251,0.85)',
  titanium: '#9fb6c6',
  crown: '#F2F7FB',
  success: '#3ECf8E',
};

// Arcada mandibular estilizada (curva en U) reutilizada en todas las etapas.
function jawPath() {
  return `M40 60 Q40 150 130 165 Q230 178 230 178 Q330 165 380 150 Q420 135 420 60`;
}

function stage0() {
  // Diagnóstico: escáner que barre la mandíbula + puntos de datos del TAC.
  return `
  <svg viewBox="0 0 460 260" role="img" aria-label="Etapa 1, 09:00: un escáner 3D barre la mandíbula durante el diagnóstico con radiología TAC.">
    <path d="${jawPath()}" fill="none" stroke="${C.bone}" stroke-width="3" stroke-linecap="round"/>
    <g stroke="${C.faint}" stroke-width="1">
      <line x1="40" y1="60" x2="40" y2="120"/><line x1="420" y1="60" x2="420" y2="120"/>
    </g>
    <!-- haz del escáner -->
    <rect x="150" y="20" width="3" height="220" fill="${C.line}" opacity="0.9">
      <animate attributeName="x" values="60;360;60" dur="3s" repeatCount="indefinite"/>
    </rect>
    <rect x="60" y="20" width="100" height="220" fill="${C.line}" opacity="0.08">
      <animate attributeName="x" values="60;260;60" dur="3s" repeatCount="indefinite"/>
    </rect>
    <!-- puntos de datos -->
    <g fill="${C.line}">
      <circle cx="130" cy="165" r="3"/><circle cx="230" cy="178" r="3"/><circle cx="330" cy="165" r="3"/>
    </g>
    <text x="40" y="245" fill="${C.line}" font-family="monospace" font-size="11">TAC · 09:00 · escaneando…</text>
  </svg>`;
}

function stage1() {
  // Cirugía: implante de titanio desciende hacia la mandíbula.
  return `
  <svg viewBox="0 0 460 260" role="img" aria-label="Etapa 2, 11:00: un implante de titanio desciende e ingresa en la mandíbula con precisión, en cirugía indolora.">
    <path d="${jawPath()}" fill="none" stroke="${C.bone}" stroke-width="3" stroke-linecap="round"/>
    <!-- guía de inserción -->
    <line x1="230" y1="10" x2="230" y2="150" stroke="${C.faint}" stroke-width="1" stroke-dasharray="4 4"/>
    <!-- implante (tornillo estilizado) -->
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,-40;0,0;0,0" dur="2.4s" repeatCount="indefinite"/>
      <rect x="222" y="95" width="16" height="60" rx="4" fill="${C.titanium}" stroke="${C.line}" stroke-width="1.5"/>
      <g stroke="${C.line}" stroke-width="1.2">
        <line x1="222" y1="108" x2="238" y2="112"/><line x1="222" y1="120" x2="238" y2="124"/>
        <line x1="222" y1="132" x2="238" y2="136"/><line x1="222" y1="144" x2="238" y2="148"/>
      </g>
    </g>
    <text x="40" y="245" fill="${C.line}" font-family="monospace" font-size="11">11:00 · anestesia local · indoloro</text>
  </svg>`;
}

function stage2() {
  // Dientes fijos: la corona se ensambla sobre el implante.
  return `
  <svg viewBox="0 0 460 260" role="img" aria-label="Etapa 3, 17:00: la prótesis o corona se ensambla sobre el implante el mismo día. Dientes fijos.">
    <path d="${jawPath()}" fill="none" stroke="${C.bone}" stroke-width="3" stroke-linecap="round"/>
    <rect x="222" y="105" width="16" height="55" rx="4" fill="${C.titanium}" stroke="${C.line}" stroke-width="1.5"/>
    <!-- corona descendiendo y asentándose -->
    <g>
      <animateTransform attributeName="transform" type="translate" values="0,-30;0,0" dur="1.6s" repeatCount="indefinite"/>
      <path d="M214 96 Q230 78 246 96 Q248 110 230 112 Q212 110 214 96 Z" fill="${C.crown}" stroke="${C.line}" stroke-width="1.5"/>
    </g>
    <!-- destellos de "listo" -->
    <g fill="${C.success}">
      <circle cx="120" cy="150" r="2.5"/><circle cx="330" cy="150" r="2.5"/>
    </g>
    <text x="40" y="245" fill="${C.line}" font-family="monospace" font-size="11">17:00 · dientes fijos · mismo día</text>
  </svg>`;
}

function stage3() {
  // Control: mandíbula completa con check de éxito.
  return `
  <svg viewBox="0 0 460 260" role="img" aria-label="Etapa 4, una semana después: control de seguimiento, retiro de puntos y garantía del implante.">
    <path d="${jawPath()}" fill="none" stroke="${C.bone}" stroke-width="3" stroke-linecap="round"/>
    <!-- dentadura completa estilizada -->
    <g fill="${C.crown}" stroke="${C.line}" stroke-width="1">
      <path d="M104 150 q14 -16 28 0 q2 10 -14 11 q-16 -1 -14 -11Z"/>
      <path d="M150 160 q14 -16 28 0 q2 10 -14 11 q-16 -1 -14 -11Z"/>
      <path d="M214 165 q16 -18 32 0 q2 11 -16 12 q-18 -1 -16 -12Z"/>
      <path d="M286 160 q14 -16 28 0 q2 10 -14 11 q-16 -1 -14 -11Z"/>
      <path d="M332 150 q14 -16 28 0 q2 10 -14 11 q-16 -1 -14 -11Z"/>
    </g>
    <!-- check de éxito -->
    <g transform="translate(360 40)">
      <circle r="22" fill="none" stroke="${C.success}" stroke-width="2.5"/>
      <path d="M-10 0 l7 8 l14 -17" fill="none" stroke="${C.success}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </g>
    <text x="40" y="245" fill="${C.success}" font-family="monospace" font-size="11">+1 semana · control ok · garantía ∞</text>
  </svg>`;
}

const STAGES = [stage0, stage1, stage2, stage3];

export function buildSvgStages(container) {
  container.innerHTML = '';
  const nodes = STAGES.map((fn, i) => {
    const wrap = document.createElement('div');
    wrap.className = 'svg-stage' + (i === 0 ? ' is-active' : '');
    wrap.dataset.stage = String(i);
    wrap.innerHTML = fn();
    container.appendChild(wrap);
    return wrap;
  });
  return nodes;
}

/* Activa la etapa i (0..3), desvaneciendo las demás. */
export function setSvgStage(nodes, i) {
  nodes.forEach((n, idx) => n.classList.toggle('is-active', idx === i));
}
