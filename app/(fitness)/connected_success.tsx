import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
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

// Import local images
const RUNVERVE_LOGO = require("../../assets/images/Runverve.jpg");
const STRAVA_LOGO = require("../../assets/images/Strava.webp");

const APP_META: Record<string, { name: string; logo: any; bgColor: string }> = {
  strava: {
    name: "Strava",
    logo: STRAVA_LOGO,
    bgColor: "#FC4C02", // Strava orange color
  },
};

export default function ConnectedSuccess() {
  const router = useRouter();
  const { appId, appName } = useLocalSearchParams<{
    appId?: string;
    appName?: string;
  }>();

  const [runverveImageError, setRunverveImageError] = useState(false);
  const [stravaImageError, setStravaImageError] = useState(false);

  // Animation values
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  const meta = appId ? APP_META[appId] : null;
  const displayName = appName || meta?.name || "Strava";
  const displayLogo = meta?.logo || STRAVA_LOGO;
  const displayBgColor = meta?.bgColor || "#FC4C02";

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 3,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.spring(slideAnim, {
        toValue: 0,
        tension: 50,
        friction: 5,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

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
            {/* Header with back button */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={() => router.back()}
              >
                <Ionicons name="arrow-back" size={20} color="#000000" />
              </TouchableOpacity>
            </View>

            <Animated.View
              style={[
                styles.content,
                {
                  opacity: fadeAnim,
                  transform: [{ translateY: slideAnim }],
                },
              ]}
            >
              {/* Connected Apps Visualization */}
              <Animated.View
                style={[
                  styles.connectedAppsRow,
                  { transform: [{ scale: scaleAnim }] },
                ]}
              >
                {/* Runverve icon */}
                <View style={styles.runverveIconBox}>
                  {!runverveImageError ? (
                    <Image
                      source={RUNVERVE_LOGO}
                      style={styles.runverveIcon}
                      resizeMode="cover"
                      onError={() => setRunverveImageError(true)}
                    />
                  ) : (
                    <Ionicons name="flash" size={32} color="#E8272A" />
                  )}
                </View>

                {/* Connection line with checkmark */}
                <View style={styles.connectionLine}>
                  <View style={styles.lineDot} />
                  <View style={[styles.lineSegment, { flex: 1 }]} />
                  <View style={styles.checkCircle}>
                    <Ionicons name="checkmark" size={14} color="#ffffff" />
                  </View>
                  <View style={[styles.lineSegment, { flex: 1 }]} />
                  <View style={styles.lineDot} />
                </View>

                {/* App icon */}
                <View
                  style={[
                    styles.appIconBox,
                    { backgroundColor: displayBgColor },
                  ]}
                >
                  {!stravaImageError ? (
                    <Image
                      source={displayLogo}
                      style={styles.appIcon}
                      resizeMode="contain"
                      onError={() => setStravaImageError(true)}
                    />
                  ) : (
                    <Ionicons
                      name="fitness-outline"
                      size={32}
                      color="#FFFFFF"
                    />
                  )}
                </View>
              </Animated.View>

              {/* Success Message */}
              <Text style={styles.title}>Successfully Connected!</Text>
              <Text style={styles.subtitle}>
                Your {displayName} account has been linked to Runverve. Your
                activities will now sync automatically.
              </Text>

              {/* Feature chips */}
              <View style={styles.features}>
                {[
                  {
                    icon: "sync-outline" as const,
                    label: "Auto-sync activities",
                  },
                  {
                    icon: "bar-chart-outline" as const,
                    label: "Track your progress",
                  },
                  {
                    icon: "trophy-outline" as const,
                    label: "Compete with friends",
                  },
                ].map((f, i) => (
                  <View key={i} style={styles.featureRow}>
                    <View style={styles.featureIconBox}>
                      <Ionicons name={f.icon} size={18} color="#E8272A" />
                    </View>
                    <Text style={styles.featureLabel}>{f.label}</Text>
                  </View>
                ))}
              </View>

              {/* Action Buttons */}
              <View style={styles.actions}>
                <TouchableOpacity
                  style={styles.continueBtn}
                  onPress={() => router.push("/(onboarding)/gender")}
                  activeOpacity={0.88}
                >
                  <Text style={styles.continueBtnText}>
                    Continue to Onboarding
                  </Text>
                  <Ionicons name="arrow-forward" size={18} color="#ffffff" />
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.connectMoreBtn}
                  onPress={() => router.push("/(fitness)/connect_fitness_app")}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="add-circle-outline"
                    size={18}
                    color="#E8272A"
                  />
                  <Text style={styles.connectMoreText}>
                    Connect another app
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Success note */}
              <Text style={styles.successNote}>
                Your workouts and activities will now appear in your feed
              </Text>
            </Animated.View>
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
  header: {
    marginBottom: 10,
  },
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FAFAFA",
  },
  content: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "transparent",
    borderRadius: 30,
    padding: 30,
    width: "100%",
    alignItems: "center",
  },
  connectedAppsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    width: "100%",
    paddingHorizontal: 10,
  },
  runverveIconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#000000",
    overflow: "hidden",
  },
  runverveIcon: {
    width: 64,
    height: 64,
  },
  connectionLine: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 8,
    gap: 4,
  },
  lineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#E8272A",
  },
  lineSegment: {
    height: 2,
    backgroundColor: "#000000",
  },
  checkCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#E8272A",
    alignItems: "center",
    justifyContent: "center",
  },
  appIconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#000000",
    overflow: "hidden",
  },
  appIcon: {
    width: 64,
    height: 64,
  },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#E8272A",
    textAlign: "center",
    marginBottom: 12,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 15,
    color: "#000000",
    textAlign: "center",
    lineHeight: 23,
    marginBottom: 32,
  },
  features: {
    width: "100%",
    gap: 12,
    marginBottom: 32,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: "#FAFAFA",
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderWidth: 1.5,
    borderColor: "#000000",
  },
  featureIconBox: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
  },
  featureLabel: {
    fontSize: 15,
    fontWeight: "600",
    color: "#000000",
    flex: 1,
  },
  actions: {
    width: "100%",
    gap: 12,
    marginBottom: 16,
  },
  continueBtn: {
    flexDirection: "row",
    backgroundColor: "#E8272A",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  continueBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  connectMoreBtn: {
    backgroundColor: "#000000",
    borderRadius: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    gap: 8,
  },
  connectMoreText: {
    color: "#E8272A",
    fontSize: 15,
    fontWeight: "600",
  },
  successNote: {
    fontSize: 12,
    color: "#000000",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 8,
    fontStyle: "italic",
  },
});
