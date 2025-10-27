import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";

interface SubscriptionState {
  // Free tier limit
  freeDeleteLimit: number;
  deletedCount: number;
  isPro: boolean;

  // Trial/subscription info
  trialEndsAt: string | null;
  subscriptionType: "free" | "pro" | null;

  // Actions
  incrementDeleteCount: () => boolean; // Returns true if limit reached
  hasReachedLimit: () => boolean;
  getRemainingDeletes: () => number;
  upgradeToPro: () => void;
  restorePurchase: (isPro: boolean) => void;
  resetForTesting: () => void;
}

const FREE_DELETE_LIMIT = 30;

export const useSubscriptionStore = create<SubscriptionState>()(
  persist(
    (set, get) => ({
      // Initial state
      freeDeleteLimit: FREE_DELETE_LIMIT,
      deletedCount: 0,
      isPro: false,
      trialEndsAt: null,
      subscriptionType: "free",

      // Actions
      incrementDeleteCount: () => {
        const state = get();
        if (state.isPro) {
          // Pro users have unlimited deletes
          return false;
        }

        const newCount = state.deletedCount + 1;
        set({ deletedCount: newCount });

        // Check if limit reached
        return newCount >= state.freeDeleteLimit;
      },

      hasReachedLimit: () => {
        const state = get();
        return !state.isPro && state.deletedCount >= state.freeDeleteLimit;
      },

      getRemainingDeletes: () => {
        const state = get();
        if (state.isPro) return -1; // Unlimited
        return Math.max(0, state.freeDeleteLimit - state.deletedCount);
      },

      upgradeToPro: () => {
        set({
          isPro: true,
          subscriptionType: "pro",
        });
      },

      restorePurchase: (isPro: boolean) => {
        set({
          isPro,
          subscriptionType: isPro ? "pro" : "free",
        });
      },

      resetForTesting: () => {
        set({
          deletedCount: 0,
          isPro: false,
          subscriptionType: "free",
        });
      },
    }),
    {
      name: "subscription-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
