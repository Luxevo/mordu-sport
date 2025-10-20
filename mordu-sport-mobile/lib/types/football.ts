// Types pour les données NFL de GoalServe

export interface NFLTeam {
  id: string
  name: string
  abbr: string
  city: string
  conference: string
  division: string
  score?: number
}

export interface NFLPlayer {
  id: string
  name: string
  number: string
  position: string
  age?: string
  height?: string
  weight?: string
  // Stats de joueur
  gamesPlayed?: number
  passingYards?: number
  passingTouchdowns?: number
  rushingYards?: number
  rushingTouchdowns?: number
  receivingYards?: number
  receivingTouchdowns?: number
  tackles?: number
  sacks?: number
  interceptions?: number
}

export interface NFLMatch {
  id: string
  league: string
  date: string
  time: string
  status: "upcoming" | "live" | "finished"
  quarter?: string
  timeRemaining?: string
  homeTeam: NFLTeam
  awayTeam: NFLTeam
  venue: string
  odds?: {
    bookmaker: string
    home: string
    away: string
  }
}

export interface NFLInjury {
  playerId: string
  playerName: string
  position: string
  injury: string
  status: string
  date?: string
}

export interface NFLTeamStats {
  teamId: string
  teamName: string
  gamesPlayed: number
  wins: number
  losses: number
  ties: number
  pointsFor: number
  pointsAgainst: number
  passingYardsPerGame: number
  rushingYardsPerGame: number
  totalYardsPerGame: number
}
