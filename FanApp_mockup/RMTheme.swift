import SwiftUI

enum RMTheme {
    // MARK: - Colors
    static let primary = Color(red: 0.29, green: 0.24, blue: 0.91)       // blue/violet #4A3DE8
    static let primaryLight = Color(red: 0.42, green: 0.35, blue: 0.95)  // lighter variant
    static let darkHeader = Color(red: 0.10, green: 0.11, blue: 0.18)    // dark navy header
    static let darkHeaderSecondary = Color(red: 0.14, green: 0.15, blue: 0.24)
    static let background = Color(UIColor.systemBackground)
    static let secondaryBackground = Color(UIColor.secondarySystemBackground)
    static let separator = Color(UIColor.separator)
    static let textPrimary = Color(UIColor.label)
    static let textSecondary = Color(UIColor.secondaryLabel)
    static let textTertiary = Color(UIColor.tertiaryLabel)

    // MARK: - Gradient
    static let primaryGradient = LinearGradient(
        colors: [Color(red: 0.35, green: 0.27, blue: 0.90), Color(red: 0.50, green: 0.40, blue: 0.97)],
        startPoint: .leading,
        endPoint: .trailing
    )

    // MARK: - Dimensions
    static let cornerRadius: CGFloat = 12
    static let cardCornerRadius: CGFloat = 16
    static let tabBarHeight: CGFloat = 83
    static let horizontalPadding: CGFloat = 16

    // MARK: - Typography helpers
    static func titleFont(_ size: CGFloat = 22) -> Font { .system(size: size, weight: .bold) }
    static func headlineFont(_ size: CGFloat = 17) -> Font { .system(size: size, weight: .semibold) }
    static func bodyFont(_ size: CGFloat = 15) -> Font { .system(size: size, weight: .regular) }
    static func captionFont(_ size: CGFloat = 12) -> Font { .system(size: size, weight: .medium) }
}
