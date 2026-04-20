/* ================================================================
   FEATURE FLAGS — experiments the user can toggle on/off live
   ================================================================
   How to add a new flag:

   1. Add an entry to FLAGS[] below with:
         - app: 'fan' | 'vip' | 'shared'   (which app owns the flag)
         - key, label, description, default, category

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
    // ── Shared (applies regardless of which app is selected) ──────
    {
        app: 'shared',
        key: 'ui.show-build-badge',
        label: 'Badge de build',
        description: 'Muestra un pequeño badge con la versión de la app arriba a la derecha.',
        category: 'Demo',
        default: false
    }

    // ── Fan App flags ─────────────────────────────────────────────
    // { app: 'fan', key: 'hoy.predictions', label: 'Predicciones', ... },
    // { app: 'fan', key: 'hoy.confetti',    label: 'Confetti al gol', ... },

    // ── VIP App flags ─────────────────────────────────────────────
    // { app: 'vip', key: 'eventos.upgrade', label: 'Upgrade de palco', ... },
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
    /** Returns true if the flag is enabled (user override or default). */
    isEnabled(key) {
        const ov = _load();
        if (key in ov) return !!ov[key];
        const def = FLAGS.find(f => f.key === key);
        return !!(def && def.default);
    },

    /** Toggle a flag on / off. */
    set(key, value) {
        const ov = _load();
        ov[key] = !!value;
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
     */
    forApp(app) {
        return FLAGS
            .filter(f => f.app === app || f.app === 'shared')
            .map(f => ({ ...f, enabled: this.isEnabled(f.key) }));
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
