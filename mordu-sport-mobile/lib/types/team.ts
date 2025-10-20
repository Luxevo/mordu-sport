// Types pour les données d'équipes NHL de GoalServe

export interface Player {
  id: string
  name: string
  number: string
  position: string
  age?: string
  height?: string
  weight?: string
  birthplace?: string
  // Stats de joueur
  gamesPlayed?: number
  goals?: number
  assists?: number
  points?: number
  plusMinus?: number
  penaltyMinutes?: number
  // Pour les gardiens
  wins?: number
  losses?: number
  goalsAgainstAverage?: string
  savePercentage?: string
}

export interface Injury {
  playerId: string
  playerName: string
  position: string
  injury: string
  status: string
  date?: string
}

export interface TeamRoster {
  teamId: string
  teamName: string
  forwards: Player[]
  defensemen: Player[]
  goalies: Player[]
}

export interface TeamStats {
  teamId: string
  teamName: string
  gamesPlayed: number
  wins: number
  losses: number
  otLosses: number
  points: number
  goalsFor: number
  goalsAgainst: number
  powerPlayGoals: number
  powerPlayOpportunities: number
  powerPlayPercentage: string
  penaltyKillPercentage: string
  shotsPerGame: number
  shotsAllowedPerGame: number
  faceoffWinPercentage: string
}

export interface TeamInfo {
  id: string
  name: string
  abbr: string
  city: string
  conference?: string
  division?: string
  // Pas de logo pour raisons légales
}

