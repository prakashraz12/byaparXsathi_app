import { TouchableOpacity, View } from 'react-native';

import { COLORS } from '@/constants/Colors';
import Customer from '@/database/model/customer.model';
import { formatNumberWithComma } from '@/utils/format-number';

import AvatarCard from '../re-usables/avatar-card';
import { Text } from '../re-usables/text';

const CustomerCard = ({
  customer,
  onPress,
  selected,
}: {
  customer: Customer;
  onPress?: (customer: Customer) => void;
  selected?: boolean;
}) => {
  return (
    <TouchableOpacity
      onPress={() => {
        onPress?.(customer);
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          borderWidth: 0.5,
          borderColor: selected ? COLORS.success : COLORS.border,
          padding: 16,
          borderRadius: 5,
          marginBottom: 16,
          backgroundColor: '#fff',
          width: '100%',
        }}
      >
        <AvatarCard name={customer.name || 'UN'} size={50} />

        <View
          style={{
            flex: 1,
            marginLeft: 16,
            flexDirection: 'column',
          }}
        >
          {/* Name + Rs.0 row */}
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <Text
              style={{ fontSize: 15, fontFamily: 'Poppins-Medium', flex: 1 }}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {customer.name}
            </Text>
            <Text style={{ fontSize: 14, color: COLORS.error, marginLeft: 8 }} numberOfLines={1}>
              {formatNumberWithComma(customer?.outstanding || 0)}
            </Text>
          </View>

          {/* Phone */}
          <Text
            style={{ fontSize: 14, color: COLORS.textLight, marginTop: 4 }}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {customer?.phone}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default CustomerCard;
