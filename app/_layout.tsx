import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as BackgroundTask from "expo-background-task";
import * as TaskManager from "expo-task-manager";
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
import useBackgroundSync from "@/hooks/useBackgroundSync";
import { StatusBar } from "react-native";

const RootLayout = () => {
  const { updateAsync } = useBackgroundSync();
  const [fontsLoaded, fontError] = useFonts({
    "Poppins-Regular": Poppins_400Regular,
    "Poppins-Medium": Poppins_500Medium,
    "Poppins-SemiBold": Poppins_600SemiBold,
    "Poppins-Bold": Poppins_700Bold,
  });

  useEffect(() => {
    updateAsync();
  }, []);

  if (!fontsLoaded || fontError) {
    return null;
  }

  return (
    <TanstackProvider>
      <ToastProvider>
        <StatusBar  barStyle="light-content" />
        <Stack screenOptions={{ headerShown: false }}>
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
