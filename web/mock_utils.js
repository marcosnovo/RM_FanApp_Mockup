/* ============================================================
   Mock console — shared UI utilities
   ============================================================
   Small, dependency-free helpers shared across the console
   modules (app.js, flow_exporter.js, jira_initiatives.js, auth
   UI). Loaded FIRST (before the other scripts) so everything
   below can rely on `window.MockUI`.

   Rationale: several of these (escapeHtml, copyToClipboard,
   slugify, downloadText) were duplicated across files with
   slightly different names/implementations. Centralising them
   here removes the drift risk. The star of the module is
   `toast()` — a non-blocking replacement for the scattered
   native `alert()` calls, which felt jarring against the
   otherwise custom-styled console.
   ============================================================ */

(function () {
'use strict';

// ── HTML escaping ───────────────────────────────────────────────
function escapeHtml(s) {
    return String(s).replace(/[&<>"']/g, c => ({
        '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
    }[c]));
}

// ── Slug (for filenames) ────────────────────────────────────────
// ̀-ͯ is the "combining diacritical marks" block — after
// NFD normalisation the accents become these standalone marks, which
// we strip so "Cesión múltiple" → "cesion-multiple".
function slugify(str) {
    return String(str).toLowerCase()
        .normalize('NFD').replace(/[̀-ͯ]/g, '')
        .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

// ── Clipboard (with legacy execCommand fallback) ────────────────
async function copyToClipboard(text) {
    try {
        await navigator.clipboard.writeText(text);
        return true;
    } catch {
        // Fallback for older browsers / insecure contexts.
        try {
            const ta = document.createElement('textarea');
            ta.value = text;
            ta.style.position = 'fixed';
            ta.style.opacity = '0';
            document.body.appendChild(ta);
            ta.select();
            document.execCommand('copy');
            ta.remove();
            return true;
        } catch {
            return false;
        }
    }
}

// ── Trigger a text/blob download ────────────────────────────────
function downloadText(filename, content, mime = 'text/plain') {
    const blob = (content instanceof Blob) ? content : new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
}

// ── Toast notifications ─────────────────────────────────────────
// `toast(message, { type, duration })`. type ∈ info|success|error|warn.
// Non-blocking, auto-dismissing, stacks bottom-centre, dark-aware.
const ICONS = {
    success: '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><polyline points="4,12 10,18 20,6"/></svg>',
    error:   '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="7" x2="12" y2="13"/><line x1="12" y1="16.5" x2="12" y2="16.5"/></svg>',
    warn:    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3 22 20 2 20 Z"/><line x1="12" y1="9" x2="12" y2="14"/><line x1="12" y1="17" x2="12" y2="17"/></svg>',
    info:    '<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="9"/><line x1="12" y1="11" x2="12" y2="16.5"/><line x1="12" y1="7.5" x2="12" y2="7.5"/></svg>'
};

function ensureToastHost() {
    let host = document.getElementById('mock-toast-host');
    if (!host) {
        host = document.createElement('div');
        host.id = 'mock-toast-host';
        host.className = 'mock-toast-host';
        host.setAttribute('role', 'status');
        host.setAttribute('aria-live', 'polite');
        document.body.appendChild(host);
    }
    return host;
}

function toast(message, opts = {}) {
    const type = opts.type || 'info';
    const duration = opts.duration != null
        ? opts.duration
        : (type === 'error' ? 5200 : 3200);
    const host = ensureToastHost();
    // Errors should interrupt assistive tech; other types stay polite.
    host.setAttribute('aria-live', type === 'error' ? 'assertive' : 'polite');

    const el = document.createElement('div');
    el.className = `mock-toast mock-toast-${type}`;
    el.innerHTML = `
        <span class="mock-toast-icon">${ICONS[type] || ICONS.info}</span>
        <span class="mock-toast-msg"></span>
        <button class="mock-toast-close" aria-label="Cerrar aviso">
            <svg viewBox="0 0 16 16" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/></svg>
        </button>
    `;
    // textContent (not innerHTML) so messages are never a markup vector.
    el.querySelector('.mock-toast-msg').textContent = String(message);
    host.appendChild(el);
    // Force reflow then add .in so the entry transition plays.
    void el.offsetWidth;
    el.classList.add('in');

    let dismissed = false;
    const dismiss = () => {
        if (dismissed) return;
        dismissed = true;
        el.classList.remove('in');
        el.classList.add('out');
        el.addEventListener('transitionend', () => el.remove(), { once: true });
        // Safety net if transitionend never fires.
        setTimeout(() => el.remove(), 400);
    };

    el.querySelector('.mock-toast-close').addEventListener('click', dismiss);
    if (duration > 0) setTimeout(dismiss, duration);
    return { dismiss, el };
}

// ── Export ──────────────────────────────────────────────────────
window.MockUI = { escapeHtml, slugify, copyToClipboard, downloadText, toast };
// Convenience global — matches the `alert()` ergonomics it replaces.
window.toast = toast;

})();
