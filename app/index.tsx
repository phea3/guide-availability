// import { router } from "expo-router";
// import { Pressable, Text, View } from "react-native";
// import Swiper from "react-native-swiper";

// export default function Intro() {
//   return (
//     <Swiper loop={false} showsPagination>
//       <View className="flex-1 bg-blue-500 items-center justify-center p-6">
//         <Text className="text-white text-3xl font-bold">Welcome</Text>
//         <Text className="text-white mt-4 text-center">
//           Find trusted local guides easily.
//         </Text>
//       </View>

//       <View className="flex-1 bg-purple-500 items-center justify-center p-6">
//         <Text className="text-white text-3xl font-bold">Book Fast</Text>
//         <Text className="text-white mt-4 text-center">
//           Check availability instantly.
//         </Text>
//       </View>

//       <View className="flex-1 bg-green-500 items-center justify-center p-6">
//         <Text className="text-white text-3xl font-bold">Get Started</Text>

//         <Pressable
//           onPress={() => router.replace("/login")}
//           className="mt-8 bg-white px-6 py-4 rounded-2xl"
//         >
//           <Text className="font-semibold text-green-600">Continue</Text>
//         </Pressable>
//       </View>
//     </Swiper>
//   );
// }

// app/index.tsx
import { AuthStorage } from "@/auth/auth-acess-token";
import { LoadingScreen } from "@/components/loading-screen";
import { router } from "expo-router";
import { useEffect, useState } from "react";

export default function Index() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const user = await AuthStorage.getUser();

        if (user) {
          router.replace("/home");
        } else {
          router.replace("/login");
        }
      } finally {
        setLoading(false);
      }
    }

    checkAuth();
  }, []);

  if (loading) {
    return <LoadingScreen />;
  }

  return null;
}
