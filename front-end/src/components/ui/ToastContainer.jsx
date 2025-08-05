import React from 'react';
import Toast from './Toast';

const ToastContainer = ({ toasts = [], onRemoveToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            animationDelay: `${index * 100}ms`
          }}
          className="animate-in slide-in-from-right duration-300"
        >
          <Toast
            message={toast.message}
            type={toast.type}
            isVisible={toast.isVisible}
            onClose={() => onRemoveToast(toast.id)}
            duration={0} // Controlado pelo hook
          />
        </div>
      ))}
    </div>
  );
};

export default ToastContainer;
