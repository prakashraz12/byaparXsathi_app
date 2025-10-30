"use client";

import { SlideUpModal } from "@/components/re-usables/modal/slide-up.modal";
import { StyleSheet, TextInput, TouchableOpacity, View } from "react-native";
import type Item from "@/database/model/item.model";
import { Link2, Minus, Plus } from "lucide-react-native";
import { Text } from "@/components/re-usables/text";
import AvatarCard from "@/components/re-usables/avatar-card";
import { COLORS } from "@/constants/Colors";
import { useEffect, useState } from "react";
import { Button } from "@/components/re-usables/button";
import { useSalesItemStore } from "@/store/useSalesItem";
import { formatNumberWithComma } from "@/utils/format-number";

interface AddItemsSlideupProps {
  visible: boolean;
  onClose: () => void;
  item: Item;
  onSave: () => void;
}

const AddItemsSlideup = ({ visible, onClose, item, onSave }: AddItemsSlideupProps) => {
  const { addSalesItem } = useSalesItemStore();
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [discountAmount, setDiscountAmount] = useState("");
  const [itemPrice, setItemPrice] = useState(
    ""
  );
  const [qantity, setQuantity] = useState("1");

  const onDiscountPercentageChange = (value: string) => {
    setDiscountPercentage(value);
    if (value && !isNaN(Number(value))) {
      const percentage = Number(value);
      const amount = (Number(itemPrice) * percentage) / 100;
      setDiscountAmount(amount.toFixed(2));
    } else {
      setDiscountAmount("");
    }
  };

  const onDiscountAmountChange = (value: string) => {
    setDiscountAmount(value);
    if (value && !isNaN(Number(value))) {
      const amount = Number(value);
      const percentage = (amount / Number(itemPrice)) * 100;
      setDiscountPercentage(percentage.toFixed(2));
    } else {
      setDiscountPercentage("");
    }
  };

  const discountValue = discountAmount ? Number(discountAmount) : 0;

  useEffect(()=>{
  if(item){
    setItemPrice(item.sellingPrice?.toString() || "0")
  }
  },[item]);

  const handleSave = ()=>{
    addSalesItem({
      itemId: item.id,
      quantity: Number(qantity),
      price: Number(itemPrice),
      discountAmount: discountValue,
      itemName: item.itemName,
      measurementUnit: item?.measurementUnit || ""
    })
    onSave();
    onClose()
  }

  const isButtonDisabled = !itemPrice || Number(itemPrice) <= 0 || !qantity || Number(qantity) <= 0 || Number(discountAmount) > (Number(itemPrice) * Number(qantity))
  return (
    <SlideUpModal
      visible={visible}
      onClose={onClose}
      showHandle={true}
      height={525}
    >
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Add Item</Text>
          <Text style={styles.headerSubtitle}>
            Configure item details and discount
          </Text>
        </View>

        <View style={styles.section}>
          <View style={styles.itemCard}>
            <View style={styles.itemContent}>
              <AvatarCard name={item?.itemName || ""} size={50} />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item?.itemName}</Text>
                <Text style={styles.itemPrice}>
                  {formatNumberWithComma(Number(item?.sellingPrice))}
                </Text>
              </View>
            </View>
            <View style={styles.quantityControl}>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() =>
                  setQuantity((prev) => {
                    const n = Number(prev);
                    return n > 1 ? `${n - 1}` : "1";
                  })
                }
              >
                <Minus size={16} color={"white"} />
              </TouchableOpacity>
              <Text style={styles.quantityText}>{qantity}</Text>
              <TouchableOpacity
                style={styles.quantityButton}
                onPress={() => setQuantity((prev) => `${Number(prev) + 1}`)}
              >
                <Plus size={16} color={"white"} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Price</Text>
          <View style={styles.inputWithUnit}>
            <Text style={styles.unitText}>Rs.</Text>
            <TextInput
              style={styles.discountInput}
              value={itemPrice}
              onChangeText={setItemPrice}
              placeholder="0"
              placeholderTextColor="#9CA3AF"
              keyboardType="decimal-pad"
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionLabel}>Discount</Text>
          <View style={styles.discountContainer}>
            <View style={styles.inputWithUnit}>
              <TextInput
                style={styles.discountInput}
                value={discountPercentage}
                onChangeText={onDiscountPercentageChange}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
              <Text style={styles.unitText}>%</Text>
            </View>

            <View style={styles.linkIconContainer}>
              <Link2 size={18} color={COLORS.primary} strokeWidth={2.5} />
            </View>

            <View style={styles.inputWithUnit}>
              <Text style={styles.unitText}>Rs.</Text>
              <TextInput
                style={styles.discountInput}
                value={discountAmount}
                onChangeText={onDiscountAmountChange}
                placeholder="0"
                placeholderTextColor="#9CA3AF"
                keyboardType="decimal-pad"
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Cancel"
            onPress={onClose}
            variant="destructiveOutline"
            style={styles.cancelButton}
          />
          <Button
            title="Save"
            onPress={handleSave}
            style={styles.saveButton}
            disabled={isButtonDisabled}
          />
        </View>
      </View>
    </SlideUpModal>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 2,
    gap: 15,
  },
  header: {
    marginBottom: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    color: COLORS.text,
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 13,
    color: "#6B7280",
  },
  section: {
    gap: 10,
  },
  sectionLabel: {
    fontSize: 16,
    color: COLORS.text,
                  fontFamily: "Poppins-SemiBold",

  },
  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: 12,
    gap: 12,
  },
  itemContent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemName: {
    fontSize: 15,
    color: COLORS.text,
  },
  itemPrice: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "500",
  },
  quantityControl: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 6,
  },
  quantityButton: {
    padding: 4,
    justifyContent: "center",
    alignItems: "center",
  },
  quantityText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    minWidth: 24,
    textAlign: "center",
  },
  discountContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  inputWithUnit: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 14,
    paddingVertical: 15,
    backgroundColor: "#FFFFFF",
  },
  discountInput: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    padding: 0,
    fontWeight: "500",
  },
  unitText: {
    fontSize: 14,
    color: "#6B7280",
    fontWeight: "600",
  },
  linkIconContainer: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  discountHint: {
    fontSize: 12,
    color: "#9CA3AF",
    fontStyle: "italic",
    marginTop: 4,
  },
  priceSection: {
    backgroundColor: "#F9FAFB",
    borderRadius: 12,
    padding: 14,
    gap: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  priceRowFinal: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#E5E7EB",
  },
  priceLabel: {
    fontSize: 13,
    color: "#6B7280",
    fontWeight: "500",
  },
  priceLabelFinal: {
    fontSize: 14,
    color: COLORS.text,
    fontWeight: "600",
  },
  priceValue: {
    fontSize: 13,
    color: COLORS.text,
    fontWeight: "600",
  },
  priceValueFinal: {
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: "700",
  },
  discountValue: {
    fontSize: 13,
    color: "#EF4444",
    fontWeight: "600",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    justifyContent: "flex-end",
    marginTop: 15,
  },
  cancelButton: {
    flex: 1,
  },
  saveButton: {
    flex: 1,
  },
});

export default AddItemsSlideup;
