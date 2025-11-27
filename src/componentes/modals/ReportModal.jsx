import React from "react";
import { AlertTriangle, X } from "lucide-react";

export default function ReportModal({ onClose, onConfirm }) {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Cabecera de advertencia */}
        <div className="bg-red-50 p-6 text-center border-b border-red-100">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={32} className="text-red-600" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            ¿Reportar contenido?
          </h3>
          <p className="text-sm text-gray-600">
            Ayúdanos a mantener la comunidad segura y veraz.
          </p>
        </div>

        {/* Cuerpo del mensaje */}
        <div className="p-6 space-y-4">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-xs text-yellow-800 font-semibold mb-1">
              ADVERTENCIA IMPORTANTE:
            </p>
            <p className="text-xs text-yellow-700">
              El uso indebido de esta función (reportes falsos o spam) resultará en el 
              <span className="font-bold"> bloqueo permanente</span> de tu cuenta.
            </p>
          </div>
          
          <p className="text-sm text-gray-600 text-center">
            ¿Estás seguro de que este contenido viola nuestras normas?
          </p>

          <div className="flex gap-3 pt-2">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-100 text-gray-700 font-bold py-3 rounded-xl hover:bg-gray-200 transition active:scale-95"
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 bg-red-600 text-white font-bold py-3 rounded-xl hover:bg-red-700 transition shadow-lg active:scale-95"
            >
              Sí, Reportar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
