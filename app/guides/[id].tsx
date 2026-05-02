import GlassCalendar from "@/components/glass-calendar";
import { useLocalSearchParams } from "expo-router";
import { ImageBackground, ScrollView, Text, View } from "react-native";

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
    <ImageBackground
      source={require("../../assets/images/pattern-background.png")}
      resizeMode="cover"
      className="flex-1 justify-center align-middle border-t border-gray-200"
    >
      <View className="absolute inset-0 bg-white/95" />
      <GlassCalendar />
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="bg-white m-6 p-6 rounded-2xl">
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
      </ScrollView>
    </ImageBackground>
  );
}
