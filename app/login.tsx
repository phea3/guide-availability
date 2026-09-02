import { LoadingScreen } from "@/components/loading-screen";
import PasswordInput from "@/components/password-input";
import { useLogin } from "@/hook/use-login";
import { useGetUserById } from "@/hook/use-user-id";
import { useAuth, useSignIn } from "@clerk/expo";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export default function Login() {
  const { isLoaded, isSignedIn, getToken, userId } = useAuth();
  const { signIn } = useSignIn();
  const login = useLogin();

  const { data: user, isPending: isUserPending } = useGetUserById(userId || "");

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // If Clerk already has a session, go directly to the app.
  useEffect(() => {
    if (!isLoaded) return;

    if (!user) return;

    if (isSignedIn) {
      router.replace("/home");
    }
  }, [isLoaded, isSignedIn, user]);

  const loginWithRetry = async (token: string) => {
    try {
      return await login.mutateAsync({
        token,
        data: {
          email: email.trim().toLowerCase(),
          password: "",
        },
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "";

      if (
        message.includes("not before") ||
        message.includes("token-not-active-yet")
      ) {
        await new Promise((resolve) => setTimeout(resolve, 1500));

        const freshToken = await getToken();

        if (!freshToken) {
          throw error;
        }

        return await login.mutateAsync({
          token: freshToken,
          data: {
            email: email.trim().toLowerCase(),
            password: "",
          },
        });
      }

      throw error;
    }
  };

  const handleLogin = async () => {
    if (!isLoaded) return;

    setError("");

    if (!email.trim()) {
      setError("Email is required");
      return;
    }

    if (!password) {
      setError("Password is required");
      return;
    }

    try {
      // Don't try to create another Clerk sign-in

      // if the user already has a session.
      if (!isSignedIn) {
        const { error: signInError } = await signIn.password({
          emailAddress: email.trim().toLowerCase(),
          password,
        });

        if (signInError) {
          setError(signInError.message || "Invalid email or password");
          return;
        }

        if (signIn.status !== "complete") {
          setError("Additional verification is required.");
          return;
        }

        const { error: finalizeError } = await signIn.finalize();

        if (finalizeError) {
          setError(finalizeError.message || "Failed to complete login.");
          return;
        }
      }

      // Get Clerk session token
      const token = await getToken();

      if (!token) {
        setError("Unable to authenticate with Clerk.");
        return;
      }

      // Get application user from Drizzle
      const data = await loginWithRetry(token);

      if (data.success) {
        router.replace("/home");
      }
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Login failed.");
    }
  };

  const isPending = login.isPending;

  if (!isLoaded || isUserPending || isPending) {
    return <LoadingScreen />;
  }

  if (isSignedIn && user) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 justify-center bg-gray-100 p-6">
        <Text className="mb-6 text-center text-2xl font-bold">Login</Text>

        <TextInput
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
          autoComplete="email"
          className="mb-4 rounded-xl bg-white p-4"
        />

        <PasswordInput password={password} setPassword={setPassword} />

        {!!error && <Text className="mb-4 text-red-500">{error}</Text>}

        <Pressable
          onPress={handleLogin}
          disabled={isPending}
          className={`rounded-xl bg-black py-4 ${
            isPending ? "opacity-50" : ""
          }`}
        >
          <Text className="text-center font-semibold text-white">
            {isPending ? "Logging in..." : "Login"}
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

        <View nativeID="clerk-captcha" />
      </View>
    </KeyboardAvoidingView>
  );
}
