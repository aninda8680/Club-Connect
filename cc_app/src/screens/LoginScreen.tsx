//screens/LoginScreen.tsx
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import API from "../api/apiservice";
import type { StackNavigationProp } from "@react-navigation/stack";
import type { RootStackParamList } from "../navigation/AppNavigator";

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, "Login">;
type Props = { navigation: LoginScreenNavigationProp };

export default function LoginScreen({ navigation }: Props) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("https://google.com");
        console.log("✅ Google reachable");
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("❌ HTTPS test failed:", message);
      }

      try {
        const res = await fetch("https://club-connect-p2o2.onrender.com/health");
        const data = await res.json();
        console.log("✅ Backend reachable:", data);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error("❌ Backend not reachable:", message);
      }
    })();
  }, []);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Missing Information", "Please enter both email and password");
      return;
    }

    try {
      setLoading(true);
      console.log("🧭 Login URL:", API.defaults.baseURL + "/auth/login");

      const res = await API.post("/auth/login", { email, password });

      await AsyncStorage.setItem("token", res.data.token);
      await AsyncStorage.setItem("username", res.data.username);

      Alert.alert("Success", "Logged in successfully!");
      navigation.replace("MemberHome");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        console.log("❌ Axios error:", err.toJSON?.() || err.message);
        if (err.response) {
          console.log("❌ Response:", err.response.status, err.response.data);
          Alert.alert("Login failed", err.response.data?.message || "Server error");
        } else if (err.request) {
          console.log("❌ Request sent, no response received:", err.request);
          Alert.alert("Login failed", "Server did not respond.");
        } else {
          Alert.alert("Login failed", err.message);
        }
      } else {
        const message = err instanceof Error ? err.message : String(err);
        Alert.alert("Login failed", message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      className="flex-1 bg-slate-900"
    >
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <View className="flex-1 justify-center items-center px-8 py-12">
          {/* Centered Login Card */}
          <View className="w-full max-w-md">
            {/* Glowing Logo */}
            <View className="items-center mb-8">
              <View className="relative">
                <View className="absolute inset-0 bg-blue-500 rounded-full blur-2xl opacity-30" />
                <View className="bg-gradient-to-br from-blue-500 to-purple-600 w-24 h-24 rounded-3xl items-center justify-center shadow-2xl">
                  <Text className="text-white text-5xl font-bold">C</Text>
                </View>
              </View>
              <Text className="text-white text-4xl font-bold mt-6 tracking-tight">
                Club Connect
              </Text>
              <Text className="text-slate-400 text-sm mt-2 tracking-wide">
                Sign in to your account
              </Text>
            </View>

            {/* Glassmorphic Form Card */}
            <View className="bg-slate-800/50 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-slate-700/50">
              {/* Email Input */}
              <View className="mb-5">
                <Text className="text-slate-300 text-xs font-semibold mb-2 ml-1 uppercase tracking-wider">
                  Email
                </Text>
                <TextInput
                  placeholder="you@example.com"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  className="bg-slate-900/80 border border-slate-700 w-full px-4 py-4 rounded-xl text-white placeholder:text-slate-500"
                  placeholderTextColor="#64748B"
                />
              </View>

              {/* Password Input */}
              <View className="mb-6">
                <Text className="text-slate-300 text-xs font-semibold mb-2 ml-1 uppercase tracking-wider">
                  Password
                </Text>
                <TextInput
                  placeholder="••••••••"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  className="bg-slate-900/80 border border-slate-700 w-full px-4 py-4 rounded-xl text-white placeholder:text-slate-500"
                  placeholderTextColor="#64748B"
                />
              </View>

              {/* Login Button */}
              <TouchableOpacity
                onPress={handleLogin}
                disabled={loading}
                className={`w-full py-4 rounded-xl shadow-lg ${
                  loading
                    ? "bg-slate-700"
                    : "bg-gradient-to-r from-blue-500 to-purple-600"
                }`}
                activeOpacity={0.9}
              >
                <Text className="text-white text-center text-base font-bold tracking-wide">
                  {loading ? "SIGNING IN..." : "SIGN IN"}
                </Text>
              </TouchableOpacity>

              {/* Forgot Password */}
              <TouchableOpacity className="mt-5" activeOpacity={0.7}>
                <Text className="text-blue-400 text-center text-sm font-medium">
                  Forgot your password?
                </Text>
              </TouchableOpacity>
            </View>

            {/* Sign Up Link */}
            <View className="flex-row justify-center items-center mt-8">
              <Text className="text-slate-400 text-sm">New to Club Connect? </Text>
              <TouchableOpacity activeOpacity={0.7}>
                <Text className="text-blue-400 font-semibold text-sm">
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}