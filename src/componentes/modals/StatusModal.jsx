import React from 'react';
import { CheckCircle, AlertTriangle, Loader2, X } from 'lucide-react';

export default function StatusModal({ type, title, message, onClose, autoClose = false }) {
  // Configuración según el tipo
  const config = {
    loading: {
      icon: <Loader2 size={48} className="text-blue-600 animate-spin" />,
      bgColor: "bg-blue-100",
      textColor: "text-blue-800",
      borderColor: "border-blue-200"
    },
    success: {
      icon: <CheckCircle size={48} className="text-green-600" />,
      bgColor: "bg-green-100",
      textColor: "text-green-800",
      borderColor: "border-green-200"
    },
    error: {
      icon: <AlertTriangle size={48} className="text-red-600" />,
      bgColor: "bg-red-100",
      textColor: "text-red-800",
      borderColor: "border-red-200"
    }
  };

  const currentConfig = config[type] || config.loading;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="p-8 flex flex-col items-center text-center">
          <div className={`w-20 h-20 ${currentConfig.bgColor} rounded-full flex items-center justify-center mb-6`}>
            {currentConfig.icon}
          </div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-2">
            {title}
          </h3>
          
          <p className="text-gray-600 mb-8">
            {message}
          </p>

          {type !== 'loading' && (
            <button
              onClick={onClose}
              className={`w-full ${type === 'error' ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white font-bold py-3 rounded-xl transition shadow-lg active:scale-95`}
            >
              {type === 'error' ? 'Cerrar' : 'Continuar'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
