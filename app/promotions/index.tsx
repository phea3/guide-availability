import { Ionicons } from "@expo/vector-icons";
import { Text, View } from "react-native";

export default function Promotions() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-100 px-6">
      <View className="h-20 w-20 items-center justify-center rounded-full bg-white">
        <Ionicons name="trending-up-outline" size={40} color="#111827" />
      </View>

      <Text className="mt-6 text-2xl font-bold text-gray-900">Promotions</Text>

      <Text className="mt-2 max-w-sm text-center text-base text-gray-500">
        We&apos;re working on this feature. Soon you&apos;ll be able to save and
        easily access your favorite guides.
      </Text>

      <View className="mt-6 rounded-full bg-black px-5 py-2.5">
        <Text className="font-medium text-white">Coming Soon</Text>
      </View>
    </View>
  );
}
