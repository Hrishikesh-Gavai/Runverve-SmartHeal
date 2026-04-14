import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// Import local Strava logo from assets/images
const STRAVA_LOGO = require("../../assets/images/Strava.webp");

type AppItem = {
  id: string;
  name: string;
  logo: any;
  connected: boolean;
};

const FITNESS_APPS: AppItem[] = [
  {
    id: "strava",
    name: "Strava",
    logo: STRAVA_LOGO,
    connected: false,
  },
];

export default function ConnectFitnessApp() {
  const router = useRouter();
  const [apps, setApps] = useState<AppItem[]>(FITNESS_APPS);
  const [imageError, setImageError] = useState(false);

  const handleConnect = (id: string) => {
    const app = apps.find((a) => a.id === id);
    if (app && !app.connected) {
      router.push({
        pathname: "/(fitness)/authorize_connection",
        params: { appId: id, appName: app.name },
      });
    }
  };

  const handleBack = () => {
    // Navigate to welcome screen in auth folder
    router.push("/(auth)/welcome");
  };

  return (
    <ImageBackground
      source={{ uri: BACKGROUND_IMAGE }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.overlay}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity style={styles.backBtn} onPress={handleBack}>
                <Ionicons name="arrow-back" size={20} color="#000000" />
              </TouchableOpacity>
              <View style={styles.logoMark}>
                <Ionicons name="fitness-outline" size={26} color="#E8272A" />
              </View>
              <Text style={styles.title}>Connect a fitness app</Text>
              <Text style={styles.subtitle}>
                Sync your activities to track and enhance your progress
              </Text>
            </View>

            {/* App List */}
            <View style={styles.list}>
              {apps.map((app) => (
                <View key={app.id} style={styles.appCard}>
                  {/* Logo with black border */}
                  <View style={styles.logoWrapper}>
                    <Image
                      source={app.logo}
                      style={styles.logo}
                      resizeMode="contain"
                      onError={() => setImageError(true)}
                    />
                    {imageError && (
                      <View style={styles.fallbackIcon}>
                        <Ionicons
                          name="fitness-outline"
                          size={24}
                          color="#E8272A"
                        />
                      </View>
                    )}
                  </View>

                  {/* Name */}
                  <Text style={styles.appName}>{app.name}</Text>

                  {/* Connect button */}
                  <TouchableOpacity
                    style={[
                      styles.connectBtn,
                      app.connected && styles.connectBtnConnected,
                    ]}
                    onPress={() => handleConnect(app.id)}
                    activeOpacity={app.connected ? 1 : 0.8}
                    disabled={app.connected}
                  >
                    {app.connected && (
                      <Ionicons
                        name="checkmark"
                        size={14}
                        color="#E8272A"
                        style={{ marginRight: 4 }}
                      />
                    )}
                    <Text
                      style={[
                        styles.connectBtnText,
                        app.connected && styles.connectBtnTextConnected,
                      ]}
                    >
                      {app.connected ? "Connected" : "Connect"}
                    </Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>

            {/* Footer note + CTA */}
            <View style={styles.footer}>
              <Text style={styles.footerNote}>
                Connect a fitness app to track workouts, set goals, and compete
                with friends for added motivation.
              </Text>
              <TouchableOpacity
                style={styles.continueBtn}
                onPress={() => router.push("/(onboarding)/gender")}
                activeOpacity={0.88}
              >
                <Text style={styles.continueBtnText}>
                  Continue Without Connecting?
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingTop: 1,
    paddingBottom: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
    marginVertical: 10,
  },
  header: { marginBottom: 30 },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    backgroundColor: "#FAFAFA",
  },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#E8272A",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 15, color: "#000000", lineHeight: 22 },
  list: { gap: 12 },
  appCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FAFAFA",
    borderWidth: 1.5,
    borderColor: "#000000",
    borderRadius: 14,
    paddingVertical: 16,
    paddingHorizontal: 16,
    gap: 14,
  },
  logoWrapper: {
    width: 52,
    height: 52,
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5, // Increased from 1 to 1.5
    borderColor: "#000000", // Changed from "#E8E8E8" to "#000000"
    position: "relative",
  },
  logo: {
    width: 52,
    height: 52,
  },
  fallbackIcon: {
    position: "absolute",
    width: "100%",
    height: "100%",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },
  appName: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  connectBtn: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#E8272A",
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 18,
  },
  connectBtnConnected: {
    backgroundColor: "transparent",
  },
  connectBtnText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#E8272A",
  },
  connectBtnTextConnected: {
    color: "#E8272A",
  },
  footer: { gap: 16, marginTop: 20 },
  footerNote: {
    fontSize: 14,
    color: "#000000",
    lineHeight: 22,
  },
  continueBtn: {
    backgroundColor: "#E8272A",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  continueBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
