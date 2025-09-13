import { View } from "react-native";
import { Text } from "./text";

const AvatarCard = ({ name }: { name: string }) => {
  return (
    <View
      style={{
        width: 40,
        height: 40,
        borderRadius: 32,
        overflow: "hidden",
        borderWidth: 1,
        borderColor: "#E5E5E5",
        backgroundColor: "#fff",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: "#1A1A1A",
          textAlign: "center",
          fontFamily: "Poppins-Bold",
          textAlignVertical: "center",
        }}
      >
        {name?.slice(0, 2)?.toUpperCase()}
      </Text>
    </View>
  );
};
export default AvatarCard;
