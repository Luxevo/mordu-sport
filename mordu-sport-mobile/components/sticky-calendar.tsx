import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"

interface StickyCalendarProps {
  onDateSelect?: (date: Date) => void
  selectedDate?: Date
}

export function StickyCalendar({ onDateSelect, selectedDate }: StickyCalendarProps) {
  const [currentWeek, setCurrentWeek] = useState(new Date())
  const [selected, setSelected] = useState(selectedDate || new Date())

  // Helper functions to replace date-fns
  const startOfWeek = (date: Date) => {
    const d = new Date(date)
    const day = d.getDay()
    const diff = day === 0 ? -6 : 1 - day // Monday as first day
    d.setDate(d.getDate() + diff)
    d.setHours(0, 0, 0, 0)
    return d
  }

  const addDays = (date: Date, days: number) => {
    const d = new Date(date)
    d.setDate(d.getDate() + days)
    return d
  }

  const addWeeks = (date: Date, weeks: number) => {
    return addDays(date, weeks * 7)
  }

  const isSameDay = (date1: Date, date2: Date) => {
    return date1.getDate() === date2.getDate() &&
           date1.getMonth() === date2.getMonth() &&
           date1.getFullYear() === date2.getFullYear()
  }

  const isToday = (date: Date) => {
    return isSameDay(date, new Date())
  }

  const formatDay = (date: Date) => {
    const days = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
    return days[date.getDay()]
  }

  const weekStart = startOfWeek(currentWeek)
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))

  const handleDateSelect = (date: Date) => {
    setSelected(date)
    onDateSelect?.(date)
  }

  const goToPreviousWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, -1))
  }

  const goToNextWeek = () => {
    setCurrentWeek(addWeeks(currentWeek, 1))
  }

  const goToToday = () => {
    const today = new Date()
    setCurrentWeek(today)
    handleDateSelect(today)
  }

  return (
    <View style={styles.container}>
      {/* Header with navigation */}
      <View style={styles.header}>
        <TouchableOpacity onPress={goToPreviousWeek} style={styles.navButton}>
          <Ionicons name="chevron-back" size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity onPress={goToToday} style={styles.todayButton}>
          <Text style={styles.todayText}>Aujourd'hui</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToNextWeek} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={24} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Days of the week */}
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.daysContainer}
      >
        {days.map((day, index) => {
          const isSelectedDay = isSameDay(day, selected)
          const isTodayDay = isToday(day)

          return (
            <TouchableOpacity
              key={index}
              onPress={() => handleDateSelect(day)}
              style={[
                styles.dayButton,
                isSelectedDay && styles.dayButtonSelected,
                isTodayDay && !isSelectedDay && styles.dayButtonToday,
              ]}
            >
              <Text
                style={[
                  styles.dayName,
                  isSelectedDay && styles.dayNameSelected,
                  isTodayDay && !isSelectedDay && styles.dayNameToday,
                ]}
              >
                {formatDay(day)}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  isSelectedDay && styles.dayNumberSelected,
                  isTodayDay && !isSelectedDay && styles.dayNumberToday,
                ]}
              >
                {day.getDate()}
              </Text>
            </TouchableOpacity>
          )
        })}
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'black',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
    paddingVertical: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  navButton: {
    padding: 8,
  },
  todayButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    backgroundColor: 'black',
    borderRadius: 8,
  },
  todayText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  daysContainer: {
    paddingHorizontal: 16,
    gap: 8,
  },
  dayButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    minWidth: 60,
    backgroundColor: '#000',
  },
  dayButtonSelected: {
    backgroundColor: '#3b82f6',
  },
  dayButtonToday: {
    backgroundColor: '#dbeafe',
  },
  dayName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#6b7280',
    textTransform: 'capitalize',
    marginBottom: 4,
  },
  dayNameSelected: {
    color: '#fff',
  },
  dayNameToday: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  dayNumberSelected: {
    color: '#fff',
  },
  dayNumberToday: {
    color: '#3b82f6',
  },
})