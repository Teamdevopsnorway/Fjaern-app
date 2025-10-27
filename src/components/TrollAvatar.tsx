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
          cy="62"
          rx="34"
          ry="36"
          fill="#7B9DC8"
        />

        {/* Belly patch - lighter color with Norwegian touch */}
        <Ellipse
          cx="50"
          cy="70"
          rx="22"
          ry="24"
          fill="#B0C4DE"
        />

        {/* Head - rounder and cuter */}
        <Circle
          cx="50"
          cy="34"
          r="30"
          fill="#7B9DC8"
        />

        {/* Fluffy ears - more prominent */}
        <Circle
          cx="26"
          cy="30"
          r="12"
          fill="#6A8BB5"
        />
        <Circle
          cx="74"
          cy="30"
          r="12"
          fill="#6A8BB5"
        />

        {/* Wild Nordic troll hair - more chaotic and fun */}
        <Path
          d="M 38 10 Q 35 2, 33 6 Q 31 1, 29 7 Q 27 0, 25 8"
          stroke="#4A6B8A"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 45 8 Q 43 0, 41 5 Q 39 -2, 37 6"
          stroke="#4A6B8A"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 50 6 Q 48 -1, 46 4 Q 44 -3, 42 5"
          stroke="#4A6B8A"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 55 8 Q 57 0, 59 5 Q 61 -2, 63 6"
          stroke="#4A6B8A"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 62 10 Q 65 2, 67 6 Q 69 1, 71 7 Q 73 0, 75 8"
          stroke="#4A6B8A"
          strokeWidth="3.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Eyes - MUCH bigger and cuter! */}
        <Circle cx="38" cy="32" r="8" fill="white" />
        <Circle cx="62" cy="32" r="8" fill="white" />

        {/* Pupils - bigger and more expressive */}
        <Circle cx="39" cy="33" r="5" fill="#2D3748" />
        <Circle cx="63" cy="33" r="5" fill="#2D3748" />

        {/* Sparkles in eyes */}
        <Circle cx="41" cy="30" r="2.5" fill="white" />
        <Circle cx="65" cy="30" r="2.5" fill="white" />
        <Circle cx="37" cy="35" r="1.5" fill="white" opacity="0.8" />
        <Circle cx="61" cy="35" r="1.5" fill="white" opacity="0.8" />

        {/* Cute button nose - more prominent */}
        <Ellipse
          cx="50"
          cy="44"
          rx="5"
          ry="6"
          fill="#5A7A9A"
        />

        {/* Big happy smile */}
        <Path
          d="M 37 50 Q 50 58, 63 50"
          stroke="#4A6B8A"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Extra rosy cheeks - more visible */}
        <Circle cx="30" cy="44" r="6" fill="#FF9AA2" opacity="0.6" />
        <Circle cx="70" cy="44" r="6" fill="#FF9AA2" opacity="0.6" />

        {/* Small freckles/dots for Norwegian charm */}
        <Circle cx="35" cy="39" r="1" fill="#5A7A9A" opacity="0.4" />
        <Circle cx="65" cy="39" r="1" fill="#5A7A9A" opacity="0.4" />

        {/* Arms - chubby and cute */}
        <Ellipse
          cx="18"
          cy="62"
          rx="9"
          ry="22"
          fill="#6A8BB5"
          transform="rotate(-25 18 62)"
        />
        <Ellipse
          cx="82"
          cy="62"
          rx="9"
          ry="22"
          fill="#6A8BB5"
          transform="rotate(25 82 62)"
        />

        {/* Hands - small rounded */}
        <Circle cx="14" cy="78" r="5" fill="#5A7A9A" />
        <Circle cx="86" cy="78" r="5" fill="#5A7A9A" />

        {/* Feet - bigger and cuter */}
        <Ellipse
          cx="38"
          cy="94"
          rx="12"
          ry="7"
          fill="#6A8BB5"
        />
        <Ellipse
          cx="62"
          cy="94"
          rx="12"
          ry="7"
          fill="#6A8BB5"
        />

        {/* Toes for extra cuteness */}
        <Circle cx="35" cy="94" r="2" fill="#5A7A9A" />
        <Circle cx="41" cy="94" r="2" fill="#5A7A9A" />
        <Circle cx="59" cy="94" r="2" fill="#5A7A9A" />
        <Circle cx="65" cy="94" r="2" fill="#5A7A9A" />
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
