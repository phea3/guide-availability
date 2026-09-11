import { LoadingScreen } from "@/components/loading-screen";
import { useAuth } from "@clerk/expo";
import { router } from "expo-router";
import { useEffect } from "react";

export default function Index() {
  const { isLoaded } = useAuth();

  useEffect(() => {
    if (!isLoaded) return;

    router.replace("/home");
  }, [isLoaded]);

  if (!isLoaded) {
    return <LoadingScreen />;
  }

  return null;
}
