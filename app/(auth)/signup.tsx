import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  SafeAreaView,
} from "react-native";

export default function SignupScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [focusedField, setFocusedField] = useState<string | null>(null);

  const isValid =
    username.length > 0 &&
    email.length > 0 &&
    password.length > 0 &&
    confirmPassword === password &&
    agreed;

  const handleSignup = () => {
    if (!isValid) return;
    // Dummy sign‑up – just redirect
    router.replace("/(fitness)/connect_fitness_app");
  };

  const handleGoogleSignUp = () => {
    // Dummy Google sign‑up – just redirect
    router.push("https://gmail.com");
  };

  return (
    <SafeAreaView style={styles.backgroundImage}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        <StatusBar style="dark" />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.overlay}>
            <View style={styles.header}>
              <View style={styles.logoMark}>
                <Ionicons name="person-add-outline" size={26} color="#E8272A" />
              </View>
              <Text style={styles.title}>Start Your Journey</Text>
              <Text style={styles.subtitle}>
                Create your new Runverve account and claim your Username
              </Text>
            </View>

            <View style={styles.form}>
              {/* Username */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>User Name</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "username" && styles.inputFocused,
                  ]}
                >
                  <Ionicons
                    name="at-outline"
                    size={18}
                    color={focusedField === "username" ? "#E8272A" : "#000000"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your username"
                    placeholderTextColor="#BDBDBD"
                    autoCapitalize="none"
                    value={username}
                    onChangeText={setUsername}
                    onFocus={() => setFocusedField("username")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Email */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Email ID</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "email" && styles.inputFocused,
                  ]}
                >
                  <Ionicons
                    name="mail-outline"
                    size={18}
                    color={focusedField === "email" ? "#E8272A" : "#000000"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your email ID"
                    placeholderTextColor="#BDBDBD"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                    onFocus={() => setFocusedField("email")}
                    onBlur={() => setFocusedField(null)}
                  />
                </View>
              </View>

              {/* Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "password" && styles.inputFocused,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={focusedField === "password" ? "#E8272A" : "#000000"}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter your new password"
                    placeholderTextColor="#BDBDBD"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                    onFocus={() => setFocusedField("password")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <Pressable
                    onPress={() => setShowPassword(!showPassword)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showPassword ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color="#000000"
                    />
                  </Pressable>
                </View>
              </View>

              {/* Confirm Password */}
              <View style={styles.fieldGroup}>
                <Text style={styles.label}>Re-enter Password</Text>
                <View
                  style={[
                    styles.inputWrapper,
                    focusedField === "confirm" && styles.inputFocused,
                    confirmPassword.length > 0 &&
                      confirmPassword !== password &&
                      styles.inputError,
                  ]}
                >
                  <Ionicons
                    name="lock-closed-outline"
                    size={18}
                    color={
                      confirmPassword.length > 0 && confirmPassword !== password
                        ? "#FF3B30"
                        : focusedField === "confirm"
                          ? "#E8272A"
                          : "#000000"
                    }
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter your password again"
                    placeholderTextColor="#BDBDBD"
                    secureTextEntry={!showConfirm}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setFocusedField("confirm")}
                    onBlur={() => setFocusedField(null)}
                  />
                  <Pressable
                    onPress={() => setShowConfirm(!showConfirm)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={showConfirm ? "eye-off-outline" : "eye-outline"}
                      size={18}
                      color="#000000"
                    />
                  </Pressable>
                </View>
                {confirmPassword.length > 0 && confirmPassword !== password && (
                  <Text style={styles.errorText}>Passwords do not match</Text>
                )}
              </View>

              {/* Terms */}
              <TouchableOpacity
                style={styles.checkRow}
                onPress={() => setAgreed(!agreed)}
                activeOpacity={0.5}
              >
                <View
                  style={[styles.checkbox, agreed && styles.checkboxChecked]}
                >
                  {agreed && (
                    <Ionicons name="checkmark" size={12} color="#000000" />
                  )}
                </View>
                <Text style={styles.checkText}>
                  By continuing, you agree to Runverve's{" "}
                  <Text style={styles.termsLink}>Terms & Conditions</Text>
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.actions}>
              <TouchableOpacity
                style={[
                  styles.primaryBtn,
                  !isValid && styles.primaryBtnDisabled,
                ]}
                onPress={handleSignup}
                activeOpacity={0.88}
              >
                <Text style={styles.primaryBtnText}>Sign up</Text>
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.divider} />
                <Text style={styles.orText}>or continue with</Text>
                <View style={styles.divider} />
              </View>

              <TouchableOpacity
                style={styles.googleBtn}
                onPress={handleGoogleSignUp}
                activeOpacity={1}
              >
                <View style={styles.googleIconBox}>
                  <Image
                    source={{
                      uri: "https://cdn-icons-png.flaticon.com/512/300/300221.png",
                    }}
                    style={{ width: 20, height: 20 }}
                    resizeMode="contain"
                  />
                </View>
                <Text style={styles.googleText}>Continue with Google</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.footerLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
    backgroundColor: "#ffffff",
  },
  container: {
    flex: 1,
  },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingTop: 1,
    paddingBottom: 1,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0)",
    borderRadius: 30,
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 30,
    marginVertical: 10,
  },
  header: { marginBottom: 30 },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: 14,
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: "#E8272A",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#E8272A",
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 15, color: "#000000", lineHeight: 22 },
  form: { gap: 18, marginBottom: 28 },
  fieldGroup: { gap: 8 },
  label: { fontSize: 13, fontWeight: "600", color: "#333", letterSpacing: 0.1 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 0.5,
    borderColor: "#000000",
    borderRadius: 4,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 4,
  },
  inputFocused: { borderColor: "#E8272A", backgroundColor: "#fff" },
  inputError: { borderColor: "#FF3B30" },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#111" },
  eyeBtn: { padding: 4 },
  errorText: { fontSize: 12, color: "#FF3B30", marginTop: 2 },
  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginTop: 4,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 5,
    borderWidth: 1.5,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 2,
    flexShrink: 0,
  },
  checkboxChecked: { backgroundColor: "#E8272A", borderColor: "#E8272A" },
  checkText: { flex: 1, color: "#000000", fontSize: 13, lineHeight: 20 },
  termsLink: {
    color: "#E8272A",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  actions: { gap: 14 },
  primaryBtn: {
    backgroundColor: "#E8272A",
    borderRadius: 14,
    paddingVertical: 18,
    alignItems: "center",
  },
  primaryBtnDisabled: { opacity: 0.5 },
  primaryBtnText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "700",
    letterSpacing: 0.2,
  },
  dividerRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  divider: { flex: 1, height: 1, backgroundColor: "#000000" },
  orText: { color: "#FE0000", fontSize: 12, fontWeight: "500" },
  googleBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    borderWidth: 1.5,
    borderColor: "#FE0000",
    borderRadius: 14,
    paddingVertical: 16,
    backgroundColor: "#FFFF",
  },
  googleIconBox: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: "transparent",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  googleText: { fontSize: 15, fontWeight: "600", color: "#FE0000" },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 32,
  },
  footerText: { color: "#000000", fontSize: 14 },
  footerLink: {
    color: "#E8272A",
    fontSize: 14,
    fontWeight: "700",
    textDecorationLine: "underline",
  },
});
