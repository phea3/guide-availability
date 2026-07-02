import { AuthStorage } from "@/auth/auth-acess-token";
import { LoadingScreen } from "@/components/loading-screen";
import { useProfileDetail } from "@/hook/use-profile-detail";
import { useGetUserById } from "@/hook/use-user-id";
import { UserType } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import {
  Image,
  ImageBackground,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export default function ProfilePage() {
  const updateProfile = useProfileDetail();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [userState, setUserState] = useState<UserType>();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({
    fullName: "",
    username: "",
    email: "",
    phoneNumber: "",
    description: "",
    status: "",
    role: "",
  });

  const [editing, setEditing] = useState<string | null>(null);

  useEffect(() => {
    const loadUser = async () => {
      const data = await AuthStorage.getUser();
      setUserState(data);
      setLoading(false);
    };

    loadUser();
  }, []);

  const { data: user, isPending } = useGetUserById(userState?.id || "");

  useEffect(() => {
    if (user) {
      setForm({
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        description: user.description || "",
        status: user.status || "",
        role: user.role || "",
      });
    }
  }, [user]);

  if (loading) {
    return <LoadingScreen />;
  }

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!user) {
    return null;
  }

  const renderEditableRow = ({
    title,
    field,
    options,
  }: {
    title: string;
    field: keyof typeof form;
    options?: string[];
  }) => {
    return (
      <Pressable
        onPress={() => setEditing(field)}
        className="rounded-3xl bg-gray-100 p-4"
      >
        <Text className="text-gray-400 mb-1">{title}</Text>

        {editing === field ? (
          options ? (
            <Picker
              selectedValue={form[field]}
              onValueChange={(value) => {
                setForm((prev) => ({
                  ...prev,
                  [field]: value,
                }));
                setEditing(null);
              }}
            >
              {options.map((option) => (
                <Picker.Item key={option} label={option} value={option} />
              ))}
            </Picker>
          ) : (
            <TextInput
              autoFocus
              value={String(form[field] ?? "")}
              onChangeText={(text) =>
                setForm((prev) => ({
                  ...prev,
                  [field]: text,
                }))
              }
              onBlur={() => setEditing(null)}
            />
          )
        ) : (
          <Text className="text-lg">{String(form[field] ?? "")}</Text>
        )}
      </Pressable>
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
            {!user.isVerified && (
              <View className="rounded-3xl bg-yellow-100 p-4">
                <Text className="">Verify now</Text>
                <Text className="text-lg ">
                  {user.username}, you aren&apos;t verified yet
                </Text>
              </View>
            )}

            {renderEditableRow({
              title: "Full Name",
              field: "fullName",
            })}

            {renderEditableRow({
              title: "Username",
              field: "username",
            })}
            {renderEditableRow({
              title: "Email",
              field: "email",
            })}
            {renderEditableRow({
              title: "Phone",
              field: "phoneNumber",
            })}
            {renderEditableRow({
              title: "Description",
              field: "description",
            })}

            {renderEditableRow({
              title: "Status",
              field: "status",
              options: ["Active", "Inactive"],
            })}

            {renderEditableRow({
              title: "Role",
              field: "role",
              options: ["Guide", "Agency"],
            })}
          </View>

          <Pressable
            disabled={updateProfile.isPending}
            onPress={() => {
              updateProfile.mutate(form, {
                onSuccess: () => {
                  Toast.show({
                    type: "success",
                    text1: "Success",
                    text2: "Profile updated successfully.",
                  });
                },
                onError: (err: any) => {
                  Toast.show({
                    type: "error",
                    text1: "Update failed",
                    text2: err?.message ?? "Something went wrong.",
                  });
                },
              });
            }}
            className={`mt-8 mb-32 rounded-2xl py-4 ${
              updateProfile.isPending ? "bg-blue-400" : "bg-blue-600"
            }`}
          >
            <Text className="text-center text-lg font-bold text-white">
              {updateProfile.isPending ? "Saving..." : "Save Changes"}
            </Text>
          </Pressable>
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
