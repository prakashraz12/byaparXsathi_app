import { Trash2 } from 'lucide-react-native';
import { TextInput,TouchableOpacity, View  } from 'react-native';

import { Text } from '@/components/re-usables/text';
import { COLORS } from '@/constants/Colors';
import { formatNumberWithComma } from '@/utils/format-number';

const TaxSection = ({
  taxPercentage,
  onTaxPercentageChange,
  onRemove,
  taxAmount,
}: {
  taxPercentage: string;
  onTaxPercentageChange: (value: string) => void;
  onRemove: () => void;
  taxAmount: string;
}) => (
  <View
    style={{
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
      justifyContent: 'space-between',
      borderBottomWidth: 1,
      borderBottomColor: COLORS.border,
      paddingHorizontal: 15,
      paddingVertical: 10,
    }}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <TouchableOpacity onPress={onRemove} activeOpacity={0.7}>
        <Trash2 size={20} color="#ef4444" />
      </TouchableOpacity>
      <Text style={styles.sectionLabel}>Tax</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          width: 90,
          borderWidth: 1,
          borderColor: COLORS.border,
          padding: 10,
          borderRadius: 6,
        }}
      >
        <TextInput
          style={styles.mediumInput}
          value={taxPercentage}
          onChangeText={onTaxPercentageChange}
          placeholder="0"
          placeholderTextColor="#999"
          keyboardType="numeric"
        />
        <Text style={styles.unitText}>%</Text>
      </View>
      <Text style={styles.unitText}>{formatNumberWithComma(Number(taxAmount))}</Text>
    </View>
  </View>
);

export default TaxSection;