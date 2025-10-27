import Purchases, { PurchasesPackage, CustomerInfo } from "react-native-purchases";
import { Platform } from "react-native";

// RevenueCat API Keys - SETT DISSE ETTER DU HAR LAGET REVENUECAT KONTO
const REVENUECAT_API_KEY = {
  ios: "appl_XXXXXXXXXXXXXXXXXXXXXXXX", // Erstatt med din iOS API key fra RevenueCat
  android: "goog_XXXXXXXXXXXXXXXXXXXXXXXX", // Erstatt med din Android API key
};

/**
 * Initialiser RevenueCat
 * Kall denne i App.tsx når appen starter
 */
export const initializeRevenueCat = async () => {
  try {
    const apiKey = Platform.select({
      ios: REVENUECAT_API_KEY.ios,
      android: REVENUECAT_API_KEY.android,
    });

    if (!apiKey) {
      console.log("[RevenueCat] No API key found for platform");
      return;
    }

    // Sjekk om vi bruker mock key (ikke initialisert enda)
    if (apiKey.includes("XXXX")) {
      console.log("[RevenueCat] Using mock API key - purchases will not work");
      console.log("[RevenueCat] Please add your API key in src/utils/revenueCat.ts");
      return;
    }

    // Initialiser RevenueCat
    Purchases.configure({ apiKey });
    console.log("[RevenueCat] Initialized successfully");
  } catch (error) {
    console.error("[RevenueCat] Initialization error:", error);
  }
};

/**
 * Hent tilgjengelige subscription packages
 * Returns: { monthly, yearly }
 */
export const getSubscriptionPackages = async (): Promise<{
  monthly: PurchasesPackage | null;
  yearly: PurchasesPackage | null;
}> => {
  try {
    const offerings = await Purchases.getOfferings();

    if (!offerings.current) {
      console.log("[RevenueCat] No offerings found");
      return { monthly: null, yearly: null };
    }

    const packages = offerings.current.availablePackages;

    // Find monthly and yearly packages
    const monthly = packages.find((pkg) => pkg.identifier === "$rc_monthly") || null;
    const yearly = packages.find((pkg) => pkg.identifier === "$rc_annual") || null;

    console.log("[RevenueCat] Available packages:", {
      monthly: monthly?.product.identifier,
      yearly: yearly?.product.identifier,
    });

    return { monthly, yearly };
  } catch (error) {
    console.error("[RevenueCat] Error fetching packages:", error);
    return { monthly: null, yearly: null };
  }
};

/**
 * Kjøp et subscription package
 */
export const purchasePackage = async (
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo }> => {
  try {
    const { customerInfo } = await Purchases.purchasePackage(pkg);
    console.log("[RevenueCat] Purchase successful:", customerInfo);
    return { success: true, customerInfo };
  } catch (error: any) {
    if (error.userCancelled) {
      console.log("[RevenueCat] User cancelled purchase");
      return { success: false };
    }

    console.error("[RevenueCat] Purchase error:", error);
    return { success: false };
  }
};

/**
 * Sjekk om brukeren har aktiv Pro subscription
 */
export const checkSubscriptionStatus = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.getCustomerInfo();

    // Sjekk om brukeren har en aktiv entitlement
    const isPro = customerInfo.entitlements.active["pro"] !== undefined;

    console.log("[RevenueCat] Subscription status:", isPro);
    return isPro;
  } catch (error) {
    console.error("[RevenueCat] Error checking subscription:", error);
    return false;
  }
};

/**
 * Restore tidligere kjøp
 * Viktig for brukere som reinstallerer appen!
 */
export const restorePurchases = async (): Promise<boolean> => {
  try {
    const customerInfo = await Purchases.restorePurchases();
    const isPro = customerInfo.entitlements.active["pro"] !== undefined;

    console.log("[RevenueCat] Restore successful, isPro:", isPro);
    return isPro;
  } catch (error) {
    console.error("[RevenueCat] Restore error:", error);
    return false;
  }
};

/**
 * Logg ut brukeren (for testing)
 */
export const logoutRevenueCat = async (): Promise<void> => {
  try {
    await Purchases.logOut();
    console.log("[RevenueCat] Logged out successfully");
  } catch (error) {
    console.error("[RevenueCat] Logout error:", error);
  }
};
