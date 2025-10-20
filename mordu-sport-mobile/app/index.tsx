import React, { useState } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { HomeHeader } from '../components/home-header';
import { AdBanner } from '../components/ad-banner';
import { LeagueFilter } from '../components/league-filter';
import { MatchList } from '../components/match-list';
import { BottomNav } from '../components/bottom-nav';
import { StickyCalendar } from '../components/sticky-calendar';
import { useRouter } from 'expo-router';

export default function HomePage() { 
  const router = useRouter();  
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState<'results' | 'teams' | 'favorites' | 'mordu'>('results');

  const handleTabPress = (tab: 'results' | 'teams' | 'favorites' | 'mordu') => {
    setActiveTab(tab); 

    if (tab === 'results') router.push('/');
    if (tab === 'teams') router.push({
      pathname: '/teams/page',
      params: { id: '123' }
    });
    if (tab === 'favorites') router.push('/favorites');
    if (tab === 'mordu') router.push('/mordu');
  };

  return (
    <View style={styles.container}>
      <HomeHeader />
      <AdBanner />

      <View style={styles.stickyZone}>
        <LeagueFilter />
        <StickyCalendar selectedDate={selectedDate} onDateSelect={setSelectedDate} />
      </View>

      <ScrollView style={styles.main} contentContainerStyle={{ paddingBottom: 80 }}>
        <MatchList selectedDate={selectedDate} />
      </ScrollView>

      <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  stickyZone: {
    zIndex: 10,
  },
  main: {
    flex: 1,
  },
});
