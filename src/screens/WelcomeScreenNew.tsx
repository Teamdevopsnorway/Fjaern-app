import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, SafeAreaView, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { TrollAvatar } from "../components/TrollAvatar";
import { DailyGoalSelector } from "../components/DailyGoalSelector";

export function WelcomeScreenNew(props: any) {
  const [showGoalSelector, setShowGoalSelector] = useState(false);

  const handleGetStarted = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    props.navigation.replace("Swipe");
  };

  const handleOpenGoalSelector = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowGoalSelector(true);
  };

  const handleCloseGoalSelector = () => {
    setShowGoalSelector(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={["#E8F4F8", "#B8D4E0", "#8FB5C7"]}
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

            <Pressable onPress={handleOpenGoalSelector} style={styles.featureCard}>
              <View style={styles.featureIconContainer}>
                <Ionicons name="flag" size={24} color="#FFA000" />
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>Sett Dagsmål</Text>
                <Text style={styles.featureDescription}>
                  Velg et daglig mål og få masse confetti! 🎉
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#5A8FA8" />
            </Pressable>
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

      {/* Daily Goal Selector Modal */}
      <Modal
        visible={showGoalSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={handleCloseGoalSelector}
      >
        <Pressable style={styles.modalOverlay} onPress={handleCloseGoalSelector}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <DailyGoalSelector onClose={handleCloseGoalSelector} />
          </Pressable>
        </Pressable>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#E8F4F8",
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
