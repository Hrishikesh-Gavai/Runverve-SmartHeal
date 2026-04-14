import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

type Goal = {
  id: string;
  label: string;
  description: string;
};

const GOALS: Goal[] = [
  {
    id: "short",
    label: "Short Distance",
    description: "Aim for runs typically under 5 Kilometers",
  },
  {
    id: "medium",
    label: "Medium Distance",
    description: "Regularly cover distances between 5 to 15 kilometers",
  },
  {
    id: "long",
    label: "Long Distance",
    description: "Routinely run distances exceeding 15 Kilometers",
  },
  {
    id: "ultra",
    label: "Ultra Distance",
    description:
      "Seasoned runner tackling distances beyond the marathon, often 50 Kilometres or More",
  },
];

export default function RunningGoalScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("short");

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            What's your typical running distance goal ?
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
          {GOALS.map((goal) => {
            const isSelected = selected === goal.id;
            return (
              <TouchableOpacity
                key={goal.id}
                style={[
                  styles.optionCard,
                  isSelected && styles.optionCardSelected,
                ]}
                onPress={() => setSelected(goal.id)}
                activeOpacity={0.8}
              >
                <Text
                  style={[
                    styles.optionLabel,
                    isSelected && styles.optionLabelSelected,
                  ]}
                >
                  {goal.label}
                </Text>
                <Text
                  style={[
                    styles.optionDesc,
                    isSelected && styles.optionDescSelected,
                  ]}
                >
                  {goal.description}
                </Text>
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
            onPress={() => router.push("/(onboarding)/customize_journey")}
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
    backgroundColor: "#F2F2F2",
    borderRadius: 14,
    paddingVertical: 20,
    paddingHorizontal: 20,
  },
  optionCardSelected: {
    backgroundColor: "#000000",
  },
  optionLabel: {
    fontSize: 16,
    fontWeight: "700",
    color: "#000000",
    marginBottom: 6,
  },
  optionLabelSelected: { color: "#E8272A" },
  optionDesc: {
    fontSize: 14,
    color: "#888",
    lineHeight: 20,
  },
  optionDescSelected: { color: "rgba(255,255,255,0.72)" },

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
