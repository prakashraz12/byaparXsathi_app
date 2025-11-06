import { router } from 'expo-router';
import { CloudDownload } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Easing, StyleSheet,View } from 'react-native';

import { useSyncStore } from '@/store/useSync';

import { Text } from './re-usables/text';

const Syncing = () => {
  // Animation values
  const { syncing } = useSyncStore();
  const cloudScale = useRef(new Animated.Value(1)).current;
  const downloadPosition = useRef(new Animated.Value(0)).current;
  const progressWidth = useRef(new Animated.Value(0)).current;

  // State for dots
  const [dots, setDots] = useState('');

  useEffect(() => {
    const breatheAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(cloudScale, {
          toValue: 1.1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(cloudScale, {
          toValue: 1,
          duration: 1500,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    // Download arrow bounce animation
    const bounceAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(downloadPosition, {
          toValue: 8,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(downloadPosition, {
          toValue: 0,
          duration: 800,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    // Progress bar animation
    const progressAnimation = Animated.loop(
      Animated.sequence([
        Animated.timing(progressWidth, {
          toValue: 1,
          duration: 2000,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: false,
        }),
        Animated.timing(progressWidth, {
          toValue: 0,
          duration: 0,
          useNativeDriver: false,
        }),
      ]),
    );

    // Dots animation using setInterval
    let dotCount = 0;
    const dotsInterval = setInterval(() => {
      dotCount = (dotCount + 1) % 4;
      setDots('.'.repeat(dotCount));
    }, 500);

    breatheAnimation.start();
    bounceAnimation.start();
    progressAnimation.start();

    return () => {
      breatheAnimation.stop();
      bounceAnimation.stop();
      progressAnimation.stop();
      clearInterval(dotsInterval);
    };
  }, []);

  const progressWidthInterpolated = progressWidth.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  useEffect(() => {
    if (syncing !== null && syncing === false) {
      router.replace('/(tabs)');
    }
  }, [syncing]);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.iconContainer,
          {
            transform: [{ scale: cloudScale }, { translateY: downloadPosition }],
          },
        ]}
      >
        <CloudDownload size={60} color="#3b82f6" strokeWidth={1.5} />
      </Animated.View>

      <View style={styles.textContainer}>
        <Text style={styles.mainText}>Syncing data{dots}</Text>
        <Text style={styles.subText}>Please do not close the app</Text>
      </View>

      {/* Progress indicator */}
      <View style={styles.progressContainer}>
        <Animated.View
          style={[
            styles.progressBar,
            {
              width: progressWidthInterpolated,
            },
          ]}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    zIndex: 99999,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 24,
  },
  textContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  mainText: {
    fontSize: 20,
    fontFamily: 'PoppinsSemiBold',
    color: '#1f2937',
    marginBottom: 8,
    minHeight: 28,
  },
  subText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  progressContainer: {
    width: 200,
    height: 4,
    backgroundColor: '#e5e7eb',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: 12,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#3b82f6',
    borderRadius: 2,
  },
});

export default Syncing;
