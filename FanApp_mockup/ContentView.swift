import SwiftUI

struct ContentView: View {
    @State private var selectedTab: Int = 0
    @State private var showSideMenu: Bool = false

    var body: some View {
        ZStack {
            TabView(selection: $selectedTab) {
                HomeView(showSideMenu: $showSideMenu)
                    .tabItem {
                        Label("Hoy", systemImage: selectedTab == 0 ? "tshirt.fill" : "tshirt")
                    }
                    .tag(0)

                // Noticias — el filtro por categoría se controla desde
                // `FeatureFlags.enableNewsFilter` (ver FeatureFlags.swift).
                // Cambia ese flag a `true` para habilitar la barra de filtros.
                NewsListView()
                    .tabItem {
                        Label("Noticias", systemImage: selectedTab == 1 ? "newspaper.fill" : "newspaper")
                    }
                    .tag(1)
                    // Ejemplo de uso alternativo del flag: un badge en el tab
                    // cuando la feature está activa (descomentar si se quiere
                    // destacar el tab mientras el experimento está encendido).
                    // .badge(FeatureFlags.enableNewsFilter ? "β" : nil)

                CalendarView()
                    .tabItem {
                        Label("Calendario", systemImage: "calendar")
                    }
                    .tag(2)

                RMTVView()
                    .tabItem {
                        Label("RMTV", systemImage: selectedTab == 3 ? "play.rectangle.fill" : "play.rectangle")
                    }
                    .tag(3)

                StoreView()
                    .tabItem {
                        Label("Tienda", systemImage: selectedTab == 4 ? "bag.fill" : "bag")
                    }
                    .tag(4)
            }
            .tint(RMTheme.primary)
            // Ensure tab bar background is always white/opaque
            .onAppear {
                let appearance = UITabBarAppearance()
                appearance.configureWithOpaqueBackground()
                appearance.backgroundColor = .systemBackground
                // Remove top separator, use a subtle shadow instead
                appearance.shadowImage = UIImage()
                appearance.shadowColor = .clear

                // Item appearance
                let itemAppearance = UITabBarItemAppearance()
                itemAppearance.normal.iconColor = UIColor.secondaryLabel
                itemAppearance.normal.titleTextAttributes = [.foregroundColor: UIColor.secondaryLabel]
                itemAppearance.selected.iconColor = UIColor(Color(red: 0.29, green: 0.24, blue: 0.91))
                itemAppearance.selected.titleTextAttributes = [.foregroundColor: UIColor(Color(red: 0.29, green: 0.24, blue: 0.91))]

                appearance.stackedLayoutAppearance = itemAppearance
                appearance.inlineLayoutAppearance = itemAppearance
                appearance.compactInlineLayoutAppearance = itemAppearance

                UITabBar.appearance().standardAppearance = appearance
                UITabBar.appearance().scrollEdgeAppearance = appearance

                // Subtle top line
                UITabBar.appearance().layer.borderWidth = 0
            }

            // Side menu overlay
            if showSideMenu {
                SideMenuView(isPresented: $showSideMenu)
                    .transition(.move(edge: .leading).combined(with: .opacity))
                    .zIndex(10)
            }
        }
        .animation(.easeInOut(duration: 0.22), value: showSideMenu)
    }
}

#Preview {
    ContentView()
}
