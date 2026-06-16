"use client";

import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { TouchableOpacity, View } from "react-native";

export default function BackButtonDefault() {
  const router = useRouter();

  return (
    <View className="p-10 absolute top-10">
      <TouchableOpacity
        onPress={() => router.back()}
        className="w-10 h-10 flex items-center justify-center rounded-full bg-black"
      >
        <Ionicons
          name="chevron-back"
          size={20}
          a
          color="white"
          className="items-center justify-center "
        />
      </TouchableOpacity>
    </View>
  );
}
