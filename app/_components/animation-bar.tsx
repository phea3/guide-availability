"use client";

import { usePathname, useRouter } from "expo-router";
import { useEffect } from "react";
import { Dimensions, Pressable, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const TABS = ["Home", "Guides", "Cities", "Bookings", "Profile"];
const { width } = Dimensions.get("window");
const TAB_WIDTH = width / TABS.length;

export default function AnimatedTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  const activeIndex = TABS.findIndex((t) => pathname === `/${t.toLowerCase()}`);

  const translateX = useSharedValue(activeIndex * TAB_WIDTH);

  useEffect(() => {
    translateX.value = withTiming(activeIndex * TAB_WIDTH, {
      duration: 250,
    });
  }, [activeIndex]);

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <View className="border-t border-gray-200 py-4">
      {/* Indicator */}
      {/* <Animated.View
        style={[
          {
            position: "absolute",
            bottom: 0,
            width: TAB_WIDTH,
            height: 3,
            backgroundColor: "#22c55e",
          },
          indicatorStyle,
        ]}
      /> */}

      <View className="flex-row">
        {TABS.map((tab, index) => (
          <TabItem
            key={tab}
            tab={tab}
            index={index}
            isActive={index === activeIndex}
            onPress={() => router.push(`/${tab.toLowerCase()}` as any)}
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
  index: number;
  isActive: boolean;
  onPress: () => void;
}) {
  const scale = useSharedValue(isActive ? 1.2 : 1);

  useEffect(() => {
    scale.value = withTiming(isActive ? 1.2 : 1, {
      duration: 200,
    });
  }, [isActive]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable onPress={onPress} className="flex-1 items-center">
      <Animated.Text
        style={animatedStyle}
        className={`font-semibold ${
          isActive ? "text-green-500" : "text-white"
        }`}
      >
        {tab}
      </Animated.Text>
    </Pressable>
  );
}
