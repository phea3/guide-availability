import { Stack } from "expo-router";
import "../global.css";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="home" />
      <Stack.Screen name="guides/index" />
      <Stack.Screen name="cities/index" />
      <Stack.Screen name="promotions/index" />
      <Stack.Screen name="favorites/index" />
      <Stack.Screen name="bookings/index" />
      <Stack.Screen name="guides/[id]" />
    </Stack>
  );
}
