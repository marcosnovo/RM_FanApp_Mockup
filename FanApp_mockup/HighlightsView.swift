import SwiftUI

// MARK: - Highlights View
struct HighlightsView: View {
    @State private var selectedCategory: HighlightCategory = .all
    @State private var selectedHighlight: HighlightItem? = nil

    private let columns = [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)]

    private var filteredHighlights: [HighlightItem] {
        if selectedCategory == .all { return MockHighlights.all }
        return MockHighlights.all.filter { $0.category == selectedCategory }
    }

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(alignment: .leading, spacing: 20) {

                // ── Category filter pills ──────────────────────────────────
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 8) {
                        ForEach(HighlightCategory.allCases) { category in
                            CategoryPill(
                                category: category,
                                isSelected: selectedCategory == category
                            ) {
                                withAnimation(.easeInOut(duration: 0.2)) {
                                    selectedCategory = category
                                }
                            }
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 4)
                }

                // ── Grid ──────────────────────────────────────────────────
                LazyVGrid(columns: columns, spacing: 12) {
                    ForEach(filteredHighlights) { item in
                        Button {
                            selectedHighlight = item
                        } label: {
                            HighlightGridCard(item: item)
                        }
                        .buttonStyle(.plain)
                    }
                }
                .padding(.horizontal, 16)
                .animation(.easeInOut(duration: 0.25), value: selectedCategory)

                Spacer(minLength: 20)
            }
            .padding(.top, 12)
        }
        .navigationTitle("Highlights")
        .navigationBarTitleDisplayMode(.large)
        .sheet(item: $selectedHighlight) { item in
            HighlightPlayerView(item: item)
        }
    }
}

// MARK: - Category Pill
private struct CategoryPill: View {
    let category: HighlightCategory
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            HStack(spacing: 5) {
                Image(systemName: category.icon)
                    .font(.system(size: 12, weight: .medium))
                Text(category.rawValue)
                    .font(.system(size: 13, weight: isSelected ? .semibold : .regular))
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 8)
            .background(
                isSelected
                    ? RMTheme.primary
                    : Color(UIColor.secondarySystemBackground)
            )
            .foregroundColor(isSelected ? .white : Color(UIColor.label))
            .clipShape(Capsule())
        }
    }
}

// MARK: - Highlight Grid Card
struct HighlightGridCard: View {
    let item: HighlightItem

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            // Thumbnail
            ZStack {
                LinearGradient(
                    colors: item.thumbnailColors,
                    startPoint: .topLeading,
                    endPoint: .bottomTrailing
                )
                .frame(height: 110)
                .clipShape(RoundedRectangle(cornerRadius: 10, style: .continuous))

                // Play icon overlay
                Circle()
                    .fill(.black.opacity(0.35))
                    .frame(width: 36, height: 36)
                Image(systemName: "play.fill")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(.white)

                // Duration badge
                VStack {
                    Spacer()
                    HStack {
                        Spacer()
                        Text(item.duration)
                            .font(.system(size: 10, weight: .semibold))
                            .foregroundColor(.white)
                            .padding(.horizontal, 6)
                            .padding(.vertical, 3)
                            .background(.black.opacity(0.55))
                            .clipShape(RoundedRectangle(cornerRadius: 4, style: .continuous))
                            .padding(6)
                    }
                }

                // Team badge (top-left)
                if let teamType = item.teamType {
                    VStack {
                        HStack {
                            Text(teamType.shortName)
                                .font(.system(size: 9, weight: .bold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 6)
                                .padding(.vertical, 3)
                                .background(teamType.badgeColor.opacity(0.85))
                                .clipShape(RoundedRectangle(cornerRadius: 4, style: .continuous))
                                .padding(6)
                            Spacer()
                        }
                        Spacer()
                    }
                }
            }
            .frame(height: 110)

            // Title
            Text(item.title)
                .font(.system(size: 12, weight: .medium))
                .foregroundColor(Color(UIColor.label))
                .lineLimit(2)
                .multilineTextAlignment(.leading)
                .padding(.top, 7)
                .padding(.horizontal, 2)
        }
    }
}

// MARK: - Highlight Player View (sheet simulation)
struct HighlightPlayerView: View {
    let item: HighlightItem
    @State private var isPlaying = false
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {

                // ── Simulated player ──────────────────────────────────────
                ZStack {
                    LinearGradient(
                        colors: item.thumbnailColors,
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                    .frame(maxWidth: .infinity)
                    .frame(height: 240)

                    if isPlaying {
                        VStack(spacing: 8) {
                            Image(systemName: "waveform")
                                .font(.system(size: 32))
                                .foregroundColor(.white.opacity(0.8))
                            Text("Reproduciendo…")
                                .font(.system(size: 13, weight: .medium))
                                .foregroundColor(.white.opacity(0.7))
                        }
                    } else {
                        Button {
                            withAnimation { isPlaying = true }
                        } label: {
                            Circle()
                                .fill(.black.opacity(0.35))
                                .frame(width: 64, height: 64)
                                .overlay(
                                    Image(systemName: "play.fill")
                                        .font(.system(size: 26, weight: .bold))
                                        .foregroundColor(.white)
                                        .offset(x: 3)
                                )
                        }
                    }

                    // Duration
                    VStack {
                        Spacer()
                        HStack {
                            Spacer()
                            Text(item.duration)
                                .font(.system(size: 11, weight: .semibold))
                                .foregroundColor(.white)
                                .padding(.horizontal, 8)
                                .padding(.vertical, 4)
                                .background(.black.opacity(0.55))
                                .clipShape(RoundedRectangle(cornerRadius: 5, style: .continuous))
                                .padding(12)
                        }
                    }
                }

                // ── Info ──────────────────────────────────────────────────
                VStack(alignment: .leading, spacing: 12) {
                    Text(item.title)
                        .font(.system(size: 20, weight: .bold))
                        .foregroundColor(Color(UIColor.label))

                    HStack(spacing: 8) {
                        Image(systemName: item.category.icon)
                            .font(.system(size: 12))
                        Text(item.category.rawValue)
                            .font(.system(size: 13))

                        if let teamType = item.teamType {
                            Text("·")
                            Text(teamType.rawValue)
                                .font(.system(size: 13))
                        }
                    }
                    .foregroundColor(Color(UIColor.secondaryLabel))

                    Divider()

                    // Scrubber simulation
                    VStack(spacing: 6) {
                        GeometryReader { geo in
                            ZStack(alignment: .leading) {
                                Capsule()
                                    .fill(Color(UIColor.tertiarySystemFill))
                                    .frame(height: 4)
                                Capsule()
                                    .fill(RMTheme.primary)
                                    .frame(width: isPlaying ? geo.size.width * 0.35 : 0, height: 4)
                                    .animation(.linear(duration: 2), value: isPlaying)
                            }
                        }
                        .frame(height: 4)

                        HStack {
                            Text(isPlaying ? "0:42" : "0:00")
                                .font(.system(size: 11, weight: .medium))
                                .foregroundColor(Color(UIColor.tertiaryLabel))
                            Spacer()
                            Text(item.duration)
                                .font(.system(size: 11, weight: .medium))
                                .foregroundColor(Color(UIColor.tertiaryLabel))
                        }
                    }

                    // Controls
                    HStack(spacing: 40) {
                        Spacer()
                        Button {} label: {
                            Image(systemName: "gobackward.15")
                                .font(.system(size: 26))
                                .foregroundColor(Color(UIColor.label))
                        }
                        Button {
                            withAnimation { isPlaying.toggle() }
                        } label: {
                            Image(systemName: isPlaying ? "pause.circle.fill" : "play.circle.fill")
                                .font(.system(size: 52))
                                .foregroundColor(RMTheme.primary)
                        }
                        Button {} label: {
                            Image(systemName: "goforward.15")
                                .font(.system(size: 26))
                                .foregroundColor(Color(UIColor.label))
                        }
                        Spacer()
                    }
                    .padding(.top, 4)
                }
                .padding(20)

                Spacer()
            }
            .navigationTitle("")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Cerrar") { dismiss() }
                        .font(.system(size: 15, weight: .medium))
                }
            }
        }
    }
}

#Preview("Highlights") {
    NavigationStack {
        HighlightsView()
    }
}

#Preview("Grid Card") {
    HighlightGridCard(item: MockHighlights.all[0])
        .frame(width: 180)
        .padding()
}

#Preview("Player") {
    HighlightPlayerView(item: MockHighlights.all[0])
}
