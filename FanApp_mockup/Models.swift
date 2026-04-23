import SwiftUI

// MARK: - News
struct NewsItem: Identifiable {
    let id = UUID()
    let title: String
    let subtitle: String
    let category: String
    let date: String
    let author: String
    let imageName: String
    let imageColor: Color
    let body: String
}

// MARK: - Match (Calendar)
struct Match: Identifiable {
    let id = UUID()
    let homeTeam: Team
    let awayTeam: Team
    let competition: String
    let round: String
    let date: Date
    let dateString: String
    let venue: String
    let category: String
}

struct Team: Identifiable {
    let id = UUID()
    let name: String
    let shortName: String
    let color: Color
    let symbol: String
}

// MARK: - Calendar Day
struct CalendarDay: Identifiable {
    let id = UUID()
    let day: Int
    let matches: [Match]
}

// MARK: - Home Header Match (carousel)
enum MatchStatus {
    case upcoming   // not played yet
    case live       // in progress
    case finished   // ended
}

/// Categoría de equipo para el filtrado por pestañas en "Hoy v2".
enum TeamCategory: String, CaseIterable, Identifiable {
    case mensFootball   = "mens_football"
    case womensFootball = "womens_football"
    case basketball     = "basketball"

    var id: String { rawValue }

    /// Nombre corto — prioriza caber en 4 pestañas.
    var textLabel: String {
        switch self {
        case .mensFootball:   return "Fútbol masc."
        case .womensFootball: return "Fútbol fem."
        case .basketball:     return "Baloncesto"
        }
    }

    /// Variante con emoji — más descriptiva, ocupa más ancho.
    var emojiLabel: String {
        switch self {
        case .mensFootball:   return "⚽️ Masculino"
        case .womensFootball: return "⚽️ Femenino"
        case .basketball:     return "🏀 1er equipo"
        }
    }

    /// Subtítulo que se muestra bajo el marcador en la tarjeta del partido.
    var sectionTitle: String {
        switch self {
        case .mensFootball:   return "Fútbol · Primer Equipo"
        case .womensFootball: return "Fútbol Femenino"
        case .basketball:     return "Baloncesto · Primer Equipo"
        }
    }
}

struct MatchHeaderData: Identifiable {
    let id = UUID()
    let competition: String         // "LA LIGA" / "CHAMPIONS LEAGUE"
    let dateString: String          // "Vie 10 abr · 21:00"
    let homeTeam: String
    let homeTeamColor: Color
    let homeTeamSymbol: String
    let homeScore: Int?             // nil = upcoming
    let homeScorers: String         // "F. Valverde 51'"
    let awayTeam: String
    let awayTeamColor: Color
    let awayTeamSymbol: String
    let awayScore: Int?
    let awayScorers: String
    let matchInfo: String           // "Fútbol · Primer Equipo\nJornada 31 · Bernabéu"
    let status: MatchStatus
    // Stats (for Estadísticas tab)
    let stats: [MatchStat]
    /// Categoría del partido — usado por el filtro de pestañas de "Hoy v2".
    /// Por defecto masculino para no romper los mocks existentes.
    var category: TeamCategory = .mensFootball
}

struct MatchStat: Identifiable {
    let id = UUID()
    let label: String
    let home: Double    // absolute value (e.g. 35.7 for %)
    let away: Double
    let isPercent: Bool
}

// MARK: - TV Schedule
struct TVScheduleItem: Identifiable {
    let id = UUID()
    let time: String
    let title: String
    let isLive: Bool
}

struct TVDay: Identifiable {
    let id = UUID()
    let label: String
    let items: [TVScheduleItem]
}

// MARK: - Store
struct StorePromo: Identifiable {
    let id = UUID()
    let bannerText: String
    let heroTitle: String
    let heroSubtitle: String
    let heroColor: Color
    let ctaText: String
}
