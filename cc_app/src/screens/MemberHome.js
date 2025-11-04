//screens/MemberHome.js
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function MemberHome({ navigation }) {
  const [username, setUsername] = useState("");

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
      <Text className="text-2xl font-bold mb-3">Welcome, {username} 👋</Text>
      <TouchableOpacity onPress={logout} className="bg-red-500 p-3 rounded-lg">
        <Text className="text-white text-lg">Logout</Text>
      </TouchableOpacity>
    </View>
  );
}
