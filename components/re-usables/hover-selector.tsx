/* eslint-disable @typescript-eslint/naming-convention */
import { COLORS } from '@/constants/Colors';
import { FlatList, Text, TouchableOpacity, View } from 'react-native';
import { ChevronDown } from 'lucide-react-native';
import { useState } from 'react';
import { SlideUpModal } from './modal/slide-up.modal';

interface HoverSelectorProps {
  title: string;
  value: any;
  onChange: (value: any) => void;
  data: any[];
  renderItem: (item: any, onSelect: (item: any) => void, index: number) => React.ReactNode;
  placeholder?: string;
  required?: boolean;
}

const HoverSelector = ({
  title,
  value,
  onChange,
  data,
  renderItem,
  placeholder = 'Select an option',
  required = false,
}: HoverSelectorProps) => {
  const [isActive, setIsActive] = useState(false);

  const handleSelect = (item: any) => {
    onChange(item);
    setIsActive(false);
  };

  return (
    <View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          marginBottom: 6,
          marginLeft: 4,
          gap: 4,
        }}
      >
        <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium', color: COLORS.text }}>
          {title}
        </Text>
        {required && <Text style={{ color: COLORS.error }}>*</Text>}
      </View>
      <TouchableOpacity
        onPress={() => setIsActive(true)}
        style={{
          borderWidth: 1,
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderColor: COLORS.border,
          borderRadius: 6,
          paddingHorizontal: 14,
          paddingVertical: 14,
          backgroundColor: 'white',
        }}
      >
        <Text
          style={{
            color: value ? COLORS.text : COLORS.textLight,
            fontSize: 14,
            fontFamily: 'Poppins-Regular',
          }}
        >
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color={COLORS.textLight || '#000'} />
      </TouchableOpacity>

      <SlideUpModal
        visible={isActive}
        onClose={() => setIsActive(false)}
        title={title}
        height={600}
      >
        {data?.map((item, index) => renderItem(item, handleSelect, index))}
      </SlideUpModal>
    </View>
  );
};

export default HoverSelector;
