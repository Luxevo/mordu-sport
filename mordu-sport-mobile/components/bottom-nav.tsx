import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons, FontAwesome } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';

type BottomNavProps = {
  activeTab?: 'results' | 'teams' | 'favorites' | 'mordu';
  onTabPress?: (tab: 'results' | 'teams' | 'favorites' | 'mordu') => void;
};

export function BottomNav({ activeTab: propActiveTab, onTabPress }: BottomNavProps) {
  const router = useRouter();
  const pathname = usePathname();

  // Déterminer l'onglet actif basé sur l'URL si pas fourni en prop
  const getActiveTabFromPath = (): 'results' | 'teams' | 'favorites' | 'mordu' => {
    if (pathname.startsWith('/teams')) return 'teams';
    if (pathname.startsWith('/favorites')) return 'favorites';
    if (pathname.startsWith('/mordu')) return 'mordu';
    return 'results';
  };

  const activeTab = propActiveTab || getActiveTabFromPath();

  const handlePress = (tab: 'results' | 'teams' | 'favorites' | 'mordu') => {
    // Si une fonction onTabPress est fournie, l'utiliser
    if (onTabPress) {
      onTabPress(tab);
      return;
    }

    // Sinon, gérer la navigation directement
    switch (tab) {
      case 'results':
        router.push('/page');
        break;
      case 'teams':
        router.push('/teams/page');
        break;
      case 'favorites':
        router.push('/favorites');
        break;
      case 'mordu':
        router.push('/mordu');
        break;
    }
  };

  const tabs = [
    { key: 'results', label: 'Accueil', icon: <MaterialIcons name="home" size={24} /> },
    { key: 'teams', label: 'Équipes', icon: <Ionicons name="people-outline" size={24} /> },
    { key: 'favorites', label: 'Favoris', icon: <FontAwesome name="star-o" size={24} /> },
    { key: 'mordu', label: 'Mordu Sport', icon: <Image source={require('../assets/LogoMordu.svg')} style={styles.logo} /> },
  ];

  return (
    <View style={styles.nav}>
      {tabs.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tabButton}
            onPress={() => handlePress(tab.key as any)}
          >
            {React.cloneElement(tab.icon as any, { color: isActive ? '#00C4FF' : '#888' })}
            <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  nav: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: '#333',
    backgroundColor: 'black',
  },
  tabButton: {
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: '#888',
    marginTop: 2,
  },
  activeLabel: {
    color: '#00C4FF',
    fontWeight: '600',
  },
  logo: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
});