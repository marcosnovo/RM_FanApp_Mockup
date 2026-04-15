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

// MARK: - Video
struct VideoItem: Identifiable {
    let id = UUID()
    let title: String
    let duration: String            // "4:32"
    let category: String            // "RESUMEN" / "ENTREVISTA" / "HIGHLIGHTS"
    let thumbnailColors: [Color]    // gradient stops
    let icon: String                // SF Symbol for watermark
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
