import { Stack } from "expo-router";

export default function UsersLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="profile"
        options={{ headerShown: true, title: "Profile" }}
      />
      <Stack.Screen
        name="setting"
        options={{ headerShown: true, title: "Setting" }}
      />
    </Stack>
  );
}
