import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Photo, PhotoStats } from "../types/photo";

interface PhotoState {
  // Data
  allPhotos: Photo[];
  currentIndex: number;
  photosToDelete: Photo[];
  photosToKeep: Photo[];
  lastDeletedPhoto: Photo | null;

  // Stats
  stats: PhotoStats;

  // Actions
  setPhotos: (photos: Photo[]) => void;
  markToDelete: (photo: Photo) => void;
  markToKeep: (photo: Photo) => void;
  undoLastAction: () => void;
  resetSession: () => void;
  finalizeDeletes: () => Promise<void>;

  // Computed
  getCurrentPhoto: () => Photo | null;
  getProgress: () => number;
}

export const usePhotoStore = create<PhotoState>()(
  persist(
    (set, get) => ({
      // Initial state
      allPhotos: [],
      currentIndex: 0,
      photosToDelete: [],
      photosToKeep: [],
      lastDeletedPhoto: null,

      stats: {
        totalPhotos: 0,
        reviewedPhotos: 0,
        photosToKeep: 0,
        photosToDelete: 0,
        estimatedSpaceFreed: 0,
      },

      // Actions
      setPhotos: (photos) => {
        set({
          allPhotos: photos,
          currentIndex: 0,
          stats: {
            totalPhotos: photos.length,
            reviewedPhotos: 0,
            photosToKeep: 0,
            photosToDelete: 0,
            estimatedSpaceFreed: 0,
          },
        });
      },

      markToDelete: (photo) => {
        const state = get();
        set({
          photosToDelete: [...state.photosToDelete, photo],
          currentIndex: state.currentIndex + 1,
          lastDeletedPhoto: photo,
          stats: {
            ...state.stats,
            reviewedPhotos: state.stats.reviewedPhotos + 1,
            photosToDelete: state.stats.photosToDelete + 1,
            // Rough estimate: 2MB per photo on average
            estimatedSpaceFreed: state.stats.estimatedSpaceFreed + 2 * 1024 * 1024,
          },
        });
      },

      markToKeep: (photo) => {
        const state = get();
        set({
          photosToKeep: [...state.photosToKeep, photo],
          currentIndex: state.currentIndex + 1,
          lastDeletedPhoto: null,
          stats: {
            ...state.stats,
            reviewedPhotos: state.stats.reviewedPhotos + 1,
            photosToKeep: state.stats.photosToKeep + 1,
          },
        });
      },

      undoLastAction: () => {
        const state = get();
        if (state.currentIndex === 0) return;

        const newIndex = state.currentIndex - 1;
        const lastPhoto = state.allPhotos[newIndex];

        // Check if last action was delete or keep
        const wasDeleted = state.photosToDelete[state.photosToDelete.length - 1]?.id === lastPhoto?.id;

        if (wasDeleted) {
          set({
            photosToDelete: state.photosToDelete.slice(0, -1),
            currentIndex: newIndex,
            stats: {
              ...state.stats,
              reviewedPhotos: state.stats.reviewedPhotos - 1,
              photosToDelete: state.stats.photosToDelete - 1,
              estimatedSpaceFreed: Math.max(0, state.stats.estimatedSpaceFreed - 2 * 1024 * 1024),
            },
          });
        } else {
          set({
            photosToKeep: state.photosToKeep.slice(0, -1),
            currentIndex: newIndex,
            stats: {
              ...state.stats,
              reviewedPhotos: state.stats.reviewedPhotos - 1,
              photosToKeep: state.stats.photosToKeep - 1,
            },
          });
        }
      },

      resetSession: () => {
        set({
          currentIndex: 0,
          photosToDelete: [],
          photosToKeep: [],
          lastDeletedPhoto: null,
          stats: {
            ...get().stats,
            reviewedPhotos: 0,
            photosToKeep: 0,
            photosToDelete: 0,
            estimatedSpaceFreed: 0,
          },
        });
      },

      finalizeDeletes: async () => {
        // This will be implemented when we actually delete photos
        const state = get();
        set({
          allPhotos: state.allPhotos.filter(
            (photo) => !state.photosToDelete.find((p) => p.id === photo.id)
          ),
          photosToDelete: [],
          currentIndex: 0,
          stats: {
            totalPhotos: state.allPhotos.length - state.photosToDelete.length,
            reviewedPhotos: 0,
            photosToKeep: 0,
            photosToDelete: 0,
            estimatedSpaceFreed: 0,
          },
        });
      },

      // Computed
      getCurrentPhoto: () => {
        const state = get();
        return state.allPhotos[state.currentIndex] || null;
      },

      getProgress: () => {
        const state = get();
        if (state.stats.totalPhotos === 0) return 0;
        return (state.currentIndex / state.stats.totalPhotos) * 100;
      },
    }),
    {
      name: "photo-storage",
      storage: createJSONStorage(() => AsyncStorage),
      // Don't persist photos or currentIndex - only stats
      partialize: (state) => ({
        photosToDelete: state.photosToDelete,
        photosToKeep: state.photosToKeep,
      }),
    }
  )
);
