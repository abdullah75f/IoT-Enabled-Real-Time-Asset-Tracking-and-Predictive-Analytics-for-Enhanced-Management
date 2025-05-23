import Footer from "@/components/footer";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert, StyleSheet, SafeAreaView } from "react-native";
import MapComponent from "@/components/MapComponent";
import { fetchLocation } from "../apiService/api";

export default function TrackingPage() {
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });

  useEffect(() => {
    let isMounted = true;

    const fetchAndUpdateLocation = async () => {
      try {
        const data = await fetchLocation();
        console.log(
          "(NOBRIDGE) LOG Backend location response (TrackingPage):",
          data
        );
        if (isMounted) {
          setLocation((prevLocation) => {
            if (
              prevLocation.latitude !== data.latitude ||
              prevLocation.longitude !== data.longitude
            ) {
              console.log(
                "(NOBRIDGE) LOG Location changed (TrackingPage), updating:",
                data
              );
              return {
                latitude: data.latitude,
                longitude: data.longitude,
              };
            }
            console.log(
              "(NOBRIDGE) LOG Same location (TrackingPage), skipping update:",
              data
            );
            return prevLocation;
          });
        }
      } catch (error: any) {
        if (isMounted) {
          console.log(
            "Error fetching updated location (TrackingPage):",
            error.message,
            error.response?.data
          );
          Alert.alert(
            "Error",
            error.message || "Failed to fetch updated location."
          );
        }
      } finally {
        if (isMounted) {
          setTimeout(fetchAndUpdateLocation, 5000);
        }
      }
    };

    fetchAndUpdateLocation();

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapContainer}>
        <MapComponent
          key={`${location.latitude}-${location.longitude}`}
          latitude={location.latitude}
          longitude={location.longitude}
        />
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => router.push("/(properties)/asset-history")}
          style={styles.button}
        >
          <Text style={styles.buttonText}>Assets Details</Text>
        </TouchableOpacity>
      </View>

      <Footer />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  mapContainer: {
    flex: 1,
    width: '100%',
  },
  buttonContainer: {
    padding: 20,
    backgroundColor: '#F5F5F5',
  },
  button: {
    backgroundColor: '#15803d', // green-700
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '500',
  },
});
