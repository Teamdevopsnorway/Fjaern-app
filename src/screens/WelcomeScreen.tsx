import React from "react";
import { View, Text, Pressable, Dimensions } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import Animated, { FadeInDown } from "react-native-reanimated";
import * as Haptics from "expo-haptics";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const features = [
  {
    icon: "finger-print" as const,
    title: "Swipe to Organize",
    description: "Swipe right to keep, left to delete. It's that simple!",
    color: "#8B5CF6",
  },
  {
    icon: "shield-checkmark" as const,
    title: "100% Private",
    description: "All processing happens on your device. Your photos never leave.",
    color: "#3B82F6",
  },
  {
    icon: "flash" as const,
    title: "Lightning Fast",
    description: "Clean up hundreds of photos in minutes, not hours.",
    color: "#10B981",
  },
];

function WelcomeScreenComponent({ navigation }: { navigation: any }) {
  const insets = useSafeAreaInsets();

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.replace("Swipe");
  };

  return (
    <View className="flex-1 bg-white">
      <LinearGradient
        colors={["#8B5CF6", "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          flex: 1,
          paddingTop: insets.top + 40,
          paddingBottom: insets.bottom + 20,
        }}
      >
        {/* Hero Section */}
        <View className="items-center px-8 mb-12">
          <Animated.View
            entering={FadeInDown.delay(0).springify()}
            className="w-24 h-24 bg-white rounded-3xl items-center justify-center mb-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 10 },
              shadowOpacity: 0.3,
              shadowRadius: 20,
            }}
          >
            <Ionicons name="images" size={48} color="#8B5CF6" />
          </Animated.View>

          <Animated.Text
            entering={FadeInDown.delay(100).springify()}
            className="text-white text-4xl font-bold text-center mb-4"
          >
            Photo Cleaner
          </Animated.Text>

          <Animated.Text
            entering={FadeInDown.delay(200).springify()}
            className="text-white text-lg text-center opacity-90"
          >
            Clean up your photo library the fun way
          </Animated.Text>
        </View>

        {/* Features */}
        <View className="flex-1 px-6 gap-4">
          {features.map((feature, index) => (
            <Animated.View
              key={feature.title}
              entering={FadeInDown.delay(300 + index * 100).springify()}
              className="bg-white bg-opacity-10 backdrop-blur-lg rounded-2xl p-6"
              style={{
                borderWidth: 1,
                borderColor: "rgba(255, 255, 255, 0.2)",
              }}
            >
              <View className="flex-row items-start">
                <View
                  className="w-12 h-12 rounded-full items-center justify-center mr-4"
                  style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                >
                  <Ionicons name={feature.icon} size={24} color="white" />
                </View>
                <View className="flex-1">
                  <Text className="text-white text-lg font-semibold mb-2">
                    {feature.title}
                  </Text>
                  <Text className="text-white text-sm opacity-80 leading-5">
                    {feature.description}
                  </Text>
                </View>
              </View>
            </Animated.View>
          ))}
        </View>

        {/* CTA Button */}
        <Animated.View
          entering={FadeInDown.delay(700).springify()}
          className="px-6 pt-6"
        >
          <Pressable
            onPress={handleGetStarted}
            className="active:opacity-90"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 8 },
              shadowOpacity: 0.3,
              shadowRadius: 16,
            }}
          >
            <View className="bg-white rounded-2xl py-5 items-center">
              <Text className="text-purple-600 text-lg font-bold">
                Get Started
              </Text>
            </View>
          </Pressable>

          <Text className="text-white text-center text-xs mt-4 opacity-70">
            By continuing, you agree to grant photo library access
          </Text>
        </Animated.View>
      </LinearGradient>
    </View>
  );
}

// Export as simple function component to avoid NativeWind interop
export const WelcomeScreen = React.memo(function WelcomeScreen({ navigation }: any) {
  return <WelcomeScreenComponent navigation={navigation} />;
});
