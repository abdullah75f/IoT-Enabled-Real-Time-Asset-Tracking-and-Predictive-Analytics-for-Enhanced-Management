import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Keyboard,
  StyleSheet,
} from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";

import { resetPassword } from "../apiService/api";

export default function ResetPasswordScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const email = params.email as string | undefined;

  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);

  const handleResetPassword = async () => {
    Keyboard.dismiss();

    if (!token.trim()) {
      Alert.alert("Error", "Please enter the token from your email.");
      return;
    }
    if (!newPassword) {
      Alert.alert("Error", "Please enter a new password.");
      return;
    }
    if (newPassword.length < 8) {
      Alert.alert("Error", "Password must be at least 8 characters long.");
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const result = (await resetPassword(token.trim(), newPassword)) as {
        message: string;
      };

      Alert.alert(
        "Success",
        result.message || "Password successfully reset. You can now sign in.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(authentication)/sign-in");
            },
          },
        ]
      );
    } catch (error: any) {
      console.error("Reset Password Error:", error);
      Alert.alert(
        "Reset Failed",
        error.message ||
          "Could not reset password. Please check the token and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-start pt-24 bg-white px-5">
      <Text className="text-2xl font-bold mb-3 text-center text-gray-800">
        Reset Your Password
      </Text>
      {email && (
        <Text className="text-center text-gray-600 mb-8">
          For email: {email}
        </Text>
      )}
      {!email && (
        <Text className="text-center text-gray-600 mb-8">
          Enter the token received via email and your new password.
        </Text>
      )}

      <View className="mb-4">
        <Text className="text-gray-800 font-medium mb-1">Reset Token</Text>
        <TextInput
          placeholder="Enter token from email"
          value={token}
          onChangeText={setToken}
          autoCapitalize="none"
          className="rounded border border-gray-300 bg-gray-50 p-3 min-h-[50px] text-base"
        />
      </View>

      <View className="mb-4">
        <Text className="text-gray-800 font-medium mb-1">New Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Enter new password (min 8 chars)"
            value={newPassword}
            onChangeText={setNewPassword}
            secureTextEntry={!isPasswordVisible}
            autoCapitalize="none"
            className="flex-1 rounded-l border-t border-b border-l border-gray-300 bg-gray-50 p-3 min-h-[50px] text-base"
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          />
          <TouchableOpacity
            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
            style={styles.visibilityButton}
            className="border-t border-b border-r border-gray-300 bg-gray-50 rounded-r"
          >
            <Ionicons
              name={isPasswordVisible ? "eye-off-outline" : "eye-outline"}
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      <View className="mb-8">
        <Text className="text-gray-800 font-medium mb-1">
          Confirm New Password
        </Text>
        <View style={styles.passwordContainer}>
          <TextInput
            placeholder="Confirm new password"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!isConfirmPasswordVisible}
            autoCapitalize="none"
            className="flex-1 rounded-l border-t border-b border-l border-gray-300 bg-gray-50 p-3 min-h-[50px] text-base"
            style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
          />
          <TouchableOpacity
            onPress={() =>
              setIsConfirmPasswordVisible(!isConfirmPasswordVisible)
            }
            style={styles.visibilityButton}
            className="border-t border-b border-r border-gray-300 bg-gray-50 rounded-r"
          >
            <Ionicons
              name={
                isConfirmPasswordVisible ? "eye-off-outline" : "eye-outline"
              }
              size={24}
              color="gray"
            />
          </TouchableOpacity>
        </View>
      </View>

      <TouchableOpacity
        onPress={handleResetPassword}
        disabled={isLoading}
        className={`bg-[#21252C] w-full h-14 justify-center items-center self-center rounded-md ${
          isLoading ? "opacity-70" : ""
        }`}
      >
        {isLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="self-center text-white text-center font-semibold text-base">
            Reset Password
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  visibilityButton: {
    padding: 12,
    height: 50,
    justifyContent: "center",
    borderLeftWidth: 0,
  },
});
