import { ToastConfig } from './custom-toaster-types';

class ToastService {
  private listeners: Array<(config: Omit<ToastConfig, 'id'>) => void> = [];

  // Subscribe to toast events
  subscribe(callback: (config: Omit<ToastConfig, 'id'>) => void) {
    this.listeners.push(callback);

    // Return unsubscribe function
    return () => {
      const index = this.listeners.indexOf(callback);
      if (index > -1) {
        this.listeners.splice(index, 1);
      }
    };
  }

  // Emit toast to all listeners
  private emit(config: Omit<ToastConfig, 'id'>) {
    this.listeners.forEach((listener) => listener(config));
  }

  // Public methods that can be called from anywhere
  show(config: Omit<ToastConfig, 'id'>) {
    this.emit(config);
  }

  success(title: string, message?: string, duration?: number) {
    this.emit({ type: 'success', title, message, duration });
  }

  error(title: string, message?: string, duration?: number) {
    this.emit({ type: 'error', title, message, duration });
  }

  warning(title: string, message?: string, duration?: number) {
    this.emit({ type: 'warning', title, message, duration });
  }

  info(title: string, message?: string, duration?: number) {
    this.emit({ type: 'info', title, message, duration });
  }
}

// Export a singleton instance
export const Toast = new ToastService();
