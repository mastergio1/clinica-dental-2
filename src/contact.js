/* Formulario de contacto demo: simula el envío (no hay backend). Deja claro
   en pantalla que el canal real de agenda es Dentalink. */

export function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  const status = document.getElementById('cf-status');
  const button = form.querySelector('button[type="submit"]');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = form.querySelector('#cf-name');
    const phone = form.querySelector('#cf-phone');
    if (!name.value.trim() || !phone.value.trim()) {
      status.style.color = '';
      status.classList.remove('text-success');
      status.textContent = 'Completa tu nombre y teléfono para continuar.';
      status.style.color = '#ff9b9b';
      return;
    }

    const original = button.textContent;
    button.disabled = true;
    button.textContent = 'Enviando…';

    // Simulación de envío (demo, sin backend).
    setTimeout(() => {
      status.style.color = '';
      status.textContent =
        '¡Gracias! Esto es una demo: en producción te contactaríamos. Para agendar ahora, usa el botón de Dentalink.';
      form.reset();
      button.disabled = false;
      button.textContent = original;
    }, 900);
  });
}
