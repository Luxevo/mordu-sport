import { useState, useEffect } from 'react'
import { goalServeService } from '@/lib/services/goalserve'
import { parseNFLScores, parseNFLScheduleWithOdds, parseNFLStandings } from '@/lib/parsers/nfl-parser'
import type { NFLMatch, NFLTeam } from '@/lib/types/football'

/**
 * Hook pour récupérer les matchs NFL
 */
export function useNFLMatches(selectedDate?: Date) {
  const [matches, setMatches] = useState<NFLMatch[]>([])
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

        console.log('🏈 Fetching NFL matches for date:', dateString)

        // Charger les scores NFL
        const scoresXml = await goalServeService.getNFLScores(dateString)
        const parsedMatches = parseNFLScores(scoresXml)

        console.log('🏈 NFL matches found:', parsedMatches.length)

        setMatches(parsedMatches)
      } catch (err) {
        console.error('Erreur lors du chargement des matchs NFL:', err)
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
 * Hook pour récupérer un match NFL spécifique
 */
export function useNFLMatch(matchId: string) {
  const [match, setMatch] = useState<NFLMatch | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchMatch() {
      try {
        setLoading(true)
        setError(null)

        // Pour l'instant, on récupère tous les matchs et on filtre
        // TODO: Implémenter un endpoint spécifique pour un match
        const scoresXml = await goalServeService.getNFLScores()
        const matches = parseNFLScores(scoresXml)
        const foundMatch = matches.find(m => m.id === matchId)

        if (foundMatch) {
          setMatch(foundMatch)
        } else {
          setError('Match non trouvé')
        }
      } catch (err) {
        console.error('Erreur lors du chargement du match NFL:', err)
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
 * Hook pour récupérer le classement NFL
 */
export function useNFLStandings() {
  const [standings, setStandings] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStandings() {
      try {
        setLoading(true)
        setError(null)

        const standingsXml = await goalServeService.getNFLStandings()
        const { conferences } = parseNFLStandings(standingsXml)

        setStandings(conferences)
      } catch (err) {
        console.error('Erreur lors du chargement du classement NFL:', err)
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
 * Hook pour récupérer toutes les équipes NFL
 */
export function useNFLTeams() {
  const [teams, setTeams] = useState<NFLTeam[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTeams() {
      try {
        setLoading(true)
        setError(null)

        const standingsXml = await goalServeService.getNFLStandings()
        const { teams: allTeams } = parseNFLStandings(standingsXml)

        console.log('🏈 NFL teams loaded:', allTeams.length)

        setTeams(allTeams)
      } catch (err) {
        console.error('Erreur lors du chargement des équipes NFL:', err)
        setError(err instanceof Error ? err.message : 'Erreur inconnue')
      } finally {
        setLoading(false)
      }
    }

    fetchTeams()
  }, [])

  return { teams, loading, error }
}
