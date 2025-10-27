import React, { useEffect } from "react";
import { View, Text, StyleSheet, Modal, Pressable, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import { TrollAvatar } from "./TrollAvatar";

interface PaywallModalProps {
  visible: boolean;
  onClose: () => void;
  onUpgrade: () => void;
  deletedToday: number;
  limit: number;
}

export const PaywallModal: React.FC<PaywallModalProps> = ({
  visible,
  onClose,
  onUpgrade,
  deletedToday,
  limit,
}) => {
  useEffect(() => {
    if (visible) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    }
  }, [visible]);

  const handleUpgrade = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
    onUpgrade();
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
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
              <Text style={styles.title}>Du har nådd dagens grense! 🎉</Text>
              <Text style={styles.subtitle}>
                Gratulerer! Du har fjernet {deletedToday} bilder i dag.
              </Text>

              {/* Stats Card */}
              <View style={styles.statsCard}>
                <View style={styles.statRow}>
                  <Text style={styles.statLabel}>I dag:</Text>
                  <Text style={styles.statValue}>{deletedToday} / {limit} bilder</Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBarBg}>
                    <View
                      style={[
                        styles.progressBarFill,
                        { width: `${(deletedToday / limit) * 100}%` }
                      ]}
                    />
                  </View>
                </View>
              </View>

              {/* Pro Benefits */}
              <View style={styles.benefitsContainer}>
                <Text style={styles.benefitsTitle}>Lås opp Fjærn Pro</Text>

                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="infinite" size={24} color="#2C5F7C" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Ubegrenset Rydding</Text>
                    <Text style={styles.featureDescription}>
                      Fjern så mange bilder du vil, når som helst
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="sparkles" size={24} color="#8B5CF6" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Full Smart Opprydding</Text>
                    <Text style={styles.featureDescription}>
                      AI-drevet duplikat & screenshot deteksjon
                    </Text>
                  </View>
                </View>

                <View style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Ionicons name="shield-checkmark" size={24} color="#10B981" />
                  </View>
                  <View style={styles.featureTextContainer}>
                    <Text style={styles.featureTitle}>Ingen Annonser</Text>
                    <Text style={styles.featureDescription}>
                      Helt reklamefri opplevelse
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
                      Hjelp oss lage flere features
                    </Text>
                  </View>
                </View>
              </View>

              {/* Pricing */}
              <View style={styles.pricingContainer}>
                <Pressable onPress={handleUpgrade} style={styles.pricingCard}>
                  <LinearGradient
                    colors={["#EF4444", "#DC2626"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.pricingGradient}
                  >
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>MEST POPULÆR</Text>
                    </View>
                    <Text style={styles.pricingTitle}>Årlig Abonnement</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceAmount}>399 kr</Text>
                      <Text style={styles.priceUnit}>/år</Text>
                    </View>
                    <Text style={styles.pricingSavings}>Spar 189 kr (32% rabatt)</Text>
                    <Text style={styles.pricingSubtext}>~33 kr/måned</Text>
                  </LinearGradient>
                </Pressable>

                <Pressable onPress={handleUpgrade} style={styles.pricingCard}>
                  <LinearGradient
                    colors={["#3B82F6", "#1E40AF"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                    style={styles.pricingGradient}
                  >
                    <Text style={styles.pricingTitle}>Månedlig Abonnement</Text>
                    <View style={styles.priceRow}>
                      <Text style={styles.priceAmount}>49 kr</Text>
                      <Text style={styles.priceUnit}>/måned</Text>
                    </View>
                    <Text style={styles.pricingSubtext}>Kanseller når som helst</Text>
                  </LinearGradient>
                </Pressable>
              </View>

              {/* CTA Button */}
              <Pressable onPress={handleUpgrade} style={styles.upgradeButton}>
                <LinearGradient
                  colors={["#2C5F7C", "#4A8BA8"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.upgradeGradient}
                >
                  <Text style={styles.upgradeButtonText}>Oppgrader til Pro →</Text>
                </LinearGradient>
              </Pressable>

              {/* Continue Free */}
              <Pressable onPress={handleClose} style={styles.continueButton}>
                <Text style={styles.continueText}>
                  Fortsett i morgen ({limit} bilder/dag gratis)
                </Text>
              </Pressable>

              {/* Terms */}
              <Text style={styles.terms}>
                Abonnementet fornyes automatisk. Kanseller når som helst i App Store-innstillinger.
              </Text>
            </ScrollView>
          </LinearGradient>
        </View>
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
    marginBottom: 24,
    lineHeight: 22,
  },
  statsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "rgba(44, 95, 124, 0.2)",
  },
  statRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  statLabel: {
    fontSize: 16,
    color: "#5A8BA3",
    fontWeight: "600",
  },
  statValue: {
    fontSize: 18,
    color: "#2C5F7C",
    fontWeight: "bold",
  },
  progressBarContainer: {
    marginTop: 8,
  },
  progressBarBg: {
    height: 8,
    backgroundColor: "rgba(44, 95, 124, 0.2)",
    borderRadius: 100,
    overflow: "hidden",
  },
  progressBarFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 100,
  },
  benefitsContainer: {
    marginBottom: 24,
  },
  benefitsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#2C5F7C",
    marginBottom: 16,
    textAlign: "center",
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
    gap: 12,
    marginBottom: 20,
  },
  pricingCard: {
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 5,
  },
  pricingGradient: {
    padding: 24,
    alignItems: "center",
    position: "relative",
  },
  popularBadge: {
    position: "absolute",
    top: 12,
    right: 12,
    backgroundColor: "rgba(255, 255, 255, 0.25)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  popularText: {
    color: "white",
    fontSize: 10,
    fontWeight: "800",
    letterSpacing: 1,
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 12,
  },
  priceRow: {
    flexDirection: "row",
    alignItems: "baseline",
    marginBottom: 8,
  },
  priceAmount: {
    fontSize: 48,
    fontWeight: "bold",
    color: "white",
  },
  priceUnit: {
    fontSize: 18,
    color: "rgba(255, 255, 255, 0.8)",
    marginLeft: 4,
  },
  pricingSavings: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 4,
  },
  pricingSubtext: {
    fontSize: 14,
    color: "rgba(255, 255, 255, 0.8)",
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
