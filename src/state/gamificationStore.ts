import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface GamificationStats {
  currentStreak: number;
  longestStreak: number;
  lastActiveDate: string;
  totalPhotosCleaned: number;
  totalSpaceSaved: number;
  milestonesReached: number[];
  todaysPhotosDeleted: number;
  todaysSpaceSaved: number;
}

interface GamificationState extends GamificationStats {
  // Actions
  incrementPhotosCleaned: (spaceFreed: number) => { milestone: boolean; milestoneNumber: number };
  updateStreak: () => void;
  resetDailyStats: () => void;
  getSpaceSavedFormatted: () => string;
  getTodaySpaceSavedFormatted: () => string;
}

const MILESTONE_INTERVAL = 10; // Celebrate every 10 photos

export const useGamificationStore = create<GamificationState>()(
  persist(
    (set, get) => ({
      // Initial state
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: new Date().toDateString(),
      totalPhotosCleaned: 0,
      totalSpaceSaved: 0,
      milestonesReached: [],
      todaysPhotosDeleted: 0,
      todaysSpaceSaved: 0,

      // Actions
      incrementPhotosCleaned: (spaceFreed: number) => {
        const state = get();
        const newTotal = state.totalPhotosCleaned + 1;
        const newTodayTotal = state.todaysPhotosDeleted + 1;

        // Check if milestone reached
        const milestone = newTotal % MILESTONE_INTERVAL === 0;
        const milestoneNumber = milestone ? newTotal : 0;

        set({
          totalPhotosCleaned: newTotal,
          totalSpaceSaved: state.totalSpaceSaved + spaceFreed,
          todaysPhotosDeleted: newTodayTotal,
          todaysSpaceSaved: state.todaysSpaceSaved + spaceFreed,
          milestonesReached: milestone
            ? [...state.milestonesReached, milestoneNumber]
            : state.milestonesReached,
        });

        return { milestone, milestoneNumber };
      },

      updateStreak: () => {
        const state = get();
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (state.lastActiveDate === today) {
          // Already updated today
          return;
        } else if (state.lastActiveDate === yesterday) {
          // Continue streak
          const newStreak = state.currentStreak + 1;
          set({
            currentStreak: newStreak,
            longestStreak: Math.max(newStreak, state.longestStreak),
            lastActiveDate: today,
          });
        } else {
          // Streak broken
          set({
            currentStreak: 1,
            lastActiveDate: today,
          });
        }
      },

      resetDailyStats: () => {
        const today = new Date().toDateString();
        const state = get();

        if (state.lastActiveDate !== today) {
          set({
            todaysPhotosDeleted: 0,
            todaysSpaceSaved: 0,
          });
        }
      },

      getSpaceSavedFormatted: () => {
        const bytes = get().totalSpaceSaved;
        return formatBytes(bytes);
      },

      getTodaySpaceSavedFormatted: () => {
        const bytes = get().todaysSpaceSaved;
        return formatBytes(bytes);
      },
    }),
    {
      name: "gamification-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

// Helper function
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";

  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + " " + sizes[i];
}
