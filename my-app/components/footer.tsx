import React from "react";
import { View, TouchableOpacity, Text, Platform } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function Footer() {
  const insets = useSafeAreaInsets();
  
  return (
    <View className="w-full bg-white border-t border-gray-200" style={{ paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0 }}>
      <View className="flex-row justify-around items-center h-16 px-4">
        <TouchableOpacity
          onPress={() => router.push("/(landing)/home-page")}
          className="items-center"
        >
          <MaterialIcons name="home" size={28} color="#4B5563" />
          <Text className="text-sm text-gray-600 mt-1">Home</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(landing)/tracking-page")}
          className="items-center"
        >
          <MaterialIcons name="location-on" size={28} color="#4B5563" />
          <Text className="text-sm text-gray-600 mt-1">Track</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(users)/setting")}
          className="items-center"
        >
          <MaterialIcons name="book" size={28} color="#4B5563" />
          <Text className="text-sm text-gray-600 mt-1">Setting</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => router.push("/(users)/profile")}
          className="items-center"
        >
          <MaterialIcons name="person" size={28} color="#4B5563" />
          <Text className="text-sm text-gray-600 mt-1">Profile</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
