/* ============================================================
   Flow exporter — captures a scripted feature flow into a PDF
   ============================================================
   Each functionality can register a "flow" here: an init step, a
   sequence of named steps that mutate state, and a cleanup. When
   the user pulses "Exportar flujo" on a flag card, the runner:

     1. Snapshots the touched state.
     2. Runs init + walks each step, calling render() between
        them, and screenshots the .phone DOM after each one.
     3. Restores the snapshotted state.
     4. Builds a single-page landscape PDF with all the shots laid
        out in a grid + a caption per shot.

   html2canvas + jsPDF are lazy-loaded via CDN the first time the
   feature is invoked so the boot stays light.
   ============================================================ */

(function () {
'use strict';

// ── External libs (lazy-loaded) ─────────────────────────────────
const HTML2CANVAS_URL = 'https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js';
const JSPDF_URL       = 'https://cdn.jsdelivr.net/npm/jspdf@2.5.1/dist/jspdf.umd.min.js';
let _libsPromise = null;
function ensureLibs() {
    if (_libsPromise) return _libsPromise;
    _libsPromise = Promise.all([
        loadScript(HTML2CANVAS_URL),
        loadScript(JSPDF_URL)
    ]);
    return _libsPromise;
}
function loadScript(src) {
    return new Promise((resolve, reject) => {
        const s = document.createElement('script');
        s.src = src;
        s.async = true;
        s.onload = resolve;
        s.onerror = () => reject(new Error('Failed to load ' + src));
        document.head.appendChild(s);
    });
}

// ── Flow registry ───────────────────────────────────────────────
const FLOWS = {};
function registerFlow(flagKey, def) { FLOWS[flagKey] = def; }
function hasFlow(flagKey) { return !!FLOWS[flagKey]; }

// ── Public API on window ─────────────────────────────────────────
window.FlowExporter = {
    register: registerFlow,
    has: hasFlow,
    run: runFlow
};

// ── Capture overlay (small status pill) ─────────────────────────
function showOverlay(text) {
    let o = document.getElementById('flowExportOverlay');
    if (!o) {
        o = document.createElement('div');
        o.id = 'flowExportOverlay';
        o.className = 'flow-export-overlay';
        document.body.appendChild(o);
    }
    o.textContent = text;
    o.style.display = 'flex';
}
function hideOverlay() {
    const o = document.getElementById('flowExportOverlay');
    if (o) o.style.display = 'none';
}

// ── Frame helpers ────────────────────────────────────────────────
// Use setTimeout-based waits (not requestAnimationFrame) — RAF can be
// throttled or paused in background tabs / off-screen iframes, which
// would hang the runner indefinitely. setTimeout fires reliably.
const wait = (ms) => new Promise(r => setTimeout(r, ms));
const settle = () => wait(40); // ~2 frames at 60fps

// ── Capture a node → PNG dataURL via html2canvas ─────────────────
async function captureNode(node) {
    if (!node) throw new Error('captureNode: missing node');
    // Scale 1.5 is a sweet spot: still sharp at the PDF size we use
    // (220pt wide), and ~3× lighter than scale 2.
    // NOTE: do NOT set useCORS:true — we have no external images to
    // CORS-fetch, and combining it with allowTaint hangs html2canvas
    // indefinitely on the first capture. allowTaint alone is enough.
    const canvas = await window.html2canvas(node, {
        backgroundColor: null,
        scale: 1.5,
        logging: false,
        useCORS: false,
        allowTaint: true,
        imageTimeout: 5000,
        foreignObjectRendering: false
        // The phone frame uses backdrop-filter inside; html2canvas
        // can't reproduce it, but we accept the small visual loss.
    });
    // JPEG (quality 0.88) is 5–10× smaller than PNG on these
    // composite renderings and visually indistinguishable at print
    // size. Background gradient still looks fine because the .phone
    // mockup paints its own dark backdrop inside the frame.
    return canvas.toDataURL('image/jpeg', 0.88);
}

// ── PDF assembler ────────────────────────────────────────────────
async function buildPDF(title, shots) {
    const { jsPDF } = window.jspdf;
    const N = shots.length;

    // Try to keep the grid roughly 16:9-ish by capping cols.
    // For 10 shots: 5 cols × 2 rows. For 12: 6 × 2. Up to 6 cols.
    const cols = Math.min(6, Math.ceil(Math.sqrt(N * 2)));
    const rows = Math.ceil(N / cols);

    // Phone frame native size 393 × 830 (ratio ≈ 0.473).
    const SHOT_W   = 220;
    const SHOT_H   = Math.round(SHOT_W * (830 / 393));   // ≈ 465
    const GAP_X    = 24;
    const GAP_Y    = 56;
    const PAD      = 44;
    const TITLE_H  = 70;

    const pageW = PAD * 2 + cols * SHOT_W + (cols - 1) * GAP_X;
    const pageH = PAD + TITLE_H + rows * SHOT_H + (rows - 1) * GAP_Y + PAD;

    const pdf = new jsPDF({ unit: 'pt', format: [pageW, pageH], orientation: 'landscape' });

    // Background tint matching the mockup chrome
    pdf.setFillColor(13, 14, 22);
    pdf.rect(0, 0, pageW, pageH, 'F');

    // Title
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(24);
    pdf.setTextColor(255, 255, 255);
    pdf.text(title, pageW / 2, PAD + 26, { align: 'center' });
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(11);
    pdf.setTextColor(150, 150, 160);
    pdf.text(
        `Real Madrid · Mockup · generado el ${new Date().toLocaleDateString('es-ES', {
            day: 'numeric', month: 'long', year: 'numeric'
        })}`,
        pageW / 2, PAD + 46, { align: 'center' }
    );

    // Grid
    shots.forEach((shot, i) => {
        const col = i % cols;
        const row = Math.floor(i / cols);
        const x = PAD + col * (SHOT_W + GAP_X);
        const y = PAD + TITLE_H + row * (SHOT_H + GAP_Y);
        pdf.addImage(shot.dataURL, 'JPEG', x, y, SHOT_W, SHOT_H);

        pdf.setFontSize(10);
        pdf.setTextColor(220, 220, 230);
        pdf.text(shot.caption, x + SHOT_W / 2, y + SHOT_H + 18, {
            align: 'center', maxWidth: SHOT_W + 12
        });
    });

    return pdf;
}

// ── Runner ───────────────────────────────────────────────────────
async function runFlow(flagKey) {
    const flow = FLOWS[flagKey];
    if (!flow) {
        console.warn('[flow-exporter] no flow for', flagKey);
        return;
    }

    showOverlay('Cargando librerías…');
    try {
        await ensureLibs();
    } catch (err) {
        hideOverlay();
        alert('No se pudieron cargar las librerías de captura. Revisa tu conexión.');
        return;
    }

    // Snapshot — we'll restore via the flow's own `restore` if defined,
    // else just call cleanup().
    const snapshot = flow.snapshot ? flow.snapshot() : null;

    try {
        showOverlay('Preparando captura…');
        flow.init();
        if (typeof window.render === 'function') window.render();
        await settle();
        await wait(120);

        const phone = document.querySelector('.phone');
        if (!phone) throw new Error('No phone element to capture');

        const shots = [];
        for (let i = 0; i < flow.steps.length; i++) {
            const step = flow.steps[i];
            showOverlay(`Capturando paso ${i + 1} de ${flow.steps.length}…`);
            await step.run();
            if (typeof window.render === 'function') window.render();
            // Small settle delay so any layout / transition lands
            // before the snap.
            await settle();
            await wait(160);
            const dataURL = await captureNode(phone);
            shots.push({ caption: step.caption, dataURL });
        }

        showOverlay('Generando PDF…');
        const pdf = await buildPDF(flow.title, shots);
        const stamp = new Date().toISOString().slice(0, 10);
        const slug = flow.title.toLowerCase()
            .normalize('NFD').replace(/[̀-ͯ]/g, '')
            .replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        const filename = `${slug}-${stamp}.pdf`;
        // Expose the last generated blob for design-tooling / verification
        // before triggering the actual download.
        try { window.__lastFlowPDF = { name: filename, blob: pdf.output('blob') }; } catch {}
        pdf.save(filename);
    } catch (err) {
        console.error('[flow-exporter] failed:', err);
        alert('Hubo un error generando el PDF. Mira la consola para detalles.');
    } finally {
        // Restore
        if (flow.restore && snapshot) flow.restore(snapshot);
        else if (flow.cleanup) flow.cleanup();
        if (typeof window.render === 'function') window.render();
        hideOverlay();
    }
}

// ════════════════════════════════════════════════════════════════
// Flow definitions — register one per feature you want to export.
// ════════════════════════════════════════════════════════════════

// ── VIP · Reparto múltiple de tickets ───────────────────────────
registerFlow('vip.tickets.multi-share', {
    title: 'Reparto múltiple de tickets',

    snapshot() {
        const tickets = vipTicketsForCurrentEvent();
        return {
            tickets: JSON.parse(JSON.stringify(tickets)),
            vipShare: JSON.parse(JSON.stringify(state.vipShare)),
            app: state.app,
            vipTab: state.vipTab,
            vipEventScreen: state.vipEventScreen,
            vipPalcoSheetOpen: state.vipPalcoSheetOpen,
            permission: (() => { try { return localStorage.getItem('vip.contactsPermission'); } catch { return null; }})()
        };
    },

    restore(snap) {
        const tickets = vipTicketsForCurrentEvent();
        // Replace contents in-place to keep the array reference stable
        tickets.length = 0;
        snap.tickets.forEach(t => tickets.push(t));
        state.vipShare = snap.vipShare;
        state.app = snap.app;
        state.vipTab = snap.vipTab;
        state.vipEventScreen = snap.vipEventScreen;
        state.vipPalcoSheetOpen = snap.vipPalcoSheetOpen;
        try {
            if (snap.permission) localStorage.setItem('vip.contactsPermission', snap.permission);
            else localStorage.removeItem('vip.contactsPermission');
        } catch {}
    },

    init() {
        // Land on the tickets screen with a clean ticket list.
        state.app = 'vip';
        state.vipTab = 'eventos';
        state.vipEventScreen = 'tickets';
        state.vipPalcoSheetOpen = false;

        const tickets = vipTicketsForCurrentEvent();
        tickets.forEach((t, i) => {
            t.status = i === 0 ? 'mine' : 'unassigned';
            t.contactId = null;
            t.sentAt = null;
            t.channel = null;
        });

        state.vipShare.step = null;
        state.vipShare.selection = [];
        state.vipShare.activeIdx = null;
        state.vipShare.progress = 0;
        state.vipShare.disclaimerSeen = false;

        // Reset permission so step 2 captures the iOS-style alert.
        try { localStorage.removeItem('vip.contactsPermission'); } catch {}
    },

    steps: [
        {
            caption: '1 · Tu palco · 19 tickets, 18 sin asignar',
            async run() {
                state.vipShare.step = null;
                // Make sure the screen body is scrolled to show the
                // pending-tickets summary card (otherwise it sits below
                // the fold on smaller heights).
                const sb = document.querySelector('#screenBody');
                if (sb) sb.scrollTop = 220;
            }
        },
        {
            caption: '2 · Permiso para acceder a contactos',
            async run() {
                state.vipShare.step = 'permission';
            }
        },
        {
            caption: '3 · Picker · badges de canal por contacto',
            async run() {
                try { localStorage.setItem('vip.contactsPermission', 'granted'); } catch {}
                state.vipShare.step = 'picker';
                state.vipShare.selection = [];
            }
        },
        {
            caption: '4 · 4 contactos seleccionados',
            async run() {
                // Mix on purpose: c01 (both), c03 (sms only),
                // c04 (email only), c06 (sms only).
                state.vipShare.selection = ['c01', 'c03', 'c04', 'c06'];
            }
        },
        {
            caption: '5 · Preview · routing automático por canal',
            async run() {
                commitPickerAssignment();
                state.vipShare.step = 'preview';
                state.vipShare.selection = [];
            }
        },
        {
            caption: '6 · Cambiar canal o destinatario en una fila',
            async run() {
                state.vipShare.activeIdx = 0; // María González (has both)
                state.vipShare.step = 'row-actions';
            }
        },
        {
            caption: '7 · Disclaimer "Una persona, un ticket"',
            async run() {
                state.vipShare.activeIdx = null;
                state.vipShare.step = 'disclaimer';
            }
        },
        {
            caption: '8 · Enviando · desglose por canal',
            async run() {
                state.vipShare.step = 'sending';
                state.vipShare.progress = 2;
                // Mark first 2 as sent so the breakdown line shows real
                // counts during the screenshot.
                const tickets = vipTicketsForCurrentEvent();
                const assigned = tickets.filter(t => t.status === 'assigned');
                assigned.slice(0, 2).forEach(t => {
                    t.status = 'sent';
                    t.sentAt = Date.now();
                    if (!t.channel) t.channel = vipDefaultChannelFor(vipContactById(t.contactId));
                });
            }
        },
        {
            caption: '9 · Enviados · 2 por correo, 2 por SMS',
            async run() {
                const tickets = vipTicketsForCurrentEvent();
                tickets.forEach(t => {
                    if (t.status === 'assigned') {
                        t.status = 'sent';
                        t.sentAt = Date.now();
                        if (!t.channel) t.channel = vipDefaultChannelFor(vipContactById(t.contactId));
                    }
                });
                state.vipShare.progress = 4;
                state.vipShare.step = 'sent';
            }
        },
        {
            caption: '10 · Lista actualizada · 4 enviados, 14 pendientes',
            async run() {
                state.vipShare.step = null;
                const sb = document.querySelector('#screenBody');
                if (sb) sb.scrollTop = 240;
            }
        }
    ]
});

})();
