import {
  LightTheme,
  DarkTheme as CustomDarkTheme,
  CustomTheme,
} from "../utils/theme";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { StatusBar } from "expo-status-bar";
import { Stack } from "expo-router";
import { useEffect } from "react";
import "react-native-reanimated";

// Import your global CSS file
import "../global.css";

import { useColorScheme } from "@/hooks/useColorScheme";
import { Provider } from "react-redux";
import store from "@/store/store";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider
        value={
          colorScheme === "dark" ? CustomDarkTheme : (LightTheme as CustomTheme)
        }
      >
        <Stack>
          <Stack.Screen
            name="(authentication)"
            options={{ headerShown: false, title: "Authentication" }}
          />
          <Stack.Screen name="(landing)" options={{ headerShown: false }} />
          <Stack.Screen name="(aboutUs)" options={{ headerShown: false }} />
          <Stack.Screen name="(properties)" options={{ headerShown: false }} />
          <Stack.Screen name="(users)" options={{ headerShown: false }} />
          <Stack.Screen name="+not-found" options={{ headerShown: false }} />
          <StatusBar style="auto" />
          <Slot />
        </Stack>
      </ThemeProvider>
    </Provider>
  );
}
