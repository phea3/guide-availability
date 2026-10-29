import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { Image, Pressable, Text, TouchableOpacity, View } from "react-native";

type Props = {
  title?: string;
  color?: string;
  imageUrl?: string;
  onProfilePress?: () => void;
};

export default function BackButton({
  title,
  color,
  imageUrl,
  onProfilePress,
}: Props) {
  const router = useRouter();

  return (
    <View
      className="relative mx-4 mt-3 flex-row items-center justify-between rounded-2xl px-3 py-3"
      style={{ backgroundColor: color ?? "#fbbf24", minHeight: 56 }}
    >
      {/* Back button */}
      <TouchableOpacity
        onPress={() => router.back()}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        activeOpacity={0.7}
        className="h-10 w-10 items-center justify-center rounded-full border border-white/60"
      >
        <Ionicons name="chevron-back" size={22} color="white" />
      </TouchableOpacity>

      {/* Center title */}
      <View className="absolute left-14 right-14 items-center">
        <Text
          className="text-base font-bold text-white"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {title || "Back"}
        </Text>
      </View>

      {/* Profile image */}
      <Pressable
        onPress={onProfilePress}
        disabled={!onProfilePress}
        accessibilityRole={onProfilePress ? "button" : undefined}
        accessibilityLabel="Profile image"
        className="h-10 w-10 items-center justify-center overflow-hidden rounded-full"
      >
        {imageUrl ? (
          <Image
            source={
              imageUrl
                ? { uri: imageUrl }
                : require("../../assets/images/profile.jpg")
            }
            className="h-full w-full"
            resizeMode="cover"
          />
        ) : (
          <View className="h-full w-full items-center justify-center bg-white/20">
            <Ionicons name="person" size={21} color="white" />
          </View>
        )}
      </Pressable>
    </View>
  );
}
