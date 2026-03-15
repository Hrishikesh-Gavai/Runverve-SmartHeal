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

const GENDER_OPTIONS = ["Male", "Female", "Non-binary", "Prefer not to say"];

export default function GenderScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("Male");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>How do you identify</Text>
          <Text style={styles.subtitle}>
            We would like to have the following information to provide more
            accurate results.
          </Text>
        </View>

        {/* Illustration */}
        <View style={styles.illustrationContainer}>
          <Image
            source={{
              uri: "https://cdn-icons-png.flaticon.com/512/1921/1921935.png",
            }}
            style={styles.illustration}
            resizeMode="contain"
          />
        </View>

        {/* Options */}
        <View style={styles.optionsList}>
          {GENDER_OPTIONS.map((option) => {
            const isSelected = selected === option;
            return (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setSelected(option)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.optionText,
                    isSelected && styles.optionTextSelected,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{ flex: 1 }} />

        {/* Continue */}
        <TouchableOpacity
          style={[styles.continueBtn, !selected && styles.continueBtnDisabled]}
          onPress={() => router.push("/(onboarding)/dob")}
          activeOpacity={0.88}
        >
          <Text style={styles.continueBtnText}>Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fffffffff" },
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
    lineHeight: 34,
  },
  subtitle: { fontSize: 14, color: "#888", lineHeight: 22 },

  illustrationContainer: {
    alignItems: "center",
    marginBottom: 28,
  },
  illustration: {
    width: 160,
    height: 160,
  },

  optionsList: { gap: 12 },
  optionCard: {
    backgroundColor: "#F2F2F2",
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: "center",
  },
  optionCardSelected: {
    backgroundColor: "#000000",
  },
  optionText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#000000",
  },
  optionTextSelected: {
    color: "#fff",
    fontWeight: "700",
  },

  continueBtn: {
    backgroundColor: "#E8272A",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 24,
  },
  continueBtnDisabled: { opacity: 0.5 },
  continueBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
