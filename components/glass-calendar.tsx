"use client";

import { AvailableDayType, AvailableTimeType } from "@/types/availability";
import { GuideType } from "@/types/guide";
import dayjs from "dayjs";
import {
  CalendarCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MessageSquareText,
  Phone,
  Send,
  X,
} from "lucide-react-native";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  Linking,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Calendar } from "react-native-calendars";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

type AvailableDayItemProps = {
  data?: (AvailableDayType & { availableTimes?: AvailableTimeType[] })[];
  guide?: GuideType;
};

export default function GlassCalendar({
  data = [],
  guide,
}: AvailableDayItemProps) {
  const [loaded, setLoaded] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const selectedItems = useMemo(() => {
    if (!selectedDate) return [];

    return data.filter((item) => {
      if (!item.startDate || !item.endDate) return false;

      const start = dayjs(item.startDate).startOf("day");
      const end = dayjs(item.endDate).startOf("day");
      const selected = dayjs(selectedDate).startOf("day");

      return (
        start.isValid() &&
        end.isValid() &&
        !selected.isBefore(start, "day") &&
        !selected.isAfter(end, "day")
      );
    });
  }, [data, selectedDate]);
  const opacity = useSharedValue(0);
  const translateY = useSharedValue(20);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ translateY: translateY.value }],
  }));

  useEffect(() => {
    if (!loaded) return;

    // eslint-disable-next-line react-hooks/immutability
    opacity.value = withTiming(1, { duration: 500 });
    // eslint-disable-next-line react-hooks/immutability
    translateY.value = withTiming(0, { duration: 500 });
  }, [loaded, opacity, translateY]);

  const markedDates = useMemo(() => {
    const marks: Record<string, any> = {};

    data.forEach((item) => {
      if (!item.startDate || !item.endDate) return;

      const start = dayjs(item.startDate).startOf("day");
      const end = dayjs(item.endDate).startOf("day");

      if (!start.isValid() || !end.isValid() || start.isAfter(end, "day")) {
        return;
      }

      const isActive = item.status?.toUpperCase() === "ACTIVE";
      const color = isActive ? "#22c55e" : "#94a3b8";

      let current = start;
      let count = 0;

      while (!current.isAfter(end, "day") && count < 3660) {
        const date = current.format("YYYY-MM-DD");

        marks[date] = {
          marked: true,
          selected: true,
          selectedColor: color,
          selectedTextColor: "#ffffff",
          dotColor: "#ffffff",
        };

        current = current.add(1, "day");
        count++;
      }
    });

    return marks;
  }, [data]);

  const activeDays = useMemo(
    () => data.filter((item) => item.status?.toUpperCase() === "ACTIVE").length,
    [data],
  );

  const totalDays = useMemo(() => {
    const dates = new Set<string>();

    data.forEach((item) => {
      if (!item.startDate || !item.endDate) return;

      const start = dayjs(item.startDate).startOf("day");
      const end = dayjs(item.endDate).startOf("day");

      if (!start.isValid() || !end.isValid() || start.isAfter(end, "day")) {
        return;
      }

      let current = start;
      let count = 0;

      while (!current.isAfter(end, "day") && count < 3660) {
        dates.add(current.format("YYYY-MM-DD"));
        current = current.add(1, "day");
        count++;
      }
    });

    return dates.size;
  }, [data]);

  return (
    <>
      <View className="mx-4 mt-5 overflow-hidden rounded-[28px] border border-white/60 bg-white">
        <ImageBackground
          source={require("../assets/images/calendar-image.jpg")}
          resizeMode="cover"
          imageStyle={{ opacity: 0.12 }}
          onLoadEnd={() => setLoaded(true)}
        >
          <View>
            {/* Header */}
            <View className="flex-row items-center justify-between px-5 pb-4 pt-5">
              <View className="flex-1 flex-row items-center gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <CalendarDays size={24} color="#c9a849" />
                </View>

                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    Availability
                  </Text>
                  <Text className="mt-0.5 text-xs text-gray-500">
                    Your scheduled available days
                  </Text>
                </View>
              </View>

              <View className="rounded-xl bg-emerald-50 px-3 py-2">
                <Text className="text-xs font-semibold text-emerald-700">
                  {activeDays} active
                </Text>
              </View>
            </View>

            {/* Summary */}
            <View className="mx-5 mb-4 flex-row gap-3">
              <View className="flex-1 flex-row items-center rounded-2xl border border-gray-100 bg-white/90 p-3">
                <View className="mr-2.5 h-9 w-9 items-center justify-center rounded-xl bg-emerald-50">
                  <CalendarCheck size={18} color="#c9a849" />
                </View>

                <View>
                  <Text className="text-lg font-bold text-gray-900">
                    {totalDays}
                  </Text>
                  <Text className="text-[11px] text-gray-500">
                    Scheduled days
                  </Text>
                </View>
              </View>

              <View className="flex-1 flex-row items-center rounded-2xl border border-gray-100 bg-white/90 p-3">
                <View className="mr-2.5 h-9 w-9 items-center justify-center rounded-xl bg-blue-50">
                  <Clock3 size={18} color="#2563eb" />
                </View>

                <View>
                  <Text className="text-lg font-bold text-gray-900">
                    {data.length}
                  </Text>
                  <Text className="text-[11px] text-gray-500">
                    Availability records
                  </Text>
                </View>
              </View>
            </View>

            {/* Calendar */}
            <Animated.View style={animatedStyle}>
              <View className="mx-3 mb-3 overflow-hidden rounded-3xl border border-white/70 bg-white/90 p-2">
                {!loaded ? (
                  <View className="h-[330px] items-center justify-center">
                    <ActivityIndicator size="large" color="#c9a849" />
                    <Text className="mt-3 text-sm text-gray-500">
                      Loading calendar...
                    </Text>
                  </View>
                ) : (
                  <Calendar
                    enableSwipeMonths
                    markingType="dot"
                    markedDates={markedDates}
                    hideExtraDays={false}
                    // onDayPress={(day) => console.log(day)}
                    onDayPress={(day) => {
                      if (markedDates[day.dateString]) {
                        setSelectedDate(day.dateString);
                      }
                    }}
                    theme={{
                      backgroundColor: "transparent",
                      calendarBackground: "transparent",
                      textSectionTitleColor: "#9ca3af",
                      monthTextColor: "#111827",
                      dayTextColor: "#374151",
                      todayTextColor: "#c9a849",
                      arrowColor: "#c9a849",
                      selectedDayBackgroundColor: "#c9a849",
                      selectedDayTextColor: "#ffffff",
                      dotColor: "#c9a849",
                      selectedDotColor: "#ffffff",
                      textDisabledColor: "#d1d5db",
                      textDayFontWeight: "500",
                      textMonthFontWeight: "700",
                      textMonthFontSize: 17,
                      textDayHeaderFontWeight: "600",
                      textDayHeaderFontSize: 12,
                    }}
                    style={{
                      borderRadius: 20,
                    }}
                  />
                )}
              </View>
            </Animated.View>

<<<<<<< HEAD
            {/* Legend */}
            <View className="mx-5 mb-5 flex-row flex-wrap items-center justify-center gap-x-5 gap-y-2 rounded-2xl border border-gray-100 bg-white/80 px-4 py-3">
              <View className="flex-row items-center gap-2">
                <View className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
                <Text className="text-xs font-medium text-gray-600">
                  Available
                </Text>
              </View>
=======
                textSectionTitleColor: "#000000",
                monthTextColor: "#ffffff",
>>>>>>> 157657e (update)

              <View className="flex-row items-center gap-2">
                <View className="h-2.5 w-2.5 rounded-full bg-slate-400" />
                <Text className="text-xs font-medium text-gray-600">
                  Inactive
                </Text>
              </View>

              <Text className="text-[11px] text-gray-400">View only</Text>
            </View>
          </View>
        </ImageBackground>
      </View>

      <Modal
        visible={selectedDate !== null}
        transparent
        animationType="slide"
        onRequestClose={() => setSelectedDate(null)}
        statusBarTranslucent
      >
        <View className="flex-1 justify-end bg-black/40">
          <Pressable className="flex-1" onPress={() => setSelectedDate(null)} />

          <View className="max-h-[75%] overflow-hidden rounded-t-[32px] bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-gray-100 px-6 pb-5 pt-4">
              <View className="flex-row items-center gap-3">
                <View className="h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50">
                  <CalendarDays size={24} color="#059669" />
                </View>

                <View>
                  <Text className="text-lg font-bold text-gray-900">
                    Available times
                  </Text>
                  <Text className="mt-1 text-sm text-gray-500">
                    {selectedDate
                      ? dayjs(selectedDate).format("dddd, DD MMMM YYYY")
                      : ""}
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={() => setSelectedDate(null)}
                className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
              >
                <X size={20} color="#4b5563" />
              </Pressable>
            </View>

            <ScrollView
              className="px-5"
              contentContainerStyle={{ paddingVertical: 20, paddingBottom: 36 }}
              showsVerticalScrollIndicator={false}
            >
              {selectedItems.map((item) => (
                <View key={item.id} className="mb-4">
                  <View className="mb-3 flex-row items-center gap-2">
                    <CheckCircle2
                      size={17}
                      color={
                        item.status?.toUpperCase() === "ACTIVE"
                          ? "#059669"
                          : "#9ca3af"
                      }
                    />
                    <Text className="font-semibold text-gray-800">
                      {item.status ?? "Availability"}
                    </Text>
                  </View>

                  {/* {item.availableTimes?.length ? (
                    <View className="gap-3">
                      {item.availableTimes.map((time, index) => (
                        <View
                          key={`${item.id}-${index}`}
                          className="flex-row items-center rounded-2xl border border-gray-100 bg-gray-50 p-4"
                        >
                          <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-emerald-50">
                            <Clock3 size={21} color="#059669" />
                          </View>

                          <View className="flex-1">
                            <Text className="text-base font-bold text-gray-900">
                              {dayjs(time.startTime).isValid()
                                ? dayjs(time.startTime).format("h:mm A")
                                : "--:--"}
                              {" – "}
                              {dayjs(time.endTime).isValid()
                                ? dayjs(time.endTime).format("h:mm A")
                                : "--:--"}
                            </Text>

                            {!!time.status && (
                              <Text className="mt-1 text-xs text-gray-500">
                                {time.status}
                              </Text>
                            )}

                            {!!time.remark && (
                              <Text className="mt-2 text-sm text-gray-600">
                                {time.remark}
                              </Text>
                            )}
                          </View>
                        </View>
                      ))}
                    </View>
                  ) : (
                    <Text className="rounded-2xl bg-gray-50 px-4 py-5 text-sm text-gray-500">
                      No time slots added for this availability.
                    </Text>
                  )} */}

                  {!!item.remark && (
                    <View className="mt-3 flex-row gap-2 rounded-2xl bg-blue-50 p-3">
                      <MessageSquareText size={18} color="#2563eb" />
                      <Text className="flex-1 text-sm leading-5 text-blue-800">
                        {item.remark}
                      </Text>
                    </View>
                  )}
                </View>
              ))}

              {!selectedItems.length && (
                <Text className="py-8 text-center text-gray-500">
                  No availability details found for this date.
                </Text>
              )}

              {/* Contact Buttons */}
              <View className="flex-row gap-3 border-t border-gray-100 bg-white px-5 py-4 pb-8">
                <Pressable
                  onPress={async () => {
                    const phone = guide?.phoneNumber?.trim();

                    if (!phone) {
                      Alert.alert(
                        "No Phone Number",
                        "This guide has not added a phone number.",
                      );
                      return;
                    }

                    const url = `tel:${phone}`;

                    try {
                      if (await Linking.canOpenURL(url)) {
                        await Linking.openURL(url);
                      } else {
                        Alert.alert(
                          "Error",
                          "Unable to open the phone dialer.",
                        );
                      }
                    } catch {
                      Alert.alert("Error", "Unable to make a call.");
                    }
                  }}
                  className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-emerald-600"
                >
                  <Phone size={20} color="#ffffff" />
                  <Text className="font-bold text-white">Call</Text>
                </Pressable>

                <Pressable
                  onPress={async () => {
                    const value = guide?.telegramLink?.trim();

                    if (!value) {
                      Alert.alert(
                        "No Telegram",
                        "This guide has not added a Telegram contact.",
                      );
                      return;
                    }

                    let url: string;

                    if (/^https?:\/\//i.test(value)) {
                      // Already a full URL
                      url = value;
                    } else if (/^(t\.me|telegram\.me)\//i.test(value)) {
                      // URL without https://
                      url = `https://${value}`;
                    } else {
                      // Username, with or without @
                      url = `https://t.me/${value.replace(/^@+/, "")}`;
                    }

                    try {
                      await Linking.openURL(url);
                    } catch (error) {
                      console.error("Telegram error:", error);
                      Alert.alert(
                        "Error",
                        "Unable to open this Telegram contact.",
                      );
                    }
                  }}
                  className="h-14 flex-1 flex-row items-center justify-center gap-2 rounded-2xl bg-sky-500"
                >
                  <Send size={20} color="#ffffff" />
                  <Text className="font-bold text-white">Telegram</Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
