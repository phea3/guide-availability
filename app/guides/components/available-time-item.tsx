import CrossPlatformDatePicker from "@/components/cross-platform-datepicker";
import { AvailableDraftTimeType } from "@/types/availability";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";

import { timeToDateParse } from "@/lib/dev";
import {
  Check,
  Clock,
  FileText,
  MessageSquareText,
  Trash2,
} from "lucide-react-native";
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

type AvailableTimeItemProps = {
  time: AvailableDraftTimeType;
  onUpdate: (time: AvailableDraftTimeType) => void;
  onDelete: (time: AvailableDraftTimeType) => void;
  isEditing?: boolean;
  isDeleting?: boolean;
};

export const dateToTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const formatTime = (time?: string) => {
  const date = timeToDateParse(time || "");
  return date.toLocaleTimeString([], {
    hour: "numeric",
    minute: "2-digit",
  });
};

export default function AvailableTimeItem({
  time,
  onUpdate,
  onDelete,
  isEditing = false,
  isDeleting = false,
}: AvailableTimeItemProps) {
  return (
    <View className="mb-3 rounded-2xl border border-gray-100 bg-white p-4">
      {isEditing ? (
        <>
          {/* Header */}
          <View className="mb-4 flex-row items-center">
            <View className="mr-3 h-10 w-10 items-center justify-center rounded-xl bg-yellow-50">
              <Clock size={20} color="#c9a849" />
            </View>

            <View className="flex-1">
              <Text className="text-sm font-bold text-gray-900">
                Edit Time Slot
              </Text>
              <Text className="mt-1 text-xs text-gray-500">
                Set your available hours
              </Text>
            </View>

            <View
              className={`rounded-full px-3 py-1 ${
                time.status === "ACTIVE" ? "bg-yellow-50" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  time.status === "ACTIVE" ? "text-yellow-700" : "text-gray-500"
                }`}
              >
                {time.status === "ACTIVE" ? "Active" : "Inactive"}
              </Text>
            </View>
          </View>

          {/* Time pickers */}
          <View className="gap-3">
            <View className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <View className="mb-2 flex-row items-center">
                <Clock size={16} color="#c9a849" />
                <Text className="ml-2 text-sm font-medium text-gray-600">
                  Start time
                </Text>
              </View>

              <CrossPlatformDatePicker
                label="Start Time"
                date={timeToDateParse(time.startTime)}
                setDate={(date) =>
                  onUpdate({
                    ...time,
                    startTime: dateToTime(date),
                  })
                }
                mode="time"
              />
            </View>

            <View className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
              <View className="mb-2 flex-row items-center">
                <Clock size={16} color="#c9a849" />
                <Text className="ml-2 text-sm font-medium text-gray-600">
                  End time
                </Text>
              </View>

              <CrossPlatformDatePicker
                label="End Time"
                date={timeToDateParse(time.endTime)}
                setDate={(date) =>
                  onUpdate({
                    ...time,
                    endTime: dateToTime(date),
                  })
                }
                mode="time"
              />
            </View>
          </View>

          {/* Remark */}
          <View className="mb-2 mt-4 flex-row items-center">
            <MessageSquareText size={17} color="#c9a849" />
            <Text className="ml-2 text-sm font-semibold text-gray-800">
              Note
            </Text>
            <Text className="ml-2 text-xs text-gray-400">(Optional)</Text>
          </View>

          <View className="flex-row items-start rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
            <FileText size={17} color="#9CA3AF" style={{ marginTop: 2 }} />

            <TextInput
              value={time.remark ?? ""}
              onChangeText={(val) =>
                onUpdate({
                  ...time,
                  remark: val,
                })
              }
              placeholder="Add a note about this time slot..."
              placeholderTextColor="#9CA3AF"
              multiline
              textAlignVertical="top"
              className="ml-3 min-h-16 flex-1 text-sm text-gray-800"
            />
          </View>

          {/* Status switch */}
          <View className="mt-4 flex-row items-center justify-between rounded-2xl bg-gray-50 p-3">
            <View className="flex-1 flex-row items-center">
              <View
                className={`mr-3 h-9 w-9 items-center justify-center rounded-xl ${
                  time.status === "ACTIVE" ? "bg-yellow-100" : "bg-gray-200"
                }`}
              >
                <Check
                  size={18}
                  color={time.status === "ACTIVE" ? "#c9a849" : "#6B7280"}
                />
              </View>

              <View className="flex-1">
                <Text className="text-sm font-semibold text-gray-900">
                  {time.status === "ACTIVE" ? "Active" : "Inactive"}
                </Text>
                <Text className="mt-1 text-xs text-gray-500">
                  {time.status === "ACTIVE"
                    ? "Available for bookings"
                    : "Not available for bookings"}
                </Text>
              </View>
            </View>

            <Pressable
              accessibilityRole="switch"
              accessibilityLabel="Time slot status"
              accessibilityState={{ checked: time.status === "ACTIVE" }}
              onPress={() =>
                onUpdate({
                  ...time,
                  status: time.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                })
              }
              className={`h-8 w-14 justify-center rounded-full px-1 ${
                time.status === "ACTIVE" ? "bg-yellow-500" : "bg-gray-300"
              }`}
            >
              <View
                className={`h-6 w-6 rounded-full bg-white ${
                  time.status === "ACTIVE" ? "self-end" : "self-start"
                }`}
              />
            </Pressable>
          </View>

          {/* Delete */}
          <Pressable
            onPress={() => onDelete(time)}
            disabled={isDeleting}
            accessibilityRole="button"
            accessibilityLabel="Delete time slot"
            className={`mt-4 min-h-11 flex-row items-center justify-center rounded-2xl border border-red-100 ${
              isDeleting ? "bg-red-50" : "bg-white active:bg-red-50"
            }`}
          >
            {isDeleting ? (
              <ActivityIndicator size="small" color="#DC2626" />
            ) : (
              <Trash2 size={17} color="#DC2626" />
            )}

            <Text className="ml-2 text-sm font-semibold text-red-600">
              {isDeleting ? "Deleting..." : "Delete Time Slot"}
            </Text>
          </Pressable>
        </>
      ) : (
        <>
          {/* Display header */}
          <View className="flex-row items-center">
            <View className="mr-3 h-11 w-11 items-center justify-center rounded-xl bg-yellow-50">
              <Clock size={21} color="#c9a849" />
            </View>

            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">
                {formatTime(time.startTime)} – {formatTime(time.endTime)}
              </Text>

              <Text className="mt-1 text-xs text-gray-500">
                Available time slot
              </Text>
            </View>

            <View
              className={`rounded-full px-3 py-1.5 ${
                time.status === "ACTIVE" ? "bg-yellow-50" : "bg-gray-100"
              }`}
            >
              <Text
                className={`text-xs font-semibold ${
                  time.status === "ACTIVE" ? "text-yellow-700" : "text-gray-500"
                }`}
              >
                {time.status ?? "UNKNOWN"}
              </Text>
            </View>
          </View>

          {/* Note */}
          {time.remark ? (
            <View className="mt-3 flex-row items-start rounded-xl bg-amber-50 p-3">
              <MessageSquareText
                size={16}
                color="#D97706"
                style={{ marginTop: 2 }}
              />

              <View className="ml-2 flex-1">
                <Text className="mb-1 text-xs font-semibold text-amber-800">
                  Note
                </Text>
                <Text className="text-sm leading-5 text-gray-700">
                  {time.remark}
                </Text>
              </View>
            </View>
          ) : null}
        </>
      )}
    </View>
  );
}
