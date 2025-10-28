import React from "react";
import { View, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { Text } from "@/components/re-usables/text";
import { COLORS } from "@/constants/Colors";
import { WINDOW_WIDTH } from "@/config/app.config";


const SalesOverviewChart = () => {
  return (
    <View style={{ marginVertical: 20 }}>
      {/* Title */}
      <Text
        style={{
          fontSize: 16,
          fontFamily: "Poppins-SemiBold",
          marginLeft: 12,
      
        }}
      >
        Sales Overview
      </Text>

      {/* Subtitle */}
      <Text
        style={{
          fontSize: 13,
          fontFamily: "Poppins-Regular",
          color: COLORS.textLight,
          marginLeft: 12,
          marginBottom: 12,
        }}
      >
        Here is your weekly sales (Sun – Sat)
      </Text>

      {/* Line Chart */}
      <LineChart
        data={{
          labels: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
          datasets: [
            {
              data: [200, 450, 280, 800, 990, 430, 700], // Example data
            },
          ],
        }}
        width={WINDOW_WIDTH - 24}
        height={220}
        yAxisLabel="Rs "
        chartConfig={{
          backgroundColor: "#ffff",
          backgroundGradientFrom: "#ffff",
          backgroundGradientTo: "#ffff",
        decimalPlaces: 0,
          color: () => COLORS.primary,
          labelColor: () => COLORS.primary,
          propsForDots: {
            r: "3",
            strokeWidth: "1",
            stroke: "#fff",
            
          },
        }}
        bezier
        style={{
          borderRadius: 5,
          marginHorizontal: 12,
          paddingTop:12
        }}
      />
    </View>
  );
};

export default SalesOverviewChart;
