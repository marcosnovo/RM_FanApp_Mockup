import SwiftUI

struct StoreView: View {
    @State private var searchText: String = ""

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(spacing: 0) {

                    // ── Top promo banner (full width, blue/purple) ─────────
                    StoreTopBanner()

                    // ── Navigation bar ─────────────────────────────────────
                    StoreNavBar()

                    // ── Search bar ─────────────────────────────────────────
                    SearchBarView(text: $searchText)
                        .padding(.horizontal, 14)
                        .padding(.vertical, 10)

                    // ── Hero image (full bleed) ────────────────────────────
                    StoreHeroView()

                    // ── Promo card (white, below hero) ─────────────────────
                    StorePromoCard()
                        .padding(.horizontal, 14)
                        .padding(.top, 0)

                    // ── Category grid ──────────────────────────────────────
                    StoreCategoryGrid()
                        .padding(.horizontal, 14)
                        .padding(.top, 22)
                        .padding(.bottom, 30)
                }
            }
            .ignoresSafeArea(edges: .top)
            .navigationBarHidden(true)
            .background(Color(UIColor.systemBackground))
        }
    }
}

// MARK: - Store Top Banner
struct StoreTopBanner: View {
    var body: some View {
        ZStack {
            RMTheme.primary

            HStack(spacing: 10) {
                Text("15% DTO. EN TODAS LAS EQUIPACIONES OFICIALES 25/26")
                    .font(.system(size: 12, weight: .bold))
                    .foregroundColor(.white)
                    .lineLimit(1)
                    .minimumScaleFactor(0.75)
                    .tracking(0.2)

                Spacer()

                Image(systemName: "arrow.right")
                    .font(.system(size: 13, weight: .bold))
                    .foregroundColor(.white)
            }
            .padding(.horizontal, 16)
        }
        .frame(height: 44)
        .padding(.top, 50)   // safe area
    }
}

// MARK: - Store NavBar
struct StoreNavBar: View {
    var body: some View {
        HStack(spacing: 0) {
            // Hamburger
            Button {} label: {
                Image(systemName: "line.3.horizontal")
                    .font(.system(size: 20, weight: .medium))
                    .foregroundColor(Color(UIColor.label))
                    .frame(width: 48, height: 52)
            }

            Spacer()

            // Logo + text
            HStack(spacing: 10) {
                ZStack {
                    Circle()
                        .fill(RMTheme.primary.opacity(0.10))
                        .frame(width: 34, height: 34)
                    Image(systemName: "crown.fill")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(RMTheme.primary)
                }
                VStack(alignment: .leading, spacing: -1) {
                    Text("Official")
                        .font(.system(size: 10, weight: .regular))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                    Text("Store")
                        .font(.system(size: 15, weight: .bold))
                        .foregroundColor(Color(UIColor.label))
                }
            }

            Spacer()

            // User + Cart
            HStack(spacing: 0) {
                Button {} label: {
                    Image(systemName: "person")
                        .font(.system(size: 18))
                        .foregroundColor(Color(UIColor.label))
                        .frame(width: 44, height: 52)
                }
                Button {} label: {
                    Image(systemName: "cart")
                        .font(.system(size: 18))
                        .foregroundColor(Color(UIColor.label))
                        .frame(width: 48, height: 52)
                }
            }
        }
        .background(Color(UIColor.systemBackground))
        .shadow(color: .black.opacity(0.04), radius: 3, x: 0, y: 2)
    }
}

// MARK: - Search Bar
struct SearchBarView: View {
    @Binding var text: String

    var body: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 15, weight: .medium))
                .foregroundColor(Color(UIColor.tertiaryLabel))

            TextField("Buscar", text: $text)
                .font(.system(size: 15))
                .foregroundColor(Color(UIColor.label))
        }
        .padding(.horizontal, 12)
        .padding(.vertical, 11)
        .background(Color(UIColor.secondarySystemBackground))
        .cornerRadius(12)
    }
}

// MARK: - Store Hero (full width, no padding)
struct StoreHeroView: View {
    var body: some View {
        ZStack {
            // Dark gradient simulating players on dark background
            LinearGradient(
                colors: [
                    Color(red: 0.06, green: 0.06, blue: 0.18),
                    Color(red: 0.18, green: 0.16, blue: 0.40),
                    Color(red: 0.22, green: 0.20, blue: 0.50)
                ],
                startPoint: .top,
                endPoint: .bottom
            )
            .frame(height: 280)

            // Simulated player silhouettes
            HStack(spacing: -30) {
                Image(systemName: "figure.run")
                    .font(.system(size: 140, weight: .ultraLight))
                    .foregroundColor(.white.opacity(0.12))
                    .offset(x: -10, y: 10)
                    .scaleEffect(x: -1)

                Image(systemName: "figure.run")
                    .font(.system(size: 120, weight: .ultraLight))
                    .foregroundColor(.white.opacity(0.10))
                    .offset(x: 10, y: 20)
            }

            // Emirates/kit watermark feel
            VStack {
                Spacer()
                HStack {
                    Spacer()
                    ZStack {
                        Circle()
                            .fill(Color.white.opacity(0.08))
                            .frame(width: 36, height: 36)
                        Image(systemName: "crown.fill")
                            .font(.system(size: 14, weight: .bold))
                            .foregroundColor(.white.opacity(0.30))
                    }
                    .padding(14)
                }
            }
        }
        .frame(height: 280)
        .clipped()
    }
}

// MARK: - Store Promo Card (floating over/below hero)
struct StorePromoCard: View {
    var body: some View {
        VStack(alignment: .leading, spacing: 12) {
            Text("¡15% Dto. En Equipaciones!")
                .font(.system(size: 26, weight: .bold))
                .foregroundColor(Color(UIColor.label))

            Text("Aprovecha este descuento exclusivo en todas las equipaciones oficiales de la temporada 25/26. Disponible por tiempo limitado.")
                .font(.system(size: 14, weight: .regular))
                .foregroundColor(Color(UIColor.secondaryLabel))
                .lineSpacing(3)

            Button {} label: {
                Text("Comprar ahora")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white)
                    .frame(maxWidth: .infinity)
                    .frame(height: 48)
                    .background(RMTheme.primaryGradient)
                    .cornerRadius(12)
            }
        }
        .padding(20)
        .background(Color(UIColor.systemBackground))
        .cornerRadius(18)
        .shadow(color: .black.opacity(0.10), radius: 16, x: 0, y: -4)
        .offset(y: -20)   // slight overlap with hero
    }
}

// MARK: - Category Grid
struct StoreCategoryGrid: View {
    let columns = [GridItem(.flexible(), spacing: 12), GridItem(.flexible(), spacing: 12)]

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            Text("Categorías")
                .font(.system(size: 20, weight: .bold))
                .foregroundColor(Color(UIColor.label))

            LazyVGrid(columns: columns, spacing: 12) {
                StoreCategoryCard(name: "Equipaciones", icon: "tshirt.fill", color: Color(red: 0.14, green: 0.18, blue: 0.48))
                StoreCategoryCard(name: "Calzado", icon: "shoe.fill", color: Color(red: 0.30, green: 0.12, blue: 0.44))
                StoreCategoryCard(name: "Accesorios", icon: "backpack.fill", color: Color(red: 0.10, green: 0.26, blue: 0.46))
                StoreCategoryCard(name: "Colecciones", icon: "star.fill", color: Color(red: 0.40, green: 0.22, blue: 0.52))
            }
        }
    }
}

struct StoreCategoryCard: View {
    let name: String
    let icon: String
    let color: Color

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 14)
                .fill(
                    LinearGradient(
                        colors: [color, color.opacity(0.75)],
                        startPoint: .topLeading,
                        endPoint: .bottomTrailing
                    )
                )
                .frame(height: 95)

            VStack(spacing: 10) {
                Image(systemName: icon)
                    .font(.system(size: 28))
                    .foregroundColor(.white.opacity(0.88))
                Text(name)
                    .font(.system(size: 13, weight: .semibold))
                    .foregroundColor(.white)
            }
        }
    }
}

#Preview {
    StoreView()
}
