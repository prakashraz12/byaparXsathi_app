import { Button } from "@/components/re-usables/button";
import database from "@/database";
import { MoreScreen } from "@/screen/more/more.screen";
import { useUserStore } from "@/store/useUserStore";
import { View, Text } from "react-native";

const More = () => {
  const { clearUser, clearToken } = useUserStore();
  const handleLogOut = async() => {
    await clearUser();
    await clearToken();
    database.write(async () => {
       await database.unsafeResetDatabase()
  })
}
  return (
   <MoreScreen/>
  );
};

export default More;
