import { BlurView } from "expo-blur";
import { Text, View } from "react-native";

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white/60">
      <BlurView
        intensity={60}
        tint="light"
        className="rounded-3xl p-8 w-72 items-center border border-white/30 bg-white/30"
      >
        <Text className="mt-4 text-gray-600 font-medium">
          Checking session...
        </Text>
      </BlurView>
    </View>
  );
}
