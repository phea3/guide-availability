"use client";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function BackButton() {
  const router = useRouter();

  return (
    <TouchableOpacity onPress={() => router.back()} className="p-4">
      <View className="w-10 h-10 flex items-center justify-center border rounded-full">
        <Ionicons
          name="chevron-back"
          size={20}
          color="black"
          className="items-center justify-center"
        />
      </View>
    </TouchableOpacity>
  );
}
