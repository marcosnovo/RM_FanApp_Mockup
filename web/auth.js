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

// Create the Supabase client (SDK loaded from CDN in index.html)
// NOTE: we use implicit flow (not PKCE) so magic-link / recovery emails
// work when opened in a different browser or device than the one that
// triggered them.
const sb = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        detectSessionInUrl: true,
        flowType: 'implicit',
        persistSession: true,
        autoRefreshToken: true
    }
});

// Cache for the current user + role
let _cachedSession = null;
let _cachedProfile = null;
let _authStateListeners = [];
let _recoveryTriggered = false;

// ── Events ───────────────────────────────────────────────────────
sb.auth.onAuthStateChange(async (event, session) => {
    _cachedSession = session;
    _cachedProfile = session ? await fetchProfile(session.user.id) : null;

    if (event === 'PASSWORD_RECOVERY') {
        _recoveryTriggered = true;
    }
    _authStateListeners.forEach(cb => cb(event, session));
});

async function fetchProfile(userId) {
    const { data, error } = await sb
        .from('profiles')
        .select('id, email, role, created_at')
        .eq('id', userId)
        .single();
    if (error) {
        console.warn('[auth] fetchProfile error:', error.message);
        return null;
    }
    return data;
}

// Refresh cache from Supabase (session + profile). Call after any auth
// operation to make sure Auth.current() is up-to-date immediately.
async function syncCache() {
    const { data: { session } } = await sb.auth.getSession();
    _cachedSession = session;
    _cachedProfile = session ? await fetchProfile(session.user.id) : null;
}

// ── Public API ───────────────────────────────────────────────────
const Auth = {
    // Init: load existing session (if any) on page load.
    // Guarded with a timeout so a stale/invalid cached session (e.g.,
    // from a deleted user) can't block app startup forever.
    async init() {
        try {
            await Promise.race([
                syncCache(),
                new Promise((_, rej) => setTimeout(() => rej(new Error('init timeout')), 5000))
            ]);
        } catch (err) {
            console.warn('[auth] init timed out or errored, clearing session:', err.message);
            // Fire-and-forget signOut (don't await — it may hang)
            try { sb.auth.signOut().catch(() => {}); } catch {}
            // Belt-and-suspenders: also purge Supabase keys from localStorage
            try {
                Object.keys(localStorage)
                    .filter(k => k.startsWith('sb-'))
                    .forEach(k => localStorage.removeItem(k));
            } catch {}
            _cachedSession = null;
            _cachedProfile = null;
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

    // True when user came from a password-reset email and must set a new password
    isRecovery() {
        return _recoveryTriggered;
    },

    clearRecovery() {
        _recoveryTriggered = false;
    },

    onAuthChange(cb) {
        _authStateListeners.push(cb);
    },

    // ── Auth operations ────────────────────────────────────────
    async login(email, password) {
        const { data, error } = await sb.auth.signInWithPassword({
            email: (email || '').trim(),
            password
        });
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
            await sb.auth.signOut();
            _cachedSession = null;
            return {
                ok: false,
                error: 'Tu cuenta no tiene perfil asignado. Contacta al administrador.'
            };
        }
        return { ok: true };
    },

    async logout() {
        await sb.auth.signOut();
        _cachedSession = null;
        _cachedProfile = null;
    },

    // Password reset (forgot password) — sends REAL email
    async requestPasswordReset(email) {
        const redirectTo = `${location.origin}${location.pathname}`;
        const { error } = await sb.auth.resetPasswordForEmail(
            (email || '').trim(),
            { redirectTo }
        );
        if (error) {
            // For security, still behave as if success
            return { ok: true, notFound: true };
        }
        return { ok: true };
    },

    // After user clicks reset email → they land here with a recovery session
    // → ask them for new password
    async completeReset(newPassword) {
        if (!newPassword || newPassword.length < 6) {
            return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres' };
        }
        const { error } = await sb.auth.updateUser({ password: newPassword });
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
    // via magic-link invite)
    needsPasswordSetup() {
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
