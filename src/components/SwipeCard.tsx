import React, { useCallback, useEffect } from "react";
import { View, Text, Dimensions, StyleSheet } from "react-native";
import { Image } from "expo-image";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withTiming,
  interpolate,
  Extrapolation,
  runOnJS,
} from "react-native-reanimated";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { Photo } from "../types/photo";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");
const SWIPE_THRESHOLD = SCREEN_WIDTH * 0.25;
const ROTATION_ANGLE = 25;

interface SwipeCardProps {
  photo: Photo;
  onSwipeLeft: () => void;
  onSwipeRight: () => void;
  isTop: boolean;
  index: number;
}

export const SwipeCard: React.FC<SwipeCardProps> = ({
  photo,
  onSwipeLeft,
  onSwipeRight,
  isTop,
  index,
}) => {
  const translateX = useSharedValue(0);
  const translateY = useSharedValue(0);
  const scale = useSharedValue(isTop ? 1 : 0.95 - index * 0.02);
  const cardOpacity = useSharedValue(isTop ? 1 : 0.7 - index * 0.2);
  const isSwiping = useSharedValue(false);
  const hasTriggeredHaptic = useSharedValue(false);

  // Animate cards into position smoothly when they change
  useEffect(() => {
    scale.value = withSpring(isTop ? 1 : 0.95 - index * 0.02, {
      damping: 20,
      stiffness: 200,
    });
    cardOpacity.value = withTiming(isTop ? 1 : 0.7 - index * 0.2, {
      duration: 150,
    });
  }, [isTop, index]);

  const triggerHaptic = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  }, []);

  const panGesture = Gesture.Pan()
    .onStart(() => {
      isSwiping.value = true;
      hasTriggeredHaptic.value = false;
    })
    .onUpdate((event) => {
      if (!isTop) return;

      translateX.value = event.translationX;
      translateY.value = event.translationY * 0.5;

      // Haptic feedback at threshold (only once)
      if (!hasTriggeredHaptic.value && Math.abs(event.translationX) > SWIPE_THRESHOLD) {
        hasTriggeredHaptic.value = true;
        runOnJS(triggerHaptic)();
      }
    })
    .onEnd((event) => {
      if (!isTop) return;

      isSwiping.value = false;

      if (event.translationX > SWIPE_THRESHOLD) {
        // Swipe right - Keep (faster animation)
        translateX.value = withTiming(SCREEN_WIDTH * 1.3, { duration: 200 }, () => {
          runOnJS(onSwipeRight)();
        });
        runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
      } else if (event.translationX < -SWIPE_THRESHOLD) {
        // Swipe left - Delete (faster animation)
        translateX.value = withTiming(-SCREEN_WIDTH * 1.3, { duration: 200 }, () => {
          runOnJS(onSwipeLeft)();
        });
        runOnJS(Haptics.notificationAsync)(Haptics.NotificationFeedbackType.Success);
      } else {
        // Return to center (snappy spring)
        translateX.value = withSpring(0, { damping: 15, stiffness: 150 });
        translateY.value = withSpring(0, { damping: 15, stiffness: 150 });
      }
    });

  const animatedCardStyle = useAnimatedStyle(() => {
    const rotation = interpolate(
      translateX.value,
      [-SCREEN_WIDTH, 0, SCREEN_WIDTH],
      [-ROTATION_ANGLE, 0, ROTATION_ANGLE],
      Extrapolation.CLAMP
    );

    const opacity = interpolate(
      Math.abs(translateX.value),
      [0, SWIPE_THRESHOLD * 1.5],
      [1, 0],
      Extrapolation.CLAMP
    );

    // Dynamic card position for stack effect
    const cardTranslateY = isTop ? 0 : -index * 10;

    return {
      transform: [
        { translateX: isTop ? translateX.value : 0 },
        { translateY: isTop ? translateY.value : cardTranslateY },
        { rotate: `${isTop ? rotation : 0}deg` },
        { scale: scale.value },
      ],
      opacity: isTop ? opacity : cardOpacity.value,
      zIndex: isTop ? 1000 : 1000 - index,
    };
  });

  const animatedDeleteOverlay = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [-SWIPE_THRESHOLD * 1.5, -SWIPE_THRESHOLD / 2, 0],
      [1, 0.5, 0],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  const animatedKeepOverlay = useAnimatedStyle(() => {
    const opacity = interpolate(
      translateX.value,
      [0, SWIPE_THRESHOLD / 2, SWIPE_THRESHOLD * 1.5],
      [0, 0.5, 1],
      Extrapolation.CLAMP
    );

    return { opacity };
  });

  return (
    <Animated.View style={[styles.card, animatedCardStyle]}>
      <GestureDetector gesture={panGesture}>
        <View style={styles.cardInner}>
          {/* Photo */}
          <Image
            source={{ uri: photo.uri }}
            style={styles.image}
            contentFit="cover"
            transition={200}
          />

          {/* Delete Overlay (Left) */}
          <Animated.View style={[styles.overlay, animatedDeleteOverlay]}>
            <LinearGradient
              colors={["rgba(239, 68, 68, 0.9)", "rgba(239, 68, 68, 0.7)"]}
              style={styles.gradientOverlay}
            >
              <View style={styles.overlayContent}>
                <Ionicons name="trash" size={60} color="white" />
                <Text style={styles.overlayText}>Slett</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Keep Overlay (Right) */}
          <Animated.View style={[styles.overlay, animatedKeepOverlay]}>
            <LinearGradient
              colors={["rgba(16, 185, 129, 0.9)", "rgba(16, 185, 129, 0.7)"]}
              style={styles.gradientOverlay}
            >
              <View style={styles.overlayContent}>
                <Ionicons name="heart" size={60} color="white" />
                <Text style={styles.overlayText}>Behold</Text>
              </View>
            </LinearGradient>
          </Animated.View>

          {/* Bottom Info */}
          <LinearGradient
            colors={["transparent", "rgba(0, 0, 0, 0.7)"]}
            style={styles.bottomGradient}
          >
            <View style={styles.infoContainer}>
              <Text style={styles.filename} numberOfLines={1}>
                {photo.filename}
              </Text>
              <View style={styles.metaContainer}>
                <View style={styles.metaItem}>
                  <Ionicons name="calendar-outline" size={14} color="rgba(255,255,255,0.7)" />
                  <Text style={styles.metaText}>
                    {new Date(photo.creationTime).toLocaleDateString()}
                  </Text>
                </View>
                {photo.mediaType === "video" && (
                  <View style={styles.metaItem}>
                    <Ionicons name="videocam" size={14} color="rgba(255,255,255,0.7)" />
                    <Text style={styles.metaText}>Video</Text>
                  </View>
                )}
              </View>
            </View>
          </LinearGradient>
        </View>
      </GestureDetector>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  card: {
    position: "absolute",
    width: SCREEN_WIDTH - 60,
    height: SCREEN_HEIGHT * 0.6,
    alignSelf: "center",
  },
  cardInner: {
    flex: 1,
    backgroundColor: "white",
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  gradientOverlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlayContent: {
    alignItems: "center",
    gap: 12,
  },
  overlayText: {
    color: "white",
    fontSize: 32,
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  bottomGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  infoContainer: {
    gap: 8,
  },
  filename: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  metaContainer: {
    flexDirection: "row",
    gap: 16,
  },
  metaItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  metaText: {
    color: "rgba(255,255,255,0.7)",
    fontSize: 13,
  },
});
