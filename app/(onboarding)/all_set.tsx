import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import {
  Animated,
  Dimensions,
  Easing,
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

// Replace with your local asset: require("../../assets/images/runner_finish.jpg")
const BG_IMAGE =
  "https://images.unsplash.com/photo-1758506971667-fbaa8942258a?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

// ─── CONFETTI CONFIG ──────────────────────────────────────────────────────────
const CONFETTI_COUNT = 60;
const COLORS = ["#E8272A", "#0044FF", "#79CF00"];
const SHAPES = ["square", "rect", "circle"] as const;

function randomBetween(a: number, b: number) {
  return a + Math.random() * (b - a);
}

type Piece = {
  id: number;
  x: number;
  color: string;
  shape: (typeof SHAPES)[number];
  size: number;
  delay: number;
  duration: number;
  rotation: number;
  swayAmount: number;
};

function buildPieces(): Piece[] {
  return Array.from({ length: CONFETTI_COUNT }, (_, i) => ({
    id: i,
    x: randomBetween(0, SCREEN_WIDTH),
    color: COLORS[Math.floor(Math.random() * COLORS.length)],
    shape: SHAPES[Math.floor(Math.random() * SHAPES.length)],
    size: randomBetween(5, 12),
    delay: randomBetween(0, 1800),
    duration: randomBetween(2200, 4000),
    rotation: randomBetween(0, 360),
    swayAmount: randomBetween(20, 60),
  }));
}

// ─── SINGLE CONFETTI PIECE ────────────────────────────────────────────────────
function ConfettiPiece({ piece }: { piece: Piece }) {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const start = () => {
      // Reset
      translateY.setValue(-20);
      translateX.setValue(0);
      rotate.setValue(0);
      opacity.setValue(0);

      Animated.sequence([
        Animated.delay(piece.delay),
        Animated.parallel([
          // Fall down
          Animated.timing(translateY, {
            toValue: SCREEN_HEIGHT + 40,
            duration: piece.duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          // Sway left-right
          Animated.sequence([
            Animated.timing(translateX, {
              toValue: piece.swayAmount,
              duration: piece.duration / 4,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: -piece.swayAmount,
              duration: piece.duration / 4,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: piece.swayAmount * 0.6,
              duration: piece.duration / 4,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(translateX, {
              toValue: 0,
              duration: piece.duration / 4,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ]),
          // Spin
          Animated.timing(rotate, {
            toValue: 1,
            duration: piece.duration,
            easing: Easing.linear,
            useNativeDriver: true,
          }),
          // Fade in then out near the bottom
          Animated.sequence([
            Animated.timing(opacity, {
              toValue: 1,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.delay(piece.duration - 600),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]).start(() => {
        // Loop with a random extra delay for organic feel
        setTimeout(start, randomBetween(200, 1000));
      });
    };
    start();
  }, []);

  const rotateDeg = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: [`${piece.rotation}deg`, `${piece.rotation + 720}deg`],
  });

  const isCircle = piece.shape === "circle";
  const width = piece.shape === "rect" ? piece.size * 2 : piece.size;
  const height = piece.size;
  const borderRadius = isCircle ? piece.size / 2 : 2;

  return (
    <Animated.View
      pointerEvents="none"
      style={{
        position: "absolute",
        top: 0,
        left: piece.x,
        width,
        height,
        borderRadius,
        backgroundColor: piece.color,
        opacity,
        transform: [{ translateY }, { translateX }, { rotate: rotateDeg }],
      }}
    />
  );
}

// ─── CONFETTI CANVAS ─────────────────────────────────────────────────────────
const PIECES = buildPieces();

function Confetti() {
  return (
    <View style={StyleSheet.absoluteFillObject} pointerEvents="none">
      {PIECES.map((p) => (
        <ConfettiPiece key={p.id} piece={p} />
      ))}
    </View>
  );
}

// ─── SCREEN (unchanged) ──────────────────────────────────────────────────────
export default function AllSetScreen() {
  const router = useRouter();

  return (
    <View style={styles.root}>
      <SafeAreaView style={styles.safe}>
        <StatusBar style="dark" />
        <View style={styles.container}>
          {/* ── Header ── */}
          <View style={styles.header}>
            <Text style={styles.title}>You're All Set!</Text>
            <Text style={styles.subtitle}>
              Your profile is complete, and you're ready to make the most out of
              your running journey.
            </Text>
          </View>

          {/* ── Unsplash image card ── */}
          <ImageBackground
            source={{ uri: BG_IMAGE }}
            style={styles.imageCard}
            imageStyle={styles.imageCardImg}
            resizeMode="cover"
          ></ImageBackground>

          {/* ── Caption ── */}
          <Text style={styles.caption}>
            All your selections have been saved securely. You can always come
            back to update your preferences in the settings.
          </Text>

          <View style={{ flex: 1 }} />

          {/* ── CTA ── */}
          <TouchableOpacity
            style={styles.dashboardBtn}
            onPress={() => router.replace("/(main)/homepage")}
            activeOpacity={0.88}
          >
            <Text style={styles.dashboardBtnText}>Go to Dashboard</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>

      {/* Confetti — rendered LAST so it paints above every other layer */}
      <Confetti />
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#000000" },
  safe: { flex: 1 },
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 28,
    paddingBottom: 36,
  },

  // Header
  header: { marginBottom: 20 },
  title: {
    fontSize: 32,
    fontWeight: "800",
    color: "#E8272A",
    marginBottom: 12,
    letterSpacing: -0.4,
    lineHeight: 40,
  },
  subtitle: {
    fontSize: 15,
    color: "#ffffff",
    lineHeight: 24,
  },

  // Image card
  imageCard: {
    width: "100%",
    height: SCREEN_HEIGHT * 0.44,
    borderRadius: 20,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  imageCardImg: {
    borderRadius: 20,
  },

  // Caption
  caption: {
    fontSize: 14,
    color: "#ffffff",
    textAlign: "center",
    lineHeight: 23,
    marginTop: 20,
    paddingHorizontal: 8,
  },

  // CTA
  dashboardBtn: {
    backgroundColor: "#E8272A",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 24,
  },
  dashboardBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
});
