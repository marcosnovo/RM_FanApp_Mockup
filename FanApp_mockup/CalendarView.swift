import SwiftUI

struct CalendarView: View {
    @State private var selectedSegment: Int = 0
    @State private var selectedMonth: String = "Abril"
    @State private var selectedDay: Int = 15
    @State private var selectedMatch: Match? = MockMatches.bayernVsRM

    let months = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto"]
    let segments = ["Calendario", "Clasificación", "Plantilla"]

    var body: some View {
        NavigationStack {
            VStack(spacing: 0) {
                // Top: segment pills + filter icon
                CalendarSegmentBar(
                    segments: segments,
                    selected: $selectedSegment
                )
                .padding(.top, 12)
                .padding(.bottom, 8)

                if selectedSegment == 0 {

                    // Month horizontal scroll
                    MonthSelectorView(months: months, selected: $selectedMonth)

                    Divider()

                    // Calendar grid
                    CalendarGridView(
                        selectedDay: $selectedDay,
                        selectedMatch: $selectedMatch,
                        matchDays: MockMatches.aprilMatches
                    )

                    Divider()

                    // Selected match card pinned at bottom
                    if let match = selectedMatch {
                        MatchCardView(match: match)
                    } else {
                        NoMatchSelectedView()
                    }

                } else if selectedSegment == 1 {
                    ClasificacionView()
                } else {
                    PlantillaView()
                }
            }
            .background(Color(UIColor.systemBackground))
            .navigationBarHidden(true)
        }
    }
}

// MARK: - Segment Bar (pills style matching screenshot)
struct CalendarSegmentBar: View {
    let segments: [String]
    @Binding var selected: Int

    var body: some View {
        HStack(spacing: 0) {
            HStack(spacing: 6) {
                ForEach(segments.indices, id: \.self) { i in
                    Button {
                        withAnimation(.easeInOut(duration: 0.18)) { selected = i }
                    } label: {
                        Text(segments[i])
                            .font(.system(size: 14, weight: selected == i ? .bold : .regular))
                            .foregroundColor(selected == i ? .white : Color(UIColor.secondaryLabel))
                            .padding(.horizontal, 16)
                            .padding(.vertical, 9)
                            .background(selected == i ? RMTheme.primary : Color.clear)
                            .cornerRadius(22)
                    }
                }
            }
            .padding(.horizontal, 14)

            Spacer()

            // Filter icon
            Button {} label: {
                Image(systemName: "slider.horizontal.3")
                    .font(.system(size: 16, weight: .medium))
                    .foregroundColor(Color(UIColor.secondaryLabel))
                    .frame(width: 36, height: 36)
            }
            .padding(.trailing, 14)
        }
    }
}

// MARK: - Month Selector (underline indicator, no pills)
struct MonthSelectorView: View {
    let months: [String]
    @Binding var selected: String

    var body: some View {
        ScrollView(.horizontal, showsIndicators: false) {
            HStack(spacing: 24) {
                ForEach(months, id: \.self) { month in
                    Button {
                        withAnimation(.easeInOut(duration: 0.18)) { selected = month }
                    } label: {
                        VStack(spacing: 5) {
                            Text(month)
                                .font(.system(size: 14, weight: selected == month ? .semibold : .regular))
                                .foregroundColor(selected == month ? RMTheme.primary : Color(UIColor.secondaryLabel))

                            // Blue underline for selected
                            Rectangle()
                                .fill(selected == month ? RMTheme.primary : Color.clear)
                                .frame(height: 2)
                                .cornerRadius(1)
                        }
                    }
                }
            }
            .padding(.horizontal, 14)
            .padding(.vertical, 10)
        }
    }
}

// MARK: - Calendar Grid
struct CalendarGridView: View {
    @Binding var selectedDay: Int
    @Binding var selectedMatch: Match?
    let matchDays: [(day: Int, match: Match)]

    // April 2026 starts on Wednesday (offset 2 in Mon=0 system)
    let startOffset = 2
    let totalDays = 30
    let weekdays = ["L", "M", "X", "J", "V", "S", "D"]

    var body: some View {
        VStack(spacing: 0) {
            // Column headers
            HStack(spacing: 0) {
                ForEach(weekdays, id: \.self) { wd in
                    Text(wd)
                        .font(.system(size: 12, weight: .semibold))
                        .foregroundColor(Color(UIColor.tertiaryLabel))
                        .frame(maxWidth: .infinity)
                }
            }
            .padding(.horizontal, 8)
            .padding(.top, 10)
            .padding(.bottom, 6)

            // Rows
            let cells = buildCells()
            let rows = stride(from: 0, to: cells.count, by: 7).map {
                Array(cells[$0..<min($0 + 7, cells.count)])
            }

            ForEach(rows.indices, id: \.self) { rowIdx in
                HStack(spacing: 0) {
                    ForEach(0..<7) { colIdx in
                        if colIdx < rows[rowIdx].count {
                            let cell = rows[rowIdx][colIdx]
                            CalendarDayCell(
                                day: cell.day,
                                match: cell.matches.first,
                                isSelected: cell.day != 0 && cell.day == selectedDay
                            ) {
                                if cell.day != 0 {
                                    selectedDay = cell.day
                                    selectedMatch = cell.matches.first
                                }
                            }
                            .frame(maxWidth: .infinity)
                        } else {
                            Color.clear.frame(maxWidth: .infinity, minHeight: 52)
                        }
                    }
                }
                .padding(.horizontal, 4)
            }

            Spacer(minLength: 0)
        }
    }

    func buildCells() -> [CalendarDay] {
        var cells: [CalendarDay] = []
        for _ in 0..<startOffset { cells.append(CalendarDay(day: 0, matches: [])) }
        for d in 1...totalDays {
            let matches = matchDays.filter { $0.day == d }.map { $0.match }
            cells.append(CalendarDay(day: d, matches: matches))
        }
        return cells
    }
}

// MARK: - Calendar Day Cell
struct CalendarDayCell: View {
    let day: Int
    let match: Match?
    let isSelected: Bool
    let onTap: () -> Void

    var body: some View {
        Button(action: onTap) {
            VStack(spacing: 2) {
                ZStack {
                    // Blue circle ring for selected day
                    if isSelected {
                        Circle()
                            .stroke(RMTheme.primary, lineWidth: 2)
                            .frame(width: 36, height: 36)
                    }

                    if day == 0 {
                        Color.clear.frame(width: 36, height: 36)
                    } else if let m = match {
                        // Show opponent crest
                        let opponentTeam = m.homeTeam.name == "Real Madrid" ? m.awayTeam : m.homeTeam
                        ZStack {
                            Circle()
                                .fill(opponentTeam.color.opacity(0.14))
                                .frame(width: 32, height: 32)
                            Image(systemName: opponentTeam.symbol)
                                .font(.system(size: 14, weight: .bold))
                                .foregroundColor(opponentTeam.color)
                        }
                    } else {
                        Text("\(day)")
                            .font(.system(size: 14, weight: isSelected ? .semibold : .regular))
                            .foregroundColor(isSelected ? RMTheme.primary : Color(UIColor.label))
                    }
                }
                .frame(width: 36, height: 36)

                // Day number below crest (when match day)
                if match != nil && day != 0 {
                    Text("\(day)")
                        .font(.system(size: 10, weight: .medium))
                        .foregroundColor(isSelected ? RMTheme.primary : Color(UIColor.secondaryLabel))
                } else {
                    Color.clear.frame(height: 12)
                }
            }
            .frame(minHeight: 56)
        }
        .buttonStyle(.plain)
    }
}

// MARK: - Match Card
struct MatchCardView: View {
    let match: Match

    var body: some View {
        VStack(spacing: 0) {
            // Category + date header
            VStack(spacing: 4) {
                Text(match.category)
                    .font(.system(size: 12, weight: .semibold))
                    .foregroundColor(Color(UIColor.secondaryLabel))
                Text(match.dateString)
                    .font(.system(size: 14, weight: .semibold))
                    .foregroundColor(Color(UIColor.label))
            }
            .padding(.top, 16)
            .padding(.bottom, 12)

            // Teams
            HStack(alignment: .center, spacing: 0) {
                // Home team
                VStack(spacing: 6) {
                    MatchCrestView(color: match.homeTeam.color, symbol: match.homeTeam.symbol, size: 52)
                    Text(match.homeTeam.name)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color(UIColor.label))
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                        .frame(width: 85)
                }

                Spacer()

                // Calendar icon center
                ZStack {
                    RoundedRectangle(cornerRadius: 10)
                        .stroke(Color(UIColor.separator), lineWidth: 1)
                        .frame(width: 44, height: 40)
                    Image(systemName: "calendar.badge.plus")
                        .font(.system(size: 19))
                        .foregroundColor(Color(UIColor.secondaryLabel))
                }

                Spacer()

                // Away team
                VStack(spacing: 6) {
                    MatchCrestView(color: match.awayTeam.color, symbol: match.awayTeam.symbol, size: 52)
                    Text(match.awayTeam.name)
                        .font(.system(size: 12, weight: .medium))
                        .foregroundColor(Color(UIColor.label))
                        .multilineTextAlignment(.center)
                        .lineLimit(2)
                        .frame(width: 85)
                }
            }
            .padding(.horizontal, 28)
            .padding(.bottom, 16)

            // Área de partido button — outlined blue
            Button {} label: {
                Text("Área de partido")
                    .font(.system(size: 15, weight: .semibold))
                    .foregroundColor(RMTheme.primary)
                    .frame(maxWidth: .infinity)
                    .frame(height: 46)
                    .overlay(
                        RoundedRectangle(cornerRadius: 12)
                            .stroke(RMTheme.primary.opacity(0.50), lineWidth: 1.5)
                    )
            }
            .padding(.horizontal, 16)
            .padding(.bottom, 14)
        }
        .background(Color(UIColor.systemBackground))
    }
}

// MARK: - No match selected
struct NoMatchSelectedView: View {
    var body: some View {
        VStack {
            Text("Selecciona un día con partido")
                .font(.system(size: 14))
                .foregroundColor(Color(UIColor.secondaryLabel))
                .padding()
        }
        .frame(maxWidth: .infinity)
        .padding(.vertical, 20)
    }
}

// MARK: - Clasificación
struct ClasificacionView: View {
    let teams = ["Real Madrid", "Barcelona", "Atlético", "Villarreal", "Betis", "Athletic", "Osasuna", "Valencia"]
    let points = [82, 76, 70, 65, 59, 57, 52, 48]
    let played = [34, 34, 34, 34, 34, 34, 34, 34]

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 0) {
                // Header row
                HStack {
                    Text("Pos")
                        .frame(width: 36, alignment: .center)
                    Text("Club")
                        .frame(maxWidth: .infinity, alignment: .leading)
                    Text("PJ")
                        .frame(width: 32, alignment: .center)
                    Text("Pts")
                        .frame(width: 36, alignment: .center)
                }
                .font(.system(size: 11, weight: .semibold))
                .foregroundColor(Color(UIColor.tertiaryLabel))
                .padding(.horizontal, 16)
                .padding(.vertical, 10)

                Divider()

                ForEach(teams.indices, id: \.self) { i in
                    HStack(spacing: 0) {
                        Text("\(i + 1)")
                            .font(.system(size: 14, weight: i == 0 ? .bold : .regular))
                            .foregroundColor(i == 0 ? RMTheme.primary : Color(UIColor.label))
                            .frame(width: 36, alignment: .center)

                        HStack(spacing: 10) {
                            MatchCrestView(
                                color: i == 0 ? RMTheme.primary : Color(UIColor.secondaryLabel),
                                symbol: i == 0 ? "crown.fill" : "shield.fill",
                                size: 26
                            )
                            Text(teams[i])
                                .font(.system(size: 14, weight: i == 0 ? .semibold : .regular))
                                .foregroundColor(Color(UIColor.label))
                        }
                        .frame(maxWidth: .infinity, alignment: .leading)

                        Text("\(played[i])")
                            .font(.system(size: 14))
                            .foregroundColor(Color(UIColor.secondaryLabel))
                            .frame(width: 32, alignment: .center)

                        Text("\(points[i])")
                            .font(.system(size: 14, weight: .semibold))
                            .foregroundColor(i == 0 ? RMTheme.primary : Color(UIColor.label))
                            .frame(width: 36, alignment: .center)
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)
                    .background(i == 0 ? RMTheme.primary.opacity(0.05) : Color.clear)

                    Divider()
                }
            }
        }
    }
}

// MARK: - Plantilla
struct PlantillaView: View {
    let players: [(name: String, number: String, position: String)] = [
        ("Courtois", "1", "Portero"), ("Lunin", "13", "Portero"),
        ("Carvajal", "2", "Defensa"), ("Militão", "3", "Defensa"),
        ("Alaba", "4", "Defensa"), ("Nacho", "6", "Defensa"), ("Mendy", "23", "Defensa"),
        ("Modric", "10", "Centrocampista"), ("Bellingham", "5", "Centrocampista"),
        ("Valverde", "15", "Centrocampista"), ("Kroos", "8", "Centrocampista"),
        ("Vinicius", "7", "Delantero"), ("Rodrygo", "11", "Delantero"),
        ("Mbappé", "9", "Delantero")
    ]

    var body: some View {
        ScrollView(showsIndicators: false) {
            VStack(spacing: 0) {
                ForEach(players, id: \.name) { player in
                    HStack(spacing: 14) {
                        ZStack {
                            Circle()
                                .fill(RMTheme.primary.opacity(0.10))
                                .frame(width: 46, height: 46)
                            Text(player.number)
                                .font(.system(size: 17, weight: .bold))
                                .foregroundColor(RMTheme.primary)
                        }

                        VStack(alignment: .leading, spacing: 2) {
                            Text(player.name)
                                .font(.system(size: 15, weight: .semibold))
                                .foregroundColor(Color(UIColor.label))
                            Text(player.position)
                                .font(.system(size: 12, weight: .regular))
                                .foregroundColor(Color(UIColor.secondaryLabel))
                        }

                        Spacer()

                        Image(systemName: "chevron.right")
                            .font(.system(size: 12, weight: .medium))
                            .foregroundColor(Color(UIColor.tertiaryLabel))
                    }
                    .padding(.horizontal, 16)
                    .padding(.vertical, 12)

                    Divider()
                        .padding(.leading, 76)
                }
            }
        }
    }
}

#Preview {
    CalendarView()
}
