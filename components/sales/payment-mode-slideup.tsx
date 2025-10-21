"use client";

import { SlideUpModal } from "@/components/re-usables/modal/slide-up.modal";
import { Text } from "@/components/re-usables/text";
import { StyleSheet, TouchableOpacity, View, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import useShops from "@/database/hooks/useShops";
import { COLORS } from "@/constants/Colors";

interface PaymentModeSlideupProps {
  visible: boolean;
  onClose: () => void;
  paymentType: string;
  setPaymentType: (paymentType: string) => void;
}

const PaymentModeSlideup = ({
  visible,
  onClose,
  paymentType,
  setPaymentType,
}: PaymentModeSlideupProps) => {
  const { currentPaymentAccount } = useShops();
  return (
    <SlideUpModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
          <Text style={styles.title}>Select Payment Mode</Text>
        </View>

        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.optionsList}>
            {currentPaymentAccount?.map((account) => (
              <TouchableOpacity
                key={account.id}
                style={[
                  styles.optionCard,
                  paymentType === account.name && styles.selectedCard,
                ]}
                onPress={() => {
                  setPaymentType(account.name as string);
                  onClose();
                }}
              >
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 10,
                    flex: 1,
                  }}
                >
                  <View style={[styles.iconContainer]}>
                    <Ionicons
                      name={
                        account.name === "Bank"
                          ? "business"
                          : account.name === "Cash"
                            ? "cash"
                            : account?.name === "Online Wallet"
                              ? "wallet"
                              : "newspaper"
                      }
                      size={24}
                      color={
                        account.name === "Bank"
                          ? "#3b82f6"
                          : account.name === "Cash"
                            ? "#10b981"
                            : account?.name === "Online Wallet"
                              ? "#f59e0b"
                              : "#ef4444"
                      }
                    />
                  </View>
                  <Text style={styles.optionText}>{account.name}</Text>
                </View>
                <Text style={styles.balanceText}>{account.balance || 0}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>

        <TouchableOpacity style={styles.addAccountButton}>
          <Ionicons name="add-circle" size={20} color="#fff" />
          <Text style={styles.addAccountButtonText}>Add Account</Text>
        </TouchableOpacity>
      </View>
    </SlideUpModal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
    marginBottom: 16,
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
    borderColor: "#f3f4f6",
    justifyContent: "space-between",
  },
  selectedCard: {
    borderColor: "#3b82f6",
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
  balanceText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#1f2937",
  },
  backButton: {
    padding: 8,
    marginLeft: -8,
    marginBottom: 12,
    alignSelf: "flex-start",
  },
  addAccountButton: {
    backgroundColor: "#3b82f6",
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginTop: "auto",
  },
  addAccountButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default PaymentModeSlideup;
