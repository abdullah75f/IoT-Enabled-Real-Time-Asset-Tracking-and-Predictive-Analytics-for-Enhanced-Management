import React, { useCallback, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Alert,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Footer from "@/components/footer";
import { useDispatch, useSelector } from "react-redux";
import { clearSignInState } from "@/store/slices/signInSlices";
import { uploadProfilePicture } from "@/app/apiService/api";
import { router } from "expo-router";
export default function Profile() {
  const dispatch = useDispatch();
  const signUpData = useSelector((state: any) => state.signUp);

  // const [editedSignUpData, setEditedSignUpData] = useState({
  //   firstName: signUpData.firstName,
  //   lastName: signUpData.lastName,
  //   email: signUpData.email,
  //   phoneNumber: signUpData.phoneNumber,
  //   gender: signUpData.gender,
  //   age: signUpData.age,
  //   address: signUpData.address,
  //   password: signUpData.password,
  //   confirmPassword: signUpData.confirmPassword,
  //   selectedOption: signUpData.selectedOption,
  // });

  const [currentPosition, setCurrentPosition] = useState(""); // it will be removed

  const [countryCode, setCountryCode] = useState("Code");
  const [expanded, setExpanded] = useState(false);

  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

  const items = [
    { label: "Select code", value: undefined },
    { label: "+251", value: "+251" },
    { label: "+1", value: "+1" },
    { label: "+44", value: "+44", key: "key_3" },
    { label: "+91", value: "+91", key: "key_4" },
  ];

  const selectProfilePicture = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      setProfilePicture(imageUri);
      uploadPicture(imageUri);
    }
  };

  const uploadPicture = async (uri: string) => {
    try {
      const formData = new FormData();
      const fileExtension = uri.split(".").pop();
      const fileName = `profile_picture.${fileExtension}`;
      formData.append("file", {
        uri,
        name: fileName,
        type: `image/${fileExtension}`,
      } as any);
      console.log("signUpData.id:", signUpData.id); // Check the value of userId

      formData.append("userId", signUpData.id);
      console.log("Form Data:", formData); // Debug form data to check the userId

      const response = await uploadProfilePicture(formData);
      Alert.alert("Success", "Profile picture uploaded successfully!");
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      Alert.alert("Error", "Failed to upload profile picture.");
    }
  };

  return (
    <View className="flex-1 ">
      <ScrollView contentContainerStyle={{ flexGrow: 1, paddingBottom: 80 }}>
        <View className="flex-1 ">
          <View className="justify-center items-center">
            <Text className="font-semibold text-lg">Account</Text>
            <View className="w-11/12 mt-1 relative">
              <View
                className="absolute top-0 w-full h-0.5"
                style={{ backgroundColor: "#D0D3D9" }}
              ></View>
              <View
                className="absolute top-0 self-center w-24 h-1 "
                style={{ backgroundColor: "#000000" }}
              ></View>
            </View>
          </View>

          <View className="top-10 mx-6  px-6 font-bold text-base flex-grow">
            <View className="flex flex-row justify-between items-start">
              <View className="flex flex-col flex-1">
                <View className="mb-4">
                  <Text className="font-semibold">First Name</Text>
                  <TextInput
                    value={signUpData.firstName}
                    editable={false}
                    placeholder="Enter your first name"
                    className="rounded border border-gray-300 border-solid p-2 my-2"
                  />
                </View>
                <View className="mb-4">
                  <Text className="font-semibold">Last Name</Text>
                  <TextInput
                    value={signUpData.lastName}
                    editable={false}
                    placeholder="Enter your last name"
                    className="rounded border border-gray-300 border-solid p-2 my-2"
                  />
                </View>
              </View>

              <TouchableOpacity onPress={selectProfilePicture} className="ml-6">
                {profilePicture ? (
                  <Image
                    source={{ uri: profilePicture }}
                    className="w-24 h-24 rounded-full"
                  />
                ) : (
                  <View className="w-[135px] h-[120.19px] justify-center rounded-2xl items-center  border border-dashed border-gray-400">
                    <Image
                      source={require("../../assets/images/profileIcon.jpg")}
                      className="w-[52.23px] h-[51.1px]"
                    />
                  </View>
                )}
                <Text className="self-center mt-2">Add profile photo +</Text>
              </TouchableOpacity>
            </View>
            <View className="mb-4">
              <Text className="font-semibold">Email</Text>
              <TextInput
                value={signUpData.email}
                editable={false}
                placeholder="Enter your email"
                className="rounded border border-gray-300  border-solid p-2 my-2 min-h-[10px] w-1/2"
              />
            </View>
            <View className="mb-4">
              <Text className="font-semibold">Gender</Text>
              <TextInput
                value={signUpData.gender}
                editable={false}
                placeholder="Enter your Gender"
                className="rounded border border-gray-300  border-solid p-2 my-2 min-h-[10px] w-1/2"
              />
            </View>
            <View className="mb-4">
              <Text className="font-semibold">Age</Text>
              <TextInput
                value={signUpData.age}
                editable={false}
                placeholder="Enter your Age"
                className="rounded border border-gray-300  border-solid p-2 my-2 min-h-[10px] w-1/2"
              />
            </View>

            <View className="mb-4">
              <Text className="font-semibold">Address</Text>
              <TextInput
                value={signUpData.address}
                editable={false}
                placeholder="Enter your Address"
                className="rounded border border-gray-300  border-solid p-2 my-2 min-h-[10px] w-1/2"
              />
            </View>

            <View className="mb-4">
              <Text className="font-semibold">Current position</Text>
              <TextInput
                value={currentPosition}
                onChangeText={setCurrentPosition}
                placeholder="Enter your current position"
                className="rounded border border-gray-300  border-solid p-2 my-2 min-h-[10px] w-1/2"
              />
            </View>

            <View className="mb-10">
              <Text className="font-semibold">Phone Number</Text>
              <View className="flex-row justify-between items-center">
                {/* <TouchableOpacity
                  onPress={toggleExpanded}
                  className=" flex-row justify-between border border-gray-300 p-2 w-30 "
                  activeOpacity={0.8}
                >
                  <Text>{countryCode}</Text>
                  <AntDesign
                    name={expanded ? "caretup" : "caretdown"}
                    className="px-1"
                  />
                </TouchableOpacity>
                {expanded ? (
                  <View className="absolute top-[40px] w-[250px] p-2.5 ">
                    <FlatList
                      keyExtractor={(item) => item.label}
                      data={[
                        { label: "Select code", value: "Select code" },
                        { label: "+251", value: "+251" },
                        { label: "+1", value: "+1" },
                      ]}
                      renderItem={({ item }) => (
                        <TouchableOpacity
                          onPress={() => {
                            setCountryCode(item.value);
                            toggleExpanded();
                          }}
                          className="mb-2 border border-gray-300 w-28 p-1"
                          activeOpacity={0.8}
                        >
                          <Text>{item.value}</Text>
                        </TouchableOpacity>
                      )}
                    />
                  </View>
                ) : null} */}
                <TextInput
                  editable={false}
                  placeholder="+251"
                  className="flex-row justify-between border border-gray-300 p-2 w-[70]"
                />
                <TextInput
                  value={signUpData.phoneNumber}
                  editable={false}
                  placeholder=" your phone number"
                  className="rounded border border-gray-300  border-solid p-2 my-2 min-h-[10px] w-3/5"
                />
              </View>
            </View>
            <Text className="font-semibold mb-7">Last Updated:</Text>
            {/* the above will be displayed from the backend */}
            <View className="flex-1 flex-row justify-between m">
              <TouchableOpacity
                onPress={() => {
                  dispatch(clearSignInState());
                  Alert.alert(
                    "Success",
                    "You are logged out!",
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
                }}
                className="flex-row items-start ml-0 "
              >
                <FontAwesome name="sign-out" size={24} color="black" />
                <Text className="text-red-500 font-bold text-2xl ml-2">
                  Log Out
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity
                onPress={handleSave}
                className="flex-row items-start ml-0"
              >
                <FontAwesome name="save" size={24} color="black" />
                <Text className="text-green-500 font-bold text-2xl ml-2">
                  Save
                </Text>
              </TouchableOpacity> */}
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}
