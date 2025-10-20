import { XMLParser } from 'fast-xml-parser'
import type { NFLMatch, NFLTeam } from '@/lib/types/football'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  textNodeName: 'text',
  parseAttributeValue: true,
  parseTagValue: true,
})

/**
 * Parse les scores NFL depuis l'API GoalServe
 */
export function parseNFLScores(xmlData: string): NFLMatch[] {
  const result = parser.parse(xmlData)
  const matches: NFLMatch[] = []

  if (!result.scores?.category?.match) {
    return matches
  }

  const rawMatches = Array.isArray(result.scores.category.match) 
    ? result.scores.category.match 
    : [result.scores.category.match]

  for (const match of rawMatches) {
    const homeTeam: NFLTeam = {
      id: match.hometeam.id || '',
      name: match.hometeam.name || '',
      abbr: match.hometeam.abbr || '',
      city: match.hometeam.city || '',
      conference: match.hometeam.conference || '',
      division: match.hometeam.division || '',
    }

    const awayTeam: NFLTeam = {
      id: match.awayteam.id || '',
      name: match.awayteam.name || '',
      abbr: match.awayteam.abbr || '',
      city: match.awayteam.city || '',
      conference: match.awayteam.conference || '',
      division: match.awayteam.division || '',
    }

    // Déterminer le statut
    let status: "upcoming" | "live" | "finished" = "upcoming"
    if (match.status === "Finished" || match.status === "Final") {
      status = "finished"
    } else if (match.status === "Live" || match.status === "In Progress") {
      status = "live"
    }

    // Extraire les scores
    const homeScore = match.hometeam.totalscore ? parseInt(match.hometeam.totalscore) : undefined
    const awayScore = match.awayteam.totalscore ? parseInt(match.awayteam.totalscore) : undefined

    matches.push({
      id: match.id || '',
      league: 'NFL',
      date: match.date || '',
      time: match.time || '',
      status,
      quarter: match.timer || undefined,
      timeRemaining: match.timer || undefined,
      homeTeam: {
        ...homeTeam,
        score: homeScore,
      },
      awayTeam: {
        ...awayTeam,
        score: awayScore,
      },
      venue: match.venue_name || '',
    })
  }

  return matches
}

/**
 * Parse le classement NFL et extrait les équipes
 */
export function parseNFLStandings(xmlData: string): { teams: NFLTeam[], conferences: any[] } {
  const result = parser.parse(xmlData)
  const teams: NFLTeam[] = []
  const conferences: any[] = []

  if (!result.standings?.category?.league) {
    return { teams, conferences }
  }

  const leagues = Array.isArray(result.standings.category.league) 
    ? result.standings.category.league 
    : [result.standings.category.league]

  for (const league of leagues) {
    const conferenceName = league.name || ''
    const conferenceTeams: NFLTeam[] = []

    const divisions = Array.isArray(league.division) 
      ? league.division 
      : [league.division]

    for (const division of divisions) {
      const divisionName = division.name || ''
      const divisionTeams = Array.isArray(division.team) 
        ? division.team 
        : [division.team]

      for (const team of divisionTeams) {
        const nflTeam: NFLTeam = {
          id: team.id || '',
          name: team.name || '',
          abbr: '', // Sera déduit du nom
          city: team.name?.split(' ').slice(0, -1).join(' ') || '',
          conference: conferenceName.includes('American') ? 'AFC' : 'NFC',
          division: divisionName,
        }

        teams.push(nflTeam)
        conferenceTeams.push(nflTeam)
      }
    }

    conferences.push({
      name: conferenceName,
      teams: conferenceTeams,
    })
  }

  return { teams, conferences }
}

/**
 * Parse les cotes NFL depuis le schedule
 */
export function parseNFLScheduleWithOdds(xmlData: string): NFLMatch[] {
  const result = parser.parse(xmlData)
  const matches: NFLMatch[] = []

  if (!result.schedule?.category?.match) {
    return matches
  }

  const rawMatches = Array.isArray(result.schedule.category.match) 
    ? result.schedule.category.match 
    : [result.schedule.category.match]

  for (const match of rawMatches) {
    const homeTeam: NFLTeam = {
      id: match.hometeam.id || '',
      name: match.hometeam.name || '',
      abbr: match.hometeam.abbr || '',
      city: match.hometeam.city || '',
      conference: match.hometeam.conference || '',
      division: match.hometeam.division || '',
    }

    const awayTeam: NFLTeam = {
      id: match.awayteam.id || '',
      name: match.awayteam.name || '',
      abbr: match.awayteam.abbr || '',
      city: match.awayteam.city || '',
      conference: match.awayteam.conference || '',
      division: match.awayteam.division || '',
    }

    // Extraire les cotes si disponibles
    let odds = undefined
    if (match.odds) {
      odds = {
        bookmaker: match.odds.bookmaker || 'BET99',
        home: match.odds.home || '',
        away: match.odds.away || '',
      }
    }

    matches.push({
      id: match.id || '',
      league: 'NFL',
      date: match.date || '',
      time: match.time || '',
      status: "upcoming",
      homeTeam,
      awayTeam,
      venue: match.venue_name || '',
      odds,
    })
  }

  return matches
}
