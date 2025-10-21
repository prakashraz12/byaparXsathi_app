import { useUserStore } from "@/store/useUserStore";
import OnboardingPage from "./(routes)/onboarding/index";
import { router } from "expo-router";
import { useEffect, useState } from "react";
import { useSyncStore } from "@/store/useSync";

const Home = () => {
  const user = useUserStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;

    if (user?.stage === "CREATED") {
      router.replace("/(routes)/complete-setup");
    } else if (user?.stage === "SET_UP_COMPLETED") {
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
