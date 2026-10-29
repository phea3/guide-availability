import { useTopGuide } from "@/hook/use-top-guide";
import { Image, Text, View } from "react-native";

export default function TopGuide() {
  const { data: guides } = useTopGuide();

  if (!guides?.length) return null;

  return (
    <View className="mt-4">
      <Text className="mb-3 px-5 text-lg font-bold text-gray-900">
        Top Guides
      </Text>

      {guides.slice(0, 5).map((guide, index) => (
        <View
          key={guide.id}
          className="mx-5 mb-3 flex-row items-center rounded-xl border border-gray-200 bg-white p-3"
        >
          {guide.imageUrl ? (
            <Image
              source={
                guide.imageUrl
                  ? { uri: guide.imageUrl }
                  : require("../../assets/images/profile.jpg")
              }
              className="h-12 w-12 rounded-full bg-gray-100"
            />
          ) : (
            <View className="h-12 w-12 items-center justify-center rounded-full bg-gray-100">
              <Text className="text-lg font-bold text-gray-500">
                {guide.fullName?.charAt(0)?.toUpperCase() || "G"}
              </Text>
            </View>
          )}

          <View className="ml-3 flex-1">
            <Text className="font-semibold text-gray-900" numberOfLines={1}>
              {guide.fullName}
            </Text>
            <Text className="mt-1 text-sm text-gray-500">
              {guide.availableDaysCount ?? 0} available days
            </Text>
          </View>
        </View>
      ))}
    </View>
  );
}
