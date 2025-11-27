import React from 'react';
import { X, ShieldAlert } from 'lucide-react';

export default function AuthGuardModal({ isOpen, onClose, onContinue }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-red-600 p-4 flex justify-between items-center">
          <h3 className="text-white text-xl font-bold flex items-center gap-2">
            <ShieldAlert size={24} />
            Autenticación Requerida
          </h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition"
          >
            <X size={24} />
          </button>
        </div>
        <div className="p-6">
          <p className="text-gray-700 leading-relaxed mb-4 font-medium">
            Para realizar esta acción, necesitamos que inicies sesión.
          </p>
          <p className="text-gray-600 text-sm mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
            Esto es necesario para identificar a los usuarios, evitar spam y mantener la calidad del contenido. 
            Necesitamos saber quién sube cada aporte para moderar la comunidad y bloquear usuarios malintencionados si es necesario.
          </p>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              onClick={onContinue}
              className="flex-1 bg-red-600 text-white font-bold py-3 rounded-lg hover:bg-red-700 transition shadow-lg flex items-center justify-center gap-2"
            >
              Continuar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
