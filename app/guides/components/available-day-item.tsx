import CrossPlatformDatePicker from "@/components/cross-platform-datepicker";
import { useDeleteAvailableTime } from "@/hook/use-delete-available-time";
import {
  AvailableDraftDayType,
  AvailableDraftTimeType,
} from "@/types/availability";
import dayjs from "dayjs";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import "react-native-get-random-values";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";
import AvailableTimeItem from "./available-time-item";

type AvailableDayItemProps = {
  item: {
    id: string;
    startDate?: string;
    endDate?: string;
    remark?: string;
    status?: string;
    availableTimes?: AvailableDraftTimeType[];
  };
  onUpdateDay: (day: AvailableDraftDayType) => void;
  onDeleteDay: (id: string) => void;
  isUpdatingDay?: boolean;
  isDeletingDay?: boolean;
};

export default function AvailableDayItem({
  item,
  onUpdateDay,
  onDeleteDay,
  isUpdatingDay = false,
  isDeletingDay = false,
}: AvailableDayItemProps) {
  const deleteAvailableTime = useDeleteAvailableTime();

  const [isEditing, setIsEditing] = useState(false);
  const [draftDay, setDraftDay] = useState<AvailableDraftDayType>({
    ...item,
    availableTimes: item.availableTimes?.map((time, index) => ({
      ...time,
      index: (index + 1).toString(), // temporary unique id for draft times
    })),
  });
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const id = uuidv4();

  const addTime = () => {
    setDraftDay((prev) => ({
      ...prev,
      availableTimes: [
        ...(prev.availableTimes || []),
        {
          id: null,
          index: id,
          availableDayId: prev.id,
          startTime: dayjs().format("HH:mm"),
          endTime: dayjs().add(1, "hour").format("HH:mm"),
          status: "ACTIVE",
          remark: "",
        },
      ],
    }));
  };
  // Update an existing time (draft)
  const updateTime = (updated: AvailableDraftTimeType) => {
    setDraftDay((prev) => ({
      ...prev,
      availableTimes: prev.availableTimes?.map((t) => {
        if (t.index !== updated.index) return t;

        return {
          ...t,
          ...updated,
        };
      }),
    }));
  };

  // Delete a time (draft)
  const deleteTime = (time: AvailableDraftTimeType) => {
    // New unsaved time: only remove from state
    if (!time.id) {
      setDraftDay((prev) => ({
        ...prev,
        availableTimes:
          prev.availableTimes?.filter((t) => t.index !== time.index) || [],
      }));

      return;
    }

    // Existing DB time: delete database first
    setDeletingId(time.id);

    deleteAvailableTime.mutate(time.id, {
      onSuccess: () => {
        setDraftDay((prev) => ({
          ...prev,
          availableTimes:
            prev.availableTimes?.filter((t) => t.id !== time.id) || [],
        }));

        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Time deleted.",
        });
      },
      onError: (err: any) => {
        Toast.show({
          type: "error",
          text1: "Delete failed",
          text2: err?.message ?? "Something went wrong.",
        });
      },
      onSettled: () => {
        setDeletingId(null);
      },
    });
  };

  return (
    <View className="rounded-2xl bg-white/80 backdrop-blur-md p-4 mx-4 mb-6 border border-gray-300">
      {/* Toggle button */}
      <Pressable
        onPress={() => setIsEditing((prev) => !prev)}
        className="self-end rounded-xl bg-purple-500 px-3 py-1 mb-2"
      >
        <Text className="text-white font-medium">
          {isEditing ? "Done" : "Edit"}
        </Text>
      </Pressable>

      {/* Day info */}
      {isEditing ? (
        <>
          {/* Date pickers */}
          <View className="flex-row justify-between gap-1">
            <CrossPlatformDatePicker
              label="Start Date"
              date={
                draftDay.startDate ? new Date(draftDay.startDate) : new Date()
              }
              setDate={(date) =>
                setDraftDay((prev) => ({
                  ...prev,
                  startDate: date.toISOString(),
                }))
              }
              mode="date"
            />
            <CrossPlatformDatePicker
              label="End Date"
              date={draftDay.endDate ? new Date(draftDay.endDate) : new Date()}
              setDate={(date) =>
                setDraftDay((prev) => ({
                  ...prev,
                  endDate: date.toISOString(),
                }))
              }
              mode="date"
            />
          </View>

          {/* Remark input */}
          <TextInput
            value={draftDay.remark}
            onChangeText={(val) => setDraftDay({ ...draftDay, remark: val })}
            placeholder="Remark"
            className="mt-1 border border-gray-300 rounded-xl px-2 py-1"
          />

          {/* Status checkbox */}
          <View className="flex-row items-center mt-1">
            <Pressable
              onPress={() =>
                setDraftDay((prev) => ({
                  ...prev,
                  status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                }))
              }
              className={`w-6 h-6 rounded-md border border-gray-400 mr-1 ${
                draftDay.status === "ACTIVE" ? "bg-green-500" : "bg-white"
              }`}
            />
            <Text className="font-medium">
              {draftDay.status === "ACTIVE" ? "Active" : "Inactive"}
            </Text>
          </View>
        </>
      ) : (
        <>
          <Text className="font-bold text-base">
            {dayjs(item.startDate).format("DD MMM YYYY")} →{" "}
            {dayjs(item.endDate).format("DD MMM YYYY")}
          </Text>
          <Text className="mt-1 text-sm font-medium">
            Status: {item.status ?? "Unknown"}
          </Text>
          {item.remark && (
            <Text className="text-gray-600 mt-1">Note: {item.remark}</Text>
          )}
        </>
      )}

      {/* Times list */}
      <View className="mt-4">
        <Text className="font-bold text-sm mb-2">Times</Text>
        {draftDay?.availableTimes && draftDay?.availableTimes.length ? (
          draftDay?.availableTimes.map((load, index) => (
            <AvailableTimeItem
              key={load.index}
              time={load}
              onUpdate={updateTime}
              onDelete={deleteTime}
              isEditing={isEditing}
              isDeleting={
                deletingId === item.id && deleteAvailableTime.isPending
              }
            />
          ))
        ) : (
          <Text className="text-gray-400 italic">No times yet</Text>
        )}

        {/* ➕ Add Time */}
        {isEditing && (
          <Pressable
            onPress={addTime}
            className="mt-2 rounded-xl bg-green-500 py-2"
          >
            <Text className="text-center text-white font-medium">
              ➕ Add Time
            </Text>
          </Pressable>
        )}
      </View>
      {/* Day actions */}
      <View className="flex-row gap-3 mt-3">
        <Pressable
          onPress={() =>
            onUpdateDay({
              ...draftDay,
            })
          }
          className="flex-1 rounded-xl bg-blue-500 py-2"
        >
          <Text className="text-center text-white font-medium">
            {isUpdatingDay ? "Updating..." : "Update Day"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => onDeleteDay(item.id)}
          className="flex-1 rounded-xl bg-red-500 py-2"
        >
          <Text className="text-center text-white font-medium">
            {isDeletingDay ? "Deleting..." : "Delete Day"}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
