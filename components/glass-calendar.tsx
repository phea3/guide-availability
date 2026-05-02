"use client";

import { BlurView } from "expo-blur";
import { ImageBackground, Text, View } from "react-native";
import { Calendar } from "react-native-calendars";

export default function GlassCalendar() {
  const markedDates = {
    "2026-05-02": { marked: true, dotColor: "#22c55e" }, // available
    "2026-05-03": { marked: true, dotColor: "#ef4444" }, // booked
  };

  return (
    <ImageBackground
      source={require("../assets/images/calendar-image.jpg")}
      resizeMode="cover"
      className=" border-gray-200"
    >
      {/* Glass Container */}
      <BlurView
        intensity={10}
        tint="dark"
        className="m-6 rounded-3xl overflow-hidden border border-white/10"
      >
        {/* Header */}
        <View className="px-5 py-4 border-b border-white/10">
          <Text className="text-white text-lg font-semibold">Availability</Text>
          <Text className="text-white/60 text-sm">
            Tap a date to update status
          </Text>
        </View>

        {/* Calendar */}
        <Calendar
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
    </ImageBackground>
  );
}
