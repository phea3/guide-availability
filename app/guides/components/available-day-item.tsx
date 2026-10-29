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
import {
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  Clock,
  FileText,
  MessageSquareText,
  Pencil,
  Save,
  Trash2,
  X,
} from "lucide-react-native";
import { useState } from "react";
import {
  ActivityIndicator,
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
      {/* DAY CARD */}
      <View className="mx-4 mb-5 rounded-3xl border border-gray-300 bg-white p-5">
        {/* Header */}
        <View className="mb-4 flex-row items-center justify-between">
          <View className="flex-1 flex-row items-center">
            <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50">
              <CalendarCheck size={24} color="#c9a849" />
            </View>

            <View className="flex-1">
              <Text className="text-base font-bold text-gray-900">
                Available Day
              </Text>
              <Text className="mt-1 text-xs text-gray-500">
                Availability schedule
              </Text>
            </View>
          </View>

          <Pressable
            onPress={openEditModal}
            accessibilityRole="button"
            accessibilityLabel="Edit availability"
            className="h-10 w-10 items-center justify-center rounded-xl bg-purple-50"
          >
            <Pencil size={18} color="#9333EA" />
          </Pressable>
        </View>

        {/* Date range */}
        <View className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
          <View className="mb-3 flex-row items-center">
            <CalendarDays size={18} color="#c9a849" />
            <Text className="ml-2 text-sm font-semibold text-gray-700">
              Date range
            </Text>
          </View>

          <View className="flex-row items-center">
            <View className="flex-1">
              <Text className="mb-1 text-xs text-gray-500">Start date</Text>
              <Text className="text-sm font-bold text-gray-900">
                {dayjs(item.startDate).format("DD MMM YYYY")}
              </Text>
            </View>

            <View className="mx-3 items-center">
              <CalendarCheck size={18} color="#9CA3AF" />
            </View>

            <View className="flex-1">
              <Text className="mb-1 text-xs text-gray-500">End date</Text>
              <Text className="text-sm font-bold text-gray-900">
                {dayjs(item.endDate).format("DD MMM YYYY")}
              </Text>
            </View>
          </View>
        </View>

        {/* Status */}
        <View className="mt-4 flex-row items-center justify-between">
          <View className="flex-row items-center">
            <View
              className={`mr-3 h-10 w-10 items-center justify-center rounded-xl ${
                item.status === "ACTIVE" ? "bg-yellow-50" : "bg-gray-100"
              }`}
            >
              {item.status === "ACTIVE" ? (
                <Check size={20} color="#c9a849" />
              ) : (
                <Clock size={20} color="#6B7280" />
              )}
            </View>

            <View>
              <Text className="text-sm font-semibold text-gray-800">
                Status
              </Text>
              <Text className="mt-1 text-xs text-gray-500">
                {item.status === "ACTIVE"
                  ? "Available for bookings"
                  : "Not available for bookings"}
              </Text>
            </View>
          </View>

          <View
            className={`rounded-full px-3 py-1.5 ${
              item.status === "ACTIVE" ? "bg-yellow-50" : "bg-gray-100"
            }`}
          >
            <Text
              className={`text-xs font-bold ${
                item.status === "ACTIVE" ? "text-yellow-700" : "text-gray-500"
              }`}
            >
              {item.status ?? "UNKNOWN"}
            </Text>
          </View>
        </View>

        {/* Remark */}
        {item.remark ? (
          <View className="mt-4 flex-row items-start rounded-2xl bg-amber-50 p-3">
            <MessageSquareText
              size={18}
              color="#D97706"
              style={{ marginTop: 2 }}
            />
            <View className="ml-3 flex-1">
              <Text className="mb-1 text-xs font-semibold text-amber-800">
                Note
              </Text>
              <Text className="text-sm leading-5 text-gray-700">
                {item.remark}
              </Text>
            </View>
          </View>
        ) : null}

        {/* Available times */}
        {/* <View className="mt-5">
          <View className="mb-3 flex-row items-center justify-between">
            <View className="flex-row items-center">
              <Clock size={18} color="#c9a849" />
              <Text className="ml-2 text-sm font-bold text-gray-900">
                Available Times
              </Text>
            </View>

            <View className="rounded-full bg-yellow-50 px-3 py-1">
              <Text className="text-xs font-semibold text-yellow-700">
                {item.availableTimes?.length ?? 0} times
              </Text>
            </View>
          </View>

          {item.availableTimes?.length ? (
            <View className="gap-2">
              {item.availableTimes.map((time, index) => (
                <AvailableTimeItem
                  key={time.id ?? index}
                  time={time}
                  onUpdate={() => {}}
                  onDelete={() => {}}
                  isEditing={false}
                />
              ))}
            </View>
          ) : (
            <View className="items-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-6">
              <Clock size={24} color="#9CA3AF" />
              <Text className="mt-2 text-sm font-medium text-gray-500">
                No times added yet
              </Text>
              <Text className="mt-1 text-xs text-gray-400">
                Edit this day to add available times
              </Text>
            </View>
          )}
        </View> */}

        {/* Delete */}
        <Pressable
          onPress={() => onDeleteDay(item.id)}
          disabled={isDeletingDay}
          accessibilityRole="button"
          accessibilityLabel="Delete availability day"
          className={`mt-5 min-h-12 flex-row items-center justify-center rounded-2xl border border-red-100 ${
            isDeletingDay ? "bg-red-50" : "bg-white active:bg-red-50"
          }`}
        >
          {isDeletingDay ? (
            <ActivityIndicator size="small" color="#DC2626" />
          ) : (
            <Trash2 size={17} color="#DC2626" />
          )}

          <Text className="ml-2 text-sm font-semibold text-red-600">
            {isDeletingDay ? "Deleting..." : "Delete Day"}
          </Text>
        </Pressable>
      </View>

      {/* EDIT MODAL */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="slide"
        onRequestClose={closeEditModal}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View className="max-h-[92%] rounded-t-3xl bg-white">
            {/* Modal header */}
            <View className="flex-row items-center justify-between border-b border-gray-100 px-5 py-4">
              <View className="flex-1 flex-row items-center">
                <View className="mr-3 h-11 w-11 items-center justify-center rounded-2xl bg-purple-50">
                  <Pencil size={21} color="#9333EA" />
                </View>

                <View className="flex-1">
                  <Text className="text-lg font-bold text-gray-900">
                    Edit Availability
                  </Text>
                  <Text className="mt-1 text-xs text-gray-500">
                    Update your schedule details
                  </Text>
                </View>
              </View>

              <Pressable
                onPress={closeEditModal}
                disabled={isUpdatingDay}
                accessibilityRole="button"
                accessibilityLabel="Close edit modal"
                className="h-10 w-10 items-center justify-center rounded-full bg-gray-100"
              >
                <X size={20} color="#4B5563" />
              </Pressable>
            </View>

            <ScrollView
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{
                padding: 20,
                paddingBottom: 36,
              }}
            >
              {/* Dates */}
              <View className="mb-3 flex-row items-center">
                <CalendarDays size={18} color="#c9a849" />
                <Text className="ml-2 text-sm font-bold text-gray-800">
                  Date range
                </Text>
              </View>

              <View className="gap-3">
                <View className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  <View className="mb-2 flex-row items-center">
                    <CalendarPlus size={17} color="#c9a849" />
                    <Text className="ml-2 text-sm font-medium text-gray-600">
                      Start date
                    </Text>
                  </View>

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

                <View className="rounded-2xl border border-gray-100 bg-gray-50 p-3">
                  <View className="mb-2 flex-row items-center">
                    <CalendarCheck size={17} color="#c9a849" />
                    <Text className="ml-2 text-sm font-medium text-gray-600">
                      End date
                    </Text>
                  </View>

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

              {/* Remark */}
              <View className="mb-3 mt-5 flex-row items-center">
                <MessageSquareText size={18} color="#c9a849" />
                <Text className="ml-2 text-sm font-bold text-gray-800">
                  Note
                </Text>
                <Text className="ml-2 text-xs text-gray-400">(Optional)</Text>
              </View>

              <View className="flex-row items-start rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
                <FileText size={18} color="#9CA3AF" style={{ marginTop: 2 }} />
                <TextInput
                  value={draftDay.remark ?? ""}
                  onChangeText={(val) =>
                    setDraftDay((prev) => ({
                      ...prev,
                      remark: val,
                    }))
                  }
                  placeholder="Add a note about your availability..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  textAlignVertical="top"
                  className="ml-3 min-h-20 flex-1 text-sm text-gray-800"
                />
              </View>

              {/* Status */}
              <View className="mb-3 mt-5 flex-row items-center">
                <Check size={18} color="#c9a849" />
                <Text className="ml-2 text-sm font-bold text-gray-800">
                  Availability status
                </Text>
              </View>

              <View className="flex-row items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
                <View className="flex-1 flex-row items-center">
                  <View
                    className={`mr-3 h-10 w-10 items-center justify-center rounded-xl ${
                      draftDay.status === "ACTIVE"
                        ? "bg-yellow-100"
                        : "bg-gray-200"
                    }`}
                  >
                    {draftDay.status === "ACTIVE" ? (
                      <Check size={20} color="#c9a849" />
                    ) : (
                      <Clock size={20} color="#6B7280" />
                    )}
                  </View>

                  <View className="flex-1">
                    <Text className="font-semibold text-gray-900">
                      {draftDay.status === "ACTIVE" ? "Active" : "Inactive"}
                    </Text>
                    <Text className="mt-1 text-xs text-gray-500">
                      {draftDay.status === "ACTIVE"
                        ? "Available for bookings"
                        : "Not available for bookings"}
                    </Text>
                  </View>
                </View>

                <Pressable
                  accessibilityRole="switch"
                  accessibilityLabel="Availability status"
                  accessibilityState={{
                    checked: draftDay.status === "ACTIVE",
                  }}
                  onPress={() =>
                    setDraftDay((prev) => ({
                      ...prev,
                      status: prev.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
                    }))
                  }
                  className={`h-8 w-14 justify-center rounded-full px-1 ${
                    draftDay.status === "ACTIVE"
                      ? "bg-yellow-500"
                      : "bg-gray-300"
                  }`}
                >
                  <View
                    className={`h-6 w-6 rounded-full bg-white ${
                      draftDay.status === "ACTIVE" ? "self-end" : "self-start"
                    }`}
                  />
                </Pressable>
              </View>

              {/* Available times */}
              {/* <View className="mb-3 mt-6 flex-row items-center justify-between">
                <View className="flex-1 flex-row items-center">
                  <Clock size={18} color="#c9a849" />
                  <Text className="ml-2 text-sm font-bold text-gray-800">
                    Available Times
                  </Text>
                </View>

                <Pressable
                  onPress={addTime}
                  disabled={isUpdatingDay}
                  accessibilityRole="button"
                  accessibilityLabel="Add available time"
                  className="flex-row items-center rounded-xl bg-yellow-50 px-3 py-2"
                >
                  <Plus size={17} color="#c9a849" />
                  <Text className="ml-1 text-sm font-semibold text-yellow-700">
                    Add Time
                  </Text>
                </Pressable>
              </View> */}

              {/* {draftDay.availableTimes?.length ? (
                <View className="gap-3">
                  {draftDay.availableTimes.map((time, index) => (
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
                  ))}
                </View>
              ) : (
                <View className="items-center rounded-2xl border border-dashed border-gray-200 bg-gray-50 py-6">
                  <Clock size={24} color="#9CA3AF" />
                  <Text className="mt-2 text-sm font-medium text-gray-500">
                    No times added yet
                  </Text>
                  <Text className="mt-1 text-xs text-gray-400">
                    Tap Add Time to create a schedule
                  </Text>
                </View>
              )} */}

              {/* Update button */}
              <Pressable
                onPress={handleUpdateDay}
                disabled={isUpdatingDay}
                accessibilityRole="button"
                accessibilityLabel="Save availability changes"
                className={`mt-6 min-h-14 flex-row items-center justify-center rounded-2xl ${
                  isUpdatingDay
                    ? "bg-blue-400"
                    : "bg-blue-600 active:bg-blue-700"
                }`}
              >
                {isUpdatingDay ? (
                  <>
                    <ActivityIndicator size="small" color="#FFFFFF" />
                    <Text className="ml-2 font-semibold text-white">
                      Updating...
                    </Text>
                  </>
                ) : (
                  <>
                    <Save size={19} color="#FFFFFF" />
                    <Text className="ml-2 font-semibold text-white">
                      Save Changes
                    </Text>
                  </>
                )}
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
}
