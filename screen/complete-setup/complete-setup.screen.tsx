import { BANNER_LOGO } from "@/assets";
import BadgeSelector from "@/components/re-usables/badge-selector";
import { Button } from "@/components/re-usables/button";
import { Toast } from "@/components/re-usables/custom-toaster/toast-service";
import Dropdown from "@/components/re-usables/drop-down";
import CustomInput from "@/components/re-usables/input";
import { Text } from "@/components/re-usables/text";
import { COLORS } from "@/constants/Colors";
import { SHOP_TYPES_OPTIONS } from "@/constants/shop-types";
import { useSync } from "@/database/hooks/useSync";
import { shopService } from "@/database/services/shop.service";
import {
  completeSchema,
  TCompleteSchema,
} from "@/forms/schema/complete.schema";
import PXWrapper from "@/layouts/px-wrapper";
import { useAuthControllerCompleteSetup } from "@/service/queries-components";
import { CompletedSetupResponse } from "@/service/types-schemas";
import { useUserStore } from "@/store/useUserStore";
import { apiOptions } from "@/utils/api-options.util";
import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import { MapPin, Phone, Store, User, Sparkles } from "lucide-react-native";
import { Image, Pressable, View, ScrollView, StyleSheet } from "react-native";

const CompleteSetUpScreen = () => {
  const { clearUser, setUser, setActiveShopId } = useUserStore();
  const { syncNow } = useSync();

  const { mutateAsync, isPending } = useAuthControllerCompleteSetup(
    apiOptions(
      undefined,
      async ({ data }: { data: CompletedSetupResponse }) => {
        await syncNow({ isFirstTime: true, fetchShops: true });
        await setUser({
          fullName: data.user.fullName,
          email: data.user.email,
          role: data.user.role,
          id: data.user.id.toString(),
          phoneNumber: data.user.phoneNumber,
          stage: data.user.stage,
          country: data.user.country,
          isDeleted: false,
          requestDeleteOn: "",
          createdAt: data.user.createdAt,
          updatedAt: data.user.updatedAt,
        });

        setActiveShopId(data?.shop?.id || "");
        router.replace("/(tabs)");
      },
    ),
  );

  const form = useForm({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      address: "",
      shopName: "",
      shopType: "",
    },
    validators: {
      onChangeAsync: completeSchema,
    },
    onSubmit: async ({ value }: { value: TCompleteSchema }) => {
      await mutateAsync({
        body: {
          fullName: value.fullName,
          phoneNumber: value.phoneNumber,
          address: value.address,
          shopName: value.shopName,
          shopType: value.shopType,
          id: "",
        },
      });
    },
  });

  const handleLogout = async () => {
    await clearUser();
    router.replace("/(routes)/onboarding");
  };

  return (
    <PXWrapper>
      {/* Header Section with Gradient Background */}
      <View style={styles.headerContainer}>
        <View style={styles.logoContainer}>
          <Image
            source={BANNER_LOGO}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        <View style={styles.welcomeCard}>
          <View style={styles.sparkleIconContainer}>
            <Sparkles size={32} color={COLORS.primary} strokeWidth={2} />
          </View>
          <Text style={styles.title}>Almost There!</Text>
          <Text style={styles.subtitle}>
            Complete your profile to unlock your shop experience
          </Text>
        </View>
      </View>

      {/* Form Section */}
      <View style={styles.formContainer}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIndicator} />
          <Text style={styles.sectionTitle}>Personal Information</Text>
        </View>

        <form.Field name="fullName">
          {(field) => (
            <CustomInput
              containerStyle={styles.inputSpacing}
              inputMode="text"
              placeholder="Full Name"
              leftIcon={<User size={20} color={COLORS.primary} />}
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              autoCapitalize="words"
              autoCorrect={false}
              error={field.state.meta.errors
                .map((err: any) => err.message || String(err))
                .join(", ")}
            />
          )}
        </form.Field>

        <form.Field name="phoneNumber">
          {(field) => (
            <CustomInput
              containerStyle={styles.inputSpacing}
              inputMode="tel"
              placeholder="Phone Number"
              leftIcon={<Phone size={20} color={COLORS.primary} />}
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              keyboardType="phone-pad"
              autoCapitalize="none"
              autoCorrect={false}
              error={field.state.meta.errors
                .map((err: any) => err.message || String(err))
                .join(", ")}
            />
          )}
        </form.Field>

        <form.Field name="address">
          {(field) => (
            <CustomInput
              containerStyle={styles.inputSpacing}
              inputMode="text"
              placeholder="Address"
              leftIcon={<MapPin size={20} color={COLORS.primary} />}
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              autoCapitalize="words"
              autoCorrect={false}
              error={field.state.meta.errors
                .map((err: any) => err.message || String(err))
                .join(", ")}
            />
          )}
        </form.Field>

        <form.Field name="shopName">
          {(field) => (
            <CustomInput
              containerStyle={styles.inputSpacing}
              inputMode="text"
              placeholder="Shop Name"
              leftIcon={<Store size={20} color={COLORS.primary} />}
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              autoCapitalize="words"
              autoCorrect={false}
              error={field.state.meta.errors
                .map((err: any) => err.message || String(err))
                .join(", ")}
            />
          )}
        </form.Field>

        <View style={styles.sectionHeader}>
          <View style={styles.sectionIndicator} />
          <Text style={styles.sectionTitle}>Shop Type</Text>
        </View>

        <form.Field name="shopType">
          {(field) => (
            <BadgeSelector
              options={SHOP_TYPES_OPTIONS}
              value={field.state.value}
              onChange={(value) => field.handleChange(value)}
            />
          )}
        </form.Field>

        <Button
          title="Complete Setup"
          style={styles.submitButton}
          onPress={form.handleSubmit}
          disabled={isPending}
          loading={isPending}
        />

        <View style={styles.logoutContainer}>
          <Text style={styles.logoutText}>Not ready yet?</Text>
          <Pressable onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.logoutButtonText}>Logout</Text>
          </Pressable>
        </View>
      </View>
    </PXWrapper>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerContainer: {
    alignItems: "center",
    paddingTop: 40,
    paddingBottom: 30,
  },
  logoContainer: {
    marginBottom: 24,
  },
  logo: {
    width: 140,
    height: 56,
  },
  welcomeCard: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  sparkleIconContainer: {
    marginBottom: 12,
  },
  title: {
    fontSize: 28,
    fontFamily: "Poppins-Bold",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 15,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    opacity: 0.7,
    lineHeight: 22,
    maxWidth: 280,
  },
  formContainer: {
    paddingTop: 8,
    paddingBottom: 40,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 16,
  },
  sectionIndicator: {
    width: 4,
    height: 20,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
    marginRight: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
  },
  inputSpacing: {
    marginBottom: 14,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border || "#E5E7EB",
    marginVertical: 20,
    opacity: 0.3,
  },
  fieldLabel: {
    fontSize: 14,
    fontFamily: "Poppins-Medium",
    marginBottom: 12,
    marginTop: 4,
  },
  submitButton: {
    marginTop: 32,
    height: 52,
  },
  logoutContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
    paddingVertical: 8,
  },
  logoutText: {
    fontSize: 14,
    fontFamily: "Poppins-Regular",
    opacity: 0.6,
  },
  logoutButton: {
    marginLeft: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  logoutButtonText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: COLORS.primary,
  },
});

export default CompleteSetUpScreen;
