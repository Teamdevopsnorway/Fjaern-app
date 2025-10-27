import { Platform } from "react-native";

// RevenueCat types (manual definitions to avoid import errors)
export type PurchasesPackage = {
  identifier: string;
  packageType: string;
  offeringIdentifier: string;
  presentedOfferingContext?: any;
  product: {
    priceString: string;
    price: number;
    currencyCode: string;
    identifier: string;
  };
};

type CustomerInfo = {
  entitlements: {
    active: Record<string, any>;
  };
};

// RevenueCat API Keys - SETT DISSE ETTER DU HAR LAGET REVENUECAT KONTO
const REVENUECAT_API_KEY = {
  ios: "appl_XXXXXXXXXXXXXXXXXXXXXXXX", // Erstatt med din iOS API key fra RevenueCat
  android: "goog_XXXXXXXXXXXXXXXXXXXXXXXX", // Erstatt med din Android API key
};

const ENTITLEMENT_ID = "pro";

// Mock mode flag - will be true until real API keys are added
const isMockMode = () => {
  const apiKey = Platform.select({
    ios: REVENUECAT_API_KEY.ios,
    android: REVENUECAT_API_KEY.android,
  });
  return !apiKey || apiKey.includes("XXXX");
};

// Mock packages for when RevenueCat is not configured
const MOCK_PACKAGES = {
  monthly: {
    identifier: "$rc_monthly",
    packageType: "MONTHLY",
    offeringIdentifier: "default",
    product: {
      priceString: "49 kr/måned",
      price: 49,
      currencyCode: "NOK",
      identifier: "monthly_sub",
    },
  } as PurchasesPackage,
  yearly: {
    identifier: "$rc_annual",
    packageType: "ANNUAL",
    offeringIdentifier: "default",
    product: {
      priceString: "399 kr/år",
      price: 399,
      currencyCode: "NOK",
      identifier: "yearly_sub",
    },
  } as PurchasesPackage,
};

/**
 * Initialiser RevenueCat
 * Kall denne i App.tsx når appen starter
 */
export const initializeRevenueCat = async (): Promise<void> => {
  if (isMockMode()) {
    console.log("[RevenueCat] Mock mode - using placeholder prices");
    console.log("[RevenueCat] Add real API keys to src/utils/revenueCat.ts to enable purchases");
    return;
  }

  try {
    // Try to import RevenueCat only if we have real keys
    const { default: Purchases } = require("react-native-purchases");

    const apiKey = Platform.select({
      ios: REVENUECAT_API_KEY.ios,
      android: REVENUECAT_API_KEY.android,
    });

    if (!apiKey) {
      console.error("[RevenueCat] No API key found for platform:", Platform.OS);
      return;
    }

    await Purchases.configure({ apiKey });
    console.log("[RevenueCat] Initialized successfully");
  } catch (error) {
    console.error("[RevenueCat] Failed to initialize:", error);
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
  if (isMockMode()) {
    console.log("[RevenueCat] Returning mock packages");
    return MOCK_PACKAGES;
  }

  try {
    const { default: Purchases } = require("react-native-purchases");
    const offerings = await Purchases.getOfferings();

    if (!offerings.current) {
      console.log("[RevenueCat] No current offering found");
      return { monthly: null, yearly: null };
    }

    const packages = offerings.current.availablePackages;

    const monthly = packages.find((pkg: any) => pkg.identifier === "$rc_monthly") || null;
    const yearly = packages.find((pkg: any) => pkg.identifier === "$rc_annual") || null;

    console.log("[RevenueCat] Loaded packages:", {
      monthly: monthly?.product.priceString,
      yearly: yearly?.product.priceString,
    });

    return { monthly, yearly };
  } catch (error) {
    console.error("[RevenueCat] Error loading packages:", error);
    // Return mock packages as fallback
    return MOCK_PACKAGES;
  }
};

/**
 * Kjøp et subscription package
 */
export const purchasePackage = async (
  pkg: PurchasesPackage
): Promise<{ success: boolean; customerInfo?: CustomerInfo }> => {
  if (isMockMode()) {
    console.log("[RevenueCat] Mock purchase - cannot complete without real API keys");
    throw new Error("RevenueCat er ikke konfigurert. Legg til API-nøkler for å aktivere kjøp.");
  }

  try {
    const { default: Purchases } = require("react-native-purchases");
    const { customerInfo } = await Purchases.purchasePackage(pkg);

    console.log("[RevenueCat] Purchase successful");
    return { success: true, customerInfo };
  } catch (error: any) {
    // User cancelled
    if (error.userCancelled) {
      console.log("[RevenueCat] User cancelled purchase");
      throw new Error("USER_CANCELLED");
    }

    console.error("[RevenueCat] Purchase error:", error);
    throw error;
  }
};

/**
 * Sjekk om brukeren har aktiv Pro subscription
 */
export const checkSubscriptionStatus = async (): Promise<boolean> => {
  if (isMockMode()) {
    console.log("[RevenueCat] Mock mode - subscription status unknown");
    return false;
  }

  try {
    const { default: Purchases } = require("react-native-purchases");
    const customerInfo = await Purchases.getCustomerInfo();
    const isPro = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    console.log("[RevenueCat] Subscription status:", isPro ? "Pro" : "Free");
    return isPro;
  } catch (error) {
    console.error("[RevenueCat] Error checking status:", error);
    return false;
  }
};

/**
 * Restore tidligere kjøp
 * Viktig for brukere som reinstallerer appen!
 */
export const restorePurchases = async (): Promise<boolean> => {
  if (isMockMode()) {
    console.log("[RevenueCat] Mock mode - cannot restore purchases without real API keys");
    throw new Error("RevenueCat er ikke konfigurert. Legg til API-nøkler for å gjenopprette kjøp.");
  }

  try {
    const { default: Purchases } = require("react-native-purchases");
    const customerInfo = await Purchases.restorePurchases();
    const isPro = customerInfo.entitlements.active[ENTITLEMENT_ID] !== undefined;

    console.log("[RevenueCat] Restore complete. Pro status:", isPro);
    return isPro;
  } catch (error) {
    console.error("[RevenueCat] Error restoring purchases:", error);
    throw error;
  }
};

/**
 * Logg ut brukeren (for testing)
 */
export const logoutRevenueCat = async (): Promise<void> => {
  if (isMockMode()) {
    console.log("[RevenueCat] Mock mode - no logout needed");
    return;
  }

  try {
    const { default: Purchases } = require("react-native-purchases");
    await Purchases.logOut();
    console.log("[RevenueCat] Logged out successfully");
  } catch (error) {
    console.error("[RevenueCat] Logout error:", error);
  }
};
