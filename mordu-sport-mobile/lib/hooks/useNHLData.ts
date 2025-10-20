// Hook React pour charger les données NHL depuis GoalServe
'use client'

import { useState, useEffect } from 'react'
import { goalServeService } from '@/lib/services/goalserve'
import { parseNHLScores, parseNHLScheduleWithOdds, parseNHLStandings, getTeamRecord } from '@/lib/parsers/nhl-parser'
import type { Match, Conference } from '@/lib/types/hockey'

export function useNHLMatches(selectedDate?: Date) {
  const [matches, setMatches] = useState<Match[]>([])
  const [standings, setStandings] = useState<Conference[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        // Formater la date pour l'API GoalServe (dd.MM.yyyy)
        const dateString = selectedDate 
          ? `${selectedDate.getDate().toString().padStart(2, '0')}.${(selectedDate.getMonth() + 1).toString().padStart(2, '0')}.${selectedDate.getFullYear()}`
          : undefined

        console.log('📅 Fetching matches for date:', dateString)

        // Charger les scores et standings en parallèle
        const [scoresXml, standingsXml] = await Promise.all([
          goalServeService.getNHLScores(dateString),
          goalServeService.getNHLStandings(),
        ])

        const parsedStandings = parseNHLStandings(standingsXml)
        const parsedMatches = parseNHLScores(scoresXml)

        // Ajouter les records des équipes aux matchs
        const matchesWithRecords = parsedMatches.map((match) => ({
          ...match,
          homeTeam: {
            ...match.homeTeam,
            record: getTeamRecord(parsedStandings, match.homeTeam.name),
          },
          awayTeam: {
            ...match.awayTeam,
            record: getTeamRecord(parsedStandings, match.awayTeam.name),
          },
        }))

        setMatches(matchesWithRecords)
        setStandings(parsedStandings)
      } catch (err) {
        console.error('Erreur lors du chargement des données NHL:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
    
    // Rafraîchir toutes les 30 secondes pour les matchs en direct
    const interval = setInterval(fetchData, 30000)
    return () => clearInterval(interval)
  }, [selectedDate])

  return { matches, standings, loading, error }
}

export function useNHLScheduleWithOdds(date1?: string, date2?: string) {
  const [matches, setMatches] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true)
        setError(null)

        const scheduleXml = await goalServeService.getNHLSchedule(date1, date2, true)
        const parsedMatches = parseNHLScheduleWithOdds(scheduleXml)

        setMatches(parsedMatches)
      } catch (err) {
        console.error('Erreur lors du chargement du schedule NHL:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [date1, date2])

  return { matches, loading, error }
}

export function useNHLMatch(matchId: string) {
  const { matches, loading, error } = useNHLMatches()
  const match = matches.find((m) => m.id === matchId)

  return { match, loading, error }
}

