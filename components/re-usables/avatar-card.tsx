import { View } from 'react-native';

import { COLORS } from '@/constants/Colors';

import { Text } from './text';

interface IAvatarCard {
  name: string;
  size: number;
  borderRedius?: number;
}
const AvatarCard = ({ name, size, borderRedius }: IAvatarCard) => {
  return (
    <View
      style={{
        width: size || 50,
        height: size || 50,
        borderRadius: borderRedius || size / 2,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: COLORS.border,
        backgroundColor: COLORS.background,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text
        style={{
          fontSize: 14,
          color: COLORS.text,
          textAlign: 'center',
          fontFamily: 'Poppins-SemiBold',
          textAlignVertical: 'center',
        }}
      >
        {name?.slice(0, 2)?.toUpperCase()}
      </Text>
    </View>
  );
};
export default AvatarCard;
