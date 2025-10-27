import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";

interface MiniConfettiProps {
  onComplete?: () => void;
}

export const MiniConfetti: React.FC<MiniConfettiProps> = ({ onComplete }) => {
  const particles = Array.from({ length: 12 }, (_, i) => i);

  return (
    <View style={styles.container}>
      {particles.map((_, index) => (
        <Particle key={index} index={index} onComplete={index === 0 ? onComplete : undefined} />
      ))}
    </View>
  );
};

interface ParticleProps {
  index: number;
  onComplete?: () => void;
}

const Particle: React.FC<ParticleProps> = ({ index, onComplete }) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);
  const rotate = useSharedValue(0);
  const scale = useSharedValue(1);

  const colors = ["#EF4444", "#3B82F6", "#10B981", "#F59E0B", "#8B5CF6"];
  const color = colors[index % colors.length];

  useEffect(() => {
    const angle = (index / 12) * Math.PI * 2;
    const distance = 40 + Math.random() * 30;

    // Burst outward
    translateX.value = withSpring(Math.cos(angle) * distance, {
      damping: 10,
      stiffness: 100,
    });
    translateY.value = withSpring(Math.sin(angle) * distance, {
      damping: 10,
      stiffness: 100,
    });

    // Spin and fade
    rotate.value = withTiming(360 * (Math.random() > 0.5 ? 1 : -1), {
      duration: 600,
      easing: Easing.out(Easing.ease),
    });

    scale.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    });

    opacity.value = withTiming(0, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    }, () => {
      if (onComplete) {
        onComplete();
      }
    });
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { translateY: translateY.value },
      { rotate: `${rotate.value}deg` },
      { scale: scale.value },
    ],
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[
        styles.particle,
        { backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: 200,
    height: 200,
    alignItems: "center",
    justifyContent: "center",
    pointerEvents: "none",
  },
  particle: {
    position: "absolute",
    width: 8,
    height: 8,
    borderRadius: 4,
  },
});
