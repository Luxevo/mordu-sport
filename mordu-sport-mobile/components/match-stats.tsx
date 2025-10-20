import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { useState } from "react"
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons"
import type { Match } from "@/lib/types/hockey"

export function MatchStats({ match }: { match: Match }) {
  const [activeSubTab, setActiveSubTab] = useState<"match" | "teams">("match")
  
  // Vérifier si le match a des scores (en cours ou terminé)
  const hasScores = match.awayTeam.score !== undefined && match.homeTeam.score !== undefined

  // Calculer les scores par période si disponibles
  const periodScores = []
  
  if (match.awayTeam.p1 !== undefined && match.homeTeam.p1 !== undefined) {
    periodScores.push({
      period: "1ère période",
      away: match.awayTeam.p1,
      home: match.homeTeam.p1
    })
  }
  
  if (match.awayTeam.p2 !== undefined && match.homeTeam.p2 !== undefined) {
    periodScores.push({
      period: "2e période",
      away: match.awayTeam.p2,
      home: match.homeTeam.p2
    })
  }
  
  if (match.awayTeam.p3 !== undefined && match.homeTeam.p3 !== undefined) {
    periodScores.push({
      period: "3e période",
      away: match.awayTeam.p3,
      home: match.homeTeam.p3
    })
  }
  
  if (match.awayTeam.ot !== undefined && match.homeTeam.ot !== undefined) {
    periodScores.push({
      period: "Prolongation",
      away: match.awayTeam.ot,
      home: match.homeTeam.ot
    })
  }
  
  if (match.awayTeam.so !== undefined && match.homeTeam.so !== undefined) {
    periodScores.push({
      period: "Fusillade",
      away: match.awayTeam.so,
      home: match.homeTeam.so
    })
  }

  return (
    <View style={styles.container}>
      {/* Sous-onglets */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          onPress={() => setActiveSubTab("match")}
          style={[
            styles.tab,
            activeSubTab === "match" && styles.tabActive
          ]}
        >
          <MaterialCommunityIcons 
            name="trending-up" 
            size={16} 
            color={activeSubTab === "match" ? "#3b82f6" : "#9ca3af"} 
          />
          <Text style={[
            styles.tabText,
            activeSubTab === "match" && styles.tabTextActive
          ]}>
            Stats du match
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveSubTab("teams")}
          style={[
            styles.tab,
            activeSubTab === "teams" && styles.tabActive
          ]}
        >
          <Ionicons 
            name="people" 
            size={16} 
            color={activeSubTab === "teams" ? "#3b82f6" : "#9ca3af"} 
          />
          <Text style={[
            styles.tabText,
            activeSubTab === "teams" && styles.tabTextActive
          ]}>
            Stats par équipe
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contenu des sous-onglets */}
      <ScrollView style={styles.content}>
        {activeSubTab === "match" && (
          <View style={styles.section}>
            {/* Si le match n'a pas encore commencé */}
            {!hasScores && match.status === 'upcoming' ? (
              <View style={styles.emptyState}>
                <MaterialCommunityIcons name="chart-bar" size={64} color="#9ca3af" />
                <Text style={styles.emptyTitle}>Match à venir</Text>
                <Text style={styles.emptyText}>
                  Les statistiques seront disponibles une fois le match commencé
                </Text>
                <Text style={styles.emptySubtext}>
                  Début prévu : {match.time}
                </Text>
              </View>
            ) : (
              <>
                {/* Score final ou actuel */}
                <View style={styles.scoreCard}>
                  <Text style={styles.scoreTitle}>
                    {match.status === 'live' ? 'Score Actuel' : 'Score Final'}
                  </Text>
                  <View style={styles.scoreRow}>
                    <View style={styles.teamScore}>
                      <Text style={styles.teamLabel}>
                        {match.awayTeam.abbr || match.awayTeam.name}
                      </Text>
                      <Text style={styles.score}>{match.awayTeam.score || 0}</Text>
                    </View>
                    <Text style={styles.scoreDivider}>-</Text>
                    <View style={styles.teamScore}>
                      <Text style={styles.teamLabel}>
                        {match.homeTeam.abbr || match.homeTeam.name}
                      </Text>
                      <Text style={styles.score}>{match.homeTeam.score || 0}</Text>
                    </View>
                  </View>
                </View>

                {/* Scores par période */}
                {periodScores.length > 0 && (
                  <View style={styles.periodsSection}>
                    <Text style={styles.sectionTitle}>Scores par période</Text>
                    <View style={styles.periodsList}>
                      {periodScores.map((period, index) => (
                        <View key={index} style={styles.periodCard}>
                          <View style={styles.periodRow}>
                            <Text style={styles.periodLabel}>{period.period}</Text>
                            <View style={styles.periodScores}>
                              <Text style={styles.periodScore}>{period.away}</Text>
                              <Text style={styles.periodDivider}>-</Text>
                              <Text style={styles.periodScore}>{period.home}</Text>
                            </View>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {activeSubTab === "teams" && (
          <View style={styles.emptyState}>
            <Ionicons name="people" size={64} color="#9ca3af" />
            <Text style={styles.emptyTitle}>Roster et performances</Text>
            <Text style={styles.emptyText}>
              Les statistiques détaillées des joueurs seront disponibles prochainement
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    backgroundColor: '#fff',
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: '#3b82f6',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#9ca3af',
  },
  tabTextActive: {
    color: '#3b82f6',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    gap: 24,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 48,
    textAlign: 'center',
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 4,
  },
  emptySubtext: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  scoreCard: {
    borderWidth: 2,
    borderColor: 'rgba(59, 130, 246, 0.3)',
    borderRadius: 8,
    backgroundColor: '#fff',
    padding: 16,
  },
  scoreTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#9ca3af',
    textAlign: 'center',
    marginBottom: 12,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 32,
  },
  teamScore: {
    alignItems: 'center',
  },
  teamLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginBottom: 4,
  },
  score: {
    fontSize: 36,
    fontWeight: 'bold',
    color: '#000',
  },
  scoreDivider: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#9ca3af',
  },
  periodsSection: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: '#9ca3af',
    marginBottom: 12,
  },
  periodsList: {
    gap: 12,
  },
  periodCard: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 12,
  },
  periodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  periodLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: '#9ca3af',
    width: 100,
  },
  periodScores: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  periodScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  periodDivider: {
    fontSize: 14,
    color: '#9ca3af',
  },
})