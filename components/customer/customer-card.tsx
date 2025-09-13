import { View } from "react-native";
import AvatarCard from "../re-usables/avatar-card";
import { Text } from "../re-usables/text";
import { COLORS } from "@/constants/Colors";
import Customer from "@/database/model/customer.model";

const CustomerCard = ({ customer }: { customer: Customer }) => {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 16,
        borderWidth: 0.5,
        borderColor: COLORS.border,
        padding: 16,
        borderRadius: 8,
        marginBottom: 16,
        backgroundColor: "#fff",
        
      }}
    >
      <AvatarCard name={customer.name || "UN"} />
      <View style={{ flexDirection: "column", gap: 2 }}>
        <Text style={{ fontSize: 16, fontFamily: "Poppins-Bold" }}>
          {customer.name}
        </Text>
        <Text style={{ fontSize: 14, color: COLORS.textLight }}>
          {customer.phone}
        </Text>
      </View>
    </View>
  );
};

export default CustomerCard;
