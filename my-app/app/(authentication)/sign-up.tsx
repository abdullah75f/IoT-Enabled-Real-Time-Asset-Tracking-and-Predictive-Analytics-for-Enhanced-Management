import React, { useState, useEffect } from "react";
import { Link, router } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
  Alert,
} from "react-native";
import {
  setFirstName,
  setLastName,
  setEmail,
  setPhoneNumber,
  setGender,
  setAge,
  setAddress,
  setPassword,
  setConfirmPassword,
  setPasswordMismatchError,
  setSelectedOption,
} from "@/store/slices/signUpSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { createUser, googleSignup } from "@/app/apiService/api";
import * as Google from "expo-auth-session/providers/google";
import * as WebBrowser from "expo-web-browser";
import * as AuthSession from "expo-auth-session";
import { makeRedirectUri } from "expo-auth-session";
import { useTheme } from "@react-navigation/native";
import { CustomTheme } from "../../utils/theme";

export default function SignUp() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const signUpData = useSelector((state: any) => state.signUp);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });

  const { colors } = useTheme() as CustomTheme;

  WebBrowser.maybeCompleteAuthSession();

  // const redirectUri = AuthSession.makeRedirectUri(); // Generate the redirect URI automatically
  // console.log("Redirect URI:", redirectUri);
  const redirectUri = "https://auth.expo.io/@abdullah75f/iot-asset-tracking";

  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId:
      "564302230889-ffdhehch5so4o6csbb9mc0ub4ef22f9e.apps.googleusercontent.com", // Your Web Client ID
    scopes: ["profile", "email"],
    redirectUri: redirectUri, // Your Redirect URI
  });

  useEffect(() => {
    const initialize = async () => {
      await new Promise((resolve) => setTimeout(resolve, 500));
      setLoading(false);
    };

    initialize();

    return () => {
      dispatch(setEmail(""));
      dispatch(setPassword(""));
    };
  }, [dispatch]);

  useEffect(() => {
    if (response?.type === "success") {
      const accessToken = response.authentication?.accessToken;
      if (accessToken) {
        handleGoogleSignUp(accessToken);
      } else {
        console.error("Google Auth Error: No access token found.");
        Alert.alert("Error", "Google Sign-In failed. Please try again.");
      }
    } else if (response?.type === "error") {
      console.error("Google Auth Error:", response.error);
      Alert.alert("Error", "Google Sign-In failed. Please try again.");
    }
  }, [response]);

  // Function to handle sign-up or sign-in with the Google token
  const handleGoogleSignUp = async (token: string) => {
    if (!token) {
      Alert.alert("Google Sign-Up Failed", "No token received.");
      return;
    }

    try {
      const response = await googleSignup(token);
      Alert.alert(
        "Success",
        "Account created successfully with Google!",
        [{ text: "OK", onPress: () => router.replace("/sign-in") }],
        { cancelable: false }
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.message || "Google sign-up failed. Try again."
      );
    }
  };

  // Function to trigger the Google OAuth flow
  const handleGoogleSignIn = () => {
    promptAsync(); // This triggers the OAuth process
  };

  const handlePasswordChange = (password: string) => {
    dispatch(setPassword(password));
    if (password !== signUpData.confirmPassword) {
      dispatch(setPasswordMismatchError(true));
    } else {
      dispatch(setPasswordMismatchError(false));
    }
  };

  const handleConfirmPasswordChange = (confirmPassword: string) => {
    dispatch(setConfirmPassword(confirmPassword));
    if (signUpData.password !== confirmPassword) {
      dispatch(setPasswordMismatchError(true));
    } else {
      dispatch(setPasswordMismatchError(false));
    }
  };

  const handleSignUp = async () => {
    if (signUpData.password !== signUpData.confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }
    const {
      firstName,
      lastName,
      email,
      phoneNumber,
      gender,
      age,
      password,
      address,
      selectedOption,
    } = signUpData;

    try {
      const userData: any = {
        firstName,
        lastName,
        gender,
        age: parseInt(age),
        password,
        address,
      };

      if (selectedOption === "email") {
        userData.email = email;
      } else if (selectedOption === "phone") {
        userData.phoneNumber = phoneNumber;
      }

      const response = await createUser(userData);
      Alert.alert(
        "Success",
        "Successful Registration! Please check your email for verification.",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/sign-in");
            },
          },
        ],
        { cancelable: false }
      );
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.message || "Failed to sign up. Please try again."
      );
    }
  };

  if (!fontsLoaded || loading) {
    return (
      <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" color={colors.text} />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View
        className="flex-1 justify-start pt-24"
        style={{ backgroundColor: colors.background }}
      >
        <Text
          className="text-black self-center font-bold text-[34px]"
          style={{ color: colors.text }}
        >
          Sign Up
        </Text>
        <View
          className="mx-6 pt-10 px-6 font-bold text-base"
          style={{ backgroundColor: colors.card }}
        >
          <Text style={{ color: colors.text }}>First Name</Text>
          <TextInput
            value={signUpData.firstName}
            onChangeText={(text) => dispatch(setFirstName(text))}
            placeholder="Enter your full name"
            className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
            style={{ color: colors.text, borderColor: colors.border }}
          />
          <Text style={{ color: colors.text }}>Last Name</Text>
          <TextInput
            value={signUpData.lastName}
            onChangeText={(text) => dispatch(setLastName(text))}
            placeholder="Enter your full name"
            className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
            style={{ color: colors.text, borderColor: colors.border }}
          />
          <View className="mx-6 pt-4 px-6">
            <Text
              className="font-bold text-base text-[18px]"
              style={{ color: colors.text }}
            >
              Sign Up Using
            </Text>
            <View className="flex-row justify-around items-center mt-4">
              <View className="flex-row items-center">
                <Text className="mr-2" style={{ color: colors.text }}>
                  Email
                </Text>
                <TouchableOpacity
                  className={`w-6 h-6 rounded-full border ${
                    signUpData.selectedOption === "email"
                      ? "bg-gray-300"
                      : "bg-transparent"
                  } flex justify-center items-center`}
                  style={{ borderColor: colors.border }}
                  onPress={() => dispatch(setSelectedOption("email"))}
                >
                  {signUpData.selectedOption === "email" && (
                    <View className="w-3 h-3 rounded-full bg-black"></View>
                  )}
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-2" style={{ color: colors.text }}>
                  Phone number
                </Text>

                <TouchableOpacity
                  className={`w-6 h-6 rounded-full border ${
                    signUpData.selectedOption === "phone"
                      ? "bg-gray-300"
                      : "bg-transparent"
                  } flex justify-center items-center`}
                  style={{ borderColor: colors.border }}
                  onPress={() => dispatch(setSelectedOption("phone"))}
                >
                  {signUpData.selectedOption === "phone" && (
                    <View className="w-3 h-3 rounded-full bg-black"></View>
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>
          {signUpData.selectedOption === "email" && (
            <View>
              <Text style={{ color: colors.text }}>Email</Text>
              <TextInput
                value={signUpData.email}
                onChangeText={(text) => dispatch(setEmail(text))}
                placeholder="Enter your email"
                keyboardType="email-address"
                className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
                style={{ color: colors.text, borderColor: colors.border }}
              />
            </View>
          )}
          {signUpData.selectedOption === "phone" && (
            <View>
              <Text style={{ color: colors.text }}>Phone Number</Text>
              <TextInput
                value={signUpData.phoneNumber}
                onChangeText={(text) => dispatch(setPhoneNumber(text))}
                placeholder="Enter your Phone number"
                keyboardType="phone-pad"
                className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
                style={{ color: colors.text, borderColor: colors.border }}
              />
            </View>
          )}
          <View className="pt-4">
            <Text style={{ color: colors.text }}>Gender</Text>
            <View className="flex-row justify-around mt-2">
              <View className="flex-row items-center">
                <TouchableOpacity
                  className={`w-6 h-6 rounded-full border border-gray-300 mr-3 ${
                    signUpData.gender === "Male"
                      ? "bg-gray-300"
                      : "bg-transparent"
                  } flex justify-center items-center`}
                  style={{ borderColor: colors.border }}
                  onPress={() => dispatch(setGender("Male"))}
                >
                  {signUpData.gender === "Male" && (
                    <View className="w-3 h-3 rounded-full bg-black"></View>
                  )}
                </TouchableOpacity>
                <Text style={{ color: colors.text }}>Male</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className={`w-6 h-6 rounded-full border border-gray-300 mr-3 ${
                    signUpData.gender === "Female"
                      ? "bg-gray-300"
                      : "bg-transparent"
                  } flex justify-center items-center`}
                  style={{ borderColor: colors.border }}
                  onPress={() => dispatch(setGender("Female"))}
                >
                  {signUpData.gender === "Female" && (
                    <View className="w-3 h-3 rounded-full bg-black"></View>
                  )}
                </TouchableOpacity>
                <Text style={{ color: colors.text }}>Female</Text>
              </View>
            </View>
          </View>
          <View className="w-40 pt-5 ">
            <Text style={{ color: colors.text }}>Age</Text>
            <TextInput
              value={signUpData.age}
              onChangeText={(text) => dispatch(setAge(text))}
              placeholder="Enter your age"
              className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
              style={{ color: colors.text, borderColor: colors.border }}
            />
          </View>
        </View>
        <View
          className="mx-6 pt-5 px-6 font-bold text-base"
          style={{ backgroundColor: colors.card }}
        >
          <Text style={{ color: colors.text }}>Address</Text>
          <TextInput
            value={signUpData.address}
            onChangeText={(text) => dispatch(setAddress(text))}
            placeholder="Enter your address,e.g, Ethiopia, Addis Ababa"
            className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
            style={{ color: colors.text, borderColor: colors.border }}
          />
          <Text style={{ color: colors.text }}>Password</Text>
          <TextInput
            value={signUpData.password}
            onChangeText={handlePasswordChange}
            placeholder="Enter your password"
            secureTextEntry
            className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
            style={{ color: colors.text, borderColor: colors.border }}
          />
          <Text style={{ color: colors.text }}>Confirm Password</Text>
          <TextInput
            value={signUpData.confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            placeholder="Enter your password"
            secureTextEntry
            className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
            style={{ color: colors.text, borderColor: colors.border }}
          />
          {signUpData.passwordMismatchError && (
            <Text style={{ color: colors.notification, fontSize: 12 }}>
              Passwords do not match
            </Text>
          )}
        </View>
        <View>
          <TouchableOpacity
            className="bg-[#21252C] mt-6 w-[335px] h-16 justify-center items-center self-center rounded-lg"
            onPress={handleSignUp}
            disabled={signUpData.passwordMismatchError}
            style={{ backgroundColor: colors.primary }}
          >
            <Text
              className="self-center text-white text-center"
              style={{ color: colors.text }}
            >
              Sign Up
            </Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center items-center mt-6">
          <Text style={{ color: colors.text }}>Have an account?</Text>
          <Link href="/(authentication)/sign-in" asChild>
            <TouchableOpacity>
              <Text className="font-bold" style={{ color: colors.text }}>
                Sign In
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
            Or Sign up with
          </Text>
          <View
            className="flex-1 h-px bg-gray-300"
            style={{ backgroundColor: colors.border }}
          />
        </View>
        <View className="flex-1  mb-16 ">
          <View className=" flex-row justify-around">
            <TouchableOpacity
              className="border rounded-[16px] w-[260px] h-16 justify-center items-center"
              onPress={handleGoogleSignIn} // Trigger Google Sign-In here
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
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
