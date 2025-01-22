import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView } from "react-native";

export default function SettingsPage() {
  const [firstName, setFirstName] = useState("Azusa");
  const [lastName, setLastName] = useState("Nakano");
  const [email, setEmail] = useState("example@domain.com");
  const [phoneNumber, setPhoneNumber] = useState("+251 (949) 389-828");

  return (
    <ScrollView className="flex-1 bg-white pt-10 px-6">
      <Text className="text-black font-bold text-[24px] mb-6">Profile Settings</Text>

      {/* Profile Details Section */}
      <View className="mb-8">
        <Text className="text-gray-500 font-semibold text-sm">Profile Details</Text>
        <Text className="text-gray-600 text-xs mb-4">
          You can change your profile details here seamlessly.
        </Text>
        <View className="border border-gray-300 rounded-lg p-4 mb-4">
          <Text className="text-gray-800 text-sm mb-2">Public Profile</Text>
          <Text className="text-gray-500 text-xs mb-2">
            This is the main profile that will be visible for everyone.
          </Text>
          <TouchableOpacity>
            <Text className="text-green-600 text-xs">View Details</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Profile Picture Section */}
      <View className="mb-8">
        <Text className="text-gray-500 font-semibold text-sm mb-2">Profile Picture</Text>
        <TouchableOpacity className="h-40 border-dashed border-2 border-gray-400 rounded-lg justify-center items-center">
          <Image
            source={{ uri: "https://via.placeholder.com/100" }}
            style={{ width: 60, height: 60, marginBottom: 8 }}
          />
          <Text className="text-gray-500 text-sm">Click here to upload your file or drag.</Text>
          <Text className="text-gray-400 text-xs mt-1">
            Supported Formats: SVG, PNG, JPG (10MB each)
          </Text>
        </TouchableOpacity>
      </View>

      {/* Personal Information Section */}
      <View className="mb-8">
        <TextInput
          placeholder="First Name"
          className="h-12 border border-gray-300 rounded-lg px-4 mb-4"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          placeholder="Last Name"
          className="h-12 border border-gray-300 rounded-lg px-4 mb-4"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          placeholder="Email Address"
          className="h-12 border border-gray-300 rounded-lg px-4 mb-4"
          value={email}
          onChangeText={setEmail}
        />
        <TextInput
          placeholder="Phone Number"
          className="h-12 border border-gray-300 rounded-lg px-4"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
        />
      </View>

      {/* Notifications Section */}
      <View className="mb-8">
        <Text className="text-gray-500 font-semibold text-sm mb-4">Notifications</Text>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-800">Reports</Text>
          <TouchableOpacity className="h-6 w-6 rounded-full border border-gray-400 justify-center items-center">
            <View className="h-4 w-4 rounded-full bg-green-500"></View>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-800">Sound</Text>
          <TouchableOpacity className="h-6 w-6 rounded-full border border-gray-400 justify-center items-center">
            <View className="h-4 w-4 rounded-full bg-gray-200"></View>
          </TouchableOpacity>
        </View>
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-800">Vibration</Text>
          <TouchableOpacity className="h-6 w-6 rounded-full border border-gray-400 justify-center items-center">
            <View className="h-4 w-4 rounded-full bg-green-500"></View>
          </TouchableOpacity>
        </View>
      </View>

      {/* Action Buttons */}
      <View className="flex-row justify-between">
        <TouchableOpacity className="bg-gray-200 h-12 justify-center items-center rounded-lg flex-1 mr-2">
          <Text className="text-gray-600">Cancel</Text>
        </TouchableOpacity>
        <TouchableOpacity className="bg-green-600 h-12 justify-center items-center rounded-lg flex-1 ml-2">
          <Text className="text-white">Save Settings</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}
