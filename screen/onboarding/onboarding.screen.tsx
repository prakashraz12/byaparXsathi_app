/* eslint-disable @typescript-eslint/naming-convention */
'use client';

import { useState } from 'react';
import { View, Text, Image, TouchableOpacity, Dimensions, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { AI_IMAGE3, BANNER_LOGO_DARK, FINANCE, SUPPLIER, CUSTOMER } from '@/assets';
import { COLORS } from '@/constants/Colors';
import { Button } from '@/components/re-usables/button';
import { router } from 'expo-router';

const { width, height } = Dimensions.get('window');

const OnboardingScreen = () => {
  const [currentPage, setCurrentPage] = useState(0);

  const onboardingData = [
    {
      id: 1,
      title: 'Welcome to\nByapar Sathi',
      subtitle: 'A Business Management Solution for You.',
      image: AI_IMAGE3,
      showLogo: true,
    },
    {
      id: 2,
      title: 'Customer Management',
      subtitle: "Manage your customer's credit and payments efficiently",
      image: CUSTOMER,
      showLogo: false,
    },
    {
      id: 3,
      title: 'Supplier Management',
      subtitle: 'Handle supplier purchases and payments seamlessly',
      image: SUPPLIER,
      showLogo: false,
    },
    {
      id: 4,
      title: 'Financial Management',
      subtitle: 'Track income, expenses, and savings in one place',
      image: FINANCE,
      showLogo: false,
    },
  ];

  const handleNext = () => {
    if (currentPage < onboardingData.length - 1) {
      setCurrentPage(currentPage + 1);
    } else {
      router.replace('/(routes)/auth');
    }
  };

  const handleSkip = () => {
    router.replace('/(routes)/auth');
  };

  const renderDots = () => {
    return (
      <View style={styles.dotsContainer}>
        {onboardingData.slice(1).map((_, index) => (
          <View
            key={index}
            style={[styles.dot, currentPage === index + 1 ? styles.activeDot : styles.inactiveDot]}
          />
        ))}
      </View>
    );
  };

  if (currentPage === 0) {
    return (
      <View style={styles.fullscreenContainer}>
        <TouchableOpacity onPress={handleSkip} style={styles.skipButton}>
          <Text style={styles.skipText}>Skip</Text>
        </TouchableOpacity>

        <Image source={onboardingData[0].image} style={styles.backgroundImage} resizeMode="cover" />

        <LinearGradient
          colors={['transparent', 'rgba(215, 221, 231, 0.14)', COLORS.primary]}
          style={styles.gradientOverlay}
        />

        <View style={styles.contentOverlay}>
          <View style={styles.textContainer}>
            <View style={styles.logoContainer}>
              <Image
                source={BANNER_LOGO_DARK}
                style={{ width: 200, height: 48 }}
                resizeMode="contain"
              />
            </View>

            <Text style={styles.welcomeSubtitle}>{onboardingData[0].subtitle}</Text>

            <Button
              title="Continue"
              onPress={handleNext}
              variant="outline"
              style={styles.continueButton}
            />
          </View>
        </View>
      </View>
    );
  }

  // Regular onboarding screens
  return (
    <View style={styles.container}>
      {/* Skip button */}
      {currentPage < onboardingData.length - 1 && (
        <TouchableOpacity onPress={handleSkip} style={styles.regularSkipButton}>
          <Text style={styles.regularSkipText}>Skip</Text>
        </TouchableOpacity>
      )}

      <View style={styles.mainContent}>
        <View style={styles.imageContainer}>
          <Image
            source={onboardingData[currentPage].image}
            style={styles.onboardingImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textContent}>
          <Text style={styles.title}>{onboardingData[currentPage].title}</Text>
          <Text style={styles.subtitle}>{onboardingData[currentPage].subtitle}</Text>
        </View>
      </View>

      <View style={styles.bottomSection}>
        {renderDots()}
        <Button
          title={currentPage === onboardingData.length - 1 ? 'Get Started' : 'Next'}
          onPress={handleNext}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  fullscreenContainer: {
    flex: 1,
    position: 'relative',
  },
  skipButton: {
    position: 'absolute',
    top: 48,
    right: 24,
    zIndex: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  skipText: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
  },
  backgroundImage: {
    position: 'absolute',
    width: width,
    height: height,
  },
  gradientOverlay: {
    position: 'absolute',
    width: width,
    height: height,
  },
  contentOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    paddingHorizontal: 32,
    paddingBottom: 64,
    zIndex: 10,
  },
  textContainer: {
    alignItems: 'center',
  },
  logoContainer: {
    marginBottom: 4,
  },

  welcomeSubtitle: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 32,
    color: 'white',
    fontFamily: 'Poppins-Regular',
  },
  continueButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    paddingHorizontal: 48,
    borderRadius: 12,
    width: '100%',
    maxWidth: 288,
    borderColor: COLORS.primary,
    borderWidth: 1,
  },
  continueButtonText: {
    color: COLORS.primary,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  regularSkipButton: {
    position: 'absolute',
    top: 48,
    right: 24,
    zIndex: 10,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  regularSkipText: {
    color: '#6B7280',
    fontSize: 16,
  },
  mainContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 32,
    paddingTop: 64,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 32,
  },
  onboardingImage: {
    maxWidth: 320,
    maxHeight: 320,
  },
  textContent: {
    alignItems: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    color: '#1F2937',
    textAlign: 'center',
    marginBottom: 16,
    lineHeight: 32,
    fontFamily: 'Poppins-Bold',
  },
  subtitle: {
    fontSize: 14,
    color: '#6B7280',
    textAlign: 'center',
    lineHeight: 26,
    paddingHorizontal: 16,
    fontFamily: 'Poppins-Regular',
  },
  bottomSection: {
    paddingBottom: 50,
    paddingHorizontal: 32,
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
    marginBottom: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  activeDot: {
    backgroundColor: '#3B82F6',
  },
  inactiveDot: {
    backgroundColor: '#D1D5DB',
  },
});

export default OnboardingScreen;
