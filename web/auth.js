/* ================================================================
   AUTH — Mockup auth using localStorage
   ================================================================
   Users, roles, session, invite + password reset flows.
   This is a FRONTEND-ONLY mockup (no backend, no real emails).
   To upgrade: swap these functions to call Supabase/Firebase.
   ================================================================ */

const AUTH_KEYS = {
    USERS: 'rm_users_v1',
    SESSION: 'rm_session_v1'
};

// Default admin seed
const DEFAULT_ADMIN = {
    id: 'admin-marcos',
    email: 'marcos@realmadrid.com',
    name: 'Marcos Novo',
    role: 'admin',
    password: 'RealMadrid2026',
    status: 'active',
    createdAt: Date.now()
};

// Simple uuid (enough for mockup)
function uuid() {
    return 'u-' + Math.random().toString(36).slice(2, 10) + Date.now().toString(36);
}

// ── Storage helpers ─────────────────────────────────────────────
function loadUsers() {
    try {
        const raw = localStorage.getItem(AUTH_KEYS.USERS);
        if (!raw) {
            const seeded = [DEFAULT_ADMIN];
            localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(seeded));
            return seeded;
        }
        return JSON.parse(raw);
    } catch {
        return [DEFAULT_ADMIN];
    }
}

function saveUsers(users) {
    localStorage.setItem(AUTH_KEYS.USERS, JSON.stringify(users));
}

function loadSession() {
    try {
        const raw = localStorage.getItem(AUTH_KEYS.SESSION);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function saveSession(session) {
    if (session) localStorage.setItem(AUTH_KEYS.SESSION, JSON.stringify(session));
    else         localStorage.removeItem(AUTH_KEYS.SESSION);
}

// ── Public API ──────────────────────────────────────────────────
const Auth = {
    // Current session or null
    current() {
        const s = loadSession();
        if (!s) return null;
        const user = loadUsers().find(u => u.id === s.userId);
        if (!user || user.status !== 'active') {
            saveSession(null);
            return null;
        }
        return { userId: user.id, email: user.email, name: user.name, role: user.role };
    },

    isAdmin() {
        const s = this.current();
        return !!s && s.role === 'admin';
    },

    // Login
    login(email, password) {
        const users = loadUsers();
        const user = users.find(u => u.email.toLowerCase() === email.toLowerCase().trim());
        if (!user)                    return { ok: false, error: 'Usuario no encontrado' };
        if (user.status === 'pending') return { ok: false, error: 'Debes establecer tu contraseña primero. Revisa el email de invitación.' };
        if (user.password !== password) return { ok: false, error: 'Contraseña incorrecta' };
        saveSession({ userId: user.id });
        return { ok: true, user: { userId: user.id, email: user.email, name: user.name, role: user.role } };
    },

    logout() {
        saveSession(null);
    },

    // List users (admin view)
    listUsers() {
        return loadUsers().map(u => ({
            id: u.id,
            email: u.email,
            name: u.name || '',
            role: u.role,
            status: u.status,
            createdAt: u.createdAt
        }));
    },

    // Invite a new user by email; returns the "magic link" path to open
    inviteUser(email, role = 'viewer', name = '') {
        const users = loadUsers();
        email = email.trim().toLowerCase();
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
            return { ok: false, error: 'Email inválido' };
        }
        if (users.some(u => u.email.toLowerCase() === email)) {
            return { ok: false, error: 'Ese email ya está dado de alta' };
        }
        if (role !== 'admin' && role !== 'viewer') role = 'viewer';

        const user = {
            id: uuid(),
            email,
            name: name || email.split('@')[0],
            role,
            password: null,
            status: 'pending',
            setupToken: uuid(),
            createdAt: Date.now()
        };
        users.push(user);
        saveUsers(users);
        const link = `${location.origin}${location.pathname}#setup=${user.setupToken}`;
        return { ok: true, user, link };
    },

    // Change role (admin only)
    setRole(userId, role) {
        if (role !== 'admin' && role !== 'viewer') return { ok: false, error: 'Rol inválido' };
        const users = loadUsers();
        const i = users.findIndex(u => u.id === userId);
        if (i < 0) return { ok: false, error: 'No existe' };
        users[i].role = role;
        saveUsers(users);
        return { ok: true };
    },

    // Delete user (admin only, can't delete self)
    deleteUser(userId) {
        const session = this.current();
        if (session && session.userId === userId) {
            return { ok: false, error: 'No puedes eliminarte a ti mismo' };
        }
        const users = loadUsers().filter(u => u.id !== userId);
        saveUsers(users);
        return { ok: true };
    },

    // Forgot password → creates reset token; returns the reset link
    requestPasswordReset(email) {
        const users = loadUsers();
        email = (email || '').trim().toLowerCase();
        const i = users.findIndex(u => u.email.toLowerCase() === email);
        if (i < 0) {
            // Mimic real behavior: don't reveal user existence for security
            return { ok: true, link: null, notFound: true };
        }
        users[i].resetToken = uuid();
        saveUsers(users);
        const link = `${location.origin}${location.pathname}#reset=${users[i].resetToken}`;
        return { ok: true, link, user: users[i] };
    },

    // Complete password reset via token
    completeReset(token, newPassword) {
        if (!newPassword || newPassword.length < 6) {
            return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres' };
        }
        const users = loadUsers();
        const i = users.findIndex(u => u.resetToken === token);
        if (i < 0) return { ok: false, error: 'Enlace inválido o caducado' };
        users[i].password = newPassword;
        users[i].resetToken = null;
        saveUsers(users);
        return { ok: true, email: users[i].email };
    },

    // Complete initial password setup via invite token
    completeSetup(token, newPassword, name) {
        if (!newPassword || newPassword.length < 6) {
            return { ok: false, error: 'La contraseña debe tener al menos 6 caracteres' };
        }
        const users = loadUsers();
        const i = users.findIndex(u => u.setupToken === token);
        if (i < 0) return { ok: false, error: 'Enlace inválido o caducado' };
        users[i].password = newPassword;
        if (name) users[i].name = name;
        users[i].status = 'active';
        users[i].setupToken = null;
        saveUsers(users);
        return { ok: true, email: users[i].email };
    },

    // Find tokens in hash (for setup/reset links)
    consumeHashToken() {
        const h = location.hash;
        if (h.startsWith('#setup=')) {
            return { type: 'setup', token: h.slice('#setup='.length) };
        }
        if (h.startsWith('#reset=')) {
            return { type: 'reset', token: h.slice('#reset='.length) };
        }
        return null;
    },

    clearHash() {
        history.replaceState(null, '', location.pathname + location.search);
    }
};
