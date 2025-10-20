import { useState, useEffect } from 'react'
import { goalServeService } from '@/lib/services/goalserve'
import { parseNBAScores, parseNBAScheduleWithOdds, parseNBAStandings } from '@/lib/parsers/nba-parser'
import type { NBAMatch } from '@/lib/types/basketball'
import type { NBATeam } from '@/lib/types/basketball'

/**
 * Hook pour récupérer les matchs NBA
 */
export function useNBAMatches(selectedDate?: Date) {
  const [matches, setMatches] = useState<NBAMatch[]>([])
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

        console.log('🏀 Fetching NBA matches for date:', dateString)

        // Charger les scores NBA
        const scoresXml = await goalServeService.getNBAScores(dateString)
        const parsedMatches = parseNBAScores(scoresXml)

        console.log('🏀 NBA matches found:', parsedMatches.length)

        setMatches(parsedMatches)
      } catch (err) {
        console.error('Erreur lors du chargement des matchs NBA:', err)
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

  return { matches, loading, error }
}

/**
 * Hook pour récupérer un match NBA spécifique
 */
export function useNBAMatch(matchId: string) {
  const [match, setMatch] = useState<NBAMatch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatch() {
      try {
        setLoading(true)
        setError(null)

        // Pour l'instant, on récupère tous les matchs et on filtre
        // TODO: Implémenter un endpoint spécifique pour un match
        const scoresXml = await goalServeService.getNBAScores()
        const matches = parseNBAScores(scoresXml)
        const foundMatch = matches.find(m => m.id === matchId)

        if (foundMatch) {
          setMatch(foundMatch)
        } else {
          setError('Match non trouvé')
        }
      } catch (err) {
        console.error('Erreur lors du chargement du match NBA:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    if (matchId) {
      fetchMatch()
    }
  }, [matchId])

  return { match, loading, error }
}

/**
 * Hook pour récupérer le classement NBA
 */
export function useNBAStandings() {
  const [standings, setStandings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStandings() {
      try {
        setLoading(true)
        setError(null)

        const standingsXml = await goalServeService.getNBAStandings()
        const { conferences } = parseNBAStandings(standingsXml)

        setStandings(conferences)
      } catch (err) {
        console.error('Erreur lors du chargement du classement NBA:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchStandings()
  }, [])

  return { standings, loading, error }
}

/**
 * Hook pour récupérer toutes les équipes NBA
 */
export function useNBATeams() {
  const [teams, setTeams] = useState<NBATeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true)
        setError(null)

        const standingsXml = await goalServeService.getNBAStandings()
        const { teams: allTeams } = parseNBAStandings(standingsXml)

        console.log('🏀 NBA teams loaded:', allTeams.length)

        setTeams(allTeams)  
      } catch (err: unknown) {
        if (err instanceof Error) {
          console.error(err.message)
          setError(err.message)
        } else {
          console.error('Erreur inconnue', err)
          setError('Erreur inconnue')
        }
      }
    }

    fetchTeams()
  }, [])

  return { teams, loading, error }
}
