/* Grid del equipo. Importante (ética de demo): NO inventamos nombres ni
   especialidades. Generamos siluetas placeholder explícitamente marcadas,
   listas para reemplazar con las fotos y nombres reales de la clínica. */

const SILHOUETTE = `
<svg viewBox="0 0 24 24" aria-hidden="true">
  <path fill="none" stroke="currentColor" stroke-width="1.5"
        d="M12 12.5a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM4.5 20a7.5 7.5 0 0 1 15 0"/>
</svg>`;

export function initTeam() {
  const grid = document.getElementById('team-grid');
  if (!grid) return;

  // ~20 integrantes además del fundador (la clínica declara un equipo de ~21).
  const count = 10;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < count; i++) {
    const card = document.createElement('div');
    card.className = 'team-card';
    card.innerHTML = `
      <div class="team-card__avatar">${SILHOUETTE}</div>
      <p class="team-card__name">[Integrante del equipo]</p>
      <p class="team-card__tag">[Foto real]</p>
    `;
    frag.appendChild(card);
  }
  grid.appendChild(frag);
}
