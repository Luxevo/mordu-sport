import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { HomeHeader } from '@/components/home-header'; 
import { useNHLTeams } from '@/lib/hooks/useTeamData';
import { useNBATeams } from '@/lib/hooks/useNBAData';
import { useNFLTeams } from '@/lib/hooks/useNFLData';
import { Ionicons } from '@expo/vector-icons';
import { BottomNav } from '@/components/bottom-nav';

type League = 'NHL' | 'NBA' | 'NFL';

export default function TeamsPage() {
  const router = useRouter();
  const [selectedLeague, setSelectedLeague] = useState<League>('NHL');
  const [activeTab, setActiveTab] = useState<'results' | 'teams' | 'favorites' | 'mordu'>('teams');

  const { teams: nhlTeams } = useNHLTeams();
  const { teams: nbaTeams } = useNBATeams();
  const { teams: nflTeams } = useNFLTeams();

  const handleTabPress = (tab: 'results' | 'teams' | 'favorites' | 'mordu') => {
    setActiveTab(tab);
    console.log('Tab pressed:', tab);
  };

  const leagueLogos: Record<League, any> = {
    NHL: require('../../public/NHL-Logo.png'),
    NBA: require('../../public/nba-logo-transparent.png'),
    NFL: require('../../public/nflLogo.png'),
  };

  // NHL - Grouper par conférence et division
  const nhlEasternTeams = nhlTeams.filter(t => t.conference === 'Eastern');
  const nhlWesternTeams = nhlTeams.filter(t => t.conference === 'Western');

  const nhlEasternDivisions = {
    Atlantic: nhlEasternTeams.filter(t => t.division === 'Atlantic'),
    Metropolitan: nhlEasternTeams.filter(t => t.division === 'Metropolitan'),
  };

  const nhlWesternDivisions = {
    Central: nhlWesternTeams.filter(t => t.division === 'Central'),
    Pacific: nhlWesternTeams.filter(t => t.division === 'Pacific'),
  };

  // NBA - Grouper par conférence et division
  const nbaEasternTeams = nbaTeams.filter(t => t.conference === 'Eastern');
  const nbaWesternTeams = nbaTeams.filter(t => t.conference === 'Western');

  const nbaEasternDivisions = {
    Atlantic: nbaEasternTeams.filter(t => t.division === 'Atlantic'),
    Central: nbaEasternTeams.filter(t => t.division === 'Central'),
    Southeast: nbaEasternTeams.filter(t => t.division === 'Southeast'),
  };

  const nbaWesternDivisions = {
    Northwest: nbaWesternTeams.filter(t => t.division === 'Northwest'),
    Pacific: nbaWesternTeams.filter(t => t.division === 'Pacific'),
    Southwest: nbaWesternTeams.filter(t => t.division === 'Southwest'),
  };

  // NFL - Grouper par conférence et division
  const nflAFCTeams = nflTeams.filter(t => t.conference === 'AFC');
  const nflNFCTeams = nflTeams.filter(t => t.conference === 'NFC');

  const nflAFCDivisions = {
    East: nflAFCTeams.filter(t => t.division === 'AFC East'),
    North: nflAFCTeams.filter(t => t.division === 'AFC North'),
    South: nflAFCTeams.filter(t => t.division === 'AFC South'),
    West: nflAFCTeams.filter(t => t.division === 'AFC West'),
  };

  const nflNFCDivisions = {
    East: nflNFCTeams.filter(t => t.division === 'NFC East'),
    North: nflNFCTeams.filter(t => t.division === 'NFC North'),
    South: nflNFCTeams.filter(t => t.division === 'NFC South'),
    West: nflNFCTeams.filter(t => t.division === 'NFC West'),
  };

  const renderTeamCard = (team: any, color: string, league: League) => (
    <TouchableOpacity
      key={team.id}
      onPress={() => router.push({
        pathname: '/teams/[id]/page',
        params: { id: team.id }
      })}
      style={styles.teamCard}
    >
      <View style={styles.teamInfo}>
        {/* Logo de la ligue */}
        <Image
          source={leagueLogos[league]}
          style={styles.teamLogo}
        />

        <View style={styles.teamDetails}>
          <Text style={styles.teamName}>{team.name}</Text>
          <Text style={styles.teamCity}>{team.city}</Text>
        </View>
      </View>
      <Ionicons name="people-outline" size={20} color="#888" />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <HomeHeader />

      <ScrollView style={styles.main} contentContainerStyle={{ paddingBottom: 100 }}>
        <View style={styles.content}>
          {/* En-tête */}
          <View style={styles.header}>
            <Text style={styles.title}>Équipes</Text>
            <Text style={styles.subtitle}>
              Explorez toutes les équipes de vos ligues favorites
            </Text>
          </View>

          {/* Filtre de ligue */}
          <View style={styles.leagueFilter}>
            <TouchableOpacity
              onPress={() => setSelectedLeague('NHL')}
              style={[
                styles.leagueButton,
                selectedLeague === 'NHL' && styles.leagueButtonActiveNHL
              ]}
            >
              <Text style={[
                styles.leagueButtonText,
                selectedLeague === 'NHL' && styles.leagueButtonTextActive
              ]}>
                NHL
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedLeague('NBA')}
              style={[
                styles.leagueButton,
                selectedLeague === 'NBA' && styles.leagueButtonActiveNBA
              ]}
            >
              <Text style={[
                styles.leagueButtonText,
                selectedLeague === 'NBA' && styles.leagueButtonTextActive
              ]}>
                NBA
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSelectedLeague('NFL')}
              style={[
                styles.leagueButton,
                selectedLeague === 'NFL' && styles.leagueButtonActiveNFL
              ]}
            >
              <Text style={[
                styles.leagueButtonText,
                selectedLeague === 'NFL' && styles.leagueButtonTextActive
              ]}>
                NFL
              </Text>
            </TouchableOpacity>
          </View>

          {/* Contenu NHL */}
          {selectedLeague === 'NHL' && (
            <View>
              {/* Conférence de l'Est */}
              <View style={styles.section}>
                <Text style={[styles.conferenceTitle, { color: '#00C4FF' }]}>
                  CONFÉRENCE DE L'EST
                </Text>

                {/* Division Atlantique */}
                <Text style={styles.divisionTitle}>Division Atlantique</Text>
                {nhlEasternDivisions.Atlantic.map((team) => renderTeamCard(team, '#00C4FF', 'NHL'))}

                {/* Division Métropolitaine */}
                <Text style={[styles.divisionTitle, { marginTop: 24 }]}>
                  Division Métropolitaine
                </Text>
                {nhlEasternDivisions.Metropolitan.map((team) => renderTeamCard(team, '#00C4FF', 'NHL'))}
              </View>

              {/* Conférence de l'Ouest */}
              <View style={styles.section}>
                <Text style={[styles.conferenceTitle, { color: '#FF6B35' }]}>
                  CONFÉRENCE DE L'OUEST
                </Text>

                {/* Division Centrale */}
                <Text style={styles.divisionTitle}>Division Centrale</Text>
                {nhlWesternDivisions.Central.map((team) => renderTeamCard(team, '#FF6B35', 'NHL'))}

                {/* Division Pacifique */}
                <Text style={[styles.divisionTitle, { marginTop: 24 }]}>
                  Division Pacifique
                </Text>
                {nhlWesternDivisions.Pacific.map((team) => renderTeamCard(team, '#FF6B35', 'NHL'))}
              </View>
            </View>
          )}

          {/* Contenu NBA */}
          {selectedLeague === 'NBA' && (
            <View>
              {/* Conférence de l'Est */}
              <View style={styles.section}>
                <Text style={[styles.conferenceTitle, { color: '#FF6B35' }]}>
                  CONFÉRENCE DE L'EST
                </Text>

                {/* Division Atlantique */}
                <Text style={styles.divisionTitle}>Division Atlantique</Text>
                {nbaEasternDivisions.Atlantic.map((team) => renderTeamCard(team, '#FF6B35', 'NBA'))}

                {/* Division Centrale */}
                <Text style={[styles.divisionTitle, { marginTop: 24 }]}>
                  Division Centrale
                </Text>
                {nbaEasternDivisions.Central.map((team) => renderTeamCard(team, '#FF6B35', 'NBA'))}

                {/* Division Sud-Est */}
                <Text style={[styles.divisionTitle, { marginTop: 24 }]}>
                  Division Sud-Est
                </Text>
                {nbaEasternDivisions.Southeast.map((team) => renderTeamCard(team, '#FF6B35', 'NBA'))}
              </View>

              {/* Conférence de l'Ouest */}
              <View style={styles.section}>
                <Text style={[styles.conferenceTitle, { color: '#DC2626' }]}>
                  CONFÉRENCE DE L'OUEST
                </Text>

                {/* Division Nord-Ouest */}
                <Text style={styles.divisionTitle}>Division Nord-Ouest</Text>
                {nbaWesternDivisions.Northwest.map((team) => renderTeamCard(team, '#DC2626', 'NBA'))}

                {/* Division Pacifique */}
                <Text style={[styles.divisionTitle, { marginTop: 24 }]}>
                  Division Pacifique
                </Text>
                {nbaWesternDivisions.Pacific.map((team) => renderTeamCard(team, '#DC2626', 'NBA'))}

                {/* Division Sud-Ouest */}
                <Text style={[styles.divisionTitle, { marginTop: 24 }]}>
                  Division Sud-Ouest
                </Text>
                {nbaWesternDivisions.Southwest.map((team) => renderTeamCard(team, '#DC2626', 'NBA'))}
              </View>
            </View>
          )}

          {/* Contenu NFL */}
          {selectedLeague === 'NFL' && (
            <View>
              {/* Conférence AFC */}
              <View style={styles.section}>
                <Text style={[styles.conferenceTitle, { color: '#00C4FF' }]}>
                  CONFÉRENCE AFC
                </Text>

                {/* AFC East */}
                <Text style={styles.divisionTitle}>AFC Est</Text>
                {nflAFCDivisions.East.map((team) => renderTeamCard(team, '#00C4FF', 'NFL'))}

                {/* AFC North */}
                <Text style={[styles.divisionTitle, { marginTop: 24 }]}>AFC Nord</Text>
                {nflAFCDivisions.North.map((team) => renderTeamCard(team, '#00C4FF', 'NFL'))}

                {/* AFC South */}
                <Text style={[styles.divisionTitle, { marginTop: 24 }]}>AFC Sud</Text>
                {nflAFCDivisions.South.map((team) => renderTeamCard(team, '#00C4FF', 'NFL'))}

                {/* AFC West */}
                <Text style={[styles.divisionTitle, { marginTop: 24 }]}>AFC Ouest</Text>
                {nflAFCDivisions.West.map((team) => renderTeamCard(team, '#00C4FF', 'NFL'))}
              </View>

              {/* Conférence NFC */}
              <View style={styles.section}>
                <Text style={[styles.conferenceTitle, { color: '#DC2626' }]}>
                  CONFÉRENCE NFC
                </Text>

                {/* NFC East */}
                <Text style={styles.divisionTitle}>NFC Est</Text>
                {nflNFCDivisions.East.map((team) => renderTeamCard(team, '#DC2626', 'NFL'))}

                {/* NFC North */}
                <Text style={[styles.divisionTitle, { marginTop: 24 }]}>NFC Nord</Text>
                {nflNFCDivisions.North.map((team) => renderTeamCard(team, '#DC2626', 'NFL'))}

                {/* NFC South */}
                <Text style={[styles.divisionTitle, { marginTop: 24 }]}>NFC Sud</Text>
                {nflNFCDivisions.South.map((team) => renderTeamCard(team, '#DC2626', 'NFL'))}

                {/* NFC West */}
                <Text style={[styles.divisionTitle, { marginTop: 24 }]}>NFC Ouest</Text>
                {nflNFCDivisions.West.map((team) => renderTeamCard(team, '#DC2626', 'NFL'))}
              </View>
            </View>
          )}
        </View>
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
  main: {
    flex: 1,
  },
  content: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#fff',
  },
  subtitle: {
    fontSize: 14,
    color: '#666',
  },
  leagueFilter: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  leagueButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
  },
  leagueButtonActiveNHL: {
    backgroundColor: '#00C4FF',
    shadowColor: '#00C4FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  }, 
  leagueButtonActiveNBA: {
    backgroundColor: '#FF6B35',
    shadowColor: '#FF6B35',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  }, 
  leagueButtonActiveNFL: {
    backgroundColor: '#7B2CBF',
    shadowColor: '#7B2CBF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.7,
    shadowRadius: 10,
    elevation: 8,
  },
  leagueButtonText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#666',
    textTransform: 'uppercase',
    letterSpacing: 1,
  },
  leagueButtonTextActive: {
    color: '#fff',
  },
  section: {
    marginBottom: 32,
  },
  conferenceTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: 1,
  },
  divisionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#fff',
  },
  teamCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#121212',
    backgroundColor: 'black',
    marginBottom: 12,
  },
  teamInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  teamLogo: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    resizeMode: 'contain',
  },
  teamDetails: {
    flex: 1,
  },
  teamName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  teamCity: {
    fontSize: 14,
    color: '#666',
    marginTop: 2,
  },
});

