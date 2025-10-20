import React from "react";
import { Text, TouchableOpacity, StyleSheet, ViewStyle, TextStyle } from "react-native";

type ButtonVariant = "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
type ButtonSize = "default" | "sm" | "lg" | "icon";

interface ButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  style?: ViewStyle;
  textStyle?: TextStyle;
  children: React.ReactNode;
  onPress?: () => void;
}

export function Button({ variant = "default", size = "default", style, textStyle, children, onPress }: ButtonProps) {
  const variantStyles = VARIANT_STYLES[variant] || VARIANT_STYLES.default;
  const sizeStyles = SIZE_STYLES[size] || SIZE_STYLES.default;

  return (
    <TouchableOpacity style={[styles.base, variantStyles, sizeStyles, style]} onPress={onPress}>
      <Text style={[styles.text, textStyle]}>{children}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  text: {
    fontWeight: "500",
    fontSize: 14,
  },
});

const VARIANT_STYLES: Record<ButtonVariant, ViewStyle> = {
  default: { backgroundColor: "#00C4FF" },
  destructive: { backgroundColor: "#FF4D4F" },
  outline: { borderWidth: 1, borderColor: "#ccc", backgroundColor: "transparent" },
  secondary: { backgroundColor: "#f0f0f0" },
  ghost: { backgroundColor: "transparent" },
  link: { backgroundColor: "transparent" },
};

const SIZE_STYLES: Record<ButtonSize, ViewStyle> = {
  default: { height: 40, paddingHorizontal: 16 },
  sm: { height: 32, paddingHorizontal: 12 },
  lg: { height: 48, paddingHorizontal: 20 },
  icon: { width: 36, height: 36, paddingHorizontal: 0, paddingVertical: 0 },
};
