import { View, Dimensions } from "react-native";
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
        borderWidth: 0.5,
        borderColor: COLORS.border,
        padding: 16,
        borderRadius: 5,
        marginBottom: 16,
        backgroundColor: "#fff",
        width: "100%", 
      }}
    >
      <AvatarCard name={customer.name || "UN"} size={50} />

      <View
        style={{
          flex: 1,
          marginLeft: 16,
          flexDirection: "column",
        }}
      >
        {/* Name + Rs.0 row */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Text
            style={{ fontSize: 16, fontFamily: "Poppins-Bold", flex: 1 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {customer.name}
          </Text>
          <Text
            style={{ fontSize: 14, color: COLORS.error, marginLeft: 8 }}
            numberOfLines={1}
          >
            Rs.0
          </Text>
        </View>

        {/* Phone */}
        <Text
          style={{ fontSize: 14, color: COLORS.textLight, marginTop: 4 }}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {customer.phone}
        </Text>
      </View>
    </View>
  );
};

export default CustomerCard;
