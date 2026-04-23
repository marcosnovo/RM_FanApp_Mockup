import SwiftUI

struct NewsListView: View {
    @State private var selectedNews: NewsItem? = nil
    /// Currently selected category when the filter feature is enabled.
    /// `nil` means "Todas" (no filter applied).
    @State private var selectedCategory: String? = nil

    /// Unique list of categories derived from the mock data, in the order
    /// they first appear. Computed once per render.
    private var categories: [String] {
        var seen = Set<String>()
        var ordered: [String] = []
        for item in MockNews.items where seen.insert(item.category).inserted {
            ordered.append(item.category)
        }
        return ordered
    }

    /// Items to render — filtered when a category is selected, otherwise
    /// the full list. When the feature flag is off, always returns all items.
    private var visibleItems: [NewsItem] {
        guard FeatureFlags.enableNewsFilter, let selected = selectedCategory else {
            return MockNews.items
        }
        return MockNews.items.filter { $0.category == selected }
    }

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 0) {

                    // "Destacado" heading — large, editorial
                    Text("Destacado")
                        .font(.system(size: 30, weight: .bold))
                        .foregroundColor(Color(UIColor.label))
                        .padding(.horizontal, 16)
                        .padding(.top, 22)
                        .padding(.bottom, 6)

                    // Optional filter bar — only when the flag is on
                    if FeatureFlags.enableNewsFilter {
                        CategoryFilterBar(
                            categories: categories,
                            selected: $selectedCategory
                        )
                        .padding(.bottom, 8)
                    }

                    // First item: FEATURED — larger card
                    if let first = visibleItems.first {
                        Button { selectedNews = first } label: {
                            FeaturedNewsCard(item: first)
                        }
                        .buttonStyle(.plain)
                    }

                    // Divider after featured
                    Divider()
                        .padding(.leading, 16)
                        .padding(.bottom, 4)

                    // Rest of items as rows
                    ForEach(Array(visibleItems.dropFirst())) { item in
                        Button { selectedNews = item } label: {
                            NewsRowView(item: item)
                        }
                        .buttonStyle(.plain)

                        Divider()
                            .padding(.leading, 16 + 88 + 12)
                    }

                    // Empty state if the filter yields nothing
                    if FeatureFlags.enableNewsFilter && visibleItems.isEmpty {
                        VStack(spacing: 8) {
                            Image(systemName: "tray")
                                .font(.system(size: 28))
                                .foregroundColor(.secondary)
                            Text("No hay noticias en esta categoría")
                                .font(.system(size: 14))
                                .foregroundColor(.secondary)
                        }
                        .frame(maxWidth: .infinity)
                        .padding(.vertical, 48)
                    }

                    Color.clear.frame(height: 24)
                }
            }
            .background(Color(UIColor.systemBackground))
            .navigationBarHidden(true)
        }
        .sheet(item: $selectedNews) { item in
            NewsDetailView(item: item)
        }
    }
}

// MARK: - Category Filter Bar (only visible when FeatureFlags.enableNewsFilter)
struct CategoryFilterBar: View {
    let categories: [String]
    @Binding var selected: String?

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 8) {
                // "Todas" chip — represents no filter
                FilterChip(
                    title: "Todas",
                    isSelected: selected == nil
                ) {
                    selected = nil
                }

                ForEach(categories, id: \.self) { category in
                    FilterChip(
                        title: category,
                        isSelected: selected == category
                    ) {
                        // Tap again on the active chip to clear
                        selected = (selected == category) ? nil : category
                    }
                }
            }
            .padding(.horizontal, 16)
        }
    }
}

private struct FilterChip: View {
    let title: String
    let isSelected: Bool
    let action: () -> Void

    var body: some View {
        Button(action: action) {
            Text(title)
                .font(.system(size: 13, weight: .semibold))
                .foregroundColor(isSelected ? .white : Color(UIColor.label))
                .padding(.horizontal, 14)
                .padding(.vertical, 8)
                .background(
                    Capsule()
                        .fill(isSelected ? RMTheme.primary : Color(UIColor.secondarySystemBackground))
                )
                .overlay(
                    Capsule()
                        .stroke(isSelected ? Color.clear : Color(UIColor.separator), lineWidth: 0.5)
                )
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Featured Large Card (first item)
struct FeaturedNewsCard: View {
    let item: NewsItem

    var body: some View {
        VStack(alignment: .leading, spacing: 0) {
            HStack(alignment: .top, spacing: 12) {
                // Thumbnail — larger for featured
                ZStack {
                    RoundedRectangle(cornerRadius: 10)
                        .fill(item.imageColor)
                        .frame(width: 110, height: 82)
                    Image(systemName: "photo.fill")
                        .font(.system(size: 26))
                        .foregroundColor(.white.opacity(0.30))
                }
                .padding(.leading, 16)
                .padding(.vertical, 14)

                VStack(alignment: .leading, spacing: 6) {
                    Text(item.title)
                        .font(.system(size: 16, weight: .bold))
                        .foregroundColor(Color(UIColor.label))
                        .lineLimit(3)
                        .fixedSize(horizontal: false, vertical: true)
                }
                .padding(.vertical, 14)
                .padding(.trailing, 16)

                Spacer(minLength: 0)
            }
        }
        .contentShape(Rectangle())
    }
}

// MARK: - News Row
struct NewsRowView: View {
    let item: NewsItem

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            // Thumbnail
            ZStack {
                RoundedRectangle(cornerRadius: 8)
                    .fill(item.imageColor)
                    .frame(width: 88, height: 68)
                Image(systemName: "photo.fill")
                    .font(.system(size: 20))
                    .foregroundColor(.white.opacity(0.28))
            }
            .padding(.leading, 16)
            .padding(.vertical, 14)

            // Title
            Text(item.title)
                .font(.system(size: 15, weight: .semibold))
                .foregroundColor(Color(UIColor.label))
                .lineLimit(3)
                .fixedSize(horizontal: false, vertical: true)
                .padding(.vertical, 14)
                .padding(.trailing, 16)

            Spacer(minLength: 0)
        }
        .contentShape(Rectangle())
        .background(Color(UIColor.systemBackground))
    }
}

#Preview {
    NewsListView()
}
