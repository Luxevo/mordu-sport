import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type RootStackParamList = {
  Home: undefined;
};

export function MatchHeader() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.goBack()}
      >
        <Ionicons name="arrow-back" size={20} color="#000" />
      </TouchableOpacity>

      <Text style={styles.title}>Match en direct</Text>

      <TouchableOpacity style={styles.button}>
        <Ionicons name="heart-outline" size={20} color="#000" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    backgroundColor: "rgba(255,255,255,0.95)", 
    backdropFilter: "blur(10px)",
  },
  button: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
  },
});
