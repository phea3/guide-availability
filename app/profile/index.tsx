import AuthenticationModal from "@/components/authentication";
import { useProfileDetail } from "@/hook/use-profile-detail";
import { useGetUserById } from "@/hook/use-user-id";
import { useAuth } from "@clerk/expo";
import { Ionicons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { Link, router } from "expo-router";
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
  const { userId, signOut } = useAuth();

  const [showLogoutModal, setShowLogoutModal] = useState(false);

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

  const { data: user } = useGetUserById(userId || "");

  const updateProfile = useProfileDetail();

  useEffect(() => {
    if (!user) return;

    const timeout = setTimeout(() => {
      setForm({
        fullName: user.fullName || "",
        username: user.username || "",
        email: user.email || "",
        phoneNumber: user.phoneNumber || "",
        description: user.description || "",
        status: user.status || "",
        role: user.role || "",
      });
    }, 0);

    return () => clearTimeout(timeout);
  }, [user]);

  // if (!isLoaded || isPending) {
  //   return <LoadingScreen />;
  // }

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
        className="rounded-2xl bg-white/80 backdrop-blur-md p-4 border border-gray-300"
      >
        <Text className="mb-1 text-gray-400">{title}</Text>

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

  const handleLogout = async () => {
    try {
      setShowLogoutModal(false);

      await signOut();

      router.replace("/register");
    } catch (error) {
      console.error("Logout error:", error);

      Toast.show({
        type: "error",
        text1: "Logout failed",
        text2: "Something went wrong. Please try again.",
      });
    }
  };

  return (
    <ImageBackground
      source={require("../../assets/images/pattern-background.png")}
      resizeMode="cover"
      className="flex-1 justify-center"
    >
      <View className="absolute inset-0 bg-white/95" />

      <ScrollView
        className="h-full w-full p-6"
        showsVerticalScrollIndicator={false}
      >
        <View className="w-full items-end">
          <Pressable onPress={() => setShowLogoutModal(true)}>
            <View className="h-12 w-12 items-center justify-center rounded-full bg-red-500">
              <Ionicons name="log-out-outline" size={24} color="white" />
            </View>
          </Pressable>
        </View>
        {!userId || !user ? (
          <View className="rounded-2xl bg-white/80 backdrop-blur-md p-4 mx-2 mt-6 mb-6 border border-gray-300">
            <Text className="mb-2 text-xl font-bold text-gray-900">
              Account Profile
            </Text>

            <Text className="mb-6 text-gray-600">
              There is no user data available. Please log in or register to view
              your profile.
            </Text>
          </View>
        ) : (
          <>
            <View className="my-10 w-full items-center">
              <View className="h-36 w-36 overflow-hidden rounded-full border-4 border-white bg-gray-100 shadow-lg">
                <Image
                  source={
                    user?.imageUrl
                      ? { uri: user.imageUrl }
                      : require("../../assets/images/profile.jpg")
                  }
                  className="h-full w-full"
                  resizeMode="cover"
                />
              </View>

              <Text className="mt-4 text-xl font-bold text-gray-900">
                {user?.fullName || "Your Profile"}
              </Text>
            </View>

            <View className="flex flex-col gap-4">
              {/* {!user?.isVerified && (
                <View className="rounded-2xl bg-yellow-100 backdrop-blur-md p-4 border border-gray-300">
                  <Text>Verify now</Text>
                  <Text className="text-lg">
                    {user?.username}, you aren&apos;t verified yet. Please
                    verify your account to access all features.
                  </Text>
                </View>
              )} */}

              {user?.role === "Guide" && (
                <View className="mx-4 mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
                  <View className="flex-row items-center">
                    <View className="mr-3 h-10 w-10 items-center justify-center rounded-full bg-amber-100">
                      <Ionicons
                        name="person-outline"
                        size={22}
                        color="#D97706"
                      />
                    </View>

                    <View className="flex-1">
                      <Text className="text-base font-bold text-gray-900">
                        Complete your guide availability profile
                      </Text>

                      <Text className="mt-1 text-sm text-gray-600">
                        Add your information so agencies can discover you.
                      </Text>
                    </View>
                  </View>

                  <Link
                    href={{
                      pathname: "/guides/[id]",
                      params: { id: user.id },
                    }}
                    asChild
                  >
                    <Pressable className="mt-4 flex-row items-center justify-center rounded-xl bg-amber-500 px-4 py-3">
                      <Text className="font-bold text-white">
                        Complete Profile
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={18}
                        color="white"
                        style={{ marginLeft: 8 }}
                      />
                    </Pressable>
                  </Link>
                </View>
              )}

              <View className="py-4">
                <Text className="text-lg font-bold">
                  Check & Update Informations
                </Text>

                <Text className="">
                  Tap on a field to edit it. Once done, click &rdquo;Save
                  Changes&rdquo; to update your profile.
                </Text>
              </View>

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
                updateProfile.mutate(
                  {
                    ...form,
                    id: user?.id || "",
                  },
                  {
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
                  },
                );
              }}
              className={`mb-32 mt-8 rounded-2xl py-4 ${
                updateProfile.isPending ? "bg-green-400" : "bg-yellow-400"
              }`}
            >
              <Text className="text-center text-lg font-bold text-white">
                {updateProfile.isPending ? "Saving..." : "Save Changes"}
              </Text>
            </Pressable>
          </>
        )}
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
                onPress={handleLogout}
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
      <AuthenticationModal />
    </ImageBackground>
  );
}
