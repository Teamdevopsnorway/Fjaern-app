import React from "react";
import { View, StyleSheet } from "react-native";
import Svg, { Path, Circle, Ellipse, G } from "react-native-svg";
import Animated, {
  useAnimatedStyle,
  useAnimatedProps,
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
  const wave = useSharedValue(0);

  React.useEffect(() => {
    if (animate) {
      // Body bounce animation
      peek.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 800 }),
          withSpring(0, { damping: 10 })
        ),
        -1,
        false
      );

      // Wave animation for right arm
      wave.value = withRepeat(
        withSequence(
          withTiming(1, { duration: 500 }),
          withTiming(-1, { duration: 500 }),
          withTiming(0, { duration: 300 })
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

  const waveProps = useAnimatedProps(() => ({
    transform: `rotate(${wave.value * 25}, 78, 55)`
  }));

  const AnimatedG = Animated.createAnimatedComponent(G);

  return (
    <Animated.View style={[styles.container, animatedStyle]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        {/* Body - round troll body */}
        <Ellipse
          cx="50"
          cy="65"
          rx="30"
          ry="32"
          fill="#7B9DC8"
        />

        {/* Belly - lighter */}
        <Ellipse
          cx="50"
          cy="72"
          rx="18"
          ry="20"
          fill="#B0C4DE"
        />

        {/* Head - big round head */}
        <Circle
          cx="50"
          cy="38"
          r="26"
          fill="#7B9DC8"
        />

        {/* Big ears */}
        <Ellipse
          cx="24"
          cy="38"
          rx="8"
          ry="12"
          fill="#7B9DC8"
        />
        <Ellipse
          cx="76"
          cy="38"
          rx="8"
          ry="12"
          fill="#7B9DC8"
        />

        {/* Inner ears - pink */}
        <Ellipse
          cx="24"
          cy="38"
          rx="4"
          ry="6"
          fill="#D4A5A5"
        />
        <Ellipse
          cx="76"
          cy="38"
          rx="4"
          ry="6"
          fill="#D4A5A5"
        />

        {/* Wild troll hair - lots of messy hair strands */}
        <Path
          d="M 30 18 Q 28 8, 26 12 Q 24 6, 22 14 Q 20 8, 18 16"
          stroke="#3D3D3D"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 36 15 Q 34 5, 32 10 Q 30 3, 28 12"
          stroke="#3D3D3D"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 42 13 Q 40 3, 38 8 Q 36 1, 34 10"
          stroke="#3D3D3D"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 48 12 Q 46 2, 44 7 Q 42 0, 40 9"
          stroke="#3D3D3D"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 54 12 Q 56 2, 58 7 Q 60 0, 62 9"
          stroke="#3D3D3D"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 60 13 Q 62 3, 64 8 Q 66 1, 68 10"
          stroke="#3D3D3D"
          strokeWidth="4.5"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 66 15 Q 68 5, 70 10 Q 72 3, 74 12"
          stroke="#3D3D3D"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 72 18 Q 74 8, 76 12 Q 78 6, 80 14 Q 82 8, 84 16"
          stroke="#3D3D3D"
          strokeWidth="4"
          fill="none"
          strokeLinecap="round"
        />

        {/* Hair on sides of head */}
        <Path
          d="M 22 30 Q 18 32, 16 35 Q 14 38, 15 42"
          stroke="#3D3D3D"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />
        <Path
          d="M 78 30 Q 82 32, 84 35 Q 86 38, 85 42"
          stroke="#3D3D3D"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
        />

        {/* Eyes - big expressive eyes */}
        <Circle cx="40" cy="36" r="7" fill="white" />
        <Circle cx="60" cy="36" r="7" fill="white" />

        {/* Pupils - looking friendly */}
        <Circle cx="41" cy="37" r="4.5" fill="#2D2D2D" />
        <Circle cx="61" cy="37" r="4.5" fill="#2D2D2D" />

        {/* Eye sparkles */}
        <Circle cx="43" cy="34" r="2" fill="white" />
        <Circle cx="63" cy="34" r="2" fill="white" />

        {/* BIG TROLL NOSE - most important feature! */}
        <Ellipse
          cx="50"
          cy="47"
          rx="8"
          ry="10"
          fill="#5A8AB8"
        />

        {/* Nostrils */}
        <Ellipse cx="46" cy="50" rx="2" ry="3" fill="#4A4035" />
        <Ellipse cx="54" cy="50" rx="2" ry="3" fill="#4A4035" />

        {/* Big happy smile with visible teeth */}
        <Path
          d="M 38 56 Q 50 64, 62 56"
          stroke="#4A4035"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />

        {/* Teeth - troll teeth */}
        <Path
          d="M 44 60 L 44 58"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M 50 62 L 50 60"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />
        <Path
          d="M 56 60 L 56 58"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
        />

        {/* Rosy cheeks */}
        <Circle cx="32" cy="48" r="5" fill="#D4A5A5" opacity="0.7" />
        <Circle cx="68" cy="48" r="5" fill="#D4A5A5" opacity="0.7" />

        {/* Body hair/fur texture */}
        <Path
          d="M 30 60 Q 28 65, 26 70"
          stroke="#5A8AB8"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
        <Path
          d="M 35 62 Q 33 68, 31 74"
          stroke="#5A8AB8"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
        <Path
          d="M 65 62 Q 67 68, 69 74"
          stroke="#5A8AB8"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />
        <Path
          d="M 70 60 Q 72 65, 74 70"
          stroke="#5A8AB8"
          strokeWidth="2"
          fill="none"
          opacity="0.4"
        />

        {/* Left arm - static */}
        <Ellipse
          cx="24"
          cy="68"
          rx="7"
          ry="16"
          fill="#7B9DC8"
          transform="rotate(-20 24 68)"
        />
        <Circle cx="20" cy="82" r="5" fill="#5A8AB8" />

        {/* Right arm and hand - animated waving */}
        <AnimatedG
          origin="78, 55"
          animatedProps={animate ? waveProps : undefined}
        >
          <Ellipse
            cx="76"
            cy="68"
            rx="7"
            ry="16"
            fill="#7B9DC8"
            transform="rotate(20 76 68)"
          />
          <Circle cx="80" cy="82" r="5" fill="#5A8AB8" />
        </AnimatedG>

        {/* Feet - big troll feet */}
        <Ellipse
          cx="40"
          cy="94"
          rx="11"
          ry="6"
          fill="#5A8AB8"
        />
        <Ellipse
          cx="60"
          cy="94"
          rx="11"
          ry="6"
          fill="#5A8AB8"
        />

        {/* Toes */}
        <Circle cx="36" cy="94" r="2" fill="#4A7AA3" />
        <Circle cx="44" cy="94" r="2" fill="#4A7AA3" />
        <Circle cx="56" cy="94" r="2" fill="#4A7AA3" />
        <Circle cx="64" cy="94" r="2" fill="#4A7AA3" />
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
