import { useGetGuide } from "@/hook/use-all-guide";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";

const heroSlides = [
  {
    id: "1",
    title: "Discover Angkor Wat",
    subtitle: "Explore ancient temples with expert guides",
    photo: "https://picsum.photos/seed/picsum/200/300",
  },
  {
    id: "2",
    title: "Phnom Penh",
    subtitle: "Experience Cambodia’s vibrant capital",
    photo: "https://picsum.photos/id/237/200/300",
  },
  {
    id: "3",
    title: "Battambang",
    subtitle: "Rice fields and cultural heritage",
    photo: "https://picsum.photos/200/300?grayscale",
  },
];

const promos = [
  { id: "1", text: "⚡ Free Tuk-Tuk Ride in Phnom Penh" },
  { id: "2", text: "🎟️ 20% off Angkor Wat Tours" },
  { id: "3", text: "🍲 Complimentary Local Lunch in Siem Reap" },
];

const cities = [
  {
    id: "1",
    name: "Siem Reap",
    desc: "Home of Angkor Wat",
    weather: "☀️ 32°C",
    attractions: "Angkor Wat, Bayon, Ta Prohm",
    photo: "https://picsum.photos/200/300/?blur",
  },
  {
    id: "2",
    name: "Phnom Penh",
    desc: "Capital of Cambodia",
    weather: "🌤️ 30°C",
    attractions: "Royal Palace, Wat Phnom",
    photo: "https://picsum.photos/200/300/?blur=2",
  },
];

const testimonials = [
  {
    id: "1",
    text: "“John was amazing! He explained Angkor Wat history so well.” – Anna",
  },
  {
    id: "2",
    text: "“Sokha made Phnom Penh unforgettable. Highly recommend!” – David",
  },
];

const events = [
  {
    id: "1",
    name: "Khmer New Year Festival",
    date: "April 13",
    location: "Siem Reap",
  },
  {
    id: "2",
    name: "Water Festival",
    date: "November 15",
    location: "Phnom Penh",
  },
];

export default function Home() {
  const [currentSlide, setCurrentSlide] = useState(0);

  const { data: guides } = useGetGuide();

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const slide = heroSlides[currentSlide];

  return (
    <ImageBackground
      source={require("../assets/images/pattern-background.png")}
      resizeMode="cover"
      className="flex-1 justify-center align-middle border-t border-gray-200"
    >
      <View className="absolute inset-0 bg-white/95" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require("../assets/images/trimmed-image.png")}
          className="w-1/3 h-8 mt-4 object-contain left-6"
        />
        <ImageBackground
          source={{ uri: slide.photo }}
          className="h-56 justify-end items-start p-2 m-6 rounded-2xl overflow-hidden"
        >
          <View className="bg-black/50 p-4 rounded-xl">
            <Text className="text-3xl font-extrabold text-white">
              {slide.title}
            </Text>
            <Text className="text-lg text-gray-200">{slide.subtitle}</Text>
          </View>
        </ImageBackground>
        <View className="p-6">
          {/* <Text className="text-5xl font-extrabold text-yellow-400 mb-2">
            Find Your Guide
          </Text> */}
          <Text className="text-lg text-gray-600 mb-6">
            Explore Cambodia with trusted local guides
          </Text>

          <TextInput
            placeholder="Search guides or cities..."
            placeholderTextColor="#9CA3AF"
            className="bg-gray-100 text-black p-4 rounded-2xl  mb-2"
          />
          <Text className="text-gray-400">
            Suggestions: John, Sokha, Siem Reap
          </Text>
        </View>

        {/* <Text className="text-2xl font-bold text-black px-6 mb-4">
          Promotions
        </Text>
        <View className="px-6">
          <FlatList
            data={promos}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <BlurView
                intensity={40}
                tint="light"
                className="rounded-2xl mr-4 p-6 w-64 bg-white/20 border border-white/30"
              >
                <Text className="font-bold text-lg ">{item.text}</Text>
              </BlurView>
            )}
          />
        </View> */}

        <Text className="text-2xl font-bold text-black px-6 mt-8 mb-4">
          Top Guides
        </Text>
        <View className="px-6">
          <FlatList
            data={guides}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Link
                href={{
                  pathname: "/guides/[id]",
                  params: { id: item.id },
                }}
                asChild
              >
                <Pressable className="bg-gray-100 rounded-2xl p-4 w-56 mr-4 ">
                  <Image
                    source={{ uri: item.profileImage }}
                    className="w-full h-28 rounded-xl mb-2"
                  />

                  <Text className="font-bold text-lg text-black">
                    {item.guideName}
                  </Text>
                  <Text className="text-gray-700">⭐ 10/day</Text>
                  <Text className="text-gray-500">
                    Languages: {item.address}
                  </Text>
                </Pressable>
              </Link>
            )}
          />
        </View>

        {/* <Text className="text-2xl font-bold text-black px-6 mt-8 mb-4">
          Explore Cities
        </Text>
        <View className="px-6">
          <FlatList
            data={cities}
            horizontal
            showsHorizontalScrollIndicator={false}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <View className="bg-gray-100 rounded-2xl p-4 w-64 mr-4">
                <Text className="font-bold text-lg text-black">
                  {item.name}
                </Text>
                <Text className="text-gray-700">{item.desc}</Text>
                <Text className="text-gray-500">
                  {item.weather} | {item.attractions}
                </Text>
              </View>
            )}
          />
        </View> */}
        {/* <Text className="text-2xl font-bold text-black px-6 mt-8 mb-4">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap px-6">
          {["guides", "cities", "bookings", "promotions", "favorites"].map(
            (action) => (
              <Pressable
                key={action}
                onPress={() => router.push(`/${action.toLowerCase()}` as any)}
                className="bg-yellow-400 rounded-xl p-4 w-[45%] m-2"
              >
                <Text className="font-semibold text-center capitalize text-white">
                  {action}
                </Text>
              </Pressable>
            ),
          )}
        </View> */}

        {/* Testimonials */}
        {/* <Text className="text-2xl font-bold text-black px-6 mt-8 mb-4">
          Testimonials
        </Text>
        {testimonials.map((t) => (
          <View key={t.id} className="bg-gray-100 rounded-2xl  p-4 mx-6 mb-4">
            <Text className="text-gray-800 italic">{t.text}</Text>
          </View>
        ))} */}

        <Text className="text-2xl font-bold text-black px-6 mt-8 mb-4">
          Upcoming Events
        </Text>
        {events.map((e) => (
          <View key={e.id} className="bg-gray-100 rounded-2xl  p-4 mx-6 mb-4">
            <Text className="font-bold text-lg text-black">{e.name}</Text>
            <Text className="text-gray-600">
              {e.date} — {e.location}
            </Text>
          </View>
        ))}
      </ScrollView>
    </ImageBackground>
  );
}
