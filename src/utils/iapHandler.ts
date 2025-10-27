/**
 * In-App Purchase Handler for Fjærn Pro
 *
 * This file handles App Store purchases for the Pro subscription.
 *
 * IMPORTANT: react-native-iap requires native iOS modules that must be built on macOS.
 * In the Vibecode preview environment (Linux), we use mock implementations for testing.
 * The real IAP functions will work when you build the app with EAS or on a Mac.
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

// Product ID for App Store (configure in App Store Connect)
export const PRODUCT_ID = "fjaern_pro_monthly";

// Check if we're in a build environment with native modules
const HAS_NATIVE_MODULES = (() => {
  try {
    // Try to require react-native-iap to see if native modules are available
    require("react-native-iap");
    return true;
  } catch (error) {
    console.log("react-native-iap native modules not available, using mock implementation");
    return false;
  }
})();

// Type definitions for IAP
type Purchase = any;
type PurchaseError = any;
type Product = any;

// Import real IAP functions only if native modules are available
let initConnection: any;
let endConnection: any;
let fetchProducts: any;
let requestPurchase: any;
let finishTransaction: any;
let purchaseUpdatedListener: any;
let purchaseErrorListener: any;
let getAvailablePurchases: any;
let getActiveSubscriptions: any;
let ErrorCode: any = { UserCancelled: "user-cancelled" };

if (HAS_NATIVE_MODULES) {
  const IAP = require("react-native-iap");
  initConnection = IAP.initConnection;
  endConnection = IAP.endConnection;
  fetchProducts = IAP.fetchProducts;
  requestPurchase = IAP.requestPurchase;
  finishTransaction = IAP.finishTransaction;
  purchaseUpdatedListener = IAP.purchaseUpdatedListener;
  purchaseErrorListener = IAP.purchaseErrorListener;
  getAvailablePurchases = IAP.getAvailablePurchases;
  getActiveSubscriptions = IAP.getActiveSubscriptions;
  ErrorCode = IAP.ErrorCode;
}

// Purchase listener references for cleanup
let purchaseUpdateSubscription: any = null;
let purchaseErrorSubscription: any = null;

/**
 * Initialize IAP connection
 * Call this on app startup
 */
export const initializeIAP = async (): Promise<void> => {
  try {
    if (!HAS_NATIVE_MODULES) {
      console.log("IAP initialized (mock mode for Vibecode preview)");
      return;
    }

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
    if (!HAS_NATIVE_MODULES) return;

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
    if (!HAS_NATIVE_MODULES) {
      // Mock product for preview
      return [
        {
          productId: PRODUCT_ID,
          title: "Fjærn Pro",
          description: "Ubegrenset bilderydding",
          price: "99 kr",
          localizedPrice: "99 kr",
        },
      ] as any;
    }

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
    if (!HAS_NATIVE_MODULES) {
      // Mock purchase for preview
      Alert.alert(
        "Demo Mode",
        "Dette er en demo i Vibecode preview. I produksjon vil dette åpne App Store betalingsdialog.\n\nTrykk OK for å simulere vellykket kjøp.",
        [
          {
            text: "Avbryt",
            style: "cancel",
          },
          {
            text: "OK",
            onPress: () => {
              useSubscriptionStore.getState().upgradeToPro();
              Alert.alert("Suksess!", "Du er nå Fjærn Pro! 🎉");
            },
          },
        ]
      );
      return true;
    }

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
    if (!HAS_NATIVE_MODULES) {
      // Mock restore for preview
      Alert.alert(
        "Demo Mode",
        "I produksjon vil dette sjekke App Store for tidligere kjøp.\n\nVil du simulere gjenoppretting?",
        [
          {
            text: "Nei",
            style: "cancel",
          },
          {
            text: "Ja",
            onPress: () => {
              useSubscriptionStore.getState().upgradeToPro();
              Alert.alert("Kjøp gjenopprettet!", "Fjærn Pro er aktivert. 🎉");
            },
          },
        ]
      );
      return true;
    }

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
    if (!HAS_NATIVE_MODULES) {
      console.log("IAP connection ended (mock mode)");
      return;
    }

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
