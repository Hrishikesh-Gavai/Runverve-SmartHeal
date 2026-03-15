import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Level = {
  id: string;
  label: string;
  description: string;
  icon: string; // Flaticon URL
};

const LEVELS: Level[] = [
  {
    id: "beginner",
    label: "Beginner",
    description: "Limited running experience, occasional short runs or walks",
    icon: "https://cdn-icons-png.flaticon.com/512/8404/8404610.png",
  },
  {
    id: "intermediate",
    label: "Intermediate",
    description: "Limited running experience, occasional short runs or walks",
    icon: "https://cdn-icons-png.flaticon.com/512/8704/8704495.png",
  },
  {
    id: "advanced",
    label: "Advanced",
    description:
      "Experienced runner with consistent training, including long distances or speed walk",
    icon: "https://cdn-icons-png.flaticon.com/512/55/55240.png",
  },
  {
    id: "elite",
    label: "Elite",
    description:
      "Professional or Highly Experienced runner, often participating in races or intense training sessions",
    icon: "https://cdn-icons-png.flaticon.com/512/9930/9930138.png",
  },
];

export default function ExperienceLevelScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("beginner");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            What is your typical running experience level ?
          </Text>
          <Text style={styles.subtitle}>
            We would like to have the following information to provide more
            accurate results.
          </Text>
        </View>

        {/* Options */}
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.optionsList}
        >
          {LEVELS.map((level) => {
            const isSelected = selected === level.id;
            return (
              <TouchableOpacity
                key={level.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setSelected(level.id)}
                activeOpacity={0.8}
              >
                <View style={styles.optionIconBox}>
                  <Image
                    source={{ uri: level.icon }}
                    style={[
                      styles.optionIcon,
                      isSelected && styles.optionIconSelected,
                    ]}
                    resizeMode="contain"
                  />
                </View>
                <View style={styles.optionTextBlock}>
                  <Text
                    style={[
                      styles.optionLabel,
                      isSelected && styles.optionLabelSelected,
                    ]}
                  >
                    {level.label}
                  </Text>
                  <Text
                    style={[
                      styles.optionDesc,
                      isSelected && styles.optionDescSelected,
                    ]}
                  >
                    {level.description}
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

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
            onPress={() => router.push("/(onboarding)/running_goal")}
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
  header: { marginBottom: 20 },
  title: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
    letterSpacing: -0.3,
    lineHeight: 32,
  },
  subtitle: { fontSize: 14, color: "#888", lineHeight: 22 },

  optionsList: { gap: 12, paddingBottom: 8 },

  optionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 16,
    gap: 16,
  },
  optionCardSelected: {
    backgroundColor: "#000000",
  },
  optionIconBox: {
    width: 52,
    height: 52,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  optionIcon: {
    width: 48,
    height: 48,
    tintColor: "#000000",
  },
  optionIconSelected: {
    tintColor: "#ff0000",
  },
  optionTextBlock: { flex: 1 },
  optionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 4,
  },
  optionLabelSelected: { color: "#E8272A" },
  optionDesc: {
    fontSize: 13,
    color: "#888",
    lineHeight: 19,
  },
  optionDescSelected: { color: "rgba(255,255,255,0.75)" },

  navRow: { flexDirection: "row", gap: 12, marginTop: 16 },
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
