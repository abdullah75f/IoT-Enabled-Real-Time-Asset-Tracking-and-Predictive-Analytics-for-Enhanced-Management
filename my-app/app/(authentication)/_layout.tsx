import { Stack } from "expo-router";

export default function AuthenticationLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="sign-up"
        options={{ headerShown: true, title: "Sign Up" }}
      />
      <Stack.Screen
                    name="landing-Page"
                    options={{ headerShown: true, title: "Landing Page" }}
                  />
       <Stack.Screen
              name="sign-In"
              options={{ headerShown: true, title: "Sign In" }}
            />
      <Stack.Screen
        name="forgot-password"
        options={{ headerShown: true, title: "Forgot Password" }}
      />
      <Stack.Screen
        name="index"
        options={{ headerShown: true, title: "Sign In" }}
      />
    </Stack>
  );
}
