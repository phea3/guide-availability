import * as SecureStore from "expo-secure-store";

export const AuthStorage = {
  async getUser() {
    const raw = await SecureStore.getItemAsync("user");

    return raw ? JSON.parse(raw) : null;
  },

  async setUser(user: any) {
    await SecureStore.setItemAsync("user", JSON.stringify(user));
  },

  async logout() {
    await SecureStore.deleteItemAsync("user");
  },
};
