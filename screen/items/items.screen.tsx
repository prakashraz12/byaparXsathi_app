import { router } from 'expo-router';
import { Dot, ListFilter, Plus, Search } from 'lucide-react-native';
import { useMemo, useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import ItemFilterSlider from '@/components/items/item-filter-slider';
import { Button } from '@/components/re-usables/button';
import HHeader from '@/components/re-usables/h-header';
import CustomInput from '@/components/re-usables/input';
import { COLORS } from '@/constants/Colors';
import { useItems } from '@/database/hooks/useItem';
import Item from '@/database/model/item.model';
import PXWrapper from '@/layouts/px-wrapper';

import ItemCard from '../../components/items/item-card';

const ItemScreen = () => {
  const [itemName, setItemName] = useState<string>('');
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState<'asc' | 'desc'>('asc');
  const [sortStockBy, setSortStockBy] = useState<'asc' | 'desc'>('asc');
  const { items } = useItems({ search: itemName, sortBy, sortByStock: sortStockBy });

  const isFilterApplied = useMemo(() => {
    return sortBy !== 'asc' || sortStockBy !== 'asc';
  }, [sortBy, sortStockBy]);

  return (
    <PXWrapper
      data={items}
      renderItem={({ item }: { item: Item }) => (
        <ItemCard
          itemName={item?.itemName || ''}
          currentLevel={item?.currentStock || 0}
          openingLevel={item?.openingStock || 0}
          isActive={item?.isActive || false}
          isStockEnable={item.isStockEnabled || false}
          sellingPrice={item?.sellingPrice || 0}
          costPrice={item?.costPrice || 0}
          measurementUnit={item.measurementUnit || ''}
        />
      )}
      floatingAction={
        <Button
          variant="primary"
          leftIcon={<Plus size={22} color="#FFFFFF" />}
          title="Add Item"
          onPress={() => router.push('/(routes)/items/create')}
        />
      }
      header={
        <View>
          <HHeader title="Items" />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
              width: '100%',
            }}
          >
            <View style={{ flex: 1 }}>
              <CustomInput
                value={itemName}
                onChangeText={setItemName}
                placeholder="Search Sales transactions"
                leftIcon={<Search />}
              />
            </View>
            <TouchableOpacity
              style={{
                width: 54,
                height: 54,
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: COLORS.cardBackground,
                borderRadius: 5,
                borderWidth: 1,
                borderColor: COLORS.border,
              }}
              onPress={() => setFilterOpen(true)}
            >
              <View style={{ position: 'relative' }}>
                <ListFilter size={20} color={COLORS.text} />
                {isFilterApplied && (
                  <Dot
                    size={45}
                    color={COLORS.primary}
                    style={{ position: 'absolute', top: -19, right: -19 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View>
          <ItemFilterSlider
            visible={filterOpen}
            onClose={() => setFilterOpen(false)}
            sortBy={sortBy as 'asc' | 'desc'}
            setSortBy={(sortBy) => setSortBy(sortBy)}
            sortStockBy={sortStockBy as 'asc' | 'desc'}
            setSortStockBy={(sortStockBy) => setSortStockBy(sortStockBy)}
          />
        </View>
      }
    ></PXWrapper>
  );
};

export default ItemScreen;
