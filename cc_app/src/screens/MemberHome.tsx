import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

// 🧭 Type the navigation prop
type MemberHomeNavigationProp = StackNavigationProp<
  RootStackParamList,
  "MemberHome"
>;

type Props = {
  navigation: MemberHomeNavigationProp;
};

export default function MemberHome({ navigation }: Props) {
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    const fetchUser = async () => {
      const name = await AsyncStorage.getItem("username");
      setUsername(name || "");
    };
    fetchUser();
  }, []);

  const logout = async () => {
    await AsyncStorage.clear();
    navigation.replace("Login");
  };

  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-3">
        Welcome, {username} 👋
      </Text>
      <TouchableOpacity
        onPress={logout}
        className="bg-red-500 p-3 rounded-lg active:opacity-80"
      >
        <Text className="text-white text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
