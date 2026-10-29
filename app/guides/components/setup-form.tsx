// import CrossPlatformDatePicker from "@/components/cross-platform-datepicker";
// import { AvailableDayModel } from "@/hook/use-add-available-day";
// import dayjs from "dayjs";
// import { Pressable, Text, TextInput, View } from "react-native";

// /* Setup form */
// export default function SetupForm({
//   startDate,
//   endDate,
//   remark,
//   status,
//   setStatus,
//   setStartDate,
//   setEndDate,
//   setRemark,
//   handleAddAvailable,
//   isAddingDay = false,
// }: {
//   startDate: Date;
//   endDate: Date;
//   remark: string;
//   status: boolean;
//   setStatus: (status: boolean) => void;
//   setStartDate: (date: Date) => void;
//   setEndDate: (date: Date) => void;
//   setRemark: (remark: string) => void;
//   handleAddAvailable: (data: AvailableDayModel) => void;
//   isAddingDay?: boolean;
// }) {
//   return (
//     <View className="rounded-3xl bg-white/80 backdrop-blur-md p-6 mt-4 mx-4 border border-gray-300">
//       <Text className="text-lg font-bold mb-1">Setup Available Day</Text>

//       {/* Date pickers */}
//       <View className="flex-row justify-between gap-1">
//         <CrossPlatformDatePicker
//           label="Start Date"
//           date={startDate}
//           setDate={setStartDate}
//         />
//         <CrossPlatformDatePicker
//           label="End Date"
//           date={endDate}
//           setDate={setEndDate}
//         />
//       </View>

//       {/* Remark input */}
//       <TextInput
//         value={remark}
//         placeholder="Add a note..."
//         onChangeText={setRemark}
//         className="mt-1 border border-gray-300 rounded-xl px-1 py-1"
//       />

//       {/* Status checkbox */}
//       <View className="flex-row items-center mt-1">
//         <Pressable
//           onPress={() => setStatus(!status)}
//           className={`w-6 h-6 rounded-md border border-gray-400 mr-1 ${
//             status ? "bg-green-500" : "bg-white"
//           }`}
//         />
//         <Text className="font-medium">{status ? "Active" : "Inactive"}</Text>
//       </View>

//       {/* Add button */}
//       <Pressable
//         onPress={() => {
//           handleAddAvailable({
//             startDate: dayjs(startDate).format("YYYY-MM-DD"),
//             endDate: dayjs(endDate).format("YYYY-MM-DD"),
//             remark,
//             status: status ? "ACTIVE" : "INACTIVE",
//           });
//         }}
//         className="mt-1 rounded-xl bg-green-500 py-2"
//       >
//         <Text className="text-center text-white font-medium">
//           {isAddingDay ? "Adding..." : "Add Day"}
//         </Text>
//       </Pressable>
//     </View>
//   );
// }

import CrossPlatformDatePicker from "@/components/cross-platform-datepicker";
import { AvailableDayModel } from "@/hook/use-add-available-day";
import dayjs from "dayjs";
import {
  CalendarCheck,
  CalendarDays,
  CalendarPlus,
  Check,
  Clock,
  FileText,
  MessageSquareText,
} from "lucide-react-native";

import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

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
  const handleSubmit = () => {
    if (isAddingDay) return;

    handleAddAvailable({
      startDate: dayjs(startDate).format("YYYY-MM-DD"),
      endDate: dayjs(endDate).format("YYYY-MM-DD"),
      remark,
      status: status ? "ACTIVE" : "INACTIVE",
    });
  };

  return (
    <View className="mx-4 mt-4 rounded-3xl border border-gray-300 bg-white p-5">
      {/* Header */}
      <View className="mb-6 flex-row items-center">
        <View className="mr-3 h-12 w-12 items-center justify-center rounded-2xl bg-yellow-50">
          <CalendarCheck size={24} color="#c9a849" />
        </View>

        <View className="flex-1">
          <Text className="text-lg font-bold text-gray-900">Availability</Text>
          <Text className="mt-1 text-sm text-gray-500">
            Set the days you are available for work
          </Text>
        </View>
      </View>

      {/* Date range */}
      <View className="mb-5">
        <View className="mb-3 flex-row items-center">
          <CalendarDays size={18} color="#c9a849" />
          <Text className="ml-2 text-sm font-semibold text-gray-800">
            Available date range
          </Text>
        </View>

        <View className="gap-3">
          <View className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <View className="mb-2 flex-row items-center">
              <View className="mr-2 h-8 w-8 items-center justify-center rounded-xl bg-white">
                <CalendarPlus size={17} color="#c9a849" />
              </View>
              <Text className="text-sm font-medium text-gray-600">
                Start date
              </Text>
            </View>

            <CrossPlatformDatePicker
              label="Start Date"
              date={startDate}
              setDate={setStartDate}
            />
          </View>

          <View className="rounded-2xl border border-gray-200 bg-gray-50 p-3">
            <View className="mb-2 flex-row items-center">
              <View className="mr-2 h-8 w-8 items-center justify-center rounded-xl bg-white">
                <CalendarCheck size={17} color="#c9a849" />
              </View>
              <Text className="text-sm font-medium text-gray-600">
                End date
              </Text>
            </View>

            <CrossPlatformDatePicker
              label="End Date"
              date={endDate}
              setDate={setEndDate}
            />
          </View>
        </View>
      </View>

      {/* Remark */}
      <View className="mb-5">
        <View className="mb-3 flex-row items-center">
          <MessageSquareText size={18} color="#c9a849" />
          <Text className="ml-2 text-sm font-semibold text-gray-800">Note</Text>
          <Text className="ml-2 text-xs text-gray-400">(Optional)</Text>
        </View>

        <View className="flex-row items-start rounded-2xl border border-gray-200 bg-gray-50 px-3 py-3">
          <FileText size={18} color="#9CA3AF" style={{ marginTop: 2 }} />
          <TextInput
            value={remark}
            onChangeText={setRemark}
            placeholder="Add a note about your availability..."
            placeholderTextColor="#9CA3AF"
            multiline
            textAlignVertical="top"
            className="ml-3 min-h-20 flex-1 text-sm text-gray-800"
          />
        </View>
      </View>

      {/* Status */}
      <View className="mb-6 flex-row items-center justify-between rounded-2xl border border-gray-100 bg-gray-50 p-4">
        <View className="flex-1 flex-row items-center">
          <View
            className={`mr-3 h-10 w-10 items-center justify-center rounded-xl ${
              status ? "bg-yellow-100" : "bg-gray-200"
            }`}
          >
            {status ? (
              <Check size={20} color="#c9a849" />
            ) : (
              <Clock size={20} color="#6B7280" />
            )}
          </View>

          <View className="flex-1">
            <Text className="font-semibold text-gray-900">
              {status ? "Active" : "Inactive"}
            </Text>
            <Text className="mt-1 text-xs text-gray-500">
              {status
                ? "You are available for bookings"
                : "You are not available for bookings"}
            </Text>
          </View>
        </View>

        <Pressable
          accessibilityRole="switch"
          accessibilityLabel="Availability status"
          accessibilityState={{ checked: status }}
          onPress={() => setStatus(!status)}
          className={`h-8 w-14 justify-center rounded-full px-1 ${
            status ? "bg-yellow-500" : "bg-gray-300"
          }`}
        >
          <View
            className={`h-6 w-6 items-center justify-center rounded-full bg-white ${
              status ? "self-end" : "self-start"
            }`}
          />
        </Pressable>
      </View>

      {/* Submit */}
      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Add availability"
        disabled={isAddingDay}
        onPress={handleSubmit}
        className={`min-h-14 flex-row items-center justify-center rounded-2xl ${
          isAddingDay ? "bg-yellow-400" : "bg-yellow-600 active:bg-yellow-700"
        }`}
      >
        {isAddingDay ? (
          <>
            <ActivityIndicator color="#FFFFFF" />
            <Text className="ml-2 font-semibold text-white">
              Adding availability...
            </Text>
          </>
        ) : (
          <>
            <CalendarPlus size={20} color="#FFFFFF" />
            <Text className="ml-2 font-semibold text-white">
              Add Availability
            </Text>
          </>
        )}
      </Pressable>
    </View>
  );
}
