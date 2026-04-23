import SwiftUI

// MARK: - Teams
enum MockTeams {
    static let realMadrid = Team(name: "Real Madrid", shortName: "RM", color: Color(red: 0.29, green: 0.24, blue: 0.91), symbol: "crown.fill")
    static let bayernMunich = Team(name: "Bayern Múnich", shortName: "BAY", color: .red, symbol: "shield.fill")
    static let barcelona = Team(name: "FC Barcelona", shortName: "FCB", color: Color(red: 0.60, green: 0.0, blue: 0.2), symbol: "shield.fill")
    static let atletico = Team(name: "Atlético de Madrid", shortName: "ATM", color: Color(red: 0.85, green: 0.15, blue: 0.15), symbol: "shield.fill")
    static let fenerbahce = Team(name: "Fenerbahçe", shortName: "FEN", color: .yellow, symbol: "shield.fill")
    static let brighton = Team(name: "Brighton", shortName: "BRI", color: Color(red: 0.0, green: 0.45, blue: 0.75), symbol: "shield.fill")
    static let betis = Team(name: "Real Betis", shortName: "BET", color: Color(red: 0.0, green: 0.55, blue: 0.25), symbol: "shield.fill")
    static let celta = Team(name: "Celta de Vigo", shortName: "CEL", color: Color(red: 0.45, green: 0.75, blue: 0.90), symbol: "shield.fill")
    static let rayo = Team(name: "Rayo Vallecano", shortName: "RAY", color: .red, symbol: "shield.fill")
    static let manchesterCity = Team(name: "Manchester City", shortName: "MCI", color: Color(red: 0.42, green: 0.72, blue: 0.92), symbol: "shield.fill")
    static let benfica = Team(name: "Benfica", shortName: "BEN", color: Color(red: 0.80, green: 0.05, blue: 0.05), symbol: "shield.fill")
}

// MARK: - Matches
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
        (1,  Match(homeTeam: MockTeams.barcelona, awayTeam: MockTeams.realMadrid, competition: "LaLiga", round: "J31", date: Date(), dateString: "Mar 1 abr · 21:00", venue: "Camp Nou", category: "Fútbol · Primer Equipo")),
        (6,  Match(homeTeam: MockTeams.realMadrid, awayTeam: MockTeams.brighton, competition: "Champions", round: "Q/F Ida", date: Date(), dateString: "Dom 6 abr · 21:00", venue: "Bernabéu", category: "Fútbol · Primer Equipo")),
        (8,  Match(homeTeam: MockTeams.fenerbahce, awayTeam: MockTeams.realMadrid, competition: "Champions", round: "Q/F Vuelta", date: Date(), dateString: "Mar 8 abr · 21:00", venue: "Fenerbahçe S.K.", category: "Fútbol · Primer Equipo")),
        (11, Match(homeTeam: MockTeams.rayo, awayTeam: MockTeams.realMadrid, competition: "LaLiga", round: "J32", date: Date(), dateString: "Vie 11 abr · 21:00", venue: "Vallecas", category: "Fútbol · Primer Equipo")),
        (14, Match(homeTeam: MockTeams.bayernMunich, awayTeam: MockTeams.realMadrid, competition: "Champions", round: "SF Ida", date: Date(), dateString: "Lun 14 abr · 21:00", venue: "Allianz Arena", category: "Fútbol · Primer Equipo")),
        (15, Match(homeTeam: MockTeams.bayernMunich, awayTeam: MockTeams.realMadrid, competition: "Champions", round: "Q/F Vuelta", date: Date(), dateString: "Mié 15 abr · 21:00", venue: "Allianz Arena", category: "Fútbol · Primer Equipo")),
        (17, Match(homeTeam: MockTeams.realMadrid, awayTeam: MockTeams.celta, competition: "LaLiga", round: "J33", date: Date(), dateString: "Jue 17 abr · 21:00", venue: "Bernabéu", category: "Fútbol · Primer Equipo")),
        (22, Match(homeTeam: MockTeams.atletico, awayTeam: MockTeams.realMadrid, competition: "LaLiga", round: "J34", date: Date(), dateString: "Mar 22 abr · 21:00", venue: "Metropolitano", category: "Fútbol · Primer Equipo")),
        (23, Match(homeTeam: MockTeams.realMadrid, awayTeam: MockTeams.betis, competition: "LaLiga", round: "J35", date: Date(), dateString: "Mié 23 abr · 21:00", venue: "Bernabéu", category: "Fútbol · Primer Equipo"))
    ]
}

// MARK: - News
enum MockNews {
    static let items: [NewsItem] = [
        NewsItem(
            title: "Bayern-Real Madrid: a por la remontada en Múnich",
            subtitle: "Nuestro equipo visita el Allianz Arena con la intención de dar la vuelta al 1-2 de la ida y lograr el pase a las semifinales de la Champions (21:00 h; Orange TV y Movistar Liga de Campeones).",
            category: "NOTICIA",
            date: "15/04/2026",
            author: "Alberto Navarro",
            imageName: "photo.fill",
            imageColor: Color(red: 0.15, green: 0.20, blue: 0.40),
            body: "El Real Madrid visita el Allianz Arena este miércoles a las 21:00 horas con un objetivo claro: remontar el 1-2 de la ida disputada en el Santiago Bernabéu. El equipo de Carlo Ancelotti llega en un gran momento de forma, con Bellingham y Vinicius liderando el ataque blanco. La clave estará en la solidez defensiva y en aprovechar las transiciones rápidas al ataque.\n\nBayern Múnich necesitará gestionar bien el partido para evitar que el Madrid se adelante pronto en el marcador. Los bávaros cuentan con la ventaja de jugar en casa ante su fiel afición. Sin embargo, el historial reciente favorece al conjunto merengue, que ha demostrado ser un equipo muy solvente en las grandes noches europeas.\n\nEl partido se podrá ver en directo a través de Orange TV y Movistar Liga de Campeones a partir de las 21:00 horas."
        ),
        NewsItem(
            title: "Arbeloa: \"Podemos hacerlo, estamos convencidos de ello\"",
            subtitle: "El entrenador del Castilla habló sobre las posibilidades del primer equipo en Múnich.",
            category: "NOTICIA",
            date: "15/04/2026",
            author: "Redacción",
            imageName: "photo.fill",
            imageColor: Color(red: 0.25, green: 0.30, blue: 0.55),
            body: "Álvaro Arbeloa, técnico del Real Madrid Castilla, mostró su confianza plena en el primer equipo antes del decisivo duelo ante el Bayern de Múnich. \"Podemos hacerlo, estamos convencidos de ello\", afirmó el ex jugador madridista en declaraciones a los medios oficiales del club."
        ),
        NewsItem(
            title: "El Real Madrid se entrenó en el Allianz Arena",
            subtitle: "El equipo realizó el entrenamiento oficial previo al partido de la Champions League.",
            category: "NOTICIA",
            date: "14/04/2026",
            author: "Redacción",
            imageName: "photo.fill",
            imageColor: Color(red: 0.10, green: 0.15, blue: 0.35),
            body: "El Real Madrid completó este martes el entrenamiento oficial en el Allianz Arena, escenario del partido de vuelta de los cuartos de final de la UEFA Champions League. Ancelotti dirigió la sesión con normalidad y todos los jugadores convocados trabajaron a las órdenes del técnico italiano."
        ),
        NewsItem(
            title: "Bellingham: \"Es una final y vamos a darlo todo para ganar\"",
            subtitle: "El centrocampista inglés habló en la rueda de prensa previa al duelo en Múnich.",
            category: "NOTICIA",
            date: "14/04/2026",
            author: "Redacción",
            imageName: "photo.fill",
            imageColor: Color(red: 0.20, green: 0.18, blue: 0.50),
            body: "Jude Bellingham compareció ante los medios de comunicación en la rueda de prensa previa al duelo ante el Bayern de Múnich. El centrocampista inglés se mostró muy motivado y aseguró que el equipo va a dar el máximo para lograr la remontada y pasar a semifinales."
        ),
        NewsItem(
            title: "Convocatoria del Real Madrid ante el Bayern",
            subtitle: "Carlo Ancelotti dio a conocer los 23 jugadores citados para el partido.",
            category: "NOTICIA",
            date: "14/04/2026",
            author: "Redacción",
            imageName: "photo.fill",
            imageColor: Color(red: 0.30, green: 0.10, blue: 0.20),
            body: "Carlo Ancelotti ha dado a conocer la lista de convocados del Real Madrid para el partido de vuelta de los cuartos de final de la UEFA Champions League ante el Bayern de Múnich. Todos los jugadores disponibles han entrado en la convocatoria."
        ),
        NewsItem(
            title: "Así fue la llegada del Real Madrid a Múnich",
            subtitle: "El equipo viajó este lunes a la capital bávara para preparar el duelo europeo.",
            category: "NOTICIA",
            date: "14/04/2026",
            author: "Redacción",
            imageName: "photo.fill",
            imageColor: Color(red: 0.15, green: 0.25, blue: 0.45),
            body: "El Real Madrid aterrizó este lunes en Múnich para preparar el importante duelo europeo ante el Bayern. El equipo fue recibido por un gran número de aficionados madridistas que se desplazaron hasta la ciudad alemana para apoyar al equipo."
        ),
        NewsItem(
            title: "Horarios y resultados de los partidos de vuelta de los cuartos",
            subtitle: "Consulta todos los partidos de vuelta de cuartos de final de la Champions League.",
            category: "NOTICIA",
            date: "13/04/2026",
            author: "Redacción",
            imageName: "photo.fill",
            imageColor: Color(red: 0.20, green: 0.35, blue: 0.60),
            body: "La UEFA Champions League llega a su fase de cuartos de final con emocionantes duelos de vuelta. Consulta los horarios, resultados y cómo ver los partidos en directo."
        )
    ]
}

// MARK: - TV Schedule
enum MockTV {
    static let days: [TVDay] = [
        TVDay(label: "Miércoles", items: [
            TVScheduleItem(time: "08:15", title: "Fútbol. Champions League 25/26. Octavos de final (Ida). Real Madrid-Manchester City", isLive: false),
            TVScheduleItem(time: "10:15", title: "Hoy Jugamos. Bayern Múnich-Real Madrid (Directo)", isLive: true),
            TVScheduleItem(time: "10:20", title: "Fútbol. Champions League 25/26. Playoff (Ida). Benfica-Real Madrid", isLive: false),
            TVScheduleItem(time: "13:00", title: "Resumen: Bayern Múnich-Real Madrid", isLive: false),
            TVScheduleItem(time: "15:30", title: "Real Madrid TV. Magazine semanal", isLive: false),
            TVScheduleItem(time: "18:00", title: "Entrenamiento. Sesión del primer equipo", isLive: false),
            TVScheduleItem(time: "21:00", title: "Fútbol. LaLiga EA Sports. Real Madrid-Valencia (EN DIRECTO)", isLive: true)
        ]),
        TVDay(label: "Jueves", items: [
            TVScheduleItem(time: "09:00", title: "Rueda de prensa post-partido", isLive: false),
            TVScheduleItem(time: "11:00", title: "Resumen semana Champions League 25/26", isLive: false),
            TVScheduleItem(time: "16:00", title: "Entrenamiento. Sesión del primer equipo", isLive: false),
            TVScheduleItem(time: "20:00", title: "Real Madrid TV. Especial Champions", isLive: false)
        ]),
        TVDay(label: "Viernes", items: [
            TVScheduleItem(time: "10:00", title: "Rueda de prensa pre-partido LaLiga", isLive: false),
            TVScheduleItem(time: "12:00", title: "Fútbol. LaLiga EA Sports. Análisis de la jornada", isLive: false),
            TVScheduleItem(time: "17:30", title: "Entrenamiento. Sesión del primer equipo", isLive: false),
            TVScheduleItem(time: "22:00", title: "El Día del Madrid", isLive: false)
        ]),
        TVDay(label: "Sábado", items: [
            TVScheduleItem(time: "12:00", title: "Clásico de la historia. Real Madrid-Bayern Múnich Final 2018", isLive: false),
            TVScheduleItem(time: "15:00", title: "Real Madrid TV. Especial Derby Madrileño", isLive: false),
            TVScheduleItem(time: "18:30", title: "Fútbol. LaLiga EA Sports. Atlético de Madrid-Real Madrid (EN DIRECTO)", isLive: true),
            TVScheduleItem(time: "22:30", title: "Resumen. Atlético de Madrid-Real Madrid", isLive: false)
        ])
    ]
}

// MARK: - Home Header Matches (horizontal carousel)
enum MockHeaderMatches {
    private static let rmBlue    = Color(red: 0.29, green: 0.24, blue: 0.91)
    private static let bayernRed = Color(red: 0.75, green: 0.05, blue: 0.05)
    private static let mcityBlue = Color(red: 0.42, green: 0.72, blue: 0.92)
    private static let betisGrn  = Color(red: 0.05, green: 0.55, blue: 0.25)
    private static let mallRed   = Color(red: 0.65, green: 0.05, blue: 0.10)
    private static let gironaRed = Color(red: 0.80, green: 0.10, blue: 0.15)

    static let all: [MatchHeaderData] = [

        // 1 — Bayern vs RM · Q/F Champions vuelta (próximo)
        MatchHeaderData(
            competition: "CHAMPIONS LEAGUE",
            dateString: "Mié 15 abr · 21:00",
            homeTeam: "Bayern Múnich",
            homeTeamColor: Color(red: 0.75, green: 0.05, blue: 0.05),
            homeTeamSymbol: "shield.fill",
            homeScore: nil,
            homeScorers: "",
            awayTeam: "Real Madrid",
            awayTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91),
            awayTeamSymbol: "crown.fill",
            awayScore: nil,
            awayScorers: "",
            matchInfo: "Fútbol · Primer Equipo\nCuartos de final (vuelta) · Allianz Arena",
            status: .upcoming,
            stats: []
        ),

        // 2 — RM 1-1 Girona · LaLiga J31
        MatchHeaderData(
            competition: "LALIGA EA SPORTS",
            dateString: "Sáb 12 abr · 21:00",
            homeTeam: "Real Madrid",
            homeTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91),
            homeTeamSymbol: "crown.fill",
            homeScore: 1,
            homeScorers: "Mbappé 44'",
            awayTeam: "Girona",
            awayTeamColor: Color(red: 0.80, green: 0.10, blue: 0.15),
            awayTeamSymbol: "shield.fill",
            awayScore: 1,
            awayScorers: "Stuani 88'",
            matchInfo: "Fútbol · Primer Equipo\nJornada 31 · Santiago Bernabéu",
            status: .finished,
            stats: [
                MatchStat(label: "Posesión", home: 54, away: 46, isPercent: true),
                MatchStat(label: "Tiros totales", home: 16, away: 9, isPercent: false),
                MatchStat(label: "Tiros a puerta", home: 6, away: 3, isPercent: false),
                MatchStat(label: "Córners", home: 7, away: 3, isPercent: false),
                MatchStat(label: "Faltas", home: 10, away: 14, isPercent: false),
                MatchStat(label: "Fuera de juego", home: 3, away: 1, isPercent: false),
                MatchStat(label: "Tarjetas amarillas", home: 2, away: 3, isPercent: false)
            ]
        ),

        // 3 — Mallorca 2-1 RM · LaLiga J30
        MatchHeaderData(
            competition: "LALIGA EA SPORTS",
            dateString: "Sáb 5 abr · 16:15",
            homeTeam: "Mallorca",
            homeTeamColor: Color(red: 0.65, green: 0.05, blue: 0.10),
            homeTeamSymbol: "shield.fill",
            homeScore: 2,
            homeScorers: "Muriqi 23' · Abdón 67'",
            awayTeam: "Real Madrid",
            awayTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91),
            awayTeamSymbol: "crown.fill",
            awayScore: 1,
            awayScorers: "Vinicius 55'",
            matchInfo: "Fútbol · Primer Equipo\nJornada 30 · Iberostar Estadi",
            status: .finished,
            stats: [
                MatchStat(label: "Posesión", home: 38, away: 62, isPercent: true),
                MatchStat(label: "Tiros totales", home: 8, away: 18, isPercent: false),
                MatchStat(label: "Tiros a puerta", home: 4, away: 7, isPercent: false),
                MatchStat(label: "Córners", home: 3, away: 9, isPercent: false),
                MatchStat(label: "Faltas", home: 16, away: 8, isPercent: false),
                MatchStat(label: "Fuera de juego", home: 1, away: 4, isPercent: false),
                MatchStat(label: "Tarjetas amarillas", home: 4, away: 1, isPercent: false)
            ]
        ),

        // 4 — RM 3-1 Man. City · Champions Q/F ida
        MatchHeaderData(
            competition: "CHAMPIONS LEAGUE",
            dateString: "Mar 1 abr · 21:00",
            homeTeam: "Real Madrid",
            homeTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91),
            homeTeamSymbol: "crown.fill",
            homeScore: 3,
            homeScorers: "Bellingham 12' · Vinicius 61' · Rodrygo 89'",
            awayTeam: "Manchester City",
            awayTeamColor: Color(red: 0.42, green: 0.72, blue: 0.92),
            awayTeamSymbol: "shield.fill",
            awayScore: 1,
            awayScorers: "Foden 45'",
            matchInfo: "Fútbol · Primer Equipo\nCuartos de final (ida) · Santiago Bernabéu",
            status: .finished,
            stats: [
                MatchStat(label: "Posesión", home: 48, away: 52, isPercent: true),
                MatchStat(label: "Tiros totales", home: 14, away: 11, isPercent: false),
                MatchStat(label: "Tiros a puerta", home: 7, away: 4, isPercent: false),
                MatchStat(label: "Córners", home: 5, away: 6, isPercent: false),
                MatchStat(label: "Faltas", home: 9, away: 12, isPercent: false),
                MatchStat(label: "Fuera de juego", home: 2, away: 3, isPercent: false),
                MatchStat(label: "Tarjetas amarillas", home: 1, away: 2, isPercent: false)
            ]
        ),

        // 5 — RM 3-0 Betis · LaLiga J29
        MatchHeaderData(
            competition: "LALIGA EA SPORTS",
            dateString: "Dom 23 mar · 21:00",
            homeTeam: "Real Madrid",
            homeTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91),
            homeTeamSymbol: "crown.fill",
            homeScore: 3,
            homeScorers: "Mbappé 8' · Bellingham 34' · Vinicius 71'",
            awayTeam: "Real Betis",
            awayTeamColor: Color(red: 0.05, green: 0.55, blue: 0.25),
            awayTeamSymbol: "shield.fill",
            awayScore: 0,
            awayScorers: "",
            matchInfo: "Fútbol · Primer Equipo\nJornada 29 · Santiago Bernabéu",
            status: .finished,
            stats: [
                MatchStat(label: "Posesión", home: 61, away: 39, isPercent: true),
                MatchStat(label: "Tiros totales", home: 19, away: 7, isPercent: false),
                MatchStat(label: "Tiros a puerta", home: 8, away: 2, isPercent: false),
                MatchStat(label: "Córners", home: 8, away: 2, isPercent: false),
                MatchStat(label: "Faltas", home: 8, away: 15, isPercent: false),
                MatchStat(label: "Fuera de juego", home: 4, away: 0, isPercent: false),
                MatchStat(label: "Tarjetas amarillas", home: 1, away: 3, isPercent: false)
            ],
            category: .mensFootball
        ),

        // 6 — RM Femenino vs Barça Femení · Liga F (próximo)
        MatchHeaderData(
            competition: "LIGA F",
            dateString: "Dom 19 abr · 12:00",
            homeTeam: "Real Madrid",
            homeTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91),
            homeTeamSymbol: "crown.fill",
            homeScore: nil,
            homeScorers: "",
            awayTeam: "FC Barcelona",
            awayTeamColor: Color(red: 0.60, green: 0.0, blue: 0.2),
            awayTeamSymbol: "shield.fill",
            awayScore: nil,
            awayScorers: "",
            matchInfo: "Fútbol Femenino\nJornada 28 · Alfredo Di Stéfano",
            status: .upcoming,
            stats: [],
            category: .womensFootball
        ),

        // 7 — RM Femenino 2-1 At. Madrid (finalizado)
        MatchHeaderData(
            competition: "LIGA F",
            dateString: "Sáb 5 abr · 18:30",
            homeTeam: "Real Madrid",
            homeTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91),
            homeTeamSymbol: "crown.fill",
            homeScore: 2,
            homeScorers: "Caroline Weir 22' · Linda Caicedo 67'",
            awayTeam: "At. Madrid",
            awayTeamColor: Color(red: 0.85, green: 0.15, blue: 0.15),
            awayTeamSymbol: "shield.fill",
            awayScore: 1,
            awayScorers: "Eva Navarro 54'",
            matchInfo: "Fútbol Femenino\nJornada 27 · Alfredo Di Stéfano",
            status: .finished,
            stats: [
                MatchStat(label: "Posesión", home: 57, away: 43, isPercent: true),
                MatchStat(label: "Tiros totales", home: 13, away: 8, isPercent: false),
                MatchStat(label: "Tiros a puerta", home: 5, away: 3, isPercent: false),
                MatchStat(label: "Córners", home: 6, away: 2, isPercent: false)
            ],
            category: .womensFootball
        ),

        // 8 — RM Baloncesto vs Panathinaikos · Euroliga (próximo)
        MatchHeaderData(
            competition: "EUROLIGA",
            dateString: "Jue 23 abr · 21:00",
            homeTeam: "Real Madrid",
            homeTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91),
            homeTeamSymbol: "crown.fill",
            homeScore: nil,
            homeScorers: "",
            awayTeam: "Panathinaikos",
            awayTeamColor: Color(red: 0.0, green: 0.50, blue: 0.20),
            awayTeamSymbol: "shield.fill",
            awayScore: nil,
            awayScorers: "",
            matchInfo: "Baloncesto · Primer Equipo\nPlayoff (Partido 3) · WiZink Center",
            status: .upcoming,
            stats: [],
            category: .basketball
        ),

        // 9 — RM Baloncesto 89-77 Barça · Liga Endesa (finalizado)
        MatchHeaderData(
            competition: "LIGA ENDESA",
            dateString: "Dom 13 abr · 19:00",
            homeTeam: "Real Madrid",
            homeTeamColor: Color(red: 0.29, green: 0.24, blue: 0.91),
            homeTeamSymbol: "crown.fill",
            homeScore: 89,
            homeScorers: "Campazzo 21 pts · Tavares 14 pts",
            awayTeam: "FC Barcelona",
            awayTeamColor: Color(red: 0.60, green: 0.0, blue: 0.2),
            awayTeamSymbol: "shield.fill",
            awayScore: 77,
            awayScorers: "Vesely 18 pts · Laprovíttola 15 pts",
            matchInfo: "Baloncesto · Primer Equipo\nJornada 30 · Palau Blaugrana",
            status: .finished,
            stats: [
                MatchStat(label: "Tiros de 2", home: 58, away: 49, isPercent: true),
                MatchStat(label: "Triples", home: 42, away: 33, isPercent: true),
                MatchStat(label: "Tiros libres", home: 82, away: 74, isPercent: true),
                MatchStat(label: "Rebotes", home: 38, away: 31, isPercent: false),
                MatchStat(label: "Asistencias", home: 22, away: 16, isPercent: false)
            ],
            category: .basketball
        )
    ]
}
