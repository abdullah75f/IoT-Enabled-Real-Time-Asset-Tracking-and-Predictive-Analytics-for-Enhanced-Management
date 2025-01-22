import React, { useEffect } from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function IntroPage() {
  const router = useRouter();

  useEffect(() => {
    const navigateAfterDelay = async () => {
      try {
        // Check if it's the first time the app is opened
        const isFirstTime = await AsyncStorage.getItem("isFirstTime");
        setTimeout(async () => {
          if (isFirstTime === null) {
            // If it's the first time, set a flag and navigate to the landing page
            await AsyncStorage.setItem("isFirstTime", "false");
            router.replace("/landing-Page"); // Navigate to Landing Page
          } else {
            // If not the first time, navigate to the Sign-In page
            router.replace("/sign-in");
          }
        }, 5000); // 5-second delay
      } catch (error) {
        console.error("Error checking first-time flag:", error);
      }
    };

    navigateAfterDelay();
  }, []);

  return (
    <View style={styles.container}>
      {/* App Logo */}
      <Image source={require("../../assets/images/logo.png")} style={styles.logo} />

      {/* Intro Text */}
      <Text style={styles.text}>Welcome to Our App</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
  },
});
