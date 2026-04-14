import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Image,
  Modal,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

// ─── Cards ────────────────────────────────────────────────────────────────────
type Card = { id: string; label: string; icon: string };

const CARDS: Card[] = [
  {
    id: "injury_check",
    label: "Injury Check",
    icon: "https://cdn-icons-png.flaticon.com/512/3627/3627412.png",
  },
  {
    id: "shoes",
    label: "Shoes",
    icon: "https://cdn-icons-png.flaticon.com/512/8566/8566836.png",
  },
  {
    id: "supplements",
    label: "Supplements",
    icon: "https://cdn-icons-png.flaticon.com/512/3503/3503778.png",
  },
];

// ─── Loading steps ────────────────────────────────────────────────────────────
const STEPS = [
  { label: "Saving your preferences…", icon: "save-outline" as const },
  { label: "Building your profile…", icon: "person-outline" as const },
  { label: "Syncing your data…", icon: "sync-outline" as const },
  { label: "Personalizing your plan…", icon: "color-wand-outline" as const },
  { label: "All done!", icon: "checkmark-circle-outline" as const },
];

// ─── Loading overlay ──────────────────────────────────────────────────────────
function LoadingOverlay({ onFinish }: { onFinish: () => void }) {
  const [stepIdx, setStepIdx] = useState(0);
  const [barWidth, setBarWidth] = useState(0);

  // Progress bar animation
  const progress = useRef(new Animated.Value(0)).current;
  // Spin animation for the ring
  const spin = useRef(new Animated.Value(0)).current;
  // Fade for each step label
  const labelOpacity = useRef(new Animated.Value(1)).current;

  // Spin loop
  useEffect(() => {
    Animated.loop(
      Animated.timing(spin, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();
  }, []);

  // Step ticker
  useEffect(() => {
    const TOTAL = 3200; // ms total
    const perStep = TOTAL / STEPS.length;

    // Animate progress bar to 100% over TOTAL ms
    Animated.timing(progress, {
      toValue: 1,
      duration: TOTAL,
      easing: Easing.out(Easing.quad),
      useNativeDriver: false,
    }).start();

    // Advance step every perStep ms
    let current = 0;
    const tick = () => {
      current += 1;
      if (current < STEPS.length) {
        // Fade out → update label → fade in
        Animated.timing(labelOpacity, {
          toValue: 0,
          duration: 180,
          useNativeDriver: true,
        }).start(() => {
          setStepIdx(current);
          Animated.timing(labelOpacity, {
            toValue: 1,
            duration: 220,
            useNativeDriver: true,
          }).start();
        });
        setTimeout(tick, perStep);
      } else {
        // All steps done — navigate
        setTimeout(onFinish, 400);
      }
    };
    setTimeout(tick, perStep);
  }, []);

  const spinInterpolated = spin.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const barWidthInterpolated = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ["0%", "100%"],
  });

  const isDone = stepIdx === STEPS.length - 1;

  return (
    <Modal transparent animationType="fade" visible>
      <View style={ls.overlay}>
        <View style={ls.card}>
          {/* Spinner / done icon */}
          <View style={ls.spinnerWrapper}>
            {isDone ? (
              <View style={ls.doneCircle}>
                <Ionicons name="checkmark" size={36} color="#fff" />
              </View>
            ) : (
              <>
                {/* Outer ring */}
                <View style={ls.ringBg} />
                <Animated.View
                  style={[
                    ls.ringArc,
                    { transform: [{ rotate: spinInterpolated }] },
                  ]}
                />
                {/* Runverve logo center */}
                <View style={ls.spinnerCenter}>
                  <Ionicons name="flash" size={26} color="#E8272A" />
                </View>
              </>
            )}
          </View>

          {/* Title */}
          <Text style={ls.title}>Setting things up</Text>

          {/* Step label with fade */}
          <Animated.View style={[ls.stepRow, { opacity: labelOpacity }]}>
            <Ionicons
              name={STEPS[stepIdx].icon}
              size={15}
              color="#E8272A"
              style={{ marginRight: 7 }}
            />
            <Text style={ls.stepLabel}>{STEPS[stepIdx].label}</Text>
          </Animated.View>

          {/* Progress bar */}
          <View
            style={ls.barTrack}
            onLayout={(e) => setBarWidth(e.nativeEvent.layout.width)}
          >
            <Animated.View
              style={[ls.barFill, { width: barWidthInterpolated }]}
            />
          </View>

          {/* Step dots */}
          <View style={ls.dotsRow}>
            {STEPS.map((_, i) => (
              <View
                key={i}
                style={[ls.dot, i <= stepIdx ? ls.dotActive : ls.dotInactive]}
              />
            ))}
          </View>
        </View>
      </View>
    </Modal>
  );
}

const ls = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.55)",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 24,
    paddingVertical: 40,
    paddingHorizontal: 32,
    alignItems: "center",
    width: "100%",
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 16,
  },

  // Spinner
  spinnerWrapper: {
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  ringBg: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "#F0F0F0",
  },
  ringArc: {
    position: "absolute",
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: "transparent",
    borderTopColor: "#E8272A",
    borderRightColor: "#E8272A",
  },
  spinnerCenter: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  doneCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "#E8272A",
    alignItems: "center",
    justifyContent: "center",
  },

  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111",
    letterSpacing: -0.3,
  },

  stepRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  stepLabel: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },

  // Progress bar
  barTrack: {
    width: "100%",
    height: 6,
    backgroundColor: "#F0F0F0",
    borderRadius: 3,
    overflow: "hidden",
  },
  barFill: {
    height: "100%",
    backgroundColor: "#E8272A",
    borderRadius: 3,
  },

  // Dots
  dotsRow: {
    flexDirection: "row",
    gap: 6,
  },
  dot: {
    height: 6,
    borderRadius: 3,
  },
  dotActive: {
    width: 18,
    backgroundColor: "#E8272A",
  },
  dotInactive: {
    width: 6,
    backgroundColor: "#E0E0E0",
  },
});

// ─── Main screen ──────────────────────────────────────────────────────────────
export default function CustomizeJourneyScreen() {
  const router = useRouter();
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(false);

  const toggle = (id: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleSave = () => {
    setLoading(true);
  };

  const handleLoadingFinish = () => {
    setLoading(false);
    router.replace("/(onboarding)/all_set");
  };

  const topRow = CARDS.slice(0, 2);
  const bottomRow = CARDS.slice(2);

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      {/* Loading overlay */}
      {loading && <LoadingOverlay onFinish={handleLoadingFinish} />}

      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Customize Your Journey</Text>
          <Text style={styles.subtitle}>
            Select preferences to tailor your Verve Coach guidance.
          </Text>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* Top row — 2 cards side by side */}
          <View style={styles.row}>
            {topRow.map((card) => {
              const isSelected = selected.has(card.id);
              return (
                <TouchableOpacity
                  key={card.id}
                  style={[styles.card, isSelected && styles.cardSelected]}
                  onPress={() => toggle(card.id)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: card.icon }}
                    style={[
                      styles.cardIcon,
                      isSelected && styles.cardIconSelected,
                    ]}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.cardLabel,
                      isSelected && styles.cardLabelSelected,
                    ]}
                  >
                    {card.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={13} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Bottom row — centered single card */}
          <View style={styles.rowCentered}>
            {bottomRow.map((card) => {
              const isSelected = selected.has(card.id);
              return (
                <TouchableOpacity
                  key={card.id}
                  style={[styles.cardSingle, isSelected && styles.cardSelected]}
                  onPress={() => toggle(card.id)}
                  activeOpacity={0.8}
                >
                  <Image
                    source={{ uri: card.icon }}
                    style={[
                      styles.cardIcon,
                      isSelected && styles.cardIconSelected,
                    ]}
                    resizeMode="contain"
                  />
                  <Text
                    style={[
                      styles.cardLabel,
                      isSelected && styles.cardLabelSelected,
                    ]}
                  >
                    {card.label}
                  </Text>
                  {isSelected && (
                    <View style={styles.checkBadge}>
                      <Ionicons name="checkmark" size={13} color="#fff" />
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* Save & Continue */}
        <TouchableOpacity
          style={styles.saveBtn}
          onPress={handleSave}
          activeOpacity={0.88}
        >
          <Text style={styles.saveBtnText}>Save & Continue</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ─── Main styles ──────────────────────────────────────────────────────────────
const CARD_SIZE = 160;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 36,
  },

  header: { marginBottom: 32 },
  title: {
    fontSize: 28,
    fontWeight: "800",
    color: "#111",
    marginBottom: 10,
    letterSpacing: -0.4,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 14,
    color: "#888",
    lineHeight: 22,
  },

  scrollContent: {
    gap: 16,
    paddingBottom: 8,
  },

  row: {
    flexDirection: "row",
    gap: 14,
  },

  card: {
    flex: 1,
    backgroundColor: "#F2F2F2",
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: CARD_SIZE,
    position: "relative",
    borderWidth: 2,
    borderColor: "transparent",
  },

  cardSingle: {
    width: "48%",
    backgroundColor: "#F2F2F2",
    borderRadius: 18,
    paddingVertical: 28,
    paddingHorizontal: 12,
    alignItems: "center",
    justifyContent: "center",
    minHeight: CARD_SIZE + 40,
    position: "relative",
    borderWidth: 2,
    borderColor: "transparent",
  },

  cardSelected: {
    backgroundColor: "#FFF0F0",
    borderColor: "#E8272A",
  },

  cardIcon: {
    width: 80,
    height: 80,
    marginBottom: 20,
    tintColor: "#222",
  },
  cardIconSelected: {
    tintColor: "#E8272A",
  },

  cardLabel: {
    fontSize: 15,
    fontWeight: "700",
    color: "#333",
    textAlign: "center",
  },
  cardLabelSelected: {
    color: "#E8272A",
  },

  rowCentered: {
    flexDirection: "row",
    justifyContent: "center",
  },

  checkBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: "#E8272A",
    alignItems: "center",
    justifyContent: "center",
  },

  saveBtn: {
    backgroundColor: "#E8272A",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 16,
  },
  saveBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
