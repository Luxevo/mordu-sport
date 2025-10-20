import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import type { Match } from "@/lib/types/hockey";
import { getTeamRecord } from "@/lib/parsers/nhl-parser";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

// Fonction pour convertir l'heure en format 24h
function formatTimeTo24h(time: string): string {
  if (!time) return "";

  if (time.includes(":") && !time.includes("PM") && !time.includes("AM")) {
    return time;
  }

  const [timePart, period] = time.split(" ");
  const [hours, minutes] = timePart.split(":");
  let hour24 = parseInt(hours);

  if (period === "PM" && hour24 !== 12) hour24 += 12;
  else if (period === "AM" && hour24 === 12) hour24 = 0;

  return `${hour24}h`;
}

type RootStackParamList = {
  MatchDetails: { matchId: string };
};

type MatchCardProps = {
  match: Match;
  standings?: any[];
};

export function MatchCard({ match, standings }: MatchCardProps) {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const isLive = match.status === "live";
  const isFinished = match.status === "finished";
  const isUpcoming = match.status === "upcoming";

  const today = new Date();
  const matchDate = new Date(match.date);
  const isToday = today.toDateString() === matchDate.toDateString();

  const goToMatch = () => {
    navigation.navigate("MatchDetails", { matchId: match.id });
  };

  return (
    <TouchableOpacity onPress={goToMatch} style={styles.card}>
      {/* Away Team */}
      <View style={styles.teamContainer}>
        <View style={styles.teamInfo}>
          <Image
            source={{ uri: match.awayTeam.logo || "https://via.placeholder.com/40" }}
            style={styles.logo}
          />
          <Text style={styles.teamName}>{match.awayTeam.abbr || match.awayTeam.name}</Text>
        </View>

        {isFinished && (
          <View style={styles.scoreContainer}>
            <Text
              style={[
                styles.score,
                match.awayTeam.score! > match.homeTeam.score! && styles.boldScore,
              ]}
            >
              {match.awayTeam.score}
            </Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          {isFinished && <Text style={styles.finalText}>Final</Text>}
          {isLive && match.period && (
            <Text style={styles.liveText}>{`${match.period} • ${match.timeRemaining}`}</Text>
          )}
          {!isLive && !isFinished && (isToday || isUpcoming) && match.time && (
            <Text style={styles.liveText}>{formatTimeTo24h(match.time)}</Text>
          )}
          <Ionicons name="chevron-forward" size={16} color="#999" />
        </View>
      </View>
      <Text style={styles.statsText}>
        {standings ? getTeamRecord(standings, match.awayTeam.name) : "0-0-0"}
      </Text>

      {/* Home Team */}
      <View style={styles.teamContainer}>
        <View style={styles.teamInfo}>
          <Image
            source={{ uri: match.homeTeam.logo || "https://via.placeholder.com/40" }}
            style={styles.logo}
          />
          <Text style={styles.teamName}>{match.homeTeam.abbr || match.homeTeam.name}</Text>
        </View>

        {isFinished && (
          <View style={styles.scoreContainer}>
            <Text
              style={[
                styles.score,
                match.homeTeam.score! > match.awayTeam.score! && styles.boldScore,
              ]}
            >
              {match.homeTeam.score}
            </Text>
          </View>
        )}

        <View style={styles.infoContainer}>
          <View style={{ width: 16 }} />
        </View>
      </View>
      <Text style={styles.statsText}>
        {standings ? getTeamRecord(standings, match.homeTeam.name) : "0-0-0"}
      </Text>

      {/* Live indicator */}
      {isLive && (
        <View style={styles.liveContainer}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>EN DIRECT</Text>
        </View>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    borderBottomWidth: 1,
    borderBottomColor: "#00C4FF33",
    backgroundColor: 'black',
    padding: 12,
  },
  teamContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 4,
  },
  teamInfo: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  logo: {
    width: 32,
    height: 32,
  },
  teamName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#000",
  },
  scoreContainer: {
    width: 40,
    alignItems: "flex-end",
  },
  score: {
    fontSize: 14,
    color: "#000",
  },
  boldScore: {
    fontWeight: "700",
  },
  infoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    width: 60,
    justifyContent: "flex-end",
  },
  liveContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginTop: 4,
    gap: 4,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "red",
  },
  liveText: {
    fontSize: 12,
    color: "red",
    fontWeight: "500",
  },
  finalText: {
    fontSize: 10,
    color: "#666",
  },
  statsText: {
    marginLeft: 40,
    fontSize: 10,
    color: "#666",
    marginBottom: 4,
  },
});
