// Hooks React pour charger les données d'équipes NHL depuis GoalServe
'use client'

import { useState, useEffect } from 'react'
import { goalServeService } from '@/lib/services/goalserve'
import { 
  parseTeamRoster, 
  parseTeamPlayerStats, 
  parseTeamStats, 
  parseTeamInjuries,
  NHL_TEAMS 
} from '@/lib/parsers/team-parser'
import type { TeamRoster, Player, TeamStats, Injury, TeamInfo } from '@/lib/types/team'

/**
 * Hook pour récupérer le roster d'une équipe
 */
export function useTeamRoster(teamId: string) {
  const [roster, setRoster] = useState<TeamRoster | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchRoster() {
      try {
        setLoading(true)
        setError(null)

        const rosterXml = await goalServeService.getTeamRoster(teamId)
        const parsedRoster = parseTeamRoster(rosterXml)

        setRoster(parsedRoster)
      } catch (err) {
        console.error('Erreur lors du chargement du roster:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    if (teamId) {
      fetchRoster()
    }
  }, [teamId])

  return { roster, loading, error }
}

/**
 * Hook pour récupérer les statistiques des joueurs d'une équipe
 */
export function useTeamPlayerStats(teamId: string) {
  const [players, setPlayers] = useState<Player[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchPlayerStats() {
      try {
        setLoading(true)
        setError(null)

        console.log('🔍 Fetching player stats for team:', teamId)
        const statsXml = await goalServeService.getTeamPlayerStats(teamId)
        console.log('📄 XML received, length:', statsXml.length)
        console.log('📄 XML preview:', statsXml.substring(0, 200))
        
        const parsedPlayers = parseTeamPlayerStats(statsXml)
        console.log('✅ Parsed players:', parsedPlayers.length)
        console.log('✅ First player:', parsedPlayers[0])

        setPlayers(parsedPlayers)
      } catch (err) {
        console.error('Erreur lors du chargement des stats joueurs:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    if (teamId) {
      fetchPlayerStats()
    }
  }, [teamId])

  return { players, loading, error }
}

/**
 * Hook pour récupérer les statistiques globales d'une équipe
 */
export function useTeamStats(teamId: string) {
  const [stats, setStats] = useState<TeamStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTeamStats() {
      try {
        setLoading(true)
        setError(null)

        const statsXml = await goalServeService.getTeamStats(teamId)
        const parsedStats = parseTeamStats(statsXml)

        setStats(parsedStats)
      } catch (err) {
        console.error('Erreur lors du chargement des stats équipe:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    if (teamId) {
      fetchTeamStats()
    }
  }, [teamId])

  return { stats, loading, error }
}

/**
 * Hook pour récupérer les blessures d'une équipe
 */
export function useTeamInjuries(teamId: string) {
  const [injuries, setInjuries] = useState<Injury[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchInjuries() {
      try {
        setLoading(true)
        setError(null)

        const injuriesXml = await goalServeService.getTeamInjuries(teamId)
        const parsedInjuries = parseTeamInjuries(injuriesXml)

        setInjuries(parsedInjuries)
      } catch (err) {
        console.error('Erreur lors du chargement des blessures:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    if (teamId) {
      fetchInjuries()
    }
  }, [teamId])

  return { injuries, loading, error }
}

/**
 * Hook pour récupérer toutes les données d'une équipe en une fois
 */
export function useTeamData(teamId: string) {
  const rosterData = useTeamRoster(teamId)
  const playerStatsData = useTeamPlayerStats(teamId)
  const teamStatsData = useTeamStats(teamId)
  const injuriesData = useTeamInjuries(teamId)

  const loading = rosterData.loading || playerStatsData.loading || 
                  teamStatsData.loading || injuriesData.loading

  const error = rosterData.error || playerStatsData.error || 
                teamStatsData.error || injuriesData.error

  return {
    roster: rosterData.roster,
    players: playerStatsData.players,
    teamStats: teamStatsData.stats,
    injuries: injuriesData.injuries,
    loading,
    error,
  }
}

/**
 * Hook pour récupérer la liste de toutes les équipes NHL
 */
export function useNHLTeams() {
  return { teams: NHL_TEAMS }
}

