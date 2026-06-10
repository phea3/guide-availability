"use client";

import { AuthStorage } from "@/auth/auth-acess-token";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Modal, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = [
  { name: "home", icon: "home" },
  { name: "guides", icon: "people" },
  { name: "cities", icon: "location" },
  { name: "bookings", icon: "calendar" },
  { name: "logout", icon: "log-out" },
  { name: "hide", icon: "arrow-down" },
];

const { width } = Dimensions.get("window");
const TAB_WIDTH = (width - 40) / TABS.length;

export default function AnimatedTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const activeIndex = Math.max(
    0,
    TABS.findIndex(
      (t) =>
        t.name !== "logout" &&
        t.name !== "hide" &&
        pathname.startsWith(`/${t.name}`),
    ),
  );

  const translateX = useSharedValue(activeIndex * TAB_WIDTH);
  const tabBarOffset = useSharedValue(0);
  const showButtonOffset = useSharedValue(100);
  const [showTabBar, setShowTabBar] = useState(true);

  useEffect(() => {
    translateX.value = withTiming(activeIndex * TAB_WIDTH, {
      duration: 300,
    });
  }, [activeIndex, translateX]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  const tabBarStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: tabBarOffset.value }],
  }));

  const showButtonStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: showButtonOffset.value }],
  }));

  const hideTabBar = () => {
    tabBarOffset.value = withTiming(100, { duration: 300 });
    showButtonOffset.value = withTiming(0, { duration: 300 });
    setShowTabBar(false);
  };

  const showTabBarAgain = () => {
    tabBarOffset.value = withTiming(0, { duration: 300 });
    showButtonOffset.value = withTiming(100, { duration: 300 });
    setShowTabBar(true);
  };

  return (
    <>
      {!showTabBar && (
        <Animated.View
          style={[
            {
              position: "absolute",
              bottom: insets.bottom + 10,
              alignSelf: "center",
              backgroundColor: " rgba(0,0,0,0.4)",
              borderRadius: 999,
              zIndex: 10,
            },
            showButtonStyle,
          ]}
        >
          <Pressable onPress={showTabBarAgain} className="m-4">
            <Ionicons name="arrow-up" size={20} color="white" />
          </Pressable>
        </Animated.View>
      )}
      {/* Tab bar */}
      <Animated.View
        style={[{ bottom: insets.bottom + 10 }, tabBarStyle]}
        className="absolute left-5 right-5"
      >
        <View className="rounded-3xl overflow-hidden border border-white/20 bg-white/10">
          <BlurView intensity={80} tint="dark">
            <View className="flex-row h-16 items-center">
              {/* Active pill */}
              <Animated.View
                style={[
                  {
                    position: "absolute",
                    height: 44,
                    width: TAB_WIDTH,
                    left: 5,
                    borderRadius: 999,
                    backgroundColor: "rgb(250, 204, 21)",
                  },
                  indicatorStyle,
                ]}
              />

              {TABS.map((tab, index) => (
                <TabItem
                  key={tab.name}
                  tab={tab}
                  isActive={index === activeIndex}
                  onPress={() => {
                    if (tab.name === "hide") {
                      hideTabBar(); // special case
                    } else if (tab.name === "logout") {
                      setShowLogoutModal(true);
                      return;
                    } else {
                      // restrict navigation for top-level tabs
                      const topLevelTabs = [
                        "home",
                        "guides",
                        "cities",
                        "promotions",
                        "favorites",
                        "bookings",
                        "guides",
                      ];

                      if (topLevelTabs.includes(tab.name)) {
                        // only push if not already at that top-level path
                        if (pathname !== `/${tab.name}`) {
                          router.replace(`/${tab.name}` as any);
                        }
                      } else {
                        // normal behavior for other tabs
                        router.push(`/${tab.name}` as any);
                      }
                    }
                  }}
                />
              ))}
            </View>
          </BlurView>
        </View>
      </Animated.View>

      <Modal
        transparent
        visible={showLogoutModal}
        animationType="fade"
        onRequestClose={() => setShowLogoutModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6">
            <Text className="mb-2 text-lg font-bold">Logout</Text>

            <Text className="mb-6 text-gray-600">
              Are you sure you want to logout?
            </Text>

            <View className="flex-row gap-3">
              <Pressable
                onPress={() => setShowLogoutModal(false)}
                className="flex-1 rounded-xl border border-gray-300 py-3"
              >
                <Text className="text-center font-medium">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={async () => {
                  setShowLogoutModal(false);

                  await AuthStorage.logout();

                  router.replace("/login");
                }}
                className="flex-1 rounded-xl bg-red-500 py-3"
              >
                <Text className="text-center font-medium text-white">
                  Logout
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}

function TabItem({
  tab,
  isActive,
  onPress,
}: {
  tab: { name: string; icon: any };
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(isActive ? 1.1 : 1);

  useEffect(() => {
    scale.value = withTiming(isActive ? 1.1 : 1, { duration: 200 });
  }, [isActive, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (tab.name === "logout") {
    return (
      <Pressable
        onPress={onPress}
        className="flex-1 items-center justify-center"
      >
        <View className="h-10 w-10 items-center justify-center rounded-full bg-red-500">
          <Ionicons name="log-out-outline" size={18} color="white" />
        </View>
      </Pressable>
    );
  }

  return (
    <Pressable onPress={onPress} className="flex-1 items-center">
      <Animated.View
        style={style}
        className={
          tab.name === "hide"
            ? "items-center gap-1 font-bold"
            : "items-center gap-1"
        }
      >
        <Ionicons
          name={tab.icon}
          size={20}
          color={isActive || tab.name === "hide" ? "#fff" : "#aaa"}
        />
        <Text
          className={`text-xs ${isActive || tab.name === "hide" ? "text-white" : "text-gray-400"}`}
        >
          {tab.name}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
