import GlassCalendar from "@/components/glass-calendar";
import { useGetGuideById } from "@/hook/use-guide-id";
import { useLocalSearchParams } from "expo-router";
import { ImageBackground, Text, View } from "react-native";
import BackButton from "../_components/back-button";

export default function GuideDetail() {
  const params = useLocalSearchParams();

  const id = Array.isArray(params.id) ? params.id[0] : params.id;

  const { data: guide, isPending } = useGetGuideById(id);

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg font-bold">Fetching...</Text>
      </View>
    );
  }

  if (!guide) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-lg font-bold">Guide not found</Text>
      </View>
    );
  }

  return (
    <>
      <BackButton title={guide?.guideName || "Unknown"} />
      <ImageBackground
        source={require("../../assets/images/pattern-background.png")}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="absolute inset-0 bg-white/95" />
        <GlassCalendar />
        {/* <ScrollView showsVerticalScrollIndicator={false}>
          <View className="bg-white m-6 p-6 rounded-2xl">
            <Text className="text-2xl font-bold mb-2">{guide.guideName}</Text>
            <Text
            className={
              guide.available ? "text-green-600 mb-2" : "text-red-600 mb-2"
            }
          >
            {guide.available ? "Available" : "Not Available"}
          </Text>
            <Text className="text-gray-700 mb-4">{guide.address}</Text>
            <Text className="text-lg font-semibold">💵 10/day</Text>
          </View>
        </ScrollView> */}
      </ImageBackground>
    </>
  );
}
