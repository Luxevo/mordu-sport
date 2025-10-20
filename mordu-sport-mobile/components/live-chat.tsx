import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from "react-native"
import { useState } from "react"
import { Ionicons } from "@expo/vector-icons"
import type { Match } from "@/lib/types/hockey"

const messages = [
  { id: 1, user: "HabsFan22", avatar: "🏒", message: "Let's go Habs!!! 🔥", time: "19:23" },
  { id: 2, user: "BruinsFan88", avatar: "🐻", message: "Bruins gonna win this one", time: "19:24" },
  { id: 3, user: "SportsFanatic", avatar: "⚡", message: "What a save by the goalie!", time: "19:25" },
  { id: 4, user: "HockeyLover", avatar: "🥅", message: "This game is intense", time: "19:26" },
  { id: 5, user: "MTLForever", avatar: "🔴", message: "GOOOAL!!! Caufield!!!", time: "19:27" },
  { id: 6, user: "IceKing", avatar: "👑", message: "Amazing play!", time: "19:27" },
  { id: 7, user: "PuckMaster", avatar: "🏆", message: "Best game of the season", time: "19:28" },
]

export function LiveChat({ match }: { match: Match }) {
  const [message, setMessage] = useState("")
  
  // TODO: Implémenter le chat en temps réel avec WebSocket basé sur match.id

  const handleSend = () => {
    if (message.trim()) {
      // TODO: Envoyer le message via WebSocket
      console.log("Sending message:", message)
      setMessage("")
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.messagesList} contentContainerStyle={styles.messagesContent}>
        {messages.map((msg) => (
          <View key={msg.id} style={styles.messageRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarEmoji}>{msg.avatar}</Text>
            </View>
            <View style={styles.messageContent}>
              <View style={styles.messageHeader}>
                <Text style={styles.userName}>{msg.user}</Text>
                <Text style={styles.messageTime}>{msg.time}</Text>
              </View>
              <Text style={styles.messageText}>{msg.message}</Text>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <View style={styles.inputRow}>
          <TextInput
            value={message}
            onChangeText={setMessage}
            placeholder="Envoyer un message..."
            placeholderTextColor="#9ca3af"
            style={styles.input}
            returnKeyType="send"
            onSubmitEditing={handleSend}
          />
          <TouchableOpacity style={styles.iconButton}>
            <Ionicons name="happy-outline" size={24} color="#6b7280" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.sendButton, !message.trim() && styles.sendButtonDisabled]}
            onPress={handleSend}
            disabled={!message.trim()}
          >
            <Ionicons 
              name="send" 
              size={20} 
              color={message.trim() ? "#fff" : "#9ca3af"} 
            />
          </TouchableOpacity>
        </View>
        <Text style={styles.limitText}>Limite: 1 message aux 3 secondes</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    padding: 16,
    gap: 12,
  },
  messageRow: {
    flexDirection: 'row',
    gap: 12,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#f3f4f6',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarEmoji: {
    fontSize: 18,
  },
  messageContent: {
    flex: 1,
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 8,
    marginBottom: 2,
  },
  userName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  messageTime: {
    fontSize: 12,
    color: '#9ca3af',
  },
  messageText: {
    fontSize: 14,
    color: '#000',
  },
  inputContainer: {
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
    backgroundColor: '#fff',
    padding: 16,
    paddingBottom: 90, // Space for bottom nav
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  input: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderWidth: 1,
    borderColor: '#e5e7eb',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#000',
  },
  iconButton: {
    padding: 8,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#e5e7eb',
  },
  limitText: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 8,
  },
})