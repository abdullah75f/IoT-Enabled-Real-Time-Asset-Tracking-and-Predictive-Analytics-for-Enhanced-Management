import React from "react";
import { View, TouchableOpacity, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";

export default function Footer() {
  return (
    <View className=" w-full h-16 bg-gray-200 px-4 mb-4">
      <View
        style={{
          backgroundColor: "#000000",
          height: 1,
          marginHorizontal: 20,
          marginBottom: 10,
        }}
      />
      <View className="flex-row justify-around p-4 bg-gray-100">
        <View className="justify-center items-center">
          <TouchableOpacity className="pr-4">
            <MaterialIcons name="home" size={26} color="black" />
          </TouchableOpacity>
          <Text>Home</Text>
        </View>
        <View className="justify-center items-center">
          <TouchableOpacity className="pr-4">
            <MaterialIcons name="location-on" size={25} color="black" />
          </TouchableOpacity>
          <Text>Track</Text>
        </View>
        <View className="justify-center items-center">
          <TouchableOpacity className="pr-4">
            <MaterialIcons name="book" size={25} color="black" />
          </TouchableOpacity>
          <Text>Booking</Text>
        </View>
        <View className="justify-center items-center">
          <TouchableOpacity className="pr-4">
            <MaterialIcons name="person" size={27} color="black" />
          </TouchableOpacity>
          <Text className="font-s">Profile</Text>
        </View>
      </View>
    </View>
  );
}
