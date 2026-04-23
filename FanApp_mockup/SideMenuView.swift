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
                Group {
                    if FeatureFlags.enableSideMenuV2 {
                        MenuPanelContentV2(isPresented: $isPresented)
                    } else {
                        MenuPanelContent(isPresented: $isPresented)
                    }
                }
                .frame(width: min(UIScreen.main.bounds.width * 0.85, 340))
                Spacer()
            }
        }
    }
}

// MARK: - Menu Panel Content (legacy)
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

// MARK: - Menu Row Item (legacy)
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

// ╭──────────────────────────────────────────────────────────────╮
// │                    SIDE MENU V2 (scalable)                   │
// ╰──────────────────────────────────────────────────────────────╯
//
// Motivación: el menú antiguo crece como una lista plana y se
// satura rápido. V2 introduce:
//  · Header compacto con avatar + saludo.
//  · Fila de accesos rápidos (chips) para las acciones más
//    frecuentes (Carnet, Entradas, Radio, Partidos cerca).
//  · Secciones agrupadas con cabeceras en MAYÚSCULAS pequeñas:
//    TU CUENTA · PREFERENCIAS · APP · AYUDA · LEGAL.
//  · Filas con icono + título + valor opcional + chevron.
//  · Pie con feedback compacto, sponsors y versión.
//
// Añadir una nueva funcionalidad ya no añade ruido: se enchufa en
// la sección adecuada.

// MARK: - Data model para las filas del menú
struct MenuItemData: Identifiable {
    let id = UUID()
    let icon: String
    let title: String
    /// Valor pequeño mostrado a la derecha (p. ej. "es", "Claro").
    var trailing: String? = nil
    /// Badge numérico (p. ej. notificaciones sin leer).
    var badge: Int? = nil
    var action: (() -> Void)? = nil
}

struct MenuSectionData: Identifiable {
    let id = UUID()
    let title: String
    let items: [MenuItemData]
}

// MARK: - Menu Panel V2
struct MenuPanelContentV2: View {
    @Binding var isPresented: Bool
    @State private var showTabsEditor: Bool = false
    @State private var searchQuery: String = ""

    private var sections: [MenuSectionData] {
        var preferences: [MenuItemData] = [
            MenuItemData(icon: "star.circle", title: "Equipos favoritos"),
            MenuItemData(icon: "bell.badge", title: "Notificaciones", badge: 3),
            MenuItemData(icon: "globe", title: "Idioma", trailing: "Español"),
            MenuItemData(icon: "circle.lefthalf.filled", title: "Apariencia", trailing: "Sistema")
        ]
        if FeatureFlags.enableHoyTeamTabs && FeatureFlags.enableTeamTabsEditor {
            preferences.append(
                MenuItemData(icon: "slider.horizontal.3",
                             title: "Editar pestañas de Hoy",
                             action: { showTabsEditor = true })
            )
        }

        return [
            MenuSectionData(title: "Tu cuenta", items: [
                MenuItemData(icon: "person.crop.circle", title: "Mi perfil"),
                MenuItemData(icon: "ticket", title: "Mis entradas"),
                MenuItemData(icon: "creditcard", title: "Carnet digital"),
                MenuItemData(icon: "star.circle.fill", title: "Socios & Madridistas")
            ]),
            MenuSectionData(title: "Preferencias", items: preferences),
            MenuSectionData(title: "App", items: [
                MenuItemData(icon: "gear", title: "Configuración de la app"),
                MenuItemData(icon: "sparkles", title: "Novedades"),
                MenuItemData(icon: "star.bubble", title: "Valorar la app")
            ]),
            MenuSectionData(title: "Ayuda", items: [
                MenuItemData(icon: "questionmark.circle", title: "Centro de ayuda"),
                MenuItemData(icon: "envelope", title: "Contacto"),
                MenuItemData(icon: "hand.thumbsup", title: "Danos tu opinión")
            ]),
            MenuSectionData(title: "Legal", items: [
                MenuItemData(icon: "doc.text", title: "Términos y condiciones"),
                MenuItemData(icon: "lock.shield", title: "Privacidad"),
                MenuItemData(icon: "checkerboard.shield", title: "Cookies")
            ])
        ]
    }

    private var filteredSections: [MenuSectionData] {
        let q = searchQuery.trimmingCharacters(in: .whitespaces).lowercased()
        guard !q.isEmpty else { return sections }
        return sections.compactMap { sec in
            let items = sec.items.filter { $0.title.lowercased().contains(q) }
            return items.isEmpty ? nil : MenuSectionData(title: sec.title, items: items)
        }
    }

    var body: some View {
        ZStack(alignment: .topLeading) {
            Color(UIColor.systemBackground)
                .ignoresSafeArea()

            VStack(spacing: 0) {
                // Top bar
                HStack {
                    Button {
                        withAnimation(.easeInOut(duration: 0.22)) { isPresented = false }
                    } label: {
                        Image(systemName: "xmark")
                            .font(.system(size: 16, weight: .medium))
                            .foregroundColor(Color(UIColor.secondaryLabel))
                            .frame(width: 34, height: 34)
                            .background(Color(UIColor.secondarySystemBackground))
                            .clipShape(Circle())
                    }
                    Spacer()
                    Text("Tu área")
                        .font(.system(size: 13, weight: .semibold))
                        .foregroundColor(Color(UIColor.tertiaryLabel))
                    Spacer()
                    Color.clear.frame(width: 34, height: 34)
                }
                .padding(.horizontal, 16)
                .padding(.top, 56)
                .padding(.bottom, 16)

                ScrollView(showsIndicators: false) {
                    VStack(alignment: .leading, spacing: 0) {
                        // Profile header
                        profileHeader
                            .padding(.horizontal, 20)
                            .padding(.bottom, 18)

                        // Search
                        searchField
                            .padding(.horizontal, 16)
                            .padding(.bottom, 18)

                        if searchQuery.isEmpty {
                            quickActions
                                .padding(.bottom, 8)
                        }

                        // Sections
                        LazyVStack(alignment: .leading, spacing: 8) {
                            ForEach(filteredSections) { section in
                                MenuSectionView(section: section)
                            }
                        }
                        .padding(.horizontal, 12)
                        .padding(.bottom, 18)

                        footer
                            .padding(.horizontal, 20)
                            .padding(.bottom, 28)
                    }
                }
            }
        }
        .sheet(isPresented: $showTabsEditor) {
            if FeatureFlags.enableHoyTeamTabs && FeatureFlags.enableTeamTabsEditor {
                TeamTabsEditorSheet()
            }
        }
    }

    // MARK: Subviews

    private var profileHeader: some View {
        VStack(alignment: .leading, spacing: 10) {
            HStack(spacing: 14) {
                ZStack {
                    Circle()
                        .fill(RMTheme.primaryGradient)
                        .frame(width: 54, height: 54)
                    Image(systemName: "person.fill")
                        .font(.system(size: 26))
                        .foregroundColor(.white.opacity(0.95))
                }
                VStack(alignment: .leading, spacing: 2) {
                    Text("¡Hola!")
                        .font(.system(size: 24, weight: .heavy))
                        .foregroundColor(Color(UIColor.label))
                    Text("Inicia sesión para personalizar tu experiencia")
                        .font(.system(size: 12))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                        .lineLimit(2)
                }
            }

            Button {} label: {
                HStack(spacing: 6) {
                    Text("Inicia sesión o regístrate")
                        .font(.system(size: 14, weight: .semibold))
                    Image(systemName: "arrow.right")
                        .font(.system(size: 12, weight: .semibold))
                }
                .foregroundColor(.white)
                .frame(maxWidth: .infinity)
                .frame(height: 44)
                .background(RMTheme.primaryGradient)
                .cornerRadius(12)
            }
        }
    }

    private var searchField: some View {
        HStack(spacing: 8) {
            Image(systemName: "magnifyingglass")
                .font(.system(size: 14, weight: .medium))
                .foregroundColor(Color(UIColor.tertiaryLabel))
            TextField("Buscar en ajustes", text: $searchQuery)
                .font(.system(size: 15))
            if !searchQuery.isEmpty {
                Button { searchQuery = "" } label: {
                    Image(systemName: "xmark.circle.fill")
                        .font(.system(size: 14))
                        .foregroundColor(Color(UIColor.tertiaryLabel))
                }
            }
        }
        .padding(.horizontal, 12)
        .frame(height: 40)
        .background(Color(UIColor.secondarySystemBackground))
        .cornerRadius(10)
    }

    private var quickActions: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 10) {
                QuickAction(icon: "creditcard.fill", title: "Carnet")
                QuickAction(icon: "ticket.fill", title: "Entradas")
                QuickAction(icon: "antenna.radiowaves.left.and.right", title: "Radio")
                QuickAction(icon: "mappin.and.ellipse", title: "Cerca")
                QuickAction(icon: "bag.fill", title: "Tienda")
            }
            .padding(.horizontal, 16)
            .padding(.vertical, 4)
        }
    }

    private var footer: some View {
        VStack(alignment: .leading, spacing: 14) {
            Divider()
            HStack(spacing: 22) {
                VStack(spacing: 3) {
                    Image(systemName: "airplane")
                        .font(.system(size: 18))
                        .foregroundColor(Color(red: 0.12, green: 0.28, blue: 0.52))
                    Text("Emirates")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(Color(red: 0.12, green: 0.28, blue: 0.52))
                }
                HStack(alignment: .bottom, spacing: 3) {
                    ForEach(0..<3) { i in
                        Rectangle()
                            .fill(Color(UIColor.label))
                            .frame(width: 6, height: 14 + CGFloat(i) * 3)
                    }
                }
                Spacer()
                Text("10.2.11 (15970)")
                    .font(.system(size: 11))
                    .foregroundColor(Color(UIColor.tertiaryLabel))
            }
        }
    }
}

// MARK: - Quick Action chip
struct QuickAction: View {
    let icon: String
    let title: String

    var body: some View {
        Button {} label: {
            VStack(spacing: 6) {
                ZStack {
                    RoundedRectangle(cornerRadius: 14, style: .continuous)
                        .fill(Color(UIColor.secondarySystemBackground))
                        .frame(width: 64, height: 58)
                    Image(systemName: icon)
                        .font(.system(size: 20, weight: .medium))
                        .foregroundColor(RMTheme.primary)
                }
                Text(title)
                    .font(.system(size: 11, weight: .medium))
                    .foregroundColor(Color(UIColor.secondaryLabel))
            }
            .frame(width: 68)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Section container
struct MenuSectionView: View {
    let section: MenuSectionData

    var body: some View {
        VStack(alignment: .leading, spacing: 6) {
            Text(section.title.uppercased())
                .font(.system(size: 11, weight: .semibold))
                .tracking(0.8)
                .foregroundColor(Color(UIColor.tertiaryLabel))
                .padding(.horizontal, 10)
                .padding(.top, 10)

            VStack(spacing: 0) {
                ForEach(Array(section.items.enumerated()), id: \.element.id) { idx, item in
                    MenuRowV2(item: item)
                    if idx < section.items.count - 1 {
                        Divider().padding(.leading, 48)
                    }
                }
            }
            .background(Color(UIColor.secondarySystemBackground))
            .cornerRadius(14)
        }
    }
}

// MARK: - V2 row
struct MenuRowV2: View {
    let item: MenuItemData

    var body: some View {
        Button { item.action?() } label: {
            HStack(spacing: 14) {
                ZStack {
                    RoundedRectangle(cornerRadius: 8)
                        .fill(RMTheme.primary.opacity(0.12))
                        .frame(width: 30, height: 30)
                    Image(systemName: item.icon)
                        .font(.system(size: 14, weight: .medium))
                        .foregroundColor(RMTheme.primary)
                }
                Text(item.title)
                    .font(.system(size: 15))
                    .foregroundColor(Color(UIColor.label))
                Spacer(minLength: 8)
                if let badge = item.badge {
                    Text("\(badge)")
                        .font(.system(size: 11, weight: .semibold))
                        .foregroundColor(.white)
                        .padding(.horizontal, 7).padding(.vertical, 2)
                        .background(Color.red)
                        .clipShape(Capsule())
                }
                if let trailing = item.trailing {
                    Text(trailing)
                        .font(.system(size: 13))
                        .foregroundColor(Color(UIColor.tertiaryLabel))
                }
                Image(systemName: "chevron.right")
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(Color(UIColor.tertiaryLabel))
            }
            .padding(.horizontal, 12)
            .padding(.vertical, 12)
            .contentShape(Rectangle())
        }
        .buttonStyle(.plain)
    }
}

#Preview {
    SideMenuView(isPresented: .constant(true))
}
