import AuthenticationModal from "@/components/authentication";
import { useGetGuide } from "@/hook/use-all-guide";
import { Link } from "expo-router";
import { FlatList, ImageBackground, Pressable, Text, View } from "react-native";

export default function Guides() {
  const { data: guides } = useGetGuide();

  if (!guides) return null;
  return (
    <>
      <ImageBackground
        source={require("../../assets/images/pattern-background.png")}
        resizeMode="cover"
        className="flex-1 border-t border-gray-200"
      >
        <View className="absolute inset-0 bg-white/95 backdrop-blur-md" />

        <FlatList
          data={guides || []}
          keyExtractor={(item) => item.id}
          ListHeaderComponent={
            <View className="px-5 pb-5 pt-8">
              <Text className="text-3xl font-bold text-gray-900">Guides</Text>

              <Text className="mt-2 text-base text-gray-500">
                Discover local guides.
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <Link
              href={{
                pathname: "/guides/[id]",
                params: { id: item.id },
              }}
              asChild
            >
              <Pressable className="rounded-2xl bg-white/80 backdrop-blur-md p-4 mx-4 mb-6 border border-gray-300">
                <Text className="font-bold text-lg">{item.fullName}</Text>
                <Text className="text-gray-400 text-lg">@{item.username}</Text>
              </Pressable>
            </Link>
          )}
        />
      </ImageBackground>
      <AuthenticationModal />
    </>
  );
}
