import React, { useEffect } from "react";
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
  withTiming,
} from "react-native-reanimated";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { TrollAvatar } from "./TrollAvatar";
import { useSubscriptionStore } from "../state/subscriptionStore";
import { restorePurchases } from "../utils/iapHandler";

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  visible,
  onClose,
  onUpgrade,
}) => {
  const scale = useSharedValue(0);
  const { deletedCount, freeDeleteLimit } = useSubscriptionStore();

  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
      scale.value = withSpring(1, { damping: 15 });
    } else {
      scale.value = 0;
    }
  }, [visible]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onUpgrade();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    scale.value = withTiming(0, { duration: 200 });
    setTimeout(onClose, 200);
  };

  const handleRestore = async () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const success = await restorePurchases();
    if (success) {
      // Close paywall after successful restore
      handleClose();
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.content, animatedStyle]}>
          <LinearGradient
            colors={["#E8F4F8", "#B8D4E0"]}
            style={styles.gradient}
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollContent}
            >
              {/* Close button */}
              <Pressable onPress={handleClose} style={styles.closeButton}>
                <Ionicons name="close" size={28} color="#2C5F7C" />
              </Pressable>

              {/* Troll Avatar */}
              <View style={styles.trollContainer}>
                <TrollAvatar size={100} animate={true} />
              </View>

              {/* Header */}
              <Text style={styles.title}>Oppgrader til Fjærn Pro</Text>
              <Text style={styles.subtitle}>
                Du har ryddet {deletedCount} av {freeDeleteLimit} gratis bilder! 🎉
              </Text>

              {/* Features */}
              <View style={styles.featuresContainer}>
                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="infinite" size={24} color="#2C5F7C" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Ubegrenset Rydding</Text>
                    <Text style={styles.featureDescription}>
                      Rydd så mange bilder du vil, ingen grenser!
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="trophy" size={24} color="#FFD700" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Alle Milepæler</Text>
                    <Text style={styles.featureDescription}>
                      Få feiring for hver 10., 50., 100. bilde og mer!
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="flash" size={24} color="#FF6B35" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Prioritert Support</Text>
                    <Text style={styles.featureDescription}>
                      Få hjelp raskere med premium support
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="heart" size={24} color="#E07B9F" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Støtt Utvikling</Text>
                    <Text style={styles.featureDescription}>
                      Hjelp oss å lage enda bedre funksjoner!
                    </Text>
                  </View>
                </View>
              </View>

              {/* Pricing */}
              <View style={styles.pricingContainer}>
                <View style={styles.pricingBadge}>
                  <Text style={styles.pricingBadgeText}>BEST VERDI</Text>
                </View>
                <Text style={styles.price}>99 kr / måned</Text>
                <Text style={styles.priceDescription}>
                  Kanseller når som helst. Ingen binding.
                </Text>
              </View>

              {/* CTA Button */}
              <Pressable onPress={handleUpgrade} style={styles.upgradeButton}>
                <LinearGradient
                  colors={["#2C5F7C", "#4A8BA8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.upgradeGradient}
                >
                  <Text style={styles.upgradeButtonText}>Oppgrader til Pro</Text>
                  <Ionicons name="arrow-forward" size={20} color="white" />
                </LinearGradient>
              </Pressable>

              {/* Restore Purchase */}
              <Pressable onPress={handleRestore} style={styles.restoreButton}>
                <Text style={styles.restoreText}>Gjenopprett Kjøp</Text>
              </Pressable>

              {/* Continue browsing button */}
              <Pressable onPress={handleClose} style={styles.continueButton}>
                <Text style={styles.continueText}>Fortsett å Bla (Kun Behold)</Text>
              </Pressable>

              {/* Terms */}
              <Text style={styles.terms}>
                Betalingen belastes din App Store-konto. Abonnementet fornyes automatisk med mindre det kanselleres minst 24 timer før periodens slutt.
              </Text>
            </ScrollView>
          </LinearGradient>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  content: {
    width: "100%",
    maxWidth: 450,
    maxHeight: "90%",
    borderRadius: 24,
    overflow: "hidden",
  },
  gradient: {
    flex: 1,
  },
  scrollContent: {
    padding: 24,
  },
  closeButton: {
    alignSelf: "flex-end",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 20,
    marginBottom: 8,
  },
  trollContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#2C5F7C",
    textAlign: "center",
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 16,
    color: "#5A8BA3",
    textAlign: "center",
    marginBottom: 32,
    lineHeight: 22,
  },
  featuresContainer: {
    gap: 16,
    marginBottom: 32,
  },
  featureItem: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: "rgba(44, 95, 124, 0.1)",
    borderRadius: 24,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  featureTextContainer: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#2C5F7C",
    marginBottom: 4,
  },
  featureDescription: {
    fontSize: 13,
    color: "#5A8BA3",
    lineHeight: 18,
  },
  pricingContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 24,
    alignItems: "center",
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#2C5F7C",
  },
  pricingBadge: {
    backgroundColor: "#FF6B35",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 100,
    marginBottom: 12,
  },
  pricingBadgeText: {
    color: "white",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },
  price: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#2C5F7C",
    marginBottom: 8,
  },
  priceDescription: {
    fontSize: 13,
    color: "#5A8BA3",
  },
  upgradeButton: {
    marginBottom: 16,
    shadowColor: "#2C5F7C",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  upgradeGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 18,
    borderRadius: 16,
    gap: 8,
  },
  upgradeButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  restoreText: {
    color: "#2C5F7C",
    fontSize: 14,
    fontWeight: "600",
  },
  continueButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginBottom: 16,
  },
  continueText: {
    color: "#6B7280",
    fontSize: 13,
    fontWeight: "500",
  },
  terms: {
    fontSize: 11,
    color: "#5A8BA3",
    textAlign: "center",
    lineHeight: 16,
    opacity: 0.7,
  },
});
