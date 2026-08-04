import { Pressable, Text, View } from "react-native";

/* Switch buttons */
export default function SwitchButtonView({
  activeView,
  setActiveView,
}: {
  activeView: "calendar" | "setup" | "hide";
  setActiveView: (view: "calendar" | "setup") => void;
}) {
  return (
    <View className="flex-row gap-3 mx-4 mt-4">
      <Pressable
        onPress={() => setActiveView("calendar")}
        className={`flex-1 rounded-xl py-3 ${
          activeView === "calendar" ? "bg-[#7e5f03]" : "bg-[#c9a849]"
        }`}
      >
        <Text className="text-center text-white font-medium">
          Calendar View
        </Text>
      </Pressable>
      <Pressable
        onPress={() => setActiveView("setup")}
        className={`flex-1 rounded-xl py-3 ${
          activeView === "setup" ? "bg-[#7e5f03]" : "bg-[#c9a849]"
        }`}
      >
        <Text className="text-center text-white font-medium">Day Setup</Text>
      </Pressable>
    </View>
  );
}
