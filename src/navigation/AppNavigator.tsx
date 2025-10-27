import React from "react";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { WelcomeScreenNew } from "../screens/WelcomeScreenNew";
import { GoalChoiceScreen } from "../screens/GoalChoiceScreen";
import { SwipeScreenNew } from "../screens/SwipeScreenNew";
import { ReviewScreenNew } from "../screens/ReviewScreenNew";
import { CategoriesScreen } from "../screens/CategoriesScreen";

export type RootStackParamList = {
  Welcome: undefined;
  GoalChoice: undefined;
  SwipeNew: undefined;
  ReviewNew: undefined;
  Categories: undefined;
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
      <Stack.Screen
        name="GoalChoice"
        component={GoalChoiceScreen}
        options={{
          animation: "slide_from_right",
        }}
      />
      <Stack.Screen name="Categories" component={CategoriesScreen} />
      <Stack.Screen name="SwipeNew" component={SwipeScreenNew} />
      <Stack.Screen
        name="ReviewNew"
        component={ReviewScreenNew}
        options={{
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
};
