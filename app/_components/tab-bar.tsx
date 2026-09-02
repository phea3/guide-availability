import { usePathname, useRouter } from "expo-router";
import { Pressable, Text, View } from "react-native";

import { Ionicons } from "@expo/vector-icons";

type IoniconName = React.ComponentProps<typeof Ionicons>["name"];

const TABS: { name: string; icon: IoniconName }[] = [
  { name: "home", icon: "home" },
  { name: "guides", icon: "people" },
  { name: "profile", icon: "person" },
];

export default function GlassTabBar() {
  const router = useRouter();
  const pathname = usePathname();

  return (
    <View className="w-full pb-5">
      <View className="border-t border-gray-200 bg-white">
        <View className="flex-row h-16 items-center justify-around px-4">
          {TABS.map((tab) => {
            const isActive = pathname.startsWith(`/${tab.name}`);
            return (
              <Pressable
                key={tab.name}
                onPress={() => {
                  if (pathname !== `/${tab.name}`) {
                    router.replace(`/${tab.name}` as any);
                  }
                }}
                className="flex-1 items-center"
              >
                <View
                  className={`items-center gap-1 ${
                    isActive ? "bg-gray-100 rounded-2xl px-3 py-2" : ""
                  }`}
                >
                  <Ionicons
                    name={tab.icon}
                    size={20}
                    color={isActive ? "#000" : "#666"}
                  />
                  <Text
                    className={`text-xs ${
                      isActive ? "text-black font-semibold" : "text-gray-500"
                    }`}
                  >
                    {tab.name}
                  </Text>
                </View>
              </Pressable>
            );
          })}
        </View>
      </View>
    </View>
  );
}
