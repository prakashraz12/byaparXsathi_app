import { useRef, useEffect } from "react";
import {
  View,
  Modal,
  TouchableOpacity,
  Animated,
  StyleSheet,
  Platform,
  StatusBar,
  ActivityIndicator,
} from "react-native";
import { AlertTriangle } from "lucide-react-native";
import { Text } from "../text";

interface AlertModalProps {
  visible: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: "warning" | "danger" | "info";
  icon?: React.ReactNode;
  isLoading?: boolean;
}

const AlertModal = ({
  visible,
  title = "Confirm Action",
  isLoading = false,
  message,
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
  type = "warning",
  icon,
}: AlertModalProps) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(scaleAnim, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(scaleAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 200,
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [visible]);

  const getTypeColor = (isLoading: boolean) => {
    switch (type) {
      case "danger":
        return isLoading ? "#fecaca" : "#ef4444";
      case "info":
        return isLoading ? "#bfdbfe" : "#3b82f6";
      case "warning":
      default:
        return isLoading ? "#fde68a" : "#f59e0b";
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  const handleCancel = () => {
    onCancel();
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <Animated.View style={[styles.backdrop, { opacity: fadeAnim }]}>
          <TouchableOpacity
            disabled={isLoading}
            style={styles.backdropTouchable}
            activeOpacity={1}
            onPress={onCancel}
          />
        </Animated.View>

        <Animated.View
          style={[
            styles.modalContainer,
            {
              transform: [{ scale: scaleAnim }],
              opacity: fadeAnim,
            },
          ]}
        >
          <View style={styles.modalContent}>
            {/* Icon */}
            <View
              style={[
                styles.iconContainer,
                { backgroundColor: `${getTypeColor(isLoading)}15` },
              ]}
            >
              {icon || <AlertTriangle size={32} color={getTypeColor(isLoading)} />}
            </View>

            {/* Title */}
            <Text style={styles.title}>{title}</Text>

            {/* Message */}
            <Text style={styles.message}>{message}</Text>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                disabled={isLoading}
                style={[styles.button, styles.cancelButton]}
                onPress={handleCancel}
                activeOpacity={0.7}
              >
                <Text style={styles.cancelButtonText}>{cancelText}</Text>
              </TouchableOpacity>

              <TouchableOpacity
                disabled={isLoading}
                style={[
                  styles.button,
                  styles.confirmButton,
                  { backgroundColor: getTypeColor(isLoading) },
                ]}
                onPress={handleConfirm}
                activeOpacity={0.7}
              >
                <Text style={styles.confirmButtonText}>
                  {isLoading ? (
                    <>
                      <ActivityIndicator size={22} color={"white"} />
                    </>
                  ) : (
                    confirmText
                  )}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  backdropTouchable: {
    width: "100%",
    height: "100%",
  },
  modalContainer: {
    width: "85%",
    maxWidth: 400,
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 20,
    padding: 24,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 10,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    color: "#1f2937",
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: 15,
    color: "#6b7280",
    textAlign: "center",
    marginBottom: 24,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: "row",
    width: "100%",
    gap: 12,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  cancelButton: {
    backgroundColor: "#f3f4f6",
  },
  confirmButton: {
    backgroundColor: "#ef4444",
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#4b5563",
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "white",
  },
});

export default AlertModal;

// USAGE EXAMPLE:
/*
import { useState } from 'react';
import AlertModal from './components/AlertModal';
import { Trash2 } from 'lucide-react-native';

const YourComponent = () => {
    const [showAlert, setShowAlert] = useState(false);

    const handleDelete = () => {
        // Your delete logic here
        console.log('Item deleted');
        setShowAlert(false);
    };

    return (
        <>
            <Button onPress={() => setShowAlert(true)}>
                Delete Item
            </Button>

            <AlertModal
                visible={showAlert}
                title="Delete Item"
                message="Are you sure you want to delete this item? This action cannot be undone."
                confirmText="Yes, Delete"
                cancelText="Cancel"
                type="danger"
                icon={<Trash2 size={32} color="#ef4444" />}
                onConfirm={handleDelete}
                onCancel={() => setShowAlert(false)}
            />
        </>
    );
};

// More examples:

// Warning Alert
<AlertModal
    visible={showAlert}
    title="Warning"
    message="This action requires your attention."
    type="warning"
    onConfirm={() => console.log('Confirmed')}
    onCancel={() => setShowAlert(false)}
/>

// Info Alert
<AlertModal
    visible={showAlert}
    title="Information"
    message="Please review the details before proceeding."
    confirmText="Okay"
    cancelText="Go Back"
    type="info"
    onConfirm={() => console.log('Confirmed')}
    onCancel={() => setShowAlert(false)}
/>
*/
