import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { useSelector, useDispatch } from "react-redux";
import { setSignInData } from "@/store/slices/signInSlices";
import { updateUserProfile } from "@/app/apiService/api";
import { Picker } from "@react-native-picker/picker"; // Import Picker
import Footer from "@/components/footer";

export default function SettingsPage() {
  const dispatch = useDispatch();
  const signInData = useSelector((state: any) => state.signIn);
  const user = signInData.user;
  const jwtToken = signInData.jwtToken;

  // Initialize state with user data from Redux
  const [firstName, setFirstName] = useState(user.firstName || "");
  const [lastName, setLastName] = useState(user.lastName || "");
  const [email, setEmail] = useState(user.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phoneNumber || "");
  const [gender, setGender] = useState(user.gender || "Other"); // Default to "Other"
  const [age, setAge] = useState(user.age || "");
  const [address, setAddress] = useState(user.address || "");

  // Update state if user data changes (e.g., after re-authentication)
  useEffect(() => {
    setFirstName(user.firstName || "");
    setLastName(user.lastName || "");
    setEmail(user.email || "");
    setPhoneNumber(user.phoneNumber || "");
    setGender(user.gender || "Other");
    setAge(user.age || "");
    setAddress(user.address || "");
  }, [user]);

  // Handle save settings
  const handleSaveSettings = async () => {
    try {
      const updatedData = {
        firstName,
        lastName,
        email,
        phoneNumber,
        gender,
        age,
        address,
      };

      // Call the API to update the user profile
      const updatedUser = await updateUserProfile(updatedData);

      // Update Redux store with the new user data
      dispatch(setSignInData({ user: updatedUser, jwtToken }));

      Alert.alert("Success", "Profile updated successfully!");
    } catch (error) {
      console.error("(NOBRIDGE) LOG Update Profile Error:", error);
      Alert.alert("Error", "Failed to update profile. Please try again.");
    }
  };

  return (
    <View className="flex-1 ">
      <ScrollView
        className="flex-1 bg-white pt-10 px-6"
        contentContainerStyle={{ paddingBottom: 80 }}
      >
        <Text
          className="font-semibold text-lg mb-6"
          style={{ color: "#000000" }}
        >
          Profile Settings
        </Text>

        {/* Profile Details Section */}
        <View className="mb-8">
          <Text className="font-semibold text-sm mb-2">Profile Details</Text>
          <Text className="text-gray-500 text-xs mb-4">
            You can change your profile details here seamlessly.
          </Text>
          <View className="border border-gray-300 rounded p-4 mb-4">
            <Text className="font-semibold text-sm mb-2">Public Profile</Text>
            <Text className="text-gray-500 text-xs mb-2">
              This is the main profile that will be visible for everyone.
            </Text>
            <TouchableOpacity>
              <Text className="text-blue-500 text-xs">View Details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Personal Information Section */}
        <View className="mb-8">
          <Text className="font-semibold">First Name</Text>
          <TextInput
            placeholder="First Name"
            className="h-12 border border-gray-300 rounded p-2 mb-4"
            value={firstName}
            onChangeText={setFirstName}
          />
          <Text className="font-semibold">Last Name</Text>

          <TextInput
            placeholder="Last Name"
            className="h-12 border border-gray-300 rounded p-2 mb-4"
            value={lastName}
            onChangeText={setLastName}
          />
          <Text className="font-semibold">Email</Text>

          <TextInput
            placeholder="Email Address"
            className="h-12 border border-gray-300 rounded p-2 mb-4"
            value={email}
            onChangeText={setEmail}
          />
          <Text className="font-semibold">Phone number</Text>

          <TextInput
            placeholder="Phone Number"
            className="h-12 border border-gray-300 rounded p-2 mb-4"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          <Text className="font-semibold">Gender</Text>
          <View className="border border-gray-300 rounded mb-4">
            <Picker
              selectedValue={gender}
              onValueChange={(itemValue) => setGender(itemValue)}
              style={{ height: 48, width: "100%", paddingHorizontal: 8 }}
            >
              <Picker.Item label="Select Gender" value="Other" />
              <Picker.Item label="Male" value="Male" />
              <Picker.Item label="Female" value="Female" />
              <Picker.Item label="Other" value="Other" />
            </Picker>
          </View>
          <Text className="font-semibold">Age</Text>
          <TextInput
            placeholder="Age"
            className="h-12 border border-gray-300 rounded p-2 mb-4"
            value={age}
            onChangeText={setAge}
          />
          <Text className="font-semibold">Address</Text>

          <TextInput
            placeholder="Address"
            className="h-12 border border-gray-300 rounded p-2 mb-4"
            value={address}
            onChangeText={setAddress}
          />
        </View>

        {/* Action Buttons */}
        <View className="flex-row justify-between">
          <TouchableOpacity className="bg-gray-200 h-12 justify-center items-center rounded flex-1 mr-2">
            <Text className="text-gray-600">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleSaveSettings}
            className="bg-green-600 h-12 justify-center items-center rounded flex-1 ml-2"
          >
            <Text className="text-white">Save Settings</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}
