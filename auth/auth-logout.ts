import * as SecureStore from "expo-secure-store";

export async function logout() {
  await SecureStore.deleteItemAsync("access_token");
}
