"use client"

import type { Player } from "@/lib/types/team"
import { TrendingUp, TrendingDown, Minus } from "lucide-react"

export function PlayerStats({ players }: { players: Player[] }) {
  if (!players || players.length === 0) {
    return (
      <div className="p-4 text-center text-muted-foreground">
        Aucune statistique de joueur disponible
      </div>
    )
  }

  // L'API _stats ne contient que les skaters (attaquants et défenseurs)
  // Les gardiens ont un endpoint séparé qui n'est pas encore implémenté
  
  // Trier tous les joueurs par points
  const topPlayers = players
    .filter(p => p.points !== undefined && p.points > 0)
    .sort((a, b) => (b.points || 0) - (a.points || 0))
    .slice(0, 15) // Top 15 au lieu de 10

  return (
    <div className="h-full overflow-y-auto bg-background p-4">
      {/* Top Joueurs */}
      {topPlayers.length > 0 ? (
        <section>
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wide text-primary">
            Top {topPlayers.length} Joueurs (Saison 2025/26)
          </h3>
          <div className="space-y-2">
            {topPlayers.map((player, index) => (
              <div
                key={player.id}
                className="flex items-center justify-between rounded-lg border border-border bg-card p-3 hover:border-primary/50 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-sm font-bold text-primary">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{player.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {player.position} • {player.gamesPlayed || 0} GP
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-foreground">{player.points} PTS</p>
                  <p className="text-xs text-muted-foreground">
                    {player.goals}B • {player.assists}A
                  </p>
                  {player.plusMinus !== undefined && (
                    <p className={`text-xs font-medium ${
                      player.plusMinus > 0 ? 'text-success' : 
                      player.plusMinus < 0 ? 'text-destructive' : 
                      'text-muted-foreground'
                    }`}>
                      {player.plusMinus > 0 ? '+' : ''}{player.plusMinus}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <div className="p-4 text-center text-muted-foreground">
          Aucune statistique disponible
        </div>
      )}
    </div>
  )
}

