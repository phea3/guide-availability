import BackButton from "@/app/_components/back-button";
import AuthenticationModal from "@/components/authentication";
import ConfirmAlert from "@/components/confirm-alert";
import GlassCalendar from "@/components/glass-calendar";
import { LoadingScreen } from "@/components/loading-screen";
import {
  AvailableDayModel,
  useAddAvailableDay,
} from "@/hook/use-add-available-day";
import { useGetAvailableDays } from "@/hook/use-available-days";
import { useDeleteAvailableDay } from "@/hook/use-delete-available-day";
import { useGetGuideById } from "@/hook/use-guide-id";
import { useUpdateAvailableDay } from "@/hook/use-update-available-day";
import { isYourProfile } from "@/lib/dev";
import { AvailableDraftDayType } from "@/types/availability";
import { useAuth } from "@clerk/expo";
import { useLocalSearchParams } from "expo-router";
import { useState } from "react";
import { FlatList, ImageBackground, Text, View } from "react-native";
import Toast from "react-native-toast-message";
import AvailableDayItem from "./available-day-item";
import SetupForm from "./setup-form";
import SwitchButtonView from "./switch-button-view";

export default function MainGuideDetail() {
  const { userId } = useAuth();
  const available = useAddAvailableDay();
  const updateAvailable = useUpdateAvailableDay();
  const deleteAvailable = useDeleteAvailableDay();
  const { data: availableDays } = useGetAvailableDays();
  const params = useLocalSearchParams();
  const [status, setStatus] = useState(true);
  const [remark, setRemark] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [activeView, setActiveView] = useState<"calendar" | "setup">(
    "calendar",
  );
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // alert for delete
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [selectedDeleteId, setSelectedDeleteId] = useState<string | null>(null);

  const id = Array.isArray(params.id) ? params.id[0] : params.id;
  const { data: guide, isPending } = useGetGuideById(id || "");

  if (isPending) {
    return <LoadingScreen />;
  }

  if (!guide) {
    return (
      <View className="rounded-2xl bg-white/80 backdrop-blur-md p-4 mx-2 mt-6 mb-6 border border-gray-300">
        <Text className="mb-2 text-xl font-bold text-gray-900">
          Guide Profile
        </Text>

        <Text className="mb-6 text-gray-600">
          There is no guide data available. Please log in or register again.
        </Text>
      </View>
    );
  }

  const handleAddAvailable = (data: AvailableDayModel) => {
    available.mutate(
      {
        userId: guide?.id,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        status: data.status || undefined,
        remark: data.remark,
      },
      {
        onSuccess: async () => {
          Toast.show({
            type: "success",
            text1: "Success",
            text2: "Add day.",
          });
        },
        onError: (err: any) => {
          Toast.show({
            type: "error",
            text1: "Add failed",
            text2: err?.message ?? "Something went wrong.",
          });
        },
      },
    );
  };

  const handleUpdateAvailable = async (
    data: AvailableDraftDayType,
  ): Promise<void> => {
    setUpdatingId(data.id);

    try {
      await updateAvailable.mutateAsync({
        id: data.id,
        userId: guide?.id,
        startDate: data.startDate || undefined,
        endDate: data.endDate || undefined,
        status: data.status || undefined,
        remark: data.remark,
        availableTimes: data.availableTimes || [],
      });

      Toast.show({
        type: "success",
        text1: "Success",
        text2: "Update day.",
      });
    } catch (err: any) {
      Toast.show({
        type: "error",
        text1: "Update failed",
        text2: err?.message ?? "Something went wrong.",
      });

      throw err;
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteAvailable = (id: string) => {
    setSelectedDeleteId(id);
    setConfirmDelete(true);
  };

  const handleConfirmDelete = () => {
    if (!selectedDeleteId) return;

    setDeletingId(selectedDeleteId);

    deleteAvailable.mutate(selectedDeleteId, {
      onSuccess: async () => {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Availability day deleted.",
        });

        setConfirmDelete(false);
        setSelectedDeleteId(null);
      },
      onError: (err: any) => {
        Toast.show({
          type: "error",
          text1: "Delete failed",
          text2: err?.message ?? "Something went wrong.",
        });
      },
      onSettled: () => setDeletingId(null),
    });
  };

  const isProfileOwner = isYourProfile({
    userId,
    guideUserId: guide?.id,
  });

  return (
    <>
      <ImageBackground
        source={require("../../../assets/images/pattern-background.png")}
        resizeMode="cover"
        className="flex-1"
      >
        <View className="absolute inset-0 bg-white/95 backdrop-blur-md" />

        <FlatList
          data={isProfileOwner ? availableDays : []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <AvailableDayItem
              key={item.id}
              item={item as AvailableDraftDayType}
              onUpdateDay={handleUpdateAvailable}
              onDeleteDay={handleDeleteAvailable}
              isUpdatingDay={
                isProfileOwner &&
                updatingId === item.id &&
                updateAvailable.isPending
              }
              isDeletingDay={
                isProfileOwner &&
                deletingId === item.id &&
                deleteAvailable.isPending
              }
            />
          )}
          ListHeaderComponent={
            <>
              <BackButton
                title={guide?.fullName || "Unknown"}
                imageUrl={guide?.imageUrl}
              />
              {isProfileOwner && (
                <SwitchButtonView
                  activeView={activeView}
                  setActiveView={setActiveView}
                />
              )}
              {activeView === "calendar" && (
                <GlassCalendar data={availableDays || []} guide={guide} />
              )}
              {isProfileOwner && activeView === "setup" && (
                <SetupForm
                  startDate={startDate}
                  endDate={endDate}
                  remark={remark}
                  status={status}
                  setStatus={setStatus}
                  setStartDate={setStartDate}
                  setEndDate={setEndDate}
                  setRemark={setRemark}
                  handleAddAvailable={handleAddAvailable}
                  isAddingDay={available.isPending}
                />
              )}
              <Text className="text-lg font-bold mt-4 mx-2 mb-3">
                {isProfileOwner ? "Your Available Days" : null}
              </Text>
            </>
          }
          contentContainerStyle={{ padding: 0 }}
        />

        <AuthenticationModal />
      </ImageBackground>

      <ConfirmAlert
        visible={confirmDelete}
        title="Delete availability?"
        message="Are you sure you want to delete this availability day? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        destructive
        isLoading={deleteAvailable.isPending}
        onCancel={() => {
          if (deleteAvailable.isPending) return;

          setConfirmDelete(false);
          setSelectedDeleteId(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </>
  );
}
