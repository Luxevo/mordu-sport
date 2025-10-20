// app/teams/[id]/page.tsx
import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { HomeHeader } from '@/components/home-header';
import { BottomNav } from '@/components/bottom-nav';
import { useTeamData } from '@/lib/hooks/useTeamData';
import { getTeamById } from '@/lib/parsers/team-parser';
import { TeamRosterComponent } from '@/components/team-roster';
import { TeamStatsComponent } from '@/components/team-stats-component';
import { InjuryReport } from '@/components/injury-report';
import { Ionicons } from '@expo/vector-icons';

export default function TeamPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<'players' | 'team' | 'injuries'>('players');
  const [navTab, setNavTab] = useState<'results' | 'teams' | 'favorites' | 'mordu'>('teams');

  const { roster, players, teamStats, injuries, loading, error } = useTeamData(id);
  const teamInfo = getTeamById(id);

  const handleTabPress = (tab: 'results' | 'teams' | 'favorites' | 'mordu') => {
    setNavTab(tab);
    console.log('Nav tab pressed:', tab);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#00C4FF" />
        <Text style={styles.loadingText}>Chargement de l'équipe...</Text>
      </View>
    );
  }

  if (error || !teamInfo) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>
            {error || "Équipe introuvable"}
          </Text>
          <Text style={styles.errorText}>
            Cette équipe n'existe pas ou n'est plus disponible
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <HomeHeader />

      {/* Team Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <View style={styles.teamLogoContainer}>
            <Text style={styles.teamAbbr}>{teamInfo.abbr}</Text>
          </View>
          <View style={styles.teamInfoContainer}>
            <Text style={styles.teamName} numberOfLines={1}>
              {teamInfo.name}
            </Text>
            <Text style={styles.teamDetails} numberOfLines={1}>
              {teamInfo.division} • {teamInfo.conference}
            </Text>
            {teamStats && (
              <Text style={styles.teamStatsText}>
                {teamStats.wins}-{teamStats.losses}-{teamStats.otLosses} • {teamStats.points} PTS
              </Text>
            )}
          </View>
        </View>
      </View>

      {/* Tabs */}
      <View style={styles.tabsContainer}>
        <TouchableOpacity
          onPress={() => setActiveTab('players')}
          style={[
            styles.tab,
            activeTab === 'players' && styles.tabActiveBlue
          ]}
        >
          <Ionicons 
            name="people" 
            size={20} 
            color={activeTab === 'players' ? '#00C4FF' : '#888'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'players' && styles.tabTextActiveBlue
          ]}>
            Joueurs
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('team')}
          style={[
            styles.tab,
            activeTab === 'team' && styles.tabActiveOrange
          ]}
        >
          <Ionicons 
            name="stats-chart" 
            size={20} 
            color={activeTab === 'team' ? '#FF6B35' : '#888'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'team' && styles.tabTextActiveOrange
          ]}>
            Équipe
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => setActiveTab('injuries')}
          style={[
            styles.tab,
            activeTab === 'injuries' && styles.tabActiveRed
          ]}
        >
          <Ionicons 
            name="medical" 
            size={20} 
            color={activeTab === 'injuries' ? '#DC2626' : '#888'} 
          />
          <Text style={[
            styles.tabText,
            activeTab === 'injuries' && styles.tabTextActiveRed
          ]}>
            Blessures
          </Text>
        </TouchableOpacity>
      </View>

      {/* Tab Content */}
      <ScrollView style={styles.content} contentContainerStyle={{ paddingBottom: 80 }}>
        {activeTab === 'players' && (
          <TeamRosterComponent roster={roster!} playerStats={players} />
        )}
        {activeTab === 'team' && (
          <TeamStatsComponent stats={teamStats} />
        )}
        {activeTab === 'injuries' && (
          <InjuryReport injuries={injuries} />
        )}
      </ScrollView>

      <BottomNav />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
    padding: 20,
  },
  errorBox: {
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#DC262650',
    backgroundColor: '#DC262610',
    padding: 24,
    maxWidth: 400,
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#DC2626',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 12,
    color: '#666',
    textAlign: 'center',
  },
  banner: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'black',
  },
  bannerContent: {
    flexDirection: 'row',
    padding: 12,
    gap: 12,
  },
  teamLogoContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#00C4FF20',
    justifyContent: 'center',
    alignItems: 'center',
  },
  teamAbbr: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00C4FF',
  },
  teamInfoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  teamName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  teamDetails: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  teamStatsText: {
    fontSize: 12,
    color: '#00C4FF',
    fontWeight: '600',
    marginTop: 2,
  },
  tabsContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    backgroundColor: 'black',
  },
  tab: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
    paddingVertical: 12,
    minHeight: 60,
  },
  tabActiveBlue: {
    borderBottomWidth: 2,
    borderBottomColor: '#00C4FF',
    backgroundColor: '#00C4FF08',
  },
  tabActiveOrange: {
    borderBottomWidth: 2,
    borderBottomColor: '#FF6B35',
    backgroundColor: '#FF6B3508',
  },
  tabActiveRed: {
    borderBottomWidth: 2,
    borderBottomColor: '#DC2626',
    backgroundColor: '#DC262608',
  },
  tabText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#888',
  },
  tabTextActiveBlue: {
    color: '#00C4FF',
  },
  tabTextActiveOrange: {
    color: '#FF6B35',
  },
  tabTextActiveRed: {
    color: '#DC2626',
  },
  content: {
    flex: 1,
  },
});