import React, { useEffect } from "react";
import { View, Text, StyleSheet, Modal } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
  withDelay,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { TrollAvatar } from "./TrollAvatar";

interface DailyGoalCelebrationModalProps {
  visible: boolean;
  onClose: () => void;
  goalNumber: number;
  todayTotal: number;
  spaceSaved: string;
}

export const DailyGoalCelebrationModal: React.FC<DailyGoalCelebrationModalProps> = ({
  visible,
  onClose,
  goalNumber,
  todayTotal,
  spaceSaved,
}) => {
  const scale = useSharedValue(0);
  const rotation = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

      scale.value = withSpring(1, { damping: 8 });
      rotation.value = withSequence(
        withTiming(-5, { duration: 100 }),
        withTiming(5, { duration: 100 }),
        withTiming(-5, { duration: 100 }),
        withTiming(0, { duration: 100 })
      );

      // Auto close after 3.5 seconds
      const timer = setTimeout(() => {
        scale.value = withTiming(0, { duration: 200 });
        setTimeout(onClose, 200);
      }, 3500);

      return () => clearTimeout(timer);
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` },
    ],
  }));

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="none"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {/* Extra confetti for daily goal - more than milestone! */}
        {[...Array(30)].map((_, i) => (
          <Confetti key={i} delay={i * 40} />
        ))}

        <Animated.View style={[styles.content, animatedStyle]}>
          <LinearGradient
            colors={["#FFF9C4", "#FFF59D", "#FFEB3B"]}
            style={styles.gradient}
          >
            <View style={styles.trollContainer}>
              <TrollAvatar size={120} animate={true} />
            </View>

            <View style={styles.iconContainer}>
              <Ionicons name="star" size={70} color="#FFA000" />
            </View>

            <Text style={styles.title}>Dagsmål nådd! 🎯</Text>
            <Text style={styles.subtitle}>
              {todayTotal} av {goalNumber} bilder i dag! 🔥
            </Text>

            <View style={styles.statsCard}>
              <Ionicons name="flame" size={28} color="#FF6F00" />
              <Text style={styles.spaceSaved}>{spaceSaved}</Text>
              <Text style={styles.spaceSavedLabel}>spart i dag</Text>
            </View>

            <Text style={styles.encouragement}>
              {getDailyGoalMessage(goalNumber)}
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const Confetti: React.FC<{ delay: number }> = ({ delay }) => {
  const translateY = useSharedValue(-50);
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    const randomX = (Math.random() - 0.5) * 350;
    const randomRotate = Math.random() * 900;

    translateY.value = withDelay(
      delay,
      withTiming(750, { duration: 2500 })
    );
    translateX.value = withDelay(
      delay,
      withTiming(randomX, { duration: 2500 })
    );
    rotate.value = withDelay(
      delay,
      withTiming(randomRotate, { duration: 2500 })
    );
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 1200 }),
        withTiming(0, { duration: 1300 })
      )
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: translateY.value },
      { translateX: translateX.value },
      { rotate: `${rotate.value}deg` },
    ],
    opacity: opacity.value,
  }));

  const colors = ["#FFD700", "#FFA000", "#FF6F00", "#FFEB3B", "#FFF59D", "#4CAF50", "#2196F3"];
  const color = colors[Math.floor(Math.random() * colors.length)];

  return (
    <Animated.View
      style={[
        styles.confetti,
        animatedStyle,
        {
          backgroundColor: color,
          left: `${Math.random() * 100}%`,
        },
      ]}
    />
  );
};

function getDailyGoalMessage(goal: number): string {
  const messages = [
    "Du er en helt! 🌟",
    "Fantastisk innsats i dag! 💪",
    "Trollet danser av glede! 🎉",
    "Du knuser det i dag! 🚀",
    "Perfekt! Dagsmålet er nådd! ✨",
    "Utrolig bra! Du er på topp! 🏆",
    "Så flink! Målet er i boks! 🎯",
  ];

  if (goal >= 50) {
    return "Wow! Ambisiøst mål - og du klarte det! 👑";
  } else if (goal >= 30) {
    return "Imponerende! Du er en proff! 💎";
  }

  return messages[Math.floor(Math.random() * messages.length)];
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    width: "85%",
    maxWidth: 400,
  },
  gradient: {
    borderRadius: 32,
    padding: 32,
    alignItems: "center",
  },
  trollContainer: {
    marginBottom: 16,
  },
  iconContainer: {
    width: 110,
    height: 110,
    backgroundColor: "white",
    borderRadius: 55,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#FF6F00",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  title: {
    fontSize: 34,
    fontWeight: "bold",
    color: "#E65100",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#F57C00",
    marginBottom: 24,
    textAlign: "center",
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    shadowColor: "#FF6F00",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 4,
  },
  spaceSaved: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#E65100",
    marginTop: 8,
  },
  spaceSavedLabel: {
    fontSize: 14,
    color: "#FF6F00",
    marginTop: 4,
  },
  encouragement: {
    fontSize: 16,
    color: "#E65100",
    textAlign: "center",
    fontWeight: "600",
  },
  confetti: {
    position: "absolute",
    width: 12,
    height: 12,
    borderRadius: 6,
    top: 0,
  },
});
