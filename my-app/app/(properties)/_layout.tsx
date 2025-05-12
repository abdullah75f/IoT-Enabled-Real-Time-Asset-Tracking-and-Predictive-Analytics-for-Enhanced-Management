import { Stack } from "expo-router";

export default function PropertiesLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="asset-history"
        options={{ headerShown: true, title: "Asset History" }}
      />
      <Stack.Screen
        name="notifications"
        options={{ headerShown: true, title: "Notifications" }}
      />
       <Stack.Screen
        name="geofence"
        options={{ headerShown: true, title: "Geo Fencing" }}
      />
    </Stack>
  );
}
