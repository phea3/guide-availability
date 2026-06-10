import BackButtonDefault from "@/components/back-button-default";
import { useRegister } from "@/hook/use-register";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Register() {
  const register = useRegister();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Guide" | "Agency">("Guide");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    setError("");

    if (!fullName.trim()) {
      setError("Full name is required");
      return;
    }

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    register.mutate(
      {
        fullName: fullName.trim(),
        email: email.trim().toLowerCase(),
        password,
        role,
      },
      {
        onSuccess: () => {
          router.replace("/login");
        },
        onError: (err: any) => {
          setError(err?.message || "Registration failed. Please try again.");
        },
      },
    );
  };

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 justify-center bg-gray-100 p-6">
        <BackButtonDefault />
        <Text className="mb-6 text-center text-3xl font-bold">Register</Text>

        <TextInput
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          className="mb-4 rounded-xl bg-white p-4"
        />

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="mb-4 rounded-xl bg-white p-4"
        />

        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          autoCapitalize="none"
          className="mb-4 rounded-xl bg-white p-4"
        />

        <View className="mb-4 flex-row gap-3">
          <Pressable
            onPress={() => setRole("Guide")}
            className={`flex-1 rounded-xl p-4 ${
              role === "Guide" ? "bg-black" : "bg-white"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                role === "Guide" ? "text-white" : "text-black"
              }`}
            >
              Guide
            </Text>
          </Pressable>

          <Pressable
            onPress={() => setRole("Agency")}
            className={`flex-1 rounded-xl p-4 ${
              role === "Agency" ? "bg-black" : "bg-white"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                role === "Agency" ? "text-white" : "text-black"
              }`}
            >
              Agency
            </Text>
          </Pressable>
        </View>

        {!!error && <Text className="mb-4 text-red-500">{error}</Text>}

        <Pressable
          onPress={handleRegister}
          disabled={register.isPending}
          className="rounded-xl bg-black py-4"
        >
          <Text className="text-center font-semibold text-white">
            {register.isPending ? "Creating account..." : "Register"}
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
