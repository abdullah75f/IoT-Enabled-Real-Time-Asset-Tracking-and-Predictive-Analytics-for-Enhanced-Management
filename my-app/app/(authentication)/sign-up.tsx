import { Link } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  ActivityIndicator,
} from "react-native";
import {
  setFirstName,
  setLastName,
  setEmail,
  setPhoneNumber,
  setGender,
  setAge,
  setPassword,
  setConfirmPassword,
  setSelectedOption,
} from "@/store/slices/signUpSlice";
import { useDispatch, useSelector } from "react-redux";
import { useFonts } from "expo-font";
import { Inter_400Regular, Inter_700Bold } from "@expo-google-fonts/inter";
import { useEffect } from "react";

export default function SignUp() {
  const dispatch = useDispatch();
  const signUpData = useSelector((state: any) => state.signUp);
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
            <View className="flex-row justify-around mt-4">
              <TouchableOpacity
                className={`border p-2 rounded ${
                  signUpData.selectedOption === "email" ? "bg-gray-300" : ""
                }  `}
                onPress={() => dispatch(setSelectedOption("email"))}
              >
                <Text>Email</Text>
              </TouchableOpacity>
              <TouchableOpacity
                className={`border p-2 rounded ${
                  signUpData.selectedOption === "phone" ? "bg-gray-300" : ""
                }`}
                onPress={() => dispatch(setSelectedOption("phone"))}
              >
                <Text>Phone number</Text>
              </TouchableOpacity>
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
          <View className=" pt-4">
            <Text>Gender</Text>
            <View className="flex-row justify-around mt-2">
              <View className="flex-row items-center">
                <TouchableOpacity
                  className={`border p-2 rounded mr-3 ${
                    signUpData.gender === "male" ? "bg-gray-300" : ""
                  }`}
                  onPress={() => dispatch(setGender("male"))}
                ></TouchableOpacity>
                <Text>Male</Text>
              </View>
              <View className="flex-row items-center">
                <TouchableOpacity
                  className={`border p-2 rounded mr-3  ${
                    signUpData.gender === "female" ? "bg-gray-300" : ""
                  }`}
                  onPress={() => dispatch(setGender("female"))}
                ></TouchableOpacity>
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
          <Text className="pb-2">Password</Text>
          <TextInput
            value={signUpData.password}
            onChangeText={(text) => dispatch(setPassword(text))}
            placeholder="Enter your password"
            secureTextEntry
            className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
          />
          <Text className="pb-2 pt-5">Confirm Password</Text>
          <TextInput
            value={signUpData.confirmPassword}
            onChangeText={(text) => dispatch(setConfirmPassword(text))}
            placeholder="Enter your password"
            secureTextEntry
            className="rounded border border-gray-300 border-solid p-2 my-2 min-h-[10px]"
          />
        </View>
        <View>
          <Link href="/sign-up" asChild>
            <TouchableOpacity className="bg-[#21252C] mt-6 w-[335px] h-16 justify-center items-center self-center rounded-lg">
              <Text className="self-center text-white text-center">
                Sign In
              </Text>
            </TouchableOpacity>
          </Link>
        </View>
        <View className="flex-row justify-center items-center mt-6">
          <Text>Have an account?</Text>
          <Link href="/" asChild>
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
            <Link href="/sign-up" asChild>
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
