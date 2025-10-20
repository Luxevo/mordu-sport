"use client"

import type { Match } from "@/lib/types/hockey"

interface MatchHighlightsProps {
  match: Match
}

export function MatchHighlights({ match }: MatchHighlightsProps) {
  return (
    <div className="flex h-full flex-col bg-background">
      <div className="flex-1 overflow-y-auto p-4">
        {/* Section vide pour l'instant */}
      </div>
    </div>
  )
}
