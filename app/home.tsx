import { useGetGuide } from "@/hook/use-all-guide";
import useCheckUserNotCompletedProfile from "@/hook/use-check-user-not-completed-profile";
import { Link, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  FlatList,
  Image,
  ImageBackground,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import TopGuide from "./_components/top-guide";

const heroSlides = [
  {
    id: "1",
    title: "Collaborate Seamlessly",
    subtitle:
      "Guides and agents manage schedules together with real-time availability calendars.",
    photo: require("../assets/images/image1.png"),
  },
  {
    id: "2",
    title: "Smart Scheduling Interface",
    subtitle:
      "Easily view, edit, and confirm bookings with a clean, intuitive dashboard for both sides.",
    photo: require("../assets/images/image2.png"),
  },
  {
    id: "3",
    title: "Effortless Time Management",
    subtitle:
      "Organize tours, set appointments, and track availability — all in one streamlined app.",
    photo: require("../assets/images/image3.png"),
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
  useCheckUserNotCompletedProfile();
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

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
      className="flex-1 justify-center align-middle "
    >
      <View className="absolute inset-0 bg-white/95 backdrop-blur-md" />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Image
          source={require("../assets/images/trimmed-image.png")}
          className="w-1/3 h-8 mt-4 object-contain left-6"
        />
        <ImageBackground
          source={slide.photo}
          className="h-56 justify-end items-start p-2 m-6 rounded-2xl overflow-hidden"
        >
          <View className="bg-black/50 p-4 rounded-xl">
            <Text className="text-lg font-extrabold text-white">
              {slide.title}
            </Text>
          </View>
        </ImageBackground>
        {/* <View className="p-6">
          <Text className="text-lg text-gray-600 mb-6">
            Explore Cambodia with trusted local guides
          </Text>

          <TextInput
            placeholder="Search guides or cities..."
            placeholderTextColor="#9CA3AF"
            className="bg-gray-100/80 backdrop-blur-md text-black p-4 rounded-2xl mb-2"
          />
          <Text className="text-gray-400">
            Suggestions: John, Sokha, Siem Reap
          </Text>
        </View> */}

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
              <View className="rounded-2xl bg-white/80 backdrop-blur-md p-4 mx-4 mb-6 w-64 border border-gray-300">
                <Text className="font-bold text-lg ">{item.text}</Text>
              </View>
            )}
          />
        </View> */}

        <Text className="text-2xl font-bold text-black px-6 mt-8 mb-4">
          Recently Guides
        </Text>
        <View className="px-4">
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
                    source={
                      item.imageUrl
                        ? { uri: item.imageUrl }
                        : require("../assets/images/profile.jpg")
                    }
                    className="w-full h-28 rounded-xl mb-2"
                  />

                  <Text className="font-bold text-lg text-black">
                    {item.fullName}
                  </Text>
                  <Text className="text-gray-700">Status: Available</Text>
                  <Text className="text-gray-500">
                    Languages: {"Not specified"}
                  </Text>
                </Pressable>
              </Link>
            )}
          />
        </View>

        {/* <Text className="text-2xl font-bold text-black px-6 mt-8 mb-4">
          Explore Cities
        </Text>
        <FlatList
          data={cities}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View className="rounded-2xl bg-white/80 backdrop-blur-md p-4 mx-4 mb-6 border border-gray-300">
              <Text className="font-bold text-lg text-black">{item.name}</Text>
              <Text className="text-gray-700">{item.desc}</Text>
              <Text className="text-gray-500">
                {item.weather} | {item.attractions}
              </Text>
            </View>
          )}
        /> */}
        {/* <Text className="text-2xl font-bold text-black px-6 mt-8 mb-4">
          Quick Actions
        </Text>
        <View className="flex-row flex-wrap px-6">
          {[
            "guides",
            "cities",
            "bookings",
            "promotions",
            "favorites",
            "upcoming",
          ].map((action) => (
            <Pressable
              key={action}
              onPress={() => router.push(`/${action.toLowerCase()}` as any)}
              className="bg-yellow-400 rounded-xl p-4 w-[45%] m-2"
            >
              <Text className="font-semibold text-center capitalize text-white">
                {action}
              </Text>
            </Pressable>
          ))}
        </View> */}

        {/* Testimonials */}
        {/* <Text className="text-2xl font-bold text-black px-6 mt-8 mb-4">
          Testimonials
        </Text>
        {testimonials.map((t) => (
          <View
            key={t.id}
            className="bg-white/80 backdrop-blur-md rounded-2xl p-4 mx-6 mb-4 border border-gray-300"
          >
            <Text className="text-gray-800 italic">{t.text}</Text>
          </View>
        ))} */}

        <Text className="text-2xl font-bold text-black px-6 mt-8 mb-4">
          Top Guides
        </Text>
        <TopGuide />
      </ScrollView>
    </ImageBackground>
  );
}
