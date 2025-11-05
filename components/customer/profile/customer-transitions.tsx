import CustomInput from "@/components/re-usables/input";
import NotFound from "@/components/re-usables/not-found";
import SalesCard from "@/components/sales/sales-card";
import { COLORS } from "@/constants/Colors";
import { useSales } from "@/database/hooks/useSales";
import { FilterIcon, Search } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, TouchableOpacity, View } from "react-native";

const CustomerTransitions = ({ id }: { id: string }) => {
  const [searchParams, setSearchParams] = useState<string>("");

  const { sales, isLoading } = useSales({
    customerId: id,
    searchParams,
    sort: "desc",
  });
  return (
    <View>
      <View
        style={{
          flex: 1,
          marginTop: 10,
          flexDirection: "row",
          alignItems: "center",
          gap: 5,
          marginBottom: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <CustomInput
            containerStyle={{ flex: 1 }}
            placeholder="Search transactions"
            leftIcon={<Search />}
            value={searchParams}
            onChangeText={setSearchParams}
          />
        </View>
        <TouchableOpacity
          style={{
            width: 50,
            height: 50,
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "white",
            borderRadius: 5,
            borderWidth: 1,
            borderColor: COLORS.border,
          }}
        >
          <FilterIcon size={24} color={COLORS.text} />
        </TouchableOpacity>
      </View>
      <View>
        {isLoading ? (
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <ActivityIndicator size="large" color={COLORS.primary} />
          </View>
        ) : sales?.length === 0 ? (
          <NotFound title="No Transactions Found" />
        ) : (
          sales?.map((sale) => (
            <SalesCard
              id={sale.id}
              key={sale.id}
              invoiceNumber={sale.invoiceNumber}
              invoiceDate={sale?.invoiceDate}
              grandTotalAmount={sale.grandTotalAmount}
              paymentStatus={sale.status}
              paymentType={sale.paymentType}
            />
          ))
        )}
      </View>
    </View>
  );
};

export default CustomerTransitions;
