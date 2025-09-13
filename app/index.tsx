import { useUserStore } from "@/store/useUserStore";
import OnboardingPage from "./(routes)/onboarding";
import { router } from "expo-router";
import { useEffect, useState } from "react";

const Home = () => {
  const user = useUserStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (user) {
      router.replace("/(tabs)");
    }
    setChecking(false);
  }, [mounted, user]);

  if (checking) {
    return null;
  }

  return <OnboardingPage />;
};

export default Home;
