import { Trash2, View } from "lucide-react-native";
import { StyleSheet, TextInput, TouchableOpacity } from "react-native";

import { Text } from "@/components/re-usables/text";
import { COLORS } from "@/constants/Colors";

const AdditionalChargeRow = ({
  charge,
  setCharge,
  setShowAdditionalChargesSection,
}: {
  charge: string;
  setCharge: (value: string) => void;
  setShowAdditionalChargesSection: (value: boolean) => void;
}) => (
  <View style={styles.sectionRow}>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <TouchableOpacity
        onPress={() => {
          setCharge('');
          setShowAdditionalChargesSection(false);
        }}
        activeOpacity={0.7}
      >
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
      <Text style={styles.sectionLabel}>Additional Charge</Text>
    </View>
    <View style={styles.chargeAmountContainer}>
      <Text style={styles.unitText}>Rs.</Text>
      <TextInput
        style={styles.chargeAmountInput}
        value={charge}
        onChangeText={setCharge}
        placeholder="0"
        placeholderTextColor="#999"
        keyboardType="numeric"
      />
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
  chargeAmountContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: 10,
    borderRadius: 6,
  },
  chargeAmountInput: {
    fontSize: 14,
    minWidth: 60,
    textAlign: 'right',
  },
  unitText: {
    fontSize: 14,
    color: '#6b7280',
    fontWeight: '500',
  },
});
export default AdditionalChargeRow;