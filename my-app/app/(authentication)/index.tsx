import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Link } from "expo-router";
import { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Image } from "react-native";
export default function SignUp() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View className="flex-1 justify-start pt-24">
      <Text className="text-black self-center font-bold text-[34px]">
        Sign In
      </Text>
      <View className="mx-6 pt-20 px-6 font-bold text-base">
        <Text>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
        />
        <Text>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
        />
        <Link href="/forgot-password" asChild>
          <TouchableOpacity>
            <Text className="text-black self-end">Forgot password?</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View>
        <Link href="/sign-up" asChild>
          <TouchableOpacity className="bg-[#21252C] mt-6 w-[335px] h-16 justify-center items-center self-center rounded-lg">
            <Text className="self-center text-white text-center">Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View className="flex-row justify-center items-center mt-6">
        <Text>Don't have an account?</Text>
        <Link href="/sign-up" asChild>
          <TouchableOpacity>
            <Text className="font-bold"> Create Account</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View className="flex-row items-center self-center my-6 w-[335px] h-5">
        <View className="flex-1 h-px bg-gray-300" />
        <Text className="mx-2.5 text-black">Or Sign in with</Text>
        <View className="flex-1 h-px bg-gray-300" />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-around">
          <Link href="/sign-up" asChild>
            <TouchableOpacity className="border rounded-[16px] w-[160px] h-16 justify-center items-center">
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../assets/images/google-logo.png")}
                  style={{ width: 20, height: 20 }}
                />
                <Text className="text-lg text-black">Google</Text>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href="/sign-up" asChild>
            <TouchableOpacity className="border rounded-[16px] w-[160px] h-16 justify-center items-center">
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../assets/images/apple-logo.png")}
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: "transparent",
                  }}
                />
                <Text className="text-lg text-black">Apple</Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
