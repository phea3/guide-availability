// components/loading-screen.tsx

import { ActivityIndicator, Text, View } from "react-native";

export function LoadingScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white">
      <ActivityIndicator size="large" />
      <Text className="mt-4 text-gray-500">Checking session...</Text>
    </View>
  );
}
