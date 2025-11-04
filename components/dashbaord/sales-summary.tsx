import { View } from "react-native";
import { Text } from "../re-usables/text";
import { COLORS } from "@/constants/Colors";
import { useEffect, useMemo, useState } from "react";
import { observeSalesSummary } from "@/database/services/analaytics.service";
import { formatNumberWithComma } from "@/utils/format-number";

const SalesSummary = () => {
  const [salesSummary, setSalesSummary] = useState<{
    paid: number;
    partialPaid: number;
    unpaid: number;
  }>({
    paid: 0,
    partialPaid: 0,
    unpaid: 0,
  });
  useEffect(() => {
    const sub = observeSalesSummary({
      dateRangePreset: "THIS_MONTH",
    }).subscribe(setSalesSummary);
    return () => sub.unsubscribe();
  }, []);

  const total = useMemo(() => {
    return salesSummary.paid + salesSummary.partialPaid + salesSummary.unpaid;
  }, [salesSummary]);
  const paidPercentage = useMemo(() => {
    return (salesSummary.paid / total) * 100;
  }, [salesSummary, total]);
  const partialPaidPercentage = useMemo(() => {
    return (salesSummary.partialPaid / total) * 100;
  }, [salesSummary, total]);
  const unpaidPercentage = useMemo(() => {
    return (salesSummary.unpaid / total) * 100;
  }, [salesSummary, total]);
  return (
    <View
      style={{
        padding: 12,
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginTop: 12,
        paddingHorizontal: 12,
      }}
    >
      <Text style={{ fontSize: 16, fontFamily: "Poppins-SemiBold" }}>
        Sales Summary
      </Text>
      <Text
        style={{ fontSize: 14, fontFamily: "Poppins-Regular", color: "#666" }}
      >
        Sales summary of this month
      </Text>
      <View
        style={{
          flexDirection: "row",
          marginTop: 15,
          alignItems: "center",
          gap: 4,
          maxWidth: "100%",
          overflow: "hidden",
        }}
      >
        <View
          style={{
            height: 40,
            width: `${paidPercentage - 1}%`,
            borderRadius: 5,
            backgroundColor: COLORS.success,
          }}
        />
        <View
          style={{
            height: 40,
            width: `${partialPaidPercentage - 1}%`,
            borderRadius: 5,
            backgroundColor: COLORS.primary,
          }}
        />
        <View
          style={{
            height: 40,
            width: `${unpaidPercentage - 1}%`,
            borderRadius: 5,
            backgroundColor: COLORS.error,
          }}
        />
      </View>
      <View style={{ marginTop: 20, flexDirection: "column", gap: 20 }}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 5,
                backgroundColor: COLORS.success,
              }}
            />
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins-SemiBold",
                marginLeft: 10,
              }}
            >
              Paid
            </Text>
          </View>

          <Text style={{ fontSize: 15, fontFamily: "Poppins-SemiBold" }}>
            {formatNumberWithComma(salesSummary?.paid)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 5,
                backgroundColor: COLORS.error,
              }}
            />
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins-SemiBold",
                marginLeft: 10,
              }}
            >
              Unpaid
            </Text>
          </View>

          <Text style={{ fontSize: 15, fontFamily: "Poppins-SemiBold" }}>
            {formatNumberWithComma(salesSummary?.unpaid)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
            <View
              style={{
                width: 30,
                height: 30,
                borderRadius: 5,
                backgroundColor: COLORS.primary,
              }}
            />
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins-SemiBold",
                marginLeft: 10,
              }}
            >
              Partial Paid
            </Text>
          </View>

          <Text style={{ fontSize: 15, fontFamily: "Poppins-SemiBold" }}>
            {formatNumberWithComma(salesSummary?.partialPaid)}
          </Text>
        </View>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            justifyContent: "space-between",
            marginTop: 10,
            borderTopWidth: 1,
            borderTopColor: COLORS.border,
            paddingTop: 15,
          }}
        >
          <Text style={{ fontSize: 15, fontFamily: "Poppins-SemiBold" }}>
            Total
          </Text>
          <Text style={{ fontSize: 15, fontFamily: "Poppins-SemiBold" }}>
            {formatNumberWithComma(total)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default SalesSummary;
