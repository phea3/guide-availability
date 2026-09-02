import { useGetGuide } from "@/hook/use-all-guide";
import { Link } from "expo-router";
import { FlatList, ImageBackground, Pressable, Text, View } from "react-native";

export default function Guides() {
  const { data: guides } = useGetGuide();
  if (!guides) return null;
  return (
    <ImageBackground
      source={require("../../assets/images/pattern-background.png")}
      resizeMode="cover"
      className="flex-1 border-t border-gray-200"
    >
      <View className="absolute inset-0 bg-white/95 backdrop-blur-md" />

      <FlatList
        className="mt-4"
        data={guides || []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <Link
            href={{
              pathname: "/guides/[id]",
              params: { id: item.id },
            }}
            asChild
          >
            <Pressable className="bg-white/80 backdrop-blur-md rounded-2xl p-4 mx-6 mb-4 border border-gray-300">
              <Text className="font-bold text-lg">{item.fullName}</Text>
              <Text className="text-gray-400 text-lg">@{item.username}</Text>
            </Pressable>
          </Link>
        )}
      />
    </ImageBackground>
  );
}
