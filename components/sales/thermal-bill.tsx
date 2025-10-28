/* eslint-disable @typescript-eslint/naming-convention */
import type React from "react";
import { View, ScrollView, StyleSheet } from "react-native";
import { Text } from "../re-usables/text";
import Shop from "@/database/model/shop.model";
import SalesItem from "@/database/model/sales-item.model";
import { nepaliCalendar } from "../re-usables/date-picker/calender-config";
import { formatNumberWithComma } from "@/utils/format-number";

interface Customer {
  name: string;
  phone?: string;
  address?: string;
}

interface ThermalBillProps {
  invoiceNumber: string;
  date: string;
  shop: Shop;
  customer: string;
  salesItems: SalesItem[];
  paymentType: "cash" | "credit" | "partially_paid";
  subtotal: number;
  tax: number;
  cumulativeDiscount: number;
  additionalCharges: number;
  remarks?: string;
  paidAmount?: number;
  status?: string;
}

const DashedDivider = () => (
  <View style={styles.dashedDividerContainer}>
    {Array(40)
      .fill(0)
      .map((_, i) => (
        <View key={i} style={styles.dash} />
      ))}
  </View>
);

const ThermalBill: React.FC<ThermalBillProps> = ({
  invoiceNumber,
  date,
  shop,
  customer,
  salesItems,
  paymentType,
  subtotal,
  tax,
  cumulativeDiscount,
  additionalCharges,
  remarks,
  paidAmount = 0,
  status = "",
}) => {
  const grandTotal = subtotal + tax + additionalCharges - cumulativeDiscount;
  const balanceAmount =
    paymentType === "partially_paid" ? grandTotal - paidAmount : 0;

  const adDateObj = new Date(date);
  const bsDateObj = nepaliCalendar.getBsDateByAdDate(
    adDateObj.getFullYear(),
    adDateObj.getMonth() + 1,
    adDateObj.getDate()
  );
  const formattedBsDate = nepaliCalendar.formatBsDateEN(bsDateObj, "YYYY-MM-DD");

  const getPaymentTypeLabel = () => {
    switch (paymentType) {
      case "cash":
        return "CASH SALE";
      case "credit":
        return "CREDIT SALE";
      case "partially_paid":
        return "PARTIALLY PAID";
      default:
        return "SALE";
    }
  };



  return (
    <View style={styles.container}>
      <View style={styles.billContainer}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.shopName}>{shop.shopName}</Text>
          <Text style={styles.shopPhone}>{shop.shopPhoneNumber}</Text>
          <Text style={styles.shopAddress}>{shop.address}</Text>
        </View>
        <Text
          style={{
            textAlign: "center",
            fontSize: 20,
            fontWeight: "bold",
            marginVertical: 4,
          }}
        >
          {getPaymentTypeLabel()}
        </Text>

        {/* Invoice Details */}
        <View style={styles.invoiceDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Invoice:</Text>
            <Text style={styles.detailValue}>{invoiceNumber}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Date:</Text>
            <Text style={styles.detailValue}>{formattedBsDate}</Text>
          </View>
          {/* <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Type:</Text>
            <Text style={[styles.detailValue, styles.paymentType]}>{getPaymentTypeLabel()}</Text>
          </View> */}
        </View>

        {/* Customer Details */}
        <View style={styles.customerSection}>
          <Text style={styles.sectionTitle}>TO : {customer}</Text>
        
        </View>

        <DashedDivider />

        {/* Items Header */}
        <View style={styles.itemsHeader}>
          <Text style={[styles.itemHeaderText, styles.itemNameCol]}>ITEMS</Text>
          <Text style={[styles.itemHeaderText, styles.itemQtyCol]}>QTY</Text>
          <Text style={[styles.itemHeaderText, styles.itemPriceCol]}>
            PRICE
          </Text>
          <Text style={[styles.itemHeaderText, styles.itemAmountCol]}>AMOUNT</Text>
        </View>

        <DashedDivider />

        <View style={styles.itemsContainer}>
          {salesItems?.length > 0 &&
            salesItems?.map((item) => (
              <View key={item.id}>
                <View style={styles.itemRow}>
                  <Text style={[styles.itemText, styles.itemNameCol]}>
                    {item?.itemName}
                  </Text>
                  <Text style={[styles.itemText, styles.itemQtyCol]}>
                    {item?.quantity} x
                  </Text>
                  <Text style={[styles.itemText, styles.itemPriceCol]}>
                    {formatNumberWithComma(Number(item?.price))}
                  </Text>
                  <Text style={[styles.itemText, styles.itemAmountCol]}>
                    {formatNumberWithComma(Number(item?.price) * Number(item?.quantity))}
                  </Text>
                </View>
                {/* {item.discount && item.discount > 0 && (
                  <View style={styles.discountRow}>
                    <Text style={styles.discountText}>
                      Discount: {formatCurrency(item.discount)}
                    </Text>
                  </View>
                )} */}
              </View>
            ))}
        </View>

        <DashedDivider />

        {/* Totals Section */}
        <View style={styles.totalsSection}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal:</Text>
            <Text style={styles.totalValue}>{formatNumberWithComma(subtotal)}</Text>
          </View>

          {cumulativeDiscount > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Discount:</Text>
              <Text style={[styles.totalValue, styles.discountAmount]}>
                -{formatNumberWithComma(cumulativeDiscount)}
              </Text>
            </View>
          )}

          {additionalCharges > 0 && (
            <View style={styles.totalRow}>
              <Text style={styles.totalLabel}>Additional Charges:</Text>
              <Text style={styles.totalValue}>
                +{formatNumberWithComma(additionalCharges)}
              </Text>
            </View>
          )}

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Tax:</Text>
            <Text style={styles.totalValue}>{formatNumberWithComma(tax)}</Text>
          </View>

          <DashedDivider />

          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>GRAND TOTAL:</Text>
            <Text style={styles.grandTotalValue}>
              {formatNumberWithComma(grandTotal)}
            </Text>
          </View>

          {status === "PARTIALLY_PAID" && (
            <>
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Paid Amount:</Text>
                <Text style={styles.totalValue}>
                  {formatNumberWithComma(paidAmount)}
                </Text>
              </View>
              <View style={styles.totalRow}>
                <Text style={[styles.totalLabel, styles.balanceLabel]}>
                  Balance Due:
                </Text>
                <Text style={[styles.totalValue, styles.balanceAmount]}>
                  {formatNumberWithComma(balanceAmount)}
                </Text>
              </View>
            </>
          )}
        </View>

        {remarks && (
          <>
            <DashedDivider />
            <View style={styles.remarksSection}>
              <Text style={styles.remarksLabel}>Remarks:</Text>
              <Text style={styles.remarksText}>{remarks}</Text>
            </View>
          </>
        )}

        <DashedDivider />
        <View style={styles.footer}>
          <Text style={styles.footerText}>Thank you!</Text>
          <Text style={{fontSize:10, color:"#888"}}>*This is electrical bill*</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius:5
  },
  billContainer: {
    paddingHorizontal: 20,
    paddingVertical:30,
    maxWidth: 400,
    alignSelf: "center",
    width:"100%",
    minHeight:650
  },
  header: {
    alignItems: "center",
    marginBottom: 4,
  },
  shopName: {
    fontSize: 20,
    textAlign: "center",
    marginBottom: 2,
  },
  shopPhone: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 1,
  },
  shopAddress: {
    fontSize: 14,
    textAlign: "center",
    color: "#888",
    marginBottom: 1,
  },
  dashedDividerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginVertical: 4,
    paddingHorizontal: 2,
  },
  dash: {
    width: 2,
    height: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 1,
  },
  invoiceDetails: {
    marginBottom: 2,
    marginTop: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  detailValue: {
    fontSize: 14,
  },
  paymentType: {
    fontWeight: "bold",
    color: "#d32f2f",
  },
  customerSection: {
    marginBottom: 2,
  },
  sectionTitle: {
    fontSize: 14,
    marginBottom: 2,
  },
  
  itemsHeader: {
    flexDirection: "row",
    marginBottom: 2,
  },
  itemHeaderText: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "center",
  },
  itemNameCol: {
    flex: 2,
    textAlign: "left",
  },
  itemQtyCol: {
    flex: 1,
  },
  itemPriceCol: {
    flex: 1.2,
  },
  itemAmountCol: {
    flex: 1.2,
  },
  itemsContainer: {
    marginBottom: 2,
  },
  itemRow: {
    flexDirection: "row",
    marginBottom: 3,
  },
  itemText: {
    fontSize: 13,
    textAlign: "center",
  },
  discountRow: {
    marginLeft: 12,
    marginBottom: 2,
  },
  discountText: {
    fontSize: 9,
    color: "#d32f2f",
    fontStyle: "italic",
  },
  totalsSection: {
    marginBottom: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 2,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: "600",
  },
  totalValue: {
    fontSize: 14,
    textAlign: "right",
  },
  discountAmount: {
    color: "#d32f2f",
  },
  grandTotalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 3,
    marginBottom: 3,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: "bold",
  },
  grandTotalValue: {
    fontSize: 14,
    fontWeight: "bold",
    textAlign: "right",
  },
  balanceLabel: {
    color: "#d32f2f",
  },
  balanceAmount: {
    color: "#d32f2f",
    fontWeight: "bold",
  },
  remarksSection: {
    marginBottom: 4,
  },
  remarksLabel: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 1,
  },
  remarksText: {
    fontSize: 14,
    color: "#888",
    marginTop:8
  },
  footer: {
    alignItems: "center",
    marginTop:15
  },
  footerText: {
    fontSize: 12,
    textAlign: "center",
    color: "#888",
    marginBottom: 1,
  },
});

export default ThermalBill;
