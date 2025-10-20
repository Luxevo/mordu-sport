import { View, Text, Image, StyleSheet } from "react-native"
import { MaterialCommunityIcons } from '@expo/vector-icons'
import type { Match } from "@/lib/types/hockey"

export function MatchBanner({ match }: { match: Match }) {
  const isLive = match.status === "live"

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.leagueText}>
            {match.league} {match.period && `• ${match.period}`}
          </Text>
          {isLive && match.timeRemaining && (
            <Text style={styles.liveTime}>{match.timeRemaining}</Text>
          )}
        </View>

        {/* Teams and Scores */}
        <View style={styles.matchContainer}>
          {/* Away Team */}
          <View style={styles.teamContainer}>
            <Image 
              source={{ uri: match.awayTeam.logo || "https://via.placeholder.com/40" }}
              style={styles.logo}
            />
            <Text style={styles.teamName}>
              {match.awayTeam.abbr || match.awayTeam.name}
            </Text>
            {match.awayTeam.record && (
              <Text style={styles.record}>{match.awayTeam.record}</Text>
            )}
          </View>

          {/* Away Score */}
          <Text style={styles.score}>
            {match.awayTeam.score !== undefined ? match.awayTeam.score : '-'}
          </Text>

          {/* Time/Status */}
          <View style={styles.timeContainer}>
            {isLive && match.period ? (
              <>
                <Text style={styles.livePeriod}>{match.period}</Text>
                <Text style={styles.timeText}>{match.timeRemaining || 'En direct'}</Text>
              </>
            ) : (
              <>
                <Text style={styles.statusText}>
                  {match.status === 'finished' ? 'Terminé' : match.time}
                </Text>
                <Text style={styles.dateText}>{match.date}</Text>
              </>
            )}
          </View>

          {/* Home Score */}
          <Text style={styles.score}>
            {match.homeTeam.score !== undefined ? match.homeTeam.score : '-'}
          </Text>

          {/* Home Team */}
          <View style={styles.teamContainer}>
            <Image 
              source={{ uri: match.homeTeam.logo || "https://via.placeholder.com/40" }}
              style={styles.logo}
            />
            <Text style={styles.teamName}>
              {match.homeTeam.abbr || match.homeTeam.name}
            </Text>
            {match.homeTeam.record && (
              <Text style={styles.record}>{match.homeTeam.record}</Text>
            )}
          </View>
        </View>

        {/* Odds */}
        {match.odds && match.status !== 'finished' && (
          <View style={styles.oddsContainer}>
            <MaterialCommunityIcons name="trending-up" size={16} color="#3b82f6" />
            <Text style={styles.oddsText}>
              Cote {match.odds.bookmaker}: {match.odds.home} / {match.odds.away}
            </Text>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
  },
  content: {
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  leagueText: {
    fontSize: 12,
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#6b7280',
  },
  liveTime: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#00FF39',
  },
  matchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  teamContainer: {
    alignItems: 'center',
    gap: 4,
    flex: 1,
  },
  logo: {
    width: 40,
    height: 40,
  },
  teamName: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
    textAlign: 'center',
  },
  record: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  score: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
    marginHorizontal: 8,
  },
  timeContainer: {
    alignItems: 'center',
    minWidth: 80,
  },
  livePeriod: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00FF39',
  },
  timeText: {
    fontSize: 12,
    color: '#6b7280',
  },
  statusText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  dateText: {
    fontSize: 12,
    color: '#6b7280',
  },
  oddsContainer: {
    marginTop: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(59, 130, 246, 0.1)',
    paddingVertical: 8,
    borderRadius: 8,
  },
  oddsText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
  },
})