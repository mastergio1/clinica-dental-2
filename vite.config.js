import { defineConfig } from 'vite';

// Three.js es la dependencia más pesada: la separamos en su propio chunk
// para que el resto del sitio (hero, cifras, secciones) cargue al instante
// y el bundle 3D solo pese cuando el navegador lo pide (lazy import).
export default defineConfig({
  build: {
    target: 'es2019',
    rollupOptions: {
      output: {
        manualChunks: {
          three: ['three'],
          gsap: ['gsap'],
        },
      },
    },
  },
});
