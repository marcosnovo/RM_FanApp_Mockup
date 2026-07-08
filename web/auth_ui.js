/* ============================================================
   AUTH UI — login / forgot / reset / setup / invite screens
   ============================================================
   Extraido de app.js (bloque autocontenido) para reducir el
   monolito sin cambios de comportamiento. Los simbolos siguen
   siendo globales (script clasico, no modulo): openAuthOverlay,
   closeAuthOverlay, renderAuthOverlay, attachAuthListeners, etc.
   Depende de globals de app.js y de Auth (auth.js); se resuelven
   en runtime. Se carga tras app.js en index.html.
   ============================================================ */

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

// ── Auth UI helpers ─────────────────────────────────────────────
// Reusable bits that turn the plain inputs into a more accessible,
// less error-prone experience: show/hide eye, password strength meter,
// real-time match indicator, caps lock warning. All purely cosmetic,
// the underlying form data is unchanged.
const AUTH_EYE_OPEN = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12 s4-7 11-7 11 7 11 7 -4 7-11 7-11-7-11-7z"/><circle cx="12" cy="12" r="3"/></svg>`;
const AUTH_EYE_OFF  = `<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94 A10.07 10.07 0 0 1 12 20 c-7 0-11-8-11-8 a18.45 18.45 0 0 1 5.06-5.94 M9.9 4.24 A9.12 9.12 0 0 1 12 4 c7 0 11 8 11 8 a18.5 18.5 0 0 1-2.16 3.19 m-6.72-1.07 a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>`;
const AUTH_SPINNER  = `<span class="auth-btn-spinner" aria-hidden="true"></span>`;

/** Password input with show/hide eye + caps-lock warning slot. */
function authPasswordField({ name, label, placeholder = 'mínimo 6 caracteres', autofocus = false, withMeter = false, autocomplete = 'new-password' }) {
    return `
        <label class="auth-field" data-auth-pw-field>
            <span>${label}</span>
            <div class="auth-pw-wrap">
                <input type="password" name="${name}" placeholder="${placeholder}"
                       autocomplete="${autocomplete}" required
                       ${autofocus ? 'autofocus' : ''}
                       data-auth-pw-input>
                <button type="button" class="auth-pw-toggle"
                        data-auth-pw-toggle aria-label="Mostrar contraseña"
                        title="Mostrar contraseña">${AUTH_EYE_OPEN}</button>
            </div>
            ${withMeter ? `
                <div class="auth-pw-meter" data-auth-pw-meter aria-hidden="true">
                    <div class="auth-pw-meter-bars">
                        <span></span><span></span><span></span><span></span>
                    </div>
                    <span class="auth-pw-meter-label" data-auth-pw-meter-label>Empieza a escribir…</span>
                </div>
            ` : ''}
            <div class="auth-pw-caps" data-auth-pw-caps hidden>
                <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="18,11 12,5 6,11"/><line x1="6" y1="19" x2="18" y2="19"/></svg>
                Bloq Mayús activado
            </div>
        </label>
    `;
}

/** Mismatch warning that lights up when the two password fields differ. */
function authPasswordMatch() {
    return `<div class="auth-pw-match" data-auth-pw-match hidden>
        <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"><line x1="6" y1="6" x2="18" y2="18"/><line x1="18" y1="6" x2="6" y2="18"/></svg>
        Las contraseñas no coinciden
    </div>`;
}

/** "Step 1 of 2" pill at the top of multi-step auth flows. */
function authStepBadge(current, total, label) {
    return `<div class="auth-step-badge">
        <span class="auth-step-num">Paso ${current} de ${total}</span>
        <span class="auth-step-label">${label}</span>
    </div>`;
}

function renderLoginScreen() {
    const err = authCtx.error ? `<div class="auth-error" role="alert">${authCtx.error}</div>` : '';
    const msg = authCtx.message ? `<div class="auth-ok" role="status">${authCtx.message}</div>` : '';
    return `
        <h1 class="auth-title">Iniciar sesión</h1>
        <p class="auth-subtitle">Accede al panel de mockups de la app</p>
        ${err}${msg}
        <form class="auth-form" data-auth-form="login" novalidate>
            <label class="auth-field">
                <span>Email</span>
                <input type="email" name="email" placeholder="tu@email.com"
                       value="${authCtx.email || ''}" required autofocus
                       autocomplete="email" inputmode="email">
            </label>
            ${authPasswordField({ name: 'password', label: 'Contraseña', autocomplete: 'current-password', placeholder: '••••••••' })}
            <button type="submit" class="auth-primary-btn" data-auth-submit>
                <span class="auth-btn-label">Entrar</span>
            </button>
            <button type="button" class="auth-link-btn" data-auth-go="forgot">¿Has olvidado tu contraseña?</button>
        </form>
    `;
}

function renderForgotScreen() {
    const err = authCtx.error ? `<div class="auth-error" role="alert">${authCtx.error}</div>` : '';
    return `
        ${authStepBadge(1, 2, 'Solicitar enlace')}
        <h1 class="auth-title">Recuperar contraseña</h1>
        <p class="auth-subtitle">Introduce tu email y te enviaremos un enlace seguro para crear una nueva contraseña.</p>
        ${err}
        <form class="auth-form" data-auth-form="forgot" novalidate>
            <label class="auth-field">
                <span>Email</span>
                <input type="email" name="email" placeholder="tu@email.com" required autofocus
                       value="${authCtx.email || ''}"
                       autocomplete="email" inputmode="email">
            </label>
            <button type="submit" class="auth-primary-btn" data-auth-submit>
                <span class="auth-btn-label">Enviar enlace</span>
            </button>
            <button type="button" class="auth-link-btn" data-auth-go="login">← Volver al login</button>
        </form>
    `;
}

function renderForgotSentScreen() {
    const email = authCtx.email || '';
    return `
        ${authStepBadge(2, 2, 'Email enviado')}
        <div class="auth-icon-hero">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3,7 12,13 21,7"/></svg>
        </div>
        <h1 class="auth-title">Revisa tu correo</h1>
        <p class="auth-subtitle">
            Si <strong>${email || 'ese email'}</strong> está dado de alta, recibirás un enlace en unos segundos para
            restablecer tu contraseña. Revisa también la carpeta de <strong>spam</strong> por si acaso.
        </p>
        <ul class="auth-checklist">
            <li>El enlace expira en <strong>una hora</strong> por seguridad.</li>
            <li>Si no llega, vuelve a la pantalla anterior y reintenta.</li>
        </ul>
        <button type="button" class="auth-primary-btn" data-auth-go="login">Volver al login</button>
        <button type="button" class="auth-link-btn" data-auth-go="forgot">Reenviar a otro email</button>
    `;
}

function renderResetScreen() {
    const err = authCtx.error ? `<div class="auth-error" role="alert">${authCtx.error}</div>` : '';
    return `
        ${authStepBadge(2, 2, 'Crear nueva contraseña')}
        <h1 class="auth-title">Nueva contraseña</h1>
        <p class="auth-subtitle">Elige una contraseña fuerte para tu cuenta. Mínimo 6 caracteres; mejor si mezclas letras, números y símbolos.</p>
        ${err}
        <form class="auth-form" data-auth-form="reset" novalidate>
            ${authPasswordField({ name: 'password',  label: 'Nueva contraseña', autofocus: true, withMeter: true })}
            ${authPasswordField({ name: 'password2', label: 'Repite la contraseña' })}
            ${authPasswordMatch()}
            <button type="submit" class="auth-primary-btn" data-auth-submit>
                <span class="auth-btn-label">Guardar y entrar</span>
            </button>
        </form>
    `;
}

function renderSetupScreen() {
    const err = authCtx.error ? `<div class="auth-error" role="alert">${authCtx.error}</div>` : '';
    return `
        ${authStepBadge(1, 1, 'Bienvenido')}
        <h1 class="auth-title">Configura tu cuenta</h1>
        <p class="auth-subtitle">Has sido invitado al panel. Pon tu nombre y elige una contraseña para continuar.</p>
        ${err}
        <form class="auth-form" data-auth-form="setup" novalidate>
            <label class="auth-field">
                <span>Nombre</span>
                <input type="text" name="name" placeholder="Tu nombre completo"
                       value="${authCtx.name || ''}" autocomplete="name" autofocus>
            </label>
            ${authPasswordField({ name: 'password',  label: 'Contraseña', withMeter: true })}
            ${authPasswordField({ name: 'password2', label: 'Repite la contraseña' })}
            ${authPasswordMatch()}
            <button type="submit" class="auth-primary-btn" data-auth-submit>
                <span class="auth-btn-label">Crear cuenta</span>
            </button>
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
                toast(r.error || 'No se pudo reenviar el email.', { type: 'error' });
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

    // ── Password show/hide toggle (eye icon) ──────────────────────
    $$('[data-auth-pw-toggle]').forEach(btn => {
        btn.addEventListener('click', () => {
            const wrap = btn.closest('.auth-pw-wrap');
            const input = wrap && wrap.querySelector('input');
            if (!input) return;
            const isHidden = input.type === 'password';
            input.type = isHidden ? 'text' : 'password';
            btn.innerHTML = isHidden ? AUTH_EYE_OFF : AUTH_EYE_OPEN;
            btn.setAttribute('aria-label', isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
            btn.setAttribute('title',      isHidden ? 'Ocultar contraseña' : 'Mostrar contraseña');
            // Keep focus on the input so the user keeps typing
            try { input.focus({ preventScroll: true }); } catch {}
        });
    });

    // ── Caps Lock detector — show inline warning while typing pwd ──
    $$('[data-auth-pw-input]').forEach(input => {
        const updateCaps = (e) => {
            const field = input.closest('[data-auth-pw-field]');
            const cue = field && field.querySelector('[data-auth-pw-caps]');
            if (!cue) return;
            const on = !!(e.getModifierState && e.getModifierState('CapsLock'));
            cue.hidden = !on;
        };
        input.addEventListener('keydown', updateCaps);
        input.addEventListener('keyup',   updateCaps);
        input.addEventListener('blur', () => {
            const field = input.closest('[data-auth-pw-field]');
            const cue = field && field.querySelector('[data-auth-pw-caps]');
            if (cue) cue.hidden = true;
        });
    });

    // ── Password strength meter (only on fields with `withMeter`) ──
    const meterField = document.querySelector('[data-auth-pw-meter]')?.closest('[data-auth-pw-field]');
    const meterInput = meterField && meterField.querySelector('input');
    if (meterInput) {
        const meter = meterField.querySelector('[data-auth-pw-meter]');
        const label = meter.querySelector('[data-auth-pw-meter-label]');
        const bars  = meter.querySelectorAll('.auth-pw-meter-bars span');
        const update = () => {
            const score = scorePassword(meterInput.value);
            // 0 (none) | 1 (weak) | 2 (fair) | 3 (good) | 4 (strong)
            meter.dataset.strength = String(score);
            bars.forEach((b, i) => b.classList.toggle('on', i < score));
            const labels = ['Empieza a escribir…', 'Muy débil', 'Débil', 'Aceptable', 'Fuerte'];
            label.textContent = meterInput.value.length === 0 ? labels[0] : labels[score];
        };
        meterInput.addEventListener('input', update);
        update();
    }

    // ── Real-time password match indicator ────────────────────────
    const form = $('[data-auth-form]');
    if (form) {
        const p1 = form.querySelector('input[name="password"]');
        const p2 = form.querySelector('input[name="password2"]');
        const matchEl = form.querySelector('[data-auth-pw-match]');
        if (p1 && p2 && matchEl) {
            const update = () => {
                const both = p1.value && p2.value;
                const matches = p1.value === p2.value;
                matchEl.hidden = !both || matches;
                p2.classList.toggle('has-mismatch', both && !matches);
            };
            p1.addEventListener('input', update);
            p2.addEventListener('input', update);
        }
    }

    if (!form) return;
    form.addEventListener('submit', async e => {
        e.preventDefault();
        const fd = new FormData(form);
        const kind = form.dataset.authForm;

        // Loading state on the submit button — replace label with spinner
        const submitBtn = form.querySelector('[data-auth-submit]');
        const labelEl   = submitBtn && submitBtn.querySelector('.auth-btn-label');
        const restoreBtn = (() => {
            if (!submitBtn) return () => {};
            const originalHTML = submitBtn.innerHTML;
            submitBtn.disabled = true;
            submitBtn.innerHTML = `${AUTH_SPINNER}<span class="auth-btn-label">Un momento…</span>`;
            return () => { submitBtn.innerHTML = originalHTML; submitBtn.disabled = false; };
        })();

        if (kind === 'login') {
            const r = await Auth.login(fd.get('email'), fd.get('password'));
            if (!r.ok) { restoreBtn(); return openAuthOverlay('login', { error: r.error, email: fd.get('email') }); }
            closeAuthOverlay();
            await bootApp();
            return;
        }

        if (kind === 'forgot') {
            const email = fd.get('email');
            await Auth.requestPasswordReset(email);
            openAuthOverlay('forgot-sent', { email });
            return;
        }

        if (kind === 'reset') {
            const p = fd.get('password');
            const p2 = fd.get('password2');
            if (p !== p2) { restoreBtn(); return openAuthOverlay('reset', { error: 'Las contraseñas no coinciden' }); }
            const r = await Auth.completeReset(p);
            if (!r.ok) { restoreBtn(); return openAuthOverlay('reset', { error: r.error }); }
            // After completing reset, log out so they sign in fresh
            await Auth.logout();
            openAuthOverlay('login', { message: 'Contraseña actualizada. Inicia sesión.' });
            return;
        }

        if (kind === 'setup') {
            const p = fd.get('password');
            const p2 = fd.get('password2');
            if (p !== p2) { restoreBtn(); return openAuthOverlay('setup', { error: 'Las contraseñas no coinciden', name: fd.get('name') }); }
            const r = await Auth.completeSetup(p, fd.get('name'));
            if (!r.ok) { restoreBtn(); return openAuthOverlay('setup', { error: r.error, name: fd.get('name') }); }
            closeAuthOverlay();
            await bootApp();
            return;
        }
    });
}

/**
 * Heuristic password strength score 0–4. Doesn't replace zxcvbn but is good
 * enough for a "give me a hint" indicator: rewards length + character classes.
 */
function scorePassword(pw) {
    if (!pw) return 0;
    let score = 0;
    if (pw.length >= 6)  score++;
    if (pw.length >= 10) score++;
    const classes = [/[a-z]/, /[A-Z]/, /[0-9]/, /[^A-Za-z0-9]/].reduce((n, r) => n + (r.test(pw) ? 1 : 0), 0);
    if (classes >= 2) score++;
    if (classes >= 3 && pw.length >= 8) score++;
    return Math.min(4, score);
}
