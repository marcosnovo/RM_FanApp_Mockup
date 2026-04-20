/* ================================================================
   AUTH — Supabase-backed (real emails, shared user store)
   ================================================================
   - Login, forgot password, reset password, invite (magic link)
   - Roles admin/viewer via public.profiles table
   - Invited roles respected via public.pending_invitations (+ trigger)
   - Emails sent by Supabase's SMTP
   ================================================================ */

const SUPABASE_URL = 'https://guidpagkdopgestrbxke.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_bQtzqtvTegErZucUd_v6KQ_xpdrMlGW';

// ── URL hash sniff ─────────────────────────────────────────────
// Supabase email links land on our app with the tokens in the URL hash, e.g.
//   #access_token=...&refresh_token=...&type=recovery
//   #access_token=...&refresh_token=...&type=signup    (for invites / magic link)
// The SDK processes and CLEANS this hash asynchronously after createClient().
// We capture it BEFORE createClient so the boot logic can route to the right
// screen (reset / setup) from the first paint, instead of flashing the login
// while waiting for the PASSWORD_RECOVERY / SIGNED_IN event to fire.
const _initialHashRaw = (typeof window !== 'undefined' && window.location.hash) || '';
const _initialHashParams = new URLSearchParams(
    _initialHashRaw.startsWith('#') ? _initialHashRaw.slice(1) : _initialHashRaw
);
const _initialUrlType = _initialHashParams.get('type') || '';  // '' | 'recovery' | 'signup' | 'invite' | 'magiclink'
const _initialUrlHasTokens = !!_initialHashParams.get('access_token');

// Create the Supabase client (SDK loaded from CDN in index.html)
// NOTE: we use implicit flow (not PKCE) so magic-link / recovery emails
// work when opened in a different browser or device than the one that
// triggered them.
//
// Keys used for session persistence:
//   rm-auth           → Supabase access/refresh tokens (managed by SDK)
//   rm_profile_v1     → our cached profiles table row (instant boot)
// Both live in localStorage so the session survives tab closes and reloads
// indefinitely (until the user explicitly logs out or revokes the refresh
// token from Supabase). autoRefreshToken rotates the access token silently.
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        detectSessionInUrl: true,
        flowType: 'implicit',
        persistSession: true,
        autoRefreshToken: true,
        storage: window.localStorage,
        storageKey: 'rm-auth'
    }
});

// Cache for the current user + role
let _cachedSession = null;
let _cachedProfile = null;
let _authStateListeners = [];
// Seed from URL so Auth.isRecovery() is correct BEFORE Supabase fires the
// PASSWORD_RECOVERY event (that event is async; bootApp() may run first).
let _recoveryTriggered = (_initialUrlType === 'recovery');

// Profile cache in localStorage — so a slow network never makes the user
// re-login: we have their role/name available instantly from last time.
const PROFILE_STORAGE_KEY = 'rm_profile_v1';

function loadCachedProfile(userId) {
    try {
        const raw = localStorage.getItem(PROFILE_STORAGE_KEY);
        if (!raw) return null;
        const data = JSON.parse(raw);
        // Only trust the cached profile if it belongs to the current session
        if (data && data.id === userId) return data;
    } catch {}
    return null;
}

function saveCachedProfile(profile) {
    try {
        if (profile) localStorage.setItem(PROFILE_STORAGE_KEY, JSON.stringify(profile));
        else         localStorage.removeItem(PROFILE_STORAGE_KEY);
    } catch {}
}

// Refresh the profile in the background without blocking the UI. If it fails
// (network down, Supabase slow, RLS misconfigured) we simply keep the cached
// copy — the user stays logged in.
function refreshProfileInBackground(userId) {
    fetchProfile(userId).then(data => {
        if (!data) return;
        _cachedProfile = data;
        saveCachedProfile(data);
    }).catch(() => {});
}

// Wraps any promise with a timeout. Rejects with the given message if it takes
// longer than `ms`. Prevents hung network calls from freezing the UI.
function withTimeout(promise, ms, label = 'timeout') {
    return Promise.race([
        promise,
        new Promise((_, rej) => setTimeout(() => rej(new Error(label)), ms))
    ]);
}

// ── Events ───────────────────────────────────────────────────────
sb.auth.onAuthStateChange(async (event, session) => {
    _cachedSession = session;

    if (session) {
        // Prefer cached profile (instant UI) and refresh in background
        const cached = loadCachedProfile(session.user.id);
        if (cached) {
            _cachedProfile = cached;
            refreshProfileInBackground(session.user.id);
        } else {
            // No cache yet — fetch now (e.g. first login on this device)
            const p = await fetchProfile(session.user.id);
            if (p) {
                _cachedProfile = p;
                saveCachedProfile(p);
            }
        }
    } else {
        _cachedProfile = null;
        saveCachedProfile(null);
    }

    if (event === 'PASSWORD_RECOVERY') {
        _recoveryTriggered = true;
    }
    _authStateListeners.forEach(cb => cb(event, session));
});

async function fetchProfile(userId) {
    try {
        const { data, error } = await withTimeout(
            sb.from('profiles')
                .select('id, email, role, created_at')
                .eq('id', userId)
                .single(),
            5000,
            'fetchProfile timeout'
        );
        if (error) {
            console.warn('[auth] fetchProfile error:', error.message);
            return null;
        }
        return data;
    } catch (err) {
        console.warn('[auth] fetchProfile exception:', err.message);
        return null;
    }
}

// Refresh cache from Supabase (session + profile). Call after any auth
// operation to make sure Auth.current() is up-to-date immediately.
//
// Reading strategy:
//   1) getSession() is synchronous on localStorage — always cheap.
//   2) If we have a session, try the cached profile first (instant).
//   3) If no cached profile, fetch from server. Otherwise refresh async.
// This keeps the UI snappy even if the network is slow or down.
async function syncCache() {
    const { data: { session } } = await sb.auth.getSession();
    _cachedSession = session;

    if (!session) {
        _cachedProfile = null;
        saveCachedProfile(null);
        return;
    }

    const cached = loadCachedProfile(session.user.id);
    if (cached) {
        _cachedProfile = cached;
        refreshProfileInBackground(session.user.id);
        return;
    }

    const fresh = await fetchProfile(session.user.id);
    if (fresh) {
        _cachedProfile = fresh;
        saveCachedProfile(fresh);
    }
}

// ── Public API ───────────────────────────────────────────────────
const Auth = {
    // Init: load existing session (if any) on page load.
    //
    // Previously, on timeout we were nuking the session + localStorage
    // keys, which forced the user to log in on every slow reload. Now
    // we only log a warning and keep whatever we have — the Supabase
    // SDK itself refreshes tokens in the background via autoRefreshToken.
    async init() {
        try {
            await Promise.race([
                syncCache(),
                new Promise((_, rej) => setTimeout(() => rej(new Error('init timeout')), 5000))
            ]);
        } catch (err) {
            console.warn('[auth] init slow, keeping any cached session:', err.message);
            // Do NOT clear session / profile. If there's a valid session in
            // localStorage, the SDK will refresh the access token in the
            // background; we just didn't finish fetching the profile in 5s.
            // The cached profile (if any) is loaded synchronously anyway.
            const { data: { session } } = await sb.auth.getSession().catch(() => ({ data: {} }));
            _cachedSession = session || _cachedSession;
            if (session) {
                const cached = loadCachedProfile(session.user.id);
                if (cached) _cachedProfile = cached;
                refreshProfileInBackground(session.user.id);
            }
        }
    },

    current() {
        if (!_cachedSession || !_cachedProfile) return null;
        return {
            userId: _cachedSession.user.id,
            email: _cachedProfile.email,
            name: _cachedSession.user.user_metadata?.name || _cachedProfile.email,
            role: _cachedProfile.role
        };
    },

    isAdmin() {
        return !!_cachedProfile && _cachedProfile.role === 'admin';
    },

    // True when user came from a password-reset email and must set a new password.
    // Seeded from the URL hash (type=recovery) so it's correct synchronously,
    // and reinforced later when Supabase fires the PASSWORD_RECOVERY event.
    isRecovery() {
        return _recoveryTriggered;
    },

    clearRecovery() {
        _recoveryTriggered = false;
    },

    // True when the URL hash indicates the user just arrived from an invite /
    // signup / magic-link email (tokens present AND type != 'recovery').
    // Used at boot to pick the right initial screen without waiting for events.
    urlIndicatesInvite() {
        if (!_initialUrlHasTokens) return false;
        if (_initialUrlType === 'recovery') return false;
        return _initialUrlType === 'signup'
            || _initialUrlType === 'invite'
            || _initialUrlType === 'magiclink'
            || _initialUrlType === '';
    },

    urlIndicatesRecovery() {
        return _initialUrlType === 'recovery';
    },

    onAuthChange(cb) {
        _authStateListeners.push(cb);
    },

    // ── Auth operations ────────────────────────────────────────
    async login(email, password) {
        let result;
        try {
            result = await withTimeout(
                sb.auth.signInWithPassword({ email: (email || '').trim(), password }),
                8000,
                'login timeout'
            );
        } catch (err) {
            console.warn('[auth] login timeout/error:', err);
            return { ok: false, error: 'La petición tardó demasiado. Revisa tu conexión.' };
        }
        const { data, error } = result;
        if (error) {
            console.warn('[auth] login error:', error);
            return { ok: false, error: translateError(error.message) };
        }
        if (!data?.session || !data?.user) {
            return { ok: false, error: 'No se pudo crear la sesión.' };
        }

        // Use session from the response directly (getSession() can have a
        // brief delay before it reflects the new login on some environments)
        _cachedSession = data.session;
        _cachedProfile = await fetchProfile(data.user.id);

        if (!_cachedProfile) {
            console.warn('[auth] No profile row for user', data.user.id);
            // Fire-and-forget signOut — don't block returning the error to UI
            sb.auth.signOut().catch(() => {});
            _cachedSession = null;
            saveCachedProfile(null);
            return {
                ok: false,
                error: 'Tu cuenta no tiene perfil asignado. Contacta al administrador.'
            };
        }
        // Persist profile to localStorage so a reload is instantaneous
        saveCachedProfile(_cachedProfile);
        return { ok: true };
    },

    async logout() {
        _cachedSession = null;
        _cachedProfile = null;
        saveCachedProfile(null);
        // Fire-and-forget so UI updates even if the network is slow
        try { sb.auth.signOut().catch(() => {}); } catch {}
    },

    // Password reset (forgot password) — sends REAL email
    async requestPasswordReset(email) {
        const redirectTo = `${location.origin}${location.pathname}`;
        try {
            await withTimeout(
                sb.auth.resetPasswordForEmail((email || '').trim(), { redirectTo }),
                8000,
                'reset request timeout'
            );
        } catch (err) {
            console.warn('[auth] reset request timeout/error:', err);
        }
        // Always respond as success to not leak whether the email exists
        return { ok: true };
    },

    // After user clicks reset email → they land here with a recovery session
    // → ask them for new password
    async completeReset(newPassword) {
        if (!newPassword || newPassword.length < 6) {
            return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres' };
        }
        // Also mark password_set so a future reload doesn't accidentally
        // route through the invite/setup branch.
        const { error } = await sb.auth.updateUser({
            password: newPassword,
            data: { password_set: true }
        });
        if (error) return { ok: false, error: translateError(error.message) };
        _recoveryTriggered = false;
        await syncCache();
        return { ok: true };
    },

    // Set password + name after accepting an invite (user is auto-logged-in
    // via the magic link that arrived by email)
    async completeSetup(newPassword, name) {
        if (!newPassword || newPassword.length < 6) {
            return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres' };
        }
        const updates = { password: newPassword, data: { name, password_set: true } };
        const { error } = await sb.auth.updateUser(updates);
        if (error) return { ok: false, error: translateError(error.message) };
        await syncCache();
        return { ok: true };
    },

    // True if authenticated user still needs to set a password (first login
    // via magic-link invite). Two signals:
    //   a) The URL hash indicates an invite/signup landing (synchronous) →
    //      treat as needing setup even if the session hasn't hydrated yet.
    //   b) We have a session and the user has no `password_set` metadata flag.
    needsPasswordSetup() {
        if (this.urlIndicatesInvite()) return true;
        if (!_cachedSession) return false;
        return !_cachedSession.user.user_metadata?.password_set;
    },

    // ── Admin operations ───────────────────────────────────────
    async listUsers() {
        const { data, error } = await sb
            .from('profiles')
            .select('id, email, role, created_at')
            .order('created_at', { ascending: true });
        if (error) return [];
        return data.map(p => ({
            id: p.id,
            email: p.email,
            name: '',
            role: p.role,
            status: 'active',
            createdAt: new Date(p.created_at).getTime()
        }));
    },

    async inviteUser(email, role = 'viewer') {
        email = (email || '').trim().toLowerCase();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return { ok: false, error: 'Email inválido' };
        }
        if (role !== 'admin' && role !== 'viewer') role = 'viewer';

        // 1) Store pending invitation so the trigger assigns the right role
        //    when the user signs up via the magic link
        const session = this.current();
        const { error: invErr } = await sb
            .from('pending_invitations')
            .upsert({
                email,
                role,
                invited_by: session ? session.userId : null
            });
        if (invErr) return { ok: false, error: translateError(invErr.message) };

        // 2) Send the magic link — Supabase creates the user if missing
        const redirectTo = `${location.origin}${location.pathname}`;
        const { error } = await sb.auth.signInWithOtp({
            email,
            options: { emailRedirectTo: redirectTo, shouldCreateUser: true }
        });
        if (error) {
            // Roll back the invitation if the email failed
            await sb.from('pending_invitations').delete().eq('email', email);
            return { ok: false, error: translateError(error.message) };
        }
        return { ok: true };
    },

    async setRole(userId, role) {
        if (role !== 'admin' && role !== 'viewer') {
            return { ok: false, error: 'Rol inválido' };
        }
        const { error } = await sb
            .from('profiles')
            .update({ role })
            .eq('id', userId);
        if (error) return { ok: false, error: translateError(error.message) };
        return { ok: true };
    },

    async deleteUser(userId) {
        const session = this.current();
        if (session && session.userId === userId) {
            return { ok: false, error: 'No puedes eliminarte a ti mismo' };
        }
        // RLS allows admins to delete profile rows. We can't delete the
        // auth.users row from the client (requires service_role). The user
        // will still be able to log in, but without a profile they'll be
        // treated as "no access" and auto-logged-out.
        const { error } = await sb.from('profiles').delete().eq('id', userId);
        if (error) return { ok: false, error: translateError(error.message) };
        return { ok: true };
    }
};

// ── Friendly error messages ──────────────────────────────────────
function translateError(msg) {
    if (!msg) return 'Error desconocido';
    const m = msg.toLowerCase();
    if (m.includes('invalid login')) return 'Email o contraseña incorrectos';
    if (m.includes('email not confirmed')) return 'Debes confirmar tu email antes de entrar';
    if (m.includes('user already registered')) return 'Ese email ya está dado de alta';
    if (m.includes('weak password')) return 'La contraseña es demasiado débil';
    if (m.includes('rate limit')) return 'Demasiados intentos. Espera un momento.';
    if (m.includes('network')) return 'Error de red';
    return msg;
}
