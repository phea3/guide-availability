import { Ionicons } from "@expo/vector-icons";
import { Modal, Pressable, Text, View } from "react-native";

type ConfirmAlertProps = {
  visible: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
};

export default function ConfirmAlert({
  visible,
  title = "Are you sure?",
  message = "This action cannot be undone. Are you sure you want to continue?",
  confirmText = "Confirm",
  cancelText = "Cancel",
  destructive = true,
  isLoading = false,
  onConfirm,
  onCancel,
}: ConfirmAlertProps) {
  const actionColor = destructive ? "#dc2626" : "#7e5f03";

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      statusBarTranslucent
    >
      <View className="flex-1 items-center justify-center bg-black/40 px-6">
        <Pressable
          className="absolute inset-0"
          onPress={onCancel}
          disabled={isLoading}
        />

        <View className="w-full max-w-sm rounded-3xl bg-white p-6">
          <View className="mb-4 h-14 w-14 items-center justify-center rounded-full bg-red-50">
            <Ionicons
              name={destructive ? "warning-outline" : "help-circle-outline"}
              size={30}
              color={actionColor}
            />
          </View>

          <Text className="text-xl font-bold text-gray-900">{title}</Text>

          <Text className="mt-3 text-sm leading-6 text-gray-500">
            {message}
          </Text>

          <View className="mt-6 flex-row gap-3">
            <Pressable
              onPress={onCancel}
              disabled={isLoading}
              className="flex-1 items-center justify-center rounded-xl border border-stone-200 bg-white py-3"
            >
              <Text className="font-semibold text-gray-700">{cancelText}</Text>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              disabled={isLoading}
              className="flex-1 flex-row items-center justify-center rounded-xl py-3"
              style={{ backgroundColor: actionColor }}
            >
              {isLoading && (
                <Ionicons name="hourglass-outline" size={16} color="white" />
              )}
              <Text className="ml-1 font-semibold text-white">
                {isLoading ? "Please wait..." : confirmText}
              </Text>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
