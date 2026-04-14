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

function formatDate(date: Date): string {
  const m = date.getMonth() + 1;
  const d = date.getDate();
  const y = date.getFullYear();
  return `${m}/${d}/${y}`;
}

export default function DOBScreen() {
  const router = useRouter();
  // Default shown as unset; user taps box to pick
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const handleBoxPress = () => {
    router.push("/(onboarding)/calendar");
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>When is your Birthday?</Text>
          <Text style={styles.subtitle}>
            We would like to have the following information to provide more
            accurate results.
          </Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <View style={styles.illustrationCircle}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/1657/1657464.png",
              }}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>
        </View>

        {/* Date display box — tapping navigates to calendar */}
        <TouchableOpacity
          style={styles.dateBox}
          onPress={handleBoxPress}
          activeOpacity={0.7}
        >
          <Text
            style={[styles.dateText, !selectedDate && styles.datePlaceholder]}
          >
            {selectedDate
              ? formatDate(selectedDate)
              : "Select Your Date of Birth"}
          </Text>
        </TouchableOpacity>

        <View style={{ flex: 1 }} />

        {/* Bottom nav */}
        <View style={styles.navRow}>
          <TouchableOpacity
            style={styles.prevBtn}
            onPress={() => router.back()}
            activeOpacity={0.8}
          >
            <Text style={styles.prevBtnText}>Previous</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.continueBtn,
              !selectedDate && styles.continueBtnDisabled,
            ]}
            onPress={() => router.push("/(onboarding)/calendar")}
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
  safe: { flex: 1, backgroundColor: "#ffffff" },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 36,
  },
  header: { marginBottom: 28 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 14, color: "#888", lineHeight: 22 },

  illustrationContainer: { alignItems: "center", marginBottom: 36 },
  illustrationCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: { width: 130, height: 130 },

  dateBox: {
    backgroundColor: "#000000",
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  dateText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000000",
  },
  datePlaceholder: {
    color: "#ffffff",
    fontWeight: "400",
    fontSize: 16,
  },

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
  continueBtnDisabled: { opacity: 1 },
  continueBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
