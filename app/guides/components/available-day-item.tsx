import CrossPlatformDatePicker from "@/components/cross-platform-datepicker";
import { useDeleteAvailableTime } from "@/hook/use-delete-available-time";
import {
  AvailableDraftDayType,
  AvailableDraftTimeType,
} from "@/types/availability";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import timezone from "dayjs/plugin/timezone";
import utc from "dayjs/plugin/utc";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import "react-native-get-random-values";
import Toast from "react-native-toast-message";
import { v4 as uuidv4 } from "uuid";
import AvailableTimeItem from "./available-time-item";

dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);

type AvailableDayItemProps = {
  item: {
    id: string;
    startDate?: string;
    endDate?: string;
    remark?: string;
    status?: string;
    availableTimes?: AvailableDraftTimeType[];
  };
  onUpdateDay: (day: AvailableDraftDayType) => Promise<void>;
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
  const [isModalVisible, setIsModalVisible] = useState(false);

  const [draftDay, setDraftDay] = useState<AvailableDraftDayType>({
    ...item,
    availableTimes: item.availableTimes?.map((time, index) => ({
      ...time,
      index: (index + 1).toString(),
    })),
  });

  const [deletingId, setDeletingId] = useState<string | null>(null);

  const addTime = () => {
    const id = uuidv4();

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

  const updateTime = (updated: AvailableDraftTimeType) => {
    setDraftDay((prev) => ({
      ...prev,
      availableTimes: prev.availableTimes?.map((t) =>
        t.index === updated.index
          ? {
              ...t,
              ...updated,
            }
          : t,
      ),
    }));
  };

  const deleteTime = (time: AvailableDraftTimeType) => {
    // New unsaved time
    if (!time.id) {
      setDraftDay((prev) => ({
        ...prev,
        availableTimes:
          prev.availableTimes?.filter((t) => t.index !== time.index) || [],
      }));

      return;
    }

    // Existing DB time
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

  const openEditModal = () => {
    // Reset draft from current item every time modal opens
    setDraftDay({
      ...item,
      availableTimes: item.availableTimes?.map((time, index) => ({
        ...time,
        index: time.index ?? (index + 1).toString(),
      })),
    });

    setIsModalVisible(true);
  };

  const closeEditModal = () => {
    if (isUpdatingDay) return;

    setIsModalVisible(false);
  };

  const handleUpdateDay = async () => {
    try {
      await onUpdateDay({
        ...draftDay,
      });

      setIsModalVisible(false);
    } catch {}
  };
  return (
    <>
      {/* =========================
          DAY CARD
      ========================= */}
      <View className="mx-4 mb-6 rounded-2xl border border-gray-300 bg-white/80 p-4">
        {/* Edit button */}
        <Pressable
          onPress={openEditModal}
          className="mb-3 self-end rounded-xl bg-purple-500 px-4 py-2"
        >
          <Text className="font-medium text-white">Edit</Text>
        </Pressable>

        {/* Day info */}
        <Text className="text-base font-bold">
          {dayjs(item.startDate).format("DD MMM YYYY")} →{" "}
          {dayjs(item.endDate).format("DD MMM YYYY")}
        </Text>

        <Text className="mt-1 text-sm font-medium">
          Status: {item.status ?? "Unknown"}
        </Text>

        {item.remark && (
          <Text className="mt-1 text-gray-600">Note: {item.remark}</Text>
        )}

        {/* Times */}
        <View className="mt-4">
          <Text className="mb-2 text-sm font-bold">Times</Text>

          {item.availableTimes?.length ? (
            item.availableTimes.map((time, index) => (
              <AvailableTimeItem
                key={time.id ?? index}
                time={time}
                onUpdate={() => {}}
                onDelete={() => {}}
                isEditing={false}
              />
            ))
          ) : (
            <Text className="italic text-gray-400">No times yet</Text>
          )}
        </View>

        {/* Day actions */}
        <View className="mt-3 flex-row gap-3">
          <Pressable
            onPress={() => onDeleteDay(item.id)}
            className="flex-1 rounded-xl bg-red-500 py-2"
          >
            <Text className="text-center font-medium text-white">
              {isDeletingDay ? "Deleting..." : "Delete Day"}
            </Text>
          </Pressable>
        </View>
      </View>

      {/* =========================
          EDIT MODAL
      ========================= */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeEditModal}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="max-h-[90%] rounded-t-3xl bg-white">
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-gray-200 px-5 py-4">
              <Text className="text-xl font-bold text-gray-900">
                Edit Availability
              </Text>

              <Pressable
                onPress={closeEditModal}
                disabled={isUpdatingDay}
                className="rounded-full bg-gray-100 px-4 py-2"
              >
                <Text className="font-medium text-gray-700">Close</Text>
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{
                padding: 20,
                paddingBottom: 30,
              }}
            >
              {/* =========================
                  DATE PICKERS
              ========================= */}
              <Text className="mb-2 text-sm font-bold text-gray-700">
                Dates
              </Text>

              <View className="flex-row justify-between gap-2">
                <View className="flex-1">
                  <CrossPlatformDatePicker
                    label="Start Date"
                    date={
                      draftDay.startDate
                        ? new Date(draftDay.startDate)
                        : new Date()
                    }
                    setDate={(date) =>
                      setDraftDay((prev) => ({
                        ...prev,
                        startDate: date.toISOString(),
                      }))
                    }
                    mode="date"
                  />
                </View>

                <View className="flex-1">
                  <CrossPlatformDatePicker
                    label="End Date"
                    date={
                      draftDay.endDate ? new Date(draftDay.endDate) : new Date()
                    }
                    setDate={(date) =>
                      setDraftDay((prev) => ({
                        ...prev,
                        endDate: date.toISOString(),
                      }))
                    }
                    mode="date"
                  />
                </View>
              </View>

              {/* =========================
                  REMARK
              ========================= */}
              <Text className="mb-2 mt-5 text-sm font-bold text-gray-700">
                Remark
              </Text>

              <TextInput
                value={draftDay.remark ?? ""}
                onChangeText={(val) =>
                  setDraftDay((prev) => ({
                    ...prev,
                    remark: val,
                  }))
                }
                placeholder="Remark"
                multiline
                className="rounded-xl border border-gray-300 px-3 py-3"
              />

              {/* =========================
                  STATUS
              ========================= */}
              <Text className="mb-2 mt-5 text-sm font-bold text-gray-700">
                Status
              </Text>

              <Pressable
                onPress={() =>
                  setDraftDay((prev) => ({
                    ...prev,
                    status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                  }))
                }
                className="flex-row items-center"
              >
                <View
                  className={`mr-2 h-6 w-6 rounded-md border border-gray-400 ${
                    draftDay.status === "ACTIVE" ? "bg-green-500" : "bg-white"
                  }`}
                />

                <Text className="font-medium">
                  {draftDay.status === "ACTIVE" ? "Active" : "Inactive"}
                </Text>
              </Pressable>

              {/* =========================
                  TIMES
              ========================= */}
              <View className="mt-6">
                <View className="mb-2 flex-row items-center justify-between">
                  <Text className="text-sm font-bold text-gray-700">
                    Available Times
                  </Text>

                  <Pressable
                    onPress={addTime}
                    className="rounded-xl bg-green-500 px-3 py-2"
                  >
                    <Text className="font-medium text-white">+ Add Time</Text>
                  </Pressable>
                </View>

                {draftDay.availableTimes?.length ? (
                  draftDay.availableTimes.map((time, index) => (
                    <AvailableTimeItem
                      key={time.index ?? time.id ?? index}
                      time={time}
                      onUpdate={updateTime}
                      onDelete={deleteTime}
                      isEditing={true}
                      isDeleting={
                        deletingId === time.id && deleteAvailableTime.isPending
                      }
                    />
                  ))
                ) : (
                  <Text className="italic text-gray-400">No times yet</Text>
                )}
              </View>

              {/* =========================
                  ACTIONS
              ========================= */}
              <View className="mt-6 flex-row gap-3">
                <Pressable
                  onPress={handleUpdateDay}
                  disabled={isUpdatingDay}
                  className="flex-1 rounded-xl bg-blue-500 py-3"
                >
                  <Text className="text-center font-medium text-white">
                    {isUpdatingDay ? "Updating..." : "Update Day"}
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
