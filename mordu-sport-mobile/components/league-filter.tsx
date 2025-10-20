import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { useState } from "react"

const leagues = [
  { id: "top", name: "TOP" },
  { id: "nhl", name: "NHL" },
  { id: "nfl", name: "NFL" },
  { id: "mlb", name: "MLB" },
  { id: "nba", name: "NBA" },
  { id: "ncaa", name: "NCAA" },
  { id: "ufc", name: "UFC" },
]

export function LeagueFilter() {
  const [selectedLeague, setSelectedLeague] = useState("nhl")

  return (
    <View style={styles.container}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {leagues.map((league) => (
          <TouchableOpacity
            key={league.id}
            onPress={() => setSelectedLeague(league.id)}
            style={styles.button}
          >
            <Text
              style={[
                styles.buttonText,
                selectedLeague === league.id && styles.buttonTextActive
              ]}
            >
              {league.name}
            </Text>
            {selectedLeague === league.id && (
              <View style={styles.indicator} />
            )}
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'black',
  },
  scrollContent: {
    paddingHorizontal: 4,
  },
  button: {
    position: 'relative',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  buttonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
  },
  buttonTextActive: {
    color: '#000',
  },
  indicator: {
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: [{ translateX: -16 }],
    width: 32,
    height: 2,
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
})