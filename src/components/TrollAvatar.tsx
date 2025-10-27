import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Ellipse } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
  withSpring,
} from "react-native-reanimated";

interface TrollAvatarProps {
  size?: number;
  animate?: boolean;
}

export const TrollAvatar: React.FC<TrollAvatarProps> = ({
  size = 80,
  animate = false
}) => {
  const peek = useSharedValue(0);

  React.useEffect(() => {
    if (animate) {
      peek.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withSpring(0, { damping: 10 })
        ),
        -1,
        false
      );
    }
  }, [animate]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: peek.value * -10 },
      { scale: 1 + peek.value * 0.1 }
    ],
  }));

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Body - cute round shape */}
        <Ellipse
          cx="50"
          cy="60"
          rx="32"
          ry="35"
          fill="#8B9DC3"
        />

        {/* Belly patch - lighter color */}
        <Ellipse
          cx="50"
          cy="68"
          rx="20"
          ry="22"
          fill="#A8B8D8"
        />

        {/* Head */}
        <Circle
          cx="50"
          cy="35"
          r="28"
          fill="#8B9DC3"
        />

        {/* Left ear */}
        <Circle
          cx="28"
          cy="32"
          r="10"
          fill="#7A8AB0"
        />

        {/* Right ear */}
        <Circle
          cx="72"
          cy="32"
          r="10"
          fill="#7A8AB0"
        />

        {/* Hair tuft - wild nordic troll hair */}
        <Path
          d="M 45 12 Q 42 5, 40 8 Q 38 5, 36 9 Q 34 4, 32 10"
          stroke="#556B8E"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 50 10 Q 48 3, 46 6 Q 44 2, 42 8"
          stroke="#556B8E"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 55 12 Q 58 5, 60 8 Q 62 5, 64 9 Q 66 4, 68 10"
          stroke="#556B8E"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Eyes - big cute eyes */}
        <Circle cx="40" cy="32" r="6" fill="white" />
        <Circle cx="60" cy="32" r="6" fill="white" />
        <Circle cx="41" cy="33" r="4" fill="#2D3748" />
        <Circle cx="61" cy="33" r="4" fill="#2D3748" />
        <Circle cx="42" cy="31" r="2" fill="white" />
        <Circle cx="62" cy="31" r="2" fill="white" />

        {/* Nose - small cute button nose */}
        <Ellipse
          cx="50"
          cy="42"
          rx="4"
          ry="5"
          fill="#7A8AB0"
        />

        {/* Smile */}
        <Path
          d="M 40 48 Q 50 54, 60 48"
          stroke="#556B8E"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Rosy cheeks */}
        <Circle cx="32" cy="42" r="5" fill="#E07B9F" opacity="0.5" />
        <Circle cx="68" cy="42" r="5" fill="#E07B9F" opacity="0.5" />

        {/* Arms */}
        <Ellipse
          cx="20"
          cy="60"
          rx="8"
          ry="20"
          fill="#7A8AB0"
          transform="rotate(-20 20 60)"
        />
        <Ellipse
          cx="80"
          cy="60"
          rx="8"
          ry="20"
          fill="#7A8AB0"
          transform="rotate(20 80 60)"
        />

        {/* Feet */}
        <Ellipse
          cx="40"
          cy="92"
          rx="10"
          ry="6"
          fill="#7A8AB0"
        />
        <Ellipse
          cx="60"
          cy="92"
          rx="10"
          ry="6"
          fill="#7A8AB0"
        />
      </Svg>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
  },
});
