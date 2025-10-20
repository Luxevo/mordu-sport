import { View, Text, Image, ActivityIndicator, StyleSheet } from "react-native"
import { MatchCard } from "@/components/match-card"
import { useNHLMatches } from "@/lib/hooks/useNHLData"
import { useNBAMatches } from "@/lib/hooks/useNBAData"
import { useNFLMatches } from "@/lib/hooks/useNFLData"

interface MatchListProps {
  selectedDate: Date
}

export function MatchList({ selectedDate }: MatchListProps) {
  const { matches: nhlMatches, standings: nhlStandings, loading: nhlLoading, error: nhlError } = useNHLMatches(selectedDate)
  const { matches: nbaMatches, loading: nbaLoading, error: nbaError } = useNBAMatches(selectedDate)
  const { matches: nflMatches, loading: nflLoading, error: nflError } = useNFLMatches(selectedDate)

  const loading = nhlLoading || nbaLoading || nflLoading
  const error = nhlError || nbaError || nflError

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement des matchs...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorTitle}>Erreur lors du chargement</Text>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  const hasMatches = nhlMatches.length > 0 || nbaMatches.length > 0 || nflMatches.length > 0

  return (
    <View style={styles.container}>
      {/* NHL Section */}
      {nhlMatches.length > 0 && (
        <View>
          <View style={styles.leagueHeader}>
            <Image 
              source={require('../public/NHL-Logo.png')} 
              style={styles.leagueLogo} 
            />
            <Text style={styles.leagueTitle}>NHL</Text>
          </View>
          <View>
            {nhlMatches.map((match, index) => (
              <MatchCard key={`nhl-${match.id || index}`} match={match} standings={nhlStandings} />
            ))}
          </View>
        </View>
      )}

      {/* NBA Section */}
      {nbaMatches.length > 0 && (
        <View>
          <View style={styles.leagueHeader}>
            <Image 
              source={require('../public/nba-logo-transparent.png')} 
              style={styles.leagueLogo}
            />
            <Text style={styles.leagueTitle}>NBA</Text>
          </View>
          <View>
            {nbaMatches.map((match, index) => (
              <MatchCard key={`nba-${match.id || index}`} match={match} standings={nhlStandings} />
            ))}
          </View>
        </View>
      )}

      {/* NFL Section */}
      {nflMatches.length > 0 && (
        <View>
          <View style={styles.leagueHeader}>
            <Image 
              source={require('../public/nflLogo.png')} 
              style={styles.leagueLogo}
            />
            <Text style={styles.leagueTitle}>NFL</Text>
          </View>
          <View>
            {nflMatches.map((match, index) => (
              <MatchCard key={`nfl-${match.id || index}`} match={match} standings={nhlStandings} />
            ))}
          </View>
        </View>
      )}

      {/* Message si aucun match */}
      {!hasMatches && (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>
            Aucun match prévu pour le {selectedDate.toLocaleDateString('fr-CA')}
          </Text>
          <Text style={styles.emptySubtext}>
            Essayez une autre date ou vérifiez les ligues disponibles
          </Text>
        </View>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    gap: 0,
  },
  loadingContainer: {
    height: 256,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#9ca3af',
  },
  errorContainer: {
    height: 256,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 14,
    color: '#ef4444',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 12,
    color: '#9ca3af',
  },
  leagueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leagueLogo: {
    width: 32,
    height: 32,
  },
  leagueTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    color: '#9ca3af',
    textAlign: 'center',
  },
  emptySubtext: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
    textAlign: 'center',
  },
})