import { useEffect, useRef } from 'react';
import { Animated, Easing, View } from 'react-native';

import { COLORS } from '@/constants/Colors';

import { Button } from './button';
import { Text } from './text';

interface INotFound {
  title?: string;
  description?: string;
  renderButton?: {
    buttonTitle: string;
    onPress: () => void;
  };
}

const NotFound = ({
  title = 'Data Not Found',
  description = "The information you're looking for doesn't exist or has been removed.",
  renderButton,
}: INotFound) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const floatAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 700,
      easing: Easing.out(Easing.back(1.2)),
      useNativeDriver: true,
    }).start();

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 800,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();

    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 8000,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    Animated.loop(
      Animated.sequence([
        Animated.timing(floatAnim, {
          toValue: 1,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(floatAnim, {
          toValue: 0,
          duration: 3000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    ).start();
  }, [fadeAnim, scaleAnim, floatAnim, slideAnim, rotateAnim]);

  const floatOffset = floatAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 8],
  });

  const rotateInterpolate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 420,
        paddingHorizontal: 16,
        paddingVertical: 24,
        opacity: fadeAnim,
      }}
    >
      <View
        style={{
          position: 'absolute',
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
        }}
      >
        <View
          style={{
            position: 'absolute',
            width: 200,
            height: 200,
            backgroundColor: COLORS.primary,
            borderRadius: 100,
            opacity: 0.03,
            top: -50,
            right: -50,
          }}
        />
        <View
          style={{
            position: 'absolute',
            width: 150,
            height: 150,
            backgroundColor: COLORS.primary,
            borderRadius: 75,
            opacity: 0.02,
            bottom: -30,
            left: -30,
          }}
        />
      </View>

      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          opacity: fadeAnim,
          width: '100%',
          maxWidth: 480,
        }}
      >
        {/* Outer card shadow layer */}
        <View>
          {/* Main content container */}
          <View
            style={{
              paddingHorizontal: 32,
              paddingTop: 40,
              paddingBottom: 32,
              alignItems: 'center',
            }}
          >
            <Animated.View
              style={{
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: COLORS.primary,
                opacity: 0.08,
                marginBottom: 24,
                justifyContent: 'center',
                alignItems: 'center',
                transform: [
                  { scale: scaleAnim },
                  { translateY: floatOffset },
                  { rotate: rotateInterpolate },
                ],
              }}
            >
              <Text
                style={{
                  fontSize: 48,
                  fontWeight: '800',
                  color: COLORS.primary,
                  fontFamily: 'Poppins-Bold',
                  opacity: 0.6,
                }}
              >
                ∅
              </Text>
            </Animated.View>

            <Text
              style={{
                fontSize: 24,
                fontWeight: '700',
                color: COLORS.text,
                fontFamily: 'Poppins-Bold',
                marginBottom: 12,
                textAlign: 'center',
                letterSpacing: -0.3,
              }}
            >
              {title}
            </Text>

            {/* Decorative line */}
            <View
              style={{
                width: 40,
                height: 2,
                backgroundColor: COLORS.primary,
                borderRadius: 1,
                marginBottom: 20,
                opacity: 0.4,
              }}
            />

            <Text
              style={{
                fontSize: 14,
                color: COLORS.textLight,
                fontFamily: 'Poppins-Regular',
                marginBottom: 32,
                textAlign: 'center',
                lineHeight: 22,
                letterSpacing: 0.2,
              }}
            >
              {description}
            </Text>

            <View
              style={{
                flexDirection: 'row',
                gap: 12,
                marginBottom: 32,
                justifyContent: 'center',
                alignItems: 'center',
              }}
            >
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: COLORS.primary,
                  opacity: 0.3,
                }}
              />
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: COLORS.primary,
                  opacity: 0.5,
                }}
              />
              <View
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  backgroundColor: COLORS.primary,
                  opacity: 0.3,
                }}
              />
            </View>

            {renderButton && (
              <Button
                title={renderButton.buttonTitle}
                onPress={renderButton.onPress}
                style={{
                  width: '100%',
                  paddingVertical: 14,
                }}
              />
            )}
          </View>

          <View
            style={{
              paddingHorizontal: 32,
              paddingVertical: 12,
              backgroundColor: COLORS.primary,
              opacity: 0.02,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 11,
                color: COLORS.textLight,
                fontFamily: 'Poppins-Regular',
                opacity: 0.5,
                letterSpacing: 0.5,
              }}
            >
              NO DATA AVAILABLE
            </Text>
          </View>
        </View>
      </Animated.View>
    </Animated.View>
  );
};

export default NotFound;
