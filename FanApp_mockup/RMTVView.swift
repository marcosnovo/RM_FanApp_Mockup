import SwiftUI

struct RMTVView: View {
    @State private var selectedDayIndex: Int = 0

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {

                    // ── Hero: stadium aerial shot ──────────────────────────
                    TVHeroBannerView()

                    // ── Dark bar: "RMTV EN ESPAÑOL" + dropdown ─────────────
                    HStack {
                        Text("RMTV EN ESPAÑOL")
                            .font(.system(size: 13, weight: .bold))
                            .foregroundColor(.white)
                            .tracking(0.5)

                        Spacer()

                        Image(systemName: "chevron.down")
                            .font(.system(size: 12, weight: .semibold))
                            .foregroundColor(.white.opacity(0.70))
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(Color(red: 0.11, green: 0.12, blue: 0.22))

                    // ── First scheduled item on dark bg ────────────────────
                    if let firstItem = MockTV.days[selectedDayIndex].items.first {
                        HStack(alignment: .top, spacing: 16) {
                            Text(firstItem.time)
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(.white)
                                .frame(width: 48, alignment: .leading)

                            VStack(alignment: .leading, spacing: 6) {
                                Text(firstItem.title)
                                    .font(.system(size: 14, weight: .medium))
                                    .foregroundColor(.white.opacity(0.85))
                                    .lineLimit(2)
                                    .fixedSize(horizontal: false, vertical: true)
                                if firstItem.isLive {
                                    LiveBadge()
                                }
                            }

                            Spacer()
                        }
                        .padding(.horizontal, 16)
                        .padding(.vertical, 14)
                        .background(Color(red: 0.13, green: 0.15, blue: 0.27))
                    }

                    // ── RM Play promo card ─────────────────────────────────
                    RMPlayPromoCard()
                        .padding(.horizontal, 14)
                        .padding(.top, 16)
                        .padding(.bottom, 4)

                    // ── Day selector pills ─────────────────────────────────
                    DaySelectorView(
                        days: MockTV.days.map { $0.label },
                        selectedIndex: $selectedDayIndex
                    )
                    .padding(.top, 18)
                    .padding(.bottom, 6)

                    // ── Schedule rows ──────────────────────────────────────
                    let remainingItems = Array(MockTV.days[selectedDayIndex].items.dropFirst())

                    ForEach(remainingItems) { item in
                        TVScheduleRowView(item: item)

                        Divider()
                            .padding(.leading, 16 + 48 + 16)
                    }

                    Color.clear.frame(height: 24)
                }
            }
            .background(Color(UIColor.systemBackground))
            .navigationBarHidden(true)
            .ignoresSafeArea(edges: .top)
        }
    }
}

// MARK: - Hero Banner
struct TVHeroBannerView: View {
    var body: some View {
        ZStack(alignment: .bottomTrailing) {
            // Deep dark background simulating aerial night stadium
            LinearGradient(
                colors: [
                    Color(red: 0.04, green: 0.06, blue: 0.16),
                    Color(red: 0.06, green: 0.10, blue: 0.26),
                    Color(red: 0.08, green: 0.14, blue: 0.30)
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .frame(height: 210)
            .overlay(
                // Simulated stadium lights — concentric oval shapes
                ZStack {
                    Ellipse()
                        .stroke(Color.white.opacity(0.05), lineWidth: 12)
                        .frame(width: 320, height: 160)
                    Ellipse()
                        .stroke(Color.white.opacity(0.04), lineWidth: 8)
                        .frame(width: 220, height: 110)
                    Ellipse()
                        .fill(Color(red: 0.16, green: 0.40, blue: 0.24).opacity(0.35))
                        .frame(width: 160, height: 80)
                    // Corner lights
                    Image(systemName: "sportscourt.fill")
                        .font(.system(size: 90, weight: .thin))
                        .foregroundColor(.white.opacity(0.06))
                }
                .offset(y: -10)
            )

            // Bottom-right attribution text
            Text("CHAMPIONS LEAGUE 25/26 · OCTAVOS DE FINAL · IDA")
                .font(.system(size: 9, weight: .semibold))
                .foregroundColor(.white.opacity(0.45))
                .tracking(0.8)
                .padding(12)
        }
        .frame(height: 210)
        .clipped()
    }
}

// MARK: - RM Play Promo Card
struct RMPlayPromoCard: View {
    var body: some View {
        HStack(spacing: 14) {
            // Logo area
            VStack(alignment: .leading, spacing: 4) {
                ZStack {
                    Circle()
                        .fill(RMTheme.primary.opacity(0.12))
                        .frame(width: 42, height: 42)
                    Image(systemName: "crown.fill")
                        .font(.system(size: 18, weight: .bold))
                        .foregroundColor(RMTheme.primary)
                }
                Text("Play")
                    .font(.system(size: 14, weight: .bold))
                    .foregroundColor(Color(UIColor.label))
            }

            // Decorative mini images (simulating app screenshots)
            HStack(spacing: 4) {
                ForEach(0..<3) { i in
                    RoundedRectangle(cornerRadius: 6)
                        .fill(
                            LinearGradient(
                                colors: [RMTheme.primary.opacity(0.7 - Double(i) * 0.15), RMTheme.primary.opacity(0.4)],
                                startPoint: .topLeading,
                                endPoint: .bottomTrailing
                            )
                        )
                        .frame(width: 46, height: 56)
                        .overlay(
                            Image(systemName: i == 1 ? "play.fill" : "crown.fill")
                                .font(.system(size: 14))
                                .foregroundColor(.white.opacity(0.7))
                        )
                }
            }

            Spacer()

            // Download CTA
            Button {} label: {
                Text("Descargar ahora")
                    .font(.system(size: 11, weight: .bold))
                    .foregroundColor(.white)
                    .padding(.horizontal, 10)
                    .padding(.vertical, 7)
                    .background(RMTheme.primary)
                    .cornerRadius(8)
            }
        }
        .padding(14)
        .background(Color(UIColor.secondarySystemBackground))
        .cornerRadius(14)
    }
}

// MARK: - Day Selector (pills, no border on unselected)
struct DaySelectorView: View {
    let days: [String]
    @Binding var selectedIndex: Int

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                ForEach(days.indices, id: \.self) { i in
                    Button {
                        withAnimation(.easeInOut(duration: 0.18)) { selectedIndex = i }
                    } label: {
                        Text(days[i])
                            .font(.system(size: 14, weight: selectedIndex == i ? .bold : .regular))
                            .foregroundColor(selectedIndex == i ? .white : Color(UIColor.secondaryLabel))
                            .padding(.horizontal, 18)
                            .padding(.vertical, 9)
                            .background(selectedIndex == i ? RMTheme.primary : Color.clear)
                            .cornerRadius(22)
                    }
                }
            }
            .padding(.horizontal, 14)
        }
    }
}

// MARK: - Schedule Row
struct TVScheduleRowView: View {
    let item: TVScheduleItem

    var body: some View {
        HStack(alignment: .top, spacing: 16) {
            // Time — prominent, bold
            Text(item.time)
                .font(.system(size: 18, weight: .bold))
                .foregroundColor(Color(UIColor.label))
                .frame(width: 52, alignment: .leading)

            VStack(alignment: .leading, spacing: 6) {
                Text(item.title)
                    .font(.system(size: 14, weight: .medium))
                    .foregroundColor(Color(UIColor.label))
                    .lineLimit(2)
                    .fixedSize(horizontal: false, vertical: true)

                if item.isLive {
                    LiveBadge()
                }
            }

            Spacer()
        }
        .padding(.horizontal, 16)
        .padding(.vertical, 16)
    }
}

// MARK: - Live Badge
struct LiveBadge: View {
    var body: some View {
        Text("EN DIRECTO")
            .font(.system(size: 10, weight: .bold))
            .foregroundColor(.white)
            .tracking(0.5)
            .padding(.horizontal, 7)
            .padding(.vertical, 3)
            .background(Color.red)
            .cornerRadius(4)
    }
}

#Preview {
    RMTVView()
}
