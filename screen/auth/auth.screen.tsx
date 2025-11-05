import { Button } from "@/components/re-usables/button";
import { Header } from "@/components/re-usables/header";
import CustomInput from "@/components/re-usables/input";
import { Text } from "@/components/re-usables/text";
import { COLORS } from "@/constants/Colors";
import { withEmailSchema } from "@/forms/schema/with-email.schema";
import PXWrapper from "@/layouts/px-wrapper";
import { useAuthControllerWithEmail } from "@/service/queries-components";
import { apiOptions } from "@/utils/api-options.util";
import { getUserLocation } from "@/utils/get-user-info";
import { useForm } from "@tanstack/react-form";
import { router } from "expo-router";
import { Mail } from "lucide-react-native";
import { useState } from "react";
import { Pressable, StyleSheet, View } from "react-native";

const AuthScreen = () => {
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm({
    defaultValues: {
      email: "",
    },
    validators: {
      onChangeAsync: withEmailSchema,
    },
    onSubmit: async (data) => {
      setIsLoading(true);
      const { country, city, region, timezone, latitude, longitude } =
        await getUserLocation();
      login({
        body: {
          email: data?.value?.email,
          country,
          city,
          region,
          timezone,
          latitude,
          longitude,
        },
      });
      setIsLoading(false);
    },
  });
  const { mutateAsync: login, isPending } = useAuthControllerWithEmail(
    apiOptions(undefined, () => {
      router.push({
        pathname: "/(routes)/otp",
        params: { email: form.state.values.email },
      });
    }),
  );

  return (
    <PXWrapper>
      <Header title="Welcome Back!" onBackPress={() => router.replace("/")} />
      <Text
        variant="h5"
        style={{
          marginTop: 30,
          textAlign: "center",
          fontFamily: "Poppins-Bold",
        }}
      >
        Let&apos;s get started
      </Text>
      <Text variant="h6" style={{ marginTop: 2, textAlign: "center" }}>
        Enter your email to continue
      </Text>

      <form.Field name="email">
        {(field) => (
          <CustomInput
            containerStyle={{ marginTop: 24 }}
            inputMode="email"
            placeholder="Email"
            leftIcon={<Mail />}
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
      </form.Field>

      <Button
        title="Continue"
        size="medium"
        style={{ marginTop: 24 }}
        onPress={form.handleSubmit}
        disabled={isPending || isLoading}
        loading={isPending || isLoading}
      />

      <View style={styles.dividerContainer}>
        <View style={styles.dividerLine} />
        <Text style={styles.dividerText}>or</Text>
        <View style={styles.dividerLine} />
      </View>

      <Button
        title="Continue with Google"
        size="medium"
        variant="outline"
        style={styles.googleButton}
        textStyle={{ color: COLORS.textLight }}
      />
      <View
        style={{
          marginTop: 20,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
          gap: 5,
          flexWrap: "wrap",
        }}
      >
        <Text style={{ fontSize: 13 }}>By signing up, you agree to our </Text>
        <Pressable onPress={() => {}}>
          <Text style={{ color: COLORS.primary, fontSize: 12 }}>
            Terms and Conditions.
          </Text>
        </Pressable>
      </View>
    </PXWrapper>
  );
};

const styles = StyleSheet.create({
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 24,
    marginBottom: 8,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "#E5E5E5",
  },
  dividerText: {
    marginHorizontal: 16,
    color: "#666",
    fontSize: 14,
  },
  googleButton: {
    backgroundColor: "#fff",
    borderWidth: 1,
    marginTop: 18,
    borderColor: "#E5E5E5",
  },
});

export default AuthScreen;
