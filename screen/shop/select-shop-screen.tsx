import { router } from 'expo-router';
import { CheckCircleIcon } from 'lucide-react-native';
import { useState } from 'react';
import { TouchableOpacity, View } from 'react-native';

import AvatarCard from '@/components/re-usables/avatar-card';
import { Button } from '@/components/re-usables/button';
import { Text } from '@/components/re-usables/text';
import { COLORS } from '@/constants/Colors';
import useShops from '@/database/hooks/useShops';
import { useSync } from '@/database/hooks/useSync';
import Shop from '@/database/model/shop.model';
import PXWrapper from '@/layouts/px-wrapper';
import { useUserStore } from '@/store/useUserStore';

const SelectShopScreen = () => {
  const { shops } = useShops();
  const { user, setActiveShopId } = useUserStore();
  const [selectedShop, setSelectedShop] = useState<Shop | null>(null);
  const { syncNow } = useSync();

  const handleContinue = () => {
    if (selectedShop?.id) {
      setActiveShopId(selectedShop?.id);
      syncNow({
        isFirstTime: true,
        fetchShops: false,
      });
      router.push('/syncing');
    }
  };
  return (
    <PXWrapper style={{ paddingHorizontal: 20 }}>
      <View style={{ marginTop: 60 }}>
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Poppins-SemiBold',
            color: COLORS.primary,
          }}
        >
          Welcome back!
        </Text>
        <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>
          Good evening,{user?.fullName}
        </Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Poppins-Regular',
            marginTop: 12,
            color: COLORS.textLight,
          }}
        >
          Byapar Sathi is a ultimate business management app for small and medium businesses. it
          hepls buisenns to keep daily transitions.
        </Text>
      </View>
      <View style={{ marginTop: 20, marginBottom: 15 }}>
        <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>Select Shop to continue,</Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Poppins-Regular',
            color: COLORS.textLight,
          }}
        >
          You have {shops?.length || 0} different shops.
        </Text>
        <View style={{ marginTop: 20 }}>
          {shops?.map((shop: Shop) => (
            <TouchableOpacity
              onPress={() => setSelectedShop(shop)}
              key={shop?.id}
              style={[
                {
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: COLORS.border,
                  borderRadius: 7,
                  padding: 10,
                  flexDirection: 'row',
                  alignItems: 'center',
                  position: 'relative',
                  gap: 12,
                },
                selectedShop?.id === shop?.id && {
                  borderColor: COLORS.success,
                  borderWidth: 1,
                },
              ]}
            >
              <AvatarCard name={shop?.shopName || ''} size={60} />
              <View style={{ flex: 1, flexDirection: 'column' }}>
                <Text style={{ fontSize: 16, fontFamily: 'Poppins-Medium' }}>{shop?.shopName}</Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontFamily: 'Poppins-Regular',
                    marginTop: 1,
                    color: COLORS.textLight,
                  }}
                >
                  {shop?.address}
                </Text>
              </View>
              {selectedShop?.id === shop?.id && (
                <View style={{ position: 'absolute', right: 15, top: 15 }}>
                  <CheckCircleIcon size={20} color={COLORS.success} />
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <Button disabled={!selectedShop} title="Continue" onPress={handleContinue} />
    </PXWrapper>
  );
};

export default SelectShopScreen;
