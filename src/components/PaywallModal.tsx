import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, Modal, Pressable, ScrollView, ActivityIndicator, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as Haptics from "expo-haptics";
import {
  getSubscriptionPackages,
  purchasePackage,
  restorePurchases
} from "../utils/revenueCat";
import type { PurchasesPackage } from "react-native-purchases";

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
  const [monthlyPackage, setMonthlyPackage] = useState<PurchasesPackage | null>(null);
  const [yearlyPackage, setYearlyPackage] = useState<PurchasesPackage | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isPurchasing, setIsPurchasing] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);

  // Load packages when modal opens
  useEffect(() => {
    if (visible) {
      loadPackages();
    }
  }, [visible]);

  const loadPackages = async () => {
    setIsLoading(true);
    try {
      const packages = await getSubscriptionPackages();
      setMonthlyPackage(packages.monthly);
      setYearlyPackage(packages.yearly);
    } catch (error) {
      console.error("[PaywallModal] Error loading packages:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePurchase = async (pkg: PurchasesPackage) => {
    if (!pkg) return;

    setIsPurchasing(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);

    try {
      const result = await purchasePackage(pkg);

      if (result.success) {
        // Success! User is now Pro
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        onUpgrade(); // Update local state
        onClose();
      }
    } catch (error: any) {
      console.error("[PaywallModal] Purchase error:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      Alert.alert(
        "Kjøp feilet",
        "Kunne ikke fullføre kjøpet. Prøv igjen senere.",
        [{ text: "OK" }]
      );
    } finally {
      setIsPurchasing(false);
    }
  };

  const handleRestore = async () => {
    setIsRestoring(true);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    try {
      const isPro = await restorePurchases();

      if (isPro) {
        // Success! Purchases restored
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        Alert.alert(
          "Kjøp gjenopprettet! ✨",
          "Dine tidligere kjøp er nå aktive.",
          [{ text: "Flott!", onPress: () => {
            onUpgrade();
            onClose();
          }}]
        );
      } else {
        // No purchases found
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
        Alert.alert(
          "Ingen kjøp funnet",
          "Vi fant ingen tidligere kjøp på denne kontoen.",
          [{ text: "OK" }]
        );
      }
    } catch (error) {
      console.error("[PaywallModal] Restore error:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

      Alert.alert(
        "Gjenoppretting feilet",
        "Kunne ikke gjenopprette kjøp. Prøv igjen senere.",
        [{ text: "OK" }]
      );
    } finally {
      setIsRestoring(false);
    }
  };

  const handleClose = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <View style={styles.content}>
          <ScrollView contentContainerStyle={styles.scrollContent}>
            {/* Close button */}
            <Pressable onPress={handleClose} style={styles.closeButton}>
              <Ionicons name="close" size={28} color="#FFFFFF" />
            </Pressable>

            {/* Title */}
            <Text style={styles.title}>Du har nådd dagens grense! 🎉</Text>
            <Text style={styles.subtitle}>
              Gratulerer! Du har fjernet {deletedToday} bilder i dag.
            </Text>

            {/* Stats */}
            <View style={styles.statsCard}>
              <Text style={styles.statLabel}>I dag: {deletedToday} / {limit} bilder</Text>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "100%" }]} />
              </View>
            </View>

            {/* Benefits */}
            <Text style={styles.benefitsTitle}>Fjærn Pro</Text>

            <View style={styles.benefitItem}>
              <Ionicons name="infinite" size={24} color="#3B82F6" />
              <Text style={styles.benefitText}>Ubegrenset rydding</Text>
            </View>

            <View style={styles.benefitItem}>
              <Ionicons name="sparkles" size={24} color="#8B5CF6" />
              <Text style={styles.benefitText}>Full smart opprydding</Text>
            </View>

            <View style={styles.benefitItem}>
              <Ionicons name="shield-checkmark" size={24} color="#10B981" />
              <Text style={styles.benefitText}>Ingen annonser</Text>
            </View>

            {/* Pricing */}
            {isLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#FFFFFF" />
                <Text style={styles.loadingText}>Laster abonnementer...</Text>
              </View>
            ) : (
              <>
                <Pressable
                  onPress={() => yearlyPackage && handlePurchase(yearlyPackage)}
                  style={styles.pricingCard}
                  disabled={isPurchasing || !yearlyPackage}
                >
                  <LinearGradient
                    colors={["#EF4444", "#DC2626"]}
                    style={styles.pricingGradient}
                  >
                    {isPurchasing ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.badge}>MEST POPULÆR</Text>
                        <Text style={styles.pricingTitle}>Årlig</Text>
                        <Text style={styles.priceAmount}>
                          {yearlyPackage?.product.priceString || "399 kr/år"}
                        </Text>
                        <Text style={styles.pricingSavings}>Spar 189 kr (32%)</Text>
                      </>
                    )}
                  </LinearGradient>
                </Pressable>

                <Pressable
                  onPress={() => monthlyPackage && handlePurchase(monthlyPackage)}
                  style={styles.pricingCard}
                  disabled={isPurchasing || !monthlyPackage}
                >
                  <LinearGradient
                    colors={["#3B82F6", "#1E40AF"]}
                    style={styles.pricingGradient}
                  >
                    {isPurchasing ? (
                      <ActivityIndicator size="small" color="#FFFFFF" />
                    ) : (
                      <>
                        <Text style={styles.pricingTitle}>Månedlig</Text>
                        <Text style={styles.priceAmount}>
                          {monthlyPackage?.product.priceString || "49 kr/måned"}
                        </Text>
                      </>
                    )}
                  </LinearGradient>
                </Pressable>
              </>
            )}

            {/* Restore Purchases */}
            <Pressable
              onPress={handleRestore}
              style={styles.restoreButton}
              disabled={isRestoring || isLoading}
            >
              {isRestoring ? (
                <ActivityIndicator size="small" color="#9CA3AF" />
              ) : (
                <Text style={styles.restoreText}>
                  Gjenopprett tidligere kjøp
                </Text>
              )}
            </Pressable>

            {/* Continue Free */}
            <Pressable onPress={handleClose} style={styles.continueButton}>
              <Text style={styles.continueText}>
                Fortsett i morgen ({limit} bilder/dag gratis)
              </Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: "#1F2937",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: "90%",
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  closeButton: {
    alignSelf: "flex-end",
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#9CA3AF",
    textAlign: "center",
    marginBottom: 24,
  },
  statsCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 16,
    padding: 16,
    marginBottom: 24,
  },
  statLabel: {
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
    marginBottom: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#3B82F6",
    borderRadius: 100,
  },
  benefitsTitle: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 16,
    textAlign: "center",
  },
  benefitItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    gap: 12,
  },
  benefitText: {
    flex: 1,
    fontSize: 16,
    color: "#FFFFFF",
    fontWeight: "600",
  },
  pricingCard: {
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 12,
  },
  pricingGradient: {
    padding: 20,
    alignItems: "center",
  },
  badge: {
    fontSize: 10,
    fontWeight: "800",
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
    marginBottom: 8,
    letterSpacing: 1,
  },
  pricingTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginBottom: 8,
  },
  priceAmount: {
    fontSize: 32,
    fontWeight: "bold",
    color: "white",
    marginBottom: 4,
  },
  pricingSavings: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 100,
  },
  continueButton: {
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 8,
  },
  continueText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  loadingContainer: {
    paddingVertical: 40,
    alignItems: "center",
    justifyContent: "center",
    gap: 12,
  },
  loadingText: {
    fontSize: 14,
    color: "#9CA3AF",
    fontWeight: "500",
  },
  restoreButton: {
    paddingVertical: 12,
    alignItems: "center",
    marginTop: 8,
    marginBottom: 4,
  },
  restoreText: {
    fontSize: 13,
    color: "#9CA3AF",
    fontWeight: "600",
    textDecorationLine: "underline",
  },
});

