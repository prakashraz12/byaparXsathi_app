import { View, StyleSheet, Dimensions, TouchableOpacity, useWindowDimensions } from "react-native";
import { Text } from "@/components/re-usables/text";
import PXWrapper from "@/layouts/px-wrapper";
import DashBoardTop from "@/components/dashbaord/sticky-top";
import { LinearGradient } from "expo-linear-gradient";
import * as BackgroundTask from "expo-background-task";
import {
  ArrowUp,
  Calculator,
  CloudUpload,
  Feather,
  TruckIcon,
  UserPlus,
  Users,
  Wallet,
} from "lucide-react-native";
import { COLORS } from "@/constants/Colors";
import UpgradeCard from "@/components/dashbaord/upgrade-card";
import SalesOverviewChart from "@/components/dashbaord/sales-chart";
import { useUserStore } from "@/store/useUserStore";
import { router } from "expo-router";
import SyncBanner from "@/components/sync-banner";
import { Button } from "@/components/re-usables/button";
import { syncDatabase } from "@/database/sync.service";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const CARD_WIDTH = width / 2 - CARD_MARGIN * 2.3;

export const ACTION_BUTTONS = [
  {
    id: "1",
    title: "Customer",
    icon: <UserPlus size={20} color={COLORS.primary} />,
    href: "/(routes)/customer",
  },
  {
    id: "2",
    title: "Quick Sales",
    icon: <Calculator size={20} color={COLORS.success} />,
    href: "/(routes)/sales/quick",
  },
  {
    id: "3",
    title: "Purchase",
    icon: <TruckIcon size={20} color={COLORS.accent} />,
    onPress: () => {},
  },
  {
    id: "4",
    title: "Expenses",
    icon: <Wallet size={20} color={COLORS.error} />,
    href: "/(routes)/finance/expenses",
  },
  {
    id: "5",
    title: "Items",
    icon: <Feather size={20} color={COLORS.accent} />,
    href: "/(routes)/items",
  },
];

const cardData = [
  {
    id: "1",
    title: "Sales",
    value: "Rs. 10,000",
    colors: ["#2AA63E", "#4CD964"],
    icon: <ArrowUp size={18} color="#2AA63E" />,
  },
  {
    id: "2",
    title: "Purchases",
    value: "50",
    colors: ["#FF6B6B", "#FF8787"],
    icon: <TruckIcon size={18} color="#FF6B6B" />,
  },
  {
    id: "3",
    title: "Expenses",
    value: "120",
    colors: ["#4D96FF", "#6EB8FF"],
    icon: <Wallet size={18} color="#4D96FF" />,
  },
  {
    id: "4",
    title: "Customers",
    value: "50",
    colors: ["#F3A712", "#FFD43B"],
    icon: <Users size={18} color="#F3A712" />,
  },
];

const DashboardScreen = () => {
  const user = useUserStore();
  return (
    <>
      <PXWrapper header={<DashBoardTop />} contentContainerStyle={{paddingHorizontal: 0}}>
        <Button
          title="sync"
          onPress={()=>syncDatabase({isFirstTime:false})}
        />
        <SyncBanner />
        <View style={{ padding: 12, marginBottom: 6 }}>
          <Text style={{ fontSize: 15, fontFamily: "Poppins-SemiBold" }}>
            Hello, {user?.user?.fullName}
          </Text>
          <Text
            style={{
              fontSize: 14,
              fontFamily: "Poppins-Regular",
              color: COLORS.textLight,
            }}
          >
            Here is your business insights.
          </Text>
        </View>

        <UpgradeCard />

        <View style={styles.container}>
          {cardData.map((item) => (
            <View key={item.id} style={styles.cardWrapper}>
              <LinearGradient
                colors={item.colors as any}
                start={[0, 1]}
                end={[0, 0]}
                style={styles.card}
              >
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor: `${item.colors[1]}`,
                      top: -30,
                      right: -20,
                    },
                  ]}
                />
                <View
                  style={[
                    styles.circle,
                    {
                      backgroundColor: `${item.colors[0]}`,
                      bottom: -20,
                      left: -25,
                      width: 60,
                      height: 60,
                    },
                  ]}
                />

                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Text style={styles.cardTitle}>{item.title}</Text>
                  <View
                    style={{
                      width: 30,
                      height: 30,
                      borderRadius: 25,
                      backgroundColor: "#fff",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {item.icon}
                  </View>
                </View>
                <Text style={styles.cardValue}>{item.value}</Text>
              </LinearGradient>
            </View>
          ))}
        </View>

        <View>
          <Text
            style={{
              fontSize: 15,
              fontFamily: "Poppins-SemiBold",
              padding: 12,
            }}
          >
            Quick Actions
          </Text>
          <View>
            <View style={styles.quickActions}>
              {ACTION_BUTTONS.map((item) => (
                <TouchableOpacity
                  key={item.id}
                  style={styles.quickActionCard}
                  onPress={() => router.push(item?.href || "")}
                >
                  {item.icon}
                  <Text style={styles.quickActionText}>{item.title}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
        <SalesOverviewChart />
      </PXWrapper>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 2,
    marginTop: 15,
  },
  quickActions: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 1,
    justifyContent: "space-between",
    gap: 10,
  },
  quickActionCard: {
    paddingVertical: 15,
    borderRadius: 5,
    backgroundColor: COLORS.background,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width: "48%",
    gap: 12,
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: COLORS.text,
    marginTop: 4,
    textAlign: "center",
  },
  cardWrapper: {
    width: CARD_WIDTH,
    marginBottom: CARD_MARGIN,
  },
  card: {
    height: 90,
    borderRadius: 5,
    overflow: "hidden",
    padding: 15,

    justifyContent: "center",
  },
  circle: {
    position: "absolute",
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  cardTitle: {
    fontSize: 14,
    marginBottom: 6,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  cardValue: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
});

export default DashboardScreen;
