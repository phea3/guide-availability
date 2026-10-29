import { CalendarDays, Settings2 } from "lucide-react-native";
import { Pressable, Text, View } from "react-native";

export default function SwitchButtonView({
  activeView,
  setActiveView,
}: {
  activeView: "calendar" | "setup" | "hide";
  setActiveView: (view: "calendar" | "setup") => void;
}) {
  const isCalendar = activeView === "calendar";

  return (
    <View className="mx-4 mt-4 rounded-2xl bg-stone-100 p-1.5 flex-row">
      <Pressable
        onPress={() => setActiveView("calendar")}
        accessibilityRole="tab"
        accessibilityState={{ selected: isCalendar }}
        className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3 ${
          isCalendar ? "bg-white " : "bg-transparent"
        }`}
      >
        <CalendarDays size={18} color={isCalendar ? "#7e5f03" : "#78716c"} />
        <Text
          className={`text-sm font-semibold ${
            isCalendar ? "text-[#7e5f03]" : "text-stone-500"
          }`}
        >
          Calendar View
        </Text>
      </Pressable>

      <Pressable
        onPress={() => setActiveView("setup")}
        accessibilityRole="tab"
        accessibilityState={{ selected: !isCalendar }}
        className={`flex-1 flex-row items-center justify-center gap-2 rounded-xl py-3 ${
          !isCalendar ? "bg-white " : "bg-transparent"
        }`}
      >
        <Settings2 size={18} color={!isCalendar ? "#7e5f03" : "#78716c"} />
        <Text
          className={`text-sm font-semibold ${
            !isCalendar ? "text-[#7e5f03]" : "text-stone-500"
          }`}
        >
          Day Setup
        </Text>
      </Pressable>
    </View>
  );
}
