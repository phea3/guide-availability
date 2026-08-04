import CrossPlatformDatePicker from "@/components/cross-platform-datepicker";
import { AvailableDraftTimeType } from "@/types/availability";
import dayjs from "dayjs";
import { Pressable, Text, TextInput, View } from "react-native";

type AvailableTimeItemProps = {
  time: AvailableDraftTimeType;
  onUpdate: (t: AvailableDraftTimeType) => void;
  onDelete: (time: AvailableDraftTimeType) => void;
  isEditing?: boolean;
  isDeleting?: boolean;
};

export default function AvailableTimeItem({
  time,
  onUpdate,
  onDelete,
  isEditing = false,
  isDeleting = false,
}: AvailableTimeItemProps) {
  return (
    <View className="rounded-xl  backdrop-blur-md p-2 mb-4 border border-gray-300">
      {isEditing ? (
        <>
          {/* Time pickers */}
          <View className="flex-row justify-between gap-1">
            <CrossPlatformDatePicker
              label="Start Time"
              date={dayjs(time.startTime, "HH:mm").toDate()}
              setDate={(date) =>
                onUpdate({ ...time, startTime: dayjs(date).format("HH:mm") })
              }
              mode="time"
            />
            <CrossPlatformDatePicker
              label="End Time"
              date={dayjs(time.endTime, "HH:mm").toDate()}
              setDate={(date) =>
                onUpdate({ ...time, endTime: dayjs(date).format("HH:mm") })
              }
              mode="time"
            />
          </View>

          <TextInput
            value={time.remark}
            onChangeText={(val) => onUpdate({ ...time, remark: val })}
            placeholder="Remark"
            className="mt-1 border border-gray-300 rounded-xl px-2 py-1"
          />

          <View className="flex-row items-center mt-1">
            <Pressable
              onPress={() =>
                onUpdate({
                  ...time,
                  status: time.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                })
              }
              className={`w-6 h-6 rounded-md border border-gray-400 mr-1 ${
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
            {dayjs(time.startTime, "HH:mm").format("HH:mm")} →{" "}
            {dayjs(time.endTime, "HH:mm").format("HH:mm A")}
          </Text>
          <Text>Status: {time.status ?? "Unknown"}</Text>
          {time.remark && <Text>Note: {time.remark}</Text>}
        </>
      )}

      {/* Row actions */}
      {time && (
        <Pressable
          onPress={() => onDelete(time)}
          className="self-end rounded-xl bg-red-400 px-3 py-1 mb-2"
        >
          <Text className="text-white font-medium">
            {" "}
            {isDeleting ? "Deleting..." : "Delete Time"}
          </Text>
        </Pressable>
      )}
    </View>
  );
}
