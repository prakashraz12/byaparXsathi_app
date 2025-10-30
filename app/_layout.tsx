import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import "react-native-reanimated";

import { ToastProvider } from "@/components/re-usables/custom-toaster/custom-provider";
import TanstackProvider from "@/layouts/tanstack-provider";
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from "@expo-google-fonts/poppins";

import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";

const RootLayout = () => {
  // const { registerTaskAsync } = useBackgroundSync();
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
  });

  // useEffect(() => {
  //   const init = async () => {
  //     await registerTaskAsync();
  //   };
  //   init();
  // }, []);

  if (!fontsLoaded || fontError) {
    return null;
  }

  return (
    <TanstackProvider>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <StatusBar style="light" />
          <Stack.Screen name="index" />
          <Stack.Screen name="(routes)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="syncing" />
        </Stack>
      </ToastProvider>
    </TanstackProvider>
  );
};

export default RootLayout;
