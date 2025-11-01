import { LinearGradient } from "expo-linear-gradient";
import { Text } from "../re-usables/text";
import { Dimensions, View, StyleSheet } from "react-native";
import { ArrowUp, TruckIcon, Wallet, Users } from "lucide-react-native";
import { observeDashboardAnalytics } from "@/database/services/analaytics.service";
import { useEffect, useState } from "react";
import { formatNumberWithComma } from "@/utils/format-number";

const { width } = Dimensions.get("window");
const CARD_MARGIN = 12;
const CARD_WIDTH = width / 2 - CARD_MARGIN * 2.3;

const DashBoardAnalaytics = () => {
  const DEFAULT_PRESET = "THIS_MONTH";
const [stats, setStats] = useState({
    totalSales: 0,
    totalExpenses: 0,
    totalCustomers: 0,
  });

  useEffect(() => {
    const subscription = observeDashboardAnalytics({
      dateRangePreset: DEFAULT_PRESET,
    }).subscribe((data) => {
      setStats(data);
    });

    return () => subscription.unsubscribe();
  }, []);
  const cardData = [
    {
      id: "1",
      title: "Sales",
      value: stats.totalSales,
      colors: ["#2AA63E", "#4CD964"],
      icon: <ArrowUp size={18} color="#2AA63E" />,
      type: "value",
    },
    {
      id: "2",
      title: "Purchases",
      value: "000",
      colors: ["#4D96FF", "#6EB8FF"],
      icon: <TruckIcon size={18} color="#4D96FF" />,
      type: "value",
    },
    {
      id: "3",
      title: "Expenses",
      value: stats.totalExpenses,
      colors: ["#FF6B6B", "#FF8787"],
      icon: <Wallet size={18} color="#FF6B6B" />,
      type: "value",
    },
    {
      id: "4",
      title: "Customers",
      value: stats.totalCustomers,
      colors: ["#A78BFA", "#6366F1"],
      icon: <Users size={18} color="#A78BFA" />,
      type: "count",
    },
  ];
  return (
    <View style={styles.container}>
      {cardData?.map((item) => (
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
            <Text style={styles.cardValue} numberOfLines={1}>
              {item.type === "value"
                ? formatNumberWithComma(item.value)
                : item.value}
            </Text>
            <Text
              style={{
                fontSize: 12,
                marginTop: 3,
                color: "#e2e2e2ff",
                fontFamily: "Poppins-Regular",
              }}
            >
              {item.title} of Month
            </Text>
          </LinearGradient>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    paddingHorizontal: CARD_MARGIN,
    paddingTop: 2,
    marginTop: 10,
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
    marginBottom: 2,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
  cardValue: {
    fontSize: 15,
    color: "#fff",
    fontFamily: "Poppins-SemiBold",
  },
});
export default DashBoardAnalaytics;
