// tracking-page.tsx
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

export default function TrackingPage() {
  return (
    <View className="flex-1 justify-start pt-24">
      <Text className="text-black self-center font-bold text-[24px]">
        Asset Tracking
      </Text>
      <Image
        source={{ uri: "https://via.placeholder.com/300x200" }}
        style={{ width: "100%", height: 200, marginTop: 20 }}
      />
      <TouchableOpacity
        onPress={() => router.push("/(properties)/asset-history")}
        className="bg-green-700 w-[335px] h-12 justify-center items-center rounded-md mt-6 self-center"
      >
        <Text className="text-white text-lg">Assets Details</Text>
      </TouchableOpacity>
    </View>
  );
}
