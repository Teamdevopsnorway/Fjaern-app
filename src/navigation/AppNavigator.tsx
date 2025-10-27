import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WelcomeScreenNew } from "../screens/WelcomeScreenNew";
import { TestScreen } from "../screens/TestScreen";

export type RootStackParamList = {
  Welcome: undefined;
  Test: undefined;
  Swipe: undefined;
  Review: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  return (
    <Stack.Navigator
      initialRouteName="Welcome"
      screenOptions={{
        headerShown: false,
        animation: "slide_from_right",
      }}
    >
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreenNew}
        options={{
          animation: "fade",
        }}
      />
      <Stack.Screen name="Test" component={TestScreen} />
    </Stack.Navigator>
  );
};
