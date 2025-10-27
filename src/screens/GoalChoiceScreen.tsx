import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet, Modal } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { TrollAvatar } from "../components/TrollAvatar";
import { DailyGoalSelector } from "../components/DailyGoalSelector";

export function GoalChoiceScreen(props: any) {
  const [showGoalSelector, setShowGoalSelector] = useState(false);

  const handleStartNow = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    props.navigation.replace("Swipe");
  };

  const handleSetGoal = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setShowGoalSelector(true);
  };

  const handleGoalSelected = () => {
    setShowGoalSelector(false);
    // Navigate to swipe after goal is set
    props.navigation.replace("Swipe");
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
              <TrollAvatar size={75} animate={true} />
            </View>
            <Text style={styles.title}>Klar til å Rydde?</Text>
            <Text style={styles.subtitle}>
              Vil du sette et dagsmål først, eller starte med en gang?
            </Text>
          </View>

          {/* Choice Cards */}
          <View style={styles.choices}>
            {/* Set Daily Goal */}
            <Pressable onPress={handleSetGoal} style={styles.choiceCard}>
              <LinearGradient
                colors={["#FFFFFF", "#FEE2E2"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="flag" size={32} color="#DC2626" />
                </View>
                <Text style={styles.choiceTitle}>Sett Dagsmål</Text>
                <Text style={styles.choiceDescription}>
                  Velg hvor mange bilder du vil rydde i dag og få ekstra confetti når du når målet! 🎉
                </Text>
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>Anbefalt</Text>
                </View>
              </LinearGradient>
            </Pressable>

            {/* Start Now */}
            <Pressable onPress={handleStartNow} style={styles.choiceCard}>
              <LinearGradient
                colors={["#DBEAFE", "#FFFFFF"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.cardGradient}
              >
                <View style={styles.iconContainer}>
                  <Ionicons name="play-circle" size={32} color="#1E40AF" />
                </View>
                <Text style={styles.choiceTitle}>Start Nå</Text>
                <Text style={styles.choiceDescription}>
                  Hopp rett inn i ryddingen uten mål. Du kan sette et mål senere!
                </Text>
                <View style={styles.arrowContainer}>
                  <Ionicons name="arrow-forward" size={18} color="#1E40AF" />
                </View>
              </LinearGradient>
            </Pressable>
          </View>

          <Text style={styles.tip}>
            💡 Tips: Et dagsmål hjelper deg holde motivasjonen!
          </Text>
        </View>
      </LinearGradient>

      {/* Daily Goal Selector Modal */}
      <Modal
        visible={showGoalSelector}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowGoalSelector(false)}
      >
        <Pressable style={styles.modalOverlay} onPress={() => setShowGoalSelector(false)}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <DailyGoalSelector onClose={handleGoalSelected} />
          </Pressable>
        </Pressable>
      </Modal>
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
    paddingTop: 10,
    paddingBottom: 20,
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  hero: {
    alignItems: "center",
    marginBottom: 16,
  },
  trollAvatarContainer: {
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  title: {
    color: "#1F2937",
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 6,
    textAlign: "center",
  },
  subtitle: {
    color: "#4B5563",
    fontSize: 14,
    textAlign: "center",
    lineHeight: 20,
    paddingHorizontal: 12,
  },
  choices: {
    gap: 12,
  },
  choiceCard: {
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  cardGradient: {
    borderRadius: 20,
    padding: 18,
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.7)",
    minHeight: 180,
    justifyContent: "center",
  },
  iconContainer: {
    width: 64,
    height: 64,
    backgroundColor: "white",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 4,
  },
  choiceTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#1F2937",
    marginBottom: 6,
    textAlign: "center",
  },
  choiceDescription: {
    fontSize: 13,
    color: "#6B7280",
    textAlign: "center",
    lineHeight: 18,
    marginBottom: 10,
    paddingHorizontal: 6,
  },
  badge: {
    backgroundColor: "#DC2626",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 100,
  },
  badgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "bold",
  },
  arrowContainer: {
    backgroundColor: "rgba(30, 64, 175, 0.1)",
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  tip: {
    fontSize: 12,
    color: "#6B7280",
    textAlign: "center",
    fontStyle: "italic",
    marginTop: 12,
    paddingHorizontal: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
