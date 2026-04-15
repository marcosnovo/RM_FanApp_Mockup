import SwiftUI

// MARK: - MatchCentreView
struct MatchCentreView: View {
    let match: MatchHeaderData
    @State private var selectedTab: Int = 0
    @Environment(\.dismiss) private var dismiss

    private let tabs = ["Resumen", "Estadísticas", "Jornada"]

    var body: some View {
        VStack(spacing: 0) {
            // Dark match header (status bar + back + match info)
            MatchCentreHeader(match: match, onBack: { dismiss() })

            // Segment bar
            MatchCentreSegmentBar(tabs: tabs, selected: $selectedTab)

            // Tab content
            ScrollView(showsIndicators: false) {
                switch selectedTab {
                case 1:  EstadisticasContent(match: match)
                case 2:  JornadaContent()
                default: ResumenContent(match: match)
                }
            }
            .background(Color(UIColor.systemBackground))
        }
        .ignoresSafeArea(edges: .top)
        .navigationBarHidden(true)
    }
}

// MARK: - MatchCentreHeader
private struct MatchCentreHeader: View {
    let match: MatchHeaderData
    let onBack: () -> Void

    var body: some View {
        ZStack {
            Color(red: 0.11, green: 0.12, blue: 0.22).ignoresSafeArea(edges: .top)

            VStack(spacing: 0) {
                // Status bar space + back button
                HStack {
                    Button(action: onBack) {
                        HStack(spacing: 4) {
                            Image(systemName: "chevron.left")
                                .font(.system(size: 13, weight: .bold))
                            Text("Hoy")
                                .font(.system(size: 15))
                        }
                        .foregroundColor(.white.opacity(0.70))
                    }
                    Spacer()
                }
                .padding(.horizontal, 16)
                .padding(.top, 58)
                .padding(.bottom, 12)

                // Competition badge
                Text(match.competition)
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(.white.opacity(0.60))
                    .tracking(1.2)
                    .padding(.bottom, 12)

                // Teams row
                HStack(alignment: .center, spacing: 0) {
                    // Home team
                    VStack(spacing: 6) {
                        MatchCrestView(color: match.homeTeamColor,
                                       symbol: match.homeTeamSymbol, size: 56)
                        Text(match.homeTeam)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.white.opacity(0.80))
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                            .frame(maxWidth: 110)
                    }
                    .frame(maxWidth: .infinity)

                    // Center: score or date
                    Group {
                        if match.status == .upcoming {
                            VStack(spacing: 6) {
                                Text(match.dateString)
                                    .font(.system(size: 13, weight: .semibold))
                                    .foregroundColor(.white)
                                    .multilineTextAlignment(.center)
                                Button {} label: {
                                    ZStack {
                                        RoundedRectangle(cornerRadius: 10)
                                            .stroke(Color.white.opacity(0.25), lineWidth: 1)
                                            .frame(width: 40, height: 34)
                                        Image(systemName: "calendar.badge.plus")
                                            .font(.system(size: 16))
                                            .foregroundColor(.white.opacity(0.65))
                                    }
                                }
                            }
                        } else {
                            VStack(spacing: 3) {
                                HStack(spacing: 10) {
                                    Text("\(match.homeScore ?? 0)")
                                        .font(.system(size: 40, weight: .bold))
                                        .foregroundColor(.white)
                                    Text("-")
                                        .font(.system(size: 24))
                                        .foregroundColor(.white.opacity(0.45))
                                    Text("\(match.awayScore ?? 0)")
                                        .font(.system(size: 40, weight: .bold))
                                        .foregroundColor(.white)
                                }
                                Text(match.status == .live ? "EN VIVO" : "FIN")
                                    .font(.system(size: 9, weight: .bold))
                                    .foregroundColor(match.status == .live
                                                     ? Color(red: 0.20, green: 0.85, blue: 0.45)
                                                     : .white.opacity(0.38))
                                    .tracking(1)
                            }
                        }
                    }

                    // Away team
                    VStack(spacing: 6) {
                        MatchCrestView(color: match.awayTeamColor,
                                       symbol: match.awayTeamSymbol, size: 56)
                        Text(match.awayTeam)
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(.white.opacity(0.80))
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                            .frame(maxWidth: 110)
                    }
                    .frame(maxWidth: .infinity)
                }
                .padding(.horizontal, 16)
                .padding(.bottom, 10)

                // Venue
                let venue = match.matchInfo.components(separatedBy: "\n").last ?? ""
                Text(venue)
                    .font(.system(size: 11))
                    .foregroundColor(.white.opacity(0.38))
                    .padding(.bottom, 14)
            }
        }
    }
}

// MARK: - MatchCentreSegmentBar
private struct MatchCentreSegmentBar: View {
    let tabs: [String]
    @Binding var selected: Int

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
                                .font(.system(size: 14, weight: selected == i ? .semibold : .regular))
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

// ─────────────────────────────────────────────────────────────────────────────
// MARK: - Resumen Content
// ─────────────────────────────────────────────────────────────────────────────
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
                // Simulated video player
                ZStack(alignment: .topTrailing) {
                    RoundedRectangle(cornerRadius: 16)
                        .fill(LinearGradient(
                            colors: [Color(red: 0.08, green: 0.10, blue: 0.32),
                                     Color(red: 0.18, green: 0.15, blue: 0.44)],
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
                            .foregroundColor(.white.opacity(0.70))
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

                // Goals
                if !match.homeScorers.isEmpty || !match.awayScorers.isEmpty {
                    VStack(alignment: .leading, spacing: 10) {
                        Text("Goles del partido")
                            .font(.system(size: 17, weight: .bold))
                            .foregroundColor(Color(UIColor.label))
                            .padding(.horizontal, 16)

                        if !match.homeScorers.isEmpty {
                            GoalRow(team: match.homeTeam, scorers: match.homeScorers,
                                    color: match.homeTeamColor, symbol: match.homeTeamSymbol)
                                .padding(.horizontal, 16)
                        }
                        if !match.awayScorers.isEmpty {
                            GoalRow(team: match.awayTeam, scorers: match.awayScorers,
                                    color: match.awayTeamColor, symbol: match.awayTeamSymbol)
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
                            ForEach(["Gol · min 12", "Parada · min 34",
                                     "Gol · min 61", "Tarjeta · min 78", "Gol · min 89"],
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

// ─────────────────────────────────────────────────────────────────────────────
// MARK: - Estadísticas Content
// ─────────────────────────────────────────────────────────────────────────────
struct EstadisticasContent: View {
    let match: MatchHeaderData
    @State private var selectedStatTab: Int = 0
    private let statTabs = ["General", "Distribución", "Ataque", "Defensa"]

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

                // Team header row
                HStack {
                    HStack(spacing: 6) {
                        MatchCrestView(color: match.homeTeamColor,
                                       symbol: match.homeTeamSymbol, size: 22)
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
                        MatchCrestView(color: match.awayTeamColor,
                                       symbol: match.awayTeamSymbol, size: 22)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.top, 14)
                .padding(.bottom, 6)

                // Stat rows
                VStack(spacing: 0) {
                    ForEach(match.stats) { stat in
                        StatRow(stat: stat,
                                homeColor: match.homeTeamColor,
                                awayColor: match.awayTeamColor)
                            .padding(.horizontal, 16)
                        Divider().padding(.horizontal, 16)
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

// ─────────────────────────────────────────────────────────────────────────────
// MARK: - Jornada Content
// ─────────────────────────────────────────────────────────────────────────────
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
                            ForEach(0..<4) { _ in JornadaMatchCard() }
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
            Text("21:00 · Bernabéu")
                .font(.system(size: 11))
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

// ─────────────────────────────────────────────────────────────────────────────
// MARK: - Previews
// ─────────────────────────────────────────────────────────────────────────────
#Preview("Match Centre – Upcoming") {
    MatchCentreView(match: MockHeaderMatches.all[0])
}

#Preview("Match Centre – Finished") {
    MatchCentreView(match: MockHeaderMatches.all[1])
}

#Preview("Estadísticas") {
    ScrollView {
        EstadisticasContent(match: MockHeaderMatches.all[1])
    }
}
