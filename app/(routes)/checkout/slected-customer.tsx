import { RefreshCcw, Trash2 } from 'lucide-react-native';
import { TouchableOpacity, View } from 'react-native';

import AvatarCard from '@/components/re-usables/avatar-card';
import { Text } from '@/components/re-usables/text';
import { COLORS } from '@/constants/Colors';
import { formatNumberWithComma } from '@/utils/format-number';

const SelectedCustomer = ({ customer, setCustomer }: { customer: any; setCustomer: any }) => {
  if (!customer) return null; // Add this line to handle null customer

  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
        marginTop: 20,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 6,
        padding: 13,
        backgroundColor: COLORS.background,
        justifyContent: 'space-between',
      }}
    >
      <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
        <AvatarCard name={customer?.name || ''} size={50} />
        <View style={{ flexDirection: 'column' }}>
          <Text style={{ fontSize: 15, fontWeight: '600', marginTop: 10 }}>
            {customer?.name || ''}
          </Text>
          {customer?.outstanding && (
            <Text style={{ fontSize: 13, color: COLORS.success }}>
              To Receive : {String(formatNumberWithComma(customer?.outstanding || 0))}
            </Text>
          )}
          {customer?.available_credit && (
            <Text style={{ fontSize: 13, color: COLORS.error }}>
              To Pay : {String(formatNumberWithComma(customer?.available_credit || 0))}
            </Text>
          )}
        </View>
      </View>
      <View style={{ flexDirection: 'row', gap: 15, alignItems: 'center' }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 5,
            borderWidth: 1,
            borderColor: COLORS.border,
            borderRadius: 50,
            paddingHorizontal: 15,
            paddingVertical: 6,
          }}
        >
          <View>
            <RefreshCcw size={15} color={COLORS.text} />
          </View>
          <Text style={{ fontSize: 13, color: COLORS.text }}>Change</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setCustomer(null)}>
          <View>
            <Trash2 size={18} color={COLORS.error} />
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SelectedCustomer;
