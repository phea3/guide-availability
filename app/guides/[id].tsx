import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

const guides = [
  { id: "1", name: "John", available: true, phone: "123-456" },
  { id: "2", name: "Sokha", available: false, phone: "987-654" },
];

export default function GuideDetail() {
  const { id } = useLocalSearchParams();
  const guide = guides.find((g) => g.id === id);

  if (!guide) return null;

  return (
    <View className="flex-1 bg-gray-100 p-6">
      <Text className="text-3xl font-bold">{guide.name}</Text>

      <Text
        className={
          guide.available ? "text-green-600 mt-4" : "text-red-600 mt-4"
        }
      >
        {guide.available ? "Available" : "Not Available"}
      </Text>

      <Text className="mt-4">Phone: {guide.phone}</Text>
    </View>
  );
}
