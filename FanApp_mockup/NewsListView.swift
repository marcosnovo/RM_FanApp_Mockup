import SwiftUI

struct NewsListView: View {
    @State private var selectedNews: NewsItem? = nil

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

                    // First item: FEATURED — larger card
                    if let first = MockNews.items.first {
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
                    ForEach(MockNews.items.dropFirst()) { item in
                        Button { selectedNews = item } label: {
                            NewsRowView(item: item)
                        }
                        .buttonStyle(.plain)

                        Divider()
                            .padding(.leading, 16 + 88 + 12)
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
