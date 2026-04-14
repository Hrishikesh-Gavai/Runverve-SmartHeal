import { Stack } from "expo-router";

export default function FitnessLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
        gestureEnabled: true,
      }}
    >
      <Stack.Screen name="connect_fitness_app" />
      <Stack.Screen name="authorize_connection" />
      <Stack.Screen name="authorizing_loading" />
      <Stack.Screen name="connected_success" />
    </Stack>
  );
}
