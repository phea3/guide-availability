import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function Home() {
  return (
    <View className="flex-1 bg-gray-100 p-6">
      <Text className="text-3xl font-bold mb-6">Home</Text>

      {/* Fake Ads Card */}
      <View className="bg-yellow-300 p-6 rounded-3xl mb-6">
        <Text className="font-bold text-lg">🔥 Special Promotion</Text>
        <Text className="mt-2">
          20% discount for Angkor Wat tour this month!
        </Text>
      </View>

      <Pressable
        onPress={() =>
          router.push({
            pathname: "/guides",
          })
        }
        className="bg-blue-600 py-4 rounded-2xl"
      >
        <Text className="text-white text-center font-semibold">
          View Guides
        </Text>
      </Pressable>
    </View>
  );
}
