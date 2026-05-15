import Providers from "@/providers/provider";
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
          <Providers>
            <Stack
              screenOptions={{
                headerShown: false,
              }}
            >
              <Stack.Screen name="index" options={{ animation: "fade" }} />
              <Stack.Screen name="login" options={{ animation: "fade" }} />
              <Stack.Screen name="home" options={{ animation: "fade" }} />
              <Stack.Screen
                name="guides/index"
                options={{ animation: "fade" }}
              />
              <Stack.Screen
                name="cities/index"
                options={{ animation: "default" }}
              />
              <Stack.Screen
                name="promotions/index"
                options={{ animation: "default" }}
              />
              <Stack.Screen
                name="favorites/index"
                options={{ animation: "default" }}
              />
              <Stack.Screen
                name="bookings/index"
                options={{ animation: "default" }}
              />
              <Stack.Screen
                name="guides/[id]"
                options={{ animation: "default" }}
              />
            </Stack>

            {!isAuthScreen && <AnimatedTabBar />}
          </Providers>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
