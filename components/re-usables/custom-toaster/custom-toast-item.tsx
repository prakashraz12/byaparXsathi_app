import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Dimensions,
  PanResponder,
} from 'react-native';
import { ToastConfig } from './custom-toaster-types';
import { CheckCircleIcon, Info, X, XCircleIcon } from 'lucide-react-native';

interface ToastItemProps {
  toast: ToastConfig;
  onHide: () => void;
}

const { width: screenWidth } = Dimensions.get('window');

export const ToastItem: React.FC<ToastItemProps> = ({ toast, onHide }) => {
  const translateY = useRef(new Animated.Value(-100)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    // Entry animation
    Animated.parallel([
      Animated.spring(translateY, {
        toValue: 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(opacity, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(scale, {
        toValue: 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();

    // Auto dismiss
    if (toast.duration && toast.duration > 0) {
      const timer = setTimeout(() => {
        hideToast();
      }, toast.duration);

      return () => clearTimeout(timer);
    }
  }, []);

  const hideToast = () => {
    Animated.parallel([
      Animated.timing(translateY, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(scale, {
        toValue: 0.8,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start(() => {
      onHide();
    });
  };

  // Pan responder for swipe to dismiss - Fixed version
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (evt, gestureState) => {
        return Math.abs(gestureState.dx) > 20;
      },
      onPanResponderMove: (evt, gestureState) => {
        translateX.setValue(gestureState.dx);
      },
      onPanResponderRelease: (evt, gestureState) => {
        if (Math.abs(gestureState.dx) > screenWidth * 0.3 || Math.abs(gestureState.vx) > 0.5) {
          // Swipe to dismiss
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: gestureState.dx > 0 ? screenWidth : -screenWidth,
              duration: 200,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 200,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onHide();
          });
        } else {
          // Spring back to original position
          Animated.spring(translateX, {
            toValue: 0,
            useNativeDriver: true,
            tension: 100,
            friction: 8,
          }).start();
        }
      },
    }),
  ).current;

  const getToastStyle = () => {
    switch (toast.type) {
      case 'success':
        return styles.successToast;
      case 'error':
        return styles.errorToast;
      case 'warning':
        return styles.warningToast;
      case 'info':
        return styles.infoToast;
      default:
        return styles.infoToast;
    }
  };

  const getIconEmoji = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircleIcon size={16} color="#FFFFFF" />;
      case 'error':
        return <XCircleIcon size={16} color="#FFFFFF" />;
      case 'warning':
        return <Info size={16} color="#FFFFFF" />;
      case 'info':
        return <Info size={16} color="#FFFFFF" />;
      default:
        return <Info size={16} color="#FFFFFF" />;
    }
  };

  return (
    <Animated.View
      style={[
        styles.container,
        getToastStyle(),
        {
          transform: [{ translateY }, { translateX }, { scale }],
          opacity,
        },
      ]}
      {...panResponder.panHandlers}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>{getIconEmoji()}</Text>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{toast.title}</Text>
          {toast.message && <Text style={styles.message}>{toast.message}</Text>}
        </View>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={hideToast}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.closeText}>
            <X size={20} color="#FFFFFF" />
          </Text>
        </TouchableOpacity>
      </View>

      {toast.action && (
        <TouchableOpacity
          style={styles.actionButton}
          onPress={() => {
            toast.action?.onPress();
            hideToast();
          }}
        >
          <Text style={styles.actionText}>{toast.action.label}</Text>
        </TouchableOpacity>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 8,
    borderRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    zIndex: 9999,
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal:12,
    paddingVertical:12,
    zIndex: 9999,
  },
  icon: {
    fontSize: 16,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    color: '#FFFFFF',
    marginBottom: 2,
    fontFamily: 'Poppins-Regular',
  },
  message: {
    fontSize: 12,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  closeButton: {
    marginLeft: 8,
  },
  closeText: {
    fontSize: 16,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.2)',
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
    fontFamily: 'Poppins-Regular',
    textAlign: 'center',
  },
  successToast: {
    backgroundColor: '#10B981',
  },
  errorToast: {
    backgroundColor: '#EF4444',
  },
  warningToast: {
    backgroundColor: '#F59E0B',
  },
  infoToast: {
    backgroundColor: '#3B82F6',
  },
});
