/* ============================================================
   JIRA initiatives — PM-quality writeups per feature flag
   ============================================================
   Each feature can register a "JIRA initiative" — the kind of
   structured doc a PM would paste into JIRA so engineering can
   pick it up and start scoping. The user clicks "Crear iniciativa
   JIRA" on the feature card and a modal opens with the formatted
   text + buttons to copy to clipboard or download as .md.

   The text is intentionally pre-written (no LLM call): the mockup
   has no backend, and a curated initiative is more useful than a
   generated one anyway. To register a new initiative use:

       JiraInitiatives.register('flag.key', { title, ... });
   ============================================================ */

(function () {
'use strict';

const REG = {};

function register(key, def) { REG[key] = def; }
function has(key) { return !!REG[key]; }

window.JiraInitiatives = {
    register, has,
    get: (key) => REG[key],
    show: openModal,
    // Aggregate access for the "all initiatives" browser.
    list: () => Object.keys(REG).map(key => ({ key, ...REG[key] })),
    count: () => Object.keys(REG).length,
    showList: openListModal
};

// ── Markdown builder ────────────────────────────────────────────
function buildMarkdown(def) {
    const lines = [];
    lines.push(`# ${def.title}`);
    lines.push('');
    if (def.epic)     lines.push(`**Epic / Iniciativa padre:** ${def.epic}`);
    if (def.estimate) lines.push(`**Estimación inicial:** ${def.estimate}`);
    if (def.priority) lines.push(`**Prioridad:** ${def.priority}`);
    if (def.epic || def.estimate || def.priority) lines.push('');

    if (def.context) {
        lines.push('## Contexto');
        lines.push(def.context);
        lines.push('');
    }

    if (def.problem) {
        lines.push('## Problema a resolver');
        lines.push(def.problem);
        lines.push('');
    }

    if (def.objective) {
        lines.push('## Objetivo');
        lines.push(def.objective);
        lines.push('');
    }

    if (def.inScope?.length) {
        lines.push('## Alcance funcional');
        def.inScope.forEach(i => lines.push(`- ${i}`));
        lines.push('');
    }

    if (def.outOfScope?.length) {
        lines.push('## Fuera de alcance');
        def.outOfScope.forEach(i => lines.push(`- ${i}`));
        lines.push('');
    }

    if (def.userStories?.length) {
        lines.push('## Historias de usuario');
        def.userStories.forEach(s => lines.push(`- ${s}`));
        lines.push('');
    }

    if (def.acceptanceCriteria?.length) {
        lines.push('## Criterios de aceptación');
        def.acceptanceCriteria.forEach(c => lines.push(`- [ ] ${c}`));
        lines.push('');
    }

    if (def.uxNotes?.length) {
        lines.push('## Notas de UX / diseño');
        def.uxNotes.forEach(n => lines.push(`- ${n}`));
        lines.push('');
    }

    if (def.metrics?.length) {
        lines.push('## Métricas de éxito');
        def.metrics.forEach(m => lines.push(`- ${m}`));
        lines.push('');
    }

    if (def.dependencies?.length) {
        lines.push('## Dependencias');
        def.dependencies.forEach(d => lines.push(`- ${d}`));
        lines.push('');
    }

    if (def.risks?.length) {
        lines.push('## Riesgos y consideraciones');
        def.risks.forEach(r => lines.push(`- ${r}`));
        lines.push('');
    }

    // Always link the live mockup so devs can poke at the feature.
    if (def.flagKey) {
        const liveBase = 'https://marcosnovo.github.io/RM_FanApp_Mockup/?dev=1';
        lines.push('## Mockup de referencia');
        lines.push(`Mockup interactivo: ${liveBase}`);
        lines.push(`Activa el flag \`${def.flagKey}\` en el panel "Funcionalidades" de la sidebar para ver el feature en vivo.`);
        lines.push('Desde la propia card puedes pulsar "Exportar flujo a PDF" para descargar las pantallas paso a paso.');
        lines.push('');
    }

    lines.push('---');
    lines.push(`_Generado desde el mockup el ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}._`);

    return lines.join('\n');
}

// ── Modal ───────────────────────────────────────────────────────
let _modalEl = null;
let _lastFocus = null;          // foco a restaurar al cerrar
let _prevBodyOverflow = null;   // overflow del body antes del scroll-lock

function openModal(flagKey) {
    const def = REG[flagKey];
    if (!def) {
        if (window.MockUI && window.MockUI.toast) {
            window.MockUI.toast('No hay iniciativa registrada para esta funcionalidad.', { type: 'warn' });
        }
        return;
    }
    const md = buildMarkdown({ ...def, flagKey });
    closeModal();

    // Recuerda el elemento con foco para devolvérselo al cerrar.
    _lastFocus = document.activeElement;

    const el = document.createElement('div');
    el.className = 'jira-modal-overlay';
    el.innerHTML = `
        <div class="jira-modal-backdrop" data-jira-action="close"></div>
        <div class="jira-modal-panel" role="dialog" aria-modal="true" aria-labelledby="jiraModalTitle">
            <div class="jira-modal-head">
                <div class="jira-modal-head-text">
                    <div class="jira-modal-kicker">Iniciativa de JIRA</div>
                    <div class="jira-modal-title" id="jiraModalTitle">${escapeHTML(def.title)}</div>
                </div>
                <button class="jira-modal-close" data-jira-action="close" aria-label="Cerrar">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/>
                    </svg>
                </button>
            </div>
            <pre class="jira-modal-body" id="jiraModalBody">${escapeHTML(md)}</pre>
            <div class="jira-modal-actions">
                <button class="jira-modal-btn ghost" data-jira-action="download">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M8 2v8M5 7l3 3 3-3"/><path d="M2 12v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1"/>
                    </svg>
                    Descargar .md
                </button>
                <button class="jira-modal-btn primary" data-jira-action="copy">
                    <svg viewBox="0 0 16 16" width="13" height="13" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round">
                        <rect x="5" y="5" width="9" height="9" rx="1.5"/><path d="M3 11V3a1 1 0 0 1 1-1h8"/>
                    </svg>
                    Copiar al portapapeles
                </button>
            </div>
            <div class="jira-modal-foot" id="jiraModalFoot" role="status" aria-live="polite"></div>
        </div>
    `;
    document.body.appendChild(el);
    _modalEl = el;

    // Bloquea el scroll del fondo mientras el modal está abierto.
    _prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    // Mueve el foco al botón de cerrar para que teclado / lectores de
    // pantalla entren en el diálogo.
    const closeBtn = el.querySelector('.jira-modal-close');
    if (closeBtn) closeBtn.focus();

    el.addEventListener('click', (e) => {
        const tgt = e.target.closest('[data-jira-action]');
        if (!tgt) return;
        const action = tgt.dataset.jiraAction;
        if (action === 'close') closeModal();
        else if (action === 'copy') copyMd(md);
        else if (action === 'download') downloadMd(def.title, md);
    });

    document.addEventListener('keydown', _escClose);
}

function closeModal() {
    if (_modalEl) { _modalEl.remove(); _modalEl = null; }
    document.removeEventListener('keydown', _escClose);
    // Restaura scroll y foco.
    document.body.style.overflow = _prevBodyOverflow || '';
    _prevBodyOverflow = null;
    if (_lastFocus && typeof _lastFocus.focus === 'function') {
        try { _lastFocus.focus(); } catch {}
    }
    _lastFocus = null;
}
function _escClose(e) { if (e.key === 'Escape') closeModal(); }

function flash(text, ok = true) {
    const f = document.getElementById('jiraModalFoot');
    if (!f) return;
    f.textContent = text;
    f.className = 'jira-modal-foot ' + (ok ? 'ok' : 'err');
    setTimeout(() => { if (f) { f.textContent = ''; f.className = 'jira-modal-foot'; } }, 2500);
}

// ── Aggregate "all initiatives" browser ─────────────────────────
let _listQuery = '';

function _priorityClass(p) {
    const s = (p || '').toLowerCase();
    if (s.includes('crít') || s.includes('alta')) return 'high';
    if (s.includes('media')) return 'med';
    if (s.includes('baja')) return 'low';
    return '';
}

// Agrupa las iniciativas por epic (respetando el orden de registro) y
// devuelve [{ epic, items: [{key, title, priority, estimate}] }].
function _groupedInitiatives(query) {
    const q = (query || '').trim().toLowerCase();
    const groups = new Map();
    for (const key of Object.keys(REG)) {
        const def = REG[key];
        const hay = `${def.title || ''} ${def.epic || ''} ${key}`.toLowerCase();
        if (q && !hay.includes(q)) continue;
        const epic = def.epic || 'Sin epic';
        if (!groups.has(epic)) groups.set(epic, []);
        groups.get(epic).push({ key, title: def.title || key, priority: def.priority, estimate: def.estimate });
    }
    return [...groups.entries()].map(([epic, items]) => ({ epic, items }));
}

function _renderListBody(query) {
    const groups = _groupedInitiatives(query);
    const total = Object.keys(REG).length;
    const shown = groups.reduce((n, g) => n + g.items.length, 0);
    if (!groups.length) {
        return `<div class="jira-list-empty">Ninguna iniciativa coincide con «${escapeHTML(query)}».</div>`;
    }
    const chip = (val, cls) => val ? `<span class="jira-chip ${cls}">${escapeHTML(val)}</span>` : '';
    const groupsHTML = groups.map(g => `
        <div class="jira-list-group">
            <div class="jira-list-group-head">
                <span class="jira-list-group-title">${escapeHTML(g.epic)}</span>
                <span class="jira-list-group-count">${g.items.length}</span>
            </div>
            ${g.items.map(it => `
                <button class="jira-list-item" data-jira-open="${escapeHTML(it.key)}">
                    <span class="jira-list-item-title">${escapeHTML(it.title)}</span>
                    <span class="jira-list-item-meta">
                        ${chip(it.priority, 'prio-' + _priorityClass(it.priority))}
                        ${chip(it.estimate, 'est')}
                    </span>
                </button>
            `).join('')}
        </div>
    `).join('');
    return `<div class="jira-list-count">${shown} de ${total} iniciativas</div>${groupsHTML}`;
}

function openListModal() {
    closeModal();
    _lastFocus = document.activeElement;
    _listQuery = '';

    const el = document.createElement('div');
    el.className = 'jira-modal-overlay';
    el.innerHTML = `
        <div class="jira-modal-backdrop" data-jira-action="close"></div>
        <div class="jira-modal-panel jira-list-panel" role="dialog" aria-modal="true" aria-labelledby="jiraListTitle">
            <div class="jira-modal-head">
                <div class="jira-modal-head-text">
                    <div class="jira-modal-kicker">Iniciativas de JIRA</div>
                    <div class="jira-modal-title" id="jiraListTitle">Todas las iniciativas</div>
                </div>
                <button class="jira-modal-close" data-jira-action="close" aria-label="Cerrar">
                    <svg viewBox="0 0 16 16" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round">
                        <line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/>
                    </svg>
                </button>
            </div>
            <div class="jira-list-search">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="19" y1="19" x2="15" y2="15"/></svg>
                <input type="search" id="jiraListSearch" placeholder="Filtrar por título, epic o key" autocomplete="off">
            </div>
            <div class="jira-list-body" id="jiraListBody">${_renderListBody('')}</div>
        </div>
    `;
    document.body.appendChild(el);
    _modalEl = el;
    _prevBodyOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const search = el.querySelector('#jiraListSearch');
    const body = el.querySelector('#jiraListBody');
    if (search) {
        search.focus();
        search.addEventListener('input', (e) => {
            _listQuery = e.target.value;
            body.innerHTML = _renderListBody(_listQuery);
        });
    }

    el.addEventListener('click', (e) => {
        const closeTgt = e.target.closest('[data-jira-action="close"]');
        if (closeTgt) { closeModal(); return; }
        const openTgt = e.target.closest('[data-jira-open]');
        if (openTgt) {
            // Cerrar la lista y abrir la ficha de la iniciativa.
            openModal(openTgt.dataset.jiraOpen);
        }
    });

    document.addEventListener('keydown', _escClose);
}

async function copyMd(md) {
    try {
        await navigator.clipboard.writeText(md);
        flash('✓ Copiado · pega en JIRA');
    } catch {
        // Fallback: select + execCommand (older browsers)
        try {
            const ta = document.createElement('textarea');
            ta.value = md;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            flash('✓ Copiado · pega en JIRA');
        } catch {
            flash('No se pudo copiar — selecciona el texto manualmente', false);
        }
    }
}

function downloadMd(title, md) {
    const slug = title.toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const blob = new Blob([md], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `iniciativa-${slug}.md`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    flash('✓ Descargado');
}

function escapeHTML(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'
    }[c]));
}

// ════════════════════════════════════════════════════════════════
// Initiative definitions — one per feature flag
// ════════════════════════════════════════════════════════════════

// ── Fan App ─────────────────────────────────────────────────────

register('fan.hoy.concept-mix', {
    flagKey: 'fan.hoy.concept-mix',
    title: 'Hoy v2 · Mi Mix — rediseño modular y configurable de la Home',
    epic: 'Fan App · Hoy',
    estimate: 'L (3-5 sprints)',
    priority: 'Alta',
    context: 'Tras el discovery interno de los conceptos del Hoy, el Club se decanta por "Mi Mix": una Home rediseñada que combina las mejores piezas validadas (feed vertical, predictor, racha, próximos partidos, mini-noticias y Bernabéu hoy) bajo una cabecera de bienvenida y un selector configurable de equipos y jugadores favoritos. El objetivo es una pantalla "Hoy" personalizable que cada madridista adapta a sus equipos y jugadores.',
    problem: 'La "Hoy" actual es la misma para todos y se centra sólo en el próximo partido del primer equipo masculino. El aficionado del femenino o del baloncesto no se siente representado, y no hay forma de priorizar el contenido que de verdad le interesa. Eso lastra retención y tiempo en pestaña.',
    objective: 'Entregar "Hoy v2 — Mi Mix": una Home modular con scroll vertical donde cada bloque es activable por separado, encabezada por un saludo con tier y un selector de equipos/jugadores favoritos editable en 3 pasos y persistido localmente. El feed y las noticias se filtran por el chip activo del selector.',
    inScope: [
        'Cabecera de bienvenida / login con saludo + tier (Visitante / Socio / Madridista / Junior / Premium / Platinum).',
        'Selector de equipos y jugadores favoritos con chips horizontales y editor en 3 pasos (equipos · jugadores · lista reordenable), persistido en localStorage.',
        'Próximos partidos en cards compactas (una por equipo seguido) con escudos, hora y competición.',
        'Feed vertical 9:16 reutilizado, filtrado por el chip activo del selector.',
        'Racha Madridista (7 días) y Predictor del Madridista (4 resultados + leaderboard).',
        'Mini-noticias compactas (thumb + título + kicker) y bloque "Bernabéu hoy" (Tour + Concierto).',
        'Variante "Alta Fidelidad" (sub-flag) que sustituye los bloques por sus versiones de mockup avanzado.',
        'Cada módulo es un sub-flag independiente bajo `fan.hoy.concept-mix`, reordenable desde el panel "Funcionalidades".'
    ],
    outOfScope: [
        'Datos reales: todo es mock (Mbappé, Vinícius, etc.) sin llamadas a API.',
        'Personalización con backend / sincronización entre dispositivos: el selector vive en localStorage.',
        'Recomendación algorítmica real del feed (el filtrado es por chip, no por ML).',
        'Login / sign-up real, push notifications y deep linking.'
    ],
    userStories: [
        'Como madridista del femenino, quiero elegir mis equipos y jugadores favoritos para que el Hoy priorice su contenido.',
        'Como usuario, quiero reordenar y activar/ocultar los módulos del Hoy para quedarme sólo con lo que me interesa.',
        'Como aficionado, quiero ver el feed y las noticias filtradas al tocar el chip de un jugador o equipo.',
        'Como PM, quiero comparar combinaciones de módulos activando/desactivando cada sub-flag sin tocar código.'
    ],
    acceptanceCriteria: [
        'El selector permite configurar equipos y jugadores en 3 pasos y persiste la selección al recargar.',
        'Al tocar un chip de jugador/equipo, el feed vertical y las mini-noticias se filtran a ese contexto.',
        'Cada sub-flag (cabecera, selector, próximos, feed, racha, predictor, noticias, Bernabéu) muestra/oculta su bloque de forma independiente.',
        'El orden de los bloques respeta el orden definido por el usuario en el panel "Funcionalidades".',
        'La variante "Alta Fidelidad" sustituye los bloques estándar por sus versiones avanzadas sin romper el scroll.',
        'prefers-reduced-motion desactiva el anillo pulsante de la racha y demás animaciones, manteniendo los estados.'
    ],
    uxNotes: [
        'La cabecera de bienvenida es persistente arriba del scroll; el tap sobre el cluster cicla los estados de tier.',
        'El selector sigue el patrón OneFootball: chips horizontales + botón "Configurar" que abre el editor.',
        'Las cards de próximos partidos son más compactas que las de la antigua estructura modular: una por equipo.',
        'Mi Mix es la dirección elegida del Hoy v2; los conceptos A/B/C fueron material de discovery y ya no forman parte del producto.'
    ],
    metrics: [
        'Adopción del selector: ≥ 40% de usuarios configura al menos un equipo/jugador favorito.',
        '+20-30% de tiempo en pestaña "Hoy" frente a la Home clásica.',
        '+15% de CTR a noticias y feed desde "Hoy".',
        'Scroll depth medio ≥ 60% de la pantalla.'
    ],
    dependencies: [
        'Hosting en GitHub Pages activado.',
        'html2canvas + jsPDF cargados desde CDN para el export a PDF (lazy-load).'
    ],
    risks: [
        'Demasiados módulos activos a la vez pueden saturar el scroll. Mitigación: defaults curados y reordenación por el usuario.',
        'La persistencia sólo local hace que la configuración se pierda entre dispositivos. Aceptable en mockup; backend en fase posterior.'
    ]
});

// ── Mi Mix · sub-funcionalidades (cada módulo es un sub-flag) ────
register('fan.hoy.concept-mix.login-header', {
    flagKey: 'fan.hoy.concept-mix.login-header',
    title: 'Mi Mix · Cabecera de bienvenida / login con tier',
    epic: 'Fan App · Hoy · Mi Mix',
    estimate: 'S (1 sprint)',
    priority: 'Media',
    context: 'Módulo de Mi Mix. La cabecera persistente arriba del Hoy saluda al usuario y muestra su tier de socio, dando contexto de identidad antes de que empiece a hacer scroll.',
    objective: 'Mostrar una cabecera con saludo + tier (Visitante / Socio / Madridista / Junior / Premium / Platinum) en lo alto de Mi Mix, con un tap que cicla los estados para demo.',
    inScope: [
        'Cabecera con nombre/saludo y badge de tier.',
        'Tap sobre el cluster que cicla por los 6 estados de tier.',
        'Estado "Visitante / Inicia sesión" cuando no hay sesión.'
    ],
    acceptanceCriteria: [
        'La cabecera aparece arriba del scroll de Mi Mix cuando el sub-flag está ON.',
        'El tap cambia de tier de forma cíclica y predecible.',
        'El estado por defecto sin sesión invita a iniciar sesión.'
    ],
    uxNotes: [
        'Reutiliza el patrón de la cabecera global de login para mantener coherencia visual.'
    ],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

register('fan.hoy.concept-mix.selector', {
    flagKey: 'fan.hoy.concept-mix.selector',
    title: 'Mi Mix · Selector de equipos y jugadores favoritos',
    epic: 'Fan App · Hoy · Mi Mix',
    estimate: 'M (2 sprints)',
    priority: 'Alta',
    context: 'Módulo clave de Mi Mix: permite al usuario declarar sus equipos y jugadores favoritos, que luego filtran el feed y las noticias del Hoy.',
    objective: 'Ofrecer chips horizontales con los favoritos del usuario y un editor en 3 pasos (equipos · jugadores · lista reordenable) persistido en localStorage.',
    inScope: [
        'Chips horizontales de equipos y jugadores favoritos.',
        'Botón "Configurar" que abre un editor en 3 pasos.',
        'Reordenación de la lista de favoritos.',
        'Persistencia de la selección en localStorage.'
    ],
    acceptanceCriteria: [
        'La selección persiste al recargar la página.',
        'El editor recorre los 3 pasos y permite añadir/quitar/reordenar.',
        'Al tocar un chip, el feed y las noticias se filtran a ese contexto.'
    ],
    uxNotes: [
        'Patrón estilo OneFootball: chips + bottom-sheet para configurar.'
    ],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

register('fan.hoy.concept-mix.upcoming', {
    flagKey: 'fan.hoy.concept-mix.upcoming',
    title: 'Mi Mix · Próximos partidos (cards compactas)',
    epic: 'Fan App · Hoy · Mi Mix',
    estimate: 'S (1 sprint)',
    priority: 'Media',
    context: 'Módulo de Mi Mix que resume el próximo partido de cada equipo seguido en cards compactas, sin robar protagonismo al resto del scroll.',
    objective: 'Mostrar un carrusel horizontal con una card por equipo (escudos, hora y competición).',
    inScope: [
        'Carrusel horizontal de próximos partidos de los equipos seguidos.',
        'Card compacta con escudos, hora y competición por equipo.'
    ],
    acceptanceCriteria: [
        'Aparece una card por cada equipo seguido en el selector.',
        'Cada card muestra escudos, hora y competición legibles.'
    ],
    uxNotes: ['Cards más pequeñas que el bloque de partido clásico para no dominar el Hoy.'],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

register('fan.hoy.concept-mix.feed', {
    flagKey: 'fan.hoy.concept-mix.feed',
    title: 'Mi Mix · Feed vertical 9:16',
    epic: 'Fan App · Hoy · Mi Mix',
    estimate: 'M (2 sprints)',
    priority: 'Alta',
    context: 'El feed vertical dominante es el corazón consumible de Mi Mix: clips 9:16 navegables que mantienen al usuario dentro del Hoy.',
    objective: 'Feed vertical 9:16 con navegación ↑/↓ entre clips, filtrable por el chip activo del selector.',
    inScope: [
        'Clips 9:16 con overlays de jugador, like y comentarios.',
        'Navegación ↑/↓ entre clips.',
        'Filtrado por el chip activo del selector (jugador/equipo).'
    ],
    acceptanceCriteria: [
        'Las flechas ↑/↓ cambian de clip.',
        'Al activar un chip de jugador/equipo, el feed se filtra a ese contexto.'
    ],
    uxNotes: ['Aspect 9:16 inmersivo, estilo TikTok/Reels.'],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

register('fan.hoy.concept-mix.streak', {
    flagKey: 'fan.hoy.concept-mix.streak',
    title: 'Mi Mix · Racha Madridista (7 días)',
    epic: 'Fan App · Hoy · Mi Mix',
    estimate: 'S (1 sprint)',
    priority: 'Baja',
    context: 'Módulo de engagement de Mi Mix: una racha de visitas diarias que premia el hábito de abrir la app.',
    objective: 'Mostrar un tile con 7 cuadritos (últimos 7 días) y el día actual destacado con un anillo dorado pulsante.',
    inScope: [
        'Tile con 7 días y estado de cada uno.',
        'Día actual con anillo dorado pulsante.'
    ],
    acceptanceCriteria: [
        'Se muestran 7 días con el actual destacado.',
        'prefers-reduced-motion desactiva el pulso manteniendo el estado.'
    ],
    uxNotes: ['Microinteracción discreta; no debe competir con el feed.'],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

register('fan.hoy.concept-mix.predictor', {
    flagKey: 'fan.hoy.concept-mix.predictor',
    title: 'Mi Mix · Predictor del Madridista',
    epic: 'Fan App · Hoy · Mi Mix',
    estimate: 'M (2 sprints)',
    priority: 'Media',
    context: 'Gamificación ligera de Mi Mix: predecir el marcador del próximo partido y competir en un leaderboard mensual.',
    objective: 'Ofrecer 4 pills de resultado seleccionables + un leaderboard mensual con la posición del usuario.',
    inScope: [
        '4 pills de resultado clickables (una elección por partido).',
        'Leaderboard mensual con posición del usuario.'
    ],
    acceptanceCriteria: [
        'Al elegir un resultado se bloquean las demás opciones y se muestra la posición.',
        'El leaderboard refleja la elección del usuario.'
    ],
    uxNotes: ['Sin apuestas ni dinero real; sólo puntos simbólicos.'],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

register('fan.hoy.concept-mix.news', {
    flagKey: 'fan.hoy.concept-mix.news',
    title: 'Mi Mix · Mini Noticias',
    epic: 'Fan App · Hoy · Mi Mix',
    estimate: 'S (1 sprint)',
    priority: 'Media',
    context: 'Módulo editorial de Mi Mix: mantiene presencia de noticias sin romper el ritmo del feed.',
    objective: 'Listado compacto de 4 noticias (thumb 52px + título + kicker) que abren el detalle al tocar.',
    inScope: [
        'Listado de 4 noticias en formato compacto.',
        'Tap que abre el detalle de la noticia.',
        'Filtrado por el equipo activo del selector.'
    ],
    acceptanceCriteria: [
        'Se muestran 4 noticias con thumb, título y kicker.',
        'El tap navega al detalle de la noticia.'
    ],
    uxNotes: ['Reutiliza el handler global [data-news-id] para abrir el detalle.'],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

register('fan.hoy.concept-mix.bernabeu', {
    flagKey: 'fan.hoy.concept-mix.bernabeu',
    title: 'Mi Mix · Bernabéu hoy',
    epic: 'Fan App · Hoy · Mi Mix',
    estimate: 'S (1 sprint)',
    priority: 'Baja',
    context: 'Módulo de Mi Mix orientado a conversión: muestra qué pasa hoy en el Bernabéu (tour, conciertos) con CTAs.',
    objective: 'Tarjeta con eventos del día del Bernabéu (Tour 16:00 + Concierto 21:00) y CTAs Reservar / Cómo llegar.',
    inScope: [
        'Eventos del día con hora.',
        'CTAs "Reservar" y "Cómo llegar".'
    ],
    acceptanceCriteria: [
        'Se listan al menos 2 eventos del día con su hora.',
        'Cada evento ofrece sus CTAs.'
    ],
    uxNotes: ['Tono comercial pero integrado en el scroll, sin banner intrusivo.'],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

register('fan.hoy.concept-mix.featured', {
    flagKey: 'fan.hoy.concept-mix.featured',
    title: 'Mi Mix · Noticia destacada (bloques hero intercalados)',
    epic: 'Fan App · Hoy · Mi Mix',
    estimate: 'M (2 sprints)',
    priority: 'Media',
    context: 'Inspirado en la Home de la app de la NBA, donde las noticias destacadas aparecen como grandes bloques hero (imagen/vídeo a sangre + titular + CTA) intercalados con el resto de contenido. Da peso editorial a las historias clave sin sacarlas del flujo del Hoy.',
    problem: 'Las mini-noticias compactas no transmiten la importancia de una historia destacada. Falta un formato de mayor impacto visual para empujar el contenido editorial estrella.',
    objective: 'Añadir un formato de "noticia destacada": un bloque grande con media (imagen o vídeo), kicker, titular y botón "Leer/Ver noticia" que abre el detalle. Al activar el sub-flag se insertan 3 noticias destacadas distintas, intercaladas entre el resto de módulos de la Home.',
    inScope: [
        'Bloque hero con media grande (imagen/vídeo), kicker, titular y botón.',
        'Botón que abre el detalle de la noticia (reutiliza el handler global [data-news-id]).',
        '3 noticias destacadas distintas intercaladas (no contiguas) entre los demás módulos de Mi Mix.',
        'Cada noticia con su gradiente/identidad y un indicador de play cuando es vídeo.'
    ],
    outOfScope: [
        'Reproducción real de vídeo: el icono de play es indicativo y abre el detalle.',
        'Curación automática de cuáles son las destacadas (en el mockup es una lista fija).',
        'Aparición en la variante "Alta Fidelidad" (layout fijo aparte).'
    ],
    userStories: [
        'Como usuario, quiero ver las noticias más importantes en un formato grande y atractivo dentro del Hoy.',
        'Como editor, quiero destacar 3 historias clave intercaladas con el resto de la Home.'
    ],
    acceptanceCriteria: [
        'Al activar el sub-flag aparecen 3 bloques de noticia destacada en posiciones no contiguas de la Home.',
        'Cada bloque muestra media grande, kicker, titular y botón "Leer noticia" / "Ver noticia".',
        'El botón abre el detalle de la noticia correspondiente.',
        'Al desactivar el sub-flag, los bloques desaparecen y el resto de la Home queda intacto.'
    ],
    uxNotes: [
        'Sigue el patrón NBA: media a sangre con titular en mayúsculas sobre un scrim oscuro y CTA outline ancho debajo.',
        'Usa el sistema de diseño RM: azul #00529F para el CTA, tarjeta blanca redondeada.'
    ],
    metrics: [
        'CTR a noticias desde los bloques destacados ≥ 2x el de las mini-noticias.',
        '+10% de aperturas de detalle de noticia desde el Hoy.'
    ],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).'],
    risks: [
        'Tres bloques grandes pueden alargar mucho el scroll. Mitigación: intercalado (no contiguo) y media optimizada.'
    ]
});

register('fan.hoy.concept-mix.hi-fi', {
    flagKey: 'fan.hoy.concept-mix.hi-fi',
    title: 'Mi Mix · Alta Fidelidad (mockups avanzados)',
    epic: 'Fan App · Hoy · Mi Mix',
    estimate: 'M (2 sprints)',
    priority: 'Media',
    context: 'Variante de Mi Mix que sube el listón visual de los bloques para demos de alta fidelidad ante stakeholders.',
    objective: 'Sustituir los bloques estándar de Mi Mix por sus versiones de alta fidelidad (date picker + match card con venue + escudos SVG, carrusel "Para ti" con card grande + paginación, predictor con escudos RM/Barça y Noticias con hero + grid de 2 columnas).',
    inScope: [
        'Partidos: date picker + match card con venue + escudos SVG.',
        '"Para ti": carrusel con card grande + paginación.',
        'Predictor con escudos RM y Barça.',
        'Noticias con hero + grid de 2 columnas con etiquetas por equipo.'
    ],
    acceptanceCriteria: [
        'Al activar el sub-flag, los bloques estándar se reemplazan por sus versiones hi-fi sin romper el scroll.',
        'Los escudos se renderizan como SVG nítidos.'
    ],
    uxNotes: ['Pensado para capturas/demos; mayor coste visual que la versión base.'],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

// ── Posible backlog — Home experimental y sus 4 experimentos ─────
register('fan.hoy.backlog', {
    flagKey: 'fan.hoy.backlog',
    title: 'Posible backlog · Home experimental (sandbox de experimentos)',
    epic: 'Fan App · Hoy · Backlog',
    estimate: 'M (2-3 sprints, sandbox)',
    priority: 'Media',
    context: 'Tras alinear con dirección un plan iterativo para evolucionar la Home, necesitamos un espacio para probar ideas concretas (compactar el header, ocultarlo al hacer scroll, densificar el contenido de abajo como un feed y añadir stories) sin comprometerlas a producción ni tocar la Home actual.',
    problem: 'No hay forma de comparar "lo de hoy" con cada idea del backlog de forma aislada y demostrable ante stakeholders. Validar a ojo sobre slides no convence.',
    objective: 'Una Home experimental activable por flag que, con los sub-experimentos OFF, imita la Home actual, y permite encender cada experimento por separado para comparar y medir.',
    inScope: [
        'Pantalla Hoy alternativa bajo `fan.hoy.backlog` (no toca la Home clásica ni Mi Mix).',
        '4 sub-experimentos toggleables: header compacto, header auto-ocultable, feed denso, stories.',
        'Reutiliza el contenido actual (partido, noticias, promo) y los sub-contenidos de partido (resumen/stats/jornada).'
    ],
    outOfScope: [
        'Cambios en la Home de producción.',
        'Backend/contenido nuevo: usa los mocks existentes.'
    ],
    acceptanceCriteria: [
        'Con el flag ON y los 4 sub-flags OFF, la Home se parece a la actual.',
        'Cada sub-experimento se puede activar/desactivar de forma independiente.',
        'Al desactivar el flag, la pestaña Hoy vuelve a su comportamiento normal.'
    ],
    uxNotes: ['Es un sandbox de demo/medición, no un destino final: las ideas que ganen se promocionan a la Home real.'],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

register('fan.hoy.backlog.compact-header', {
    flagKey: 'fan.hoy.backlog.compact-header',
    title: 'Backlog · Header de partido compacto (≤25-30%)',
    epic: 'Fan App · Hoy · Backlog',
    estimate: 'M (2 sprints)',
    priority: 'Alta',
    context: 'El header de partido actual (fila superior + carrusel de partidos + barra de segmentos) ocupa demasiado alto y empuja el contenido. Queremos el header lo más pequeño posible manteniendo la MISMA información.',
    problem: 'Un header alto reduce el contenido visible above-the-fold y obliga a hacer scroll para llegar a lo importante.',
    objective: 'Compactar el header a ≤25-30% de la pantalla (idealmente menos) preservando toda la info: perfil, escudos, equipos, fecha/hora o marcador, competición, radio y segmentos.',
    inScope: [
        'Colapsar el carrusel de partidos en una tira única densa (escudo · marcador/hora · escudo) con la competición como kicker minúsculo.',
        'Cambiar el carrusel por dots pequeños para alternar de partido.',
        'Barra de segmentos fina (Directo/Resumen/Estadísticas/Jornada).'
    ],
    acceptanceCriteria: [
        'El header desplegado ocupa ≤30% del alto del frame (objetivo 25% o menos).',
        'No se pierde ninguna información respecto al header actual.',
        'Sigue permitiendo cambiar de partido y de segmento.'
    ],
    uxNotes: [
        'Mi enfoque: una sola fila densa con iconos en vez de botones etiquetados, marcador/hora centrado, competición en kicker de 9-10px y segmentos en una barra fina. Tipografía ajustada y padding mínimo.'
    ],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

register('fan.hoy.backlog.hide-on-scroll', {
    flagKey: 'fan.hoy.backlog.hide-on-scroll',
    title: 'Backlog · Header que se oculta al hacer scroll (tipo X/Twitter)',
    epic: 'Fan App · Hoy · Backlog',
    estimate: 'S (1 sprint)',
    priority: 'Media',
    context: 'En apps como X/Twitter el header se esconde al bajar para dejar todo el alto al contenido y reaparece en cuanto subes.',
    problem: 'Un header siempre visible resta espacio al contenido durante la lectura/scroll.',
    objective: 'Ocultar el header al hacer scroll hacia abajo y volver a mostrarlo al hacer scroll hacia arriba.',
    inScope: [
        'Detección de dirección de scroll sobre el scroller del Hoy.',
        'Ocultar (translateY) al bajar pasado un umbral; mostrar al subir.',
        'Transición suave; respeta prefers-reduced-motion.'
    ],
    acceptanceCriteria: [
        'Al bajar más de ~56px el header se oculta.',
        'Al hacer el más mínimo scroll hacia arriba, reaparece.',
        'Sin parpadeos ni saltos de layout.'
    ],
    uxNotes: ['Combina muy bien con el header compacto: doble ganancia de espacio.'],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

register('fan.hoy.backlog.dense-feed', {
    flagKey: 'fan.hoy.backlog.dense-feed',
    title: 'Backlog · Feed compacto (estilo Twitter) en el contenido de abajo',
    epic: 'Fan App · Hoy · Backlog',
    estimate: 'M (2 sprints)',
    priority: 'Alta',
    context: 'El contenido de abajo de la Home (hoy un carrusel + una promo de 15%) usa títulos y padding muy grandes y se ven muy pocos elementos por pantalla.',
    problem: 'Baja densidad = poco contenido visible = menos descubrimiento y menos scroll-through.',
    objective: 'Reorganizar el contenido de abajo como un feed de posts compactos (avatar + autor + texto + acciones), con poco padding y tipografía ajustada, para maximizar posts visibles. Cada post abre su noticia; la promo es un post patrocinado.',
    inScope: [
        'Feed de posts a partir de las noticias + un post patrocinado (la promo 15%).',
        'Modo denso: oculta subtítulo y media, recorta el texto y aprieta el padding.',
        'Tap en un post abre su detalle; el post patrocinado lleva a Tienda.'
    ],
    acceptanceCriteria: [
        'En modo denso se ven sensiblemente más posts por pantalla que en el modo amplio.',
        'Cada post mantiene autor, hora y acciones; el texto se recorta a 2 líneas.',
        'El post patrocinado se distingue y lleva a la Tienda.'
    ],
    uxNotes: ['Patrón timeline tipo X: divisores en vez de tarjetas, avatar a la izquierda, texto a la derecha.'],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

register('fan.hoy.backlog.stories', {
    flagKey: 'fan.hoy.backlog.stories',
    title: 'Backlog · Stories entre header y feed',
    epic: 'Fan App · Hoy · Backlog',
    estimate: 'S (1 sprint)',
    priority: 'Baja',
    context: 'Las stories (círculos con borde gradiente) son un patrón conocido para destacar contenido efímero de jugadores/club.',
    problem: 'Falta un punto de entrada ligero y visual a contenido destacado, sin penalizar el espacio del feed.',
    objective: 'Carrusel de stories entre el header y el feed, de tamaño contenido para no robar espacio al feed.',
    inScope: [
        'Carrusel horizontal de stories (club + jugadores favoritos).',
        'Tamaño compacto (anillo ~56px + etiqueta).',
        'Estado "vista" al pulsar (anillo gradiente → gris).'
    ],
    acceptanceCriteria: [
        'Las stories aparecen entre header y feed y hacen scroll horizontal.',
        'Pulsar una story la marca como vista.',
        'No empujan el feed de forma significativa (altura contenida).'
    ],
    uxNotes: ['Sin visor de story a pantalla completa en esta fase: el foco es validar el punto de entrada y su coste de espacio.'],
    dependencies: ['html2canvas + jsPDF para el export a PDF (lazy-load).']
});

register('fan.app.login-header', {
    title: 'Cabecera global de login / bienvenida con tier',
    epic: 'Fan App · Identity',
    estimate: 'S (1 sprint)',
    priority: 'Alta',
    context: 'Hoy en día la app no muestra el estado de sesión del usuario de forma visible. Un madridista premium ve la misma cabecera que un visitante anónimo, lo cual diluye la sensación de pertenencia y dificulta detectar oportunidades de upsell (entradas exclusivas, contenido premium).',
    objective: 'Añadir una cabecera persistente arriba del todo en todas las secciones de la Fan App ("Hoy", "Noticias", "Calendario", "RMTV/RM Play", "Tienda") que muestre "Inicia sesión" cuando no hay sesión, o el nombre del usuario + su tier cuando sí.',
    inScope: [
        'Cabecera fija sobre el contenido de cada pestaña (no scrollea con la página)',
        'Estado "no logado": pill "Inicia sesión" en gold, tappable hacia el flujo de login existente',
        'Estado "logado": avatar circular con inicial + nombre + chip de tier (Socio, Madridista, Junior, Premium, Platinum)',
        'Tap sobre el cluster cuando logado abre el side menu en la sección de cuenta',
        'Cabecera idéntica en las 5 pestañas para sentir continuidad'
    ],
    outOfScope: [
        'Avatar con foto del usuario (en v1 se usan iniciales)',
        'Multi-cuenta o cambio rápido de perfil',
        'Indicador de notificaciones (potencial v2)'
    ],
    userStories: [
        'Como visitante, quiero ver claramente que puedo iniciar sesión para acceder a contenido personalizado.',
        'Como madridista, quiero que la app me reconozca y muestre mi tier para sentirme valorado.',
        'Como madridista premium, quiero acceder rápidamente a mi área de cuenta desde cualquier pantalla.'
    ],
    acceptanceCriteria: [
        'La cabecera aparece en las 5 pestañas principales de Fan App.',
        'No logado: muestra logo del Madrid + pill "Inicia sesión" tappable.',
        'Logado: muestra avatar (inicial sobre fondo gold), saludo dinámico ("Buenos días", "Buenas tardes" según hora), nombre y chip de tier.',
        'El chip de tier usa el color de marca correspondiente: Socio #1B3A7C, Madridista #FEBE10, Premium #FFFFFF en gold, Platinum #B0B0B5.',
        'Tap en el cluster cuando logado abre el side menu posicionado en "Mi cuenta".',
        'La cabecera no se oculta al scrollear (sticky / fixed).'
    ],
    uxNotes: [
        'En tablets la cabecera centra el cluster con un max-width de 600px.',
        'El saludo cambia con la hora del dispositivo: 06-13 "Buenos días", 13-21 "Buenas tardes", resto "Buenas noches".',
        'El chip de tier es siempre legible: si el background del header es claro, usar texto oscuro y viceversa.'
    ],
    metrics: [
        'Tasa de login desde la cabecera (objetivo: 5% de usuarios anónimos por sesión)',
        'CTR al área de cuenta desde la cabecera (objetivo: 8% de usuarios logados por semana)'
    ],
    dependencies: [
        'API de sesión existente (no requiere cambios)',
        'Modelo de tier debe estar disponible en el response del usuario (ya lo está)'
    ],
    risks: [
        'Usuarios con nombres muy largos romperán el layout — truncar a 14 caracteres + ellipsis.',
        'En modo oscuro la cabecera necesita su propia variante (validar contraste con WCAG AA).'
    ]
});

register('fan.sidemenu.v2', {
    title: 'Side menu v2 · escalable, agrupado y buscable',
    epic: 'Fan App · Navegación',
    estimate: 'L (3 sprints)',
    priority: 'Alta',
    context: 'El side menu actual es un listado plano de opciones que ha crecido orgánicamente: ya hay más de 20 entradas y encontrar algo es difícil. Cuando añadamos nuevas funcionalidades (perfil ampliado, ajustes de notificaciones, soporte) la usabilidad se va a degradar más.',
    objective: 'Rediseñar el menú lateral con secciones colapsables, accesos rápidos en chips, una cabecera compacta de cuenta y (en sub-features posteriores) un buscador, sección de preferencias y de ayuda.',
    inScope: [
        'Cabecera compacta con avatar + nombre + tier',
        'Filas agrupadas por sección (Cuenta, Mi club, Preferencias, Ayuda, Legal)',
        'Layout escalable que pueda crecer sin perder navegación',
        'Soporte para sub-funcionalidades opcionales (buscador, accesos rápidos, etc.)'
    ],
    outOfScope: [
        'Buscador (entrega aparte, ver fan.sidemenu.v2.search)',
        'Accesos rápidos (ver fan.sidemenu.v2.quick-actions)',
        'Bloque de Preferencias (ver fan.sidemenu.v2.preferences)',
        'Sección Ayuda y Legal (ver fan.sidemenu.v2.support)',
        'Pantallas de detalle al pulsar (ver fan.sidemenu.v2.mock-detail)'
    ],
    userStories: [
        'Como usuario, quiero encontrar opciones del menú agrupadas para no perderme.',
        'Como usuario, quiero un menú que crezca con la app sin volverse inusable.'
    ],
    acceptanceCriteria: [
        'El menú abre desde la izquierda con un slide-in en menos de 250ms.',
        'La cabecera muestra avatar + nombre + tier del usuario logado.',
        'Las filas se agrupan en secciones tituladas; el usuario puede colapsar/expandir.',
        'Tap en una fila ejecuta su acción (navegación, abrir hoja, etc.).',
        'El menú es scrolleable si el contenido excede el alto de pantalla.',
        'El menú se cierra con tap en el backdrop o swipe a la izquierda.'
    ],
    uxNotes: [
        'Padding consistente entre filas (12px vertical, 16px horizontal).',
        'Iconos a la izquierda alineados a 22x22, accesibles via VoiceOver.',
        'Sub-secciones se distinguen con un kicker en uppercase color secundario.'
    ],
    metrics: [
        'Tasa de uso del menú por sesión (objetivo: +20%)',
        'CTR a opciones secundarias (no las más visibles): debería subir al estar mejor agrupadas.'
    ],
    dependencies: [
        'Endpoint de usuario debe devolver tier (ya lo hace).',
        'Diseño aprobado de todas las secciones que vivirán en el menú.'
    ],
    risks: [
        'Si la cabecera es muy grande, ocupa mucho espacio en pantalla — validar en iPhone SE.',
        'Las animaciones de slide pueden hacer perder gestos de back en iOS — testear con cuidado.'
    ]
});

register('fan.sidemenu.v2.search', {
    title: 'Side menu · buscador de ajustes',
    epic: 'Fan App · Navegación',
    estimate: 'XS (<1 sprint)',
    priority: 'Media',
    context: 'Aunque el side menu v2 organiza opciones por sección, cuando se acumulan muchas entradas (notificaciones, idioma, ajustes de partido, etc.) el usuario sigue tardando en encontrar lo que busca.',
    objective: 'Añadir un buscador en el side menu v2 que filtra las opciones del menú en vivo según el texto que el usuario escriba.',
    inScope: [
        'Input de búsqueda fijo en la parte superior del menú, debajo de la cabecera',
        'Filtrado en cliente por nombre de la opción',
        'Highlight del texto que matchea',
        'Botón ✕ para limpiar la búsqueda'
    ],
    outOfScope: [
        'Búsqueda en contenidos del club (sólo opciones del menú)',
        'Sugerencias o autocompletado',
        'Historial de búsquedas'
    ],
    userStories: [
        'Como usuario, quiero buscar "notificaciones" sin tener que recorrer todo el menú.',
        'Como usuario, quiero ver inmediatamente qué opciones cumplen mi búsqueda.'
    ],
    acceptanceCriteria: [
        'El input está siempre visible al abrir el menú (no se oculta al scrollear).',
        'Filtra en cada keystroke (debounce ≤ 100ms si afecta a performance).',
        'Búsqueda case-insensitive y sin acentos.',
        'Si no hay resultados, muestra "No hemos encontrado opciones para \'X\'".',
        'El botón ✕ aparece sólo cuando hay texto y limpia el input al pulsarlo.'
    ],
    uxNotes: [
        'El input usa el estilo iOS search nativo (icono lupa a la izquierda).',
        'Al focusear, el teclado iOS no debe tapar el input.',
        'Las secciones sin resultados se ocultan temporalmente.'
    ],
    metrics: [
        '% de aperturas de menú que usan el buscador (objetivo: 20%+)',
        'Tiempo medio para encontrar una opción (objetivo: -40% vs sin buscador)'
    ],
    dependencies: ['`fan.sidemenu.v2` debe estar en producción.'],
    risks: ['El teclado iOS puede tapar el contenido — validar con keyboardAvoidance.']
});

register('fan.sidemenu.v2.quick-actions', {
    title: 'Side menu · accesos rápidos',
    epic: 'Fan App · Navegación',
    estimate: 'S (1 sprint)',
    priority: 'Media',
    context: 'Las opciones más usadas del menú (Carnet, Entradas, Tienda) están a 2-3 taps de distancia. Promoverlas al primer nivel del menú reduce fricción y aumenta uso.',
    objective: 'Añadir una fila horizontal de chips con los 5 accesos más frecuentes inmediatamente debajo de la cabecera del menú v2.',
    inScope: [
        'Fila horizontal con 5 chips: Carnet, Entradas, Radio, Cerca (estadio), Tienda',
        'Cada chip con icono + label corto',
        'Tap abre la hoja correspondiente o navega a la sección',
        'Scroll horizontal si los chips no entran en una fila'
    ],
    outOfScope: [
        'Personalización de qué chips mostrar (potencial v2)',
        'Insignias / contadores en los chips'
    ],
    userStories: [
        'Como socio, quiero acceder a mi carnet en 1 tap desde el menú.',
        'Como aficionado, quiero ir a la radio del club rápidamente en día de partido.'
    ],
    acceptanceCriteria: [
        'Los chips aparecen entre la cabecera y la primera sección agrupada.',
        'Cada chip mide aprox. 80x80 con icono arriba y label debajo.',
        'Tap ejecuta la acción asignada y cierra el menú.',
        'Los iconos son consistentes en peso y tamaño (1.5px stroke).'
    ],
    uxNotes: [
        'En tablet la fila es más amplia y muestra más chips si hay sitio.',
        'Activar feedback háptico en tap (`light` impact).'
    ],
    metrics: [
        'CTR de los chips (objetivo: 30%+ de aperturas de menú llevan a un chip)',
        'Reducción de pasos al carnet/entradas (objetivo: 1 tap menos)'
    ],
    dependencies: ['`fan.sidemenu.v2` debe estar en producción.'],
    risks: ['Si añadimos más chips perdemos el "rápido" — máximo 5 visibles.']
});

register('fan.sidemenu.v2.preferences', {
    title: 'Side menu · sección Preferencias',
    epic: 'Fan App · Navegación',
    estimate: 'S (1 sprint)',
    priority: 'Media',
    context: 'Las preferencias del usuario (equipos favoritos, notificaciones, idioma, apariencia) hoy están dispersas por la app sin un punto único de control.',
    objective: 'Añadir una sección "Preferencias" en el side menu v2 que centralice equipos favoritos, ajustes de notificaciones, idioma y apariencia (claro/oscuro/sistema).',
    inScope: [
        'Fila "Equipos favoritos" → hoja con listado seleccionable',
        'Fila "Notificaciones" → hoja con toggles por categoría',
        'Fila "Idioma" → hoja con radio buttons',
        'Fila "Apariencia" → hoja con claro/oscuro/sistema',
        'Anchor opcional al editor de pestañas de Hoy si está activo'
    ],
    outOfScope: [
        'Las pantallas de detalle reales (esto es la entrada al menú; el contenido vive en otras initiatives)',
        'Sincronización cross-device de preferencias en v1'
    ],
    userStories: [
        'Como usuario, quiero cambiar el idioma sin tener que rebuscar en ajustes del sistema.',
        'Como usuario, quiero decidir qué notificaciones recibo del club.'
    ],
    acceptanceCriteria: [
        'La sección "Preferencias" agrupa al menos 4 filas mencionadas arriba.',
        'Cada fila tiene icono + label + chevron a la derecha.',
        'Tap abre la hoja correspondiente.'
    ],
    uxNotes: [
        'El kicker de la sección está en uppercase, color secundario.',
        'Las hojas usan el patrón modal sheet con grabber.'
    ],
    metrics: ['% de usuarios que abren al menos una preferencia (objetivo: 25%+)'],
    dependencies: ['`fan.sidemenu.v2` debe estar en producción.'],
    risks: ['Las hojas reales deben ser entregables aparte para no inflar este ticket.']
});

register('fan.sidemenu.v2.support', {
    title: 'Side menu · secciones Ayuda y Legal',
    epic: 'Fan App · Navegación',
    estimate: 'XS (<1 sprint)',
    priority: 'Media',
    context: 'Por requisito legal y de App Store debemos exponer accesos a términos, privacidad y cookies. Adicionalmente queremos centralizar los puntos de contacto con el club.',
    objective: 'Añadir las secciones "Ayuda" (centro de ayuda, contacto, opinión) y "Legal" (términos, privacidad, cookies) al final del side menu v2.',
    inScope: [
        'Sección "Ayuda" con filas: Centro de ayuda, Contacto, Enviar opinión',
        'Sección "Legal" con filas: Términos y condiciones, Política de privacidad, Política de cookies',
        'Cada fila lleva chevron y abre la URL correspondiente en webview o navegador'
    ],
    outOfScope: [
        'Crear el centro de ayuda (existe ya)',
        'Implementar el formulario de "Enviar opinión" (entregable aparte)'
    ],
    userStories: [
        'Como usuario, quiero acceder a los términos y condiciones para revisar mis derechos.',
        'Como usuario, quiero contactar con el club desde la app.'
    ],
    acceptanceCriteria: [
        'Las dos secciones aparecen siempre al final del menú, separadas del resto por un divisor.',
        'Cada fila lleva un kicker de sección en uppercase.',
        'Tap en una fila abre la URL correspondiente.',
        'Las URLs son configurables vía Remote Config para no requerir release.'
    ],
    metrics: ['CTR a Términos / Privacidad (informativo, no es objetivo activo)'],
    dependencies: ['`fan.sidemenu.v2` debe estar en producción.', 'URLs reales aprobadas por Legal.'],
    risks: ['Si las URLs cambian sin Remote Config, requiere release nuevo.']
});

register('fan.sidemenu.v2.mock-detail', {
    title: 'Side menu · pantallas de detalle al pulsar opciones',
    epic: 'Fan App · Navegación',
    estimate: 'S (1 sprint)',
    priority: 'Baja',
    context: 'Para validar el flujo del menú v2 sin esperar a que cada sección de detalle esté terminada, queremos pantallas placeholder que se abran al pulsar cualquier opción y simulen el destino final.',
    objective: 'Al pulsar una opción del menú v2, abrir una hoja modal con contenido placeholder representativo de la sección destino (mi perfil, mis entradas, idiomas, configuración…).',
    inScope: [
        'Hoja modal que se abre al pulsar cualquier opción del menú no implementada',
        'Contenido placeholder distinto por opción: hero, listas, párrafos, datos del usuario',
        'Cierre por gesto, backdrop o botón ✕'
    ],
    outOfScope: [
        'Las pantallas reales de cada sección (vendrán en initiatives propias)',
        'Persistir cambios desde las hojas placeholder'
    ],
    userStories: [
        'Como diseñadora, quiero ver el flujo completo del menú aunque las pantallas finales no estén listas.',
        'Como PM, quiero presentar el menú a stakeholders con la sensación de que es interactivo.'
    ],
    acceptanceCriteria: [
        'Toda opción del menú abre una hoja con contenido representativo en lugar de un crash o "próximamente".',
        'Los datos mostrados son del usuario logado (nombre, tier, etc.) cuando aplica.',
        'La hoja se cierra al swipe-down o tap en backdrop.'
    ],
    uxNotes: [
        'El contenido placeholder es lo más fiel posible al destino final.',
        'Etiqueta sutil "Vista de prueba" en debug builds para evitar confusiones.'
    ],
    metrics: ['Útil sólo en demos / user testing, no se mide en producción.'],
    dependencies: ['`fan.sidemenu.v2` debe estar en producción.'],
    risks: ['Hay que retirar este flag antes de un release en producción.']
});

register('fan.rmtv.play', {
    title: 'RM Play · rebrand de RMTV con layout OTT',
    epic: 'Fan App · Contenido',
    estimate: 'XL (4-5 sprints)',
    priority: 'Alta',
    context: 'La pestaña "RMTV" actual presenta el contenido como una grid plana sin jerarquía editorial. Marcas como Netflix, DAZN o el propio Real Madrid TV web ya operan con layouts tipo OTT (hero, filas temáticas, scroll horizontal). Replicar este patrón en la app eleva la percepción de calidad del contenido y aumenta consumo.',
    objective: 'Rebranding de la pestaña a "RM Play" + nuevo layout OTT con hero principal, filas temáticas por deporte y producto, tendencias, partidos completos y producción original.',
    inScope: [
        'Cambio de nombre del tab a "RM Play" cuando el flag está activo',
        'Hero superior con vídeo destacado + CTAs "Resumen / Ver más"',
        'Fila "Nuestro club" con un destacado por deporte (masc, fem, basket)',
        'Fila "Canales Realmadrid TV" con los streams en vivo',
        'Fila "Tendencias" con lo más visto de la semana',
        'Fila "UEFA Youth League" como evento estacional',
        'Fila "Partidos 2025-26" con replay de partidos completos',
        'Fila "Originals & Films" con producción del club'
    ],
    outOfScope: [
        'Reproductor in-app (sigue siendo el reproductor existente)',
        'Sistema de favoritos / mi lista (potencial v2)',
        'Recomendaciones personalizadas por ML (potencial v2)'
    ],
    userStories: [
        'Como aficionado, quiero descubrir contenido del club con la misma facilidad que en una plataforma de streaming.',
        'Como aficionado de baloncesto, quiero filas dedicadas a mi deporte que destaquen visualmente.',
        'Como editor del club, quiero poder destacar contenidos en el hero y modificar el orden de filas desde un CMS.'
    ],
    acceptanceCriteria: [
        'Cuando el flag está activo, el tab se llama "RM Play" y el icono se mantiene.',
        'El hero ocupa el ancho completo y al menos 280px de alto, con gradiente sobre el vídeo y CTAs visibles.',
        'Cada fila temática es scrolleable horizontalmente con snap.',
        'El orden de las filas es configurable vía CMS (no hardcoded).',
        'Tap en un item abre el reproductor existente sin pérdida de funcionalidad.',
        'En modo offline, las filas con caché muestran su contenido; las nuevas muestran skeleton.'
    ],
    uxNotes: [
        'El hero tiene un autoplay silenciado (mute) similar a Netflix.',
        'Cada fila tiene un kicker de categoría + título y chevron "Ver todos".',
        'Los thumbnails son 16:9 a 160px de ancho mínimo en mobile.'
    ],
    metrics: [
        'Tiempo medio en RM Play vs RMTV actual (objetivo: +50%)',
        'Vídeos vistos por sesión (objetivo: +1.5)',
        'Profundidad de scroll (objetivo: alcanzar al menos la 4ª fila en 50% sesiones)'
    ],
    dependencies: [
        'CMS necesita endpoints para hero destacado, filas temáticas y orden configurable.',
        'Sistema de tagging de contenidos por deporte y categoría.',
        'Reproductor actual debe aceptar el mismo contrato de id de vídeo.'
    ],
    risks: [
        'Carga inicial puede ser pesada si todas las filas piden datos en paralelo — cargar las primeras 3 filas eagerly y el resto on-scroll.',
        'El hero con autoplay puede consumir datos en mobile — respetar Data Saver del usuario.',
        'Cambio de nombre RMTV → RM Play tiene impacto SEO y de reconocimiento — coordinar con marketing.'
    ]
});

// ── VIP App ─────────────────────────────────────────────────────

register('vip.payments.management', {
    title: 'Gestión de métodos de pago en la App VIP',
    epic: 'VIP App · Pagos',
    estimate: 'L (3-4 sprints)',
    priority: 'Alta',
    context: 'Hoy en día, cada compra dentro de la App VIP (catering, experiencias, productos extra) obliga al usuario a introducir sus datos de pago de cero. No hay un wallet propio que recuerde tarjetas, PayPal o cuentas bancarias. Esto provoca abandono en checkout, especialmente en compras impulsivas el día de partido.',
    problem: 'La fricción de introducir 16 dígitos + caducidad + CVV cada vez es la principal causa de carrito abandonado dentro de la app VIP. Además no aprovechamos Apple Pay / Google Pay, que son el método preferido de la mayoría de palquistas.',
    objective: 'Permitir al usuario VIP gestionar sus métodos de pago (alta, edición, eliminación, predeterminado) desde su Perfil, y consumirlos en cualquier checkout de la app, con detección dinámica de Apple Pay / Google Pay.',
    inScope: [
        // 1. Acceso a la Gestión de Pagos
        'Entrada "Payment methods" en la sección Profile que abre la pantalla de gestión',
        'Pantalla con lista de métodos guardados, opción de añadir, y editar / eliminar existentes',
        // 2. Pantalla de métodos
        'Para cada método: tipo (VISA, PayPal, Cuenta bancaria…), información identificativa (últimos 4, titular), botón Edit',
        'Indicador visual claro del método predeterminado',
        'Botón persistente "Add payment method"',
        'Métodos soportados: tarjeta de débito/crédito, PayPal, cuenta bancaria y wallets de móvil (Apple Pay, Google Pay, Samsung Pay)',
        'Los wallets de móvil son métodos de primera clase: se guardan, se editan, se ponen como predeterminados igual que el resto',
        // 3. Añadir
        'Selector de tipo al pulsar "Add payment method", agrupado en dos secciones: "Wallets del dispositivo" (Apple/Google/Samsung Pay) y "Otros métodos" (tarjeta, PayPal, banco)',
        'Formulario adaptado al método elegido (campos: titular, número de tarjeta, MM/YY, CVV, dirección de facturación; equivalentes para PayPal y banco)',
        'Para wallets de móvil, el "formulario" se reduce a confirmar el wallet detectado en el dispositivo, etiqueta de dispositivo opcional y nombre del titular',
        'Checkbox "Make it the default payment method"',
        'Botones "Add" (valida y guarda) y "Cancel" (descarta)',
        // 4. Editar / eliminar
        'Vista de edición con los mismos campos que el alta',
        'Marcar como predeterminado desde la edición',
        'Eliminar el método con botón "Remove"',
        // 5. Checkout
        'Selector de métodos de pago en el checkout de la app VIP con wallets agrupados arriba y métodos manuales debajo',
        'Detección dinámica en frontend de Apple Pay (iOS), Google Pay (Android) y Samsung Pay (dispositivos Samsung) usando las APIs nativas',
        'Si un wallet guardado por el usuario coincide con uno detectado en el SO, se marca con badge "Recomendado" en gold y se preselecciona',
        'Si no hay wallet detectado, se preselecciona el método marcado como predeterminado'
    ],
    outOfScope: [
        'Métodos no listados (Bizum, criptomonedas, etc.) en v1',
        'Tokenización propia: usaremos PSP (Stripe/Adyen) que ya gestiona la PCI-DSS',
        'Cobros recurrentes / suscripciones (potencial v2)',
        'Wallet compartido entre titulares del mismo palco (potencial v2)'
    ],
    userStories: [
        'Como palquista, quiero guardar mis métodos de pago para no introducirlos cada vez que compro.',
        'Como palquista, quiero marcar uno como predeterminado para que se seleccione solo en el checkout.',
        'Como palquista en iPhone, quiero pagar con Apple Pay para confirmar en un toque.',
        'Como palquista en Android, quiero pagar con Google Pay o Samsung Pay según mi marca de teléfono.',
        'Como palquista, quiero ver mis wallets de móvil agrupados juntos, separados de los métodos clásicos, para encontrarlos rápido.',
        'Como palquista, quiero eliminar un método antiguo cuando cambie de banco.',
        'Como palquista, quiero ver claramente cuál es mi método predeterminado en la lista.'
    ],
    acceptanceCriteria: [
        'Existe una entrada "Payment methods" en la sección Profile que abre la pantalla de métodos.',
        'La pantalla muestra todos los métodos guardados con tipo, información identificativa y botón Edit.',
        'El método predeterminado lleva una marca visual diferenciada (badge "Por defecto" en gold).',
        'El botón "Add payment method" siempre está visible al final de la lista.',
        'Se pueden añadir métodos de tipo: tarjeta de débito/crédito, PayPal, cuenta bancaria, Apple Pay, Google Pay y Samsung Pay.',
        'El selector de tipo agrupa los métodos en dos secciones diferenciadas: "Wallets del dispositivo" y "Otros métodos".',
        'El formulario de tarjeta pide nombre del titular, número, MM/YY, CVV y dirección de facturación.',
        'El formulario incluye un checkbox "Make it the default payment method".',
        'Al pulsar "Add" se valida el formulario; si pasa, el método se guarda y se vuelve a la lista.',
        'Al pulsar "Cancel" se descarta la operación sin guardar.',
        'Desde la lista, "Edit" abre la misma vista del formulario con los datos rellenados.',
        'Desde la edición se puede marcar el método como predeterminado y eliminarlo con "Remove".',
        'En el checkout de la App VIP se muestra un selector con los métodos guardados.',
        'Si el dispositivo soporta Apple Pay o Google Pay, se muestran como opción destacada al inicio del selector.',
        'La disponibilidad de Apple/Google Pay se evalúa en runtime usando ApplePaySession.canMakePayments() y la Payment Request API.',
        'El método predeterminado del usuario se preselecciona, salvo que Apple/Google Pay estén disponibles, en cuyo caso se priorizan en la UI.'
    ],
    uxNotes: [
        'Validación en cliente del formato de tarjeta (Luhn) y de la caducidad antes de pulsar Add.',
        'Los CVV nunca se persisten ni se muestran después de guardar (solo se usan para tokenizar).',
        'El número de tarjeta se enmascara como "•••• •••• •••• 4242" en la lista y al volver a editar.',
        'Apple Pay debe usar el botón oficial provisto por PassKit (estilo y aspecto reglado por Apple).',
        'El badge "Por defecto" usa el color gold del sistema VIP.',
        'En modo edición, el botón "Remove" lleva confirmación destructiva (action sheet de iOS).'
    ],
    metrics: [
        'Conversión de checkout en la App VIP (objetivo: +20% sobre baseline)',
        '% de checkouts realizados con Apple/Google Pay (objetivo: 40% en iOS, 30% en Android)',
        'Tiempo medio para completar un pago (objetivo: <10s con método guardado, <5s con Apple Pay)',
        '% de usuarios VIP con al menos un método guardado a los 30 días (objetivo: 70%)'
    ],
    dependencies: [
        'PSP (Stripe o Adyen) configurado con las cuentas mercantes del club',
        'Tokenización PCI-DSS gestionada por el PSP — la app NO almacena PANs en claro',
        'Apple Merchant ID para Apple Pay y certificado de Google Pay',
        'Backend con endpoints CRUD para métodos del usuario, autenticados por JWT',
        'Backend de checkout que acepte token de PSP + método del usuario'
    ],
    risks: [
        'PCI-DSS: cualquier código que toque PANs en claro entra en scope; usar siempre Stripe Elements / Adyen Drop-in en iframe.',
        'Apple Pay requiere domain verification y certificados — preparar con tiempo (8+ semanas en peor caso).',
        'Si el PSP cambia los precios, todo el proyecto se ve afectado — negociar contrato a 24 meses.',
        'Algunos bancos no soportan IBAN europeo via SEPA Direct Debit — validar antes del lanzamiento.',
        'GDPR: datos de pago se consideran sensibles; documentar correctamente la política de retención y borrado.'
    ]
});

register('vip.tickets.multi-share', {
    title: 'Reparto múltiple de tickets a contactos del palco',
    epic: 'VIP App · Gestión de palco',
    estimate: 'L (3-4 sprints)',
    priority: 'Alta',
    context: 'Los abonados VIP/palquistas reciben hasta 19 tickets por evento y hoy sólo pueden gestionarlos uno a uno desde la pantalla de "Detalle de entradas". El proceso de repartirlos a sus invitados es manual, repetitivo y propenso a errores: copiar un link, pegar en WhatsApp/Mail, repetir 18 veces.',
    problem: 'El reparto manual es lento (15-20 minutos para 18 tickets) y los abonados se quejan en encuestas de satisfacción. Además, al usar links genéricos perdemos trazabilidad de quién recibe cada asiento, lo que genera incidencias el día del partido.',
    objective: 'Permitir al palquista seleccionar contactos de su agenda, asignar un asiento a cada uno y enviar todos los tickets en una sola operación, con account binding para que cada ticket quede ligado a la persona que lo recibe.',
    inScope: [
        'Pantalla de tickets que sustituye al "Detalle de entradas" actual',
        'Resumen de tickets propios + sin asignar + enviados',
        'Solicitud de permiso iOS-style para acceder a los contactos del teléfono',
        'Picker de contactos con badges de canal disponible (✉ Correo / SMS) por contacto',
        'Auto-routing: cada ticket se envía por el canal preferido del contacto (email > SMS)',
        'Preview de reparto con chip de canal por fila + opción de cambiar destinatario o canal',
        'Disclaimer "Una persona, un ticket" la primera vez',
        'Envío en batch con animación de progreso y desglose por canal',
        'Pantalla de "enviados" con cuenta + breakdown',
        'Estado por ticket: sin asignar, asignado, enviado, abierto, vinculado a Wallet'
    ],
    outOfScope: [
        'Compra de tickets adicionales',
        'Cesión al club (existe ya como tab separado)',
        'Importación de contactos vía CSV',
        'Reparto recurrente (mismos contactos siempre)',
        'Notificaciones push de "se ha vinculado tu ticket" (potencial v2)'
    ],
    userStories: [
        'Como palquista, quiero repartir mis 18 tickets en menos de 2 minutos para no perder tiempo antes de cada partido.',
        'Como palquista, quiero ver qué contactos tienen email y cuáles sólo móvil para elegir bien a quién invito.',
        'Como palquista, quiero saber por qué canal se enviará cada ticket sin tener que decidir uno a uno.',
        'Como palquista, quiero cambiar el canal de un destinatario concreto si sé que prefiere SMS.',
        'Como palquista, quiero reasignar un asiento a otra persona sin tener que cancelar y empezar de cero.',
        'Como invitado, quiero recibir un ticket ya con mi asiento concreto, no un link genérico al palco.'
    ],
    acceptanceCriteria: [
        'La pantalla muestra correctamente el contador "X tickets / Y enviados / Z pendientes".',
        'El primer ticket está siempre marcado como "Para mí" y se añade automáticamente al Wallet del palquista.',
        'La primera vez que se accede al picker, se solicita permiso iOS para contactos.',
        'Si el usuario rechaza el permiso, no puede continuar; el flujo se cierra con un mensaje claro.',
        'Si acepta, el permiso se persiste y no se vuelve a pedir.',
        'Cada contacto en el picker muestra qué canales tiene disponibles (Correo y/o SMS); contactos sin ningún canal no son seleccionables.',
        'Al confirmar la selección, cada ticket se asigna a un contacto y se le pone su canal preferido (email si está, SMS si sólo tiene móvil).',
        'En el preview, cada fila muestra el canal asignado con un chip de color distinto (azul correo, verde SMS).',
        'Al pulsar una fila se puede cambiar el asiento, sustituir el destinatario o cambiar el canal (si el contacto tiene los dos).',
        'Antes del primer envío se muestra disclaimer "Una persona, un ticket" recordando el binding de Apple Wallet.',
        'El envío en batch muestra animación de progreso y cuenta final ("4 tickets enviados · 2 por correo, 2 por SMS").',
        'Los tickets enviados aparecen como "Listo para enviar / Enviado / Vinculado" en la lista principal.',
        'Para tickets enviados, el palquista puede reenviar o revocar desde un menú contextual.'
    ],
    uxNotes: [
        'Coherencia visual con el resto de la VIP App: dark mode + acentos gold.',
        'Los chips de canal usan los colores del sistema (no genéricos).',
        'El indicador de paso del wizard (1 Contactos · 2 Revisar · 3 Enviar) está siempre visible en el header del sheet.',
        'La lista de "sin asignar" se colapsa en una tarjeta resumen para no inundar la pantalla.'
    ],
    metrics: [
        'Tiempo medio para repartir 10+ tickets (objetivo: <2 minutos vs 15-20 actual)',
        '% de tickets enviados que terminan vinculados al Wallet del invitado (objetivo: 80%+)',
        'NPS del flujo de reparto (objetivo: >60)',
        'Reducción de tickets de soporte relacionados con accesos a palco (objetivo: -50%)'
    ],
    dependencies: [
        'API de tickets debe permitir bulk-assign con un único POST',
        'Servicio de envío transaccional (email + SMS) con templates personalizados con asiento',
        'Apple Wallet pass generation con identidad del receptor',
        'Acceso al address book del dispositivo (entitlements en el manifiesto)'
    ],
    risks: [
        'iOS exige Wallet pass binding por persona; no se puede transferir un pase ya vinculado — el disclaimer debe ser muy claro.',
        'Si un envío falla a mitad de batch, el sistema debe ser idempotente para reintentar sin crear duplicados.',
        'Algunos contactos tienen formatos de teléfono / email no estándar; validar antes del envío.',
        'Performance: 19 envíos en paralelo pueden saturar la red mobile — paralelizar en cliente con cap de 4.'
    ]
});

})();
