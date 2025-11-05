import { Button } from "@/components/re-usables/button";
import { Toast } from "@/components/re-usables/custom-toaster/toast-service";
import DatePicker from "@/components/re-usables/date-picker/date-picker";
import { Header } from "@/components/re-usables/header";
import CustomInput from "@/components/re-usables/input";
import { SlideUpModal } from "@/components/re-usables/modal/slide-up.modal";
import NotFound from "@/components/re-usables/not-found";
import { COLORS } from "@/constants/Colors";
import useShops from "@/database/hooks/useShops";
import { customerService } from "@/database/services/customer.service";
import PXWrapper from "@/layouts/px-wrapper";
import { useUserStore } from "@/store/useUserStore";
import { formatNumberWithComma } from "@/utils/format-number";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import { Calendar, ChevronLeft, ChevronRight } from "lucide-react-native";
import { useEffect, useRef, useState } from "react";
import {
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const PaymentIn = () => {
  const { id } = useLocalSearchParams();
  const { activeShopId } = useUserStore();
  const [paymentId, setPaymentId] = useState<string | null>(null);
  const [paymentInDate, setPaymentInDate] = useState<Date>(new Date());
  const [remarks, setRemarks] = useState<string | null>(null);
  const [amount, setAmount] = useState<string>("");

  const [visible, setVisible] = useState(false);
  const amountInputRef = useRef<TextInput>(null);

  const { currentPaymentAccount } = useShops();

  const handleAddPaymentIn = async () => {
    if (!activeShopId || !paymentId || !paymentInDate || !amount) {
      return;
    }

    const response = await customerService.addPaymentIn({
      shopId: activeShopId,
      paymentId,
      paymentInDate: new Date(paymentInDate)?.getTime()?.toString(),
      remarks: remarks || "",
      amount: Number(amount),
    });

    console.log(response);

    if (response && response?.success) {
      Toast.success(response?.message);
      router.back();
    }
  };

  useEffect(() => {
    if (
      currentPaymentAccount &&
      currentPaymentAccount.length > 0 &&
      paymentId === null
    ) {
      const findCashAccountId = currentPaymentAccount?.find(
        (account) => account?.name === "Cash",
      );
      if (findCashAccountId) {
        setPaymentId(findCashAccountId?.id);
      }
    }
  }, [currentPaymentAccount]);

  const isDisabled = !paymentId || !paymentInDate || !amount;
  return (
    <PXWrapper
      header={<Header title="Payment In" onBackPress={() => router.back()} />}
    >
      <View
        style={{
          flexDirection: "row",
          gap: 10,
          borderWidth: 1,
          borderRadius: 6,
          borderColor: COLORS.border,
          backgroundColor: "white",
          marginTop: 15,
          flex: 1,
        }}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() => amountInputRef.current?.focus()}
          style={{
            padding: 15,
            borderRightWidth: 1,
            borderColor: COLORS.border,
            flex: 1,
          }}
        >
          <Text style={{ fontSize: 14, fontWeight: "500", color: COLORS.text }}>
            Amount Received
          </Text>
          <TextInput
            ref={amountInputRef}
            placeholder="0"
            placeholderTextColor="#9ca3af"
            keyboardType="numeric"
            autoFocus
            focusable
            style={styles.amountInput}
            value={amount}
            onChangeText={setAmount}
          />
        </TouchableOpacity>

        <View style={{ flex: 1 }}>
          <DatePicker
            selectedDate={paymentInDate}
            onDateChange={(date) => setPaymentInDate(date)}
            renderCustomSelection={({ onPress, formattedDate }) => (
              <TouchableOpacity
                onPress={onPress}
                style={{
                  padding: 15,
                  alignItems: "flex-end",
                  justifyContent: "center",
                  flexDirection: "column",
                  gap: 5,
                  height: "100%",
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: "500",
                    color: COLORS.text,
                  }}
                >
                  Payment Date
                </Text>
                <View
                  style={{
                    flexDirection: "row",
                    alignItems: "center",
                    gap: 5,
                    marginTop: 10,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 14,
                      fontWeight: "500",
                      color: COLORS.text,
                    }}
                  >
                    {formattedDate}
                  </Text>
                  <Text>
                    <Calendar size={18} color={COLORS.text} />
                  </Text>
                </View>
              </TouchableOpacity>
            )}
          />
        </View>
      </View>
      <TouchableOpacity
        onPress={() => setVisible(true)}
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
          marginTop: 15,
          marginBottom: 15,
          borderWidth: 1,
          borderRadius: 6,
          borderColor: COLORS.border,
          backgroundColor: "white",
          padding: 20,
        }}
      >
        <Text style={{ fontSize: 16, fontWeight: "500", color: COLORS.text }}>
          Payment Mode
        </Text>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
          <Text style={{ fontSize: 16, fontWeight: "500", color: COLORS.text }}>
            {
              currentPaymentAccount?.find(
                (account) => account?.id === paymentId,
              )?.name
            }
          </Text>
          <ChevronRight size={20} color={COLORS.text} />
        </View>
      </TouchableOpacity>
      <CustomInput placeholder="Remarks or Notes" />
      <Button
        disabled={isDisabled}
        title="Save"
        style={{ marginTop: 15 }}
        onPress={handleAddPaymentIn}
      />

      {/* payemnt mode */}
      <SlideUpModal visible={visible} onClose={() => setVisible(false)}>
        <View style={styles.container}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 20,
              marginBottom: 20,
            }}
          >
            <Text style={styles.title}>Select Payment Mode</Text>
          </View>

          <ScrollView
            style={styles.scrollView}
            showsVerticalScrollIndicator={false}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.optionsList}>
              {currentPaymentAccount?.length === 0 ? (
                <NotFound
                  title="No Payment Account Found!"
                  description="No any payment  account found! create new one to go,"
                />
              ) : (
                currentPaymentAccount?.map((account) => (
                  <TouchableOpacity
                    key={account.id}
                    style={[
                      styles.optionCard,
                      paymentId === account.id && styles.selectedCard,
                    ]}
                    onPress={() => {
                      setPaymentId(account?.id);
                      setVisible(false);
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
                    <Text style={styles.balanceText}>
                      {formatNumberWithComma(account?.balance || 0)}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.addAccountButton}>
            <Ionicons name="add-circle" size={20} color="#fff" />
            <Text style={styles.addAccountButtonText}>Add Account</Text>
          </TouchableOpacity>
        </View>
      </SlideUpModal>
    </PXWrapper>
  );
};

const styles = StyleSheet.create({
  amountInput: {
    fontSize: 16,
    fontWeight: "600",
    color: COLORS.success,
    textAlign: "right",
    minWidth: 100,
    maxWidth: 150,
    marginLeft: 20,
    padding: 0,
    marginTop: 10,
  },
  container: {
    flex: 1,
    flexDirection: "column",
  },
  title: {
    fontSize: 15,
    fontFamily: "Poppins-Medium",
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
    fontSize: 16,
    color: "#374151",
    flex: 1,
  },
  balanceText: {
    fontSize: 16,
    color: COLORS.text,
    fontFamily: "Poppins-Medium",
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

export default PaymentIn;
