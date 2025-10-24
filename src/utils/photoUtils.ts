import * as MediaLibrary from "expo-media-library";
import { Photo } from "../types/photo";

export const requestPermissions = async (): Promise<boolean> => {
  const { status } = await MediaLibrary.requestPermissionsAsync();
  return status === "granted";
};

export const loadPhotos = async (): Promise<Photo[]> => {
  try {
    const { status } = await MediaLibrary.getPermissionsAsync();

    if (status !== "granted") {
      const permissionResult = await requestPermissions();
      if (!permissionResult) {
        return [];
      }
    }

    // Get all photos and videos
    const media = await MediaLibrary.getAssetsAsync({
      first: 10000, // Load a large number, can be adjusted
      mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
      sortBy: MediaLibrary.SortBy.creationTime,
    });

    const photos: Photo[] = media.assets.map((asset) => ({
      id: asset.id,
      uri: asset.uri,
      filename: asset.filename,
      width: asset.width,
      height: asset.height,
      creationTime: asset.creationTime,
      modificationTime: asset.modificationTime,
      duration: asset.duration,
      mediaType: asset.mediaType === MediaLibrary.MediaType.photo ? "photo" : "video",
    }));

    return photos;
  } catch (error) {
    console.error("Error loading photos:", error);
    return [];
  }
};

export const deletePhotos = async (photos: Photo[]): Promise<boolean> => {
  try {
    const assetIds = photos.map((photo) => photo.id);
    await MediaLibrary.deleteAssetsAsync(assetIds);
    return true;
  } catch (error) {
    console.error("Error deleting photos:", error);
    return false;
  }
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
};
