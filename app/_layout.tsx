import 'react-native-reanimated';

import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
} from '@expo-google-fonts/poppins';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { ToastProvider } from '@/components/re-usables/custom-toaster/custom-provider';
import TanstackProvider from '@/layouts/tanstack-provider';

const RootLayout = () => {
  const [fontsLoaded, fontError] = useFonts({
    'Poppins-Regular': Poppins_400Regular,
    'Poppins-Medium': Poppins_500Medium,
    'Poppins-SemiBold': Poppins_600SemiBold,
    'Poppins-Bold': Poppins_700Bold,
  });

  if (!fontsLoaded || fontError) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <TanstackProvider>
      <ToastProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <StatusBar style="dark" />
          <Stack.Screen name="index" />
          <Stack.Screen name="(routes)" />
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="syncing" />
        </Stack>
      </ToastProvider>
    </TanstackProvider>
    </SafeAreaProvider>
  );
};

export default RootLayout;
