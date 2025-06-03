import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Link } from "expo-router";
import { useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, NativeSyntheticEvent, TextInputKeyPressEventData } from "react-native";

export default function OTPVerification() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });
  const [otp, setOtp] = useState<string[]>(["", "", "", ""]);

  // Refs for the OTP inputs
  const otpRefs = useRef<Array<TextInput | null>>([]);

  const handleOtpChange = (text: string, index: number) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);

    // Automatically focus the next input
    if (text && index < otp.length - 1) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) => {
    if (e.nativeEvent.key === "Backspace" && index > 0 && !otp[index]) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <View className="flex-1 justify-start pt-24 px-6 bg-white">
      <Text className="text-black self-center font-bold text-[24px]">
        Enter OTP
      </Text>
      <Text className="text-gray-500 text-center mt-2">
        We've sent an OTP code to your email,{" "}
        <Text className="font-bold">Random3321@gmail.com</Text>
      </Text>

      {/* OTP Input Fields */}
      <View className="flex-row justify-center gap-4 mt-10">
        {otp.map((value, index) => (
          <TextInput
            key={index}
            ref={(el) => {
              otpRefs.current[index] = el;
            }}
            value={value}
            onChangeText={(text) => handleOtpChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            maxLength={1}
            keyboardType="number-pad"
            className="text-center text-lg font-bold w-14 h-14 border border-gray-300 rounded-lg"
          />
        ))}
      </View>

      {/* Resend OTP */}
      <Text className="text-center text-gray-500 mt-4">
        Didn't receive any code?{" "}
        <TouchableOpacity>
          <Text className="text-black font-bold">Resend</Text>
        </TouchableOpacity>
      </Text>

      {/* Verify Button */}
      <TouchableOpacity className="bg-black mt-8 w-full h-14 justify-center items-center rounded-lg">
        <Text className="text-white font-bold text-lg">Verify</Text>
      </TouchableOpacity>

      {/* Sign In Link */}
      <Text className="text-center text-gray-500 mt-6">
        Remembered password?{" "}
        <Link href="/sign-in" asChild>
          <TouchableOpacity>
            <Text className="font-bold text-black">Sign In</Text>
          </TouchableOpacity>
        </Link>
      </Text>
    </View>
  );
}
