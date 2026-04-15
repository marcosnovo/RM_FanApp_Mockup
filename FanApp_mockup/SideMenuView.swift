import SwiftUI

struct SideMenuView: View {
    @Binding var isPresented: Bool

    var body: some View {
        ZStack {
            // Dim overlay
            Color.black.opacity(0.40)
                .ignoresSafeArea()
                .onTapGesture {
                    withAnimation(.easeInOut(duration: 0.22)) { isPresented = false }
                }

            // Panel
            HStack(spacing: 0) {
                MenuPanelContent(isPresented: $isPresented)
                    .frame(width: min(UIScreen.main.bounds.width * 0.85, 340))
                Spacer()
            }
        }
    }
}

// MARK: - Menu Panel Content
struct MenuPanelContent: View {
    @Binding var isPresented: Bool

    var body: some View {
        ZStack(alignment: .topLeading) {
            Color(UIColor.systemBackground)
                .ignoresSafeArea()

            VStack(alignment: .leading, spacing: 0) {
                // Safe area spacer
                Color.clear.frame(height: 56)

                // Close button
                Button {
                    withAnimation(.easeInOut(duration: 0.22)) { isPresented = false }
                } label: {
                    Image(systemName: "xmark")
                        .font(.system(size: 17, weight: .medium))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                        .frame(width: 34, height: 34)
                }
                .padding(.leading, 20)
                .padding(.bottom, 28)

                // "¡Hola!" — very bold, large
                Text("¡Hola!")
                    .font(.system(size: 44, weight: .black))
                    .foregroundColor(Color(UIColor.label))
                    .padding(.horizontal, 22)
                    .padding(.bottom, 28)

                // Login CTA
                Button {} label: {
                    HStack {
                        Spacer()
                        Text("Inicia sesión o regístrate")
                            .font(.system(size: 16, weight: .semibold))
                            .foregroundColor(.white)
                        Image(systemName: "arrow.right")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(.white)
                        Spacer()
                    }
                    .frame(height: 56)
                    .background(
                        LinearGradient(
                            colors: [Color(red: 0.38, green: 0.30, blue: 0.92), Color(red: 0.52, green: 0.44, blue: 0.97)],
                            startPoint: .leading,
                            endPoint: .trailing
                        )
                    )
                    .cornerRadius(16)
                }
                .padding(.horizontal, 22)
                .padding(.bottom, 32)

                // Menu items
                Divider()

                MenuRowItem(title: "Configuración de la app", icon: "gear")
                Divider()
                MenuRowItem(title: "Términos y condiciones", icon: "doc.text")
                Divider()

                // Feedback section
                VStack(spacing: 16) {
                    Text("Cuéntanos tu opinión")
                        .font(.system(size: 16, weight: .regular))
                        .foregroundColor(Color(UIColor.label))
                        .frame(maxWidth: .infinity)
                        .multilineTextAlignment(.center)

                    HStack(spacing: 16) {
                        Spacer()
                        FeedbackBtn(icon: "hand.thumbsdown")
                        FeedbackBtn(icon: "hand.thumbsup")
                        Spacer()
                    }
                }
                .padding(.top, 28)
                .padding(.bottom, 28)

                Spacer()

                // Sponsor logos at bottom
                HStack(spacing: 22) {
                    // Emirates
                    VStack(spacing: 3) {
                        Image(systemName: "airplane")
                            .font(.system(size: 20))
                            .foregroundColor(Color(red: 0.12, green: 0.28, blue: 0.52))
                        Text("Emirates")
                            .font(.system(size: 13, weight: .semibold))
                            .foregroundColor(Color(red: 0.12, green: 0.28, blue: 0.52))
                    }

                    // Adidas three-stripes
                    HStack(alignment: .bottom, spacing: 3) {
                        ForEach(0..<3) { i in
                            Rectangle()
                                .fill(Color(UIColor.label))
                                .frame(width: 7, height: 18 + CGFloat(i) * 4)
                        }
                    }
                }
                .padding(.horizontal, 22)
                .padding(.bottom, 14)

                // Version
                Text("10.2.11 (Build 15970)")
                    .font(.system(size: 12, weight: .regular))
                    .foregroundColor(Color(UIColor.tertiaryLabel))
                    .padding(.horizontal, 22)
                    .padding(.bottom, 36)
            }
        }
    }
}

// MARK: - Menu Row Item
struct MenuRowItem: View {
    let title: String
    let icon: String

    var body: some View {
        Button {} label: {
            HStack {
                Text(title)
                    .font(.system(size: 17, weight: .regular))
                    .foregroundColor(Color(UIColor.label))
                Spacer()
                Image(systemName: "chevron.right")
                    .font(.system(size: 13, weight: .medium))
                    .foregroundColor(RMTheme.primary)
            }
            .padding(.horizontal, 22)
            .padding(.vertical, 17)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Feedback Button
struct FeedbackBtn: View {
    let icon: String

    var body: some View {
        ZStack {
            RoundedRectangle(cornerRadius: 16)
                .fill(Color(UIColor.secondarySystemBackground))
                .frame(width: 62, height: 62)
            Image(systemName: icon)
                .font(.system(size: 26))
                .foregroundColor(RMTheme.primary)
        }
    }
}

#Preview {
    SideMenuView(isPresented: .constant(true))
}
