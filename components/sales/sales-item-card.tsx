import { Pencil, Trash2 } from 'lucide-react-native';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/re-usables/text';
import { COLORS } from '@/constants/Colors';
import { SalesItemDraft, useSalesItemStore } from '@/store/useSalesItem';
import { formatNumberWithComma } from '@/utils/format-number';

import EditSalesItem from './edit-sales-item';
const SalesItemCard = ({
  item,
}: {
  item: SalesItemDraft;
}) => {
  const [updateOpen, setUpdateOpen] = useState(false);
  const {removeSalesItem} = useSalesItemStore()

  return (
    <View
      style={{
        marginVertical: 5,
        padding: 12,
        borderBottomWidth: 1,
        borderColor: COLORS.border,
      }}
    >
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 3,
        }}
      >
        <Text size={15}>{item.itemName}</Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10,
          }}
        >
          <TouchableOpacity onPress={() => setUpdateOpen(true)}>
            <Pencil size={16} color={COLORS.success} />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => removeSalesItem(item?.itemId)}>
            <Trash2 size={16} color={COLORS.error} />
          </TouchableOpacity>
        </View>
      </View>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 3,
          marginTop: 8,
        }}
      >
        <Text size={13} style={{ color: '#666' }}>
          {item.quantity} {item?.measurementUnit} X {formatNumberWithComma(Number(item.price))}{' '}
          {Number(item.discountAmount) > 0
            ? `=12${formatNumberWithComma(Number(item.quantity) * Number(item.price))}`
            : ''}
        </Text>
        <Text size={15}>
          {formatNumberWithComma(
            Number(item.quantity) * Number(item.price) - Number(item.discountAmount),
          )}
        </Text>
      </View>
      {Number(item.discountAmount) > 0 && (
        <View
          style={{
            marginTop: 1,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Text size={12} style={{ color: COLORS.error }}>
            Discount
          </Text>
          <Text size={13} style={{ color: COLORS.error }}>
            {formatNumberWithComma(Number(item.discountAmount))}
          </Text>
        </View>
      )}
      <EditSalesItem
        visible={updateOpen}
        onClose={() => setUpdateOpen(false)}
        itemId={item.itemId}
        item={item}
        onSave={() => setUpdateOpen(false)}
      />
    </View>
  );
};
export default SalesItemCard;
