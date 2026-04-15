import SwiftUI

// MARK: - Scroll offset preference key
private struct ScrollAnchorKey: PreferenceKey {
    static var defaultValue: CGFloat = .zero
    static func reduce(value: inout CGFloat, nextValue: () -> CGFloat) { value = nextValue() }
}

// MARK: - HomeView
struct HomeView: View {
    @Binding var showSideMenu: Bool
    @State private var selectedHomeTab: Int = 0
    @State private var heroIndex: Int = 0
    @State private var selectedMatchIndex: Int = 0

    // 0 = fully expanded  /  1 = fully collapsed
    @State private var collapseProgress: CGFloat = 0
    @State private var anchorY: CGFloat? = nil
    @State private var expandedExtraHeight: CGFloat = 210

    private var currentMatch: MatchHeaderData {
        MockHeaderMatches.all[selectedMatchIndex]
    }

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // ── Morphing top row ─────────────────────────────────
                HomeTopRow(
                    progress: collapseProgress,
                    showSideMenu: $showSideMenu,
                    selectedMatchIndex: selectedMatchIndex,
                    totalMatches: MockHeaderMatches.all.count,
                    selectedMatch: currentMatch
                )

                // ── Scrollable area ──────────────────────────────────
                ScrollView(showsIndicators: false) {
                    LazyVStack(spacing: 0, pinnedViews: [.sectionHeaders]) {

                        // Section 1: match carousel — scrolls away naturally
                        Section {
                            ExpandedMatchExtra(selectedIndex: $selectedMatchIndex)
                                .background(
                                    GeometryReader { geo in
                                        Color.clear
                                            .onAppear { expandedExtraHeight = geo.size.height }
                                    }
                                )
                                .overlay(alignment: .top) {
                                    Color.clear
                                        .frame(height: 1)
                                        .background(
                                            GeometryReader { geo in
                                                Color.clear.preference(
                                                    key: ScrollAnchorKey.self,
                                                    value: geo.frame(in: .global).minY
                                                )
                                            }
                                        )
                                }
                        }

                        // Section 2: sticky segment bar + content
                        Section(header: HomeSegmentBarHeader(selected: $selectedHomeTab)) {
                            switch selectedHomeTab {
                            case 1:
                                ResumenContent(match: currentMatch)
                            case 2:
                                EstadisticasContent(match: currentMatch)
                            case 3:
                                JornadaContent()
                            default:
                                DirectoContent(heroIndex: $heroIndex)
                            }
                        }
                    }
                }
                .onPreferenceChange(ScrollAnchorKey.self) { globalY in
                    DispatchQueue.main.async {
                        if anchorY == nil, globalY > 20 { anchorY = globalY }
                        guard let anchor = anchorY else { return }
                        let raw = (anchor - globalY) / max(1, expandedExtraHeight)
                        collapseProgress = min(1, max(0, raw))
                    }
                }
                .background(Color(UIColor.systemBackground))
            }
            .ignoresSafeArea(edges: .top)
            .navigationBarHidden(true)
        }
    }
}

// MARK: - Morphing Top Row
struct HomeTopRow: View {
    let progress: CGFloat
    @Binding var showSideMenu: Bool
    let selectedMatchIndex: Int
    let totalMatches: Int
    let selectedMatch: MatchHeaderData

    private func fade(from: CGFloat, to: CGFloat, _ p: CGFloat) -> CGFloat {
        let t = min(1, max(0, (p - from) / (to - from)))
        return 1 - t
    }
    private func appear(from: CGFloat, to: CGFloat, _ p: CGFloat) -> CGFloat {
        let t = min(1, max(0, (p - from) / (to - from)))
        return t
    }

    var body: some View {
        ZStack {
            Color(red: 0.11, green: 0.12, blue: 0.22).ignoresSafeArea(edges: .top)

            VStack(spacing: 0) {
                Color.clear.frame(height: 52)   // status bar space

                HStack(alignment: .center, spacing: 0) {

                    // ── Left: person icon + fading "Tu área" label ────
                    Button { showSideMenu = true } label: {
                        VStack(spacing: 2) {
                            Image(systemName: "person.circle")
                                .font(.system(size: 21))
                                .foregroundColor(.white.opacity(0.82))
                            Text("Tu área")
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(.white.opacity(0.55))
                                .opacity(fade(from: 0, to: 0.6, progress))
                                .frame(height: 14 * fade(from: 0, to: 0.6, progress))
                                .clipped()
                        }
                    }
                    .frame(width: 52)

                    Spacer()

                    // ── Center: dots (expanded) ↔ crests+date (collapsed) ──
                    ZStack {
                        // Pagination dots — fade out in first half
                        HStack(spacing: 5) {
                            ForEach(0..<totalMatches, id: \.self) { i in
                                Capsule()
                                    .fill(i == selectedMatchIndex
                                          ? Color.white
                                          : Color.white.opacity(0.30))
                                    .frame(width: i == selectedMatchIndex ? 18 : 6, height: 6)
                            }
                        }
                        .opacity(fade(from: 0, to: 0.55, progress))

                        // Crests + date — appear in second half
                        HStack(spacing: 10) {
                            SmallCrestBadge(
                                color: selectedMatch.homeTeamColor,
                                symbol: selectedMatch.homeTeamSymbol
                            )
                            Text(selectedMatch.dateString)
                                .font(.system(size: 13, weight: .semibold))
                                .foregroundColor(.white)
                                .lineLimit(1)
                            SmallCrestBadge(
                                color: selectedMatch.awayTeamColor,
                                symbol: selectedMatch.awayTeamSymbol
                            )
                        }
                        .opacity(appear(from: 0.45, to: 1.0, progress))
                    }

                    Spacer()

                    // ── Right: radio icon + fading "Radio" label ──────
                    Button {} label: {
                        VStack(spacing: 2) {
                            Image(systemName: "antenna.radiowaves.left.and.right")
                                .font(.system(size: 19))
                                .foregroundColor(.white.opacity(0.82))
                            Text("Radio")
                                .font(.system(size: 10, weight: .medium))
                                .foregroundColor(.white.opacity(0.55))
                                .opacity(fade(from: 0, to: 0.6, progress))
                                .frame(height: 14 * fade(from: 0, to: 0.6, progress))
                                .clipped()
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

private struct SmallCrestBadge: View {
    let color: Color
    let symbol: String
    var body: some View {
        ZStack {
            Circle().fill(color.opacity(0.20)).frame(width: 28, height: 28)
            Circle().stroke(color.opacity(0.40), lineWidth: 1).frame(width: 28, height: 28)
            Image(systemName: symbol).font(.system(size: 11, weight: .bold)).foregroundColor(color)
        }
    }
}

// MARK: - Expanded Match Carousel (scrolls away naturally)
struct ExpandedMatchExtra: View {
    @Binding var selectedIndex: Int

    var body: some View {
        TabView(selection: $selectedIndex) {
            ForEach(MockHeaderMatches.all.indices, id: \.self) { i in
                MatchCarouselCard(match: MockHeaderMatches.all[i])
                    .tag(i)
            }
        }
        .tabViewStyle(.page(indexDisplayMode: .never))
        .frame(height: 210)
        .background(Color(red: 0.11, green: 0.12, blue: 0.22))
    }
}

// MARK: - Match Carousel Card
struct MatchCarouselCard: View {
    let match: MatchHeaderData

    var body: some View {
        VStack(spacing: 0) {
            // Competition badge
            Text(match.competition)
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(.white.opacity(0.80))
                .tracking(1.2)
                .padding(.horizontal, 14)
                .padding(.vertical, 5)
                .background(Color.white.opacity(0.12))
                .cornerRadius(20)
                .padding(.top, 10)
                .padding(.bottom, 12)

            // Teams row
            HStack(alignment: .center, spacing: 0) {
                // Home team
                VStack(spacing: 6) {
                    MatchCrestView(color: match.homeTeamColor, symbol: match.homeTeamSymbol, size: 52)
                    Text(match.homeTeam)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.white.opacity(0.80))
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                }
                .frame(maxWidth: .infinity)

                // Center: score (finished/live) or date+cal (upcoming)
                if match.status == .upcoming {
                    VStack(spacing: 8) {
                        Text(match.dateString)
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(.white)
                        Button {} label: {
                            ZStack {
                                RoundedRectangle(cornerRadius: 10)
                                    .stroke(Color.white.opacity(0.30), lineWidth: 1)
                                    .frame(width: 42, height: 36)
                                Image(systemName: "calendar.badge.plus")
                                    .font(.system(size: 17))
                                    .foregroundColor(.white.opacity(0.75))
                            }
                        }
                    }
                } else {
                    VStack(spacing: 2) {
                        HStack(spacing: 10) {
                            Text("\(match.homeScore ?? 0)")
                                .font(.system(size: 36, weight: .bold))
                                .foregroundColor(.white)
                            Text("-")
                                .font(.system(size: 22, weight: .regular))
                                .foregroundColor(.white.opacity(0.55))
                            Text("\(match.awayScore ?? 0)")
                                .font(.system(size: 36, weight: .bold))
                                .foregroundColor(.white)
                        }
                        Text(match.status == .live ? "EN VIVO" : "FIN")
                            .font(.system(size: 9, weight: .bold))
                            .foregroundColor(match.status == .live
                                             ? Color(red: 0.20, green: 0.85, blue: 0.45)
                                             : Color.white.opacity(0.40))
                            .tracking(1.0)
                    }
                }

                // Away team
                VStack(spacing: 6) {
                    MatchCrestView(color: match.awayTeamColor, symbol: match.awayTeamSymbol, size: 52)
                    Text(match.awayTeam)
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(.white.opacity(0.80))
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                }
                .frame(maxWidth: .infinity)
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 10)

            // Venue / round info
            Text(match.matchInfo)
                .font(.system(size: 11))
                .foregroundColor(.white.opacity(0.40))
                .multilineTextAlignment(.center)
                .lineLimit(2)
                .padding(.bottom, 12)
        }
        .frame(maxWidth: .infinity)
    }
}

// MARK: - Sticky Segment Bar (4 tabs)
struct HomeSegmentBarHeader: View {
    @Binding var selected: Int
    let tabs = ["Directo", "Resumen", "Estadísticas", "Jornada"]

    var body: some View {
        ZStack(alignment: .bottom) {
            Color(red: 0.11, green: 0.12, blue: 0.22)

            HStack(spacing: 0) {
                ForEach(tabs.indices, id: \.self) { i in
                    Button {
                        withAnimation(.easeInOut(duration: 0.18)) { selected = i }
                    } label: {
                        VStack(spacing: 0) {
                            Text(tabs[i])
                                .font(.system(size: 13, weight: selected == i ? .semibold : .regular))
                                .foregroundColor(selected == i ? .white : .white.opacity(0.45))
                                .frame(height: 40)
                            Rectangle()
                                .fill(selected == i ? RMTheme.primary : Color.clear)
                                .frame(height: 3)
                                .cornerRadius(1.5)
                        }
                    }
                    .frame(maxWidth: .infinity)
                }
            }
        }
        .frame(height: 46)
    }
}

// MARK: - Match Crest View (shared)
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

// MARK: - Directo Content (news hero carousel)
struct DirectoContent: View {
    @Binding var heroIndex: Int

    let heroItems: [(title: String, color: Color)] = [
        ("Bellingham",   Color(red: 0.09, green: 0.14, blue: 0.30)),
        ("Vinicius Jr.", Color(red: 0.20, green: 0.08, blue: 0.28)),
        ("Ancelotti",    Color(red: 0.07, green: 0.16, blue: 0.22)),
        ("Mbappé",       Color(red: 0.16, green: 0.08, blue: 0.28)),
        ("Champions",    Color(red: 0.10, green: 0.10, blue: 0.32))
    ]

    var body: some View {
        VStack(spacing: 0) {
            TabView(selection: $heroIndex) {
                ForEach(heroItems.indices, id: \.self) { i in
                    HeroCard(title: heroItems[i].title, color: heroItems[i].color,
                             index: i, total: heroItems.count)
                        .padding(.horizontal, 14)
                        .tag(i)
                }
            }
            .tabViewStyle(.page(indexDisplayMode: .never))
            .frame(height: 330)
            .padding(.top, 10)

            HStack(spacing: 0) {
                Button { withAnimation { heroIndex = max(0, heroIndex - 1) } } label: {
                    Image(systemName: "chevron.left")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.gray)
                        .frame(width: 44, height: 44)
                }
                Spacer()
                HStack(spacing: 7) {
                    ForEach(heroItems.indices, id: \.self) { i in
                        Circle()
                            .fill(i == heroIndex ? RMTheme.primary : Color(UIColor.tertiaryLabel))
                            .frame(width: i == heroIndex ? 8 : 6, height: i == heroIndex ? 8 : 6)
                    }
                }
                Spacer()
                Button { withAnimation { heroIndex = min(heroItems.count - 1, heroIndex + 1) } } label: {
                    Image(systemName: "chevron.right")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.gray)
                        .frame(width: 44, height: 44)
                }
            }
            .padding(.horizontal, 4)
            .padding(.bottom, 6)

            HomePromoCard()
                .padding(.horizontal, 14)
                .padding(.bottom, 20)
        }
    }
}

// MARK: - Resumen Content
struct ResumenContent: View {
    let match: MatchHeaderData

    var body: some View {
        VStack(spacing: 0) {
            if match.status == .upcoming {
                VStack(spacing: 16) {
                    Image(systemName: "clock.fill")
                        .font(.system(size: 40))
                        .foregroundColor(RMTheme.primary.opacity(0.55))
                    Text("El resumen estará disponible\ntras el partido")
                        .font(.system(size: 15))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 60)
                .padding(.bottom, 40)
            } else {
                // Video player card
                ZStack(alignment: .topTrailing) {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(LinearGradient(
                            colors: [
                                Color(red: 0.08, green: 0.10, blue: 0.32),
                                Color(red: 0.18, green: 0.15, blue: 0.44)
                            ],
                            startPoint: .topLeading, endPoint: .bottomTrailing
                        ))
                        .frame(height: 210)

                    VStack {
                        Spacer()
                        Image(systemName: "play.circle.fill")
                            .font(.system(size: 58))
                            .foregroundColor(.white.opacity(0.90))
                        Text("Ver resumen completo")
                            .font(.system(size: 14, weight: .medium))
                            .foregroundColor(.white.opacity(0.75))
                            .padding(.bottom, 28)
                        Spacer()
                    }
                    .frame(maxWidth: .infinity)

                    Text("4:32")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 8).padding(.vertical, 4)
                        .background(Color.black.opacity(0.50))
                        .cornerRadius(6)
                        .padding(12)
                }
                .padding(.horizontal, 14)
                .padding(.top, 14)

                // Goals section
                if !match.homeScorers.isEmpty || !match.awayScorers.isEmpty {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Goles del partido")
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(Color(UIColor.label))
                            .padding(.horizontal, 16)

                        if !match.homeScorers.isEmpty {
                            GoalRow(
                                team: match.homeTeam,
                                scorers: match.homeScorers,
                                color: match.homeTeamColor,
                                symbol: match.homeTeamSymbol
                            )
                            .padding(.horizontal, 16)
                        }
                        if !match.awayScorers.isEmpty {
                            GoalRow(
                                team: match.awayTeam,
                                scorers: match.awayScorers,
                                color: match.awayTeamColor,
                                symbol: match.awayTeamSymbol
                            )
                            .padding(.horizontal, 16)
                        }
                    }
                    .padding(.top, 22)
                }

                // Key moments
                VStack(alignment: .leading, spacing: 10) {
                    Text("Momentos clave")
                        .font(.system(size: 17, weight: .bold))
                        .foregroundColor(Color(UIColor.label))
                        .padding(.horizontal, 16)

                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 10) {
                            ForEach(["Gol · min 12", "Parada · min 34", "Gol · min 61", "Tarjeta · min 78", "Gol · min 89"],
                                    id: \.self) { moment in
                                HighlightMomentCard(label: moment)
                            }
                        }
                        .padding(.horizontal, 16)
                    }
                }
                .padding(.top, 22)
                .padding(.bottom, 30)
            }
        }
    }
}

struct GoalRow: View {
    let team: String
    let scorers: String
    let color: Color
    let symbol: String

    var body: some View {
        HStack(spacing: 12) {
            ZStack {
                Circle().fill(color.opacity(0.15)).frame(width: 36, height: 36)
                Image(systemName: symbol)
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(color)
            }
            VStack(alignment: .leading, spacing: 2) {
                Text(team)
                    .font(.system(size: 11, weight: .semibold))
                    .foregroundColor(Color(UIColor.secondaryLabel))
                Text(scorers)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(UIColor.label))
            }
            Spacer()
        }
        .padding(12)
        .background(Color(UIColor.secondarySystemBackground))
        .cornerRadius(12)
    }
}

struct HighlightMomentCard: View {
    let label: String
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 12)
                .fill(Color(UIColor.secondarySystemBackground))
                .frame(width: 110, height: 82)
            VStack(spacing: 8) {
                Image(systemName: "play.fill")
                    .font(.system(size: 20))
                    .foregroundColor(RMTheme.primary)
                Text(label)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(Color(UIColor.label))
                    .multilineTextAlignment(.center)
            }
        }
    }
}

// MARK: - Estadísticas Content
struct EstadisticasContent: View {
    let match: MatchHeaderData
    @State private var selectedStatTab: Int = 0
    let statTabs = ["General", "Distribución", "Ataque", "Defensa"]

    var body: some View {
        VStack(spacing: 0) {
            if match.stats.isEmpty {
                VStack(spacing: 16) {
                    Image(systemName: "chart.bar.fill")
                        .font(.system(size: 40))
                        .foregroundColor(RMTheme.primary.opacity(0.55))
                    Text("Las estadísticas estarán\ndisponibles tras el partido")
                        .font(.system(size: 15))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                        .multilineTextAlignment(.center)
                }
                .frame(maxWidth: .infinity)
                .padding(.top, 60)
                .padding(.bottom, 40)
            } else {
                // Sub-tab bar
                ZStack(alignment: .bottom) {
                    Color(UIColor.systemBackground)
                    HStack(spacing: 0) {
                        ForEach(statTabs.indices, id: \.self) { i in
                            Button {
                                withAnimation(.easeInOut(duration: 0.15)) { selectedStatTab = i }
                            } label: {
                                VStack(spacing: 0) {
                                    Text(statTabs[i])
                                        .font(.system(size: 13, weight: selectedStatTab == i ? .semibold : .regular))
                                        .foregroundColor(selectedStatTab == i
                                                         ? Color(UIColor.label)
                                                         : Color(UIColor.tertiaryLabel))
                                        .frame(height: 38)
                                    Rectangle()
                                        .fill(selectedStatTab == i ? RMTheme.primary : Color.clear)
                                        .frame(height: 2)
                                }
                            }
                            .frame(maxWidth: .infinity)
                        }
                    }
                }
                .frame(height: 42)

                // Team crest header
                HStack {
                    HStack(spacing: 6) {
                        MatchCrestView(color: match.homeTeamColor, symbol: match.homeTeamSymbol, size: 22)
                        Text(match.homeTeam)
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(Color(UIColor.secondaryLabel))
                            .lineLimit(1)
                    }
                    Spacer()
                    HStack(spacing: 6) {
                        Text(match.awayTeam)
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(Color(UIColor.secondaryLabel))
                            .lineLimit(1)
                        MatchCrestView(color: match.awayTeamColor, symbol: match.awayTeamSymbol, size: 22)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 14)
                .padding(.bottom, 6)

                // Stats rows
                VStack(spacing: 0) {
                    ForEach(match.stats) { stat in
                        StatRow(
                            stat: stat,
                            homeColor: match.homeTeamColor,
                            awayColor: match.awayTeamColor
                        )
                        .padding(.horizontal, 16)
                        Divider()
                            .padding(.horizontal, 16)
                    }
                }
                .padding(.bottom, 24)
            }
        }
    }
}

struct StatRow: View {
    let stat: MatchStat
    let homeColor: Color
    let awayColor: Color

    var body: some View {
        VStack(spacing: 7) {
            HStack {
                Text(stat.isPercent ? "\(Int(stat.home))%" : formatVal(stat.home))
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(Color(UIColor.label))
                Spacer()
                Text(stat.label)
                    .font(.system(size: 12))
                    .foregroundColor(Color(UIColor.secondaryLabel))
                Spacer()
                Text(stat.isPercent ? "\(Int(stat.away))%" : formatVal(stat.away))
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(Color(UIColor.label))
            }

            GeometryReader { geo in
                let total = stat.home + stat.away
                let homeFrac = total > 0 ? stat.home / total : 0.5
                let w = geo.size.width
                HStack(spacing: 2) {
                    RoundedRectangle(cornerRadius: 2)
                        .fill(homeColor.opacity(0.75))
                        .frame(width: max(2, w * homeFrac - 1), height: 5)
                    RoundedRectangle(cornerRadius: 2)
                        .fill(awayColor.opacity(0.75))
                        .frame(width: max(2, w * (1 - homeFrac) - 1), height: 5)
                }
            }
            .frame(height: 5)
        }
        .padding(.vertical, 10)
    }

    private func formatVal(_ v: Double) -> String {
        v.truncatingRemainder(dividingBy: 1) == 0 ? "\(Int(v))" : String(format: "%.1f", v)
    }
}

// MARK: - Hero Card
struct HeroCard: View {
    let title: String
    let color: Color
    let index: Int
    let total: Int

    var body: some View {
        ZStack(alignment: .bottom) {
            RoundedRectangle(cornerRadius: 16)
                .fill(LinearGradient(
                    colors: [color, color.opacity(0.70)],
                    startPoint: .topLeading, endPoint: .bottomTrailing
                ))
                .overlay(
                    Image(systemName: "figure.run")
                        .font(.system(size: 130, weight: .ultraLight))
                        .foregroundColor(.white.opacity(0.09))
                        .frame(maxWidth: .infinity, maxHeight: .infinity)
                        .offset(x: 30, y: -10)
                        .clipped()
                )

            LinearGradient(colors: [.clear, .black.opacity(0.55)],
                           startPoint: .top, endPoint: .bottom)
                .frame(height: 90)
                .overlay(
                    HStack {
                        Text(title)
                            .font(.system(size: 22, weight: .bold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 16)
                            .padding(.bottom, 14)
                        Spacer()
                    }, alignment: .bottomLeading
                )

            VStack {
                HStack {
                    Spacer()
                    Text("\(index + 1)/\(total)")
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 9).padding(.vertical, 4)
                        .background(Color.black.opacity(0.40))
                        .cornerRadius(8)
                        .padding(12)
                }
                Spacer()
            }
        }
        .cornerRadius(16)
        .shadow(color: .black.opacity(0.15), radius: 10, x: 0, y: 4)
    }
}

// MARK: - Home Promo Card
struct HomePromoCard: View {
    var body: some View {
        VStack(spacing: 0) {
            Text("15% de DTO. en todas las equipaciones")
                .font(.system(size: 21, weight: .bold))
                .foregroundColor(Color(UIColor.label))
                .multilineTextAlignment(.center)
                .padding(.horizontal, 20)
                .padding(.top, 22)

            ZStack {
                RoundedRectangle(cornerRadius: 14)
                    .fill(LinearGradient(
                        colors: [Color(red: 0.12, green: 0.14, blue: 0.52),
                                 Color(red: 0.20, green: 0.22, blue: 0.68)],
                        startPoint: .topLeading, endPoint: .bottomTrailing
                    ))
                    .frame(height: 158)
                HStack(spacing: -8) {
                    JerseyIcon(color: Color(red: 0.12, green: 0.12, blue: 0.18), rotation: -8)
                    JerseyIcon(color: .white, rotation: 0).offset(y: -6)
                    JerseyIcon(color: Color(red: 0.10, green: 0.28, blue: 0.72), rotation: 8)
                }
            }
            .padding(.horizontal, 20)
            .padding(.top, 18)

            NavigationLink(destination: StoreView()) {
                HStack(spacing: 8) {
                    Text("Comprar")
                        .font(.system(size: 16, weight: .semibold))
                        .foregroundColor(.white)
                    Image(systemName: "arrow.up.right.square")
                        .font(.system(size: 14, weight: .semibold))
                        .foregroundColor(.white.opacity(0.85))
                }
                .frame(maxWidth: .infinity).frame(height: 50)
                .background(RMTheme.primaryGradient)
                .cornerRadius(12)
                .padding(.horizontal, 20)
                .padding(.top, 16).padding(.bottom, 20)
            }
        }
        .background(Color(UIColor.systemBackground))
        .cornerRadius(18)
        .shadow(color: .black.opacity(0.07), radius: 12, x: 0, y: 3)
        .overlay(RoundedRectangle(cornerRadius: 18)
            .stroke(Color(UIColor.separator).opacity(0.6), lineWidth: 0.5))
    }
}

struct JerseyIcon: View {
    let color: Color
    let rotation: Double
    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 8).fill(color)
                .frame(width: 70, height: 84)
                .shadow(color: .black.opacity(0.25), radius: 6, x: 0, y: 3)
            Image(systemName: "tshirt.fill").font(.system(size: 36))
                .foregroundColor(color == .white
                    ? Color(red: 0.15, green: 0.18, blue: 0.55) : .white.opacity(0.85))
        }
        .rotationEffect(.degrees(rotation))
    }
}

// MARK: - Jornada Content
struct JornadaContent: View {
    var body: some View {
        VStack(spacing: 20) {
            ForEach(["J31 · LaLiga EA Sports", "J32 · LaLiga EA Sports", "J33 · LaLiga EA Sports"],
                    id: \.self) { round in
                VStack(alignment: .leading, spacing: 10) {
                    Text(round)
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                        .padding(.horizontal, 16)
                    ScrollView(.horizontal, showsIndicators: false) {
                        HStack(spacing: 10) {
                            ForEach(0..<3) { _ in JornadaMatchCard() }
                        }.padding(.horizontal, 16)
                    }
                }
            }
            Color.clear.frame(height: 10)
        }
        .padding(.top, 16)
    }
}

struct JornadaMatchCard: View {
    var body: some View {
        VStack(spacing: 10) {
            HStack(spacing: 14) {
                MatchCrestView(color: .red, symbol: "shield.fill", size: 38)
                VStack(spacing: 2) {
                    Text("2 - 1").font(.system(size: 20, weight: .bold))
                    Text("FIN").font(.system(size: 10, weight: .semibold))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                }
                MatchCrestView(color: RMTheme.primary, symbol: "crown.fill", size: 38)
            }
            Text("21:00 · Bernabéu").font(.system(size: 11))
                .foregroundColor(Color(UIColor.secondaryLabel))
        }
        .padding(.horizontal, 14).padding(.vertical, 12)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(14)
        .shadow(color: .black.opacity(0.06), radius: 6, x: 0, y: 2)
        .overlay(RoundedRectangle(cornerRadius: 14)
            .stroke(Color(UIColor.separator).opacity(0.6), lineWidth: 0.5))
    }
}

#Preview {
    HomeView(showSideMenu: .constant(false))
}
