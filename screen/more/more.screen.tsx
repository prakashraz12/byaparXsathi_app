import type React from "react";

import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  SafeAreaView,
  Alert,
  Linking,
  Share,
  type ViewStyle,
  type TextStyle,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import AlertModal from "@/components/re-usables/modal/alert-modal";
import { useState } from "react";
import { useUserStore } from "@/store/useUserStore";
import database from "@/database";
import { useSyncStore } from "@/store/useSync";
import { getDateFormat } from "@/utils/format-date";

import NetInfo from "@react-native-community/netinfo";
import { Toast } from "@/components/re-usables/custom-toaster/toast-service";
import { hasUnsyncedChanges } from "@nozbe/watermelondb/sync";
import { useSync } from "@/database/hooks/useSync";

type IconName = keyof typeof Ionicons.glyphMap;

interface SettingsCardProps {
  title: string;
  subtitle: string;
  onPress: () => void;
  iconColor: string;
  iconName: IconName;
  backgroundColor: string;
}

interface Styles {
  container: ViewStyle;
  scrollView: ViewStyle;
  header: ViewStyle;
  headerTitle: TextStyle;
  section: ViewStyle;
  logoutSection: ViewStyle;
  card: ViewStyle;
  cardContent: ViewStyle;
  leftContent: ViewStyle;
  iconContainer: ViewStyle;
  textContainer: ViewStyle;
  cardTitle: TextStyle;
  cardSubtitle: TextStyle;
  footer: ViewStyle;
  footerContent: ViewStyle;
  logoContainer: ViewStyle;
  companyText: TextStyle;
  legalContainer: ViewStyle;
  legalText: TextStyle;
  separator: TextStyle;
}

export const MoreScreen = () => {
  const [logoutModal, setLogOutModal] = useState(false);
  const [isLogOuting, setIsLogOuting] = useState(false);
  const { lastSynced } = useSyncStore();
  const { syncNow } = useSync();

  const { clearUser, clearToken } = useUserStore();

  const handleNavigation = (screenName: string): void => {
    // Replace with your navigation logic
    console.log(`Navigate to ${screenName}`);
    Alert.alert("Navigation", `Navigate to ${screenName}`);
  };

  const handleRateApp = async (): Promise<void> => {
    try {
      // Replace with your actual app store URLs
      const appStoreUrl = "https://apps.apple.com/app/your-app-id";
      const playStoreUrl =
        "https://play.google.com/store/apps/details?id=your.package.name";

      // You can detect platform and use appropriate URL
      const url = appStoreUrl; // or playStoreUrl for Android

      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert("Error", "Cannot open app store");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open app store");
    }
  };

  const handleShareApp = async (): Promise<void> => {
    try {
      const result = await Share.share({
        message:
          "Check out this amazing app! Download it now: https://your-app-link.com",
        title: "Share App",
      });
    } catch (error) {
      Alert.alert("Error", "Failed to share app");
    }
  };

  const handleLegalNavigation = async (
    type: "privacy" | "terms",
  ): Promise<void> => {
    try {
      // Replace these URLs with your actual privacy policy and terms URLs
      const urls = {
        privacy: "https://your-website.com/privacy-policy",
        terms: "https://your-website.com/terms-of-service",
      };

      const supported = await Linking.canOpenURL(urls[type]);
      if (supported) {
        await Linking.openURL(urls[type]);
      } else {
        Alert.alert(
          "Error",
          `Cannot open ${type === "privacy" ? "Privacy Policy" : "Terms of Service"}`,
        );
      }
    } catch (error) {
      Alert.alert("Error", "Failed to open link");
    }
  };

  const handleLogOut = async () => {
    try {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) {
        Toast.error("Please Connect to the internet to log out!");

        return;
      }

      const unSynced = await hasUnsyncedChanges({ database });

      setIsLogOuting(true);
      if (unSynced) {
        await syncNow();
      }

      clearUser();
      clearToken();

      await database.write(async () => {
        await database.unsafeResetDatabase();
      });

      setTimeout(() => {
        router.replace("/(routes)/onboarding");
        setIsLogOuting(false);
      }, 1000);
    } catch (error) {
      console.error("Error resetting database:", error);
      setIsLogOuting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Settings</Text>
        </View>

        <View style={styles.section}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => handleNavigation("Profile")}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "#007AFF15" },
                  ]}
                >
                  <Ionicons
                    name="person-circle-outline"
                    size={24}
                    color="#007AFF"
                  />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>My Profile</Text>
                  <Text style={styles.cardSubtitle}>
                    Manage your personal information
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => handleNavigation("Subscription")}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "#FF950015" },
                  ]}
                >
                  <Ionicons name="card-outline" size={24} color="#FF9500" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>My Subscription</Text>
                  <Text style={styles.cardSubtitle}>
                    View and manage your subscription
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => handleNavigation("Business Profile")}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "#34C75915" },
                  ]}
                >
                  <Ionicons name="business-outline" size={24} color="#34C759" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Business Profile</Text>
                  <Text style={styles.cardSubtitle}>
                    Manage your business information
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={styles.card} activeOpacity={0.7}>
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "#5856D615" },
                  ]}
                >
                  <Ionicons name="settings-outline" size={24} color="#5856D6" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>App Settings</Text>
                  <Text style={styles.cardSubtitle}>
                    Notifications, privacy, and more
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </View>
          </TouchableOpacity>

          {/* Rating and Share Cards */}
          <TouchableOpacity
            style={styles.card}
            onPress={handleRateApp}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "#FFD60A15" },
                  ]}
                >
                  <Ionicons name="star-outline" size={24} color="#FFD60A" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Rate App</Text>
                  <Text style={styles.cardSubtitle}>
                    Rate us on the App Store
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={handleShareApp}
            activeOpacity={0.7}
          >
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "#32D74B15" },
                  ]}
                >
                  <Ionicons name="share-outline" size={24} color="#32D74B" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Share App</Text>
                  <Text style={styles.cardSubtitle}>
                    Share with friends and family
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Logout Section - No gap above */}
        <View style={styles.logoutSection}>
          <TouchableOpacity
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => setLogOutModal(true)}
          >
            <View style={styles.cardContent}>
              <View style={styles.leftContent}>
                <View
                  style={[
                    styles.iconContainer,
                    { backgroundColor: "#FF3B3015" },
                  ]}
                >
                  <Ionicons name="log-out-outline" size={24} color="#FF3B30" />
                </View>
                <View style={styles.textContainer}>
                  <Text style={styles.cardTitle}>Logout</Text>
                  <Text style={styles.cardSubtitle}>
                    Sign out of your account
                  </Text>
                </View>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#C7C7CC" />
            </View>
          </TouchableOpacity>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <View style={styles.footerContent}>
            <View style={styles.logoContainer}>
              <Text style={styles.companyText}>
                Product of Hobby Tech Solutions © 2024
              </Text>
            </View>

            <View style={styles.legalContainer}>
              <TouchableOpacity
                onPress={() => handleLegalNavigation("privacy")}
              >
                <Text style={styles.legalText}>Privacy Policy</Text>
              </TouchableOpacity>
              <Text style={styles.separator}> • </Text>
              <TouchableOpacity onPress={() => handleLegalNavigation("terms")}>
                <Text style={styles.legalText}>Terms of Service</Text>
              </TouchableOpacity>
            </View>
            <Text>{lastSynced.toLocaleString()}</Text>
          </View>
        </View>
        <AlertModal
          type="danger"
          isLoading={isLogOuting}
          visible={logoutModal}
          title="Logout"
          message="Are you sure you want to logout?"
          onConfirm={() => {
            handleLogOut();
          }}
          onCancel={() => {
            setLogOutModal(false);
          }}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create<Styles>({
  container: {
    flex: 1,
    backgroundColor: "#F2F2F7",
  },
  scrollView: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    backgroundColor: "#F2F2F7",
  },
  headerTitle: {
    fontSize: 24,
    color: "#000",
    fontFamily: "Poppins-SemiBold",
  },
  section: {
    paddingHorizontal: 16,
  },
  logoutSection: {
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    marginBottom: 12,
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 16,
  },
  leftContent: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    color: "#000",
    marginBottom: 2,
    fontFamily: "Poppins-Regular",
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#8E8E93",
    fontFamily: "Poppins-Regular",
  },
  footer: {
    paddingHorizontal: 16,
    paddingBottom: 40,
    alignItems: "center",
  },
  footerContent: {
    alignItems: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  companyText: {
    fontSize: 12,
    color: "#8E8E93",
    fontFamily: "Poppins-Regular",
    marginLeft: 4,
  },
  legalContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  legalText: {
    fontSize: 12,
    color: "#007AFF",
    fontFamily: "Poppins-Regular",
  },
  separator: {
    fontSize: 12,
    color: "#8E8E93",
    fontFamily: "Poppins-Regular",
  },
});
