// Types pour les données NBA de GoalServe

export interface NBATeam {
  id: string
  name: string
  abbr: string
  city: string
  conference: string
  division: string
  score?: number
}

export interface NBAPlayer {
  id: string
  name: string
  number: string
  position: string
  age?: string
  height?: string
  weight?: string
  // Stats de joueur
  gamesPlayed?: number
  points?: number
  rebounds?: number
  assists?: number
  steals?: number
  blocks?: number
  fieldGoalPercentage?: string
  threePointPercentage?: string
  freeThrowPercentage?: string
}

export interface NBAMatch {
  id: string
  league: string
  date: string
  time: string
  status: "upcoming" | "live" | "finished"
  period?: string
  timeRemaining?: string
  homeTeam: NBATeam
  awayTeam: NBATeam
  venue: string
  odds?: {
    bookmaker: string
    home: string
    away: string
  }
}

export interface NBAInjury {
  playerId: string
  playerName: string
  position: string
  injury: string
  status: string
  date?: string
}

export interface NBATeamStats {
  teamId: string
  teamName: string
  gamesPlayed: number
  wins: number
  losses: number
  pointsPerGame: number
  pointsAllowedPerGame: number
  fieldGoalPercentage: string
  threePointPercentage: string
  freeThrowPercentage: string
  reboundsPerGame: number
  assistsPerGame: number
}
