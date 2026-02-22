import { router } from "expo-router";
import { useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";

export default function Login() {
  const [password, setPassword] = useState("123");
  const [error, setError] = useState("");

  const handleLogin = () => {
    if (password === "123") {
      router.replace("/home");
    } else {
      setError("Wrong password");
    }
  };

  return (
    <View className="flex-1 bg-gray-100 justify-center p-6">
      <Text className="text-2xl font-bold mb-6 text-center">Guest Login</Text>

      <TextInput
        placeholder="Enter password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
        className="bg-white p-4 rounded-xl mb-4"
      />

      {error ? <Text className="text-red-500 mb-4">{error}</Text> : null}

      <Pressable onPress={handleLogin} className="bg-black py-4 rounded-xl">
        <Text className="text-white text-center font-semibold">Login</Text>
      </Pressable>
    </View>
  );
}
