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
    show: openModal
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

function openModal(flagKey) {
    const def = REG[flagKey];
    if (!def) {
        alert('No hay iniciativa registrada para esta funcionalidad.');
        return;
    }
    const md = buildMarkdown({ ...def, flagKey });
    closeModal();

    const el = document.createElement('div');
    el.className = 'jira-modal-overlay';
    el.innerHTML = `
        <div class="jira-modal-backdrop" data-jira-action="close"></div>
        <div class="jira-modal-panel" role="dialog" aria-label="Iniciativa de JIRA">
            <div class="jira-modal-head">
                <div class="jira-modal-head-text">
                    <div class="jira-modal-kicker">Iniciativa de JIRA</div>
                    <div class="jira-modal-title">${escapeHTML(def.title)}</div>
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
            <div class="jira-modal-foot" id="jiraModalFoot"></div>
        </div>
    `;
    document.body.appendChild(el);
    _modalEl = el;

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
}
function _escClose(e) { if (e.key === 'Escape') closeModal(); }

function flash(text, ok = true) {
    const f = document.getElementById('jiraModalFoot');
    if (!f) return;
    f.textContent = text;
    f.className = 'jira-modal-foot ' + (ok ? 'ok' : 'err');
    setTimeout(() => { if (f) { f.textContent = ''; f.className = 'jira-modal-foot'; } }, 2500);
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

register('fan.hoy.v2-structure', {
    title: 'Hoy v2 · estructura modular con scroll vertical',
    epic: 'Fan App · Hoy',
    estimate: 'L (3-4 sprints)',
    priority: 'Alta',
    context: 'La pantalla "Hoy" actual concentra todo el contenido en un único bloque sobre el próximo partido. La interacción es muy plana: el usuario ve un partido, abre detalle y vuelve. No hay puntos de entrada secundarios (noticias, highlights, encuestas) que aumenten retención dentro de la pestaña.',
    problem: 'La sesión media en "Hoy" es corta porque, una vez consultado el partido próximo, no hay nada más que invite a quedarse. Los KPIs de tiempo en pestaña, scroll depth y CTR a contenidos secundarios son bajos.',
    objective: 'Rediseñar "Hoy" como un feed modular con scroll vertical, donde el partido siga siendo el ancla pero coexista con módulos de noticias, highlights y encuestas que el usuario puede consumir sin salir de la pestaña.',
    inScope: [
        'Card compacta del próximo partido en la parte superior (crests, fecha, hora, estadio, competición)',
        'Listado de 3-5 noticias destacadas con tap-to-detail',
        'Carrusel horizontal de highlights / vídeos cortos',
        'Bloque de encuesta placeholder (puede ser dummy en v1)',
        'Scroll vertical fluido entre módulos con respect al safe area'
    ],
    outOfScope: [
        'Pestañas por equipo (entregable separado, ver fan.hoy.team-tabs)',
        'Stories y Tras las cámaras (ver fan.hoy.stories)',
        'Bloque de gamificación (ver fan.hoy.gamification)',
        'Cabecera de login (ver fan.app.login-header)'
    ],
    userStories: [
        'Como aficionado, quiero ver el próximo partido nada más abrir la app, para no tener que buscarlo.',
        'Como aficionado, quiero scrollear hacia abajo y ver noticias relevantes sin cambiar de pestaña.',
        'Como aficionado, quiero ver highlights cortos del último partido sin tener que ir a RMTV.',
        'Como aficionado, quiero opinar sobre el equipo en una encuesta rápida, para sentir que mi voz cuenta.'
    ],
    acceptanceCriteria: [
        'La card del próximo partido muestra crests, fecha, hora, estadio y competición y es tappable hacia el detalle.',
        'Si hay más de un partido próximo, un carrusel horizontal en la card permite navegarlos.',
        'El listado de noticias muestra al menos título, kicker (categoría) y fecha; tap abre el detalle existente.',
        'El carrusel de highlights es horizontal con snap; al tocar un item se reproduce el vídeo en una hoja modal.',
        'La encuesta acepta una respuesta y deshabilita el resto sin recargar la pantalla.',
        'El scroll de la pantalla es fluido a 60fps en iPhone 12 o superior.'
    ],
    uxNotes: [
        'Todos los módulos tienen el mismo padding horizontal y un separador sutil para sentir el grid común.',
        'El módulo de partido se queda "sticky" al hacer scroll los primeros 80px para no perder la referencia.',
        'Los módulos vacíos (sin noticias, sin highlights) se ocultan en lugar de mostrar empty state.'
    ],
    metrics: [
        'Tiempo medio en la pestaña Hoy (objetivo: +30%)',
        'Scroll depth medio (objetivo: alcanzar el módulo de encuesta en al menos el 40% de las sesiones)',
        'CTR a detalle de noticia desde Hoy (objetivo: 8%+)',
        'Engagement de la encuesta (objetivo: 15% de los usuarios que ven el módulo responden)'
    ],
    dependencies: [
        'API de noticias destacadas (ya existente, sólo añadir endpoint para "destacadas en Hoy")',
        'CMS de highlights debe etiquetar piezas como "Hoy elegible"',
        'Diseño aprobado del bloque de encuesta (podría ir como dummy en v1)'
    ],
    risks: [
        'Si el back de noticias tarda > 800ms, el módulo aparece después del primer paint y produce CLS — necesitamos skeleton.',
        'El reproductor de highlights en hoja modal puede chocar con la rotación de iPad si no se valida.',
        'Encuesta puede percibirse como "anuncio" si se abusa: alternar contenido cada 2-3 días.'
    ]
});

register('fan.hoy.stories', {
    title: 'Stories + Tras las cámaras en Hoy v2',
    epic: 'Fan App · Hoy',
    estimate: 'M (2 sprints)',
    priority: 'Media',
    context: 'Una vez Hoy v2 está en marcha, queremos un punto de entrada visual estilo Instagram que aproveche el contenido lifestyle del club (entrenamientos, llegadas, vestuario) y ofrezca un layout de galería para "Tras las cámaras".',
    objective: 'Añadir un carrusel de stories en la parte superior de Hoy v2 y una sección "Tras las cámaras" después de las noticias, para subir tiempo en pantalla y dar visibilidad a contenido que hoy se pierde en RRSS.',
    inScope: [
        'Carrusel horizontal de stories arriba del todo en Hoy v2',
        'Visor a pantalla completa con paginación por tap (similar a Instagram Stories)',
        'Indicador de progreso por página, autoplay con duración configurable por pieza',
        'Sección "Tras las cámaras" con galería de fotos tras el bloque de noticias',
        'Tap en una foto → carrusel de imágenes a pantalla completa'
    ],
    outOfScope: [
        'Reacciones a stories (likes, mensajes)',
        'Ver quién ha visto tu story (es contenido editorial, no social)',
        'Stories patrocinadas o comerciales en v1'
    ],
    userStories: [
        'Como aficionado, quiero ver stories cortos del día a día del club para sentirme cerca del equipo.',
        'Como aficionado, quiero ver galerías de fotos de detrás de cámaras para acceder a contenido exclusivo.',
        'Como editor del club, quiero subir stories desde el CMS sin pasar por desarrollo.'
    ],
    acceptanceCriteria: [
        'El carrusel de stories es horizontal con scroll snap y muestra avatar circular + título de cada story.',
        'Tap en un avatar abre el visor a pantalla completa empezando en la página 0.',
        'El visor avanza páginas por tap derecho y retrocede por tap izquierdo; swipe arriba cierra.',
        'La sección "Tras las cámaras" muestra al menos 4 fotos en grid de 2 columnas.',
        'Tap en una foto abre un carrusel modal con todas las fotos de esa galería.',
        'Cierre por gesto y por botón ✕ en la esquina superior izquierda.'
    ],
    uxNotes: [
        'Los stories tienen un anillo dorado mientras no están vistos y gris cuando ya se han abierto.',
        'El visor a pantalla completa NO oculta el status bar para no romper la sensación nativa.',
        'Si la story tiene una sola página, el indicador de progreso se oculta.'
    ],
    metrics: [
        'CTR del carrusel de stories (objetivo: 25%+ de los usuarios que ven Hoy)',
        'Páginas vistas por sesión de visor (objetivo: 4+)',
        'CTR de "Tras las cámaras" (objetivo: 12%+)'
    ],
    dependencies: [
        'CMS necesita un nuevo content type "Story" con páginas ordenadas (imagen + caption opcional)',
        'CMS necesita un content type "Galería" con N fotos para "Tras las cámaras"',
        'Hoy v2 (`fan.hoy.v2-structure`) debe estar en producción primero'
    ],
    risks: [
        'Stories cargan muchas imágenes — necesitamos lazy-load + WebP/AVIF para no penalizar consumo de datos.',
        'El visor a pantalla completa colisiona con el side-menu si no se gestionan los gestos correctamente.'
    ]
});

register('fan.hoy.gamification', {
    title: 'Gamificación · predicciones de marcador y ranking local',
    epic: 'Fan App · Engagement',
    estimate: 'L (3 sprints)',
    priority: 'Media',
    context: 'Tenemos una base de aficionados muy activa pero sin ningún mecanismo lúdico que les invite a volver entre partidos. Las predicciones deportivas son una mecánica probada (Marca, AS, Mister) con altísima retención semanal.',
    objective: 'Permitir al aficionado predecir el marcador exacto del próximo partido del primer equipo, otorgar puntos por aciertos parciales y totales, y mostrar un ranking local (amigos / madridistas) que se actualice tras cada partido.',
    inScope: [
        'Bloque de predicción dentro de Hoy v2 con dos selectores de número (0-9) por equipo',
        'Botón "Enviar predicción" con confirmación visual',
        'Sistema de puntos: 5 por resultado correcto (W/D/L), 10 por marcador exacto',
        'Pantalla de ranking local accesible desde el bloque',
        'Histórico de predicciones del usuario (mínimo últimos 10 partidos)'
    ],
    outOfScope: [
        'Apuestas con dinero real',
        'Predicciones para partidos que no sean del primer equipo masculino (en v1)',
        'Ligas privadas con amigos (potencial v2)',
        'Notificaciones push de "se cierra la predicción" (potencial v2)'
    ],
    userStories: [
        'Como aficionado, quiero predecir el marcador antes del partido para sentirme parte del equipo.',
        'Como aficionado, quiero ver si he acertado tras el partido para celebrar mi instinto futbolero.',
        'Como aficionado, quiero ver mi ranking entre los demás madridistas para competir.',
        'Como aficionado, quiero ver mi histórico de aciertos para presumir.'
    ],
    acceptanceCriteria: [
        'El bloque sólo permite enviar predicción si quedan más de 30 minutos para el inicio del partido.',
        'Una vez enviada, la predicción no se puede modificar.',
        'Tras el final del partido, los puntos se calculan y persisten en backend.',
        'El ranking se actualiza en máximo 5 minutos tras el final del partido.',
        'El bloque muestra el estado de la predicción del usuario en el partido actual: "Pendiente", "Enviada: 2-1", "Acertada (+10pts)".',
        'El ranking permite ordenar por puntos totales del año y de la temporada.'
    ],
    uxNotes: [
        'Los selectores de número son ruedas verticales tipo iOS picker, no inputs de texto.',
        'El estado "Acertada" se acompaña de una animación sutil (confetti o destello) la primera vez que se ve.',
        'El ranking local se cabecera con el puesto del usuario destacado en gold.'
    ],
    metrics: [
        'Tasa de envío de predicción por usuario activo en día de partido (objetivo: 35%+)',
        'Retorno a la app el día siguiente al partido (objetivo: +25% sobre baseline)',
        'Sesiones por semana en weeks con partido (objetivo: +1.5 sesiones)'
    ],
    dependencies: [
        'API de partidos con timestamp de "kickoff" en zona horaria correcta',
        'Backend para almacenar predicciones, puntos y ranking',
        'Hoy v2 debe estar en producción'
    ],
    risks: [
        'Diferencias horarias entre cliente y servidor pueden permitir enviar predicciones tarde — validar siempre en backend.',
        'El ranking puede crecer mucho — paginar con cursor desde el inicio.',
        'GDPR: el ranking expone alias / iniciales, nunca nombres completos.'
    ]
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

register('fan.hoy.team-tabs', {
    title: 'Pestañas por equipo en Hoy (filtro multi-deporte)',
    epic: 'Fan App · Hoy',
    estimate: 'M (2 sprints)',
    priority: 'Media',
    context: 'El Real Madrid no es sólo fútbol masculino: tenemos secciones de fútbol femenino y baloncesto cada vez más fuertes. Hoy v2 muestra todo mezclado, lo cual confunde a aficionados que sólo siguen una de las disciplinas.',
    objective: 'Añadir 4 pestañas en la parte superior de Hoy v2 (Todo · Fútbol masc · Fútbol fem · Baloncesto) que filtren todo el contenido (próximos partidos, noticias, highlights, encuesta) por deporte. "Todo" mantiene el comportamiento actual.',
    inScope: [
        '4 pestañas horizontales con scroll snap si no entran en pantalla',
        'Filtrado en cliente del contenido por equipo: partidos, noticias, highlights',
        'Persistencia del filtro elegido entre sesiones',
        'Animación sutil de transición entre filtros (fade-in del nuevo contenido)'
    ],
    outOfScope: [
        'Pestañas con emojis (entrega aparte, ver fan.hoy.team-tabs.emoji)',
        'Editor para activar/desactivar pestañas (entrega aparte, ver fan.hoy.team-tabs.editor)',
        'Filtros adicionales (Cantera, Veteranos, etc.) en v1'
    ],
    userStories: [
        'Como aficionado del baloncesto, quiero filtrar Hoy por mi deporte para no ver fútbol que no me interesa.',
        'Como aficionado generalista, quiero ver todo mezclado por defecto para no perderme nada.',
        'Como aficionada del fútbol femenino, quiero acceso rápido a contenido de mi equipo que hoy queda diluido.'
    ],
    acceptanceCriteria: [
        'Las pestañas siempre aparecen arriba del todo en Hoy v2 cuando el feature está activo.',
        'La pestaña "Todo" muestra el contenido sin filtrar (comportamiento original).',
        'Las pestañas de equipo filtran partidos, noticias y highlights al deporte seleccionado.',
        'La selección se persiste en localStorage y se mantiene tras matar y reabrir la app.',
        'Si una pestaña no tiene contenido en ningún módulo, muestra empty state ("Próximamente publicaremos contenido de…").'
    ],
    uxNotes: [
        'Pestañas con underline gold de 2px en la activa.',
        'Cuando hay scroll horizontal, el último item visible se medio-corta para indicar más contenido a la derecha.',
        'En tablets centrar las pestañas con max-width.'
    ],
    metrics: [
        'Tasa de cambio de pestaña por sesión (objetivo: 35%+ usan al menos una pestaña distinta de "Todo")',
        'Tiempo en Hoy de aficionados de fútbol fem y basket (objetivo: +50%)'
    ],
    dependencies: [
        'Cada item de contenido (partido, noticia, highlight) debe llevar una etiqueta de deporte en el backend.',
        'Hoy v2 (`fan.hoy.v2-structure`) debe estar en producción.'
    ],
    risks: [
        'Si el backend tarda en etiquetar todo el catálogo histórico, los filtros darán huecos.',
        'Validar que el filtro no oculte contenido cross-deporte importante (ej: notas del club que aplican a todos).'
    ]
});

register('fan.hoy.team-tabs.emoji', {
    title: 'Variante de pestañas con emojis (⚽ ⚽ 🏀)',
    epic: 'Fan App · Hoy',
    estimate: 'XS (<1 sprint)',
    priority: 'Baja',
    context: 'Las pestañas por equipo en texto plano funcionan, pero perdemos un punto de personalidad y reconocimiento visual. Probar una variante con emojis puede mejorar reconocimiento sin alterar la lógica.',
    objective: 'Variante visual A/B testable de las pestañas por equipo donde el deporte se identifica con un emoji además del texto.',
    inScope: [
        'Pestañas con emoji + texto: "⚽ Masculino", "⚽ Femenino", "🏀 1er equipo"',
        'Mantener comportamiento idéntico al de la variante texto-only'
    ],
    outOfScope: [
        'Iconos custom del club (los emojis son del sistema operativo)',
        'Animar los emojis'
    ],
    userStories: [
        'Como producto, quiero comparar engagement entre la variante texto y la variante emoji para elegir la mejor.'
    ],
    acceptanceCriteria: [
        'Cuando el flag está activo, las pestañas muestran emoji + texto en lugar de sólo texto.',
        'El ancho de las pestañas se ajusta para que sigan entrando en una fila en mobile.',
        'Funciona junto con `fan.hoy.team-tabs.editor`: las pestañas ocultas siguen ocultas.'
    ],
    uxNotes: [
        'Los emojis no deben aparecer en pantallas con tipografía decorativa que se vea afectada.',
        'En modo oscuro algunos emojis pierden contraste — comprobar y, si hace falta, añadir un fondo sutil.'
    ],
    metrics: [
        'A/B test: CTR de pestañas (objetivo: detectar si emoji mejora >10%)',
        'NPS qualitativo en focus group'
    ],
    dependencies: [
        '`fan.hoy.team-tabs` debe estar en producción.'
    ],
    risks: [
        'Algunos usuarios consideran los emojis "infantiles" — necesitamos data, no opinión, para decidir.'
    ]
});

register('fan.hoy.team-tabs.editor', {
    title: 'Editor de pestañas (activar / ocultar deportes)',
    epic: 'Fan App · Hoy',
    estimate: 'S (1 sprint)',
    priority: 'Media',
    context: 'Hay aficionados que sólo siguen un deporte y prefieren no ver siquiera la pestaña de los demás. Otros quieren ver todo. Necesitamos darles control sin obligarles a navegar a Ajustes.',
    objective: 'Botón ⚙ junto a las pestañas de equipo que abre un editor donde el usuario puede activar / ocultar cada pestaña. La pestaña "Todo" siempre se muestra.',
    inScope: [
        'Botón ⚙ a la derecha de la barra de pestañas',
        'Sheet modal que lista cada pestaña de equipo con un toggle',
        'Persistencia inmediata de cambios (sin "Guardar")',
        'La pestaña "Todo" no es modificable'
    ],
    outOfScope: [
        'Reordenar las pestañas (potencial v2)',
        'Crear pestañas custom'
    ],
    userStories: [
        'Como aficionado del baloncesto, quiero ocultar las pestañas de fútbol para no verlas.',
        'Como aficionado generalista, quiero asegurarme de que siempre tengo todas las pestañas activas.'
    ],
    acceptanceCriteria: [
        'El botón ⚙ aparece junto a las pestañas cuando el flag está activo.',
        'Tap abre un sheet con tres rows: "Fútbol masc", "Fútbol fem", "Baloncesto" cada uno con un toggle.',
        'Toggle off oculta la pestaña inmediatamente sin necesidad de cerrar el sheet.',
        'Si el usuario está viendo una pestaña que oculta, vuelve automáticamente a "Todo".',
        'La preferencia se persiste en localStorage.',
        'Cierre por tap en backdrop o botón "Cerrar".'
    ],
    uxNotes: [
        'El sheet ocupa solo la altura necesaria (no full-screen).',
        'Los toggles usan el componente nativo de la app, no custom.',
        'Si el usuario oculta todas las pestañas de equipo, mostrar un toast suave: "Sigues viendo todo el contenido en \'Todo\'".'
    ],
    metrics: [
        '% de usuarios que abren el editor (objetivo: 15%+)',
        '% de usuarios que personalizan al menos una pestaña (objetivo: 8%+)'
    ],
    dependencies: [
        '`fan.hoy.team-tabs` debe estar en producción.'
    ],
    risks: [
        'Si el usuario oculta una pestaña por error, debería poder reactivarla fácilmente — el botón ⚙ siempre visible es la solución.'
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
        'Tap abre la hoja correspondiente.',
        'Si `fan.hoy.team-tabs.editor` está activo, aparece una fila adicional "Pestañas de Hoy" como atajo.'
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
