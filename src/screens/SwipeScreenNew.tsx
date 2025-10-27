import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator, StyleSheet, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { usePhotoStore } from "../state/photoStore";
import { SwipeCard } from "../components/SwipeCard";
import { loadPhotos, requestPermissions } from "../utils/photoUtils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export function SwipeScreenNew(props: any) {
  const navigation = props.navigation;
  const [isLoading, setIsLoading] = useState(true);
  const [hasPermission, setHasPermission] = useState(false);

  const {
    allPhotos,
    currentIndex,
    setPhotos,
    markToDelete,
    markToKeep,
    undoLastAction,
    getCurrentPhoto,
    getProgress,
    photosToDelete,
  } = usePhotoStore();

  useEffect(() => {
    initializePhotos();
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
      markToDelete(photo);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const handleSwipeRight = () => {
    const photo = getCurrentPhoto();
    if (photo) {
      markToKeep(photo);
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
        colors={["#F3E8FF", "#DBEAFE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.gradient}
      >
        <SafeAreaView style={styles.safeArea}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <View>
                <Text style={styles.headerTitle}>Rydd Opp</Text>
                <Text style={styles.headerSubtitle}>
                  {currentIndex + 1} / {allPhotos.length} bilder
                </Text>
              </View>

              {photosToDelete.length > 0 && (
                <Pressable onPress={handleReview} style={styles.deleteCounter}>
                  <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  <Text style={styles.deleteCountText}>{photosToDelete.length}</Text>
                </Pressable>
              )}
            </View>

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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3E8FF",
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
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
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
    backgroundColor: "#8B5CF6",
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
