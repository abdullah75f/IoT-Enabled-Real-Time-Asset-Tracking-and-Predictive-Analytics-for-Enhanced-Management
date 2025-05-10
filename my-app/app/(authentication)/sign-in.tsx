import {
  setEmail,
  setJwtToken,
  setPassword,
  setSignInData,
} from "@/store/slices/signInSlices";
import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Link, router } from "expo-router";
import { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, signInUser } from "../apiService/api";
import store from "../../store/store";
import { useTheme } from "@react-navigation/native";
import { CustomTheme } from "../../utils/theme";

export default function SignIn() {
  const dispatch = useDispatch();
  const signInData = useSelector((state: any) => state.signIn);
  const [loading, setLoading] = useState(false);

  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  const { colors } = useTheme() as CustomTheme;

  useEffect(() => {
    return () => {
      dispatch(setEmail(""));
      dispatch(setPassword(""));
    };
  }, [dispatch]);

  if (!fontsLoaded) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  const handleSignIn = async () => {
    if (!signInData.email || !signInData.password) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }
    setLoading(true);

    try {
      const { accessToken } = await signInUser({
        email: signInData.email,
        password: signInData.password,
      });
      dispatch(setJwtToken(accessToken));
      console.log(
        "(NOBRIDGE) LOG State after token dispatch:",
        store.getState().signIn
      );
      const userData = await fetchUserProfile();
      dispatch(setSignInData({ jwtToken: accessToken, user: userData }));

      Alert.alert(
        "Success",
        "Signed in successfully!",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(landing)/home-page");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "An error occurred while signing in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className="flex-1 justify-start pt-24"
      style={{ backgroundColor: colors.background }}
    >
      <Text
        className="text-black self-center font-bold text-[34px]"
        style={{ color: colors.text }}
      >
        Sign In
      </Text>
      <View
        className="mx-6 pt-20 px-6 font-bold text-base"
        style={{ backgroundColor: colors.card }}
      >
        <Text style={{ color: colors.text }}>Email Address</Text>

        <TextInput
          value={signInData.email}
          onChangeText={(text) => dispatch(setEmail(text))}
          placeholder="Enter your email"
          keyboardType="email-address"
          className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
          style={{ color: colors.text, borderColor: colors.border }}
        />
        <Text style={{ color: colors.text }}>Password</Text>
        <TextInput
          value={signInData.password}
          onChangeText={(text) => dispatch(setPassword(text))}
          placeholder="Enter your password"
          secureTextEntry
          className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
          style={{ color: colors.text, borderColor: colors.border }}
        />
        <Link href="/forgot-password" asChild>
          <TouchableOpacity>
            <Text
              className="text-black self-end"
              style={{ color: colors.text }}
            >
              Forgot password?
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View>
        <TouchableOpacity
          onPress={handleSignIn}
          disabled={loading}
          className="bg-[#21252C] mt-6 w-[335px] h-16 justify-center items-center self-center rounded-lg"
        >
          {loading ? (
            <ActivityIndicator size="small" color={colors.text} />
          ) : (
            <Text
              className="self-center text-white text-center"
              style={{ color: colors.text }}
            >
              Sign In
            </Text>
          )}
        </TouchableOpacity>
        {/* <TouchableOpacity  className="bg-[#21252C] mt-6 w-[335px] h-16 justify-center items-center self-center rounded-lg">
          <Text className="self-center text-white text-center">Sign In</Text>
        </TouchableOpacity> */}
      </View>
      <View className="flex-row justify-center items-center mt-6">
        <Text style={{ color: colors.text }}>Don't have an account?</Text>
        <Link href="/sign-up" asChild>
          <TouchableOpacity>
            <Text className="font-bold" style={{ color: colors.text }}>
              Create Account
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View className="flex-row items-center self-center my-6 w-[335px] h-5">
        <View
          className="flex-1 h-px bg-gray-300"
          style={{ backgroundColor: colors.border }}
        />
        <Text className="mx-2.5 text-black" style={{ color: colors.text }}>
          Or Sign in with
        </Text>
        <View
          className="flex-1 h-px bg-gray-300"
          style={{ backgroundColor: colors.border }}
        />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-around">
          <Link href="/about-us" asChild>
            <TouchableOpacity
              className="border rounded-[16px] w-[160px] h-16 justify-center items-center"
              style={{ borderColor: colors.border }}
            >
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../assets/images/google-logo.png")}
                  style={{ width: 20, height: 20 }}
                />
                <Text
                  className="text-lg text-black"
                  style={{ color: colors.text }}
                >
                  Google
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href="/notifications" asChild>
            <TouchableOpacity
              className="border rounded-[16px] w-[160px] h-16 justify-center items-center"
              style={{ borderColor: colors.border }}
            >
              <View className="flex-row items-center gap-2">
                <Image
                  source={require("../../assets/images/PhoneIcon.png")}
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: "transparent",
                  }}
                />
                <Text
                  className="text-lg text-black"
                  style={{ color: colors.text }}
                >
                  Phone
                </Text>
              </View>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
