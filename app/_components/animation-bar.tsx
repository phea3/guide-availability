"use client";

import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { usePathname, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
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
  { name: "hide", icon: "arrow-down" },
];

const { width } = Dimensions.get("window");
const TAB_WIDTH = (width - 40) / TABS.length;

export default function AnimatedTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) => pathname.startsWith(`/${t.name}`)),
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
                    } else {
                      router.push(`/${tab.name}` as any);
                    }
                  }}
                />
              ))}
            </View>
          </BlurView>
        </View>
      </Animated.View>
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
