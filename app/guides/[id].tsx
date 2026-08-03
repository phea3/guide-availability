import GlassCalendar from "@/components/glass-calendar";
import { useAddAvailableDay } from "@/hook/use-add-available-day";
import { useGetGuideById } from "@/hook/use-guide-id";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ImageBackground,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import BackButton from "../_components/back-button";

export default function GuideDetail() {
  const available = useAddAvailableDay();
  const params = useLocalSearchParams();
  const [remark, setRemark] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: guide, isPending } = useGetGuideById(id);

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg font-bold">Fetching...</Text>
      </View>
    );
  }

  if (!guide) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg font-bold">Guide not found</Text>
      </View>
    );
  }

  //   const handleAddAvailable = () => {
  //     available.mutate(
  //       {
  //         userId:,
  //         startDate: ,
  //         endDate: ,
  //         status: ,
  //         remark: ,
  // availableTimes: [{
  //         startTime: ,
  //         endTime: ,
  //         status: ,
  //         remark: ,
  // }]
  //       },
  //       {
  //         onSuccess: async (data) => {
  //           Toast.show({
  //             type: "success",
  //             text1: "Success",
  //             text2: "Add day.",
  //           });
  //         },
  //         onError: (err: any) => {
  //           Toast.show({
  //             type: "error",
  //             text1: "Add failed",
  //             text2: err?.message ?? "Something went wrong.",
  //           });
  //         },
  //       },
  //     );
  //   };

  // const handleAddPeriod = () => {
  //   console.log("Add available period");
  // };

  return (
    <>
      <BackButton title={guide?.username || "Unknown"} />
      <ImageBackground
        source={require("../../assets/images/pattern-background.png")}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="absolute inset-0 bg-white/95" />
        <GlassCalendar />

        <View className="flex flex-row justify-between items-center gap-3 rounded-3xl bg-white p-4">
          <Text className=" font-bold text-base">Add Available Day</Text>
          <Pressable
            onPress={() => setShowModal(true)}
            className="rounded-2xl bg-emerald-500 p-2 items-center"
          >
            <Text className="text-white font-bold text-base">➕</Text>
          </Pressable>
        </View>
      </ImageBackground>

      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        onRequestClose={() => setShowModal(false)}
      >
        <View className="flex-1 items-center justify-center bg-black/50 px-6">
          <View className="w-full max-w-sm rounded-3xl bg-white p-6">
            <Text className="mb-2 text-lg font-bold">
              Select available Days
            </Text>
            <View className="flex-row justify-between gap-3">
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setStartDate(selectedDate);
                  }
                }}
                className="flex-1 rounded-xl border border-gray-300 py-3"
              />
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                onChange={(event, selectedDate) => {
                  if (selectedDate) {
                    setEndDate(selectedDate);
                  }
                }}
              />
            </View>

            <View>
              <TextInput
                value={remark}
                defaultValue="hello"
                placeholder="Type here"
                onChangeText={(value) => setRemark(value)}
                caretHidden
              />
            </View>
            <View className="flex-row gap-3 mt-4">
              <Pressable
                onPress={() => setShowModal(false)}
                className="flex-1 rounded-xl border border-gray-300 py-3"
              >
                <Text className="text-center font-medium">Cancel</Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setShowModal(false);
                }}
                className="flex-1 rounded-xl bg-green-500 py-3"
              >
                <Text className="text-center font-medium text-white">
                  Confirm
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </>
  );
}
