import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { addDays, startOfWeek, addWeeks, subWeeks, isSameDay, isToday } from 'date-fns';
import { fr } from 'date-fns/locale/fr';
import { Ionicons } from '@expo/vector-icons';


type CalendarPickerProps = {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
};

export function CalendarPicker({ selectedDate, onDateChange }: CalendarPickerProps) {
  const [currentWeek, setCurrentWeek] = useState(startOfWeek(selectedDate, { weekStartsOn: 1 }));

  const weekDays = Array.from({ length: 7 }, (_, i) => addDays(currentWeek, i));

  // Helper pour formater avec la locale française
  const formatWithLocale = (date: Date, formatStr: string) => {
    return fr.formatLong ? date.toLocaleDateString('fr-FR', {
      day: formatStr.includes('d') ? 'numeric' : undefined,
      month: formatStr.includes('MMM') ? 'short' : undefined,
      year: formatStr.includes('yyyy') ? 'numeric' : undefined,
      weekday: formatStr.includes('EEE') ? 'short' : undefined,
    }) : '';
  };

  const goToPreviousWeek = () => setCurrentWeek(subWeeks(currentWeek, 1));
  const goToNextWeek = () => setCurrentWeek(addWeeks(currentWeek, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentWeek(startOfWeek(today, { weekStartsOn: 1 }));
    onDateChange(today);
  };

  return (
    <View style={styles.container}>
      {/* Navigation semaine */}
      <View style={styles.nav}>
        <TouchableOpacity onPress={goToPreviousWeek} style={styles.navButton}>
          <Ionicons name="chevron-back" size={20} />
        </TouchableOpacity>

        <TouchableOpacity onPress={goToToday}>
          <Text style={styles.weekLabel}>
            {weekDays[0].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} - {weekDays[6].toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={goToNextWeek} style={styles.navButton}>
          <Ionicons name="chevron-forward" size={20} />
        </TouchableOpacity>
      </View>

      {/* Grille de la semaine */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.weekRow}>
        {weekDays.map((date, index) => {
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentDay = isToday(date);

          return (
            <TouchableOpacity
              key={index}
              onPress={() => onDateChange(date)}
              style={[
                styles.dayButton,
                isSelected && styles.selectedDay,
                !isSelected && isCurrentDay && styles.today,
              ]}
            >
              <Text style={[styles.dayLabel, isSelected && styles.selectedLabel]}>
                {date.toLocaleDateString('fr-FR', { weekday: 'short' }).toUpperCase()}
              </Text>
              <Text style={[styles.dayNumber, isSelected && styles.selectedLabel]}>
                {date.getDate()}
              </Text>
              <Text style={[styles.monthLabel, isSelected && styles.selectedLabel]}>
                {date.toLocaleDateString('fr-FR', { month: 'short' })}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    backgroundColor: 'black',
    paddingVertical: 8,
  },
  nav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  navButton: {
    padding: 6,
  },
  weekLabel: {
    fontSize: 12,
    fontWeight: '500',
  },
  weekRow: {
    paddingLeft: 12,
  },
  dayButton: {
    width: 50,
    paddingVertical: 6,
    marginRight: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  selectedDay: {
    backgroundColor: '#00C4FF',
  },
  today: {
    backgroundColor: '#ccefff',
  },
  dayLabel: {
    fontSize: 10,
    textTransform: 'uppercase',
    color: '#666',
  },
  dayNumber: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  monthLabel: {
    fontSize: 10,
    color: '#666',
  },
  selectedLabel: {
    color: '#fff',
  },
});
