import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SubscriptionState {
  // Subscription status
  isPro: boolean;

  // Free tier limits
  dailyDeleteCount: number;
  dailyDeleteLimit: number;
  lastResetDate: string;

  // Lifetime stats
  totalDeleted: number;

  // Actions
  incrementDeleteCount: () => { canDelete: boolean; remaining: number };
  resetDailyCount: () => void;
  upgradeToPro: () => void;
  hasReachedLimit: () => boolean;
  getRemainingDeletes: () => number;
}

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      // Initial state
      isPro: false,
      dailyDeleteCount: 0,
      dailyDeleteLimit: 30,
      lastResetDate: new Date().toDateString(),
      totalDeleted: 0,

      // Check and reset daily count if new day
      resetDailyCount: () => {
        const today = new Date().toDateString();
        const { lastResetDate } = get();

        if (today !== lastResetDate) {
          set({
            dailyDeleteCount: 0,
            lastResetDate: today,
          });
        }
      },

      // Increment delete count and return if user can continue
      incrementDeleteCount: () => {
        const { isPro, dailyDeleteCount, dailyDeleteLimit, totalDeleted } = get();

        // Check if new day and reset if needed
        get().resetDailyCount();

        // Pro users have unlimited
        if (isPro) {
          set({ totalDeleted: totalDeleted + 1 });
          return { canDelete: true, remaining: -1 };
        }

        // Free users check limit
        const newCount = dailyDeleteCount + 1;
        const remaining = dailyDeleteLimit - newCount;

        set({
          dailyDeleteCount: newCount,
          totalDeleted: totalDeleted + 1,
        });

        return {
          canDelete: newCount <= dailyDeleteLimit,
          remaining: Math.max(0, remaining),
        };
      },

      // Check if user has reached daily limit
      hasReachedLimit: () => {
        const { isPro, dailyDeleteCount, dailyDeleteLimit } = get();

        // Reset if new day
        get().resetDailyCount();

        if (isPro) return false;

        return dailyDeleteCount >= dailyDeleteLimit;
      },

      // Get remaining deletes for free users
      getRemainingDeletes: () => {
        const { isPro, dailyDeleteCount, dailyDeleteLimit } = get();

        // Reset if new day
        get().resetDailyCount();

        if (isPro) return -1; // Unlimited

        return Math.max(0, dailyDeleteLimit - dailyDeleteCount);
      },

      // Upgrade to Pro
      upgradeToPro: () => {
        set({ isPro: true });
      },
    }),
    {
      name: "subscription-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
