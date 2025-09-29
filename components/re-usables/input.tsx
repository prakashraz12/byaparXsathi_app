import { COLORS } from "@/constants/Colors";
import { AlertCircle } from "lucide-react-native";
import type React from "react";
import {
  Text,
  TextInput,
  View,
  type TextInputProps,
  type ViewStyle,
} from "react-native";

interface CustomInputProps extends Omit<TextInputProps, "style"> {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  error?: string;
  label?: string;
  disabled?: boolean;
  containerStyle?: ViewStyle;
  required?:boolean
}

const CustomInput: React.FC<CustomInputProps> = ({
  leftIcon,
  rightIcon,
  error,
  label,
  disabled = false,
  containerStyle,
  required= false,
  ...textInputProps
}) => {
  return (
    <View>
      {label && (
        <Text style={{ fontFamily: "Poppins-SemiBold", fontSize: 14, marginTop:10 }}>
          {label}{" "}{required ? <Text style={{color:"red"}}>*</Text> :""}
        </Text>
      )}
      <View
        style={[
          styles.inputContainer,
          error ? styles.inputError : {},
          containerStyle,
          !leftIcon && { paddingHorizontal: 14 },
        ]}
      >
        {leftIcon && <View style={styles.iconContainer}>{leftIcon}</View>}

        <TextInput
          style={styles.input}
          placeholderTextColor={COLORS.textLight}
          editable={!disabled}
          {...textInputProps}
        />

        {rightIcon && <View style={styles.iconContainer}>{rightIcon}</View>}
      </View>

      {error ? (
        <View style={styles.fieldErrorContainer}>
          <AlertCircle size={12} color="#FF4D4F" />
          <Text style={styles.fieldErrorText}>{error}</Text>
        </View>
      ) : null}
    </View>
  );
};

const styles = {
  inputContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 7,
    height: 59,
    marginBottom: 4,
  },
  inputError: {
    borderColor: COLORS.error,
    backgroundColor: "#FFF1F0",
  },
  iconContainer: {
    paddingHorizontal: 16,
    justifyContent: "center" as const,
    alignItems: "center" as const,
  },
  input: {
    flex: 1,
    height: 59,
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: COLORS.text,
  },
  fieldErrorContainer: {
    flexDirection: "row" as const,
    alignItems: "center" as const,
    marginBottom: 12,
    marginLeft: 4,
  },
  fieldErrorText: {
    fontFamily: "Poppins-Regular",
    fontSize: 14,
    color: "#FF4D4F",
    marginLeft: 4,
    marginTop: 2,
  },
};

export default CustomInput;
