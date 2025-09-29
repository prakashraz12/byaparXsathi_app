import { Button } from "@/components/re-usables/button";
import { Header } from "@/components/re-usables/header";
import OTPInput from "@/components/re-usables/otp-input";
import { Text } from "@/components/re-usables/text";
import PXWrapper from "@/layouts/px-wrapper";
import {
  useAuthControllerWithEmail,
  useAuthControllerWithOtpLogin,
} from "@/service/queries-components";
import { TLoginWithOtpResponse } from "@/service/types-schemas";
import { useUserStore } from "@/store/useUserStore";
import { apiOptions } from "@/utils/api-options.util";
import { router, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable } from "react-native";

const OtpScreen = () => {
  const [otp, setOtp] = useState<string[]>(new Array(4).fill(""));
  const [countdown, setCountdown] = useState<number>(60);
  const { email } = useLocalSearchParams<{ email: string }>();

  const { setUser, setToken } = useUserStore();

  const { mutateAsync: verifyOtp, isPending } = useAuthControllerWithOtpLogin(
    apiOptions(undefined, (data: TLoginWithOtpResponse) => {
      setOtp(new Array(4).fill(""));
      setUser(data?.data);
      console.log(data)
      setToken(data?.data?.accessToken);

      if(data?.data?.stage === "CREATED"){ //if user is not create his first shop already navigate to create new one || else navigate to home
        router.replace("/(routes)/complete-setup");
      }else{
        router.replace("/(tabs)");
      }
    })
  );

  const { mutateAsync: resendOtp, isPending: resendOtpPending } =
    useAuthControllerWithEmail(
      apiOptions(undefined, () => {
        setCountdown(60);
        setOtp(new Array(4).fill(""));
      })
    );

  const handleSubmit = () => {
    if (!email || otp?.join("").trim().length < 4) return;
    verifyOtp({
      body: {
        email: email,
        otp: otp?.join(""),
      },
    });
  };

  const handleResendOtp = () => {
    if (!email) return;
    resendOtp({
      body: {
        email: email,
      },
    });
  };

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  return (
    <PXWrapper>
      <Header
        title="Back to login"
        onBackPress={() => {
          router.replace("/auth");
        }}
      />
      <Text
        style={{ marginTop: 40, marginBottom: 5, textAlign: "center" }}
        variant="h4"
      >
        Enter the OTP code
      </Text>
      <Text
        style={{
          textAlign: "center",
          marginTop: 5,
          marginBottom: 20,
          fontSize: 14,
        }}
      >
        We sent 4 digit code to {email}, Please check and enter the code.
      </Text>
      <OTPInput
        otp={otp}
        setOtp={setOtp}
        length={4}
        onComplete={() => handleSubmit()}
      />
      <Text
        style={{ marginTop: 20, marginBottom: 5, textAlign: "center" }}
        variant="h6"
      >
        Didn&apos;t receive the code?
      </Text>
      {countdown !== 0 ? (
        <Text
          style={{
            textAlign: "center",
            marginTop: 5,
            marginBottom: 20,
            fontSize: 14,
          }}
        >
          {countdown} seconds left
        </Text>
      ) : (
        <Pressable
          onPress={handleResendOtp}
          style={{ alignItems: "center", marginTop: 5, marginBottom: 10 }}
        >
          {resendOtpPending ? (
            <ActivityIndicator size="small" />
          ) : (
            <Text>Resend</Text>
          )}
        </Pressable>
      )}
      <Button
        title="Verify"
        size="medium"
        style={{ marginTop: 10 }}
        onPress={handleSubmit}
        disabled={isPending || resendOtpPending}
        loading={isPending}
      />
    </PXWrapper>
  );
};
export default OtpScreen;
