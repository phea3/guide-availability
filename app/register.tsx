import BackButtonDefault from "@/components/back-button-default";
import { useRegister } from "@/hook/use-register";
import { useAuth, useSignUp } from "@clerk/expo";
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

export default function Register() {
  const { isLoaded, isSignedIn, getToken } = useAuth();
  const { signUp } = useSignUp();
  const register = useRegister();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"Guide" | "Agency">("Guide");

  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState("");

  const pendingEmail = signUp?.emailAddress || email;

  const registerWithRetry = async (token: string) => {
    try {
      return await register.mutateAsync({
        token,
        data: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          role,
        },
      });
    } catch (error: any) {
      const message = error?.response?.data?.message || error?.message || "";

      if (
        !message.includes("not before") &&
        !message.includes("token-not-active-yet")
      ) {
        throw error;
      }

      await new Promise((resolve) => setTimeout(resolve, 1500));

      const freshToken = await getToken();

      if (!freshToken) {
        throw error;
      }

      return await register.mutateAsync({
        token: freshToken,
        data: {
          fullName: fullName.trim(),
          email: email.trim().toLowerCase(),
          role,
        },
      });
    }
  };

  const handleRegister = async () => {
    if (!isLoaded) return;

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

    setIsPending(true);

    try {
      const names = fullName.trim().split(/\s+/);

      const firstName = names[0];
      const lastName = names.slice(1).join(" ") || undefined;

      const { error: signUpError } = await signUp.password({
        emailAddress: email.trim().toLowerCase(),
        password,
        firstName,
        lastName,
        unsafeMetadata: {
          fullName,
          role,
        },
      });

      if (signUpError) {
        setError(
          signUpError.message || "Registration failed. Please try again.",
        );
        return;
      }

      const { error: sendError } = await signUp.verifications.sendEmailCode();

      if (sendError) {
        setError(sendError.message || "Failed to send verification code.");
        return;
      }

      setIsVerifying(true);
    } catch (err: any) {
      setError(err?.message || "Registration failed. Please try again.");
    } finally {
      setIsPending(false);
    }
  };

  const handleVerify = async () => {
    if (!isLoaded) return;

    setError("");

    if (!code.trim()) {
      setError("Verification code is required");
      return;
    }

    setIsPending(true);

    try {
      // Verify email
      const { error: verifyError } = await signUp.verifications.verifyEmailCode(
        {
          code: code.trim(),
        },
      );

      if (verifyError) {
        setError(verifyError.message || "Invalid verification code.");
        return;
      }

      // Create Clerk session
      const { error: finalizeError } = await signUp.finalize();

      if (finalizeError) {
        setError(finalizeError.message || "Failed to complete registration.");
        return;
      }

      // Get Clerk session token
      const token = await getToken();

      if (!token) {
        setError("Unable to authenticate with Clerk.");
        return;
      }

      const data = await registerWithRetry(token);

      if (!data.success) {
        setError("Failed to create user.");
        return;
      }

      router.replace("/home");
    } catch (err: any) {
      setError(
        err?.response?.data?.message ||
          err?.message ||
          "Verification failed. Please try again.",
      );
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    if (isLoaded && isSignedIn) {
      // Clerk session is now active
    }
  }, [isLoaded, isSignedIn]);

  if (!isLoaded) {
    return null;
  }

  return (
    <KeyboardAvoidingView
      className="flex-1"
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View className="flex-1 justify-center bg-gray-100 p-6">
        <BackButtonDefault />

        <Text className="mb-6 text-center text-3xl font-bold">
          {isVerifying ? "Verify Email" : "Register"}
        </Text>

        {!isVerifying ? (
          <>
            <TextInput
              placeholder="Full Name"
              value={fullName}
              onChangeText={setFullName}
              autoCapitalize="words"
              className="mb-4 rounded-xl bg-white p-4"
            />

            <TextInput
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              autoComplete="email"
              className="mb-4 rounded-xl bg-white p-4"
            />

            <TextInput
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoComplete="new-password"
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
              disabled={isPending}
              className={`rounded-xl bg-black py-4 ${
                isPending ? "opacity-50" : ""
              }`}
            >
              <Text className="text-center font-semibold text-white">
                {isPending ? "Creating account..." : "Register"}
              </Text>
            </Pressable>
          </>
        ) : isSignedIn ? (
          <View className="flex items-center justify-center bg-gray-100 p-6">
            <Text className="mb-4 text-2xl font-bold">
              You are already signed in
            </Text>

            <Pressable
              onPress={() => router.replace("/")}
              className="w-full rounded-xl bg-black py-4"
            >
              <Text className="text-center font-semibold text-white">
                Go to Home
              </Text>
            </Pressable>
          </View>
        ) : (
          <>
            <Text className="mb-4 text-center text-gray-600">
              We sent a verification code to{"\n"}
              <Text className="font-semibold text-black">{pendingEmail}</Text>
            </Text>

            <TextInput
              placeholder="Enter verification code"
              value={code}
              onChangeText={setCode}
              keyboardType="number-pad"
              autoCapitalize="none"
              className="mb-4 rounded-xl bg-white p-4 text-center text-lg"
            />

            {!!error && (
              <Text className="mb-4 text-center text-red-500">{error}</Text>
            )}

            <Pressable
              onPress={handleVerify}
              disabled={isPending}
              className={`rounded-xl bg-black py-4 ${
                isPending ? "opacity-50" : ""
              }`}
            >
              <Text className="text-center font-semibold text-white">
                {isPending ? "Verifying..." : "Verify Email"}
              </Text>
            </Pressable>

            <Pressable
              onPress={async () => {
                if (!isLoaded) return;

                setError("");

                const { error } = await signUp.verifications.sendEmailCode();

                if (error) {
                  setError(error.message || "Failed to resend code.");
                }
              }}
              className="mt-4 py-3"
            >
              <Text className="text-center font-semibold">
                Resend verification code
              </Text>
            </Pressable>
          </>
        )}

        {/* Required for Clerk CAPTCHA on Expo Web */}
        <View nativeID="clerk-captcha" />
      </View>
    </KeyboardAvoidingView>
  );
}
