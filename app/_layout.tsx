import { Stack, usePathname } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import "../global.css";
import AnimatedTabBar from "./_components/animation-bar";
export default function RootLayout() {
  const pathname = usePathname();

  const isAuthScreen = pathname === "/" || pathname === "/login";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1 }}
          edges={isAuthScreen ? ["left", "right"] : ["top", "left", "right"]}
        >
          <Stack
            screenOptions={{
              headerShown: false,
              animation: "fade",
            }}
          >
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

          {!isAuthScreen && <AnimatedTabBar />}
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
