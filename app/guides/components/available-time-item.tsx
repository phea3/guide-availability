import CrossPlatformDatePicker from "@/components/cross-platform-datepicker";
import { AvailableDraftTimeType } from "@/types/availability";
import { Pressable, Text, TextInput, View } from "react-native";

import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
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

const timeToDate = (time?: string) => {
  const [hours, minutes] = (time || "00:00").split(":").map(Number);

  const date = new Date();
  date.setHours(hours || 0, minutes || 0, 0, 0);

  return date;
};

const dateToTime = (date: Date) => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${hours}:${minutes}`;
};

const formatTime = (time?: string) => {
  const date = timeToDate(time);

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
    <View className="mb-4 rounded-xl border border-gray-300 p-2">
      {isEditing ? (
        <>
          {/* Time pickers */}
          <View className="flex-row justify-between gap-1">
            <CrossPlatformDatePicker
              label="Start Time"
              date={timeToDate(time.startTime)}
              setDate={(date) =>
                onUpdate({
                  ...time,
                  startTime: dateToTime(date),
                })
              }
              mode="time"
            />

            <CrossPlatformDatePicker
              label="End Time"
              date={timeToDate(time.endTime)}
              setDate={(date) =>
                onUpdate({
                  ...time,
                  endTime: dateToTime(date),
                })
              }
              mode="time"
            />
          </View>

          <TextInput
            value={time.remark ?? ""}
            onChangeText={(val) =>
              onUpdate({
                ...time,
                remark: val,
              })
            }
            placeholder="Remark"
            className="mt-1 rounded-xl border border-gray-300 px-2 py-1"
          />

          <View className="mt-1 flex-row items-center">
            <Pressable
              onPress={() =>
                onUpdate({
                  ...time,
                  status: time.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                })
              }
              className={`mr-1 h-6 w-6 rounded-md border border-gray-400 ${
                time.status === "ACTIVE" ? "bg-green-500" : "bg-white"
              }`}
            />

            <Text className="font-medium">
              {time.status === "ACTIVE" ? "Active" : "Inactive"}
            </Text>
          </View>
        </>
      ) : (
        <>
          <Text>
            {formatTime(time.startTime)} → {formatTime(time.endTime)}
          </Text>

          <Text>Status: {time.status ?? "Unknown"}</Text>

          {time.remark && <Text>Note: {time.remark}</Text>}
        </>
      )}

      {/* Delete only inside edit modal */}
      {isEditing && (
        <Pressable
          onPress={() => onDelete(time)}
          disabled={isDeleting}
          className="mt-2 self-end rounded-xl bg-red-400 px-3 py-1"
        >
          <Text className="font-medium text-white">
            {isDeleting ? "Deleting..." : "Delete Time"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
