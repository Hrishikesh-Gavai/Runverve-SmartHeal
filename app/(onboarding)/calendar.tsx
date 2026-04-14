import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef, useState } from "react";
import {
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";

// ─── constants ────────────────────────────────────────────────────────────────
const DAYS_SHORT = ["S", "M", "T", "W", "T", "F", "S"];
const MONTHS_LONG = [
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
const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
const DAYS_LONG = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const CURRENT_YEAR = new Date().getFullYear();
const YEARS = Array.from({ length: 100 }, (_, i) => CURRENT_YEAR - i);

// ─── helpers ──────────────────────────────────────────────────────────────────
function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}
function getFirstDay(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}
function pad(n: number) {
  return String(n).padStart(2, "0");
}
function formatDisplay(d: Date) {
  return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}/${d.getFullYear()}`;
}
function formatHeader(d: Date) {
  return `${DAYS_LONG[d.getDay()]}, ${MONTHS_SHORT[d.getMonth()]} ${d.getDate()}`;
}
function parseManual(str: string): Date | null {
  const parts = str.split("/");
  if (parts.length !== 3) return null;
  const [dd, mm, yyyy] = parts.map(Number);
  if (!dd || !mm || !yyyy || yyyy < 1900 || yyyy > CURRENT_YEAR) return null;
  if (mm < 1 || mm > 12) return null;
  if (dd < 1 || dd > getDaysInMonth(yyyy, mm - 1)) return null;
  return new Date(yyyy, mm - 1, dd);
}

// ─── PickerModal ──────────────────────────────────────────────────────────────
function PickerModal({
  visible,
  title,
  items,
  selected,
  onSelect,
  onClose,
}: {
  visible: boolean;
  title: string;
  items: string[];
  selected: string;
  onSelect: (v: string) => void;
  onClose: () => void;
}) {
  const scrollRef = useRef<ScrollView>(null);
  const selIdx = items.indexOf(selected);

  useEffect(() => {
    if (visible && selIdx >= 0) {
      setTimeout(() => {
        scrollRef.current?.scrollTo({ y: selIdx * 52, animated: false });
      }, 80);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="slide">
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={pm.overlay}>
          <TouchableWithoutFeedback>
            <View style={pm.sheet}>
              <View style={pm.sheetHeader}>
                <Text style={pm.sheetTitle}>{title}</Text>
                <TouchableOpacity
                  onPress={onClose}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                >
                  <Ionicons name="close" size={22} color="#333" />
                </TouchableOpacity>
              </View>
              <ScrollView ref={scrollRef} showsVerticalScrollIndicator={false}>
                {items.map((item) => {
                  const isSel = item === selected;
                  return (
                    <TouchableOpacity
                      key={item}
                      style={[pm.item, isSel && pm.itemSelected]}
                      onPress={() => {
                        onSelect(item);
                        onClose();
                      }}
                      activeOpacity={0.7}
                    >
                      <Text style={[pm.itemText, isSel && pm.itemTextSelected]}>
                        {item}
                      </Text>
                      {isSel && (
                        <Ionicons name="checkmark" size={18} color="#E8272A" />
                      )}
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}

const pm = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: 380,
    paddingBottom: 32,
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  sheetTitle: { fontSize: 16, fontWeight: "700", color: "#111" },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F8F8F8",
  },
  itemSelected: { backgroundColor: "#FFF5F5" },
  itemText: { fontSize: 15, color: "#333" },
  itemTextSelected: { color: "#E8272A", fontWeight: "700" },
});

// ─── main screen ──────────────────────────────────────────────────────────────
type InputMode = "calendar" | "manual";

export default function CalendarScreen() {
  const router = useRouter();
  const today = new Date();

  const [viewYear, setViewYear] = useState(today.getFullYear());
  const [viewMonth, setViewMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [inputMode, setInputMode] = useState<InputMode>("calendar");
  const [manualInput, setManualInput] = useState("");
  const [manualError, setManualError] = useState("");
  const [showMonthPicker, setShowMonthPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDay(viewYear, viewMonth);
  const cells: (number | null)[] = [
    ...Array(firstDay).fill(null),
    ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
  ];

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else setViewMonth((m) => m + 1);
  };

  const selectDay = (day: number) => {
    const d = new Date(viewYear, viewMonth, day);
    setSelectedDate(d);
    setManualInput(formatDisplay(d));
    setManualError("");
  };

  const handleManualChange = (text: string) => {
    let raw = text.replace(/\D/g, "");
    if (raw.length > 8) raw = raw.slice(0, 8);
    let formatted = raw;
    if (raw.length > 2) formatted = raw.slice(0, 2) + "/" + raw.slice(2);
    if (raw.length > 4)
      formatted = raw.slice(0, 2) + "/" + raw.slice(2, 4) + "/" + raw.slice(4);
    setManualInput(formatted);
    setManualError("");
    if (raw.length === 8) {
      const parsed = parseManual(formatted);
      if (parsed) {
        setSelectedDate(parsed);
        setViewMonth(parsed.getMonth());
        setViewYear(parsed.getFullYear());
      } else {
        setSelectedDate(null);
        setManualError("Invalid date. Use DD/MM/YYYY");
      }
    } else {
      setSelectedDate(null);
    }
  };

  const handleClear = () => {
    setSelectedDate(null);
    setManualInput("");
    setManualError("");
  };

  const isSelected = (day: number) =>
    !!selectedDate &&
    selectedDate.getDate() === day &&
    selectedDate.getMonth() === viewMonth &&
    selectedDate.getFullYear() === viewYear;

  const isToday = (day: number) =>
    today.getDate() === day &&
    today.getMonth() === viewMonth &&
    today.getFullYear() === viewYear;

  const isFuture = (day: number) => new Date(viewYear, viewMonth, day) > today;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar style="dark" />

      <PickerModal
        visible={showMonthPicker}
        title="Select Month"
        items={MONTHS_LONG}
        selected={MONTHS_LONG[viewMonth]}
        onSelect={(m) => setViewMonth(MONTHS_LONG.indexOf(m))}
        onClose={() => setShowMonthPicker(false)}
      />
      <PickerModal
        visible={showYearPicker}
        title="Select Year"
        items={YEARS.map(String)}
        selected={String(viewYear)}
        onSelect={(y) => setViewYear(Number(y))}
        onClose={() => setShowYearPicker(false)}
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        {/* ─── Everything scrolls together so nothing is hidden ─── */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View>
              {/* Page header */}
              <View style={styles.header}>
                <Text style={styles.title}>When is your Birthday?</Text>
                <Text style={styles.subtitle}>
                  We would like to have the following information to provide
                  more accurate results.
                </Text>
              </View>

              {/* Mode toggle */}
              <View style={styles.modeToggle}>
                <TouchableOpacity
                  style={[
                    styles.modeBtn,
                    inputMode === "calendar" && styles.modeBtnActive,
                  ]}
                  onPress={() => setInputMode("calendar")}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="calendar-outline"
                    size={15}
                    color={inputMode === "calendar" ? "#E8272A" : "#888"}
                  />
                  <Text
                    style={[
                      styles.modeBtnText,
                      inputMode === "calendar" && styles.modeBtnTextActive,
                    ]}
                  >
                    Calendar
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.modeBtn,
                    inputMode === "manual" && styles.modeBtnActive,
                  ]}
                  onPress={() => setInputMode("manual")}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name="create-outline"
                    size={15}
                    color={inputMode === "manual" ? "#E8272A" : "#888"}
                  />
                  <Text
                    style={[
                      styles.modeBtnText,
                      inputMode === "manual" && styles.modeBtnTextActive,
                    ]}
                  >
                    Type Date
                  </Text>
                </TouchableOpacity>
              </View>

              {/* Calendar card */}
              <View style={styles.calendarCard}>
                {/* Selected date header */}
                <View style={styles.calendarHeader}>
                  <Text style={styles.selectDateLabel}>SELECTED DATE</Text>
                  <View style={styles.selectedDateRow}>
                    <Text
                      style={[
                        styles.selectedDateText,
                        !selectedDate && styles.placeholderText,
                      ]}
                    >
                      {selectedDate
                        ? formatHeader(selectedDate)
                        : "Pick a date"}
                    </Text>
                    <TouchableOpacity
                      onPress={() =>
                        setInputMode(
                          inputMode === "manual" ? "calendar" : "manual",
                        )
                      }
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Ionicons
                        name={
                          inputMode === "manual"
                            ? "calendar-outline"
                            : "pencil-outline"
                        }
                        size={18}
                        color="#555"
                      />
                    </TouchableOpacity>
                  </View>
                  {selectedDate && (
                    <Text style={styles.selectedDateSub}>
                      {formatDisplay(selectedDate)}
                    </Text>
                  )}
                </View>

                <View style={styles.divider} />

                {/* ── MANUAL MODE ── */}
                {inputMode === "manual" ? (
                  <View style={styles.manualSection}>
                    <Text style={styles.manualLabel}>
                      ENTER DATE (DD/MM/YYYY)
                    </Text>
                    <View
                      style={[
                        styles.manualInputRow,
                        !!manualError && styles.manualInputError,
                      ]}
                    >
                      <Ionicons
                        name="calendar-outline"
                        size={18}
                        color={manualError ? "#E8272A" : "#BDBDBD"}
                        style={{ marginRight: 10 }}
                      />
                      <TextInput
                        style={styles.manualInput}
                        placeholder="DD / MM / YYYY"
                        placeholderTextColor="#BDBDBD"
                        keyboardType="numeric"
                        value={manualInput}
                        onChangeText={handleManualChange}
                        maxLength={10}
                        autoFocus
                      />
                      {manualInput.length > 0 && (
                        <TouchableOpacity
                          onPress={handleClear}
                          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                        >
                          <Ionicons
                            name="close-circle"
                            size={18}
                            color="#BDBDBD"
                          />
                        </TouchableOpacity>
                      )}
                    </View>
                    {manualError ? (
                      <View style={styles.errorRow}>
                        <Ionicons
                          name="alert-circle-outline"
                          size={13}
                          color="#E8272A"
                        />
                        <Text style={styles.errorText}>{manualError}</Text>
                      </View>
                    ) : (
                      <Text style={styles.manualHint}>
                        Enter your birth date in day / month / year format
                      </Text>
                    )}

                    <Text style={styles.quickLabel}>QUICK YEAR SELECT</Text>
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                    >
                      {[1970, 1975, 1980, 1985, 1990, 1995, 2000, 2005].map(
                        (y) => (
                          <TouchableOpacity
                            key={y}
                            style={[
                              styles.yearChip,
                              viewYear === y && styles.yearChipActive,
                            ]}
                            onPress={() => {
                              setViewYear(y);
                              if (manualInput.length >= 7) {
                                const parts = manualInput.split("/");
                                if (parts.length >= 2) {
                                  handleManualChange(
                                    (parts[0] + parts[1] + String(y)).replace(
                                      /\D/g,
                                      "",
                                    ),
                                  );
                                }
                              }
                            }}
                          >
                            <Text
                              style={[
                                styles.yearChipText,
                                viewYear === y && styles.yearChipTextActive,
                              ]}
                            >
                              {y}
                            </Text>
                          </TouchableOpacity>
                        ),
                      )}
                    </ScrollView>
                  </View>
                ) : (
                  /* ── CALENDAR MODE ── */
                  <>
                    {/* Month + Year chips + arrows */}
                    <View style={styles.monthNav}>
                      <View style={styles.monthYearRow}>
                        <TouchableOpacity
                          style={styles.monthYearChip}
                          onPress={() => setShowMonthPicker(true)}
                        >
                          <Text style={styles.monthYearText}>
                            {MONTHS_LONG[viewMonth]}
                          </Text>
                          <Ionicons
                            name="chevron-down"
                            size={13}
                            color="#E8272A"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={styles.monthYearChip}
                          onPress={() => setShowYearPicker(true)}
                        >
                          <Text style={styles.monthYearText}>{viewYear}</Text>
                          <Ionicons
                            name="chevron-down"
                            size={13}
                            color="#E8272A"
                          />
                        </TouchableOpacity>
                      </View>
                      <View style={styles.monthNavArrows}>
                        <TouchableOpacity
                          onPress={prevMonth}
                          style={styles.arrowBtn}
                        >
                          <Ionicons
                            name="chevron-back"
                            size={18}
                            color="#555"
                          />
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={nextMonth}
                          style={styles.arrowBtn}
                        >
                          <Ionicons
                            name="chevron-forward"
                            size={18}
                            color="#555"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>

                    {/* Day headers — RED */}
                    <View style={styles.dayHeaderRow}>
                      {DAYS_SHORT.map((d, i) => (
                        <View key={i} style={styles.dayHeaderCell}>
                          <Text style={styles.dayHeaderText}>{d}</Text>
                        </View>
                      ))}
                    </View>

                    {/* Calendar grid */}
                    <View style={styles.grid}>
                      {cells.map((day, idx) => {
                        if (!day)
                          return (
                            <View key={`e-${idx}`} style={styles.gridCell} />
                          );
                        const sel = isSelected(day);
                        const tod = isToday(day);
                        const future = isFuture(day);
                        return (
                          <TouchableOpacity
                            key={`d-${day}`}
                            style={styles.gridCell}
                            onPress={() => !future && selectDay(day)}
                            activeOpacity={future ? 1 : 0.7}
                            disabled={future}
                          >
                            <View
                              style={[
                                styles.dayCellInner,
                                sel && styles.dayCellSelected,
                                tod && !sel && styles.dayCellToday,
                              ]}
                            >
                              <Text
                                style={[
                                  styles.dayText,
                                  sel && styles.dayTextSelected,
                                  tod && !sel && styles.dayTextToday,
                                  future && styles.dayTextFuture,
                                ]}
                              >
                                {day}
                              </Text>
                            </View>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </>
                )}

                {/* Footer */}
                <View style={styles.calFooter}>
                  <TouchableOpacity
                    onPress={handleClear}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                  >
                    <Text style={styles.calFooterBtn}>Clear</Text>
                  </TouchableOpacity>
                  <View style={styles.calFooterRight}>
                    <TouchableOpacity
                      onPress={() => router.back()}
                      style={{ marginRight: 24 }}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text style={styles.calFooterBtn}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      onPress={() =>
                        selectedDate && router.push("/(onboarding)/height")
                      }
                      disabled={!selectedDate}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    >
                      <Text
                        style={[
                          styles.calFooterBtn,
                          !selectedDate && styles.calFooterBtnDisabled,
                        ]}
                      >
                        OK
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {/* Bottom nav — inside scroll, always reachable */}
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
                  onPress={() =>
                    selectedDate && router.push("/(onboarding)/height")
                  }
                  activeOpacity={selectedDate ? 0.88 : 1}
                >
                  <Text style={styles.continueBtnText}>Continue</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

// ─── styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: "#fff" },

  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 40,
  },

  header: { marginBottom: 16 },
  title: {
    fontSize: 26,
    fontWeight: "800",
    color: "#111",
    marginBottom: 8,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 14, color: "#888", lineHeight: 22 },

  // Mode toggle
  modeToggle: {
    flexDirection: "row",
    backgroundColor: "#F2F2F2",
    borderRadius: 12,
    padding: 4,
    marginBottom: 14,
    gap: 4,
  },
  modeBtn: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 10,
    borderRadius: 10,
  },
  modeBtnActive: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  modeBtnText: { fontSize: 13, fontWeight: "600", color: "#888" },
  modeBtnTextActive: { color: "#E8272A" },

  // Calendar card
  calendarCard: {
    backgroundColor: "#F2F2F2",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 20,
  },

  calendarHeader: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 12,
  },
  selectDateLabel: {
    fontSize: 10,
    color: "#BDBDBD",
    fontWeight: "700",
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  selectedDateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  selectedDateText: { fontSize: 24, fontWeight: "400", color: "#111" },
  placeholderText: { color: "#BDBDBD", fontSize: 18 },
  selectedDateSub: { fontSize: 12, color: "#999", marginTop: 3 },

  divider: { height: 1, backgroundColor: "#DCDCDC" },

  // Month nav
  monthNav: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  monthYearRow: { flexDirection: "row", gap: 6 },
  monthYearChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },
  monthYearText: { fontSize: 13, fontWeight: "700", color: "#222" },
  monthNavArrows: { flexDirection: "row", gap: 4 },
  arrowBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#E8E8E8",
  },

  // Day headers — red
  dayHeaderRow: {
    flexDirection: "row",
    paddingHorizontal: 6,
    marginBottom: 2,
  },
  dayHeaderCell: { flex: 1, alignItems: "center", paddingVertical: 4 },
  dayHeaderText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#E8272A", // ← RED
    letterSpacing: 0.3,
  },

  // Grid
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 6,
    paddingBottom: 6,
  },
  gridCell: {
    width: "14.28%",
    aspectRatio: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },
  dayCellInner: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  dayCellSelected: { backgroundColor: "#E8272A" },
  dayCellToday: { borderWidth: 1.5, borderColor: "#E8272A" },
  dayText: { fontSize: 13, color: "#333", fontWeight: "400" },
  dayTextSelected: { color: "#fff", fontWeight: "700" },
  dayTextToday: { color: "#E8272A", fontWeight: "700" },
  dayTextFuture: { color: "#D0D0D0" },

  // Footer
  calFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "#DCDCDC",
  },
  calFooterRight: { flexDirection: "row", alignItems: "center" },
  calFooterBtn: { fontSize: 14, fontWeight: "700", color: "#E8272A" },
  calFooterBtnDisabled: { color: "#BDBDBD" },

  // Manual mode
  manualSection: { padding: 14, gap: 10 },
  manualLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: "#BDBDBD",
    letterSpacing: 0.8,
  },
  manualInputRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 8,
  },
  manualInputError: { borderColor: "#E8272A" },
  manualInput: {
    flex: 1,
    fontSize: 20,
    color: "#111",
    fontWeight: "500",
    letterSpacing: 2,
  },
  manualHint: { fontSize: 12, color: "#BDBDBD" },
  errorRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  errorText: { fontSize: 12, color: "#E8272A", fontWeight: "500" },

  quickLabel: {
    fontSize: 10,
    color: "#BDBDBD",
    fontWeight: "700",
    letterSpacing: 0.8,
    marginTop: 4,
  },
  yearChip: {
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    borderRadius: 20,
    paddingVertical: 7,
    paddingHorizontal: 16,
    marginRight: 8,
    backgroundColor: "#fff",
  },
  yearChipActive: { backgroundColor: "#E8272A", borderColor: "#E8272A" },
  yearChipText: { fontSize: 13, fontWeight: "600", color: "#555" },
  yearChipTextActive: { color: "#fff" },

  // Bottom nav
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
  continueBtnDisabled: { opacity: 0.38 },
  continueBtnText: { color: "#fff", fontSize: 16, fontWeight: "700" },
});
