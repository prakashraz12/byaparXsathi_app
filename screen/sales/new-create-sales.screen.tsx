import { router } from 'expo-router';
import { Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import AvatarCard from '@/components/re-usables/avatar-card';
import { Button } from '@/components/re-usables/button';
import { Header } from '@/components/re-usables/header';
import CustomInput from '@/components/re-usables/input';
import { Text } from '@/components/re-usables/text';
import AddItemsSlideup from '@/components/sales/add-items-slideup';
import { COLORS } from '@/constants/Colors';
import { useItems } from '@/database/hooks/useItem';
import Item from '@/database/model/item.model';
import PXWrapper from '@/layouts/px-wrapper';
import { useSalesItemStore } from '@/store/useSalesItem';
import { formatNumberWithComma } from '@/utils/format-number';

const NewSalesScreen = () => {
  const { items } = useItems({ search: '' });
  const [showSelectItemSlideUp, setShowSelectItemSlideUp] = useState(false);
  const [touchedItem, setTouchedItem] = useState<Item | null>(null);

  const { salesItems, clearSalesItems } = useSalesItemStore();

  const handleSelectItem = (item: Item) => {
    setTouchedItem(item);
    setShowSelectItemSlideUp(true);
  };

  const totalPayment = useMemo(() => {
    return salesItems.reduce((total, item) => total + (item.price || 0) * (item.quantity || 0), 0);
  }, [salesItems]);

  const renderItem = ({ item }: { item: Item }) => {
    const isItemInSales = salesItems.find((salesItem) => salesItem?.itemId === item?.id);
    return (
      <TouchableOpacity
        onPress={() => handleSelectItem(item)}
        key={item?.id}
        style={{
          borderWidth: 1,
          borderColor: COLORS.border,
          borderRadius: 6,
          backgroundColor: 'white',
          padding: 15,
          flex: 1,
          position: 'relative',
        }}
      >
        {isItemInSales && isItemInSales?.quantity > 0 && (
          <View
            style={{
              position: 'absolute',
              top: 10,
              right: 15,
              backgroundColor: COLORS.primary,
              width: 25,
              height: 25,
              borderRadius: 6,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ color: 'white', fontSize: 13, fontFamily: 'Poppins-Medium' }}>
              {isItemInSales?.quantity || 0}
            </Text>
          </View>
        )}
        <AvatarCard name={item?.itemName || ''} size={50} />
        <Text style={{ fontSize: 16, fontWeight: '600', marginTop: 10 }}>{item?.itemName}</Text>
        <Text style={{ fontSize: 13, marginTop: 4 }}>Rs. {item?.sellingPrice}</Text>
        <Text
          style={{
            fontSize: 12,
            color: COLORS.success,
            marginTop: 2,
            flexDirection: 'row',
            alignItems: 'center',
            borderRadius: 4,
            fontFamily: 'Poppins-Medium',
          }}
        >
          Stock Level : {item?.currentStock}
        </Text>
      </TouchableOpacity>
    );
  };
  return (
    <>
      <PXWrapper
        data={items}
        numColumns={2}
        columnWrapperStyle={{
          justifyContent: 'space-between',
          gap: 15,
          marginBottom: 15,
        }}
        renderItem={({ item }: { item: Item }) => renderItem({ item })}
        footer={
          <View
            style={{
              flexDirection: 'row',
              gap: 20,
              flex: 1,
              alignItems: 'center',
              paddingHorizontal: 10,
            }}
          >
            <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium', color: COLORS.text }}>
              {formatNumberWithComma(totalPayment)}
            </Text>
            <Button
              title="Proceed To Sale"
              onPress={() => {
                router.push('/checkout');
              }}
              style={{ flex: 1, paddingVertical: 15 }}
            />
          </View>
        }
        header={
          <View>
            <Header
              title="Select Items"
              onBackPress={() => {
                router.back();
                clearSalesItems();
              }}
            />
            <CustomInput placeholder="Search" leftIcon={<Search size={20} color={COLORS.text} />} />
          </View>
        }
      ></PXWrapper>
      {showSelectItemSlideUp && touchedItem && (
        <AddItemsSlideup
          visible={showSelectItemSlideUp}
          onClose={() => setShowSelectItemSlideUp(false)}
          item={touchedItem}
          onSave={() => {
            setShowSelectItemSlideUp(false);
            setTouchedItem(null);
          }}
        />
      )}
    </>
  );
};


export default NewSalesScreen;
