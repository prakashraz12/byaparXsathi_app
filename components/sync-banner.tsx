import { CloudUpload } from 'lucide-react-native';
import { useEffect, useRef } from 'react';
import { Animated, Easing,StyleSheet, View } from 'react-native';

import { COLORS } from '@/constants/Colors';

import { Text } from './re-usables/text';

interface SyncBannerProps {
  message?: string;
  type?: 'syncing' | 'backup' | 'uploading';
}

const SyncBanner = ({ message = 'Data Backing Up......' }: SyncBannerProps) => {
  // Animation values for circles
  const circle1 = useRef(new Animated.Value(0)).current;
  const circle2 = useRef(new Animated.Value(0)).current;
  const circle3 = useRef(new Animated.Value(0)).current;

  // Cloud icon animation
  const cloudBounce = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Staggered circle animations
    const createCircleAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ]),
      );
    };

    // Cloud bounce animation
    const cloudAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cloudBounce, {
          toValue: -3,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cloudBounce, {
          toValue: 0,
          duration: 1000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    const anim1 = createCircleAnimation(circle1, 0);
    const anim2 = createCircleAnimation(circle2, 200);
    const anim3 = createCircleAnimation(circle3, 400);

    anim1.start();
    anim2.start();
    anim3.start();
    cloudAnimation.start();

    return () => {
      anim1.stop();
      anim2.stop();
      anim3.stop();
      cloudAnimation.stop();
    };
  }, []);

  const getCircleStyle = (animValue: Animated.Value) => {
    const scale = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });

    const opacity = animValue.interpolate({
      inputRange: [0, 1],
      outputRange: [0.3, 1],
    });

    return {
      transform: [{ scale }],
      opacity,
    };
  };

  return (
    <View style={styles.container}>
      {/* Icon Container */}
      <Animated.View style={[styles.iconContainer]}>
        <CloudUpload size={26} color={COLORS.success} strokeWidth={2} />
      </Animated.View>

      {/* Text */}
      <Text style={styles.message}>{message}</Text>

      {/* Animated Circles */}
      <View style={styles.circlesContainer}>
        <Animated.View style={[styles.circle, getCircleStyle(circle1)]} />
        <Animated.View style={[styles.circle, getCircleStyle(circle2)]} />
        <Animated.View style={[styles.circle, getCircleStyle(circle3)]} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    backgroundColor: '#f9fafb',
    gap: 12,
  },
  iconContainer: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Poppins-Medium',
    color: COLORS.success,
  },
  circlesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  circle: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3b82f6',
  },
});

export default SyncBanner;
