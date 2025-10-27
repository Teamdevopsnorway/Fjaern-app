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

interface CelebrationModalProps {
  visible: boolean;
  onClose: () => void;
  milestoneNumber: number;
  spaceSaved: string;
}

export const CelebrationModal: React.FC<CelebrationModalProps> = ({
  visible,
  onClose,
  milestoneNumber,
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

      // Auto close after 3 seconds
      const timer = setTimeout(() => {
        scale.value = withTiming(0, { duration: 200 });
        setTimeout(onClose, 200);
      }, 3000);

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
        {/* Confetti pieces */}
        {[...Array(20)].map((_, i) => (
          <Confetti key={i} delay={i * 50} />
        ))}

        <Animated.View style={[styles.content, animatedStyle]}>
          <LinearGradient
            colors={["#E8F5E9", "#C8E6C9"]}
            style={styles.gradient}
          >
            <View style={styles.trollContainer}>
              <TrollAvatar size={100} animate={true} />
            </View>

            <View style={styles.iconContainer}>
              <Ionicons name="trophy" size={60} color="#4CAF50" />
            </View>

            <Text style={styles.title}>Gratulerer!</Text>
            <Text style={styles.milestone}>{milestoneNumber} Bilder Ryddet! 🎉</Text>

            <View style={styles.statsCard}>
              <Ionicons name="cloud-upload" size={24} color="#4CAF50" />
              <Text style={styles.spaceSaved}>{spaceSaved}</Text>
              <Text style={styles.spaceSavedLabel}>plass spart</Text>
            </View>

            <Text style={styles.encouragement}>
              {getEncouragementMessage(milestoneNumber)}
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
    const randomX = (Math.random() - 0.5) * 300;
    const randomRotate = Math.random() * 720;

    translateY.value = withDelay(
      delay,
      withTiming(700, { duration: 2000 })
    );
    translateX.value = withDelay(
      delay,
      withTiming(randomX, { duration: 2000 })
    );
    rotate.value = withDelay(
      delay,
      withTiming(randomRotate, { duration: 2000 })
    );
    opacity.value = withDelay(
      delay,
      withSequence(
        withTiming(1, { duration: 1000 }),
        withTiming(0, { duration: 1000 })
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

  const colors = ["#FF6B6B", "#4ECDC4", "#FFE66D", "#95E1D3", "#F38181"];
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

function getEncouragementMessage(milestone: number): string {
  const messages = [
    "Du gjør det fantastisk! 🌟",
    "Trollet er stolt av deg! 💪",
    "Fortsett det gode arbeidet! ✨",
    "Du er en ryddemeister! 🏆",
    "Så flink du er! 🎯",
    "Biblioteket ditt blir så pent! 🌈",
    "Utrolig bra jobba! 🎊",
  ];

  if (milestone >= 100) {
    return "Du er en legende! 🌟👑";
  } else if (milestone >= 50) {
    return "Wow, du er ustoppelig! 🚀";
  }

  return messages[Math.floor(Math.random() * messages.length)];
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
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
    marginBottom: 20,
  },
  iconContainer: {
    width: 100,
    height: 100,
    backgroundColor: "white",
    borderRadius: 50,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 5,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2D5016",
    marginBottom: 8,
  },
  milestone: {
    fontSize: 20,
    fontWeight: "600",
    color: "#4CAF50",
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: "white",
    borderRadius: 16,
    padding: 20,
    alignItems: "center",
    width: "100%",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  spaceSaved: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2D5016",
    marginTop: 8,
  },
  spaceSavedLabel: {
    fontSize: 14,
    color: "#66BB6A",
    marginTop: 4,
  },
  encouragement: {
    fontSize: 16,
    color: "#2D5016",
    textAlign: "center",
    fontWeight: "500",
  },
  confetti: {
    position: "absolute",
    width: 10,
    height: 10,
    borderRadius: 5,
    top: 0,
  },
});
