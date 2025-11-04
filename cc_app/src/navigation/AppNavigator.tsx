import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import MemberHome from "../screens/MemberHome";

// 🧭 Define all route names and params
export type RootStackParamList = {
  Login: undefined;
  MemberHome: undefined;
};

// ✅ Create a typed Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MemberHome" component={MemberHome} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
