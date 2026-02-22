import { Link } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

const guides = [
  { id: "1", name: "John", available: true },
  { id: "2", name: "Sokha", available: false },
];

export default function Guides() {
  return (
    <View className="flex-1 bg-gray-100 p-6">
      <FlatList
        data={guides}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/guides/[id]",
              params: { id: item.id },
            }}
            asChild
          >
            <Pressable className="bg-white p-4 mb-4 rounded-2xl">
              <Text className="font-bold text-lg">{item.name}</Text>
              <Text
                className={item.available ? "text-green-600" : "text-red-600"}
              >
                {item.available ? "Available" : "Not Available"}
              </Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
