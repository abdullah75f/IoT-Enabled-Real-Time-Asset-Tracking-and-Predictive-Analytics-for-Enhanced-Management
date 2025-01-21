import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";

export default function AboutUs() {
  return (
    <View className="flex-1 ">
      <View className="pt-5 ">
        <MaterialIcons name="format-quote" size={40} color="black" />
        <Text className="text-center font-semibold  mb-8 italic">
          commodo consequat. Duis aute irure dolor
        </Text>
        <Text className="w-11/12 self-center">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis aute irure dolor in
          reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla
          pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum. Lorem ipsum
          dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam,
          quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
          commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
          velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint
          occaecat cupidatat non proident, sunt in culpa qui officia deserunt
          mollit anim id est laborum. sit amet, consectetur adipiscing elit. Sed
          do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
          ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
          aliquip ex ea commodo consequat. Duis
        </Text>
      </View>
      <View className="bg-black flex-1 mt-44">
        <Text className="text-white font-bold mt-4 ml-8">Contact us</Text>

        <Text className="text-white mt-4 ml-8">nahommit@gmail.com</Text>
        <Text className="text-white ml-8">+251969696969</Text>
        <Text>Based in</Text>
        <View className="flex-row justify-between w-11/12">
          <Text className="text-white pl-3">Addis Ababa, Ethiopia</Text>
          <View className="flex-row gap-5">
            <TouchableOpacity>
              <MaterialCommunityIcons name="facebook" size={24} color="white" />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons
                name="instagram"
                size={24}
                color="white"
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <MaterialCommunityIcons name="twitter" size={24} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}
