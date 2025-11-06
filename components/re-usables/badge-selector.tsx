import { Check } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/constants/Colors';

import { Text } from './text';

interface BadgeSelectorProps {
  options: {
    label: string;
    value: string;
  }[];
  value: string;
  onChange: (value: string) => void;
  label?: string;
  required?: boolean;
  checkedUnchecked?: boolean;
  errorMessage?: string;
}

const BadgeSelector = ({
  options,
  value,
  onChange,
  label,
  required,
  checkedUnchecked,
}: BadgeSelectorProps) => {
  return (
    <View style={{ flex: 1, flexDirection: 'column', gap: 8, marginTop: 5 }}>
      {label && (
        <Text
          style={{ fontSize: 16, marginBottom: 4, marginLeft: 4, fontFamily: 'Poppins-Medium' }}
        >
          {label} {required ? <Text style={{ color: 'red' }}>*</Text> : ''}
        </Text>
      )}
      <View
        style={{
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 10,
        }}
      >
        {options.map((item,index) => (
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 15,
              paddingVertical: 6,
              borderRadius: 6,
              borderWidth: 1,
              borderColor: COLORS.border,
              backgroundColor: value === item?.value ? COLORS.primary : 'white',
            }}
            key={index}
            onPress={() =>
              value === item?.value && checkedUnchecked ? onChange('') : onChange(item.value)
            }
          >
            {value === item?.value && <Check size={15} color="white" style={{ marginRight: 4 }} />}
            <Text
              style={{
                color: value === item?.value ? 'white' : COLORS.text,
                fontSize: 16,
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
