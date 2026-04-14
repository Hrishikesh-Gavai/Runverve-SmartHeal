import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        contentStyle: { backgroundColor: "#fff" },
      }}
    >
      <Stack.Screen name="gender" />
      <Stack.Screen name="dob" />
      <Stack.Screen name="calendar" />
      <Stack.Screen name="height" />
      <Stack.Screen name="weight" />
      <Stack.Screen name="experience_level" />
      <Stack.Screen name="running_goal" />
    </Stack>
  );
}
