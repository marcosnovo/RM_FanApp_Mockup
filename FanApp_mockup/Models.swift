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

// MARK: - Club Team Types
/// Identifies one of the three Real Madrid teams the user can follow.
enum ClubTeamType: String, CaseIterable, Hashable {
    case mensFootball    = "Fútbol Masculino"
    case womensFootball  = "Fútbol Femenino"
    case mensBasketball  = "Baloncesto Masculino"

    var shortName: String {
        switch self {
        case .mensFootball:   return "1er Equipo"
        case .womensFootball: return "Equipo Femenino"
        case .mensBasketball: return "Baloncesto"
        }
    }

    /// Accent color for badges and UI elements tied to this team.
    var badgeColor: Color {
        switch self {
        case .mensFootball:   return Color(red: 0.29, green: 0.24, blue: 0.91)
        case .womensFootball: return Color(red: 0.78, green: 0.18, blue: 0.52)
        case .mensBasketball: return Color(red: 0.88, green: 0.52, blue: 0.08)
        }
    }

    /// Gradient pair used as the card background for this team.
    var cardGradient: [Color] {
        switch self {
        case .mensFootball:
            return [Color(red: 0.11, green: 0.12, blue: 0.28),
                    Color(red: 0.20, green: 0.17, blue: 0.44)]
        case .womensFootball:
            return [Color(red: 0.16, green: 0.08, blue: 0.28),
                    Color(red: 0.28, green: 0.10, blue: 0.38)]
        case .mensBasketball:
            return [Color(red: 0.18, green: 0.10, blue: 0.06),
                    Color(red: 0.32, green: 0.18, blue: 0.06)]
        }
    }
}

/// Groups the next and last match data for a single followed team.
struct TeamMatchData {
    let teamType: ClubTeamType
    let nextMatch: MatchHeaderData?   // upcoming – nil if none scheduled
    let lastMatch: MatchHeaderData?   // most recent result – nil if no history
}

// MARK: - Home Header Match
enum MatchStatus {
    case upcoming
    case live
    case finished
}

struct MatchHeaderData: Identifiable {
    let id = UUID()
    let competition: String
    let dateString: String
    let homeTeam: String
    let homeTeamColor: Color
    let homeTeamSymbol: String
    let homeScore: Int?
    let homeScorers: String
    let awayTeam: String
    let awayTeamColor: Color
    let awayTeamSymbol: String
    let awayScore: Int?
    let awayScorers: String
    /// Two-line info string separated by "\n": sport/category + round · venue.
    let matchInfo: String
    let status: MatchStatus
    let stats: [MatchStat]
}

struct MatchStat: Identifiable {
    let id = UUID()
    let label: String
    let home: Double
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

// MARK: - Highlights
/// Category of a highlight clip, used for filtering in HighlightsView.
enum HighlightCategory: String, CaseIterable, Identifiable {
    case all            = "Todos"
    case match          = "Partidos"
    case training       = "Entrenamiento"
    case interview      = "Entrevistas"
    case pressConference = "Rueda de prensa"

    var id: String { rawValue }

    var icon: String {
        switch self {
        case .all:             return "square.grid.2x2.fill"
        case .match:           return "figure.run"
        case .training:        return "sportscourt"
        case .interview:       return "person.fill"
        case .pressConference: return "mic.fill"
        }
    }
}

struct HighlightItem: Identifiable {
    let id = UUID()
    let category: HighlightCategory
    let title: String
    let duration: String          // e.g. "4:32"
    let thumbnailColors: [Color]  // gradient stops for the thumbnail
    let teamType: ClubTeamType?   // nil = cross-team or generic content
}

// MARK: - Survey / Trivia
struct SurveyOption: Identifiable {
    let id = UUID()
    let text: String
    let votes: Int
}

struct SurveyItem: Identifiable {
    let id = UUID()
    let question: String
    let options: [SurveyOption]
    let correctIndex: Int

    var totalVotes: Int { options.reduce(0) { $0 + $1.votes } }
}
