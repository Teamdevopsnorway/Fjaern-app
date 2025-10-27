/**
 * In-App Purchase Handler for Fjærn Pro
 *
 * This file handles App Store purchases for the Pro subscription.
 *
 * SETUP REQUIRED IN APP STORE CONNECT:
 * 1. Create a subscription product with ID: "fjaern_pro_monthly"
 * 2. Enable In-App Purchase capability in your App ID
 * 3. Create a test sandbox account for testing
 * 4. Add product details (name, description, pricing)
 * 5. Submit for App Store review approval
 *
 * TESTING:
 * - Use a sandbox test account in Settings > App Store > Sandbox Account
 * - Test purchases are free and won't charge real money
 * - You can test multiple purchases/restores by deleting and reinstalling
 */

import { Alert, Platform } from "react-native";
import { useSubscriptionStore } from "../state/subscriptionStore";
import {
  initConnection,
  endConnection,
  fetchProducts,
  requestPurchase,
  finishTransaction,
  purchaseUpdatedListener,
  purchaseErrorListener,
  getAvailablePurchases,
  getActiveSubscriptions,
  PurchaseError,
  Product,
  Purchase,
  ErrorCode
} from "react-native-iap";

// Product ID for App Store (configure in App Store Connect)
export const PRODUCT_ID = "fjaern_pro_monthly";

// Purchase listener references for cleanup
let purchaseUpdateSubscription: any = null;
let purchaseErrorSubscription: any = null;

/**
 * Initialize IAP connection
 * Call this on app startup
 */
export const initializeIAP = async (): Promise<void> => {
  try {
    await initConnection();
    console.log("IAP connection initialized successfully");

    // Set up purchase listeners
    purchaseUpdateSubscription = purchaseUpdatedListener(async (purchase: Purchase) => {
      console.log("Purchase update:", purchase);

      const hasReceipt = purchase.transactionId && purchase.transactionDate;

      if (hasReceipt) {
        try {
          // For production: Validate receipt with your backend server
          // For now: Trust the purchase and activate Pro

          // Finish the transaction
          await finishTransaction({ purchase, isConsumable: false });

          // Update local state
          useSubscriptionStore.getState().upgradeToPro();

          console.log("Purchase successful, Pro activated");

          // Show success message
          Alert.alert(
            "Suksess!",
            "Du er nå Fjærn Pro! Ubegrenset rydding er aktivert. 🎉"
          );
        } catch (error) {
          console.error("Error finishing transaction:", error);
        }
      }
    });

    purchaseErrorSubscription = purchaseErrorListener((error: PurchaseError) => {
      console.warn("Purchase error:", error);

      // user-cancelled means user cancelled, no need to show error
      if (error.code === ErrorCode.UserCancelled) {
        return;
      }

      Alert.alert(
        "Kjøp feilet",
        error.message || "Kunne ikke fullføre kjøpet. Prøv igjen senere."
      );
    });

    // Check for existing purchases on initialization
    await checkExistingPurchases();

  } catch (error) {
    console.error("IAP initialization error:", error);
  }
};

/**
 * Check for existing active subscriptions
 */
const checkExistingPurchases = async (): Promise<void> => {
  try {
    // Check if user has active subscriptions
    const hasActive = await getActiveSubscriptions();

    if (hasActive && hasActive.length > 0) {
      const hasPro = hasActive.some((sub: any) => sub.productId === PRODUCT_ID);

      if (hasPro) {
        useSubscriptionStore.getState().restorePurchase(true);
        console.log("Active Pro subscription found and restored");
      }
    }
  } catch (error) {
    console.error("Error checking existing purchases:", error);
  }
};

/**
 * Get available products from App Store
 */
export const getProducts = async (): Promise<Product[]> => {
  try {
    const products = await fetchProducts({ skus: [PRODUCT_ID] });
    console.log("Fetched products:", products);
    return products || [];
  } catch (error) {
    console.error("Get products error:", error);
    return [];
  }
};

/**
 * Purchase Pro subscription
 */
export const purchaseProSubscription = async (): Promise<boolean> => {
  try {
    // Request the purchase (this triggers the purchase listeners)
    await requestPurchase({
      request: {
        ios: {
          sku: PRODUCT_ID,
        },
      },
      type: "subs",
    });

    // Return true to indicate purchase was initiated
    // The actual result will come through the purchaseUpdatedListener
    return true;

  } catch (error: any) {
    console.error("Purchase error:", error);

    if (error.code === ErrorCode.UserCancelled) {
      // User cancelled, no need to show error
      return false;
    }

    Alert.alert(
      "Kjøp feilet",
      "Kunne ikke fullføre kjøpet. Prøv igjen senere."
    );
    return false;
  }
};

/**
 * Restore previous purchases
 */
export const restorePurchases = async (): Promise<boolean> => {
  try {
    // Get all available purchases (not yet consumed/finished)
    const purchases = await getAvailablePurchases();
    console.log("Available purchases:", purchases);

    // Check for Pro subscription
    const hasPro = purchases.some((purchase: Purchase) =>
      purchase.productId === PRODUCT_ID
    );

    // Update state
    useSubscriptionStore.getState().restorePurchase(hasPro);

    if (hasPro) {
      Alert.alert("Kjøp gjenopprettet!", "Fjærn Pro er aktivert. 🎉");
      return true;
    } else {
      // Also check active subscriptions
      const activeSubscriptions = await getActiveSubscriptions();
      const hasActivePro = activeSubscriptions && activeSubscriptions.length > 0 &&
        activeSubscriptions.some((sub: any) => sub.productId === PRODUCT_ID);

      if (hasActivePro) {
        useSubscriptionStore.getState().restorePurchase(true);
        Alert.alert("Kjøp gjenopprettet!", "Fjærn Pro er aktivert. 🎉");
        return true;
      }

      Alert.alert("Ingen kjøp funnet", "Fant ingen tidligere kjøp å gjenopprette.");
      return false;
    }
  } catch (error) {
    console.error("Restore purchases error:", error);
    Alert.alert("Feil", "Kunne ikke gjenopprette kjøp. Prøv igjen senere.");
    return false;
  }
};

/**
 * End IAP connection
 * Call this on app shutdown
 */
export const endIAP = async (): Promise<void> => {
  try {
    // Remove listeners
    if (purchaseUpdateSubscription) {
      purchaseUpdateSubscription.remove();
      purchaseUpdateSubscription = null;
    }

    if (purchaseErrorSubscription) {
      purchaseErrorSubscription.remove();
      purchaseErrorSubscription = null;
    }

    // Close connection
    await endConnection();
    console.log("IAP connection ended");
  } catch (error) {
    console.error("End IAP error:", error);
  }
};
