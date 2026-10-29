import { useAuth } from "@clerk/expo";
import { useRouter } from "expo-router";
import { useEffect } from "react";
import { useGetUserById } from "./use-user-id";

export default function useCheckUserNotCompletedProfile() {
  const { userId } = useAuth();
  const router = useRouter();

  const { data: user } = useGetUserById(userId || "");

  useEffect(() => {
    if (user && !user?.isCompletedProfile) {
      router.push("/profile");
    }
  }, [router, user]);
}
