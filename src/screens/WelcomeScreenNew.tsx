import React from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";

export function WelcomeScreenNew(props: any) {
  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    props.navigation.replace("Swipe");
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#8B5CF6", "#3B82F6"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.hero}>
            <View style={styles.iconContainer}>
              <Ionicons name="images" size={48} color="#8B5CF6" />
            </View>
            <Text style={styles.title}>Photo Cleaner</Text>
            <Text style={styles.subtitle}>Clean up your photo library the fun way</Text>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="finger-print" size={24} color="white" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Swipe to Organize</Text>
                <Text style={styles.featureDescription}>
                  Swipe right to keep, left to delete. It&apos;s that simple!
                </Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="shield-checkmark" size={24} color="white" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>100% Private</Text>
                <Text style={styles.featureDescription}>
                  All processing happens on your device. Your photos never leave.
                </Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="flash" size={24} color="white" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Lightning Fast</Text>
                <Text style={styles.featureDescription}>
                  Clean up hundreds of photos in minutes, not hours.
                </Text>
              </View>
            </View>
          </View>

          {/* CTA Button */}
          <Pressable
            onPress={handleGetStarted}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Get Started</Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            By continuing, you agree to grant photo library access
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#8B5CF6",
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 24,
  },
  hero: {
    alignItems: "center",
    marginBottom: 48,
  },
  iconContainer: {
    width: 96,
    height: 96,
    backgroundColor: "white",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    color: "white",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subtitle: {
    color: "white",
    fontSize: 18,
    opacity: 0.9,
    textAlign: "center",
  },
  features: {
    flex: 1,
    gap: 16,
  },
  featureCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 24,
    flexDirection: "row",
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 8,
  },
  featureDescription: {
    color: "white",
    fontSize: 14,
    opacity: 0.8,
    lineHeight: 20,
  },
  button: {
    backgroundColor: "white",
    borderRadius: 16,
    paddingVertical: 20,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonText: {
    color: "#8B5CF6",
    fontSize: 18,
    fontWeight: "bold",
  },
  disclaimer: {
    color: "white",
    fontSize: 12,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 16,
  },
});
