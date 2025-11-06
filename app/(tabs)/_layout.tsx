import { hasUnsyncedChanges } from '@nozbe/watermelondb/sync';
import NetInfo from '@react-native-community/netinfo';
import { Tabs } from 'expo-router';
import { useEffect } from 'react';

import TabBar from '@/components/tab-bar';
import database from '@/database';
import { useSync } from '@/database/hooks/useSync';

const TabLayout = () => {
  const { syncNow } = useSync();
  useEffect(() => {
    const checkAndSync = async () => {
      const netState = await NetInfo.fetch();
      if (!netState.isConnected) return;

      const unsynced = await hasUnsyncedChanges({ database });
      if (unsynced) {
        syncNow();
      }
    };

    checkAndSync();

    const interval = setInterval(checkAndSync, 10_000); // check every 10s
    return () => clearInterval(interval);
  }, [database]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: { display: 'flex' },
      }}
      tabBar={(props) => <TabBar {...props} />}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
        }}
      />
      <Tabs.Screen
        name="sales"
        options={{
          title: 'Sales',
        }}
      />
      <Tabs.Screen
        name="customer"
        options={{
          title: 'Customer',
        }}
      />
      <Tabs.Screen
        name="items"
        options={{
          title: 'Items',
        }}
      />
      <Tabs.Screen
        name="more"
        options={{
          title: 'More',
        }}
      />
    </Tabs>
  );
};

export default TabLayout;
