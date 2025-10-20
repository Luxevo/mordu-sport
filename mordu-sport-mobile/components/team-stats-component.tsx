import { View, Text, ScrollView, StyleSheet } from "react-native"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import type { TeamStats } from "@/lib/types/team"

export function TeamStatsComponent({ stats }: { stats: TeamStats | null }) {
  if (!stats) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucune statistique disponible</Text>
      </View>
    )
  }

  const winPercentage = ((stats.wins / stats.gamesPlayed) * 100).toFixed(1)

  return (
    <ScrollView style={styles.container}>
      {/* Résumé */}
      <View style={styles.section}>
        <View style={styles.summaryGrid}>
          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <Ionicons name="trophy" size={16} color="#3b82f6" />
              <Text style={styles.cardLabel}>Record</Text>
            </View>
            <Text style={styles.summaryValue}>
              {stats.wins}-{stats.losses}-{stats.otLosses}
            </Text>
            <Text style={styles.cardSecondary}>{winPercentage}% victoires</Text>
          </View>

          <View style={styles.summaryCard}>
            <View style={styles.cardHeader}>
              <MaterialCommunityIcons name="target" size={16} color="#8b5cf6" />
              <Text style={styles.cardLabel}>Points</Text>
            </View>
            <Text style={styles.summaryValue}>{stats.points}</Text>
            <Text style={styles.cardSecondary}>{stats.gamesPlayed} matchs joués</Text>
          </View>
        </View>
      </View>

      {/* Statistiques offensives */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#3b82f6' }]}>OFFENSIVE</Text>
        <View style={styles.statsList}>
          <StatRow 
            label="Buts pour" 
            value={stats.goalsFor.toString()}
            secondary={`${(stats.goalsFor / stats.gamesPlayed).toFixed(1)} / match`}
          />
          <StatRow 
            label="Tirs par match" 
            value={stats.shotsPerGame.toFixed(1)}
          />
          <StatRow 
            label="Avantage numérique" 
            value={stats.powerPlayPercentage}
            secondary={`${stats.powerPlayGoals} / ${stats.powerPlayOpportunities}`}
          />
          <StatRow 
            label="Mises au jeu" 
            value={stats.faceoffWinPercentage}
          />
        </View>
      </View>

      {/* Statistiques défensives */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: '#ef4444' }]}>DÉFENSIVE</Text>
        <View style={styles.statsList}>
          <StatRow 
            label="Buts contre" 
            value={stats.goalsAgainst.toString()}
            secondary={`${(stats.goalsAgainst / stats.gamesPlayed).toFixed(1)} / match`}
          />
          <StatRow 
            label="Tirs alloués par match" 
            value={stats.shotsAllowedPerGame.toFixed(1)}
          />
          <StatRow 
            label="Infériorité numérique" 
            value={stats.penaltyKillPercentage}
          />
        </View>
      </View>
    </ScrollView>
  )
}

function StatRow({ label, value, secondary }: { label: string; value: string; secondary?: string }) {
  return (
    <View style={styles.statRow}>
      <Text style={styles.statLabel}>{label}</Text>
      <View style={styles.statValueContainer}>
        <Text style={styles.statValue}>{value}</Text>
        {secondary && <Text style={styles.statSecondary}>{secondary}</Text>}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    textAlign: 'center',
    color: '#9ca3af',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  summaryGrid: {
    flexDirection: 'row',
    gap: 12,
  },
  summaryCard: {
    flex: 1,
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9ca3af',
  },
  summaryValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
  },
  cardSecondary: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 0.5,
    marginBottom: 12,
  },
  statsList: {
    gap: 12,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
  },
  statLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#9ca3af',
    flex: 1,
  },
  statValueContainer: {
    alignItems: 'flex-end',
  },
  statValue: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statSecondary: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
})