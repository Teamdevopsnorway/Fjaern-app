import React, { useState } from "react";
import {
  View,
  Text,
  Pressable,
  FlatList,
  Dimensions,
  ActivityIndicator,
  Modal,
} from "react-native";
import { Image } from "expo-image";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { usePhotoStore } from "../state/photoStore";
import { deletePhotos, formatBytes } from "../utils/photoUtils";
import { RootStackParamList } from "../navigation/AppNavigator";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const IMAGE_SIZE = (SCREEN_WIDTH - 48) / 3;

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Review">;

export const ReviewScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);

  const { photosToDelete, stats, finalizeDeletes } = usePhotoStore();

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
    <Animated.View entering={FadeIn} exiting={FadeOut}>
      <View
        style={{
          width: IMAGE_SIZE,
          height: IMAGE_SIZE,
          margin: 4,
        }}
      >
        <Image
          source={{ uri: item.uri }}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: 8,
          }}
          contentFit="cover"
        />
        {item.mediaType === "video" && (
          <View
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              backgroundColor: "rgba(0,0,0,0.6)",
              borderRadius: 12,
              padding: 4,
            }}
          >
            <Ionicons name="videocam" size={16} color="white" />
          </View>
        )}
      </View>
    </Animated.View>
  );

  if (photosToDelete.length === 0) {
    return (
      <View className="flex-1 bg-white">
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 20,
            paddingBottom: 16,
          }}
          className="border-b border-gray-200"
        >
          <View className="flex-row items-center">
            <Pressable
              onPress={() => navigation.goBack()}
              className="mr-4 active:opacity-70"
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </Pressable>
            <Text className="text-xl font-bold text-gray-800">Review</Text>
          </View>
        </View>

        <View className="flex-1 items-center justify-center px-8">
          <Ionicons name="checkmark-circle-outline" size={80} color="#10B981" />
          <Text className="text-2xl font-bold text-gray-800 mt-6 text-center">
            No Photos to Delete
          </Text>
          <Text className="text-base text-gray-600 mt-4 text-center">
            Start swiping to mark photos for deletion.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      {/* Header */}
      <View
        style={{
          paddingTop: insets.top + 16,
          paddingHorizontal: 20,
          paddingBottom: 16,
        }}
        className="border-b border-gray-200"
      >
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center">
            <Pressable
              onPress={() => navigation.goBack()}
              className="mr-4 active:opacity-70"
            >
              <Ionicons name="arrow-back" size={24} color="#1F2937" />
            </Pressable>
            <View>
              <Text className="text-xl font-bold text-gray-800">Review & Delete</Text>
              <Text className="text-sm text-gray-600 mt-1">
                {photosToDelete.length} photos selected
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Stats Card */}
      <View className="mx-5 mt-5 mb-4">
        <LinearGradient
          colors={["#8B5CF6", "#3B82F6"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{
            borderRadius: 16,
            padding: 20,
          }}
        >
          <View className="flex-row justify-between items-center">
            <View className="flex-1">
              <Text className="text-white text-sm opacity-90">Space to Free</Text>
              <Text className="text-white text-3xl font-bold mt-1">
                {formatBytes(stats.estimatedSpaceFreed)}
              </Text>
            </View>
            <View className="bg-white bg-opacity-20 rounded-full p-4">
              <Ionicons name="trash" size={32} color="white" />
            </View>
          </View>

          <View className="flex-row mt-4 pt-4 border-t border-white border-opacity-20">
            <View className="flex-1">
              <Text className="text-white text-xs opacity-80">Photos</Text>
              <Text className="text-white text-xl font-semibold mt-1">
                {photosToDelete.length}
              </Text>
            </View>
            <View className="flex-1">
              <Text className="text-white text-xs opacity-80">Videos</Text>
              <Text className="text-white text-xl font-semibold mt-1">
                {photosToDelete.filter((p) => p.mediaType === "video").length}
              </Text>
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
        contentContainerStyle={{
          padding: 12,
        }}
        showsVerticalScrollIndicator={false}
      />

      {/* Bottom Action */}
      <View
        style={{
          paddingBottom: insets.bottom + 20,
          paddingTop: 20,
          paddingHorizontal: 20,
          backgroundColor: "white",
          borderTopWidth: 1,
          borderTopColor: "#E5E7EB",
        }}
      >
        <Pressable
          onPress={() => setShowConfirmModal(true)}
          disabled={isDeleting}
          className="active:opacity-80"
        >
          <LinearGradient
            colors={["#EF4444", "#DC2626"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingVertical: 18,
              borderRadius: 16,
              alignItems: "center",
              flexDirection: "row",
              justifyContent: "center",
            }}
          >
            {isDeleting ? (
              <ActivityIndicator color="white" />
            ) : (
              <>
                <Ionicons name="trash" size={22} color="white" />
                <Text className="text-white text-lg font-semibold ml-2">
                  Delete {photosToDelete.length} Photos
                </Text>
              </>
            )}
          </LinearGradient>
        </Pressable>

        <Text className="text-center text-gray-500 text-xs mt-3">
          This action cannot be undone
        </Text>
      </View>

      {/* Confirmation Modal */}
      <Modal
        visible={showConfirmModal}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setShowConfirmModal(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center px-8">
          <View className="bg-white rounded-3xl p-6 w-full max-w-sm">
            <View className="items-center mb-4">
              <View className="w-16 h-16 bg-red-100 rounded-full items-center justify-center mb-4">
                <Ionicons name="warning" size={32} color="#EF4444" />
              </View>
              <Text className="text-xl font-bold text-gray-800 text-center">
                Delete {photosToDelete.length} Photos?
              </Text>
              <Text className="text-sm text-gray-600 text-center mt-2">
                This will permanently delete the selected photos from your device.
                This action cannot be undone.
              </Text>
            </View>

            <View className="gap-3 mt-4">
              <Pressable
                onPress={handleDeleteAll}
                className="bg-red-500 py-4 rounded-full active:opacity-80"
              >
                <Text className="text-white text-center font-semibold text-base">
                  Delete Permanently
                </Text>
              </Pressable>

              <Pressable
                onPress={() => {
                  setShowConfirmModal(false);
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
                className="bg-gray-100 py-4 rounded-full active:opacity-70"
              >
                <Text className="text-gray-800 text-center font-semibold text-base">
                  Cancel
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};
