import React from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { TrollAvatar } from "../components/TrollAvatar";

export function WelcomeScreenNew(props: any) {
  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    props.navigation.navigate("GoalChoice");
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#FFFFFF", "#EF4444", "#1E40AF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.content}>
          {/* Hero Section */}
          <View style={styles.hero}>
            <View style={styles.trollAvatarContainer}>
              <TrollAvatar size={120} animate={true} />
            </View>
            <Text style={styles.title}>Fjærn</Text>
            <Text style={styles.subtitle}>La trollet hjelpe deg å rydde i bildene! 🇳🇴</Text>
          </View>

          {/* Features */}
          <View style={styles.features}>
            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="flame" size={24} color="#FF6B35" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Streak System</Text>
                <Text style={styles.featureDescription}>
                  Hold streken din ved å rydde hver dag!
                </Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="trophy" size={24} color="#FFD700" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Milepæler & Belønninger</Text>
                <Text style={styles.featureDescription}>
                  Opplev glede hver 10. bilde du rydder!
                </Text>
              </View>
            </View>

            <View style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="happy" size={24} color="#4ECDC4" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Søtt Troll-følgesvenn</Text>
                <Text style={styles.featureDescription}>
                  Et koselig norsk troll heier på deg!
                </Text>
              </View>
            </View>
          </View>

          {/* CTA Button */}
          <Pressable
            onPress={handleGetStarted}
            style={styles.button}
          >
            <Text style={styles.buttonText}>Kom i Gang</Text>
          </Pressable>

          <Text style={styles.disclaimer}>
            Ved å fortsette godtar du å gi tilgang til fotobiblioteket
          </Text>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
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
    marginBottom: 32,
  },
  trollAvatarContainer: {
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  title: {
    color: "#2C5F7C",
    fontSize: 40,
    fontWeight: "bold",
    marginBottom: 16,
    textShadowColor: "rgba(255, 255, 255, 0.5)",
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  subtitle: {
    color: "#2C5F7C",
    fontSize: 18,
    opacity: 0.9,
    textAlign: "center",
    fontWeight: "500",
  },
  features: {
    gap: 12,
    marginBottom: 20,
  },
  featureCard: {
    backgroundColor: "rgba(255, 255, 255, 0.85)",
    borderRadius: 16,
    padding: 20,
    flexDirection: "row",
    borderWidth: 2,
    borderColor: "rgba(44, 95, 124, 0.1)",
    shadowColor: "#2C5F7C",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  featureIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "rgba(44, 95, 124, 0.1)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    color: "#2C5F7C",
    fontSize: 17,
    fontWeight: "700",
    marginBottom: 6,
  },
  featureDescription: {
    color: "#5A8BA3",
    fontSize: 13,
    lineHeight: 18,
    fontWeight: "500",
  },
  button: {
    backgroundColor: "#2C5F7C",
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#2C5F7C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  disclaimer: {
    color: "#2C5F7C",
    fontSize: 11,
    opacity: 0.7,
    textAlign: "center",
    marginTop: 12,
  },
});
