import { TouchableOpacity, View } from "react-native";
import ProfileCard from "./profile-card";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";

const DashBoardTop = () => {
    return (
        <View style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 16,
           
        }}>
          <ProfileCard/>  
          <TouchableOpacity style={{width:48, position:"relative", height:48, borderRadius:24, justifyContent:"center", alignItems:"center", padding:8, backgroundColor:COLORS.background, borderWidth:1, borderColor:COLORS.border}}>
            <Ionicons name="notifications-outline" size={24} color={COLORS.text} />
            <View style={{position:"absolute", top:0, right:10, width:10, height:10, borderRadius:5, backgroundColor:COLORS.notification}}></View>
          </TouchableOpacity>
        </View>
    )
}

export default DashBoardTop;