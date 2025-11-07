import { StatusBar } from 'expo-status-bar';
import React, { useRef, useState } from 'react';
import {
  Animated,
  FlatList,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import NotFound from '@/components/re-usables/not-found';

interface PXWrapperProps {
  children?: React.ReactNode;
  showsVerticalScrollIndicator?: boolean;
  contentContainerStyle?: object;
  style?: object;
  header?: React.ReactNode;
  data?: any;
  renderItem?: any;
  floatingAction?: React.ReactNode;
  footer?: React.ReactNode;
  backgroundColor?: string;
  floatingActionStyle?: object;
  numColumns?: number;
  columnWrapperStyle?: object;
}

const PXWrapper = ({
  children,
  showsVerticalScrollIndicator = false,
  contentContainerStyle,
  style,
  header,
  data,
  renderItem,
  floatingAction,
  footer,
  backgroundColor,
  floatingActionStyle,
  numColumns,
  columnWrapperStyle,
}: PXWrapperProps) => {
  const insets = useSafeAreaInsets();
  const scrollY = useRef(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const [isVisible, setIsVisible] = useState(true);

  const handleScroll = (event: any) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const scrollDiff = currentScrollY - scrollY.current;

    // Show button when scrolling up, hide when scrolling down
    if (scrollDiff > 5 && isVisible) {
      // Scrolling down
      setIsVisible(false);
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }).start();
    } else if (scrollDiff < -5 && !isVisible) {
      // Scrolling up
      setIsVisible(true);
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 200,
        useNativeDriver: true,
      }).start();
    }

    scrollY.current = currentScrollY;
  };

  return (
    <View
      style={[
        styles.safeArea,
        { paddingTop: insets.top * 0.6 },
        style,
        { backgroundColor: backgroundColor ? backgroundColor : '#F2F2F7' },
        floatingAction ? { position: 'relative' } : {},
      ]}
    >
      <StatusBar style="dark" />
      {header ? <View style={styles.header}>{header}</View> : null}

      {floatingAction && (
        <Animated.View
          style={[
            styles.floatingButtonContainer,
            floatingActionStyle,
            {
              opacity: fadeAnim,
              transform: [
                {
                  translateY: fadeAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [100, 0],
                  }),
                },
              ],
            },
          ]}
          pointerEvents={isVisible ? 'auto' : 'none'}
        >
          {floatingAction}
        </Animated.View>
      )}

      <View style={{ flex: 1 }}>
        {data?.length > 0 && renderItem ? (
          <FlatList
            data={data}
            renderItem={renderItem}
            removeClippedSubviews={true}
            maxToRenderPerBatch={10}
            updateCellsBatchingPeriod={30}
            initialNumToRender={10}
            windowSize={21}
            numColumns={numColumns}
            keyExtractor={(item, index) => item?.id || index.toString()}
            contentContainerStyle={{
              paddingBottom: footer ? 90 : 80,
              paddingHorizontal: 10,
              paddingTop: 10,
            }}
            columnWrapperStyle={columnWrapperStyle}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          />
        ) : data?.length === 0 ? (
          <NotFound title="No Data Found" />
        ) : (
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={Platform.OS === 'ios' ? 100 : 0}
          >
            <ScrollView
              style={styles.scrollView}
              contentContainerStyle={[
                styles.contentContainer,
                contentContainerStyle,
                footer ? { paddingBottom: 90 } : {},
              ]}
              showsVerticalScrollIndicator={showsVerticalScrollIndicator}
              scrollEventThrottle={16}
              removeClippedSubviews={true}
              onScroll={handleScroll}
            >
              {typeof children === 'string' ? <Text>{children}</Text> : children}

            </ScrollView>
          </KeyboardAvoidingView>
        )}
      </View>

      {footer && (
        <View style={[styles.footer, { paddingBottom: insets.bottom + 8 || 10 }]}>{footer}</View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  scrollView: {
    flex: 1,
    height: '100%',
    paddingVertical: 2,
    paddingHorizontal: 8,
  },
  contentContainer: {
    paddingHorizontal: 5,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 10,
    paddingBottom: 0,
    marginTop: 15,
  },
  noDataText: {
    fontSize: 16,
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
    marginTop: 20,
  },
  floatingButtonContainer: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    zIndex: 1000,
    elevation: 5,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 10,
    paddingTop: 10,
    backgroundColor: '#F2F2F7',
  },
});

export default PXWrapper;
