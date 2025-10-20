import React from "react";
import { View, Image, Text, StyleSheet, ViewProps, ImageProps, TextProps } from "react-native";

interface AvatarProps extends ViewProps {
  children?: React.ReactNode;
}

interface AvatarImageProps extends ImageProps {}
interface AvatarFallbackProps extends TextProps {
  children: string;
}

// Composant racine
export function Avatar({ style, children, ...props }: AvatarProps) {
  return (
    <View style={[styles.avatar, style]} {...props}>
      {children}
    </View>
  );
}

// Image de l’avatar
export function AvatarImage({ style, ...props }: AvatarImageProps) {
  return <Image style={[styles.image, style]} {...props} />;
}

// Fallback si pas d’image
export function AvatarFallback({ style, children, ...props }: AvatarFallbackProps) {
  return (
    <View style={styles.fallback}>
      <Text style={[styles.fallbackText, style]} {...props}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: "#eee",
    justifyContent: "center",
    alignItems: "center",
  },
  image: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  fallback: {
    width: "100%",
    height: "100%",
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  fallbackText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
