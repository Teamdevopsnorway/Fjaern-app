import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { usePhotoStore } from "../state/photoStore";
import { categorizePhotos, PhotoCategory } from "../utils/photoAnalysis";
import { formatBytes, loadPhotos, requestPermissions } from "../utils/photoUtils";
import * as Haptics from "expo-haptics";
import { LinearGradient } from "expo-linear-gradient";

export const CategoriesScreen = ({ navigation }: { navigation: any }) => {
  const allPhotos = usePhotoStore((s) => s.allPhotos);
  const setPhotos = usePhotoStore.getState().setPhotos;
  const markToDelete = usePhotoStore.getState().markToDelete;

  const [categories, setCategories] = useState<PhotoCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [permissionGranted, setPermissionGranted] = useState(false);

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

    // Set the category photos to photoStore and navigate to SwipeScreenNew
    setPhotos(category.photos);

    // Navigate to swipe mode with category photos
    navigation.navigate("SwipeNew", {
      categoryName: category.name,
      fromCategories: true,
    });
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
});
