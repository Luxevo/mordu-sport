import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import type { TeamRoster, Player } from '@/lib/types/team';
import { BottomNav } from '@/components/bottom-nav';

interface TeamRosterWithStatsProps {
  roster: TeamRoster;
  playerStats: Player[];
}

export function TeamRosterComponent({ roster, playerStats }: TeamRosterWithStatsProps) {
  if (!roster) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>Aucun roster disponible</Text>
      </View>
    );
  }

  // Fonction pour merger roster + stats
  const mergePlayerData = (rosterPlayer: Player) => {
    let stats = playerStats.find(p => p.id === rosterPlayer.id);
    
    if (!stats) {
      stats = playerStats.find(p => p.name === rosterPlayer.name);
    }
    
    return {
      ...rosterPlayer,
      ...(stats || {}),
      number: rosterPlayer.number,
    };
  };

  const forwards = roster.forwards.map(mergePlayerData);
  const defensemen = roster.defensemen.map(mergePlayerData);
  const goalies = roster.goalies.map(mergePlayerData);

  // Fonction pour afficher une carte de joueur
  const PlayerCard = ({ player, color }: { player: Player; color: string }) => {
    return (
      <View style={[styles.playerCard, { borderColor: `${color}30` }]}>
        {/* Cercle avec numéro du joueur */}
        <View style={[styles.playerNumber, { backgroundColor: `${color}20` }]}>
          <Text style={[styles.playerNumberText, { color }]}>
            #{player.number}
          </Text>
        </View>

        {/* Infos joueur */}
        <View style={styles.playerInfo}>
          <View style={styles.playerHeader}>
            <Text style={styles.playerName} numberOfLines={1}>
              {player.name}
            </Text>
            <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
              <Text style={[styles.badgeText, { color }]}>
                #{player.number}
              </Text>
            </View>
          </View>
          <View style={styles.playerDetails}>
            <Text style={styles.detailText}>{player.position}</Text>
            {player.gamesPlayed && (
              <>
                <Text style={styles.detailText}> • </Text>
                <Text style={styles.detailText}>{player.gamesPlayed} GP</Text>
              </>
            )}
            {player.birthplace && player.birthplace !== '--' && (
              <>
                <Text style={styles.detailText}> • </Text>
                <Text style={styles.detailText} numberOfLines={1}>
                  {player.birthplace}
                </Text>
              </>
            )}
          </View>
        </View>

        {/* Stats */}
        {player.points !== undefined && player.points > 0 && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsPoints}>{player.points}</Text>
            <Text style={styles.statsDetail}>
              {player.goals}B-{player.assists}A
            </Text>
          </View>
        )}
        
        {/* Stats pour les gardiens */}
        {player.points === undefined && player.position === 'Goalies' && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsLabel}>Gardien</Text>
            <Text style={styles.statsDetail}>
              {player.gamesPlayed || 0} GP
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
      {/* Attaquants */}
      {forwards.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#00C4FF' }]}>
            ATTAQUANTS ({forwards.length})
          </Text>
          <View style={styles.playerList}>
            {forwards.map((player) => (
              <PlayerCard key={player.id} player={player} color="#00C4FF" />
            ))}
          </View>
        </View>
      )}

      {/* Défenseurs */}
      {defensemen.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#FF6B35' }]}>
            DÉFENSEURS ({defensemen.length})
          </Text>
          <View style={styles.playerList}>
            {defensemen.map((player) => (
              <PlayerCard key={player.id} player={player} color="#FF6B35" />
            ))}
          </View>
        </View>
      )}

      {/* Gardiens */}
      {goalies.length > 0 && (
        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: '#DC2626' }]}>
            GARDIENS ({goalies.length})
          </Text>
          <View style={styles.playerList}>
            {goalies.map((player) => (
              <PlayerCard key={player.id} player={player} color="#DC2626" />
            ))}
          </View>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  contentContainer: {
    padding: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyText: {
    color: '#888',
    fontSize: 14,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginBottom: 12,
  },
  playerList: {
    gap: 8,
  },
  playerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: 'black',
    marginBottom: 8,
  },
  playerNumber: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
  },
  playerNumberText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  playerInfo: {
    flex: 1,
  },
  playerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  playerName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
    flex: 1,
  },
  badge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
  },
  playerDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  detailText: {
    fontSize: 12,
    color: '#666',
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  statsPoints: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  statsLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  statsDetail: {
    fontSize: 11,
    color: '#666',
    marginTop: 2,
  },
});