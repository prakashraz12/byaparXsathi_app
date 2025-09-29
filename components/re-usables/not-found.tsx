import { Text } from "./text";
import { Image, View } from "react-native";
import { NOT_FOUND } from "@/assets";
import { WINDOW_HEIGHT } from "@/config/app.config";
import { COLORS } from "@/constants/Colors";
import { Button } from "./button";

interface INotFound {
  title?: string;
  description?: string;
  renderButton?: {
    buttonTitle: string;
    onPress: () => void;
  };
}
const NotFound = ({
  title = "Not Found",
  description = "What you're looking for is not here.",
  renderButton,
}: INotFound) => {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        height: WINDOW_HEIGHT * 0.5,
      }}
    >
      <Image
        source={NOT_FOUND}
        style={{ width: 200, height: 200, objectFit: "contain" }}
      />
      <Text
        style={{
          fontSize: 18,
          color: COLORS.textLight,
          fontFamily: "Poppins-Regular",
          marginTop: 16,
        }}
      >
        {title}
      </Text>
      <Text
        style={{
          fontSize: 14,
          color: COLORS.textLight,
          fontFamily: "Poppins-Regular",
          marginTop: 8,
        }}
      >
        {description}
      </Text>
      {renderButton && (
        <Button
          title={renderButton?.buttonTitle || ""}
          onPress={renderButton?.onPress}
          style={{ width: "50%", marginTop: 16 }}
        />
      )}
    </View>
  );
};
export default NotFound;
