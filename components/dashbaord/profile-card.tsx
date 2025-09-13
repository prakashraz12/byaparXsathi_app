import { View } from "react-native";
import {Text} from "../re-usables/text";

const ProfileCard = () => {
  return (
    <View>
      <View
        style={{ width: 40, height: 40, borderRadius: 32, overflow: "hidden", borderWidth:1 }}
      >
        <Text>PP</Text>
      </View>
    </View>
  );
};

export default ProfileCard;