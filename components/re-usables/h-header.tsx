import { View } from 'react-native';
import { Text } from './text';
import { COLORS } from '@/constants/Colors';

const HHeader = ({ title }: { title: string }) => {
  return (
    <View>
      <Text
        variant="h6"
        style={{
          marginBottom: 10,
          color: COLORS.text,
          fontFamily: 'Poppins-SemiBold',
          fontSize: 18,
        }}
      >
        {title}
      </Text>
    </View>
  );
};
export default HHeader;
