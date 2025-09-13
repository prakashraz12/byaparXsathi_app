
import type React from "react"
import { useState } from "react"
import { View, Text, StyleSheet, TouchableOpacity, Modal, FlatList, type ViewStyle, type TextStyle } from "react-native"
import { ChevronDown, Phone } from "lucide-react-native"
import CustomInput from "./input"

// Common country codes
const COUNTRY_CODES = [
  { code: "+1", country: "US", flag: "🇺🇸", name: "United States" },
  { code: "+1", country: "CA", flag: "🇨🇦", name: "Canada" },
  { code: "+44", country: "GB", flag: "🇬🇧", name: "United Kingdom" },
  { code: "+33", country: "FR", flag: "🇫🇷", name: "France" },
  { code: "+49", country: "DE", flag: "🇩🇪", name: "Germany" },
  { code: "+39", country: "IT", flag: "🇮🇹", name: "Italy" },
  { code: "+34", country: "ES", flag: "🇪🇸", name: "Spain" },
  { code: "+91", country: "IN", flag: "🇮🇳", name: "India" },
  { code: "+86", country: "CN", flag: "🇨🇳", name: "China" },
  { code: "+81", country: "JP", flag: "🇯🇵", name: "Japan" },
  { code: "+82", country: "KR", flag: "🇰🇷", name: "South Korea" },
  { code: "+61", country: "AU", flag: "🇦🇺", name: "Australia" },
  { code: "+55", country: "BR", flag: "🇧🇷", name: "Brazil" },
  { code: "+52", country: "MX", flag: "🇲🇽", name: "Mexico" },
  { code: "+7", country: "RU", flag: "🇷🇺", name: "Russia" },
]

export interface PhoneNumberInputProps extends Omit<CustomInputProps, "inputType" | "leftIcon"> {
  // Phone specific props
  defaultCountryCode?: string
  onCountryCodeChange?: (countryCode: string) => void
  onPhoneNumberChange?: (phoneNumber: string, countryCode: string) => void

  // Custom styles for country picker
  countryPickerStyle?: ViewStyle
  countryPickerTextStyle?: TextStyle
}

export const PhoneNumberInput: React.FC<PhoneNumberInputProps> = ({
  defaultCountryCode = "+1",
  onCountryCodeChange,
  onPhoneNumberChange,
  countryPickerStyle,
  countryPickerTextStyle,
  onChangeText,
  ...props
}) => {
  const [selectedCountryCode, setSelectedCountryCode] = useState(
    COUNTRY_CODES.find((c) => c.code === defaultCountryCode) || COUNTRY_CODES[0],
  )
  const [isPickerVisible, setIsPickerVisible] = useState(false)
  const [phoneNumber, setPhoneNumber] = useState("")

  const handleCountrySelect = (country: (typeof COUNTRY_CODES)[0]) => {
    setSelectedCountryCode(country)
    setIsPickerVisible(false)
    onCountryCodeChange?.(country.code)
    onPhoneNumberChange?.(phoneNumber, country.code)
  }

  const handlePhoneNumberChange = (text: string) => {
    // Format phone number (basic formatting)
    const cleaned = text.replace(/\D/g, "")
    let formatted = cleaned

    if (cleaned.length >= 6) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`
    } else if (cleaned.length >= 3) {
      formatted = `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`
    }

    setPhoneNumber(formatted)
    onChangeText?.(formatted)
    onPhoneNumberChange?.(formatted, selectedCountryCode.code)
  }

  const CountryPicker = () => (
    <TouchableOpacity style={[styles.countryPicker, countryPickerStyle]} onPress={() => setIsPickerVisible(true)}>
      <Text style={[styles.flag, countryPickerTextStyle]}>{selectedCountryCode.flag}</Text>
      <Text style={[styles.countryCode, countryPickerTextStyle]}>{selectedCountryCode.code}</Text>
      <ChevronDown size={16} color="#6B7280" />
    </TouchableOpacity>
  )

  return (
    <View>  
      <CustomInput
        {...props}
        leftIcon={<CountryPicker />}
        rightIcon={<Phone size={20} color="#6B7280" />}
        value={phoneNumber}
        onChangeText={handlePhoneNumberChange}
        placeholder="123-456-7890"
      />

      <Modal
        visible={isPickerVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsPickerVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Select Country</Text>
              <TouchableOpacity onPress={() => setIsPickerVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>✕</Text>
              </TouchableOpacity>
            </View>

            <FlatList
              data={COUNTRY_CODES}
              keyExtractor={(item, index) => `${item.country}-${index}`}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={[
                    styles.countryItem,
                    selectedCountryCode.code === item.code &&
                      selectedCountryCode.country === item.country &&
                      styles.selectedCountryItem,
                  ]}
                  onPress={() => handleCountrySelect(item)}
                >
                  <Text style={styles.countryFlag}>{item.flag}</Text>
                  <View style={styles.countryInfo}>
                    <Text style={styles.countryName}>{item.name}</Text>
                    <Text style={styles.countryCodeText}>{item.code}</Text>
                  </View>
                </TouchableOpacity>
              )}
            />
          </View>
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  countryPicker: {
    flexDirection: "row",
    alignItems: "center",
    paddingRight: 8,
    borderRightWidth: 1,
    borderRightColor: "#E5E7EB",
    marginRight: 8,
  },

  flag: {
    fontSize: 18,
    marginRight: 4,
  },

  countryCode: {
    fontSize: 16,
    fontWeight: "500",
    color: "#374151",
    marginRight: 4,
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "flex-end",
  },

  modalContent: {
    backgroundColor: "#FFFFFF",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "70%",
  },

  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },

  modalTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#111827",
  },

  closeButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },

  closeButtonText: {
    fontSize: 16,
    color: "#6B7280",
  },

  countryItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F3F4F6",
  },

  selectedCountryItem: {
    backgroundColor: "#EFF6FF",
  },

  countryFlag: {
    fontSize: 24,
    marginRight: 12,
  },

  countryInfo: {
    flex: 1,
  },

  countryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#111827",
  },

  countryCodeText: {
    fontSize: 14,
    color: "#6B7280",
    marginTop: 2,
  },
})
