import SwiftUI

struct NewsDetailView: View {
    let item: NewsItem
    @Environment(\.dismiss) private var dismiss

    var body: some View {
        NavigationStack {
            ScrollView(showsIndicators: false) {
                VStack(alignment: .leading, spacing: 0) {

                    // Top bar: hamburger | RM logo + opponent badge | Acceder button
                    HStack(spacing: 12) {
                        Image(systemName: "line.3.horizontal")
                            .font(.system(size: 18, weight: .medium))
                            .foregroundColor(Color(UIColor.secondaryLabel))
                            .frame(width: 36)

                        // RM crown logo
                        ZStack {
                            Circle()
                                .fill(RMTheme.primary.opacity(0.10))
                                .frame(width: 38, height: 38)
                            Image(systemName: "crown.fill")
                                .font(.system(size: 16, weight: .bold))
                                .foregroundColor(RMTheme.primary)
                        }

                        // Opponent number badge
                        ZStack {
                            Circle()
                                .stroke(Color(UIColor.separator), lineWidth: 1.5)
                                .frame(width: 38, height: 38)
                            Text("15")
                                .font(.system(size: 15, weight: .bold))
                                .foregroundColor(Color(UIColor.label))
                        }

                        Spacer()

                        // Acceder button
                        Button {} label: {
                            HStack(spacing: 5) {
                                Image(systemName: "person")
                                    .font(.system(size: 12, weight: .medium))
                                Text("Acceder")
                                    .font(.system(size: 14, weight: .semibold))
                            }
                            .foregroundColor(RMTheme.primary)
                            .padding(.horizontal, 16)
                            .padding(.vertical, 8)
                            .overlay(
                                RoundedRectangle(cornerRadius: 22)
                                    .stroke(RMTheme.primary, lineWidth: 1.5)
                            )
                        }
                    }
                    .padding(.horizontal, 16)
                    .padding(.top, 12)
                    .padding(.bottom, 20)

                    // Headline — very large, bold
                    Text(item.title)
                        .font(.system(size: 28, weight: .bold))
                        .foregroundColor(Color(UIColor.label))
                        .lineSpacing(3)
                        .padding(.horizontal, 16)
                        .padding(.bottom, 16)

                    // Lead paragraph
                    Text(item.subtitle)
                        .font(.system(size: 17, weight: .regular))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                        .lineSpacing(5)
                        .padding(.horizontal, 16)
                        .padding(.bottom, 20)

                    // Hero image — full width, no horizontal inset
                    ZStack {
                        Rectangle()
                            .fill(item.imageColor)
                            .frame(maxWidth: .infinity)
                            .frame(height: 260)
                        Image(systemName: "figure.run")
                            .font(.system(size: 90, weight: .ultraLight))
                            .foregroundColor(.white.opacity(0.18))
                    }

                    // Caption
                    Text("\(item.category)  ·  \(item.date)  ·  \(item.author)")
                        .font(.system(size: 11, weight: .medium))
                        .foregroundColor(Color(UIColor.tertiaryLabel))
                        .tracking(0.5)
                        .textCase(.uppercase)
                        .padding(.horizontal, 16)
                        .padding(.top, 12)
                        .padding(.bottom, 20)

                    // Divider
                    Rectangle()
                        .fill(Color(UIColor.separator).opacity(0.5))
                        .frame(height: 0.5)
                        .padding(.horizontal, 16)
                        .padding(.bottom, 20)

                    // Body text
                    Text(item.body)
                        .font(.system(size: 17, weight: .regular))
                        .foregroundColor(Color(UIColor.label))
                        .lineSpacing(6)
                        .padding(.horizontal, 16)
                        .padding(.bottom, 50)
                }
            }
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button { dismiss() } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(Color(UIColor.secondaryLabel))
                            .frame(width: 28, height: 28)
                            .background(Color(UIColor.tertiarySystemFill))
                            .clipShape(Circle())
                    }
                }
            }
        }
    }
}

#Preview {
    NewsDetailView(item: MockNews.items[0])
}
