import { nepaliCalendar } from "@/components/re-usables/date-picker/calender-config";
import { Text } from "@/components/re-usables/text";
import { COLORS } from "@/constants/Colors";
import { getDateFormat } from "@/utils/format-date";
import { formatNumberWithComma } from "@/utils/format-number";
import { Link } from "expo-router";
import { Calendar } from "lucide-react-native";
import { View, StyleSheet } from "react-native";

interface SalesCardProps {
  invoiceNumber: string;
  invoiceDate: number;
  grandTotalAmount: number;
  paymentStatus: string;
  paymentType: string;
  id: string;
}

const SalesCard = ({
  invoiceNumber,
  invoiceDate,
  grandTotalAmount,
  paymentStatus,
  paymentType,
  id,
}: SalesCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PAID":
        return COLORS.success;
      case "UN_PAID":
        return COLORS.error;
      case "PARTIALLY_PAID":
        return COLORS.warning;
      default:
        return COLORS.notification;
    }
  };

  return (
    <Link href={`/sales/${id}`} style={{ width: "100%", marginBottom: 15 }}>
      <View style={styles.card}>
        <View style={styles.leftSection}>
          <Text style={[styles.invoiceNumber, { color: COLORS.primary }]}>
            #{invoiceNumber}
          </Text>
          <Text style={styles.title}>{paymentType}</Text>
          <Text style={styles.dateTime}>
            {getDateFormat(Number(invoiceDate), "BS", true, true)}
          </Text>
        </View>

        <View style={styles.rightSection}>
          <Text style={[styles.amountValue, { color: COLORS.success }]}>
            {formatNumberWithComma(grandTotalAmount)}
          </Text>
          <View
            style={[
              styles.statusBadge,
              { backgroundColor: getStatusColor(paymentStatus) },
            ]}
          >
            <Text style={styles.statusText}>{paymentStatus}</Text>
          </View>
        </View>
      </View>
    </Link>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 12,
    marginVertical: 4,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  leftSection: {
    flex: 1,
    gap: 2,
  },
  invoiceNumber: {
    fontSize: 14,
    fontWeight: "600",
  },
  title: {
    fontSize: 15,
    color: "#1f2937",
    fontFamily: "Poppins-Medium",
  },
  dateTime: {
    fontSize: 14,
    color: "#6b7280",
    fontWeight: "400",
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  rightSection: {
    alignItems: "flex-end",
    gap: 6,
  },
  amountValue: {
    fontSize: 16,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ffffff",
  },
});

export default SalesCard;
