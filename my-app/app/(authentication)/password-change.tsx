// password-change.tsx
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";

export default function PasswordChange() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  return (
    <View className="flex-1 justify-start pt-24">
      <Text className="text-black self-center font-bold text-[34px]">
        Set New Password
      </Text>
      <View className="mx-6 pt-20 px-6 font-bold text-base">
        <Text>New Password</Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter new password"
          secureTextEntry
          className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
        />
        <Text>Confirm Password</Text>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm password"
          secureTextEntry
          className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
        />
      </View>
      <TouchableOpacity className="bg-[#21252C] mt-6 w-[335px] h-16 justify-center items-center self-center rounded-lg">
        <Text className="self-center text-white text-center">Reset Password</Text>
      </TouchableOpacity>
      <TouchableOpacity className="self-center mt-4">
        <Text className="text-black">Remembered password? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
}