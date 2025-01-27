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
import { useEffect, useState } from "react";
import { createUser } from "@/app/apiService/api";

export default function SignUp() {
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const signUpData = useSelector((state: any) => state.signUp);
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
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
    } = signUpData;

    try {
      const userData = {
        firstName,
        lastName,
        email: signUpData.selectedOption === "email" ? email : null,
        phoneNumber: signUpData.selectedOption === "phone" ? phoneNumber : null,
        gender,
        age: parseInt(age),
        password,
        address,
      };

      console.log("hiii userId:", userData);
      const response = await createUser(userData);
      Alert.alert(
        "Success",
        "Successful Registration!",
        [
          {
            text: "OK",
            onPress: () => {
              router.replace("/(authentication)/sign-in");
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
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
      <View className="flex-1 justify-start pt-24">
        <Text className="text-black self-center font-bold text-[34px]">
          Sign Up
        </Text>
        <View className="mx-6 pt-10 px-6 font-bold text-base">
          <Text>First Name</Text>
          <TextInput
            value={signUpData.firstName}
            onChangeText={(text) => dispatch(setFirstName(text))}
            placeholder="Enter your full name"
            className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
          />
          <Text>Last Name</Text>
          <TextInput
            value={signUpData.lastName}
            onChangeText={(text) => dispatch(setLastName(text))}
            placeholder="Enter your full name"
            className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
          />
          <View className="mx-6 pt-4 px-6">
            <Text className="font-bold text-base text-[18px]">
              Sign Up Using
            </Text>
            <View className="flex-row justify-around items-center mt-4">
              <View className="flex-row items-center">
                <Text className="mr-2">Email</Text>
                <TouchableOpacity
                  className={`w-6 h-6 rounded-full border ${
                    signUpData.selectedOption === "email"
                      ? "bg-gray-300"
                      : "bg-transparent"
                  } flex justify-center items-center`}
                  onPress={() => dispatch(setSelectedOption("email"))}
                >
                  {signUpData.selectedOption === "email" && (
                    <View className="w-3 h-3 rounded-full bg-black"></View>
                  )}
                </TouchableOpacity>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-2">Phone number</Text>
                <TouchableOpacity
                  className={`w-6 h-6 rounded-full border ${
                    signUpData.selectedOption === "phone"
                      ? "bg-gray-300"
                      : "bg-transparent"
                  } flex justify-center items-center`}
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
              <Text className="pt-2">Email</Text>
              <TextInput
                value={signUpData.email}
                onChangeText={(text) => dispatch(setEmail(text))}
                placeholder="Enter your email"
                keyboardType="email-address"
                className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
              />
            </View>
          )}
          {signUpData.selectedOption === "phone" && (
            <View>
              <Text className="pt-2">Phone Number</Text>
              <TextInput
                value={signUpData.phoneNumber}
                onChangeText={(text) => dispatch(setPhoneNumber(text))}
                placeholder="Enter your Phone number"
                keyboardType="phone-pad"
                className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
              />
            </View>
          )}
          <View className="pt-4">
            <Text>Gender</Text>
            <View className="flex-row justify-around mt-2">
              <View className="flex-row items-center">
                <TouchableOpacity
                  className={`w-6 h-6 rounded-full border border-gray-300 mr-3 ${
                    signUpData.gender === "Male"
                      ? "bg-gray-300"
                      : "bg-transparent"
                  } flex justify-center items-center`}
                  onPress={() => dispatch(setGender("Male"))}
                >
                  {signUpData.gender === "Male" && (
                    <View className="w-3 h-3 rounded-full bg-black"></View>
                  )}
                </TouchableOpacity>
                <Text>Male</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className={`w-6 h-6 rounded-full border border-gray-300 mr-3 ${
                    signUpData.gender === "Female"
                      ? "bg-gray-300"
                      : "bg-transparent"
                  } flex justify-center items-center`}
                  onPress={() => dispatch(setGender("Female"))}
                >
                  {signUpData.gender === "Female" && (
                    <View className="w-3 h-3 rounded-full bg-black"></View>
                  )}
                </TouchableOpacity>
                <Text>Female</Text>
              </View>
            </View>
          </View>

          <View className="w-40 pt-5 ">
            <Text className="pb-2">Age</Text>
            <TextInput
              value={signUpData.age}
              onChangeText={(text) => dispatch(setAge(text))}
              placeholder="Enter your age"
              className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
            />
          </View>
        </View>

        <View className="mx-6 pt-5 px-6 font-bold text-base">
          <Text className="pb-2">Address</Text>
          <TextInput
            value={signUpData.address}
            onChangeText={(text) => dispatch(setAddress(text))}
            placeholder="Enter your address,e.g, Ethiopia, Addis Ababa"
            className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
          />

          <Text className="pb-2">Password</Text>
          <TextInput
            value={signUpData.password}
            onChangeText={handlePasswordChange}
            placeholder="Enter your password"
            secureTextEntry
            className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
          />
          <Text className="pb-2 pt-5">Confirm Password</Text>
          <TextInput
            value={signUpData.confirmPassword}
            onChangeText={handleConfirmPasswordChange}
            placeholder="Enter your password"
            secureTextEntry
            className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
          />
          {signUpData.passwordMismatchError && (
            <Text style={{ color: "red", fontSize: 12 }}>
              Passwords do not match
            </Text>
          )}
        </View>
        <View>
          <TouchableOpacity
            className="bg-[#21252C] mt-6 w-[335px] h-16 justify-center items-center self-center rounded-lg"
            onPress={handleSignUp}
            disabled={signUpData.passwordMismatchError}
          >
            <Text className="self-center text-white text-center">Sign Up</Text>
          </TouchableOpacity>
        </View>
        <View className="flex-row justify-center items-center mt-6">
          <Text>Have an account?</Text>
          <Link href="/(authentication)/sign-in" asChild>
            <TouchableOpacity>
              <Text className="font-bold"> Sign In</Text>
            </TouchableOpacity>
          </Link>
        </View>
        <View className="flex-row items-center self-center my-6 w-[335px] h-5">
          <View className="flex-1 h-px bg-gray-300" />
          <Text className="mx-2.5 text-black">Or Sign up with</Text>
          <View className="flex-1 h-px bg-gray-300" />
        </View>
        <View className="flex-1  mb-16 ">
          <View className=" flex-row justify-around">
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
            <Link href="/profile" asChild>
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
    </ScrollView>
  );
}
