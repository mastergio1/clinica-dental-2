# Contexto del proyecto — Sitio demo "AC Odontología"

> **Cómo usar este archivo:** pégalo (o súbelo) como primer mensaje en una nueva
> sesión de Claude para que retome el proyecto con todo el contexto. Es
> autocontenido: explica qué es el sitio, cómo está hecho, qué falta y cómo
> seguir.

---

## 0. Resumen en una línea

Sitio web **demo no oficial** (pieza #2 de portafolio) para una clínica dental
real de Santiago, **AC Odontología**, cuyo centro es un **scrollytelling 3D** que
cuenta el tratamiento de implante de carga inmediata como "un día, una sonrisa".

---

## 1. Qué es y para qué

- Maqueta **especulativa** para un pitch de venta (no es el sitio oficial).
- Soy un dev que vende sitios inmersivos a clínicas dentales premium.
- La web #1 del portafolio era elegante/heritage (marfil, luminosa). **Esta es lo
  opuesto: alta tecnología quirúrgica, precisión, modo oscuro** — para mostrar
  rango.
- Argumentos de venta de esta demo:
  1. Su tratamiento estrella (implantes en 1 día) convertido en **experiencia 3D**.
  2. **Integra el Dentalink** que la clínica ya usa (no lo reemplaza).
  3. Salto medible: de su web 2015 con "Lorem ipsum" y errores PHP → **Lighthouse 90+**.

---

## 2. Datos reales del cliente (NO inventar nada fuera de esto)

- **Nombre:** AC Odontología (Grupo AltoCordillera)
- **Dirección:** Avenida Kennedy 7100, Of. 606, Vitacura, Santiago
- **Teléfono:** +56 2 2969 1483 · **Email:** info@acodontologia.cl · **IG:** @ac_odontologia_
- **Horario:** Lunes a Viernes, 9:00–19:00
- **Fundador:** Dr. Carlos Corvalán Fuentealba (equipo de ~21 dentistas)
- **Tratamiento estrella:** Implantología Inmediata — "implantes y dientes fijos en 1 día" (carga inmediata, pioneros en Chile)
- **Cifras (citar siempre como "declarado por la clínica"):** +5.000 pacientes de
  implantes · +7.000 tratamientos exitosos · 90% del staff con postgrado · +50
  odontólogos derivadores · >99,5% de éxito · garantía ilimitada (con pauta de
  mantenimiento) · 304 reseñas Google 5★
- **Diferenciadores:** pabellón certificado SEREMI, sedación consciente e IV
  ("sin dolor"), PRP, salas de recuperación, CEREC, microscopía endodóntica,
  Invisalign, radiología 3D (TAC), blanqueamiento Philips Zoom, evaluación inicial
  gratuita, hasta 3 cuotas sin interés
- **15 especialidades:** Implantología Oral, Implantología Inmediata,
  Rehabilitación CEREC, Endodoncia, Cirugía Bucal, Ortodoncia, Invisalign,
  Odontopediatría, Periodoncia, Radiología, Radiología 3D, TTM y Dolor Orofacial,
  Estética Facial, Sedación, Blanqueamiento
- **Agenda real (Dentalink):**
  `https://0bca04fa4cd41c2955e675dcac39c21b0aebaec5.agenda.softwaredentalink.com/agendas/agendamiento`
- **Colores de su logo:** azul `#035390` y celeste `#4EA1D3`.

**Placeholder (a reemplazar con material real):** fotos del equipo (siluetas
marcadas), testimonios. No se inventan nombres ni especialidades del equipo.

---

## 3. Stack técnico

- **Vite** + HTML/CSS/JS vanilla + **Tailwind CSS**
- **Three.js** — mandíbula, implante y corona construidos 100% por código
  (geometrías primitivas: tube, lathe, cylinder…). Sin archivos `.glb`.
- **GSAP + ScrollTrigger** — sincronizan la animación 3D con el scroll.
- **Lenis** — smooth scrolling (off con `prefers-reduced-motion`).
- Three.js y GSAP se cargan **lazy** (chunks propios) para no penalizar el primer pintado.

Comandos:
```bash
npm install
npm run dev      # desarrollo
npm run build    # producción (debe quedar sin warnings)
npm run preview
```

Apagar el 3D en equipos lentos: abrir con `?3d=off`, o `window.AC_DISABLE_3D = true`.

---

## 4. Estructura de archivos

```
index.html            # one-page: 12 secciones, SEO, schema.org Dentist,
                      #   comentario inicial con los 3 argumentos de venta
src/
  main.js             # entry: detección de capacidades (WebGL, reduced-motion,
                      #   gama baja, flag ?3d=off) + boot
  nav.js              # nav fija + menú mobile + Lenis smooth scroll
  story.js            # orquesta scrollytelling (3D vs SVG) + HUD + pasos
  scene3d.js          # escena Three.js (mandíbula + implante + corona),
                      #   setProgress(0..1) recorre las 4 etapas
  svgStages.js        # fallback SVG: 4 ilustraciones, una por etapa
  counters.js         # count-up de cifras (formato es-CL, tabular-nums)
  reveals.js          # reveal de secciones al hacer scroll
  team.js             # grid de equipo (siluetas placeholder, sin inventar)
  contact.js          # formulario demo (simula envío, sin backend)
  style.css           # Tailwind + estilos del modo oscuro quirúrgico
public/
  favicon.svg
  og-image.svg
tailwind.config.js    # tokens de color y tipografía
vite.config.js        # manualChunks: three / gsap separados
README.md             # documentación general
DESIGN-SYSTEM.md      # tokens de identidad visual (handoff de diseño)
```

---

## 5. Las 12 secciones (one-page con anclas + nav fija)

1. **Hero** — "Implantes y dientes fijos en un solo día" + escena 3D de fondo + CTA Dentalink + WhatsApp.
2. **Barra de cifras** — count-up al entrar en viewport (atribuidas a la clínica).
3. **Scrollytelling 3D "Un día. Una sonrisa."** — sección estrella (4 etapas: 09:00 Diagnóstico, 11:00 Cirugía, 17:00 Dientes fijos, +1 sem Control).
4. **"Sin dolor, en serio"** — sedación, pabellón SEREMI, salas de recuperación, PRP.
5. **Tecnología** — CEREC, radiología 3D, microscopía, Invisalign, Zoom (hover states).
6. **Especialidades** — las 15 agrupadas (cirugía/estética/ortodoncia/familia).
7. **Equipo** — Dr. Carlos Corvalán + grid de siluetas placeholder.
8. **Confianza** — "+50 odontólogos derivan", garantía ilimitada, evaluación gratis, 3 cuotas.
9. **Testimonios** — 3 placeholders marcados.
10. **Ubicación** — mapa Google + horario real.
11. **Contacto/Agenda** — CTA a Dentalink + formulario demo + WhatsApp flotante.
12. **Footer** — datos reales + "sitio demo no oficial".

---

## 6. Sistema de diseño (resumen)

- **Personalidad:** quirúrgico-premium, modo oscuro como identidad.
- **Color:** fondo `#0B1B2B` (azul noche), acento cian `#4EA1D3`, texto blanco
  quirúrgico `#F2F7FB`, azul de marca `#035390`, verde-éxito `#3ECf8E` solo para checks.
- **Tipografía:** Space Grotesk (títulos) + Inter (texto), `tabular-nums` para cifras.
- **Detalles:** retícula blueprint sutil, HUD tipo medición en la escena 3D, glows
  cian discretos. Sin neón gamer.
- **Textos:** español de Chile, directo y seguro ("Llegas sin dientes fijos. Te vas con ellos.").

(Detalle completo en `DESIGN-SYSTEM.md`.)

---

## 7. Estado actual ✅

- Proyecto completo y funcionando: `npm run dev` ✓, `npm run build` **sin warnings** ✓.
- Las 12 secciones implementadas, responsive mobile-first.
- Escena 3D + fallback SVG + count-up + nav + formulario demo: listos.
- SEO on-page (title, meta, OG, schema.org Dentist), accesibilidad AA, foco
  visible, `prefers-reduced-motion` real.
- Todos los CTA apuntan al Dentalink real.

**Rama de trabajo:** `claude/session-title-unavailable-vsp7g6`
**Repo:** `mastergio1/clinica-dental-2`

---

## 8. Posibles próximos pasos (ideas, no obligatorias)

- Reemplazar fotos/nombres reales del equipo y testimonios de Google.
- Pasar Lighthouse y afinar performance (preload de fuentes, poster del hero como imagen real).
- Refinar la animación 3D (materiales, iluminación, transiciones entre etapas).
- Crear piezas de marketing con la misma marca (Canva).
- Crear el Pull Request para fusionar a la rama principal.

---

## 9. Reglas que NO se deben romper

- **Ningún dato inventado:** todo lo factual sale de la sección 2; lo demás es placeholder marcado.
- Cifras **siempre** atribuidas ("declarado por la clínica").
- CTA de agenda **siempre** al Dentalink real.
- `npm run build` debe quedar **sin warnings**.
- Respetar `prefers-reduced-motion` y accesibilidad AA.
- Nota "sitio demo no oficial" visible en el footer.
