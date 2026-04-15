import SwiftUI

// MARK: - Calendar Teams
enum MockTeams {
    static let realMadrid    = Team(name: "Real Madrid",         shortName: "RM",  color: Color(red: 0.29, green: 0.24, blue: 0.91), symbol: "crown.fill")
    static let bayernMunich  = Team(name: "Bayern Múnich",       shortName: "BAY", color: .red, symbol: "shield.fill")
    static let barcelona     = Team(name: "FC Barcelona",        shortName: "FCB", color: Color(red: 0.60, green: 0.0,  blue: 0.2),  symbol: "shield.fill")
    static let atletico      = Team(name: "Atlético de Madrid",  shortName: "ATM", color: Color(red: 0.85, green: 0.15, blue: 0.15), symbol: "shield.fill")
    static let fenerbahce    = Team(name: "Fenerbahçe",          shortName: "FEN", color: .yellow, symbol: "shield.fill")
    static let brighton      = Team(name: "Brighton",            shortName: "BRI", color: Color(red: 0.0,  green: 0.45, blue: 0.75), symbol: "shield.fill")
    static let betis         = Team(name: "Real Betis",          shortName: "BET", color: Color(red: 0.0,  green: 0.55, blue: 0.25), symbol: "shield.fill")
    static let celta         = Team(name: "Celta de Vigo",       shortName: "CEL", color: Color(red: 0.45, green: 0.75, blue: 0.90), symbol: "shield.fill")
    static let rayo          = Team(name: "Rayo Vallecano",      shortName: "RAY", color: .red, symbol: "shield.fill")
    static let manchesterCity = Team(name: "Manchester City",    shortName: "MCI", color: Color(red: 0.42, green: 0.72, blue: 0.92), symbol: "shield.fill")
    static let benfica       = Team(name: "Benfica",             shortName: "BEN", color: Color(red: 0.80, green: 0.05, blue: 0.05), symbol: "shield.fill")
}

// MARK: - Calendar Matches
enum MockMatches {
    static let bayernVsRM = Match(
        homeTeam: MockTeams.bayernMunich,
        awayTeam: MockTeams.realMadrid,
        competition: "Champions League",
        round: "Cuartos de final (vuelta)",
        date: Date(),
        dateString: "Mié 15 abr · 21:00",
        venue: "Allianz Arena",
        category: "Fútbol · Primer Equipo"
    )

    static let aprilMatches: [(day: Int, match: Match)] = [
        (1,  Match(homeTeam: MockTeams.barcelona,    awayTeam: MockTeams.realMadrid, competition: "LaLiga",    round: "J31",         date: Date(), dateString: "Mar 1 abr · 21:00",  venue: "Camp Nou",         category: "Fútbol · Primer Equipo")),
        (6,  Match(homeTeam: MockTeams.realMadrid,   awayTeam: MockTeams.brighton,   competition: "Champions", round: "Q/F Ida",     date: Date(), dateString: "Dom 6 abr · 21:00",  venue: "Bernabéu",         category: "Fútbol · Primer Equipo")),
        (8,  Match(homeTeam: MockTeams.fenerbahce,   awayTeam: MockTeams.realMadrid, competition: "Champions", round: "Q/F Vuelta",  date: Date(), dateString: "Mar 8 abr · 21:00",  venue: "Fenerbahçe S.K.", category: "Fútbol · Primer Equipo")),
        (11, Match(homeTeam: MockTeams.rayo,         awayTeam: MockTeams.realMadrid, competition: "LaLiga",    round: "J32",         date: Date(), dateString: "Vie 11 abr · 21:00", venue: "Vallecas",         category: "Fútbol · Primer Equipo")),
        (15, Match(homeTeam: MockTeams.bayernMunich, awayTeam: MockTeams.realMadrid, competition: "Champions", round: "Q/F Vuelta",  date: Date(), dateString: "Mié 15 abr · 21:00", venue: "Allianz Arena",    category: "Fútbol · Primer Equipo")),
        (17, Match(homeTeam: MockTeams.realMadrid,   awayTeam: MockTeams.celta,      competition: "LaLiga",    round: "J33",         date: Date(), dateString: "Jue 17 abr · 21:00", venue: "Bernabéu",         category: "Fútbol · Primer Equipo")),
        (22, Match(homeTeam: MockTeams.atletico,     awayTeam: MockTeams.realMadrid, competition: "LaLiga",    round: "J34",         date: Date(), dateString: "Mar 22 abr · 21:00", venue: "Metropolitano",    category: "Fútbol · Primer Equipo")),
        (23, Match(homeTeam: MockTeams.realMadrid,   awayTeam: MockTeams.betis,      competition: "LaLiga",    round: "J35",         date: Date(), dateString: "Mié 23 abr · 21:00", venue: "Bernabéu",         category: "Fútbol · Primer Equipo"))
    ]
}

// MARK: - News
enum MockNews {
    static let items: [NewsItem] = [
        NewsItem(title: "Bayern-Real Madrid: a por la remontada en Múnich",
                 subtitle: "Nuestro equipo visita el Allianz Arena con la intención de dar la vuelta al 1-2 de la ida.",
                 category: "NOTICIA", date: "15/04/2026", author: "Alberto Navarro",
                 imageName: "photo.fill", imageColor: Color(red: 0.15, green: 0.20, blue: 0.40),
                 body: "El Real Madrid visita el Allianz Arena este miércoles a las 21:00 horas con un objetivo claro: remontar el 1-2 de la ida disputada en el Santiago Bernabéu."),
        NewsItem(title: "Arbeloa: \"Podemos hacerlo, estamos convencidos de ello\"",
                 subtitle: "El entrenador del Castilla habló sobre las posibilidades del primer equipo en Múnich.",
                 category: "NOTICIA", date: "15/04/2026", author: "Redacción",
                 imageName: "photo.fill", imageColor: Color(red: 0.25, green: 0.30, blue: 0.55),
                 body: "Álvaro Arbeloa mostró su confianza plena en el primer equipo antes del decisivo duelo ante el Bayern de Múnich."),
        NewsItem(title: "El Real Madrid se entrenó en el Allianz Arena",
                 subtitle: "El equipo realizó el entrenamiento oficial previo al partido de la Champions League.",
                 category: "NOTICIA", date: "14/04/2026", author: "Redacción",
                 imageName: "photo.fill", imageColor: Color(red: 0.10, green: 0.15, blue: 0.35),
                 body: "El Real Madrid completó el entrenamiento oficial en el Allianz Arena."),
        NewsItem(title: "Bellingham: \"Es una final y vamos a darlo todo para ganar\"",
                 subtitle: "El centrocampista inglés habló en la rueda de prensa previa al duelo en Múnich.",
                 category: "NOTICIA", date: "14/04/2026", author: "Redacción",
                 imageName: "photo.fill", imageColor: Color(red: 0.20, green: 0.18, blue: 0.50),
                 body: "Jude Bellingham se mostró muy motivado y aseguró que el equipo va a dar el máximo."),
        NewsItem(title: "Convocatoria del Real Madrid ante el Bayern",
                 subtitle: "Carlo Ancelotti dio a conocer los 23 jugadores citados para el partido.",
                 category: "NOTICIA", date: "14/04/2026", author: "Redacción",
                 imageName: "photo.fill", imageColor: Color(red: 0.30, green: 0.10, blue: 0.20),
                 body: "Carlo Ancelotti ha dado a conocer la lista de convocados para el partido ante el Bayern de Múnich.")
    ]
}

// MARK: - TV Schedule
enum MockTV {
    static let days: [TVDay] = [
        TVDay(label: "Miércoles", items: [
            TVScheduleItem(time: "10:15", title: "Hoy Jugamos. Bayern Múnich-Real Madrid (Directo)", isLive: true),
            TVScheduleItem(time: "13:00", title: "Resumen: Bayern Múnich-Real Madrid", isLive: false),
            TVScheduleItem(time: "15:30", title: "Real Madrid TV. Magazine semanal", isLive: false),
            TVScheduleItem(time: "21:00", title: "Fútbol. LaLiga EA Sports. Real Madrid-Valencia (EN DIRECTO)", isLive: true)
        ]),
        TVDay(label: "Jueves", items: [
            TVScheduleItem(time: "09:00", title: "Rueda de prensa post-partido", isLive: false),
            TVScheduleItem(time: "11:00", title: "Resumen semana Champions League 25/26", isLive: false),
            TVScheduleItem(time: "20:00", title: "Real Madrid TV. Especial Champions", isLive: false)
        ]),
        TVDay(label: "Viernes", items: [
            TVScheduleItem(time: "10:00", title: "Rueda de prensa pre-partido LaLiga", isLive: false),
            TVScheduleItem(time: "17:30", title: "Entrenamiento. Sesión del primer equipo", isLive: false),
            TVScheduleItem(time: "22:00", title: "El Día del Madrid", isLive: false)
        ]),
        TVDay(label: "Sábado", items: [
            TVScheduleItem(time: "12:00", title: "Clásico de la historia. Real Madrid-Bayern Múnich Final 2018", isLive: false),
            TVScheduleItem(time: "18:30", title: "Fútbol. LaLiga EA Sports. Atlético de Madrid-Real Madrid (EN DIRECTO)", isLive: true),
            TVScheduleItem(time: "22:30", title: "Resumen. Atlético de Madrid-Real Madrid", isLive: false)
        ])
    ]
}

// MARK: - Home Header Matches (MatchCentre carousel)
enum MockHeaderMatches {
    static let all: [MatchHeaderData] = [
        // 1 — Bayern vs RM · Champions Q/F vuelta (upcoming)
        MatchHeaderData(
            competition: "CHAMPIONS LEAGUE",
            dateString: "Mié 15 abr · 21:00",
            homeTeam: "Bayern Múnich",      homeTeamColor: Color(red: 0.75, green: 0.05, blue: 0.05), homeTeamSymbol: "shield.fill",
            homeScore: nil, homeScorers: "",
            awayTeam: "Real Madrid",        awayTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91), awayTeamSymbol: "crown.fill",
            awayScore: nil, awayScorers: "",
            matchInfo: "Fútbol · Primer Equipo\nCuartos de final (vuelta) · Allianz Arena",
            status: .upcoming, stats: []
        ),
        // 2 — RM 1-1 Girona · LaLiga J31
        MatchHeaderData(
            competition: "LALIGA EA SPORTS",
            dateString: "Sáb 12 abr · 21:00",
            homeTeam: "Real Madrid",        homeTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91), homeTeamSymbol: "crown.fill",
            homeScore: 1, homeScorers: "Mbappé 44'",
            awayTeam: "Girona",             awayTeamColor: Color(red: 0.80, green: 0.10, blue: 0.15), awayTeamSymbol: "shield.fill",
            awayScore: 1, awayScorers: "Stuani 88'",
            matchInfo: "Fútbol · Primer Equipo\nJornada 31 · Santiago Bernabéu",
            status: .finished,
            stats: [
                MatchStat(label: "Posesión",          home: 54, away: 46, isPercent: true),
                MatchStat(label: "Tiros totales",     home: 16, away: 9,  isPercent: false),
                MatchStat(label: "Tiros a puerta",    home: 6,  away: 3,  isPercent: false),
                MatchStat(label: "Córners",           home: 7,  away: 3,  isPercent: false),
                MatchStat(label: "Faltas",            home: 10, away: 14, isPercent: false),
                MatchStat(label: "Fuera de juego",    home: 3,  away: 1,  isPercent: false),
                MatchStat(label: "Tarjetas amarillas",home: 2,  away: 3,  isPercent: false)
            ]
        ),
        // 3 — Mallorca 2-1 RM · LaLiga J30
        MatchHeaderData(
            competition: "LALIGA EA SPORTS",
            dateString: "Sáb 5 abr · 16:15",
            homeTeam: "Mallorca",           homeTeamColor: Color(red: 0.65, green: 0.05, blue: 0.10), homeTeamSymbol: "shield.fill",
            homeScore: 2, homeScorers: "Muriqi 23' · Abdón 67'",
            awayTeam: "Real Madrid",        awayTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91), awayTeamSymbol: "crown.fill",
            awayScore: 1, awayScorers: "Vinicius 55'",
            matchInfo: "Fútbol · Primer Equipo\nJornada 30 · Iberostar Estadi",
            status: .finished,
            stats: [
                MatchStat(label: "Posesión",       home: 38, away: 62, isPercent: true),
                MatchStat(label: "Tiros totales",  home: 8,  away: 18, isPercent: false),
                MatchStat(label: "Tiros a puerta", home: 4,  away: 7,  isPercent: false),
                MatchStat(label: "Córners",        home: 3,  away: 9,  isPercent: false),
                MatchStat(label: "Faltas",         home: 16, away: 8,  isPercent: false)
            ]
        ),
        // 4 — RM 3-1 Man. City · Champions Q/F ida
        MatchHeaderData(
            competition: "CHAMPIONS LEAGUE",
            dateString: "Mar 1 abr · 21:00",
            homeTeam: "Real Madrid",        homeTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91), homeTeamSymbol: "crown.fill",
            homeScore: 3, homeScorers: "Bellingham 12' · Vinicius 61' · Rodrygo 89'",
            awayTeam: "Manchester City",    awayTeamColor: Color(red: 0.42, green: 0.72, blue: 0.92), awayTeamSymbol: "shield.fill",
            awayScore: 1, awayScorers: "Foden 45'",
            matchInfo: "Fútbol · Primer Equipo\nCuartos de final (ida) · Santiago Bernabéu",
            status: .finished,
            stats: [
                MatchStat(label: "Posesión",       home: 48, away: 52, isPercent: true),
                MatchStat(label: "Tiros totales",  home: 14, away: 11, isPercent: false),
                MatchStat(label: "Tiros a puerta", home: 7,  away: 4,  isPercent: false),
                MatchStat(label: "Córners",        home: 5,  away: 6,  isPercent: false),
                MatchStat(label: "Faltas",         home: 9,  away: 12, isPercent: false)
            ]
        ),
        // 5 — RM 3-0 Betis · LaLiga J29
        MatchHeaderData(
            competition: "LALIGA EA SPORTS",
            dateString: "Dom 23 mar · 21:00",
            homeTeam: "Real Madrid",        homeTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91), homeTeamSymbol: "crown.fill",
            homeScore: 3, homeScorers: "Mbappé 8' · Bellingham 34' · Vinicius 71'",
            awayTeam: "Real Betis",         awayTeamColor: Color(red: 0.05, green: 0.55, blue: 0.25), awayTeamSymbol: "shield.fill",
            awayScore: 0, awayScorers: "",
            matchInfo: "Fútbol · Primer Equipo\nJornada 29 · Santiago Bernabéu",
            status: .finished,
            stats: [
                MatchStat(label: "Posesión",       home: 61, away: 39, isPercent: true),
                MatchStat(label: "Tiros totales",  home: 19, away: 7,  isPercent: false),
                MatchStat(label: "Tiros a puerta", home: 8,  away: 2,  isPercent: false),
                MatchStat(label: "Córners",        home: 8,  away: 2,  isPercent: false),
                MatchStat(label: "Faltas",         home: 8,  away: 15, isPercent: false)
            ]
        )
    ]
}

// MARK: - Data Provider (next + last match per followed team)
/// Central source of mock data for the three RM teams the user follows.
enum MockDataProvider {

    // Helper color shorthands
    private static let rmBlue  = Color(red: 0.29, green: 0.24, blue: 0.91)
    private static let bayRed  = Color(red: 0.75, green: 0.05, blue: 0.05)
    private static let barcRed = Color(red: 0.60, green: 0.00, blue: 0.20)
    private static let atlRed  = Color(red: 0.85, green: 0.15, blue: 0.15)
    private static let fenYel  = Color(red: 0.80, green: 0.65, blue: 0.05)
    private static let milRed  = Color(red: 0.70, green: 0.05, blue: 0.10)

    /// The three teams the user follows, with their upcoming and last match.
    static let followedTeams: [TeamMatchData] = [

        // ── Men's Football ──────────────────────────────────────────────
        TeamMatchData(
            teamType: .mensFootball,
            nextMatch: MatchHeaderData(
                competition: "CHAMPIONS LEAGUE",
                dateString: "Mié 15 abr · 21:00",
                homeTeam: "Bayern Múnich", homeTeamColor: bayRed,  homeTeamSymbol: "shield.fill",
                homeScore: nil, homeScorers: "",
                awayTeam: "Real Madrid",   awayTeamColor: rmBlue,  awayTeamSymbol: "crown.fill",
                awayScore: nil, awayScorers: "",
                matchInfo: "Fútbol Masculino\nCuartos de final (vuelta) · Allianz Arena",
                status: .upcoming, stats: []
            ),
            lastMatch: MatchHeaderData(
                competition: "LALIGA EA SPORTS",
                dateString: "Sáb 12 abr · 21:00",
                homeTeam: "Real Madrid", homeTeamColor: rmBlue,  homeTeamSymbol: "crown.fill",
                homeScore: 1, homeScorers: "Mbappé 44'",
                awayTeam: "Girona",      awayTeamColor: Color(red: 0.80, green: 0.10, blue: 0.15), awayTeamSymbol: "shield.fill",
                awayScore: 1, awayScorers: "Stuani 88'",
                matchInfo: "Fútbol Masculino\nJornada 31 · Santiago Bernabéu",
                status: .finished,
                stats: [
                    MatchStat(label: "Posesión",       home: 54, away: 46, isPercent: true),
                    MatchStat(label: "Tiros a puerta", home: 6,  away: 3,  isPercent: false),
                    MatchStat(label: "Córners",        home: 7,  away: 3,  isPercent: false)
                ]
            )
        ),

        // ── Women's Football ────────────────────────────────────────────
        TeamMatchData(
            teamType: .womensFootball,
            nextMatch: MatchHeaderData(
                competition: "UEFA WOMEN'S CL",
                dateString: "Jue 17 abr · 18:30",
                homeTeam: "Real Madrid",      homeTeamColor: rmBlue,  homeTeamSymbol: "crown.fill",
                homeScore: nil, homeScorers: "",
                awayTeam: "Barcelona Femení", awayTeamColor: barcRed, awayTeamSymbol: "shield.fill",
                awayScore: nil, awayScorers: "",
                matchInfo: "Fútbol Femenino\nSemifinal (ida) · Santiago Bernabéu",
                status: .upcoming, stats: []
            ),
            lastMatch: MatchHeaderData(
                competition: "LIGA F",
                dateString: "Dom 13 abr · 12:00",
                homeTeam: "Real Madrid",       homeTeamColor: rmBlue,  homeTeamSymbol: "crown.fill",
                homeScore: 2, homeScorers: "Atkins 15' · Esther 78'",
                awayTeam: "Atlético de Madrid", awayTeamColor: atlRed, awayTeamSymbol: "shield.fill",
                awayScore: 0, awayScorers: "",
                matchInfo: "Fútbol Femenino\nJornada 22 · Santiago Bernabéu",
                status: .finished,
                stats: [
                    MatchStat(label: "Posesión",       home: 58, away: 42, isPercent: true),
                    MatchStat(label: "Tiros a puerta", home: 8,  away: 2,  isPercent: false),
                    MatchStat(label: "Córners",        home: 6,  away: 1,  isPercent: false)
                ]
            )
        ),

        // ── Men's Basketball ────────────────────────────────────────────
        TeamMatchData(
            teamType: .mensBasketball,
            nextMatch: MatchHeaderData(
                competition: "EUROLEAGUE",
                dateString: "Vie 18 abr · 20:30",
                homeTeam: "Real Madrid",  homeTeamColor: rmBlue,  homeTeamSymbol: "crown.fill",
                homeScore: nil, homeScorers: "",
                awayTeam: "Fenerbahçe",  awayTeamColor: fenYel,  awayTeamSymbol: "shield.fill",
                awayScore: nil, awayScorers: "",
                matchInfo: "Baloncesto Masculino\nEuroLeague · WiZink Center",
                status: .upcoming, stats: []
            ),
            lastMatch: MatchHeaderData(
                competition: "EUROLEAGUE",
                dateString: "Dom 13 abr · 18:00",
                homeTeam: "Real Madrid",    homeTeamColor: rmBlue,  homeTeamSymbol: "crown.fill",
                homeScore: 87, homeScorers: "Llull 18 pts · Williams 14 pts",
                awayTeam: "Olimpia Milano", awayTeamColor: milRed,  awayTeamSymbol: "shield.fill",
                awayScore: 72, awayScorers: "Hall 22 pts",
                matchInfo: "Baloncesto Masculino\nEuroLeague · WiZink Center",
                status: .finished,
                stats: [
                    MatchStat(label: "% Tiros 2 pts", home: 58, away: 44, isPercent: true),
                    MatchStat(label: "% Triples",     home: 42, away: 30, isPercent: true),
                    MatchStat(label: "Rebotes",       home: 36, away: 28, isPercent: false),
                    MatchStat(label: "Asistencias",   home: 22, away: 15, isPercent: false)
                ]
            )
        )
    ]
}

// MARK: - Highlights
enum MockHighlights {
    static let all: [HighlightItem] = [
        // Matches
        HighlightItem(category: .match, title: "Resumen: Bayern 0-3 Real Madrid",
                      duration: "4:32",
                      thumbnailColors: [Color(red: 0.08, green: 0.10, blue: 0.32), Color(red: 0.18, green: 0.15, blue: 0.44)],
                      teamType: .mensFootball),
        HighlightItem(category: .match, title: "Resumen: RM Femenino 2-0 Atlético",
                      duration: "3:15",
                      thumbnailColors: [Color(red: 0.20, green: 0.06, blue: 0.28), Color(red: 0.32, green: 0.10, blue: 0.38)],
                      teamType: .womensFootball),
        HighlightItem(category: .match, title: "Resumen: RM Baloncesto 87-72 Milano",
                      duration: "5:20",
                      thumbnailColors: [Color(red: 0.24, green: 0.12, blue: 0.04), Color(red: 0.36, green: 0.20, blue: 0.06)],
                      teamType: .mensBasketball),
        HighlightItem(category: .match, title: "Mejores jugadas · Jornada 31",
                      duration: "6:10",
                      thumbnailColors: [Color(red: 0.05, green: 0.15, blue: 0.30), Color(red: 0.12, green: 0.22, blue: 0.45)],
                      teamType: .mensFootball),
        // Training
        HighlightItem(category: .training, title: "Entrenamiento en el Allianz Arena",
                      duration: "2:55",
                      thumbnailColors: [Color(red: 0.08, green: 0.22, blue: 0.16), Color(red: 0.14, green: 0.32, blue: 0.24)],
                      teamType: .mensFootball),
        HighlightItem(category: .training, title: "Sesión táctica · Equipo Femenino",
                      duration: "3:10",
                      thumbnailColors: [Color(red: 0.20, green: 0.08, blue: 0.22), Color(red: 0.30, green: 0.12, blue: 0.30)],
                      teamType: .womensFootball),
        HighlightItem(category: .training, title: "Sesión de tiro · WiZink Center",
                      duration: "4:00",
                      thumbnailColors: [Color(red: 0.22, green: 0.12, blue: 0.04), Color(red: 0.34, green: 0.18, blue: 0.06)],
                      teamType: .mensBasketball),
        // Interviews
        HighlightItem(category: .interview, title: "Bellingham: 'Es una final'",
                      duration: "3:45",
                      thumbnailColors: [Color(red: 0.22, green: 0.10, blue: 0.32), Color(red: 0.32, green: 0.16, blue: 0.44)],
                      teamType: .mensFootball),
        HighlightItem(category: .interview, title: "Atkins: 'Queremos el título'",
                      duration: "2:30",
                      thumbnailColors: [Color(red: 0.28, green: 0.06, blue: 0.22), Color(red: 0.40, green: 0.10, blue: 0.30)],
                      teamType: .womensFootball),
        HighlightItem(category: .interview, title: "Llull: 'El equipo está bien'",
                      duration: "4:05",
                      thumbnailColors: [Color(red: 0.26, green: 0.14, blue: 0.04), Color(red: 0.38, green: 0.22, blue: 0.06)],
                      teamType: .mensBasketball),
        // Press conferences
        HighlightItem(category: .pressConference, title: "Rueda de prensa: Carlo Ancelotti",
                      duration: "12:18",
                      thumbnailColors: [Color(red: 0.10, green: 0.16, blue: 0.24), Color(red: 0.16, green: 0.24, blue: 0.38)],
                      teamType: .mensFootball),
        HighlightItem(category: .pressConference, title: "Rueda de prensa previa EuroLeague",
                      duration: "8:45",
                      thumbnailColors: [Color(red: 0.24, green: 0.14, blue: 0.04), Color(red: 0.36, green: 0.22, blue: 0.08)],
                      teamType: .mensBasketball)
    ]
}

// MARK: - Survey / Trivia
enum MockSurvey {
    static let trivia = SurveyItem(
        question: "¿Cuántas UEFA Champions League ha ganado el Real Madrid?",
        options: [
            SurveyOption(text: "13", votes: 996),
            SurveyOption(text: "14", votes: 1494),
            SurveyOption(text: "15", votes: 8964),
            SurveyOption(text: "16", votes: 996)
        ],
        correctIndex: 2
    )
}
