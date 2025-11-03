import React, { useEffect, useState } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Text } from "@/components/re-usables/text";
import { COLORS } from "@/constants/Colors";
import { WINDOW_WIDTH } from "@/config/app.config";
import { observeSalesAnalytics } from "@/database/services/analaytics.service";
import { getDateFormat } from "@/utils/format-date";
import RTabs from "../re-usables/tabs";

const SalesOverviewChart = () => {
  const [chartData, setChartData] = useState<
    { label: string; value: number }[]
  >([]);

  useEffect(() => {
    const sub = observeSalesAnalytics({
      dateRangePreset: "THIS_MONTH",
    }).subscribe(setChartData);
    return () => sub.unsubscribe();
  }, []);

  if (chartData.length === 0) {
    return null;
  }
  return (
    <View style={styles.container}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Sales Overview</Text>
          <Text style={styles.subtitle}>Monthly Performance</Text>
        </View>
      </View>

      <View style={styles.chartContainer}>
        {chartData.length && (
          <LineChart
            data={{
              labels: chartData.map((item) =>
                getDateFormat(Number(new Date(item.label)), "BS", false, false),
              ),
              datasets: [
                {
                  data: chartData.map((item) => Number(item.value?.toFixed(2))),
                  color: (opacity = 1) => COLORS.primary, // Gradient line color
                  strokeWidth: 3,
                },
              ],
            }}
            width={WINDOW_WIDTH - 48}
            height={240}
            yAxisLabel="Rs "
            yAxisSuffix=""
            chartConfig={{
              backgroundColor: "#ffffff",
              backgroundGradientFrom: "#ffffff",
              backgroundGradientTo: "#ffffff",
              decimalPlaces: 0,
              color: (opacity = 1) =>
                `rgba(${hexToRgb(COLORS.primary)}, ${opacity})`,
              labelColor: (opacity = 1) => COLORS.textLight || "#666",
              style: {
                borderRadius: 16,
              },
              propsForDots: {
                r: "5",
                strokeWidth: "2",
                stroke: COLORS.primary,
                fill: "#fff",
              },
              propsForBackgroundLines: {
                strokeDasharray: "4", // solid lines
                stroke: "#ebe9e9ff",
                strokeWidth: 1,
              },
              propsForLabels: {
                fontSize: 11,
                fontFamily: "Poppins-Regular",
              },
            }}
            bezier
            style={styles.chart}
            withInnerLines={true}
            withOuterLines={true}
            withVerticalLines={false}
            withHorizontalLines={true}
            withVerticalLabels={true}
            withHorizontalLabels={true}
            fromZero
          />
        )}
      </View>
    </View>
  );
};

const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? `${parseInt(result[1], 16)}, ${parseInt(result[2], 16)}, ${parseInt(result[3], 16)}`
    : "0, 0, 0";
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    paddingHorizontal: 12,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontFamily: "Poppins-SemiBold",
    color: COLORS.text || "#000",
  },
  subtitle: {
    fontSize: 12,
    fontFamily: "Poppins-Regular",
    color: COLORS.textLight || "#666",
    marginTop: 2,
  },
  totalCard: {
    backgroundColor: COLORS.primary + "15" || "#f0f0f0",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  totalLabel: {
    fontSize: 10,
    fontFamily: "Poppins-Regular",
    color: COLORS.textLight || "#666",
    textAlign: "center",
  },
  totalValue: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: COLORS.primary,
    textAlign: "center",
  },
  chartContainer: {
    backgroundColor: "#fff",
    borderRadius: 8,
    paddingHorizontal: 1,
    paddingTop: 20,
  },
  chart: {
    borderRadius: 8,
  },
  statsRow: {
    flexDirection: "row",
    marginTop: 16,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  statItem: {
    flex: 1,
    alignItems: "center",
  },
  statItemBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: "#e0e0e0",
  },
  statLabel: {
    fontSize: 11,
    fontFamily: "Poppins-Regular",
    color: COLORS.textLight || "#666",
    marginBottom: 4,
  },
  statValue: {
    fontSize: 14,
    fontFamily: "Poppins-SemiBold",
    color: COLORS.text || "#000",
  },
});

export default SalesOverviewChart;
