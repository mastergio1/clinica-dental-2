# AC Odontología — Sitio demo (portafolio web #2)

Maqueta funcional de máxima calidad para **AC Odontología (Grupo AltoCordillera)**,
clínica dental en Av. Kennedy 7100, Vitacura, Santiago. Es una pieza
**especulativa de portafolio**: no es el sitio oficial de la clínica.

Su tratamiento estrella —**implantes y dientes fijos en un solo día** (carga
inmediata)— se convierte en una **experiencia scroll-driven en 3D** que recorre
el día del paciente hora por hora.

> **Sitio demo no oficial.** Las cifras se citan tal como las declara la clínica
> en su sitio. Las fotos del equipo y los testimonios son **placeholder**.

---

## Por qué esta demo vende (3 argumentos)

1. **Su tratamiento estrella convertido en experiencia.** El implante de carga
   inmediata se cuenta como una jornada de 24 h en una escena 3D interactiva
   (Three.js) sincronizada con el scroll.
2. **Integra el Dentalink que ya usan.** Todos los CTA de conversión apuntan a
   su agenda real de Dentalink. La demo muestra que lo integro, no que lo
   reemplazo.
3. **De "Lorem ipsum" y errores PHP a Lighthouse 90+.** Salto medible desde una
   web de ~2015 a una pieza con modo oscuro quirúrgico, accesibilidad AA y SEO
   on-page (schema.org `Dentist` con datos reales).

---

## Cómo correr

```bash
npm install
npm run dev      # entorno de desarrollo (Vite)
npm run build    # build de producción en dist/
npm run preview  # sirve el build de producción
```

Requiere Node 18+.

---

## Apagar el 3D (pitch en equipos lentos)

La escena 3D pesada (Three.js) se **carga de forma perezosa** y solo si el
dispositivo la soporta. Puedes forzar el **fallback SVG** —mismo storytelling,
sin WebGL— de tres formas:

| Método | Cómo |
| --- | --- |
| Flag por URL | Abre el sitio con `?3d=off` (ej. `localhost:5173/?3d=off`) |
| Flag global | Define `window.AC_DISABLE_3D = true` antes de cargar `main.js` |
| Automático | Se activa solo con `prefers-reduced-motion`, sin WebGL, o en dispositivos de gama baja (≤2 GB RAM / ≤2 núcleos) |

El sitio también degrada a SVG automáticamente si Three.js o GSAP fallan al
cargar.

---

## Stack técnico

- **Vite** + HTML/CSS/JS vanilla + **Tailwind CSS**
- **Three.js** — mandíbula, implante y corona construidos 100% por código
  (geometrías primitivas: tube, lathe, cylinder…). No depende de archivos `.glb`.
- **GSAP + ScrollTrigger** — sincronizan la animación 3D con el scroll.
- **Lenis** — smooth scrolling (se desactiva con `prefers-reduced-motion`).

Three.js y GSAP se separan en chunks propios y se importan dinámicamente, para
no penalizar el primer pintado.

---

## Qué es dato real vs. placeholder

**Dato real (declarado por la clínica en su sitio público):**

- Nombre, dirección, teléfono, email, IG y horario.
- Fundador: Dr. Carlos Corvalán Fuentealba; equipo de ~21 dentistas.
- Tratamiento estrella: implantología inmediata ("dientes fijos en 1 día").
- Cifras: +5.000 pacientes de implantes, +7.000 tratamientos exitosos, 90% del
  staff con postgrado, +50 odontólogos derivadores, >99,5% de éxito, garantía
  ilimitada (con pauta de mantenimiento), 304 reseñas 5★.
- Diferenciadores: pabellón SEREMI, sedación consciente/IV, PRP, salas de
  recuperación, CEREC, microscopía endodóntica, Invisalign, radiología 3D (TAC),
  blanqueamiento Philips Zoom, evaluación inicial gratuita, hasta 3 cuotas sin
  interés.
- 15 especialidades y agenda Dentalink (link real).

Todas las cifras aparecen en pantalla atribuidas como *"declarado por la
clínica"*.

**Placeholder (a reemplazar con material real de la clínica):**

- Fotos del equipo (siluetas marcadas `[Foto real]`); no se inventan nombres ni
  especialidades.
- Testimonios (marcados; la clínica declara 304 reseñas 5★ en Google).

---

## Estructura

```
index.html            # one-page con las 12 secciones, SEO y schema.org
src/
  main.js             # entry: detección de capacidades + boot
  nav.js              # nav fija + menú mobile + Lenis smooth scroll
  story.js            # orquesta scrollytelling (3D vs SVG) + HUD/pasos
  scene3d.js          # escena Three.js (mandíbula + implante + corona)
  svgStages.js        # fallback SVG: 4 ilustraciones por etapa
  counters.js         # count-up de cifras (es-CL, tabular-nums)
  reveals.js          # reveal de secciones al hacer scroll
  team.js             # grid de equipo (siluetas placeholder)
  contact.js          # formulario demo (simula envío)
  style.css           # Tailwind + estilos del modo oscuro quirúrgico
public/
  favicon.svg
  og-image.svg
```

---

## Accesibilidad y performance

- Contraste AA en modo oscuro; foco visible en todos los interactivos.
- `prefers-reduced-motion` real: sin smooth scroll, sin animación 3D, cifras sin
  count-up, fallback SVG estático.
- Texto alternativo en cada etapa del scrollytelling (`aria-label` en cada SVG).
- Skip link, `iframe` del mapa con `loading="lazy"`, escena 3D lazy-load con
  poster estático en el hero.
