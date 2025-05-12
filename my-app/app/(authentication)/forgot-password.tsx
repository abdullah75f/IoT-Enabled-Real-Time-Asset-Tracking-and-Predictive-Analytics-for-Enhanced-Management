import React, { useState, useCallback } from "react";
import {
  ActivityIndicator,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Alert,
  Keyboard,
} from "react-native";
import { useFonts, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { Link, useRouter, useFocusEffect } from "expo-router";
import { useDispatch, useSelector } from "react-redux";
import {
  setEmail,
  clearForgotPasswordState,
} from "@/store/slices/forgotPasswordSlice";
import { requestPasswordReset } from "../apiService/api";

interface ApiResponse {
  message: string;
}

export default function ForgotPassword() {
  const dispatch = useDispatch();
  const forgotPasswordData = useSelector((state: any) => state.forgotPassword);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
  });

  useFocusEffect(
    useCallback(() => {
      dispatch(clearForgotPasswordState());
    }, [dispatch])
  );

  const handleSendResetInstructions = async () => {
    Keyboard.dismiss();
    const email = forgotPasswordData.email?.trim();

    if (!email) {
      Alert.alert("Error", "Please enter your email address.");
      return;
    }

    setIsLoading(true);
    try {
      const result: { message?: string } = await requestPasswordReset(email);

      Alert.alert(
        "Check Your Email",
        result.message ||
          "If an account exists, password reset instructions have been sent.",
        [
          {
            text: "OK",
            onPress: () => {
              router.push({
                pathname: "/(authentication)/reset-password",
                params: { email: email },
              });
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      console.error("Forgot Password Error:", error);
      Alert.alert(
        "Request Failed",
        error.message || "Could not request password reset. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-start pt-32 bg-white px-5">
      <View className="justify-center items-center w-full mb-10">
        <Text
          className="text-2xl font-bold text-center text-gray-800"
          style={{ fontFamily: "Inter_600SemiBold" }}
        >
          Forgot Password?
        </Text>
        <Text className="text-base leading-6 text-center text-gray-600 mt-2 px-4">
          Enter your email address, and we will send reset instructions
        </Text>
      </View>

      <View className="w-full">
        <Text className="text-gray-800 font-medium mb-1 text-sm">Email</Text>
        <TextInput
          placeholder="Enter email address"
          value={forgotPasswordData.email} //
          onChangeText={(text) => dispatch(setEmail(text))}
          keyboardType="email-address"
          autoCapitalize="none"
          className="rounded border border-gray-300 bg-gray-50 p-3 min-h-[50px] text-base w-full"
        />

        <TouchableOpacity
          className={`bg-[#21252C] mt-8 w-full h-14 justify-center items-center self-center rounded-md ${
            isLoading ? "opacity-70" : ""
          }`}
          onPress={handleSendResetInstructions}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text className="self-center text-white text-center font-semibold text-base">
              Send Reset Instructions
            </Text>
          )}
        </TouchableOpacity>

        <View className="flex-row justify-center items-center mt-7">
          <Text className="text-gray-600">Remembered password?</Text>
          <Link href="/(authentication)/sign-in" asChild>
            <TouchableOpacity>
              <Text className="font-bold text-[#21252C]"> Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
