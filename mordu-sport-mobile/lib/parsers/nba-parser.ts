import { XMLParser } from 'fast-xml-parser'
import type { NBAMatch, NBATeam } from '@/lib/types/basketball'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
  textNodeName: 'text',
  parseAttributeValue: true,
  parseTagValue: true,
})

/**
 * Parse les scores NBA depuis l'API GoalServe
 */
export function parseNBAScores(xmlData: string): NBAMatch[] {
  const result = parser.parse(xmlData)
  const matches: NBAMatch[] = []

  if (!result.scores?.category?.match) {
    return matches
  }

  const rawMatches = Array.isArray(result.scores.category.match) 
    ? result.scores.category.match 
    : [result.scores.category.match]

  for (const match of rawMatches) {
    const homeTeam: NBATeam = {
      id: match.hometeam.id || '',
      name: match.hometeam.name || '',
      abbr: match.hometeam.abbr || '',
      city: match.hometeam.city || '',
      conference: match.hometeam.conference || '',
      division: match.hometeam.division || '',
    }

    const awayTeam: NBATeam = {
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

    // Extraire les scores par quart-temps
    const homeScore = match.hometeam.totalscore ? parseInt(match.hometeam.totalscore) : undefined
    const awayScore = match.awayteam.totalscore ? parseInt(match.awayteam.totalscore) : undefined

    matches.push({
      id: match.id || '',
      league: 'NBA',
      date: match.date || '',
      time: match.time || '',
      status,
      period: match.timer || undefined,
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
 * Parse le classement NBA et extrait les équipes
 */
export function parseNBAStandings(xmlData: string): { teams: NBATeam[], conferences: any[] } {
  const result = parser.parse(xmlData)
  const teams: NBATeam[] = []
  const conferences: any[] = []

  if (!result.standings?.category?.league) {
    return { teams, conferences }
  }

  const leagues = Array.isArray(result.standings.category.league) 
    ? result.standings.category.league 
    : [result.standings.category.league]

  for (const league of leagues) {
    const conferenceName = league.name || ''
    const conferenceTeams: NBATeam[] = []

    const divisions = Array.isArray(league.division) 
      ? league.division 
      : [league.division]

    for (const division of divisions) {
      const divisionName = division.name || ''
      const divisionTeams = Array.isArray(division.team) 
        ? division.team 
        : [division.team]

      for (const team of divisionTeams) {
        const nbaTeam: NBATeam = {
          id: team.id || '',
          name: team.name || '',
          abbr: '', // Sera déduit du nom
          city: team.name?.split(' ').slice(0, -1).join(' ') || '',
          conference: conferenceName.replace(' Conference', ''),
          division: divisionName,
        }

        teams.push(nbaTeam)
        conferenceTeams.push(nbaTeam)
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
 * Parse les cotes NBA depuis le schedule
 */
export function parseNBAScheduleWithOdds(xmlData: string): NBAMatch[] {
  const result = parser.parse(xmlData)
  const matches: NBAMatch[] = []

  if (!result.schedule?.category?.match) {
    return matches
  }

  const rawMatches = Array.isArray(result.schedule.category.match) 
    ? result.schedule.category.match 
    : [result.schedule.category.match]

  for (const match of rawMatches) {
    const homeTeam: NBATeam = {
      id: match.hometeam.id || '',
      name: match.hometeam.name || '',
      abbr: match.hometeam.abbr || '',
      city: match.hometeam.city || '',
      conference: match.hometeam.conference || '',
      division: match.hometeam.division || '',
    }

    const awayTeam: NBATeam = {
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
      league: 'NBA',
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
