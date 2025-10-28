import { View, Pressable } from "react-native";
import { Text } from "../re-usables/text";
import { COLORS } from "@/constants/Colors";
import { Crown } from "lucide-react-native";
import { router } from "expo-router";

const UpgradeCard = () => {
  return (
    <Pressable
    onPress={()=>{router.push("/(routes)/shop/select")}}
      android_ripple={{ color: "rgba(0,0,255,0.1)" }} 
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 12,
        padding: 15,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: COLORS.border,
        marginHorizontal: 10,

      }}
    >
      {/* Circle background for icon */}
      <View
        style={{
          width: 50,
          height: 50,
          borderRadius: 20,
          backgroundColor: "#0066CC", 
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Crown size={28} color={COLORS.background} />
      </View>

      <View>
        <Text
          style={{
            fontSize: 14,
            fontFamily: "Poppins-SemiBold",
            color: COLORS.background,
          }}
        >
          Upgrade to Package
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: "Poppins-Regular",
            color: COLORS.background,
          }}
        >
          Never miss out on important updates.
        </Text>
      </View>
    </Pressable>
  );
};

export default UpgradeCard;
