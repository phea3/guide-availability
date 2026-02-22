import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Swiper from "react-native-swiper";

export default function Intro() {
  return (
    <Swiper loop={false} showsPagination>
      {/* Page 1 */}
      <View className="flex-1 bg-blue-500 items-center justify-center p-6">
        <Text className="text-white text-3xl font-bold">Welcome</Text>
        <Text className="text-white mt-4 text-center">
          Find trusted local guides easily.
        </Text>
      </View>

      {/* Page 2 */}
      <View className="flex-1 bg-purple-500 items-center justify-center p-6">
        <Text className="text-white text-3xl font-bold">Book Fast</Text>
        <Text className="text-white mt-4 text-center">
          Check availability instantly.
        </Text>
      </View>

      {/* Page 3 */}
      <View className="flex-1 bg-green-500 items-center justify-center p-6">
        <Text className="text-white text-3xl font-bold">Get Started</Text>

        <Pressable
          onPress={() => router.replace("/login")}
          className="mt-8 bg-white px-6 py-4 rounded-2xl"
        >
          <Text className="font-semibold text-green-600">Continue</Text>
        </Pressable>
      </View>
    </Swiper>
  );
}
