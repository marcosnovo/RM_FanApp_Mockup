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
                        // 1. Próximo partido
                        NextMatchSection()

                        // 2. Noticias recientes
                        HomeNewsSectionView()

                        // 3. Vídeos y highlights
                        HomeVideosSectionView()

                        // 4. Trivia del día
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
                    // Left: person icon + label
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

                    // Center: HOY title
                    Text("HOY")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(.white)
                        .tracking(3)

                    Spacer()

                    // Right: radio icon + label
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

// MARK: - Shared Section Header
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
            if showAll {
                Button { onShowAll?() } label: {
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

// MARK: - Shared Crest View
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
// MARK: - 1. NEXT MATCH SECTION
// ─────────────────────────────────────────────────────────────────────────────
struct NextMatchSection: View {
    private let match = MockHeaderMatches.all.first(where: { $0.status == .upcoming })
                     ?? MockHeaderMatches.all[0]

    var body: some View {
        VStack(spacing: 12) {
            HomeSectionHeader(title: "Próximo partido", showAll: false)

            NavigationLink(destination: MatchCentreView(match: match)) {
                NextMatchCardView(match: match)
                    .padding(.horizontal, 16)
            }
            .buttonStyle(.plain)
        }
    }
}

// MARK: - NextMatchCardView
struct NextMatchCardView: View {
    let match: MatchHeaderData

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 18)
                .fill(LinearGradient(
                    colors: [
                        Color(red: 0.11, green: 0.12, blue: 0.28),
                        Color(red: 0.20, green: 0.17, blue: 0.44)
                    ],
                    startPoint: .topLeading, endPoint: .bottomTrailing
                ))

            VStack(spacing: 0) {
                // Competition + CTA hint
                HStack {
                    Text(match.competition)
                        .font(.system(size: 10, weight: .semibold))
                        .foregroundColor(.white.opacity(0.60))
                        .tracking(1.2)
                    Spacer()
                    HStack(spacing: 3) {
                        Text("Centro del partido")
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(.white.opacity(0.45))
                        Image(systemName: "chevron.right")
                            .font(.system(size: 10, weight: .bold))
                            .foregroundColor(.white.opacity(0.45))
                    }
                }
                .padding(.horizontal, 18)
                .padding(.top, 16)
                .padding(.bottom, 16)

                // Teams row
                HStack(alignment: .center) {
                    // Home team
                    VStack(spacing: 6) {
                        MatchCrestView(color: match.homeTeamColor,
                                       symbol: match.homeTeamSymbol, size: 50)
                        Text(match.homeTeam)
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(.white.opacity(0.85))
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                            .frame(maxWidth: 100)
                    }

                    Spacer()

                    // Center: score or VS + date
                    Group {
                        if match.status == .upcoming {
                            VStack(spacing: 6) {
                                Text("VS")
                                    .font(.system(size: 18, weight: .black))
                                    .foregroundColor(.white.opacity(0.30))
                                Text(match.dateString)
                                    .font(.system(size: 12, weight: .semibold))
                                    .foregroundColor(.white)
                                    .multilineTextAlignment(.center)
                            }
                        } else {
                            VStack(spacing: 3) {
                                HStack(spacing: 8) {
                                    Text("\(match.homeScore ?? 0)")
                                        .font(.system(size: 34, weight: .bold))
                                        .foregroundColor(.white)
                                    Text("-")
                                        .font(.system(size: 20))
                                        .foregroundColor(.white.opacity(0.45))
                                    Text("\(match.awayScore ?? 0)")
                                        .font(.system(size: 34, weight: .bold))
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

                    Spacer()

                    // Away team
                    VStack(spacing: 6) {
                        MatchCrestView(color: match.awayTeamColor,
                                       symbol: match.awayTeamSymbol, size: 50)
                        Text(match.awayTeam)
                            .font(.system(size: 11, weight: .medium))
                            .foregroundColor(.white.opacity(0.85))
                            .multilineTextAlignment(.center)
                            .lineLimit(2)
                            .frame(maxWidth: 100)
                    }
                }
                .padding(.horizontal, 20)
                .padding(.bottom, 12)

                // Venue line
                let venueLine = match.matchInfo.components(separatedBy: "\n").last ?? ""
                Text(venueLine)
                    .font(.system(size: 11))
                    .foregroundColor(.white.opacity(0.36))
                    .padding(.bottom, 16)
            }
        }
        .shadow(color: Color(red: 0.11, green: 0.12, blue: 0.28).opacity(0.45),
                radius: 16, x: 0, y: 6)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MARK: - 2. NEWS SECTION
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
                        Divider()
                            .padding(.leading, 16 + 68 + 12)
                    }
                }
            }
            .background(Color(UIColor.systemBackground))
            .cornerRadius(16)
            .shadow(color: .black.opacity(0.06), radius: 8, x: 0, y: 3)
            .padding(.horizontal, 16)
        }
        .sheet(item: $selectedNews) { item in
            NewsDetailView(item: item)
        }
    }
}

// MARK: - HomeNewsRowView
struct HomeNewsRowView: View {
    let item: NewsItem

    var body: some View {
        HStack(spacing: 12) {
            // Thumbnail
            ZStack {
                RoundedRectangle(cornerRadius: 8)
                    .fill(item.imageColor)
                    .frame(width: 68, height: 56)
                Image(systemName: item.imageName)
                    .font(.system(size: 18))
                    .foregroundColor(.white.opacity(0.35))
            }

            // Text stack
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
// MARK: - 3. VIDEOS SECTION
// ─────────────────────────────────────────────────────────────────────────────
struct HomeVideosSectionView: View {
    @State private var selectedVideo: VideoItem? = nil

    var body: some View {
        VStack(spacing: 12) {
            HomeSectionHeader(title: "Vídeos", onShowAll: {})

            ScrollView(.horizontal, showsIndicators: false) {
                HStack(spacing: 12) {
                    ForEach(MockVideos.all) { video in
                        Button { selectedVideo = video } label: {
                            VideoCardView(video: video)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, 16)
                .padding(.vertical, 2)
            }
        }
        .sheet(item: $selectedVideo) { video in
            VideoPlayerView(video: video)
        }
    }
}

// MARK: - VideoCardView
struct VideoCardView: View {
    let video: VideoItem

    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Thumbnail
            ZStack(alignment: .bottomTrailing) {
                RoundedRectangle(cornerRadius: 12)
                    .fill(LinearGradient(
                        colors: video.thumbnailColors,
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    ))
                    .frame(width: 190, height: 116)

                // Watermark icon
                Image(systemName: video.icon)
                    .font(.system(size: 50, weight: .ultraLight))
                    .foregroundColor(.white.opacity(0.08))
                    .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .bottomLeading)
                    .padding(8)

                // Play button
                Image(systemName: "play.circle.fill")
                    .font(.system(size: 34))
                    .foregroundColor(.white.opacity(0.85))
                    .frame(maxWidth: .infinity, maxHeight: .infinity)

                // Duration badge
                Text(video.duration)
                    .font(.system(size: 10, weight: .semibold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 6).padding(.vertical, 3)
                    .background(Color.black.opacity(0.55))
                    .cornerRadius(5)
                    .padding(8)
            }
            .clipped()

            // Label
            VStack(alignment: .leading, spacing: 2) {
                Text(video.category)
                    .font(.system(size: 9, weight: .bold))
                    .foregroundColor(RMTheme.primary)
                    .tracking(0.8)
                Text(video.title)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(Color(UIColor.label))
                    .lineLimit(2)
                    .frame(width: 190, alignment: .leading)
            }
        }
    }
}

// MARK: - VideoPlayerView (simulated)
struct VideoPlayerView: View {
    let video: VideoItem
    @Environment(\.dismiss) private var dismiss
    @State private var isPlaying = false

    var body: some View {
        VStack(spacing: 0) {
            // Close button
            HStack {
                Spacer()
                Button { dismiss() } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 30))
                        .foregroundColor(Color(UIColor.tertiaryLabel))
                }
                .padding(.horizontal, 20)
                .padding(.top, 20)
            }

            // Video area
            ZStack {
                LinearGradient(
                    colors: video.thumbnailColors,
                    startPoint: .topLeading, endPoint: .bottomTrailing
                )

                Image(systemName: video.icon)
                    .font(.system(size: 80, weight: .ultraLight))
                    .foregroundColor(.white.opacity(0.07))

                Button {
                    withAnimation(.easeInOut(duration: 0.25)) { isPlaying.toggle() }
                } label: {
                    Image(systemName: isPlaying ? "pause.circle.fill" : "play.circle.fill")
                        .font(.system(size: 70))
                        .foregroundColor(.white.opacity(0.90))
                        .scaleEffect(isPlaying ? 0.9 : 1.0)
                        .animation(.spring(response: 0.3), value: isPlaying)
                }
            }
            .frame(height: 260)

            // Info panel
            VStack(alignment: .leading, spacing: 10) {
                Text(video.category)
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(RMTheme.primary)
                    .tracking(1)

                Text(video.title)
                    .font(.system(size: 20, weight: .bold))
                    .foregroundColor(Color(UIColor.label))

                HStack(spacing: 6) {
                    Image(systemName: "clock")
                        .font(.system(size: 12))
                    Text(video.duration)
                        .font(.system(size: 13))
                }
                .foregroundColor(Color(UIColor.secondaryLabel))

                // Simulated progress bar
                ZStack(alignment: .leading) {
                    RoundedRectangle(cornerRadius: 3)
                        .fill(Color(UIColor.tertiarySystemFill))
                        .frame(height: 4)
                    RoundedRectangle(cornerRadius: 3)
                        .fill(RMTheme.primaryGradient)
                        .frame(width: isPlaying ? 160 : 0, height: 4)
                        .animation(.easeInOut(duration: 1.4), value: isPlaying)
                }
                .padding(.top, 6)

                if isPlaying {
                    Text("Reproduciendo...")
                        .font(.system(size: 12))
                        .foregroundColor(Color(UIColor.tertiaryLabel))
                        .transition(.opacity)
                }
            }
            .frame(maxWidth: .infinity, alignment: .leading)
            .padding(22)

            Spacer()
        }
        .background(Color(UIColor.systemBackground))
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MARK: - 4. SURVEY / TRIVIA SECTION
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
                    Circle()
                        .fill(RMTheme.primary.opacity(0.12))
                        .frame(width: 36, height: 36)
                    Image(systemName: "questionmark.circle.fill")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(RMTheme.primary)
                }
                VStack(alignment: .leading, spacing: 1) {
                    Text("TRIVIA")
                        .font(.system(size: 9, weight: .bold))
                        .foregroundColor(RMTheme.primary)
                        .tracking(1)
                    Text("Demuestra tu conocimiento")
                        .font(.system(size: 12))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                }
                Spacer()
                if selectedOption != nil {
                    Text("\(survey.totalVotes.formatted()) votos")
                        .font(.system(size: 11))
                        .foregroundColor(Color(UIColor.tertiaryLabel))
                        .transition(.opacity)
                }
            }

            // Question
            Text(survey.question)
                .font(.system(size: 17, weight: .semibold))
                .foregroundColor(Color(UIColor.label))
                .lineSpacing(2)

            // Options
            VStack(spacing: 9) {
                ForEach(Array(survey.options.enumerated()), id: \.offset) { idx, option in
                    if let selected = selectedOption {
                        // Result mode
                        SurveyResultRow(
                            option: option,
                            totalVotes: survey.totalVotes,
                            isSelected: selected == idx,
                            isCorrect: idx == survey.correctIndex
                        )
                        .transition(.opacity.combined(with: .scale(scale: 0.97)))
                    } else {
                        // Button mode
                        Button {
                            withAnimation(.easeInOut(duration: 0.30)) {
                                selectedOption = idx
                            }
                        } label: {
                            Text(option.text)
                                .font(.system(size: 15, weight: .medium))
                                .foregroundColor(Color(UIColor.label))
                                .frame(maxWidth: .infinity)
                                .frame(height: 46)
                                .background(Color(UIColor.secondarySystemBackground))
                                .cornerRadius(10)
                                .overlay(
                                    RoundedRectangle(cornerRadius: 10)
                                        .stroke(Color(UIColor.separator), lineWidth: 0.5)
                                )
                        }
                    }
                }
            }

            // Correct answer callout
            if let selected = selectedOption {
                HStack(spacing: 6) {
                    Image(systemName: selected == survey.correctIndex
                          ? "checkmark.circle.fill"
                          : "lightbulb.fill")
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
        if isCorrect { return Color(red: 0.15, green: 0.72, blue: 0.40) }
        if isSelected { return RMTheme.primary }
        return Color(UIColor.tertiarySystemFill)
    }

    var body: some View {
        GeometryReader { geo in
            ZStack(alignment: .leading) {
                // Background
                RoundedRectangle(cornerRadius: 10)
                    .fill(Color(UIColor.secondarySystemBackground))
                    .frame(height: 46)

                // Fill bar
                RoundedRectangle(cornerRadius: 10)
                    .fill(fillColor.opacity(isCorrect || isSelected ? 0.22 : 0.10))
                    .frame(width: max(0, geo.size.width * fraction), height: 46)

                // Text row
                HStack {
                    HStack(spacing: 7) {
                        if isCorrect {
                            Image(systemName: "checkmark.circle.fill")
                                .font(.system(size: 13))
                                .foregroundColor(Color(red: 0.15, green: 0.72, blue: 0.40))
                        } else if isSelected {
                            Image(systemName: "circle.fill")
                                .font(.system(size: 8))
                                .foregroundColor(RMTheme.primary)
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
            .overlay(
                RoundedRectangle(cornerRadius: 10)
                    .stroke(
                        isCorrect ? Color(red: 0.15, green: 0.72, blue: 0.40).opacity(0.45)
                            : isSelected ? RMTheme.primary.opacity(0.30)
                            : Color(UIColor.separator).opacity(0.4),
                        lineWidth: 0.8
                    )
            )
        }
        .frame(height: 46)
    }
}

// ─────────────────────────────────────────────────────────────────────────────
// MARK: - Previews
// ─────────────────────────────────────────────────────────────────────────────
#Preview("HOY Screen") {
    HomeView(showSideMenu: .constant(false))
}

#Preview("NextMatchCardView") {
    ZStack {
        Color(UIColor.systemGroupedBackground).ignoresSafeArea()
        NextMatchCardView(match: MockHeaderMatches.all[0])
            .padding(16)
    }
}

#Preview("HomeNewsRowView") {
    HomeNewsRowView(item: MockNews.items[0])
        .padding(16)
        .background(Color(UIColor.systemBackground))
}

#Preview("VideoCardView") {
    VideoCardView(video: MockVideos.all[0])
        .padding(16)
}

#Preview("SurveyCardView") {
    ZStack {
        Color(UIColor.systemGroupedBackground).ignoresSafeArea()
        SurveyCardView(survey: MockSurvey.trivia)
            .padding(16)
    }
}
