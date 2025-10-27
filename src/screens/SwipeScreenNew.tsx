import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { usePhotoStore } from "../state/photoStore";
import { useGamificationStore } from "../state/gamificationStore";
import { SwipeCard } from "../components/SwipeCard";
import { CelebrationModal } from "../components/CelebrationModal";
import { DailyGoalCelebrationModal } from "../components/DailyGoalCelebrationModal";
import { TrollAvatar } from "../components/TrollAvatar";
import { loadPhotos, requestPermissions } from "../utils/photoUtils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function SwipeScreenNew(props: any) {
  const navigation = props.navigation;
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [currentMilestone, setCurrentMilestone] = useState(0);
  const [showDailyGoalCelebration, setShowDailyGoalCelebration] = useState(false);

  // Use individual selectors for photoStore to avoid infinite loops
  const allPhotos = usePhotoStore((s) => s.allPhotos);
  const currentIndex = usePhotoStore((s) => s.currentIndex);
  const photosToDelete = usePhotoStore((s) => s.photosToDelete);

  // Get functions from store - these are stable references
  const setPhotos = usePhotoStore.getState().setPhotos;
  const markToDelete = usePhotoStore.getState().markToDelete;
  const markToKeep = usePhotoStore.getState().markToKeep;
  const undoLastAction = usePhotoStore.getState().undoLastAction;
  const getCurrentPhoto = usePhotoStore.getState().getCurrentPhoto;
  const getProgress = usePhotoStore.getState().getProgress;

  // Use individual selectors for gamificationStore to avoid infinite loops
  const currentStreak = useGamificationStore((s) => s.currentStreak);
  const todaysPhotosDeleted = useGamificationStore((s) => s.todaysPhotosDeleted);
  const dailyGoal = useGamificationStore((s) => s.dailyGoal);
  const todaysSpaceSaved = useGamificationStore((s) => s.todaysSpaceSaved);

  // Get functions from store - these are stable references
  const incrementPhotosCleaned = useGamificationStore.getState().incrementPhotosCleaned;
  const updateStreak = useGamificationStore.getState().updateStreak;
  const resetDailyStats = useGamificationStore.getState().resetDailyStats;
  const getTodaySpaceSavedFormatted = useGamificationStore.getState().getTodaySpaceSavedFormatted;
  const getDailyProgress = useGamificationStore.getState().getDailyProgress;

  useEffect(() => {
    initializePhotos();
    updateStreak();
    resetDailyStats();
  }, []);

  const initializePhotos = async () => {
    const permission = await requestPermissions();
    setHasPermission(permission);

    if (permission) {
      const photos = await loadPhotos();
      setPhotos(photos);
    }

    setIsLoading(false);
  };

  const handleSwipeLeft = () => {
    const photo = getCurrentPhoto();
    if (photo) {
      // Delete the photo
      markToDelete(photo);

      // Gamification: increment and check for milestone and daily goal
      const result = incrementPhotosCleaned(2 * 1024 * 1024); // 2MB estimate

      // Check milestone first
      if (result.milestone) {
        setCurrentMilestone(result.milestoneNumber);
        setShowCelebration(true);
      }

      // Check if daily goal just reached (takes priority over milestone)
      if (result.dailyGoalReached) {
        setShowDailyGoalCelebration(true);
        // If both milestone and daily goal, show daily goal celebration
        if (result.milestone) {
          setShowCelebration(false);
        }
      }
    }
  };

  const handleSwipeRight = () => {
    const photo = getCurrentPhoto();
    if (photo) {
      markToKeep(photo);
    }
  };

  const handleButtonPress = (action: "delete" | "keep") => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    if (action === "delete") {
      handleSwipeLeft();
    } else {
      handleSwipeRight();
    }
  };

  const handleUndo = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    undoLastAction();
  };

  const handleReview = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    navigation.navigate("Review");
  };

  const handleRequestPermission = async () => {
    const permission = await requestPermissions();
    setHasPermission(permission);

    if (permission) {
      setIsLoading(true);
      const photos = await loadPhotos();
      setPhotos(photos);
      setIsLoading(false);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text style={styles.loadingText}>Laster inn bildene dine...</Text>
      </View>
    );
  }

  // Permission denied state
  if (!hasPermission) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="images-outline" size={80} color="#8B5CF6" />
        <Text style={styles.permissionTitle}>Fototilgang Påkrevd</Text>
        <Text style={styles.permissionText}>
          Vi trenger tilgang til fotobiblioteket ditt for å hjelpe deg med å rydde opp i uønskede bilder.
          Bildene dine forblir private og trygge på enheten din.
        </Text>
        <Pressable onPress={handleRequestPermission} style={styles.permissionButton}>
          <LinearGradient
            colors={["#8B5CF6", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.permissionGradient}
          >
            <Text style={styles.permissionButtonText}>Gi Tilgang</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  // No photos state
  if (allPhotos.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="checkmark-circle-outline" size={80} color="#10B981" />
        <Text style={styles.emptyTitle}>Ingen Bilder Funnet</Text>
        <Text style={styles.emptyText}>
          Fotobiblioteket ditt er tomt eller alle bilder er gjennomgått.
        </Text>
      </View>
    );
  }

  // All done state
  if (currentIndex >= allPhotos.length) {
    return (
      <View style={styles.centerContainer}>
        <Ionicons name="checkmark-circle" size={80} color="#10B981" />
        <Text style={styles.doneTitle}>Ferdig!</Text>
        <Text style={styles.doneText}>
          Du har gjennomgått alle {allPhotos.length} bilder i biblioteket ditt.
        </Text>
        {photosToDelete.length > 0 && (
          <Pressable onPress={handleReview} style={styles.reviewButtonContainer}>
            <LinearGradient
              colors={["#8B5CF6", "#3B82F6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.reviewGradient}
            >
              <Text style={styles.reviewButtonText}>
                Se Gjennom {photosToDelete.length} Bilder å Slette
              </Text>
            </LinearGradient>
          </Pressable>
        )}
      </View>
    );
  }

  const progress = getProgress();
  const currentPhoto = getCurrentPhoto();
  const nextPhotos = allPhotos.slice(currentIndex + 1, currentIndex + 3);

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#FFFFFF", "#FEE2E2", "#DBEAFE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header with Stats */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View style={styles.headerLeft}>
                <TrollAvatar size={50} animate={todaysPhotosDeleted > 0} />
                <View style={styles.headerTextContainer}>
                  <Text style={styles.headerTitle}>Rydd Opp</Text>
                  <Text style={styles.headerSubtitle}>
                    {currentIndex + 1} / {allPhotos.length} bilder
                  </Text>
                </View>
              </View>

              <View style={styles.headerRight}>
                {currentStreak > 0 && (
                  <View style={styles.streakBadge}>
                    <Ionicons name="flame" size={16} color="#FF6B35" />
                    <Text style={styles.streakText}>{currentStreak}</Text>
                  </View>
                )}

                {photosToDelete.length > 0 && (
                  <Pressable onPress={handleReview} style={styles.deleteCounter}>
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    <Text style={styles.deleteCountText}>{photosToDelete.length}</Text>
                  </Pressable>
                )}
              </View>
            </View>

            {/* Stats Row */}
            {(todaysPhotosDeleted > 0 || dailyGoal > 0) && (
              <View style={styles.statsRow}>
                {todaysPhotosDeleted > 0 && (
                  <>
                    <View style={styles.statBadge}>
                      <Ionicons name="checkmark-circle" size={14} color="#4CAF50" />
                      <Text style={styles.statText}>{todaysPhotosDeleted} i dag</Text>
                    </View>
                    <View style={styles.statBadge}>
                      <Ionicons name="cloud-upload" size={14} color="#2196F3" />
                      <Text style={styles.statText}>{getTodaySpaceSavedFormatted()} spart</Text>
                    </View>
                  </>
                )}

                {/* Daily goal progress */}
                {dailyGoal > 0 && (
                  <View style={styles.goalBadge}>
                    <Ionicons name="flag" size={14} color="#FFA000" />
                    <Text style={styles.goalText}>
                      {todaysPhotosDeleted}/{dailyGoal}
                    </Text>
                  </View>
                )}
              </View>
            )}

            {/* Progress Bar */}
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progress}%` }]} />
            </View>
          </View>

          {/* Card Stack */}
          <View style={styles.cardStack}>
            {nextPhotos.map((photo, index) => (
              <SwipeCard
                key={photo.id}
                photo={photo}
                onSwipeLeft={() => {}}
                onSwipeRight={() => {}}
                isTop={false}
                index={index + 1}
              />
            ))}

            {currentPhoto && (
              <SwipeCard
                key={currentPhoto.id}
                photo={currentPhoto}
                onSwipeLeft={handleSwipeLeft}
                onSwipeRight={handleSwipeRight}
                isTop={true}
                index={0}
              />
            )}
          </View>

          {/* Bottom Actions */}
          <BlurView intensity={80} tint="light" style={styles.bottomActions}>
            <View style={styles.actionsContainer}>
              {/* Undo Button */}
              <Pressable
                onPress={handleUndo}
                disabled={currentIndex === 0}
                style={[styles.actionButton, styles.undoButton, currentIndex === 0 && styles.disabledButton]}
              >
                <Ionicons
                  name="arrow-undo"
                  size={24}
                  color={currentIndex === 0 ? "#9CA3AF" : "#6B7280"}
                />
              </Pressable>

              {/* Delete Button */}
              <Pressable
                onPress={() => handleButtonPress("delete")}
                style={[styles.actionButton, styles.deleteButton]}
              >
                <View style={styles.deleteButtonInner}>
                  <Ionicons name="close" size={36} color="white" />
                </View>
              </Pressable>

              {/* Keep Button */}
              <Pressable
                onPress={() => handleButtonPress("keep")}
                style={[styles.actionButton, styles.keepButton]}
              >
                <View style={styles.keepButtonInner}>
                  <Ionicons name="heart" size={32} color="white" />
                </View>
              </Pressable>

              {/* Info Button */}
              <Pressable
                onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                style={[styles.actionButton, styles.infoButton]}
              >
                <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
              </Pressable>
            </View>

            <Text style={styles.hintText}>Swipe venstre for å slette • Swipe høyre for å beholde</Text>
          </BlurView>
        </SafeAreaView>
      </LinearGradient>

      {/* Celebration Modal */}
      <CelebrationModal
        visible={showCelebration}
        onClose={() => setShowCelebration(false)}
        milestoneNumber={currentMilestone}
        spaceSaved={getTodaySpaceSavedFormatted()}
      />

      {/* Daily Goal Celebration Modal */}
      <DailyGoalCelebrationModal
        visible={showDailyGoalCelebration}
        onClose={() => setShowDailyGoalCelebration(false)}
        goalNumber={dailyGoal}
        todayTotal={todaysPhotosDeleted}
        spaceSaved={getTodaySpaceSavedFormatted()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  gradient: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: "white",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
  },
  loadingText: {
    marginTop: 16,
    color: "#6B7280",
    fontSize: 16,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 24,
    textAlign: "center",
  },
  permissionText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
    textAlign: "center",
    lineHeight: 24,
  },
  permissionButton: {
    marginTop: 32,
  },
  permissionGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
  },
  permissionButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 24,
    textAlign: "center",
  },
  emptyText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
    textAlign: "center",
  },
  doneTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
    marginTop: 24,
    textAlign: "center",
  },
  doneText: {
    fontSize: 16,
    color: "#6B7280",
    marginTop: 16,
    textAlign: "center",
    marginBottom: 32,
  },
  reviewButtonContainer: {
    marginTop: 16,
  },
  reviewGradient: {
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 100,
  },
  reviewButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  headerTextContainer: {
    gap: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 4,
    shadowColor: "#FF6B35",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  streakText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FF6B35",
  },
  statsRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 12,
  },
  statBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
  },
  statText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#1E40AF",
  },
  proUpgradeBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 215, 0, 0.2)",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: "#FFD700",
  },
  proUpgradeText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B8860B",
  },
  goalBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 160, 0, 0.2)",
    borderRadius: 100,
    paddingHorizontal: 12,
    paddingVertical: 6,
    gap: 6,
    borderWidth: 1,
    borderColor: "#FFA000",
  },
  goalText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#E65100",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#DC2626",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#1E40AF",
    marginTop: 4,
  },
  deleteCounter: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 100,
    paddingHorizontal: 16,
    paddingVertical: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  deleteCountText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: "600",
    color: "#1F2937",
  },
  progressBar: {
    height: 8,
    backgroundColor: "white",
    borderRadius: 100,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#2C5F7C",
    borderRadius: 100,
  },
  cardStack: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomActions: {
    paddingBottom: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
  },
  actionsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 24,
  },
  actionButton: {
    width: 56,
    height: 56,
    backgroundColor: "white",
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5,
  },
  undoButton: {
    // Specific styles for undo
  },
  disabledButton: {
    opacity: 0.3,
  },
  deleteButton: {
    width: 80,
    height: 80,
    shadowColor: "#EF4444",
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  deleteButtonInner: {
    width: 64,
    height: 64,
    backgroundColor: "#EF4444",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  keepButton: {
    width: 80,
    height: 80,
    shadowColor: "#10B981",
    shadowOpacity: 0.3,
    shadowRadius: 12,
  },
  keepButtonInner: {
    width: 64,
    height: 64,
    backgroundColor: "#10B981",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
  },
  infoButton: {
    // Specific styles for info
  },
  hintText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 12,
    marginTop: 16,
  },
});
