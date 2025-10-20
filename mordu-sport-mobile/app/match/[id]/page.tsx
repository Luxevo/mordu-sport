import { View, Text, ActivityIndicator, StyleSheet } from "react-native"
import { useState } from "react"
import { MatchHeader } from "@/components/match-header"
import { MatchBanner } from "@/components/match-banner"
import { MatchTabs } from "@/components/match-tabs"
import { BottomNav } from "@/components/bottom-nav"
import { useNHLMatch } from "@/lib/hooks/useNHLData"

export default function MatchPage({ params }: { params: { id: string } }) {
  const { match, loading, error } = useNHLMatch(params.id)
  const [activeTab, setActiveTab] = useState<'results' | 'teams' | 'favorites' | 'mordu'>('results')

  const handleTabPress = (tab: 'results' | 'teams' | 'favorites' | 'mordu') => {
    setActiveTab(tab)
    console.log('Tab pressed:', tab)
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3b82f6" />
        <Text style={styles.loadingText}>Chargement du match...</Text>
      </View>
    )
  }

  if (error || !match) {
    return (
      <View style={styles.errorContainer}>
        <View style={styles.errorBox}>
          <Text style={styles.errorTitle}>
            {error || "Match introuvable"}
          </Text>
          <Text style={styles.errorSubtitle}>
            Ce match n'existe pas ou n'est plus disponible
          </Text>
        </View>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <MatchHeader />
      <MatchBanner match={match} />
      <View style={styles.main}>
        <MatchTabs match={match} />
      </View>
      <BottomNav activeTab={activeTab} onTabPress={handleTabPress} />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 16,
    fontSize: 14,
    color: '#9ca3af',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 16,
  },
  errorBox: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.5)',
    borderRadius: 8,
    padding: 24,
    maxWidth: 400,
  },
  errorTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#ef4444',
    marginBottom: 8,
    textAlign: 'center',
  },
  errorSubtitle: {
    fontSize: 12,
    color: '#9ca3af',
    textAlign: 'center',
  },
  main: {
    flex: 1,
  },
})