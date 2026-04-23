import SwiftUI

// MARK: - Selección de pestaña de equipo
//
// Valor almacenado en `@AppStorage`:
//   "all" → pestaña "Todo"
//   cualquier raw value de `TeamCategory` → pestaña de ese equipo

enum HoyTeamSelection: Equatable {
    case all
    case team(TeamCategory)

    static let storageKey = "hoy_v2_selected_team"

    init(storageValue: String) {
        if let cat = TeamCategory(rawValue: storageValue) {
            self = .team(cat)
        } else {
            self = .all
        }
    }

    var storageValue: String {
        switch self {
        case .all: return "all"
        case .team(let c): return c.rawValue
        }
    }
}

// MARK: - Preferencias de visibilidad de pestañas
//
// Usamos claves separadas en `@AppStorage` porque SwiftUI no admite
// bindings dinámicos sobre un diccionario persistido. La pestaña "Todo"
// no es configurable: siempre se muestra.

enum HoyTabsPrefs {
    static let showMensKey    = "hoy_v2_show_mens"
    static let showWomensKey  = "hoy_v2_show_womens"
    static let showBasketKey  = "hoy_v2_show_basket"
    static let emojiModeKey   = "hoy_v2_emoji_mode"
}

// MARK: - Barra de pestañas

struct HoyTeamTabsBar: View {
    @Binding var selection: HoyTeamSelection
    let visibleTeams: [TeamCategory]
    let useEmoji: Bool
    let onEditTabs: (() -> Void)?

    private func label(for team: TeamCategory) -> String {
        useEmoji ? team.emojiLabel : team.textLabel
    }

    var body: some View {
        ZStack(alignment: .bottom) {
            Color(red: 0.11, green: 0.12, blue: 0.22)

            HStack(spacing: 0) {
                ScrollView(.horizontal, showsIndicators: false) {
                    HStack(spacing: 22) {
                        tabButton(title: "Todo",
                                  isSelected: selection == .all,
                                  action: { selection = .all })

                        ForEach(visibleTeams) { team in
                            tabButton(title: label(for: team),
                                      isSelected: selection == .team(team),
                                      action: { selection = .team(team) })
                        }
                    }
                    .padding(.horizontal, 18)
                }

                if let onEditTabs {
                    Button(action: onEditTabs) {
                        Image(systemName: "slider.horizontal.3")
                            .font(.system(size: 15, weight: .semibold))
                            .foregroundColor(.white.opacity(0.80))
                            .frame(width: 44, height: 44)
                    }
                    .background(
                        LinearGradient(
                            colors: [Color(red: 0.11, green: 0.12, blue: 0.22).opacity(0),
                                     Color(red: 0.11, green: 0.12, blue: 0.22)],
                            startPoint: .leading, endPoint: .trailing
                        )
                    )
                    .accessibilityLabel("Editar pestañas")
                }
            }

            Rectangle()
                .fill(Color.white.opacity(0.08))
                .frame(height: 0.5)
        }
        .frame(height: 44)
    }

    @ViewBuilder
    private func tabButton(title: String, isSelected: Bool, action: @escaping () -> Void) -> some View {
        Button {
            withAnimation(.easeInOut(duration: 0.18)) { action() }
        } label: {
            VStack(spacing: 4) {
                Text(title)
                    .font(.system(size: 14, weight: isSelected ? .semibold : .regular))
                    .foregroundColor(isSelected ? .white : .white.opacity(0.55))
                    .fixedSize()
                Capsule()
                    .fill(isSelected ? Color.white : Color.clear)
                    .frame(height: 2.5)
            }
            .frame(minWidth: 40)
        }
    }
}

// MARK: - Hoja del editor de pestañas

struct TeamTabsEditorSheet: View {
    @Environment(\.dismiss) private var dismiss

    @AppStorage(HoyTabsPrefs.showMensKey)   private var showMens: Bool   = true
    @AppStorage(HoyTabsPrefs.showWomensKey) private var showWomens: Bool = true
    @AppStorage(HoyTabsPrefs.showBasketKey) private var showBasket: Bool = true
    @AppStorage(HoyTabsPrefs.emojiModeKey)  private var emojiMode: Bool  = FeatureFlags.useEmojiTeamTabsByDefault

    var body: some View {
        NavigationStack {
            List {
                Section {
                    Toggle(isOn: $showMens) {
                        tabLabel(.mensFootball)
                    }
                    Toggle(isOn: $showWomens) {
                        tabLabel(.womensFootball)
                    }
                    Toggle(isOn: $showBasket) {
                        tabLabel(.basketball)
                    }
                } header: {
                    Text("Pestañas visibles en Hoy")
                } footer: {
                    Text("La pestaña «Todo» siempre está activa.")
                }

                Section {
                    Toggle("Mostrar emojis en las pestañas", isOn: $emojiMode)
                } header: {
                    Text("Apariencia")
                } footer: {
                    Text("Cambia «Fútbol masc.» por «⚽️ Masculino», etc. " +
                         "Ocupa un poco más de ancho pero es más visual.")
                }
            }
            .navigationTitle("Editar pestañas")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .topBarTrailing) {
                    Button("Hecho") { dismiss() }
                        .font(.system(size: 16, weight: .semibold))
                }
            }
        }
    }

    @ViewBuilder
    private func tabLabel(_ cat: TeamCategory) -> some View {
        HStack(spacing: 10) {
            Text(emojiMode ? cat.emojiLabel : cat.textLabel)
                .font(.system(size: 16))
            Spacer()
            Text(cat.sectionTitle)
                .font(.system(size: 12))
                .foregroundColor(Color(UIColor.tertiaryLabel))
        }
    }
}

// MARK: - Single match card (usada en pestañas de un único equipo)

struct SingleMatchCard: View {
    let match: MatchHeaderData

    var body: some View {
        ZStack {
            Color(red: 0.11, green: 0.12, blue: 0.22)
            MatchCarouselCard(match: match)
        }
        .frame(height: 210)
    }
}

// MARK: - Empty state para pestañas sin partidos

struct TeamEmptyState: View {
    let category: TeamCategory

    var body: some View {
        ZStack {
            Color(red: 0.11, green: 0.12, blue: 0.22)
            VStack(spacing: 10) {
                Image(systemName: "sparkles")
                    .font(.system(size: 26))
                    .foregroundColor(.white.opacity(0.55))
                Text("No hay partidos próximos")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(.white.opacity(0.85))
                Text(category.sectionTitle)
                    .font(.system(size: 12))
                    .foregroundColor(.white.opacity(0.45))
            }
        }
        .frame(height: 210)
    }
}

#Preview("Editor") {
    TeamTabsEditorSheet()
}
