
import { COLORS } from "@/constants/Colors"
import { Ionicons } from "@expo/vector-icons"
import type React from "react"
import { useEffect, useRef } from "react"
import { Modal, View, Text, Animated, Dimensions, StyleSheet, TouchableWithoutFeedback, TouchableOpacity } from "react-native"
import { PanGestureHandler, State, GestureHandlerRootView, ScrollView } from "react-native-gesture-handler"
import type { PanGestureHandlerGestureEvent } from "react-native-gesture-handler"
import { useSafeAreaInsets } from "react-native-safe-area-context"

const { height: SCREEN_HEIGHT } = Dimensions.get("window")

interface SlideUpModalProps {
  visible: boolean
  onClose: () => void
  children: React.ReactNode
  title?: string
  height?: number
  showHandle?: boolean
  backdropOpacity?: number
  animationDuration?: number
  stickyFooter?: React.ReactNode
}

export const SlideUpModal: React.FC<SlideUpModalProps> = ({
  visible,
  onClose,
  children,
  title,
  height = SCREEN_HEIGHT * 0.6,
  showHandle = true,
  backdropOpacity = 0.5,
  animationDuration = 300,
  stickyFooter,
}) => {
  const insets = useSafeAreaInsets()
  const translateY = useRef(new Animated.Value(height)).current
  const backdropOpacityAnimated = useRef(new Animated.Value(0)).current

  useEffect(() => {
    if (visible) {
      // Slide up animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacityAnimated, {
          toValue: backdropOpacity,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start()
    } else {
      // Slide down animation
      Animated.parallel([
        Animated.timing(translateY, {
          toValue: height,
          duration: animationDuration,
          useNativeDriver: true,
        }),
        Animated.timing(backdropOpacityAnimated, {
          toValue: 0,
          duration: animationDuration,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible])

  const handleGestureEvent = (event: PanGestureHandlerGestureEvent) => {
    const { translationY } = event.nativeEvent

    if (translationY > 0) {
      translateY.setValue(translationY)
      const opacity = backdropOpacity * (1 - translationY / height)
      backdropOpacityAnimated.setValue(Math.max(0, opacity))
    }
  }

  const handleGestureStateChange = (event: PanGestureHandlerGestureEvent) => {
    const { translationY, velocityY, state } = event.nativeEvent

    if (state === State.END) {
      const shouldClose = translationY > height * 0.3 || velocityY > 500

      if (shouldClose) {
        onClose()
      } else {
        Animated.parallel([
          Animated.spring(translateY, {
            toValue: 0,
            useNativeDriver: true,
          }),
          Animated.timing(backdropOpacityAnimated, {
            toValue: backdropOpacity,
            duration: 500,
            useNativeDriver: true,
          }),
        ]).start()
      }
    }
  }

  const handleBackdropPress = () => {
    onClose()
  }

  return (
    <Modal visible={visible} transparent animationType="none" statusBarTranslucent>
      <GestureHandlerRootView style={styles.container}>
        <TouchableWithoutFeedback onPress={handleBackdropPress}>
          <Animated.View
            style={[
              styles.backdrop,
              {
                opacity: backdropOpacityAnimated,
              },
            ]}
          />
        </TouchableWithoutFeedback>

        <PanGestureHandler onGestureEvent={handleGestureEvent} onHandlerStateChange={handleGestureStateChange}>
          <Animated.View
            style={[
              styles.modalContainer,
              {
                height,
                transform: [{ translateY }],
              },
            ]}
          >
            {showHandle && (
              <View style={styles.handleContainer}>
                <View style={styles.handle} />
              </View>
            )}

            {title && (
              <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <TouchableOpacity onPress={onClose}>
                 <Ionicons name="close" size={24} color="#1A1A1A" />
                </TouchableOpacity>
              </View>
            )}

            <ScrollView style={styles.content}>{children}</ScrollView>
            {stickyFooter ? <View style={[styles.stickyFooter, {paddingVertical: insets.bottom}]}>{stickyFooter}</View> : null }
          </Animated.View>
        </PanGestureHandler>
      </GestureHandlerRootView>
    </Modal>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "black",
  },
  modalContainer: {
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  handleContainer: {
    alignItems: "center",
    paddingVertical: 12,
  },
  handle: {
    width: 40,
    height: 4,
    backgroundColor: "#E5E5E5",
    borderRadius: 2,
  },
  titleContainer: {
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
    marginBottom: 16,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1A1A1A",
    textAlign: "center",
  },
  stickyFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    backgroundColor: "white",
    
  },
  content: {
    flex: 1,
  },
})