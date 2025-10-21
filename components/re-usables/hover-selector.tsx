/* eslint-disable @typescript-eslint/naming-convention */
import { COLORS } from "@/constants/Colors";
import { FlatList, TouchableOpacity, View } from "react-native";
import { Text } from "./text";
import { ChevronDown } from "lucide-react-native";
import { useState } from "react";
import { SlideUpModal } from "./modal/slide-up.modal";

interface HoverSelectorProps {
  title: string;
  value: any;
  onChange: (value: any) => void;
  data: any[];
  renderItem: (item: any, onSelect: (item: any) => void, index: number) => React.ReactNode;
  placeholder?: string;
}

const HoverSelector = ({
  title,
  value,
  onChange,
  data,
  renderItem,
  placeholder = "Select an option",
}: HoverSelectorProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleSelect = (item: any) => {
    onChange(item);
    setIsActive(false);
  };

  return (
    <>
      <TouchableOpacity
        onPress={() => setIsActive(true)}
        style={{
          borderWidth: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          borderColor: COLORS.border,
          borderRadius: 5,
          paddingHorizontal: 14,
          paddingVertical: 14,
        }}
      >
        <Text
          style={{
            color: value ? COLORS.text : COLORS.textLight,
            fontSize: 14,
          }}
        >
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color={COLORS.textLight || "#000"} />
      </TouchableOpacity>

      <SlideUpModal
        visible={isActive}
        onClose={() => setIsActive(false)}
        title={title}
        height={800}
      >
       {data?.map((item, index) => renderItem(item, handleSelect, index))}
      </SlideUpModal>
    </>
  );
};

export default HoverSelector;
