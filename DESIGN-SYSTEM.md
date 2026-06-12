# Sistema de diseño — AC Odontología (demo)

Documento de traspaso ("handoff"). Reúne la identidad visual del sitio para
que cualquiera —un diseñador, tú, u otra sesión de Claude— pueda continuar el
trabajo sin adivinar nada. Todos los valores ya están implementados en
`tailwind.config.js` y `src/style.css`.

Personalidad: **quirúrgico-premium**. Precisión alemana con calidez chilena.
Modo oscuro como identidad (contraste total con la web #1, marfil/luminosa).

---

## 1. Color (tokens)

| Token | HEX | Uso |
| --- | --- | --- |
| `night` (fondo base) | `#0B1B2B` | Fondo principal, azul noche |
| `night.900` | `#081523` | Secciones más profundas, nav scrolled |
| `night.700` | `#102639` | Tarjetas/superficies elevadas |
| `brand` | `#035390` | Azul del logo (base de identidad) |
| `brand.deep` | `#024066` | Degradados, sombras de marca |
| `brand.cyan` | `#4EA1D3` | **Acento principal** (celeste del logo) |
| `brand.glow` | `#67c1f0` | Glows, gradientes de texto |
| `surgical` | `#F2F7FB` | Texto principal (blanco quirúrgico) |
| `success` | `#3ECf8E` | Solo checks/éxito (verde discreto) |

Regla: el cian es para acentos y datos; el verde **solo** para "logrado/éxito".
Nada de neón gamer.

---

## 2. Tipografía

| Rol | Fuente | Notas |
| --- | --- | --- |
| Títulos (display) | **Space Grotesk** 500–700 | Sans geométrica técnica, `letter-spacing: -0.02em` |
| Texto | **Inter** 400–600 | Neutra, legible |
| Cifras | Inter/Space + `tabular-nums` | Números alineados para los contadores |

Fuentes vía Google Fonts (ya enlazadas en `index.html`).

---

## 3. Componentes clave

- **Botones** `.btn` → `.btn--primary` (gradiente cian→azul), `.btn--ghost`
  (borde translúcido), modificadores `.btn--lg`, `.btn--block`.
- **Eyebrow** `.eyebrow` → etiqueta superior con punto cian luminoso.
- **Tarjetas** → radio 16–24px, borde `white/10`, fondo `white/2`, hover que
  sube 4px y enciende borde cian.
- **HUD del scrollytelling** → pastilla con hora + etapa, estilo blueprint.
- **Retícula blueprint** → `bg-blueprint`, líneas cian al 6%.

---

## 4. Movimiento

- Smooth scroll con **Lenis** (off si `prefers-reduced-motion`).
- Scrollytelling con **GSAP ScrollTrigger** sincronizado al scroll.
- Reveals al entrar en viewport; count-up de cifras (easeOutCubic).
- Todo respeta `prefers-reduced-motion` (sin animación, estados finales).

---

## 5. Activos y storytelling 3D

- Mandíbula, implante y corona **construidos por código** en Three.js
  (`src/scene3d.js`). Sin archivos `.glb`. Editables ahí mismo.
- Fallback SVG por etapa en `src/svgStages.js` (mismo relato, sin WebGL).
- Las 4 etapas: 09:00 Diagnóstico · 11:00 Cirugía · 17:00 Dientes fijos ·
  +1 sem Control.

---

## 6. Cómo continuar el diseño

1. **Colores/tipografía** → editar `tailwind.config.js` (sección `theme.extend`).
2. **Estilos de componentes** → `src/style.css` (organizado por sección).
3. **Animación 3D** → `src/scene3d.js` (materiales, posiciones, etapas).
4. Tras cualquier cambio: `npm run dev` para ver, `npm run build` para validar.

---

## 7. Exportables de marca (opcional)

La identidad de este sitio (paleta + tipografía + logo "AC") puede llevarse a
piezas de marketing. Hay integración con **Canva** disponible si quieres generar
posts de Instagram, flyers o un pitch deck con estos mismos colores y tipografías.
