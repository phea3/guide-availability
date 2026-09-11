import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { useState } from "react";
import { Modal, Text, TouchableOpacity, View } from "react-native";

export default function AuthenticationModal() {
  const { isLoaded, isSignedIn } = useAuth();
  const [visible, setVisible] = useState(true);

  const handleHome = () => {
    setVisible(false);
    router.replace("/home");
  };

  const handleRegister = () => {
    setVisible(false);
    router.push("/register");
  };

  if (!isLoaded || isSignedIn) {
    return null;
  }

  return (
    <Modal
      transparent
      visible={visible}
      animationType="fade"
      onRequestClose={handleHome}
    >
      <View className="flex-1 items-center justify-center bg-black/50 px-6">
        <View className="w-full max-w-sm rounded-3xl bg-white p-6">
          <Text className="mb-2 text-xl font-bold text-gray-900">
            Registration required
          </Text>

          <Text className="mb-6 text-gray-600">
            Please go home or create an account to continue.
          </Text>

          <View className="flex-row gap-3">
            <TouchableOpacity
              onPress={handleHome}
              className="h-11 flex-1 items-center justify-center rounded-full border border-gray-300"
            >
              <Text className="font-medium text-gray-700">Home</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleRegister}
              className="h-11 flex-1 items-center justify-center rounded-full bg-black"
            >
              <Text className="font-medium text-white">Register</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
