import AvatarCard from '@/components/re-usables/avatar-card';
import { Text } from '@/components/re-usables/text';
import { COLORS } from '@/constants/Colors';
import { View } from 'react-native';

interface ItemCardProps {
  itemName: string;
  sellingPrice: string | number;
  costPrice: string | number;
  isStockEnable: boolean;
  currentLevel: number | string;
  openingLevel: number;
  isActive: boolean;
  measurementUnit: string;
}
const ItemCard = ({
  itemName,
  sellingPrice,
  costPrice,
  currentLevel,
  openingLevel,
  isActive,
  isStockEnable,
  measurementUnit,
}: ItemCardProps) => {
  return (
    <View
      style={{
        padding: 10,
        gap: 12,
        flexDirection: 'row',
        alignContent: 'center',
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 5,
        position: 'relative',
        marginBottom: 15,
        backgroundColor: 'white',
      }}
    >
      <AvatarCard name={itemName} size={50} />
      <View>
        <Text>{itemName || ''}</Text>
        <View>
          <View
            style={{
              flexDirection: 'row',
              gap: 2,
              flex: 1,
              width: '70%',
              justifyContent: 'space-between',
            }}
          >
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>S.P Rs.{sellingPrice}</Text>
            <Text style={{ fontSize: 14, color: COLORS.textLight }}>C.P Rs.{costPrice}</Text>
          </View>
          <View>
            <Text style={{ fontSize: 14, color: COLORS.success }}>
              Stock level: {currentLevel} {measurementUnit}
            </Text>
          </View>
        </View>
      </View>
      <View
        style={{
          height: 10,
          position: 'absolute',
          top: 6,
          right: 6,
          borderRadius: 5,
          padding: 10,
          backgroundColor: COLORS.success,
        }}
      >
        <Text style={{ fontSize: 10, color: 'white' }}>IN STOCK</Text>
      </View>
    </View>
  );
};

export default ItemCard;
