import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const guides = [
  {
    id: "1",
    name: "John",
    available: true,
    bio: "Experienced guide for Angkor Wat.",
    price: 50,
  },
  {
    id: "2",
    name: "Sokha",
    available: false,
    bio: "Specializes in Cambodian history tours.",
    price: 40,
  },
];

export default function GuideDetail() {
  const { id } = useLocalSearchParams();
  const guide = guides.find((g) => g.id === id);

  if (!guide) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg font-bold">Guide not found</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <View className="bg-white p-6 rounded-2xl shadow">
        <Text className="text-2xl font-bold mb-2">{guide.name}</Text>
        <Text
          className={
            guide.available ? "text-green-600 mb-2" : "text-red-600 mb-2"
          }
        >
          {guide.available ? "Available" : "Not Available"}
        </Text>
        <Text className="text-gray-700 mb-4">{guide.bio}</Text>
        <Text className="text-lg font-semibold">💵 ${guide.price}/day</Text>
      </View>
    </View>
  );
}
