import { ChevronDown, ChevronUp } from 'lucide-react-native';
import { useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';

import { Text } from '@/components/re-usables/text';
import SalesItemCard from '@/components/sales/sales-item-card';
import { COLORS } from '@/constants/Colors';
import { useSalesItemStore } from '@/store/useSalesItem';
import { formatNumberWithComma } from '@/utils/format-number';

const SalesItems = ({ subtotal }: { subtotal: number }) => {
  const { salesItems } = useSalesItemStore();
  const [itemShow, setItemShow] = useState<boolean>(true);
  return (
    <View
      style={{
        borderWidth: 1,
        borderRadius: 6,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
        marginTop: 20,
      }}
    >
      {salesItems?.length > 0 && (
        <View style={styles.itemsHeader}>
          <Text size={16} style={{ fontFamily: 'Poppins-Medium' }}>
            Items {!itemShow ? `[${salesItems.length}]` : ''}
          </Text>
          <TouchableOpacity onPress={() => setItemShow(!itemShow)}>
            {itemShow ? (
              <View
                style={{
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  borderColor: COLORS.border,
                  paddingHorizontal: 12,
                  paddingVertical: 3,
                  borderRadius: 6,
                }}
              >
                <Text style={{ fontSize: 13, color: 'gray' }}>Hide</Text>
                <View>
                  <ChevronUp size={18} color={'gray'} />
                </View>
              </View>
            ) : (
              <View
                style={{
                  borderWidth: 1,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 5,
                  borderColor: COLORS.border,
                  paddingHorizontal: 12,
                  paddingVertical: 3,
                  borderRadius: 6,
                }}
              >
                <Text style={{ fontSize: 13, color: 'gray' }}>View All</Text>
                <View>
                  <ChevronDown size={18} color={'gray'} />
                </View>
              </View>
            )}
          </TouchableOpacity>
        </View>
      )}
      <View style={{ display: itemShow ? 'flex' : 'none' }}>
        {salesItems?.map((item, index) => (
          <SalesItemCard key={`${item.itemId}-${index}`} item={item} />
        ))}
      </View>
      <View
        style={{
          padding: 5,
          marginVertical: 10,
          paddingHorizontal: 15,
          flexDirection: 'row',
          justifyContent: 'space-between',
        }}
      >
        <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>Sub Total</Text>
        <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>
          {formatNumberWithComma(subtotal)}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  itemsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
});
export default SalesItems;
