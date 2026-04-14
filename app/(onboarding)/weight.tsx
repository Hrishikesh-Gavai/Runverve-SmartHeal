import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export default function WeightScreen() {
  const router = useRouter();
  const [weight, setWeight] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.title}>How much do you weigh?</Text>
            <Text style={styles.subtitle}>
              We would like to have the following information to provide more
              accurate results.
            </Text>
          </View>

          {/* Illustration */}
          <View style={styles.illustrationContainer}>
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/512/6560/6560278.png",
              }}
              style={styles.illustration}
              resizeMode="contain"
            />
          </View>

          {/* Weight input box */}
          <View style={[styles.inputBox, isFocused && styles.inputBoxFocused]}>
            <TextInput
              style={styles.input}
              placeholder="Your weight in kgs"
              placeholderTextColor="#ffffff"
              keyboardType="numeric"
              value={weight}
              onChangeText={(t) => {
                // Allow only numbers and one decimal point
                if (/^\d*\.?\d*$/.test(t)) setWeight(t);
              }}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              maxLength={6}
              textAlign="center"
            />
            {weight.length > 0 && <Text style={styles.unitBadge}>kg</Text>}
          </View>

          {/* Quick select chips */}
          {weight.length === 0 && (
            <View style={styles.chipsRow}>
              {["50", "60", "70", "80", "90"].map((v) => (
                <TouchableOpacity
                  key={v}
                  style={styles.chip}
                  onPress={() => setWeight(v)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.chipText}>{v} kg</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

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
              style={[
                styles.continueBtn,
                !weight && styles.continueBtnDisabled,
              ]}
              onPress={() => router.push("/(onboarding)/experience_level")}
              activeOpacity={0.88}
            >
              <Text style={styles.continueBtnText}>Continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
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
  header: { marginBottom: 28 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 14, color: "#888", lineHeight: 22 },

  illustrationContainer: { alignItems: "center", marginBottom: 32 },
  illustration: { width: 180, height: 160 },

  inputBox: {
    backgroundColor: "#000000",
    borderRadius: 14,
    paddingVertical: 22,
    paddingHorizontal: 20,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  inputBoxFocused: {
    borderColor: "#E8272A",
    backgroundColor: "#000000",
  },
  input: {
    fontSize: 20,
    fontWeight: "600",
    color: "#ffffff",
    minWidth: 120,
    textAlign: "center",
  },
  unitBadge: {
    fontSize: 16,
    fontWeight: "700",
    color: "#E8272A",
    marginLeft: 6,
  },

  chipsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
    marginTop: 16,
    justifyContent: "center",
  },
  chip: {
    borderWidth: 1.5,
    borderColor: "#000000",
    borderRadius: 20,
    paddingVertical: 8,
    paddingHorizontal: 18,
    backgroundColor: "#E8272A",
  },
  chipText: { fontSize: 14, fontWeight: "600", color: "#000000" },

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
  continueBtnDisabled: { opacity: 0.5 },
  continueBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
