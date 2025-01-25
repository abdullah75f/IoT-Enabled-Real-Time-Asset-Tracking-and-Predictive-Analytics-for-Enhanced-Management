import { Stack } from "expo-router";

export default function LandingLayout() {
  <Stack>
    <Stack.Screen
      name="home-page"
      options={{ headerShown: true, title: "Home Page" }}
    />
    <Stack.Screen
      name="landing-Page"
      options={{ headerShown: true, title: "Landing Page" }}
    />
    <Stack.Screen
      name="tracking-page"
      options={{ headerShown: true, title: "Tracking Page" }}
    />
  </Stack>;
}
