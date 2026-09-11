import { Link } from "expo-router";
import { FlatList, ImageBackground, Text, View } from "react-native";

const cities = [
  {
    id: "1",
    name: "Siem Reap",
    desc: "Home of Angkor Wat",
    weather: "☀️ 32°C",
    attractions: "Angkor Wat, Bayon, Ta Prohm",
    photo: "https://placekitten.com/300/200",
  },
  {
    id: "2",
    name: "Phnom Penh",
    desc: "Capital of Cambodia",
    weather: "🌤️ 30°C",
    attractions: "Royal Palace, Wat Phnom",
    photo: "https://placekitten.com/301/200",
  },
];

export default function Cities() {
  return (
    <ImageBackground
      source={require("../../assets/images/pattern-background.png")}
      resizeMode="cover"
      className="flex-1 justify-center align-middle "
    >
      <View className="absolute inset-0 bg-white/95 backdrop-blur-md" />

      <FlatList
        data={cities}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <View className="px-5 pb-5 pt-8">
            <Text className="text-3xl font-bold text-gray-900">
              Explore Cities
            </Text>

            <Text className="mt-2 text-base text-gray-500">
              Discover destinations and find local guides.
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
            <View className="rounded-2xl bg-white/80 backdrop-blur-md p-4 mx-4 mb-6 border border-gray-300">
              <Text className="font-bold text-lg text-black">{item.name}</Text>
              <Text className="text-gray-700">{item.desc}</Text>
              <Text className="text-gray-500">
                {item.weather} | {item.attractions}
              </Text>
            </View>
          </Link>
        )}
      />
    </ImageBackground>
  );
}
