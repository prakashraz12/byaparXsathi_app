import { Text, View } from "react-native";
import { useEffect, useState } from "react";
import { observeTopSaleItems } from "@/database/services/analaytics.service";
import { COLORS } from "@/constants/Colors";
import { formatNumberWithComma } from "@/utils/format-number";

const TopSalesItems = () => {
  const [topSalesItems, setTopSalesItems] = useState<
    {
      label: string;
      totalAmount: number;
      timesSold: number;
      profitOrLoss: number;
    }[]
  >([]);
  useEffect(() => {
    const sub = observeTopSaleItems({
      dateRangePreset: "THIS_MONTH",
    }).subscribe(setTopSalesItems);
    return () => sub.unsubscribe();
  }, []);
  return (
    <View
      style={{
        padding: 20,
        backgroundColor: "white",
        borderRadius: 8,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginTop: 12,
        paddingHorizontal: 20,
      }}
    >
      <Text style={{ fontSize: 15, fontFamily: "Poppins-SemiBold" }}>
        Top Sales Items
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontFamily: "Poppins-Regular",
          color: COLORS.textLight,
        }}
      >
        Top sales items of this month
      </Text>
      <View style={{ marginTop: 12, flexDirection: "column", gap: 10 }}>
        {topSalesItems.map((item, index) => (
          <View
            key={index}
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              width: "100%",
            }}
          >
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins-Medium",
                color: COLORS.textLight,
                width: "8%",
              }}
            >
              #{index + 1}
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontFamily: "Poppins-Medium",
                width: "30%",
              }}
              numberOfLines={1}
            >
              {item.label}
            </Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 10 }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins-Medium",
                  width: "30%",
                }}
                numberOfLines={1}
              >
                {item?.timesSold}x Sold
              </Text>

              <Text
                style={{
                  fontSize: 14,
                  fontFamily: "Poppins-Medium",
                  textAlign: "right",
                  width: "40%",
                }}
                numberOfLines={1}
              >
                {formatNumberWithComma(item?.totalAmount)}
              </Text>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

export default TopSalesItems;
