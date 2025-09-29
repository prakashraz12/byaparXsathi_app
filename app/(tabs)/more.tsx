import { Button } from "@/components/re-usables/button";
import { useUserStore } from "@/store/useUserStore";
import { View, Text } from "react-native";

const MoreScreen = () => {
  const { clearUser, clearToken } = useUserStore();
  const handleLogOut = async() => {
    await clearUser();
    await clearToken();
  };
  return (
    <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
      <Text>More Screen</Text>
      <Button title="logout baabt" onPress={()=>handleLogOut()}>Logout</Button>
    </View>
  );
};

export default MoreScreen;
