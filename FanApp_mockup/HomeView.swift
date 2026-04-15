import SwiftUI

// MARK: - HomeView
struct HomeView: View {
    @Binding var showSideMenu: Bool

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                HoyNavBar(showSideMenu: $showSideMenu)

                ScrollView(showsIndicators: false) {
                    VStack(spacing: 24) {
                        // 1. Próximos partidos (hasta 3 equipos)
                        NextMatchesSection(teams: MockDataProvider.followedTeams)

                        // 2. Último resultado por equipo
                        LastResultsSection(teams: MockDataProvider.followedTeams)

                        // 3. Noticias recientes
                        HomeNewsSectionView()

                        // 4. Highlights (carrusel + ver todos)
                        HomeHighlightsSectionView()

                        // 5. Trivia del día
                        HomeSurveySectionView()

                        Color.clear.frame(height: 8)
                    }
                    .padding(.top, 4)
                }
                .background(Color(UIColor.systemGroupedBackground))
            }
            .ignoresSafeArea(edges: .top)
            .navigationBarHidden(true)
        }
    }
}

// MARK: - Navigation Bar
struct HoyNavBar: View {
    @Binding var showSideMenu: Bool

    var body: some View {
        ZStack {
            Color(red: 0.11, green: 0.12, blue: 0.22).ignoresSafeArea(edges: .top)
            VStack(spacing: 0) {
                Color.clear.frame(height: 52)
                HStack(alignment: .center, spacing: 0) {
                    Button { showSideMenu = true } label: {
                        VStack(spacing: 2) {
                            Image(systemName: "person.circle")
                                .font(.system(size: 21))
                                .foregroundColor(.white.opacity(0.82))
                            Text("Tu área")
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(.white.opacity(0.55))
                        }
                    }
                    .frame(width: 52)

                    Spacer()
                    Text("HOY")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                        .tracking(3)
                    Spacer()

                    Button {} label: {
                        VStack(spacing: 2) {
                            Image(systemName: "antenna.radiowaves.left.and.right")
                                .font(.system(size: 19))
                                .foregroundColor(.white.opacity(0.82))
                            Text("Radio")
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(.white.opacity(0.55))
                        }
                    }
                    .frame(width: 52)
                }
                .padding(.horizontal, 14)
                .padding(.bottom, 13)
            }
        }
        .frame(height: 92)
    }
}

// MARK: - Shared: Section Header
struct HomeSectionHeader: View {
    let title: String
    var showAll: Bool = true
    var onShowAll: (() -> Void)? = nil

    var body: some View {
        HStack {
            Text(title)
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(UIColor.label))
            Spacer()
            if showAll, let action = onShowAll {
                Button(action: action) {
                    HStack(spacing: 3) {
                        Text("Ver todos")
                            .font(.system(size: 13, weight: .medium))
                        Image(systemName: "chevron.right")
                            .font(.system(size: 11, weight: .semibold))
                    }
                    .foregroundColor(RMTheme.primary)
                }
            }
        }
        .padding(.horizontal, 16)
    }
}

// MARK: - Shared: Team Type Badge
/// Small pill label that identifies one of the three RM teams.
struct TeamTypeBadge: View {
    let teamType: ClubTeamType

    var body: some View {
        Text(teamType.shortName)
            .font(.system(size: 9, weight: .bold))
            .foregroundColor(teamType.badgeColor)
            .tracking(0.5)
            .padding(.horizontal, 8)
            .padding(.vertical, 4)
            .background(teamType.badgeColor.opacity(0.14))
            .cornerRadius(20)
    }
}

// MARK: - Shared: Match Crest View
struct MatchCrestView: View {
    let color: Color
    let symbol: String
    let size: CGFloat

    var body: some View {
        ZStack {
            Circle().fill(color.opacity(0.18)).frame(width: size, height: size)
            Circle().stroke(color.opacity(0.35), lineWidth: 1.5).frame(width: size, height: size)
            Image(systemName: symbol)
                .font(.system(size: size * 0.38, weight: .bold))
                .foregroundColor(color)
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MARK: - 1. PRÓXIMOS PARTIDOS
// ─────────────────────────────────────────────────────────────────────────────

/// Shows one upcoming match card per followed team (up to 3).
/// Teams without a scheduled match are silently omitted.
struct NextMatchesSection: View {
    let teams: [TeamMatchData]

    private var teamsWithNext: [TeamMatchData] {
        teams.filter { $0.nextMatch != nil }
    }

    var body: some View {
        VStack(spacing: 12) {
            HomeSectionHeader(title: "Próximos partidos", showAll: false)

            VStack(spacing: 10) {
                ForEach(teamsWithNext, id: \.teamType) { data in
                    NavigationLink(destination: MatchCentreView(match: data.nextMatch!)) {
                        TeamNextMatchCard(match: data.nextMatch!, teamType: data.teamType)
                            .padding(.horizontal, 16)
                    }
                    .buttonStyle(.plain)
                }
            }
        }
    }
}

// MARK: - TeamNextMatchCard
struct TeamNextMatchCard: View {
    let match: MatchHeaderData
    let teamType: ClubTeamType

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16)
                .fill(LinearGradient(
                    colors: teamType.cardGradient,
                    startPoint: .topLeading, endPoint: .bottomTrailing
                ))

            VStack(spacing: 0) {
                // Top row: team badge + competition + arrow hint
                HStack {
                    TeamTypeBadge(teamType: teamType)
                    Text(match.competition)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(.white.opacity(0.50))
                        .lineLimit(1)
                    Spacer()
                    Image(systemName: "chevron.right")
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(.white.opacity(0.35))
                }
                .padding(.horizontal, 16)
                .padding(.top, 14)
                .padding(.bottom, 12)

                // Teams row
                HStack(alignment: .center) {
                    // Home team
                    VStack(spacing: 5) {
                        MatchCrestView(color: match.homeTeamColor,
                                       symbol: match.homeTeamSymbol, size: 44)
                        Text(match.homeTeam)
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(.white.opacity(0.85))
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                            .frame(maxWidth: 90)
                    }

                    Spacer()

                    // Center: VS + date (upcoming) or score (finished/live)
                    if match.status == .upcoming {
                        VStack(spacing: 5) {
                            Text("VS")
                                .font(.system(size: 14, weight: .black))
                                .foregroundColor(.white.opacity(0.28))
                            Text(match.dateString)
                                .font(.system(size: 12, weight: .semibold))
                                .foregroundColor(.white)
                                .multilineTextAlignment(.center)
                        }
                    } else {
                        VStack(spacing: 2) {
                            HStack(spacing: 7) {
                                Text("\(match.homeScore ?? 0)")
                                    .font(.system(size: 30, weight: .bold)).foregroundColor(.white)
                                Text("-")
                                    .font(.system(size: 18)).foregroundColor(.white.opacity(0.45))
                                Text("\(match.awayScore ?? 0)")
                                    .font(.system(size: 30, weight: .bold)).foregroundColor(.white)
                            }
                            Text(match.status == .live ? "EN VIVO" : "FIN")
                                .font(.system(size: 8, weight: .bold))
                                .foregroundColor(match.status == .live
                                                 ? Color(red: 0.20, green: 0.85, blue: 0.45)
                                                 : .white.opacity(0.35))
                                .tracking(1)
                        }
                    }

                    Spacer()

                    // Away team
                    VStack(spacing: 5) {
                        MatchCrestView(color: match.awayTeamColor,
                                       symbol: match.awayTeamSymbol, size: 44)
                        Text(match.awayTeam)
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(.white.opacity(0.85))
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                            .frame(maxWidth: 90)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 10)

                // Venue line (second line of matchInfo)
                let venue = match.matchInfo.components(separatedBy: "\n").last ?? ""
                Text(venue)
                    .font(.system(size: 10))
                    .foregroundColor(.white.opacity(0.34))
                    .padding(.bottom, 14)
            }
        }
        .shadow(color: Color(teamType.cardGradient.first ?? .black).opacity(0.40),
                radius: 12, x: 0, y: 5)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MARK: - 2. ÚLTIMO RESULTADO
// ─────────────────────────────────────────────────────────────────────────────

/// Shows the most recent result for each followed team.
struct LastResultsSection: View {
    let teams: [TeamMatchData]

    private var teamsWithLast: [TeamMatchData] {
        teams.filter { $0.lastMatch != nil }
    }

    var body: some View {
        VStack(spacing: 12) {
            HomeSectionHeader(title: "Último resultado", showAll: false)

            VStack(spacing: 10) {
                ForEach(teamsWithLast, id: \.teamType) { data in
                    MatchSummaryCardView(match: data.lastMatch!, teamType: data.teamType)
                        .padding(.horizontal, 16)
                }
            }
        }
    }
}

// MARK: - MatchSummaryCardView
struct MatchSummaryCardView: View {
    let match: MatchHeaderData
    let teamType: ClubTeamType

    /// W / D / L from RM's perspective (crown.fill = RM is home).
    private var resultLabel: String {
        guard let hs = match.homeScore, let as_ = match.awayScore else { return "" }
        let rm  = match.homeTeamSymbol == "crown.fill" ? hs : as_
        let opp = match.homeTeamSymbol == "crown.fill" ? as_ : hs
        if rm > opp { return "G" }
        if rm == opp { return "E" }
        return "P"
    }

    private var resultColor: Color {
        switch resultLabel {
        case "G": return Color(red: 0.15, green: 0.70, blue: 0.38)
        case "E": return Color(UIColor.systemGray)
        default:  return Color(red: 0.85, green: 0.18, blue: 0.18)
        }
    }

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Header row
            HStack {
                TeamTypeBadge(teamType: teamType)
                Text(match.competition)
                    .font(.system(size: 10, weight: .medium))
                    .foregroundColor(Color(UIColor.secondaryLabel))
                    .lineLimit(1)
                Spacer()
                Text(match.dateString)
                    .font(.system(size: 10))
                    .foregroundColor(Color(UIColor.tertiaryLabel))
            }
            .padding(.horizontal, 14)
            .padding(.top, 14)
            .padding(.bottom, 10)

            Divider().padding(.horizontal, 14)

            // Score row
            HStack(alignment: .center, spacing: 0) {
                // Home crest + name
                VStack(spacing: 4) {
                    MatchCrestView(color: match.homeTeamColor,
                                   symbol: match.homeTeamSymbol, size: 36)
                    Text(match.homeTeam)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(Color(UIColor.label))
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                        .frame(maxWidth: 80)
                }

                Spacer()

                // Score
                HStack(spacing: 6) {
                    Text("\(match.homeScore ?? 0)")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(Color(UIColor.label))
                    Text("-")
                        .font(.system(size: 18))
                        .foregroundColor(Color(UIColor.tertiaryLabel))
                    Text("\(match.awayScore ?? 0)")
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(Color(UIColor.label))
                }

                Spacer()

                // Away crest + name
                VStack(spacing: 4) {
                    MatchCrestView(color: match.awayTeamColor,
                                   symbol: match.awayTeamSymbol, size: 36)
                    Text(match.awayTeam)
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(Color(UIColor.label))
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                        .frame(maxWidth: 80)
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 10)

            // Scorers row (if any)
            if !match.homeScorers.isEmpty || !match.awayScorers.isEmpty {
                HStack {
                    Text(match.homeScorers)
                        .font(.system(size: 10))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                        .lineLimit(1)
                    Spacer()
                    Text(match.awayScorers)
                        .font(.system(size: 10))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                        .lineLimit(1)
                }
                .padding(.horizontal, 14)
                .padding(.bottom, 8)
            }

            Divider().padding(.horizontal, 14)

            // Footer: result badge + Ver resumen link
            HStack {
                // Result badge
                ZStack {
                    Circle()
                        .fill(resultColor.opacity(0.12))
                        .frame(width: 28, height: 28)
                    Text(resultLabel)
                        .font(.system(size: 11, weight: .bold))
                        .foregroundColor(resultColor)
                }

                Spacer()

                NavigationLink(destination: MatchCentreView(match: match)) {
                    HStack(spacing: 4) {
                        Text("Ver resumen")
                            .font(.system(size: 13, weight: .medium))
                        Image(systemName: "chevron.right")
                            .font(.system(size: 11, weight: .semibold))
                    }
                    .foregroundColor(RMTheme.primary)
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
        }
        .background(Color(UIColor.systemBackground))
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.06), radius: 8, x: 0, y: 3)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MARK: - 3. NEWS SECTION
// ─────────────────────────────────────────────────────────────────────────────
struct HomeNewsSectionView: View {
    private let news = Array(MockNews.items.prefix(5))
    @State private var selectedNews: NewsItem? = nil

    var body: some View {
        VStack(spacing: 12) {
            HomeSectionHeader(title: "Noticias", onShowAll: {})

            VStack(spacing: 0) {
                ForEach(Array(news.enumerated()), id: \.offset) { idx, item in
                    Button { selectedNews = item } label: {
                        HomeNewsRowView(item: item)
                            .padding(.horizontal, 16)
                    }
                    .buttonStyle(.plain)

                    if idx < news.count - 1 {
                        Divider().padding(.leading, 16 + 68 + 12)
                    }
                }
            }
            .background(Color(UIColor.systemBackground))
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.06), radius: 8, x: 0, y: 3)
            .padding(.horizontal, 16)
        }
        .sheet(item: $selectedNews) { NewsDetailView(item: $0) }
    }
}

// MARK: - HomeNewsRowView
struct HomeNewsRowView: View {
    let item: NewsItem

    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                RoundedRectangle(cornerRadius: 8)
                    .fill(item.imageColor)
                    .frame(width: 68, height: 56)
                Image(systemName: item.imageName)
                    .font(.system(size: 18))
                    .foregroundColor(.white.opacity(0.35))
            }
            VStack(alignment: .leading, spacing: 3) {
                Text(item.category)
                    .font(.system(size: 9, weight: .bold))
                    .foregroundColor(RMTheme.primary)
                    .tracking(1)
                Text(item.title)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(UIColor.label))
                    .lineLimit(2)
                Text(item.date + " · " + item.author)
                    .font(.system(size: 11))
                    .foregroundColor(Color(UIColor.tertiaryLabel))
            }
            Spacer(minLength: 0)
            Image(systemName: "chevron.right")
                .font(.system(size: 11))
                .foregroundColor(Color(UIColor.quaternaryLabel))
        }
        .padding(.vertical, 12)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MARK: - 4. HIGHLIGHTS SECTION
// ─────────────────────────────────────────────────────────────────────────────
struct HomeHighlightsSectionView: View {
    @State private var selectedHighlight: HighlightItem? = nil

    var body: some View {
        VStack(spacing: 12) {
            // Custom header with NavigationLink "Ver todos"
            HStack {
                Text("Highlights")
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(UIColor.label))
                Spacer()
                NavigationLink(destination: HighlightsView()) {
                    HStack(spacing: 3) {
                        Text("Ver todos")
                            .font(.system(size: 13, weight: .medium))
                        Image(systemName: "chevron.right")
                            .font(.system(size: 11, weight: .semibold))
                    }
                    .foregroundColor(RMTheme.primary)
                }
            }
            .padding(.horizontal, 16)

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    // Show up to 6 items in the carousel (mix of categories)
                    ForEach(MockHighlights.all.prefix(6)) { item in
                        Button { selectedHighlight = item } label: {
                            HighlightCardView(item: item)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 2)
            }
        }
        .sheet(item: $selectedHighlight) { HighlightPlayerView(item: $0) }
    }
}

// MARK: - HighlightCardView
struct HighlightCardView: View {
    let item: HighlightItem

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Thumbnail
            ZStack(alignment: .bottomTrailing) {
                RoundedRectangle(cornerRadius: 12)
                    .fill(LinearGradient(
                        colors: item.thumbnailColors,
                        startPoint: .topLeading, endPoint: .bottomTrailing
                    ))
                    .frame(width: 190, height: 116)

                // Category icon watermark
                Image(systemName: item.category.icon)
                    .font(.system(size: 48, weight: .ultraLight))
                    .foregroundColor(.white.opacity(0.07))
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)
                    .padding(10)

                // Play button
                Image(systemName: "play.circle.fill")
                    .font(.system(size: 34))
                    .foregroundColor(.white.opacity(0.85))
                    .frame(maxWidth: .infinity, maxHeight: .infinity)

                // Duration badge
                Text(item.duration)
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 6).padding(.vertical, 3)
                    .background(Color.black.opacity(0.55))
                    .cornerRadius(5)
                    .padding(8)
            }
            .clipped()

            // Category + title
            VStack(alignment: .leading, spacing: 2) {
                Text(item.category.rawValue)
                    .font(.system(size: 9, weight: .bold))
                    .foregroundColor(RMTheme.primary)
                    .tracking(0.8)
                Text(item.title)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(Color(UIColor.label))
                    .lineLimit(2)
                    .frame(width: 190, alignment: .leading)

                // Team type indicator (if applicable)
                if let teamType = item.teamType {
                    Text(teamType.shortName)
                        .font(.system(size: 9))
                        .foregroundColor(teamType.badgeColor)
                }
            }
        }
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MARK: - 5. SURVEY / TRIVIA SECTION
// ─────────────────────────────────────────────────────────────────────────────
struct HomeSurveySectionView: View {
    var body: some View {
        VStack(spacing: 12) {
            HomeSectionHeader(title: "Trivia del día", showAll: false)
            SurveyCardView(survey: MockSurvey.trivia)
                .padding(.horizontal, 16)
        }
    }
}

// MARK: - SurveyCardView
struct SurveyCardView: View {
    let survey: SurveyItem
    @State private var selectedOption: Int? = nil

    var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            // Header
            HStack(spacing: 10) {
                ZStack {
                    Circle().fill(RMTheme.primary.opacity(0.12)).frame(width: 36, height: 36)
                    Image(systemName: "questionmark.circle.fill")
                        .font(.system(size: 18, weight: .bold)).foregroundColor(RMTheme.primary)
                }
                VStack(alignment: .leading, spacing: 1) {
                    Text("TRIVIA").font(.system(size: 9, weight: .bold))
                        .foregroundColor(RMTheme.primary).tracking(1)
                    Text("Demuestra tu conocimiento")
                        .font(.system(size: 12)).foregroundColor(Color(UIColor.secondaryLabel))
                }
                Spacer()
                if selectedOption != nil {
                    Text("\(survey.totalVotes.formatted()) votos")
                        .font(.system(size: 11)).foregroundColor(Color(UIColor.tertiaryLabel))
                        .transition(.opacity)
                }
            }

            Text(survey.question)
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(Color(UIColor.label)).lineSpacing(2)

            VStack(spacing: 9) {
                ForEach(Array(survey.options.enumerated()), id: \.offset) { idx, option in
                    if let selected = selectedOption {
                        SurveyResultRow(option: option, totalVotes: survey.totalVotes,
                                        isSelected: selected == idx,
                                        isCorrect: idx == survey.correctIndex)
                            .transition(.opacity.combined(with: .scale(scale: 0.97)))
                    } else {
                        Button {
                            withAnimation(.easeInOut(duration: 0.30)) { selectedOption = idx }
                        } label: {
                            Text(option.text)
                                .font(.system(size: 15, weight: .medium))
                                .foregroundColor(Color(UIColor.label))
                                .frame(maxWidth: .infinity).frame(height: 46)
                                .background(Color(UIColor.secondarySystemBackground))
                                .cornerRadius(10)
                                .overlay(RoundedRectangle(cornerRadius: 10)
                                    .stroke(Color(UIColor.separator), lineWidth: 0.5))
                        }
                    }
                }
            }

            if let selected = selectedOption {
                HStack(spacing: 6) {
                    Image(systemName: selected == survey.correctIndex
                          ? "checkmark.circle.fill" : "lightbulb.fill")
                        .font(.system(size: 13))
                        .foregroundColor(selected == survey.correctIndex
                                         ? Color(red: 0.15, green: 0.72, blue: 0.40)
                                         : Color(red: 0.95, green: 0.65, blue: 0.10))
                    Text(selected == survey.correctIndex
                         ? "¡Correcto! La respuesta es \(survey.options[survey.correctIndex].text)."
                         : "La respuesta correcta es \(survey.options[survey.correctIndex].text).")
                        .font(.system(size: 13, weight: .medium))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                }
                .transition(.move(edge: .bottom).combined(with: .opacity))
            }
        }
        .padding(18)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(18)
        .shadow(color: .black.opacity(0.07), radius: 10, x: 0, y: 3)
    }
}

// MARK: - SurveyResultRow
struct SurveyResultRow: View {
    let option: SurveyOption
    let totalVotes: Int
    let isSelected: Bool
    let isCorrect: Bool

    private var fraction: CGFloat {
        totalVotes > 0 ? CGFloat(option.votes) / CGFloat(totalVotes) : 0
    }
    private var fillColor: Color {
        isCorrect ? Color(red: 0.15, green: 0.72, blue: 0.40)
            : isSelected ? RMTheme.primary
            : Color(UIColor.tertiarySystemFill)
    }

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                RoundedRectangle(cornerRadius: 10)
                    .fill(Color(UIColor.secondarySystemBackground)).frame(height: 46)
                RoundedRectangle(cornerRadius: 10)
                    .fill(fillColor.opacity(isCorrect || isSelected ? 0.22 : 0.10))
                    .frame(width: max(0, geo.size.width * fraction), height: 46)
                HStack {
                    HStack(spacing: 7) {
                        if isCorrect {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 13))
                                .foregroundColor(Color(red: 0.15, green: 0.72, blue: 0.40))
                        } else if isSelected {
                            Image(systemName: "circle.fill")
                                .font(.system(size: 8)).foregroundColor(RMTheme.primary)
                        }
                        Text(option.text)
                            .font(.system(size: 14, weight: isCorrect || isSelected ? .semibold : .regular))
                            .foregroundColor(Color(UIColor.label))
                    }
                    .padding(.leading, 12)
                    Spacer()
                    Text("\(Int(fraction * 100))%")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                        .padding(.trailing, 12)
                }
            }
            .cornerRadius(10)
            .overlay(RoundedRectangle(cornerRadius: 10)
                .stroke(isCorrect ? Color(red: 0.15, green: 0.72, blue: 0.40).opacity(0.45)
                        : isSelected ? RMTheme.primary.opacity(0.30)
                        : Color(UIColor.separator).opacity(0.4), lineWidth: 0.8))
        }
        .frame(height: 46)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MARK: - Previews
// ─────────────────────────────────────────────────────────────────────────────
#Preview("HOY Screen") { HomeView(showSideMenu: .constant(false)) }

#Preview("TeamNextMatchCard – Football") {
    ZStack {
        Color(UIColor.systemGroupedBackground).ignoresSafeArea()
        TeamNextMatchCard(match: MockDataProvider.followedTeams[0].nextMatch!,
                          teamType: .mensFootball)
            .padding(16)
    }
}

#Preview("MatchSummaryCardView") {
    ZStack {
        Color(UIColor.systemGroupedBackground).ignoresSafeArea()
        MatchSummaryCardView(match: MockDataProvider.followedTeams[0].lastMatch!,
                             teamType: .mensFootball)
            .padding(16)
    }
}

#Preview("HighlightCardView") {
    HighlightCardView(item: MockHighlights.all[0]).padding(16)
}

#Preview("SurveyCardView") {
    ZStack {
        Color(UIColor.systemGroupedBackground).ignoresSafeArea()
        SurveyCardView(survey: MockSurvey.trivia).padding(16)
    }
}
