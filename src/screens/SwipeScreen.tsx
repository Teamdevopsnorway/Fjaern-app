import React, { useEffect, useState } from "react";
import { View, Text, Pressable, ActivityIndicator } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { usePhotoStore } from "../state/photoStore";
import { SwipeCard } from "../components/SwipeCard";
import { loadPhotos, requestPermissions } from "../utils/photoUtils";
import { RootStackParamList } from "../navigation/AppNavigator";

type NavigationProp = NativeStackNavigationProp<RootStackParamList, "Swipe">;

export const SwipeScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const insets = useSafeAreaInsets();
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

  // Render states
  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="mt-4 text-gray-600 text-base">Loading your photos...</Text>
      </View>
    );
  }

  if (!hasPermission) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Ionicons name="images-outline" size={80} color="#8B5CF6" />
        <Text className="text-2xl font-bold text-gray-800 mt-6 text-center">
          Photo Access Required
        </Text>
        <Text className="text-base text-gray-600 mt-4 text-center leading-6">
          We need access to your photo library to help you clean up unwanted photos.
          Your photos stay private and secure on your device.
        </Text>
        <Pressable
          onPress={handleRequestPermission}
          className="mt-8 bg-gradient-to-r from-purple-500 to-blue-500 px-8 py-4 rounded-full active:opacity-80"
        >
          <LinearGradient
            colors={["#8B5CF6", "#3B82F6"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              paddingHorizontal: 32,
              paddingVertical: 16,
              borderRadius: 100,
            }}
          >
            <Text className="text-white text-base font-semibold">Grant Access</Text>
          </LinearGradient>
        </Pressable>
      </View>
    );
  }

  if (allPhotos.length === 0) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Ionicons name="checkmark-circle-outline" size={80} color="#10B981" />
        <Text className="text-2xl font-bold text-gray-800 mt-6 text-center">
          No Photos Found
        </Text>
        <Text className="text-base text-gray-600 mt-4 text-center">
          Your photo library is empty or all photos have been reviewed.
        </Text>
      </View>
    );
  }

  if (currentIndex >= allPhotos.length) {
    return (
      <View className="flex-1 bg-white items-center justify-center px-8">
        <Ionicons name="checkmark-circle" size={80} color="#10B981" />
        <Text className="text-2xl font-bold text-gray-800 mt-6 text-center">
          All Done!
        </Text>
        <Text className="text-base text-gray-600 mt-4 text-center mb-8">
          You have reviewed all {allPhotos.length} photos in your library.
        </Text>

        {photosToDelete.length > 0 && (
          <Pressable onPress={handleReview} className="active:opacity-80">
            <LinearGradient
              colors={["#8B5CF6", "#3B82F6"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                paddingHorizontal: 32,
                paddingVertical: 16,
                borderRadius: 100,
              }}
            >
              <Text className="text-white text-base font-semibold">
                Review {photosToDelete.length} Photos to Delete
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
    <View className="flex-1 bg-gradient-to-br from-purple-50 to-blue-50">
      <LinearGradient
        colors={["#F3E8FF", "#DBEAFE"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View
          style={{
            paddingTop: insets.top + 16,
            paddingHorizontal: 20,
            paddingBottom: 16,
          }}
        >
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-2xl font-bold text-gray-800">Clean Up</Text>
              <Text className="text-sm text-gray-600 mt-1">
                {currentIndex + 1} / {allPhotos.length} photos
              </Text>
            </View>

            {photosToDelete.length > 0 && (
              <Pressable
                onPress={handleReview}
                className="flex-row items-center bg-white rounded-full px-4 py-2 active:opacity-70"
                style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.1,
                  shadowRadius: 4,
                  elevation: 3,
                }}
              >
                <Ionicons name="trash-outline" size={18} color="#EF4444" />
                <Text className="ml-2 text-sm font-semibold text-gray-800">
                  {photosToDelete.length}
                </Text>
              </Pressable>
            )}
          </View>

          {/* Progress Bar */}
          <View className="h-2 bg-white rounded-full overflow-hidden">
            <View
              className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
              style={{ width: `${progress}%` }}
            />
          </View>
        </View>

        {/* Card Stack */}
        <View className="flex-1 justify-center items-center">
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
        <BlurView
          intensity={80}
          tint="light"
          style={{
            paddingBottom: insets.bottom + 20,
            paddingTop: 20,
            paddingHorizontal: 20,
          }}
        >
          <View className="flex-row items-center justify-center gap-6">
            {/* Undo Button */}
            <Pressable
              onPress={handleUndo}
              disabled={currentIndex === 0}
              className="w-14 h-14 bg-white rounded-full items-center justify-center active:opacity-70"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: currentIndex === 0 ? 0.05 : 0.15,
                shadowRadius: 8,
                elevation: 5,
                opacity: currentIndex === 0 ? 0.3 : 1,
              }}
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
              className="w-20 h-20 bg-white rounded-full items-center justify-center active:scale-95"
              style={{
                shadowColor: "#EF4444",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <View className="w-16 h-16 bg-red-500 rounded-full items-center justify-center">
                <Ionicons name="close" size={36} color="white" />
              </View>
            </Pressable>

            {/* Keep Button */}
            <Pressable
              onPress={() => handleButtonPress("keep")}
              className="w-20 h-20 bg-white rounded-full items-center justify-center active:scale-95"
              style={{
                shadowColor: "#10B981",
                shadowOffset: { width: 0, height: 6 },
                shadowOpacity: 0.3,
                shadowRadius: 12,
                elevation: 8,
              }}
            >
              <View className="w-16 h-16 bg-green-500 rounded-full items-center justify-center">
                <Ionicons name="heart" size={32} color="white" />
              </View>
            </Pressable>

            {/* Info Button */}
            <Pressable
              onPress={() => {
                Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
              }}
              className="w-14 h-14 bg-white rounded-full items-center justify-center active:opacity-70"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.15,
                shadowRadius: 8,
                elevation: 5,
              }}
            >
              <Ionicons name="information-circle-outline" size={24} color="#6B7280" />
            </Pressable>
          </View>

          {/* Hint Text */}
          <Text className="text-center text-gray-500 text-xs mt-4">
            Swipe left to delete • Swipe right to keep
          </Text>
        </BlurView>
      </LinearGradient>
    </View>
  );
};
