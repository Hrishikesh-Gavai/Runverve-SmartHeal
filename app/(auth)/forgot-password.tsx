import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useState } from "react";
import {
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const BACKGROUND_IMAGE =
  "https://images.unsplash.com/photo-1524230572899-a752b3835840?q=80&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D";

type Step = "input" | "sent";

export default function ForgotPasswordScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [focusedField, setFocusedField] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("input");

  const handleSend = () => {
    if (!email) return;
    // Dummy – just show success
    setStep("sent");
  };

  return (
    <ImageBackground
      source={{ uri: BACKGROUND_IMAGE }}
      style={styles.backgroundImage}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "android" ? "padding" : "height"}
      >
        <StatusBar style="light" />
        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.overlay}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => router.back()}
            >
              <Ionicons name="arrow-back" size={20} color="#000000" />
            </TouchableOpacity>

            {step === "input" ? (
              <>
                <View style={styles.header}>
                  <View style={styles.logoMark}>
                    <Ionicons
                      name="lock-open-outline"
                      size={26}
                      color="#E8272A"
                    />
                  </View>
                  <Text style={styles.title}>Forgot Password?</Text>
                  <Text style={styles.subtitle}>
                    No worries! Enter your registered email address and we'll
                    send you a link to reset your password.
                  </Text>
                </View>

                <View style={styles.form}>
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
                        placeholder="Enter your registered email"
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

                  <TouchableOpacity
                    style={[
                      styles.primaryBtn,
                      !email && styles.primaryBtnDisabled,
                    ]}
                    onPress={handleSend}
                    activeOpacity={0.88}
                  >
                    <Text style={styles.primaryBtnText}>Send Reset Link</Text>
                  </TouchableOpacity>
                </View>
              </>
            ) : (
              <View style={styles.successContainer}>
                <View style={styles.logoMark}>
                  <Ionicons name="checkmark-circle" size={26} color="#E8272A" />
                </View>
                <Text style={styles.successTitle}>Check your inbox!</Text>
                <Text style={styles.successDesc}>
                  We've sent a password reset link to
                </Text>
                <Text style={styles.successEmail}>{email}</Text>
                <Text style={styles.successNote}>
                  Didn't receive the email? Check your spam folder or try again.
                </Text>

                <TouchableOpacity
                  style={styles.primaryBtn}
                  onPress={() => router.push("/(auth)/login")}
                  activeOpacity={0.88}
                >
                  <Text style={styles.primaryBtnText}>Back to Login</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.resendBtn}
                  onPress={() => setStep("input")}
                  activeOpacity={0.7}
                >
                  <Ionicons name="refresh-outline" size={16} color="#E8272A" />
                  <Text style={styles.resendText}>Resend Link</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.footer}>
              <Text style={styles.footerText}>Remember your password? </Text>
              <TouchableOpacity onPress={() => router.push("/(auth)/login")}>
                <Text style={styles.footerLink}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: "100%",
    height: "100%",
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
  backBtn: {
    width: 44,
    height: 44,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    backgroundColor: "#FAFAFA",
  },
  header: { marginBottom: 30 },
  logoMark: {
    width: 52,
    height: 52,
    borderRadius: 15,
    backgroundColor: "#000000",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 30,
    fontWeight: "800",
    color: "#E8272A",
    marginBottom: 10,
    letterSpacing: -0.3,
  },
  subtitle: { fontSize: 15, color: "#000000", lineHeight: 23 },
  form: { gap: 20 },
  fieldGroup: { gap: 8 },
  label: { fontSize: 13, fontWeight: "600", color: "#333", letterSpacing: 0.1 },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: "#000000",
    borderRadius: 12,
    backgroundColor: "#FAFAFA",
    paddingHorizontal: 14,
    paddingVertical: Platform.OS === "ios" ? 14 : 4,
  },
  inputFocused: { borderColor: "#E8272A", backgroundColor: "#fff" },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontSize: 15, color: "#111" },
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
  successContainer: { alignItems: "center", paddingTop: 20, gap: 12 },
  successTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: "#E8272A",
    letterSpacing: -0.3,
    marginBottom: 8,
  },
  successDesc: { fontSize: 15, color: "#000000", textAlign: "center" },
  successEmail: {
    fontSize: 15,
    color: "#E8272A",
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 8,
  },
  successNote: {
    fontSize: 13,
    color: "#000000",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 12,
  },
  resendBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    marginTop: 4,
    paddingVertical: 8,
  },
  resendText: { color: "#E8272A", fontSize: 14, fontWeight: "600" },
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
