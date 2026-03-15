import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ViewToken,
} from "react-native";

const { width, height } = Dimensions.get("window");

const slides = [
  {
    id: "1",
    bg: "#E8272A",
    circleBg: "rgba(255, 255, 255, 0.1)",
    image: "https://cdn-icons-png.flaticon.com/512/4824/4824507.png",
    title: "Let's Move",
    description:
      "Welcome to Runverve! Start your journey towards greatness by syncing your stride with our data-driven digital twin. Let's lace up and hit the road together.",
  },
  {
    id: "2",
    bg: "#0044ff",
    circleBg: "rgba(255, 255, 255, 0.1)",
    image: "https://cdn-icons-png.flaticon.com/512/1538/1538455.png",
    title: "Be Your Best",
    description:
      "Welcome to Runverve! Start your journey towards greatness by syncing your stride with our data-driven digital twin. Let's lace up and hit the road together.",
  },
  {
    id: "3",
    bg: "#79cf00",
    circleBg: "rgba(255, 255, 255, 0.1)",
    image: "https://cdn-icons-png.flaticon.com/512/75/75929.png",
    title: "Build Your Strength",
    description:
      "Congratulations on taking the first step! With Runverve, every stride counts. Earn rewards for consistency, celebrate progress, and receive personalized suggestions to build your strength and endurance.",
  },
];

export default function SplashScreen() {
  const router = useRouter();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      if (viewableItems.length > 0) {
        setActiveIndex(viewableItems[0].index ?? 0);
      }
    },
  ).current;

  const handleNext = () => {
    if (activeIndex < slides.length - 1) {
      flatListRef.current?.scrollToIndex({ index: activeIndex + 1 });
    } else {
      router.replace("/(auth)/welcome");
    }
  };

  const currentSlide = slides[activeIndex];

  return (
    <View style={styles.container}>
      <StatusBar style="light" />

      <FlatList
        ref={flatListRef}
        data={slides}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={{ viewAreaCoveragePercentThreshold: 50 }}
        renderItem={({ item }) => (
          <View style={[styles.slide, { backgroundColor: item.bg, width }]}>
            <View
              style={[styles.circleOuter, { backgroundColor: item.circleBg }]}
            >
              <View
                style={[styles.circleInner, { backgroundColor: item.circleBg }]}
              >
                <Image
                  source={{ uri: item.image }}
                  style={styles.illustration}
                  resizeMode="contain"
                />
              </View>
            </View>

            <View style={styles.textBlock}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
      />

      {/* Overlay bottom panel always on top */}
      <View style={[styles.bottomPanel, { backgroundColor: currentSlide.bg }]}>
        <View style={styles.dotsRow}>
          {slides.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === activeIndex ? styles.dotActive : styles.dotInactive,
              ]}
            />
          ))}
        </View>

        <TouchableOpacity
          style={styles.letsGoBtn}
          onPress={handleNext}
          activeOpacity={0.88}
        >
          <Text style={styles.letsGoText}>
            {activeIndex === slides.length - 1 ? "Get Started" : "Let's go"}
          </Text>
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
            <Text style={styles.footerLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  slide: {
    height,
    alignItems: "center",
    paddingTop: height * 0.1,
    paddingHorizontal: 32,
    paddingBottom: 250,
  },
  circleOuter: {
    width: 240,
    height: 240,
    borderRadius: 120,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 52,
  },
  circleInner: {
    width: 192,
    height: 192,
    borderRadius: 96,
    alignItems: "center",
    justifyContent: "center",
  },
  illustration: { width: 130, height: 130 },
  textBlock: { alignItems: "center" },
  title: {
    fontSize: 34,
    fontWeight: "800",
    color: "#000000",
    marginBottom: 16,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  description: {
    fontSize: 15,
    color: "rgba(255,255,255,0.88)",
    textAlign: "center",
    lineHeight: 24,
  },
  bottomPanel: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: 44,
    paddingTop: 8,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
    gap: 8,
  },
  dot: { height: 8, borderRadius: 4 },
  dotActive: { width: 28, backgroundColor: "#000000" },
  dotInactive: { width: 8, backgroundColor: "rgb(255, 255, 255)" },
  letsGoBtn: {
    backgroundColor: "#000000",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
    marginBottom: 16,
  },
  letsGoText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#ffffff",
    letterSpacing: 0.2,
  },
  footer: { flexDirection: "row", justifyContent: "center" },
  footerText: { color: "rgb(255, 255, 255)", fontSize: 14 },
  footerLink: {
    color: "#000000",
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
