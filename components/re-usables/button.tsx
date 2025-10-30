import { COLORS } from "@/constants/Colors"
import type React from "react"
import {
  TouchableOpacity,
  Text,
  View,
  ActivityIndicator,
  StyleSheet,
  type ViewStyle,
  type TextStyle,
  type TouchableOpacityProps,
} from "react-native"

interface ButtonProps extends Omit<TouchableOpacityProps, "style"> {
  title?: string
  variant?: "primary" | "secondary" | "outline" | "ghost" | "destructive" | "success" | "destructiveOutline"
  size?: "small" | "medium" | "large" | "xl"
  loading?: boolean
  disabled?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  iconOnly?: boolean
  fullWidth?: boolean
  style?: ViewStyle
  textStyle?: TextStyle
}

export const Button: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "medium",
  loading = false,
  disabled = false,
  leftIcon,
  rightIcon,
  iconOnly = false,
  fullWidth = false,
  style,
  textStyle,
  onPress,
  ...props
}) => {
  const buttonStyles = [
    styles.base,
    styles[variant],
    styles[size],
    iconOnly && styles.iconOnly,
    fullWidth && styles.fullWidth,
    (disabled || loading) && styles.disabled,
    (disabled || loading) && styles[`${variant}Disabled`],
    style,
  ]

  const textStyles = [styles.text, styles[`${variant}Text`], styles[`${size}Text`], textStyle]

  const handlePress = (event: any) => {
    if (!disabled && !loading && onPress) {
      onPress(event)
    }
  }

  return (
    <TouchableOpacity
      style={buttonStyles}
      onPress={handlePress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      {...props}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator
            size="small"
            color={variant === "outline" || variant === "ghost" ? COLORS.primary : "#FFFFFF"}
            style={!iconOnly && title ? styles.loadingIcon : undefined}
          />
        ) : (
          leftIcon && <View style={!iconOnly && title ? styles.leftIcon : undefined}>{leftIcon}</View>
        )}

        {!iconOnly && title && (
          <Text style={textStyles} numberOfLines={1}>
            {title}
          </Text>
        )}

        {!loading && rightIcon && <View style={!iconOnly && title ? styles.rightIcon : undefined}>{rightIcon}</View>}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },

  // Variants
  primary: {
    backgroundColor: COLORS.primary,
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  secondary: {
    backgroundColor: "#F1F5F9",
    borderWidth: 1,
    borderColor: "#E2E8F0",
  },
  outline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.primary,
  },
  ghost: {
    backgroundColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    elevation: 0,
  },
  destructive: {
    backgroundColor: "#EF4444",
    borderWidth: 1,
    borderColor: "#EF4444",
  },
  destructiveOutline: {
    backgroundColor: "transparent",
    borderWidth: 1.5,
    borderColor: COLORS.error,
  },
  success: {
    backgroundColor: "#10B981",
    borderWidth: 1,
    borderColor: "#10B981",
  },

  // Sizes
  small: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    minHeight: 36,
  },
  medium: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    minHeight: 44,
  },
  large: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    minHeight: 52,
  },
  xl: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    minHeight: 60,
  },

  // Icon only
  iconOnly: {
    paddingHorizontal: 0,
    aspectRatio: 1,
  },

  // Full width
  fullWidth: {
    width: "100%",
  },

  // Text styles
  text: {
    textAlign: "center",
    fontFamily: "Poppins-Regular",
  },
  primaryText: {
    color: "#FFFFFF",
  },
  secondaryText: {
    color: "#475569",
  },
  outlineText: {
    color: COLORS.primary,
  },
  ghostText: {
    color: "#6366F1",
  },
  destructiveText: {
    color: "#FFFFFF",
  },
  destructiveOutlineText: {
    color: COLORS.error,
  },
  successText: {
    color: "#FFFFFF",
  },

  // Text sizes
  smallText: {
    fontSize: 13,
    lineHeight: 18,
  },
  mediumText: {
    fontSize: 15,
    lineHeight: 20,
  },
  largeText: {
    fontSize: 17,
    lineHeight: 26,
  },
  xlText: {
    fontSize: 19,
    lineHeight: 28,
  },

  // Disabled states
  disabled: {
    opacity: 0.5,
    shadowOpacity: 0,
    elevation: 0,
  },
  primaryDisabled: {
    backgroundColor: "#CBD5E1",
    borderColor: "#CBD5E1",
  },
  secondaryDisabled: {
    backgroundColor: "#F8FAFC",
    borderColor: "#F1F5F9",
  },
  outlineDisabled: {
    borderColor: "#CBD5E1",
  },
  ghostDisabled: {
    backgroundColor: "transparent",
  },
  destructiveOutlineDisabled: {
    borderColor: "#FCA5A5",
  },
  destructiveDisabled: {
    backgroundColor: "#FCA5A5",
    borderColor: "#FCA5A5",
  },
  successDisabled: {
    backgroundColor: "#86EFAC",
    borderColor: "#86EFAC",
  },

  // Icon spacing
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
  loadingIcon: {
    marginRight: 8,
  },
})
