import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SlideUpModal } from "@/components/re-usables/modal/slide-up.modal";
import { COLORS } from "@/constants/Colors";
import { PaymentStatus } from "@/constants/payment-status";
import { formatNumberWithComma } from "@/utils/format-number";
import { Button } from "../re-usables/button";
import { ArrowLeft } from "lucide-react-native";

interface PaymentSlideUpProps {
  visible: boolean;
  onClose: () => void;
  paymentType: string | null;
  paymentStatus: string | null;
  setPaymentStatus: (status: any) => void;
  setPaymentModeSlideup: (slideup: boolean) => void;
  setPartiallyPaidAmount?: (amount: string) => void;
  partiallyPaidAmount?: string;
  totalAmount?: string;
  mode?: "sales" | "quick-sale";
  customerSelected?: boolean;
}

const PaymentStatusSlideUp = ({
  visible,
  onClose,
  paymentType,
  paymentStatus,
  setPaymentStatus,
  setPaymentModeSlideup,
  setPartiallyPaidAmount,
  partiallyPaidAmount,
  totalAmount,
  mode = "sales",
  customerSelected,
}: PaymentSlideUpProps) => {
  const balanceDue = Number(totalAmount) - Number(partiallyPaidAmount);

  return (
    <SlideUpModal
      visible={visible}
      onClose={onClose}
      title={
        paymentStatus !== PaymentStatus.PARTIALLY_PAID
          ? "Select Payment Status"
          : ""
      }
      height={
        paymentStatus === PaymentStatus.PARTIALLY_PAID
          ? 460
          : !customerSelected
            ? 350
            : 400
      }
    >
      <View style={[styles.container, {marginTop:paymentStatus !== PaymentStatus.PARTIALLY_PAID ? 20 : 0}]}>
        <>
          {paymentStatus === PaymentStatus.PARTIALLY_PAID &&
          mode === "quick-sale" && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 20,
                marginBottom: 20,
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  setPaymentStatus(null);
                  setPartiallyPaidAmount?.("");
                }}
              >
                <ArrowLeft size={25} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.title}>Select Payment Status</Text>
            </View>
          )}

          <View style={styles.optionsList}>
            {paymentStatus === null && (
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => {
                  setPaymentStatus("PAID");
                  paymentType === null &&
                    paymentType !== PaymentStatus.UNPAID &&
                    setPaymentModeSlideup(true);
                }}
              >
                <View style={[styles.iconContainer, styles.paidIconBg]}>
                  <Ionicons name="checkmark-circle" size={24} color="#10b981" />
                </View>
                <Text style={styles.optionText}>Paid</Text>
              </TouchableOpacity>
            )}

            {customerSelected && (
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => {
                  setPaymentStatus("PARTIALLY_PAID");
                  mode !== "quick-sale" && setPaymentModeSlideup(true);
                }}
              >
                <View style={[styles.iconContainer, styles.partialIconBg]}>
                  <Ionicons name="time" size={24} color="#f59e0b" />
                </View>
                <Text style={styles.optionText}>Partially Paid</Text>
              </TouchableOpacity>
            )}

            {paymentStatus === null && (
              <TouchableOpacity
                style={styles.optionCard}
                onPress={() => {
                  setPaymentStatus("UNPAID");
                }}
              >
                <View style={[styles.iconContainer, styles.unpaidIconBg]}>
                  <Ionicons name="close-circle" size={24} color="#ef4444" />
                </View>
                <Text style={styles.optionText}>Unpaid</Text>
              </TouchableOpacity>
            )}
          </View>
          {paymentStatus === PaymentStatus.PARTIALLY_PAID &&
            mode === "quick-sale" && (
              <View style={{ marginTop: 15 }}>
                <View style={styles.amountContainer}>
                  <View style={styles.totalAmountRow}>
                    <Text style={styles.labelText}>Total Amount</Text>
                    <Text style={styles.amountText}>
                      {formatNumberWithComma(totalAmount || "0")}
                    </Text>
                  </View>
                  <View style={styles.receivedAmountRow}>
                    <Text style={styles.labelText}>Received Amount</Text>
                    <TextInput
                      placeholder="0"
                      placeholderTextColor="#9ca3af"
                      keyboardType="numeric"
                      autoFocus
                      focusable
                      value={partiallyPaidAmount}
                      onChangeText={setPartiallyPaidAmount}
                      style={styles.amountInput}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginTop: 20,
                    marginBottom: 40,
                    marginHorizontal: 10,
                  }}
                >
                  <Text style={{ color: COLORS.error }}>Balance Due</Text>
                  <Text style={{ color: COLORS.error }}>
                    {formatNumberWithComma(balanceDue)}
                  </Text>
                </View>
                <Button
                  disabled={balanceDue <= 0 || partiallyPaidAmount === ""}
                  title="Continue"
                  onPress={() => setPaymentModeSlideup(true)}
                />
              </View>
            )}
        </>
      </View>
    </SlideUpModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: 10,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1f2937",
  },
  optionsList: {
    gap: 12,
  },
  optionCard: {
    backgroundColor: COLORS.background,
    padding: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
    justifyContent: "space-between",
  },
  selectedCard: {
    borderColor: COLORS.primary,
    backgroundColor: "#f0f9ff",
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  paidIconBg: {
    backgroundColor: "#d1fae5",
  },
  partialIconBg: {
    backgroundColor: "#fef3c7",
  },
  unpaidIconBg: {
    backgroundColor: "#fee2e2",
  },
  cashIconBg: {
    backgroundColor: "#d1fae5",
  },
  chequeIconBg: {
    backgroundColor: "#dbeafe",
  },
  onlineIconBg: {
    backgroundColor: "#fce7f3",
  },
  optionText: {
    fontSize: 18,
    color: "#374151",
    flex: 1,
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  amountContainer: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 6,
    marginTop: 10,
  },
  totalAmountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 20,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  receivedAmountRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  labelText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
  },
  amountText: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.success,
  },
  amountInput: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.text,
    textAlign: "right",
    minWidth: 100,
    maxWidth: 150,
    marginLeft: 20,
    padding: 0,
  },
});

export default PaymentStatusSlideUp;
