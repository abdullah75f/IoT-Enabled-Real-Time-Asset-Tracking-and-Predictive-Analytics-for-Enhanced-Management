import Footer from "@/components/footer";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
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
    <View className="flex-1 justify-start pt-10">
      <View className="flex-1">
        <Text className="text-black self-center font-bold text-[24px]">
          Asset Tracking
        </Text>

        <MapComponent
          key={`${location.latitude}-${location.longitude}`}
          latitude={location.latitude}
          longitude={location.longitude}
        />

        <TouchableOpacity
          onPress={() => router.push("/(properties)/asset-history")}
          className="bg-green-700 w-[335px] h-12 justify-center items-center rounded-md mt-6 self-center"
        >
          <Text className="text-white text-lg">Assets Details</Text>
        </TouchableOpacity>
      </View>
      <Footer />
    </View>
  );
}
