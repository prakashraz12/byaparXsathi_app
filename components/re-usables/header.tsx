import type React from "react"
import { View, Text, TouchableOpacity, StyleSheet, StatusBar } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { COLORS } from "@/constants/Colors"

interface HeaderProps {
  title: string
  onBackPress?: () => void
  showBackButton?: boolean
  rightComponent?: React.ReactNode
  backgroundColor?: string
  titleColor?: string
  backButtonColor?: string
  style?: any
}

export const Header: React.FC<HeaderProps> = ({
  title,
  onBackPress,
  showBackButton = true,
  rightComponent,
  titleColor = "#1A1A1A",
  backButtonColor = COLORS.primary,
  style,
}) => {
  const handleBackPress = () => {
    if (onBackPress) {
      onBackPress()
    }
  }

  return (
    <>
      <StatusBar
        barStyle={"dark-content"}
        backgroundColor={COLORS.background}
      />
      <View style={[style]}>
        <View style={styles.content}>
          <View style={{flexDirection:"row", alignItems:"center", justifyContent:"space-between"}}>
            <View style={styles.leftSection}>
            {showBackButton && (
              <TouchableOpacity style={styles.backButton} onPress={handleBackPress} activeOpacity={0.7}>
                <Ionicons name="arrow-back" size={24} color={backButtonColor} />
              </TouchableOpacity>
            )}
          </View>

          {/* Center Section - Title */}
          <View style={styles.centerSection}>
            <Text style={[styles.title, { color: titleColor }]} numberOfLines={1} ellipsizeMode="tail">
              {title}
            </Text>
          </View>
          </View>

          {/* Right Section - Custom Component */}
          <View style={styles.rightSection}>{rightComponent}</View>
        </View>
      </View>
    </>
  )
}

const styles = StyleSheet.create({

  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:"space-between",
    height: 50,
  },
  leftSection: {
    width: 32,
    alignItems: "flex-start",
  },
  centerSection: {
    alignItems: "center",
    paddingHorizontal: 16,
  },
  rightSection: {
   width: "auto",
   alignItems:"center",
   marginRight:16
  },
  backButton: {
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 19,
    fontFamily: "Poppins-Medium",
  },
})
