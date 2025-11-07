import { Link2, Trash2 } from "lucide-react-native";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TextInput } from "react-native-gesture-handler";

import { Text } from "@/components/re-usables/text";
import { COLORS } from "@/constants/Colors";

const DiscountSection = ({
  discountPercentage,
  discountAmount,
  onDiscountPercentageChange,
  onDiscountAmountChange,
  onRemove,
}: {
  discountPercentage: string;
  discountAmount: string;
  onDiscountPercentageChange: (value: string) => void;
  onDiscountAmountChange: (value: string) => void;
  onRemove: () => void;
}) => (
  <View style={[styles.sectionRow, { borderTopWidth: 1, borderColor: COLORS.border }]}>
    <TouchableOpacity onPress={onRemove} activeOpacity={0.7}>
      <Trash2 size={20} color="#ef4444" />
    </TouchableOpacity>
    <Text style={styles.sectionLabel}>Discount</Text>
    <View style={styles.dualInputContainer}>
      <View style={styles.inputWithUnit}>
        <TextInput
          style={styles.mediumInput}
          value={discountPercentage}
          onChangeText={onDiscountPercentageChange}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
        <Text style={styles.unitText}>%</Text>
      </View>
      <Link2 size={18} color={COLORS.text} />
      <View style={styles.inputWithUnit}>
        <Text style={styles.unitText}>Rs.</Text>
        <TextInput
          style={styles.mediumInput}
          value={discountAmount}
          onChangeText={onDiscountAmountChange}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 8,
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    paddingHorizontal: 15,
  },
  sectionLabel: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '600',
    minWidth: 70,
  },
  dualInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  inputWithUnit: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    padding: 10,
    borderColor: COLORS.border,
    borderRadius: 8,
  },
  mediumInput: {
    flex: 1,
    fontSize: 16,
    color: '#111827',
    padding: 0,
    minWidth: 40,
  },
  unitText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});
export default DiscountSection;
