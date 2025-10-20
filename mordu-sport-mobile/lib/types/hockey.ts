// Types pour les données NHL de GoalServe

export interface Team {
  id: string
  name: string
  abbr?: string
  logo?: string
  score?: number
  record?: string
  p1?: number
  p2?: number
  p3?: number
  ot?: number
  so?: number
}

export interface Odds {
  bookmaker: string
  home: string
  away: string
  timestamp?: number
}

export interface Match {
  id: string
  league: string
  date: string
  time: string
  status: "upcoming" | "live" | "finished"
  period?: string
  timeRemaining?: string
  homeTeam: Team
  awayTeam: Team
  venue: string
  venueId?: string
  odds?: Odds
  formattedDate?: string
  datetimeUtc?: string
}

export interface Standing {
  position: number
  teamId: string
  teamName: string
  gamesPlayed: number
  wins: number
  losses: number
  otLosses: number
  points: number
  goalsFor: number
  goalsAgainst: number
  difference: string
  homeRecord: string
  roadRecord: string
  streak: string
}

export interface Division {
  name: string
  teams: Standing[]
}

export interface Conference {
  name: string
  divisions: Division[]
}

