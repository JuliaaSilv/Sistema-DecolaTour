import { useState } from 'react';

const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'success', duration = 3000) => {
    const id = Date.now() + Math.random();
    const newToast = {
      id,
      message,
      type,
      duration,
      isVisible: true
    };

    setToasts(prev => [...prev, newToast]);

    // Auto remove após a duração especificada
    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  const showSuccess = (message, duration) => showToast(message, 'success', duration);
  const showError = (message, duration) => showToast(message, 'error', duration);
  const showWarning = (message, duration) => showToast(message, 'warning', duration);
  const showInfo = (message, duration) => showToast(message, 'info', duration);

  return {
    toasts,
    showToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    removeToast
  };
};

export default useToast;
