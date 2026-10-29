import AuthenticationModal from "@/components/authentication";
import { useGetGuide } from "@/hook/use-all-guide";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  Text,
  View,
} from "react-native";

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
        <View className="absolute inset-0 bg-white/95" />

        <FlatList
          data={guides}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 24 }}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View className="px-5 pb-5 pt-8">
              <Text className="text-3xl font-bold text-gray-900">Guides</Text>

              <Text className="mt-2 text-base text-gray-500">
                Discover local guides.
              </Text>

              <View className="mt-5 flex-row items-center rounded-xl bg-[#c9a849]/10 px-4 py-3">
                <Ionicons name="people-outline" size={20} color="#7e5f03" />
                <Text className="ml-2 text-sm font-medium text-[#7e5f03]">
                  {guides.length} {guides.length === 1 ? "Guide" : "Guides"}{" "}
                  available
                </Text>
              </View>
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
              <Pressable
                className="mx-4 mb-3 flex-row items-center rounded-2xl border border-stone-200 bg-gray-50 p-4"
                accessibilityRole="button"
                accessibilityLabel={`View guide ${item.fullName || item.username || ""}`}
              >
                {/* Profile image */}
                {item.imageUrl ? (
                  <Image
                    source={{ uri: item.imageUrl }}
                    className="h-16 w-16 rounded-full bg-stone-100"
                    resizeMode="cover"
                  />
                ) : (
                  <View className="h-16 w-16 items-center justify-center rounded-full bg-[#c9a849]/15">
                    <Ionicons name="person" size={30} color="#7e5f03" />
                  </View>
                )}

                {/* Guide information */}
                <View className="ml-4 flex-1 justify-center">
                  <Text
                    className="text-base font-bold text-gray-900"
                    numberOfLines={1}
                  >
                    {item.fullName || "Unnamed Guide"}
                  </Text>

                  {item.username ? (
                    <Text
                      className="mt-1 text-sm text-gray-500"
                      numberOfLines={1}
                    >
                      @{item.username}
                    </Text>
                  ) : null}

                  {item.status ? (
                    <View className="mt-2 self-start rounded-full bg-emerald-50 px-2.5 py-1">
                      <Text className="text-xs font-medium text-emerald-700">
                        {item.status}
                      </Text>
                    </View>
                  ) : null}
                </View>

                {/* Navigation indicator */}
                <View className="ml-2 h-9 w-9 items-center justify-center rounded-full bg-stone-50">
                  <Ionicons name="chevron-forward" size={18} color="#7e5f03" />
                </View>
              </Pressable>
            </Link>
          )}
          ListEmptyComponent={
            <View className="items-center px-8 py-12">
              <View className="mb-4 h-16 w-16 items-center justify-center rounded-full bg-stone-100">
                <Ionicons name="people-outline" size={30} color="#a8a29e" />
              </View>

              <Text className="text-base font-semibold text-gray-800">
                No guides yet
              </Text>

              <Text className="mt-2 text-center text-sm text-gray-500">
                Available guides will appear here.
              </Text>
            </View>
          }
        />
      </ImageBackground>

      <AuthenticationModal />
    </>
  );
}
