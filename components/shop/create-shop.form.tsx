import { WINDOW_HEIGHT } from "@/config/app.config";
import { COLORS } from "@/constants/Colors";
import { SHOP_TYPES_OPTIONS } from "@/constants/shop-types";
import { shopService } from "@/database/services/shop.service";
import { shopSchema } from "@/forms/schema/shop.schema";
import { useUserStore } from "@/store/useUserStore";
import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import { ChevronDown, ChevronUp } from "lucide-react-native";
import { useState } from "react";
import { ScrollView, TouchableOpacity, View } from "react-native";
import BadgeSelector from "../re-usables/badge-selector";
import { Button } from "../re-usables/button";
import CustomInput from "../re-usables/input";
import { Text } from "../re-usables/text";
import { Toast } from "../re-usables/custom-toaster/toast-service";
import { MEASURING_UNITS } from "@/constants/measuring-units";
import { SHOP_TYPE } from "@/types/shop";

const CreateShopForm = () => {
  const { user, setActiveShopId } = useUserStore();
  const [hideAddinationalFields, setHideAddinationalFields] =
    useState<boolean>(false);
  const { Field, handleSubmit } = useForm({
    defaultValues: {
      shopName: "",
      email: "",
      phoneNumber: "",
      address: "",
      panNumber: "",
      registrationNumber: "",
      shopType: "",
    },
    validators: {
      onChangeAsync: shopSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const measuringUnits = MEASURING_UNITS[value.shopType as SHOP_TYPE];
        const response = await shopService.createShop(
          {
            shopEmail: value.email,
            shopName: value.shopName,
            shopPhoneNumber: value.phoneNumber,
            address: value.address,
            panNumber: value.panNumber,
            registrationNumber: value.registrationNumber,
            shopType: value.shopType,
            measuringUnits: JSON.stringify(measuringUnits),
          },
          user?.id?.toString() || ""
        );
        if (response?.status === 201) {
          Toast.success("Shop Created");
          setActiveShopId(response?.shop?.idx || "");
          router.replace("/(tabs)");
        }
      } catch (error) {
        console.log(error);
      }
    },
  });


  return (
    <View
      style={{ flex: 1, position: "relative", height: WINDOW_HEIGHT - 100 }}
    >
      {/* Scrollable content */}
      <ScrollView
        style={{ flex: 1 }}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      >
        <Field name="shopName">
          {(field) => (
            <CustomInput
              containerStyle={{ marginTop: 10 }}
              inputMode="text"
              required
              label="Shop Name"
              placeholder="Enter Shop Name"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              autoCapitalize="none"
              autoCorrect={false}
              error={field.state.meta.errors
                .map((err: any) => err.message || String(err))
                .join(", ")}
            />
          )}
        </Field>

        <Field name="phoneNumber">
          {(field) => (
            <CustomInput
              containerStyle={{ marginTop: 5 }}
              inputMode="tel"
              label="Phone Number"
              placeholder="Enter Phone Number"
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
        </Field>

        <Field name="address">
          {(field) => (
            <CustomInput
              label="Address"
              required
              containerStyle={{ marginTop: 5 }}
              inputMode="text"
              placeholder="Enter Address"
              value={field.state.value}
              onChangeText={field.handleChange}
              onBlur={field.handleBlur}
              autoCapitalize="none"
              autoCorrect={false}
              error={field.state.meta.errors
                .map((err: any) => err.message || String(err))
                .join(", ")}
            />
          )}
        </Field>

        <Field name="shopType">
          {(field) => (
            <BadgeSelector
              required
              options={SHOP_TYPES_OPTIONS}
              label="Shop Type"
              value={field.state.value}
              onChange={field.handleChange}
            />
          )}
        </Field>
        <TouchableOpacity
          style={{
            flexDirection: "row",
            alignItems: "center",
            marginTop: 15,
          }}
          onPress={() => {
            setHideAddinationalFields(!hideAddinationalFields);
          }}
        >
          <Text
            style={{
              fontSize: 18,
              flexDirection: "row",
              alignItems: "center",
              gap: 5,
            }}
          >
            Additional Information{" "}
          </Text>
          <Text>
            {!hideAddinationalFields ? (
              <ChevronUp size={20} />
            ) : (
              <ChevronDown size={20} style={{ paddingTop: 20 }} />
            )}
          </Text>
        </TouchableOpacity>
        {!hideAddinationalFields && (
          <>
            <Field name="panNumber">
              {(field) => (
                <CustomInput
                  label="Pan Number"
                  containerStyle={{ marginTop: 10 }}
                  inputMode="text"
                  placeholder="Enter Pan Number"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={field.state.meta.errors
                    .map((err: any) => err.message || String(err))
                    .join(", ")}
                />
              )}
            </Field>
            <Field name="registrationNumber">
              {(field) => (
                <CustomInput
                  containerStyle={{ marginTop: 10, marginBottom: 20 }}
                  inputMode="text"
                  label="Registration Number"
                  placeholder="Enter Registration Number"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={field.state.meta.errors
                    .map((err: any) => err.message || String(err))
                    .join(", ")}
                />
              )}
            </Field>
            <Field name="email">
              {(field) => (
                <CustomInput
                  label="Shop Email"
                  containerStyle={{ marginTop: 5 }}
                  inputMode="email"
                  placeholder="Enter Shop Email"
                  value={field.state.value}
                  onChangeText={field.handleChange}
                  onBlur={field.handleBlur}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoCorrect={false}
                  error={field.state.meta.errors
                    .map((err: any) => err.message || String(err))
                    .join(", ")}
                />
              )}
            </Field>
          </>
        )}
      </ScrollView>

      {/* Absolute bottom buttons */}
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          flexDirection: "row",
          gap: 10,
          padding: 16,
          paddingBottom: 30,
          borderTopWidth: 1,
          borderTopColor: COLORS.border,
          backgroundColor: COLORS.background,
        }}
      >
        <Button
          variant="outline"
          title="Cancel"
          onPress={() => router.push("/(tabs)")}
        />
        <Button title="Save" style={{ flex: 1 }} onPress={handleSubmit} />
      </View>
    </View>
  );
};

export default CreateShopForm;
