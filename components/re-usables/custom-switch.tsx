import { COLORS } from '@/constants/Colors';
import { View, Switch, Text, StyleSheet } from 'react-native';

interface CustomSwitchProps {
  value: boolean;
  onValueChange: (value: boolean) => void;
  label: string;
  disabled?: boolean;
}
const CustomSwitch = ({ value, onValueChange, label, disabled = false }: CustomSwitchProps) => {
  return (
    <View style={styles.switchContainer}>
      {label && <Text style={styles.switchLabel}>{label}</Text>}
      <Switch
        trackColor={{ false: '#E9E9EA', true: COLORS.primary }}
        thumbColor="#FFFFFF"
        ios_backgroundColor="#E9E9EA"
        onValueChange={onValueChange}
        value={value}
        disabled={disabled}
        style={styles.switch}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
  },
  switchLabel: {
    fontSize: 16,
    color: COLORS.text,
    fontFamily: 'Poppins-Medium',
  },
  switch: {
    transform: [{ scaleX: 0.95 }, { scaleY: 0.95 }],
  },
});

export default CustomSwitch;
