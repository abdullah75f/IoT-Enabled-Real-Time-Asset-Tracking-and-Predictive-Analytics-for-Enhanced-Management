import Footer from "@/components/footer";
import { router } from "expo-router";
import React, { useEffect, useState, useRef } from "react";
import { View, Text, TouchableOpacity, Alert } from "react-native";
import MapComponent from "@/components/MapComponent";
import { fetchLocation } from "../apiService/api";

export default function HomePage() {
  const [location, setLocation] = useState({
    latitude: 37.78825,
    longitude: -122.4324,
  });
  const renderCount = useRef(0); // Track render count for debugging

  useEffect(() => {
    let isMounted = true;

    const fetchAndUpdateLocation = async () => {
      try {
        const data = await fetchLocation();
        console.log("(NOBRIDGE) LOG Backend location response:", data);
        if (isMounted) {
          setLocation((prevLocation) => {
            // Only update state if latitude or longitude changes
            if (
              prevLocation.latitude !== data.latitude ||
              prevLocation.longitude !== data.longitude
            ) {
              console.log("(NOBRIDGE) LOG Location changed, updating:", data);
              return {
                latitude: data.latitude,
                longitude: data.longitude,
              };
            }
            console.log("(NOBRIDGE) LOG Same location, skipping update:", data);
            return prevLocation;
          });
        }
      } catch (error: any) {
        if (isMounted) {
          console.log(
            "Error fetching updated location:",
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

  // Increment render count and log on every render triggered by location change
  renderCount.current += 1;
  useEffect(() => {
    console.log(
      "(NOBRIDGE) LOG Render count:",
      renderCount.current,
      "Location:",
      location
    );
    // Uncomment below for full navigation refresh (optional)
    // router.replace("/(landing)/home-page");
  }, [location]);

  return (
    <View className="flex-1 justify-start pt-24">
      <View className="flex-1">
        <Text className="text-black self-center font-bold text-[24px]">
          Welcome, [User's Name]
        </Text>

        <Text className="self-center text-base mt-2">
          Lat: {location.latitude.toFixed(5)}, Lon:{" "}
          {location.longitude.toFixed(5)}
        </Text>

        <MapComponent
          key={`${location.latitude}-${location.longitude}`}
          latitude={location.latitude}
          longitude={location.longitude}
        />

        <View className="mt-8 mx-6">
          <TouchableOpacity
            onPress={() => router.push("/(landing)/tracking-page")}
            className="bg-green-500 w-full h-12 justify-center items-center rounded-md mb-4"
          >
            <Text className="text-white text-lg">Live Track</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(properties)/asset-history")}
            className="bg-green-700 w-full h-12 justify-center items-center rounded-md mb-4"
          >
            <Text className="text-white text-lg">Assets Details</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => router.push("/(properties)/add-asset")}
            className="bg-[#21252C] w-full h-12 justify-center items-center rounded-md"
          >
            <Text className="text-white text-lg">Add New Assets</Text>
          </TouchableOpacity>
        </View>
        <Footer />
      </View>
    </View>
  );
}
