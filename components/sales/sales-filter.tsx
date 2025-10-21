"use client";

import { View } from "react-native";
import { SlideUpModal } from "../re-usables/modal/slide-up.modal";
import { Text } from "../re-usables/text";
import BadgeSelector from "../re-usables/badge-selector";
import {
  DEFAULT_DATE_RANGE_OPTIONS,
  DEFAULT_DATE_RANGE_OPTIONS_ENUMS,
} from "@/utils/date-range-provider";
import DatePicker from "../re-usables/date-picker/date-picker";

interface SalesFilterSlideUpProps {
  visible: boolean;
  onClose: () => void;
  sortBy: "asc" | "desc";
  setSortBy: (sortBy: "asc" | "desc") => void;
  dateRangeOptions: (typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS)[keyof typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS];
  setDateRangeOptions: (
    dateRangeOptions: (typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS)[keyof typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS]
  ) => void;
  startDate: Date | null;
  endDate: Date | null;
  setStartDate: (date: Date) => void;
  setEndDate: (date: Date) => void;
}

const SalesFilterSlideUp = ({
  visible,
  onClose,
  sortBy,
  setSortBy,
  dateRangeOptions,
  setDateRangeOptions,
  startDate,
  endDate,
  setStartDate,
  setEndDate,
}: SalesFilterSlideUpProps) => {
  return (
    <SlideUpModal visible={visible} onClose={onClose}>
      {/* Sort By Section */}
      <View style={{ marginBottom: 24, marginTop: 10 }}>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 12,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          Sort By
        </Text>
        <BadgeSelector
          options={[
            { label: "Asc", value: "asc" },
            { label: "Desc", value: "desc" },
          ]}
          value={sortBy}
          onChange={(value) => setSortBy(value as "asc" | "desc")}
        />
      </View>

      {/* Date Range Section */}
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            fontSize: 16,
            marginBottom: 12,
            fontFamily: "Poppins-SemiBold",
          }}
        >
          Date Range
        </Text>
        <BadgeSelector
          options={DEFAULT_DATE_RANGE_OPTIONS}
          value={dateRangeOptions}
          onChange={(value) => {
            setDateRangeOptions(
              value as (typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS)[keyof typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS]
            );
            if (dateRangeOptions !== "CUSTOM_RANGE") {
              onClose();
            }
          }}
        />
      </View>

      {dateRangeOptions === DEFAULT_DATE_RANGE_OPTIONS_ENUMS.CUSTOM_RNAGE && (
        <View>
          <Text
            style={{
              fontSize: 16,
              marginBottom: 16,
              fontFamily: "Poppins-SemiBold",
            }}
          >
            Custom Date Range
          </Text>

          <View style={{ flexDirection: "row", gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  marginBottom: 8,
                  color: "#666",
                }}
              >
                From
              </Text>
              <DatePicker
                selectedDate={(startDate ?? new Date()) as Date}
                onDateChange={(d) => setStartDate(d)}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 12,
                  fontWeight: "500",
                  marginBottom: 8,
                  color: "#666",
                }}
              >
                To
              </Text>
              <DatePicker
                selectedDate={(endDate ?? new Date()) as Date}
                onDateChange={(d) => setEndDate(d)}
              />
            </View>
          </View>
        </View>
      )}
    </SlideUpModal>
  );
};

export default SalesFilterSlideUp;
