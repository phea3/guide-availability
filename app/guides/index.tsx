import { Link } from "expo-router";
import { FlatList, ImageBackground, Pressable, Text, View } from "react-native";

const guides = [
  { id: "1", name: "John", available: true },
  { id: "2", name: "Sokha", available: false },
];

export default function Guides() {
  return (
    <ImageBackground
      source={require("../../assets/images/pattern-background.png")}
      resizeMode="cover"
      className="flex-1 justify-center align-middle border-t border-gray-200"
    >
      <View className="absolute inset-0 bg-white/95" />
      <FlatList
        data={guides}
        className="h-full w-full m-6"
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
    </ImageBackground>
  );
}
