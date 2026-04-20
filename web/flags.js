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
    }

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
