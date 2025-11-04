//screens/LoginScreen.js
import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import API from "../api/apiservice";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    try {
      setLoading(true);
      const res = await API.post("/login", { email, password });
      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("username", res.data.username);
      Alert.alert("Success", "Logged in successfully!");
      navigation.replace("MemberHome");
    } catch (err) {
      Alert.alert("Login failed", err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center bg-white p-5">
      <Text className="text-2xl font-bold mb-5">Club Connect Login</Text>

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        className="border w-full mb-3 p-3 rounded-lg"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        className="border w-full mb-3 p-3 rounded-lg"
      />

      <TouchableOpacity
        onPress={handleLogin}
        className="bg-blue-500 w-full p-3 rounded-lg"
      >
        <Text className="text-white text-center text-lg">
          {loading ? "Loading..." : "Login"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}
