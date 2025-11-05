import { Text, View } from "react-native";
import { COLORS } from "@/constants/Colors";
import { useEffect, useMemo, useState } from "react";
import { observeSalesByPayments } from "@/database/services/analaytics.service";
import { formatNumberWithComma } from "@/utils/format-number";

const SalesBreakdownByMethod = () => {
  const [salesBreakdown, setSalesBreakdown] = useState<
    { label: string; value: number }[]
  >([]);
  useEffect(() => {
    const sub = observeSalesByPayments({
      dateRangePreset: "THIS_MONTH",
    }).subscribe(setSalesBreakdown);
    return () => sub.unsubscribe();
  }, []);

  const total = useMemo(() => {
    return salesBreakdown.reduce((acc, item) => acc + item.value, 0);
  }, [salesBreakdown]);

  const colors = [
    COLORS.primary,
    COLORS.success,
    COLORS.warning,
    COLORS.error,
    COLORS.notification,
  ];
  return (
    <View
      style={{
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 8,
        backgroundColor: "white",
        marginTop: 12,
      }}
    >
      <Text style={{ fontSize: 15, fontFamily: "Poppins-SemiBold" }}>
        Top Payment Methods
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Poppins-Regular",
          color: COLORS.textLight,
        }}
      >
        Sales breakdown by payment method
      </Text>
      <View style={{ marginTop: 12 }}>
        {salesBreakdown?.map((item, index) => (
          <View
            key={index}
            style={{
              height: 40,
              maxWidth: `${(Number(item.value) / total) * 100}%`,
              backgroundColor: colors[index],
              borderRadius: 5,
              marginVertical: 5,
            }}
          />
        ))}
      </View>
      <View style={{ marginTop: 30, flexDirection: "column", gap: 20 }}>
        {salesBreakdown?.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              justifyContent: "space-between",
            }}
          >
            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <View
                style={{
                  width: 30,
                  height: 30,
                  borderRadius: 5,
                  backgroundColor: colors[index],
                }}
              />
              <Text style={{ fontSize: 15, fontFamily: "Poppins-SemiBold" }}>
                {item.label}
              </Text>
            </View>
            <Text style={{ fontSize: 15, fontFamily: "Poppins-SemiBold" }}>
              {formatNumberWithComma(item?.value)}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

export default SalesBreakdownByMethod;
