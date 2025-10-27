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
  dailyGoal: number; // User's daily goal (0 = no goal)
  dailyGoalReached: boolean;
}

interface GamificationState extends GamificationStats {
  // Actions
  incrementPhotosCleaned: (spaceFreed: number) => { milestone: boolean; milestoneNumber: number; dailyGoalReached: boolean };
  updateStreak: () => void;
  resetDailyStats: () => void;
  getSpaceSavedFormatted: () => string;
  getTodaySpaceSavedFormatted: () => string;
  setDailyGoal: (goal: number) => void;
  getDailyProgress: () => { current: number; goal: number; percentage: number };
}

const MILESTONE_INTERVAL = 20; // Celebrate every 20 photos

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
      dailyGoal: 0, // 0 means no goal set
      dailyGoalReached: false,

      // Actions
      incrementPhotosCleaned: (spaceFreed: number) => {
        const state = get();
        const newTotal = state.totalPhotosCleaned + 1;
        const newTodayTotal = state.todaysPhotosDeleted + 1;

        // Check if milestone reached
        const milestone = newTotal % MILESTONE_INTERVAL === 0;
        const milestoneNumber = milestone ? newTotal : 0;

        // Check if daily goal reached
        const dailyGoalJustReached =
          state.dailyGoal > 0 &&
          !state.dailyGoalReached &&
          newTodayTotal >= state.dailyGoal;

        set({
          totalPhotosCleaned: newTotal,
          totalSpaceSaved: state.totalSpaceSaved + spaceFreed,
          todaysPhotosDeleted: newTodayTotal,
          todaysSpaceSaved: state.todaysSpaceSaved + spaceFreed,
          milestonesReached: milestone
            ? [...state.milestonesReached, milestoneNumber]
            : state.milestonesReached,
          dailyGoalReached: dailyGoalJustReached || state.dailyGoalReached,
        });

        return { milestone, milestoneNumber, dailyGoalReached: dailyGoalJustReached };
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
            dailyGoalReached: false,
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

      setDailyGoal: (goal: number) => {
        set({ dailyGoal: goal });
      },

      getDailyProgress: () => {
        const state = get();
        const current = state.todaysPhotosDeleted;
        const goal = state.dailyGoal;
        const percentage = goal > 0 ? Math.min((current / goal) * 100, 100) : 0;
        return { current, goal, percentage };
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
