import React from 'react';
import { CheckCircle, X, AlertTriangle, Info } from 'lucide-react';

export default function AlertModal({ 
  show, 
  onClose, 
  type = 'info', 
  title, 
  message,
  buttonText = 'Entendido'
}) {
  if (!show) return null;

  const configs = {
    success: {
      icon: CheckCircle,
      bgColor: 'bg-green-100',
      iconColor: 'text-green-600',
      buttonColor: 'bg-green-600 hover:bg-green-700'
    },
    error: {
      icon: X,
      bgColor: 'bg-red-100',
      iconColor: 'text-red-600',
      buttonColor: 'bg-red-600 hover:bg-red-700'
    },
    warning: {
      icon: AlertTriangle,
      bgColor: 'bg-orange-100',
      iconColor: 'text-orange-600',
      buttonColor: 'bg-orange-600 hover:bg-orange-700'
    },
    info: {
      icon: Info,
      bgColor: 'bg-blue-100',
      iconColor: 'text-blue-600',
      buttonColor: 'bg-blue-600 hover:bg-blue-700'
    }
  };

  const config = configs[type];
  const Icon = config.icon;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="p-6 text-center">
          <div className={`w-16 h-16 ${config.bgColor} rounded-full flex items-center justify-center mx-auto mb-4`}>
            <Icon size={32} className={config.iconColor} />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-500 mb-6">{message}</p>
          <button
            onClick={onClose}
            className={`w-full ${config.buttonColor} text-white font-bold py-3 rounded-xl transition shadow-lg`}
          >
            {buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}
