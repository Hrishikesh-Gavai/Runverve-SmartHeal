import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Animated,
  BackHandler,
  Dimensions,
  FlatList,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  ToastAndroid,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Circle } from "react-native-svg";

const { width: W, height: H } = Dimensions.get("window");

// ── STRICT COLOR PALETTE ────────────────────────────────────────────────────
const C = {
  black: "#000000",
  white: "#FFFFFF",
  red: "#E8272A",
  bg: "#F5F5F5",
  card: "#FFFFFF",
  border: "#EBEBEB",
  grey: "#888888",
  lightgrey: "#F0F0F0",
};

// ── CAROUSEL ────────────────────────────────────────────────────────────────
const CAROUSEL = [
  //{
   // id: "c1",
  //  uri: "https://images.unsplash.com/photo-1733354689965-d67f5328fd38?q=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
   // quote: "Every mile is a gift.",
  ////  sub: "Run like you mean it.",
  //},
  {
    id: "c2",
    uri: "https://images.unsplash.com/photo-1476480862126-209bfaa8edc8",
    quote: "Pain is temporary. Pride is forever.",
    sub: "Push beyond your limits.",
  },
  //{
    //id: "c3",
    //uri: "https://images.unsplash.com/photo-1483721310020-03333e577078",
   // sub: "Run. Recover. Repeat.",
  //},
  {
    id: "c4",
    uri: "https://images.unsplash.com/photo-1606335543042-57c525922933",
    quote: "The road is yours. Own it.",
    sub: "Powered by Runverve.",
  },
];

// ── DIGITAL TWIN DATA ───────────────────────────────────────────────────────
const DT_LIVE_STATS = [
  {
    id: "hr",
    label: "Heart Rate",
    value: "72",
    unit: "bpm",
    icon: "heart" as const,
  },
  {
    id: "cal",
    label: "Calories Burned",
    value: "802",
    unit: "kcal",
    icon: "flame" as const,
  },
  {
    id: "steps",
    label: "Step Count",
    value: "12,000",
    unit: "steps",
    icon: "footsteps" as const,
  },
  {
    id: "dist",
    label: "Distance Ran",
    value: "13.4",
    unit: "km",
    icon: "navigate" as const,
  },
];

const DT_SHOES = [
  {
    id: "s1",
    brand: "Nike",
    name: "Pegasus 40",
    km: 234,
    max: 600,
    img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    size: "UK 9",
    color: "Black/White",
  },
  {
    id: "s2",
    brand: "Adidas",
    name: "Ultraboost 23",
    km: 478,
    max: 600,
    img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?q=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    size: "UK 9",
    color: "Core White",
  },
  {
    id: "s3",
    brand: "ASICS",
    name: "Gel-Nimbus 25",
    km: 112,
    max: 600,
    img: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
    size: "UK 9",
    color: "French Blue",
  },
];

const DT_WATER = {
  current: 1.8,
  goal: 2.8,
  unit: "L",
  logs: [
    { time: "7:00 AM", amount: "250 ml" },
    { time: "9:30 AM", amount: "330 ml" },
    { time: "12:00 PM", amount: "500 ml" },
    { time: "3:15 PM", amount: "250 ml" },
    { time: "6:00 PM", amount: "470 ml" },
  ],
};

const DT_SUPPLEMENTS = [
  {
    id: "sup1",
    name: "Whey Protein",
    dose: "30g",
    time: "Post-run",
    taken: true,
    icon: "barbell-outline" as const,
  },
  {
    id: "sup2",
    name: "Omega-3",
    dose: "1000mg",
    time: "Breakfast",
    taken: true,
    icon: "fish-outline" as const,
  },
  {
    id: "sup3",
    name: "Vitamin D3",
    dose: "2000IU",
    time: "Morning",
    taken: false,
    icon: "sunny-outline" as const,
  },
  {
    id: "sup4",
    name: "Magnesium",
    dose: "400mg",
    time: "Bedtime",
    taken: false,
    icon: "moon-outline" as const,
  },
  {
    id: "sup5",
    name: "Creatine",
    dose: "5g",
    time: "Pre-workout",
    taken: false,
    icon: "flash-outline" as const,
  },
];

// ── COACH DATA ──────────────────────────────────────────────────────────────
const COACH_ACTIVE = true; // flip to false to see welcome screen

const COACH_PLAN = [
  {
    id: "d1",
    day: "MON",
    title: "Easy Run",
    dist: "6 km",
    done: true,
    type: "run",
  },
  {
    id: "d2",
    day: "TUE",
    title: "Strength",
    dist: "45 min",
    done: true,
    type: "gym",
  },
  {
    id: "d3",
    day: "WED",
    title: "Tempo Run",
    dist: "8 km",
    done: false,
    type: "run",
  },
  {
    id: "d4",
    day: "THU",
    title: "Rest Day",
    dist: "–",
    done: false,
    type: "rest",
  },
  {
    id: "d5",
    day: "FRI",
    title: "Intervals",
    dist: "5 km",
    done: false,
    type: "run",
  },
  {
    id: "d6",
    day: "SAT",
    title: "Long Run",
    dist: "14 km",
    done: false,
    type: "run",
  },
  {
    id: "d7",
    day: "SUN",
    title: "Recovery Walk",
    dist: "3 km",
    done: false,
    type: "walk",
  },
];

const COACH_SESSIONS = [
  {
    id: "cs1",
    title: "Morning Run",
    date: "Today",
    dist: "8.2 km",
    time: "42:18",
    pace: "5:09/km",
  },
  {
    id: "cs2",
    title: "Interval Speed",
    date: "Yesterday",
    dist: "5.0 km",
    time: "28:44",
    pace: "5:45/km",
  },
  {
    id: "cs3",
    title: "Long Run",
    date: "Last Sunday",
    dist: "15.2 km",
    time: "1:28:30",
    pace: "5:49/km",
  },
];

const COACH_INSIGHTS = [
  "Increase weekly mileage by no more than 10% to stay injury-free.",
  "Your cadence is 162 spm — target 170–180 for peak efficiency.",
  "2 days from a new weekly distance PR. Push through Friday!",
  "Recovery score is 74%. Consider a lighter effort today.",
];

// ── SPARK DATA ──────────────────────────────────────────────────────────────
const SPARK_POINTS = 3512;
const SPARK_PRODUCTS = [
  {
    id: "sp1",
    brand: "Adidas",
    name: "Ultraboost Running Shoes",
    desc: "Boost your run — 40% OFF with every pair",
    points: 300,
    expiry: "31 Dec 2025",
    color: "#1D2D50",
    redeemed: false,
  },
  {
    id: "sp2",
    brand: "Garmin",
    name: "Forerunner 945",
    desc: "Track your fitness — 30% OFF on latest GPS watch",
    points: 500,
    expiry: "01 Nov 2025",
    color: "#6B3FA0",
    redeemed: false,
  },
  {
    id: "sp3",
    brand: "Under Armour",
    name: "HOVR Phantom 2",
    desc: "Feel the energy return — 35% OFF on HOVR tech shoes",
    points: 400,
    expiry: "20 Feb 2026",
    color: "#00728F",
    redeemed: true,
  },
  {
    id: "sp4",
    brand: "GU Energy",
    name: "Energy Gel Pack (24ct)",
    desc: "Fuel every mile — 25% OFF on all flavours",
    points: 150,
    expiry: "15 Mar 2026",
    color: "#C0392B",
    redeemed: false,
  },
  {
    id: "sp5",
    brand: "Coros",
    name: "PACE 3 GPS Watch",
    desc: "Precision coaching — 20% OFF on PACE 3",
    points: 800,
    expiry: "30 Jun 2026",
    color: "#27AE60",
    redeemed: false,
  },
];

const SPARK_CONTENT = [
  {
    id: "sc1",
    brand: "TrailMag",
    name: "1 Year Digital Subscription",
    desc: "Access 500+ training plans & race guides",
    points: 200,
    expiry: "31 Dec 2025",
    color: "#E67E22",
    redeemed: false,
  },
  {
    id: "sc2",
    brand: "Peloton",
    name: "1-Month Free Access",
    desc: "Unlimited classes with world-class instructors",
    points: 350,
    expiry: "30 Sep 2025",
    color: "#8E44AD",
    redeemed: false,
  },
  {
    id: "sc3",
    brand: "Strava",
    name: "3-Month Summit",
    desc: "Unlock all Strava premium features",
    points: 250,
    expiry: "31 Oct 2025",
    color: "#FC4C02",
    redeemed: true,
  },
];

// ── VERVE DOC DATA ──────────────────────────────────────────────────────────
const WELLNESS_SCORE = 92;
const DOC_CATEGORIES = [
  {
    id: "nut",
    label: "Nutrition",
    icon: "restaurant-outline" as const,
    detail: "2,100 calories today",
    sub: "128g protein · 65g fat",
  },
  {
    id: "med",
    label: "Medication",
    icon: "medkit-outline" as const,
    detail: "3 medications due today",
    sub: "Next: Vitamin D at 2 PM",
  },
  {
    id: "wh",
    label: "Women's Health",
    icon: "heart-outline" as const,
    detail: "Cycle day 14",
    sub: "Ovulation window",
  },
  {
    id: "mh",
    label: "Mental Health",
    icon: "happy-outline" as const,
    detail: "Feeling great today",
    sub: "Mood score: 8/10",
  },
  {
    id: "slp",
    label: "Sleep",
    icon: "moon-outline" as const,
    detail: "7h 32m last night",
    sub: "Deep sleep: 1h 48m",
  },
];

// ── SVG RING ────────────────────────────────────────────────────────────────
function Ring({
  pct,
  color,
  size,
  strokeW = 5,
}: {
  pct: number;
  color: string;
  size: number;
  strokeW?: number;
}) {
  const r = (size - strokeW * 2) / 2;
  const circ = 2 * Math.PI * r;
  return (
    <Svg
      width={size}
      height={size}
      style={{ transform: [{ rotate: "-90deg" }] }}
    >
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={C.lightgrey}
        strokeWidth={strokeW}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke={color}
        strokeWidth={strokeW}
        fill="none"
        strokeDasharray={`${pct * circ} ${circ}`}
        strokeLinecap="round"
      />
    </Svg>
  );
}

// ── SECTION HEADER ───────────────────────────────────────────────────────────
function SH({
  title,
  action,
  onAction,
}: {
  title: string;
  action?: string;
  onAction?: () => void;
}) {
  return (
    <View style={ss.row}>
      <Text style={ss.title}>{title}</Text>
      {action && (
        <TouchableOpacity onPress={onAction}>
          <Text style={ss.action}>{action}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
const ss = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 14,
  },
  title: {
    fontSize: 18,
    fontWeight: "900",
    color: C.black,
    letterSpacing: -0.3,
  },
  action: { fontSize: 13, fontWeight: "700", color: C.red },
});

// ── SIDE MENU ────────────────────────────────────────────────────────────────
const MENU_ITEMS = [
  { icon: "person-outline" as const, label: "My Profile" },
  { icon: "stats-chart-outline" as const, label: "My Stats" },
  { icon: "ribbon-outline" as const, label: "Achievements" },
  { icon: "settings-outline" as const, label: "Settings" },
  { icon: "notifications-outline" as const, label: "Notifications" },
  { icon: "shield-checkmark-outline" as const, label: "Privacy" },
  { icon: "help-circle-outline" as const, label: "Help & Support" },
  { icon: "log-out-outline" as const, label: "Log Out", red: true },
];

function SideMenu({
  visible,
  onClose,
}: {
  visible: boolean;
  onClose: () => void;
}) {
  const tx = useRef(new Animated.Value(W)).current;
  const router = useRouter();
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    Animated.spring(tx, {
      toValue: visible ? 0 : W,
      useNativeDriver: true,
      speed: 22,
      bounciness: 0,
    }).start();

    if (visible) {
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.02,
          duration: 100,
          useNativeDriver: true,
        }),
        Animated.spring(scaleAnim, {
          toValue: 1,
          friction: 8,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const handleLogout = () => {
    onClose();
    setTimeout(() => {
      router.replace("/(auth)/welcome");
    }, 300);
  };

  if (!visible) return null;
  return (
    <TouchableOpacity style={sm.backdrop} activeOpacity={1} onPress={onClose}>
      <Animated.View
        style={[
          sm.panel,
          { transform: [{ translateX: tx }, { scale: scaleAnim }] },
        ]}
      >
        <TouchableOpacity activeOpacity={1}>
          <SafeAreaView>
            {/* Header */}
            <View style={sm.header}>
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1503775012249-06a2b8cd00eb?q=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3Dhttps://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&q=80",
                }}
                style={sm.avatar}
              />
              <View style={sm.headerText}>
                <Text style={sm.name}>Hrishikesh</Text>
                <Text style={sm.handle}>@hrishikesh_runs</Text>
              </View>
              <TouchableOpacity onPress={onClose} style={sm.closeBtn}>
                <Ionicons name="close" size={20} color={C.black} />
              </TouchableOpacity>
            </View>
            {/* Quick stats */}
            <View style={sm.statsBar}>
              {[
                { v: "167", l: "km / month" },
                { v: "24", l: "total runs" },
                { v: "18", l: "day streak" },
              ].map((s, i) => (
                <View key={i} style={[sm.statItem, i > 0 && sm.statBorder]}>
                  <Text style={sm.statV}>{s.v}</Text>
                  <Text style={sm.statL}>{s.l}</Text>
                </View>
              ))}
            </View>
            <View style={sm.divider} />
            {/* Items */}
            {MENU_ITEMS.map((item) => (
              <TouchableOpacity
                key={item.label}
                style={sm.item}
                activeOpacity={0.7}
                onPress={() => {
                  if (item.label === "Log Out") {
                    handleLogout();
                  } else {
                    onClose();
                  }
                }}
              >
                <View style={[sm.itemIcon, item.red && sm.itemIconRed]}>
                  <Ionicons
                    name={item.icon}
                    size={18}
                    color={C.white}
                  />
                </View>
                <Text style={[sm.itemLabel, item.red && { color: C.red }]}>
                  {item.label}
                </Text>
                {!item.red && (
                  <Ionicons
                    name="chevron-forward"
                    size={14}
                    color={C.border}
                    style={{ marginLeft: "auto" }}
                  />
                )}
              </TouchableOpacity>
            ))}
            <View style={sm.divider} />
            <Text style={sm.version}>Runverve v1.0.0</Text>
          </SafeAreaView>
        </TouchableOpacity>
      </Animated.View>
    </TouchableOpacity>
  );
}
const sm = StyleSheet.create({
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 400,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  panel: {
    width: W * 0.82,
    backgroundColor: C.white,
    shadowColor: "#000",
    shadowOffset: { width: -4, height: 0 },
    shadowOpacity: 0.15,
    shadowRadius: 24,
    elevation: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    borderWidth: 2.5,
    borderColor: C.red,
  },
  headerText: { flex: 1 },
  name: { fontSize: 17, fontWeight: "900", color: C.black },
  handle: { fontSize: 12, color: C.grey, marginTop: 2 },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: C.lightgrey,
    alignItems: "center",
    justifyContent: "center",
  },
  statsBar: {
    flexDirection: "row",
    marginHorizontal: 20,
    backgroundColor: C.red,
    borderRadius: 16,
    marginBottom: 8,
  },
  statItem: { flex: 1, alignItems: "center", paddingVertical: 12 },
  statBorder: { borderLeftWidth: 1, borderLeftColor: "rgba(255, 255, 255, 0.3)" },
  statV: { fontSize: 16, fontWeight: "900", color: C.white },
  statL: { fontSize: 10, color: "rgba(255, 255, 255, 0.8)", marginTop: 2, textAlign: "center" },
  divider: {
    height: 1,
    backgroundColor: C.lightgrey,
    marginHorizontal: 20,
    marginVertical: 8,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 13,
    gap: 13,
  },
  itemIcon: {
    width: 38,
    height: 38,
    borderRadius: 12,
    backgroundColor: C.red,
    alignItems: "center",
    justifyContent: "center",
  },
  itemIconRed: { backgroundColor: C.red },
  itemLabel: { fontSize: 14, fontWeight: "600", color: C.black },
  version: {
    textAlign: "center",
    fontSize: 11,
    color: C.border,
    paddingVertical: 16,
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// TAB 1: DIGITAL TWIN
// ─────────────────────────────────────────────────────────────────────────────
function DigitalTwinTab() {
  const [mainTab, setMainTab] = useState<"utilizers" | "physical">("utilizers");
  const [subTab, setSubTab] = useState<"shoes" | "water" | "supplement">(
    "shoes",
  );

  const DT_ITT = require("../../assets/images/DTW.png");

  return (
    <View>
      {/* Title */}
      <Text style={dt.pageTitle}>Digital Twin</Text>
      <Text style={dt.pageSub}>Your ITT device live data</Text>

      {/* Avatar + floating stats */}
      <View style={dt.avatarSection}>
        {/* background card */}
        <View style={dt.avatarBg}>
          <Image source={DT_ITT} style={dt.avatarImg} resizeMode="contain" />
        </View>

        {/* floating stat cards */}
        {/* Top-left: Heart Rate */}
        <View style={[dt.statFloat, dt.statFloatTL]}>
          <View style={dt.statFloatIcon}>
            <Ionicons name="heart" size={18} color={C.red} />
          </View>
          <View>
            <Text style={dt.statFloatVal}>72 bpm</Text>
            <Text style={dt.statFloatLabel}>Heart Rate</Text>
          </View>
        </View>

        {/* Top-right: Calories */}
        <View style={[dt.statFloat, dt.statFloatTR]}>
          <View style={dt.statFloatIcon}>
            <Ionicons name="flame" size={18} color={C.red} />
          </View>
          <View>
            <Text style={dt.statFloatVal}>802 kcal</Text>
            <Text style={dt.statFloatLabel}>Calories Burned</Text>
          </View>
        </View>

        {/* Bottom-left: Steps */}
        <View style={[dt.statFloat, dt.statFloatBL]}>
          <View style={dt.statFloatIcon}>
            <Ionicons name="footsteps" size={18} color={C.red} />
          </View>
          <View>
            <Text style={dt.statFloatVal}>12,000</Text>
            <Text style={dt.statFloatLabel}>Step Count</Text>
          </View>
        </View>

        {/* Bottom-right: Distance */}
        <View style={[dt.statFloat, dt.statFloatBR]}>
          <View style={dt.statFloatIcon}>
            <Ionicons name="navigate" size={18} color={C.red} />
          </View>
          <View>
            <Text style={dt.statFloatVal}>13.4 km</Text>
            <Text style={dt.statFloatLabel}>Distance Ran</Text>
          </View>
        </View>
      </View>

      {/* Main tab toggle */}
      <View style={dt.mainToggleWrap}>
        {(["utilizers", "physical"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[
              dt.mainToggleBtn,
              mainTab === tab && dt.mainToggleBtnActive,
            ]}
            onPress={() => setMainTab(tab)}
            activeOpacity={0.8}
          >
            <Text
              style={[
                dt.mainToggleText,
                mainTab === tab && dt.mainToggleTextActive,
              ]}
            >
              {tab === "utilizers" ? "Utilizers" : "Physical"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sub-tabs (Utilizers only) */}
      {mainTab === "utilizers" && (
        <>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={dt.subTabRow}
          >
            {(["shoes", "water", "supplement"] as const).map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[dt.subTabBtn, subTab === tab && dt.subTabBtnActive]}
                onPress={() => setSubTab(tab)}
                activeOpacity={0.8}
              >
                <Ionicons
                  name={
                    tab === "shoes"
                      ? "footsteps"
                      : tab === "water"
                        ? "water-outline"
                        : "flask-outline"
                  }
                  size={14}
                  color={subTab === tab ? C.white : C.black}
                />
                <Text
                  style={[dt.subTabText, subTab === tab && dt.subTabTextActive]}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          {/* Shoes */}
          {subTab === "shoes" && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={dt.shoeScroll}
            >
              {DT_SHOES.map((shoe) => {
                const pct = shoe.km / shoe.max;
                const warn = pct > 0.75;
                return (
                  <View key={shoe.id} style={dt.shoeCard}>
                    <Image
                      source={{ uri: shoe.img }}
                      style={dt.shoeImg}
                      resizeMode="cover"
                    />
                    <View style={dt.shoeInfo}>
                      <Text style={dt.shoeBrand}>{shoe.brand}</Text>
                      <Text style={dt.shoeName}>{shoe.name}</Text>
                      <Text style={dt.shoeSize}>
                        Size {shoe.size} · {shoe.color}
                      </Text>
                      <View style={dt.shoeKmRow}>
                        <Text style={dt.shoeKm}>{shoe.km} km</Text>
                        <Text style={dt.shoeMax}>/ {shoe.max}</Text>
                        {warn && (
                          <View style={dt.warnTag}>
                            <Text style={dt.warnTagText}>Replace</Text>
                          </View>
                        )}
                      </View>
                      <View style={dt.shoeBar}>
                        <View
                          style={[
                            dt.shoeBarFill,
                            {
                              width: `${pct * 100}%` as any,
                              backgroundColor: warn ? C.red : C.black,
                            },
                          ]}
                        />
                      </View>
                    </View>
                  </View>
                );
              })}
            </ScrollView>
          )}

          {/* Water */}
          {subTab === "water" && (
            <View style={dt.waterCard}>
              <View style={dt.waterHeader}>
                <Ionicons name="water" size={22} color={C.red} />
                <Text style={dt.waterTitle}>Hydration Today</Text>
                <Text style={dt.waterGoal}>
                  {DT_WATER.current}L / {DT_WATER.goal}L
                </Text>
              </View>
              <View style={dt.waterTrack}>
                <View
                  style={[
                    dt.waterFill,
                    {
                      width:
                        `${(DT_WATER.current / DT_WATER.goal) * 100}%` as any,
                    },
                  ]}
                />
              </View>
              <Text style={dt.waterRemaining}>
                {(DT_WATER.goal - DT_WATER.current).toFixed(1)}L remaining to
                reach your goal
              </Text>
              <View style={dt.waterDivider} />
              {DT_WATER.logs.map((log, i) => (
                <View key={i} style={dt.waterLog}>
                  <View style={dt.waterLogDot} />
                  <Text style={dt.waterLogTime}>{log.time}</Text>
                  <Text style={dt.waterLogAmt}>{log.amount}</Text>
                </View>
              ))}
              <TouchableOpacity style={dt.waterAddBtn}>
                <Ionicons name="add-circle" size={16} color={C.white} />
                <Text style={dt.waterAddText}>Log Water Intake</Text>
              </TouchableOpacity>
            </View>
          )}

          {/* Supplements */}
          {subTab === "supplement" && (
            <View style={dt.suppList}>
              {DT_SUPPLEMENTS.map((sup) => (
                <View key={sup.id} style={dt.suppRow}>
                  <View style={[dt.suppIcon, sup.taken && dt.suppIconTaken]}>
                    <Ionicons
                      name={sup.icon}
                      size={18}
                      color={sup.taken ? C.white : C.black}
                    />
                  </View>
                  <View style={dt.suppInfo}>
                    <Text style={dt.suppName}>{sup.name}</Text>
                    <Text style={dt.suppDose}>
                      {sup.dose} · {sup.time}
                    </Text>
                  </View>
                  <View style={[dt.suppCheck, sup.taken && dt.suppCheckDone]}>
                    {sup.taken ? (
                      <Ionicons name="checkmark" size={14} color={C.white} />
                    ) : (
                      <Ionicons
                        name="ellipse-outline"
                        size={14}
                        color={C.grey}
                      />
                    )}
                  </View>
                </View>
              ))}
            </View>
          )}
        </>
      )}

      {/* Physical tab */}
      {mainTab === "physical" && (
        <View style={dt.physicalCard}>
          {[
            {
              label: "Resting Heart Rate",
              value: "62 bpm",
              icon: "heart-outline" as const,
              pct: 0.62,
            },
            {
              label: "VO₂ Max",
              value: "48.2",
              icon: "fitness-outline" as const,
              pct: 0.48,
            },
            {
              label: "Body Fat",
              value: "14.2%",
              icon: "body-outline" as const,
              pct: 0.14,
            },
            {
              label: "BMI",
              value: "22.4",
              icon: "scale-outline" as const,
              pct: 0.56,
            },
            {
              label: "HRV",
              value: "62 ms",
              icon: "pulse-outline" as const,
              pct: 0.62,
            },
          ].map((item, i) => (
            <View key={i} style={[dt.physRow, i > 0 && dt.physRowBorder]}>
              <View style={dt.physIcon}>
                <Ionicons name={item.icon} size={18} color={C.red} />
              </View>
              <View style={dt.physInfo}>
                <Text style={dt.physLabel}>{item.label}</Text>
                <View style={dt.physBar}>
                  <View
                    style={[
                      dt.physBarFill,
                      { width: `${item.pct * 100}%` as any },
                    ]}
                  />
                </View>
              </View>
              <Text style={dt.physValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
const dt = StyleSheet.create({
  pageTitle: {
    fontSize: 26,
    fontWeight: "900",
    color: C.black,
    textAlign: "center",
    letterSpacing: -0.5,
  },
  pageSub: {
    fontSize: 13,
    color: C.grey,
    textAlign: "center",
    marginBottom: 18,
    marginTop: 3,
  },
  avatarSection: { position: "relative", height: 340, marginBottom: 20 },
  avatarBg: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: C.lightgrey,
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarImg: { width: 220, height: 300 },
  statFloat: {
    position: "absolute",
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  statFloatTL: { top: 20, left: 15 },
  statFloatTR: { top: 20, right: 15 },
  statFloatBL: { bottom: 20, left: 15 },
  statFloatBR: { bottom: 20, right: 15 },
  statFloatIcon: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  statFloatVal: { fontSize: 14, fontWeight: "800", color: C.black },
  statFloatLabel: { fontSize: 11, color: C.grey, marginTop: 1 },
  mainToggleWrap: {
    flexDirection: "row",
    backgroundColor: C.lightgrey,
    borderRadius: 16,
    padding: 4,
    marginBottom: 14,
  },
  mainToggleBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 13,
    alignItems: "center",
  },
  mainToggleBtnActive: { backgroundColor: C.red },
  mainToggleText: { fontSize: 14, fontWeight: "700", color: C.black },
  mainToggleTextActive: { color: C.white },
  subTabRow: { gap: 8, paddingBottom: 14 },
  subTabBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    backgroundColor: C.lightgrey,
    paddingVertical: 9,
    paddingHorizontal: 16,
    borderRadius: 20,
  },
  subTabBtnActive: { backgroundColor: C.red },
  subTabText: { fontSize: 13, fontWeight: "700", color: C.black },
  subTabTextActive: { color: C.white },
  shoeScroll: { gap: 12, paddingBottom: 4 },
  shoeCard: {
    width: 200,
    backgroundColor: C.white,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  shoeImg: { width: "100%", height: 130 },
  shoeInfo: { padding: 14 },
  shoeBrand: {
    fontSize: 10,
    fontWeight: "800",
    color: C.grey,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  shoeName: { fontSize: 14, fontWeight: "800", color: C.black, marginTop: 2 },
  shoeSize: { fontSize: 11, color: C.grey, marginTop: 2 },
  shoeKmRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    marginTop: 8,
    marginBottom: 6,
  },
  shoeKm: { fontSize: 13, fontWeight: "700", color: C.black },
  shoeMax: { fontSize: 11, color: C.grey },
  warnTag: {
    backgroundColor: "#FFF0F0",
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: "auto" as any,
  },
  warnTagText: { fontSize: 10, fontWeight: "700", color: C.red },
  shoeBar: {
    height: 4,
    backgroundColor: C.lightgrey,
    borderRadius: 2,
    overflow: "hidden",
  },
  shoeBarFill: { height: "100%", borderRadius: 2 },
  waterCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 18,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  waterHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 14,
  },
  waterTitle: { fontSize: 16, fontWeight: "800", color: C.black, flex: 1 },
  waterGoal: { fontSize: 15, fontWeight: "700", color: C.red },
  waterTrack: {
    height: 8,
    backgroundColor: C.lightgrey,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 8,
  },
  waterFill: { height: "100%", backgroundColor: C.red, borderRadius: 4 },
  waterRemaining: { fontSize: 12, color: C.grey, marginBottom: 14 },
  waterDivider: { height: 1, backgroundColor: C.lightgrey, marginBottom: 12 },
  waterLog: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 10,
  },
  waterLogDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: C.red },
  waterLogTime: { fontSize: 13, color: C.grey, flex: 1 },
  waterLogAmt: { fontSize: 13, fontWeight: "700", color: C.black },
  waterAddBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: C.red,
    borderRadius: 14,
    paddingVertical: 14,
    marginTop: 14,
  },
  waterAddText: { fontSize: 14, fontWeight: "700", color: C.white },
  suppList: { gap: 0 },
  suppRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  suppIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: C.lightgrey,
    alignItems: "center",
    justifyContent: "center",
  },
  suppIconTaken: { backgroundColor: C.black },
  suppInfo: { flex: 1 },
  suppName: { fontSize: 14, fontWeight: "700", color: C.black },
  suppDose: { fontSize: 12, color: C.grey, marginTop: 2 },
  suppCheck: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: C.lightgrey,
    alignItems: "center",
    justifyContent: "center",
  },
  suppCheckDone: { backgroundColor: C.red },
  physicalCard: {
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  physRow: { flexDirection: "row", alignItems: "center", gap: 12, padding: 14 },
  physRowBorder: { borderTopWidth: 1, borderTopColor: C.lightgrey },
  physIcon: {
    width: 38,
    height: 38,
    borderRadius: 11,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  physInfo: { flex: 1 },
  physLabel: {
    fontSize: 13,
    fontWeight: "600",
    color: C.black,
    marginBottom: 6,
  },
  physBar: {
    height: 4,
    backgroundColor: C.lightgrey,
    borderRadius: 2,
    overflow: "hidden",
  },
  physBarFill: { height: "100%", backgroundColor: C.red, borderRadius: 2 },
  physValue: {
    fontSize: 14,
    fontWeight: "800",
    color: C.black,
    minWidth: 64,
    textAlign: "right",
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// TAB 2: VERVE COACH
// ─────────────────────────────────────────────────────────────────────────────
function VerveCoachTab() {
  const [coachStep, setCoachStep] = useState(0);
  const [runType, setRunType] = useState('Base Run');

  const COACH = require("../../assets/images/coachcpy.png");

  if (coachStep === 0) {
    return (
      <View style={co.welcomeWrap}>
        <Text style={co.welcomeTitle}>Welcome to{"\n"}Verve Coach</Text>
        <Text style={co.welcomeSub}>
          Your personalized running assistant. Let's set up your preferences to
          tailor your coaching experience.
        </Text>
        <Image source={COACH} style={co.coachImg} resizeMode="contain" />
        <TouchableOpacity
          style={co.startBtn}
          onPress={() => setCoachStep(1)}
          activeOpacity={0.88}
        >
          <Text style={co.startBtnText}>Get Started</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (coachStep === 1) {
    return (
      <View style={co.onboardWrap}>
        <Text style={co.onboardTitle}>Customize Your Journey</Text>
        <Text style={co.onboardSub}>
          Select preferences to tailor your Verve Coach guidance.
        </Text>
        <View style={co.onboardList}>
          {[
            { icon: "walk-outline", label: "Select your Run Type" },
            { icon: "analytics-outline", label: "Select your Running Surface" },
            { icon: "footsteps-outline", label: "Shoes" },
            { icon: "medkit-outline", label: "Injury Check" },
            { icon: "water-outline", label: "Hydration Check" },
            { icon: "nutrition-outline", label: "Supplements" },
          ].map((item, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={co.prefCard} 
              activeOpacity={0.8}
              onPress={() => { if (idx === 0) setCoachStep(3); }}
            >
              <Ionicons name={item.icon as any} size={22} color={C.black} style={co.prefIcon} />
              <Text style={co.prefText}>{item.label}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity
          style={co.activateBtn}
          onPress={() => setCoachStep(2)}
          activeOpacity={0.88}
        >
          <Text style={co.activateBtnText}>Activate Verve Coach</Text>
        </TouchableOpacity>
      </View>
    );
  }

  if (coachStep === 3) {
    return (
      <View style={co.onboardWrap}>
        <Text style={co.onboardTitle}>Define Your Run</Text>
        <Text style={co.onboardSub}>
          Choose the category that best matches your activity today. This helps us tailor the Verve Coach experience to your training needs.
        </Text>
        <ScrollView style={co.onboardList} showsVerticalScrollIndicator={false}>
          {[
            { name: "Base Run", desc: "A comfortable pace to build endurance and aerobic capacity." },
            { name: "Progression Run", desc: "Start slow, finish fast to improve stamina and speed." },
            { name: "Intervals", desc: "Alternating sprints with recovery to boost cardiovascular fitness" },
            { name: "Long Run", desc: "Extended distance at a steady pace for endurance" },
            { name: "Speed Play", desc: "Unstructured pace variation for fun and fitness." },
          ].map((rt, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={[co.prefCard, runType === rt.name && co.prefCardActive]} 
              activeOpacity={0.8}
              onPress={() => setRunType(rt.name)}
            >
              <View style={{ flex: 1 }}>
                <Text style={[co.prefText, runType === rt.name && co.prefTextActive, { marginBottom: 4 }]}>
                  {rt.name}
                </Text>
                <Text style={[co.prefDesc, runType === rt.name && co.prefDescActive]}>
                  {rt.desc}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
        <TouchableOpacity
          style={co.activateBtn}
          onPress={() => setCoachStep(1)}
          activeOpacity={0.88}
        >
          <Text style={co.activateBtnText}>Next</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View>
      <Text style={co.sectionTitle}>This Week's Plan</Text>
      <Text style={co.sectionSub}>2 of 7 sessions complete</Text>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={co.dayRow}
      >
        {COACH_PLAN.map((d) => (
          <View key={d.id} style={[co.dayCard, d.done && co.dayCardDone]}>
            {d.done && (
              <View style={co.dayDoneCheck}>
                <Ionicons name="checkmark" size={10} color={C.white} />
              </View>
            )}
            <Text style={[co.dayLabel, d.done && co.dayLabelDone]}>
              {d.day}
            </Text>
            <View style={[co.dayIconBox, d.done && co.dayIconBoxDone]}>
              <Ionicons
                name={
                  d.type === "run"
                    ? "walk"
                    : d.type === "gym"
                      ? "barbell-outline"
                      : d.type === "rest"
                        ? "bed-outline"
                        : "footsteps"
                }
                size={16}
                color={d.done ? C.white : C.black}
              />
            </View>
            <Text
              style={[co.dayTitle, d.done && co.dayTitleDone]}
              numberOfLines={2}
            >
              {d.title}
            </Text>
            <Text style={[co.dayDist, d.done && co.dayDistDone]}>{d.dist}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Progress ring */}
      <View style={co.progressCard}>
        <View style={co.progressRingWrap}>
          <Ring pct={2 / 7} color={C.red} size={80} strokeW={6} />
          <View style={co.progressRingCenter}>
            <Text style={co.progressRingText}>2/7</Text>
          </View>
        </View>
        <View style={co.progressRight}>
          <Text style={co.progressTitle}>Week Progress</Text>
          <Text style={co.progressSub}>2 sessions done, 5 remaining</Text>
          <View style={co.progressStatusRow}>
            <Ionicons name="checkmark-circle" size={14} color={C.red} />
            <Text style={co.progressStatus}>On track</Text>
          </View>
        </View>
      </View>

      {/* Today's workout */}
      <View style={co.todayCard}>
        <View style={co.todayHeader}>
          <View style={co.todayBadge}>
            <Text style={co.todayBadgeText}>TODAY</Text>
          </View>
          <Text style={co.todayTitle}>Tempo Run — 8 km</Text>
        </View>
        <Text style={co.todayDesc}>
          Maintain 5:20/km pace for 8 km. Warm up 1 km, tempo 6 km, cool down 1
          km.
        </Text>
        <View style={co.todayMetaRow}>
          {[
            { icon: "time-outline" as const, v: "~45 min" },
            { icon: "flame-outline" as const, v: "~480 kcal" },
            { icon: "speedometer-outline" as const, v: "5:20/km" },
          ].map((m, i) => (
            <View key={i} style={co.todayMeta}>
              <Ionicons name={m.icon} size={14} color={C.red} />
              <Text style={co.todayMetaText}>{m.v}</Text>
            </View>
          ))}
        </View>
        <TouchableOpacity style={co.startRunBtn}>
          <Ionicons name="play" size={16} color={C.white} />
          <Text style={co.startRunText}>Start Run</Text>
        </TouchableOpacity>
      </View>

      {/* Coach insights */}
      <View style={{ marginTop: 24 }}>
        <SH title="Coach Insights" />
        {COACH_INSIGHTS.map((tip, i) => (
          <View key={i} style={co.tipCard}>
            <View style={co.tipIcon}>
              <Ionicons name="bulb-outline" size={16} color={C.red} />
            </View>
            <Text style={co.tipText}>{tip}</Text>
          </View>
        ))}
      </View>

      {/* Recent sessions */}
      <View style={{ marginTop: 24 }}>
        <SH title="Recent Sessions" action="All" />
        {COACH_SESSIONS.map((s) => (
          <View key={s.id} style={co.sessionCard}>
            <View style={co.sessionIcon}>
              <Ionicons name="walk" size={18} color={C.red} />
            </View>
            <View style={co.sessionInfo}>
              <Text style={co.sessionTitle}>{s.title}</Text>
              <Text style={co.sessionDate}>{s.date}</Text>
            </View>
            <View style={co.sessionStats}>
              <Text style={co.sessionDist}>{s.dist}</Text>
              <Text style={co.sessionTime}>
                {s.time} · {s.pace}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}
const co = StyleSheet.create({
  welcomeWrap: { alignItems: "center", paddingBottom: 20 },
  welcomeTitle: {
    fontSize: 30,
    fontWeight: "900",
    color: C.black,
    textAlign: "center",
    letterSpacing: -0.6,
    lineHeight: 38,
  },
  welcomeSub: {
    fontSize: 14,
    color: C.grey,
    textAlign: "center",
    lineHeight: 22,
    marginTop: 10,
    marginBottom: 20,
    paddingHorizontal: 16,
  },
  coachImg: { width: W - 80, height: 340 },
  startBtn: {
    backgroundColor: C.red,
    borderRadius: 16,
    paddingVertical: 18,
    paddingHorizontal: 40,
    marginTop: 20,
  },
  startBtnText: {
    fontSize: 17,
    fontWeight: "800",
    color: C.white,
    letterSpacing: 0.2,
  },
  onboardWrap: { paddingTop: 10 },
  onboardTitle: { fontSize: 22, fontWeight: "900", color: C.black, marginBottom: 8 },
  onboardSub: { fontSize: 13, color: C.grey, marginBottom: 24 },
  onboardList: { gap: 12, marginBottom: 24 },
  prefCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.lightgrey,
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 8,
    gap: 20,
  },
  prefCardActive: { backgroundColor: "#2D2D2D" },
  prefIcon: { width: 28, textAlign: "center" },
  prefText: { fontSize: 14, fontWeight: "700", color: C.black },
  prefTextActive: { color: C.white },
  prefDesc: { fontSize: 12, color: "rgba(0,0,0,0.6)", lineHeight: 18 },
  prefDescActive: { color: "rgba(255,255,255,0.8)" },
  activateBtn: {
    backgroundColor: C.red,
    borderRadius: 8,
    paddingVertical: 18,
    alignItems: "center",
  },
  activateBtnText: {
    fontSize: 15,
    fontWeight: "800",
    color: C.white,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: C.black,
    letterSpacing: -0.4,
  },
  sectionSub: { fontSize: 13, color: C.grey, marginTop: 3, marginBottom: 14 },
  dayRow: { gap: 10, paddingBottom: 4 },
  dayCard: {
    width: 90,
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 12,
    alignItems: "center",
    gap: 7,
    borderWidth: 1.5,
    borderColor: C.border,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  dayCardDone: { backgroundColor: C.lightgrey, borderColor: C.lightgrey },
  dayDoneCheck: {
    position: "absolute",
    top: 8,
    right: 8,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: C.red,
    alignItems: "center",
    justifyContent: "center",
  },
  dayLabel: {
    fontSize: 11,
    fontWeight: "800",
    color: C.black,
    letterSpacing: 0.5,
  },
  dayLabelDone: { color: C.grey },
  dayIconBox: {
    width: 34,
    height: 34,
    borderRadius: 11,
    backgroundColor: C.lightgrey,
    alignItems: "center",
    justifyContent: "center",
  },
  dayIconBoxDone: { backgroundColor: C.red },
  dayTitle: {
    fontSize: 11,
    fontWeight: "600",
    color: C.black,
    textAlign: "center",
  },
  dayTitleDone: { color: C.grey },
  dayDist: { fontSize: 11, fontWeight: "700", color: C.red },
  dayDistDone: { color: C.grey },
  progressCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 20,
    padding: 20,
    marginTop: 14,
    gap: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 2,
  },
  progressRingWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  progressRingCenter: { position: "absolute", alignItems: "center" },
  progressRingText: { fontSize: 14, fontWeight: "900", color: C.red },
  progressRight: { flex: 1 },
  progressTitle: { fontSize: 16, fontWeight: "800", color: C.black },
  progressSub: { fontSize: 13, color: C.grey, marginTop: 3 },
  progressStatusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    marginTop: 8,
  },
  progressStatus: { fontSize: 12, fontWeight: "600", color: C.red },
  todayCard: {
    backgroundColor: C.black,
    borderRadius: 20,
    padding: 18,
    marginTop: 14,
    gap: 12,
  },
  todayHeader: { flexDirection: "row", alignItems: "center", gap: 10 },
  todayBadge: {
    backgroundColor: C.red,
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 4,
  },
  todayBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: C.white,
    letterSpacing: 0.5,
  },
  todayTitle: { fontSize: 15, fontWeight: "800", color: C.white, flex: 1 },
  todayDesc: { fontSize: 13, color: "rgba(255,255,255,0.7)", lineHeight: 20 },
  todayMetaRow: { flexDirection: "row", gap: 14 },
  todayMeta: { flexDirection: "row", alignItems: "center", gap: 5 },
  todayMetaText: {
    fontSize: 12,
    color: "rgba(255,255,255,0.7)",
    fontWeight: "600",
  },
  startRunBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    backgroundColor: C.red,
    borderRadius: 12,
    paddingVertical: 14,
  },
  startRunText: { fontSize: 14, fontWeight: "800", color: C.white },
  tipCard: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  tipIcon: {
    width: 36,
    height: 36,
    borderRadius: 11,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  tipText: { flex: 1, fontSize: 13, color: C.black, lineHeight: 20 },
  sessionCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: C.white,
    borderRadius: 16,
    padding: 14,
    marginBottom: 8,
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 1,
  },
  sessionIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: "#FFF0F0",
    alignItems: "center",
    justifyContent: "center",
  },
  sessionInfo: { flex: 1 },
  sessionTitle: { fontSize: 14, fontWeight: "700", color: C.black },
  sessionDate: { fontSize: 12, color: C.grey, marginTop: 2 },
  sessionStats: { alignItems: "flex-end" },
  sessionDist: { fontSize: 14, fontWeight: "800", color: C.black },
  sessionTime: { fontSize: 11, color: C.grey, marginTop: 2 },
});

// ─────────────────────────────────────────────────────────────────────────────
// TAB 3: SPARK MARKETPLACE
// ─────────────────────────────────────────────────────────────────────────────
function SparkTab() {
  const COIN_IMG = require("../../assets/images/coin.png");
  const [filter, setFilter] = useState<"product" | "content">("product");
  const [redeemed, setRedeemed] = useState<Set<string>>(
    new Set(
      [...SPARK_PRODUCTS, ...SPARK_CONTENT]
        .filter((i) => i.redeemed)
        .map((i) => i.id),
    ),
  );

  const items = filter === "product" ? SPARK_PRODUCTS : SPARK_CONTENT;

  return (
    <View>
      {/* Header banner */}
      <View style={[sk.headerBanner, { overflow: 'hidden' }]}>
        <Image source={COIN_IMG} style={[sk.bgCoin, { top: -20, left: -20, width: 100, height: 100, opacity: 0.25 }]} />
        <Image source={COIN_IMG} style={[sk.bgCoin, { top: 60, left: 30, width: 60, height: 60, opacity: 0.15 }]} />
        <Image source={COIN_IMG} style={[sk.bgCoin, { top: -10, right: -10, width: 90, height: 90, opacity: 0.3 }]} />
        <Image source={COIN_IMG} style={[sk.bgCoin, { bottom: 40, right: 30, width: 50, height: 50, opacity: 0.2 }]} />
        <Image source={COIN_IMG} style={[sk.bgCoin, { bottom: -20, left: 10, width: 120, height: 120, opacity: 0.3 }]} />
        <Image source={COIN_IMG} style={[sk.bgCoin, { bottom: -10, right: -40, width: 130, height: 130, opacity: 0.25 }]} />

        <Text style={sk.bannerTitle}>Spark Marketplace</Text>
        <View style={sk.pointsBlock}>
          <Text style={sk.pointsVal}>{SPARK_POINTS.toLocaleString()}</Text>
          <Text style={sk.pointsSub}>Total Spark Points</Text>
        </View>

        <View style={sk.toggleWrap}>
          {(["product", "content"] as const).map((tab) => (
            <TouchableOpacity
              key={tab}
              style={[sk.toggleBtn, filter === tab && sk.toggleBtnActive]}
              onPress={() => setFilter(tab)}
              activeOpacity={0.8}
            >
              <Text
                style={[sk.toggleText, filter === tab && sk.toggleTextActive]}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Ticket cards */}
      {items.map((item) => {
        const isRedeemed = redeemed.has(item.id);
        const canAfford = SPARK_POINTS >= item.points;
        return (
          <View key={item.id} style={sk.ticket}>
            {/* Left strip */}
            <View style={[sk.ticketStrip, { backgroundColor: item.color }]}>
              <Text style={sk.ticketStripText}>DISCOUNT</Text>
            </View>
            {/* Right content */}
            <View style={sk.ticketBody}>
              <Text style={sk.ticketBrand}>{item.brand}</Text>
              <Text style={sk.ticketName}>{item.name}</Text>
              <Text style={sk.ticketDesc}>{item.desc}</Text>
              <Text style={sk.ticketPoints}>
                Costs{" "}
                <Text style={{ color: C.red, fontWeight: "800" }}>
                  {item.points} POINTS
                </Text>
              </Text>
              <View style={sk.ticketDivider} />
              <View style={sk.ticketFooter}>
                <View>
                  <Text style={sk.expiresLabel}>Expires</Text>
                  <Text style={sk.expiresDate}>{item.expiry}</Text>
                </View>
                <TouchableOpacity
                  style={[
                    sk.redeemBtn,
                    isRedeemed && sk.redeemBtnDone,
                    !canAfford && !isRedeemed && sk.redeemBtnDisabled,
                  ]}
                  onPress={() => {
                    if (!isRedeemed && canAfford) {
                      setRedeemed((prev) => new Set([...prev, item.id]));
                    }
                  }}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[sk.redeemText, isRedeemed && sk.redeemTextDone]}
                  >
                    {isRedeemed
                      ? "Redeemed"
                      : !canAfford
                        ? "Insufficient"
                        : "Redeem"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
}
const sk = StyleSheet.create({
  headerBanner: {
    backgroundColor: "#FCD261",
    borderRadius: 22,
    padding: 22,
    marginBottom: 18,
    alignItems: "center",
  },
  bannerTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: C.black,
    letterSpacing: -0.4,
    marginBottom: 10,
  },
  pointsBlock: { alignItems: "center", marginBottom: 12 },
  pointsVal: {
    fontSize: 52,
    fontWeight: "900",
    color: C.black,
    letterSpacing: -2,
  },
  pointsSub: { fontSize: 13, color: "rgba(0,0,0,0.6)", marginTop: -4 },
  pointsProgressWrap: { width: "100%", gap: 6 },
  pointsProgress: {
    height: 6,
    backgroundColor: "rgba(0,0,0,0.15)",
    borderRadius: 3,
    overflow: "hidden",
  },
  pointsProgressFill: {
    height: "100%",
    backgroundColor: C.red,
    borderRadius: 3,
  },
  pointsNext: {
    fontSize: 11,
    color: "rgba(0,0,0,0.5)",
    textAlign: "right",
  },
  bgCoin: { position: "absolute", resizeMode: "contain" },
  toggleWrap: {
    flexDirection: "row",
    backgroundColor: "#F5F5F5",
    borderRadius: 16,
    padding: 4,
    marginTop: 10,
    width: "100%",
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: 11,
    borderRadius: 13,
    alignItems: "center",
  },
  toggleBtnActive: { backgroundColor: C.red },
  toggleText: { fontSize: 14, fontWeight: "700", color: C.red },
  toggleTextActive: { color: C.white },
  ticket: {
    flexDirection: "row",
    backgroundColor: "#F9F5E7",
    borderRadius: 18,
    marginBottom: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: C.border,
    position: "relative",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 160,
  },
  ticketStrip: { width: 48, alignItems: "center", justifyContent: "center" },
  ticketStripText: {
    fontSize: 11,
    fontWeight: "900",
    color: C.white,
    letterSpacing: 2,
    transform: [{ rotate: "-90deg" }],
    width: 100,
    textAlign: "center",
  },
  ticketBody: { flex: 1, padding: 16, gap: 4 },
  ticketBrand: {
    fontSize: 10,
    fontWeight: "800",
    color: C.grey,
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
  ticketName: {
    fontSize: 15,
    fontWeight: "800",
    color: C.black,
    letterSpacing: -0.2,
  },
  ticketDesc: { fontSize: 12, color: C.grey, lineHeight: 18 },
  ticketPoints: { fontSize: 13, color: C.black, marginTop: 2 },
  ticketDivider: {
    borderTopWidth: 1,
    borderStyle: "dashed",
    borderColor: C.border,
    marginVertical: 8,
  },
  ticketFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  expiresLabel: {
    fontSize: 10,
    color: C.grey,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  expiresDate: {
    fontSize: 13,
    fontWeight: "700",
    color: C.black,
    marginTop: 2,
  },
  redeemBtn: {
    backgroundColor: C.red,
    borderRadius: 12,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  redeemBtnDone: { backgroundColor: C.white },
  redeemBtnDisabled: { backgroundColor: C.grey },
  redeemText: { fontSize: 13, fontWeight: "800", color: C.white },
  redeemTextDone: { color: C.black },
});

// ─────────────────────────────────────────────────────────────────────────────
// TAB 4: VERVE DOC
// ─────────────────────────────────────────────────────────────────────────────
function VerveDocTab() {
  const now = new Date();
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const dateStr = `${days[now.getDay()]}, ${months[now.getMonth()]} ${now.getDate()}`;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);

  const categoryDetails: Record<
    string,
    { items: { label: string; value: string }[] }
  > = {
    nut: {
      items: [
        { label: "Calories", value: "2,100 kcal" },
        { label: "Protein", value: "128g" },
        { label: "Carbs", value: "230g" },
        { label: "Fat", value: "65g" },
        { label: "Hydration", value: "1.8L / 2.8L" },
      ],
    },
    med: {
      items: [
        { label: "Vitamin D3", value: "Due at 8 AM" },
        { label: "Omega-3", value: "Due at 8 AM" },
        { label: "Magnesium", value: "Due at 10 PM" },
      ],
    },
    wh: {
      items: [
        { label: "Cycle Phase", value: "Ovulation" },
        { label: "Cycle Day", value: "14 of 28" },
        { label: "Next Period", value: "In 14 days" },
        { label: "Symptom Log", value: "No symptoms" },
      ],
    },
    mh: {
      items: [
        { label: "Mood Score", value: "8 / 10" },
        { label: "Stress Level", value: "Low" },
        { label: "Energy", value: "High" },
        { label: "Focus", value: "Good" },
      ],
    },
    slp: {
      items: [
        { label: "Total Sleep", value: "7h 32m" },
        { label: "Deep Sleep", value: "1h 48m" },
        { label: "REM Sleep", value: "1h 22m" },
        { label: "Sleep Score", value: "82 / 100" },
      ],
    },
  };

  return (
    <View>
      {/* Greeting */}
      <Text style={vd.dateText}>{dateStr}</Text>
      <Text style={vd.greetText}>Verve Doc</Text>

      {/* Wellness Score */}
      <View style={vd.scoreCard}>
        <View style={vd.scoreLeft}>
          <Text style={vd.scoreLabel}>Today's Wellness Score</Text>
          <Text style={vd.scoreVal}>{WELLNESS_SCORE}</Text>
        </View>
        <View style={vd.scoreRight}>
          <Ring
            pct={WELLNESS_SCORE / 100}
            color={C.red}
            size={72}
            strokeW={6}
          />
          <View style={vd.scoreRingCenter}>
            <Ionicons name="sparkles" size={16} color={C.red} />
          </View>
        </View>
        <View
          style={[
            vd.scoreBar,
            { position: "absolute", bottom: 0, left: 0, right: 0 },
          ]}
        >
          <View
            style={[vd.scoreBarFill, { width: `${WELLNESS_SCORE}%` as any }]}
          />
        </View>
      </View>

      {/* Health Categories */}
      <Text style={vd.catHeader}>Health Categories</Text>
      <Text style={vd.catSub}>Track and manage your health data</Text>

      <View style={vd.catGrid}>
        {DOC_CATEGORIES.slice(0, 4).map((cat) => (
          <TouchableOpacity
            key={cat.id}
            style={[vd.catCard, activeCategory === cat.id && vd.catCardActive]}
            onPress={() =>
              setActiveCategory(activeCategory === cat.id ? null : cat.id)
            }
            activeOpacity={0.8}
          >
            <View style={vd.catCardTop}>
              <Text
                style={[
                  vd.catCardLabel,
                  activeCategory === cat.id && vd.catCardLabelActive,
                ]}
              >
                {cat.label}
              </Text>
              <Ionicons
                name={cat.icon}
                size={22}
                color={activeCategory === cat.id ? C.white : C.red}
              />
            </View>
            <Text
              style={[
                vd.catCardDetail,
                activeCategory === cat.id && vd.catCardDetailActive,
              ]}
            >
              {cat.detail}
            </Text>
            <Text
              style={[
                vd.catCardSub,
                activeCategory === cat.id && vd.catCardSubActive,
              ]}
            >
              {cat.sub}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Sleep (half width) */}
      <TouchableOpacity
        style={[vd.catCardHalf, activeCategory === "slp" && vd.catCardActive]}
        onPress={() =>
          setActiveCategory(activeCategory === "slp" ? null : "slp")
        }
        activeOpacity={0.8}
      >
        <View style={vd.catCardTop}>
          <Text
            style={[
              vd.catCardLabel,
              activeCategory === "slp" && vd.catCardLabelActive,
            ]}
          >
            Sleep
          </Text>
          <Ionicons
            name="moon-outline"
            size={22}
            color={activeCategory === "slp" ? C.white : C.red}
          />
        </View>
        <Text
          style={[
            vd.catCardDetail,
            activeCategory === "slp" && vd.catCardDetailActive,
          ]}
        >
          7h 32m last night
        </Text>
        <Text
          style={[
            vd.catCardSub,
            activeCategory === "slp" && vd.catCardSubActive,
          ]}
        >
          Deep sleep: 1h 48m
        </Text>
      </TouchableOpacity>

      {/* Expanded detail panel */}
      {activeCategory && categoryDetails[activeCategory] && (
        <View style={vd.detailPanel}>
          <Text style={vd.detailTitle}>
            {DOC_CATEGORIES.find((c) => c.id === activeCategory)?.label ??
              "Sleep"}{" "}
            Details
          </Text>
          {categoryDetails[activeCategory].items.map((item, i) => (
            <View key={i} style={[vd.detailRow, i > 0 && vd.detailRowBorder]}>
              <Text style={vd.detailLabel}>{item.label}</Text>
              <Text style={vd.detailValue}>{item.value}</Text>
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
const vd = StyleSheet.create({
  dateText: { fontSize: 13, fontWeight: "600", color: C.grey, marginBottom: 3 },
  greetText: {
    fontSize: 28,
    fontWeight: "900",
    color: C.black,
    letterSpacing: -0.6,
    marginBottom: 18,
  },
  scoreCard: {
    backgroundColor: C.white,
    borderRadius: 22,
    padding: 20,
    marginBottom: 22,
    flexDirection: "row",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
    overflow: "hidden",
  },
  scoreLeft: { flex: 1 },
  scoreLabel: { fontSize: 13, color: C.grey, fontWeight: "500" },
  scoreVal: {
    fontSize: 52,
    fontWeight: "900",
    color: C.black,
    letterSpacing: -2,
    marginTop: 4,
  },
  scoreRight: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  scoreRingCenter: { position: "absolute" },
  scoreBar: { height: 5, backgroundColor: C.lightgrey, borderRadius: 0 },
  scoreBarFill: { height: "100%", backgroundColor: C.red },
  catHeader: {
    fontSize: 22,
    fontWeight: "900",
    color: C.black,
    letterSpacing: -0.4,
  },
  catSub: { fontSize: 13, color: C.grey, marginTop: 3, marginBottom: 16 },
  catGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginBottom: 12,
  },
  catCard: {
    width: (W - 52) / 2,
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 16,
    gap: 4,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  catCardActive: { backgroundColor: C.black, borderColor: C.black },
  catCardHalf: {
    width: (W - 52) / 2,
    backgroundColor: C.white,
    borderRadius: 18,
    padding: 16,
    gap: 4,
    borderWidth: 1.5,
    borderColor: C.border,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    marginBottom: 14,
  },
  catCardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6,
  },
  catCardLabel: { fontSize: 15, fontWeight: "800", color: C.black },
  catCardLabelActive: { color: C.white },
  catCardDetail: { fontSize: 13, fontWeight: "600", color: C.black },
  catCardDetailActive: { color: C.white },
  catCardSub: { fontSize: 11, color: C.grey },
  catCardSubActive: { color: "rgba(255,255,255,0.6)" },
  detailPanel: {
    backgroundColor: C.black,
    borderRadius: 20,
    padding: 18,
    marginBottom: 12,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: C.white,
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 10,
  },
  detailRowBorder: {
    borderTopWidth: 1,
    borderTopColor: "rgba(255,255,255,0.08)",
  },
  detailLabel: { fontSize: 13, color: "rgba(255,255,255,0.6)" },
  detailValue: { fontSize: 13, fontWeight: "700", color: C.white },
});

// ─────────────────────────────────────────────────────────────────────────────
// DOCK TABS
// ─────────────────────────────────────────────────────────────────────────────
const DOCK = [
  { id: "digital_twin", label: "Digital Twin", icon: "footsteps" as const },
  {
    id: "verve_coach",
    label: "Verve Coach",
    icon: "heart-circle-outline" as const,
  },
  { id: "spark", label: "Spark", icon: "flash" as const },
  { id: "verve_doc", label: "Verve Doc", icon: "medkit" as const },
];

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Homepage() {
  const [activeTab, setActiveTab] = useState("digital_twin");
  const [menuOpen, setMenuOpen] = useState(false);
  const [carouselIdx, setCarouselIdx] = useState(0);
  const carouselRef = useRef<FlatList>(null);
  const backPressedOnce = useRef(false);
  const autoTimer = useRef<ReturnType<typeof setInterval> | undefined>(
    undefined,
  );
  const scrollViewRef = useRef<ScrollView>(null);
  const tabContentY = useRef<{ [key: string]: number }>({}).current;
  const [isScrolling, setIsScrolling] = useState(false);

  // Auto-advance carousel
  useEffect(() => {
    autoTimer.current = setInterval(() => {
      setCarouselIdx((prev) => {
        const next = (prev + 1) % CAROUSEL.length;
        carouselRef.current?.scrollToIndex({ index: next, animated: true });
        return next;
      });
    }, 4000);
    return () => clearInterval(autoTimer.current);
  }, []);

  // Double-back exit
  useEffect(() => {
    if (Platform.OS !== "android") return;
    const h = BackHandler.addEventListener("hardwareBackPress", () => {
      if (menuOpen) {
        setMenuOpen(false);
        return true;
      }
      if (backPressedOnce.current) {
        BackHandler.exitApp();
        return true;
      }
      backPressedOnce.current = true;
      ToastAndroid.show("Press back again to exit", ToastAndroid.SHORT);
      setTimeout(() => {
        backPressedOnce.current = false;
      }, 2000);
      return true;
    });
    return () => h.remove();
  }, [menuOpen]);

  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);

    setTimeout(() => {
      if (tabContentY[tabId] !== undefined && scrollViewRef.current) {
        setIsScrolling(true);
        scrollViewRef.current.scrollTo({
          y: tabContentY[tabId] - 60,
          animated: true,
        });

        setTimeout(() => setIsScrolling(false), 500);
      }
    }, 100);
  };

  const onTabContentLayout = (tabId: string, y: number) => {
    tabContentY[tabId] = y;
  };

  const HERO_H = H * 0.46;

  return (
    <View style={g.root}>
      <StatusBar style="light" />
      <SideMenu visible={menuOpen} onClose={() => setMenuOpen(false)} />

      <ScrollView
        ref={scrollViewRef}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={g.scroll}
        bounces
        scrollEventThrottle={16}
      >
        {/* ── HERO CAROUSEL ── */}
        <View style={{ height: HERO_H, position: "relative" }}>
          <FlatList
            ref={carouselRef}
            data={CAROUSEL}
            keyExtractor={(i) => i.id}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            scrollEnabled
            onMomentumScrollEnd={(e) => {
              const idx = Math.round(e.nativeEvent.contentOffset.x / W);
              setCarouselIdx(idx);
              clearInterval(autoTimer.current);
            }}
            renderItem={({ item }) => (
              <View style={{ width: W, height: HERO_H }}>
                <Image
                  source={{ uri: item.uri }}
                  style={{
                    width: W,
                    height: HERO_H,
                    borderBottomLeftRadius: 30,
                    borderBottomRightRadius: 30,
                  }}
                  resizeMode="cover"
                />
              </View>
            )}
          />

          {/* Logo + menu (absolute, no overlay) */}
          <SafeAreaView style={g.heroTopBar} pointerEvents="box-none">
            <Text style={[g.logo, { fontFamily: "Alberto" }]}>Runverve</Text>
            <TouchableOpacity
              style={g.menuBtn}
              onPress={() => setMenuOpen(true)}
              activeOpacity={0.8}
            >
              <Ionicons name="menu" size={22} color={C.white} />
            </TouchableOpacity>
          </SafeAreaView>

          {/* Quote — bottom of hero, on the image */}
          <View style={g.quoteBox} pointerEvents="none">
            <Text style={g.quoteText}>"{CAROUSEL[carouselIdx].quote}"</Text>
            <Text style={g.quoteSub}>{CAROUSEL[carouselIdx].sub}</Text>
          </View>

          {/* Dots */}
          <View style={g.dotRow}>
            {CAROUSEL.map((_, i) => (
              <View
                key={i}
                style={[g.dot, i === carouselIdx ? g.dotActive : g.dotInactive]}
              />
            ))}
          </View>
        </View>

        {/* ── GREETING + STREAK ── */}
        <View style={g.greetRow}>
          <View>
            <Text style={g.greetName}>Hey, Hrishikesh</Text>
            <Text style={g.greetSub}>Sunday · March 15, 2026</Text>
          </View>
          <View style={g.streakBadge}>
            <Ionicons name="flame" size={14} color={C.red} />
            <Text style={g.streakText}>18-day streak</Text>
          </View>
        </View>

        {/* ── STATS ROW ── */}
        <View style={g.statsHeaderRow}>
          <Text style={[g.statsTitle, { color: '#FE0000' }]}>Today's Stats</Text>
          <TouchableOpacity>
            <Text style={g.statsLink}>See all</Text>
          </TouchableOpacity>
        </View>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={g.statsScroll}
        >
          {[
            {
              id: "hr",
              label: "Heart Rate",
              value: "72",
              unit: "bpm",
              icon: "heart" as const,
              pct: 0.72,
            },
            {
              id: "cal",
              label: "Calories",
              value: "802",
              unit: "kcal",
              icon: "flame" as const,
              pct: 0.8,
            },
            {
              id: "steps",
              label: "Steps",
              value: "12.4K",
              unit: "today",
              icon: "footsteps" as const,
              pct: 0.62,
            },
            {
              id: "dist",
              label: "Distance",
              value: "13.4",
              unit: "km",
              icon: "navigate" as const,
              pct: 0.67,
            },
            {
              id: "pace",
              label: "Avg Pace",
              value: "5:42",
              unit: "min/km",
              icon: "speedometer" as const,
              pct: 0.58,
            },
            {
              id: "sleep",
              label: "Sleep",
              value: "7.4",
              unit: "hrs",
              icon: "moon" as const,
              pct: 0.74,
            },
          ].map((stat, i) => {
            const isEven = i % 2 === 0;
            const isWhiteCard = stat.id === 'hr' || stat.id === 'steps' || stat.id === 'pace';
            return (
              <View
                key={stat.id}
                style={[
                  g.statCard,
                  isEven ? g.statCardDark : g.statCardLight,
                  isWhiteCard && { backgroundColor: '#FFFFFF' }
                ]}
              >
                <View style={g.ringWrap}>
                  <Ring
                    pct={stat.pct}
                    color={isWhiteCard ? C.red : (isEven ? C.white : C.red)}
                    size={58}
                    strokeW={5}
                  />
                  <View
                    style={[
                      g.ringCenter,
                      {
                        backgroundColor: isWhiteCard ? "#FFF0F0" : (isEven
                          ? "rgba(255,255,255,0.15)"
                          : "#FFF0F0"),
                      },
                    ]}
                  >
                    <Ionicons
                      name={stat.icon}
                      size={14}
                      color={isWhiteCard ? C.red : (isEven ? C.white : C.red)}
                    />
                  </View>
                </View>
                <Text style={[g.statVal, { color: isWhiteCard ? C.black : (isEven ? C.white : C.red) }]}>
                  {stat.value}
                </Text>
                <Text
                  style={[
                    g.statUnit,
                    { color: isWhiteCard ? C.grey : (isEven ? "rgba(255,255,255,0.6)" : C.grey) },
                  ]}
                >
                  {stat.unit}
                </Text>
                <Text
                  style={[
                    g.statLbl,
                    { color: isWhiteCard ? C.black : (isEven ? "rgba(255,255,255,0.8)" : C.black) },
                  ]}
                >
                  {stat.label}
                </Text>
              </View>
            );
          })}
        </ScrollView>

        {/* ── TAB CONTENT ── */}
        <View
          style={g.tabContent}
          onLayout={(e) =>
            onTabContentLayout("digital_twin", e.nativeEvent.layout.y)
          }
        >
          {activeTab === "digital_twin" && <DigitalTwinTab />}
        </View>

        {activeTab === "verve_coach" && (
          <View
            style={g.tabContent}
            onLayout={(e) =>
              onTabContentLayout("verve_coach", e.nativeEvent.layout.y)
            }
          >
            <VerveCoachTab />
          </View>
        )}

        {activeTab === "spark" && (
          <View
            style={g.tabContent}
            onLayout={(e) =>
              onTabContentLayout("spark", e.nativeEvent.layout.y)
            }
          >
            <SparkTab />
          </View>
        )}

        {activeTab === "verve_doc" && (
          <View
            style={g.tabContent}
            onLayout={(e) =>
              onTabContentLayout("verve_doc", e.nativeEvent.layout.y)
            }
          >
            <VerveDocTab />
          </View>
        )}

        <View style={{ height: 10 }} />
      </ScrollView>

      {/* ── DOCK ── */}
      <SafeAreaView edges={["bottom"]} style={g.dockSafe}>
        <View style={g.dock}>
          {DOCK.map((tab) => {
            const active = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[g.dockItem, active && g.dockItemActive]}
                onPress={() => handleTabChange(tab.id)}
                activeOpacity={0.75}
              >
                <View style={[g.dockIconWrap, active && g.dockIconWrapActive]}>
                  <Ionicons
                    name={tab.icon}
                    size={active ? 28 : 24}
                    color={active ? C.black : C.grey}
                  />
                </View>
                <Text style={[g.dockLabel, active && g.dockLabelActive]}>
                  {tab.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      </SafeAreaView>
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// GLOBAL STYLES
// ─────────────────────────────────────────────────────────────────────────────
const g = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  scroll: { paddingBottom: 20 },

  // Hero
  heroTopBar: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 22,
    paddingTop: 10,
    zIndex: 10,
  },
  logo: { fontSize: 28, fontWeight: "900", color: C.red, letterSpacing: -0.6 },
  menuBtn: {
    width: 42,
    height: 42,
    borderRadius: 14,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  quoteBox: { position: "absolute", bottom: 40, left: 22, right: 22 },
  quoteText: {
    fontSize: 17,
    fontWeight: "800",
    color: C.white,
    letterSpacing: -0.3,
    lineHeight: 24,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  quoteSub: {
    fontSize: 12,
    color: C.red,
    marginTop: 4,
    fontWeight: "600",
    textShadowColor: "rgba(0,0,0,0.4)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  dotRow: {
    position: "absolute",
    bottom: 16,
    left: 0,
    right: 0,
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  dot: { height: 5, borderRadius: 3 },
  dotActive: { width: 20, backgroundColor: C.red },
  dotInactive: { width: 5, backgroundColor: "rgba(255,255,255,0.4)" },

  // Greeting
  greetRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 6,
  },
  greetName: {
    fontSize: 22,
    fontWeight: "900",
    color: C.black,
    letterSpacing: -0.4,
  },
  greetSub: { fontSize: 12, color: C.grey, marginTop: 3 },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: C.white,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1.5,
    borderColor: C.red,
  },
  streakText: { fontSize: 12, fontWeight: "700", color: C.red },

  // Stats
  statsHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  statsTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: C.black,
    letterSpacing: -0.3,
  },
  statsLink: { fontSize: 13, fontWeight: "700", color: C.red },
  statsScroll: { paddingHorizontal: 20, gap: 10, paddingBottom: 4 },
  statCard: {
    width: 100,
    borderRadius: 20,
    padding: 12,
    alignItems: "center",
    gap: 3,
  },
  statCardDark: { backgroundColor: C.black },
  statCardLight: {
    backgroundColor: C.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  ringWrap: {
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
  },
  ringCenter: {
    position: "absolute",
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  statVal: {
    fontSize: 16,
    fontWeight: "900",
    letterSpacing: -0.3,
    marginTop: 4,
  },
  statUnit: { fontSize: 9, fontWeight: "500", marginTop: -2 },
  statLbl: { fontSize: 10, fontWeight: "600", textAlign: "center" },

  // Tab content
  tabContent: { paddingHorizontal: 20, marginTop: 24 },

  // Dock
  dockSafe: {
    backgroundColor: C.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  dock: {
    flexDirection: "row",
    paddingTop: 12,
    paddingBottom: 8,
    paddingHorizontal: 8,
    justifyContent: "space-around",
  },
  dockItem: { flex: 1, alignItems: "center", justifyContent: "flex-end", gap: 5 },
  dockItemActive: { overflow: "visible" },
  dockIconWrap: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  dockIconWrapActive: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: C.red,
    marginTop: -30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  dockLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: C.grey,
  },
  dockLabelActive: { color: C.red, fontWeight: "800" },
});
