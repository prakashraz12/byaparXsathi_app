import React, { useRef } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Animated,
} from "react-native";
import {
  CircleArrowUp,
  Home,
  LayoutGrid,
  User,
  Wallet,
} from "lucide-react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { COLORS } from "@/constants/Colors";

interface TabBarProps {
  state: any;
  navigation: any;
}

const TabBar = ({ state, navigation }: TabBarProps) => {
  const insets = useSafeAreaInsets();
  const animatedValues = useRef(
    state.routes.map(() => new Animated.Value(1))
  ).current;

  const icons: { [key: string]: any } = {
    index: Home,
    sales: CircleArrowUp,
    customer: User,
    billing: Wallet,
    more: LayoutGrid,
  };

  const labels: { [key: string]: string } = {
    index: "Home",
    sales: "Sales",
    customer: "Customer",
    billing: "Billing",
    more: "More",
  };

  const animateTab = (index: number) => {
    Animated.sequence([
      Animated.timing(animatedValues[index], {
        toValue: 0.85,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(animatedValues[index], {
        toValue: 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();
  };

  return (
    <View style={[styles.tabBar, { paddingBottom: insets.bottom }]}>
      {state.routes.map((route: any, index: number) => {
        const isFocused = state.index === index;
        const IconComponent = icons[route.name];

        const onPress = () => {
          animateTab(index);

          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            accessibilityRole="button"
            accessibilityState={isFocused ? { selected: true } : {}}
            onPress={onPress}
            activeOpacity={0.7}
            style={[
              styles.tabItem,
              {
                borderTopWidth: isFocused ? 2 : 0,
                borderTopColor: isFocused ? COLORS.primary : "transparent",
              },
            ]}
          >
            <Animated.View
              style={[
                styles.tabContent,
                {
                  transform: [{ scale: animatedValues[index] }],
                },
              ]}
            >
              <IconComponent
                size={22}
                color={isFocused ? COLORS.primary : COLORS.textLight}
              />
              <Text
                style={[
                  styles.tabLabel,
                  { color: isFocused ? COLORS.primary : COLORS.textLight },
                ]}
              >
                {labels[route.name]}
              </Text>
            </Animated.View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    paddingHorizontal: 5,
    borderTopColor: COLORS.border,
    borderTopWidth: 1,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    marginHorizontal: 2,
  },
  tabContent: {
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    marginTop: 6,
    textAlign: "center",
    textAlignVertical: "center",
  },
});

export default TabBar;
