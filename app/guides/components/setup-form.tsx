import CrossPlatformDatePicker from "@/components/cross-platform-datepicker";
import { AvailableDayModel } from "@/hook/use-add-available-day";
import dayjs from "dayjs";
import { Pressable, Text, TextInput, View } from "react-native";

/* Setup form */
export default function SetupForm({
  startDate,
  endDate,
  remark,
  status,
  setStatus,
  setStartDate,
  setEndDate,
  setRemark,
  handleAddAvailable,
  isAddingDay = false,
}: {
  startDate: Date;
  endDate: Date;
  remark: string;
  status: boolean;
  setStatus: (status: boolean) => void;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
  setRemark: (remark: string) => void;
  handleAddAvailable: (data: AvailableDayModel) => void;
  isAddingDay?: boolean;
}) {
  return (
    <View className="rounded-3xl bg-white/80 backdrop-blur-md p-6 mt-4 mx-4 border border-gray-300">
      <Text className="text-lg font-bold mb-1">Setup Available Day</Text>

      {/* Date pickers */}
      <View className="flex-row justify-between gap-1">
        <CrossPlatformDatePicker
          label="Start Date"
          date={startDate}
          setDate={setStartDate}
        />
        <CrossPlatformDatePicker
          label="End Date"
          date={endDate}
          setDate={setEndDate}
        />
      </View>

      {/* Remark input */}
      <TextInput
        value={remark}
        placeholder="Add a note..."
        onChangeText={setRemark}
        className="mt-1 border border-gray-300 rounded-xl px-1 py-1"
      />

      {/* Status checkbox */}
      <View className="flex-row items-center mt-1">
        <Pressable
          onPress={() => setStatus(!status)}
          className={`w-6 h-6 rounded-md border border-gray-400 mr-1 ${
            status ? "bg-green-500" : "bg-white"
          }`}
        />
        <Text className="font-medium">{status ? "Active" : "Inactive"}</Text>
      </View>

      {/* Add button */}
      <Pressable
        onPress={() => {
          handleAddAvailable({
            startDate: dayjs(startDate).format("YYYY-MM-DD"),
            endDate: dayjs(endDate).format("YYYY-MM-DD"),
            remark,
            status: status ? "ACTIVE" : "INACTIVE",
          });
        }}
        className="mt-1 rounded-xl bg-green-500 py-2"
      >
        <Text className="text-center text-white font-medium">
          {isAddingDay ? "Adding..." : "Add Day"}
        </Text>
      </Pressable>
    </View>
  );
}
