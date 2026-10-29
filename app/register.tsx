import BackHomeDefault from "@/components/back-home";
import { useRegister } from "@/hook/use-register";
import { useAuth } from "@clerk/expo";
import { useSignInWithApple } from "@clerk/expo/apple";
import { useSignInWithGoogle } from "@clerk/expo/google";
import { useHostedAuth } from "@clerk/expo/hosted-auth";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";

export default function Register() {
  const { isLoaded, isSignedIn, getToken } = useAuth();

  const register = useRegister();

  // Native Google Sign-In
  const { startGoogleAuthenticationFlow } = useSignInWithGoogle();

  // Expo Go browser/hosted authentication
  const { startHostedAuth } = useHostedAuth();

  // Apple native authentication
  const { startAppleAuthenticationFlow } = useSignInWithApple();

  const [fullName, setFullName] = useState("");
  const [role, setRole] = useState<"Guide" | "Agency">("Guide");
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  /**
   * Expo Go does not contain Clerk's native Google Sign-In module.
   *
   * Expo Go:
   *   -> Hosted/browser OAuth
   *
   * Development build:
   *   -> Native Google Sign-In
   */
  const isExpoGo = Constants.appOwnership === "expo";

  useEffect(() => {
    if (isLoaded && isSignedIn && !isRegistering) {
      router.replace("/home");
    }
  }, [isLoaded, isSignedIn, isRegistering]);

  /**
   * Register the authenticated Clerk user with your backend.
   */
  const registerUser = async () => {
    const token = await getToken({
      skipCache: true,
    });

    if (!token) {
      throw new Error("Unable to get authentication token.");
    }

    await register.mutateAsync({
      data: {
        // fullName: fullName.trim(),
        role,
      },
      token,
    });
  };

  /**
   * Google registration
   *
   * Expo Go:
   *   Uses Clerk Hosted Auth / browser.
   *
   * Development build:
   *   Uses native Google Sign-In.
   */
  const handleGoogleRegister = async () => {
    if (!isLoaded) return;

    setIsRegistering(true);
    setError("");
    setIsPending(true);

    try {
      if (isExpoGo) {
        /**
         * Expo Go cannot use:
         *
         * startGoogleAuthenticationFlow()
         *
         * because ClerkGoogleSignIn is a native module.
         *
         * Hosted auth opens Google in the browser and
         * redirects back into the Expo app.
         */
        await startHostedAuth();

        /**
         * Hosted authentication handles the session.
         *
         * Wait a little for Clerk to update the session,
         * then retrieve the token.
         */
        let token: string | null = null;

        for (let attempt = 0; attempt < 5; attempt++) {
          await new Promise((resolve) => setTimeout(resolve, 500));

          token = await getToken({
            skipCache: true,
          });

          if (token) break;
        }

        if (!token) {
          throw new Error(
            "Authentication succeeded, but no Clerk session token was available.",
          );
        }

        await registerUser();

        setIsRegistering(false);
        router.replace("/home");

        return;
      }

      /**
       * Development build / native app
       */
      const { createdSessionId, setActive } =
        await startGoogleAuthenticationFlow({
          unsafeMetadata: {
            // fullName: fullName.trim(),
            role,
          },
        });

      if (!createdSessionId || !setActive) {
        throw new Error("Google authentication did not create a session.");
      }

      await setActive({
        session: createdSessionId,
      });

      await registerUser();

      setIsRegistering(false);
      router.replace("/home");
    } catch (err: any) {
      setIsRegistering(false);

      if (
        err?.code === "SIGN_IN_CANCELLED" ||
        err?.code === "-5" ||
        err?.code === "ERR_REQUEST_CANCELED"
      ) {
        return;
      }

      console.error("Google authentication error:", err);

      setError(err?.message || "Google registration failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  /**
   * Apple registration
   *
   * Apple is only available on iOS.
   * This remains native, so use a development build for it.
   */
  const handleAppleRegister = async () => {
    if (!isLoaded) return;

    setIsRegistering(true);
    setError("");
    setIsPending(true);

    try {
      const { createdSessionId, setActive } =
        await startAppleAuthenticationFlow({
          unsafeMetadata: {
            // fullName: fullName.trim(),
            role,
          },
        });

      if (!createdSessionId || !setActive) {
        throw new Error("Apple authentication did not create a session.");
      }

      await setActive({
        session: createdSessionId,
      });

      // await registerUser();

      setIsRegistering(false);
      router.replace("/home");
    } catch (err: any) {
      setIsRegistering(false);

      if (err?.code === "ERR_REQUEST_CANCELED") {
        return;
      }

      console.error("Apple authentication error:", err);

      setError(err?.message || "Apple registration failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  if (!isLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 justify-center bg-gray-100 p-6">
        <BackHomeDefault />

        <Text className="mb-6 text-center text-3xl font-bold">
          Create Account
        </Text>

        {/* Full Name */}
        {/* <TextInput
          // onSubmitEditing={() => Keyboard.dismiss()}
          placeholder="Full Name"
          value={fullName}
          onChangeText={setFullName}
          autoCapitalize="words"
          editable={!isPending}
          className="mb-4 rounded-xl bg-white p-4"
        /> */}

        {/* Role */}
        <View className="mb-4 flex-row gap-3">
          <Pressable
            onPress={() => setRole("Guide")}
            disabled={isPending}
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
            disabled={isPending}
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

        {/* Google */}
        <Pressable
          onPress={handleGoogleRegister}
          disabled={isPending}
          className={`rounded-xl border border-gray-300 bg-white py-4 ${
            isPending ? "opacity-50" : ""
          }`}
        >
          <Text className="text-center font-semibold text-black">
            Continue with Google
          </Text>
        </Pressable>

        <View className="my-5 flex-row items-center">
          <View className="h-px flex-1 bg-gray-300" />

          <Text className="mx-4 text-gray-500">OR</Text>

          <View className="h-px flex-1 bg-gray-300" />
        </View>

        {/* Apple */}
        {Platform.OS === "ios" && (
          <Pressable
            onPress={handleAppleRegister}
            disabled={isPending}
            className={`rounded-xl bg-black py-4 ${
              isPending ? "opacity-50" : ""
            }`}
          >
            <Text className="text-center font-semibold text-white">
              Continue with Apple
            </Text>
          </Pressable>
        )}

        <View nativeID="clerk-captcha" />
      </View>
    </KeyboardAvoidingView>
  );
}
