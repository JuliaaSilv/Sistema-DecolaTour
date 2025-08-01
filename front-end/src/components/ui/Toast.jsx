import React, { useState, useEffect } from 'react';
import { CheckCircle, AlertCircle, XCircle, X, Info } from 'lucide-react';

const Toast = ({ message, type = 'success', isVisible, onClose, duration = 3000 }) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  if (!isVisible) return null;

  const getToastStyles = () => {
    switch (type) {
      case 'success':
        return {
          bgColor: 'bg-green-50 border-green-200',
          textColor: 'text-green-800',
          iconColor: 'text-green-600',
          icon: CheckCircle
        };
      case 'error':
        return {
          bgColor: 'bg-red-50 border-red-200',
          textColor: 'text-red-800',
          iconColor: 'text-red-600',
          icon: XCircle
        };
      case 'warning':
        return {
          bgColor: 'bg-yellow-50 border-yellow-200',
          textColor: 'text-yellow-800',
          iconColor: 'text-yellow-600',
          icon: AlertCircle
        };
      case 'info':
        return {
          bgColor: 'bg-blue-50 border-blue-200',
          textColor: 'text-blue-800',
          iconColor: 'text-blue-600',
          icon: Info
        };
      default:
        return {
          bgColor: 'bg-gray-50 border-gray-200',
          textColor: 'text-gray-800',
          iconColor: 'text-gray-600',
          icon: Info
        };
    }
  };

  const { bgColor, textColor, iconColor, icon: Icon } = getToastStyles();

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right duration-300">
      <div className={`${bgColor} border rounded-lg shadow-lg p-4 min-w-80 max-w-md`}>
        <div className="flex items-start gap-3">
          <Icon className={`w-5 h-5 ${iconColor} flex-shrink-0 mt-0.5`} />
          <div className="flex-1">
            <p className={`${textColor} text-sm font-medium`}>
              {message}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`${textColor} hover:opacity-70 transition-opacity flex-shrink-0`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Toast;
