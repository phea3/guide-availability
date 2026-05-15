"use client";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";

type Props = {
  title?: string;
  color?: string;
};
export default function BackButton({ title, color }: Props) {
  const router = useRouter();

  return (
    <View
      className={`p-4 flex flex-row relative ${color ? `bg-[${color}]` : "bg-[#c9a849]"}`}
    >
      <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-3 left-3 w-10 h-10 flex items-center justify-center border border-white rounded-full"
      >
        <Ionicons
          name="chevron-back"
          size={20}
          a
          color="white"
          className="items-center justify-center "
        />
      </TouchableOpacity>
      <View className="flex-1 items-center">
        <Text className="text-lg font-bold text-white">{title}</Text>
      </View>
      {/* <TouchableOpacity
        onPress={() => router.back()}
        className="absolute top-3 right-3 w-10 h-10 flex items-center justify-center border border-white rounded-full"
      >
        <Ionicons
          name="dot"
          size={20}
          a
          color="white"
          className="items-center justify-center "
        />
      </TouchableOpacity> */}
    </View>
  );
}
