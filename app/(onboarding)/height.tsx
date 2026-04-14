import Slider from "@react-native-community/slider";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const MIN_HEIGHT = 100; // cm
const MAX_HEIGHT = 300; // cm
const DEFAULT_HEIGHT = 168;

function cmToFeetInches(cm: number): string {
  const totalInches = cm / 2.54;
  const feet = Math.floor(totalInches / 12);
  const inches = Math.round(totalInches % 12);
  return `${feet}" ${inches} inches`;
}

export default function HeightScreen() {
  const router = useRouter();
  const [heightCm, setHeightCm] = useState(DEFAULT_HEIGHT);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>What is your height ?</Text>
          <Text style={styles.subtitle}>
            We would like to have the following information to provide more
            accurate results.
          </Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/7404/7404126.png",
            }}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* CM bubble */}
        <View style={styles.bubbleContainer}>
          <View style={styles.bubble}>
            <Text style={styles.bubbleText}>{Math.round(heightCm)} CM</Text>
          </View>
          <View style={styles.bubbleTail} />
        </View>

        {/* Slider */}
        <View style={styles.sliderWrapper}>
          <Slider
            style={styles.slider}
            minimumValue={MIN_HEIGHT}
            maximumValue={MAX_HEIGHT}
            value={heightCm}
            onValueChange={(v) => setHeightCm(v)}
            minimumTrackTintColor="#E8272A"
            maximumTrackTintColor="#E0E0E0"
            thumbTintColor="#E8272A"
            step={1}
          />
        </View>

        {/* ft/in display box */}
        <View style={styles.displayBox}>
          <Text style={styles.displayText}>{cmToFeetInches(heightCm)}</Text>
        </View>

        <View style={{ flex: 1 }} />

        {/* Nav */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.prevBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.prevBtnText}>Previous</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.continueBtn}
            onPress={() => router.push("/(onboarding)/weight")}
            activeOpacity={0.88}
          >
            <Text style={styles.continueBtnText}>Continue</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 36,
  },
  header: { marginBottom: 24 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 14, color: "#888", lineHeight: 22 },

  illustrationContainer: { alignItems: "center", marginBottom: 16 },
  illustration: { width: 180, height: 160 },

  bubbleContainer: {
    alignItems: "center",
    marginBottom: 2,
  },
  bubble: {
    backgroundColor: "#000000",
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 22,
  },
  bubbleText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  bubbleTail: {
    width: 0,
    height: 0,
    borderLeftWidth: 7,
    borderRightWidth: 7,
    borderTopWidth: 8,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderTopColor: "#000000",
    marginTop: -1,
  },

  sliderWrapper: {
    marginTop: 8,
    marginBottom: 16,
  },
  slider: {
    width: "100%",
    height: 40,
  },

  displayBox: {
    backgroundColor: "#000000",
    borderRadius: 14,
    paddingVertical: 22,
    alignItems: "center",
  },
  displayText: { fontSize: 18, fontWeight: "600", color: "#ffffff" },

  navRow: { flexDirection: "row", gap: 12 },
  prevBtn: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: "#E8272A",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  prevBtnText: { color: "#E8272A", fontSize: 16, fontWeight: "700" },
  continueBtn: {
    flex: 1,
    backgroundColor: "#E8272A",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  continueBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
