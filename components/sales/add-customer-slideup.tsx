import { ActivityIndicator, Dimensions, View } from "react-native";
import { SlideUpModal } from "../re-usables/modal/slide-up.modal";
import { useState } from "react";
import { useCustomers } from "@/database/hooks/useCustomer";
import CustomerCard from "../customer/customer-card";
import CustomInput from "../re-usables/input";
import { Search } from "lucide-react-native";
import Customer from "@/database/model/customer.model";
import NotFound from "../re-usables/not-found";
import { Button } from "../re-usables/button";

interface AddCustomerSlideupProps {
  visible: boolean;
  onClose: () => void;
  setCustomer: (customer: Customer) => void;
  selectedCustomer: Customer | null;
}
const AddCustomerSlideup = ({
  visible,
  onClose,
  setCustomer,
  selectedCustomer,
}: AddCustomerSlideupProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { customers, loading } = useCustomers({ search: searchQuery });
  const WINDOW_HEIGHT = Dimensions.get("window").height;
  return (
    <SlideUpModal
      visible={visible}
      onClose={() => onClose()}
      height={WINDOW_HEIGHT - 80}
    >
      <View>
        <View style={{ marginBottom: 10 }}>
          <CustomInput
            placeholder="Search Customer"
            value={searchQuery}
            leftIcon={<Search size={20} />}
            onChangeText={setSearchQuery}
          />
        </View>
        {loading ? (
          <View style={{ flex: 1, justifyContent: "center", alignItems: "center", height:WINDOW_HEIGHT-80 }}>
            <ActivityIndicator />
          </View>
        ) : !loading && customers?.length === 0 ? (
          <NotFound title="No Customer Found!" description="You haven't added customer yet!" renderButton={{buttonTitle:"Add Customer",onPress:()=>{
            
          }}}/>
        ) : (
         (
          customers?.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onPress={() => {
                setCustomer(customer);
              onClose();
            }}
            selected={selectedCustomer?.id === customer.id}
          />
        ))))}
      </View>
    </SlideUpModal>
  );
};
export default AddCustomerSlideup;
