import { AuthStorage } from "@/auth/auth-acess-token";
import { LoadingScreen } from "@/components/loading-screen";
import { useGetUserById } from "@/hook/use-user-id";
import { UserType } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

export default function ProfilePage() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userState, setUserState] = useState<UserType>();
  const [loading, setLoading] = useState(true);

  const blurhash =
    "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

  useEffect(() => {
    const loadUser = async () => {
      const data = await AuthStorage.getUser();
      setUserState(data);
      setLoading(false);
    };

    loadUser();
  }, []);

  const { data: user, isPending } = useGetUserById(userState?.id || "");

  if (loading) {
    return <LoadingScreen />;
  }

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  const renderRow = (title: string, Row: React.ReactNode) => {
    return (
      <View className="rounded-3xl p-4 bg-gray-100">
        <Text className="text-gray-400">{title}</Text>
        {Row}
      </View>
    );
  };

  return (
    <>
      <ImageBackground
        source={require("../../assets/images/pattern-background.png")}
        resizeMode="cover"
        className="flex-1 justify-center align-middle"
      >
        <View className="absolute inset-0 bg-white/95" />

        <ScrollView className="p-10 h-full w-full">
          <View className=" w-full flex items-end">
            <Pressable onPress={() => setShowLogoutModal(true)}>
              <View className="h-12 w-12 items-center justify-center rounded-full bg-red-500">
                <Ionicons name="log-out-outline" size={24} color="white" />
              </View>
            </Pressable>
          </View>
          <View className="w-full my-10">
            <Image
              source={require("../../assets/images/avatar.png")}
              className="w-32 h-32 mx-auto"
            />
          </View>
          <View className="flex flex-col gap-4">
            {renderRow(
              "Full Name",
              <Text className="text-lg">{user.fullName || ""}</Text>,
            )}
            {renderRow("Username", <Text>{user.username || ""}</Text>)}
            {renderRow("Email", <Text>{user.email || ""}</Text>)}
            {renderRow("Phone", <Text>{user.phoneNumber || ""}</Text>)}
            {renderRow("Description", <Text>{user.description || ""}</Text>)}
            {renderRow("Role", <Text>{user.role || ""}</Text>)}
            {renderRow("Status", <Text>{user.status || ""}</Text>)}
          </View>
        </ScrollView>

        <Modal
          transparent
          visible={showLogoutModal}
          animationType="fade"
          onRequestClose={() => setShowLogoutModal(false)}
        >
          <View className="flex-1 items-center justify-center bg-black/50 px-6">
            <View className="w-full max-w-sm rounded-3xl bg-white p-6">
              <Text className="mb-2 text-lg font-bold">Logout</Text>

              <Text className="mb-6 text-gray-600">
                Are you sure you want to logout?
              </Text>

              <View className="flex-row gap-3">
                <Pressable
                  onPress={() => setShowLogoutModal(false)}
                  className="flex-1 rounded-xl border border-gray-300 py-3"
                >
                  <Text className="text-center font-medium">Cancel</Text>
                </Pressable>

                <Pressable
                  onPress={async () => {
                    setShowLogoutModal(false);

                    await AuthStorage.logout();

                    router.replace("/login");
                  }}
                  className="flex-1 rounded-xl bg-red-500 py-3"
                >
                  <Text className="text-center font-medium text-white">
                    Logout
                  </Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </ImageBackground>
    </>
  );
}
