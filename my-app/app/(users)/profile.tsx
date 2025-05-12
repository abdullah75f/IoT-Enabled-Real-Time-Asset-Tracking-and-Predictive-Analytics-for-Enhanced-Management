import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  Image,
  ScrollView,
  Alert,
  Linking,
} from "react-native";
import { AntDesign, FontAwesome } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import Footer from "@/components/footer";
import { useDispatch, useSelector } from "react-redux";
import {
  clearSignInState,
  setSignInData,
  updateProfilePicture,
} from "@/store/slices/signInSlices";
import { fetchUserProfile, uploadProfilePicture } from "@/app/apiService/api";
import * as Location from "expo-location";
import { router } from "expo-router";

export default function Profile() {
  const dispatch = useDispatch();
  const signInData = useSelector((state: any) => state.signIn.user);
  const jwtToken = useSelector((state: any) => state.signIn.jwtToken);

  const [currentPosition, setCurrentPosition] = useState("");
  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);
  const [googleMapsLink, setGoogleMapsLink] = useState<string | null>(null);
  const [countryCode, setCountryCode] = useState("Code");
  const [expanded, setExpanded] = useState(false);
  const [profilePicture, setProfilePicture] = useState<string | null>(null);
  const isAuthenticated = useSelector(
    (state: any) => state.signIn.isAuthenticated
  );

  const toggleExpanded = useCallback(() => setExpanded(!expanded), [expanded]);

  const items = [
    { label: "Select code", value: undefined },
    { label: "+251", value: "+251" },
    { label: "+1", value: "+1" },
    { label: "+44", value: "+44", key: "key_3" },
    { label: "+91", value: "+91", key: "key_4" },
  ];

  // Fetch profile data when component mounts or when navigating back
  useEffect(() => {
    const fetchProfile = async () => {
      if (isAuthenticated && jwtToken) {
        try {
          const userData = await fetchUserProfile();
          dispatch(setSignInData({ user: userData, jwtToken }));
          setProfilePicture(userData.profilePicture);
        } catch (error) {
          console.error("(NOBRIDGE) LOG Fetch Profile Error:", error);
          Alert.alert("Error", "Failed to load profile data.");
        }
      }
    };
    fetchProfile();
  }, [isAuthenticated, jwtToken, dispatch]);

  // Fetch device's current location
  useEffect(() => {
    const getLocation = async () => {
      try {
        // Request location permissions
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Denied",
            "Location permission is required to fetch your current position."
          );
          setCurrentPosition("Permission denied");
          return;
        }

        // Fetch the current location
        const location = await Location.getCurrentPositionAsync({
          accuracy: Location.Accuracy.High,
        });

        const { latitude: lat, longitude: lon } = location.coords;
        // Store latitude and longitude separately
        setLatitude(lat);
        setLongitude(lon);
        // Format the location as "Latitude, Longitude"
        setCurrentPosition(`${lat.toFixed(5)}, ${lon.toFixed(5)}`);
        // Generate Google Maps URL
        setGoogleMapsLink(`https://www.google.com/maps?q=${lat},${lon}`);
      } catch (error) {
        console.error("(NOBRIDGE) LOG Location Error:", error);
        Alert.alert("Error", "Failed to fetch current location.");
        setCurrentPosition("Unable to fetch location");
        setGoogleMapsLink(null);
      }
    };

    getLocation();
  }, []);

  // Function to open the Google Maps link
  const openGoogleMaps = async () => {
    if (googleMapsLink) {
      try {
        const supported = await Linking.canOpenURL(googleMapsLink);
        if (supported) {
          await Linking.openURL(googleMapsLink);
        } else {
          Alert.alert("Error", "Unable to open Google Maps.");
        }
      } catch (error) {
        console.error("(NOBRIDGE) LOG Open URL Error:", error);
        Alert.alert("Error", "Failed to open Google Maps.");
      }
    }
  };

  const selectProfilePicture = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert("Error", "Permission to access camera roll is required!");
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
      const fileName = `profile_picture_${signInData.userId}.${fileExtension}`;
      formData.append("file", {
        uri,
        name: fileName,
        type: `image/${fileExtension}`,
      } as any);

      formData.append("userId", signInData.userId);

      const response = await uploadProfilePicture(formData);
      const newProfilePictureUrl = response.profilePicture;
      dispatch(updateProfilePicture(newProfilePictureUrl));
      setProfilePicture(newProfilePictureUrl); // Update local state      Alert.alert("Success", "Profile picture uploaded successfully!");
    } catch (error) {
      console.error("(NOBRIDGE) LOG Upload Error:", error);
      Alert.alert("Error", "Failed to upload profile picture.");
      setProfilePicture(signInData.profilePicture); // Revert to previous on error
    }
  };
  // Single function to calculate dynamic width based on text length
  const getTextWidth = (text: string | null) => {
    if (!text) return 100; // Minimum width if empty
    const baseWidth = 10; // Base padding
    const charWidth = 8; // Approximate width per character (adjust as needed)
    return baseWidth + text.length * charWidth;
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
                    value={signInData.firstName || ""}
                    editable={false}
                    placeholder="Enter your first name"
                    className="rounded border border-gray-300 border-solid p-2 my-2"
                  />
                </View>
                <View className="mb-4">
                  <Text className="font-semibold">Last Name</Text>
                  <TextInput
                    value={signInData.lastName || ""}
                    editable={false}
                    placeholder="Enter your last name"
                    className="rounded border border-gray-300 border-solid p-2 my-2"
                  />
                </View>
              </View>

              <TouchableOpacity onPress={selectProfilePicture} className="ml-6">
                {profilePicture || signInData.profilePicture ? (
                  <Image
                    source={{
                      uri: profilePicture || signInData.profilePicture,
                    }}
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
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 4,
                  padding: 8,
                  marginVertical: 4,
                  width: getTextWidth(signInData.email),
                }}
              >
                {signInData.email || "Enter your email"}
              </Text>
            </View>
            <View className="mb-4">
              <Text className="font-semibold">Gender</Text>
              <TextInput
                value={signInData.gender || ""}
                editable={false}
                placeholder="Enter your Gender"
                className="rounded border border-gray-300  border-solid p-2 my-2 min-h-[10px] w-1/2"
              />
            </View>
            <View className="mb-4">
              <Text className="font-semibold">Age</Text>
              <TextInput
                value={signInData.age || ""}
                editable={false}
                placeholder="Enter your Age"
                className="rounded border border-gray-300  border-solid p-2 my-2 min-h-[10px] w-1/2"
              />
            </View>

            <View className="mb-4">
              <Text className="font-semibold">Address</Text>
              <Text
                style={{
                  borderWidth: 1,
                  borderColor: "#D1D5DB",
                  borderRadius: 4,
                  padding: 8,
                  marginVertical: 4,
                  width: getTextWidth(signInData.address),
                }}
              >
                {signInData.address || "Enter your Address"}
              </Text>
            </View>

            <View className="mb-4">
              <Text className="font-semibold">Current position</Text>
              <TextInput
                value={currentPosition}
                editable={false}
                placeholder="Fetching location..."
                className="rounded border border-gray-300  border-solid p-2 my-2 min-h-[10px] w-1/2"
              />
              {googleMapsLink && (
                <TouchableOpacity onPress={openGoogleMaps}>
                  <Text className="underline mt-1 font-semibold">
                    {" "}
                    View on Google Maps
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <View className="mb-10">
              <Text className="font-semibold">Phone Number</Text>
              <View className="flex-row justify-between items-center">
                <TextInput
                  editable={false}
                  placeholder="+251"
                  className="flex-row justify-between border border-gray-300 p-2 w-[70]"
                />
                <TextInput
                  value={signInData.phoneNumber || ""}
                  editable={false}
                  placeholder=" your phone number"
                  className="rounded border border-gray-300  border-solid p-2 my-2 min-h-[10px] w-3/5"
                />
              </View>
            </View>
            <View className="mb-4">
              <Text className="font-semibold">Last Updated:</Text>
              <TextInput
                value={signInData.lastUpdatedAt || ""}
                editable={false}
                placeholder=""
                className="rounded border border-gray-300 border-solid p-2 my-2"
              />
            </View>

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
            </View>
          </View>
        </View>
      </ScrollView>
      <Footer />
    </View>
  );
}
