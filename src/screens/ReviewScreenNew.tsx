import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Modal,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { usePhotoStore } from "../state/photoStore";
import { deletePhotos, formatBytes } from "../utils/photoUtils";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = (SCREEN_WIDTH - 48) / 3;

export function ReviewScreenNew(props: any) {
  const navigation = props.navigation;
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  // Use individual selectors to avoid infinite loops
  const photosToDelete = usePhotoStore((s) => s.photosToDelete);
  const stats = usePhotoStore((s) => s.stats);
  const finalizeDeletes = usePhotoStore((s) => s.finalizeDeletes);

  const handleDeleteAll = async () => {
    setShowConfirmModal(false);
    setIsDeleting(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);

    try {
      const success = await deletePhotos(photosToDelete);

      if (success) {
        await finalizeDeletes();
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        navigation.navigate("Swipe");
      } else {
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
      }
    } catch (error) {
      console.error("Error deleting photos:", error);
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
    } finally {
      setIsDeleting(false);
    }
  };

  const renderPhotoItem = ({ item }: { item: any }) => (
    <View style={styles.photoItem}>
      <Image
        source={{ uri: item.uri }}
        style={styles.photoImage}
        contentFit="cover"
      />
      {item.mediaType === "video" && (
        <View style={styles.videoBadge}>
          <Ionicons name="videocam" size={16} color="white" />
        </View>
      )}
    </View>
  );

  if (photosToDelete.length === 0) {
    return (
      <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <View style={styles.headerContent}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#1F2937" />
              </Pressable>
              <Text style={styles.headerTitle}>Gjennomgang</Text>
            </View>
          </View>

          <View style={styles.emptyContainer}>
            <Ionicons name="checkmark-circle-outline" size={80} color="#10B981" />
            <Text style={styles.emptyTitle}>Ingen Bilder å Slette</Text>
            <Text style={styles.emptyText}>
              Start å swipe for å markere bilder for sletting.
            </Text>
          </View>
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerContentReview}>
            <View style={styles.headerLeft}>
              <Pressable
                onPress={() => navigation.goBack()}
                style={styles.backButton}
              >
                <Ionicons name="arrow-back" size={24} color="#1F2937" />
              </Pressable>
              <View>
                <Text style={styles.headerTitle}>Gjennomgang & Slett</Text>
                <Text style={styles.headerSubtitle}>
                  {photosToDelete.length} bilder valgt
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Card */}
        <View style={styles.statsContainer}>
          <LinearGradient
            colors={["#2C5F7C", "#4A8BA8"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statsGradient}
          >
            <View style={styles.statsContent}>
              <View style={styles.statsMain}>
                <View style={styles.statsTextContainer}>
                  <Text style={styles.statsLabel}>Plass å Frigjøre</Text>
                  <Text style={styles.statsValue}>
                    {formatBytes(stats.estimatedSpaceFreed)}
                  </Text>
                </View>
                <View style={styles.statsIcon}>
                  <Ionicons name="trash" size={32} color="white" />
                </View>
              </View>

              <View style={styles.statsDivider} />

              <View style={styles.statsRow}>
                <View style={styles.statItem}>
                  <Text style={styles.statItemLabel}>Bilder</Text>
                  <Text style={styles.statItemValue}>
                    {photosToDelete.length}
                  </Text>
                </View>
                <View style={styles.statItem}>
                  <Text style={styles.statItemLabel}>Videoer</Text>
                  <Text style={styles.statItemValue}>
                    {photosToDelete.filter((p) => p.mediaType === "video").length}
                  </Text>
                </View>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Photo Grid */}
        <FlatList
          data={photosToDelete}
          renderItem={renderPhotoItem}
          keyExtractor={(item) => item.id}
          numColumns={3}
          contentContainerStyle={styles.photoGrid}
          showsVerticalScrollIndicator={false}
        />

        {/* Bottom Action */}
        <View style={styles.bottomContainer}>
          <Pressable
            onPress={() => setShowConfirmModal(true)}
            disabled={isDeleting}
            style={styles.deleteAllButton}
          >
            <LinearGradient
              colors={["#EF4444", "#DC2626"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.deleteAllGradient}
            >
              {isDeleting ? (
                <ActivityIndicator color="white" />
              ) : (
                <View style={styles.deleteAllContent}>
                  <Ionicons name="trash" size={22} color="white" />
                  <Text style={styles.deleteAllText}>
                    Slett {photosToDelete.length} Bilder
                  </Text>
                </View>
              )}
            </LinearGradient>
          </Pressable>

          <Text style={styles.warningText}>Denne handlingen kan ikke angres</Text>
        </View>

        {/* Confirmation Modal */}
        <Modal
          visible={showConfirmModal}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setShowConfirmModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <View style={styles.modalIcon}>
                  <Ionicons name="warning" size={32} color="#EF4444" />
                </View>
                <Text style={styles.modalTitle}>
                  Slett {photosToDelete.length} Bilder?
                </Text>
                <Text style={styles.modalText}>
                  Dette vil permanent slette de valgte bildene fra enheten din.
                  Denne handlingen kan ikke angres.
                </Text>
              </View>

              <View style={styles.modalActions}>
                <Pressable
                  onPress={handleDeleteAll}
                  style={styles.modalDeleteButton}
                >
                  <Text style={styles.modalDeleteText}>Slett Permanent</Text>
                </Pressable>

                <Pressable
                  onPress={() => {
                    setShowConfirmModal(false);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                  style={styles.modalCancelButton}
                >
                  <Text style={styles.modalCancelText}>Avbryt</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  safeArea: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  headerContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerContentReview: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  backButton: {
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
  },
  headerSubtitle: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 4,
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 32,
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
  statsContainer: {
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 16,
  },
  statsGradient: {
    borderRadius: 16,
    padding: 20,
  },
  statsContent: {},
  statsMain: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  statsTextContainer: {
    flex: 1,
  },
  statsLabel: {
    color: "white",
    fontSize: 14,
    opacity: 0.9,
  },
  statsValue: {
    color: "white",
    fontSize: 30,
    fontWeight: "bold",
    marginTop: 4,
  },
  statsIcon: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 50,
    padding: 16,
  },
  statsDivider: {
    height: 1,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    marginTop: 16,
    marginBottom: 16,
  },
  statsRow: {
    flexDirection: "row",
  },
  statItem: {
    flex: 1,
  },
  statItemLabel: {
    color: "white",
    fontSize: 12,
    opacity: 0.8,
  },
  statItemValue: {
    color: "white",
    fontSize: 20,
    fontWeight: "600",
    marginTop: 4,
  },
  photoGrid: {
    padding: 12,
  },
  photoItem: {
    width: IMAGE_SIZE,
    height: IMAGE_SIZE,
    margin: 4,
  },
  photoImage: {
    width: "100%",
    height: "100%",
    borderRadius: 8,
  },
  videoBadge: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 12,
    padding: 4,
  },
  bottomContainer: {
    paddingBottom: 20,
    paddingTop: 20,
    paddingHorizontal: 20,
    backgroundColor: "white",
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  deleteAllButton: {},
  deleteAllGradient: {
    paddingVertical: 18,
    borderRadius: 16,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  deleteAllContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  deleteAllText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  warningText: {
    textAlign: "center",
    color: "#6B7280",
    fontSize: 12,
    marginTop: 12,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 24,
    padding: 24,
    width: "100%",
    maxWidth: 400,
  },
  modalHeader: {
    alignItems: "center",
    marginBottom: 16,
  },
  modalIcon: {
    width: 64,
    height: 64,
    backgroundColor: "#FEE2E2",
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#1F2937",
    textAlign: "center",
  },
  modalText: {
    fontSize: 14,
    color: "#6B7280",
    textAlign: "center",
    marginTop: 8,
  },
  modalActions: {
    marginTop: 16,
    gap: 12,
  },
  modalDeleteButton: {
    backgroundColor: "#EF4444",
    paddingVertical: 16,
    borderRadius: 100,
  },
  modalDeleteText: {
    color: "white",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
  modalCancelButton: {
    backgroundColor: "#F3F4F6",
    paddingVertical: 16,
    borderRadius: 100,
  },
  modalCancelText: {
    color: "#1F2937",
    textAlign: "center",
    fontWeight: "600",
    fontSize: 16,
  },
});
