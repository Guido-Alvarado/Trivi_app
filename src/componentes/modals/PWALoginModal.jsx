import React from "react";
import { X, ExternalLink } from "lucide-react";

export default function PWALoginModal({ onClose }) {
  const handleGoToWeb = () => {
    // URL de la página web (ajusta según tu dominio)
    const webUrl = import.meta.env.MODE === 'production' 
      ? 'https://guido-alvarado.github.io/Trivi_app/' 
      : 'http://localhost:5173/';
    
    // Abrir en navegador externo
    window.open(webUrl, '_blank');
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-4 flex justify-between items-center">
          <h3 className="text-white text-xl font-bold">Iniciar Sesión</h3>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-full p-1 transition"
          >
            <X size={24} />
          </button>
        </div>
        
        <div className="p-6">
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6">
            <p className="text-gray-800 font-medium mb-2">
              Para iniciar sesión desde la app instalada:
            </p>
            <ol className="text-gray-700 text-sm space-y-2 list-decimal list-inside">
              <li>Presiona el botón "Ir a la Web"</li>
              <li>Inicia sesión en el navegador</li>
              <li>Vuelve a esta app</li>
              <li>¡Estarás automáticamente logueado! 🎉</li>
            </ol>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6">
            <p className="text-yellow-800 text-sm">
              <strong>Nota:</strong> Tu sesión se sincronizará automáticamente entre la web y la app instalada.
            </p>
          </div>
          
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 font-bold py-3 rounded-lg hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              onClick={handleGoToWeb}
              className="flex-1 bg-blue-600 text-white font-bold py-3 rounded-lg hover:bg-blue-700 transition shadow-lg flex items-center justify-center gap-2"
            >
              <ExternalLink size={20} />
              Ir a la Web
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
