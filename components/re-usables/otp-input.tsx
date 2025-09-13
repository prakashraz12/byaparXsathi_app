
import { useEffect, useImperativeHandle, useRef, useState } from "react"
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native"

interface OTPInputProps {
  length?: 4 | 6
  onComplete?: (otp: string) => void
  onChange?: (otp: string) => void
  autoFocus?: boolean
  secureTextEntry?: boolean
  placeholder?: string
  style?: any
  inputStyle?: any
  focusedInputStyle?: any
  errorMessage?: string
  disabled?: boolean
  clearOtp?: () => void
  otp: string[]
  setOtp: (otp: string[]) => void
}

const OTPInput = ({
  length = 6,
  onComplete,
  onChange,
  autoFocus = true,
  secureTextEntry = false,
  placeholder = "",
  style,
  inputStyle,
  focusedInputStyle,
  errorMessage,
  disabled = false,
  otp,
  setOtp,
}: OTPInputProps) => {
  
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const inputRefs = useRef<(TextInput | null)[]>([]);
  useEffect(() => {
    if (autoFocus && inputRefs.current[0]) {
      inputRefs.current[0].focus()
    }
  }, [autoFocus])

  const handleChangeText = (text: string, index: number) => {
    if (disabled) return

    // Handle paste operation
    if (text.length > 1) {
      const pastedText = text.slice(0, length)
      const newOtp = [...otp]

      for (let i = 0; i < pastedText.length && i < length; i++) {
        newOtp[i] = pastedText[i]
      }

      setOtp?.(newOtp)
      onChange?.(newOtp.join(""))

      if (newOtp.join("").length === length + 1) {
        onComplete?.(newOtp.join(""))
        inputRefs.current[length - 1]?.blur()
      } else {
        const nextIndex = Math.min(pastedText.length, length - 1)
        inputRefs.current[nextIndex]?.focus()
      }
      return
    }

    // Handle single character input
    const newOtp = [...otp]
    newOtp[index] = text
    setOtp(newOtp)
    onChange?.(newOtp.join(""))

    // Auto-focus next input if there's text and not the last input
    if (text) {
      if (index < length - 1) {
        inputRefs.current[index + 1]?.focus()
      }
      // Check if OTP is complete after state update
      const isComplete = newOtp.every(digit => digit.trim() !== '');
      console.log(isComplete)
      if (isComplete) {
        onComplete?.(newOtp.join(""))
        // Don't blur immediately to ensure the last digit is properly set
      }
    }
  }

  const handleKeyPress = (e: any, index: number) => {
    if (disabled) return

    if (e.nativeEvent.key === "Backspace") {
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp]
        newOtp[index] = ""
        setOtp(newOtp)
        onChange?.(newOtp.join(""))
      } else if (index > 0) {
        // Move to previous input and clear it
        const newOtp = [...otp]
        newOtp[index - 1] = ""
        setOtp(newOtp)
        onChange?.(newOtp.join(""))
        inputRefs.current[index - 1]?.focus()
      }
    }
  }

  const handleFocus = (index: number) => {
    setFocusedIndex(index)
  }

  const handleBlur = () => {
    setFocusedIndex(-1)
  }

  const handleInputPress = (index: number) => {
    if (disabled) return
    inputRefs.current[index]?.focus()
  }

 
  return (
    <View style={[styles.container, style]}>
      <View style={styles.inputContainer}>
        {otp?.map((digit, index) => (
          <Pressable
            key={index}
            onPress={() => handleInputPress(index)}
            style={[
              styles.inputWrapper,
              focusedIndex === index && styles.focusedWrapper,
              errorMessage && styles.errorWrapper,
            ]}
          >
            <TextInput
              ref={(ref) => {if(ref){inputRefs.current[index] = ref}}}
              style={[
                styles.input,
                inputStyle,
                focusedIndex === index && [styles.focusedInput, focusedInputStyle],
                errorMessage && styles.errorInput,
                disabled && styles.disabledInput,
              ]}
              value={digit}
              onChangeText={(text) => handleChangeText(text, index)}
              onKeyPress={(e) => handleKeyPress(e, index)}
              onFocus={() => handleFocus(index)}
              onBlur={handleBlur}
              keyboardType="numeric"
              maxLength={index === 0 ? length :1}
              selectTextOnFocus
              secureTextEntry={secureTextEntry}
              placeholder={placeholder}
              placeholderTextColor="#999"
              editable={!disabled}
              accessible={true}
              accessibilityLabel={`OTP digit ${index + 1} of ${length}`}
              accessibilityHint={`Enter digit ${index + 1} of your ${length}-digit verification code`}
            />
          </Pressable>
        ))}
      </View>

      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}

    </View>
  )
}

export default OTPInput;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
  },
  inputContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  inputWrapper: {
    borderWidth: 1,
    borderColor: "#E5E7EB",
    borderRadius: 12,
    backgroundColor: "#FFFFFF",
  },
  focusedWrapper: {
    borderColor: "#3B82F6",
    backgroundColor: "#F8FAFC",
  },
  errorWrapper: {
    borderColor: "#EF4444",
  },
  input: {
    width: 56,
    height: 56,
    fontSize: 16,
    fontFamily: "Poppins-Regular",
    textAlign: "center",
    color: "#1F2937",
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  focusedInput: {
    color: "#3B82F6",
  },
  errorInput: {
    color: "#EF4444",
  },
  disabledInput: {
    color: "#9CA3AF",
    backgroundColor: "#F3F4F6",
  },
  errorText: {
    color: "#EF4444",
    fontSize: 14,
    marginTop: 8,
    textAlign: "center",
  },
  clearButton: {
    marginTop: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  clearButtonText: {
    color: "#6B7280",
    fontSize: 14,
    fontWeight: "500",
  },
})
