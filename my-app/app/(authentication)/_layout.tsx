import { Stack } from "expo-router";

export default function AuthenticationLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="sign-up"
        options={{ headerShown: true, title: "Sign Up" }}
      />

      <Stack.Screen
        name="sign-in"
        options={{ headerShown: true, title: "Sign In" }}
      />
      <Stack.Screen
        name="forgot-password"
        options={{ headerShown: true, title: "Forgot Password" }}
      />
      <Stack.Screen
        name="index"
        options={{ headerShown: true, title: "Intro" }}
      />

      <Stack.Screen
        name="otp-input"
        options={{ headerShown: true, title: "OTP" }}
      />
      <Stack.Screen
        name="password-change"
        options={{ headerShown: true, title: "password Change" }}
      />
    </Stack>
  );
}
