import { router } from 'expo-router';
import { useEffect, useState } from 'react';

import { useUserStore } from '@/store/useUserStore';

import OnboardingPage from './(routes)/onboarding/index';

const Home = () => {
  const user = useUserStore((state) => state.user);
  const { activeShopId } = useUserStore();
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (user?.stage === 'CREATED') {
      router.replace('/(routes)/complete-setup');
    } else if (user?.stage === 'SET_UP_COMPLETED' && !activeShopId) {
      router.replace('/(routes)/shop/select');
    } else if (user?.stage === 'SET_UP_COMPLETED') {
      router.replace('/(tabs)');
    }
    setChecking(false);
  }, [mounted, user, activeShopId]);

  if (checking) {
    return null;
  }

  return <OnboardingPage />;
};

export default Home;
