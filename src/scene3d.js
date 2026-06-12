/* ===========================================================================
   Escena 3D — mandíbula + implante + corona, construida 100% por código
   (sin .glb externos). Estilo abstracto-médico: low-poly, materiales mate,
   acentos cian. setProgress(0..1) recorre las 4 etapas del tratamiento.
   =========================================================================== */
import * as THREE from 'three';

const STAGE = { DIAGNOSIS: 0, SURGERY: 1, CROWN: 2, CONTROL: 3 };

// easing
const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
const clamp01 = (v) => Math.max(0, Math.min(1, v));

// --------------------------------------------------------------------------
// Geometría de la arcada: una curva en U sobre la que colocamos los dientes.
function makeJawCurve() {
  const pts = [];
  const segs = 24;
  // Semielipse abierta hacia atrás (forma de herradura).
  for (let i = 0; i <= segs; i++) {
    const a = Math.PI * (0.08 + (i / segs) * 0.84); // 0.08π .. 0.92π
    const x = Math.cos(a) * 2.4;
    const z = Math.sin(a) * 1.7;
    pts.push(new THREE.Vector3(x, 0, -z));
  }
  return new THREE.CatmullRomCurve3(pts, false, 'catmullrom', 0.5);
}

function buildJaw(materials) {
  const group = new THREE.Group();
  const curve = makeJawCurve();

  // Encía/hueso: tubo grueso siguiendo la curva.
  const gum = new THREE.Mesh(
    new THREE.TubeGeometry(curve, 64, 0.34, 12, false),
    materials.bone
  );
  gum.position.y = -0.32;
  group.add(gum);

  // Dientes: pequeños volúmenes redondeados a lo largo de la curva.
  const toothGeo = new THREE.IcosahedronGeometry(0.26, 1);
  const slots = 14;
  const teeth = [];
  for (let i = 0; i < slots; i++) {
    const t = (i + 0.5) / slots;
    const p = curve.getPointAt(t);
    const tooth = new THREE.Mesh(toothGeo, materials.tooth);
    tooth.position.set(p.x, 0.05, p.z);
    tooth.scale.set(0.9, 1.25, 0.9);
    tooth.userData.slot = i;
    group.add(tooth);
    teeth.push(tooth);
  }

  // Reservamos un hueco frontal-central para el implante (lo dejamos vacío).
  const gapSlot = Math.floor(slots / 2);
  const gapTooth = teeth[gapSlot];
  const socketPos = gapTooth.position.clone();
  gapTooth.visible = false; // empezará oculto; aparecerá la corona luego.

  return { group, curve, teeth, gapTooth, socketPos };
}

function buildImplant(materials) {
  const g = new THREE.Group();
  // Cuerpo del implante (tornillo estilizado).
  const body = new THREE.Mesh(
    new THREE.CylinderGeometry(0.1, 0.07, 0.5, 20),
    materials.titanium
  );
  g.add(body);
  // Punta cónica.
  const tip = new THREE.Mesh(
    new THREE.ConeGeometry(0.07, 0.16, 20),
    materials.titanium
  );
  tip.position.y = -0.33;
  g.add(tip);
  // Roscas: toros apilados (bajo costo, lectura "tornillo").
  const threadGeo = new THREE.TorusGeometry(0.105, 0.022, 6, 18);
  for (let i = 0; i < 5; i++) {
    const ring = new THREE.Mesh(threadGeo, materials.titanium);
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.18 - i * 0.09;
    ring.scale.setScalar(1 - i * 0.06);
    g.add(ring);
  }
  // Pilar superior.
  const abut = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.08, 0.14, 16),
    materials.titanium
  );
  abut.position.y = 0.3;
  g.add(abut);
  return g;
}

function buildCrown(materials) {
  // Corona: forma redondeada (lathe) en cerámica blanca.
  const points = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const y = t * 0.34;
    const r = 0.18 * Math.sin(t * Math.PI * 0.9 + 0.25);
    points.push(new THREE.Vector2(Math.max(0.02, r), y));
  }
  const geo = new THREE.LatheGeometry(points, 16);
  const crown = new THREE.Mesh(geo, materials.crown);
  return crown;
}

// --------------------------------------------------------------------------
export function createScene({ container, mode = 'story' }) {
  const renderer = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true,
    powerPreference: 'high-performance',
  });
  renderer.setClearColor(0x000000, 0);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0b1b2b, 0.12);

  const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
  camera.position.set(0, 1.4, 6.2);
  camera.lookAt(0, 0, 0);

  // ---- Luces: clave fría + relleno cian + contraluz ----
  scene.add(new THREE.AmbientLight(0x4a6378, 0.7));
  const key = new THREE.DirectionalLight(0xffffff, 1.1);
  key.position.set(3, 5, 4);
  scene.add(key);
  const fill = new THREE.PointLight(0x4ea1d3, 0.9, 20);
  fill.position.set(-3, 1, 3);
  scene.add(fill);
  const rim = new THREE.DirectionalLight(0x67c1f0, 0.6);
  rim.position.set(-2, 2, -4);
  scene.add(rim);

  // ---- Materiales ----
  const materials = {
    bone: new THREE.MeshStandardMaterial({ color: 0xdfe9f1, roughness: 0.85, metalness: 0.0, flatShading: true }),
    tooth: new THREE.MeshStandardMaterial({ color: 0xf2f7fb, roughness: 0.55, metalness: 0.05, flatShading: true }),
    titanium: new THREE.MeshStandardMaterial({ color: 0xb9c7d2, roughness: 0.35, metalness: 0.75 }),
    crown: new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3, metalness: 0.1, emissive: 0x0a1622, emissiveIntensity: 0.2 }),
  };

  // ---- Objetos ----
  const root = new THREE.Group();
  scene.add(root);

  const jaw = buildJaw(materials);
  root.add(jaw.group);

  const implant = buildImplant(materials);
  implant.position.copy(jaw.socketPos);
  implant.visible = false;
  root.add(implant);

  const crown = buildCrown(materials);
  crown.position.copy(jaw.socketPos);
  crown.position.y += 0.18;
  crown.visible = false;
  root.add(crown);

  // ---- Escáner (plano emisivo que barre en la etapa de diagnóstico) ----
  const scanner = new THREE.Mesh(
    new THREE.PlaneGeometry(5.6, 2.4),
    new THREE.MeshBasicMaterial({ color: 0x4ea1d3, transparent: true, opacity: 0.16, side: THREE.DoubleSide, depthWrite: false })
  );
  scanner.rotation.y = Math.PI / 2;
  scene.add(scanner);

  const scanLine = new THREE.Mesh(
    new THREE.PlaneGeometry(0.04, 2.4),
    new THREE.MeshBasicMaterial({ color: 0x9fe0ff, transparent: true, opacity: 0.9, depthWrite: false })
  );
  scanLine.rotation.y = Math.PI / 2;
  scene.add(scanLine);

  // ---- Partículas tenues de fondo (puntos de datos del TAC) ----
  const dotGeo = new THREE.BufferGeometry();
  const N = 60;
  const arr = new Float32Array(N * 3);
  for (let i = 0; i < N; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 8;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 4;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 6;
  }
  dotGeo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
  const dots = new THREE.Points(
    dotGeo,
    new THREE.PointsMaterial({ color: 0x4ea1d3, size: 0.03, transparent: true, opacity: 0.5 })
  );
  scene.add(dots);

  // ---- Estado ----
  let progress = 0;
  let targetRotY = 0;
  let curRotY = 0;
  const pointer = { x: 0, y: 0 };
  let running = false;
  let rafId = null;
  let lastTime = 0;

  container.appendChild(renderer.domElement);

  function resize() {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
  }
  resize();

  // ---- Lógica de etapas según progress global (0..1) ----
  function applyProgress(p, time) {
    const sub = (a, b) => clamp01((p - a) / (b - a)); // progreso dentro de [a,b]

    // Etapa 1 — Diagnóstico [0, .28]: escáner activo, sin implante/corona.
    const diag = sub(0, 0.28);
    const scanActive = p < 0.3;
    scanLine.visible = scanActive;
    scanner.visible = scanActive;
    if (scanActive) {
      const sweep = (Math.sin(time * 0.0016) * 0.5 + 0.5); // vaivén continuo
      scanLine.position.x = -2.6 + sweep * 5.2;
      scanner.position.x = scanLine.position.x;
    }

    // Etapa 2 — Cirugía [.28, .52]: el implante desciende al alvéolo.
    const surg = easeInOut(sub(0.28, 0.52));
    implant.visible = p >= 0.27;
    if (implant.visible) {
      implant.position.y = jaw.socketPos.y + (1 - surg) * 2.6; // baja desde arriba
      implant.rotation.y = (1 - surg) * Math.PI * 3; // gira al atornillarse
    }

    // Etapa 3 — Dientes fijos [.52, .76]: la corona se asienta.
    const place = easeInOut(sub(0.52, 0.76));
    crown.visible = p >= 0.5;
    if (crown.visible) {
      crown.position.y = jaw.socketPos.y + 0.18 + (1 - place) * 2.0;
      materials.crown.emissiveIntensity = 0.2 + place * 0.2;
    }

    // Etapa 4 — Control [.76, 1]: dentadura completa, brillo de éxito.
    const done = sub(0.76, 1);
    if (done > 0) {
      // El diente que faltaba reaparece bajo la corona (encaje final).
      jaw.gapTooth.visible = false; // la corona ocupa su lugar
      materials.tooth.emissive = new THREE.Color(0x0e2a20);
      materials.tooth.emissiveIntensity = done * 0.25;
    } else {
      materials.tooth.emissiveIntensity = 0;
    }

    // Rotación de presentación: la mandíbula gira suavemente a lo largo del relato.
    targetRotY = -0.5 + p * 0.9 + pointer.x * 0.35;
    const tilt = mode === 'hero' ? pointer.y * 0.2 : 0.1 + p * 0.05;
    root.rotation.x = tilt;
  }

  function renderFrame(time) {
    const dt = time - lastTime;
    lastTime = time;

    if (mode === 'hero') {
      // Rotación idle + parallax con el puntero.
      targetRotY = time * 0.00012 + pointer.x * 0.4;
      root.rotation.x = 0.12 + pointer.y * 0.18;
    }

    curRotY += (targetRotY - curRotY) * 0.06;
    root.rotation.y = curRotY;

    applyProgress(progress, time);

    dots.rotation.y = time * 0.00004;

    renderer.render(scene, camera);
    if (running) rafId = requestAnimationFrame(renderFrame);
  }

  function start() {
    if (running) return;
    running = true;
    lastTime = performance.now();
    rafId = requestAnimationFrame(renderFrame);
  }
  function stop() {
    running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function setProgress(p) {
    progress = clamp01(p);
    if (!running) {
      // Render puntual aunque el loop esté pausado (p. ej. scroll discreto).
      renderFrame(performance.now());
    }
  }

  function onPointer(nx, ny) {
    pointer.x = nx;
    pointer.y = ny;
  }

  function dispose() {
    stop();
    scene.traverse((o) => {
      if (o.geometry) o.geometry.dispose();
      if (o.material) {
        const m = Array.isArray(o.material) ? o.material : [o.material];
        m.forEach((mm) => mm.dispose());
      }
    });
    renderer.dispose();
    if (renderer.domElement.parentNode) {
      renderer.domElement.parentNode.removeChild(renderer.domElement);
    }
  }

  // Posición inicial para 'hero': mostramos la dentadura ya terminada.
  if (mode === 'hero') {
    implant.visible = false;
    crown.visible = true;
    crown.position.y = jaw.socketPos.y + 0.18;
    jaw.gapTooth.visible = false;
    scanner.visible = false;
    scanLine.visible = false;
  }

  return { renderer, scene, camera, resize, start, stop, setProgress, onPointer, dispose, STAGE };
}
