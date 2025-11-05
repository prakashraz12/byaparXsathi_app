import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import { View, StyleSheet, Modal } from "react-native";
import { ToastConfig, ToastContextType } from "./custom-toaster-types";
import { ToastItem } from "./custom-toast-item";
import { Toast } from "./toast-service";

const ToastContext = createContext<ToastContextType | undefined>(undefined);

interface ToastProviderProps {
  children: React.ReactNode;
  maxToasts?: number;
}

export const ToastProvider: React.FC<ToastProviderProps> = ({
  children,
  maxToasts = 3,
}) => {
  const [toasts, setToasts] = useState<ToastConfig[]>([]);

  const showToast = useCallback(
    (config: Omit<ToastConfig, "id">) => {
      const id =
        Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const newToast: ToastConfig = {
        ...config,
        id,
        duration: config.duration ?? 2000,
      };

      setToasts((prevToasts) => {
        const updatedToasts = [newToast, ...prevToasts];
        return updatedToasts.slice(0, maxToasts);
      });
    },
    [maxToasts],
  );

  const hideToast = useCallback((id: string) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Subscribe to the Toast service
  useEffect(() => {
    const unsubscribe = Toast.subscribe(showToast);
    return unsubscribe;
  }, [showToast]);

  const contextValue: ToastContextType = {
    showToast,
    hideToast,
    hideAllToasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}
      <Modal
        visible={toasts.length > 0}
        transparent
        hardwareAccelerated
        animationType="fade"
        statusBarTranslucent
        onRequestClose={() => {}}
      >
        <View style={styles.container} pointerEvents="box-none">
          {toasts.map((toast) => (
            <ToastItem
              key={toast.id}
              toast={toast}
              onHide={() => hideToast(toast?.id)}
            />
          ))}
        </View>
      </Modal>
    </ToastContext.Provider>
  );
};

export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 60,
    left: 16,
    right: 16,
  },
});
