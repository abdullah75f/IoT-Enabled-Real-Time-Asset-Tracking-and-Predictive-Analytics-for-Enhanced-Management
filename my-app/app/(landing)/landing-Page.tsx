import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function LandingPage() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <Image
        source={require("../../assets/images/logo.png")}
        style={styles.logo}
      />

      {/* Title and Subtitle */}
      <Text style={styles.title}>Track your Assets</Text>
      <Text style={styles.subtitle}>
        Effortless asset tracking for fleets, goods, and personal belongings.
      </Text>

      {/* Features */}
      <View style={styles.features}>
        <Text style={styles.featureItem}>$ Real-Time Tracking</Text>
        <Text style={styles.featureItem}>$ Environmental Monitoring</Text>
        <Text style={styles.featureItem}>$ Smart Alerts & Predictions</Text>
      </View>

      {/* Get Started Button */}
      <TouchableOpacity
        style={styles.getStartedButton}
        onPress={() => router.push("/sign-up")} // Navigate to Sign-In Page
      >
        <Text style={styles.getStartedText}>Get Started</Text>
      </TouchableOpacity>

      {/* Learn More Button */}
      <TouchableOpacity onPress={() => alert("Learn more coming soon!")}>
        <Text style={styles.learnMoreText}>Learn more</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  logo: {
    width: 150,
    height: 150,
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333333",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#666666",
    textAlign: "center",
    marginBottom: 20,
  },
  features: {
    marginBottom: 30,
  },
  featureItem: {
    fontSize: 14,
    color: "#333333",
    marginBottom: 5,
  },
  getStartedButton: {
    backgroundColor: "#000000",
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 15,
  },
  getStartedText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "bold",
  },
  learnMoreText: {
    fontSize: 14,
    color: "#007BFF",
    textDecorationLine: "underline",
  },
});
