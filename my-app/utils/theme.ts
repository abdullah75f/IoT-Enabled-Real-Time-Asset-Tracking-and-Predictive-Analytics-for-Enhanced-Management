// src/utils/theme.ts
import {
  DefaultTheme,
  DarkTheme as NavigationDarkTheme,
  Theme,
} from "@react-navigation/native";

// Define theme colors interface
interface ThemeColors {
  primary: string;
  background: string;
  card: string;
  text: string;
  border: string;
  notification: string;
}

// Extend the Theme type with custom colors and dark property
export interface CustomTheme extends Theme {
  dark: boolean;
  colors: ThemeColors;
}

export interface CustomDarkTheme extends Theme {
  dark: boolean;
  colors: ThemeColors;
}

export const LightTheme: CustomTheme = {
  ...DefaultTheme,
  dark: false,
  colors: {
    ...DefaultTheme.colors,
    primary: "#007AFF", // Blue
    background: "#FFFFFF",
    card: "#F9F9F9",
    text: "#000000",
    border: "#DDD",
    notification: "#FF4444",
  },
};

export const DarkTheme: CustomDarkTheme = {
  ...NavigationDarkTheme,
  dark: true,
  colors: {
    ...NavigationDarkTheme.colors,
    primary: "#0A84FF", // Lighter blue for contrast
    background: "#1C2526",
    card: "#2A3334",
    text: "#FFFFFF",
    border: "#444",
    notification: "#FF6666",
  },
};

export const getTheme = (
  colorScheme: "light" | "dark" | null
): CustomTheme | CustomDarkTheme =>
  colorScheme === "dark" ? DarkTheme : LightTheme;
