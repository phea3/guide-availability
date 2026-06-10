import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { TextInput, TouchableOpacity, View } from "react-native";

type Props = {
  password: string;
  setPassword: (value: string) => void;
};

export default function PasswordInput({ password, setPassword }: Props) {
  const [isVisible, setIsVisible] = useState(false);

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        borderWidth: 0,
        borderColor: "#ccc",
        borderRadius: 12,
        backgroundColor: "#fff",
        paddingHorizontal: 12,
        marginBottom: 16,
      }}
    >
      <TextInput
        placeholder="Password"
        secureTextEntry={!isVisible}
        value={password}
        onChangeText={setPassword}
        style={{
          flex: 1,
          paddingVertical: 12,
          fontSize: 16,
        }}
      />

      {/* Toggle icon */}
      <TouchableOpacity onPress={() => setIsVisible(!isVisible)}>
        <Ionicons name={isVisible ? "eye" : "eye-off"} size={22} color="#666" />
      </TouchableOpacity>
    </View>
  );
}
