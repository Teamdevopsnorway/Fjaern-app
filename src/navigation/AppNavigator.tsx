import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WelcomeScreen } from "../screens/WelcomeScreen";
import { SwipeScreen } from "../screens/SwipeScreen";
import { ReviewScreen } from "../screens/ReviewScreen";

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
        component={WelcomeScreen}
        options={{
          animation: "fade",
        }}
      />
      <Stack.Screen name="Swipe" component={SwipeScreen} />
      <Stack.Screen
        name="Review"
        component={ReviewScreen}
        options={{
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
};
