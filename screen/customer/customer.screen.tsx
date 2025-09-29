import AddCustomerModal from "@/components/customer/add-customer.modal";
import CustomerCard from "@/components/customer/customer-card";
import HHeader from "@/components/re-usables/h-header";
import Input from "@/components/re-usables/input";
import { useCustomers } from "@/database/hooks/useCustomer";
import PXWrapper from "@/layouts/px-wrapper";
import { useUserStore } from "@/store/useUserStore";
import { Search } from "lucide-react-native";
import type React from "react";
import { useState } from "react";
import { View } from "react-native";

export const CustomerScreen: React.FC = () => {
  const [customerName, setCustomerName] = useState<string>("");

  const { customers, refresh } = useCustomers({
    search: customerName,
    sortBy: "created_at",
    limit: 20,
  });


  return (
    <PXWrapper
      floatingAction={<AddCustomerModal />}
      header={
        <>
          <HHeader title="Customer" />
            <Input value={customerName} placeholder="Search customers" leftIcon={<Search />} onChangeText={setCustomerName} />
        </>
      }
      data={customers}
      renderItem={({ item }) => <CustomerCard customer={item} />}
    />
  );
};
