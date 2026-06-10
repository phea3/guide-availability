import PasswordInput from "@/components/password-input";
import { useLogin } from "@/hook/use-login";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Login() {
  const login = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = () => {
    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    login.mutate(
      {
        email: email.trim().toLowerCase(),
        password,
      },
      {
        onSuccess: async (data) => {
          /**
           * Example:
           * await SecureStore.setItemAsync(
           *   "access_token",
           *   data.token,
           * );
           */
          await SecureStore.setItemAsync("user", JSON.stringify(data.user));

          router.replace("/home");
        },
        onError: (err: any) => {
          setError(err?.response?.data?.message || "Invalid email or password");
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
        <Text className="mb-6 text-center text-2xl font-bold">Login</Text>

        <TextInput
          placeholder="Email or Username"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          className="mb-4 rounded-xl bg-white p-4"
        />

        <PasswordInput password={password} setPassword={setPassword} />

        {!!error && <Text className="mb-4 text-red-500">{error}</Text>}

        <Pressable
          onPress={handleLogin}
          disabled={login.isPending}
          className="rounded-xl bg-black py-4"
        >
          <Text className="text-center font-semibold text-white">
            {login.isPending ? "Logging in..." : "Login"}
          </Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/register")}
          className="mx-auto mt-3 p-4"
        >
          <Text className="text-center font-semibold text-black">
            Create new account?
          </Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}
