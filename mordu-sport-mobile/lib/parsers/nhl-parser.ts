// Parser pour les données XML de GoalServe NHL
import { XMLParser } from 'fast-xml-parser'
import type { Match, Team, Odds, Standing, Division, Conference } from '@/lib/types/hockey'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
})

/**
 * Parse les scores NHL depuis le XML GoalServe
 */
export function parseNHLScores(xmlData: string): Match[] {
  const result = parser.parse(xmlData)
  const matches: Match[] = []

  if (!result.scores?.category?.match) {
    return matches
  }

  const rawMatches = Array.isArray(result.scores.category.match)
    ? result.scores.category.match
    : [result.scores.category.match]

  for (const match of rawMatches) {
    const homeTeam: Team = {
      id: match.hometeam?.id || '',
      name: match.hometeam?.name || '',
      abbr: getTeamAbbr(match.hometeam?.name),
      score: match.hometeam?.totalscore ? parseInt(match.hometeam.totalscore) : undefined,
      p1: match.hometeam?.p1 ? parseInt(match.hometeam.p1) : undefined,
      p2: match.hometeam?.p2 ? parseInt(match.hometeam.p2) : undefined,
      p3: match.hometeam?.p3 ? parseInt(match.hometeam.p3) : undefined,
      ot: match.hometeam?.ot ? parseInt(match.hometeam.ot) : undefined,
      so: match.hometeam?.so ? parseInt(match.hometeam.so) : undefined,
    }

    const awayTeam: Team = {
      id: match.awayteam?.id || '',
      name: match.awayteam?.name || '',
      abbr: getTeamAbbr(match.awayteam?.name),
      score: match.awayteam?.totalscore ? parseInt(match.awayteam.totalscore) : undefined,
      p1: match.awayteam?.p1 ? parseInt(match.awayteam.p1) : undefined,
      p2: match.awayteam?.p2 ? parseInt(match.awayteam.p2) : undefined,
      p3: match.awayteam?.p3 ? parseInt(match.awayteam.p3) : undefined,
      ot: match.awayteam?.ot ? parseInt(match.awayteam.ot) : undefined,
      so: match.awayteam?.so ? parseInt(match.awayteam.so) : undefined,
    }

    const status = getMatchStatus(match.status)
    const period = getCurrentPeriod(match)

    matches.push({
      id: match.id,
      league: 'NHL',
      date: match.date,
      time: match.time || '',
      status,
      period,
      timeRemaining: match.timer || undefined,
      homeTeam,
      awayTeam,
      venue: match.venue_name || '',
      venueId: match.venue_id,
      formattedDate: match.formatted_date,
      datetimeUtc: match.datetime_utc,
    })
  }

  return matches
}

/**
 * Parse le schedule NHL avec les odds depuis le XML GoalServe
 */
export function parseNHLScheduleWithOdds(xmlData: string): Match[] {
  const result = parser.parse(xmlData)
  const matches: Match[] = []

  if (!result.shedules?.matches) {
    return matches
  }

  const matchDays = Array.isArray(result.shedules.matches)
    ? result.shedules.matches
    : [result.shedules.matches]

  for (const day of matchDays) {
    if (!day.match) continue

    const rawMatches = Array.isArray(day.match) ? day.match : [day.match]

    for (const match of rawMatches) {
      const homeTeam: Team = {
        id: match.hometeam?.id || '',
        name: match.hometeam?.name || '',
        abbr: getTeamAbbr(match.hometeam?.name),
        score: match.hometeam?.totalscore ? parseInt(match.hometeam.totalscore) : undefined,
      }

      const awayTeam: Team = {
        id: match.awayteam?.id || '',
        name: match.awayteam?.name || '',
        abbr: getTeamAbbr(match.awayteam?.name),
        score: match.awayteam?.totalscore ? parseInt(match.awayteam.totalscore) : undefined,
      }

      // Extraire les cotes BET99
      const bet99Odds = extractBet99Odds(match.odds)

      const status = getMatchStatus(match.status)

      matches.push({
        id: match.id,
        league: 'NHL',
        date: match.date,
        time: match.time || '',
        status,
        homeTeam,
        awayTeam,
        venue: match.venue_name || '',
        venueId: match.venue_id,
        odds: bet99Odds,
        formattedDate: match.formatted_date,
        datetimeUtc: match.datetime_utc,
      })
    }
  }

  return matches
}

/**
 * Parse les standings NHL depuis le XML GoalServe
 */
export function parseNHLStandings(xmlData: string): Conference[] {
  const result = parser.parse(xmlData)
  const conferences: Conference[] = []

  if (!result.standings?.category?.league) {
    return conferences
  }

  const leagues = Array.isArray(result.standings.category.league)
    ? result.standings.category.league
    : [result.standings.category.league]

  for (const league of leagues) {
    const divisions: Division[] = []

    const rawDivisions = Array.isArray(league.division) ? league.division : [league.division]

    for (const division of rawDivisions) {
      const teams: Standing[] = []

      const rawTeams = Array.isArray(division.team) ? division.team : [division.team]

      for (const team of rawTeams) {
        teams.push({
          position: parseInt(team.position),
          teamId: team.id,
          teamName: team.name,
          gamesPlayed: parseInt(team.games_played),
          wins: parseInt(team.won),
          losses: parseInt(team.lost),
          otLosses: parseInt(team.ot_losses),
          points: parseInt(team.points),
          goalsFor: parseInt(team.goals_for),
          goalsAgainst: parseInt(team.goals_against),
          difference: team.difference,
          homeRecord: team.home_record,
          roadRecord: team.road_record,
          streak: team.streak,
        })
      }

      divisions.push({
        name: division.name,
        teams,
      })
    }

    conferences.push({
      name: league.name,
      divisions,
    })
  }

  return conferences
}

/**
 * Extrait les cotes BET99 depuis les odds XML
 */
function extractBet99Odds(odds: any): Odds | undefined {
  if (!odds?.type?.bookmaker) return undefined

  const bookmakers = Array.isArray(odds.type.bookmaker)
    ? odds.type.bookmaker
    : [odds.type.bookmaker]

  const bet99 = bookmakers.find((b: any) => b.name === 'BET99')
  if (!bet99?.odd) return undefined

  const oddsList = Array.isArray(bet99.odd) ? bet99.odd : [bet99.odd]

  // odd[0] = home (name="1"), odd[1] = away (name="2")
  const homeOdd = oddsList.find((o: any) => o.name === '1')
  const awayOdd = oddsList.find((o: any) => o.name === '2')

  return {
    bookmaker: 'BET99',
    home: homeOdd?.value || '',
    away: awayOdd?.value || '',
    timestamp: odds.ts ? parseInt(odds.ts) : undefined,
  }
}

/**
 * Convertit le status GoalServe en notre format
 */
function getMatchStatus(status: string): 'upcoming' | 'live' | 'finished' {
  if (!status) return 'upcoming'
  
  const statusLower = status.toLowerCase()
  if (statusLower.includes('not started')) return 'upcoming'
  if (statusLower.includes('finished') || statusLower.includes('final')) return 'finished'
  return 'live'
}

/**
 * Détermine la période actuelle du match
 */
function getCurrentPeriod(match: any): string | undefined {
  if (match.status !== 'Live') return undefined

  // Vérifier quelle période a des données
  if (match.hometeam?.p3 || match.awayteam?.p3) return '3e'
  if (match.hometeam?.p2 || match.awayteam?.p2) return '2e'
  if (match.hometeam?.p1 || match.awayteam?.p1) return '1ère'
  if (match.hometeam?.ot || match.awayteam?.ot) return 'Prol.'
  
  return '1ère'
}

/**
 * Génère l'abréviation de l'équipe depuis le nom complet
 */
function getTeamAbbr(teamName: string | undefined): string {
  if (!teamName) return ''

  const abbrs: { [key: string]: string } = {
    'Montreal Canadiens': 'MTL',
    'Toronto Maple Leafs': 'TOR',
    'Boston Bruins': 'BOS',
    'New York Rangers': 'NYR',
    'Tampa Bay Lightning': 'TBL',
    'Florida Panthers': 'FLA',
    'Detroit Red Wings': 'DET',
    'Buffalo Sabres': 'BUF',
    'Ottawa Senators': 'OTT',
    'Pittsburgh Penguins': 'PIT',
    'Washington Capitals': 'WSH',
    'New Jersey Devils': 'NJD',
    'New York Islanders': 'NYI',
    'Philadelphia Flyers': 'PHI',
    'Carolina Hurricanes': 'CAR',
    'Columbus Blue Jackets': 'CBJ',
    'Dallas Stars': 'DAL',
    'Colorado Avalanche': 'COL',
    'Nashville Predators': 'NSH',
    'Minnesota Wild': 'MIN',
    'St. Louis Blues': 'STL',
    'Winnipeg Jets': 'WPG',
    'Chicago Blackhawks': 'CHI',
    'Los Angeles Kings': 'LAK',
    'Edmonton Oilers': 'EDM',
    'Anaheim Ducks': 'ANA',
    'Vancouver Canucks': 'VAN',
    'Seattle Kraken': 'SEA',
    'Calgary Flames': 'CGY',
    'Vegas Golden Knights': 'VGK',
    'San Jose Sharks': 'SJS',
    'Utah Mammoth': 'UTA',
  }

  return abbrs[teamName] || teamName.substring(0, 3).toUpperCase()
}

/**
 * Trouve le record d'une équipe dans les standings
 */
export function getTeamRecord(standings: any, teamName: string): string {
  if (!standings || !Array.isArray(standings)) {
    return "0-0-0"
  }

  for (const conference of standings) {
    if (!conference || !conference.divisions || !Array.isArray(conference.divisions)) {
      continue
    }
    
    for (const division of conference.divisions) {
      if (!division || !division.teams || !Array.isArray(division.teams)) {
        continue
      }
      
      const team = division.teams.find((t: any) => t.teamName === teamName)
      if (team) {
        return `${team.wins}-${team.losses}-${team.otLosses}`
      }
    }
  }
  return "0-0-0"
}

