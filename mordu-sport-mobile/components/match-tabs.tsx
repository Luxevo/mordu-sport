"use client"

import { useState } from "react"
import { LiveChat } from "@/components/live-chat"
import { MatchStats } from "@/components/match-stats"
import { MatchHighlights } from "@/components/match-highlights"
import type { Match } from "@/lib/types/hockey"

export function MatchTabs({ match }: { match: Match }) {
  const [activeTab, setActiveTab] = useState<"stats" | "chat" | "highlights">("chat")

  return (
    <div className="flex h-full flex-col">
      <div className="flex border-b border-border bg-background">
        <button
          onClick={() => setActiveTab("stats")}
          className={`flex-1 py-4 text-xs font-semibold transition-colors ${
            activeTab === "stats"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Statistiques
        </button>
        <button
          onClick={() => setActiveTab("chat")}
          className={`flex-1 py-4 text-xs font-semibold transition-colors ${
            activeTab === "chat"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Chat
        </button>
        <button
          onClick={() => setActiveTab("highlights")}
          className={`flex-1 py-4 text-xs font-semibold transition-colors ${
            activeTab === "highlights"
              ? "border-b-2 border-primary text-primary"
              : "text-muted-foreground hover:text-foreground"
          }`}
        >
          Moments chauds
        </button>
      </div>

      <div className="flex-1 overflow-hidden">
        {activeTab === "stats" && <MatchStats match={match} />}
        {activeTab === "chat" && <LiveChat match={match} />}
        {activeTab === "highlights" && <MatchHighlights match={match} />}
      </div>
    </div>
  )
}
