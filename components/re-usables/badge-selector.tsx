import { TouchableOpacity, View } from "react-native";
import { Text } from "./text";
import { Check } from "lucide-react-native";
import { COLORS } from "@/constants/Colors";

interface BadgeSelectorProps {
  options: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?:boolean
}

const BadgeSelector = ({
  options,
  value,
  onChange,
  label,
  required
}: BadgeSelectorProps) => {
  return (
    <View style={{ flex: 1, flexDirection: "column", gap: 8, marginTop: 5 }}>
      {label && <Text style={{ fontSize: 14, marginBottom: 6, fontFamily: "Poppins-SemiBold" }}>{label}{" "}{required ? <Text style={{color:"red"}}>*</Text> :""}</Text>}
      <View 
        style={{ 
          flexDirection: "row", 
          flexWrap: "wrap", 
          gap: 10 
        }}
      >
        {options.map((item) => (
          <TouchableOpacity
            style={{
              flexDirection: "row",
              alignItems: "center",
              paddingHorizontal: 15,
              paddingVertical: 6,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: COLORS.border,
              backgroundColor:
                value === item?.value ? COLORS.primary : "transparent",
            }}
            key={item.value}
            onPress={() => onChange(item.value)}
          >
            {value === item?.value && (
              <Check 
                size={15} 
                color="white" 
                style={{ marginRight: 4 }} 
              />
            )}
            <Text
              style={{
                color: value === item?.value ? "white" : COLORS.text,
                fontSize:15
              }}
            >
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default BadgeSelector;