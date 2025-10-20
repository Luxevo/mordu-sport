import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';  
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"

export function HomeHeader() {
  return (
    <View style={styles.header}>
      <View style={styles.left}>
        <Avatar>
          <Image source={require('../assets/diverse-user-avatars.png')} style={styles.avatarImage} />
        </Avatar>
        <Text style={styles.username}>@Will</Text>
      </View>

      <View style={styles.center}>
        <Image source={require('../assets/LogoMordu.svg')} style={styles.logo} />
      </View>

      <View style={styles.right}>
        <TouchableOpacity style={styles.iconButton}>
          <MaterialIcons name="search" size={20} color="#00FF39" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={20} color="#00D2FF" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: 'black',
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  center: {
    // centrer le logo
  },
  right: {
    flexDirection: 'row',
    gap: 8,
  },
  username: {
    fontSize: 14,
    fontWeight: '500',
  },
  logo: {
    height: 32,
    width: 120,
    resizeMode: 'contain',
  },
  iconButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'transparent',
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
  },
});
