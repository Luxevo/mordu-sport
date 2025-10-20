import React, { createContext, useContext, useState, ReactNode } from "react";
import { ColorSchemeName, useColorScheme } from "react-native";

type Theme = "light" | "dark";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const systemScheme: ColorSchemeName = useColorScheme(); // light ou dark
  const [theme, setTheme] = useState<Theme>(systemScheme === "dark" ? "dark" : "light");

  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Hook pour utiliser le thème dans n'importe quel composant
export const useTheme = () => useContext(ThemeContext);
