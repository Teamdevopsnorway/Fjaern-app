import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Image,
  FlatList,
  Modal,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePhotoStore } from "../state/photoStore";
import { categorizePhotos, PhotoCategory } from "../utils/photoAnalysis";
import { formatBytes, loadPhotos, requestPermissions } from "../utils/photoUtils";
import { Photo } from "../types/photo";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

export const CategoriesScreen = ({ navigation }: { navigation: any }) => {
  const allPhotos = usePhotoStore((s) => s.allPhotos);
  const setPhotos = usePhotoStore.getState().setPhotos;
  const markToDelete = usePhotoStore.getState().markToDelete;

  const [categories, setCategories] = useState<PhotoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<PhotoCategory | null>(null);
  const [selectedPhotos, setSelectedPhotos] = useState<Set<string>>(new Set());
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const MAX_DISPLAY_PHOTOS = 500; // Limit grid to 500 photos for performance

  useEffect(() => {
    checkPermissionsAndLoadPhotos();
  }, []);

  useEffect(() => {
    if (allPhotos.length > 0) {
      analyzePhotos();
    }
  }, [allPhotos]);

  const checkPermissionsAndLoadPhotos = async () => {
    setLoading(true);
    const hasPermission = await requestPermissions();

    if (!hasPermission) {
      setPermissionGranted(false);
      setLoading(false);
      return;
    }

    setPermissionGranted(true);

    // Load photos if not already loaded
    if (allPhotos.length === 0) {
      console.log("Loading photos...");
      const photos = await loadPhotos();
      console.log(`Loaded ${photos.length} photos`);
      setPhotos(photos);
    } else {
      // Photos already loaded, just analyze
      analyzePhotos();
    }
  };

  const analyzePhotos = async () => {
    setLoading(true);
    // Run analysis in background
    setTimeout(() => {
      console.log(`Analyzing ${allPhotos.length} photos...`);

      // Debug: Check first 10 photos
      allPhotos.slice(0, 10).forEach((photo, idx) => {
        console.log(`Photo ${idx}: ${photo.filename}, PNG: ${photo.filename.toLowerCase().endsWith('.png')}, Dimensions: ${photo.width}x${photo.height}`);
      });

      const cats = categorizePhotos(allPhotos);
      console.log(`Found ${cats.length} categories:`, cats.map(c => `${c.name}: ${c.photos.length} items`));
      setCategories(cats);
      setLoading(false);
    }, 500);
  };

  const handleCategoryPress = (category: PhotoCategory) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedCategory(category);
    setSelectedPhotos(new Set()); // Reset selection
  };

  const togglePhotoSelection = (photoId: string) => {
    const newSelection = new Set(selectedPhotos);
    if (newSelection.has(photoId)) {
      newSelection.delete(photoId);
    } else {
      newSelection.add(photoId);
    }
    setSelectedPhotos(newSelection);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  const selectAllInCategory = () => {
    if (!selectedCategory) return;

    const allIds = new Set(selectedCategory.photos.map(p => p.id));
    setSelectedPhotos(allIds);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
  };

  const deleteSelectedPhotos = async () => {
    if (!selectedCategory) return;
    if (isDeleting) return; // Prevent double-click

    setIsDeleting(true);

    const photosToDelete = selectedCategory.photos.filter(p =>
      selectedPhotos.has(p.id)
    );

    console.log(`Marking ${photosToDelete.length} photos for deletion...`);

    // Mark photos in chunks to avoid freezing
    const CHUNK_SIZE = 100;
    for (let i = 0; i < photosToDelete.length; i += CHUNK_SIZE) {
      const chunk = photosToDelete.slice(i, i + CHUNK_SIZE);
      chunk.forEach(photo => markToDelete(photo));

      // Give UI time to breathe
      await new Promise(resolve => setTimeout(resolve, 10));
    }

    console.log(`Successfully marked ${photosToDelete.length} photos for deletion`);

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    // Close modal and refresh
    setSelectedCategory(null);
    setSelectedPhotos(new Set());
    setIsDeleting(false);

    // Show success message and navigate
    setTimeout(() => {
      navigation.navigate("ReviewNew");
    }, 300);
  };

  const closeModal = () => {
    setSelectedCategory(null);
    setSelectedPhotos(new Set());
  };

  // Permission denied state
  if (!loading && !permissionGranted) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <LinearGradient
          colors={["#FFFFFF", "#EF4444", "#1E40AF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#1E40AF" />
            </Pressable>
            <Text style={styles.headerTitle}>Smarte Kategorier</Text>
            <View style={styles.backButton} />
          </View>

          <View style={styles.loadingContainer}>
            <Ionicons name="lock-closed" size={64} color="#DC2626" />
            <Text style={styles.emptyTitle}>Tillatelse Nektet</Text>
            <Text style={styles.emptySubtitle}>
              Gi appen tilgang til bildegalleriet for å bruke smart opprydding
            </Text>
            <Pressable
              style={styles.retryButton}
              onPress={checkPermissionsAndLoadPhotos}
            >
              <Text style={styles.retryButtonText}>Prøv Igjen</Text>
            </Pressable>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  if (loading) {
    return (
      <SafeAreaView style={styles.container} edges={["top"]}>
        <LinearGradient
          colors={["#FFFFFF", "#EF4444", "#1E40AF"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 0, y: 1 }}
          style={styles.gradient}
        >
          <View style={styles.header}>
            <Pressable
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            >
              <Ionicons name="arrow-back" size={24} color="#1E40AF" />
            </Pressable>
            <Text style={styles.headerTitle}>Smarte Kategorier</Text>
            <View style={styles.backButton} />
          </View>

          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E40AF" />
            <Text style={styles.loadingText}>
              {allPhotos.length === 0 ? "Laster bilder..." : "Analyserer bilder..."}
            </Text>
          </View>
        </LinearGradient>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["top"]}>
      <LinearGradient
        colors={["#FFFFFF", "#EF4444", "#1E40AF"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={styles.gradient}
      >
        <View style={styles.header}>
          <Pressable
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color="#1E40AF" />
          </Pressable>
          <Text style={styles.headerTitle}>Smarte Kategorier</Text>
          <View style={styles.backButton} />
        </View>

        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.infoCard}>
            <Ionicons name="bulb" size={24} color="#F59E0B" />
            <Text style={styles.infoText}>
              Vi har analysert bildene dine og funnet disse kategoriene
            </Text>
          </View>

          {categories.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="checkmark-circle" size={64} color="#10B981" />
              <Text style={styles.emptyTitle}>Alt ser bra ut!</Text>
              <Text style={styles.emptySubtitle}>
                Vi fant ingen duplikater eller unødvendige bilder
              </Text>
            </View>
          ) : (
            <View style={styles.categoriesContainer}>
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  style={styles.categoryCard}
                  onPress={() => handleCategoryPress(category)}
                >
                  <View style={[styles.iconContainer, { backgroundColor: category.color }]}>
                    <Ionicons name={category.icon as any} size={32} color="white" />
                  </View>

                  <View style={styles.categoryInfo}>
                    <Text style={styles.categoryName}>{category.name}</Text>
                    <Text style={styles.categoryDescription}>{category.description}</Text>
                    <Text style={styles.categorySavings}>
                      Kan spare: {formatBytes(category.potentialSavings)}
                    </Text>
                  </View>

                  <Ionicons name="chevron-forward" size={24} color="#9CA3AF" />
                </Pressable>
              ))}
            </View>
          )}

          <Pressable
            style={styles.manualButton}
            onPress={() => navigation.navigate("SwipeNew")}
          >
            <Ionicons name="hand-left" size={24} color="#1E40AF" />
            <Text style={styles.manualButtonText}>Manuell Swipe Mode</Text>
          </Pressable>
        </ScrollView>

        {/* Category Detail Modal */}
        <Modal
          visible={selectedCategory !== null}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={closeModal}
        >
          {selectedCategory && (
            <SafeAreaView style={styles.modalContainer} edges={["top"]}>
              <View style={styles.modalHeader}>
                <Pressable onPress={closeModal} style={styles.modalCloseButton}>
                  <Ionicons name="close" size={28} color="#1E40AF" />
                </Pressable>
                <Text style={styles.modalTitle}>{selectedCategory.name}</Text>
                <Pressable onPress={selectAllInCategory} style={styles.selectAllButton}>
                  <Text style={styles.selectAllText}>Velg alle</Text>
                </Pressable>
              </View>

              <View style={styles.modalStats}>
                <Text style={styles.modalStatsText}>
                  {selectedPhotos.size} av {selectedCategory.photos.length} valgt
                </Text>
                {selectedCategory.photos.length > MAX_DISPLAY_PHOTOS && (
                  <Text style={styles.modalWarningText}>
                    ⚠️ Viser kun første {MAX_DISPLAY_PHOTOS} bilder. &quot;Velg alle&quot; velger ALLE {selectedCategory.photos.length} bilder.
                  </Text>
                )}
                {selectedPhotos.size > 0 && (
                  <Text style={styles.modalSavingsText}>
                    Sparer: {formatBytes((selectedPhotos.size / selectedCategory.photos.length) * selectedCategory.potentialSavings)}
                  </Text>
                )}
              </View>

              <FlatList
                data={selectedCategory.photos.slice(0, MAX_DISPLAY_PHOTOS)}
                numColumns={3}
                keyExtractor={(item) => item.id}
                maxToRenderPerBatch={30}
                windowSize={5}
                removeClippedSubviews={true}
                initialNumToRender={30}
                renderItem={({ item }) => {
                  const isSelected = selectedPhotos.has(item.id);
                  return (
                    <Pressable
                      style={styles.photoItem}
                      onPress={() => togglePhotoSelection(item.id)}
                    >
                      <Image
                        source={{ uri: item.uri }}
                        style={styles.photoImage}
                      />
                      {isSelected && (
                        <View style={styles.photoSelectedOverlay}>
                          <Ionicons name="checkmark-circle" size={32} color="white" />
                        </View>
                      )}
                      {item.mediaType === "video" && (
                        <View style={styles.videoBadge}>
                          <Ionicons name="videocam" size={16} color="white" />
                        </View>
                      )}
                    </Pressable>
                  );
                }}
                contentContainerStyle={styles.photoGrid}
              />

              {selectedPhotos.size > 0 && (
                <View style={styles.modalFooter}>
                  <Pressable
                    style={styles.deleteButton}
                    onPress={deleteSelectedPhotos}
                  >
                    <Ionicons name="trash" size={24} color="white" />
                    <Text style={styles.deleteButtonText}>
                      Slett {selectedPhotos.size} bilder
                    </Text>
                  </Pressable>
                </View>
              )}
            </SafeAreaView>
          )}
        </Modal>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  gradient: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E40AF",
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: "#1E40AF",
    fontWeight: "600",
  },
  infoCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: "#F59E0B",
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
    color: "#1E40AF",
    fontWeight: "600",
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 60,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: "700",
    color: "#1E40AF",
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 16,
    color: "#DC2626",
    textAlign: "center",
    marginTop: 8,
    paddingHorizontal: 32,
  },
  retryButton: {
    marginTop: 20,
    backgroundColor: "#1E40AF",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "white",
  },
  categoriesContainer: {
    gap: 16,
  },
  categoryCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#1E40AF",
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 16,
  },
  categoryName: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E40AF",
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 14,
    color: "#DC2626",
    marginBottom: 4,
  },
  categorySavings: {
    fontSize: 12,
    fontWeight: "600",
    color: "#10B981",
  },
  manualButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
    borderWidth: 2,
    borderColor: "#1E40AF",
  },
  manualButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#1E40AF",
    marginLeft: 12,
  },

  // Modal styles
  modalContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalCloseButton: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1E40AF",
  },
  selectAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: "#1E40AF",
    borderRadius: 8,
  },
  selectAllText: {
    fontSize: 14,
    fontWeight: "600",
    color: "white",
  },
  modalStats: {
    backgroundColor: "white",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  modalStatsText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1E40AF",
    textAlign: "center",
  },
  modalSavingsText: {
    fontSize: 14,
    color: "#10B981",
    textAlign: "center",
    marginTop: 4,
    fontWeight: "600",
  },
  modalWarningText: {
    fontSize: 12,
    color: "#F59E0B",
    textAlign: "center",
    marginTop: 8,
    fontWeight: "600",
    paddingHorizontal: 16,
  },
  photoGrid: {
    padding: 4,
  },
  photoItem: {
    flex: 1,
    aspectRatio: 1,
    margin: 2,
    position: "relative",
  },
  photoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  photoSelectedOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(30, 64, 175, 0.7)",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  videoBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    padding: 4,
    borderRadius: 4,
  },
  modalFooter: {
    backgroundColor: "white",
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  deleteButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DC2626",
    padding: 16,
    borderRadius: 12,
  },
  deleteButtonText: {
    fontSize: 18,
    fontWeight: "700",
    color: "white",
    marginLeft: 8,
  },
});
