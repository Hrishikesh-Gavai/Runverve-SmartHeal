// (auth)/_layout.tsx
import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      {/* Splash Screen - Fade animation */}
      <Stack.Screen
        name="splash"
        options={{
          animation: "fade", // Valid: fade
        }}
      />

      {/* Welcome Screen */}
      <Stack.Screen
        name="welcome"
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />

      {/* Login Screen */}
      <Stack.Screen
        name="login"
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />

      {/* Signup Screen */}
      <Stack.Screen
        name="signup"
        options={{
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />

      {/* Forgot Password - Modal presentation */}
      <Stack.Screen
        name="forgot-password"
        options={{
          presentation: "modal", // Valid: modal
          animation: "slide_from_right",
          gestureEnabled: true,
        }}
      />
    </Stack>
  );
}
