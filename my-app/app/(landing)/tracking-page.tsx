// tracking-page.tsx

import Footer from "@/components/footer";
import { router } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";

export default function TrackingPage() {
  return (
    <View className="flex-1 justify-start pt-10">
      <View className="flex-1">
      <Text className="text-black self-center font-bold text-[24px]">
        Asset Tracking
      </Text>
       <Image
        source={require('../../assets/images/map000.png')} 
        style={{  width: 400 , height: 400, marginTop: 20, }}
      />
      <TouchableOpacity
        onPress={() => router.push("/(properties)/asset-history")}
        className="bg-green-700 w-[335px] h-12 justify-center items-center rounded-md mt-6 self-center"
      >
        <Text className="text-white text-lg">Assets Details</Text>
      </TouchableOpacity>
      </View>
      <Footer/>
    </View>
  );
}
