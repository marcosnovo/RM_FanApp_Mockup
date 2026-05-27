/* ================================================================
   FEATURE FLAGS — experiments the user can toggle on/off live
   ================================================================
   How to add a new flag:

   1. Add an entry to FLAGS[] below with:
         - app: 'fan' | 'vip' | 'shared'   (which app owns the flag)
         - key, label, description, default, category
         - requires (optional): key of a parent flag this one depends on.
           If the parent is off, this child is effectively disabled and
           the panel will render it greyed + indented. Turning a child
           ON auto-enables the parent. Turning a parent OFF auto-disables
           all children.

   2. Anywhere in the app code, gate the new UI behind:

        if (Flags.isEnabled('my-feature-key')) { renderNewThing(); }

      or inside an HTML template string:

        ${Flags.isEnabled('my-feature-key') ? renderNewThing() : ''}

   3. The panel in the left sidebar ("Funcionalidades") picks it up
      automatically for the app it belongs to — no extra wiring.

   Flags are stored per-browser in localStorage, so each user sees
   their own experiment state. To promote a feature permanently,
   either delete the flag and inline the code, or set default: true.
   ================================================================ */

const FLAG_STORAGE_KEY = 'rm_flags_v1';
// Storage independiente para el orden personalizado de los hijos por
// padre. Estructura: { '<parentKey>': ['childA', 'childB', ...] }.
// Se normaliza contra la lista actual de FLAGS (filtrando huérfanos
// y añadiendo nuevos al final) en `getOrderedChildKeys`.
const FLAG_ORDER_STORAGE_KEY = 'rm_flag_order_v1';

// ⚠️ Registry of all flags. Keep this sorted by `app` and `category` for readability.
// Each flag MUST declare `app` so it appears in the right panel.
const FLAGS = [
    // ── Fan App flags ─────────────────────────────────────────────

    // ── Hoy v2 — Mi Mix (mezcla curada) ────────────────────────────
    // Rediseño del Hoy en una mezcla curada por el PM. El selector
    // tiene editor en 3 pasos para configurar equipos y jugadores
    // favoritos (persistido en LS). Cada módulo se activa por separado
    // en los sub-flags de abajo.
    {
        app: 'fan',
        key: 'fan.hoy.concept-mix',
        label: 'Hoy v2 — Mi Mix',
        description: 'Rediseño del Hoy en una mezcla curada: cabecera login, selector configurable de equipos y jugadores favoritos (3 pasos), próximos partidos compactos, feed vertical, racha, predictor, mini-noticias y Bernabéu hoy. Cada módulo se activa por separado en los sub-flags de abajo.',
        category: 'Hoy',
        default: true
    },
    {
        app: 'fan',
        key: 'fan.hoy.concept-mix.login-header',
        label: 'Mi Mix · Cabecera de bienvenida / login',
        description: 'Cabecera persistente arriba con saludo + tier (Visitante / Socio / Madridista / Junior / Premium / Platinum). Tap cicla los estados.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.concept-mix'
    },
    {
        app: 'fan',
        key: 'fan.hoy.concept-mix.selector',
        label: 'Mi Mix · Selector de equipos y jugadores',
        description: 'Chips horizontales con tus equipos y jugadores favoritos. Botón "Configurar" abre editor en 3 pasos: 1) equipos · 2) jugadores · 3) lista reordenable. Persistido en localStorage.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.concept-mix'
    },
    {
        app: 'fan',
        key: 'fan.hoy.concept-mix.upcoming',
        label: 'Mi Mix · Próximos partidos (cards compactos)',
        description: 'Carrusel horizontal de próximos partidos de los 3 equipos con cards compactas. Una card por equipo con escudos, hora y competición.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.concept-mix'
    },
    {
        app: 'fan',
        key: 'fan.hoy.concept-mix.feed',
        label: 'Mi Mix · Feed vertical 9:16',
        description: 'Feed vertical dominante 9:16. Filtra por el chip activo del selector cuando se toca un jugador o equipo.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.concept-mix'
    },
    {
        app: 'fan',
        key: 'fan.hoy.concept-mix.streak',
        label: 'Mi Mix · Racha Madridista',
        description: 'Tile con 7 cuadritos representando los últimos 7 días, día actual con anillo dorado pulsante.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.concept-mix'
    },
    {
        app: 'fan',
        key: 'fan.hoy.concept-mix.predictor',
        label: 'Mi Mix · Predictor del Madridista',
        description: '4 pills con resultado + leaderboard mensual.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.concept-mix'
    },
    {
        app: 'fan',
        key: 'fan.hoy.concept-mix.news',
        label: 'Mi Mix · Mini Noticias',
        description: 'Listado de 4 noticias en formato compacto (thumb 52px + título + kicker). Tap abre detalle.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.concept-mix'
    },
    {
        app: 'fan',
        key: 'fan.hoy.concept-mix.featured',
        label: 'Mi Mix · Noticia destacada',
        description: 'Añade 3 bloques de "noticia destacada" (imagen/vídeo grande + titular + botón "Leer noticia") intercalados entre el resto de módulos de la Home. Al pulsar el botón se abre la noticia.',
        category: 'Hoy',
        default: false,
        requires: 'fan.hoy.concept-mix'
    },
    {
        app: 'fan',
        key: 'fan.hoy.concept-mix.bernabeu',
        label: 'Mi Mix · Bernabéu hoy',
        description: 'Tour Bernabéu (16:00) + Concierto (21:00) con CTAs Reservar / Cómo llegar.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.concept-mix'
    },
    {
        app: 'fan',
        key: 'fan.hoy.concept-mix.hi-fi',
        label: 'Mi Mix · Alta Fidelidad (mockups avanzados)',
        description: 'Sustituye los bloques de Mi Mix por sus versiones de alta fidelidad: date picker + match card con venue + escudos SVG en Partidos, carrusel "Para ti" con card grande + paginación, predictor con escudos RM y Barça, y Noticias con hero + grid de 2 columnas con etiquetas por equipo.',
        category: 'Hoy',
        default: false,
        requires: 'fan.hoy.concept-mix'
    },

    // ── Posible backlog — agrupador de experimentos ─────────────────
    // El padre por sí solo NO cambia nada: la Home se ve exactamente
    // igual que hoy. Sólo agrupa los 4 sub-experimentos; cada uno se
    // aplica como modificador de la Home actual cuando se activa su
    // propio sub-flag. Pensado para demos y comparativas A/B.
    {
        app: 'fan',
        key: 'fan.hoy.backlog',
        label: 'Posible backlog',
        description: 'Agrupa los 4 experimentos del backlog. Por sí solo NO cambia nada: la Home se ve igual que hoy. Cada experimento se activa con su propio sub-flag de abajo y modifica la Home actual sin sustituirla.',
        category: 'Backlog',
        default: false
    },
    {
        app: 'fan',
        key: 'fan.hoy.backlog.compact-header',
        label: 'Backlog · Header compacto',
        description: 'Compacta el header de partido a una sola tira densa + barra de segmentos fina, manteniendo TODA la info actual (perfil, escudos, equipos, fecha/hora, competición, radio y segmentos). Objetivo: que el header desplegado ocupe ≤25-30% de la pantalla. El estilo de la tarjeta de partido se elige con los sub-flags de abajo (A/B/C).',
        category: 'Backlog',
        default: false,
        requires: 'fan.hoy.backlog'
    },
    {
        app: 'fan',
        key: 'fan.hoy.backlog.compact-header.style-escudos',
        label: 'Header compacto · A) Escudos protagonistas',
        description: 'Mantiene la jerarquía de la tarjeta normal (escudo grande arriba, nombre debajo, marcador en el centro) pero escalada y simétrica. Reconocible y "premium". Excluyente con B y C.',
        category: 'Backlog',
        default: true,
        requires: 'fan.hoy.backlog.compact-header',
        exclusive: 'hoy-compact-style'
    },
    {
        app: 'fan',
        key: 'fan.hoy.backlog.compact-header.style-pildora',
        label: 'Header compacto · B) Marcador en píldora',
        description: 'Escudo–marcador–escudo dentro de un chip redondeado centrado; competición arriba y una línea fina con nombres + fecha + lugar debajo. Look de widget deportivo. Excluyente con A y C.',
        category: 'Backlog',
        default: false,
        requires: 'fan.hoy.backlog.compact-header',
        exclusive: 'hoy-compact-style'
    },
    {
        app: 'fan',
        key: 'fan.hoy.backlog.compact-header.style-ticker',
        label: 'Header compacto · C) Ticker de una línea',
        description: 'Todo en una sola fila tipo barra de marcador (chip competición · escudo ABREV marcador ABREV escudo · fecha). La más compacta en altura, con nombres abreviados. Excluyente con A y B.',
        category: 'Backlog',
        default: false,
        requires: 'fan.hoy.backlog.compact-header',
        exclusive: 'hoy-compact-style'
    },
    {
        app: 'fan',
        key: 'fan.hoy.backlog.hide-on-scroll',
        label: 'Backlog · Header que se oculta al hacer scroll',
        description: 'Interacción tipo X/Twitter: el header se oculta al hacer scroll hacia abajo y vuelve a asomarse en cuanto el usuario hace scroll hacia arriba. Maximiza el contenido visible.',
        category: 'Backlog',
        default: false,
        requires: 'fan.hoy.backlog'
    },
    {
        app: 'fan',
        key: 'fan.hoy.backlog.dense-feed',
        label: 'Backlog · Feed compacto',
        description: 'Reorganiza los MISMOS elementos del feed de Monterosa (titular + media + reacciones ❤️👏🤴🔥) para aprovechar mejor el espacio: la imagen pasa a miniatura lateral, el titular se limita a 2 líneas y se aprieta el padding, de modo que caben más posts en pantalla sin cambiar el contenido. Con el flag a OFF se ven en el formato amplio actual.',
        category: 'Backlog',
        default: false,
        requires: 'fan.hoy.backlog'
    },
    {
        app: 'fan',
        key: 'fan.hoy.backlog.stories',
        label: 'Backlog · Stories entre header y feed',
        description: 'Carrusel de stories (círculos con borde gradiente) entre el header y el feed. Tamaño contenido para no penalizar el espacio del feed.',
        category: 'Backlog',
        default: false,
        requires: 'fan.hoy.backlog'
    },
    {
        app: 'fan',
        key: 'fan.app.login-header',
        label: 'Cabecera de bienvenida / login (global)',
        description: 'Cabecera persistente arriba del todo en todas las secciones (Hoy, Noticias, Calendario, RMTV/RM Play, Tienda): "Inicia sesión" cuando no hay sesión, o nombre grande + tier (Socio, Madridista, Junior/Premium/Platinum) cuando sí. Click sobre el cluster cicla estados.',
        category: 'Navegación',
        default: false
    },

    // ── Side menu v2 — padre y sub-funcionalidades anidadas ───────
    {
        app: 'fan',
        key: 'fan.sidemenu.v2',
        label: 'Side menu v2 — escalable',
        description: 'Rediseña el menú lateral con header compacto y secciones agrupadas. Las sub-funcionalidades controlan cada bloque por separado.',
        category: 'Navegación',
        default: false
    },
    {
        app: 'fan',
        key: 'fan.sidemenu.v2.search',
        label: 'Buscador de ajustes',
        description: 'Añade un buscador dentro del menú lateral que filtra las opciones en vivo por nombre.',
        category: 'Navegación',
        default: true,
        requires: 'fan.sidemenu.v2'
    },
    {
        app: 'fan',
        key: 'fan.sidemenu.v2.quick-actions',
        label: 'Accesos rápidos',
        description: 'Fila horizontal de chips con los accesos más frecuentes: Carnet, Entradas, Radio, Cerca, Tienda. Click abre una hoja con contenido ficticio.',
        category: 'Navegación',
        default: true,
        requires: 'fan.sidemenu.v2'
    },
    {
        app: 'fan',
        key: 'fan.sidemenu.v2.preferences',
        label: 'Sección Preferencias',
        description: 'Añade la sección «Preferencias» con equipos favoritos, notificaciones, idioma y apariencia. También ancla el editor de pestañas de Hoy si está activo.',
        category: 'Navegación',
        default: true,
        requires: 'fan.sidemenu.v2'
    },
    {
        app: 'fan',
        key: 'fan.sidemenu.v2.support',
        label: 'Sección Ayuda y Legal',
        description: 'Añade las secciones «Ayuda» (centro de ayuda, contacto, opinión) y «Legal» (términos, privacidad, cookies).',
        category: 'Navegación',
        default: true,
        requires: 'fan.sidemenu.v2'
    },
    {
        app: 'fan',
        key: 'fan.sidemenu.v2.mock-detail',
        label: 'Pantallas ficticias al pulsar',
        description: 'Al tocar una opción del menú, abre una hoja con contenido placeholder (mi perfil, mis entradas, idiomas, configuración de app…). Útil para probar los flujos sin tener backend.',
        category: 'Navegación',
        default: true,
        requires: 'fan.sidemenu.v2'
    },

    // ── RM Play (rebrand de la tab RMTV) ──────────────────────────
    {
        app: 'fan',
        key: 'fan.rmtv.play',
        label: 'RM Play — nueva RMTV',
        description: 'Rebrand de la pestaña RMTV: se pasa a llamar "RM Play" y se sustituye el contenido por un layout tipo plataforma OTT (hero con "Resumen / Ver más", "Nuestro club" por deporte, canales Realmadrid TV, Tendencias, UEFA Youth League, Partidos 2025-26 y Originals & Films).',
        category: 'Navegación',
        default: false
    }

    // ── VIP App flags ─────────────────────────────────────────────
    ,{
        app: 'vip',
        key: 'vip.tickets.multi-share',
        label: 'Reparto múltiple de tickets',
        description: 'Gestión de hasta 19 tickets por evento con asignación por contacto, envío en batch y disclaimer de account binding. Sustituye la pantalla de "Detalle de entradas".',
        category: 'Tickets',
        default: true
    }
    ,{
        app: 'vip',
        key: 'vip.payments.management',
        label: 'Gestión de métodos de pago',
        description: 'Acceso desde Perfil a "Payment methods": listar, añadir, editar y eliminar tarjetas, PayPal y cuentas bancarias, marcar uno como predeterminado, y selector de pago en checkout con detección de Apple Pay.',
        category: 'Pagos',
        default: false
    }
    ,{
        app: 'vip',
        key: 'vip.match.detail',
        label: 'Detalle de partido en Inicio',
        description: 'Hace navegable el módulo de partido del Home: estadísticas, alineaciones, repeticiones y goles, eventos del partido (tarjetas, sustituciones) y resumen.',
        category: 'Inicio',
        default: false
    }
];

// ── Internal state ──────────────────────────────────────────────
let _overrides = null;
let _order     = null;     // { parentKey: [childKey...] } — orden custom
const _listeners = [];

function _load() {
    if (_overrides) return _overrides;
    try {
        _overrides = JSON.parse(localStorage.getItem(FLAG_STORAGE_KEY) || '{}');
    } catch {
        _overrides = {};
    }
    return _overrides;
}

function _save() {
    try {
        localStorage.setItem(FLAG_STORAGE_KEY, JSON.stringify(_overrides || {}));
    } catch {}
}

function _loadOrder() {
    if (_order) return _order;
    try {
        _order = JSON.parse(localStorage.getItem(FLAG_ORDER_STORAGE_KEY) || '{}');
    } catch {
        _order = {};
    }
    return _order;
}

function _saveOrder() {
    try {
        localStorage.setItem(FLAG_ORDER_STORAGE_KEY, JSON.stringify(_order || {}));
    } catch {}
}

function _fire(key, value) {
    _listeners.forEach(cb => { try { cb(key, value); } catch {} });
}

// ── Public API ──────────────────────────────────────────────────
const Flags = {
    /**
     * Returns true if the flag is enabled AND all its required parents
     * are also enabled. This is the check you should use in render logic.
     */
    isEnabled(key) {
        const def = FLAGS.find(f => f.key === key);
        if (!def) return false;
        // Parent cascade: if my parent isn't enabled, neither am I.
        if (def.requires && !this.isEnabled(def.requires)) return false;
        return this._isEnabledRaw(key);
    },

    /**
     * Raw user-intent state (ignoring parent deps). Used by the panel
     * to draw the toggle position even when a child is disabled because
     * its parent is off.
     */
    _isEnabledRaw(key) {
        const ov = _load();
        if (key in ov) return !!ov[key];
        const def = FLAGS.find(f => f.key === key);
        return !!(def && def.default);
    },

    /**
     * Toggle a flag on / off, cascading sensibly:
     *   - Turning a CHILD on auto-enables its parent (convenience)
     *   - Turning a PARENT off auto-disables all children (safety)
     *   - If the flag declares `exclusive: '<group>'`, turning it ON
     *     auto-disables every other flag in the same exclusive group
     *     (radio-button behaviour for siblings like the 3 conceptos
     *     A/B/C del Hoy).
     */
    set(key, value) {
        const ov = _load();
        ov[key] = !!value;

        const def = FLAGS.find(f => f.key === key);

        // Turning a child ON → ensure parent is ON too
        if (value && def && def.requires) {
            ov[def.requires] = true;
        }

        // Turning an exclusive flag ON → disable the other siblings
        // of the same exclusive group. This makes A/B/C del Hoy
        // mutuamente excluyentes desde el panel de funcionalidades.
        if (value && def && def.exclusive) {
            for (const sib of FLAGS) {
                if (sib.key !== key && sib.exclusive === def.exclusive) {
                    ov[sib.key] = false;
                    // También cascadeamos: hijos del sibling se apagan.
                    for (const grand of FLAGS.filter(f => f.requires === sib.key)) {
                        ov[grand.key] = false;
                    }
                }
            }
            // Y limpiamos los overrides de los hijos del flag que
            // acabamos de encender para que vuelvan a sus defaults
            // (si en una vuelta anterior los habíamos apagado por
            // cascada, ahora deberían reaparecer al reactivar el
            // concepto).
            for (const child of FLAGS.filter(f => f.requires === key)) {
                delete ov[child.key];
            }
        }

        // Turning a parent OFF → disable all its direct children
        if (!value) {
            for (const child of FLAGS.filter(f => f.requires === key)) {
                ov[child.key] = false;
            }
        }

        _save();
        _fire(key, value);
    },

    /** Clear the user's override; flag falls back to its default. */
    reset(key) {
        const ov = _load();
        delete ov[key];
        _save();
        _fire(key, null);
    },

    /** Clear ALL overrides (all flags back to defaults). */
    resetAll() {
        _overrides = {};
        _save();
        _fire(null, null);
    },

    /** All registered flags, with their current enabled state. */
    all() {
        return FLAGS.map(f => ({ ...f, enabled: this.isEnabled(f.key) }));
    },

    /**
     * Flags visible in a specific app's panel.
     * Includes flags with app === <app>  AND  app === 'shared'.
     * Each flag also includes:
     *   - enabled     (effective state: parent-aware)
     *   - rawEnabled  (user's toggle state, ignoring parent)
     *   - parent      (if requires is set: { key, label, enabled })
     */
    forApp(app) {
        return FLAGS
            .filter(f => f.app === app || f.app === 'shared')
            .map(f => {
                const parent = f.requires
                    ? (() => {
                        const p = FLAGS.find(x => x.key === f.requires);
                        return p ? { key: p.key, label: p.label, enabled: this.isEnabled(p.key) } : null;
                    })()
                    : null;
                return {
                    ...f,
                    enabled: this.isEnabled(f.key),
                    rawEnabled: this._isEnabledRaw(f.key),
                    parent
                };
            });
    },

    /** forApp() grouped by category for the UI panel. */
    groupedForApp(app) {
        const groups = {};
        for (const f of this.forApp(app)) {
            const cat = f.category || 'General';
            if (!groups[cat]) groups[cat] = [];
            groups[cat].push(f);
        }
        return groups;
    },

    /**
     * Returns the children keys of `parentKey` ordered as the user
     * arranged them in the panel (drag-and-drop). If there is no
     * saved order, falls back to the natural FLAGS declaration order.
     * Children added after the user reordered are appended at the
     * end. Children that no longer exist are filtered out.
     *
     * Use this in render code to iterate the optional blocks of a
     * concept/feature in user-defined order.
     */
    getOrderedChildKeys(parentKey) {
        const naturalOrder = FLAGS
            .filter(f => f.requires === parentKey)
            .map(f => f.key);
        const ord = _loadOrder();
        const saved = Array.isArray(ord[parentKey]) ? ord[parentKey] : null;
        if (!saved) return naturalOrder;
        const naturalSet = new Set(naturalOrder);
        const seen = new Set();
        const result = [];
        // Saved keys that still exist
        for (const k of saved) {
            if (naturalSet.has(k) && !seen.has(k)) {
                result.push(k);
                seen.add(k);
            }
        }
        // New keys that weren't in saved order → append at the end
        for (const k of naturalOrder) {
            if (!seen.has(k)) result.push(k);
        }
        return result;
    },

    /**
     * Persist a custom order for `parentKey`'s children. `keys` should
     * include exactly the children of that parent (will be normalised
     * on read via `getOrderedChildKeys`).
     */
    setOrder(parentKey, keys) {
        const ord = _loadOrder();
        ord[parentKey] = keys.slice();
        _saveOrder();
        _fire(parentKey, null);
    },

    /** Resets the user's custom order for `parentKey`. */
    resetOrder(parentKey) {
        const ord = _loadOrder();
        delete ord[parentKey];
        _saveOrder();
        _fire(parentKey, null);
    },

    /** Subscribe to changes; callback fires as (key, value). */
    onChange(cb) {
        _listeners.push(cb);
    },

    /** Total flags (optional app filter). */
    count(app) {
        return app ? this.forApp(app).length : FLAGS.length;
    },

    /** How many flags are currently enabled (optional app filter). */
    activeCount(app) {
        const list = app ? this.forApp(app) : FLAGS;
        return list.reduce((n, f) => n + (this.isEnabled(f.key) ? 1 : 0), 0);
    }
};

// Make it accessible from both module scope and window (for debugging / eval)
window.Flags = Flags;
