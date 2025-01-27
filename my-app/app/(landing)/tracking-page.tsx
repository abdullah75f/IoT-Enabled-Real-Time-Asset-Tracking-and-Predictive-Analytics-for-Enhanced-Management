// tracking-page.tsx
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

export default function TrackingPage() {
  return (
    <View className="flex-1 justify-start pt-10">
      <Text className="text-black self-center font-bold text-[24px]">
        Asset Tracking
      </Text>
       <Image
        source={require('./map000.png')} // Replace with the relative path to your image file
        style={{ height: 400, marginTop: 20, width: 100% }}
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
