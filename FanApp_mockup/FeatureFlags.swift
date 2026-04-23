import Foundation

/// Central registry of experimental / opt-in features.
///
/// Use this struct to gate new UI or behavior that we want to be able to
/// toggle without shipping a new build flow. Each flag should be a `static let`
/// (compile-time constant) so the compiler can strip disabled branches.
///
/// When a feature graduates, delete the flag and inline the code.
struct FeatureFlags {
    /// Shows a horizontal category filter bar on top of the News list.
    static let enableNewsFilter: Bool = false

    // ───────── HOY v2 — Pestañas por equipo ─────────
    //
    // Añade arriba del todo en "Hoy" 4 pestañas:
    // Todo · Fútbol masc. · Fútbol fem. · Baloncesto.
    //
    // `useEmojiTeamTabs` y `enableTeamTabsEditor` están anidadas: solo
    // tienen efecto si el flag padre está activo.

    /// Pestañas de equipo en la parte superior de la home (feature padre).
    static let enableHoyTeamTabs: Bool = true

    /// Variante opcional: etiquetas con emoji (⚽️ Masculino, ⚽️ Femenino,
    /// 🏀 1er equipo). Sirve como valor **por defecto** del toggle runtime
    /// que expone el editor de pestañas.
    static let useEmojiTeamTabsByDefault: Bool = false

    /// Habilita el botón "Editar pestañas" dentro de la barra de equipos,
    /// que abre una hoja para activar/desactivar cada pestaña y el modo
    /// emoji. Anidada en `enableHoyTeamTabs`.
    static let enableTeamTabsEditor: Bool = true

    // ───────── Side menu v2 ─────────

    /// Rediseño del menú lateral con secciones agrupadas pensadas para
    /// escalar a medida que añadimos funcionalidades (Cuenta, Preferencias,
    /// App, Ayuda, Legal). El diseño anterior queda disponible poniendo
    /// este flag a `false`.
    static let enableSideMenuV2: Bool = true
}
