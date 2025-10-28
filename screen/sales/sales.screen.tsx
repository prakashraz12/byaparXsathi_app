import { Button } from "@/components/re-usables/button";
import HHeader from "@/components/re-usables/h-header";
import CustomInput from "@/components/re-usables/input";
import SalesFilterSlideUp from "@/components/sales/sales-filter";
import { COLORS } from "@/constants/Colors";
import { useSales } from "@/database/hooks/useSales";
import type Sales from "@/database/model/sales.model";
import PXWrapper from "@/layouts/px-wrapper";
import {
  dateRangeProvider,
  DEFAULT_DATE_RANGE_OPTIONS_ENUMS,
} from "@/utils/date-range-provider";
import { useRouter } from "expo-router";
import { Dot, ListFilter, Plus, Search } from "lucide-react-native";
import { useEffect, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import SalesCard from "../../components/sales/sales-card";

const SalesScreen = () => {
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"asc" | "desc">("desc");
  const [dateRangeOptions, setDateRangeOptions] = useState<
    (typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS)[keyof typeof DEFAULT_DATE_RANGE_OPTIONS_ENUMS]
  >(DEFAULT_DATE_RANGE_OPTIONS_ENUMS.ALL_TIME);

  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);

  const [searchParams, setSearchParams] = useState("");
  const [paymentType, setPaymentType] = useState("");
  const [paymentStatus, setPaymentStatus] = useState("");

  const { sales } = useSales({
    searchParams,
    sort: sortBy,
    startDate: startDate
      ? new Date(new Date(startDate).setHours(0, 0, 0, 0))
      : undefined,
    endDate: endDate
      ? new Date(new Date(endDate).setHours(23, 59, 59, 999))
      : undefined,
    paymentType,
    paymentStatus,
  });

  const router = useRouter();

  useEffect(() => {
    if (dateRangeOptions !== DEFAULT_DATE_RANGE_OPTIONS_ENUMS.CUSTOM_RNAGE) {
      const options = dateRangeProvider(dateRangeOptions);
      if (options) {
        setStartDate(options.startDate);
        setEndDate(options.endDate);
      }
    }
    if (dateRangeOptions === DEFAULT_DATE_RANGE_OPTIONS_ENUMS.ALL_TIME) {
      setStartDate(null);
      setEndDate(null);
    }
  }, [dateRangeOptions]);

  const isSalesApplied =
    dateRangeOptions !== "ALL_TIME" || paymentType || paymentStatus;

  return (
    <>
      <PXWrapper
        data={sales}
        floatingAction={
          <Button
           size="medium"
            onPress={() => router.push("/sales/create")}
            variant="primary"
            leftIcon={<Plus size={20} color="#FFFFFF" />}
           title="Add Sales"
          />
        }
        renderItem={({ item }: { item: Sales }) => (
          <SalesCard
            invoiceNumber={item.invoiceNumber || ""}
            invoiceDate={item.invoiceDate || 0}
            grandTotalAmount={item.grandTotalAmount || 0}
            paymentStatus={item?.status || ""}
            paymentType={item?.paymentType || ""}
            id={item.id}
          />
        )}
        header={
          <>
            <HHeader title="Sales Transactions" />
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 10,
                width: "100%",
              }}
            >
              <View style={{ flex: 1 }}>
                <CustomInput
                  value={searchParams}
                  onChangeText={setSearchParams}
                  placeholder="Search Sales transactions"
                  leftIcon={<Search />}
                />
              </View>
              <TouchableOpacity
                style={{
                  width: 54,
                  height: 54,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: COLORS.cardBackground,
                  borderRadius: 5,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                }}
                onPress={() => setFilterOpen(true)}
              >
                <View style={{ position: "relative" }}>
                  <ListFilter size={20} color={COLORS.text} />
                  {isSalesApplied && (
                    <Dot
                      size={45}
                      color={COLORS.primary}
                      style={{ position: "absolute", top: -19, right: -19 }}
                    />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </>
        }
      />
      <SalesFilterSlideUp
        visible={filterOpen}
        onClose={() => setFilterOpen(false)}
        sortBy={sortBy}
        setSortBy={setSortBy}
        dateRangeOptions={dateRangeOptions}
        setDateRangeOptions={setDateRangeOptions}
        startDate={startDate}
        endDate={endDate}
        setStartDate={setStartDate}
        setEndDate={setEndDate}
        paymentType={paymentType}
        setPaymentType={setPaymentType}
        paymentStatus={paymentStatus}
        setPaymentStatus={setPaymentStatus}
      />
    </>
  );
};
export default SalesScreen;
