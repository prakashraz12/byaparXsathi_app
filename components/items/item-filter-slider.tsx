"use client";

import { PaymentStatusOptions } from "@/constants/payment-status";
import {
  DEFAULT_DATE_RANGE_OPTIONS,
  DEFAULT_DATE_RANGE_OPTIONS_ENUMS,
} from "@/utils/date-range-provider";
import { View } from "react-native";
import BadgeSelector from "../re-usables/badge-selector";
import { Button } from "../re-usables/button";
import DatePicker from "../re-usables/date-picker/date-picker";
import { SlideUpModal } from "../re-usables/modal/slide-up.modal";
import { Text } from "../re-usables/text";

interface ItemFilterSlideUpProps {
  visible: boolean;
  onClose: () => void;
  sortBy: "asc" | "desc";
  setSortBy: (sortBy: "asc" | "desc") => void;
  sortStockBy: "asc" | "desc";
  setSortStockBy: (sortStockBy: "asc" | "desc") => void;
}

const SalesFilterSlideUp = ({
  visible,
  onClose,
  sortBy,
  sortStockBy,
  setSortBy,
  setSortStockBy,
}: ItemFilterSlideUpProps) => {
  return (
    <SlideUpModal
      visible={visible}
      onClose={onClose}
      height={600}
      stickyFooter={
        <View style={{ flexDirection: "row", gap: 12 }}>
          <Button
            style={{ flex: 1 }}
            title="Reset"
            onPress={() => {
              setSortBy("asc");
              onClose();
            }}
          />
        </View>
      }
    >
      <View style={{ marginBottom: 20, marginTop: 6 }}>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 12,
            fontFamily: "Poppins-Medium",
          }}
        >
          Sort By Name
        </Text>
        <BadgeSelector
          options={[
            { label: "Name(A-Z)", value: "asc" },
            { label: "Name(Z-A)", value: "desc" },
          ]}
          value={sortBy}
          onChange={(value) => {
            setSortBy(value as "asc" | "desc");
            onClose();
          }}
        />
      </View>
      <View style={{ marginBottom: 20, marginTop: 6 }}>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 12,
            fontFamily: "Poppins-Medium",
          }}
        >
          Sort By Stock
        </Text>
        <BadgeSelector
          options={[
            { label: "Stock(High to Low)", value: "asc" },
            { label: "Stock(Low to High)", value: "desc" },
          ]}
          value={sortStockBy}
          onChange={(value) => {
            setSortStockBy(value as "asc" | "desc");
            onClose();
          }}
        />
      </View>

    </SlideUpModal>
  );
};

export default SalesFilterSlideUp;
