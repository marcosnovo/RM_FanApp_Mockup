/* ================================================================
   Real Madrid Fan App — Web Mockup Controller
   Translated behavior from the SwiftUI source.
   ================================================================ */

// ── Global state ─────────────────────────────────────────────────
const state = {
    app: 'fan',              // 'fan' | 'vip'

    // Fan App state
    tab: 'hoy',
    sub: 'directo',          // hoy sub-tab
    matchIndex: 0,           // current match in header carousel
    heroIndex: 0,            // current hero in Directo carousel
    newsId: null,            // when null = list; otherwise detail
    calendarSegment: 0,      // 0 cal | 1 clasif | 2 plant
    calendarMonth: 'Abril',
    calendarDay: 15,
    statsTab: 0,             // 0 general | 1 distrib | 2 ataque | 3 defensa
    rmtvDay: 0,
    sideMenuOpen: false,

    // VIP App state
    vipTab: 'inicio',             // 'inicio' | 'eventos' | 'gestor' | 'perfil'
    vipEventId: null,             // null = list; id = detail
    vipEventTab: 'partidos',      // 'partidos' | 'interesa' | 'faq'
    vipEventScreen: 'list',       // 'list' | 'detail' | 'tickets'
    vipTicketsSegment: 'disponible', // 'disponible' | 'cedido' | 'transferido'
    vipGastroIndex: 0,
    vipRestaurantId: null,        // null = no sheet; id = open
    vipHoursExpanded: false,
    vipPerfilOpen: false,
    vipPerfilSub: 'main'          // 'main' | 'pedidos' | 'autorizados'
};

// ── App configurations for sidebar ───────────────────────────────
const APP_CONFIG = {
    fan: {
        name: 'Fan App',
        subtitle: 'Fan App Mockup',
        tabs: [
            { key: 'hoy', label: 'Hoy', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M20.38 3.46 16 2a4 4 0 0 1-8 0L3.62 3.46a2 2 0 0 0-1.34 2.23l.58 3.47a1 1 0 0 0 .99.84H6v10c0 1.1.9 2 2 2h8a2 2 0 0 0 2-2V10h2.15a1 1 0 0 0 .99-.84l.58-3.47a2 2 0 0 0-1.34-2.23z"/></svg>`,
              subs: [
                { key: 'directo', label: 'Directo' },
                { key: 'resumen', label: 'Resumen' },
                { key: 'estadisticas', label: 'Estadísticas' },
                { key: 'jornada', label: 'Jornada' },
                { key: 'menu', label: 'Side Menu · ¡Hola!', dividerTop: true }
              ] },
            { key: 'noticias', label: 'Noticias', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h12a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V4z"/><path d="M18 8h2a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2"/><line x1="7" y1="8" x2="15" y2="8"/><line x1="7" y1="12" x2="15" y2="12"/><line x1="7" y1="16" x2="11" y2="16"/></svg>`,
              subs: [
                { key: 'lista', label: 'Lista de noticias' },
                { key: 'detalle', label: 'Detalle de noticia' }
              ] },
            { key: 'calendario', label: 'Calendario', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="17" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>`,
              subs: [
                { key: 'calendario', label: 'Calendario' },
                { key: 'clasificacion', label: 'Clasificación' },
                { key: 'plantilla', label: 'Plantilla' }
              ] },
            { key: 'rmtv', label: 'RMTV', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="4" width="20" height="14" rx="2"/><polygon points="10 9 15 12 10 15 10 9" fill="currentColor"/></svg>`,
              subs: [ { key: 'programacion', label: 'Programación' } ] },
            { key: 'tienda', label: 'Tienda', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 0 1-8 0"/></svg>`,
              subs: [
                { key: 'home', label: 'Home de tienda' },
                { key: 'categorias', label: 'Categorías' }
              ] }
        ]
    },
    vip: {
        name: 'VIP App',
        subtitle: 'Área VIP',
        tabs: [
            { key: 'inicio', label: 'Inicio', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M12 3 L21 10 V21 H14 V14 H10 V21 H3 V10 Z"/></svg>`,
              subs: [
                { key: 'home', label: 'Home' },
                { key: 'restaurante', label: 'Detalle restaurante' }
              ] },
            { key: 'eventos', label: 'Mis eventos', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 11h18"/><path d="M8 3v4M16 3v4"/></svg>`,
              subs: [
                { key: 'list', label: 'Lista de eventos' },
                { key: 'detail', label: 'Detalle de evento' },
                { key: 'tickets', label: 'Detalle de entradas' }
              ] },
            { key: 'gestor', label: 'Gestor', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 a8 8 0 0 0-8 8 v3 h3 v-3 a5 5 0 0 1 10 0 v3 h3 v-3 a8 8 0 0 0-8-8z"/><path d="M4 14 v3 a2 2 0 0 0 2 2 h1 v-5 z"/><path d="M20 14 v3 a2 2 0 0 1-2 2 h-1 v-5 z"/></svg>`,
              subs: [ { key: 'contacto', label: 'Contacto' } ] },
            { key: 'perfil', label: 'Perfil', icon: `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="8" r="4"/><path d="M4 21 a8 8 0 0 1 16 0"/></svg>`,
              subs: [
                { key: 'main', label: 'Mi perfil' },
                { key: 'pedidos', label: 'Mis pedidos' },
                { key: 'autorizados', label: 'Gestión de autorizados' }
              ] }
        ]
    }
};

// ── Tiny icon library (SF-symbol equivalents) ────────────────────
const I = {
    person:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M6 21v-1a6 6 0 0 1 12 0v1"/></svg>`,
    personCircle: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="10" r="3" fill="currentColor" stroke="none"/><path d="M6 19a6 6 0 0 1 12 0" fill="currentColor" stroke="none"/></svg>`,
    radio:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 12a8 8 0 0 1 16 0"/><path d="M7 12a5 5 0 0 1 10 0"/><circle cx="12" cy="12" r="1.8" fill="currentColor"/></svg>`,
    calendar:  `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>`,
    calendarPlus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M12 14v4M10 16h4"/></svg>`,
    play:      `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="11" opacity="0.95"/><polygon points="10,8 16,12 10,16" fill="white"/></svg>`,
    playSolid: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="6,4 20,12 6,20"/></svg>`,
    clock:     `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12,7 12,12 16,14" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`,
    chart:     `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="13" width="4" height="8"/><rect x="10" y="8" width="4" height="13"/><rect x="17" y="4" width="4" height="17"/></svg>`,
    arrowRight:`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
    arrowUpRightSquare: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 3h-6M21 3v6M21 3l-9 9"/><path d="M18 14v5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h5"/></svg>`,
    chevronLeft: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="15,6 9,12 15,18"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><polyline points="9,6 15,12 9,18"/></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6,9 12,15 18,9"/></svg>`,
    figureRun: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="14" cy="4" r="2.5"/><path d="M13 8 L8 11 L9 15 L6 19 L8 20 L11 16 L12 13 L14 14 L14 20 L16 20 L16 13 L18 11 L20 15 L22 14 L19 9 Z"/></svg>`,
    photo:     `<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5" fill="white"/><polygon points="21,17 14,11 3,19 21,19" fill="white" opacity="0.85"/></svg>`,
    line3:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></svg>`,
    xmark:     `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>`,
    slider:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="17" x2="20" y2="17"/><circle cx="9" cy="7" r="3" fill="var(--rm-bg)"/><circle cx="15" cy="17" r="3" fill="var(--rm-bg)"/></svg>`,
    search:    `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="19" y1="19" x2="15" y2="15"/></svg>`,
    cart:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.5 12H19l2-8H6"/></svg>`,
    thumbUp:   `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 20h8.5a2.5 2.5 0 0 0 2.45-2l1.3-7a2.5 2.5 0 0 0-2.46-2.95H15V5a3 3 0 0 0-3-3l-3 9v9z"/><rect x="2" y="10" width="5" height="11" rx="1"/></svg>`,
    thumbDown: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M9 4h8.5a2.5 2.5 0 0 1 2.45 2l1.3 7a2.5 2.5 0 0 1-2.46 2.95H15v3a3 3 0 0 1-3 3l-3-9V4z"/><rect x="2" y="3" width="5" height="11" rx="1"/></svg>`,
    gear:      `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>`,
    doc:       `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14,2 14,8 20,8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="14" y2="16"/></svg>`,
    airplane:  `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5z"/></svg>`,
    tshirt:    `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M4 5 L9 2 L10 4 A2 2 0 0 0 14 4 L15 2 L20 5 L18 10 L16 9 V21 H8 V9 L6 10 Z"/></svg>`,
    shoe:      `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M2 17 C4 14 6 13 8 13 L10 10 L15 11 L16 15 L21 16 L22 19 H2 Z"/></svg>`,
    bag:       `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 7 L19 7 L20 21 H4 Z M8 7 A4 4 0 0 1 16 7"/></svg>`,
    star:      `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15,9 22,10 17,14 18,22 12,18 6,22 7,14 2,10 9,9"/></svg>`,
    sportscourt: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="5" width="18" height="14" rx="2"/><line x1="12" y1="5" x2="12" y2="19"/><circle cx="12" cy="12" r="3"/></svg>`,
    crownSmall: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16 L3 6 L8 10 L12 4 L16 10 L21 6 L19 16 Z M5 18 H19 V20 H5 Z"/></svg>`
};

// ── Small utilities ──────────────────────────────────────────────
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

function el(html) {
    const tpl = document.createElement('template');
    tpl.innerHTML = html.trim();
    return tpl.content.firstElementChild;
}

// ── Tab bar (bottom) ─────────────────────────────────────────────
function renderTabBar() {
    // Icons come from Cibeles Design System navbar/ folder.
    // For "Noticias" there's no dedicated navbar icon — we reuse ui/file-05.
    const tabs = [
        { key: 'hoy',        label: 'Hoy',        inactive: 'icons/navbar/today.svg',    active: 'icons/navbar/fill-today.svg' },
        { key: 'noticias',   label: 'Noticias',   inactive: 'icons/ui/file-05.svg',      active: 'icons/ui/file-05.svg' },
        { key: 'calendario', label: 'Calendario', inactive: 'icons/navbar/calendar.svg', active: 'icons/navbar/fill-calendar.svg' },
        { key: 'rmtv',       label: 'RMTV',       inactive: 'icons/navbar/rmtv.svg',     active: 'icons/navbar/fill-rmtv.svg' },
        { key: 'tienda',     label: 'Tienda',     inactive: 'icons/navbar/shop.svg',     active: 'icons/navbar/fill-shop.svg' }
    ];

    return `
        <div class="tab-bar">
            ${tabs.map(t => `
                <button class="tab-bar-item ${state.tab === t.key ? 'active' : ''}" data-tab="${t.key}">
                    <img class="tab-bar-icon" src="${state.tab === t.key ? t.active : t.inactive}" alt="" width="28" height="28">
                    <span>${t.label}</span>
                </button>
            `).join('')}
        </div>
    `;
}

// ── HOY view ────────────────────────────────────────────────────
function renderHoy() {
    const match = HEADER_MATCHES[state.matchIndex];

    // Upcoming matches only expose Directo/Jornada; finished & live expose all 4
    const upcoming = match.status === 'upcoming';
    const segments = upcoming
        ? [['directo', 'Directo'], ['jornada', 'Jornada']]
        : [['directo', 'Directo'], ['resumen', 'Resumen'], ['estadisticas', 'Estadísticas'], ['jornada', 'Jornada']];

    // If current sub is hidden for this match, fall back to directo
    if (!segments.some(([k]) => k === state.sub)) state.sub = 'directo';

    const smallHomeCrest = bigCrestFor(match.homeTeam);
    const smallAwayCrest = bigCrestFor(match.awayTeam);

    return `
        <div class="home-wrap" id="homeWrap">
            <!-- Fixed top row (morphs during scroll) -->
            <div class="home-top-row-fixed" id="homeTopRowFixed">
                <button class="home-top-btn" id="btnSideMenu">
                    ${I.personCircle}
                    <span class="home-top-btn-label home-top-btn-label-fade">Tu área</span>
                </button>

                <div class="home-top-center">
                    <div class="home-top-dots" id="homeDotsFade">
                        ${HEADER_MATCHES.map((_, i) => `
                            <button class="home-dot ${i === state.matchIndex ? 'active' : ''}" data-match="${i}" aria-label="Match ${i + 1}"></button>
                        `).join('')}
                    </div>
                    <div class="home-top-collapsed" id="homeCollapsedFade">
                        <div class="home-top-mini-crest">${smallHomeCrest}</div>
                        <span class="home-top-datetime">${match.dateString.replace(' · ', ' - ')}</span>
                        <div class="home-top-mini-crest">${smallAwayCrest}</div>
                    </div>
                </div>

                <button class="home-top-btn">
                    ${I.radio}
                    <span class="home-top-btn-label home-top-btn-label-fade">Radio</span>
                </button>
            </div>

            <!-- Scrollable area: match carousel + segment bar + content -->
            <div class="home-scroll-content">
                <div class="home-match-area">
                    <div class="match-carousel" id="matchCarousel">
                        <button class="carousel-nav prev" data-carousel-prev>${I.chevronLeft}</button>
                        <div class="match-carousel-track" id="matchTrack" style="transform: translateX(-${state.matchIndex * 100}%)">
                            ${HEADER_MATCHES.map(m => renderMatchCard(m)).join('')}
                        </div>
                        <button class="carousel-nav next" data-carousel-next>${I.chevronRight}</button>
                    </div>
                </div>

                <div class="home-segment-bar" id="homeSegmentBar">
                    ${segments.map(([key, label]) => `
                        <button class="home-segment-item ${state.sub === key ? 'active' : ''}" data-sub="${key}">
                            <div class="home-segment-label">${label}</div>
                            <div class="home-segment-underline"></div>
                        </button>
                    `).join('')}
                </div>

                ${renderHoySubContent(match)}
            </div>
        </div>

        ${renderSideMenu()}
    `;
}

function renderMatchCard(match) {
    const homeCrest = bigCrestFor(match.homeTeam);
    const awayCrest = bigCrestFor(match.awayTeam);
    const dateStr = match.dateString.replace(' · ', ' - ');
    const isUpcoming = match.status === 'upcoming';

    // Competition badge label (shorter)
    const compLabel = match.competition === 'LALIGA EA SPORTS' ? 'LA LIGA' : match.competition;

    // Status pill below score
    let statusPill = '';
    if (match.status === 'finished') statusPill = `<div class="match-status-pill">Finalizado</div>`;
    if (match.status === 'live')     statusPill = `<div class="match-status-pill live">En vivo</div>`;

    // Center cell
    const centerHTML = isUpcoming
        ? `<div class="match-center-col">
             <div class="match-date-upcoming">${dateStr}</div>
             <button class="match-cal-btn" aria-label="Añadir al calendario">${I.calendarPlus}</button>
           </div>`
        : `<div class="match-center-col">
             <div class="match-date-upcoming">${dateStr}</div>
             <div class="match-score-big">
               <span>${match.homeScore ?? 0}</span>
               <span class="match-score-dash">-</span>
               <span>${match.awayScore ?? 0}</span>
             </div>
             ${statusPill}
           </div>`;

    // Scorers under team name
    const homeScorers = (!isUpcoming && match.homeScorers)
        ? match.homeScorers.split(' · ').map(s => `<div class="match-scorer">${s}</div>`).join('')
        : '';
    const awayScorers = (!isUpcoming && match.awayScorers)
        ? match.awayScorers.split(' · ').map(s => `<div class="match-scorer">${s}</div>`).join('')
        : '';

    return `
        <div class="match-card">
            <div class="match-competition-row">
                <span class="match-competition">${compLabel}</span>
            </div>
            <div class="match-teams-row">
                <div class="match-team">
                    <div class="match-big-crest">${homeCrest}</div>
                    <div class="match-team-name ${isUpcoming ? 'upcoming' : ''}">${match.homeTeam}</div>
                    ${homeScorers ? `<div class="match-scorers">${homeScorers}</div>` : ''}
                </div>
                ${centerHTML}
                <div class="match-team">
                    <div class="match-big-crest">${awayCrest}</div>
                    <div class="match-team-name ${isUpcoming ? 'upcoming' : ''}">${match.awayTeam}</div>
                    ${awayScorers ? `<div class="match-scorers">${awayScorers}</div>` : ''}
                </div>
            </div>
            <div class="match-info">${match.matchInfo}</div>
        </div>
    `;
}

function renderHoySubContent(match) {
    if (state.sub === 'resumen')      return renderResumen(match);
    if (state.sub === 'estadisticas') return renderEstadisticas(match);
    if (state.sub === 'jornada')      return renderJornada();
    if (state.sub === 'menu')         return `<div class="empty-placeholder">El Side Menu se muestra como overlay. Abre <em>¡Hola!</em> desde el avatar «Tu área» de arriba a la izquierda.</div>`;
    return renderDirecto();
}

// ── Directo content ─────────────────────────────────────────────
function renderDirecto() {
    const i = state.heroIndex;
    return `
        <div class="directo-wrap">
            <div class="hero-scroll" id="heroScroll">
                ${HERO_ITEMS.map((h, idx) => `
                    <div class="hero-slide" data-hero-slide="${idx}">
                        <div class="hero-card" style="--c1: ${h.color}; --c2: ${h.color}dd">
                            <div class="hero-card-figure">${I.figureRun}</div>
                            <div class="hero-card-chip">${idx + 1}/${HERO_ITEMS.length}</div>
                            <div class="hero-card-overlay"></div>
                            <div class="hero-card-title">${h.title}</div>
                            <div class="hero-card-subtitle">${h.subtitle || ''}</div>
                        </div>
                    </div>
                `).join('')}
            </div>
            <div class="hero-controls">
                <button class="hero-arrow prev" data-hero-prev>${I.chevronLeft}</button>
                <div class="hero-dots-wrap">
                    ${HERO_ITEMS.map((_, idx) => `
                        <button class="hero-dot ${idx === i ? 'active' : ''}" data-hero="${idx}"></button>
                    `).join('')}
                </div>
                <button class="hero-arrow next" data-hero-next>${I.chevronRight}</button>
            </div>

            <div class="home-promo">
                <div class="home-promo-title">15% de DTO. en todas las equipaciones</div>
                <div class="home-promo-visual">
                    <div class="jersey j1">${I.tshirt}</div>
                    <div class="jersey j2">${I.tshirt}</div>
                    <div class="jersey j3">${I.tshirt}</div>
                </div>
                <button class="home-promo-btn" data-go-store>
                    Comprar ${I.arrowUpRightSquare}
                </button>
            </div>
        </div>
    `;
}

// Keep scroll position in sync with heroIndex dots
function setupHeroCarouselScroll() {
    const scroll = $('#heroScroll');
    if (!scroll) return;

    // Jump to the active slide without animation on first render (centered)
    const slide = scroll.querySelector(`[data-hero-slide="${state.heroIndex}"]`);
    if (slide) {
        const offset = slide.offsetLeft - (scroll.clientWidth - slide.offsetWidth) / 2;
        scroll.scrollLeft = Math.max(0, offset);
    }

    let ticking = false;
    scroll.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            const first = scroll.firstElementChild;
            if (!first) return;
            const gap = parseFloat(getComputedStyle(scroll).gap || '0') || 10;
            const stride = first.offsetWidth + gap;
            const idx = Math.round(scroll.scrollLeft / stride);
            if (idx !== state.heroIndex && idx >= 0 && idx < HERO_ITEMS.length) {
                state.heroIndex = idx;
                $$('.hero-dot').forEach((dot, i) => dot.classList.toggle('active', i === idx));
            }
        });
    }, { passive: true });
}

// ── Resumen content ─────────────────────────────────────────────
function renderResumen(match) {
    if (match.status === 'upcoming') {
        return `
            <div class="resumen-wrap">
                <div class="resumen-empty">
                    ${`<svg viewBox="0 0 24 24" width="40" height="40" fill="currentColor"><circle cx="12" cy="12" r="10"/><polyline points="12,7 12,12 16,14" stroke="white" stroke-width="2" fill="none" stroke-linecap="round"/></svg>`}
                    <p>El resumen estará disponible<br>tras el partido</p>
                </div>
            </div>
        `;
    }
    const goals = [];
    if (match.homeScorers) goals.push({ team: match.homeTeam, scorers: match.homeScorers, color: match.homeTeamColor, symbol: match.homeTeamSymbol });
    if (match.awayScorers) goals.push({ team: match.awayTeam, scorers: match.awayScorers, color: match.awayTeamColor, symbol: match.awayTeamSymbol });

    return `
        <div class="resumen-wrap">
            <div class="resumen-video">
                <div class="resumen-video-time">4:32</div>
                ${I.play}
                <div class="resumen-video-label">Ver resumen completo</div>
            </div>

            ${goals.length ? `
                <div class="resumen-goals">
                    <div class="section-title">Goles del partido</div>
                    ${goals.map(g => `
                        <div class="goal-row">
                            <div class="goal-crest" style="color: ${g.color}">${g.symbol}</div>
                            <div>
                                <div class="goal-team">${g.team}</div>
                                <div class="goal-scorers">${g.scorers}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            ` : ''}

            <div class="resumen-moments">
                <div class="section-title">Momentos clave</div>
                <div class="moments-scroll">
                    ${['Gol · min 12', 'Parada · min 34', 'Gol · min 61', 'Tarjeta · min 78', 'Gol · min 89']
                        .map(m => `<div class="moment-card">${I.playSolid}<span>${m}</span></div>`).join('')}
                </div>
            </div>
        </div>
    `;
}

// ── Estadísticas content ────────────────────────────────────────
function renderEstadisticas(match) {
    if (!match.stats || !match.stats.length) {
        return `
            <div class="stats-wrap">
                <div class="stats-empty">
                    ${I.chart}
                    <p>Las estadísticas estarán<br>disponibles tras el partido</p>
                </div>
            </div>
        `;
    }

    const fmt = (v, isPercent) => isPercent ? `${Math.round(v)}%` : (v % 1 === 0 ? v : v.toFixed(1));

    return `
        <div class="stats-wrap">
            <div class="stats-subtabs">
                ${['General', 'Distribución', 'Ataque', 'Defensa'].map((t, i) => `
                    <button class="stats-subtab ${state.statsTab === i ? 'active' : ''}" data-stats-tab="${i}">
                        <div class="stats-subtab-label">${t}</div>
                        <div class="stats-subtab-underline"></div>
                    </button>
                `).join('')}
            </div>

            <div class="stats-header">
                <div class="stats-team-label">
                    <div class="stats-mini-crest" style="color: ${match.homeTeamColor}">${match.homeTeamSymbol}</div>
                    <span>${match.homeTeam}</span>
                </div>
                <div class="stats-team-label">
                    <span>${match.awayTeam}</span>
                    <div class="stats-mini-crest" style="color: ${match.awayTeamColor}">${match.awayTeamSymbol}</div>
                </div>
            </div>

            <div class="stats-list">
                ${match.stats.map(stat => {
                    const total = stat.home + stat.away;
                    const homeFrac = total > 0 ? stat.home / total : 0.5;
                    return `
                        <div class="stat-row">
                            <div class="stat-row-top">
                                <div class="stat-val">${fmt(stat.home, stat.isPercent)}</div>
                                <div class="stat-label">${stat.label}</div>
                                <div class="stat-val right">${fmt(stat.away, stat.isPercent)}</div>
                            </div>
                            <div class="stat-bar">
                                <div class="stat-bar-home" style="background: ${match.homeTeamColor}bf; width: ${homeFrac * 100}%"></div>
                                <div class="stat-bar-away" style="background: ${match.awayTeamColor}bf; width: ${(1 - homeFrac) * 100}%"></div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ── Jornada content ─────────────────────────────────────────────
function renderJornada() {
    const rounds = ['J31 · LaLiga EA Sports', 'J32 · LaLiga EA Sports', 'J33 · LaLiga EA Sports'];

    return `
        <div class="jornada-wrap">
            ${rounds.map(r => `
                <div class="jornada-round">
                    <div class="jornada-round-label">${r}</div>
                    <div class="jornada-cards">
                        ${[0,1,2].map(() => `
                            <div class="jornada-card">
                                <div class="jornada-card-teams">
                                    <div class="jornada-crest" style="color: #d91a1a">${ICON_SHIELD}</div>
                                    <div class="jornada-score">
                                        <div class="jornada-score-val">2 - 1</div>
                                        <div class="jornada-score-label">FIN</div>
                                    </div>
                                    <div class="jornada-crest" style="color: ${RM_BLUE}">${ICON_CROWN}</div>
                                </div>
                                <div class="jornada-venue">21:00 · Bernabéu</div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// ── NOTICIAS ─────────────────────────────────────────────────────
function renderNoticias() {
    // News detail is rendered as a modal sheet OVER the list
    const first = NEWS_ITEMS[0];
    const rest  = NEWS_ITEMS.slice(1);

    return `
        <div class="news-wrap">
            <div class="news-heading">Destacado</div>
            <div class="news-featured" data-news-id="${first.id}">
                <div class="news-thumb-large" style="background: ${first.imageColor}">${I.photo}</div>
                <div class="news-featured-title">${first.title}</div>
            </div>
            <div class="news-divider"></div>
            ${rest.map(item => `
                <div class="news-row" data-news-id="${item.id}">
                    <div class="news-thumb-small" style="background: ${item.imageColor}">${I.photo}</div>
                    <div class="news-row-title">${item.title}</div>
                </div>
                <div class="news-row-divider"></div>
            `).join('')}
        </div>
    `;
}

function renderNewsDetail() {
    const item = NEWS_ITEMS.find(n => n.id === state.newsId) || NEWS_ITEMS[0];
    return `
        <div class="news-sheet-backdrop" data-news-close></div>
        <div class="news-sheet">
            <div class="news-sheet-grabber"></div>
            <div class="news-sheet-scroll">
                <div class="news-detail-top">
                    <button class="news-detail-ham">${I.line3}</button>
                    <div class="news-detail-crown">${I.crownSmall}</div>
                    <div class="news-detail-num">15</div>
                    <div class="news-detail-spacer"></div>
                    <button class="news-detail-access">
                        ${I.person} <span>Acceder</span>
                    </button>
                    <button class="news-detail-close" data-news-close>${I.xmark}</button>
                </div>
                <h1 class="news-detail-title">${item.title}</h1>
                <p class="news-detail-lead">${item.subtitle}</p>
                <div class="news-detail-hero" style="background: ${item.imageColor}">${I.figureRun}</div>
                <div class="news-detail-meta">${item.category}&nbsp;&nbsp;·&nbsp;&nbsp;${item.date}&nbsp;&nbsp;·&nbsp;&nbsp;${item.author}</div>
                <div class="news-detail-div"></div>
                <div class="news-detail-body">${item.body}</div>
            </div>
        </div>
    `;
}

// ── CALENDARIO ───────────────────────────────────────────────────
function renderCalendario() {
    return `
        <div class="cal-wrap">
            <div class="cal-segment">
                <div class="cal-pills">
                    ${['Calendario', 'Clasificación', 'Plantilla'].map((s, i) => `
                        <button class="cal-pill ${state.calendarSegment === i ? 'active' : ''}" data-cal-seg="${i}">${s}</button>
                    `).join('')}
                </div>
                <button class="cal-filter-btn">${I.slider}</button>
            </div>

            ${state.calendarSegment === 0 ? renderCalendarGrid() :
              state.calendarSegment === 1 ? renderClasificacion() :
              renderPlantilla()}
        </div>
    `;
}

function renderCalendarGrid() {
    const startOffset = 2; // April 2026 = Wed
    const totalDays = 30;
    const weekdays = ['L', 'M', 'X', 'J', 'V', 'S', 'D'];

    const cells = [];
    for (let i = 0; i < startOffset; i++) cells.push({ day: 0 });
    for (let d = 1; d <= totalDays; d++) {
        const matchData = APRIL_MATCHES.find(m => m.day === d);
        cells.push({ day: d, match: matchData });
    }

    const selMatch = APRIL_MATCHES.find(m => m.day === state.calendarDay);

    return `
        <div class="cal-months">
            ${CAL_MONTHS.map(m => `
                <button class="cal-month ${state.calendarMonth === m ? 'active' : ''}" data-month="${m}">${m}</button>
            `).join('')}
        </div>
        <div class="cal-grid">
            <div class="cal-weekdays">${weekdays.map(w => `<span>${w}</span>`).join('')}</div>
            <div class="cal-days">
                ${cells.map(c => {
                    if (c.day === 0) return `<div class="cal-day"></div>`;
                    const selected = c.day === state.calendarDay ? 'selected' : '';
                    const inner = c.match
                        ? (() => {
                            const opp = c.match.home.name === 'Real Madrid' ? c.match.away : c.match.home;
                            return `<div class="cal-day-crest" style="color: ${opp.color}">${opp.symbol}</div>`;
                          })()
                        : `<span>${c.day}</span>`;
                    const numBelow = c.match ? `<div class="cal-day-num">${c.day}</div>` : `<div class="cal-day-num"></div>`;
                    return `
                        <button class="cal-day ${selected}" data-day="${c.day}">
                            <div class="cal-day-circle">${inner}</div>
                            ${numBelow}
                        </button>
                    `;
                }).join('')}
            </div>
        </div>
        ${selMatch ? renderCalMatchCard(selMatch) : `<div class="cal-empty">Selecciona un día con partido</div>`}
    `;
}

function renderCalMatchCard(m) {
    return `
        <div class="cal-match-card">
            <div class="cal-match-head">
                <div class="cal-match-cat">${m.category}</div>
                <div class="cal-match-date">${m.dateString}</div>
            </div>
            <div class="cal-match-teams">
                <div class="cal-match-team">
                    <div class="match-crest" style="color: ${m.home.color}">${m.home.symbol}</div>
                    <div class="cal-match-team-name">${m.home.name}</div>
                </div>
                <button class="cal-match-cal-btn">${I.calendarPlus}</button>
                <div class="cal-match-team">
                    <div class="match-crest" style="color: ${m.away.color}">${m.away.symbol}</div>
                    <div class="cal-match-team-name">${m.away.name}</div>
                </div>
            </div>
            <button class="cal-match-area-btn">Área de partido</button>
        </div>
    `;
}

function renderClasificacion() {
    return `
        <div class="clasif-wrap">
            <div class="clasif-head">
                <span class="c-pos">Pos</span>
                <span class="c-club">Club</span>
                <span class="c-pj">PJ</span>
                <span class="c-pts">Pts</span>
            </div>
            ${STANDINGS.map((row, i) => `
                <div class="clasif-row ${i === 0 ? 'top' : ''}">
                    <span class="c-pos">${i + 1}</span>
                    <div class="c-club">
                        <div class="clasif-club-inner">
                            <div class="clasif-crest" style="color: ${row.color}">${row.symbol}</div>
                            <span>${row.team}</span>
                        </div>
                    </div>
                    <span class="c-pj">${row.pj}</span>
                    <span class="c-pts">${row.pts}</span>
                </div>
            `).join('')}
        </div>
    `;
}

function renderPlantilla() {
    return `
        <div class="plant-wrap">
            ${SQUAD.map(p => `
                <div class="plant-row">
                    <div class="plant-number">${p.number}</div>
                    <div class="plant-info">
                        <div class="plant-name">${p.name}</div>
                        <div class="plant-pos">${p.position}</div>
                    </div>
                    <div class="plant-chev">${I.chevronRight}</div>
                </div>
            `).join('')}
        </div>
    `;
}

// ── RMTV ─────────────────────────────────────────────────────────
function renderRMTV() {
    const day = TV_DAYS[state.rmtvDay];
    const first = day.items[0];
    const rest  = day.items.slice(1);

    return `
        <div class="rmtv-wrap">
            <div class="rmtv-hero">
                <div class="rmtv-hero-rings">
                    <div class="ring r1"></div>
                    <div class="ring r2"></div>
                    <div class="ring r3"></div>
                </div>
                <div class="rmtv-hero-caption">CHAMPIONS LEAGUE 25/26 · OCTAVOS DE FINAL · IDA</div>
            </div>

            <div class="rmtv-darkbar">
                <div class="rmtv-darkbar-title">RMTV EN ESPAÑOL</div>
                ${I.chevronDown}
            </div>

            ${first ? `
                <div class="rmtv-first-item">
                    <div class="rmtv-time">${first.time}</div>
                    <div class="rmtv-item-info">
                        <div class="rmtv-item-title">${first.title}</div>
                        ${first.isLive ? `<span class="rmtv-live-badge">EN DIRECTO</span>` : ''}
                    </div>
                </div>
            ` : ''}

            <div class="rmtv-play-card">
                <div class="rmtv-play-logo">
                    <div class="rmtv-play-crown">${I.crownSmall}</div>
                    <div class="rmtv-play-label">Play</div>
                </div>
                <div class="rmtv-play-thumbs">
                    <div class="rmtv-play-thumb t1">${I.crownSmall}</div>
                    <div class="rmtv-play-thumb t2">${I.playSolid}</div>
                    <div class="rmtv-play-thumb t3">${I.crownSmall}</div>
                </div>
                <button class="rmtv-play-btn">Descargar ahora</button>
            </div>

            <div class="rmtv-days">
                ${TV_DAYS.map((d, i) => `
                    <button class="rmtv-day ${state.rmtvDay === i ? 'active' : ''}" data-rmtv-day="${i}">${d.label}</button>
                `).join('')}
            </div>

            ${rest.map(item => `
                <div class="rmtv-schedule-row">
                    <div class="rmtv-schedule-time">${item.time}</div>
                    <div class="rmtv-schedule-info">
                        <div class="rmtv-schedule-title">${item.title}</div>
                        ${item.isLive ? `<span class="rmtv-live-badge">EN DIRECTO</span>` : ''}
                    </div>
                </div>
                <div class="rmtv-schedule-div"></div>
            `).join('')}
        </div>
    `;
}

// ── TIENDA ───────────────────────────────────────────────────────
function renderTienda() {
    return `
        <div class="store-wrap">
            <div class="store-top-banner">
                <span>15% DTO. EN TODAS LAS EQUIPACIONES OFICIALES 25/26</span>
                ${I.arrowRight}
            </div>
            <div class="store-navbar">
                <button class="store-nav-btn">${I.line3}</button>
                <div class="store-nav-center">
                    <div class="store-nav-crown">${I.crownSmall}</div>
                    <div class="store-nav-text">
                        <span class="store-nav-official">Official</span>
                        <span class="store-nav-store">Store</span>
                    </div>
                </div>
                <div class="store-nav-icons">
                    <button class="store-nav-btn">${I.person}</button>
                    <button class="store-nav-btn">${I.cart}</button>
                </div>
            </div>
            <div class="store-search">
                ${I.search}
                <input type="text" placeholder="Buscar">
            </div>
            <div class="store-hero">
                <div class="store-hero-figures">
                    <div style="transform: scaleX(-1) translate(-10px, 10px); opacity: 0.85">${I.figureRun}</div>
                    <div style="transform: translate(-40px, 20px); opacity: 0.7">${I.figureRun}</div>
                </div>
                <div class="store-hero-crown">${I.crownSmall}</div>
            </div>
            <div class="store-promo-card">
                <div class="store-promo-title">¡15% Dto. En Equipaciones!</div>
                <div class="store-promo-desc">Aprovecha este descuento exclusivo en todas las equipaciones oficiales de la temporada 25/26. Disponible por tiempo limitado.</div>
                <button class="store-promo-btn">Comprar ahora</button>
            </div>
            <div class="store-categories">
                <div class="store-cat-title">Categorías</div>
                <div class="store-cat-grid">
                    ${STORE_CATEGORIES.map(c => `
                        <div class="store-cat-card" style="background: linear-gradient(135deg, ${c.color} 0%, ${c.color}c0 100%)">
                            ${I[c.icon] || I.tshirt}
                            <span>${c.name}</span>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;
}

// ================================================================
// VIP APP
// ================================================================

// Restaurant scene backgrounds — CSS-drawn stylized interiors
function renderGastroScene(scene) {
    switch (scene) {
        case 'puerta57':
            return `
                <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" class="scene-svg">
                  <defs>
                    <linearGradient id="p57Sky" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stop-color="#1a2a38"/>
                      <stop offset="0.5" stop-color="#2a4458"/>
                      <stop offset="1" stop-color="#1a2e3e"/>
                    </linearGradient>
                    <linearGradient id="p57Field" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stop-color="#2a6e3e"/>
                      <stop offset="1" stop-color="#1a4e2a"/>
                    </linearGradient>
                  </defs>
                  <rect width="400" height="300" fill="url(#p57Sky)"/>
                  <!-- Stadium tiers seen through windows -->
                  <rect x="0" y="160" width="400" height="80" fill="url(#p57Field)"/>
                  <g stroke="#fff" stroke-width="0.8" opacity="0.4">
                    <line x1="0" y1="170" x2="400" y2="170"/>
                    <line x1="200" y1="160" x2="200" y2="240"/>
                    <ellipse cx="200" cy="200" rx="50" ry="24" fill="none"/>
                  </g>
                  <!-- Ceiling / roof lighting -->
                  <g fill="#e8d8a8" opacity="0.9">
                    <rect x="40" y="20" width="60" height="8" rx="3"/>
                    <rect x="150" y="20" width="100" height="8" rx="3"/>
                    <rect x="300" y="20" width="60" height="8" rx="3"/>
                  </g>
                  <!-- Tables in foreground -->
                  <g>
                    <rect x="30" y="200" width="70" height="70" rx="6" fill="#2a3a4a"/>
                    <rect x="115" y="200" width="70" height="70" rx="6" fill="#2a3a4a"/>
                    <rect x="215" y="200" width="70" height="70" rx="6" fill="#2a3a4a"/>
                    <rect x="300" y="200" width="70" height="70" rx="6" fill="#2a3a4a"/>
                  </g>
                  <!-- Plates/glasses on tables -->
                  <g fill="#c8d4e0" opacity="0.8">
                    <circle cx="65" cy="220" r="8"/>
                    <circle cx="150" cy="220" r="8"/>
                    <circle cx="250" cy="220" r="8"/>
                    <circle cx="335" cy="220" r="8"/>
                  </g>
                </svg>`;

        case 'plaza':
            return `
                <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" class="scene-svg">
                  <defs>
                    <linearGradient id="plWall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stop-color="#3a2a1a"/>
                      <stop offset="1" stop-color="#1a1108"/>
                    </linearGradient>
                    <linearGradient id="plBeer" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stop-color="#f5c04a"/>
                      <stop offset="1" stop-color="#a87320"/>
                    </linearGradient>
                  </defs>
                  <rect width="400" height="300" fill="url(#plWall)"/>
                  <!-- Brewery vat silhouettes -->
                  <g fill="#c8a86a" opacity="0.85">
                    <path d="M60 100 Q60 80 80 80 L140 80 Q160 80 160 100 L160 240 L60 240 Z"/>
                    <path d="M240 100 Q240 80 260 80 L320 80 Q340 80 340 100 L340 240 L240 240 Z"/>
                  </g>
                  <!-- Tap handles -->
                  <g fill="#2a1a0a">
                    <rect x="105" y="160" width="10" height="30" rx="2"/>
                    <rect x="285" y="160" width="10" height="30" rx="2"/>
                  </g>
                  <!-- Beer glasses -->
                  <g>
                    <rect x="95" y="180" width="30" height="50" rx="3" fill="url(#plBeer)" opacity="0.95"/>
                    <rect x="275" y="180" width="30" height="50" rx="3" fill="url(#plBeer)" opacity="0.95"/>
                  </g>
                  <!-- Foam on top -->
                  <g fill="#fff8e0">
                    <ellipse cx="110" cy="180" rx="16" ry="4"/>
                    <ellipse cx="290" cy="180" rx="16" ry="4"/>
                  </g>
                </svg>`;

        case 'arzabal':
            return `
                <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" class="scene-svg">
                  <defs>
                    <linearGradient id="azField" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stop-color="#2e7d44"/>
                      <stop offset="0.5" stop-color="#1f5e31"/>
                      <stop offset="1" stop-color="#0f3a1e"/>
                    </linearGradient>
                  </defs>
                  <rect width="400" height="300" fill="#0a1a12"/>
                  <!-- Big window revealing the pitch -->
                  <rect x="20" y="40" width="360" height="180" fill="url(#azField)" rx="6"/>
                  <g stroke="#fff" stroke-width="1.2" opacity="0.5">
                    <line x1="20" y1="130" x2="380" y2="130"/>
                    <line x1="200" y1="40" x2="200" y2="220"/>
                    <circle cx="200" cy="130" r="28" fill="none"/>
                  </g>
                  <!-- Window frame -->
                  <g stroke="#2a1e10" stroke-width="3" fill="none">
                    <rect x="20" y="40" width="360" height="180" rx="6"/>
                    <line x1="140" y1="40" x2="140" y2="220"/>
                    <line x1="260" y1="40" x2="260" y2="220"/>
                  </g>
                  <!-- Foreground table silhouette -->
                  <rect x="0" y="240" width="400" height="60" fill="#1a1309"/>
                  <g fill="#c8a86a" opacity="0.7">
                    <circle cx="90" cy="260" r="10"/>
                    <circle cx="200" cy="260" r="10"/>
                    <circle cx="310" cy="260" r="10"/>
                  </g>
                </svg>`;

        case 'sushi':
            return `
                <svg viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" class="scene-svg">
                  <defs>
                    <linearGradient id="suWall" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stop-color="#2a1c10"/>
                      <stop offset="1" stop-color="#0a0604"/>
                    </linearGradient>
                    <linearGradient id="suLantern" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0" stop-color="#ffd9a0"/>
                      <stop offset="1" stop-color="#c48840"/>
                    </linearGradient>
                  </defs>
                  <rect width="400" height="300" fill="url(#suWall)"/>
                  <!-- Bar counter -->
                  <rect x="0" y="190" width="400" height="110" fill="#1a0e08"/>
                  <line x1="0" y1="190" x2="400" y2="190" stroke="#8c6f48" stroke-width="1"/>
                  <!-- Hanging lanterns -->
                  <g>
                    <circle cx="80" cy="60" r="28" fill="url(#suLantern)" opacity="0.9"/>
                    <rect x="78" y="30" width="4" height="12" fill="#2a1e10"/>
                    <circle cx="200" cy="80" r="34" fill="url(#suLantern)" opacity="0.95"/>
                    <rect x="198" y="42" width="4" height="18" fill="#2a1e10"/>
                    <circle cx="320" cy="60" r="28" fill="url(#suLantern)" opacity="0.9"/>
                    <rect x="318" y="30" width="4" height="12" fill="#2a1e10"/>
                  </g>
                  <!-- Sushi plates on counter -->
                  <g>
                    <ellipse cx="100" cy="230" rx="36" ry="10" fill="#2a2018"/>
                    <circle cx="88" cy="228" r="6" fill="#d64a4a"/>
                    <circle cx="100" cy="228" r="6" fill="#efd9b8"/>
                    <circle cx="112" cy="228" r="6" fill="#2a2a2a"/>
                    <ellipse cx="220" cy="240" rx="36" ry="10" fill="#2a2018"/>
                    <circle cx="208" cy="238" r="6" fill="#efd9b8"/>
                    <circle cx="220" cy="238" r="6" fill="#d64a4a"/>
                    <circle cx="232" cy="238" r="6" fill="#2a2a2a"/>
                    <ellipse cx="320" cy="235" rx="36" ry="10" fill="#2a2018"/>
                    <circle cx="308" cy="233" r="6" fill="#2a2a2a"/>
                    <circle cx="320" cy="233" r="6" fill="#d64a4a"/>
                    <circle cx="332" cy="233" r="6" fill="#efd9b8"/>
                  </g>
                </svg>`;

        default: return '';
    }
}

// Gold "//" slash separator — two skewed bronze/gold parallelograms
function gSlash(size = 'md') {
    const cfg = {
        xs: { h: 14, w: 3, gap: 2 },
        sm: { h: 22, w: 5, gap: 3 },
        md: { h: 36, w: 7, gap: 5 },
        lg: { h: 52, w: 10, gap: 7 },
        xl: { h: 72, w: 14, gap: 10 }
    }[size] || { h: 36, w: 7, gap: 5 };
    return `
        <span class="g-slash" style="height:${cfg.h}px; gap:${cfg.gap}px">
            <span style="width:${cfg.w}px; height:${cfg.h}px"></span>
            <span style="width:${cfg.w}px; height:${cfg.h}px"></span>
        </span>
    `;
}

// VIP-specific icons
const VIP_I = {
    soccerBall: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.4"><circle cx="12" cy="12" r="9"/><polygon points="12,7 16,10 14.5,14.5 9.5,14.5 8,10" fill="currentColor" stroke="none"/><line x1="12" y1="3" x2="12" y2="7"/><line x1="16" y1="10" x2="20.5" y2="10.5"/><line x1="8" y1="10" x2="3.5" y2="10.5"/><line x1="9.5" y1="14.5" x2="7" y2="19"/><line x1="14.5" y1="14.5" x2="17" y2="19"/></svg>`,
    person: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="8" r="4"/><path d="M4 20 a8 6 0 0 1 16 0 z"/></svg>`,
    restaurante: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 3 L7 10 A3 3 0 0 0 10 13 L10 21 L8 21 L8 13 Q5 13 5 10 L5 3 Z M9 3 L9 9 L7 9 L7 3 Z"/><path d="M16 3 C13 3 12 6 12 9 C12 11 13 12 14 12 L14 21 L16 21 L16 3 Z"/></svg>`,
    calendar: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18"/></svg>`,
    calendarPlus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="16" rx="2"/><path d="M8 3v4M16 3v4M3 10h18M12 14v4M10 16h4"/></svg>`,
    clock: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="9"/><polyline points="12,7 12,12 15,14"/></svg>`,
    location: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 22 C8 18 4 14 4 10 a8 8 0 0 1 16 0 c0 4 -4 8 -8 12z"/><circle cx="12" cy="10" r="3"/></svg>`,
    star: `<svg viewBox="0 0 24 24" fill="currentColor"><polygon points="12,2 15,9 22,10 17,14 18,22 12,18 6,22 7,14 2,10 9,9"/></svg>`,
    ticket: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 8 a2 2 0 0 1 2-2 h14 a2 2 0 0 1 2 2 v2 a2 2 0 0 0 0 4 v2 a2 2 0 0 1-2 2 H5 a2 2 0 0 1-2-2 v-2 a2 2 0 0 0 0-4 z"/><line x1="12" y1="7" x2="12" y2="17" stroke-dasharray="2 2"/></svg>`,
    arrowRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>`,
    phone: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`,
    headset: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 14 v-3 a9 9 0 0 1 18 0 v3"/><path d="M3 14 a2 2 0 0 0 2 2 h1 v-5 H5 a2 2 0 0 0-2 2 z"/><path d="M21 14 a2 2 0 0 1-2 2 h-1 v-5 h1 a2 2 0 0 1 2 2 z"/><path d="M16 19 a4 2 0 0 1-4 2 a4 2 0 0 1-4-2"/></svg>`,
    copy: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="9" y="9" width="11" height="11" rx="2"/><path d="M5 15 V5 a2 2 0 0 1 2-2 h10"/></svg>`,
    mail: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3,7 12,13 21,7"/></svg>`,
    trash: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><polyline points="4,7 20,7"/><path d="M6 7 v12 a2 2 0 0 0 2 2 h8 a2 2 0 0 0 2-2 V7"/><path d="M9 7 V4 a1 1 0 0 1 1-1 h4 a1 1 0 0 1 1 1 v3"/></svg>`,
    plus: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>`,
    chevronDown: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6,9 12,15 18,9"/></svg>`,
    chevronUp: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6,15 12,9 18,15"/></svg>`,
    chevronRight: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="9,6 15,12 9,18"/></svg>`,
    history: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 12 a9 9 0 1 0 2.6-6.4"/><polyline points="3,4 3,10 9,10"/><polyline points="12,8 12,12 15,14"/></svg>`,
    xmark: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>`,
    walletPass: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="3" y="6" width="18" height="13" rx="2"/><path d="M3 11h18"/><rect x="14" y="14" width="5" height="3" rx="0.5" fill="currentColor"/></svg>`,
    moreVert: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>`
};

function renderVipApp() {
    let content = '';
    switch (state.vipTab) {
        case 'inicio':  content = renderVipInicio(); break;
        case 'eventos': content = renderVipEventos(); break;
        case 'gestor':  content = renderVipGestor(); break;
        case 'perfil':  content = renderVipInicio(); break;  // Inicio backdrop while perfil sheet is open
        default:        content = renderVipInicio();
    }
    return `
        <div class="vip-app">
            <div class="vip-palco-bar">
                <div class="vip-palco-label">
                    PALCO 4101 ${VIP_I.chevronDown}
                </div>
            </div>
            ${content}
        </div>
    `;
}

function renderVipInicio() {
    const reco = VIP_EVENTS[0]; // "Real Madrid vs Alavés"
    const next = VIP_NEXT_EVENT;
    const rest = VIP_EVENTS.slice(1);

    return `
        <div class="vip-screen-head">
            <div class="vip-screen-title">Inicio</div>
            <button class="vip-avatar-btn" data-vip-perfil>${VIP_I.person}</button>
        </div>

        <div class="vip-section-title">
            Recomendado <small>para usted</small>
        </div>

        <div class="vip-reco-card" data-vip-event-id="${reco.id}">
            <div class="vip-reco-ball">${VIP_I.soccerBall}</div>
            <div class="vip-reco-teams">
                <div class="vip-reco-crest">${bigCrestForVip(reco.home)}</div>
                ${gSlash('md')}
                <div class="vip-reco-crest">${bigCrestForVip(reco.away)}</div>
            </div>
            <div class="vip-reco-title">${reco.home} vs ${reco.away}</div>
            <div class="vip-reco-meta">${reco.division}<br>${reco.date}<br>${reco.venue}</div>
        </div>

        <div class="vip-proximo">
            <div class="vip-proximo-ball">${VIP_I.soccerBall}</div>
            <div class="vip-proximo-teams">${next.home}<br>${next.away}</div>
            <div class="vip-proximo-center">
                <div class="vip-proximo-side-crest left">${bigCrestForVip(next.home)}</div>
                <div class="vip-proximo-date">${next.date}</div>
                <div class="vip-proximo-side-crest right">${bigCrestForVip(next.away)}</div>
            </div>
            <div class="vip-proximo-sub">${next.league}<br>${next.venue}</div>
        </div>

        <div class="vip-section-title">
            Próximos eventos
            <span class="vip-chevron" data-go-eventos>${VIP_I.arrowRight}</span>
        </div>

        <div class="vip-events-list">
            ${rest.map(ev => `
                <div class="vip-event-row" data-vip-event-id="${ev.id}">
                    <div class="vip-event-crests">
                        <div>${bigCrestForVip(ev.home)}</div>
                        ${gSlash('sm')}
                        <div>${bigCrestForVip(ev.away)}</div>
                    </div>
                    <div class="vip-event-info">
                        <div class="vip-event-title">${ev.home} vs ${ev.away}</div>
                        <div class="vip-event-date">${ev.dateShort}</div>
                        <div class="vip-event-cat">${VIP_I.star} <span>Deportes</span></div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="vip-section-title">Bernabéu Gastro</div>

        <div class="vip-gastro-scroll" id="vipGastroScroll">
            ${VIP_RESTAURANTS.map((r, i) => `
                <div class="vip-gastro-slide" data-vip-gastro="${i}">
                    <div class="vip-gastro-card scene-${r.scene}" data-vip-restaurant="${r.id}">
                        <div class="vip-gastro-scene">${renderGastroScene(r.scene)}</div>
                        <span class="vip-gastro-tag">${VIP_I.restaurante} ${r.tag}</span>
                        <div>
                            <div class="vip-gastro-title">${r.name}</div>
                            <div class="vip-gastro-sub">${r.sub}</div>
                        </div>
                    </div>
                </div>
            `).join('')}
        </div>

        <div class="vip-gastro-dots">
            ${VIP_RESTAURANTS.map((_, i) => `
                <button class="vip-gastro-dot ${i === state.vipGastroIndex ? 'active' : ''}" data-vip-gastro-dot="${i}"></button>
            `).join('')}
        </div>

        <div style="height: 30px"></div>
    `;
}

function renderVipEventos() {
    if (state.vipEventScreen === 'detail') return renderVipEventDetail();
    if (state.vipEventScreen === 'tickets') return renderVipTickets();

    return `
        <div class="vip-screen-head">
            <div class="vip-screen-title">Mis eventos</div>
            <div class="vip-head-actions">
                <button class="vip-head-icon-btn">${VIP_I.history}</button>
                <button class="vip-avatar-btn" data-vip-perfil>${VIP_I.person}</button>
            </div>
        </div>

        <div class="vip-events-cards">
            ${VIP_EVENTS.map(ev => `
                <div class="vip-event-card" data-vip-event-id="${ev.id}" style="cursor: pointer">
                    <div class="vip-event-card-head">
                        <div>${bigCrestForVip(ev.home)}</div>
                        ${gSlash('sm')}
                        <div>${bigCrestForVip(ev.away)}</div>
                    </div>
                    <div class="vip-event-date-big">${ev.date}</div>
                    <div class="vip-event-name">${ev.home} - ${ev.away}</div>
                    <div class="vip-event-division">${ev.division}</div>
                    <button class="vip-ticket-btn" data-vip-open-event="${ev.id}">${VIP_I.ticket} Entradas</button>
                    <div class="vip-ticket-hint">1 / 1 Disponibles</div>
                    <button class="vip-peticiones-btn">
                        <div>
                            <strong>Peticiones especiales</strong>
                            <span>Habilitado hasta el ${ev.peticionHasta}</span>
                        </div>
                        ${VIP_I.chevronRight}
                    </button>
                </div>
            `).join('')}
        </div>

        <div style="height: 20px"></div>
    `;
}

function renderVipEventDetail() {
    const ev = VIP_EVENTS.find(e => e.id === state.vipEventId) || VIP_EVENTS[0];
    const otros = VIP_EVENTS.filter(e => e.id !== ev.id);

    return `
        <div class="vip-event-detail-head">
            <button class="vip-back-btn" data-vip-back>${I.chevronLeft}</button>
            <div class="vip-event-detail-title">${ev.home} vs ${ev.away}</div>
            <button class="vip-back-btn">${VIP_I.calendarPlus}</button>
        </div>

        <div class="vip-event-hero">
            <div>${bigCrestForVip(ev.home)}</div>
            ${gSlash('xl')}
            <div>${bigCrestForVip(ev.away)}</div>
        </div>

        <div style="text-align:center; padding: 0 20px 6px">
            <div class="vip-event-name" style="font-size: 24px">${ev.home} vs ${ev.away}</div>
            <div class="vip-event-division">${ev.division}</div>
        </div>

        <button class="vip-mis-entradas-btn" data-vip-open-tickets>Mis entradas</button>

        <div class="vip-event-meta">
            <div class="vip-event-meta-row">${VIP_I.calendar} ${ev.date}</div>
            <div class="vip-event-meta-row">${VIP_I.location} ${ev.venue}</div>
            <div class="vip-event-meta-row">${VIP_I.clock} ${ev.duration}</div>
            <div class="vip-event-meta-row">${VIP_I.star} Deportes</div>
        </div>

        <div class="vip-subtabs">
            <button class="vip-subtab ${state.vipEventTab === 'partidos' ? 'active' : ''}" data-vip-event-tab="partidos">Partidos Bernabéu</button>
            <button class="vip-subtab ${state.vipEventTab === 'interesa' ? 'active' : ''}" data-vip-event-tab="interesa">Te puede interesar</button>
            <button class="vip-subtab ${state.vipEventTab === 'faq' ? 'active' : ''}" data-vip-event-tab="faq">Preguntas Frecuentes</button>
        </div>

        <div class="vip-subtab-content">
            ${state.vipEventTab === 'partidos' ? `
                <div class="vip-event-body-text">
                    Disfruta de los partidos en el estadio desde el Área VIP del Estadio Bernabéu y vive una experiencia única en un entorno privilegiado.<br><br>
                    Accede de forma preferente al estadio y déjate sorprender por una vista única del terreno de juego, en un entorno exclusivo y elegante y un servicio de catering gourmet con una cuidada selección de platos y bebidas.<br><br>
                    La experiencia del Área VIP del Real Madrid C.F. en el lugar perfecto para vivir el mejor fútbol del mundo con el máximo confort, en un ambiente selecto y memorable.
                </div>
                <div class="vip-event-features">
                    <div class="vip-event-feature">${VIP_I.restaurante} Experiencia gastronómica premium</div>
                    <div class="vip-event-feature">${VIP_I.star} Acceso exclusivo</div>
                </div>
                <div class="vip-section-title" style="padding: 10px 0 14px; font-size: 16px">Te puede interesar</div>
                ${otros.map(e => `
                    <div class="vip-event-row" data-vip-event-id="${e.id}" style="margin-bottom: 10px">
                        <div class="vip-event-crests">
                            <div>${bigCrestForVip(e.home)}</div>
                            ${gSlash('sm')}
                            <div>${bigCrestForVip(e.away)}</div>
                        </div>
                        <div class="vip-event-info">
                            <div class="vip-event-title">${e.home} vs ${e.away}</div>
                            <div class="vip-event-date">${e.dateShort}</div>
                            <div class="vip-event-cat">${VIP_I.star} <span>Deportes</span></div>
                        </div>
                    </div>
                `).join('')}
            ` : ''}

            ${state.vipEventTab === 'interesa' ? `
                ${otros.map(e => `
                    <div class="vip-event-row" data-vip-event-id="${e.id}" style="margin-bottom: 10px">
                        <div class="vip-event-crests">
                            <div>${bigCrestForVip(e.home)}</div>
                            ${gSlash('sm')}
                            <div>${bigCrestForVip(e.away)}</div>
                        </div>
                        <div class="vip-event-info">
                            <div class="vip-event-title">${e.home} vs ${e.away}</div>
                            <div class="vip-event-date">${e.dateShort}</div>
                            <div class="vip-event-cat">${VIP_I.star} <span>Deportes</span></div>
                        </div>
                    </div>
                `).join('')}
            ` : ''}

            ${state.vipEventTab === 'faq' ? `
                ${VIP_FAQS.map(q => `
                    <div class="vip-faq-item">
                        <div class="q">${q}</div>
                        ${VIP_I.chevronDown}
                    </div>
                `).join('')}
            ` : ''}
        </div>

        <button class="vip-peticiones-btn" style="margin: 20px; width: calc(100% - 40px);">
            <div>
                <strong>Peticiones especiales</strong>
                <span>¿Menú vegano? ¿Alguna alergia? ¿Su camiseta favorita? ¡Tan solo pídalo!</span>
            </div>
            ${VIP_I.chevronRight}
        </button>

        <div style="height: 20px"></div>
    `;
}

function renderVipTickets() {
    const ev = VIP_EVENTS.find(e => e.id === state.vipEventId) || VIP_EVENTS[0];
    const seg = state.vipTicketsSegment;

    return `
        <div class="vip-event-detail-head">
            <button class="vip-back-btn" data-vip-back>${I.chevronLeft}</button>
            <div class="vip-event-detail-title">Detalle de entradas</div>
            <button class="vip-back-btn">${VIP_I.calendarPlus}</button>
        </div>

        <div class="vip-tickets-card">
            <div class="vip-tickets-crests">
                <div>${bigCrestForVip(ev.home)}</div>
                ${gSlash('lg')}
                <div>${bigCrestForVip(ev.away)}</div>
            </div>
            <div class="vip-tickets-title">${ev.home} vs ${ev.away}</div>
            <div class="vip-tickets-sub">${ev.division}</div>
            <div class="vip-tickets-sub">${ev.dateTime}</div>
            <div class="vip-tickets-venue">${ev.venue}</div>
            <div class="vip-tickets-puerta">
                <div><div class="label">PUERTA:</div><div class="value">${ev.puerta}</div></div>
                <div><div class="label">SECTOR:</div><div class="value">${ev.sector}</div></div>
            </div>
        </div>

        <div class="vip-segmented">
            <button class="vip-segment ${seg === 'disponible' ? 'active' : ''}" data-vip-seg="disponible">Disponible</button>
            <button class="vip-segment ${seg === 'cedido' ? 'active' : ''}" data-vip-seg="cedido">Cedido al Club</button>
            <button class="vip-segment ${seg === 'transferido' ? 'active' : ''}" data-vip-seg="transferido">Transferido</button>
        </div>

        ${seg === 'disponible' ? `
            <div class="vip-seat-card">
                <div class="vip-seat-row">
                    <div class="vip-seat-info">FILA 0003 &nbsp;·&nbsp; ASIENTO 0010</div>
                    <div class="vip-seat-check"></div>
                </div>
                <div class="vip-seat-badge">DESCARGADA</div>
                <button class="vip-wallet-btn">${VIP_I.walletPass} Añadir a wallet</button>
            </div>
        ` : ''}

        ${seg === 'cedido' ? `
            <div class="vip-empty-state">
                <div class="vip-empty-state-icon">${VIP_I.soccerBall}</div>
                <div>Actualmente no hay entradas cedidas al Club</div>
            </div>
        ` : ''}

        ${seg === 'transferido' ? `
            <div class="vip-empty-state">
                <div class="vip-empty-state-icon">${VIP_I.soccerBall}</div>
                <div>Actualmente no hay entradas transferidas a otras personas</div>
            </div>
        ` : ''}

        <div style="height: 20px"></div>
    `;
}

function renderVipGestor() {
    return `
        <div class="vip-screen-head">
            <div class="vip-screen-title">Gestor</div>
            <button class="vip-avatar-btn" data-vip-perfil>${VIP_I.person}</button>
        </div>

        <div class="vip-gestor-wrap">
            <div class="vip-gestor-avatar">${VIP_I.headset}</div>
            <div class="vip-gestor-title">Hola Marcos,<br>hable con su gestor</div>
            <button class="vip-call-btn">${VIP_I.phone} Llamar al gestor</button>
            <div class="vip-gestor-hours">De lunes a viernes de 9:00 a 19:00 h</div>
            <div class="vip-gestor-divider"></div>
            <div class="vip-gestor-email-label">O envíenos un correo a</div>
            <div class="vip-gestor-email">
                <span>${VIP_PROFILE.email}</span>
                ${VIP_I.copy}
            </div>
        </div>
    `;
}

function renderVipSheets() {
    const restoSlot = $('#newsSheetSlot'); // reuse? Actually we have dedicated

    // Restaurant sheet
    let restoHTML = '';
    if (state.app === 'vip' && state.vipRestaurantId) {
        const r = VIP_RESTAURANTS.find(x => x.id === state.vipRestaurantId);
        if (r) {
            const firstOpen = r.hours[0];
            const more = r.hours.slice(1);
            restoHTML = `
                <div class="vip-resto-backdrop" data-vip-resto-close></div>
                <div class="vip-resto-sheet">
                    <div class="vip-resto-scroll">
                        <div class="vip-resto-head">
                            <button class="vip-resto-close" data-vip-resto-close>${VIP_I.xmark}</button>
                            <div class="vip-resto-title-big">${r.name}</div>
                        </div>
                        <span class="vip-resto-tag">${VIP_I.restaurante} ${r.tag}</span>
                        <div class="vip-resto-description">${r.description}</div>
                        <button class="vip-hours-toggle first" data-vip-hours-toggle>
                            <span><span style="color: var(--vip-gold); margin-right: 10px">${firstOpen.day}</span> <span style="color: var(--vip-text)">${firstOpen.time.replace('\n', ' / ')}</span></span>
                            ${state.vipHoursExpanded ? VIP_I.chevronUp : VIP_I.chevronDown}
                        </button>
                        ${state.vipHoursExpanded ? more.map(h => `
                            <div class="vip-hours-row">
                                <span class="day">${h.day}</span>
                                <span class="time">${h.time.replace('\n', ' / ')}</span>
                            </div>
                        `).join('') : ''}
                        <div class="vip-hours-notice">
                            El horario o disponibilidad de algunos restaurantes podría variar los días de partido o evento.
                        </div>
                        <div class="vip-resto-contact">
                            <span class="phone">${r.phone}</span>
                            <span class="web">${r.web}</span>
                        </div>
                        <button class="vip-reserve-btn">${VIP_I.phone} Reserva mediante Área VIP</button>
                    </div>
                </div>
            `;
        }
    }

    // Profile sheet
    let perfilHTML = '';
    if (state.app === 'vip' && state.vipPerfilOpen) {
        perfilHTML = renderVipPerfil();
    }

    // We'll drop all VIP sheets into #newsSheetSlot (repurpose it as a sheet slot)
    // Wrap in .vip-app so CSS variables cascade
    const html = restoHTML + perfilHTML;
    $('#newsSheetSlot').innerHTML = html
        ? `<div class="vip-app" style="position: relative; background: transparent; padding: 0; inset: auto">${html}</div>`
        : '';
}

function renderVipPerfil() {
    const p = VIP_PROFILE;
    return `
        <div class="vip-resto-sheet" style="top: 0; border-radius: 0; background: var(--vip-bg)">
            <div class="vip-resto-scroll" style="padding: 0 0 40px">
                <div class="vip-palco-bar" style="position: static">
                    <div class="vip-palco-label">PALCO 4101 ${VIP_I.chevronDown}</div>
                </div>
                <div class="vip-perfil-head">
                    <div class="vip-perfil-title">Perfil</div>
                    <button class="vip-perfil-close" data-vip-perfil-close>${VIP_I.xmark}</button>
                </div>

                <div class="vip-perfil-card">
                    <div class="vip-perfil-name">${p.name}</div>
                    <div class="vip-perfil-tag">${p.tag}</div>
                    <div class="vip-perfil-data">
                        ${p.palco}<br>
                        ${p.pass}<br>
                        ${p.asientos}
                    </div>
                    <div class="vip-perfil-menu-row">
                        <div class="ico-left">${VIP_I.history}<span>Mis pedidos</span></div>
                        ${VIP_I.chevronRight}
                    </div>
                    <div class="vip-perfil-menu-row">
                        <div class="ico-left">${VIP_I.plus}<span>Gestión de autorizados</span></div>
                        ${VIP_I.chevronRight}
                    </div>
                </div>

                <div class="vip-perfil-toggle-row">
                    <span>Notificaciones</span>
                    <div class="vip-toggle"></div>
                </div>
                <div class="vip-perfil-divider"></div>
                <div class="vip-perfil-toggle-row">
                    <span>Biometría</span>
                    <div class="vip-toggle"></div>
                </div>
                <div class="vip-perfil-divider"></div>
                <div class="vip-perfil-toggle-row">
                    <span>Idioma de la app</span>
                    <span style="color: var(--vip-gold)">Español</span>
                </div>
                <div class="vip-perfil-divider"></div>
                <div class="vip-perfil-toggle-row">
                    <span>Términos y condiciones</span>
                    <span></span>
                </div>
                <div class="vip-perfil-divider"></div>
                <div class="vip-perfil-toggle-row">
                    <span>Cerrar sesión</span>
                    <span style="color: var(--vip-gold)">↗</span>
                </div>
                <div style="padding: 20px; font-size: 11px; color: var(--vip-text-tertiary); text-align: right">1.0.19 (76)</div>
            </div>
        </div>
    `;
}

function renderVipTabBar() {
    const items = [
        { key: 'inicio',  label: 'Inicio',      icon: `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 3 L21 10 V21 H14 V14 H10 V21 H3 V10 Z"/></svg>` },
        { key: 'eventos', label: 'Mis eventos', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="6" width="18" height="14" rx="2"/><path d="M3 11h18"/><path d="M8 3v4M16 3v4"/></svg>` },
        { key: 'gestor',  label: 'Gestor',      icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M12 3 a8 8 0 0 0-8 8 v3 h3 v-3 a5 5 0 0 1 10 0 v3 h3 v-3 a8 8 0 0 0-8-8z"/><path d="M4 14 v3 a2 2 0 0 0 2 2 h1 v-5 z"/><path d="M20 14 v3 a2 2 0 0 1-2 2 h-1 v-5 z"/></svg>` }
    ];
    return `
        <div class="tab-bar vip-tab-bar">
            ${items.map(t => `
                <button class="tab-bar-item ${state.vipTab === t.key ? 'active' : ''}" data-vip-tab="${t.key}">
                    ${t.icon}
                    <span>${t.label}</span>
                </button>
            `).join('')}
        </div>
    `;
}

function setupVipGastroScroll() {
    const scroll = $('#vipGastroScroll');
    if (!scroll) return;

    let ticking = false;
    scroll.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            ticking = false;
            const first = scroll.firstElementChild;
            if (!first) return;
            const gap = parseFloat(getComputedStyle(scroll).gap || '0') || 12;
            const stride = first.offsetWidth + gap;
            const idx = Math.round(scroll.scrollLeft / stride);
            if (idx !== state.vipGastroIndex && idx >= 0 && idx < VIP_RESTAURANTS.length) {
                state.vipGastroIndex = idx;
                $$('.vip-gastro-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
            }
        });
    }, { passive: true });
}

function attachVipListeners() {
    // VIP tab bar
    $$('[data-vip-tab]').forEach(btn => btn.addEventListener('click', () => {
        state.vipTab = btn.dataset.vipTab;
        state.vipEventScreen = 'list';
        state.vipPerfilOpen = false;
        render();
    }));

    // Profile (avatar icon)
    $$('[data-vip-perfil]').forEach(btn => btn.addEventListener('click', () => {
        state.vipPerfilOpen = true;
        render();
    }));
    $$('[data-vip-perfil-close]').forEach(btn => btn.addEventListener('click', () => {
        state.vipPerfilOpen = false;
        render();
    }));

    // Navigate to Eventos from chevron
    $$('[data-go-eventos]').forEach(btn => btn.addEventListener('click', () => {
        state.vipTab = 'eventos';
        state.vipEventScreen = 'list';
        render();
    }));

    // Event card → detail
    $$('[data-vip-event-id]').forEach(el => el.addEventListener('click', e => {
        // Ignore if the click came from a button inside (handled separately)
        if (e.target.closest('[data-vip-open-event], [data-vip-open-tickets]')) return;
        state.vipEventId = parseInt(el.dataset.vipEventId);
        state.vipTab = 'eventos';
        state.vipEventScreen = 'detail';
        render();
    }));

    $$('[data-vip-open-event]').forEach(btn => btn.addEventListener('click', e => {
        e.stopPropagation();
        state.vipEventId = parseInt(btn.dataset.vipOpenEvent);
        state.vipTab = 'eventos';
        state.vipEventScreen = 'tickets';
        render();
    }));

    $$('[data-vip-open-tickets]').forEach(btn => btn.addEventListener('click', () => {
        state.vipEventScreen = 'tickets';
        render();
    }));

    $$('[data-vip-back]').forEach(btn => btn.addEventListener('click', () => {
        if (state.vipEventScreen === 'tickets') state.vipEventScreen = 'detail';
        else if (state.vipEventScreen === 'detail') state.vipEventScreen = 'list';
        render();
    }));

    // Event sub-tabs
    $$('[data-vip-event-tab]').forEach(btn => btn.addEventListener('click', () => {
        state.vipEventTab = btn.dataset.vipEventTab;
        render();
    }));

    // Ticket segments
    $$('[data-vip-seg]').forEach(btn => btn.addEventListener('click', () => {
        state.vipTicketsSegment = btn.dataset.vipSeg;
        render();
    }));

    // Restaurant cards → open sheet
    $$('[data-vip-restaurant]').forEach(el => el.addEventListener('click', () => {
        state.vipRestaurantId = el.dataset.vipRestaurant;
        state.vipHoursExpanded = false;
        render();
    }));
    $$('[data-vip-resto-close]').forEach(el => el.addEventListener('click', () => {
        state.vipRestaurantId = null;
        render();
    }));

    // Hours toggle
    $$('[data-vip-hours-toggle]').forEach(el => el.addEventListener('click', () => {
        state.vipHoursExpanded = !state.vipHoursExpanded;
        render();
    }));

    // Gastro dots
    $$('[data-vip-gastro-dot]').forEach(d => d.addEventListener('click', () => {
        const idx = parseInt(d.dataset.vipGastroDot);
        const scroll = $('#vipGastroScroll');
        if (scroll) {
            const slide = scroll.querySelector(`[data-vip-gastro="${idx}"]`);
            if (slide) scroll.scrollTo({ left: slide.offsetLeft - 16, behavior: 'smooth' });
        }
    }));
}

// ── SIDE MENU (¡Hola!) ──────────────────────────────────────────
function renderSideMenu() {
    return `
        <div class="side-menu-overlay ${state.sideMenuOpen ? 'visible' : ''}" id="sideMenuOverlay">
            <div class="side-menu-dim" id="sideMenuDim"></div>
            <div class="side-menu-panel">
                <button class="side-menu-close" id="sideMenuClose">${I.xmark}</button>
                <div class="side-menu-hello">¡Hola!</div>
                <button class="side-menu-login">Inicia sesión o regístrate ${I.arrowRight}</button>

                <div class="side-menu-div"></div>
                <button class="side-menu-row">
                    <span>Configuración de la app</span>
                    <span class="chev">${I.chevronRight}</span>
                </button>
                <div class="side-menu-div"></div>
                <button class="side-menu-row">
                    <span>Términos y condiciones</span>
                    <span class="chev">${I.chevronRight}</span>
                </button>
                <div class="side-menu-div"></div>

                <div class="side-menu-feedback">
                    <div class="side-menu-feedback-label">Cuéntanos tu opinión</div>
                    <div class="side-menu-feedback-btns">
                        <button class="side-menu-feedback-btn">${I.thumbDown}</button>
                        <button class="side-menu-feedback-btn">${I.thumbUp}</button>
                    </div>
                </div>

                <div class="side-menu-spacer"></div>

                <div class="side-menu-sponsors">
                    <div class="side-menu-sponsor">
                        ${I.airplane}
                        <div class="side-menu-sponsor-label">Emirates</div>
                    </div>
                    <div class="side-menu-adidas"><span></span><span></span><span></span></div>
                </div>
                <div class="side-menu-version">10.2.11 (Build 15970)</div>
            </div>
        </div>
    `;
}

// ── Status bar style helpers ─────────────────────────────────────
function updateStatusBarStyle() {
    const bar = document.querySelector('.status-bar');
    if (!bar) return;
    bar.classList.remove('dark-content', 'light-content');

    // VIP always uses white status-bar content (dark background)
    if (state.app === 'vip') {
        bar.classList.add('light-content');
        return;
    }

    const lightContent = (state.tab === 'hoy')
        || (state.tab === 'rmtv')
        || (state.tab === 'tienda');
    if (lightContent) bar.classList.add('light-content');
    else              bar.classList.add('dark-content');
}

// ── Main render ──────────────────────────────────────────────────
function render() {
    const body = $('#screenBody');
    const oldScroll = body.scrollTop;

    let content = '';
    let tabBarHTML = '';

    if (state.app === 'vip') {
        content = renderVipApp();
        tabBarHTML = renderVipTabBar();
    } else {
        switch (state.tab) {
            case 'hoy':        content = renderHoy();        break;
            case 'noticias':   content = renderNoticias();   break;
            case 'calendario': content = renderCalendario(); break;
            case 'rmtv':       content = renderRMTV();       break;
            case 'tienda':     content = renderTienda();     break;
        }
        tabBarHTML = renderTabBar();
    }

    body.innerHTML = content;
    $('#tabBarSlot').innerHTML = tabBarHTML;

    // Sheets (fan news + vip restaurant/perfil)
    $('#newsSheetSlot').innerHTML = (state.app === 'fan' && state.newsId) ? renderNewsDetail() : '';

    // VIP sheets
    renderVipSheets();

    attachListeners();
    attachVipListeners();
    updateStatusBarStyle();
    updateStageHeader();
    renderSidebar();
    updateSideNavActive();
    if (state.app === 'fan') {
        setupHomeScrollMorph();
        setupHeroCarouselScroll();
    } else {
        setupVipGastroScroll();
    }

    body.scrollTop = oldScroll;
}

// ── Sidebar dynamic renderer ─────────────────────────────────────
function renderSidebar() {
    const nav = $('#sideNav');
    const cfg = APP_CONFIG[state.app];
    if (!nav || !cfg) return;

    $('#sideSubtitle').textContent = cfg.subtitle;

    // Update app switcher buttons
    $$('#appSwitcher .app-switch-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.app === state.app);
    });

    // Build nav sections
    nav.innerHTML = cfg.tabs.map(tab => `
        <div class="nav-section" data-tab="${tab.key}">
            <button class="nav-tab" data-tab="${tab.key}">
                <span class="nav-tab-icon">${tab.icon}</span>
                <span>${tab.label}</span>
            </button>
            <div class="nav-subitems">
                ${tab.subs.map(s => `
                    <button class="nav-sub ${s.dividerTop ? 'divider-top' : ''}" data-tab="${tab.key}" data-sub="${s.key}">${s.label}</button>
                `).join('')}
            </div>
        </div>
    `).join('');

    // Re-attach listeners
    $$('#sideNav .nav-tab').forEach(btn => btn.addEventListener('click', () => {
        handleSideNavTab(btn.dataset.tab);
    }));
    $$('#sideNav .nav-sub').forEach(btn => btn.addEventListener('click', () => {
        handleSideNavSub(btn.dataset.tab, btn.dataset.sub);
    }));
}

// ── Home scroll morph (expanded ↔ collapsed top row) ────────────
function setupHomeScrollMorph() {
    if (state.tab !== 'hoy') return;
    const scroller = $('#screenBody');
    const matchArea = $('.home-match-area');
    const dots = $('#homeDotsFade');
    const collapsed = $('#homeCollapsedFade');
    const fixed = $('#homeTopRowFixed');
    if (!scroller || !matchArea || !dots || !collapsed || !fixed) return;

    const matchHeight = matchArea.offsetHeight || 210;

    const onScroll = () => {
        const y = scroller.scrollTop;
        // 0 = fully expanded, 1 = fully collapsed
        const p = Math.max(0, Math.min(1, y / matchHeight));

        // Dots fade out in first half
        const dotsOp = Math.max(0, 1 - p / 0.55);
        dots.style.opacity = dotsOp;
        dots.style.pointerEvents = dotsOp > 0.1 ? 'auto' : 'none';

        // Crests+date fade in in second half
        const colOp = Math.max(0, Math.min(1, (p - 0.45) / 0.55));
        collapsed.style.opacity = colOp;
        collapsed.style.pointerEvents = colOp > 0.1 ? 'auto' : 'none';

        // Label "Tu área" / "Radio" fade out as we collapse
        fixed.querySelectorAll('.home-top-btn-label-fade').forEach(el => {
            el.style.opacity = Math.max(0, 1 - p / 0.55);
            el.style.height = (14 * Math.max(0, 1 - p / 0.55)) + 'px';
        });
    };
    onScroll();
    scroller.addEventListener('scroll', onScroll, { passive: true });
}

// ── Side nav active state ────────────────────────────────────────
function updateSideNavActive() {
    const currentTab = state.app === 'vip' ? state.vipTab : state.tab;

    $$('.nav-tab').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tab === currentTab);
    });
    $$('.nav-section').forEach(sec => {
        sec.classList.toggle('expanded', sec.dataset.tab === currentTab);
    });
    $$('.nav-sub').forEach(btn => {
        const { tab, sub } = btn.dataset;
        let active = false;
        if (tab !== currentTab) {
            active = false;
        } else if (state.app === 'fan') {
            if (tab === 'hoy') {
                active = state.sub === sub;
            } else if (tab === 'noticias') {
                active = (sub === 'lista' && state.newsId === null) || (sub === 'detalle' && state.newsId !== null);
            } else if (tab === 'calendario') {
                const map = { calendario: 0, clasificacion: 1, plantilla: 2 };
                active = state.calendarSegment === map[sub];
            } else {
                active = true;
            }
        } else {
            // VIP
            if (tab === 'inicio') {
                active = (sub === 'restaurante' && state.vipRestaurantId) || (sub === 'home' && !state.vipRestaurantId);
            } else if (tab === 'eventos') {
                active = state.vipEventScreen === sub;
            } else if (tab === 'gestor') {
                active = true;
            } else if (tab === 'perfil') {
                active = state.vipPerfilSub === sub;
            }
        }
        btn.classList.toggle('active', active);
    });
}

function updateStageHeader() {
    const subtitle = $('#stageSubtitle');
    if (!subtitle) return;

    if (state.app === 'vip') {
        const labels = {
            inicio: state.vipRestaurantId ? 'Inicio · Detalle restaurante' : 'Inicio',
            eventos: state.vipEventScreen === 'tickets' ? 'Mis eventos · Entradas'
                   : state.vipEventScreen === 'detail' ? 'Mis eventos · Detalle'
                   : 'Mis eventos',
            gestor: 'Gestor',
            perfil: 'Perfil'
        };
        subtitle.textContent = 'VIP · ' + (labels[state.vipTab] || '');
        return;
    }

    const labels = {
        hoy: {
            directo: 'Hoy · Directo',
            resumen: 'Hoy · Resumen',
            estadisticas: 'Hoy · Estadísticas',
            jornada: 'Hoy · Jornada',
            menu: 'Hoy · Side Menu'
        }[state.sub] || 'Hoy',
        noticias:   state.newsId ? 'Noticias · Detalle' : 'Noticias · Lista',
        calendario: ['Calendario', 'Clasificación', 'Plantilla'][state.calendarSegment],
        rmtv:       `RMTV · ${TV_DAYS[state.rmtvDay].label}`,
        tienda:     'Tienda'
    };
    subtitle.textContent = labels[state.tab] || '';
}

// ── Event wiring ─────────────────────────────────────────────────
function attachListeners() {
    // Bottom tab bar
    $$('.tab-bar-item').forEach(btn => btn.addEventListener('click', () => {
        state.tab = btn.dataset.tab;
        if (state.tab === 'hoy') state.sub = 'directo';
        if (state.tab === 'noticias') state.newsId = null;
        render();
    }));

    // Match carousel dots + arrows
    $$('.home-dot').forEach(d => d.addEventListener('click', () => {
        state.matchIndex = parseInt(d.dataset.match);
        state.statsTab = 0;
        render();
    }));

    const prev = $('[data-carousel-prev]');
    const next = $('[data-carousel-next]');
    if (prev) prev.addEventListener('click', () => {
        state.matchIndex = (state.matchIndex - 1 + HEADER_MATCHES.length) % HEADER_MATCHES.length;
        state.statsTab = 0;
        render();
    });
    if (next) next.addEventListener('click', () => {
        state.matchIndex = (state.matchIndex + 1) % HEADER_MATCHES.length;
        state.statsTab = 0;
        render();
    });

    // Home sub-tabs
    $$('.home-segment-item').forEach(b => b.addEventListener('click', () => {
        state.sub = b.dataset.sub;
        render();
    }));

    // Directo hero carousel — centered paging
    const goHero = (idx) => {
        const scroll = $('#heroScroll');
        if (!scroll) return;
        const slide = scroll.querySelector(`[data-hero-slide="${idx}"]`);
        if (!slide) return;
        const offset = slide.offsetLeft - (scroll.clientWidth - slide.offsetWidth) / 2;
        scroll.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
        state.heroIndex = idx;
        $$('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    };
    $$('.hero-dot').forEach(d => d.addEventListener('click', () => goHero(parseInt(d.dataset.hero))));
    const hPrev = $('[data-hero-prev]');
    const hNext = $('[data-hero-next]');
    if (hPrev) hPrev.addEventListener('click', () => goHero(Math.max(0, state.heroIndex - 1)));
    if (hNext) hNext.addEventListener('click', () => goHero(Math.min(HERO_ITEMS.length - 1, state.heroIndex + 1)));

    const goStore = $('[data-go-store]');
    if (goStore) goStore.addEventListener('click', () => { state.tab = 'tienda'; render(); });

    // Stats tabs
    $$('[data-stats-tab]').forEach(b => b.addEventListener('click', () => {
        state.statsTab = parseInt(b.dataset.statsTab);
        render();
    }));

    // News clicks
    $$('[data-news-id]').forEach(row => row.addEventListener('click', () => {
        state.newsId = parseInt(row.dataset.newsId);
        render();
    }));
    $$('[data-news-close]').forEach(b => b.addEventListener('click', () => {
        state.newsId = null;
        render();
    }));

    // Calendar
    $$('[data-cal-seg]').forEach(b => b.addEventListener('click', () => {
        state.calendarSegment = parseInt(b.dataset.calSeg);
        render();
    }));
    $$('[data-month]').forEach(b => b.addEventListener('click', () => {
        state.calendarMonth = b.dataset.month;
        render();
    }));
    $$('[data-day]').forEach(b => b.addEventListener('click', () => {
        const d = parseInt(b.dataset.day);
        if (d > 0) {
            state.calendarDay = d;
            render();
        }
    }));

    // RMTV days
    $$('[data-rmtv-day]').forEach(b => b.addEventListener('click', () => {
        state.rmtvDay = parseInt(b.dataset.rmtvDay);
        render();
    }));

    // Side menu
    const sideMenuBtn = $('#btnSideMenu');
    if (sideMenuBtn) sideMenuBtn.addEventListener('click', () => {
        state.sideMenuOpen = true;
        $('#sideMenuOverlay').classList.add('visible');
    });
    const close = $('#sideMenuClose');
    const dim   = $('#sideMenuDim');
    const closeMenu = () => {
        state.sideMenuOpen = false;
        const ov = $('#sideMenuOverlay');
        if (ov) ov.classList.remove('visible');
    };
    if (close) close.addEventListener('click', closeMenu);
    if (dim)   dim.addEventListener('click', closeMenu);
}

// ── Side panel navigation handlers ──────────────────────────────
function attachAppSwitcher() {
    $$('#appSwitcher .app-switch-btn').forEach(btn => btn.addEventListener('click', () => {
        state.app = btn.dataset.app;
        // Reset sheets
        state.newsId = null;
        state.vipRestaurantId = null;
        state.vipPerfilOpen = false;
        state.vipEventScreen = 'list';
        state.vipEventId = null;
        render();
    }));
}

function handleSideNavTab(tab) {
    if (state.app === 'fan') {
        state.tab = tab;
        if (tab === 'hoy') state.sub = 'directo';
        if (tab === 'noticias') state.newsId = null;
        if (tab === 'calendario') state.calendarSegment = 0;
    } else {
        state.vipTab = tab;
        if (tab === 'perfil') state.vipPerfilOpen = true;
        else state.vipPerfilOpen = false;
        if (tab === 'eventos') state.vipEventScreen = 'list';
    }
    render();
}

function handleSideNavSub(tab, sub) {
    if (state.app === 'fan') {
        state.tab = tab;
        if (tab === 'hoy') {
            state.sub = sub;
            if (sub === 'menu') {
                state.sideMenuOpen = true;
                render();
                $('#sideMenuOverlay')?.classList.add('visible');
                return;
            }
        } else if (tab === 'noticias') {
            state.newsId = sub === 'detalle' ? NEWS_ITEMS[0].id : null;
        } else if (tab === 'calendario') {
            const map = { calendario: 0, clasificacion: 1, plantilla: 2 };
            state.calendarSegment = map[sub] ?? 0;
        } else if (tab === 'tienda' && sub === 'categorias') {
            render();
            const body = $('#screenBody');
            setTimeout(() => {
                const cats = body.querySelector('.store-categories');
                if (cats) cats.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 60);
            return;
        }
    } else {
        // VIP
        state.vipTab = tab;
        state.vipPerfilOpen = (tab === 'perfil');
        if (tab === 'inicio') {
            state.vipRestaurantId = sub === 'restaurante' ? VIP_RESTAURANTS[0].id : null;
        } else if (tab === 'eventos') {
            const map = { list: 'list', detail: 'detail', tickets: 'tickets' };
            state.vipEventScreen = map[sub] || 'list';
            if (state.vipEventScreen !== 'list') state.vipEventId = VIP_EVENTS[0].id;
        } else if (tab === 'perfil') {
            state.vipPerfilSub = sub;
        }
    }
    render();
}

// ── Touch simulation (cursor + drag-to-scroll, no mouse wheel) ───
function setupTouchSimulation() {
    const phoneScreen = $('#phoneScreen');
    if (!phoneScreen) return;

    // 1) Block mouse wheel entirely inside the phone
    phoneScreen.addEventListener('wheel', e => {
        e.preventDefault();
        e.stopPropagation();
    }, { passive: false });

    // 2) Custom circular cursor follows mouse
    const cursor = document.createElement('div');
    cursor.className = 'touch-cursor';
    phoneScreen.appendChild(cursor);

    const positionCursor = (clientX, clientY) => {
        const rect = phoneScreen.getBoundingClientRect();
        cursor.style.left = (clientX - rect.left) + 'px';
        cursor.style.top  = (clientY - rect.top)  + 'px';
    };

    phoneScreen.addEventListener('mouseenter', () => cursor.classList.add('visible'));
    phoneScreen.addEventListener('mouseleave', () => cursor.classList.remove('visible'));
    phoneScreen.addEventListener('mousemove',  e => positionCursor(e.clientX, e.clientY));

    // 3) Drag-to-scroll — gesture direction decides which scroller (h or v)
    let dragState = null;
    const DRAG_THRESHOLD = 5;

    function findHorizontalScroller(origin) {
        let el = origin;
        while (el && el !== phoneScreen) {
            const cs = getComputedStyle(el);
            if ((cs.overflowX === 'auto' || cs.overflowX === 'scroll') && el.scrollWidth > el.clientWidth + 1) {
                return el;
            }
            el = el.parentElement;
        }
        return null;
    }

    phoneScreen.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        const vScroller = $('#screenBody');
        const hScroller = findHorizontalScroller(e.target);
        if (!vScroller && !hScroller) return;

        dragState = {
            hScroller, vScroller,
            startX: e.clientX,
            startY: e.clientY,
            startHLeft: hScroller ? hScroller.scrollLeft : 0,
            startVTop:  vScroller ? vScroller.scrollTop  : 0,
            axis: null,
            moved: false,
            lastX: e.clientX, lastY: e.clientY,
            lastTime: performance.now(),
            velocity: 0
        };
        cursor.classList.add('pressing');
    });

    const onMove = (e) => {
        if (!dragState) return;
        const dx = e.clientX - dragState.startX;
        const dy = e.clientY - dragState.startY;

        if (!dragState.moved && (Math.abs(dx) > DRAG_THRESHOLD || Math.abs(dy) > DRAG_THRESHOLD)) {
            dragState.moved = true;
            // Decide axis from gesture direction; prefer horiz scroller only if horiz-dominant
            const horizDominant = Math.abs(dx) > Math.abs(dy);
            if (horizDominant && dragState.hScroller) dragState.axis = 'x';
            else if (dragState.vScroller)             dragState.axis = 'y';
            else                                      dragState.axis = horizDominant ? 'x' : 'y';
        }

        if (dragState.moved) {
            e.preventDefault();
            if (dragState.axis === 'x' && dragState.hScroller) {
                dragState.hScroller.scrollLeft = dragState.startHLeft - dx;
            } else if (dragState.axis === 'y' && dragState.vScroller) {
                dragState.vScroller.scrollTop = dragState.startVTop - dy;
            }
            // Track velocity for flick / inertia
            const now = performance.now();
            const dt = Math.max(1, now - dragState.lastTime);
            if (dragState.axis === 'x') {
                dragState.velocity = (dragState.lastX - e.clientX) / dt;
            } else {
                dragState.velocity = (dragState.lastY - e.clientY) / dt;
            }
            dragState.lastX = e.clientX;
            dragState.lastY = e.clientY;
            dragState.lastTime = now;
        }

        positionCursor(e.clientX, e.clientY);
    };

    const onUp = (e) => {
        if (!dragState) return;
        const wasDrag = dragState.moved;
        const st = dragState;
        dragState = null;
        cursor.classList.remove('pressing');
        if (!wasDrag) return;

        // Suppress the click that will follow mouseup (we were dragging, not clicking)
        const suppressClick = ev => { ev.preventDefault(); ev.stopPropagation(); };
        window.addEventListener('click', suppressClick, { once: true, capture: true });

        // Dispatch to the right release handler
        if (st.axis === 'x' && st.hScroller) {
            if (st.hScroller.id === 'heroScroll') {
                // SwiftUI .tabViewStyle(.page) — commit to next/prev based on drag + velocity
                const dx = e.clientX - st.startX;
                pagingSnap(st.hScroller, st.startHLeft, dx, st.velocity);
            } else {
                applyInertia(st.hScroller, 'x', st.velocity);
            }
        } else if (st.axis === 'y' && st.vScroller) {
            applyInertia(st.vScroller, 'y', st.velocity);
        }
    };

    function applyInertia(el, axis, vPxPerMs) {
        let v = vPxPerMs * 16;  // ≈ px per 60fps frame
        if (Math.abs(v) < 0.5) return;
        const decay = 0.94;
        const step = () => {
            if (axis === 'x') el.scrollLeft += v;
            else              el.scrollTop  += v;
            v *= decay;
            if (Math.abs(v) > 0.3) requestAnimationFrame(step);
        };
        requestAnimationFrame(step);
    }

    function pagingSnap(el, startLeft, dx, vPxPerMs) {
        const firstSlide = el.firstElementChild;
        if (!firstSlide) return;
        const style = getComputedStyle(el);
        const gap = parseFloat(style.columnGap || style.gap || '0') || 10;
        const slideStride = firstSlide.offsetWidth + gap;

        const startPage = Math.round(startLeft / slideStride);
        const flickVelocity = 0.3;
        const minFlickDist  = slideStride * 0.22;

        let targetPage = startPage;
        if (dx < -minFlickDist || vPxPerMs >  flickVelocity) targetPage = startPage + 1;
        else if (dx >  minFlickDist || vPxPerMs < -flickVelocity) targetPage = startPage - 1;
        targetPage = Math.max(0, Math.min(HERO_ITEMS.length - 1, targetPage));

        goToHeroPage(targetPage);
    }

    function goToHeroPage(idx) {
        const el = $('#heroScroll');
        if (!el) return;
        const slide = el.querySelector(`[data-hero-slide="${idx}"]`);
        if (!slide) return;
        // Center the slide in its container
        const offset = slide.offsetLeft - (el.clientWidth - slide.offsetWidth) / 2;
        el.scrollTo({ left: Math.max(0, offset), behavior: 'smooth' });
        state.heroIndex = idx;
        $$('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    }

    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup',   onUp);
}

// ================================================================
// AUTH UI — login / forgot / reset / setup password
// ================================================================

// Screen state for the overlay. null = closed (authenticated).
// 'login' | 'forgot' | 'forgot-sent' | 'reset' | 'setup' | 'invite-link'
let authScreen = null;
let authCtx = {};       // { token, email, link, error, message }

function openAuthOverlay(screen, ctx = {}) {
    authScreen = screen;
    authCtx = ctx;
    renderAuthOverlay();
}

function closeAuthOverlay() {
    authScreen = null;
    authCtx = {};
    const ov = $('#authOverlay');
    if (ov) { ov.hidden = true; ov.innerHTML = ''; }
}

function renderAuthOverlay() {
    const ov = $('#authOverlay');
    if (!ov) return;
    ov.hidden = false;

    const logo = `
        <div class="auth-logo">
            <div class="auth-logo-mark">
                <svg viewBox="0 0 24 24" width="26" height="26" fill="currentColor"><path d="M12 2 L14 7 L19 7 L15 11 L17 17 L12 13 L7 17 L9 11 L5 7 L10 7 Z"/></svg>
            </div>
            <div>
                <div class="auth-brand">Real Madrid</div>
                <div class="auth-brand-sub">Web Mockup Console</div>
            </div>
        </div>
    `;

    let body = '';
    if (authScreen === 'login')        body = renderLoginScreen();
    else if (authScreen === 'forgot')        body = renderForgotScreen();
    else if (authScreen === 'forgot-sent')   body = renderForgotSentScreen();
    else if (authScreen === 'reset')         body = renderResetScreen();
    else if (authScreen === 'setup')         body = renderSetupScreen();
    else if (authScreen === 'invite-link')   body = renderInviteLinkScreen();

    ov.innerHTML = `
        <div class="auth-shell">
            <div class="auth-bg"></div>
            <div class="auth-card">
                ${logo}
                ${body}
            </div>
            <div class="auth-foot">Acceso controlado · auth por Supabase</div>
        </div>
    `;

    attachAuthListeners();
}

function renderLoginScreen() {
    const err = authCtx.error ? `<div class="auth-error">${authCtx.error}</div>` : '';
    const msg = authCtx.message ? `<div class="auth-ok">${authCtx.message}</div>` : '';
    return `
        <h1 class="auth-title">Iniciar sesión</h1>
        <p class="auth-subtitle">Accede al panel de mockups de la app</p>
        ${err}${msg}
        <form class="auth-form" data-auth-form="login">
            <label class="auth-field">
                <span>Email</span>
                <input type="email" name="email" placeholder="tu@email.com" value="${authCtx.email || ''}" required autofocus>
            </label>
            <label class="auth-field">
                <span>Contraseña</span>
                <input type="password" name="password" placeholder="••••••••" required>
            </label>
            <button type="submit" class="auth-primary-btn">Entrar</button>
            <button type="button" class="auth-link-btn" data-auth-go="forgot">¿Has olvidado tu contraseña?</button>
        </form>
    `;
}

function renderForgotScreen() {
    const err = authCtx.error ? `<div class="auth-error">${authCtx.error}</div>` : '';
    return `
        <h1 class="auth-title">Recuperar contraseña</h1>
        <p class="auth-subtitle">Introduce tu email y te enviaremos un enlace para establecer una nueva contraseña.</p>
        ${err}
        <form class="auth-form" data-auth-form="forgot">
            <label class="auth-field">
                <span>Email</span>
                <input type="email" name="email" placeholder="tu@email.com" required autofocus>
            </label>
            <button type="submit" class="auth-primary-btn">Enviar enlace</button>
            <button type="button" class="auth-link-btn" data-auth-go="login">← Volver al login</button>
        </form>
    `;
}

function renderForgotSentScreen() {
    return `
        <h1 class="auth-title">Email enviado</h1>
        <p class="auth-subtitle">
            Si el email está dado de alta, recibirás un enlace en unos segundos para restablecer tu contraseña.
            Revisa tu bandeja de entrada (y la carpeta de spam, por si acaso).
        </p>
        <button type="button" class="auth-primary-btn" data-auth-go="login">Volver al login</button>
    `;
}

function renderResetScreen() {
    const err = authCtx.error ? `<div class="auth-error">${authCtx.error}</div>` : '';
    return `
        <h1 class="auth-title">Nueva contraseña</h1>
        <p class="auth-subtitle">Elige una contraseña nueva para tu cuenta.</p>
        ${err}
        <form class="auth-form" data-auth-form="reset">
            <label class="auth-field">
                <span>Nueva contraseña</span>
                <input type="password" name="password" placeholder="mínimo 6 caracteres" required autofocus>
            </label>
            <label class="auth-field">
                <span>Repite la contraseña</span>
                <input type="password" name="password2" required>
            </label>
            <button type="submit" class="auth-primary-btn">Guardar y entrar</button>
        </form>
    `;
}

function renderSetupScreen() {
    const err = authCtx.error ? `<div class="auth-error">${authCtx.error}</div>` : '';
    return `
        <h1 class="auth-title">Configura tu cuenta</h1>
        <p class="auth-subtitle">Has sido invitado a acceder al panel. Elige una contraseña para continuar.</p>
        ${err}
        <form class="auth-form" data-auth-form="setup">
            <label class="auth-field">
                <span>Nombre</span>
                <input type="text" name="name" placeholder="Tu nombre" value="${authCtx.name || ''}">
            </label>
            <label class="auth-field">
                <span>Contraseña</span>
                <input type="password" name="password" placeholder="mínimo 6 caracteres" required>
            </label>
            <label class="auth-field">
                <span>Repite la contraseña</span>
                <input type="password" name="password2" required>
            </label>
            <button type="submit" class="auth-primary-btn">Crear cuenta</button>
        </form>
    `;
}

function renderInviteLinkScreen() {
    return `
        <h1 class="auth-title">Invitación enviada</h1>
        <p class="auth-subtitle">
            Hemos enviado un email a <strong>${authCtx.email || 'el usuario'}</strong> con un enlace
            para que configure su cuenta.
        </p>
        <button type="button" class="auth-primary-btn" data-auth-close>Hecho</button>
    `;
}

function attachAuthListeners() {
    $$('[data-auth-go]').forEach(btn => btn.addEventListener('click', () => {
        openAuthOverlay(btn.dataset.authGo, { email: authCtx.email });
    }));

    $$('[data-auth-close]').forEach(btn => btn.addEventListener('click', async () => {
        closeAuthOverlay();
        await bootApp();
    }));

    const form = $('[data-auth-form]');
    if (!form) return;
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(form);
        const kind = form.dataset.authForm;

        // Disable submit during request
        const submitBtn = form.querySelector('button[type="submit"]');
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Un momento…'; }

        if (kind === 'login') {
            const r = await Auth.login(fd.get('email'), fd.get('password'));
            if (!r.ok) return openAuthOverlay('login', { error: r.error, email: fd.get('email') });
            closeAuthOverlay();
            await bootApp();
            return;
        }

        if (kind === 'forgot') {
            await Auth.requestPasswordReset(fd.get('email'));
            openAuthOverlay('forgot-sent');
            return;
        }

        if (kind === 'reset') {
            const p = fd.get('password');
            const p2 = fd.get('password2');
            if (p !== p2) return openAuthOverlay('reset', { error: 'Las contraseñas no coinciden' });
            const r = await Auth.completeReset(p);
            if (!r.ok) return openAuthOverlay('reset', { error: r.error });
            // After completing reset, log out so they sign in fresh
            await Auth.logout();
            openAuthOverlay('login', { message: 'Contraseña actualizada. Inicia sesión.' });
            return;
        }

        if (kind === 'setup') {
            const p = fd.get('password');
            const p2 = fd.get('password2');
            if (p !== p2) return openAuthOverlay('setup', { error: 'Las contraseñas no coinciden', name: fd.get('name') });
            const r = await Auth.completeSetup(p, fd.get('name'));
            if (!r.ok) return openAuthOverlay('setup', { error: r.error, name: fd.get('name') });
            closeAuthOverlay();
            await bootApp();
            return;
        }
    });
}

// ================================================================
// USER / SETTINGS (bottom of left sidebar)
// ================================================================

function renderUserBox() {
    const session = Auth.current();
    const box = $('#sideUser');
    if (!box) return;
    if (!session) { box.innerHTML = ''; return; }

    const initials = (session.name || session.email).split(/[\s@.]+/).map(s => s[0]).filter(Boolean).slice(0, 2).join('').toUpperCase();
    const isAdmin = session.role === 'admin';

    box.innerHTML = `
        <button class="side-user-row" id="sideUserRow">
            <div class="side-user-avatar">${initials}</div>
            <div class="side-user-info">
                <div class="side-user-name">${session.name || session.email}</div>
                <div class="side-user-role">${isAdmin ? 'Admin' : 'Viewer'}</div>
            </div>
            <svg class="side-user-chev" viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6,9 12,15 18,9"/></svg>
        </button>
    `;

    $('#sideUserRow').addEventListener('click', () => {
        if (isSettingsOpen()) closeSettings();
        else openSettings();
    });
}

function isSettingsOpen() {
    return !$('#settingsDrawer').hidden;
}

async function openSettings() {
    const dr = $('#settingsDrawer');
    dr.hidden = false;
    await renderSettings();
}

function closeSettings() {
    const dr = $('#settingsDrawer');
    dr.hidden = true;
    dr.innerHTML = '';
}

async function renderSettings() {
    const dr = $('#settingsDrawer');
    if (!dr || dr.hidden) return;
    const session = Auth.current();
    if (!session) { closeSettings(); return; }

    const isAdmin = session.role === 'admin';

    // Show skeleton while we load
    dr.innerHTML = `
        <div class="settings-header">
            <h2>Ajustes</h2>
            <button class="settings-close" id="settingsCloseBtn">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
            </button>
        </div>
        <div class="settings-section-title">Tu cuenta</div>
        <div class="settings-self">
            <div class="settings-self-avatar">${(session.name || session.email).slice(0,2).toUpperCase()}</div>
            <div>
                <div class="settings-self-name">${session.name || session.email}</div>
                <div class="settings-self-email">${session.email}</div>
                <div class="settings-self-role ${isAdmin ? 'admin' : 'viewer'}">${isAdmin ? 'Admin' : 'Viewer'}</div>
            </div>
        </div>
        <button class="settings-logout" id="settingsLogoutBtn">Cerrar sesión</button>
        <div class="settings-loading">Cargando usuarios…</div>
    `;

    $('#settingsCloseBtn').addEventListener('click', closeSettings);
    $('#settingsLogoutBtn').addEventListener('click', async () => {
        await Auth.logout();
        closeSettings();
        await bootApp();
    });

    if (!isAdmin) {
        $('.settings-loading').outerHTML = `
            <div class="settings-section-title">Tu rol</div>
            <div class="settings-viewer-info">
                Eres <strong>Viewer</strong>. Solo los administradores pueden gestionar usuarios.
            </div>
        `;
        return;
    }

    const users = await Auth.listUsers();
    const usersBlock = `
        <div class="settings-section-title">Usuarios</div>
        <div class="settings-add-user">
            <form id="addUserForm" class="settings-add-form">
                <input type="email" name="email" placeholder="email@dominio.com" required>
                <select name="role">
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                </select>
                <button type="submit">Invitar</button>
            </form>
        </div>
        <div class="settings-users">
            ${users.map(u => `
                <div class="settings-user-row ${u.id === session.userId ? 'is-self' : ''}">
                    <div class="settings-user-avatar">${(u.name || u.email).slice(0,2).toUpperCase()}</div>
                    <div class="settings-user-meta">
                        <div class="settings-user-email">${u.email}${u.id === session.userId ? ' <span class="settings-user-self">(tú)</span>' : ''}</div>
                        <div class="settings-user-status active">Activo</div>
                    </div>
                    <select class="settings-user-role" data-user-id="${u.id}" ${u.id === session.userId ? 'disabled' : ''}>
                        <option value="viewer" ${u.role === 'viewer' ? 'selected' : ''}>Viewer</option>
                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                    <button class="settings-user-del" data-del-user-id="${u.id}" ${u.id === session.userId ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="4,7 20,7"/><path d="M6 7 v12 a2 2 0 0 0 2 2 h8 a2 2 0 0 0 2-2 V7"/><path d="M9 7 V4 a1 1 0 0 1 1-1 h4 a1 1 0 0 1 1 1 v3"/></svg>
                    </button>
                </div>
            `).join('')}
        </div>
    `;
    $('.settings-loading').outerHTML = usersBlock;

    const form = $('#addUserForm');
    if (form) form.addEventListener('submit', async e => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const fd = new FormData(form);
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando…'; }
        const r = await Auth.inviteUser(fd.get('email'), fd.get('role'));
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Invitar'; }
        if (!r.ok) {
            alert(r.error);
            return;
        }
        const invitedEmail = fd.get('email');
        form.reset();
        await renderSettings();
        openAuthOverlay('invite-link', { email: invitedEmail });
    });

    $$('.settings-user-role').forEach(sel => sel.addEventListener('change', async () => {
        sel.disabled = true;
        const r = await Auth.setRole(sel.dataset.userId, sel.value);
        if (!r.ok) alert(r.error);
        await renderSettings();
    }));

    $$('[data-del-user-id]').forEach(btn => btn.addEventListener('click', async () => {
        if (btn.disabled) return;
        if (!confirm('¿Eliminar este usuario? Ya no podrá acceder a la app.')) return;
        btn.disabled = true;
        const r = await Auth.deleteUser(btn.dataset.delUserId);
        if (!r.ok) alert(r.error);
        await renderSettings();
    }));
}

// ================================================================
// BOOT
// ================================================================

async function bootApp() {
    // Recovery takes priority — user came from a password-reset email link
    if (Auth.isRecovery()) {
        openAuthOverlay('reset');
        document.body.classList.add('auth-mode');
        return;
    }

    const session = Auth.current();

    // Auto-logout if Supabase session exists but profile is missing
    // (admin deleted the user's profile row)
    const supaSession = Auth._rawSession?.();
    // (we don't expose that — simpler: if supabase has a session but Auth.current()
    //  returns null, it means profile was deleted)
    if (!session) {
        openAuthOverlay('login');
        document.body.classList.add('auth-mode');
        return;
    }

    // Logged-in user who hasn't set a password yet (arrived via magic link invite)
    if (Auth.needsPasswordSetup()) {
        openAuthOverlay('setup', { name: session.name });
        document.body.classList.add('auth-mode');
        return;
    }

    document.body.classList.remove('auth-mode');
    render();
    renderUserBox();
}

// ── Boot ─────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', async () => {
    attachAppSwitcher();
    setupTouchSimulation();

    // Show a brief loading state while Supabase initializes
    $('#authOverlay').hidden = false;
    $('#authOverlay').innerHTML = `<div class="auth-shell"><div class="auth-card" style="text-align:center; color:#ffffff80">Cargando…</div></div>`;
    document.body.classList.add('auth-mode');

    await Auth.init();

    // Re-render based on auth state when Supabase fires events (e.g.
    // PASSWORD_RECOVERY or SIGNED_IN from magic link).
    Auth.onAuthChange(() => {
        setTimeout(bootApp, 0);
    });

    await bootApp();
});
