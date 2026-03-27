import { Link } from "expo-router";
import { FlatList, Pressable, Text, View } from "react-native";

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
    <View className="flex-1 bg-gray-100 p-6">
      <FlatList
        data={cities}
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
              <Text className={item.name}>{item.name}</Text>
            </Pressable>
          </Link>
        )}
      />
    </View>
  );
}
