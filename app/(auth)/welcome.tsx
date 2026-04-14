import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import {
  Image,
  ImageBackground,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const RUNNER_IMAGE = require("../../assets/images/wel.jpg");

export default function WelcomeScreen() {
  const router = useRouter();

  const handleGoogleSignIn = () => {
    // Dummy Google sign‑in – just go to fitness connect
    router.push("https://gmail.com");
  };

  return (
    <ImageBackground
      source={typeof RUNNER_IMAGE === "string" ? { uri: RUNNER_IMAGE } : RUNNER_IMAGE}
      style={styles.background}
      resizeMode="cover"
    >
      <StatusBar style="light" />
      <View style={styles.gradientOverlay} />

      <View style={styles.content}>
        <View style={styles.brandBlock}>
          <Text style={styles.brandName}>Runverve</Text>
          <Text style={styles.tagline}>Beyond pace & miles</Text>
        </View>

        <View style={styles.actions}>
          <TouchableOpacity
            style={styles.signInBtn}
            onPress={() => router.push("/(auth)/signup")}
            activeOpacity={0.88}
          >
            <Text style={styles.signInText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.googleBtn}
            onPress={handleGoogleSignIn}
            activeOpacity={0.88}
          >
            <View style={styles.googleIconBox}>
              <Image
                source={{
                  uri: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
                }}
                style={{ width: 20, height: 20 }}
                resizeMode="contain"
              />
            </View>
            <Text style={styles.googleText}>Continue with Google</Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.footerLink}>Log In</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
    justifyContent: "flex-end",
  },
  gradientOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.3)", // Keeps text readable over bright images
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 52,
  },
  brandBlock: {
    marginBottom: 24,
    alignItems: "center",
  },
  brandName: {
    fontSize: 48,
    fontWeight: "900",
    color: "#E8272A",
    fontFamily: 'Archivo',
    letterSpacing: -0.5,
  },
  tagline: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "500",
    marginTop: 6,
  },
  actions: { gap: 14 },
  signInBtn: {
    backgroundColor: "#E8272A",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  signInText: {
    color: "#000000",
    fontSize: 17,
    fontWeight: "700",
    letterSpacing: 0.3,
  },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: "#E8272A",
    borderRadius: 14,
    paddingVertical: 16,
    backgroundColor: "rgba(254, 251, 251, 1)",
  },
  googleIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  googleText: { fontSize: 15, fontWeight: "600", color: "#FE0000" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 12,
  },
  footerText: {
    color: "rgb(255, 255, 255)",
    fontSize: 15,
  },
  footerLink: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
