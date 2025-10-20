import { View, Text, ScrollView, StyleSheet } from "react-native"
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import type { Injury } from "@/lib/types/team"

export function InjuryReport({ injuries }: { injuries: Injury[] }) {
  if (!injuries || injuries.length === 0) {
    return (
      <ScrollView style={styles.container} contentContainerStyle={styles.emptyContainer}>
        <View style={styles.emptyContent}>
          <MaterialCommunityIcons name="bandage" size={48} color="#9ca3af" />
          <Text style={styles.emptyTitle}>Aucune blessure</Text>
          <Text style={styles.emptySubtitle}>L'équipe est en pleine santé!</Text>
        </View>
      </ScrollView>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.alertBox}>
        <Ionicons name="alert-circle" size={20} color="#ef4444" />
        <Text style={styles.alertText}>
          {injuries.length} {injuries.length === 1 ? 'joueur blessé' : 'joueurs blessés'}
        </Text>
      </View>

      <View style={styles.injuriesList}>
        {injuries.map((injury, index) => {
          const statusLower = injury.status?.toLowerCase() || ''
          const isOut = statusLower.includes('out')
          const isDayToDay = statusLower.includes('day')

          return (
            <View key={`${injury.playerId}-${index}`} style={styles.injuryCard}>
              <View style={styles.injuryHeader}>
                <View style={styles.playerInfo}>
                  <Text style={styles.playerName}>{injury.playerName}</Text>
                  {injury.position && (
                    <Text style={styles.playerPosition}>{injury.position}</Text>
                  )}
                </View>
                
                <View style={[
                  styles.statusBadge,
                  isOut && styles.statusOut,
                  isDayToDay && styles.statusDayToDay,
                  !isOut && !isDayToDay && styles.statusUnknown,
                ]}>
                  <Text style={[
                    styles.statusText,
                    isOut && styles.statusTextOut,
                    isDayToDay && styles.statusTextDayToDay,
                  ]}>
                    {injury.status || 'Inconnu'}
                  </Text>
                </View>
              </View>

              <View style={styles.injuryDetails}>
                <MaterialCommunityIcons name="bandage" size={16} color="#9ca3af" />
                <Text style={styles.injuryText}>{injury.injury}</Text>
              </View>

              {injury.date && (
                <Text style={styles.injuryDate}>Depuis le {injury.date}</Text>
              )}
            </View>
          )
        })}
      </View>
    </ScrollView>
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
  },
  emptyContent: {
    alignItems: 'center',
    paddingVertical: 32,
  },
  emptyTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    marginTop: 12,
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#9ca3af',
  },
  alertBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
  },
  alertText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ef4444',
  },
  injuriesList: {
    gap: 12,
  },
  injuryCard: {
    backgroundColor: 'black',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    padding: 16,
  },
  injuryHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  playerInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  playerPosition: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusOut: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
  },
  statusDayToDay: {
    backgroundColor: 'rgba(234, 179, 8, 0.1)',
  },
  statusUnknown: {
    backgroundColor: '#black',
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6b7280',
  },
  statusTextOut: {
    color: '#ef4444',
  },
  statusTextDayToDay: {
    color: '#eab308',
  },
  injuryDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#black',
    borderRadius: 6,
    padding: 8,
  },
  injuryText: {
    fontSize: 14,
    color: '#fff',
    flex: 1,
  },
  injuryDate: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
})