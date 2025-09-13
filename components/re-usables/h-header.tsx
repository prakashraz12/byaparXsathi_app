import { View } from "react-native"
import { Text } from "./text"

const HHeader = ({title}: {title: string})=>{
    return(
        <View>
            <Text variant="h5" style={{marginBottom: 16, fontFamily:"Poppins-Bold", fontSize:20}}>{title}</Text>
        </View>
    )
}
export default HHeader;