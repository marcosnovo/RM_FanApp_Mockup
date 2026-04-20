/* ================================================================
   MOCK DATA — mirror of MockData.swift
   ================================================================ */

const RM_BLUE    = '#4a3de8';
const BAYERN_RED = '#bf0d0d';
const MCITY_BLUE = '#6bb8eb';
const BETIS_GRN  = '#0d8c40';
const MALL_RED   = '#a60d1a';
const GIRONA_RED = '#cc1a26';

// ── Icons (SVG strings for the crest symbol) ────────────────────
const ICON_CROWN = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M5 16 L3 6 L8 10 L12 4 L16 10 L21 6 L19 16 Z M5 18 H19 V20 H5 Z"/></svg>`;
const ICON_SHIELD = `<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2 L20 6 V12 C20 17 16 20.5 12 22 C8 20.5 4 17 4 12 V6 Z"/></svg>`;

// ── Club crest renderers — richer, logo-like SVGs ───────────────
const CREST_REAL_MADRID = `
    <svg viewBox="0 0 60 60" class="club-crest crest-rm">
      <defs>
        <linearGradient id="rmFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#fff"/>
          <stop offset="0.55" stop-color="#f3f3f9"/>
          <stop offset="1" stop-color="#e0e0ea"/>
        </linearGradient>
        <linearGradient id="rmGold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stop-color="#f5cf7c"/>
          <stop offset="0.6" stop-color="#cfa266"/>
          <stop offset="1" stop-color="#9f7736"/>
        </linearGradient>
      </defs>
      <circle cx="30" cy="30" r="28" fill="url(#rmFill)" stroke="url(#rmGold)" stroke-width="1.4"/>
      <circle cx="30" cy="30" r="23.5" fill="none" stroke="url(#rmGold)" stroke-width="1"/>
      <!-- Crown base band -->
      <path d="M14 13 L46 13 L43 18 L17 18 Z" fill="url(#rmGold)" opacity="0.5"/>
      <!-- Crown jewels top -->
      <path d="M14 13 L18 6 L22 11 L26 4 L30 10 L34 4 L38 11 L42 6 L46 13 Z" fill="url(#rmGold)" stroke="#8a6630" stroke-width="0.35"/>
      <circle cx="18" cy="6" r="1.4" fill="url(#rmGold)"/>
      <circle cx="26" cy="4" r="1.5" fill="url(#rmGold)"/>
      <circle cx="34" cy="4" r="1.5" fill="url(#rmGold)"/>
      <circle cx="42" cy="6" r="1.4" fill="url(#rmGold)"/>
      <!-- Iconic RMCF monogram inside shield area -->
      <g transform="translate(30, 34)" font-family="Georgia, 'Times New Roman', serif" font-weight="700" font-style="italic" text-anchor="middle">
        <text y="5" font-size="14" fill="#2c2778">M</text>
        <text y="-4" x="-3" font-size="11" fill="url(#rmGold)">R</text>
        <text y="14" font-size="11" fill="url(#rmGold)">C</text>
        <text y="14" x="10" font-size="11" fill="url(#rmGold)">F</text>
      </g>
    </svg>`;

const CREST_BAYERN = `
    <svg viewBox="0 0 60 60" class="club-crest">
      <circle cx="30" cy="30" r="28" fill="#dc052d" stroke="#fff" stroke-width="1.5"/>
      <circle cx="30" cy="30" r="22" fill="#fff"/>
      <!-- Rhombus pattern (Bavarian flag) -->
      <g fill="#0066b2">
        <polygon points="18,27 24,31.5 18,36 12,31.5"/>
        <polygon points="30,27 36,31.5 30,36 24,31.5"/>
        <polygon points="42,27 48,31.5 42,36 36,31.5"/>
        <polygon points="12,36 18,40.5 24,36"/>
        <polygon points="24,36 30,40.5 36,36"/>
        <polygon points="36,36 42,40.5 48,36"/>
      </g>
      <text x="30" y="17" text-anchor="middle" font-family="serif" font-size="6.5" font-weight="900" fill="#fff" letter-spacing="0.5">FC BAYERN</text>
      <text x="30" y="46" text-anchor="middle" font-family="serif" font-size="5.5" font-weight="900" fill="#dc052d" letter-spacing="0.5">MÜNCHEN</text>
    </svg>`;

const CREST_MALLORCA = `
    <svg viewBox="0 0 56 56" class="club-crest">
      <path d="M8 8 L48 8 L48 28 Q48 44 28 52 Q8 44 8 28 Z" fill="#f5c518" stroke="#8b0a0a" stroke-width="1.5"/>
      <path d="M8 8 L48 8 L48 14 L8 14 Z" fill="#8b0a0a"/>
      <!-- Crown -->
      <path d="M16 18 L20 15 L24 19 L28 13 L32 19 L36 15 L40 18 Q32 21 28 21 Q24 21 16 18 Z" fill="#c8112e"/>
      <text x="28" y="38" text-anchor="middle" font-family="serif" font-size="10" font-weight="900" fill="#8b0a0a">RCD</text>
    </svg>`;

const CREST_GIRONA = `
    <svg viewBox="0 0 56 56" class="club-crest">
      <circle cx="28" cy="28" r="26" fill="#cc1a26" stroke="#fff" stroke-width="1.5"/>
      <rect x="14" y="14" width="28" height="28" fill="#fff"/>
      <!-- Red & white stripes -->
      <g fill="#cc1a26">
        <rect x="14" y="14" width="4" height="28"/>
        <rect x="22" y="14" width="4" height="28"/>
        <rect x="30" y="14" width="4" height="28"/>
        <rect x="38" y="14" width="4" height="28"/>
      </g>
      <text x="28" y="32" text-anchor="middle" font-family="serif" font-size="7" font-weight="900" fill="#000">GIRONA</text>
      <text x="28" y="40" text-anchor="middle" font-family="serif" font-size="5" fill="#000">FC</text>
    </svg>`;

const CREST_MAN_CITY = `
    <svg viewBox="0 0 56 56" class="club-crest">
      <circle cx="28" cy="28" r="26" fill="#6caddf" stroke="#fff" stroke-width="1.5"/>
      <circle cx="28" cy="28" r="20" fill="#fff"/>
      <!-- Ship + stripes -->
      <rect x="14" y="27" width="28" height="2" fill="#6caddf"/>
      <path d="M18 22 Q28 16 38 22 L38 26 L18 26 Z" fill="#6caddf"/>
      <text x="28" y="20" text-anchor="middle" font-family="serif" font-size="6" font-weight="900" fill="#6caddf">MCFC</text>
      <text x="28" y="40" text-anchor="middle" font-family="serif" font-size="7" font-weight="900" fill="#6caddf">CITY</text>
    </svg>`;

const CREST_BETIS = `
    <svg viewBox="0 0 56 56" class="club-crest">
      <circle cx="28" cy="28" r="26" fill="#0bb363" stroke="#fff" stroke-width="1.5"/>
      <circle cx="28" cy="28" r="20" fill="#fff"/>
      <g fill="#0bb363">
        <rect x="16" y="17" width="4" height="22"/>
        <rect x="23" y="17" width="4" height="22"/>
        <rect x="30" y="17" width="4" height="22"/>
        <rect x="37" y="17" width="4" height="22"/>
      </g>
      <text x="28" y="32" text-anchor="middle" font-family="serif" font-size="7" font-weight="900" fill="#fff" stroke="#fff" stroke-width="0.5">BETIS</text>
    </svg>`;

const CREST_BARCELONA = `
    <svg viewBox="0 0 56 56" class="club-crest">
      <path d="M6 8 L50 8 L50 30 Q50 46 28 52 Q6 46 6 30 Z" fill="#a50044" stroke="#edbb00" stroke-width="1.5"/>
      <rect x="14" y="14" width="28" height="14" fill="#004d98"/>
      <path d="M16 28 L40 28 L40 36 Q40 42 28 46 Q16 42 16 36 Z" fill="#edbb00"/>
      <!-- Red and yellow stripes on bottom -->
      <g fill="#a50044"><rect x="18" y="34" width="2" height="8"/><rect x="22" y="34" width="2" height="8"/><rect x="26" y="34" width="2" height="8"/><rect x="30" y="34" width="2" height="8"/><rect x="34" y="34" width="2" height="8"/></g>
      <text x="28" y="24" text-anchor="middle" font-family="serif" font-size="5" font-weight="700" fill="#fff">FCB</text>
    </svg>`;

const CREST_ATLETICO = `
    <svg viewBox="0 0 56 56" class="club-crest">
      <path d="M8 10 L48 10 L48 30 Q48 46 28 52 Q8 46 8 30 Z" fill="#fff" stroke="#122d7a" stroke-width="1.5"/>
      <g fill="#ce3524"><rect x="10" y="14" width="3" height="30"/><rect x="16" y="14" width="3" height="30"/><rect x="22" y="14" width="3" height="30"/><rect x="28" y="14" width="3" height="30"/><rect x="34" y="14" width="3" height="30"/><rect x="40" y="14" width="3" height="30"/><rect x="44" y="14" width="3" height="30"/></g>
      <text x="28" y="30" text-anchor="middle" font-family="serif" font-size="8" font-weight="900" fill="#122d7a">ATM</text>
    </svg>`;

const CREST_GENERIC = (color) => `
    <svg viewBox="0 0 56 56" class="club-crest">
      <path d="M8 10 L48 10 L48 30 Q48 46 28 52 Q8 46 8 30 Z" fill="${color}" stroke="#fff" stroke-width="1.5"/>
      <circle cx="28" cy="28" r="12" fill="#fff" opacity="0.2"/>
    </svg>`;

// Lookup table for full-res crests (used on large match card)
function bigCrestFor(teamName) {
    switch (teamName) {
        case 'Real Madrid':       return CREST_REAL_MADRID;
        case 'Bayern Múnich':     return CREST_BAYERN;
        case 'Mallorca':          return CREST_MALLORCA;
        case 'Girona':            return CREST_GIRONA;
        case 'Manchester City':   return CREST_MAN_CITY;
        case 'Real Betis':        return CREST_BETIS;
        case 'FC Barcelona':      return CREST_BARCELONA;
        case 'Atlético de Madrid':return CREST_ATLETICO;
        default:                  return CREST_GENERIC('#888');
    }
}

// ── Header matches carousel ─────────────────────────────────────
const HEADER_MATCHES = [
    {
        competition: 'CHAMPIONS LEAGUE',
        dateString: 'Mié 15 abr · 21:00',
        homeTeam: 'Bayern Múnich',
        homeTeamColor: BAYERN_RED,
        homeTeamSymbol: ICON_SHIELD,
        homeScore: null,
        homeScorers: '',
        awayTeam: 'Real Madrid',
        awayTeamColor: RM_BLUE,
        awayTeamSymbol: ICON_CROWN,
        awayScore: null,
        awayScorers: '',
        matchInfo: 'Fútbol · Primer Equipo\nCuartos de final (vuelta) · Allianz Arena',
        status: 'upcoming',
        stats: []
    },
    {
        competition: 'LALIGA EA SPORTS',
        dateString: 'Sáb 12 abr · 21:00',
        homeTeam: 'Real Madrid',
        homeTeamColor: RM_BLUE,
        homeTeamSymbol: ICON_CROWN,
        homeScore: 1,
        homeScorers: "Mbappé 44'",
        awayTeam: 'Girona',
        awayTeamColor: GIRONA_RED,
        awayTeamSymbol: ICON_SHIELD,
        awayScore: 1,
        awayScorers: "Stuani 88'",
        matchInfo: 'Fútbol · Primer Equipo\nJornada 31 · Santiago Bernabéu',
        status: 'finished',
        stats: [
            { label: 'Posesión',            home: 54, away: 46, isPercent: true },
            { label: 'Tiros totales',       home: 16, away: 9,  isPercent: false },
            { label: 'Tiros a puerta',      home: 6,  away: 3,  isPercent: false },
            { label: 'Córners',             home: 7,  away: 3,  isPercent: false },
            { label: 'Faltas',              home: 10, away: 14, isPercent: false },
            { label: 'Fuera de juego',      home: 3,  away: 1,  isPercent: false },
            { label: 'Tarjetas amarillas',  home: 2,  away: 3,  isPercent: false }
        ]
    },
    {
        competition: 'LALIGA EA SPORTS',
        dateString: 'Sáb 5 abr · 16:15',
        homeTeam: 'Mallorca',
        homeTeamColor: MALL_RED,
        homeTeamSymbol: ICON_SHIELD,
        homeScore: 2,
        homeScorers: "Muriqi 23' · Abdón 67'",
        awayTeam: 'Real Madrid',
        awayTeamColor: RM_BLUE,
        awayTeamSymbol: ICON_CROWN,
        awayScore: 1,
        awayScorers: "Vinicius 55'",
        matchInfo: 'Fútbol · Primer Equipo\nJornada 30 · Iberostar Estadi',
        status: 'finished',
        stats: [
            { label: 'Posesión',            home: 38, away: 62, isPercent: true },
            { label: 'Tiros totales',       home: 8,  away: 18, isPercent: false },
            { label: 'Tiros a puerta',      home: 4,  away: 7,  isPercent: false },
            { label: 'Córners',             home: 3,  away: 9,  isPercent: false },
            { label: 'Faltas',              home: 16, away: 8,  isPercent: false },
            { label: 'Fuera de juego',      home: 1,  away: 4,  isPercent: false },
            { label: 'Tarjetas amarillas',  home: 4,  away: 1,  isPercent: false }
        ]
    },
    {
        competition: 'CHAMPIONS LEAGUE',
        dateString: 'Mar 1 abr · 21:00',
        homeTeam: 'Real Madrid',
        homeTeamColor: RM_BLUE,
        homeTeamSymbol: ICON_CROWN,
        homeScore: 3,
        homeScorers: "Bellingham 12' · Vinicius 61' · Rodrygo 89'",
        awayTeam: 'Manchester City',
        awayTeamColor: MCITY_BLUE,
        awayTeamSymbol: ICON_SHIELD,
        awayScore: 1,
        awayScorers: "Foden 45'",
        matchInfo: 'Fútbol · Primer Equipo\nCuartos de final (ida) · Santiago Bernabéu',
        status: 'finished',
        stats: [
            { label: 'Posesión',            home: 48, away: 52, isPercent: true },
            { label: 'Tiros totales',       home: 14, away: 11, isPercent: false },
            { label: 'Tiros a puerta',      home: 7,  away: 4,  isPercent: false },
            { label: 'Córners',             home: 5,  away: 6,  isPercent: false },
            { label: 'Faltas',              home: 9,  away: 12, isPercent: false },
            { label: 'Fuera de juego',      home: 2,  away: 3,  isPercent: false },
            { label: 'Tarjetas amarillas',  home: 1,  away: 2,  isPercent: false }
        ]
    },
    {
        competition: 'LALIGA EA SPORTS',
        dateString: 'Dom 23 mar · 21:00',
        homeTeam: 'Real Madrid',
        homeTeamColor: RM_BLUE,
        homeTeamSymbol: ICON_CROWN,
        homeScore: 3,
        homeScorers: "Mbappé 8' · Bellingham 34' · Vinicius 71'",
        awayTeam: 'Real Betis',
        awayTeamColor: BETIS_GRN,
        awayTeamSymbol: ICON_SHIELD,
        awayScore: 0,
        awayScorers: '',
        matchInfo: 'Fútbol · Primer Equipo\nJornada 29 · Santiago Bernabéu',
        status: 'finished',
        stats: [
            { label: 'Posesión',            home: 61, away: 39, isPercent: true },
            { label: 'Tiros totales',       home: 19, away: 7,  isPercent: false },
            { label: 'Tiros a puerta',      home: 8,  away: 2,  isPercent: false },
            { label: 'Córners',             home: 8,  away: 2,  isPercent: false },
            { label: 'Faltas',              home: 8,  away: 15, isPercent: false },
            { label: 'Fuera de juego',      home: 4,  away: 0,  isPercent: false },
            { label: 'Tarjetas amarillas',  home: 1,  away: 3,  isPercent: false }
        ]
    }
];

// ── Hoy v2: highlight videos (feature flag 'fan.hoy.v2-structure') ─
const VIDEO_ITEMS = [
    {
        id: 'v1',
        title: 'Gol de Bellingham vs Man City',
        duration: '1:42',
        category: 'Goles',
        color1: '#3a2978',
        color2: '#1b1244'
    },
    {
        id: 'v2',
        title: 'Resumen · Mallorca 2-1 Real Madrid',
        duration: '4:18',
        category: 'Resumen',
        color1: '#8b1010',
        color2: '#3a0808'
    },
    {
        id: 'v3',
        title: 'Ancelotti en sala de prensa',
        duration: '7:53',
        category: 'Prensa',
        color1: '#0f2145',
        color2: '#06101f'
    },
    {
        id: 'v4',
        title: 'Entrenamiento previo al Bayern',
        duration: '3:10',
        category: 'Entreno',
        color1: '#1b3a72',
        color2: '#0a1a38'
    },
    {
        id: 'v5',
        title: 'Top 5 mejores paradas · Courtois',
        duration: '2:24',
        category: 'Top',
        color1: '#5a4380',
        color2: '#28184a'
    }
];

// ── Hoy v2: trivia / survey (placeholder) ──────────────────────
const SURVEY_ITEMS = [
    {
        id: 's1',
        kind: 'trivia',
        question: '¿Quién marcó el gol del empate ante el Girona la temporada pasada?',
        options: [
            { key: 'a', label: 'Bellingham', correct: false, votes: 22 },
            { key: 'b', label: 'F. Valverde', correct: true,  votes: 54 },
            { key: 'c', label: 'Vinicius Jr.', correct: false, votes: 18 },
            { key: 'd', label: 'Rodrygo',     correct: false, votes: 6  }
        ]
    }
];

// ── Directo: news hero carousel ─────────────────────────────────
const HERO_ITEMS = [
    { title: 'Bellingham',    subtitle: '«Es una final, lo daremos todo»', color: '#172241' },
    { title: 'Vinicius Jr.',  subtitle: 'Lidera el ataque en Múnich',       color: '#341147' },
    { title: 'Ancelotti',     subtitle: 'Rueda de prensa previa',           color: '#122939' },
    { title: 'Mbappé',        subtitle: 'El nueve apunta a titular',        color: '#291447' },
    { title: 'Champions',     subtitle: 'Cuartos de final · Vuelta',        color: '#1a1a52' }
];

// ── News ────────────────────────────────────────────────────────
const NEWS_ITEMS = [
    {
        id: 1,
        title: 'Bayern-Real Madrid: a por la remontada en Múnich',
        subtitle: 'Nuestro equipo visita el Allianz Arena con la intención de dar la vuelta al 1-2 de la ida y lograr el pase a las semifinales de la Champions (21:00 h; Orange TV y Movistar Liga de Campeones).',
        category: 'NOTICIA',
        date: '15/04/2026',
        author: 'Alberto Navarro',
        imageColor: '#26337a',
        body: `El Real Madrid visita el Allianz Arena este miércoles a las 21:00 horas con un objetivo claro: remontar el 1-2 de la ida disputada en el Santiago Bernabéu. El equipo de Carlo Ancelotti llega en un gran momento de forma, con Bellingham y Vinicius liderando el ataque blanco. La clave estará en la solidez defensiva y en aprovechar las transiciones rápidas al ataque.

Bayern Múnich necesitará gestionar bien el partido para evitar que el Madrid se adelante pronto en el marcador. Los bávaros cuentan con la ventaja de jugar en casa ante su fiel afición. Sin embargo, el historial reciente favorece al conjunto merengue, que ha demostrado ser un equipo muy solvente en las grandes noches europeas.

El partido se podrá ver en directo a través de Orange TV y Movistar Liga de Campeones a partir de las 21:00 horas.`
    },
    {
        id: 2,
        title: 'Arbeloa: "Podemos hacerlo, estamos convencidos de ello"',
        subtitle: 'El entrenador del Castilla habló sobre las posibilidades del primer equipo en Múnich.',
        category: 'NOTICIA', date: '15/04/2026', author: 'Redacción',
        imageColor: '#404d8c',
        body: 'Álvaro Arbeloa, técnico del Real Madrid Castilla, mostró su confianza plena en el primer equipo antes del decisivo duelo ante el Bayern de Múnich. "Podemos hacerlo, estamos convencidos de ello", afirmó el ex jugador madridista en declaraciones a los medios oficiales del club.'
    },
    {
        id: 3,
        title: 'El Real Madrid se entrenó en el Allianz Arena',
        subtitle: 'El equipo realizó el entrenamiento oficial previo al partido de la Champions League.',
        category: 'NOTICIA', date: '14/04/2026', author: 'Redacción',
        imageColor: '#1a2659',
        body: 'El Real Madrid completó este martes el entrenamiento oficial en el Allianz Arena, escenario del partido de vuelta de los cuartos de final de la UEFA Champions League. Ancelotti dirigió la sesión con normalidad y todos los jugadores convocados trabajaron a las órdenes del técnico italiano.'
    },
    {
        id: 4,
        title: 'Bellingham: "Es una final y vamos a darlo todo para ganar"',
        subtitle: 'El centrocampista inglés habló en la rueda de prensa previa al duelo en Múnich.',
        category: 'NOTICIA', date: '14/04/2026', author: 'Redacción',
        imageColor: '#332e80',
        body: 'Jude Bellingham compareció ante los medios de comunicación en la rueda de prensa previa al duelo ante el Bayern de Múnich. El centrocampista inglés se mostró muy motivado y aseguró que el equipo va a dar el máximo para lograr la remontada y pasar a semifinales.'
    },
    {
        id: 5,
        title: 'Convocatoria del Real Madrid ante el Bayern',
        subtitle: 'Carlo Ancelotti dio a conocer los 23 jugadores citados para el partido.',
        category: 'NOTICIA', date: '14/04/2026', author: 'Redacción',
        imageColor: '#4d1a33',
        body: 'Carlo Ancelotti ha dado a conocer la lista de convocados del Real Madrid para el partido de vuelta de los cuartos de final de la UEFA Champions League ante el Bayern de Múnich. Todos los jugadores disponibles han entrado en la convocatoria.'
    },
    {
        id: 6,
        title: 'Así fue la llegada del Real Madrid a Múnich',
        subtitle: 'El equipo viajó este lunes a la capital bávara para preparar el duelo europeo.',
        category: 'NOTICIA', date: '14/04/2026', author: 'Redacción',
        imageColor: '#264073',
        body: 'El Real Madrid aterrizó este lunes en Múnich para preparar el importante duelo europeo ante el Bayern. El equipo fue recibido por un gran número de aficionados madridistas que se desplazaron hasta la ciudad alemana para apoyar al equipo.'
    },
    {
        id: 7,
        title: 'Horarios y resultados de los partidos de vuelta de los cuartos',
        subtitle: 'Consulta todos los partidos de vuelta de cuartos de final de la Champions League.',
        category: 'NOTICIA', date: '13/04/2026', author: 'Redacción',
        imageColor: '#335999',
        body: 'La UEFA Champions League llega a su fase de cuartos de final con emocionantes duelos de vuelta. Consulta los horarios, resultados y cómo ver los partidos en directo.'
    }
];

// ── Calendar (April matches) ────────────────────────────────────
const CAL_MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto'];

const APRIL_MATCHES = [
    { day: 1,  home: { name: 'FC Barcelona', color: '#990033', symbol: ICON_SHIELD },
               away: { name: 'Real Madrid',   color: RM_BLUE,   symbol: ICON_CROWN },
               category: 'Fútbol · Primer Equipo', dateString: 'Mar 1 abr · 21:00' },
    { day: 6,  home: { name: 'Real Madrid',   color: RM_BLUE,   symbol: ICON_CROWN },
               away: { name: 'Brighton',      color: '#0073bf', symbol: ICON_SHIELD },
               category: 'Fútbol · Primer Equipo', dateString: 'Dom 6 abr · 21:00' },
    { day: 8,  home: { name: 'Fenerbahçe',    color: '#d9b800', symbol: ICON_SHIELD },
               away: { name: 'Real Madrid',   color: RM_BLUE,   symbol: ICON_CROWN },
               category: 'Fútbol · Primer Equipo', dateString: 'Mar 8 abr · 21:00' },
    { day: 11, home: { name: 'Rayo Vallecano',color: '#d91a1a', symbol: ICON_SHIELD },
               away: { name: 'Real Madrid',   color: RM_BLUE,   symbol: ICON_CROWN },
               category: 'Fútbol · Primer Equipo', dateString: 'Vie 11 abr · 21:00' },
    { day: 14, home: { name: 'Bayern Múnich', color: BAYERN_RED,symbol: ICON_SHIELD },
               away: { name: 'Real Madrid',   color: RM_BLUE,   symbol: ICON_CROWN },
               category: 'Fútbol · Primer Equipo', dateString: 'Lun 14 abr · 21:00' },
    { day: 15, home: { name: 'Bayern Múnich', color: BAYERN_RED,symbol: ICON_SHIELD },
               away: { name: 'Real Madrid',   color: RM_BLUE,   symbol: ICON_CROWN },
               category: 'Fútbol · Primer Equipo', dateString: 'Mié 15 abr · 21:00' },
    { day: 17, home: { name: 'Real Madrid',   color: RM_BLUE,   symbol: ICON_CROWN },
               away: { name: 'Celta de Vigo', color: '#73bfe6', symbol: ICON_SHIELD },
               category: 'Fútbol · Primer Equipo', dateString: 'Jue 17 abr · 21:00' },
    { day: 22, home: { name: 'Atlético de Madrid', color: '#d92626', symbol: ICON_SHIELD },
               away: { name: 'Real Madrid',   color: RM_BLUE,   symbol: ICON_CROWN },
               category: 'Fútbol · Primer Equipo', dateString: 'Mar 22 abr · 21:00' },
    { day: 23, home: { name: 'Real Madrid',   color: RM_BLUE,   symbol: ICON_CROWN },
               away: { name: 'Real Betis',    color: BETIS_GRN, symbol: ICON_SHIELD },
               category: 'Fútbol · Primer Equipo', dateString: 'Mié 23 abr · 21:00' }
];

// ── Clasificación ───────────────────────────────────────────────
const STANDINGS = [
    { team: 'Real Madrid',    pj: 34, pts: 82, color: RM_BLUE, symbol: ICON_CROWN },
    { team: 'Barcelona',      pj: 34, pts: 76, color: '#8e8e93', symbol: ICON_SHIELD },
    { team: 'Atlético',       pj: 34, pts: 70, color: '#8e8e93', symbol: ICON_SHIELD },
    { team: 'Villarreal',     pj: 34, pts: 65, color: '#8e8e93', symbol: ICON_SHIELD },
    { team: 'Betis',          pj: 34, pts: 59, color: '#8e8e93', symbol: ICON_SHIELD },
    { team: 'Athletic',       pj: 34, pts: 57, color: '#8e8e93', symbol: ICON_SHIELD },
    { team: 'Osasuna',        pj: 34, pts: 52, color: '#8e8e93', symbol: ICON_SHIELD },
    { team: 'Valencia',       pj: 34, pts: 48, color: '#8e8e93', symbol: ICON_SHIELD }
];

// ── Plantilla ───────────────────────────────────────────────────
const SQUAD = [
    { name: 'Courtois',   number: '1',  position: 'Portero' },
    { name: 'Lunin',      number: '13', position: 'Portero' },
    { name: 'Carvajal',   number: '2',  position: 'Defensa' },
    { name: 'Militão',    number: '3',  position: 'Defensa' },
    { name: 'Alaba',      number: '4',  position: 'Defensa' },
    { name: 'Nacho',      number: '6',  position: 'Defensa' },
    { name: 'Mendy',      number: '23', position: 'Defensa' },
    { name: 'Modric',     number: '10', position: 'Centrocampista' },
    { name: 'Bellingham', number: '5',  position: 'Centrocampista' },
    { name: 'Valverde',   number: '15', position: 'Centrocampista' },
    { name: 'Kroos',      number: '8',  position: 'Centrocampista' },
    { name: 'Vinicius',   number: '7',  position: 'Delantero' },
    { name: 'Rodrygo',    number: '11', position: 'Delantero' },
    { name: 'Mbappé',     number: '9',  position: 'Delantero' }
];

// ── TV Schedule ─────────────────────────────────────────────────
const TV_DAYS = [
    {
        label: 'Miércoles',
        items: [
            { time: '08:15', title: 'Fútbol. Champions League 25/26. Octavos de final (Ida). Real Madrid-Manchester City', isLive: false },
            { time: '10:15', title: 'Hoy Jugamos. Bayern Múnich-Real Madrid (Directo)', isLive: true },
            { time: '10:20', title: 'Fútbol. Champions League 25/26. Playoff (Ida). Benfica-Real Madrid', isLive: false },
            { time: '13:00', title: 'Resumen: Bayern Múnich-Real Madrid', isLive: false },
            { time: '15:30', title: 'Real Madrid TV. Magazine semanal', isLive: false },
            { time: '18:00', title: 'Entrenamiento. Sesión del primer equipo', isLive: false },
            { time: '21:00', title: 'Fútbol. LaLiga EA Sports. Real Madrid-Valencia (EN DIRECTO)', isLive: true }
        ]
    },
    {
        label: 'Jueves',
        items: [
            { time: '09:00', title: 'Rueda de prensa post-partido', isLive: false },
            { time: '11:00', title: 'Resumen semana Champions League 25/26', isLive: false },
            { time: '16:00', title: 'Entrenamiento. Sesión del primer equipo', isLive: false },
            { time: '20:00', title: 'Real Madrid TV. Especial Champions', isLive: false }
        ]
    },
    {
        label: 'Viernes',
        items: [
            { time: '10:00', title: 'Rueda de prensa pre-partido LaLiga', isLive: false },
            { time: '12:00', title: 'Fútbol. LaLiga EA Sports. Análisis de la jornada', isLive: false },
            { time: '17:30', title: 'Entrenamiento. Sesión del primer equipo', isLive: false },
            { time: '22:00', title: 'El Día del Madrid', isLive: false }
        ]
    },
    {
        label: 'Sábado',
        items: [
            { time: '12:00', title: 'Clásico de la historia. Real Madrid-Bayern Múnich Final 2018', isLive: false },
            { time: '15:00', title: 'Real Madrid TV. Especial Derby Madrileño', isLive: false },
            { time: '18:30', title: 'Fútbol. LaLiga EA Sports. Atlético de Madrid-Real Madrid (EN DIRECTO)', isLive: true },
            { time: '22:30', title: 'Resumen. Atlético de Madrid-Real Madrid', isLive: false }
        ]
    }
];

// ── Store categories ────────────────────────────────────────────
const STORE_CATEGORIES = [
    { name: 'Equipaciones', color: '#242e7a', icon: 'tshirt' },
    { name: 'Calzado',      color: '#4d1f70', icon: 'shoe' },
    { name: 'Accesorios',   color: '#1a4275', icon: 'bag' },
    { name: 'Colecciones',  color: '#663885', icon: 'star' }
];

// ================================================================
// VIP APP DATA — Área VIP
// ================================================================

const CREST_ALAVES = `
    <svg viewBox="0 0 60 60" class="club-crest">
      <circle cx="30" cy="30" r="28" fill="#0060b2" stroke="#fff" stroke-width="1.4"/>
      <circle cx="30" cy="30" r="24" fill="#fff"/>
      <circle cx="30" cy="30" r="20" fill="#0060b2"/>
      <!-- Subtle stripes -->
      <g stroke="#0a4d90" stroke-width="0.6" opacity="0.6">
        <line x1="13" y1="22" x2="47" y2="22"/>
        <line x1="13" y1="28" x2="47" y2="28"/>
        <line x1="13" y1="34" x2="47" y2="34"/>
      </g>
      <text x="30" y="22" text-anchor="middle" font-family="serif" font-size="5.5" font-weight="700" fill="#fff" letter-spacing="0.3">DEPORTIVO</text>
      <text x="30" y="40" text-anchor="middle" font-family="serif" font-size="6.5" font-weight="700" fill="#fff" letter-spacing="0.3">ALAVÉS</text>
      <!-- Star detail -->
      <circle cx="22" cy="29" r="2.5" fill="#fff"/>
      <polygon points="22,27 22.8,28.6 24.4,28.8 23.2,30 23.5,31.6 22,30.8 20.5,31.6 20.8,30 19.6,28.8 21.2,28.6" fill="#0060b2"/>
    </svg>`;

const CREST_OVIEDO = `
    <svg viewBox="0 0 56 56" class="club-crest">
      <path d="M8 8 L48 8 L48 28 Q48 46 28 52 Q8 46 8 28 Z" fill="#fff" stroke="#0a2f70" stroke-width="1.5"/>
      <g fill="#0a2f70"><rect x="10" y="14" width="4" height="30"/><rect x="18" y="14" width="4" height="30"/><rect x="26" y="14" width="4" height="30"/><rect x="34" y="14" width="4" height="30"/><rect x="42" y="14" width="4" height="30"/></g>
      <rect x="8" y="14" width="40" height="8" fill="#9f0715"/>
      <circle cx="28" cy="18" r="3" fill="#ffd700"/>
      <text x="28" y="36" text-anchor="middle" font-family="serif" font-size="7" font-weight="900" fill="#fff">RO</text>
    </svg>`;

const CREST_ATHLETIC = `
    <svg viewBox="0 0 56 56" class="club-crest">
      <path d="M8 8 L48 8 L48 28 Q48 46 28 52 Q8 46 8 28 Z" fill="#fff" stroke="#ee2523" stroke-width="1.5"/>
      <g fill="#ee2523"><rect x="10" y="14" width="3" height="32"/><rect x="15" y="14" width="3" height="32"/><rect x="20" y="14" width="3" height="32"/><rect x="25" y="14" width="3" height="32"/><rect x="30" y="14" width="3" height="32"/><rect x="35" y="14" width="3" height="32"/><rect x="40" y="14" width="3" height="32"/></g>
      <text x="28" y="34" text-anchor="middle" font-family="serif" font-size="7" font-weight="900" fill="#fff">AC</text>
    </svg>`;

// Augment crest lookup
const _origBigCrestFor = typeof bigCrestFor === 'function' ? bigCrestFor : null;
function bigCrestForVip(name) {
    switch (name) {
        case 'Alavés':        return CREST_ALAVES;
        case 'Real Oviedo':   return CREST_OVIEDO;
        case 'Athletic Club': return CREST_ATHLETIC;
        default: return _origBigCrestFor ? _origBigCrestFor(name) : CREST_GENERIC('#888');
    }
}

// ── VIP Events ──────────────────────────────────────────────────
const VIP_EVENTS = [
    {
        id: 1,
        home: 'Real Madrid',
        away: 'Alavés',
        date: '21 abril 2026',
        dateShort: '21 abril',
        dateTime: '21 de abril de 2026 · 21:30h',
        division: 'Primera División',
        venue: 'Bernabéu',
        duration: '90',
        puerta: '39',
        sector: '4101',
        peticionHasta: '17 de abril',
        recommended: true
    },
    {
        id: 2,
        home: 'Real Madrid',
        away: 'Real Oviedo',
        date: '12 mayo 2026',
        dateShort: '12-13 mayo',
        dateTime: '12 de mayo de 2026 · 21:00h',
        division: 'Primera División',
        venue: 'Bernabéu',
        duration: '90',
        puerta: '39',
        sector: '4101',
        peticionHasta: '8 de mayo'
    },
    {
        id: 3,
        home: 'Real Madrid',
        away: 'Athletic Club',
        date: '24 mayo 2026',
        dateShort: '23-24 mayo',
        dateTime: '24 de mayo de 2026 · 18:30h',
        division: 'Primera División',
        venue: 'Bernabéu',
        duration: '90',
        puerta: '39',
        sector: '4101',
        peticionHasta: '20 de mayo'
    }
];

// ── Upcoming event (the "Próximo evento" in between) ────────────
const VIP_NEXT_EVENT = {
    home: 'Bayern Múnich',
    away: 'Real Madrid',
    date: '15 abril - 21:00h',
    league: 'Champions League, Cuartos de final (vuelta)',
    venue: 'Allianz Arena'
};

// ── Bernabéu Gastro restaurants ─────────────────────────────────
const VIP_RESTAURANTS = [
    {
        id: 'puerta57',
        name: 'Puerta 57',
        sub: 'Experiencia única en el Bernabéu',
        tag: 'Restaurante',
        scene: 'puerta57',   // CSS-drawn scene variant
        description: 'El primer restaurante en un estadio en España que ofrece una experiencia única en el Bernabéu, con vistas al campo y sabor de una tradición que perdura.',
        phone: '+34 914 573 361',
        web: 'Visitar Web',
        hours: [
            { day: 'Miércoles', time: '12:15 - 23:30' },
            { day: 'Jueves',    time: '12:15 - 23:30' },
            { day: 'Viernes',   time: '12:15 - 23:30' },
            { day: 'Sábado',    time: '09:00 - 12:00\n12:15 - 23:30' },
            { day: 'Domingo',   time: '09:00 - 12:00\n12:15 - 23:30' },
            { day: 'Lunes',     time: '12:15 - 23:30' },
            { day: 'Martes',    time: '12:15 - 23:30' }
        ]
    },
    {
        id: 'plazamahou',
        name: 'Plaza Mahou',
        sub: 'Fábrica de cerveza en un estadio',
        tag: 'Restaurante',
        scene: 'plaza',
        description: 'Un espacio único en el que se mezcla la tradición cervecera con la pasión futbolística. Experiencia de maridaje con cervezas especiales.',
        phone: '+34 914 573 362',
        web: 'Visitar Web',
        hours: [
            { day: 'Todos los días', time: '11:00 - 00:00' }
        ]
    },
    {
        id: 'arzabal',
        name: 'Arzábal Bernabéu',
        sub: 'Experiencia única con vistas al campo',
        tag: 'Restaurante',
        scene: 'arzabal',
        description: 'La icónica marca Arzábal aterriza en el Bernabéu con su cocina tradicional y vistas privilegiadas al terreno de juego.',
        phone: '+34 914 573 363',
        web: 'Visitar Web',
        hours: [
            { day: 'Martes a Domingo', time: '13:00 - 23:00' }
        ]
    },
    {
        id: 'sushi99',
        name: 'KŌ by 99 Sushi Bar',
        sub: 'Izakaya en el Bernabéu',
        tag: 'Restaurante',
        scene: 'sushi',
        description: 'Izakaya japonesa con la firma de 99 Sushi Bar. Experiencia gastronómica nipona con vistas al Santiago Bernabéu.',
        phone: '+34 914 573 364',
        web: 'Visitar Web',
        hours: [
            { day: 'Todos los días', time: '13:00 - 00:00' }
        ]
    }
];

// ── VIP FAQ ─────────────────────────────────────────────────────
const VIP_FAQS = [
    '¿A partir de qué hora se puede acceder al Bernabéu?',
    'En caso de tener parking dentro del estadio, ¿a partir de qué hora se puede acceder al Bernabéu?',
    'En caso de tener parking dentro del estadio, ¿a partir de qué hora se puede salir del estadio?',
    '¿Se puede abandonar el estadio durante el partido?',
    '¿Pueden los niños acceder sin entrada?',
    '¿Puede un menor acceder al estadio sin acompañamiento?',
    'En la situación que tenga alguna intolerancia o alergia, ¿se puede hacer peticiones especiales?',
    '¿Existe algún código específico de indumentaria?'
];

// ── VIP authorized users (Gestión de autorizados) ───────────────
const VIP_AUTH_USERS = [
    { name: 'Javier Legends',    email: 'sansegundoj.1996@gmail.com' },
    { name: 'Rocio',             email: 'rocio.m.m.alaya@gmail.com' },
    { name: 'Marcos Platinum',   email: 'marcosnovo+platinum@gmail.com' }
];

// ── VIP profile ─────────────────────────────────────────────────
const VIP_PROFILE = {
    name: 'Marcos Novo Acuses',
    tag: 'TITULAR',
    palco: 'Palco 4101',
    pass: 'LAP + Pase de temporada',
    asientos: '1 Asiento',
    email: 'areavipLAP@corp.realmadrid.com'
};
