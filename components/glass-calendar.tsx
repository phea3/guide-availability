"use client";

import { BlurView } from "expo-blur";
import { useState } from "react";
import { ActivityIndicator, ImageBackground, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

export default function GlassCalendar() {
  const [loaded, setLoaded] = useState(false);

  const opacity = useSharedValue(0);
  const translateY = useSharedValue(-500);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      opacity: opacity.value,
      transform: [{ translateY: translateY.value }],
    };
  });

  const markedDates = {
    "2026-05-02": { marked: true, dotColor: "#22c55e" }, // available
    "2026-05-03": { marked: true, dotColor: "#ef4444" }, // booked
  };

  const handleLoadEnd = () => {
    setLoaded(true);
    opacity.value = withTiming(1, { duration: 600 });
    translateY.value = withTiming(0, { duration: 600 });
  };

  return (
    <ImageBackground
      source={require("../assets/images/calendar-image.jpg")}
      resizeMode="cover"
      className=" border-gray-200"
      onLoadEnd={handleLoadEnd}
    >
      {!loaded && (
        <View className="py-8 items-center justify-center">
          <ActivityIndicator size="large" />
        </View>
      )}

      {loaded && (
        <Animated.View style={animatedStyle}>
          <BlurView
            intensity={10}
            tint="dark"
            className="m-6 rounded-3xl overflow-hidden border border-white/10"
          >
            {/* Header */}
            <View className="px-5 py-4 border-b border-white/10">
              <Text className="text-white text-lg font-semibold">
                Availability
              </Text>
              <Text className="text-white/60 text-sm">
                Tap a date to update status
              </Text>
            </View>

            {/* Calendar */}
            <Calendar
              enableSwipeMonths
              markingType="dot"
              markedDates={markedDates}
              theme={{
                backgroundColor: "transparent",
                calendarBackground: "transparent",

                textSectionTitleColor: "#9ca3af",
                monthTextColor: "#ffffff",

                dayTextColor: "#e5e7eb",
                todayTextColor: "#38bdf8",

                arrowColor: "#ffffff",

                selectedDayBackgroundColor: "#6366f1",
                selectedDayTextColor: "#ffffff",

                dotColor: "#22c55e",
                selectedDotColor: "#ffffff",

                textDisabledColor: "#374151",

                textDayFontWeight: "500",
                textMonthFontWeight: "600",
              }}
              style={{
                paddingBottom: 0,
              }}
            />
          </BlurView>
        </Animated.View>
      )}
    </ImageBackground>
  );
}
