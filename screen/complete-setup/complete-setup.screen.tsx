import { BANNER_LOGO } from "@/assets";
import BadgeSelector from "@/components/re-usables/badge-selector";
import { Button } from "@/components/re-usables/button";
import { Toast } from "@/components/re-usables/custom-toaster/toast-service";
import Dropdown from "@/components/re-usables/drop-down";
import CustomInput from "@/components/re-usables/input";
import { Text } from "@/components/re-usables/text";
import { COLORS } from "@/constants/Colors";
import { SHOP_TYPES_OPTIONS } from "@/constants/shop-types";
import { shopService } from "@/database/services/shop.service";
import { syncDatabase } from "@/database/sync.service";
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
import { MapPin, Phone, Store, User } from "lucide-react-native";
import { Image, Pressable, View } from "react-native";

const CompleteSetUpScreen = () => {
  const { clearUser, setUser, setActiveShopId } = useUserStore();
  const { mutateAsync, isPending } = useAuthControllerCompleteSetup(
    apiOptions(
      undefined,
      async ({ data }: { data: CompletedSetupResponse }) => {
        await syncDatabase({ isFirstTime: true });
        await setUser({
          fullName: data.user.fullName,
          email: data.user.email,
          role: data.user.role,
          id: data.user.id.toString(),
          phoneNumber: data.user.phoneNumber,
          stage: data.user.stage,
          country: "",
          isDeleted: false,
          requestDeleteOn: "",
          createdAt: data.user.createdAt,
          updatedAt: data.user.updatedAt,
          shops: [],
        });

        setActiveShopId(data?.shop?.id || "");
        router.replace("/(tabs)");
      }
    )
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
      <View
        style={{
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          flex: 1,
          paddingVertical: 30,
        }}
      >
        <Image
          source={BANNER_LOGO}
          style={{ width: 150, height: 60 }}
          resizeMode="contain"
        />
        <Text style={{ fontSize: 24, fontFamily: "Poppins-SemiBold" }}>
          Hey, You almost there!
        </Text>
        <Text
          style={{ fontSize: 16, marginTop: 9, fontFamily: "Poppins-Regular" }}
        >
          Complete your setup to get started!
        </Text>
      </View>
      <View>
        <form.Field name="fullName">
          {(field) => {
            return (
              <CustomInput
                containerStyle={{ marginTop: 16 }}
                inputMode="text"
                placeholder="Full Name"
                leftIcon={<User />}
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                autoCapitalize="none"
                autoCorrect={false}
                error={field.state.meta.errors
                  .map((err: any) => err.message || String(err))
                  .join(", ")}
              />
            );
          }}
        </form.Field>

        <form.Field name="phoneNumber">
          {(field) => {
            return (
              <CustomInput
                containerStyle={{ marginTop: 10 }}
                inputMode="tel"
                placeholder="Phone Number"
                leftIcon={<Phone size={22} />}
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
            );
          }}
        </form.Field>
        <form.Field name="address">
          {(field) => {
            return (
              <CustomInput
                containerStyle={{ marginTop: 10 }}
                inputMode="text"
                placeholder="Address"
                leftIcon={<MapPin />}
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                autoCapitalize="none"
                autoCorrect={false}
                error={field.state.meta.errors
                  .map((err: any) => err.message || String(err))
                  .join(", ")}
              />
            );
          }}
        </form.Field>
        <form.Field name="shopName">
          {(field) => {
            return (
              <CustomInput
                containerStyle={{ marginTop: 10 }}
                inputMode="text"
                placeholder="Shop Name"
                leftIcon={<Store />}
                value={field.state.value}
                onChangeText={field.handleChange}
                onBlur={field.handleBlur}
                autoCapitalize="none"
                autoCorrect={false}
                error={field.state.meta.errors
                  .map((err: any) => err.message || String(err))
                  .join(", ")}
              />
            );
          }}
        </form.Field>
        <Text style={{ marginTop: 10, marginBottom: 10 }} bold>
          Shop Type
        </Text>
        <form.Field name="shopType">
          {(field) => {
            return (
              <BadgeSelector
                options={SHOP_TYPES_OPTIONS}
                value={field.state.value}
                onChange={(value) => field.handleChange(value)}
              />
            );
          }}
        </form.Field>
        <Button
          title="Continue"
          style={{ marginTop: 16 }}
          onPress={form.handleSubmit}
          disabled={isPending}
          loading={isPending}
        />

        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 16,
          }}
        >
          <Text>Not now?</Text>
          <Pressable
            onPress={() => {
              handleLogout();
            }}
          >
            <Text style={{ color: COLORS.primary, marginLeft: 10 }}>
              Logout
            </Text>
          </Pressable>
        </View>
      </View>
    </PXWrapper>
  );
};
export default CompleteSetUpScreen;
