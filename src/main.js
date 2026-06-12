/* ===========================================================================
   AC Odontología — entry point
   Orquesta: smooth scroll (Lenis), nav, count-up, reveals, formulario demo,
   y la carga perezosa del scrollytelling 3D / fallback SVG.
   =========================================================================== */
import './style.css';
import { initNav } from './nav.js';
import { initCounters } from './counters.js';
import { initReveals } from './reveals.js';
import { initTeam } from './team.js';
import { initContactForm } from './contact.js';
import { initStory } from './story.js';

// ---- Detección de capacidades: decide 3D vs. fallback SVG ----
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

export function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch (e) {
    return false;
  }
}

// Flag manual para apagar el 3D en pitches sobre equipos lentos:
//   ?3d=off  en la URL, o  window.AC_DISABLE_3D = true
function is3dDisabledByFlag() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('3d') === 'off') return true;
  if (window.AC_DISABLE_3D === true) return true;
  return false;
}

// Heurística de gama baja: poca memoria o pocos núcleos → fallback SVG.
function isLowEndDevice() {
  const mem = navigator.deviceMemory;
  const cores = navigator.hardwareConcurrency;
  if (typeof mem === 'number' && mem <= 2) return true;
  if (typeof cores === 'number' && cores <= 2) return true;
  return false;
}

export function should3DRun() {
  if (is3dDisabledByFlag()) return false;
  if (prefersReducedMotion()) return false;
  if (!supportsWebGL()) return false;
  if (isLowEndDevice()) return false;
  return true;
}

// --------------------------------------------------------------------------
function boot() {
  initNav();
  initCounters();
  initReveals();
  initTeam();
  initContactForm();
  // El motor del scrollytelling decide internamente 3D vs SVG y carga
  // Three.js de forma perezosa solo si corresponde.
  initStory({ enable3D: should3DRun() });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
