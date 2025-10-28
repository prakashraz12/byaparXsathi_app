import { Tabs } from "expo-router";
import TabBar from "@/components/tab-bar";


const TabLayout = () => {

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
          title: 'Home'
        }}
      />
      <Tabs.Screen 
        name="sales"
        options={{
          title: 'Sales'
        
        }}
      />
      <Tabs.Screen 
        name="customer"
        options={{
          title: 'Customer'
        }}
      />
      <Tabs.Screen 
        name="items"
        options={{
          title: 'Items'
        }}
      />
      <Tabs.Screen 
        name="more"
        options={{
          title: 'More'
        }}
      />
    </Tabs>
  );
};

export default TabLayout;

