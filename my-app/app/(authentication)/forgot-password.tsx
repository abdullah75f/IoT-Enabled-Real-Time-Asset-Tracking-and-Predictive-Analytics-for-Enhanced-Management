import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useFonts, Inter_600SemiBold } from "@expo-google-fonts/inter";
import { scale, verticalScale } from "react-native-size-matters";
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
    <View style={styles.container}>
      <View style={styles.heading}>
        <Text
          style={{
            fontSize: 24,
            fontFamily: "Inter_600SemiBold",
          }}
        >
          Forgot Password?
        </Text>
        <Text style={styles.paragraph}>
          Enter your email address, and we will{" "}
          <Text style={styles.otpText}>send an OTP</Text>
        </Text>
      </View>
      <View style={styles.formContainer}>
        <Text>Email</Text>
        <TextInput
          placeholder="Enter email address"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          style={styles.textInput}
        />
        <Link href="/sign-up" asChild>
          <TouchableOpacity style={styles.TouchableOpacityContinue}>
            <Text style={styles.ContinueButton}>Continue</Text>
          </TouchableOpacity>
        </Link>
        <View style={styles.rememberedPassword}>
          <Text>Remembered password?</Text>
          <Link href="/sign-up" asChild>
            <TouchableOpacity>
              <Text style={styles.signInButton}> Sign in</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-start",
    paddingTop: verticalScale(94),
  },
  heading: {
    justifyContent: "center",
    alignItems: "center",
    width: 276,
    height: 82,
    alignSelf: "center",
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
    marginBottom: 20,
    paddingTop: 8,
    fontWeight: "100",
  },
  otpText: {
    fontSize: 16,
    lineHeight: 24,
    textAlign: "center",
  },
  formContainer: {
    marginHorizontal: 20,
    paddingTop: verticalScale(50),
    fontFamily: "Inter_700Bold",
    paddingLeft: scale(20),
    paddingRight: scale(20),
    fontSize: 16,
  },
  textInput: {
    borderRadius: 5,
    borderStyle: "solid",
    borderColor: "#D3D3D3",
    borderWidth: 0.5,
    padding: 10,
    marginVertical: 10,
    minHeight: 10,
  },
  TouchableOpacityContinue: {
    backgroundColor: "#21252C",
    marginTop: 24,
    width: 335,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 8,
  },
  ContinueButton: {
    alignSelf: "center",
    color: "white",
    textAlign: "center",
  },
  rememberedPassword: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },

  signInButton: {
    fontStyle: "normal",
    fontWeight: "bold",
  },
});
