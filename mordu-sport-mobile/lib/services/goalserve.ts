// Service pour récupérer les données de GoalServe API

const GOALSERVE_API_KEY = process.env.NEXT_PUBLIC_GOALSERVE_API_KEY || 'ba5b1fd7062c4ddfd69b08de0442e200'
const BASE_URL = 'https://www.goalserve.com/getfeed'

export class GoalServeService {
  private apiKey: string

  constructor(apiKey: string = GOALSERVE_API_KEY) {
    this.apiKey = apiKey
  }

  /**
   * Récupère les scores NHL en temps réel
   */
  async getNHLScores(date?: string): Promise<string> {
    const url = date
      ? `${BASE_URL}/${this.apiKey}/hockey/nhl-scores?date=${date}`
      : `${BASE_URL}/${this.apiKey}/hockey/nhl-scores`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère le schedule NHL avec les cotes de paris
   */
  async getNHLSchedule(date1?: string, date2?: string, showOdds: boolean = true): Promise<string> {
    let url = `${BASE_URL}/${this.apiKey}/hockey/nhl-shedule`
    
    const params = new URLSearchParams()
    if (date1) params.append('date1', date1)
    if (date2) params.append('date2', date2)
    if (showOdds) params.append('showodds', '1')
    
    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère le classement NHL
   */
  async getNHLStandings(): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/hockey/nhl-standings`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère les boxscores passés
   */
  async getNHLBoxscores(date: string): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/hockey/nhl-scores?date=${date}`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère le roster d'une équipe NHL
   */
  async getTeamRoster(teamId: string): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/hockey/${teamId}_rosters`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère les statistiques des joueurs d'une équipe
   */
  async getTeamPlayerStats(teamId: string): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/hockey/${teamId}_stats`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère les statistiques globales d'une équipe
   */
  async getTeamStats(teamId: string): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/hockey/${teamId}_team_stats`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère les blessures d'une équipe
   */
  async getTeamInjuries(teamId: string): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/hockey/${teamId}_injuries`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère l'image d'un joueur
   */
  getPlayerImage(playerId: string): string {
    return `https://www.goalserve.com/getfeed/${this.apiKey}/hockey/usa?playerimage=${playerId}`
  }

  // ==================== NBA API ====================

  /**
   * Récupère les scores NBA en temps réel
   */
  async getNBAScores(date?: string): Promise<string> {
    const url = date
      ? `${BASE_URL}/${this.apiKey}/bsktbl/nba-scores?date=${date}`
      : `${BASE_URL}/${this.apiKey}/bsktbl/nba-scores`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe NBA API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère le schedule NBA avec les cotes
   */
  async getNBASchedule(date1?: string, date2?: string, showOdds: boolean = true): Promise<string> {
    let url = `${BASE_URL}/${this.apiKey}/bsktbl/nba-shedule`
    
    const params = new URLSearchParams()
    if (date1) params.append('date1', date1)
    if (date2) params.append('date2', date2)
    if (showOdds) params.append('showodds', '1')
    
    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe NBA API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère le classement NBA
   */
  async getNBAStandings(): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/bsktbl/nba-standings`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe NBA API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère le roster d'une équipe NBA
   */
  async getNBATeamRoster(teamId: string): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/bsktbl/${teamId}_rosters`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe NBA API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère les statistiques des joueurs d'une équipe NBA
   */
  async getNBATeamPlayerStats(teamId: string): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/bsktbl/${teamId}_stats`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe NBA API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère les statistiques globales d'une équipe NBA
   */
  async getNBATeamStats(teamId: string): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/bsktbl/${teamId}_team_stats`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe NBA API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère les blessures d'une équipe NBA
   */
  async getNBATeamInjuries(teamId: string): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/bsktbl/${teamId}_injuries`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe NBA API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère l'image d'un joueur NBA
   */
  getNBAPlayerImage(playerId: string): string {
    return `https://www.goalserve.com/getfeed/${this.apiKey}/bsktbl/usa?playerimage=${playerId}`
  }

  // ==================== NFL API ====================

  /**
   * Récupère les scores NFL en temps réel
   */
  async getNFLScores(date?: string): Promise<string> {
    const url = date
      ? `${BASE_URL}/${this.apiKey}/football/nfl-scores?date=${date}`
      : `${BASE_URL}/${this.apiKey}/football/nfl-scores`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe NFL API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère le schedule NFL avec les cotes
   */
  async getNFLSchedule(date1?: string, date2?: string, showOdds: boolean = true): Promise<string> {
    let url = `${BASE_URL}/${this.apiKey}/football/nfl-shedule`
    
    const params = new URLSearchParams()
    if (date1) params.append('date1', date1)
    if (date2) params.append('date2', date2)
    if (showOdds) params.append('showodds', '1')
    
    const queryString = params.toString()
    if (queryString) {
      url += `?${queryString}`
    }

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe NFL API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère le classement NFL
   */
  async getNFLStandings(): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/football/nfl-standings`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe NFL API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère le roster d'une équipe NFL
   */
  async getNFLTeamRoster(teamId: string): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/football/${teamId}_rosters`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe NFL API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère les statistiques des joueurs d'une équipe NFL
   */
  async getNFLTeamPlayerStats(teamId: string): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/football/${teamId}_player_stats`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe NFL API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère les blessures d'une équipe NFL
   */
  async getNFLTeamInjuries(teamId: string): Promise<string> {
    const url = `${BASE_URL}/${this.apiKey}/football/${teamId}_injuries`
    
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`GoalServe NFL API error: ${response.statusText}`)
    }
    return await response.text()
  }

  /**
   * Récupère l'image d'un joueur NFL
   */
  getNFLPlayerImage(playerId: string): string {
    return `https://www.goalserve.com/getfeed/${this.apiKey}/football/usa?playerimage=${playerId}`
  }
}

export const goalServeService = new GoalServeService()

