"use client";

import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const TABS = ["home", "guides", "cities", "bookings"];

const { width } = Dimensions.get("window");
const TAB_WIDTH = width / TABS.length;

export default function AnimatedTabBar() {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();

  const activeIndex = Math.max(
    0,
    TABS.findIndex((t) => pathname.startsWith(`/${t}`)),
  );

  const translateX = useSharedValue(activeIndex * TAB_WIDTH);

  useEffect(() => {
    translateX.value = withTiming(activeIndex * TAB_WIDTH, {
      duration: 300,
    });
  }, [activeIndex]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View style={{ paddingBottom: insets.bottom }}>
      {/* 🔥 Sliding pill indicator */}
      <Animated.View
        style={[
          {
            position: "absolute",
            height: 40,
            width: TAB_WIDTH - 16,
            marginHorizontal: 8,
            top: 8,
            borderRadius: 999,
            backgroundColor: "#f9f871",
          },
          indicatorStyle,
        ]}
      />

      <View className="flex-row py-2">
        {TABS.map((tab, index) => (
          <TabItem
            key={tab}
            tab={tab}
            isActive={index === activeIndex}
            onPress={() => router.push(`/${tab}` as any)}
          />
        ))}
      </View>
    </View>
  );
}

function TabItem({
  tab,
  isActive,
  onPress,
}: {
  tab: string;
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(isActive ? 1.1 : 1);
  const translateY = useSharedValue(isActive ? -4 : 0);

  useEffect(() => {
    scale.value = withTiming(isActive ? 1.1 : 1, { duration: 200 });
    translateY.value = withTiming(isActive ? -4 : 0, { duration: 200 });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }, { translateY: translateY.value }],
  }));

  return (
    <Pressable onPress={onPress} className="flex-1 items-center">
      <Animated.View style={animatedStyle}>
        <Text
          className={`text-sm font-semibold ${
            isActive ? "text-yellow-400" : "text-gray-400"
          }`}
        >
          {tab.toUpperCase()}
        </Text>
      </Animated.View>
    </Pressable>
  );
}
