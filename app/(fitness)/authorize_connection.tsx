import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  ActivityIndicator,
  Animated,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Linking,
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

const APP_META: Record<
  string,
  { name: string; url: string; logo: any; bgColor: string }
> = {
  strava: {
    name: "Strava",
    url: "https://www.strava.com/",
    logo: STRAVA_LOGO,
    bgColor: "#FC4C02", // Strava orange color
  },
};

export default function AuthorizeConnection() {
  const router = useRouter();
  const { appId } = useLocalSearchParams<{ appId: string }>();
  const [isAuthorizing, setIsAuthorizing] = useState(false);
  const [runverveImageError, setRunverveImageError] = useState(false);
  const [stravaImageError, setStravaImageError] = useState(false);

  // Animation values
  const [spinValue] = useState(new Animated.Value(0));

  const meta = APP_META[appId ?? "strava"] ?? APP_META["strava"];

  const startLoadingAnimation = () => {
    // Start spinning animation
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
    ).start();
  };

  const handleAuthorize = () => {
    setIsAuthorizing(true);
    startLoadingAnimation();

    // Simulate authorization process
    setTimeout(() => {
      // Navigate to connected success screen
      router.replace({
        pathname: "/(fitness)/connected_success",
        params: { appId, appName: meta.name },
      });
    }, 3000);
  };

  const handleCancel = () => {
    router.back();
  };

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

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
            {/* Header with back */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backBtn}
                onPress={handleCancel}
                disabled={isAuthorizing}
              >
                <Ionicons name="arrow-back" size={20} color="#000000" />
              </TouchableOpacity>
            </View>

            <View style={styles.content}>
              {/* Connected Apps Visualization */}
              <View style={styles.connectedAppsRow}>
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

                {/* Connection animation */}
                <View style={styles.connectionLine}>
                  <View style={styles.lineDot} />
                  <View style={[styles.lineSegment, { flex: 1 }]} />
                  {isAuthorizing ? (
                    <Animated.View style={{ transform: [{ rotate: spin }] }}>
                      <Ionicons name="sync" size={20} color="#E8272A" />
                    </Animated.View>
                  ) : (
                    <Ionicons name="link-outline" size={20} color="#000000" />
                  )}
                  <View style={[styles.lineSegment, { flex: 1 }]} />
                  <View style={styles.lineDot} />
                </View>

                {/* App icon */}
                <View
                  style={[styles.appIconBox, { backgroundColor: meta.bgColor }]}
                >
                  {!stravaImageError ? (
                    <Image
                      source={meta.logo}
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
              </View>

              {/* Auth title */}
              <Text style={styles.authTitle}>
                {isAuthorizing
                  ? "Connecting..."
                  : `Authorize Runverve to\nconnect to ${meta.name}`}
              </Text>

              {!isAuthorizing ? (
                <>
                  <View style={styles.divider} />

                  {/* App details block */}
                  <View style={styles.detailsBlock}>
                    <View style={styles.detailsHeader}>
                      <View
                        style={[
                          styles.detailLogoBox,
                          { backgroundColor: meta.bgColor },
                        ]}
                      >
                        {!stravaImageError ? (
                          <Image
                            source={meta.logo}
                            style={styles.detailLogo}
                            resizeMode="contain"
                          />
                        ) : (
                          <Ionicons
                            name="fitness-outline"
                            size={24}
                            color="#FFFFFF"
                          />
                        )}
                      </View>
                      <View style={styles.detailsText}>
                        <Text style={styles.detailsAppName}>
                          {meta.name} for Runverve
                        </Text>
                        <TouchableOpacity
                          onPress={() => Linking.openURL(meta.url)}
                        >
                          <Text style={styles.detailsUrl}>{meta.url}</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <Text style={styles.permissionsTitle}>
                      {meta.name} for Runverve will be able to:
                    </Text>

                    {[
                      "Access your profile and activities data",
                      "Upload activities for you and edit your profile",
                    ].map((item, i) => (
                      <View key={i} style={styles.permissionRow}>
                        <View style={styles.bullet} />
                        <Text style={styles.permissionText}>{item}</Text>
                      </View>
                    ))}
                  </View>
                </>
              ) : (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#E8272A" />
                  <Text style={styles.loadingText}>
                    Please wait while we securely connect to {meta.name}...
                  </Text>
                  <View style={styles.securityNote}>
                    <Ionicons
                      name="shield-checkmark-outline"
                      size={16}
                      color="#000000"
                    />
                    <Text style={styles.securityText}>
                      Establishing secure connection
                    </Text>
                  </View>
                </View>
              )}

              {/* Action buttons */}
              {!isAuthorizing && (
                <View style={styles.actions}>
                  <TouchableOpacity
                    style={styles.authorizeBtn}
                    onPress={handleAuthorize}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.authorizeBtnText}>Authorize</Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.cancelBtn}
                    onPress={handleCancel}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.cancelBtnText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}

              {/* Terms note */}
              {!isAuthorizing && (
                <Text style={styles.termsNote}>
                  By authorizing an application you continue to operate under
                  our{" "}
                  <Text
                    style={styles.termsLink}
                    onPress={() =>
                      Linking.openURL("https://www.strava.com/legal/terms")
                    }
                  >
                    Terms of service.
                  </Text>
                </Text>
              )}
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
  header: { marginBottom: 10 },
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
  authTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#E8272A",
    textAlign: "center",
    lineHeight: 34,
    marginBottom: 24,
    letterSpacing: -0.3,
  },
  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#000000",
    marginBottom: 28,
  },
  detailsBlock: { width: "100%", gap: 12 },
  detailsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 8,
  },
  detailLogoBox: {
    width: 52,
    height: 52,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "#000000",
    overflow: "hidden",
  },
  detailLogo: { width: 52, height: 52 },
  detailsText: { gap: 3, flex: 1 },
  detailsAppName: { fontSize: 15, fontWeight: "700", color: "#000000" },
  detailsUrl: {
    fontSize: 13,
    color: "#E8272A",
    textDecorationLine: "underline",
  },
  permissionsTitle: {
    fontSize: 14,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  permissionRow: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  bullet: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: "#000000",
    marginTop: 7,
    flexShrink: 0,
  },
  permissionText: { flex: 1, fontSize: 14, color: "#000000", lineHeight: 21 },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 30,
    gap: 16,
  },
  loadingText: {
    fontSize: 15,
    color: "#000000",
    textAlign: "center",
    lineHeight: 22,
  },
  securityNote: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: "#000000",
  },
  securityText: {
    fontSize: 12,
    color: "#000000",
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
    marginVertical: 18,
  },
  authorizeBtn: {
    flex: 1,
    backgroundColor: "#E8272A",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    justifyContent: "center",
  },
  authorizeBtnText: { color: "#ffffff", fontSize: 16, fontWeight: "700" },
  cancelBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#000000",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    backgroundColor: "#FAFAFA",
  },
  cancelBtnText: { color: "#000000", fontSize: 16, fontWeight: "700" },
  termsNote: {
    fontSize: 12,
    color: "#000000",
    textAlign: "center",
    lineHeight: 18,
    paddingHorizontal: 8,
  },
  termsLink: {
    color: "#E8272A",
    textDecorationLine: "underline",
    fontWeight: "600",
  },
});
