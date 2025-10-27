/**
 * In-App Purchase Handler for Fjærn Pro
 *
 * This file handles App Store purchases for the Pro subscription.
 *
 * TO IMPLEMENT:
 * 1. Install: bun add react-native-iap
 * 2. Configure App Store Connect with subscription product ID: "fjaern_pro_monthly"
 * 3. Add iOS capabilities in Xcode for In-App Purchases
 * 4. Test with sandbox accounts
 */

import { Alert } from "react-native";
import { useSubscriptionStore } from "../state/subscriptionStore";

// Product ID for App Store (configure in App Store Connect)
export const PRODUCT_ID = "fjaern_pro_monthly";

/**
 * Initialize IAP connection
 * Call this on app startup
 */
export const initializeIAP = async (): Promise<void> => {
  try {
    // TODO: When react-native-iap is installed, uncomment:
    // import * as IAP from 'react-native-iap';
    // await IAP.initConnection();
    // await IAP.flushFailedPurchasesCachedAsPendingAndroid();

    console.log("IAP initialized (mock)");
  } catch (error) {
    console.error("IAP initialization error:", error);
  }
};

/**
 * Get available products from App Store
 */
export const getProducts = async (): Promise<any[]> => {
  try {
    // TODO: When react-native-iap is installed, uncomment:
    // import * as IAP from 'react-native-iap';
    // const products = await IAP.getSubscriptions([PRODUCT_ID]);
    // return products;

    // Mock product for now
    return [
      {
        productId: PRODUCT_ID,
        title: "Fjærn Pro",
        description: "Ubegrenset bilderydding",
        price: "99 kr",
        localizedPrice: "99 kr",
      },
    ];
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
    // TODO: When react-native-iap is installed, uncomment:
    // import * as IAP from 'react-native-iap';
    //
    // const purchase = await IAP.requestSubscription(PRODUCT_ID);
    //
    // if (purchase) {
    //   // Verify purchase with your backend or directly
    //   await IAP.finishTransaction(purchase, false);
    //
    //   // Update local state
    //   useSubscriptionStore.getState().upgradeToPro();
    //   return true;
    // }

    // Mock purchase for testing
    Alert.alert(
      "Mock Purchase",
      "Dette er en testmodus. I produksjon vil dette åpne App Store betalingsdialog.\n\nTrykk OK for å simulere vellykket kjøp.",
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
  } catch (error: any) {
    console.error("Purchase error:", error);

    if (error.code === "E_USER_CANCELLED") {
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
    // TODO: When react-native-iap is installed, uncomment:
    // import * as IAP from 'react-native-iap';
    //
    // const purchases = await IAP.getAvailablePurchases();
    // const hasPro = purchases.some(p => p.productId === PRODUCT_ID);
    //
    // useSubscriptionStore.getState().restorePurchase(hasPro);
    //
    // if (hasPro) {
    //   Alert.alert("Kjøp gjenopprettet!", "Fjærn Pro er aktivert.");
    //   return true;
    // } else {
    //   Alert.alert("Ingen kjøp funnet", "Fant ingen tidligere kjøp å gjenopprette.");
    //   return false;
    // }

    // Mock restore
    Alert.alert(
      "Gjenopprett Kjøp",
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
    // TODO: When react-native-iap is installed, uncomment:
    // import * as IAP from 'react-native-iap';
    // await IAP.endConnection();

    console.log("IAP connection ended");
  } catch (error) {
    console.error("End IAP error:", error);
  }
};
