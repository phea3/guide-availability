import Providers from "@/providers/provider";
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from "@clerk/expo/token-cache";
import { Stack, usePathname } from "expo-router";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import "../global.css";
import GlassTabBar from "./_components/tab-bar";

const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!;

if (!publishableKey) {
  throw new Error("Add your Clerk Publishable Key to the .env file");
}

export default function RootLayout() {
  const pathname = usePathname();

  const isAuthScreen = pathname === "/" || pathname === "/register";

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <SafeAreaView
          style={{ flex: 1 }}
          edges={isAuthScreen ? ["left", "right"] : ["top", "left", "right"]}
        >
          <Providers>
            <ClerkProvider
              publishableKey={publishableKey}
              tokenCache={tokenCache}
            >
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              >
                {/* <Stack.Screen name="index" options={{ animation: "fade" }} /> */}
                {/* <Stack.Screen name="login" options={{ animation: "fade" }} /> */}
                <Stack.Screen name="register" options={{ animation: "fade" }} />
                <Stack.Screen name="home" options={{ animation: "fade" }} />
                <Stack.Screen
                  name="profile/index"
                  options={{ animation: "fade" }}
                />
                <Stack.Screen
                  name="guides/index"
                  options={{ animation: "fade" }}
                />
                <Stack.Screen
                  name="cities/index"
                  options={{ animation: "fade" }}
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
                  options={{ animation: "fade" }}
                />
                <Stack.Screen
                  name="guides/[id]"
                  options={{ animation: "default" }}
                />
              </Stack>
            </ClerkProvider>

            <Toast />
            {!isAuthScreen && <GlassTabBar />}
          </Providers>
        </SafeAreaView>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
