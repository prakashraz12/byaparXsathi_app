import { useCustomers } from "@/database/hooks/useCustomer";
import Customer from "@/database/model/customer.model";
import { Search } from "lucide-react-native";
import { useState } from "react";
import { ActivityIndicator, Dimensions, View } from "react-native";
import CustomerCard from "../customer/customer-card";
import CustomInput from "../re-usables/input";
import { SlideUpModal } from "../re-usables/modal/slide-up.modal";
import NotFound from "../re-usables/not-found";

interface AddCustomerSlideupProps {
  visible: boolean;
  onClose: () => void;
  setCustomer: (customer: Customer) => void;
  selectedCustomer: Customer | null;
  onSelectCustomer?: () => void;
}
const AddCustomerSlideup = ({
  visible,
  onClose,
  setCustomer,
  selectedCustomer,
  onSelectCustomer,
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
          <View
            style={{
              flex: 1,
              justifyContent: "center",
              alignItems: "center",
              height: WINDOW_HEIGHT - 80,
            }}
          >
            <ActivityIndicator />
          </View>
        ) : !loading && customers?.length === 0 ? (
          <NotFound
            title="No Customer Found!"
            description="You haven't added customer yet!"
            renderButton={{ buttonTitle: "Add Customer", onPress: () => {} }}
          />
        ) : (
          customers?.map((customer) => (
            <CustomerCard
              key={customer.id}
              customer={customer}
              onPress={() => {
                setCustomer(customer);
                if (onSelectCustomer) {
                  onSelectCustomer();
                } else {
                  onClose();
                }
              }}
              selected={selectedCustomer?.id === customer.id}
            />
          ))
        )}
      </View>
    </SlideUpModal>
  );
};
export default AddCustomerSlideup;
