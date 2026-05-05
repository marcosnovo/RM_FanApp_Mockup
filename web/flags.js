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

// ⚠️ Registry of all flags. Keep this sorted by `app` and `category` for readability.
// Each flag MUST declare `app` so it appears in the right panel.
const FLAGS = [
    // ── Fan App flags ─────────────────────────────────────────────
    {
        app: 'fan',
        key: 'fan.hoy.v2-structure',
        label: 'Hoy v2 — estructura modular',
        description: 'Rediseña Hoy con scroll vertical: card compacta del próximo partido, listado de noticias, carrusel de highlights y encuesta placeholder.',
        category: 'Hoy',
        default: false
    },
    {
        app: 'fan',
        key: 'fan.hoy.stories',
        label: 'Stories + Tras las cámaras',
        description: 'Carrusel de stories tipo Instagram en la parte superior y sección "Tras las cámaras" con galería de fotos tras las noticias.',
        category: 'Hoy',
        default: false,
        requires: 'fan.hoy.v2-structure'
    },
    {
        app: 'fan',
        key: 'fan.hoy.gamification',
        label: 'Gamificación — predicciones y ranking',
        description: 'Bloque para predecir el marcador del próximo partido + sistema de puntos y ranking local.',
        category: 'Hoy',
        default: false,
        requires: 'fan.hoy.v2-structure'
    },
    {
        app: 'fan',
        key: 'fan.app.login-header',
        label: 'Cabecera de bienvenida / login (global)',
        description: 'Cabecera persistente arriba del todo en todas las secciones (Hoy, Noticias, Calendario, RMTV/RM Play, Tienda): "Inicia sesión" cuando no hay sesión, o nombre grande + tier (Socio, Madridista, Junior/Premium/Platinum) cuando sí. Click sobre el cluster cicla estados.',
        category: 'Navegación',
        default: false
    },

    // ── Hoy v2 — pestañas por equipo ──────────────────────────────
    // Anidada bajo `fan.hoy.v2-structure`: sólo tiene sentido encima del
    // Hoy v2 (scroll vertical modular), no sobre la Hoy clásica.
    {
        app: 'fan',
        key: 'fan.hoy.team-tabs',
        label: 'Pestañas por equipo en Hoy',
        description: 'Añade arriba del todo 4 pestañas: Todo · Fútbol masc. · Fútbol fem. · Baloncesto. "Todo" mantiene el Hoy v2 completo; cada equipo filtra el contenido a ese deporte.',
        category: 'Hoy',
        default: false,
        requires: 'fan.hoy.v2-structure'
    },
    {
        app: 'fan',
        key: 'fan.hoy.team-tabs.emoji',
        label: 'Pestañas con emojis',
        description: 'Variante opcional de las pestañas con emojis (⚽️ Masculino, ⚽️ Femenino, 🏀 1er equipo) en lugar de texto plano. Más visual, ocupa algo más de ancho.',
        category: 'Hoy',
        default: false,
        requires: 'fan.hoy.team-tabs'
    },
    {
        app: 'fan',
        key: 'fan.hoy.team-tabs.editor',
        label: 'Editor de pestañas (activar/ocultar)',
        description: 'Botón ⚙ junto a las pestañas que abre un editor para activar u ocultar cada pestaña de equipo. La pestaña «Todo» siempre se muestra.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.team-tabs'
    },
    {
        app: 'fan',
        key: 'fan.hoy.team-tabs.reorder',
        label: 'Reordenación de equipos',
        description: 'Añade un asa con tres rayas (≡) en cada fila del editor de pestañas para arrastrar y soltar los equipos. El nuevo orden se refleja en las pestañas por equipo del Hoy.',
        category: 'Hoy',
        default: false,
        requires: 'fan.hoy.team-tabs.editor'
    },

    // ── Hoy v2 Pro — Pack de mejoras de la home ─────────────────
    // Flag padre con sub-features anidadas: cada una se puede
    // activar/desactivar independientemente para comparar el impacto.
    {
        app: 'fan',
        key: 'fan.hoy.home-pro',
        label: 'Hoy v2 Pro — pack de mejoras de la home',
        description: 'Activa el pack completo: noticias compactas, shorts verticales, hero promocional, quick actions, live rail y continue watching. Cada sub-feature se puede tunear independientemente debajo.',
        category: 'Hoy',
        default: false,
        requires: 'fan.hoy.v2-structure'
    },
    {
        app: 'fan',
        key: 'fan.hoy.news.compact',
        label: 'Noticias compactas',
        description: 'Reduce la noticia: thumb 68→52px, una línea de título, sin subtítulo. 5 noticias pasan de 480px a ~320px de scroll (-30%).',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.home-pro'
    },
    {
        app: 'fan',
        key: 'fan.hoy.shorts',
        label: 'Shorts verticales (9:16)',
        description: 'Grid 2xN de vídeos cortos verticales con badge NEW, estilo "City Shorts" del Manchester City o Reels/TikTok. Reaprovecha los gradientes de los highlights.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.home-pro'
    },
    {
        app: 'fan',
        key: 'fan.hoy.promo-hero',
        label: 'Hero promocional rotativo',
        description: 'Banner full-bleed gigante con CTA (Tour Bernabéu, Tienda, RM Play+, Camp). Carrusel automático cada 5s con indicador de paginación.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.home-pro'
    },
    {
        app: 'fan',
        key: 'fan.hoy.quick-actions',
        label: 'Atajos (Quick actions)',
        description: 'Fila horizontal de 5 atajos justo bajo el topbar: Entradas · Tienda · Bernabéu · RM Play · Restaurantes. Cada chip navega a la sección correspondiente.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.home-pro'
    },
    {
        app: 'fan',
        key: 'fan.hoy.live-rail',
        label: 'Live & Upcoming rail',
        description: 'Carrusel horizontal de mini-cards de partidos con badge LIVE (magenta) o FULL MATCH REPLAY (amarillo). Patrón Man City / Sky Sports.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.home-pro'
    },
    {
        app: 'fan',
        key: 'fan.hoy.continue-watching',
        label: 'Continue watching',
        description: 'Carrusel de vídeos a medio ver con barra de progreso debajo del thumb. Aparece solo si hay vídeos con progreso > 0% < 95%.',
        category: 'Hoy',
        default: true,
        requires: 'fan.hoy.home-pro'
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
     */
    set(key, value) {
        const ov = _load();
        ov[key] = !!value;

        const def = FLAGS.find(f => f.key === key);

        // Turning a child ON → ensure parent is ON too
        if (value && def && def.requires) {
            ov[def.requires] = true;
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
