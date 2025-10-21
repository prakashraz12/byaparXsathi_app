
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SlideUpModal } from "@/components/re-usables/modal/slide-up.modal";
import { COLORS } from "@/constants/Colors";

interface PaymentSlideUpProps {
  visible: boolean;
  onClose: () => void;
  paymentType: string | null ;
  paymentStatus: string | null;
  setPaymentStatus: (status: any) => void;
  setPaymentModeSlideup: (slideup: boolean) => void;
}

const PaymentSlideUp = ({
  visible,
  onClose,
  paymentType,
  paymentStatus,
  setPaymentStatus,
  setPaymentModeSlideup,
}: PaymentSlideUpProps) => {
  return (
    <SlideUpModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <>
          <Text style={styles.title}>Select Payment Status</Text>
          <View style={styles.optionsList}>
            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => {
                setPaymentStatus("PAID");
                onClose();
                paymentType === null && setPaymentModeSlideup(true);
              }}
            >
              <View style={[styles.iconContainer, styles.paidIconBg]}>
                <Ionicons name="checkmark-circle" size={24} color="#10b981" />
              </View>
              <Text style={styles.optionText}>Paid</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => {
                setPaymentStatus("PARTIALLY_PAID");
                onClose();
                paymentType === null && setPaymentModeSlideup(true);
              }}
            >
              <View style={[styles.iconContainer, styles.partialIconBg]}>
                <Ionicons name="time" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.optionText}>Partially Paid</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.optionCard}
              onPress={() => {
                setPaymentStatus("UNPAID");
                onClose();
                paymentType === null && setPaymentModeSlideup(true);
              }}
            >
              <View style={[styles.iconContainer, styles.unpaidIconBg]}>
                <Ionicons name="close-circle" size={24} color="#ef4444" />
              </View>
              <Text style={styles.optionText}>Unpaid</Text>
            </TouchableOpacity>
          </View>
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
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
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
});

export default PaymentSlideUp;
