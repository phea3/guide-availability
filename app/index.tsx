import { LoadingScreen } from "@/components/loading-screen";
import { useGetUserById } from "@/hook/use-user-id";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { isLoaded, isSignedIn, userId } = useAuth();
  const { data: user } = useGetUserById(userId || "");

  useEffect(() => {
    if (!isLoaded) return;

    if (isSignedIn && user) {
      router.replace("/home");
    } else {
      router.replace("/register");
    }
  }, [isLoaded, isSignedIn, user]);

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return null;
}
