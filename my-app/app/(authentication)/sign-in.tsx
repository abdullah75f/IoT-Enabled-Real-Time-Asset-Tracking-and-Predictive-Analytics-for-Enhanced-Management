import { setEmail, setPassword } from "@/store/slices/signInSlices";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Link } from "expo-router";
import { useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
export default function SignIn() {
  const dispatch = useDispatch();
  const signInData = useSelector((state: any) => state.signIn);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  useEffect(() => {
    return () => {
      dispatch(setEmail(""));
      dispatch(setPassword(""));
    };
  }, [dispatch]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <View className="flex-1 justify-start pt-24">
      <Text className="text-black self-center font-bold text-[34px]">
        Sign In
      </Text>
      <View className="mx-6 pt-20 px-6 font-bold text-base">
        <Text>Email Address</Text>
        <TextInput
          value={signInData.email}
          onChangeText={(text) => dispatch(setEmail(text))}
          placeholder="Enter your email"
          keyboardType="email-address"
          className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
        />
        <Text>Password</Text>
        <TextInput
          value={signInData.password}
          onChangeText={(text) => dispatch(setPassword(text))}
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
        <Link href="/(landing)/home-page" asChild>
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
          <Link href="/about-us" asChild>
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
          <Link href="/notifications" asChild>
            <TouchableOpacity className="border rounded-[16px] w-[160px] h-16 justify-center items-center">
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../assets/images/PhoneIcon.png")}
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: "transparent",
                  }}
                />
                <Text className="text-lg text-black">Phone</Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
