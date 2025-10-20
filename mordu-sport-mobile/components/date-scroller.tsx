"use client"

import { useState } from "react"
import { CalendarPicker } from "@/components/calendar-picker"

export function DateScroller() {
  const [selectedDate, setSelectedDate] = useState(new Date())

  return (
    <div className="border-b border-border bg-card">
      <div className="px-4 py-3">
        <CalendarPicker 
          selectedDate={selectedDate} 
          onDateChange={setSelectedDate} 
        />
      </div>
    </div>
  )
}
