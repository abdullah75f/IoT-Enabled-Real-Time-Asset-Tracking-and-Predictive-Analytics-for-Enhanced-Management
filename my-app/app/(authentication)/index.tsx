import {
  useFonts,
  Inter_400Regular,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import { Link } from "expo-router";
import { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Image,
} from "react-native";
import { scale, verticalScale, moderateScale } from "react-native-size-matters";

export default function SignUp() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_700Bold,
  });
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.signInHeader}>Sign In</Text>
      <View style={styles.formContainer}>
        <Text>Email</Text>
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
          style={styles.textInput}
        />
        <Text>Password</Text>
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Enter your password"
          secureTextEntry
          style={styles.textInput}
        />
        <Link href="/forgot-password" asChild>
          <TouchableOpacity>
            <Text style={styles.TouchableOpacityForgotText}>
              Forgot password?
            </Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View>
        <Link href="/sign-up" asChild>
          <TouchableOpacity style={styles.TouchableOpacitySignIn}>
            <Text style={styles.signInButton}>Sign In</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.noAccount}>
        <Text>Don't have an account?</Text>
        <Link href="/sign-up" asChild>
          <TouchableOpacity>
            <Text style={styles.createAccountButton}> Create Account</Text>
          </TouchableOpacity>
        </Link>
      </View>
      <View style={styles.orSignInContainer}>
        <View style={styles.line} />
        <Text style={styles.orSignInText}>Or Sign in with</Text>
        <View style={styles.line} />
      </View>
      <View style={styles.linkOptions}>
        <View style={styles.linkOptionsUpper}>
          <Link href="/sign-up" asChild>
            <TouchableOpacity style={styles.linkOptionsGoogleApple}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/images/google-logo.png")}
                  style={{ width: 20, height: 20 }}
                />
                <Text style={styles.logoText}>Google</Text>
              </View>
            </TouchableOpacity>
          </Link>
          <Link href="/sign-up" asChild>
            <TouchableOpacity style={styles.linkOptionsGoogleApple}>
              <View style={styles.logoContainer}>
                <Image
                  source={require("../../assets/images/apple-logo.png")}
                  style={{
                    width: 20,
                    height: 20,
                    backgroundColor: "transparent",
                  }}
                />
                <Text style={styles.logoText}>Apple</Text>
              </View>
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
  signInHeader: {
    color: "black",
    alignSelf: "center",
    fontFamily: "Inter_700Bold",
    fontSize: 34,
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
  TouchableOpacityForgotText: {
    color: "black",
    alignSelf: "flex-end",
  },
  signInButton: {
    alignSelf: "center",
    color: "white",
    textAlign: "center",
  },
  TouchableOpacitySignIn: {
    backgroundColor: "#21252C",
    marginTop: 24,
    width: 335,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderRadius: 8,
  },
  noAccount: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  createAccountButton: {
    fontStyle: "normal",
    fontWeight: "bold",
  },
  orSignInContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
    marginVertical: 20,
    width: 335,
    height: 20,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#D3D3D3",
  },
  orSignInText: {
    marginHorizontal: 10,
    color: "black",
  },
  linkOptions: {
    flex: 1,
  },
  linkOptionsUpper: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  linkOptionsBottom: {
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    borderWidth: 1,
    borderRadius: 16,
    marginTop: 20,
    width: 160,
    height: 56,
  },
  linkOptionsGoogleApple: {
    borderWidth: 1,
    borderRadius: 16,
    width: 160,
    height: 56,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 16,
    color: "black",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
});
