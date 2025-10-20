// Parser pour les données d'équipes NHL de GoalServe
import { XMLParser } from 'fast-xml-parser'
import type { Player, TeamRoster, TeamStats, Injury } from '@/lib/types/team'

const parser = new XMLParser({
  ignoreAttributes: false,
  attributeNamePrefix: '',
})

/**
 * Parse le roster d'une équipe depuis le XML GoalServe
 */
export function parseTeamRoster(xmlData: string): TeamRoster {
  const result = parser.parse(xmlData)
  
  const teamData = result.team
  const teamId = teamData?.id || ''
  const teamName = teamData?.name || ''

  const forwards: Player[] = []
  const defensemen: Player[] = []
  const goalies: Player[] = []

  // Parser les joueurs par position groupée
  if (teamData?.position) {
    const positions = Array.isArray(teamData.position) ? teamData.position : [teamData.position]
    
    for (const posGroup of positions) {
      const positionName = posGroup.name || ''
      const players = posGroup.player ? (Array.isArray(posGroup.player) ? posGroup.player : [posGroup.player]) : []
      
      for (const player of players) {
        const playerObj: Player = {
          id: player.id || '',
          name: player.name || '',
          number: player.number || '',
          position: positionName,
          age: player.age,
          height: player.height,
          weight: player.weight,
          birthplace: player.birth_place,
        }

        // Classifier selon le nom de la position
        if (positionName === 'Goalies') {
          goalies.push(playerObj)
        } else if (positionName === 'Defense') {
          defensemen.push(playerObj)
        } else {
          // Centers, Left Wings, Right Wings
          forwards.push(playerObj)
        }
      }
    }
  }

  return {
    teamId,
    teamName,
    forwards,
    defensemen,
    goalies,
  }
}

/**
 * Parse les statistiques des joueurs d'une équipe
 */
export function parseTeamPlayerStats(xmlData: string): Player[] {
  const result = parser.parse(xmlData)
  const players: Player[] = []

  console.log('🔧 Parser debug - result keys:', Object.keys(result))
  console.log('🔧 Parser debug - statistic:', result.statistic)
  console.log('🔧 Parser debug - statistic keys:', Object.keys(result.statistic || {}))

  // La structure est différente : result.statistic contient directement les joueurs
  if (!result.statistic?.player) {
    console.log('❌ No players found in XML structure')
    return players
  }

  const rawPlayers = Array.isArray(result.statistic.player) 
    ? result.statistic.player 
    : [result.statistic.player]

  for (const player of rawPlayers) {
    players.push({
      id: player.id || '',
      name: player.name || '',
      number: '', // Not provided in stats API
      position: player.pos || '',
      gamesPlayed: player.games_played ? parseInt(player.games_played) : undefined,
      goals: player.goals ? parseInt(player.goals) : undefined,
      assists: player.assists ? parseInt(player.assists) : undefined,
      points: player.points ? parseInt(player.points) : undefined,
      plusMinus: player.plus_minus ? parseInt(player.plus_minus) : undefined,
      penaltyMinutes: player.penalty_minutes ? parseInt(player.penalty_minutes) : undefined,
      // Stats gardiens - pas de stats de gardiens dans cet endpoint
      wins: undefined,
      losses: undefined,
      goalsAgainstAverage: undefined,
      savePercentage: undefined,
    })
  }

  return players
}

/**
 * Parse les statistiques globales d'une équipe
 */
export function parseTeamStats(xmlData: string): TeamStats | null {
  const result = parser.parse(xmlData)
  
  if (!result.statistic?.category) {
    return null
  }

  const categories = Array.isArray(result.statistic.category) 
    ? result.statistic.category 
    : [result.statistic.category]

  // Trouver les catégories Skating et Goaltending
  const skating = categories.find((c: any) => c.name === 'Skating')
  const goaltending = categories.find((c: any) => c.name === 'Goaltending')

  const skatingTeam = skating?.team || {}
  const goaltendingTeam = goaltending?.team || {}

  const gamesPlayed = parseInt(skatingTeam.games_played || '0')
  const goalsFor = Math.round(parseFloat(skatingTeam.goals_for_per_game || '0') * gamesPlayed)
  const goalsAgainst = Math.round(parseFloat(goaltendingTeam.goals_against_per_game || '0') * gamesPlayed)

  return {
    teamId: result.statistic.id || '',
    teamName: result.statistic.team || '',
    gamesPlayed,
    wins: parseInt(goaltendingTeam.wins || '0'),
    losses: parseInt(goaltendingTeam.losses || '0'),
    otLosses: parseInt(goaltendingTeam.overtime_losses || '0'),
    points: (parseInt(goaltendingTeam.wins || '0') * 2) + parseInt(goaltendingTeam.overtime_losses || '0'),
    goalsFor,
    goalsAgainst,
    powerPlayGoals: parseInt(skatingTeam.powerplay_goals || '0'),
    powerPlayOpportunities: 0, // Not provided
    powerPlayPercentage: (skatingTeam.powerplay_pct || '0') + '%',
    penaltyKillPercentage: (skatingTeam.penalty_kill_pct || '0') + '%',
    shotsPerGame: Math.round(parseInt(skatingTeam.shots || '0') / gamesPlayed * 10) / 10,
    shotsAllowedPerGame: Math.round(parseInt(goaltendingTeam.shots_against || '0') / gamesPlayed * 10) / 10,
    faceoffWinPercentage: '0%', // Not provided
  }
}

/**
 * Parse les blessures d'une équipe
 */
export function parseTeamInjuries(xmlData: string): Injury[] {
  const result = parser.parse(xmlData)
  const injuries: Injury[] = []

  if (!result.team?.report) {
    return injuries
  }

  const rawInjuries = Array.isArray(result.team.report) 
    ? result.team.report 
    : [result.team.report]

  for (const injury of rawInjuries) {
    injuries.push({
      playerId: injury.player_id || '',
      playerName: injury.player_name || '',
      position: '', // Position not provided in injuries API
      injury: injury.description || '',
      status: injury.status || '',
      date: injury.date,
    })
  }

  return injuries
}

/**
 * Liste des équipes NHL avec leurs IDs GoalServe
 */
export const NHL_TEAMS = [
  // Atlantic Division
  { id: '1157', name: 'Tampa Bay Lightning', abbr: 'TBL', city: 'Tampa Bay', division: 'Atlantic', conference: 'Eastern' },
  { id: '1143', name: 'Detroit Red Wings', abbr: 'DET', city: 'Detroit', division: 'Atlantic', conference: 'Eastern' },
  { id: '1160', name: 'Boston Bruins', abbr: 'BOS', city: 'Boston', division: 'Atlantic', conference: 'Eastern' },
  { id: '1115', name: 'Montreal Canadiens', abbr: 'MTL', city: 'Montreal', division: 'Atlantic', conference: 'Eastern' },
  { id: '1162', name: 'Buffalo Sabres', abbr: 'BUF', city: 'Buffalo', division: 'Atlantic', conference: 'Eastern' },
  { id: '1188', name: 'Ottawa Senators', abbr: 'OTT', city: 'Ottawa', division: 'Atlantic', conference: 'Eastern' },
  { id: '1136', name: 'Toronto Maple Leafs', abbr: 'TOR', city: 'Toronto', division: 'Atlantic', conference: 'Eastern' },
  { id: '1156', name: 'Florida Panthers', abbr: 'FLA', city: 'Florida', division: 'Atlantic', conference: 'Eastern' },
  
  // Metropolitan Division
  { id: '1131', name: 'Pittsburgh Penguins', abbr: 'PIT', city: 'Pittsburgh', division: 'Metropolitan', conference: 'Eastern' },
  { id: '1150', name: 'Washington Capitals', abbr: 'WSH', city: 'Washington', division: 'Metropolitan', conference: 'Eastern' },
  { id: '1145', name: 'New Jersey Devils', abbr: 'NJD', city: 'New Jersey', division: 'Metropolitan', conference: 'Eastern' },
  { id: '1166', name: 'New York Islanders', abbr: 'NYI', city: 'New York', division: 'Metropolitan', conference: 'Eastern' },
  { id: '1027', name: 'Philadelphia Flyers', abbr: 'PHI', city: 'Philadelphia', division: 'Metropolitan', conference: 'Eastern' },
  { id: '1172', name: 'New York Rangers', abbr: 'NYR', city: 'New York', division: 'Metropolitan', conference: 'Eastern' },
  { id: '1126', name: 'Carolina Hurricanes', abbr: 'CAR', city: 'Carolina', division: 'Metropolitan', conference: 'Eastern' },
  { id: '1141', name: 'Columbus Blue Jackets', abbr: 'CBJ', city: 'Columbus', division: 'Metropolitan', conference: 'Eastern' },
  
  // Central Division
  { id: '1146', name: 'Dallas Stars', abbr: 'DAL', city: 'Dallas', division: 'Central', conference: 'Western' },
  { id: '1137', name: 'Colorado Avalanche', abbr: 'COL', city: 'Colorado', division: 'Central', conference: 'Western' },
  { id: '1185', name: 'Nashville Predators', abbr: 'NSH', city: 'Nashville', division: 'Central', conference: 'Western' },
  { id: '1125', name: 'Minnesota Wild', abbr: 'MIN', city: 'Minnesota', division: 'Central', conference: 'Western' },
  { id: '1288', name: 'St. Louis Blues', abbr: 'STL', city: 'St. Louis', division: 'Central', conference: 'Western' },
  { id: '2786', name: 'Winnipeg Jets', abbr: 'WPG', city: 'Winnipeg', division: 'Central', conference: 'Western' },
  { id: '9404', name: 'Utah Mammoth', abbr: 'UTA', city: 'Utah', division: 'Central', conference: 'Western' },
  { id: '1028', name: 'Chicago Blackhawks', abbr: 'CHI', city: 'Chicago', division: 'Central', conference: 'Western' },
  
  // Pacific Division
  { id: '1169', name: 'Los Angeles Kings', abbr: 'LAK', city: 'Los Angeles', division: 'Pacific', conference: 'Western' },
  { id: '1139', name: 'Edmonton Oilers', abbr: 'EDM', city: 'Edmonton', division: 'Pacific', conference: 'Western' },
  { id: '1144', name: 'Anaheim Ducks', abbr: 'ANA', city: 'Anaheim', division: 'Pacific', conference: 'Western' },
  { id: '1181', name: 'Vancouver Canucks', abbr: 'VAN', city: 'Vancouver', division: 'Pacific', conference: 'Western' },
  { id: '7414', name: 'Seattle Kraken', abbr: 'SEA', city: 'Seattle', division: 'Pacific', conference: 'Western' },
  { id: '1140', name: 'Calgary Flames', abbr: 'CGY', city: 'Calgary', division: 'Pacific', conference: 'Western' },
  { id: '6264', name: 'Vegas Golden Knights', abbr: 'VGK', city: 'Vegas', division: 'Pacific', conference: 'Western' },
  { id: '1124', name: 'San Jose Sharks', abbr: 'SJS', city: 'San Jose', division: 'Pacific', conference: 'Western' },
]

/**
 * Trouve une équipe par ID
 */
export function getTeamById(teamId: string) {
  return NHL_TEAMS.find(team => team.id === teamId)
}

/**
 * Trouve une équipe par abréviation
 */
export function getTeamByAbbr(abbr: string) {
  return NHL_TEAMS.find(team => team.abbr === abbr)
}

