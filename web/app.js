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

    // Hoy v2 state (feature flag)
    playingVideoId: null,
    surveyAnswered: {},          // { [surveyId]: optionKey }

    // Hoy v2 REFINED
    followedTeams: { masc: true, fem: true, basket: true },   // all 3 by default
    highlightsFilter: 'all',                                   // segmented
    openHighlightsAll: false,                                  // full-screen all-highlights
    openMatchSummary: null,                                    // teamId | null

    // Hoy v2 Stories (flag 'fan.hoy.stories')
    openStory: null,            // { storyId, pageIdx } | null
    openBehindScenes: null,     // behind-scenes item id | null

    // Hoy v2 Gamification (flag 'fan.hoy.gamification')
    predictions: {},            // { [matchId]: { home, away, submittedAt, isCorrect } }
    predictionDraft: {},        // { [matchId]: { home, away } } working values
    openRanking: false,

    // Hoy — pestañas por equipo (flag 'fan.hoy.team-tabs')
    // Persistidas en localStorage vía HoyTeamTabs.
    hoyTeamFilter: 'all',                                // 'all' | 'masc' | 'fem' | 'basket'
    hoyTabsVisible: { masc: true, fem: true, basket: true },
    hoyTabsEmoji: false,
    hoyEditorOpen: false,

    // Side menu v2 (flag 'fan.sidemenu.v2')
    sideMenuSearch: '',
    sideMenuDetail: null,         // key de SM2_MOCK_DETAILS | null

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
    vipPerfilSub: 'main',         // 'main' | 'pedidos' | 'autorizados'
    vipPalcoSheetOpen: false,     // toggled by the PALCO 4101 ▾ pill in the top bar

    // Multi-ticket share flow (flag 'vip.tickets.multi-share')
    vipShare: {
        step: null,                 // null | 'permission' | 'picker' | 'preview' | 'disclaimer'
                                    //        | 'sending' | 'sent' | 'row-actions'
                                    //        | 'replace-contact' | 'main-actions'
        // Picker
        selection: [],              // contact ids selected in picker
        query: '',                  // search query
        keepMine: true,             // reserve 1 ticket for the user
        // Preview
        activeIdx: null,            // index of ticket being operated on in preview
        swapMode: false,            // if true, next preview-row tap swaps with activeIdx
        // Replace contact (mini single-select picker from preview)
        // uses `activeIdx` + `query`
        // Main-actions (for already-sent tickets in the main list)
        mainTicketId: null,
        // Send
        progress: 0,
        disclaimerSeen: false
    },

    // Per-tab scroll memory for the VIP app. The scroll container
    // (#screenBody) is shared between tabs — without this, switching
    // tabs would leave the new tab pre-scrolled to the previous tab's
    // position. Matches native iOS "keep me where I was" behaviour.
    vipScrollPositions: { inicio: 0, eventos: 0, gestor: 0, perfil: 0 }
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
    const rmtvIsPlay = Flags.isEnabled('fan.rmtv.play');
    const tabs = [
        { key: 'hoy',        label: 'Hoy',        inactive: 'icons/navbar/today.svg',    active: 'icons/navbar/fill-today.svg' },
        { key: 'noticias',   label: 'Noticias',   inactive: 'icons/ui/file-05.svg',      active: 'icons/ui/file-05.svg' },
        { key: 'calendario', label: 'Calendario', inactive: 'icons/navbar/calendar.svg', active: 'icons/navbar/fill-calendar.svg' },
        // RMTV se muestra como "RM Play" cuando el flag `fan.rmtv.play` está on.
        { key: 'rmtv',       label: rmtvIsPlay ? 'RM Play' : 'RMTV', inactive: 'icons/navbar/rmtv.svg', active: 'icons/navbar/fill-rmtv.svg' },
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

// ================================================================
// HOY v2 — login header (flag 'fan.hoy.login-header')
// ================================================================
// Pequeño módulo para simular estado de sesión (logado / no logado)
// y tier (Socio, Madridista, …, Platinum). El valor se persiste en
// localStorage para que sobreviva a recargas.

const AUTH_MOCK_KEY = 'rm_hoy_auth_mock_v1';
const AUTH_MOCK_TIERS = [
    'Visitante',               // índice 0 = no logado
    'Socio',
    'Madridista',
    'Madridista Junior',
    'Madridista Premium',
    'Madridista Platinum'
];

const HoyLoginHeader = {
    load() {
        try {
            const raw = JSON.parse(localStorage.getItem(AUTH_MOCK_KEY) || '{}');
            return {
                tierIdx: Number.isInteger(raw.tierIdx) ? raw.tierIdx : 0,
                name: raw.name || 'Marcos'
            };
        } catch { return { tierIdx: 0, name: 'Marcos' }; }
    },
    save(next) {
        try { localStorage.setItem(AUTH_MOCK_KEY, JSON.stringify(next)); } catch {}
    },
    hydrate() {
        const s = this.load();
        state.hoyAuthMock = { tierIdx: s.tierIdx, name: s.name };
    },
    persist() { this.save(state.hoyAuthMock); },
    /** 0 = no logado; resto son tiers. */
    isLogged() { return (state.hoyAuthMock?.tierIdx || 0) > 0; },
    tierLabel() {
        const idx = state.hoyAuthMock?.tierIdx || 0;
        return AUTH_MOCK_TIERS[idx] || AUTH_MOCK_TIERS[0];
    },
    cycleNext() {
        const cur = state.hoyAuthMock || { tierIdx: 0, name: 'Marcos' };
        const next = (cur.tierIdx + 1) % AUTH_MOCK_TIERS.length;
        state.hoyAuthMock = { ...cur, tierIdx: next };
        this.persist();
    },
    setLogged(logged) {
        const cur = state.hoyAuthMock || { tierIdx: 0, name: 'Marcos' };
        state.hoyAuthMock = { ...cur, tierIdx: logged ? Math.max(cur.tierIdx, 1) : 0 };
        this.persist();
    },
    setTier(idx) {
        const cur = state.hoyAuthMock || { tierIdx: 0, name: 'Marcos' };
        state.hoyAuthMock = { ...cur, tierIdx: idx };
        this.persist();
    }
};

function hoyLoginGreeting() {
    const h = new Date().getHours();
    if (h < 6)  return 'Buenas noches';
    if (h < 13) return 'Buenos días';
    if (h < 21) return 'Buenas tardes';
    return 'Buenas noches';
}

/**
 * Cabecera global de login/bienvenida (flag `fan.app.login-header`).
 * Persiste en todas las secciones de la Fan App y sustituye al topbar
 * propio de cada tab. A la derecha muestra el nombre de la sección
 * activa para que siempre sepas dónde estás.
 *
 * Click sobre el cluster → cicla por los 6 estados (Visitante → Socio
 * → Madridista → Junior → Premium → Platinum → Visitante …).
 */
function appTabTitle() {
    if (state.app === 'vip') return '';
    switch (state.tab) {
        case 'hoy':        return 'Hoy';
        case 'noticias':   return 'Noticias';
        case 'calendario': return 'Calendario';
        case 'rmtv':       return Flags.isEnabled('fan.rmtv.play') ? 'RM Play' : 'RMTV';
        case 'tienda':     return 'Tienda';
        default:           return '';
    }
}

function renderAppLoginBar() {
    const logged = HoyLoginHeader.isLogged();
    const tier = HoyLoginHeader.tierLabel();
    const name = state.hoyAuthMock?.name || 'Marcos';
    const greeting = hoyLoginGreeting();
    const title = appTabTitle();

    return `
        <div class="app-topbar ${logged ? 'is-logged' : ''}">
            <button class="app-topbar-menu" id="btnSideMenu" aria-label="Abrir menú">
                ${I.line3}
            </button>
            <button class="app-topbar-login"
                    data-login-cycle
                    title="mock · haz clic para cambiar estado">
                ${logged ? `
                    <span class="app-topbar-kicker">Hola,</span>
                    <span class="app-topbar-name">${name}</span>
                    <span class="app-topbar-tier">
                        <span class="app-topbar-tier-dot"></span>${tier}
                    </span>
                ` : `
                    <span class="app-topbar-kicker">${greeting}</span>
                    <span class="app-topbar-cta">
                        Iniciar sesión
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
                    </span>
                `}
            </button>
            <div class="app-topbar-title">${title}</div>
        </div>
    `;
}

// ================================================================
// HOY v2 — feature flag 'fan.hoy.v2-structure'
// Estructura modular: partido compacto + noticias + vídeos + encuesta.
// Todo sobre un scroll vertical.
// ================================================================
function renderHoyV2() {
    // Pestañas por equipo (flag anidado bajo Hoy v2).
    const teamTabsOn = Flags.isEnabled('fan.hoy.team-tabs');
    const editorOn   = Flags.isEnabled('fan.hoy.team-tabs.editor');

    // Fallback: si la pestaña activa se oculta, volvemos a "Todo".
    if (teamTabsOn
        && state.hoyTeamFilter !== 'all'
        && !state.hoyTabsVisible[state.hoyTeamFilter]) {
        state.hoyTeamFilter = 'all';
        HoyTeamTabs.persist();
    }

    // Filtro efectivo (sólo aplica cuando las pestañas están on).
    const filter = teamTabsOn ? state.hoyTeamFilter : 'all';

    // Las predicciones de gamificación sólo están mockeadas para el
    // primer equipo masculino, así que las ocultamos fuera de "Todo" y "Masc".
    const showPrediction = Flags.isEnabled('fan.hoy.gamification')
        && (filter === 'all' || filter === 'masc');

    // Noticias: en "Todo" se muestran todas mezcladas; filtrando por un
    // equipo concreto, se limita a ese equipo (y se mantiene las piezas
    // neutras del club sólo en "Todo").
    const allNews = (typeof NEWS_ITEMS !== 'undefined' ? NEWS_ITEMS : []);
    const filteredNews = filter === 'all'
        ? allNews
        : allNews.filter(n => n.teamId === filter);
    const news = filteredNews.slice(0, 5);

    const surveys = (typeof SURVEY_ITEMS !== 'undefined' ? SURVEY_ITEMS : []);
    const survey = surveys[0];

    return `
        <div class="hoy2-wrap">

            <!-- Top bar propio de Hoy v2. El cluster de login se renderiza
                 en el slot global #appTopbarSlot, común a todas las
                 secciones (flag fan.app.login-header). -->
            <div class="hoy2-topbar">
                <button class="hoy2-top-icon" id="btnSideMenu" aria-label="Tu área">
                    ${I.personCircle}
                </button>
                <div class="hoy2-top-title">Hoy</div>
                <div class="hoy2-top-spacer"></div>
            </div>

            ${teamTabsOn ? renderHoyV2TeamTabsBar(editorOn) : ''}

            <div class="hoy2-scroll">

                <!-- ── Stories carousel (flag 'fan.hoy.stories') ── -->
                ${Flags.isEnabled('fan.hoy.stories') ? renderHoyV2Stories() : ''}

                <!-- ── Próximos partidos ─────────
                     En "Todo" se muestran los 3 equipos; filtrando por uno
                     concreto, sólo el partido de ese equipo. -->
                ${renderHoyV2NextMatches(filter)}

                <!-- ── Gamificación: predicciones (flag) ───────── -->
                ${showPrediction ? renderHoyV2Prediction() : ''}

                <!-- ── Noticias (con etiqueta de equipo en "Todo") ── -->
                <section class="hoy2-section">
                    <div class="hoy2-section-head">
                        <h2 class="hoy2-section-title">Noticias</h2>
                        <button class="hoy2-section-cta" data-go-tab="noticias">
                            Ver todas
                        </button>
                    </div>
                    <div class="hoy2-news-list">
                        ${news.length === 0 ? `
                            <div class="hoy2-news-empty">
                                No hay noticias publicadas de este equipo.
                            </div>
                        ` : news.map(item => `
                            <button class="hoy2-news-row" data-news-id="${item.id}">
                                <div class="hoy2-news-thumb" style="background: ${item.imageColor}">
                                    <svg viewBox="0 0 24 24" fill="currentColor" width="22" height="22"><rect x="3" y="5" width="18" height="14" rx="2"/><circle cx="8.5" cy="10" r="1.5" fill="#fff"/><polygon points="21,17 14,11 3,19 21,19" fill="#fff" opacity="0.85"/></svg>
                                </div>
                                <div class="hoy2-news-body">
                                    <div class="hoy2-news-kicker">
                                        ${filter === 'all'
                                            ? teamTagHTML(item.teamId, item.kind)
                                            : (item.kind ? `<span class="hoy2-news-kind">${item.kind}</span>` : '')}
                                    </div>
                                    <div class="hoy2-news-title">${item.title}</div>
                                    <div class="hoy2-news-sub">${(item.subtitle || '').slice(0, 80)}${(item.subtitle || '').length > 80 ? '…' : ''}</div>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </section>

                <!-- ── Tras las cámaras (flag 'fan.hoy.stories') ── -->
                ${Flags.isEnabled('fan.hoy.stories') && filter === 'all' ? renderHoyV2BehindScenes() : ''}

                <!-- ── Highlights (mixto o filtrado por equipo) ──── -->
                ${renderHoyV2Highlights(filter)}

                <!-- ── Trivia del día (se mantiene siempre) ─────── -->
                <section class="hoy2-section">
                    <div class="hoy2-section-head">
                        <h2 class="hoy2-section-title">Trivia del día</h2>
                    </div>
                    ${renderHoyV2Survey(survey)}
                </section>

                <div style="height: 28px"></div>
            </div>
        </div>

        ${renderSideMenu()}
        ${state.hoyEditorOpen ? renderHoyTabsEditorSheet() : ''}
    `;
}

// Devuelve el HTML de la etiqueta de equipo + tipo de contenido para
// las noticias en la pestaña "Todo". Si la noticia no tiene teamId
// (contenido general del club), sólo se muestra el tipo.
function teamTagHTML(teamId, kind) {
    const meta = teamId && typeof TEAM_TAG_META !== 'undefined' ? TEAM_TAG_META[teamId] : null;
    const kindHTML = kind ? `<span class="hoy2-news-kind">${kind}</span>` : '';
    if (!meta) {
        return `<span class="team-tag team-tag-neutral">Club</span>${kindHTML}`;
    }
    return `
        <span class="team-tag" style="color: ${meta.color}; background: ${meta.bg};">
            <span class="team-tag-dot" style="background: ${meta.color};"></span>
            ${meta.label}
        </span>${kindHTML}
    `;
}

// ── Barra de pestañas por equipo (en Hoy v2) ──────────────────
// Sticky justo debajo del topbar.
function renderHoyV2TeamTabsBar(editorOn) {
    const tabs = HoyTeamTabs.visibleTabKeys();
    const current = state.hoyTeamFilter;

    return `
        <div class="hoy2-team-tabs" id="hoy2TeamTabs">
            <div class="hoy2-team-tabs-scroll">
                ${tabs.map(k => `
                    <button class="hoy2-team-tab ${k === current ? 'active' : ''}" data-team-tab="${k}">
                        <span class="hoy2-team-tab-label">${HoyTeamTabs.labelFor(k)}</span>
                        <span class="hoy2-team-tab-underline"></span>
                    </button>
                `).join('')}
            </div>
            ${editorOn ? `
                <button class="hoy2-team-tabs-edit" id="btnHoyTabsEditor" aria-label="Editar pestañas">
                    ${I.slider}
                </button>
            ` : ''}
        </div>
    `;
}

// ── Próximos partidos (hasta 3, scroll horizontal) ─────────────
//
// Opcionalmente filtra por equipo vía el flag `fan.hoy.team-tabs`.
// · filter='all'      → muestra los 3 equipos seguidos (scroll horizontal).
// · filter='masc'/... → muestra sólo la card de ese equipo (1 bloque).
function renderHoyV2NextMatches(filter = 'all') {
    const teams = (typeof TEAMS !== 'undefined' ? TEAMS : []);
    const nextByTeam = (typeof NEXT_MATCHES_BY_TEAM !== 'undefined' ? NEXT_MATCHES_BY_TEAM : {});
    let followed = teams.filter(t => state.followedTeams[t.id]);
    if (filter !== 'all') {
        followed = followed.filter(t => t.id === filter);
    }
    if (followed.length === 0) return '';
    const singleCard = filter !== 'all';

    return `
        <section class="hoy2-section">
            <div class="hoy2-section-head">
                <h2 class="hoy2-section-title">Próximos partidos</h2>
                <button class="hoy2-section-cta" data-go-tab="calendario">
                    Calendario
                </button>
            </div>
            <div class="hoy2-nm-scroll ${singleCard ? 'single' : ''}">
                ${followed.map(team => {
                    const m = nextByTeam[team.id];
                    if (!m) return '';
                    const homeCrest = bigCrestFor(m.home);
                    const awayCrest = bigCrestFor(m.away);
                    const last = m.lastResult;
                    return `
                        <div class="hoy2-nm-card">
                            <!-- Radio button: top-right, stopPropagation so it doesn't navigate -->
                            <button class="hoy2-nm-radio" data-radio-match="${team.id}" aria-label="Escuchar por radio">
                                ${I.radio}
                                <span class="hoy2-nm-radio-label">Radio</span>
                            </button>

                            <button class="hoy2-nm-body" data-next-match="${team.id}">
                                <div class="hoy2-nm-head">
                                    <span class="hoy2-nm-comp">${m.competition}</span>
                                    ${(() => {
                                        const tag = typeof TEAM_TAG_META !== 'undefined' ? TEAM_TAG_META[team.id] : null;
                                        return tag
                                            ? `<span class="team-tag" style="color: ${tag.color}; background: ${tag.bg};"><span class="team-tag-dot" style="background: ${tag.color};"></span>${tag.label}</span>`
                                            : `<span class="hoy2-nm-sport">${team.sport}</span>`;
                                    })()}
                                </div>
                                <div class="hoy2-nm-teams">
                                    <div class="hoy2-nm-crest">${homeCrest}</div>
                                    <span class="hoy2-nm-vs">vs</span>
                                    <div class="hoy2-nm-crest">${awayCrest}</div>
                                </div>
                                <div class="hoy2-nm-names">
                                    <span class="hoy2-nm-name">${m.home}</span>
                                    <span class="hoy2-nm-name">${m.away}</span>
                                </div>
                                <div class="hoy2-nm-foot">
                                    <span class="hoy2-nm-date">${m.dateString}</span>
                                    <span class="hoy2-nm-venue">${m.venue}</span>
                                </div>
                            </button>

                            <!-- Inline last-result row: "Último: RM 1-1 Girona · Ver resumen →" -->
                            ${last ? `
                                <div class="hoy2-nm-last">
                                    <div class="hoy2-nm-last-info">
                                        <span class="hoy2-nm-last-kicker">Último</span>
                                        <span class="hoy2-nm-last-result ${last.result}">${last.score}</span>
                                        <span class="hoy2-nm-last-rival">${last.rival}</span>
                                    </div>
                                    <button class="hoy2-nm-last-cta" data-summary-open="${last.summaryTeamId}">
                                        Ver resumen ${I.chevronRight}
                                    </button>
                                </div>
                            ` : ''}
                        </div>
                    `;
                }).join('')}
            </div>
        </section>
    `;
}

// ── Último partido (resúmenes por equipo seguido) ─────────────
function renderHoyV2LastMatches() {
    const teams = (typeof TEAMS !== 'undefined' ? TEAMS : []);
    const lastByTeam = (typeof LAST_MATCH_BY_TEAM !== 'undefined' ? LAST_MATCH_BY_TEAM : {});
    const followed = teams.filter(t => state.followedTeams[t.id]);
    if (followed.length === 0) return '';

    return `
        <section class="hoy2-section">
            <div class="hoy2-section-head">
                <h2 class="hoy2-section-title">Último partido</h2>
            </div>
            <div class="hoy2-lm-stack">
                ${followed.map(team => {
                    const s = lastByTeam[team.id];
                    if (!s) return '';
                    return `
                        <div class="hoy2-lm-card" data-summary-team="${team.id}">
                            <div class="hoy2-lm-thumb"
                                style="background: linear-gradient(135deg, ${s.thumbColor1}, ${s.thumbColor2})">
                                <span class="hoy2-lm-play">${I.play}</span>
                                <span class="hoy2-lm-dur">${s.duration}</span>
                            </div>
                            <div class="hoy2-lm-body">
                                <div class="hoy2-lm-comp">${s.competition}</div>
                                <div class="hoy2-lm-title">${s.home} ${s.score} ${s.away}</div>
                                <div class="hoy2-lm-date">${s.date} · ${team.sport}</div>
                                <button class="hoy2-lm-cta" data-summary-open="${team.id}">
                                    Ver resumen ${I.chevronRight}
                                </button>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </section>
    `;
}

// ── Highlights (mixto: categorías) ────────────────────────────
//
// Opcionalmente filtrados por equipo vía `fan.hoy.team-tabs`.
function renderHoyV2Highlights(filter = 'all') {
    let highlights = (typeof HIGHLIGHT_ITEMS !== 'undefined' ? HIGHLIGHT_ITEMS : []);
    if (filter !== 'all') {
        highlights = highlights.filter(h => h.teamId === filter);
    }
    if (highlights.length === 0) return '';

    // On the Hoy screen we show ONE item per category as a mixed carousel
    const byCat = {};
    for (const h of highlights) {
        if (!byCat[h.category]) byCat[h.category] = h;
    }
    const mixed = Object.values(byCat);

    return `
        <section class="hoy2-section">
            <div class="hoy2-section-head">
                <h2 class="hoy2-section-title">Highlights</h2>
                <button class="hoy2-section-cta" data-highlights-all>
                    Ver todos
                </button>
            </div>
            <div class="hoy2-video-scroll" id="hoy2VideoScroll">
                ${mixed.map(v => {
                    const tag = (typeof TEAM_TAG_META !== 'undefined' && v.teamId)
                        ? TEAM_TAG_META[v.teamId]
                        : null;
                    // En "Todo" vale la pena mostrar el equipo además de
                    // la categoría; si estamos ya filtrando por equipo, la
                    // etiqueta de equipo es redundante y se omite.
                    const showTeamTag = tag && filter === 'all';
                    return `
                        <button class="hoy2-video-card" data-highlight-id="${v.id}"
                            style="background: linear-gradient(145deg, ${v.color1} 0%, ${v.color2} 100%)">
                            <span class="hoy2-video-cat">${labelForCategory(v.category)}</span>
                            ${showTeamTag ? `
                                <span class="hoy2-video-team" style="background: ${tag.color};">
                                    ${tag.short}
                                </span>
                            ` : ''}
                            <span class="hoy2-video-play">${I.playSolid}</span>
                            <div class="hoy2-video-meta">
                                <div class="hoy2-video-title">${v.title}</div>
                                <div class="hoy2-video-duration">${v.duration}</div>
                            </div>
                        </button>
                    `;
                }).join('')}
            </div>
        </section>
    `;
}

function labelForCategory(id) {
    const cats = (typeof HIGHLIGHT_CATEGORIES !== 'undefined' ? HIGHLIGHT_CATEGORIES : []);
    const c = cats.find(c => c.id === id);
    return c ? c.label.toUpperCase() : (id || '').toUpperCase();
}

// ================================================================
// Hoy v2 — Gamification (flag 'fan.hoy.gamification')
//
// Local-only: predictions and points live in localStorage under
// 'rm_predictions_v1'. The ranking combines RANKING_MOCK players
// with the current user's ("Tú") accumulated points.
// ================================================================

const PREDICTIONS_STORAGE_KEY = 'rm_predictions_v1';

const Gamification = {
    // Scoring rules
    POINTS_EXACT:  3,     // exact score match
    POINTS_WINNER: 1,     // correct winner (not exact)

    load() {
        try {
            const raw = localStorage.getItem(PREDICTIONS_STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch {
            return {};
        }
    },

    save(preds) {
        try { localStorage.setItem(PREDICTIONS_STORAGE_KEY, JSON.stringify(preds)); } catch {}
    },

    hydrate() {
        state.predictions = this.load();
    },

    /**
     * Record a user's prediction for a match and persist. No scoring
     * until the real result comes in — for the mock we expose a helper
     * below to compute current score.
     */
    submit(matchId, home, away) {
        const preds = { ...state.predictions };
        preds[matchId] = {
            matchId,
            home: Number(home),
            away: Number(away),
            submittedAt: Date.now(),
            isCorrect: false,
            points: 0
        };
        state.predictions = preds;
        this.save(preds);
    },

    clear(matchId) {
        const preds = { ...state.predictions };
        delete preds[matchId];
        state.predictions = preds;
        this.save(preds);
    },

    /** Score earned by the user for a prediction vs a real final result. */
    scoreFor(prediction, finalHome, finalAway) {
        if (!prediction) return 0;
        const exact = prediction.home === finalHome && prediction.away === finalAway;
        if (exact) return this.POINTS_EXACT;
        const winner = Math.sign(prediction.home - prediction.away);
        const actualWinner = Math.sign(finalHome - finalAway);
        if (winner === actualWinner) return this.POINTS_WINNER;
        return 0;
    },

    /**
     * Build the leaderboard, including the current user ("Tú") with
     * their accumulated points from finished matches (if any).
     * For the mock, we award a small "participation" bonus per
     * submitted prediction so the list is never empty.
     */
    leaderboard() {
        const base = (typeof RANKING_MOCK !== 'undefined' ? RANKING_MOCK : []).slice();
        const total = Object.values(state.predictions).reduce(
            (sum, p) => sum + (p.points || 0), 0
        );
        const participationBonus = Object.keys(state.predictions).length;
        const userPoints = total + participationBonus;

        const me = {
            id: 'me',
            name: 'Tú',
            points: userPoints,
            avatarColor: '#3E31FA',
            isMe: true
        };
        return [...base, me]
            .sort((a, b) => b.points - a.points)
            .map((u, i) => ({ ...u, position: i + 1 }));
    }
};

// ────────────────────────────────────────────────────────────────
// Hoy v2 — Stories carousel + Tras las cámaras (flag fan.hoy.stories)
// ────────────────────────────────────────────────────────────────

function renderHoyV2Stories() {
    const stories = (typeof STORY_ITEMS !== 'undefined' ? STORY_ITEMS : []);
    if (stories.length === 0) return '';
    return `
        <section class="hoy2-section hoy2-stories-section">
            <div class="hoy2-stories-scroll">
                ${stories.map(s => `
                    <button class="hoy2-story" data-story-id="${s.id}" aria-label="Story ${s.title}">
                        <span class="hoy2-story-ring">
                            <span class="hoy2-story-thumb"
                                style="background: linear-gradient(145deg, ${s.cover.c1} 0%, ${s.cover.c2} 100%)">
                                <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18" style="opacity: 0.6; color: white"><polygon points="8,5 19,12 8,19" /></svg>
                            </span>
                        </span>
                        <span class="hoy2-story-label">${s.title}</span>
                    </button>
                `).join('')}
            </div>
        </section>
    `;
}

function renderHoyV2BehindScenes() {
    const items = (typeof BEHIND_SCENES_ITEMS !== 'undefined' ? BEHIND_SCENES_ITEMS : []);
    if (items.length === 0) return '';
    return `
        <section class="hoy2-section">
            <div class="hoy2-section-head">
                <h2 class="hoy2-section-title">Tras las cámaras</h2>
            </div>
            <div class="hoy2-bs-stack">
                ${items.map(bs => `
                    <button class="hoy2-bs-card" data-bs-id="${bs.id}"
                        style="background: linear-gradient(180deg, ${bs.cardColor1} 0%, ${bs.cardColor2} 100%)">
                        <div class="hoy2-bs-img">
                            <svg viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.2"
                                width="44" height="44" style="opacity: 0.35">
                                <rect x="3" y="5" width="18" height="14" rx="2"/>
                                <circle cx="8.5" cy="10" r="1.5" fill="white"/>
                                <polygon points="21,17 14,11 3,19 21,19" fill="white" opacity="0.4"/>
                            </svg>
                            <span class="hoy2-bs-count">${bs.photos.length} fotos</span>
                        </div>
                        <div class="hoy2-bs-body">
                            <div class="hoy2-bs-title">${bs.title}</div>
                            <div class="hoy2-bs-sub">${bs.subtitle}</div>
                        </div>
                    </button>
                `).join('')}
            </div>
        </section>
    `;
}

// ── Full-screen story viewer ─────────────────────────────────────
function renderHoyV2StorySheet() {
    const slot = $('#newsSheetSlot');
    if (!slot) return;
    const open = state.openStory;
    if (!open) { slot.innerHTML = ''; return; }

    const stories = (typeof STORY_ITEMS !== 'undefined' ? STORY_ITEMS : []);
    const story = stories.find(s => s.id === open.storyId);
    if (!story) { slot.innerHTML = ''; return; }

    const idx = Math.max(0, Math.min(open.pageIdx || 0, story.pages.length - 1));
    const page = story.pages[idx];

    slot.innerHTML = `
        <div class="story-viewer"
            style="background: linear-gradient(150deg, ${page.c1} 0%, ${page.c2} 100%)">

            <!-- Progress bars (one per page) -->
            <div class="story-bars">
                ${story.pages.map((_, i) => `
                    <span class="story-bar ${i < idx ? 'done' : (i === idx ? 'active' : '')}">
                        <span class="story-bar-fill"></span>
                    </span>
                `).join('')}
            </div>

            <!-- Header with story title + close -->
            <div class="story-head">
                <div class="story-avatar"
                    style="background: linear-gradient(145deg, ${story.cover.c1} 0%, ${story.cover.c2} 100%)"></div>
                <div class="story-title">${story.title}</div>
                <button class="story-close" data-story-close aria-label="Cerrar">${I.xmark}</button>
            </div>

            <!-- Tap zones (prev / next) -->
            <button class="story-zone story-zone-prev" data-story-prev aria-label="Anterior"></button>
            <button class="story-zone story-zone-next" data-story-next aria-label="Siguiente"></button>

            <!-- Content -->
            <div class="story-content">
                <div class="story-play-icon">${I.playSolid}</div>
            </div>

            <!-- Footer with page title / subtitle / CTA -->
            <div class="story-foot">
                <div class="story-page-title">${page.title}</div>
                <div class="story-page-sub">${page.subtitle}</div>
                ${page.cta ? `
                    <button class="story-cta" data-story-cta="${page.cta.kind}">
                        ${page.cta.label}
                    </button>
                ` : ''}
            </div>
        </div>
    `;

    $$('[data-story-close]').forEach(b => b.addEventListener('click', () => {
        state.openStory = null;
        slot.innerHTML = '';
    }));
    $$('[data-story-prev]').forEach(b => b.addEventListener('click', e => {
        e.stopPropagation();
        if (idx > 0) {
            state.openStory = { storyId: story.id, pageIdx: idx - 1 };
            renderHoyV2StorySheet();
        } else {
            // Go to previous story if any
            const sIdx = stories.findIndex(s => s.id === story.id);
            if (sIdx > 0) {
                const prev = stories[sIdx - 1];
                state.openStory = { storyId: prev.id, pageIdx: prev.pages.length - 1 };
                renderHoyV2StorySheet();
            }
        }
    }));
    $$('[data-story-next]').forEach(b => b.addEventListener('click', e => {
        e.stopPropagation();
        if (idx < story.pages.length - 1) {
            state.openStory = { storyId: story.id, pageIdx: idx + 1 };
            renderHoyV2StorySheet();
        } else {
            // Next story if any
            const sIdx = stories.findIndex(s => s.id === story.id);
            if (sIdx < stories.length - 1) {
                state.openStory = { storyId: stories[sIdx + 1].id, pageIdx: 0 };
                renderHoyV2StorySheet();
            } else {
                // Was the last page of last story → close
                state.openStory = null;
                slot.innerHTML = '';
            }
        }
    }));
    $$('[data-story-cta]').forEach(b => b.addEventListener('click', e => {
        e.stopPropagation();
        const kind = b.dataset.storyCta;
        showStoryToast(kind === 'survey' ? '¡Gracias por participar!' : 'Contenido próximamente');
    }));
}

function showStoryToast(message) {
    const host = $('#phoneScreen');
    if (!host) return;
    document.getElementById('storyToast')?.remove();
    const t = document.createElement('div');
    t.id = 'storyToast';
    t.className = 'story-toast';
    t.textContent = message;
    host.appendChild(t);
    setTimeout(() => { t.classList.add('leaving'); setTimeout(() => t.remove(), 260); }, 1800);
}

// ────────────────────────────────────────────────────────────────
// Hoy v2 — Prediction block + Ranking (flag 'fan.hoy.gamification')
// ────────────────────────────────────────────────────────────────

function renderHoyV2Prediction() {
    const nextByTeam = (typeof NEXT_MATCHES_BY_TEAM !== 'undefined' ? NEXT_MATCHES_BY_TEAM : {});
    // Predict the main team's next match for simplicity
    const match = nextByTeam.masc;
    if (!match) return '';

    const matchId = 'masc-next';
    const pred = state.predictions[matchId];
    const draft = state.predictionDraft[matchId] || { home: 1, away: 1 };
    const hasSubmitted = !!pred;

    const homeCrest = bigCrestFor(match.home);
    const awayCrest = bigCrestFor(match.away);

    return `
        <section class="hoy2-section">
            <div class="hoy2-section-head">
                <h2 class="hoy2-section-title">Predice el resultado</h2>
                <button class="hoy2-section-cta" data-ranking-open>
                    Mis puntos
                </button>
            </div>

            <div class="hoy2-pred-card">
                <div class="hoy2-pred-kicker">
                    ⚽ ${match.competition} · ${match.dateString}
                </div>

                ${hasSubmitted ? `
                    <!-- Submitted state: show user's prediction + confirmation -->
                    <div class="hoy2-pred-teams locked">
                        <div class="hoy2-pred-team">
                            <div class="hoy2-pred-crest">${homeCrest}</div>
                            <div class="hoy2-pred-team-name">${match.home}</div>
                        </div>
                        <div class="hoy2-pred-score">
                            <span>${pred.home}</span>
                            <span class="hoy2-pred-dash">-</span>
                            <span>${pred.away}</span>
                        </div>
                        <div class="hoy2-pred-team">
                            <div class="hoy2-pred-crest">${awayCrest}</div>
                            <div class="hoy2-pred-team-name">${match.away}</div>
                        </div>
                    </div>
                    <div class="hoy2-pred-ok">
                        ✓ Predicción registrada. Consulta tu ranking después del partido.
                    </div>
                    <div class="hoy2-pred-actions">
                        <button class="hoy2-pred-change" data-pred-change="${matchId}">
                            Cambiar predicción
                        </button>
                        <button class="hoy2-pred-view-ranking" data-ranking-open>
                            Ver ranking →
                        </button>
                    </div>
                ` : `
                    <!-- Interactive state -->
                    <div class="hoy2-pred-teams">
                        <div class="hoy2-pred-team">
                            <div class="hoy2-pred-crest">${homeCrest}</div>
                            <div class="hoy2-pred-team-name">${match.home}</div>
                            <div class="hoy2-pred-stepper">
                                <button class="hoy2-pred-step" data-pred-step="home-" data-pred-match="${matchId}" aria-label="Menos">−</button>
                                <span class="hoy2-pred-value">${draft.home}</span>
                                <button class="hoy2-pred-step" data-pred-step="home+" data-pred-match="${matchId}" aria-label="Más">+</button>
                            </div>
                        </div>

                        <div class="hoy2-pred-vs">vs</div>

                        <div class="hoy2-pred-team">
                            <div class="hoy2-pred-crest">${awayCrest}</div>
                            <div class="hoy2-pred-team-name">${match.away}</div>
                            <div class="hoy2-pred-stepper">
                                <button class="hoy2-pred-step" data-pred-step="away-" data-pred-match="${matchId}" aria-label="Menos">−</button>
                                <span class="hoy2-pred-value">${draft.away}</span>
                                <button class="hoy2-pred-step" data-pred-step="away+" data-pred-match="${matchId}" aria-label="Más">+</button>
                            </div>
                        </div>
                    </div>
                    <button class="hoy2-pred-submit" data-pred-submit="${matchId}">
                        Guardar predicción
                    </button>
                    <div class="hoy2-pred-rules">
                        3 pts si aciertas el resultado exacto · 1 pt si aciertas el ganador
                    </div>
                `}
            </div>
        </section>
    `;
}

// ── Ranking full-screen sheet ─────────────────────────────────
function renderHoyV2RankingSheet() {
    const slot = $('#newsSheetSlot');
    if (!slot) return;
    if (!state.openRanking) { slot.innerHTML = ''; return; }

    const entries = Gamification.leaderboard();
    const me = entries.find(u => u.isMe);

    slot.innerHTML = `
        <div class="news-sheet-backdrop" data-ranking-close></div>
        <div class="news-sheet hoy2-ranking-sheet">
            <div class="hoy2-rk-head">
                <button class="hoy2-rk-back" data-ranking-close aria-label="Cerrar">${I.chevronLeft}</button>
                <div class="hoy2-rk-title">Ranking</div>
                <div style="width: 36px"></div>
            </div>

            <div class="hoy2-rk-hero">
                <div class="hoy2-rk-hero-kicker">Tu posición</div>
                <div class="hoy2-rk-hero-pos">#${me.position}</div>
                <div class="hoy2-rk-hero-points">${me.points} puntos</div>
            </div>

            <div class="hoy2-rk-list">
                ${entries.map(u => `
                    <div class="hoy2-rk-row ${u.isMe ? 'is-me' : ''} ${u.position <= 3 ? 'is-podium' : ''}">
                        <div class="hoy2-rk-pos">
                            ${u.position === 1 ? '🥇'
                              : u.position === 2 ? '🥈'
                              : u.position === 3 ? '🥉'
                              : u.position}
                        </div>
                        <div class="hoy2-rk-avatar" style="background: ${u.avatarColor}">
                            ${u.name.charAt(0).toUpperCase()}
                        </div>
                        <div class="hoy2-rk-name">${u.name}${u.isMe ? ' <span class="hoy2-rk-me">(tú)</span>' : ''}</div>
                        <div class="hoy2-rk-points">${u.points} pts</div>
                    </div>
                `).join('')}
            </div>
        </div>
    `;

    $$('[data-ranking-close]').forEach(b => b.addEventListener('click', () => {
        state.openRanking = false;
        slot.innerHTML = '';
    }));
}

// ── Behind-scenes gallery modal ─────────────────────────────────
function renderHoyV2BehindScenesSheet() {
    const slot = $('#newsSheetSlot');
    if (!slot) return;
    const id = state.openBehindScenes;
    if (!id) { slot.innerHTML = ''; return; }

    const items = (typeof BEHIND_SCENES_ITEMS !== 'undefined' ? BEHIND_SCENES_ITEMS : []);
    const bs = items.find(x => x.id === id);
    if (!bs) { slot.innerHTML = ''; return; }

    slot.innerHTML = `
        <div class="news-sheet-backdrop" data-bs-close></div>
        <div class="news-sheet hoy2-bs-sheet">
            <div class="news-sheet-grabber"></div>
            <div class="news-sheet-scroll">
                <div class="hoy2-bs-detail-head">
                    <button class="hoy2-bs-back" data-bs-close aria-label="Cerrar">${I.chevronLeft}</button>
                    <div>
                        <div class="hoy2-bs-detail-title">${bs.title}</div>
                        <div class="hoy2-bs-detail-sub">${bs.subtitle}</div>
                    </div>
                </div>
                <div class="hoy2-bs-gallery">
                    ${bs.photos.map((p, i) => `
                        <div class="hoy2-bs-photo"
                            style="background: linear-gradient(135deg, ${p.c1} 0%, ${p.c2} 100%)">
                            <div class="hoy2-bs-photo-count">${i + 1}/${bs.photos.length}</div>
                            <div class="hoy2-bs-photo-caption">${p.caption}</div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
    `;

    $$('[data-bs-close]').forEach(b => b.addEventListener('click', () => {
        state.openBehindScenes = null;
        slot.innerHTML = '';
    }));
}

// ── Mock radio mini-player: appears as a toast pinned to the bottom
// of the phone screen above the tab bar. Auto-closes in 5s or via X.
function showRadioToast(teamId) {
    const teams = (typeof TEAMS !== 'undefined' ? TEAMS : []);
    const team = teams.find(t => t.id === teamId);
    const next = (typeof NEXT_MATCHES_BY_TEAM !== 'undefined' ? NEXT_MATCHES_BY_TEAM : {})[teamId];

    // Remove any existing toast first
    document.getElementById('radioToast')?.remove();

    const host = $('#phoneScreen');
    if (!host) return;

    const toast = document.createElement('div');
    toast.id = 'radioToast';
    toast.className = 'radio-toast';
    toast.innerHTML = `
        <div class="radio-toast-anim">
            <span></span><span></span><span></span><span></span>
        </div>
        <div class="radio-toast-body">
            <div class="radio-toast-title">Escuchando por radio</div>
            <div class="radio-toast-sub">${next ? `${next.home} vs ${next.away}` : (team?.sport || '')}</div>
        </div>
        <button class="radio-toast-close" aria-label="Cerrar">
            ${I.xmark}
        </button>
    `;
    host.appendChild(toast);

    toast.querySelector('.radio-toast-close').addEventListener('click', () => toast.remove());

    // Auto-dismiss after 5s
    setTimeout(() => {
        toast.classList.add('leaving');
        setTimeout(() => toast.remove(), 260);
    }, 5000);
}

function renderHoyV2MatchCard(match) {
    const compLabel = match.competition === 'LALIGA EA SPORTS' ? 'LA LIGA' : match.competition;
    const isUpcoming = match.status === 'upcoming';
    const homeCrest = bigCrestFor(match.homeTeam);
    const awayCrest = bigCrestFor(match.awayTeam);
    const venue = (match.matchInfo || '').split('\n').pop() || '';

    const scoreOrDate = isUpcoming
        ? `<div class="hoy2-match-date">${match.dateString.replace(' · ', ' · ')}</div>`
        : `<div class="hoy2-match-score">
             <span>${match.homeScore ?? 0}</span>
             <span class="hoy2-match-dash">-</span>
             <span>${match.awayScore ?? 0}</span>
           </div>`;

    return `
        <button class="hoy2-match" data-hoy2-match>
            <div class="hoy2-match-head">
                <span class="hoy2-match-comp">${compLabel}</span>
                <span class="hoy2-match-cta">
                    Match Centre
                    ${I.chevronRight}
                </span>
            </div>
            <div class="hoy2-match-body">
                <div class="hoy2-match-team">
                    <div class="hoy2-match-crest">${homeCrest}</div>
                    <div class="hoy2-match-team-name">${match.homeTeam}</div>
                </div>
                <div class="hoy2-match-center">
                    ${scoreOrDate}
                    ${isUpcoming ? '<div class="hoy2-match-status">Próximo</div>' : '<div class="hoy2-match-status">Finalizado</div>'}
                </div>
                <div class="hoy2-match-team">
                    <div class="hoy2-match-crest">${awayCrest}</div>
                    <div class="hoy2-match-team-name">${match.awayTeam}</div>
                </div>
            </div>
            <div class="hoy2-match-foot">${venue}</div>
        </button>
    `;
}

function renderHoyV2Survey(survey) {
    if (!survey) return '';
    const answered = state.surveyAnswered || {};
    const chosen = answered[survey.id];      // key of chosen option, or undefined
    const hasVoted = !!chosen;
    const totalVotes = survey.options.reduce((n, o) => n + o.votes, 0) + (hasVoted ? 1 : 0);

    return `
        <div class="hoy2-survey">
            <div class="hoy2-survey-kicker">
                ${survey.kind === 'trivia' ? '🎯 Trivia' : '📊 Encuesta'}
            </div>
            <div class="hoy2-survey-q">${survey.question}</div>
            <div class="hoy2-survey-opts">
                ${survey.options.map(opt => {
                    const chosenHere = chosen === opt.key;
                    const votesNow = opt.votes + (chosenHere ? 1 : 0);
                    const pct = hasVoted ? Math.round((votesNow / totalVotes) * 100) : 0;
                    let stateCls = '';
                    if (hasVoted) {
                        if (survey.kind === 'trivia') {
                            if (opt.correct) stateCls = 'correct';
                            else if (chosenHere && !opt.correct) stateCls = 'wrong';
                        } else if (chosenHere) {
                            stateCls = 'chosen';
                        }
                    }
                    return `
                        <button class="hoy2-survey-opt ${stateCls}" data-survey-id="${survey.id}" data-survey-opt="${opt.key}" ${hasVoted ? 'disabled' : ''}>
                            ${hasVoted ? `<span class="hoy2-survey-bar" style="width: ${pct}%"></span>` : ''}
                            <span class="hoy2-survey-label">${opt.label}</span>
                            ${hasVoted ? `<span class="hoy2-survey-pct">${pct}%</span>` : ''}
                        </button>
                    `;
                }).join('')}
            </div>
            ${hasVoted ? `
                <div class="hoy2-survey-result">
                    ${survey.kind === 'trivia'
                        ? (survey.options.find(o => o.key === chosen)?.correct
                            ? '¡Correcto! 👏 Gracias por participar.'
                            : 'Respuesta incorrecta. ¡Inténtalo la próxima!')
                        : 'Gracias por participar'}
                </div>
                <button class="hoy2-survey-reset" data-survey-reset="${survey.id}">Volver a contestar</button>
            ` : ''}
        </div>
    `;
}

// ================================================================
// HOY — Pestañas por equipo (flag 'fan.hoy.team-tabs')
// ================================================================
//
// Añade 4 pestañas sobre el Hoy clásico: Todo · Masc · Fem · Basket.
// · "Todo" preserva el carrusel de partidos (comportamiento original).
// · Cada pestaña de equipo filtra HEADER_MATCHES por `category` y
//   muestra un único bloque (el próximo partido, o el más reciente
//   si no hay próximo).
//
// Persistencia: localStorage para recordar entre recargas la pestaña
// seleccionada, qué pestañas están visibles y si se muestran emojis.

const HOY_TABS_STORAGE_KEY   = 'rm_hoy_team_tabs_v1';

const HoyTeamTabs = {
    DEFAULT_VISIBLE: { masc: true, fem: true, basket: true },

    /** { filter, visible, emojiMode } con defaults aplicados. */
    load() {
        let raw = {};
        try { raw = JSON.parse(localStorage.getItem(HOY_TABS_STORAGE_KEY) || '{}'); }
        catch {}
        return {
            filter: raw.filter || 'all',   // 'all' | 'masc' | 'fem' | 'basket'
            visible: { ...this.DEFAULT_VISIBLE, ...(raw.visible || {}) },
            emojiMode: !!raw.emojiMode
        };
    },

    save(next) {
        try { localStorage.setItem(HOY_TABS_STORAGE_KEY, JSON.stringify(next)); }
        catch {}
    },

    hydrate() {
        const s = this.load();
        state.hoyTeamFilter   = s.filter;
        state.hoyTabsVisible  = s.visible;
        state.hoyTabsEmoji    = s.emojiMode;
    },

    persist() {
        this.save({
            filter: state.hoyTeamFilter,
            visible: state.hoyTabsVisible,
            emojiMode: state.hoyTabsEmoji
        });
    },

    /** Etiqueta visible para una categoría según el modo.
     *  El "modo emoji" está dictado por el flag `fan.hoy.team-tabs.emoji`.
     *  Así el toggle del editor y el toggle del panel de funcionalidades
     *  comparten una única fuente de verdad. */
    isEmojiMode() {
        return typeof Flags !== 'undefined'
            && Flags.isEnabled('fan.hoy.team-tabs.emoji');
    },
    labelFor(key) {
        if (key === 'all') return 'Todo';
        const emoji = this.isEmojiMode();
        if (key === 'masc')   return emoji ? '⚽️ Masculino'  : 'Fútbol masc.';
        if (key === 'fem')    return emoji ? '⚽️ Femenino'   : 'Fútbol fem.';
        if (key === 'basket') return emoji ? '🏀 1er equipo' : 'Baloncesto';
        return key;
    },

    /** Lista de tabs a renderizar según la configuración. */
    visibleTabKeys() {
        const list = ['all'];
        if (state.hoyTabsVisible.masc)   list.push('masc');
        if (state.hoyTabsVisible.fem)    list.push('fem');
        if (state.hoyTabsVisible.basket) list.push('basket');
        return list;
    },

    /** Partidos visibles bajo la pestaña actual. */
    matchesForFilter() {
        const f = state.hoyTeamFilter;
        if (f === 'all') return HEADER_MATCHES;
        return HEADER_MATCHES.filter(m => m.category === f);
    },

    /** Partido "principal" cuando hay un equipo concreto: próximo > último. */
    primaryMatchForFilter() {
        const list = this.matchesForFilter();
        const next = list.find(m => m.status === 'upcoming' || m.status === 'live');
        return next || list[0] || null;
    }
};

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

// ── Team tabs bar (sticky, debajo del top row) ─────────────────
function renderHoyTeamTabsBar(editorOn) {
    const tabs = HoyTeamTabs.visibleTabKeys();
    const current = state.hoyTeamFilter;

    return `
        <div class="home-team-tabs" id="homeTeamTabs">
            <div class="home-team-tabs-scroll">
                ${tabs.map(k => `
                    <button class="home-team-tab ${k === current ? 'active' : ''}" data-team-tab="${k}">
                        <span class="home-team-tab-label">${HoyTeamTabs.labelFor(k)}</span>
                        <span class="home-team-tab-underline"></span>
                    </button>
                `).join('')}
            </div>
            ${editorOn ? `
                <button class="home-team-tabs-edit" id="btnHoyTabsEditor" aria-label="Editar pestañas">
                    ${I.slider}
                </button>
            ` : ''}
        </div>
    `;
}

// ── Editor sheet: qué pestañas mostrar + modo emoji ────────────
function renderHoyTabsEditorSheet() {
    const v = state.hoyTabsVisible;
    // El modo emoji está en el flag — editor y panel comparten estado.
    const emoji = HoyTeamTabs.isEmojiMode();

    const row = (teamKey, description) => `
        <label class="hoy-tabs-editor-row">
            <div class="hoy-tabs-editor-row-main">
                <div class="hoy-tabs-editor-row-title">${HoyTeamTabs.labelFor(teamKey)}</div>
                <div class="hoy-tabs-editor-row-sub">${description}</div>
            </div>
            <span class="hoy-tabs-editor-toggle ${v[teamKey] ? 'on' : ''}" data-editor-toggle="${teamKey}">
                <span class="hoy-tabs-editor-knob"></span>
            </span>
        </label>
    `;

    return `
        <div class="hoy-tabs-editor-overlay" id="hoyTabsEditorOverlay">
            <div class="hoy-tabs-editor-dim" data-editor-close></div>
            <div class="hoy-tabs-editor-sheet" role="dialog" aria-label="Editar pestañas de Hoy">
                <div class="hoy-tabs-editor-head">
                    <div class="hoy-tabs-editor-title">Editar pestañas</div>
                    <button class="hoy-tabs-editor-done" data-editor-close>Hecho</button>
                </div>

                <div class="hoy-tabs-editor-section-title">Pestañas visibles en Hoy</div>
                <div class="hoy-tabs-editor-group">
                    ${row('masc',   'Primer equipo · Fútbol masculino')}
                    ${row('fem',    'Primer equipo · Fútbol femenino')}
                    ${row('basket', 'Primer equipo · Baloncesto')}
                </div>
                <div class="hoy-tabs-editor-foot">La pestaña «Todo» siempre se muestra.</div>

                <div class="hoy-tabs-editor-section-title">Apariencia</div>
                <div class="hoy-tabs-editor-group">
                    <label class="hoy-tabs-editor-row">
                        <div class="hoy-tabs-editor-row-main">
                            <div class="hoy-tabs-editor-row-title">Mostrar emojis en las pestañas</div>
                            <div class="hoy-tabs-editor-row-sub">⚽️ Masculino / ⚽️ Femenino / 🏀 1er equipo</div>
                        </div>
                        <span class="hoy-tabs-editor-toggle ${emoji ? 'on' : ''}" data-editor-emoji>
                            <span class="hoy-tabs-editor-knob"></span>
                        </span>
                    </label>
                </div>
            </div>
        </div>
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

// ================================================================
// RM PLAY — feature flag 'fan.rmtv.play'
//
// Reemplaza la pantalla de RMTV por un layout tipo plataforma OTT
// similar a las capturas de la app oficial de Real Madrid Play:
//   · Topbar oscuro con menú, brand "Play" y pill "Directo (2)".
//   · Hero carrusel con CTA "Resumen" + "Ver más" + dots.
//   · Secciones horizontales: Nuestro club, Realmadrid TV (canales),
//     Tendencias, UEFA Youth League, Partidos 2025-26, Originals & Films.
// ================================================================

const RMPLAY_HERO_SLIDES = [
    {
        title: 'Real Madrid 2-1 Alavés',
        subtitle: 'El mejor contenido de nuestra victoria en el Bernabéu.',
        color1: '#15203a',
        color2: '#0a1120'
    },
    {
        title: 'Bayern Múnich 4-3 Real Madrid',
        subtitle: 'Análisis y resumen del duelo europeo en el Allianz.',
        color1: '#2b0b0e',
        color2: '#120304'
    },
    {
        title: '30 Minutos · Cuartos de final',
        subtitle: 'La eliminatoria contada por sus protagonistas.',
        color1: '#1a1246',
        color2: '#0a0822'
    },
    {
        title: 'UEFA Youth League — Entrevista',
        subtitle: 'El Juvenil A repasa el título conquistado en Nyon.',
        color1: '#0f2a1a',
        color2: '#061209'
    },
    {
        title: 'Originals: tras las cámaras',
        subtitle: 'El Real Madrid en primera persona, fuera del césped.',
        color1: '#2a1a3f',
        color2: '#110921'
    }
];

const RMPLAY_SECTIONS = {
    club: [
        { id: 'masc',   label: 'Fútbol Masculino', c1: '#233a75', c2: '#0d1a3a' },
        { id: 'basket', label: 'Baloncesto',        c1: '#7a3a0f', c2: '#321408' },
        { id: 'fem',    label: 'Fútbol Femenino',   c1: '#5d1a3f', c2: '#280a1b' }
    ],
    channels: [
        { flag: '🇪🇸', label: 'Ver en Español', live: true },
        { flag: '🇬🇧', label: 'Watch in English', live: true }
    ],
    trending: [
        { title: 'Camavinga | 150 victorias con el Real Madrid', duration: '02:18', c1: '#153a5a', c2: '#061528' },
        { title: 'Carvajal | 300 partidos en el Bernabéu',        duration: '01:55', c1: '#2b0c14', c2: '#110306' },
        { title: 'Bellingham | Mejores asistencias',              duration: '03:02', c1: '#1f1a4a', c2: '#0a0820' },
        { title: 'Courtois | Las 10 mejores paradas',             duration: '02:44', c1: '#0f2a1a', c2: '#05140a' }
    ],
    youth: [
        { title: 'El Juvenil A ofrece la Youth League al Bernabéu', duration: '01:37', c1: '#193a4a', c2: '#07141d' },
        { title: 'Florentino Pérez recibe a los campeones',         duration: '00:45', c1: '#2a1738', c2: '#110821' },
        { title: 'Arbeloa: "Un título histórico"',                  duration: '02:10', c1: '#1a3a2a', c2: '#071810' }
    ],
    matches: [
        { title: 'Real Madrid 2-1 Alavés', videos: 12, c1: '#0b1a3a', c2: '#050a1f' },
        { title: 'Bayern 4-3 Real Madrid', videos: 9,  c1: '#3a0b14', c2: '#1a0508' },
        { title: 'Real Madrid 1-1 Girona', videos: 11, c1: '#3a2a0b', c2: '#1a1305' }
    ],
    originals: [
        { title: 'Hala Madrid',        subtitle: 'Serie documental · T1', c1: '#241650', c2: '#0e0824' },
        { title: 'Leyendas blancas',   subtitle: 'Película · 2024',       c1: '#1a3a4a', c2: '#07141d' },
        { title: 'El Bernabéu',        subtitle: 'Serie · T2',            c1: '#3a1a2a', c2: '#1a0810' }
    ]
};

function renderRMPlay() {
    // Estado local simple para el hero (reusa state.heroIndex existente).
    const slideIdx = state.heroIndex % RMPLAY_HERO_SLIDES.length;
    const slide = RMPLAY_HERO_SLIDES[slideIdx];

    return `
        <div class="rmplay-wrap">

            <!-- Topbar estilo RM Play: menú, brand "Play" central, cast + Directo -->
            <div class="rmplay-topbar">
                <button class="rmplay-top-btn" id="btnSideMenu" aria-label="Menú">
                    ${I.line3}
                </button>
                <div class="rmplay-brand">
                    <span class="rmplay-brand-crown">${I.crownSmall}</span>
                    <span class="rmplay-brand-text">Play</span>
                </div>
                <div class="rmplay-top-right">
                    <button class="rmplay-top-btn" aria-label="Cast">
                        <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor"><path d="M2 4v4h2V6h16v12h-5v2h5a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2H2z"/><path d="M2 10v2a8 8 0 0 1 8 8h2A10 10 0 0 0 2 10z"/><path d="M2 14v2a4 4 0 0 1 4 4h2a6 6 0 0 0-6-6z"/><circle cx="3" cy="19" r="1.6"/></svg>
                    </button>
                    <button class="rmplay-live-pill">Directo (2)</button>
                </div>
            </div>

            <div class="rmplay-scroll">

                <!-- Hero carrusel -->
                <section class="rmplay-hero" style="background: linear-gradient(180deg, ${slide.color1} 0%, ${slide.color2} 100%);">
                    <div class="rmplay-hero-body">
                        <h2 class="rmplay-hero-title">${slide.title}</h2>
                        <p class="rmplay-hero-sub">${slide.subtitle}</p>
                        <div class="rmplay-hero-ctas">
                            <button class="rmplay-btn primary">Resumen</button>
                            <button class="rmplay-btn ghost">Ver más</button>
                        </div>
                    </div>
                    <div class="rmplay-hero-dots">
                        ${RMPLAY_HERO_SLIDES.map((_, i) => `
                            <button class="rmplay-hero-dot ${i === slideIdx ? 'active' : ''}" data-rmplay-hero="${i}"></button>
                        `).join('')}
                    </div>
                </section>

                <!-- Nuestro club -->
                <section class="rmplay-section">
                    <h3 class="rmplay-section-title">Nuestro club</h3>
                    <div class="rmplay-hscroll">
                        ${RMPLAY_SECTIONS.club.map(c => `
                            <button class="rmplay-club-card"
                                style="background: linear-gradient(180deg, ${c.c1} 0%, ${c.c2} 100%);">
                                <span class="rmplay-club-label">${c.label}</span>
                            </button>
                        `).join('')}
                    </div>
                </section>

                <!-- Realmadrid TV (canales) -->
                <section class="rmplay-section">
                    <h3 class="rmplay-section-title">Realmadrid TV</h3>
                    <div class="rmplay-hscroll">
                        ${RMPLAY_SECTIONS.channels.map(c => `
                            <div class="rmplay-channel-card">
                                <div class="rmplay-channel-art">
                                    <span class="rmplay-channel-flag">${c.flag}</span>
                                    <div class="rmplay-channel-logo">
                                        ${I.crownSmall}
                                        <span class="rmplay-channel-brand">Realmadrid.tv</span>
                                    </div>
                                </div>
                                <div class="rmplay-channel-meta">
                                    <div class="rmplay-channel-name">${c.label}</div>
                                    ${c.live ? '<span class="rmplay-channel-live">Directo</span>' : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </section>

                <!-- Tendencias -->
                <section class="rmplay-section">
                    <h3 class="rmplay-section-title">Tendencias</h3>
                    <div class="rmplay-hscroll">
                        ${RMPLAY_SECTIONS.trending.map(v => `
                            <button class="rmplay-video-card"
                                style="background: linear-gradient(145deg, ${v.c1}, ${v.c2});">
                                <span class="rmplay-video-play">${I.playSolid}</span>
                                <div class="rmplay-video-meta">
                                    <div class="rmplay-video-title">${v.title}</div>
                                    <div class="rmplay-video-duration">${v.duration}</div>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </section>

                <!-- UEFA Youth League -->
                <section class="rmplay-section">
                    <h3 class="rmplay-section-title">UEFA Youth League</h3>
                    <div class="rmplay-hscroll">
                        ${RMPLAY_SECTIONS.youth.map(v => `
                            <button class="rmplay-video-card"
                                style="background: linear-gradient(145deg, ${v.c1}, ${v.c2});">
                                <span class="rmplay-video-play">${I.playSolid}</span>
                                <div class="rmplay-video-meta">
                                    <div class="rmplay-video-title">${v.title}</div>
                                    <div class="rmplay-video-duration">${v.duration}</div>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </section>

                <!-- Partidos 2025-26 (playlists) -->
                <section class="rmplay-section">
                    <h3 class="rmplay-section-title">Partidos 2025-26</h3>
                    <p class="rmplay-section-sub">La previa, el partido, el post. ¡No te pierdas nada!</p>
                    <div class="rmplay-hscroll">
                        ${RMPLAY_SECTIONS.matches.map(m => `
                            <button class="rmplay-playlist-card"
                                style="background: linear-gradient(160deg, ${m.c1}, ${m.c2});">
                                <span class="rmplay-playlist-badge">${m.videos} VIDEOS</span>
                                <div class="rmplay-playlist-title">${m.title}</div>
                            </button>
                        `).join('')}
                    </div>
                </section>

                <!-- Originals & Films -->
                <section class="rmplay-section">
                    <h3 class="rmplay-section-title">Originals &amp; Films</h3>
                    <p class="rmplay-section-sub">La historia y actualidad del club a través de las mejores series y películas.</p>
                    <div class="rmplay-hscroll">
                        ${RMPLAY_SECTIONS.originals.map(o => `
                            <button class="rmplay-video-card tall"
                                style="background: linear-gradient(170deg, ${o.c1}, ${o.c2});">
                                <div class="rmplay-video-meta">
                                    <div class="rmplay-video-title">${o.title}</div>
                                    <div class="rmplay-video-duration">${o.subtitle}</div>
                                </div>
                            </button>
                        `).join('')}
                    </div>
                </section>

                <div style="height: 32px"></div>
            </div>
        </div>

        ${renderSideMenu()}
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
    moreVert: `<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="5" r="1.6"/><circle cx="12" cy="12" r="1.6"/><circle cx="12" cy="19" r="1.6"/></svg>`,
    sms: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round"><path d="M4 5h16a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H9l-4 4v-4H4a1 1 0 0 1-1-1V6a1 1 0 0 1 1-1z"/></svg>`,
    addressBook: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6"><rect x="5" y="3" width="14" height="18" rx="2"/><circle cx="12" cy="11" r="3"/><path d="M7 18a5 5 0 0 1 10 0"/><path d="M3 7h2M3 12h2M3 17h2"/></svg>`
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
    const palcoSheet = state.vipPalcoSheetOpen ? renderVipPalcoSheet() : '';

    return `
        <div class="vip-app">
            <button class="vip-palco-bar" data-vip-action="toggle-palco-sheet" type="button">
                <div class="vip-palco-label">
                    PALCO 4101 ${VIP_I.chevronDown}
                </div>
            </button>
            ${content}
            ${palcoSheet}
        </div>
    `;
}

function renderVipPalcoSheet() {
    const ev = VIP_EVENTS.find(e => e.id === state.vipEventId) || VIP_EVENTS[0];
    return `
        <div class="vip-sheet-backdrop vip-palco-backdrop" data-vip-action="toggle-palco-sheet"></div>
        <div class="vip-palco-sheet">
            <div class="vip-picker-grabber"></div>
            <div class="vip-palco-sheet-head">
                <div class="vip-palco-sheet-title">Tu palco</div>
                <div class="vip-palco-sheet-sub">Próximo evento · ${ev.dateTime}</div>
            </div>
            <div class="vip-palco-sheet-card">
                <div class="vip-palco-sheet-row">
                    <span class="lbl">PALCO</span>
                    <span class="val">4101</span>
                </div>
                <div class="vip-palco-sheet-row">
                    <span class="lbl">PUERTA</span>
                    <span class="val">${ev.puerta}</span>
                </div>
                <div class="vip-palco-sheet-row">
                    <span class="lbl">SECTOR</span>
                    <span class="val">${ev.sector}</span>
                </div>
                <div class="vip-palco-sheet-row">
                    <span class="lbl">CAPACIDAD</span>
                    <span class="val">19 asientos</span>
                </div>
            </div>
            <div class="vip-palco-sheet-note">Es el único palco asociado a tu cuenta.</div>
            <button class="vip-share-cancel" data-vip-action="toggle-palco-sheet">Cerrar</button>
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
    if (Flags.isEnabled('vip.tickets.multi-share')) {
        return renderVipTicketsV2();
    }
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

// ─────────────────────────────────────────────────────────────────
// Multi-ticket share (flag: vip.tickets.multi-share)
// ─────────────────────────────────────────────────────────────────

function vipTicketsForCurrentEvent() {
    const evId = state.vipEventId || VIP_EVENTS[0].id;
    return VIP_TICKETS_BY_EVENT[evId] || [];
}

function vipTicketStatusLabel(t) {
    switch (t.status) {
        case 'mine':       return 'Para mí';
        case 'unassigned': return 'Sin asignar';
        case 'assigned':   return 'Listo para enviar';
        case 'sent':       return 'Enviado';
        case 'accepted':   return 'Abierto';
        case 'bound':      return 'Vinculado';
        default:           return '';
    }
}

function vipContactById(id) {
    return VIP_CONTACTS.find(c => c.id === id) || null;
}

// Channels available for a contact, in routing-preference order.
// Email is preferred over SMS so the user receives the prettier
// rendered message; SMS is the fallback when there's no email.
function vipChannelsFor(contact) {
    if (!contact) return [];
    const out = [];
    if (contact.email) out.push('email');
    if (contact.phone) out.push('sms');
    return out;
}

function vipDefaultChannelFor(contact) {
    return vipChannelsFor(contact)[0] || null;
}

const VIP_CHANNEL_LABEL = { email: 'Correo', sms: 'SMS' };
const VIP_CHANNEL_ICON  = { email: () => VIP_I.mail, sms: () => VIP_I.sms };

// Contacts permission gate (simulated iOS prompt). Persisted in
// localStorage so we don't re-prompt across sessions; cleared by
// design tooling if needed via `localStorage.removeItem('vip.contactsPermission')`.
const VIP_PERMISSION_KEY = 'vip.contactsPermission';
function vipReadContactsPermission() {
    try { return localStorage.getItem(VIP_PERMISSION_KEY) === 'granted'; }
    catch { return false; }
}
function vipWriteContactsPermission(granted) {
    try {
        if (granted) localStorage.setItem(VIP_PERMISSION_KEY, 'granted');
        else localStorage.removeItem(VIP_PERMISSION_KEY);
    } catch {}
}

function vipAvatarHTML(contactOrSelf, size = 36) {
    if (contactOrSelf === 'self') {
        return `<div class="vip-avatar self" style="width:${size}px;height:${size}px">
            <span>TÚ</span>
        </div>`;
    }
    if (!contactOrSelf) {
        return `<div class="vip-avatar unassigned" style="width:${size}px;height:${size}px">${VIP_I.plus}</div>`;
    }
    const bg = `hsl(${contactOrSelf.hue}, 45%, 38%)`;
    return `<div class="vip-avatar" style="width:${size}px;height:${size}px;background:${bg}">
        <span>${contactOrSelf.initial}</span>
    </div>`;
}

function renderVipTicketsV2() {
    const ev = VIP_EVENTS.find(e => e.id === state.vipEventId) || VIP_EVENTS[0];
    const tickets = vipTicketsForCurrentEvent();

    const total     = tickets.length;
    const mineCount = tickets.filter(t => t.status === 'mine').length;
    const sent      = tickets.filter(t => ['sent', 'accepted', 'bound'].includes(t.status)).length;
    const draft     = tickets.filter(t => t.status === 'assigned').length;
    const pending   = tickets.filter(t => t.status === 'unassigned').length;

    // Main CTA logic.
    // - Drafts pending review → floating "Revisar y enviar".
    // - Only unassigned (no drafts) → no floating CTA; the pending-summary
    //   card below already acts as the primary call-to-action, and a second
    //   floating button on top of it competes for attention and covers
    //   recipient rows.
    // - Everything sent → static "Todo repartido" badge.
    let ctaLabel = null, ctaAction = null, ctaVariant = 'primary';
    if (draft > 0) {
        ctaLabel = `Revisar y enviar (${draft})`;
        ctaAction = 'open-preview';
    } else if (sent > 0 && sent === total - mineCount) {
        ctaLabel = 'Todo repartido';
        ctaVariant = 'done';
    }

    const showRepeat = !!VIP_LAST_GROUP && pending > 0 && draft === 0 && sent === 0;

    // Recipients are split: assigned/sent/etc render as individual rows;
    // unassigned tickets collapse into one summary row to avoid 18 identical
    // "Sin asignar" lines flooding the screen.
    const mineTicket = tickets.find(t => t.status === 'mine');
    const recipients = tickets.filter(t => t.status !== 'mine');
    const unassigned = recipients.filter(t => t.status === 'unassigned');
    const filledRows = recipients
        .filter(t => t.status !== 'unassigned')
        .map(renderVipTicketRow)
        .join('');

    const filaRange = (() => {
        if (unassigned.length === 0) return '';
        const filas = [...new Set(unassigned.map(t => t.fila))].sort();
        if (filas.length === 1) return `Fila ${filas[0]}`;
        return `Filas ${filas[0]} – ${filas[filas.length - 1]}`;
    })();

    const pendingSummary = unassigned.length > 0 ? `
        <button class="vip-pending-summary" data-vip-action="open-picker">
            <div class="vip-pending-summary-icon">${VIP_I.plus}</div>
            <div class="vip-pending-summary-body">
                <strong>+${unassigned.length} asiento${unassigned.length === 1 ? '' : 's'} sin asignar</strong>
                <span>${filaRange} · pulsa para repartir</span>
            </div>
            ${VIP_I.chevronRight}
        </button>
    ` : '';

    return `
        <div class="vip-event-detail-head">
            <button class="vip-back-btn" data-vip-back>${I.chevronLeft}</button>
            <div class="vip-event-detail-title">Mis tickets</div>
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

        <div class="vip-share-summary">
            <div class="vip-share-summary-item">
                <div class="num">${total}</div>
                <div class="label">Tickets</div>
            </div>
            <div class="vip-share-summary-item">
                <div class="num">${sent}</div>
                <div class="label">Enviados</div>
            </div>
            <div class="vip-share-summary-item">
                <div class="num">${pending + draft}</div>
                <div class="label">Pendientes</div>
            </div>
        </div>

        ${showRepeat ? `
            <button class="vip-repeat-banner" data-vip-action="repeat-last">
                <div class="vip-repeat-icon">${VIP_I.history}</div>
                <div class="vip-repeat-body">
                    <strong>Repartir como la última vez</strong>
                    <span>Mismos ${VIP_LAST_GROUP.contactIds.length} contactos que en ${VIP_LAST_GROUP.eventLabel}</span>
                </div>
                ${VIP_I.chevronRight}
            </button>
        ` : ''}

        ${mineTicket ? `
            <div class="vip-ticket-list" style="padding-bottom:4px">
                ${renderVipTicketRow(mineTicket)}
            </div>
        ` : ''}

        <div class="vip-ticket-list-label">DESTINATARIOS</div>
        ${filledRows ? `<div class="vip-ticket-list">${filledRows}</div>` : ''}
        ${pendingSummary ? `<div class="vip-ticket-list" style="padding-top: ${filledRows ? '0' : '0'}; margin-top: ${filledRows ? '-4px' : '0'}">${pendingSummary}</div>` : ''}
        ${!filledRows && !pendingSummary ? `
            <div class="vip-empty-state" style="padding: 20px">
                <div>Todavía no hay destinatarios.</div>
            </div>
        ` : ''}

        ${ctaLabel ? `
            <div class="vip-sticky-cta-wrap">
                <button class="vip-sticky-cta ${ctaVariant}"
                        ${ctaAction ? `data-vip-action="${ctaAction}"` : 'disabled'}>
                    ${ctaVariant === 'done' ? `${VIP_I.walletPass} ${ctaLabel}` : ctaLabel}
                </button>
                ${ctaAction === 'open-picker' ? `
                    <div class="vip-sticky-cta-sub">Elige contactos y se asignará un asiento a cada uno</div>
                ` : ''}
            </div>
            <div style="height: 120px"></div>
        ` : '<div style="height: 20px"></div>'}
    `;
}

function renderVipTicketRow(t) {
    const isMine = t.status === 'mine';
    const contact = t.contactId ? vipContactById(t.contactId) : null;
    const seatLabel = `Fila ${t.fila} · Asiento ${t.asiento}`;
    const statusClass = `st-${t.status}`;
    const statusLabel = vipTicketStatusLabel(t);
    const avatar = isMine ? vipAvatarHTML('self', 36) : vipAvatarHTML(contact, 36);
    const title = isMine
        ? 'Para mí'
        : (contact ? contact.name : 'Sin asignar');

    // Only sent/accepted/bound tickets are interactive from the main list.
    // Draft/unassigned/mine are managed through the picker/preview flow.
    const interactive = ['sent', 'accepted', 'bound'].includes(t.status);
    const tag = interactive ? 'button' : 'div';
    const attrs = interactive
        ? `data-vip-action="main-actions" data-vip-ticket-id="${t.id}"`
        : '';

    // The "PARA MÍ" badge duplicates the row title — only show a status badge
    // when the status conveys new info (sent / accepted / bound).
    const showStatusBadge = !isMine && interactive;

    return `
        <${tag} class="vip-ticket-item ${statusClass} ${interactive ? '' : 'static'}" ${attrs}>
            <div class="vip-ticket-avatar">${avatar}</div>
            <div class="vip-ticket-main">
                <div class="vip-ticket-top">
                    <span class="vip-ticket-name">${title}</span>
                    ${showStatusBadge ? `<span class="vip-ticket-status ${statusClass}">${statusLabel}</span>` : ''}
                </div>
                <div class="vip-ticket-sub">${seatLabel}</div>
            </div>
            ${interactive ? `<div class="vip-ticket-more">${VIP_I.moreVert}</div>` : ''}
        </${tag}>
    `;
}

function renderVipShareSheets() {
    const s = state.vipShare;
    if (!s.step) return '';

    // Steps that overlay the preview (keep preview visible beneath)
    const overPreview = ['row-actions', 'swap-seat', 'replace-contact',
                         'disclaimer', 'sending', 'sent'];

    if (s.step === 'permission')   return renderVipPermissionSheet();
    if (s.step === 'picker')       return renderVipPickerSheet();
    if (s.step === 'main-actions') return renderVipMainActionsSheet();
    if (s.step === 'preview')      return renderVipPreviewSheet();

    if (overPreview.includes(s.step)) {
        let overlay = '';
        if (s.step === 'row-actions')     overlay = renderVipRowActionsSheet();
        else if (s.step === 'swap-seat')  overlay = renderVipSwapSeatSheet();
        else if (s.step === 'replace-contact') overlay = renderVipReplaceContactSheet();
        else if (s.step === 'disclaimer') overlay = renderVipDisclaimerSheet();
        else if (s.step === 'sending')    overlay = renderVipSendingSheet();
        else if (s.step === 'sent')       overlay = renderVipSentSheet();
        return renderVipPreviewSheet() + overlay;
    }
    return '';
}

// ── STEP 0 · Contacts permission gate (one-time iOS-style prompt) ──
function renderVipPermissionSheet() {
    return `
        <div class="vip-sheet-backdrop"></div>
        <div class="vip-permission-sheet">
            <div class="vip-permission-icon">${VIP_I.addressBook}</div>
            <div class="vip-permission-title">"Real Madrid" quiere acceder<br>a tus contactos</div>
            <div class="vip-permission-body">
                Necesitamos leer tu lista de contactos para que puedas
                seleccionar a quién enviar cada ticket por correo o SMS.
                No se guardarán en nuestros servidores.
            </div>
            <div class="vip-permission-actions">
                <button class="vip-permission-deny" data-vip-action="deny-contacts">No permitir</button>
                <button class="vip-permission-allow" data-vip-action="allow-contacts">Permitir</button>
            </div>
        </div>
    `;
}

// 3-step wizard pip indicator: contactos → revisar → enviar.
// Same component reused across picker, preview and disclaimer/share so the
// flow feels coherent. `current` is 1-based.
function renderVipFlowSteps(current) {
    const steps = [
        { n: 1, label: 'Contactos' },
        { n: 2, label: 'Revisar' },
        { n: 3, label: 'Enviar' }
    ];
    return `
        <div class="vip-flow-steps" aria-label="Paso ${current} de 3">
            ${steps.map(s => {
                const state = s.n < current ? 'done' : s.n === current ? 'current' : 'todo';
                return `
                    <div class="vip-flow-step ${state}">
                        <div class="vip-flow-step-pip">${s.n < current ? '✓' : s.n}</div>
                        <span>${s.label}</span>
                    </div>
                    ${s.n < steps.length ? '<div class="vip-flow-step-line"></div>' : ''}
                `;
            }).join('')}
        </div>
    `;
}

// ── STEP 1 · Picker ─────────────────────────────────────────────
function renderVipPickerSheet() {
    const s = state.vipShare;
    const tickets = vipTicketsForCurrentEvent();
    const mutableCount = tickets.filter(t => ['unassigned', 'mine'].includes(t.status)).length;
    const q = (s.query || '').trim().toLowerCase();

    const maxSelect = s.keepMine ? Math.max(0, mutableCount - 1) : mutableCount;
    const selected = s.selection;

    const list = VIP_CONTACTS.filter(c => !q
        || c.name.toLowerCase().includes(q)
        || c.phone.includes(q));

    const doneLabel = selected.length > 0
        ? `Siguiente (${selected.length})`
        : 'Siguiente';

    return `
        <div class="vip-sheet-backdrop" data-vip-action="close-sheet"></div>
        <div class="vip-picker-sheet">
            <div class="vip-picker-grabber"></div>
            <div class="vip-picker-head">
                <button class="vip-picker-cancel" data-vip-action="close-sheet">Cancelar</button>
                <div class="vip-picker-title">Elige destinatarios</div>
                <button class="vip-picker-done ${selected.length > 0 ? 'active' : ''}"
                        ${selected.length === 0 ? 'disabled' : ''}
                        data-vip-action="commit-picker">${doneLabel}</button>
            </div>

            ${renderVipFlowSteps(1)}

            <div class="vip-keep-mine-row">
                <div>
                    <strong>Reservarme un ticket</strong>
                    <span>Se añadirá automáticamente a tu Wallet</span>
                </div>
                <button class="vip-toggle-sm ${s.keepMine ? 'on' : ''}"
                        data-vip-action="toggle-keep-mine"></button>
            </div>

            <div class="vip-picker-counter">
                <strong>${selected.length}</strong> / ${maxSelect} contactos
                ${selected.length >= maxSelect && maxSelect > 0
                    ? '<span class="vip-picker-limit">límite alcanzado</span>' : ''}
            </div>

            <div class="vip-picker-search">
                <input type="text" placeholder="Buscar contacto"
                       value="${escapeHtml(s.query || '')}"
                       data-vip-search>
            </div>

            <div class="vip-picker-list" id="vipPickerList">
                ${list.map(c => renderVipPickerRow(c, selected, maxSelect)).join('')}
            </div>
        </div>
    `;
}

function renderVipPickerRow(c, selected, maxSelect) {
    const isSel = selected.includes(c.id);
    const disabled = !isSel && selected.length >= maxSelect;
    const channels = vipChannelsFor(c);
    // Subtitle: prefer email when both, but always make it clear which
    // channels exist via the badges below.
    const subtitle = c.email || c.phone || '';
    const channelBadges = channels.map(ch => `
        <span class="vip-channel-badge ch-${ch}" title="${VIP_CHANNEL_LABEL[ch]}">
            ${VIP_CHANNEL_ICON[ch]()}<span>${VIP_CHANNEL_LABEL[ch]}</span>
        </span>
    `).join('');

    return `
        <div class="vip-picker-row ${isSel ? 'selected' : ''} ${disabled ? 'disabled' : ''}"
             data-vip-action="toggle-contact" data-vip-contact="${c.id}">
            ${vipAvatarHTML(c, 40)}
            <div class="vip-picker-info">
                <div class="name">${c.name}</div>
                <div class="phone">${subtitle}</div>
                <div class="vip-picker-channels">${channelBadges}</div>
            </div>
            <div class="vip-picker-check ${isSel ? 'on' : ''}">
                ${isSel ? '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><polyline points="4,10 9,15 16,6"/></svg>' : ''}
            </div>
        </div>
    `;
}

// ── STEP 2 · Preview (review assignments) ───────────────────────
function renderVipPreviewSheet() {
    const tickets = vipTicketsForCurrentEvent();
    const draft = tickets.filter(t => t.status === 'assigned');
    const mineTicket = tickets.find(t => t.status === 'mine');

    return `
        <div class="vip-sheet-backdrop" data-vip-action="cancel-preview"></div>
        <div class="vip-preview-sheet">
            <div class="vip-preview-head">
                <button class="vip-back-btn" data-vip-action="cancel-preview">${I.chevronLeft}</button>
                <div>
                    <div class="vip-preview-title">Revisar reparto</div>
                    <div class="vip-preview-sub">${draft.length} ticket${draft.length === 1 ? '' : 's'} asignado${draft.length === 1 ? '' : 's'} · pulsa para editar</div>
                </div>
                <div style="width:36px"></div>
            </div>

            ${renderVipFlowSteps(2)}

            <div class="vip-preview-body">
                ${mineTicket ? `
                    <div class="vip-preview-mine">
                        ${vipAvatarHTML('self', 40)}
                        <div class="vip-preview-mine-info">
                            <strong>Para ti</strong>
                            <span>Fila ${mineTicket.fila} · Asiento ${mineTicket.asiento}</span>
                        </div>
                        <div class="vip-preview-mine-badge">${VIP_I.walletPass} Wallet</div>
                    </div>
                ` : ''}

                <div class="vip-preview-list-label">DESTINATARIOS</div>
                <div class="vip-preview-list">
                    ${draft.map((t, idx) => renderVipPreviewRow(t, idx)).join('')}
                </div>

                <div class="vip-preview-tip">
                    ${VIP_I.ticket} Pulsa en cualquier fila para cambiar su asiento, sustituir al destinatario o quitarlo.
                </div>
            </div>

            <div class="vip-sticky-cta-wrap inside-sheet">
                <button class="vip-sticky-cta primary" data-vip-action="confirm-send">
                    Enviar ${draft.length} ticket${draft.length === 1 ? '' : 's'}
                </button>
                <div class="vip-sticky-cta-sub">Se envía un ticket personalizado a cada persona</div>
            </div>
        </div>
    `;
}

function renderVipPreviewRow(t, idx) {
    const contact = vipContactById(t.contactId);
    if (!contact) return '';
    const ch = t.channel || vipDefaultChannelFor(contact);
    const subtitle = ch === 'email' ? (contact.email || contact.phone) : (contact.phone || contact.email);
    return `
        <button class="vip-preview-row" data-vip-action="open-row-actions" data-vip-idx="${idx}">
            ${vipAvatarHTML(contact, 40)}
            <div class="vip-preview-row-info">
                <div class="name">${contact.name}</div>
                <div class="phone">${subtitle}</div>
            </div>
            <div class="vip-preview-row-meta">
                <span class="vip-channel-chip ch-${ch}">
                    ${VIP_CHANNEL_ICON[ch]()}<span>${VIP_CHANNEL_LABEL[ch]}</span>
                </span>
                <div class="vip-preview-row-seat">
                    <div class="fila">Fila ${t.fila}</div>
                    <div class="asiento">Asiento ${t.asiento}</div>
                </div>
            </div>
            ${VIP_I.chevronRight}
        </button>
    `;
}

// ── STEP 2.1 · Row actions (tapping a preview row) ───────────────
function renderVipRowActionsSheet() {
    const s = state.vipShare;
    const tickets = vipTicketsForCurrentEvent();
    const draft = tickets.filter(t => t.status === 'assigned');
    const t = draft[s.activeIdx];
    if (!t) return '';
    const contact = vipContactById(t.contactId);
    const channels = contact ? vipChannelsFor(contact) : [];
    const currentCh = t.channel || vipDefaultChannelFor(contact);
    const otherCh = channels.find(c => c !== currentCh);

    return `
        <div class="vip-sheet-backdrop" data-vip-action="back-to-preview"></div>
        <div class="vip-actions-sheet">
            <div class="vip-picker-grabber"></div>
            <div class="vip-actions-head">
                <div class="vip-actions-seat">Fila ${t.fila} · Asiento ${t.asiento}</div>
                <div class="vip-actions-recipient">${contact ? contact.name : '—'}</div>
            </div>
            <div class="vip-actions-list">
                ${otherCh ? `
                    <button class="vip-actions-row" data-vip-action="switch-channel" data-vip-channel="${otherCh}">
                        ${VIP_CHANNEL_ICON[otherCh]()}<span>Enviar por ${VIP_CHANNEL_LABEL[otherCh]} en su lugar</span>
                    </button>
                ` : `
                    <div class="vip-actions-row disabled" aria-disabled="true">
                        ${VIP_CHANNEL_ICON[currentCh]()}<span>Solo recibe por ${VIP_CHANNEL_LABEL[currentCh]}</span>
                    </div>
                `}
                <button class="vip-actions-row" data-vip-action="start-swap">
                    ${VIP_I.ticket}<span>Cambiar de asiento</span>
                </button>
                <button class="vip-actions-row" data-vip-action="start-replace">
                    ${VIP_I.person}<span>Cambiar destinatario</span>
                </button>
                <button class="vip-actions-row destructive" data-vip-action="remove-row">
                    ${VIP_I.trash}<span>Quitar de la lista</span>
                </button>
            </div>
            <button class="vip-share-cancel" data-vip-action="back-to-preview">Cancelar</button>
        </div>
    `;
}

// ── STEP 2.2 · Swap seat (pick another assigned row to swap with) ─
function renderVipSwapSeatSheet() {
    const s = state.vipShare;
    const tickets = vipTicketsForCurrentEvent();
    const draft = tickets.filter(t => t.status === 'assigned');
    const me = draft[s.activeIdx];
    const meContact = me ? vipContactById(me.contactId) : null;

    const others = draft.map((t, i) => ({ t, i })).filter(x => x.i !== s.activeIdx);

    return `
        <div class="vip-sheet-backdrop" data-vip-action="back-to-preview"></div>
        <div class="vip-picker-sheet">
            <div class="vip-picker-grabber"></div>
            <div class="vip-picker-head">
                <button class="vip-picker-cancel" data-vip-action="back-to-preview">Atrás</button>
                <div class="vip-picker-title">Elegir asiento</div>
                <div style="width:64px"></div>
            </div>
            <div class="vip-swap-hint">
                ${meContact ? `Elige con quién intercambias el asiento de <strong>${meContact.name}</strong> (Fila ${me.fila} · Asiento ${me.asiento})` : ''}
            </div>
            <div class="vip-picker-list">
                ${others.map(({ t, i }) => {
                    const c = vipContactById(t.contactId);
                    if (!c) return '';
                    return `
                        <div class="vip-picker-row" data-vip-action="do-swap" data-vip-idx="${i}">
                            ${vipAvatarHTML(c, 40)}
                            <div class="vip-picker-info">
                                <div class="name">${c.name}</div>
                                <div class="phone">Fila ${t.fila} · Asiento ${t.asiento}</div>
                            </div>
                            <div class="vip-picker-swap-ico">↔</div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ── STEP 2.3 · Replace contact (single-select picker) ────────────
function renderVipReplaceContactSheet() {
    const s = state.vipShare;
    const tickets = vipTicketsForCurrentEvent();
    const draft = tickets.filter(t => t.status === 'assigned');
    const t = draft[s.activeIdx];
    if (!t) return '';
    const currentContact = vipContactById(t.contactId);
    const usedIds = new Set(tickets
        .filter(tt => tt.contactId && tt.id !== t.id)
        .map(tt => tt.contactId));
    const q = (s.query || '').trim().toLowerCase();
    const list = VIP_CONTACTS.filter(c => !q
        || c.name.toLowerCase().includes(q)
        || c.phone.includes(q));

    return `
        <div class="vip-sheet-backdrop" data-vip-action="back-to-preview"></div>
        <div class="vip-picker-sheet">
            <div class="vip-picker-grabber"></div>
            <div class="vip-picker-head">
                <button class="vip-picker-cancel" data-vip-action="back-to-preview">Atrás</button>
                <div class="vip-picker-title">Cambiar destinatario</div>
                <div style="width:64px"></div>
            </div>
            <div class="vip-swap-hint">
                Sustituir a <strong>${currentContact ? currentContact.name : '—'}</strong> (Fila ${t.fila} · Asiento ${t.asiento})
            </div>
            <div class="vip-picker-search">
                <input type="text" placeholder="Buscar contacto"
                       value="${escapeHtml(s.query || '')}"
                       data-vip-search>
            </div>
            <div class="vip-picker-list">
                ${list.map(c => {
                    const isUsed = usedIds.has(c.id);
                    return `
                        <div class="vip-picker-row ${isUsed ? 'disabled' : ''}"
                             ${isUsed ? '' : `data-vip-action="do-replace" data-vip-contact="${c.id}"`}>
                            ${vipAvatarHTML(c, 40)}
                            <div class="vip-picker-info">
                                <div class="name">${c.name}</div>
                                <div class="phone">${isUsed ? 'Ya tiene un ticket' : c.phone}</div>
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        </div>
    `;
}

// ── Main-list actions (for sent/bound tickets) ──────────────────
function renderVipMainActionsSheet() {
    const s = state.vipShare;
    const tickets = vipTicketsForCurrentEvent();
    const t = tickets.find(x => x.id === s.mainTicketId);
    if (!t) return '';
    const contact = t.contactId ? vipContactById(t.contactId) : null;

    const actions = [];
    if (t.status === 'sent' || t.status === 'accepted') {
        actions.push({ key: 'resend',   label: 'Reenviar ticket', icon: VIP_I.mail });
        actions.push({ key: 'revoke',   label: 'Revocar ticket',  icon: VIP_I.trash, destructive: true });
    } else if (t.status === 'bound') {
        actions.push({ key: 'info',     label: 'Vinculado a ' + (contact ? contact.name : '—'), disabled: true });
    }

    return `
        <div class="vip-sheet-backdrop" data-vip-action="close-sheet"></div>
        <div class="vip-actions-sheet">
            <div class="vip-picker-grabber"></div>
            <div class="vip-actions-head">
                <div class="vip-actions-seat">Fila ${t.fila} · Asiento ${t.asiento}</div>
                ${contact ? `<div class="vip-actions-recipient">${contact.name} · ${contact.phone}</div>` : ''}
            </div>
            <div class="vip-actions-list">
                ${actions.map(a => `
                    <button class="vip-actions-row ${a.destructive ? 'destructive' : ''} ${a.disabled ? 'disabled' : ''}"
                            ${a.disabled ? 'disabled' : `data-vip-action="main-${a.key}"`}>
                        ${a.icon || ''}
                        <span>${a.label}</span>
                    </button>
                `).join('')}
            </div>
            <button class="vip-share-cancel" data-vip-action="close-sheet">Cancelar</button>
        </div>
    `;
}

// ── Disclaimer / Share / Sending / Sent ─────────────────────────
function renderVipDisclaimerSheet() {
    return `
        <div class="vip-sheet-backdrop" data-vip-action="back-to-preview"></div>
        <div class="vip-disclaimer-sheet">
            <div class="vip-disclaimer-icon">${VIP_I.ticket}</div>
            <div class="vip-disclaimer-title">Una persona, un ticket</div>
            <div class="vip-disclaimer-body">
                Por requisito de Apple, cada ticket se vincula a la cuenta de quien lo añada a su Wallet y no podrá transferirse después.
                <br><br>
                Envía un ticket a cada asistente desde su propio iPhone para que lo añada a su Wallet.
            </div>
            <button class="vip-disclaimer-cta" data-vip-action="accept-disclaimer">Entendido, enviar</button>
            <button class="vip-disclaimer-secondary" data-vip-action="back-to-preview">Atrás</button>
        </div>
    `;
}

// Channel breakdown for the current draft (or just-sent batch).
// Used by the sending and sent sheets so the user sees how the batch
// got routed across email and SMS.
function vipChannelBreakdown(ticketList) {
    const out = { email: 0, sms: 0 };
    for (const t of ticketList) {
        const ch = t.channel || vipDefaultChannelFor(vipContactById(t.contactId));
        if (ch === 'email') out.email++;
        else if (ch === 'sms') out.sms++;
    }
    return out;
}

function vipChannelBreakdownLine(breakdown) {
    const parts = [];
    if (breakdown.email > 0) parts.push(`${breakdown.email} por correo`);
    if (breakdown.sms   > 0) parts.push(`${breakdown.sms} por SMS`);
    return parts.join(' · ');
}

function renderVipSendingSheet() {
    const s = state.vipShare;
    const tickets = vipTicketsForCurrentEvent();
    // Snapshot the batch as the union of still-assigned + just-sent tickets.
    const batch = tickets.filter(t => t.status === 'assigned'
                                  || (t.status === 'sent' && (Date.now() - (t.sentAt || 0)) < 8000));
    const total = batch.length || Math.max(1, s.progress);
    const done = Math.min(s.progress, total);
    const pct = total ? Math.round((done / total) * 100) : 100;
    const breakdown = vipChannelBreakdown(batch);
    return `
        <div class="vip-sheet-backdrop"></div>
        <div class="vip-sending-sheet">
            ${renderVipFlowSteps(3)}
            <div class="vip-sending-spinner"></div>
            <div class="vip-sending-title">Enviando tickets…</div>
            <div class="vip-sending-count">${done} / ${total}</div>
            <div class="vip-sending-bar"><div class="fill" style="width:${pct}%"></div></div>
            <div class="vip-sending-breakdown">${vipChannelBreakdownLine(breakdown)}</div>
        </div>
    `;
}

function renderVipSentSheet() {
    const tickets = vipTicketsForCurrentEvent();
    const sent = tickets.filter(t => ['sent', 'accepted', 'bound'].includes(t.status));
    const breakdown = vipChannelBreakdown(sent);
    return `
        <div class="vip-sheet-backdrop" data-vip-action="close-sheet"></div>
        <div class="vip-sent-sheet">
            <div class="vip-sent-check">
                <svg viewBox="0 0 32 32" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"><polyline points="7,17 14,24 26,10"/></svg>
            </div>
            <div class="vip-sent-title">¡Tickets enviados!</div>
            <div class="vip-sent-body">
                Hemos enviado ${sent.length} ticket${sent.length === 1 ? '' : 's'}: ${vipChannelBreakdownLine(breakdown)}.
                Recibirás una notificación cuando cada persona añada el suyo a su Wallet.
            </div>
            <button class="vip-disclaimer-cta" data-vip-action="close-sheet">Volver a mis tickets</button>
        </div>
    `;
}

function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
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
    // Only run when the VIP app is selected — otherwise we would clobber
    // the Fan App's news/video/summary sheet injected by render().
    if (state.app !== 'vip') return;

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

    // Multi-ticket share sheets (feature flag)
    let shareHTML = '';
    if (Flags.isEnabled('vip.tickets.multi-share')) {
        shareHTML = renderVipShareSheets();
    }

    // We'll drop all VIP sheets into #newsSheetSlot (repurpose it as a sheet slot)
    // Wrap in .vip-app so CSS variables cascade
    const html = restoHTML + perfilHTML + shareHTML;
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

/**
 * Change VIP navigation state while preserving scroll-per-tab independence.
 *
 * The scroll container (#screenBody) is shared across VIP tabs and is just
 * repainted on re-render, so without this its scrollTop would leak between
 * tabs. We keep a memory slot per TOP-LEVEL tab (inicio / eventos list /
 * gestor / perfil) and reset to the top when entering a detail/tickets
 * screen — the standard iOS push-navigation feel.
 *
 *   - Leaving a "listish" screen  → save its scrollTop for that tab
 *   - Entering a "listish" screen → restore the saved scrollTop
 *   - Entering a detail/tickets   → scroll to the top
 *
 * "Listish" = inicio / gestor / perfil / eventos-list. Detail + tickets
 * are push-stack screens, not restoration targets.
 */
function switchVipTab(mutator) {
    const screenBody = $('#screenBody');
    const fromTab = state.vipTab;
    const fromIsListish = state.vipEventScreen === 'list' || fromTab !== 'eventos';

    if (screenBody && fromIsListish && fromTab in state.vipScrollPositions) {
        state.vipScrollPositions[fromTab] = screenBody.scrollTop;
    }

    mutator();
    render();

    const sb2 = $('#screenBody');
    if (!sb2) return;

    const toTab = state.vipTab;
    const toIsListish = state.vipEventScreen === 'list' || toTab !== 'eventos';

    if (toIsListish && toTab in state.vipScrollPositions) {
        sb2.scrollTop = state.vipScrollPositions[toTab] || 0;
    } else {
        // Detail / tickets — always start at the top
        sb2.scrollTop = 0;
    }
}

function attachVipListeners() {
    // VIP tab bar
    $$('[data-vip-tab]').forEach(btn => btn.addEventListener('click', () => {
        switchVipTab(() => {
            state.vipTab = btn.dataset.vipTab;
            state.vipEventScreen = 'list';
            state.vipPerfilOpen = false;
        });
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
        switchVipTab(() => {
            state.vipTab = 'eventos';
            state.vipEventScreen = 'list';
        });
    }));

    // Event card → detail
    $$('[data-vip-event-id]').forEach(el => el.addEventListener('click', e => {
        // Ignore if the click came from a button inside (handled separately)
        if (e.target.closest('[data-vip-open-event], [data-vip-open-tickets]')) return;
        switchVipTab(() => {
            state.vipEventId = parseInt(el.dataset.vipEventId);
            state.vipTab = 'eventos';
            state.vipEventScreen = 'detail';
        });
    }));

    $$('[data-vip-open-event]').forEach(btn => btn.addEventListener('click', e => {
        e.stopPropagation();
        switchVipTab(() => {
            state.vipEventId = parseInt(btn.dataset.vipOpenEvent);
            state.vipTab = 'eventos';
            state.vipEventScreen = 'tickets';
        });
    }));

    $$('[data-vip-open-tickets]').forEach(btn => btn.addEventListener('click', () => {
        // Forward push — route through switchVipTab so the new screen lands
        // at the top instead of inheriting the previous screen's scroll.
        switchVipTab(() => { state.vipEventScreen = 'tickets'; });
    }));

    $$('[data-vip-back]').forEach(btn => btn.addEventListener('click', () => {
        // Pop back — routed through switchVipTab so returning to the list
        // restores the list's saved scroll position, while intermediate
        // push screens (detail) always start at the top.
        switchVipTab(() => {
            if (state.vipEventScreen === 'tickets') state.vipEventScreen = 'detail';
            else if (state.vipEventScreen === 'detail') state.vipEventScreen = 'list';
        });
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

    // ── Multi-ticket share (flag: vip.tickets.multi-share) ────────
    attachVipShareListeners();
}

// ── VIP multi-ticket share: single delegated click handler ───────
// Installed once on document. Every interactive element in the share
// flow declares `data-vip-action="…"` (plus optional data attributes).
let _vipShareDelegateInstalled = false;

function attachVipShareListeners() {
    if (!Flags.isEnabled('vip.tickets.multi-share')) return;

    // Install the delegated handlers once on document. They survive
    // every re-render because they are not attached to inner DOM.
    if (!_vipShareDelegateInstalled) {
        document.addEventListener('click', handleVipShareClick);
        document.addEventListener('input', handleVipShareInput);
        _vipShareDelegateInstalled = true;
    }
}

function handleVipShareClick(e) {
    const target = e.target.closest('[data-vip-action]');
    if (!target) return;
    // Ignore clicks on disabled elements
    if (target.classList.contains('disabled') || target.disabled) return;
    const action = target.dataset.vipAction;
    if (!action) return;

    const s = state.vipShare;
    const tickets = vipTicketsForCurrentEvent();

    switch (action) {
        // ── Top bar PALCO 4101 ▾ pill ────────────────────────────
        case 'toggle-palco-sheet': {
            state.vipPalcoSheetOpen = !state.vipPalcoSheetOpen;
            render();
            return;
        }

        // ── Entry points from the main tickets screen ─────────────
        case 'open-picker': {
            // Reset picker state up front so the permission gate and the
            // picker share a clean slate.
            s.selection = [];
            s.query = '';
            s.keepMine = true;
            // Gate the very first entry behind the iOS-style contacts
            // permission prompt. Subsequent entries skip it.
            if (!vipReadContactsPermission()) {
                s.step = 'permission';
            } else {
                s.step = 'picker';
            }
            render();
            return;
        }
        case 'allow-contacts': {
            vipWriteContactsPermission(true);
            s.step = 'picker';
            render();
            return;
        }
        case 'deny-contacts': {
            // No permission → there's nothing useful to show; close the flow.
            closeSheet();
            return;
        }
        case 'open-preview': {
            s.step = 'preview';
            render();
            return;
        }
        case 'repeat-last': {
            if (!VIP_LAST_GROUP) return;
            const mutable = tickets.filter(t => ['unassigned', 'mine'].includes(t.status));
            mutable.forEach(t => { t.status = 'unassigned'; t.contactId = null; t.sentAt = null; });
            let offset = 0;
            if (mutable.length > VIP_LAST_GROUP.contactIds.length) {
                mutable[0].status = 'mine';
                offset = 1;
            }
            VIP_LAST_GROUP.contactIds.forEach((cid, i) => {
                const t = mutable[offset + i];
                if (t) {
                    t.status = 'assigned';
                    t.contactId = cid;
                    t.channel = vipDefaultChannelFor(vipContactById(cid));
                }
            });
            s.step = 'preview';
            render();
            return;
        }
        case 'main-actions': {
            s.mainTicketId = target.dataset.vipTicketId;
            s.step = 'main-actions';
            render();
            return;
        }
        case 'main-resend': {
            const t = tickets.find(x => x.id === s.mainTicketId);
            if (t) t.sentAt = Date.now();
            closeSheet();
            return;
        }
        case 'main-revoke': {
            const t = tickets.find(x => x.id === s.mainTicketId);
            if (t) { t.contactId = null; t.status = 'unassigned'; t.sentAt = null; }
            closeSheet();
            return;
        }

        // ── Picker ───────────────────────────────────────────────
        case 'toggle-contact': {
            const cid = target.dataset.vipContact;
            const mutableCount = tickets.filter(t => ['unassigned', 'mine'].includes(t.status)).length;
            const max = s.keepMine ? Math.max(0, mutableCount - 1) : mutableCount;
            const idx = s.selection.indexOf(cid);
            if (idx >= 0) {
                s.selection.splice(idx, 1);
            } else if (s.selection.length < max) {
                s.selection.push(cid);
            }
            render();
            return;
        }
        case 'toggle-keep-mine': {
            s.keepMine = !s.keepMine;
            // Trim selection if it now exceeds the cap
            const mutableCount = tickets.filter(t => ['unassigned', 'mine'].includes(t.status)).length;
            const max = s.keepMine ? Math.max(0, mutableCount - 1) : mutableCount;
            if (s.selection.length > max) s.selection = s.selection.slice(0, max);
            render();
            return;
        }
        case 'commit-picker': {
            commitPickerAssignment();
            s.step = 'preview';
            s.selection = [];
            s.query = '';
            render();
            return;
        }

        // ── Preview / row actions ────────────────────────────────
        case 'cancel-preview': {
            // Undo the draft: any 'assigned' tickets go back to unassigned
            tickets.forEach(t => {
                if (t.status === 'assigned') {
                    t.status = 'unassigned';
                    t.contactId = null;
                    t.sentAt = null;
                }
            });
            closeSheet();
            return;
        }
        case 'open-row-actions': {
            s.activeIdx = parseInt(target.dataset.vipIdx, 10);
            s.step = 'row-actions';
            render();
            return;
        }
        case 'start-swap': {
            s.step = 'swap-seat';
            render();
            return;
        }
        case 'do-swap': {
            const draft = tickets.filter(t => t.status === 'assigned');
            const a = draft[s.activeIdx];
            const b = draft[parseInt(target.dataset.vipIdx, 10)];
            if (a && b) {
                const tmp = a.contactId;
                a.contactId = b.contactId;
                b.contactId = tmp;
            }
            s.step = 'preview';
            s.activeIdx = null;
            render();
            return;
        }
        case 'start-replace': {
            s.step = 'replace-contact';
            s.query = '';
            render();
            return;
        }
        case 'do-replace': {
            const draft = tickets.filter(t => t.status === 'assigned');
            const t = draft[s.activeIdx];
            const cid = target.dataset.vipContact;
            if (t && cid) {
                t.contactId = cid;
                // Re-route channel to the new contact's preferred channel.
                t.channel = vipDefaultChannelFor(vipContactById(cid));
            }
            s.step = 'preview';
            s.activeIdx = null;
            render();
            return;
        }
        case 'switch-channel': {
            const draft = tickets.filter(t => t.status === 'assigned');
            const t = draft[s.activeIdx];
            const ch = target.dataset.vipChannel;
            if (t && ch) t.channel = ch;
            s.step = 'preview';
            s.activeIdx = null;
            render();
            return;
        }
        case 'remove-row': {
            const draft = tickets.filter(t => t.status === 'assigned');
            const t = draft[s.activeIdx];
            if (t) { t.status = 'unassigned'; t.contactId = null; }
            s.step = 'preview';
            s.activeIdx = null;
            render();
            return;
        }
        case 'back-to-preview': {
            s.step = 'preview';
            s.activeIdx = null;
            s.query = '';
            render();
            return;
        }

        // ── Send pipeline ────────────────────────────────────────
        // The channel sheet was removed: each ticket carries its own
        // routed channel (email/SMS) since commitPickerAssignment, and
        // the user can override it from the preview row. So confirm-send
        // goes either to the disclaimer (first time) or straight to the
        // sending animation.
        case 'confirm-send': {
            if (s.disclaimerSeen) startBatchSend();
            else { s.step = 'disclaimer'; render(); }
            return;
        }
        case 'accept-disclaimer': {
            s.disclaimerSeen = true;
            startBatchSend();
            return;
        }

        // ── Generic close ────────────────────────────────────────
        case 'close-sheet': {
            closeSheet();
            return;
        }
    }
}

function handleVipShareInput(e) {
    if (!e.target.matches || !e.target.matches('[data-vip-search]')) return;
    state.vipShare.query = e.target.value;
    // Filter list in place without re-render (keeps caret/focus)
    const list = e.target.closest('.vip-picker-sheet')?.querySelector('.vip-picker-list');
    if (!list) return;
    const q = state.vipShare.query.trim().toLowerCase();
    list.querySelectorAll('.vip-picker-row').forEach(row => {
        const name = row.querySelector('.name')?.textContent?.toLowerCase() || '';
        const phone = row.querySelector('.phone')?.textContent?.toLowerCase() || '';
        const match = !q || name.includes(q) || phone.includes(q);
        row.style.display = match ? '' : 'none';
    });
}

function commitPickerAssignment() {
    const s = state.vipShare;
    const tickets = vipTicketsForCurrentEvent();
    // Mutable slots are current 'mine' + 'unassigned' tickets
    const mutable = tickets.filter(t => ['unassigned', 'mine'].includes(t.status));
    mutable.forEach(t => { t.status = 'unassigned'; t.contactId = null; t.sentAt = null; });

    let offset = 0;
    if (s.keepMine && mutable.length > 0) {
        mutable[0].status = 'mine';
        offset = 1;
    }
    s.selection.forEach((cid, i) => {
        const t = mutable[offset + i];
        if (t) {
            t.status = 'assigned';
            t.contactId = cid;
            // Auto-route on the channel preferred by this contact
            // (email when available, SMS as fallback). Stored on the
            // ticket so the user can override it from the preview row.
            t.channel = vipDefaultChannelFor(vipContactById(cid));
        }
    });
}

function closeSheet() {
    const s = state.vipShare;
    s.step = null;
    s.selection = [];
    s.query = '';
    s.activeIdx = null;
    s.mainTicketId = null;
    s.progress = 0;
    render();
}

// Each draft ticket already carries its routed `channel` (set at
// commitPickerAssignment / switch-channel / do-replace). The send
// loop just walks through them and respects whatever was chosen.
function startBatchSend() {
    const s = state.vipShare;
    s.step = 'sending';
    s.progress = 0;
    render();

    const tickets = vipTicketsForCurrentEvent();
    const assigned = tickets.filter(t => t.status === 'assigned');
    const total = assigned.length;
    let i = 0;

    const tick = () => {
        if (state.vipShare.step !== 'sending') return; // user navigated away
        if (i >= total) {
            // Remember group
            VIP_LAST_GROUP = {
                eventLabel: (VIP_EVENTS.find(e => e.id === state.vipEventId) || VIP_EVENTS[0]).away,
                contactIds: assigned.map(t => t.contactId).filter(Boolean)
            };
            s.step = 'sent';
            render();
            return;
        }
        assigned[i].status = 'sent';
        assigned[i].sentAt = Date.now();
        // channel already set at draft time (auto-routed or overridden)
        if (!assigned[i].channel) {
            assigned[i].channel = vipDefaultChannelFor(vipContactById(assigned[i].contactId));
        }
        i++;
        s.progress = i;
        render();
        setTimeout(tick, 160);
    };
    setTimeout(tick, 240);
}

// ── SIDE MENU (¡Hola!) ──────────────────────────────────────────
function renderSideMenu() {
    return Flags.isEnabled('fan.sidemenu.v2')
        ? renderSideMenuV2()
        : renderSideMenuV1();
}

function renderSideMenuV1() {
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

// ================================================================
// Side menu V2 — estructura escalable
// ----------------------------------------------------------------
//  · Header: avatar + saludo + CTA de login compacta.
//  · Buscador de ajustes (filtra las secciones en vivo).
//  · Accesos rápidos (Carnet / Entradas / Radio / Cerca / Tienda).
//  · Secciones agrupadas: Tu cuenta · Preferencias · App · Ayuda · Legal.
//  · Footer: sponsors + versión en una línea.
//
// Añadir nuevas opciones es cuestión de meter un item en `_v2Sections`.
// ================================================================

function renderSideMenuV2() {
    // Sub-flags anidados bajo `fan.sidemenu.v2`
    const fSearch       = Flags.isEnabled('fan.sidemenu.v2.search');
    const fQuickActions = Flags.isEnabled('fan.sidemenu.v2.quick-actions');

    const q = fSearch ? (state.sideMenuSearch || '').trim().toLowerCase() : '';
    const sections = _v2Sections().map(sec => ({
        ...sec,
        items: q
            ? sec.items.filter(it => it.title.toLowerCase().includes(q))
            : sec.items
    })).filter(sec => sec.items.length > 0);

    const detailHTML = state.sideMenuDetail
        ? renderSideMenuV2Detail(state.sideMenuDetail)
        : '';

    return `
        <div class="side-menu-overlay v2 ${state.sideMenuOpen ? 'visible' : ''}" id="sideMenuOverlay">
            <div class="side-menu-dim" id="sideMenuDim"></div>
            <div class="side-menu-panel v2">

                <div class="sm2-topbar">
                    <button class="sm2-close" id="sideMenuClose" aria-label="Cerrar">${I.xmark}</button>
                    <div class="sm2-topbar-title">Tu área</div>
                    <div class="sm2-topbar-spacer"></div>
                </div>

                <div class="sm2-scroll">
                    <div class="sm2-header">
                        <div class="sm2-avatar">${I.person}</div>
                        <div class="sm2-header-text">
                            <div class="sm2-hello">¡Hola!</div>
                            <div class="sm2-hello-sub">Inicia sesión para personalizar tu experiencia</div>
                        </div>
                    </div>
                    <button class="sm2-login">
                        Inicia sesión o regístrate ${I.arrowRight}
                    </button>

                    ${fSearch ? `
                        <label class="sm2-search">
                            ${I.search}
                            <input type="search" id="sideMenuSearch" placeholder="Buscar en ajustes"
                                   value="${state.sideMenuSearch || ''}">
                        </label>
                    ` : ''}

                    ${fQuickActions && !q ? `
                        <div class="sm2-quick">
                            ${[
                                { icon: I.star,       label: 'Carnet',   detail: 'carnet' },
                                { icon: I.calendar,   label: 'Entradas', detail: 'entradas' },
                                { icon: I.radio,      label: 'Radio',    detail: 'radio' },
                                { icon: I.photo,      label: 'Cerca',    detail: 'cerca' },
                                { icon: I.cart,       label: 'Tienda',   detail: 'tienda-quick' }
                            ].map(qi => `
                                <button class="sm2-quick-btn" data-sm2-detail="${qi.detail}">
                                    <span class="sm2-quick-icon">${qi.icon}</span>
                                    <span class="sm2-quick-label">${qi.label}</span>
                                </button>
                            `).join('')}
                        </div>
                    ` : ''}

                    ${sections.map(sec => `
                        <div class="sm2-section">
                            <div class="sm2-section-title">${sec.title}</div>
                            <div class="sm2-section-card">
                                ${sec.items.map((it, i) => {
                                    const attrs = it.action
                                        ? `data-sm2-action="${it.action}"`
                                        : (it.detail ? `data-sm2-detail="${it.detail}"` : '');
                                    return `
                                        <button class="sm2-row" ${attrs}>
                                            <span class="sm2-row-icon">${it.icon}</span>
                                            <span class="sm2-row-title">${it.title}</span>
                                            ${it.badge ? `<span class="sm2-row-badge">${it.badge}</span>` : ''}
                                            ${it.trailing ? `<span class="sm2-row-trailing">${it.trailing}</span>` : ''}
                                            <span class="sm2-row-chev">${I.chevronRight}</span>
                                        </button>
                                        ${i < sec.items.length - 1 ? '<div class="sm2-row-sep"></div>' : ''}
                                    `;
                                }).join('')}
                            </div>
                        </div>
                    `).join('')}

                    ${sections.length === 0 ? `
                        <div class="sm2-empty">No hay resultados para «${q}».</div>
                    ` : ''}

                    <div class="sm2-footer">
                        <div class="sm2-footer-sponsors">
                            <span class="sm2-sponsor-emirates">${I.airplane} Emirates</span>
                            <span class="sm2-sponsor-adidas"><span></span><span></span><span></span></span>
                        </div>
                        <div class="sm2-footer-version">10.2.11 (15970)</div>
                    </div>
                </div>

                ${detailHTML}
            </div>
        </div>
    `;
}

function _v2Sections() {
    const fPreferences = Flags.isEnabled('fan.sidemenu.v2.preferences');
    const fSupport     = Flags.isEnabled('fan.sidemenu.v2.support');

    // La sección "Tu cuenta" siempre está presente — es el núcleo.
    const sections = [
        { title: 'TU CUENTA', items: [
            { icon: I.person,       title: 'Mi perfil',             detail: 'perfil' },
            { icon: I.calendar,     title: 'Mis entradas',          detail: 'entradas' },
            { icon: I.cart,         title: 'Carnet digital',        detail: 'carnet' },
            { icon: I.star,         title: 'Socios & Madridistas',  detail: 'socios' }
        ]}
    ];

    if (fPreferences) {
        const preferences = [
            { icon: I.star,       title: 'Equipos favoritos', detail: 'equipos-favoritos' },
            { icon: I.figureRun,  title: 'Notificaciones',    detail: 'notificaciones', badge: '3' },
            { icon: I.doc,        title: 'Idioma',            detail: 'idioma',         trailing: 'Español' },
            { icon: I.photo,      title: 'Apariencia',        detail: 'apariencia',     trailing: 'Sistema' }
        ];
        if (Flags.isEnabled('fan.hoy.team-tabs') && Flags.isEnabled('fan.hoy.team-tabs.editor')) {
            preferences.push({
                icon: I.slider,
                title: 'Editar pestañas de Hoy',
                action: 'open-hoy-tabs-editor'
            });
        }
        sections.push({ title: 'PREFERENCIAS', items: preferences });
    }

    // La sección App siempre va — contiene Configuración, que es crítico.
    sections.push({ title: 'APP', items: [
        { icon: I.gear,         title: 'Configuración de la app', detail: 'config-app' },
        { icon: I.sportscourt,  title: 'Novedades',               detail: 'novedades' },
        { icon: I.thumbUp,      title: 'Valorar la app',          detail: 'valorar' }
    ]});

    if (fSupport) {
        sections.push({ title: 'AYUDA', items: [
            { icon: I.doc,          title: 'Centro de ayuda', detail: 'ayuda' },
            { icon: I.photo,        title: 'Contacto',        detail: 'contacto' },
            { icon: I.thumbUp,      title: 'Danos tu opinión', detail: 'opinion' }
        ]});
        sections.push({ title: 'LEGAL', items: [
            { icon: I.doc,          title: 'Términos y condiciones', detail: 'terminos' },
            { icon: I.doc,          title: 'Privacidad',             detail: 'privacidad' },
            { icon: I.doc,          title: 'Cookies',                detail: 'cookies' }
        ]});
    }

    return sections;
}

// ================================================================
// Side Menu v2 — contenido ficticio al pulsar una opción.
// Flag `fan.sidemenu.v2.mock-detail` habilita esta navegación.
// ================================================================

const SM2_MOCK_DETAILS = {
    perfil: {
        title: 'Mi perfil', icon: 'person',
        hero: { kicker: 'Socio desde 2018', name: 'Marcos Novo' },
        fields: [
            { label: 'Email',            value: 'marcos.novo@email.com' },
            { label: 'Número de socio',  value: '48 219' },
            { label: 'Tier',             value: 'Madridista Premium' },
            { label: 'Fecha de alta',    value: '12 de agosto de 2018' }
        ]
    },
    entradas: {
        title: 'Mis entradas', icon: 'calendar',
        list: [
            { top: 'Champions League · Vuelta',      middle: 'Bayern Múnich · Real Madrid', bottom: 'Mié 15 abr · 21:00 · Allianz Arena', right: 'Tribuna · Fila 14 · A12' },
            { top: 'LaLiga EA Sports · Jornada 33',  middle: 'Real Madrid · Celta de Vigo', bottom: 'Jue 17 abr · 21:00 · Santiago Bernabéu', right: 'Lateral · Fila 8 · 117' }
        ]
    },
    carnet: {
        title: 'Carnet digital', icon: 'cart',
        hero: { kicker: 'Madridista #48 219', name: 'Marcos Novo' },
        paragraphs: [
            'Presenta este carnet digital en las taquillas y tornos del Santiago Bernabéu para acceder a las áreas de Madridistas.',
            'Válido hasta el 30 de junio de 2026.'
        ]
    },
    socios: {
        title: 'Socios & Madridistas', icon: 'star',
        paragraphs: [
            'Forma parte de la familia madridista con ventajas exclusivas: preventa de entradas, descuentos en la tienda y contenido premium en Realmadrid TV.',
            'Puedes consultar tus puntos y canjearlos por experiencias únicas en el estadio.'
        ],
        list: [
            { top: 'Tus puntos', middle: '1 240 pts', bottom: 'Nivel 3 de 5',         right: '' },
            { top: 'Ventajas',   middle: '12 activas', bottom: 'Ver catálogo completo', right: '' }
        ]
    },
    'equipos-favoritos': {
        title: 'Equipos favoritos', icon: 'star',
        paragraphs: ['Elige qué equipos quieres seguir. Las noticias, partidos y highlights de la app se priorizarán según tu selección.'],
        toggles: [
            { label: 'Fútbol masculino',  sub: 'Primer equipo',       on: true },
            { label: 'Fútbol femenino',   sub: 'Liga F · Champions',  on: true },
            { label: 'Baloncesto',        sub: 'ACB · Euroliga',      on: true },
            { label: 'Castilla',          sub: 'Primera Federación',  on: false },
            { label: 'Juvenil A',         sub: 'UEFA Youth League',   on: false }
        ]
    },
    notificaciones: {
        title: 'Notificaciones', icon: 'radio',
        paragraphs: ['Recibe alertas de lo que más te importa.'],
        toggles: [
            { label: 'Goles del partido',       sub: 'Notificación al marcar',     on: true },
            { label: 'Alineaciones',            sub: '1 hora antes del partido',   on: true },
            { label: 'Resumen post-partido',    sub: 'Al terminar el encuentro',   on: false },
            { label: 'Ofertas de la tienda',    sub: 'Promociones y rebajas',      on: false },
            { label: 'Noticias urgentes',       sub: 'Fichajes y fundamentales',   on: true }
        ]
    },
    idioma: {
        title: 'Idioma', icon: 'doc',
        radio: [
            { label: 'Español',  selected: true },
            { label: 'English',  selected: false },
            { label: 'Français', selected: false },
            { label: 'Deutsch',  selected: false },
            { label: '日本語',    selected: false }
        ]
    },
    apariencia: {
        title: 'Apariencia', icon: 'photo',
        radio: [
            { label: 'Sistema', sub: 'Sigue la configuración del dispositivo', selected: true },
            { label: 'Claro',   sub: 'Siempre modo claro',                     selected: false },
            { label: 'Oscuro',  sub: 'Siempre modo oscuro',                    selected: false }
        ]
    },
    'config-app': {
        title: 'Configuración de la app', icon: 'gear',
        toggles: [
            { label: 'Datos móviles',          sub: 'Usar datos fuera del WiFi',          on: true },
            { label: 'Reproducción automática', sub: 'Vídeos al hacer scroll',             on: true },
            { label: 'Analítica anónima',      sub: 'Ayúdanos a mejorar la app',          on: true },
            { label: 'Modo ahorro de datos',   sub: 'Baja la calidad de imagen',          on: false }
        ]
    },
    novedades: {
        title: 'Novedades', icon: 'sportscourt',
        paragraphs: ['Qué hay nuevo en la versión 10.2.11:'],
        list: [
            { top: 'Hoy v2',          middle: 'Nueva estructura modular',                 bottom: 'Scroll vertical · cards rediseñadas' },
            { top: 'Pestañas equipo',  middle: 'Filtra Hoy por deporte',                   bottom: 'Todo · Fútbol masc. · Fútbol fem. · Baloncesto' },
            { top: 'RM Play',          middle: 'Nueva Realmadrid TV',                      bottom: 'Layout tipo plataforma OTT' },
            { top: 'Side menu v2',     middle: 'Menú lateral escalable',                   bottom: 'Secciones agrupadas + buscador' }
        ]
    },
    valorar: {
        title: 'Valorar la app', icon: 'thumbUp',
        paragraphs: ['¿Cómo está siendo tu experiencia? Tu valoración en la App Store nos ayuda a mejorar cada actualización.'],
        stars: true
    },
    ayuda: {
        title: 'Centro de ayuda', icon: 'doc',
        paragraphs: ['Preguntas frecuentes:'],
        list: [
            { top: '¿Cómo cambio mi tier?',          middle: 'Puedes gestionar tu abono desde realmadrid.com', bottom: 'Abre web' },
            { top: '¿Dónde está mi entrada?',        middle: 'En la pestaña "Mis entradas"',                   bottom: '' },
            { top: 'La app se cierra sola',          middle: 'Actualiza a la última versión',                  bottom: '' },
            { top: 'No recibo notificaciones',       middle: 'Revisa los permisos del sistema',                bottom: 'Abrir ajustes' }
        ]
    },
    contacto: {
        title: 'Contacto', icon: 'photo',
        paragraphs: ['Nuestro equipo de atención responde en menos de 24 h.'],
        fields: [
            { label: 'Email',              value: 'ayuda@realmadrid.com' },
            { label: 'Teléfono',           value: '+34 913 984 300' },
            { label: 'Horario',            value: 'L-V · 9:00 - 20:00' }
        ]
    },
    opinion: {
        title: 'Danos tu opinión', icon: 'thumbUp',
        paragraphs: ['¿Qué te está pareciendo la app? Tu feedback llega directo al equipo de producto.'],
        stars: true
    },
    terminos: {
        title: 'Términos y condiciones', icon: 'doc',
        paragraphs: [
            'Última actualización: 1 de marzo de 2026.',
            'El uso de la aplicación Real Madrid está sujeto a los términos que recogen la relación entre el Club y el Usuario.',
            'Al descargar, instalar o utilizar la app aceptas íntegramente estos términos, incluidas las políticas de privacidad y cookies.',
            'Texto completo disponible en realmadrid.com/terminos.'
        ]
    },
    privacidad: {
        title: 'Privacidad', icon: 'doc',
        paragraphs: [
            'Real Madrid CF es el responsable del tratamiento de tus datos personales.',
            'Utilizamos los datos para prestar los servicios de la app, personalizar el contenido y mantener la seguridad del servicio.',
            'Puedes ejercer los derechos de acceso, rectificación y supresión en privacidad@realmadrid.com.'
        ]
    },
    cookies: {
        title: 'Cookies', icon: 'doc',
        toggles: [
            { label: 'Técnicas',     sub: 'Necesarias · no se pueden desactivar', on: true, disabled: true },
            { label: 'Preferencias', sub: 'Idioma, tema y configuración',         on: true },
            { label: 'Analíticas',   sub: 'Medir uso y rendimiento',              on: true },
            { label: 'Marketing',    sub: 'Personalizar anuncios',                on: false }
        ]
    },
    radio: {
        title: 'Radio', icon: 'radio',
        paragraphs: ['Escucha los partidos narrados por la radio oficial del club y entrevistas exclusivas en directo.'],
        list: [
            { top: 'Ahora en directo', middle: 'Hoy Jugamos · Previa Bayern-RM', bottom: '85 800 oyentes',  right: 'EN VIVO' },
            { top: 'Programado',       middle: 'Post-partido · Tertulia',         bottom: 'Mié 23:00',        right: '' }
        ]
    },
    cerca: {
        title: 'Cerca de mí', icon: 'photo',
        paragraphs: ['Encuentra tiendas oficiales, bares madridistas y experiencias del club cerca de tu ubicación.'],
        list: [
            { top: 'Tienda oficial Gran Vía', middle: 'Gran Vía 31, Madrid',        bottom: 'Abierto · a 1,2 km' },
            { top: 'Tour Bernabéu',           middle: 'Santiago Bernabéu',          bottom: 'Abierto · a 4,8 km' },
            { top: 'Peña Madridista Centro',  middle: 'Bar La Blanca',              bottom: 'Abierto · a 800 m' }
        ]
    },
    'tienda-quick': {
        title: 'Tienda', icon: 'cart',
        paragraphs: ['Las últimas equipaciones, calzado y accesorios oficiales del Real Madrid. Envío gratuito a partir de 50€.'],
        list: [
            { top: 'Camiseta 1ª equipación 25/26', middle: '99,95 €',                bottom: 'Todas las tallas disponibles' },
            { top: 'Chaqueta Tiro 24',             middle: '64,95 €',                bottom: 'Edición limitada' },
            { top: 'Balón oficial LaLiga 25/26',   middle: '29,95 €',                bottom: 'Stock: 12 unidades' }
        ]
    }
};

function renderSideMenuV2Detail(key) {
    const d = SM2_MOCK_DETAILS[key];
    if (!d) return '';
    const iconMarkup = I[d.icon] || I.doc;

    return `
        <div class="sm2-detail" data-sm2-detail-sheet>
            <div class="sm2-detail-head">
                <button class="sm2-detail-back" data-sm2-detail-close aria-label="Volver">
                    ${I.chevronLeft} Atrás
                </button>
                <div class="sm2-detail-title">${d.title}</div>
            </div>
            <div class="sm2-detail-scroll">
                <div class="sm2-detail-hero">
                    <div class="sm2-detail-hero-icon">${iconMarkup}</div>
                    ${d.hero ? `
                        <div class="sm2-detail-hero-text">
                            <div class="sm2-detail-hero-kicker">${d.hero.kicker}</div>
                            <div class="sm2-detail-hero-name">${d.hero.name}</div>
                        </div>
                    ` : `
                        <div class="sm2-detail-hero-text">
                            <div class="sm2-detail-hero-name">${d.title}</div>
                        </div>
                    `}
                </div>

                ${(d.paragraphs || []).map(p => `<p class="sm2-detail-p">${p}</p>`).join('')}

                ${d.fields ? `
                    <div class="sm2-detail-card">
                        ${d.fields.map(f => `
                            <div class="sm2-detail-field">
                                <span class="sm2-detail-field-label">${f.label}</span>
                                <span class="sm2-detail-field-value">${f.value}</span>
                            </div>
                        `).join('')}
                    </div>
                ` : ''}

                ${d.list ? `
                    <div class="sm2-detail-card">
                        ${d.list.map((it, i) => `
                            <div class="sm2-detail-list-row">
                                <div class="sm2-detail-list-main">
                                    <div class="sm2-detail-list-top">${it.top || ''}</div>
                                    <div class="sm2-detail-list-middle">${it.middle || ''}</div>
                                    ${it.bottom ? `<div class="sm2-detail-list-bottom">${it.bottom}</div>` : ''}
                                </div>
                                ${it.right ? `<div class="sm2-detail-list-right">${it.right}</div>` : ''}
                            </div>
                            ${i < d.list.length - 1 ? '<div class="sm2-detail-list-sep"></div>' : ''}
                        `).join('')}
                    </div>
                ` : ''}

                ${d.toggles ? `
                    <div class="sm2-detail-card">
                        ${d.toggles.map((t, i) => `
                            <div class="sm2-detail-toggle-row ${t.disabled ? 'disabled' : ''}">
                                <div class="sm2-detail-toggle-text">
                                    <div class="sm2-detail-toggle-label">${t.label}</div>
                                    ${t.sub ? `<div class="sm2-detail-toggle-sub">${t.sub}</div>` : ''}
                                </div>
                                <span class="sm2-detail-switch ${t.on ? 'on' : ''}"></span>
                            </div>
                            ${i < d.toggles.length - 1 ? '<div class="sm2-detail-list-sep"></div>' : ''}
                        `).join('')}
                    </div>
                ` : ''}

                ${d.radio ? `
                    <div class="sm2-detail-card">
                        ${d.radio.map((r, i) => `
                            <div class="sm2-detail-radio-row">
                                <div class="sm2-detail-toggle-text">
                                    <div class="sm2-detail-toggle-label">${r.label}</div>
                                    ${r.sub ? `<div class="sm2-detail-toggle-sub">${r.sub}</div>` : ''}
                                </div>
                                <span class="sm2-detail-radio ${r.selected ? 'selected' : ''}"></span>
                            </div>
                            ${i < d.radio.length - 1 ? '<div class="sm2-detail-list-sep"></div>' : ''}
                        `).join('')}
                    </div>
                ` : ''}

                ${d.stars ? `
                    <div class="sm2-detail-stars">
                        <span>★</span><span>★</span><span>★</span><span>★</span><span>☆</span>
                    </div>
                ` : ''}

                <div style="height: 28px"></div>
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
            case 'hoy':
                content = Flags.isEnabled('fan.hoy.v2-structure')
                    ? renderHoyV2()
                    : renderHoy();
                break;
            case 'noticias':   content = renderNoticias();   break;
            case 'calendario': content = renderCalendario(); break;
            case 'rmtv':       content = Flags.isEnabled('fan.rmtv.play')
                ? renderRMPlay()
                : renderRMTV();
                break;
            case 'tienda':     content = renderTienda();     break;
        }
        tabBarHTML = renderTabBar();
    }

    body.innerHTML = content;
    $('#tabBarSlot').innerHTML = tabBarHTML;

    // Cabecera global de login (flag `fan.app.login-header`).
    // Aparece persistente en todas las pestañas de la Fan App.
    const topbarSlot = $('#appTopbarSlot');
    if (topbarSlot) {
        topbarSlot.innerHTML = (state.app === 'fan' && Flags.isEnabled('fan.app.login-header'))
            ? renderAppLoginBar()
            : '';
        topbarSlot.classList.toggle('visible', topbarSlot.innerHTML !== '');

        // Mide la altura real del topbar y la expone como custom property
        // para que el CSS empuje `screen-body` exactamente lo necesario.
        const phoneScreen = $('#phoneScreen');
        if (phoneScreen) {
            const apply = () => {
                const h = topbarSlot.classList.contains('visible')
                    ? topbarSlot.getBoundingClientRect().height
                    : 0;
                phoneScreen.style.setProperty('--app-topbar-h', `${Math.ceil(h)}px`);
            };
            apply();                         // primero sincrónico (layout ya existe)
            requestAnimationFrame(apply);    // y otra vez tras layout por si cambió
        }
    }

    // Sheets (fan news + vip restaurant/perfil + hoy v2 sheets)
    if (state.app === 'fan' && state.newsId) {
        $('#newsSheetSlot').innerHTML = renderNewsDetail();
    } else if (state.app === 'fan' && state.playingVideoId) {
        renderHoyV2VideoSheet();
    } else if (state.app === 'fan' && state.openMatchSummary) {
        renderHoyV2MatchSummarySheet();
    } else if (state.app === 'fan' && state.openHighlightsAll) {
        renderHoyV2HighlightsAll();
    } else if (state.app === 'fan' && state.openStory) {
        renderHoyV2StorySheet();
    } else if (state.app === 'fan' && state.openBehindScenes) {
        renderHoyV2BehindScenesSheet();
    } else if (state.app === 'fan' && state.openRanking) {
        renderHoyV2RankingSheet();
    } else {
        $('#newsSheetSlot').innerHTML = '';
    }

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

    // Feature flags panel (per app) below the nav
    renderSidebarFlags();
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
    const title = $('#stageTitle');
    const subtitle = $('#stageSubtitle');
    if (!subtitle) return;

    if (title) {
        title.textContent = state.app === 'vip'
            ? 'Real Madrid VIP App'
            : 'Real Madrid Fan App';
    }

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

    // ── Hoy: pestañas por equipo (flag 'fan.hoy.team-tabs') ─────
    $$('[data-team-tab]').forEach(btn => btn.addEventListener('click', () => {
        const key = btn.dataset.teamTab;
        if (state.hoyTeamFilter === key) return;
        state.hoyTeamFilter = key;
        state.matchIndex = 0;        // reset carousel position si se vuelve a "Todo"
        state.sub = 'directo';       // volver a la sub-tab por defecto
        state.statsTab = 0;
        HoyTeamTabs.persist();
        render();
    }));

    // Abrir editor de pestañas
    const editorBtn = $('#btnHoyTabsEditor');
    if (editorBtn) editorBtn.addEventListener('click', () => {
        state.hoyEditorOpen = true;
        render();
    });

    // Cerrar editor (botón Hecho / tap en el dim)
    $$('[data-editor-close]').forEach(el => el.addEventListener('click', () => {
        state.hoyEditorOpen = false;
        render();
    }));

    // Toggle visibilidad de una pestaña de equipo
    $$('[data-editor-toggle]').forEach(sw => sw.addEventListener('click', e => {
        e.preventDefault();
        const key = sw.dataset.editorToggle;
        state.hoyTabsVisible = {
            ...state.hoyTabsVisible,
            [key]: !state.hoyTabsVisible[key]
        };
        // Si deshabilitas la pestaña activa, salta a "Todo".
        if (!state.hoyTabsVisible[key] && state.hoyTeamFilter === key) {
            state.hoyTeamFilter = 'all';
        }
        HoyTeamTabs.persist();
        render();
    }));

    // Toggle modo emoji — escribimos directamente al flag (única fuente
    // de verdad) para que panel de funcionalidades y editor estén en
    // sincronía en los dos sentidos.
    const emojiSw = $('[data-editor-emoji]');
    if (emojiSw) emojiSw.addEventListener('click', e => {
        e.preventDefault();
        const next = !Flags.isEnabled('fan.hoy.team-tabs.emoji');
        Flags.set('fan.hoy.team-tabs.emoji', next);
    });

    // ── Login cluster global (flag 'fan.app.login-header') ───────
    //
    // Click → cicla por los 6 estados (Visitante → Socio → Madridista
    // → Junior → Premium → Platinum → Visitante). Un único click-target
    // mantiene el mockup predecible.
    $$('[data-login-cycle]').forEach(btn => btn.addEventListener('click', e => {
        e.stopPropagation();
        HoyLoginHeader.cycleNext();
        render();
    }));

    // ── RM Play: hero carousel dots (flag 'fan.rmtv.play') ───────
    $$('[data-rmplay-hero]').forEach(d => d.addEventListener('click', () => {
        state.heroIndex = parseInt(d.dataset.rmplayHero);
        render();
    }));

    // ── Side menu v2: buscador + acciones ──────────────────────
    const searchInput = $('#sideMenuSearch');
    if (searchInput) {
        searchInput.addEventListener('input', e => {
            state.sideMenuSearch = e.target.value;
            // Re-render y devolvemos el foco al input (la re-render
            // recrea el DOM, así que recuperamos caret/selection).
            const caret = e.target.selectionStart;
            render();
            const again = $('#sideMenuSearch');
            if (again) {
                again.focus();
                try { again.setSelectionRange(caret, caret); } catch {}
            }
        });
    }

    $$('[data-sm2-action]').forEach(btn => btn.addEventListener('click', () => {
        const action = btn.dataset.sm2Action;
        if (action === 'open-hoy-tabs-editor') {
            state.sideMenuOpen = false;
            state.hoyEditorOpen = true;
            render();
        }
    }));

    // ── Side menu v2: hojas de detalle con contenido ficticio ────
    // Sólo si el flag `fan.sidemenu.v2.mock-detail` está on.
    $$('[data-sm2-detail]').forEach(btn => btn.addEventListener('click', e => {
        e.stopPropagation();
        if (!Flags.isEnabled('fan.sidemenu.v2.mock-detail')) return;
        state.sideMenuDetail = btn.dataset.sm2Detail;
        render();
    }));

    $$('[data-sm2-detail-close]').forEach(btn => btn.addEventListener('click', () => {
        state.sideMenuDetail = null;
        render();
    }));

    // ── Hoy v2 listeners ────────────────────────────────────────
    // "Ver todas" / RMTV / Calendario section CTAs
    $$('[data-go-tab]').forEach(btn => btn.addEventListener('click', () => {
        const tab = btn.dataset.goTab;
        state.tab = tab;
        if (tab === 'noticias') state.newsId = null;
        render();
    }));

    // Next match card → Match Centre (drop flag to show classic Hoy with tabs)
    $$('[data-next-match]').forEach(btn => btn.addEventListener('click', () => {
        const teamId = btn.dataset.nextMatch;
        if (teamId === 'masc') {
            Flags.set('fan.hoy.v2-structure', false);
        } else {
            alert(`Match Centre de ${TEAMS.find(t => t.id === teamId)?.sport || teamId} — próximamente`);
        }
    }));

    // Radio button inside match card — mock player, doesn't propagate
    $$('[data-radio-match]').forEach(btn => btn.addEventListener('click', e => {
        e.stopPropagation();
        const teamId = btn.dataset.radioMatch;
        showRadioToast(teamId);
    }));

    // Match summary "Ver resumen" CTA
    $$('[data-summary-open]').forEach(btn => btn.addEventListener('click', e => {
        e.stopPropagation();
        state.openMatchSummary = btn.dataset.summaryOpen;
        renderHoyV2MatchSummarySheet();
    }));

    // Highlights all CTA
    const hlAll = $('[data-highlights-all]');
    if (hlAll) hlAll.addEventListener('click', () => {
        state.openHighlightsAll = true;
        renderHoyV2HighlightsAll();
    });

    // Highlight card / video click → simulated player
    $$('[data-highlight-id]').forEach(btn => btn.addEventListener('click', () => {
        state.playingVideoId = btn.dataset.highlightId;
        renderHoyV2VideoSheet();
    }));
    $$('[data-video-id]').forEach(btn => btn.addEventListener('click', () => {
        state.playingVideoId = btn.dataset.videoId;
        renderHoyV2VideoSheet();
    }));

    // Story thumbnail → open story viewer at first page
    $$('[data-story-id]').forEach(btn => btn.addEventListener('click', () => {
        state.openStory = { storyId: btn.dataset.storyId, pageIdx: 0 };
        renderHoyV2StorySheet();
    }));

    // Behind-scenes card → gallery sheet
    $$('[data-bs-id]').forEach(btn => btn.addEventListener('click', () => {
        state.openBehindScenes = btn.dataset.bsId;
        renderHoyV2BehindScenesSheet();
    }));

    // Prediction steppers (home/away +/-)
    $$('[data-pred-step]').forEach(btn => btn.addEventListener('click', e => {
        e.stopPropagation();
        const matchId = btn.dataset.predMatch;
        const op = btn.dataset.predStep;  // 'home+', 'home-', 'away+', 'away-'
        const draft = state.predictionDraft[matchId] || { home: 1, away: 1 };
        const delta = op.endsWith('+') ? 1 : -1;
        const field = op.startsWith('home') ? 'home' : 'away';
        const next = Math.max(0, Math.min(20, (draft[field] || 0) + delta));
        state.predictionDraft = {
            ...state.predictionDraft,
            [matchId]: { ...draft, [field]: next }
        };
        render();
    }));

    // Prediction submit
    $$('[data-pred-submit]').forEach(btn => btn.addEventListener('click', () => {
        const matchId = btn.dataset.predSubmit;
        const draft = state.predictionDraft[matchId] || { home: 1, away: 1 };
        Gamification.submit(matchId, draft.home, draft.away);
        render();
    }));

    // Change prediction (clear + re-edit)
    $$('[data-pred-change]').forEach(btn => btn.addEventListener('click', () => {
        const matchId = btn.dataset.predChange;
        Gamification.clear(matchId);
        render();
    }));

    // Open ranking
    $$('[data-ranking-open]').forEach(btn => btn.addEventListener('click', () => {
        state.openRanking = true;
        renderHoyV2RankingSheet();
    }));

    // Survey option click
    $$('[data-survey-opt]').forEach(btn => btn.addEventListener('click', () => {
        const sid = btn.dataset.surveyId;
        const opt = btn.dataset.surveyOpt;
        state.surveyAnswered = { ...state.surveyAnswered, [sid]: opt };
        render();
    }));
    // Survey reset
    $$('[data-survey-reset]').forEach(btn => btn.addEventListener('click', () => {
        const sid = btn.dataset.surveyReset;
        const next = { ...state.surveyAnswered };
        delete next[sid];
        state.surveyAnswered = next;
        render();
    }));
}

// ── Hoy v2: "Ver todos" full-screen highlights view ──────────────
function renderHoyV2HighlightsAll() {
    const slot = $('#newsSheetSlot');
    if (!slot) return;
    if (!state.openHighlightsAll) { slot.innerHTML = ''; return; }

    const items = (typeof HIGHLIGHT_ITEMS !== 'undefined' ? HIGHLIGHT_ITEMS : []);
    const filter = state.highlightsFilter;
    const filtered = filter === 'all' ? items : items.filter(h => h.category === filter);

    slot.innerHTML = `
        <div class="news-sheet-backdrop" data-highlights-close></div>
        <div class="news-sheet hoy2-highlights-sheet">
            <div class="hoy2-hl-head">
                <button class="hoy2-hl-close" data-highlights-close aria-label="Cerrar">${I.chevronLeft}</button>
                <div class="hoy2-hl-title">Highlights</div>
                <div style="width: 36px"></div>
            </div>

            <div class="hoy2-hl-segmented">
                ${HIGHLIGHT_CATEGORIES.map(c => `
                    <button class="hoy2-hl-seg ${filter === c.id ? 'active' : ''}" data-hl-filter="${c.id}">
                        ${c.label}
                    </button>
                `).join('')}
            </div>

            <div class="hoy2-hl-list">
                ${filtered.length === 0 ? `
                    <div class="hoy2-hl-empty">Sin vídeos en esta categoría</div>
                ` : filtered.map(v => `
                    <button class="hoy2-hl-row" data-highlight-id="${v.id}"
                        style="background: linear-gradient(135deg, ${v.color1} 0%, ${v.color2} 100%)">
                        <div class="hoy2-hl-row-info">
                            <span class="hoy2-hl-row-cat">${labelForCategory(v.category)}</span>
                            <div class="hoy2-hl-row-title">${v.title}</div>
                            <div class="hoy2-hl-row-duration">${v.duration}</div>
                        </div>
                        <div class="hoy2-hl-row-play">${I.play}</div>
                    </button>
                `).join('')}
            </div>
        </div>
    `;

    $$('[data-highlights-close]').forEach(b => b.addEventListener('click', () => {
        state.openHighlightsAll = false;
        slot.innerHTML = '';
    }));
    $$('[data-hl-filter]').forEach(b => b.addEventListener('click', () => {
        state.highlightsFilter = b.dataset.hlFilter;
        renderHoyV2HighlightsAll();
    }));
    $$('.hoy2-hl-row[data-highlight-id]').forEach(b => b.addEventListener('click', () => {
        const id = b.dataset.highlightId;
        state.openHighlightsAll = false;
        state.playingVideoId = id;
        renderHoyV2VideoSheet();
    }));
}

// ── Hoy v2: match summary sheet ──────────────────────────────────
function renderHoyV2MatchSummarySheet() {
    const slot = $('#newsSheetSlot');
    if (!slot) return;
    const teamId = state.openMatchSummary;
    if (!teamId) { slot.innerHTML = ''; return; }

    const lastByTeam = (typeof LAST_MATCH_BY_TEAM !== 'undefined' ? LAST_MATCH_BY_TEAM : {});
    const teams = (typeof TEAMS !== 'undefined' ? TEAMS : []);
    const s = lastByTeam[teamId];
    const team = teams.find(t => t.id === teamId);
    if (!s || !team) { slot.innerHTML = ''; return; }

    slot.innerHTML = `
        <div class="news-sheet-backdrop" data-summary-close></div>
        <div class="news-sheet hoy2-summary-sheet">
            <div class="news-sheet-grabber"></div>
            <div class="news-sheet-scroll">
                <div class="hoy2-sum-head">
                    <div class="hoy2-sum-kicker">${s.competition} · ${team.sport}</div>
                    <h1 class="hoy2-sum-title">${s.home} ${s.score} ${s.away}</h1>
                    <div class="hoy2-sum-date">${s.date}</div>
                </div>
                <div class="hoy2-sum-player"
                    style="background: linear-gradient(135deg, ${s.thumbColor1}, ${s.thumbColor2})">
                    ${I.play}
                    <span class="hoy2-sum-duration">${s.duration}</span>
                </div>
                <div class="hoy2-sum-body">
                    ${s.summary}
                </div>
                <button class="hoy2-sum-close-btn" data-summary-close>Cerrar</button>
            </div>
        </div>
    `;

    $$('[data-summary-close]').forEach(b => b.addEventListener('click', () => {
        state.openMatchSummary = null;
        slot.innerHTML = '';
    }));
}

// ── Hoy v2: simulated video player sheet ──────────────────────────
function renderHoyV2VideoSheet() {
    const slot = $('#newsSheetSlot');
    if (!slot) return;
    if (!state.playingVideoId) { slot.innerHTML = ''; return; }
    const videos = (typeof VIDEO_ITEMS !== 'undefined' ? VIDEO_ITEMS : []);
    const v = videos.find(x => x.id === state.playingVideoId);
    if (!v) { slot.innerHTML = ''; return; }

    slot.innerHTML = `
        <div class="news-sheet-backdrop" data-video-close></div>
        <div class="news-sheet hoy2-video-sheet">
            <div class="hoy2-player"
                 style="background: linear-gradient(145deg, ${v.color1} 0%, ${v.color2} 100%)">
                <button class="hoy2-player-close" data-video-close aria-label="Cerrar">
                    ${I.xmark}
                </button>
                <div class="hoy2-player-center">
                    ${I.play}
                    <div class="hoy2-player-loading">
                        <span></span><span></span><span></span>
                    </div>
                </div>
                <div class="hoy2-player-foot">
                    <span class="hoy2-player-cat">${v.category}</span>
                    <div class="hoy2-player-title">${v.title}</div>
                    <div class="hoy2-player-duration">${v.duration} · simulación</div>
                </div>
            </div>
        </div>
    `;

    $$('[data-video-close]').forEach(b => b.addEventListener('click', () => {
        state.playingVideoId = null;
        slot.innerHTML = '';
    }));
}

// ── Side panel navigation handlers ──────────────────────────────
// ── Panel lateral redimensionable (drag del borde derecho) ──────
//
// El ancho se persiste en localStorage y se expone vía la CSS var
// `--side-panel-w` sobre :root, que `.app-layout` usa como columna.
// Límites: [240px, 560px] para evitar valores absurdos.

const SIDE_PANEL_WIDTH_KEY = 'rm_side_panel_w_v1';
const SIDE_PANEL_MIN = 240;
const SIDE_PANEL_MAX = 560;

function setupSidePanelResize() {
    const handle = document.getElementById('sideResizeHandle');
    if (!handle) return;

    // Aplica el ancho guardado (si existe) al arrancar.
    try {
        const saved = parseInt(localStorage.getItem(SIDE_PANEL_WIDTH_KEY), 10);
        if (saved >= SIDE_PANEL_MIN && saved <= SIDE_PANEL_MAX) {
            document.documentElement.style.setProperty('--side-panel-w', `${saved}px`);
        }
    } catch {}

    let startX = 0;
    let startW = 0;

    const onMove = (e) => {
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        let next = startW + (clientX - startX);
        next = Math.max(SIDE_PANEL_MIN, Math.min(SIDE_PANEL_MAX, next));
        document.documentElement.style.setProperty('--side-panel-w', `${next}px`);
    };

    const onUp = () => {
        handle.classList.remove('active');
        document.body.classList.remove('resizing-side');
        window.removeEventListener('mousemove', onMove);
        window.removeEventListener('mouseup', onUp);
        window.removeEventListener('touchmove', onMove);
        window.removeEventListener('touchend', onUp);

        // Persistir el ancho final.
        const w = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--side-panel-w'), 10);
        if (!isNaN(w)) {
            try { localStorage.setItem(SIDE_PANEL_WIDTH_KEY, String(w)); } catch {}
        }
    };

    const onDown = (e) => {
        e.preventDefault();
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        const panel = document.querySelector('.side-panel');
        startW = panel ? panel.getBoundingClientRect().width : 320;
        handle.classList.add('active');
        document.body.classList.add('resizing-side');
        window.addEventListener('mousemove', onMove);
        window.addEventListener('mouseup', onUp);
        window.addEventListener('touchmove', onMove, { passive: false });
        window.addEventListener('touchend', onUp);
    };

    handle.addEventListener('mousedown', onDown);
    handle.addEventListener('touchstart', onDown, { passive: false });

    // Doble click del handle → reset al ancho por defecto.
    handle.addEventListener('dblclick', () => {
        document.documentElement.style.setProperty('--side-panel-w', '320px');
        try { localStorage.removeItem(SIDE_PANEL_WIDTH_KEY); } catch {}
    });
}

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
        render();
    } else {
        // Route through switchVipTab so the scroll position is saved for
        // the previous tab and restored for the new one (same helper used
        // by the in-phone tab bar).
        switchVipTab(() => {
            state.vipTab = tab;
            if (tab === 'perfil') state.vipPerfilOpen = true;
            else state.vipPerfilOpen = false;
            if (tab === 'eventos') state.vipEventScreen = 'list';
        });
    }
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

    /**
     * Walk up the DOM from `origin` looking for the nearest scrollable
     * ancestor on the given axis. Falls back to #screenBody for vertical
     * if nothing more specific is found.
     */
    function findScroller(origin, axis) {
        let el = origin;
        while (el && el !== phoneScreen) {
            const cs = getComputedStyle(el);
            if (axis === 'y') {
                const oy = cs.overflowY;
                if ((oy === 'auto' || oy === 'scroll') && el.scrollHeight > el.clientHeight + 1) {
                    return el;
                }
            } else {
                const ox = cs.overflowX;
                if ((ox === 'auto' || ox === 'scroll') && el.scrollWidth > el.clientWidth + 1) {
                    return el;
                }
            }
            el = el.parentElement;
        }
        // Fallback to the main screen body for vertical scrolling
        if (axis === 'y') return $('#screenBody');
        return null;
    }

    phoneScreen.addEventListener('mousedown', e => {
        if (e.button !== 0) return;
        const vScroller = findScroller(e.target, 'y');
        const hScroller = findScroller(e.target, 'x');
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

    // The invite-link screen needs more horizontal room for the email
    // preview + shareable-message panel, so we widen the shell for it.
    const shellClass = authScreen === 'invite-link' ? 'auth-shell auth-shell--wide' : 'auth-shell';
    const cardClass = authScreen === 'invite-link' ? 'auth-card auth-card--wide' : 'auth-card';

    ov.innerHTML = `
        <div class="${shellClass}">
            <div class="auth-bg"></div>
            <div class="${cardClass}">
                ${logo}
                ${body}
            </div>
            <div class="auth-foot">Acceso controlado · auth por Supabase</div>
        </div>
    `;

    attachAuthListeners();
    if (authScreen === 'invite-link') attachInviteLinkListeners();
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
    const email = authCtx.email || 'el usuario';
    const role = authCtx.role === 'admin' ? 'Admin' : 'Viewer';
    const appUrl = `${location.origin}${location.pathname}`.replace(/\/$/, '') + '/';
    const subject = 'Accede al Real Madrid Fan App Mockup';
    const senderName = 'Real Madrid · Fan App Mockup';
    const senderEmail = 'noreply@guidpagkdopgestrbxke.supabase.co';

    // The preview already knew the real message/subject *content* Supabase
    // sends, but the magic-link token itself only lives inside the actual
    // email — Supabase never exposes it to the browser (by design). We make
    // that explicit in the note below the CTA so the admin isn't confused.
    const emailPreviewHtml = `
        <div class="invite-email-preview-body">
            <div class="invite-email-brand">
                <div class="invite-email-brand-mark">
                    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor"><path d="M12 2 L14 7 L19 7 L15 11 L17 17 L12 13 L7 17 L9 11 L5 7 L10 7 Z"/></svg>
                </div>
                <div class="invite-email-brand-text">Real Madrid · Fan App Mockup</div>
            </div>
            <h3 class="invite-email-h">Activa tu cuenta</h3>
            <p class="invite-email-p">
                Te han invitado al panel de mockups con el rol <strong>${role}</strong>.
                Pulsa el botón para crear tu contraseña y entrar.
            </p>
            <div class="invite-email-cta">Iniciar sesión</div>
            <p class="invite-email-small">
                Si el botón no funciona, copia el enlace del email en tu navegador.
                El enlace es personal y expira en unas horas.
            </p>
            <hr class="invite-email-hr">
            <p class="invite-email-foot">
                Si no esperabas este email, puedes ignorarlo.
            </p>
        </div>
    `;

    const shareMessage = buildInviteShareMessage({ email, role, appUrl, senderEmail });

    // Escape for rendering inside a <pre>; the real copy goes via clipboard
    // from a data attribute so newlines survive intact.
    const shareMessageEscaped = shareMessage
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;');

    return `
        <h1 class="auth-title">Invitación enviada</h1>
        <p class="auth-subtitle">
            Hemos mandado un email a <strong>${email}</strong> con el enlace mágico para que
            configure su cuenta como <strong>${role}</strong>.
            Abajo tienes una vista del correo y un mensaje alternativo por si el email no llega.
        </p>

        <div class="invite-tabs" role="tablist">
            <button type="button" class="invite-tab active" data-invite-tab="email" role="tab">Vista del email</button>
            <button type="button" class="invite-tab" data-invite-tab="share" role="tab">Mensaje para compartir</button>
        </div>

        <div class="invite-panel active" data-invite-panel="email">
            <div class="invite-email-client">
                <div class="invite-email-meta">
                    <div class="invite-email-row">
                        <span class="invite-email-label">De:</span>
                        <span>${senderName} &lt;${senderEmail}&gt;</span>
                    </div>
                    <div class="invite-email-row">
                        <span class="invite-email-label">Para:</span>
                        <span>${email}</span>
                    </div>
                    <div class="invite-email-row">
                        <span class="invite-email-label">Asunto:</span>
                        <span>${subject}</span>
                    </div>
                </div>
                ${emailPreviewHtml}
            </div>
            <div class="invite-note">
                <strong>Nota:</strong> el token real del enlace sólo viaja en el correo
                — Supabase no lo expone al navegador. Esta vista muestra el formato, no el link concreto.
            </div>
        </div>

        <div class="invite-panel" data-invite-panel="share" hidden>
            <p class="invite-share-caption">
                Copia este mensaje y envíalo por WhatsApp, Slack o donde quieras si el email no llega.
                Le explica paso a paso qué tiene que hacer para entrar.
            </p>
            <pre class="invite-share-box" data-share-text="${encodeURIComponent(shareMessage)}">${shareMessageEscaped}</pre>
            <button type="button" class="invite-action-secondary" data-invite-copy="share">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15 V5 a2 2 0 0 1 2-2 h10"/></svg>
                Copiar mensaje
            </button>
        </div>

        <div class="invite-actions">
            <button type="button" class="invite-action-secondary" data-invite-resend>
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 12 a9 9 0 1 0 3-6.7"/><polyline points="3,3 3,8 8,8"/></svg>
                Reenviar email
            </button>
            <button type="button" class="auth-primary-btn" data-auth-close>Hecho</button>
        </div>
    `;
}

/**
 * Plain-text invite that the admin can copy and paste into any messenger.
 * Intentionally verbose: explains where the email comes from, what to click,
 * and where to look if it ends up in spam.
 */
function buildInviteShareMessage({ email, role, appUrl, senderEmail }) {
    return [
        `¡Hola! Te invito a probar el mockup del Real Madrid Fan App.`,
        ``,
        `Para entrar:`,
        `1. Abre tu correo (${email}) y busca el email de la invitación`,
        `   (remitente: ${senderEmail} — puede estar en spam)`,
        `2. Pulsa "Iniciar sesión" en ese email`,
        `3. Elige una contraseña y listo`,
        ``,
        `App: ${appUrl}`,
        `Rol asignado: ${role}`
    ].join('\n');
}

function attachInviteLinkListeners() {
    // Tab switching between "Vista del email" and "Mensaje para compartir"
    $$('[data-invite-tab]').forEach(tab => {
        tab.addEventListener('click', () => {
            const key = tab.dataset.inviteTab;
            $$('[data-invite-tab]').forEach(t => t.classList.toggle('active', t === tab));
            $$('[data-invite-panel]').forEach(p => {
                const match = p.dataset.invitePanel === key;
                p.hidden = !match;
                p.classList.toggle('active', match);
            });
        });
    });

    // Copy plain-text share message to clipboard
    $$('[data-invite-copy]').forEach(btn => {
        btn.addEventListener('click', async () => {
            const box = $('[data-share-text]');
            if (!box) return;
            const text = decodeURIComponent(box.dataset.shareText || '');
            try {
                await navigator.clipboard.writeText(text);
            } catch {
                // Fallback for browsers that block clipboard without user gesture
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                try { document.execCommand('copy'); } catch {}
                ta.remove();
            }
            const original = btn.innerHTML;
            btn.innerHTML = '✓ Copiado';
            btn.classList.add('is-success');
            setTimeout(() => { btn.innerHTML = original; btn.classList.remove('is-success'); }, 1400);
        });
    });

    // Resend the email by calling inviteUser again with the same email+role.
    // Supabase's signInWithOtp handles this gracefully (re-sends without
    // creating duplicate users).
    const resendBtn = $('[data-invite-resend]');
    if (resendBtn) {
        resendBtn.addEventListener('click', async () => {
            if (!authCtx.email) return;
            const original = resendBtn.innerHTML;
            resendBtn.disabled = true;
            resendBtn.innerHTML = 'Enviando…';
            const r = await Auth.inviteUser(authCtx.email, authCtx.role || 'viewer');
            resendBtn.disabled = false;
            if (r.ok) {
                resendBtn.innerHTML = '✓ Email reenviado';
                resendBtn.classList.add('is-success');
                setTimeout(() => { resendBtn.innerHTML = original; resendBtn.classList.remove('is-success'); }, 1600);
            } else {
                resendBtn.innerHTML = original;
                alert(r.error || 'No se pudo reenviar el email.');
            }
        });
    }
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

// ================================================================
// User tags — etiqueta de perfil (Product / Design / Dev / Stakeholder)
// ================================================================
//
// Complemento al `role` (admin/viewer, que controla permisos). El tag es
// un metadato organizativo: desde qué equipo mira el usuario la app.
// Persistimos por email en localStorage — no hay migración en Supabase
// por ahora, así que cada admin verá las etiquetas que él mismo haya
// puesto en su navegador. Es un tradeoff consciente para el mockup.

const USER_TAGS_STORAGE_KEY = 'rm_user_tags_v1';

const USER_TAG_OPTIONS = [
    { key: '',            label: 'Sin etiqueta',      color: 'transparent' },
    { key: 'product',     label: 'Product',           color: '#4a3de8' },  // morado brand
    { key: 'design',      label: 'Design',            color: '#e11d74' },  // rosa
    { key: 'dev',         label: 'Dev',               color: '#18a452' },  // verde
    { key: 'stakeholder', label: 'Stakeholder',       color: '#e8881d' }   // naranja
];

const UserTags = {
    _load() {
        try {
            const raw = localStorage.getItem(USER_TAGS_STORAGE_KEY);
            return raw ? JSON.parse(raw) : {};
        } catch { return {}; }
    },
    _save(map) {
        try { localStorage.setItem(USER_TAGS_STORAGE_KEY, JSON.stringify(map)); }
        catch {}
    },
    get(email) {
        if (!email) return '';
        return this._load()[email.toLowerCase()] || '';
    },
    set(email, tag) {
        if (!email) return;
        const key = email.toLowerCase();
        const map = this._load();
        if (tag) map[key] = tag;
        else     delete map[key];
        this._save(map);
    },
    meta(key) {
        return USER_TAG_OPTIONS.find(o => o.key === key) || USER_TAG_OPTIONS[0];
    }
};

function isSettingsOpen() {
    return !$('#settingsDrawer').hidden;
}

// Mantenemos el listado de usuarios fresco: mientras el drawer esté
// abierto refrescamos cada 20s y también al volver a enfocar la pestaña.
// Así nos enteramos al instante cuando alguien acepta su invitación
// (pasa de "Pendiente" a "Activo") sin tener que cerrar y reabrir.
let _settingsRefreshTimer = null;
let _settingsFocusHandler = null;
const SETTINGS_REFRESH_MS = 20000;

async function openSettings() {
    const dr = $('#settingsDrawer');
    dr.hidden = false;
    await renderSettings();

    // Intervalo de refresco silencioso (no re-dibuja si no hay cambios
    // relevantes; el propio renderSettings refresca todo el DOM).
    if (_settingsRefreshTimer) clearInterval(_settingsRefreshTimer);
    _settingsRefreshTimer = setInterval(() => {
        if (!isSettingsOpen()) return;
        if (document.hidden) return;   // no machacar si la pestaña no está en foco
        renderSettings().catch(() => {});
    }, SETTINGS_REFRESH_MS);

    // Cuando el usuario vuelve a la pestaña, refrescar al instante.
    if (_settingsFocusHandler) window.removeEventListener('focus', _settingsFocusHandler);
    _settingsFocusHandler = () => {
        if (isSettingsOpen()) renderSettings().catch(() => {});
    };
    window.addEventListener('focus', _settingsFocusHandler);
}

function closeSettings() {
    const dr = $('#settingsDrawer');
    dr.hidden = true;
    dr.innerHTML = '';
    if (_settingsRefreshTimer) {
        clearInterval(_settingsRefreshTimer);
        _settingsRefreshTimer = null;
    }
    if (_settingsFocusHandler) {
        window.removeEventListener('focus', _settingsFocusHandler);
        _settingsFocusHandler = null;
    }
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

    // Renderiza un chip visual a partir de la key del tag.
    const renderTagChip = (tagKey) => {
        const m = UserTags.meta(tagKey);
        if (!tagKey) return `<span class="settings-user-tag empty">Sin etiqueta</span>`;
        return `<span class="settings-user-tag" style="background: ${m.color}1a; color: ${m.color}; border-color: ${m.color}44;">${m.label}</span>`;
    };

    // Select HTML reutilizable para tag
    const tagSelect = (currentKey, extraAttrs = '') => `
        <select class="settings-user-tag-select" ${extraAttrs}>
            ${USER_TAG_OPTIONS.map(o => `
                <option value="${o.key}" ${o.key === currentKey ? 'selected' : ''}>${o.label}</option>
            `).join('')}
        </select>
    `;

    const usersBlock = `
        <div class="settings-section-title settings-section-title-row">
            <span>Usuarios</span>
            <button class="settings-refresh-btn" id="settingsRefreshBtn" title="Actualizar ahora">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-3.3-6.9"/><polyline points="21 3 21 8 16 8"/></svg>
                Actualizar
            </button>
        </div>
        <div class="settings-add-user">
            <form id="addUserForm" class="settings-add-form">
                <input type="email" name="email" placeholder="email@dominio.com" required>
                <select name="role">
                    <option value="viewer">Viewer</option>
                    <option value="admin">Admin</option>
                </select>
                ${tagSelect('', 'name="tag"')}
                <button type="submit">Invitar</button>
            </form>
        </div>
        <div class="settings-users">
            ${users.map(u => {
                const tagKey = UserTags.get(u.email);
                const isPending = u.status === 'pending';
                const isSelf    = u.id === session.userId;
                // Dataset para routing del borrado: los pending no tienen
                // fila en `profiles` — usamos el email para borrarlos de
                // `pending_invitations`.
                const delAttrs = isPending
                    ? `data-del-pending-email="${u.email}"`
                    : `data-del-user-id="${u.id}"`;
                return `
                <div class="settings-user-row ${isSelf ? 'is-self' : ''} ${isPending ? 'is-pending' : ''}">
                    <div class="settings-user-avatar">${(u.name || u.email).slice(0,2).toUpperCase()}</div>
                    <div class="settings-user-meta">
                        <div class="settings-user-email">${u.email}${isSelf ? ' <span class="settings-user-self">(tú)</span>' : ''}</div>
                        <div class="settings-user-sub">
                            ${isPending
                                ? `<span class="settings-user-status pending">Pendiente de aceptar</span>`
                                : `<span class="settings-user-status active">Activo</span>`}
                            ${renderTagChip(tagKey)}
                        </div>
                    </div>
                    <select class="settings-user-role" data-user-id="${u.id}"
                            ${isSelf ? 'disabled' : ''} ${isPending ? 'disabled title="El rol se fija al aceptar la invitación"' : ''}>
                        <option value="viewer" ${u.role === 'viewer' ? 'selected' : ''}>Viewer</option>
                        <option value="admin" ${u.role === 'admin' ? 'selected' : ''}>Admin</option>
                    </select>
                    ${tagSelect(tagKey, `data-user-tag-email="${u.email}"`)}
                    <button class="settings-user-invite" title="${isPending ? 'Reenviar invitación' : 'Ver / reenviar invitación'}" data-invite-email="${u.email}" data-invite-role="${u.role}" ${isSelf ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4 h16 v16 H4z"/><polyline points="4,4 12,13 20,4"/></svg>
                    </button>
                    <button class="settings-user-del" ${delAttrs} title="${isPending ? 'Cancelar invitación' : 'Eliminar usuario'}" ${isSelf ? 'disabled' : ''}>
                        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="1.8"><polyline points="4,7 20,7"/><path d="M6 7 v12 a2 2 0 0 0 2 2 h8 a2 2 0 0 0 2-2 V7"/><path d="M9 7 V4 a1 1 0 0 1 1-1 h4 a1 1 0 0 1 1 1 v3"/></svg>
                    </button>
                </div>
            `;
            }).join('')}
        </div>
    `;
    $('.settings-loading').outerHTML = usersBlock;

    // Botón manual "Actualizar" en la cabecera de Usuarios.
    const refreshBtn = $('#settingsRefreshBtn');
    if (refreshBtn) refreshBtn.addEventListener('click', async () => {
        refreshBtn.disabled = true;
        const originalHTML = refreshBtn.innerHTML;
        refreshBtn.innerHTML = '<span style="opacity:0.7">Actualizando…</span>';
        await renderSettings();
        // renderSettings re-crea todo el DOM: el botón queda rehabilitado
        // porque es un nodo nuevo. No hace falta restaurar HTML aquí.
    });

    const form = $('#addUserForm');
    if (form) form.addEventListener('submit', async e => {
        e.preventDefault();
        const submitBtn = form.querySelector('button[type="submit"]');
        const fd = new FormData(form);
        if (submitBtn) { submitBtn.disabled = true; submitBtn.textContent = 'Enviando…'; }
        const invitedEmail = fd.get('email');
        const invitedRole  = fd.get('role') || 'viewer';
        const invitedTag   = fd.get('tag')  || '';
        const r = await Auth.inviteUser(invitedEmail, invitedRole);
        if (submitBtn) { submitBtn.disabled = false; submitBtn.textContent = 'Invitar'; }
        if (!r.ok) {
            alert(r.error);
            return;
        }
        // Guarda la etiqueta asociada al email (persiste por navegador).
        UserTags.set(invitedEmail, invitedTag);
        form.reset();
        await renderSettings();
        openAuthOverlay('invite-link', { email: invitedEmail, role: invitedRole });
    });

    $$('.settings-user-role').forEach(sel => sel.addEventListener('change', async () => {
        sel.disabled = true;
        const r = await Auth.setRole(sel.dataset.userId, sel.value);
        if (!r.ok) alert(r.error);
        await renderSettings();
    }));

    // Cambiar etiqueta de un usuario existente — inmediato, sin round-trip.
    $$('.settings-user-tag-select[data-user-tag-email]').forEach(sel => {
        sel.addEventListener('change', async () => {
            UserTags.set(sel.dataset.userTagEmail, sel.value);
            await renderSettings();
        });
    });

    // Reopen the invitation preview (doesn't auto-resend; admin chooses)
    $$('[data-invite-email]').forEach(btn => btn.addEventListener('click', () => {
        if (btn.disabled) return;
        openAuthOverlay('invite-link', {
            email: btn.dataset.inviteEmail,
            role: btn.dataset.inviteRole
        });
    }));

    $$('[data-del-user-id]').forEach(btn => btn.addEventListener('click', async () => {
        if (btn.disabled) return;
        if (!confirm('¿Eliminar este usuario? Ya no podrá acceder a la app.')) return;
        btn.disabled = true;
        const r = await Auth.deleteUser(btn.dataset.delUserId);
        if (!r.ok) alert(r.error);
        await renderSettings();
    }));

    // Borrar invitación pendiente (no hay fila en `profiles` todavía —
    // la fila vive en `pending_invitations` y se borra por email).
    $$('[data-del-pending-email]').forEach(btn => btn.addEventListener('click', async () => {
        if (btn.disabled) return;
        if (!confirm('¿Cancelar la invitación? El enlace dejará de ser válido.')) return;
        btn.disabled = true;
        const email = btn.dataset.delPendingEmail;
        const r = await Auth.deletePendingInvitation(email);
        if (!r.ok) { alert(r.error); btn.disabled = false; return; }
        // Limpia también la etiqueta local asociada al email.
        UserTags.set(email, '');
        await renderSettings();
    }));
}

// ================================================================
// FEATURE FLAGS PANEL (inside the left sidebar, per app)
// ================================================================

/**
 * Sort flags so that parents come before their children, and children
 * appear immediately below their parent. Keeps un-related flags in their
 * original order.
 */
function sortFlagsByDependency(flags) {
    const byKey = new Map(flags.map(f => [f.key, f]));
    const result = [];
    const visited = new Set();
    const visit = (f) => {
        if (visited.has(f.key)) return;
        visited.add(f.key);
        result.push(f);
        // Find children and visit them right after
        flags.filter(c => c.parent && c.parent.key === f.key).forEach(visit);
    };
    flags.filter(f => !f.parent).forEach(visit);
    // Append any orphaned children (parent not in this app) at the end
    flags.filter(f => !visited.has(f.key)).forEach(visit);
    return result;
}

// ────────────────────────────────────────────────────────────────
// Flag panel — state persistido en memoria (UI-only, no localStorage)
// ────────────────────────────────────────────────────────────────
if (typeof state.flagsSearch === 'undefined') state.flagsSearch = '';
if (typeof state.flagsFilter === 'undefined') state.flagsFilter = 'all';   // 'all' | 'active' | 'inactive'
if (typeof state.flagsCollapsed === 'undefined') state.flagsCollapsed = {}; // { [cat]: bool } — categorías plegadas
if (typeof state.flagsOpen === 'undefined') state.flagsOpen = true;         // panel entero

/**
 * Construye una lista agrupada y filtrada de flags listos para pintar.
 * Cada item trae su `children` inline bajo el padre; los huérfanos van
 * a un grupo "Otros" si no tuvieran categoría (no debería pasar).
 */
function buildFlagView(app, search, filter) {
    const all = Flags.forApp(app);

    // Adjacency: padre → children[] (un solo nivel; soporta jerarquía
    // de profundidad arbitraria encadenando varios `requires`).
    const childrenByParent = {};
    for (const f of all) {
        if (f.requires) {
            (childrenByParent[f.requires] ||= []).push(f);
        }
    }

    // Filtros
    const q = (search || '').trim().toLowerCase();
    const matchesQuery = (f) => !q
        || f.label.toLowerCase().includes(q)
        || (f.description || '').toLowerCase().includes(q);

    const matchesFilter = (f) => {
        if (filter === 'all')      return true;
        if (filter === 'active')   return f.enabled;
        if (filter === 'inactive') return !f.enabled;
        return true;
    };

    // Asciende el árbol marcando visibles: si un descendiente matchea,
    // todos sus ancestros también entran (para mantener el árbol intacto).
    const visibleKeys = new Set();
    const byKey = new Map(all.map(f => [f.key, f]));
    for (const f of all) {
        if (matchesQuery(f) && matchesFilter(f)) {
            let cur = f;
            while (cur) {
                if (visibleKeys.has(cur.key)) break;
                visibleKeys.add(cur.key);
                cur = cur.requires ? byKey.get(cur.requires) : null;
            }
        }
    }

    // Construcción recursiva del subárbol de un padre.
    const buildSubtree = (parentKey) => {
        const kids = (childrenByParent[parentKey] || [])
            .filter(c => visibleKeys.has(c.key));
        return kids.map(k => ({
            flag: k,
            children: buildSubtree(k.key)
        }));
    };

    // Top level: flags sin padre, agrupados por categoría.
    const grouped = new Map();
    for (const f of all) {
        if (f.requires) continue;
        if (!visibleKeys.has(f.key)) continue;
        const cat = f.category || 'General';
        if (!grouped.has(cat)) grouped.set(cat, []);
        grouped.get(cat).push({
            flag: f,
            children: buildSubtree(f.key)
        });
    }

    // Cuenta total de flags visibles dentro de un subárbol.
    const subtreeCount = (node) => 1 + node.children.reduce((n, c) => n + subtreeCount(c), 0);
    const subtreeActive = (node) => (node.flag.enabled ? 1 : 0)
        + node.children.reduce((n, c) => n + subtreeActive(c), 0);

    return {
        groups: [...grouped.entries()].map(([cat, items]) => ({
            cat,
            items,
            activeCount: items.reduce((n, it) => n + subtreeActive(it), 0),
            totalCount: items.reduce((n, it) => n + subtreeCount(it), 0)
        })),
        visibleCount: visibleKeys.size,
        totalCount: all.length,
        activeCount: all.filter(f => f.enabled).length
    };
}

/**
 * Renderiza un subárbol de flags (padre + descendientes) con indent
 * visual. La profundidad controla la posición del conector del árbol.
 */
function flagTreeHTML(node, depth = 0) {
    const { flag, children } = node;
    return `
        <div class="flags-tree ${depth > 0 ? 'is-nested' : ''}">
            ${flagRowHTML(flag, { indent: depth > 0 })}
            ${children.length ? `
                <div class="flags-tree-children">
                    ${children.map(c => flagTreeHTML(c, depth + 1)).join('')}
                </div>
            ` : ''}
        </div>
    `;
}

function statusChip(flag) {
    const parent = flag.parent;
    if (parent && !parent.enabled) {
        return `<span class="flag-chip locked" title="El flag padre está apagado">BLOQUEADA</span>`;
    }
    return flag.enabled
        ? `<span class="flag-chip on">ACTIVA</span>`
        : `<span class="flag-chip off">INACTIVA</span>`;
}

function flagRowHTML(f, { indent = false } = {}) {
    const parent = f.parent;
    const parentEnabled = !parent || parent.enabled;
    const effectiveOn = f.rawEnabled && parentEnabled;
    const locked = parent && !parent.enabled;

    // Show "Exportar flujo" whenever a flow is registered for this
    // feature — the flow's init() enables the flag (and its parents)
    // during capture and restores them after, so we don't need the
    // user to toggle it on first.
    const showExport = !!(window.FlowExporter && window.FlowExporter.has(f.key));
    const showJira   = !!(window.JiraInitiatives && window.JiraInitiatives.has(f.key));

    return `
        <div class="flag-row ${indent ? 'is-child' : ''} ${locked ? 'is-locked' : ''}" data-flag-row="${f.key}">
            <div class="flag-row-main">
                <div class="flag-row-top">
                    <span class="flag-row-title">${f.label}</span>
                    ${f.app === 'shared' ? '<span class="flag-row-scope">compartida</span>' : ''}
                    ${statusChip(f)}
                </div>
                <div class="flag-row-desc">${f.description}</div>
                ${(showExport || showJira) ? `
                    <div class="flag-row-actions">
                        ${showExport ? `
                            <button class="flag-action-btn" data-export-flow="${f.key}"
                                    title="Capturar el flujo paso a paso y descargar como PDF">
                                <svg viewBox="0 0 16 16" width="12" height="12" fill="none"
                                     stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M8 2v8M5 7l3 3 3-3"/><path d="M2 12v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1v-1"/>
                                </svg>
                                <span>Exportar flujo a PDF</span>
                            </button>
                        ` : ''}
                        ${showJira ? `
                            <button class="flag-action-btn" data-jira-init="${f.key}"
                                    title="Generar texto de iniciativa lista para pegar en JIRA">
                                <svg viewBox="0 0 16 16" width="12" height="12" fill="none"
                                     stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">
                                    <rect x="2.5" y="2.5" width="11" height="11" rx="1.5"/>
                                    <path d="M5.5 6h5M5.5 8.5h5M5.5 11h3"/>
                                </svg>
                                <span>Crear iniciativa JIRA</span>
                            </button>
                        ` : ''}
                    </div>
                ` : ''}
            </div>
            <label class="flag-toggle ${effectiveOn ? 'on' : ''}" aria-label="Activar ${f.label}">
                <input type="checkbox"
                       data-flag-key="${f.key}"
                       ${effectiveOn ? 'checked' : ''}>
                <span class="flag-toggle-knob"></span>
            </label>
        </div>
    `;
}

function renderSidebarFlags() {
    const host = $('#sideFlags');
    if (!host) return;

    // Preservar la posición de scroll dentro del panel al re-render
    // (evita que cada toggle vuelva la lista al principio).
    const prevScroll = host.querySelector('.flags-scroll');
    const savedScrollTop = prevScroll ? prevScroll.scrollTop : 0;

    const app = state.app; // 'fan' | 'vip'
    const appLabel = app === 'vip' ? 'VIP App' : 'Fan App';

    const view = buildFlagView(app, state.flagsSearch, state.flagsFilter);
    const isOpen = state.flagsOpen !== false;

    host.innerHTML = `
        <div class="flags-panel ${isOpen ? 'open' : 'closed'}" id="flagsPanel">

            <button class="flags-head" id="flagsHead" aria-expanded="${isOpen}">
                <span class="flags-head-icon">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><polyline points="6,9 12,15 18,9"/></svg>
                </span>
                <span class="flags-head-title">Funcionalidades</span>
                <span class="flags-head-app">${appLabel}</span>
                <span class="flags-head-count" title="${view.activeCount} activas de ${view.totalCount}">${view.activeCount}/${view.totalCount}</span>
            </button>

            <div class="flags-body" ${isOpen ? '' : 'hidden'}>

                <!-- Buscador -->
                <div class="flags-search">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="10.5" cy="10.5" r="6.5"/><line x1="19" y1="19" x2="15" y2="15"/></svg>
                    <input type="search" id="flagsSearch" placeholder="Buscar por nombre o descripción"
                           value="${(state.flagsSearch || '').replace(/"/g, '&quot;')}">
                    ${state.flagsSearch ? `<button class="flags-search-clear" id="flagsSearchClear" aria-label="Limpiar">×</button>` : ''}
                </div>

                <!-- Filtro segmentado -->
                <div class="flags-filter" role="tablist">
                    <button class="flags-filter-btn ${state.flagsFilter === 'all' ? 'active' : ''}"      data-flags-filter="all">Todas <span>${view.totalCount}</span></button>
                    <button class="flags-filter-btn ${state.flagsFilter === 'active' ? 'active' : ''}"   data-flags-filter="active">Activas <span>${view.activeCount}</span></button>
                    <button class="flags-filter-btn ${state.flagsFilter === 'inactive' ? 'active' : ''}" data-flags-filter="inactive">Inactivas <span>${view.totalCount - view.activeCount}</span></button>
                </div>

                <!-- Contenido -->
                <div class="flags-scroll">
                    ${view.groups.length === 0 ? `
                        <div class="flags-empty">
                            ${state.flagsSearch
                                ? `Ningún flag coincide con «${state.flagsSearch}».`
                                : state.flagsFilter === 'active'
                                    ? 'No hay funcionalidades activas. Activa alguna abajo.'
                                    : state.flagsFilter === 'inactive'
                                        ? '¡Todas las funcionalidades están activas!'
                                        : `Aún no hay funcionalidades en la ${appLabel}.`}
                        </div>
                    ` : view.groups.map(({ cat, items, activeCount, totalCount }) => {
                        const collapsed = !!state.flagsCollapsed[cat];
                        return `
                            <div class="flags-group">
                                <button class="flags-group-head" data-flags-group="${cat}" aria-expanded="${!collapsed}">
                                    <span class="flags-group-chev ${collapsed ? 'collapsed' : ''}">
                                        <svg viewBox="0 0 24 24" width="10" height="10" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><polyline points="6,9 12,15 18,9"/></svg>
                                    </span>
                                    <span class="flags-group-title">${cat}</span>
                                    <span class="flags-group-count">${activeCount}/${totalCount}</span>
                                </button>
                                ${collapsed ? '' : items.map(item => flagTreeHTML(item, 0)).join('')}
                            </div>
                        `;
                    }).join('')}
                </div>

                <!-- Footer: acciones -->
                <div class="flags-foot">
                    <button class="flags-foot-btn" id="flagsResetDefaults" title="Restablece cada flag a su valor por defecto">Por defecto</button>
                    <button class="flags-foot-btn danger" id="flagsDisableAll" ${view.activeCount === 0 ? 'disabled' : ''}>Desactivar todas</button>
                </div>
            </div>
        </div>
    `;

    // Attach listeners
    _attachFlagsPanelListeners();

    // Restaurar scroll tras el re-render para que el usuario no pierda
    // la posición al togglear o buscar.
    const newScroll = host.querySelector('.flags-scroll');
    if (newScroll && savedScrollTop) newScroll.scrollTop = savedScrollTop;
}

function _attachFlagsPanelListeners() {
    // Head: abrir/cerrar panel
    const head = $('#flagsHead');
    if (head) head.addEventListener('click', () => {
        state.flagsOpen = !state.flagsOpen;
        renderSidebarFlags();
    });

    // Buscador (no re-render global; update local)
    const search = $('#flagsSearch');
    if (search) search.addEventListener('input', e => {
        state.flagsSearch = e.target.value;
        renderSidebarFlags();
        const again = $('#flagsSearch');
        if (again) {
            again.focus();
            try { again.setSelectionRange(again.value.length, again.value.length); } catch {}
        }
    });
    const clear = $('#flagsSearchClear');
    if (clear) clear.addEventListener('click', () => {
        state.flagsSearch = '';
        renderSidebarFlags();
    });

    // Filtro segmentado
    $$('[data-flags-filter]').forEach(b => b.addEventListener('click', () => {
        state.flagsFilter = b.dataset.flagsFilter;
        renderSidebarFlags();
    }));

    // Colapsar categoría
    $$('[data-flags-group]').forEach(b => b.addEventListener('click', () => {
        const cat = b.dataset.flagsGroup;
        state.flagsCollapsed = { ...state.flagsCollapsed, [cat]: !state.flagsCollapsed[cat] };
        renderSidebarFlags();
    }));

    // Toggles
    $$('.flag-toggle input[type="checkbox"]').forEach(inp => {
        inp.addEventListener('click', e => e.stopPropagation());
        inp.addEventListener('change', () => {
            Flags.set(inp.dataset.flagKey, inp.checked);
        });
    });

    // "Exportar flujo a PDF" buttons (only present on cards whose
    // feature has registered a flow in flow_exporter.js).
    $$('[data-export-flow]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const key = btn.dataset.exportFlow;
            if (window.FlowExporter) window.FlowExporter.run(key);
        });
    });

    // "Crear iniciativa JIRA" buttons (only present on cards whose
    // feature has a registered initiative in jira_initiatives.js).
    $$('[data-jira-init]').forEach(btn => {
        btn.addEventListener('click', e => {
            e.preventDefault();
            e.stopPropagation();
            const key = btn.dataset.jiraInit;
            if (window.JiraInitiatives) window.JiraInitiatives.show(key);
        });
    });

    // Reset a defaults
    const resetD = $('#flagsResetDefaults');
    if (resetD) resetD.addEventListener('click', () => {
        Flags.resetAll();
    });

    // Desactivar todas
    const disable = $('#flagsDisableAll');
    if (disable) disable.addEventListener('click', () => {
        // Apaga todos los flags del app actual (uno por uno para respetar cascada).
        const app = state.app;
        Flags.forApp(app).forEach(f => {
            if (f.rawEnabled) Flags.set(f.key, false);
        });
    });
}

// ================================================================
// BOOT
// ================================================================

async function bootApp() {
    // 0) Dev bypass (`?dev=1`) — skips Supabase, stubs a session, renders the
    //    app shell. For design review / preview tools only.
    if (Auth.isDevBypass && Auth.isDevBypass()) {
        Auth.devBypass();
        closeAuthOverlay();
        document.body.classList.remove('auth-mode');
        render();
        renderUserBox();
        console.warn('[boot] DEV BYPASS active — auth skipped');
        return;
    }

    // 1) Recovery (forgot-password email) takes priority.
    //    `isRecovery()` is seeded synchronously from the URL hash so this works
    //    even if Supabase hasn't fired PASSWORD_RECOVERY yet.
    if (Auth.isRecovery()) {
        openAuthOverlay('reset');
        document.body.classList.add('auth-mode');
        return;
    }

    // 2) Setup (invite / signup / magic-link email). Checked BEFORE the
    //    Auth.current() null-bail because brand-new users may have a valid
    //    Supabase session but no `profiles` row loaded yet — in that case
    //    Auth.current() returns null and we used to fall back to login,
    //    which is exactly the bug we're fixing.
    if (Auth.needsPasswordSetup()) {
        const session = Auth.current(); // may be null; that's fine
        openAuthOverlay('setup', { name: session ? session.name : '' });
        document.body.classList.add('auth-mode');
        return;
    }

    // 3) No session → normal login.
    const session = Auth.current();
    if (!session) {
        openAuthOverlay('login');
        document.body.classList.add('auth-mode');
        return;
    }

    // 4) Authenticated + ready — swap login for app
    closeAuthOverlay();
    document.body.classList.remove('auth-mode');
    render();
    renderUserBox();
}

// ── Boot ─────────────────────────────────────────────────────────
//
// Strategy: never show a "Cargando…" screen. The login is always usable
// from the first paint — if Auth.init() finds a valid session in the
// background, bootApp() swaps the login for the app. Otherwise the user
// can just log in normally without waiting for anything.
//
// This avoids the classic "stuck on loading" scenario on cold boots
// (slow CDN, incognito, flaky networks).
document.addEventListener('DOMContentLoaded', async () => {
    console.log('[boot] DOMContentLoaded');

    // ── 1) Render the right auth screen IMMEDIATELY, as the first thing ───
    //    If the user arrived from a Supabase email (recovery / invite), the
    //    URL hash tells us which screen to show — no need to wait for the
    //    SDK to fire PASSWORD_RECOVERY / SIGNED_IN. This avoids the login
    //    briefly flashing before bootApp swaps it.
    try {
        let initialScreen = 'login';
        if (typeof Auth !== 'undefined') {
            if (Auth.urlIndicatesRecovery && Auth.urlIndicatesRecovery()) {
                initialScreen = 'reset';
            } else if (Auth.urlIndicatesInvite && Auth.urlIndicatesInvite()) {
                initialScreen = 'setup';
            }
        }
        openAuthOverlay(initialScreen);
        document.body.classList.add('auth-mode');
    } catch (err) {
        console.error('[boot] could not render initial auth screen:', err);
    }

    // ── 2) Rest of the boot, guarded so nothing blocks the login ────
    try {
        attachAppSwitcher();
        setupTouchSimulation();

        // Rehydrate feature-flag state that lives in localStorage
        if (typeof Gamification    !== 'undefined') Gamification.hydrate();
        if (typeof HoyTeamTabs     !== 'undefined') HoyTeamTabs.hydrate();
        if (typeof HoyLoginHeader  !== 'undefined') HoyLoginHeader.hydrate();

        // Panel lateral redimensionable (drag del handle).
        setupSidePanelResize();

        // Re-render the entire app when a feature flag changes so new UI
        // gated behind the flag appears / disappears instantly.
        if (typeof Flags !== 'undefined') {
            Flags.onChange(() => {
                if (Auth.current()) render();
                renderSidebarFlags();
            });
        } else {
            console.warn('[boot] Flags module not loaded');
        }

        // Subscribe to Supabase auth events so we react to magic-link /
        // password-recovery landings, and to the initial session restore.
        if (typeof Auth !== 'undefined') {
            Auth.onAuthChange((event) => {
                console.log('[auth] state change:', event);
                setTimeout(bootApp, 0);
            });
        }

        // Init Supabase session in the background. If it finds a valid
        // session, bootApp() will close the login and show the app.
        // If it fails or takes long, the login remains visible and
        // interactive — the user is never locked out.
        console.log('[boot] Auth.init() starting in background');
        Auth.init()
            .then(() => {
                console.log('[boot] Auth.init() done. session =', Auth.current());
                return bootApp();
            })
            .catch(err => {
                console.warn('[boot] Auth.init() failed (login still usable):', err);
            });
    } catch (err) {
        console.error('[boot] non-fatal error during boot (login is still usable):', err);
    }
});

