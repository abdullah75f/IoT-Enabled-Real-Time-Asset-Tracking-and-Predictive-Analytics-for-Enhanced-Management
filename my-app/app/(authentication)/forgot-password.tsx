import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFonts, Inter_600SemiBold } from "@expo-google-fonts/inter";
import AppLoading from "expo-app-loading";
import { useState } from "react";
import { Link } from "expo-router";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [fontsLoaded] = useFonts({
    Inter_600SemiBold,
  });

  if (!fontsLoaded) {
    return <AppLoading />;
  }

  return (
    <View className="flex-1 justify-start pt-32">
      <View className="justify-center items-center w-[276px] h-[82px] self-center">
        <Text
          style={{
            fontSize: 24,
            fontFamily: "Inter_600SemiBold",
          }}
        >
          Forgot Password?
        </Text>
        <Text className="text-base leading-7 text-center mb-5 pt-2 font-thin">
          Enter your email address, and we will
          <Text className="text-base leading-6 text-center">
            {" "}
            {"\n"}send an OTP
          </Text>
        </Text>
      </View>
      <View className="mx-7 pt-[60px] px-5 text-base font-bold">
        <Text>Email</Text>
        <TextInput
          placeholder="Enter email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          className="rounded border border-gray-300 border-solid p-3 my-2 min-h-[10px]"
        />
        <Link href="/sign-up" asChild>
          <TouchableOpacity className="bg-[#21252C] mt-8 w-[335px] h-16 justify-center items-center self-center rounded-md">
            <Text className="self-center text-white text-center">Continue</Text>
          </TouchableOpacity>
        </Link>
        <View className="flex-row justify-center items-center mt-7">
          <Text>Remembered password?</Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text className="font-bold"> Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
