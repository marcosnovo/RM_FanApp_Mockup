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
    run: runFlow,
    capturePhoneToPNG
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

// ── Public: full-screen capture of the phone (with scroll) ───────
//
// Toma el `.phone-screen` (sin el bisel exterior) y captura TODO su
// contenido scrollable como un PNG vertical. El truco:
//   1. Marcamos el body con la clase `capture-mode` que en CSS reescribe
//      los scrollers anidados a layout estático (height auto, overflow
//      visible) para que el contenido se despliegue verticalmente.
//   2. Dejamos un frame para que Safari/Chrome reflowen.
//   3. Capturamos el .phone-screen con html2canvas, pidiendo la altura
//      total del scroll (scrollHeight) en vez de la altura visible.
//   4. Restauramos.
//
// Devuelve el blob PNG y dispara la descarga automática.
async function capturePhoneToPNG({ filename } = {}) {
    const screen = document.querySelector('.phone-screen');
    if (!screen) throw new Error('No phone screen to capture');

    showOverlay('Cargando libreria de captura…');
    await ensureLibs();

    showOverlay('Preparando captura…');

    // Recolecta los scrollers anidados que tendremos que neutralizar y
    // guarda su scrollTop para restaurarlo después.
    const scrollers = [
        screen.querySelector('#screenBody'),
        screen.querySelector('#hv2Scroll')
    ].filter(Boolean);
    const scrollSnap = scrollers.map(el => ({ el, top: el.scrollTop }));

    const tabBar = screen.querySelector('.tab-bar-slot');
    const homeInd = screen.querySelector('.home-indicator');

    // Activa modo captura: el CSS asociado deshace el clipping y deja
    // que todo el contenido fluya hacia abajo.
    document.body.classList.add('capture-mode');

    // Restablece scroll a 0 dentro de los scrollers para que el
    // despliegue empiece arriba (si el usuario tenía scroll a mitad,
    // queremos la captura desde el origen).
    scrollers.forEach(s => { s.scrollTop = 0; });

    // Espera 2 frames para que el reflow termine y las animaciones
    // CSS se asienten.
    await wait(60);

    // Calcula la altura total que debe tener el canvas: la pantalla
    // del iPhone como base + el extra del scroll desplegado.
    const fullHeight = Math.max(screen.scrollHeight, screen.offsetHeight);

    let canvas;
    try {
        canvas = await window.html2canvas(screen, {
            backgroundColor: '#0B1220',
            scale: 2,                      // doble densidad: imprimible en presentaciones
            logging: false,
            useCORS: false,
            allowTaint: true,
            imageTimeout: 5000,
            foreignObjectRendering: false,
            width: screen.offsetWidth,
            height: fullHeight,
            windowWidth: screen.offsetWidth,
            windowHeight: fullHeight
        });
    } finally {
        // Restaura SIEMPRE, incluso si la captura falla.
        document.body.classList.remove('capture-mode');
        scrollSnap.forEach(({ el, top }) => { el.scrollTop = top; });
        // Intencionalmente referenciamos tabBar/homeInd para evitar
        // que el linter avise de var no usada; el CSS de capture-mode
        // ya los oculta durante la captura.
        void tabBar; void homeInd;
    }

    showOverlay('Generando PNG…');
    const blob = await new Promise(resolve =>
        canvas.toBlob(b => resolve(b), 'image/png')
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const stamp = new Date().toISOString().slice(0, 19).replace(/[:T]/g, '-');
    a.download = filename || `rm-fanapp-captura-${stamp}.png`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);

    hideOverlay();
    return { blob, filename: a.download };
}

// ── PDF assembler ────────────────────────────────────────────────
//
// `paths` is an array of `{ label, shots[] }`. A flow with one path
// gets a clean grid; a flow with multiple paths gets a section per
// path (header band + grid). Page size is auto-computed so everything
// fits on a single landscape page.
async function buildPDF(title, paths) {
    const { jsPDF } = window.jspdf;

    // Phone frame native size 393 × 830 (ratio ≈ 0.473).
    const SHOT_W    = 220;
    const SHOT_H    = Math.round(SHOT_W * (830 / 393));   // ≈ 465
    const GAP_X     = 24;
    const GAP_Y     = 56;   // gap below a row of shots (caption fits)
    const PAD       = 44;
    const TITLE_H   = 70;
    const SECTION_H = 38;   // vertical band per path label
    const PATH_GAP  = 24;   // breathing room between paths

    // Cap columns by the largest path; if any path has ≤4 shots we
    // still use up to 5 cols so single rows look balanced.
    const maxShotsInPath = Math.max(...paths.map(p => p.shots.length));
    const cols = Math.min(6, Math.max(3, Math.ceil(Math.sqrt(maxShotsInPath * 2))));

    const rowsForPath = (n) => Math.ceil(n / cols);
    const heightForPath = (p) => {
        const rows = rowsForPath(p.shots.length);
        return SECTION_H + rows * SHOT_H + (rows - 1) * GAP_Y;
    };

    const pageW = PAD * 2 + cols * SHOT_W + (cols - 1) * GAP_X;
    const pageH = PAD + TITLE_H +
                  paths.reduce((acc, p, i) => acc + heightForPath(p) + (i < paths.length - 1 ? PATH_GAP : 0), 0) +
                  PAD;

    // The `format: [pageW, pageH]` already determines orientation; do
    // NOT pass `orientation:'landscape'` because that would swap the
    // dimensions and rotate the page.
    const pdf = new jsPDF({ unit: 'pt', format: [pageW, pageH] });

    // Background tint matching the mockup chrome
    pdf.setFillColor(13, 14, 22);
    pdf.rect(0, 0, pageW, pageH, 'F');

    // Document title
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

    // Paths
    let yCursor = PAD + TITLE_H;
    const showPathLabels = paths.length > 1;
    paths.forEach((path, pIdx) => {
        if (showPathLabels) {
            // Section divider line
            pdf.setDrawColor(60, 62, 76);
            pdf.setLineWidth(0.6);
            pdf.line(PAD, yCursor + 6, pageW - PAD, yCursor + 6);
            // Section label (gold-ish accent dot + text)
            pdf.setFillColor(201, 163, 110);   // var(--vip-gold)
            pdf.circle(PAD + 5, yCursor + 22, 4, 'F');
            pdf.setFont('helvetica', 'bold');
            pdf.setFontSize(13);
            pdf.setTextColor(232, 232, 240);
            pdf.text(`${pIdx + 1}. ${path.label}`, PAD + 16, yCursor + 26);
            // Step count chip on the right
            pdf.setFont('helvetica', 'normal');
            pdf.setFontSize(10);
            pdf.setTextColor(150, 150, 160);
            pdf.text(`${path.shots.length} pasos`, pageW - PAD, yCursor + 26, { align: 'right' });
        }

        const gridY = yCursor + (showPathLabels ? SECTION_H : 0);
        path.shots.forEach((shot, i) => {
            const col = i % cols;
            const row = Math.floor(i / cols);
            const x = PAD + col * (SHOT_W + GAP_X);
            const y = gridY + row * (SHOT_H + GAP_Y);
            pdf.addImage(shot.dataURL, 'JPEG', x, y, SHOT_W, SHOT_H);

            pdf.setFontSize(10);
            pdf.setTextColor(220, 220, 230);
            pdf.text(shot.caption, x + SHOT_W / 2, y + SHOT_H + 18, {
                align: 'center', maxWidth: SHOT_W + 12
            });
        });

        yCursor += heightForPath(path) + PATH_GAP;
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

    // Normalize: a flow either declares `paths` (multi-path) or `steps`
    // (single path, treated as one path with no label).
    const paths = flow.paths
        ? flow.paths
        : [{ label: 'Flujo principal', steps: flow.steps || [] }];
    const totalSteps = paths.reduce((acc, p) => acc + p.steps.length, 0);

    // Snapshot — we'll restore via the flow's own `restore` if defined,
    // else just call cleanup().
    const snapshot = flow.snapshot ? flow.snapshot() : null;

    try {
        const phone = document.querySelector('.phone');
        if (!phone) throw new Error('No phone element to capture');

        // Capture every path. flow.init() runs before each path so
        // every branch starts from the same baseline state.
        const captured = [];
        let stepIdx = 0;
        for (let pi = 0; pi < paths.length; pi++) {
            const path = paths[pi];
            showOverlay(paths.length > 1
                ? `Preparando "${path.label}"…`
                : 'Preparando captura…');
            flow.init();
            if (typeof window.render === 'function') window.render();
            await settle();
            await wait(120);

            const pathShots = [];
            for (let i = 0; i < path.steps.length; i++) {
                stepIdx++;
                const step = path.steps[i];
                showOverlay(`Capturando paso ${stepIdx} de ${totalSteps}…`);
                await step.run();
                if (typeof window.render === 'function') window.render();
                await settle();
                await wait(160);
                const dataURL = await captureNode(phone);
                pathShots.push({ caption: step.caption, dataURL });
            }
            captured.push({ label: path.label, shots: pathShots });
        }

        showOverlay('Generando PDF…');
        const pdf = await buildPDF(flow.title, captured);
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

// ── Generic snapshot/restore (works for any feature) ──────────────
// Captures the entire state object + all flag values + relevant
// localStorage keys. Restoring puts the user back exactly where they
// were before the export started.
function genericSnapshot() {
    const flagSnap = {};
    if (typeof FLAGS !== 'undefined') {
        FLAGS.forEach(f => { flagSnap[f.key] = Flags._isEnabledRaw(f.key); });
    }
    const ls = {};
    ['vip.contactsPermission', 'rm_hoy_auth_mock_v1'].forEach(k => {
        try { ls[k] = localStorage.getItem(k); } catch {}
    });
    return {
        state: JSON.parse(JSON.stringify(state)),
        flagSnap,
        ls
    };
}
function genericRestore(snap) {
    // Restore localStorage first (some modules read from it on hydrate)
    Object.entries(snap.ls).forEach(([k, v]) => {
        try {
            if (v == null) localStorage.removeItem(k);
            else localStorage.setItem(k, v);
        } catch {}
    });
    // Restore state in-place (state is a const, mutate keys)
    Object.keys(state).forEach(k => { delete state[k]; });
    Object.assign(state, snap.state);
    // Restore flag overrides via Flags.set (rebuilds the cache)
    Object.entries(snap.flagSnap).forEach(([k, v]) => {
        if (Flags._isEnabledRaw(k) !== v) Flags.set(k, v);
    });
}

// ── Helper: navigate to a Fan App tab/sub with a flag ON ─────────
// Many fan flows want the same baseline: app=fan, specific tab/sub,
// the feature's flag enabled, side menu closed, no detail sheets open.
function fanInit({ tab = 'hoy', sub = 'directo', flags = [], extra } = {}) {
    state.app = 'fan';
    state.tab = tab;
    state.sub = sub;
    state.sideMenuOpen = false;
    state.sideMenuDetail = null;
    state.sideMenuSearch = '';
    state.newsId = null;
    state.playingVideoId = null;
    state.openMatchSummary = null;
    state.openHighlightsAll = null;
    state.openStory = null;
    state.openBehindScenes = null;
    state.openRanking = false;
    state.hoyEditorOpen = false;
    flags.forEach(f => Flags.set(f, true));
    if (typeof extra === 'function') extra();
}

// Scroll the screen body to a position (after render).
function scrollScreen(top) {
    const sb = document.querySelector('#screenBody');
    if (sb) sb.scrollTop = top;
}

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

    paths: [
        // ── Camino 1 · happy path ─────────────────────────────────
        {
            label: 'Camino principal · permiso aceptado y reparto enviado',
            steps: [
                {
                    caption: '1 · Tu palco · 19 tickets, 18 sin asignar',
                    async run() {
                        state.vipShare.step = null;
                        const sb = document.querySelector('#screenBody');
                        if (sb) sb.scrollTop = 220;
                    }
                },
                {
                    caption: '2 · Permiso para acceder a contactos',
                    async run() { state.vipShare.step = 'permission'; }
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
                        // Mix deliberado: c01 (ambos), c03 (solo SMS),
                        // c04 (solo email), c06 (solo SMS).
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
                    caption: '6 · Disclaimer "Una persona, un ticket"',
                    async run() { state.vipShare.step = 'disclaimer'; }
                },
                {
                    caption: '7 · Enviando · desglose por canal',
                    async run() {
                        state.vipShare.step = 'sending';
                        state.vipShare.progress = 2;
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
                    caption: '8 · Enviados · 2 por correo, 2 por SMS',
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
                    caption: '9 · Lista actualizada · 4 enviados, 14 pendientes',
                    async run() {
                        state.vipShare.step = null;
                        const sb = document.querySelector('#screenBody');
                        if (sb) sb.scrollTop = 240;
                    }
                }
            ]
        },

        // ── Camino 2 · permiso denegado ───────────────────────────
        // Cubre el caso en que el usuario rechaza dar acceso a sus
        // contactos: no se puede continuar y vuelve a la lista.
        {
            label: 'Si rechaza el permiso · vuelve a la lista de tickets',
            steps: [
                {
                    caption: '1 · Pulsa "+18 sin asignar"',
                    async run() {
                        state.vipShare.step = null;
                        const sb = document.querySelector('#screenBody');
                        if (sb) sb.scrollTop = 220;
                    }
                },
                {
                    caption: '2 · iOS pide permiso de contactos',
                    async run() { state.vipShare.step = 'permission'; }
                },
                {
                    caption: '3 · Tras "No permitir" se cierra el flujo',
                    async run() {
                        state.vipShare.step = null;
                        const sb = document.querySelector('#screenBody');
                        if (sb) sb.scrollTop = 220;
                    }
                }
            ]
        },

        // ── Camino 3 · cambiar canal de un destinatario ───────────
        // Muestra que cuando un contacto tiene email + SMS el usuario
        // puede forzar el canal alternativo desde el preview.
        {
            label: 'Cambiar canal de un destinatario en el preview',
            steps: [
                {
                    caption: '1 · Preview con María González por correo',
                    async run() {
                        try { localStorage.setItem('vip.contactsPermission', 'granted'); } catch {}
                        state.vipShare.selection = ['c01', 'c05'];
                        commitPickerAssignment();
                        state.vipShare.selection = [];
                        state.vipShare.step = 'preview';
                    }
                },
                {
                    caption: '2 · Tap en la fila → opciones',
                    async run() {
                        state.vipShare.activeIdx = 0;
                        state.vipShare.step = 'row-actions';
                    }
                },
                {
                    caption: '3 · "Enviar por SMS en su lugar"',
                    async run() {
                        // Switch the channel of María González to SMS.
                        const tickets = vipTicketsForCurrentEvent();
                        const draft = tickets.filter(t => t.status === 'assigned');
                        if (draft[0]) draft[0].channel = 'sms';
                        state.vipShare.activeIdx = null;
                        state.vipShare.step = 'preview';
                    }
                }
            ]
        }
    ]
});

// ── Fan · Hoy v2 — 3 conceptos del PRD (A/B/C) ───────────────────
registerFlow('fan.hoy.v2-options', {
    title: 'Hoy v2 · 3 conceptos (A/B/C)',
    snapshot: genericSnapshot, restore: genericRestore,
    init() {
        fanInit({ tab: 'hoy', sub: 'directo',
                  flags: ['fan.hoy.v2-options'] });
        // Reset transient state to baseline para que el primer step de
        // cada path empiece igual.
        state.hoyV2Concept = 'A';
        state.hoyV2Matchday = false;
        state.hoyV2FeedIndex = 0;
        state.hoyV2FeedFilter = 'all';
        state.hoyV2Prediction = null;
        state.hoyV2InfoOpen = false;
        state.hoyV2PipOpen = true;
    },
    paths: [
        {
            label: 'Concepto A · The Madrid Times (conservador)',
            steps: [
                { caption: '1 · Selector + sello editorial',     async run() { state.hoyV2Concept = 'A'; scrollScreen(0); } },
                { caption: '2 · Racha Madridista (7 días)',      async run() { state.hoyV2Concept = 'A'; scrollScreen(180); } },
                { caption: '3 · Hoy en el Club + Próximos',      async run() { state.hoyV2Concept = 'A'; scrollScreen(420); } },
                { caption: '4 · Banner Tienda (-15%)',           async run() { state.hoyV2Concept = 'A'; scrollScreen(900); } }
            ]
        },
        {
            label: 'Concepto B · Madrid Live (recomendado, non-matchday)',
            steps: [
                { caption: '1 · Match strip + chips Para ti',    async run() {
                    state.hoyV2Concept = 'B'; state.hoyV2Matchday = false;
                    state.hoyV2FeedIndex = 0; state.hoyV2FeedFilter = 'all'; scrollScreen(0);
                } },
                { caption: '2 · Feed vertical 9:16 dominante',   async run() {
                    state.hoyV2Concept = 'B'; state.hoyV2Matchday = false; scrollScreen(160);
                } },
                { caption: '3 · Filtro Mbappé activo',           async run() {
                    state.hoyV2Concept = 'B'; state.hoyV2FeedFilter = 'mbappe';
                    state.hoyV2FeedIndex = 0; scrollScreen(160);
                } },
                { caption: '4 · Predictor: 2-1 enviada (#428)',  async run() {
                    state.hoyV2Concept = 'B'; state.hoyV2FeedFilter = 'all';
                    state.hoyV2Prediction = '2-1'; scrollScreen(580);
                } },
                { caption: '5 · Tiles: Tienda · Bernabéu · RMTV', async run() { scrollScreen(900); } }
            ]
        },
        {
            label: 'Concepto B · Modo Día de Partido',
            steps: [
                { caption: '1 · Marcador en directo 0-1 · 64\'',  async run() {
                    state.hoyV2Concept = 'B'; state.hoyV2Matchday = true;
                    state.hoyV2Prediction = null; scrollScreen(0);
                } },
                { caption: '2 · Pin audio Carrusel + eventos',    async run() { scrollScreen(180); } },
                { caption: '3 · Madridismo Live (chat moderado)', async run() { scrollScreen(320); } },
                { caption: '4 · Stats en directo + Feed',         async run() { scrollScreen(540); } }
            ]
        },
        {
            label: 'Concepto C · Madrid Universe (ambicioso)',
            steps: [
                { caption: '1 · Identidad: 🔥27 · 🪙142',         async run() {
                    state.hoyV2Concept = 'C'; state.hoyV2Matchday = false;
                    state.hoyV2PipOpen = true; scrollScreen(0);
                } },
                { caption: '2 · Stories + Feed ML',               async run() { scrollScreen(120); } },
                { caption: '3 · PiP RMTV + Tu Peña Lavapiés',     async run() { scrollScreen(420); } },
                { caption: '4 · Bernabéu hoy + Coleccionables',   async run() { scrollScreen(720); } }
            ]
        }
    ]
});

// ── Fan · Hoy v2 — estructura modular ────────────────────────────
registerFlow('fan.hoy.v2-structure', {
    title: 'Hoy v2 — estructura modular',
    snapshot: genericSnapshot, restore: genericRestore,
    init() { fanInit({ tab: 'hoy', sub: 'directo', flags: ['fan.hoy.v2-structure'] }); },
    paths: [
        {
            label: 'Recorrido principal por la nueva Hoy',
            steps: [
                { caption: '1 · Cabecera y próximo partido', async run() { scrollScreen(0); } },
                { caption: '2 · Listado de noticias', async run() { scrollScreen(420); } },
                { caption: '3 · Carrusel de highlights', async run() { scrollScreen(900); } },
                { caption: '4 · Encuesta y cierre',     async run() { scrollScreen(1500); } }
            ]
        },
        {
            label: 'Detalle de noticia',
            steps: [
                { caption: '1 · Lista de noticias', async run() { scrollScreen(420); } },
                { caption: '2 · Detalle abierto',   async run() {
                    state.newsId = 'news-1';
                    scrollScreen(0);
                } }
            ]
        }
    ]
});

// ── Fan · Stories + Tras las cámaras ─────────────────────────────
registerFlow('fan.hoy.stories', {
    title: 'Stories + Tras las cámaras',
    snapshot: genericSnapshot, restore: genericRestore,
    init() { fanInit({ tab: 'hoy', sub: 'directo',
                       flags: ['fan.hoy.v2-structure', 'fan.hoy.stories'] }); },
    paths: [
        {
            label: 'Carrusel de stories',
            steps: [
                { caption: '1 · Stories arriba del todo', async run() { scrollScreen(0); } },
                { caption: '2 · Story abierto en pantalla completa', async run() {
                    state.openStory = { storyId: 's1', pageIdx: 0 };
                } }
            ]
        },
        {
            label: 'Tras las cámaras',
            steps: [
                { caption: '1 · Sección "Tras las cámaras"', async run() {
                    state.openStory = null;
                    scrollScreen(750);
                } },
                { caption: '2 · Galería abierta', async run() {
                    state.openBehindScenes = 'bs-1';
                } }
            ]
        }
    ]
});

// ── Fan · Gamificación ───────────────────────────────────────────
registerFlow('fan.hoy.gamification', {
    title: 'Gamificación · predicciones y ranking',
    snapshot: genericSnapshot, restore: genericRestore,
    init() {
        fanInit({ tab: 'hoy', sub: 'directo',
                  flags: ['fan.hoy.v2-structure', 'fan.hoy.gamification'] });
        // Reset predictions so step 1 captures the empty form.
        state.predictions = {};
        state.predictionDraft = {};
    },
    paths: [
        {
            label: 'Predecir el marcador del próximo partido',
            steps: [
                { caption: '1 · Bloque de predicción vacío', async run() {
                    scrollScreen(380);
                } },
                { caption: '2 · Marcador rellenado', async run() {
                    const m = (typeof HEADER_MATCHES !== 'undefined' && HEADER_MATCHES[0]) || { id: 'm1' };
                    state.predictionDraft = { [m.id]: { home: 2, away: 1 } };
                    scrollScreen(380);
                } },
                { caption: '3 · Predicción enviada', async run() {
                    const m = (typeof HEADER_MATCHES !== 'undefined' && HEADER_MATCHES[0]) || { id: 'm1' };
                    state.predictions = { [m.id]: { home: 2, away: 1, submittedAt: Date.now() } };
                    state.predictionDraft = {};
                    scrollScreen(380);
                } }
            ]
        },
        {
            label: 'Ranking local',
            steps: [
                { caption: '1 · Ranking abierto', async run() { state.openRanking = true; } }
            ]
        }
    ]
});

// ── Fan · Cabecera global de login/bienvenida ────────────────────
registerFlow('fan.app.login-header', {
    title: 'Cabecera global de login / bienvenida',
    snapshot: genericSnapshot, restore: genericRestore,
    init() {
        fanInit({ tab: 'hoy', sub: 'directo', flags: ['fan.app.login-header'] });
        state.hoyAuthMock = { tierIdx: 0, name: 'Marcos' };
    },
    paths: [
        {
            label: 'Cicla por todos los tiers desde "Visitante"',
            steps: [
                { caption: '1 · Visitante · "Inicia sesión"', async run() {
                    state.hoyAuthMock = { tierIdx: 0, name: 'Marcos' };
                    scrollScreen(0);
                } },
                { caption: '2 · Socio',             async run() { state.hoyAuthMock = { tierIdx: 1, name: 'Marcos' }; scrollScreen(0); } },
                { caption: '3 · Madridista',        async run() { state.hoyAuthMock = { tierIdx: 2, name: 'Marcos' }; scrollScreen(0); } },
                { caption: '4 · Madridista Junior', async run() { state.hoyAuthMock = { tierIdx: 3, name: 'Marcos' }; scrollScreen(0); } },
                { caption: '5 · Madridista Premium',async run() { state.hoyAuthMock = { tierIdx: 4, name: 'Marcos' }; scrollScreen(0); } },
                { caption: '6 · Madridista Platinum',async run() { state.hoyAuthMock = { tierIdx: 5, name: 'Marcos' }; scrollScreen(0); } }
            ]
        },
        {
            label: 'Persistencia entre pestañas',
            steps: [
                { caption: '1 · Cabecera en Hoy',       async run() { state.hoyAuthMock = { tierIdx: 4, name: 'Marcos' }; state.tab = 'hoy'; scrollScreen(0); } },
                { caption: '2 · La cabecera sigue en Noticias', async run() { state.tab = 'noticias'; state.newsId = null; scrollScreen(0); } },
                { caption: '3 · …y también en RMTV',    async run() { state.tab = 'rmtv'; scrollScreen(0); } }
            ]
        }
    ]
});

// ── Fan · Pestañas por equipo en Hoy ─────────────────────────────
registerFlow('fan.hoy.team-tabs', {
    title: 'Pestañas por equipo en Hoy',
    snapshot: genericSnapshot, restore: genericRestore,
    init() {
        fanInit({ tab: 'hoy', sub: 'directo',
                  flags: ['fan.hoy.v2-structure', 'fan.hoy.team-tabs'] });
        state.hoyTeamFilter = 'all';
        state.hoyTabsVisible = { masc: true, fem: true, basket: true };
        state.hoyTabsEmoji = false;
    },
    paths: [
        {
            label: 'Filtra Hoy por deporte',
            steps: [
                { caption: '1 · Pestañas Todo · Masc · Fem · Basket', async run() { state.hoyTeamFilter = 'all'; scrollScreen(0); } },
                { caption: '2 · Filtrado a Fútbol masculino', async run() { state.hoyTeamFilter = 'masc'; scrollScreen(0); } },
                { caption: '3 · Filtrado a Fútbol femenino',  async run() { state.hoyTeamFilter = 'fem'; scrollScreen(0); } },
                { caption: '4 · Filtrado a Baloncesto',       async run() { state.hoyTeamFilter = 'basket'; scrollScreen(0); } }
            ]
        }
    ]
});

// ── Fan · Pestañas con emojis (variante de team-tabs) ────────────
registerFlow('fan.hoy.team-tabs.emoji', {
    title: 'Pestañas por equipo · variante con emojis',
    snapshot: genericSnapshot, restore: genericRestore,
    init() {
        fanInit({ tab: 'hoy', sub: 'directo',
                  flags: ['fan.hoy.v2-structure', 'fan.hoy.team-tabs', 'fan.hoy.team-tabs.emoji'] });
        state.hoyTeamFilter = 'all';
        state.hoyTabsEmoji = true;
    },
    paths: [{
        label: 'Pestañas con icono emoji',
        steps: [
            { caption: '1 · Variante "Todo · ⚽ Masc · ⚽ Fem · 🏀"', async run() { scrollScreen(0); } },
            { caption: '2 · Filtrado a Baloncesto', async run() { state.hoyTeamFilter = 'basket'; scrollScreen(0); } }
        ]
    }]
});

// ── Fan · Editor de pestañas ─────────────────────────────────────
registerFlow('fan.hoy.team-tabs.editor', {
    title: 'Editor de pestañas (activar / ocultar)',
    snapshot: genericSnapshot, restore: genericRestore,
    init() {
        fanInit({ tab: 'hoy', sub: 'directo',
                  flags: ['fan.hoy.v2-structure', 'fan.hoy.team-tabs', 'fan.hoy.team-tabs.editor'] });
        state.hoyTabsVisible = { masc: true, fem: true, basket: true };
        state.hoyEditorOpen = false;
    },
    paths: [{
        label: 'Ocultar la pestaña de Baloncesto',
        steps: [
            { caption: '1 · Botón ⚙ junto a las pestañas', async run() { scrollScreen(0); } },
            { caption: '2 · Editor abierto', async run() { state.hoyEditorOpen = true; } },
            { caption: '3 · Baloncesto desactivado', async run() {
                state.hoyTabsVisible = { masc: true, fem: true, basket: false };
            } },
            { caption: '4 · Pestañas reducidas', async run() {
                state.hoyEditorOpen = false;
                state.hoyTeamFilter = 'all';
                scrollScreen(0);
            } }
        ]
    }]
});

// ── Fan · Side menu v2 ───────────────────────────────────────────
registerFlow('fan.sidemenu.v2', {
    title: 'Side menu v2 — escalable',
    snapshot: genericSnapshot, restore: genericRestore,
    init() {
        fanInit({ tab: 'hoy', sub: 'directo', flags: ['fan.sidemenu.v2'] });
        state.sideMenuOpen = false;
    },
    paths: [
        {
            label: 'Recorrido por las secciones',
            steps: [
                { caption: '1 · Botón abre el menú',       async run() { state.sideMenuOpen = false; scrollScreen(0); } },
                { caption: '2 · Cabecera + accesos rápidos', async run() { state.sideMenuOpen = true; scrollScreen(0); } },
                { caption: '3 · Sección Preferencias',      async run() {
                    state.sideMenuOpen = true;
                    setTimeout(() => { const p = document.querySelector('.side-menu-panel, .side-menu-overlay.v2'); if (p) p.scrollTop = 360; }, 0);
                } },
                { caption: '4 · Sección Ayuda y Legal',     async run() {
                    setTimeout(() => { const p = document.querySelector('.side-menu-panel, .side-menu-overlay.v2'); if (p) p.scrollTop = 720; }, 0);
                } }
            ]
        }
    ]
});

// ── Fan · Sub-flags del side menu (un flujo por sub-funcionalidad) ─
registerFlow('fan.sidemenu.v2.search', {
    title: 'Side menu · buscador de ajustes',
    snapshot: genericSnapshot, restore: genericRestore,
    init() {
        fanInit({ tab: 'hoy', sub: 'directo',
                  flags: ['fan.sidemenu.v2', 'fan.sidemenu.v2.search'] });
        state.sideMenuOpen = true;
        state.sideMenuSearch = '';
    },
    paths: [{
        label: 'Buscar dentro del menú',
        steps: [
            { caption: '1 · Buscador vacío',     async run() { state.sideMenuSearch = ''; } },
            { caption: '2 · Filtrado por "perfil"', async run() { state.sideMenuSearch = 'perfil'; } },
            { caption: '3 · Filtrado por "noti"',   async run() { state.sideMenuSearch = 'noti'; } }
        ]
    }]
});

registerFlow('fan.sidemenu.v2.quick-actions', {
    title: 'Side menu · accesos rápidos',
    snapshot: genericSnapshot, restore: genericRestore,
    init() {
        fanInit({ tab: 'hoy', sub: 'directo',
                  flags: ['fan.sidemenu.v2', 'fan.sidemenu.v2.quick-actions',
                          'fan.sidemenu.v2.mock-detail'] });
        state.sideMenuOpen = true;
    },
    paths: [{
        label: 'Pulsa un acceso rápido',
        steps: [
            { caption: '1 · Fila de chips arriba del menú', async run() { state.sideMenuDetail = null; } },
            { caption: '2 · "Carnet" → ficha digital',      async run() { state.sideMenuDetail = 'carnet'; } },
            { caption: '3 · "Entradas" → mis entradas',     async run() { state.sideMenuDetail = 'entradas'; } }
        ]
    }]
});

registerFlow('fan.sidemenu.v2.preferences', {
    title: 'Side menu · sección Preferencias',
    snapshot: genericSnapshot, restore: genericRestore,
    init() {
        fanInit({ tab: 'hoy', sub: 'directo',
                  flags: ['fan.sidemenu.v2', 'fan.sidemenu.v2.preferences'] });
        state.sideMenuOpen = true;
    },
    paths: [{
        label: 'Equipos favoritos, notificaciones, idioma',
        steps: [
            { caption: '1 · Bloque "Preferencias"', async run() {
                setTimeout(() => { const p = document.querySelector('.side-menu-panel, .side-menu-overlay.v2'); if (p) p.scrollTop = 320; }, 0);
            } },
            { caption: '2 · Detalle de Idioma', async run() {
                state.sideMenuDetail = 'idioma';
            } }
        ]
    }]
});

registerFlow('fan.sidemenu.v2.support', {
    title: 'Side menu · Ayuda y Legal',
    snapshot: genericSnapshot, restore: genericRestore,
    init() {
        fanInit({ tab: 'hoy', sub: 'directo',
                  flags: ['fan.sidemenu.v2', 'fan.sidemenu.v2.support'] });
        state.sideMenuOpen = true;
    },
    paths: [{
        label: 'Recorrido por las secciones de Ayuda y Legal',
        steps: [
            { caption: '1 · Sección Ayuda', async run() {
                setTimeout(() => { const p = document.querySelector('.side-menu-panel, .side-menu-overlay.v2'); if (p) p.scrollTop = 600; }, 0);
            } },
            { caption: '2 · Sección Legal', async run() {
                setTimeout(() => { const p = document.querySelector('.side-menu-panel, .side-menu-overlay.v2'); if (p) p.scrollTop = 820; }, 0);
            } }
        ]
    }]
});

registerFlow('fan.sidemenu.v2.mock-detail', {
    title: 'Side menu · pantallas ficticias',
    snapshot: genericSnapshot, restore: genericRestore,
    init() {
        fanInit({ tab: 'hoy', sub: 'directo',
                  flags: ['fan.sidemenu.v2', 'fan.sidemenu.v2.mock-detail',
                          'fan.sidemenu.v2.quick-actions'] });
        state.sideMenuOpen = true;
    },
    paths: [{
        label: 'Distintos contenidos placeholder',
        steps: [
            { caption: '1 · Mi perfil',         async run() { state.sideMenuDetail = 'perfil'; } },
            { caption: '2 · Mis entradas',      async run() { state.sideMenuDetail = 'entradas'; } },
            { caption: '3 · Socios & Madridistas', async run() { state.sideMenuDetail = 'socios'; } }
        ]
    }]
});

// ── VIP · Gestión de métodos de pago ─────────────────────────────
registerFlow('vip.payments.management', {
    title: 'Gestión de métodos de pago',
    snapshot: genericSnapshot, restore: genericRestore,
    init() {
        Flags.set('vip.payments.management', true);
        state.app = 'vip';
        state.vipTab = 'perfil';
        state.vipPerfilOpen = true;
        state.vipPalcoSheetOpen = false;
        // Reset payments to seed so the screens always show the same 3 methods.
        state.vipPayments = {
            screen: null,
            methods: JSON.parse(JSON.stringify(VIP_PAYMENT_METHODS)),
            editingId: null,
            addType: null,
            draft: {},
            applePayMock: true
        };
    },
    paths: [
        {
            label: 'Acceso desde Perfil y lista de métodos guardados',
            steps: [
                { caption: '1 · Perfil con entrada "Métodos de pago"', async run() { state.vipPayments.screen = null; } },
                { caption: '2 · Lista con VISA, PayPal y Banco Santander', async run() { state.vipPayments.screen = 'list'; } }
            ]
        },
        {
            label: 'Añadir tarjeta nueva (Visa/Mastercard)',
            steps: [
                { caption: '1 · Pulsar "Add payment method"', async run() { state.vipPayments.screen = 'list'; } },
                { caption: '2 · Selector de tipo de método',  async run() { state.vipPayments.screen = 'add-type'; } },
                { caption: '3 · Formulario de nueva tarjeta', async run() {
                    state.vipPayments.addType = 'card';
                    state.vipPayments.draft = {
                        holder: 'Marcos Novo',
                        number: '5500 0000 0000 0040',
                        expiry: '12/28',
                        cvv: '321',
                        billingAddress: 'Avenida de la Castellana 100, Madrid',
                        default: false
                    };
                    state.vipPayments.screen = 'add-form';
                } },
                { caption: '4 · "Make it default" activado',  async run() {
                    state.vipPayments.draft = { ...state.vipPayments.draft, default: true };
                } }
            ]
        },
        {
            label: 'Añadir Apple Pay como método',
            steps: [
                { caption: '1 · Selector con wallets agrupados',  async run() {
                    state.vipPayments.screen = 'add-type';
                    state.vipPayments.addType = null;
                    state.vipPayments.draft = {};
                } },
                { caption: '2 · Apple Pay detectado en el iPhone', async run() {
                    state.vipPayments.addType = 'apple-pay';
                    state.vipPayments.draft = {
                        holder: 'Marcos Novo Acuses',
                        deviceLabel: 'iPhone 14 Pro de Marcos',
                        default: false
                    };
                    state.vipPayments.screen = 'add-form';
                } },
                { caption: '3 · "Make it default" activado',     async run() {
                    state.vipPayments.draft = { ...state.vipPayments.draft, default: true };
                } }
            ]
        },
        {
            label: 'Editar y eliminar un método existente',
            steps: [
                { caption: '1 · Pulsar Edit en la VISA por defecto', async run() {
                    state.vipPayments.editingId = 'pm-001';
                    state.vipPayments.draft = {};
                    state.vipPayments.screen = 'edit';
                } },
                { caption: '2 · Cambia caducidad y dirección', async run() {
                    state.vipPayments.draft = {
                        holder: 'Marcos Novo Acuses',
                        expiry: '04/29',
                        billingAddress: 'C/ Padre Damián 23, 28036 Madrid'
                    };
                } },
                { caption: '3 · Botón Remove para eliminarla', async run() {
                    // Just stay on the edit screen; the destructive button is visible.
                } }
            ]
        },
        {
            label: 'Selector de pago en checkout (con Apple Pay disponible)',
            steps: [
                { caption: '1 · Pulsar "Ver checkout con estos métodos"', async run() { state.vipPayments.screen = 'list'; } },
                { caption: '2 · Apple Pay destacado como recomendado', async run() {
                    state.vipPayments.applePayMock = true;
                    state.vipPayments.screen = 'checkout';
                } },
                { caption: '3 · Sin Apple Pay → preselecciona el método por defecto', async run() {
                    state.vipPayments.applePayMock = false;
                    state.vipPayments.screen = 'checkout';
                } }
            ]
        }
    ]
});

// ── Fan · RM Play (rebrand de RMTV) ──────────────────────────────
registerFlow('fan.rmtv.play', {
    title: 'RM Play — nueva RMTV',
    snapshot: genericSnapshot, restore: genericRestore,
    init() { fanInit({ tab: 'rmtv', flags: ['fan.rmtv.play'] }); },
    paths: [{
        label: 'Recorrido por la nueva pantalla OTT',
        steps: [
            { caption: '1 · Hero "Resumen / Ver más"',  async run() { scrollScreen(0); } },
            { caption: '2 · "Nuestro club" por deporte', async run() { scrollScreen(450); } },
            { caption: '3 · Canales Realmadrid TV',      async run() { scrollScreen(900); } },
            { caption: '4 · Tendencias y UEFA Youth',    async run() { scrollScreen(1300); } },
            { caption: '5 · Partidos 2025-26 + Originals', async run() { scrollScreen(1800); } }
        ]
    }]
});

})();
