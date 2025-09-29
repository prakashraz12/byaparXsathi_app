import { BANNER_LOGO } from "@/assets";
import { Button } from "@/components/re-usables/button";
import { Toast } from "@/components/re-usables/custom-toaster/toast-service";
import Dropdown from "@/components/re-usables/drop-down";
import CustomInput from "@/components/re-usables/input";
import { Text } from "@/components/re-usables/text";
import { COLORS } from "@/constants/Colors";
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
import { MapPin, Phone, Store, User } from "lucide-react-native";
import { Image, Pressable, View } from "react-native";

const CompleteSetUpScreen = () => {
  const { clearUser, user, setUser } = useUserStore();
  const { mutateAsync, isPending, isSuccess, isError, error } = useAuthControllerCompleteSetup(
    apiOptions(undefined, async ({data}:{data:CompletedSetupResponse}) => {
      const response = await shopService.createShop(
        {
          shopName: data.shop?.shopName,
          shopEmail: data.shop?.shopEmail,
          shopPhoneNumber: data.shop?.shopPhoneNumber,
          shopType: data.shop?.shopType,
          measuringUnits: JSON.stringify(data.shop?.measuringUnits),
          idx: data.shop?.idx,
        },
        user?.id?.toString() || ""
      );
      await setUser({
        fullName: data.user.fullName,
        email: data.user.email,
        role: data.user.role,
        id: data.user.id.toString(),
        phoneNumber: data.user.phoneNumber,
        stage: data.user.stage,
        country: "", 
        isDeleted:  false, 
        requestDeleteOn: "", 
        createdAt: data.user.createdAt,
        updatedAt: data.user.updatedAt,
        shops: [],
      });
      router.replace("/(tabs)");
    })
  );

  const form = useForm({
    defaultValues: {
      fullName: "",
      phoneNumber: "",
      address: "",
      shopName: "",
    },
    validators: {
      onChangeAsync: completeSchema,
    },
    onSubmit:  async({ value }: { value: TCompleteSchema }) => {
      
      await mutateAsync({
        body: {
          fullName: value.fullName,
          phoneNumber: value.phoneNumber,
          address: value.address,
          shopName: value.shopName,
          shopType: "CAFE",
          idx: `idx-kando-chaa`,
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
        <Dropdown
          data={[
            { label: "Option 1", value: "option1" },
            { label: "Option 2", value: "option2" },
          ]}
          placeholder="Select an option"
          onSelect={(item) => console.log(item)}
        />
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
