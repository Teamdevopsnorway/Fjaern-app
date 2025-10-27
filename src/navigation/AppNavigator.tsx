import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WelcomeScreenNew } from "../screens/WelcomeScreenNew";
import { SwipeScreenNew } from "../screens/SwipeScreenNew";
import { ReviewScreenNew } from "../screens/ReviewScreenNew";

export type RootStackParamList = {
  Welcome: undefined;
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
      <Stack.Screen name="Swipe" component={SwipeScreenNew} />
      <Stack.Screen
        name="Review"
        component={ReviewScreenNew}
        options={{
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
};
