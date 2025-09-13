import { View, TouchableOpacity, Image, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { BANNER_LOGO } from "@/assets"
import { Text } from "@/components/re-usables/text"

const DashboardScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        {/* Avatar */}
        <TouchableOpacity style={styles.avatarButton}>
          <Ionicons name="person" size={20} color="#6B7280" />
          <Text variant="h6" style={{ color: "#6B7280" }}>Profile</Text>
        </TouchableOpacity>

        {/* Notification Button */}
        <TouchableOpacity style={styles.notificationButton}>
          <Ionicons name="notifications" size={20} color="#374151" />
        </TouchableOpacity>
      </View>

      <View style={styles.logoContainer}>
        <Image source={BANNER_LOGO} style={styles.bannerLogo} resizeMode="contain" />
      </View>

      <View style={styles.bottomRow}>{/* Additional content can go here */}</View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
    backgroundColor: "#FFFFFF",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 16,
  },
  avatarButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#E5E7EB",
    justifyContent: "center",
    alignItems: "center",
  },
  notificationButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
  },
  logoContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 24,
  },
  bannerLogo: {
    width: 150,
    height: 90,
  },
  bottomRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 24,
    marginTop: 24,
  },
})

export default DashboardScreen
